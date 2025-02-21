import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import OpenAI from 'openai';
import { getCodingPrompt } from 'src/prompt';
import { codingPrompt, systemPrompt } from 'src/prompt/codingPrompt';
import { stripIndents } from 'src/stirpend';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { CreateAgentModelDto } from './dto/create-agent-model.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HelperService } from 'src/core/helper/helper.service';
import { log } from 'util';
import { codeGenerationAgent, pageStructurePrompt,  userComponentSelectionAgent,  uiRequirementAgent, componentStrucutreAgent, userDescriptionPrompt } from 'src/prompt/agentsPrompts';
import { json } from 'express';


@Injectable()
export class AgentModelService {
  private openai: OpenAI;
  private genAI: GoogleGenerativeAI;

  constructor(private readonly helperService:HelperService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,



    })

   
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    
    // const memKey = process.env.MEM0_API_KEY;
    // if(!memKey){
    //   throw new Error('MEM0_API_KEY is not defined in the environment variables.');
    // }

  }

 







  public folderStructureSchema = z.object({}).catchall(
    z.union([
      z.string(), // For file content
      z.object({}).catchall(
        z.union([
          z.string(), // For nested file content
          z.object({}).catchall(z.string()), // For deeply nested folders/files
        ])
      ),
    ])
  );


  public generateCode = z.object({
    framework: z.string(),
    code: this.folderStructureSchema,
    otherResponse: z.string()
  }).strict();



  public generateCodeForImage = z.object({
    code: z.string(),
    otherResponse: z.string()
  }).strict();








  async generateCodeResponse(data: CreateAgentModelDto) {
    try {
//       let promptDescOutput= null
//       let getPromptDescription = `
// ### **Frontend UI & Layout Requirement Assistant**  

// #### **<OBJECTIVE_AND_PERSONA>**  
// You are a **Frontend UI/UX Specialist Assistant**. Your task is to understand the ${data.prompt} and generate a **Frontend Layout & UI Specification Document**, detailing the website’s structure, page components, and UI styling.

// ---

// ### **<INSTRUCTIONS>**  
// To complete the task, follow these steps:  
// 1. **Understand Page Structure** – Identify the key pages and their purpose.  
// 2. **Define Layout & Information Hierarchy** – Organize content sections logically.  
// 3. **Specify UI Components & Interactions** – Define buttons, cards, modals, etc.  
// 4. **Create a User Flow Diagram** – Show how users navigate through the site.  
// 5. **Provide a Design Brief** – Specify styles, colors, typography, and spacing.  
// 6. **Ensure Responsiveness** – Define how the layout adapts for desktop, tablet, and mobile views.  
// 7. **Charts** - Suggest to use recharts library
      
//       `;

      // const modelDescription  = this.genAI.getGenerativeModel({model:process.env.GEMINI_MODEL_THINK})
      // const promptDesctiption = await modelDescription.generateContent([
      //   getPromptDescription
      // ])
      // promptDescOutput = promptDesctiption.response.text();



      
      const systemPrompt = codingPrompt;
      let getDescriptionPrompt = `Describe the attached screenshot in detail. I will send what you give me to a developer to recreate the original screenshot of a website that I sent you. Please listen very carefully. It's very important for my job that you follow these instructions:
      
    - Think step by step and describe the UI in great detail.
    - Make sure to describe where everything is in the UI so the developer can recreate it and if how elements are aligned
    - Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
    - Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
    - Make sure to use the exact text from the screenshot.
    `;
     
    let descpOutput = null;

      if (data.imageURl) {
        const base64Image = this.helperService.processBase64(data.imageURl);
          const model = this.genAI.getGenerativeModel({model:process.env.GEMINI_MODEL_THINK})
          const imgDescription = await model.generateContent([
            getDescriptionPrompt,
            {inlineData:{data:base64Image,mimeType:'image/jpeg'}}
          ])
          descpOutput = imgDescription.response.text();
          console.log('OUTPUT FROM GEMINI ---------');
          
          console.log(descpOutput);
          

      } 


      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data.prompt  },
      ];


      if (data.imageURl) {
        messages.push({ role: 'assistant', content: data.imageURl });
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.2,
        max_tokens: 10000,
      });

      let content = response.choices[0].message.content;

      // if (this.client) {
      //   try {
      //     await this.client.add(userPrompt, { user_id: "alex" });

      //     console.log("Successfully added response to mem0.");
      //   } catch (mem0Error) {
      //     console.error("Error adding to mem0:", mem0Error);
      //     console.warn("Continuing without mem0 due to an error.");
      //   }
      // } else {
      //   console.warn("mem0 client is not initialized. Skipping mem0 add.");
      // }

      // const cleanedContent = content.replace(/(\r\n|\n|\r)/gm, " ");
      const cleanedContent = this.helperService.cleanAndEscapeCode(content)
      // const cleanedContent = stripIndents(content);
      // console.log('Cleaned JSON content:', cleanedContent);

      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error("Invalid JSON format received from OpenAI");
      }

      return {
        framework: parsedContent.framework,
        code: parsedContent.code,
        otherResponse: parsedContent.otherResponse,
      };
    } catch (err) {
      console.error(err, "--------------------");
      throw err;
    }
  }


  async runAgent(
    agentName: string,
    
    agentPrompt: string,
    userInput?: string | object,
    model: string = "o3-mini-2025-01-31",
    systemPromptAddition?: string
  ): Promise<string> {
    try {
      const userInputStr = typeof userInput === "object" ? JSON.stringify(userInput) : userInput;
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: agentPrompt },
        { role: "user", content: userInputStr },
      ];

      const completion = await this.openai.chat.completions.create({
        model,
        messages,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0].message.content;
      if (!response) return JSON.stringify({ error: `Agent ${agentName} returned an empty response.` });

      try {
        JSON.parse(response);
      } catch (e: any) {
        return JSON.stringify({ error: `Agent ${agentName} returned invalid JSON: ${e.message}`, raw_response: response });
      }

      return response;
    } catch (e: any) {
      return JSON.stringify({ error: `Agent ${agentName} failed: ${e.message}` });
    }
  }


  async getProjectTemplate(): Promise<Record<string, string>> {
    try {
      const template = {
        "package.json": `{
          "name": "crm-landing-page",
          "version": "1.0.0",
          "private": true,
          "dependencies": {
            "react": "^17.0.2",
            "react-dom": "^17.0.2",
            "react-router-dom": "^5.2.0",
            "tailwindcss": "^2.2.19",
            "lucide-react": "^0.1.0",
            "recharts": "^2.1.9"
          },
          "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test",
            "eject": "react-scripts eject"
          }
        }`,
        "public/index.html": `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CRM Landing Page</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body class="bg-gray-100 font-roboto">
            <div id="root"></div>
        </body>
        </html>`,
        "src/index.js": `import React from 'react';
        import ReactDOM from 'react-dom';
        import { BrowserRouter } from 'react-router-dom';
        import App from './App';
        
        ReactDOM.render(
          <BrowserRouter>
            <App />
          </BrowserRouter>,
          document.getElementById('root')
        );`,
        "src/App.js": `import React from 'react';
        import HomePage from './components/pages/HomePage';
        
        const App = () => {
          return (
            <div>
              <HomePage />
            </div>
          );
        };
        
        export default App;`,
        "src/components/pages/HomePage.js": `import React from 'react';
        import HeroSection from '../sections/HeroSection';
        import FeaturesSection from '../sections/FeaturesSection';
        import TestimonialsSection from '../sections/TestimonialsSection';
        import Footer from '../sections/Footer';
        
        const HomePage = () => {
          return (
            <div>
              <HeroSection />
              <FeaturesSection />
              <TestimonialsSection />
              <Footer />
            </div>
          );
        };
        
        export default HomePage;`,
        "src/components/sections/HeroSection.js": `import React from 'react';
        import { Lucide } from 'lucide-react';
        
        const HeroSection = () => {
          return (
            <div className="bg-blue-600 text-white py-20 text-center">
              <h1 className="text-5xl font-bold mb-4">Transform Your Customer Relationships</h1>
              <p className="text-lg mb-8">Manage your customers effectively with our CRM system.</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold">Get Started</button>
            </div>
          );
        };
        
        export default HeroSection;`,
        "src/components/sections/FeaturesSection.js": `import React from 'react';
        
        const FeaturesSection = () => {
          return (
            <div className="py-20 bg-white text-center">
              <h2 className="text-3xl font-bold mb-8">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 border rounded-lg shadow-lg">
                  <h3 className="font-semibold text-xl mb-4">User-Friendly Interface</h3>
                  <p>Easy navigation and intuitive design for all users.</p>
                </div>
                <div className="p-6 border rounded-lg shadow-lg">
                  <h3 className="font-semibold text-xl mb-4">Real-Time Analytics</h3>
                  <p>Get insights and reports in real-time.</p>
                </div>
                <div className="p-6 border rounded-lg shadow-lg">
                  <h3 className="font-semibold text-xl mb-4">24/7 Support</h3>
                  <p>Our team is here to help you anytime.</p>
                </div>
              </div>
            </div>
          );
        };
        
        export default FeaturesSection;`,
        "src/components/sections/TestimonialsSection.js": `import React from 'react';
        
        const TestimonialsSection = () => {
          return (
            <div className="py-20 bg-gray-100 text-center">
              <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="p-6 border rounded-lg shadow-lg">
                  <p className="italic">"This CRM has changed the way we manage our customers!"</p>
                  <p className="font-semibold">- John Doe</p>
                </div>
                <div className="p-6 border rounded-lg shadow-lg">
                  <p className="italic">"Incredible features and amazing support!"</p>
                  <p className="font-semibold">- Jane Smith</p>
                </div>
              </div>
            </div>
          );
        };
        
        export default TestimonialsSection;`,
        "src/components/sections/Footer.js": `import React from 'react';
        
        const Footer = () => {
          return (
            <div className="py-4 bg-blue-600 text-white text-center">
              <p>© 2023 CRM System. All rights reserved.</p>
            </div>
          );
        };
        
        export default Footer;`
      };
  
      return template;
    } catch (error) {
      console.error("Error generating project template:", error);
      throw new Error("Failed to generate project template.");
    }
  }
  


 

// async generatedAgenticResponse(data: CreateAgentModelDto){

// try{


    

//   const uiRequirementsJson = await this.runAgent(
//     "User Interface Requirements Agent",
//     userRequirementAgent,
//     data.prompt
//   );

//   if (this.helperService.isAgentError(uiRequirementsJson)) {
//     return JSON.stringify({ error: `User Interface Requirements Agent failed: ${uiRequirementsJson.error}` });
//   }

//   console.log(uiRequirementsJson, "UIREQUIREMENTS");
  

//   const uiComponentMappingJson = await this.runAgent(
//     "UI Components Selection Agent",
//     userComponentSelectionAgent,
//     uiRequirementsJson
//   );
//   console.log(uiComponentMappingJson, "UI CONPONENT REQUIREMENTS");

//   if (this.helperService.isAgentError(uiComponentMappingJson)) {
//     return JSON.stringify({ error: `User Components Selection Agent failed: ${uiComponentMappingJson.error}` });
//   }

//   const componentStrucutredJson = await this.runAgent(
//     "Components Structure Agent",
//     componentStrucutreAgent,
//     uiComponentMappingJson
//   );
//   console.log(componentStrucutredJson, "component structure json");


//   if (this.helperService.isAgentError(componentStrucutredJson)) {
//     return JSON.stringify({ error: `UI Components structured Agent failed: ${componentStrucutredJson.error}` });
//   }

//   // const dataGenerationJson = await this.runAgent(
//   //   "Data Generation Agent Prompt",
//   //   dataGenerationAgent,
//   //   componentStrucutredJson
//   // );
//   // console.log(dataGenerationJson, "Data Generation Agent Prompt");


//   // if (this.helperService.isAgentError(dataGenerationJson)) {
//   //   return JSON.stringify({ error: `UI Components structured Agent failed: ${dataGenerationJson.error}` });
//   // }


//   const generatedCodeJson = await this.runAgent(
//     "Code Generation Agent",
//     codeGenerationAgent,
//     {componentStrucutredJson,uiComponentMappingJson},
//     systemPrompt
//   );
 
//   if (this.helperService.isAgentError(generatedCodeJson)) {
//     return JSON.stringify({ error: ` Code Generating Agent failed: ${generatedCodeJson.error}` });
//   }


// const parsedContent = JSON.parse(generatedCodeJson)


//   return {
//     uiRequirementsJson: uiRequirementsJson,
//     uiComponentMappingJson: uiComponentMappingJson,
//     componentStrucutredJson: componentStrucutredJson,
//     code: parsedContent.code,
//     otherResponse: parsedContent.otherResponse,
    
//   };
// }
// catch(err){
//   console.log(err, "ERROR");
  
// }

// }

async generatedAgenticResponse(data: CreateAgentModelDto){

  try{


    const userDescriptionJson = await this.runAgent(
        "User Prompt Description Agent",
        userDescriptionPrompt,
        data.prompt,
        

    )
    const RequirementsUnderstandJson = await this.runAgent(
      "User Interface Requirements Agent",
      uiRequirementAgent,
      userDescriptionJson
    );

    if (this.helperService.isAgentError(RequirementsUnderstandJson)) {
      return JSON.stringify({ error: `User Interface Requirements Agent failed: ${RequirementsUnderstandJson.error}` });
    }

    console.log(RequirementsUnderstandJson, "UIREQUIREMENTS");



    //   const pageStructureanalysis = await this.runAgent(
    //   "UI Components Selection Agent",
    //   pageStructurePrompt,
    //   RequirementsUnderstandJson,
    //   "gpt-4o-mini",
    // );
    // console.log(pageStructureanalysis, "UI CONPONENT REQUIREMENTS");

    // if (this.helperService.isAgentError(pageStructureanalysis)) {
    //   return JSON.stringify({ error: `User Components Selection Agent failed: ${pageStructureanalysis.error}` });
    // }




     const uiComponentSelectionJson = await this.runAgent(
      "UI Components Selection Agent",
      userComponentSelectionAgent,
      RequirementsUnderstandJson
    );
    console.log(uiComponentSelectionJson, "UI CONPONENT REQUIREMENTS");

    if (this.helperService.isAgentError(uiComponentSelectionJson)) {
      return JSON.stringify({ error: `User Components Selection Agent failed: ${uiComponentSelectionJson.error}` });
    }



      const componentStrucutredJson = await this.runAgent(
      "Components Structure Agent",
      componentStrucutreAgent,
      uiComponentSelectionJson
    );
    console.log(componentStrucutredJson, "component structure json");

     if (this.helperService.isAgentError(componentStrucutredJson)) {
      return JSON.stringify({ error: `UI Components structured Agent failed: ${componentStrucutredJson.error}` });
    }


      const generatedCodeJson = await this.runAgent(
      "Code Generation Agent",
      codeGenerationAgent,
      {componentStrucutredJson,uiComponentSelectionJson},
      
    );

    if (this.helperService.isAgentError(generatedCodeJson)) {
      return JSON.stringify({ error: ` Code Generating Agent failed: ${generatedCodeJson.error}` });
    }


    const parsedContent = JSON.parse(generatedCodeJson)

    


    // const uiComponentMappingJson = await this.runAgent(
    //   "UI Components Selection Agent",
    //   userComponentSelectionAgent,
    //   uiRequirementsJson,
    //   "gpt-4o-mini",
    //   systemPrompt // Pass the systemPrompt here
    // );
    // console.log(uiComponentMappingJson, "UI CONPONENT REQUIREMENTS");

    // if (this.helperService.isAgentError(uiComponentMappingJson)) {
    //   return JSON.stringify({ error: `User Components Selection Agent failed: ${uiComponentMappingJson.error}` });
    // }

    // const componentStrucutredJson = await this.runAgent(
    //   "Components Structure Agent",
    //   componentStrucutreAgent,
    //   uiComponentMappingJson,
    //   "gpt-4o-mini",
    //   systemPrompt  // Pass the systemPrompt here
    // );
    // console.log(componentStrucutredJson, "component structure json");


    // if (this.helperService.isAgentError(componentStrucutredJson)) {
    //   return JSON.stringify({ error: `UI Components structured Agent failed: ${componentStrucutredJson.error}` });
    // }

    // const generatedCodeJson = await this.runAgent(
    //   "Code Generation Agent",
    //   codeGenerationAgent,
    //   {componentStrucutredJson,uiComponentMappingJson},
    //   "gpt-4o-mini",
    //   systemPrompt  // Pass the systemPrompt here
    // );

    // if (this.helperService.isAgentError(generatedCodeJson)) {
    //   return JSON.stringify({ error: ` Code Generating Agent failed: ${generatedCodeJson.error}` });
    // }


    // const parsedContent = JSON.parse(generatedCodeJson)


    return {
      code : parsedContent.code,
      otherResponse : parsedContent.otherResponse
    };
  }
  catch(err){
    console.log(err, "ERROR");

  }

}






  async generateImgResponse(imageURL: string): Promise<{ code: any; otherResponse: string }> {
    const getDescriptionPromptText = `Describe the attached screenshot in detail. I will send what you give me to a developer to recreate the original screenshot of a website that I sent you. Please listen very carefully. It's very important for my job that you follow these instructions:
  
      - Think step by step and describe the UI in great detail.
      - Make sure to describe where everything is in the UI so the developer can recreate it and how elements are aligned.
      - Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
      - Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
      - Make sure to use the exact text from the screenshot.
    `;

    const codingPrompt = getCodingPrompt();
    const descriptionPromptContent = `${getDescriptionPromptText}\nImage: ${imageURL}`;

    const initialResponse = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo", // e.g., "gpt-3.5-turbo" or "gpt-4"
      temperature: 0.2,
      messages: [
        { role: "user", content: descriptionPromptContent },
      ],
    });

    console.log({ initialResponse });
    const descriptionFromChatGPT = initialResponse.choices[0].message?.content;
    if (!descriptionFromChatGPT) {
      throw new BadRequestException('No description returned from ChatGPT.');
    }

    const completionResponse = await this.openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: codingPrompt },
        {
          role: "user",
          content: descriptionFromChatGPT + "\nPlease ONLY return code, NO backticks or language names.",
        },
      ],
      temperature: 0.2,
      response_format: zodResponseFormat(this.generateCodeForImage, "json-schema-for-image-code"),
    });

    let content = completionResponse.choices[0].message.parsed;
    // If content.code is a string, remove newline characters.
    if (typeof content.code === 'string') {
      const codeString: string = content.code;
      content.code = codeString.split("\n").join("");
    }

    return {
      code: content.code || {},
      otherResponse: content.otherResponse || ""
    };
  }
}
