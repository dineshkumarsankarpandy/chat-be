import { Injectable ,StreamableFile, BadRequestException} from '@nestjs/common';
import OpenAI from 'openai';
import { z } from 'zod';
import { getCodingPrompt } from 'src/prompt';
import { Readable } from 'stream';
import shadcnDocs from 'src/lib/shadcn-docs';


@Injectable()
export class AgentModelService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateCodeResponse(userPrompt: string): Promise<{ framework: string; code: any; otherResponse: string }> {
    const systemPrompt = `
   You are a highly skilled React developer with extensive experience in creating dynamic and responsive web applications. 
   You excel at writing clean, efficient, and well-structured React code while automatically incorporating necessary styles, 
   CSS, and icons to enhance the user experience, even when not explicitly requested.

  Your task is to generate a complete React application with an organized file structure. 
  This application should include all relevant components, styles, and assets that are typically required for a modern web app.

  Please ensure that the code is well-commented and that the file structure is easy to navigate for future development.

   IMPORTANT: Respond ONLY with a valid JSON object that has exactly the following keys:
  - "Make a well designed app with the given project request"
  - "framework": a string indicating the framework (or an empty string if not applicable).
  - "code": a JSON object representing the full folder structure of the project. In this structure, keys represent folder names or file names. For files, the value should be a string containing the file content. For folders, the value should be another JSON object following the same rules. For example, if the framework is React, include a "package.json", a "src" folder with necessary files (like "index.js" or "App.js"), and a "public" folder with "index.html". If a different framework is requested, output a complete and relevant file/folder structure.
  - "otherResponse": a string containing any additional responses or questions.
   Do NOT include any markdown formatting, code fences, or extra commentary.
    `;


//     const systemPrompt = `
// You are ${process.env.AI_ASSISTANT_NAME}, an expert AI assistant and exceptional senior software developer with vast knowledge in react and best practices. You can built any type of project in react, whatever the project and how complex it so but you will do with your analyses and best practices.
// <system_constraints>
// - You are operating in a Sandpack environment, which is an in-browser code editor and runtime.
// - The environment supports "react".
// - You can use npm packages, but ensure they are compatible with the browser environment.
// - You are an brilloiant system who will make analyses before executing the request, you will work with the user to understand the project request and the scope of the project.you will refer multiple applications related to the user request and give the best application ever.
// - No native binaries or server-side dependencies are allowed.
// - Focus on css to add style to the components, make it more attractive to the user.
// - the output you derived should be a valid structure output with responsiveness for all screen size and attractive UI.
// - refer examples related to the given project and come with an proper output.
// - make it colorful choose the color based on colo theory, analyse the scope and theme of the project.
// </system_constraints>
// <best_practices>
// - Use tailwind css and make sure every individual section has its own height (eg: hero section will have 100dvh and then each section with a top and bottom margin of 80px )
// - Add yourself with some Hypothetical data 
// - Ensure code is clean, readable, and maintainable.
// - Adhere to proper naming conventions and consistent formatting.
// - Modularize functionality into smaller, reusable components.
// - make it responsive and mobile friendly.
// </best_practices>
// <artifact_info>
// - Create a single, comprehensive artifact for each project.
// - Include all necessary steps, files, and shell commands.
// - Ensure the artifact is self-contained and can be executed in the Sandpack environment.
// - Provide code with functionality and styling.
// - The code you provide should be able to run without any errors or warnings.
// - It should be directly executable in the Sandpack environment.
// - It should be able to produce the desired UI.
// - It should be able to handle user input and interact with the environment.
// - It should be able to perform CRUD operations.
// - It should be able to handle errors and exceptions.
// - It should be able to provide feedback to the user.
// - It should be able to adapt to different screen sizes and devices.
// - It should be able to handle different types of data.
// - It should be able to handle different types of user input.
// - It should be able to interact with other components and services.
// - It should look like other apps related to it by refering those application before giving output.
// </artifact_info>
// IMPORTANT: Respond ONLY with a valid JSON object that has exactly the following keys:
// - "Make a well designed app with the given project request"
// - "framework": a string indicating the framework (or an empty string if not applicable).
// - "code": a JSON object representing the full folder structure of the project. In this structure, keys represent folder names or file names. For files, the value should be a string containing the file content. For folders, the value should be another JSON object following the same rules. For example, if the framework is React, include a "package.json", a "src" folder with necessary files (like "index.js" or "App.js"), and a "public" folder with "index.html". If a different framework is requested, output a complete and relevant file/folder structure.
// - "otherResponse": a string containing any additional responses or questions.
// Do NOT include any markdown formatting, code fences, or extra commentary.
// `;

 
        





      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.0,
      });

      let content = response.choices[0].message.content;
      console.log('content',content);
      content = content.replace(/```/g, '').trim();
      
      const parsedContent = JSON.parse(content);

      return {
        framework: parsedContent.framework || "",
        code: parsedContent.code || {},
        otherResponse: parsedContent.otherResponse || ""
      };
 
 
    
  }















  async generateImgResponse(imageURL:string): Promise<StreamableFile> {
    const getDescriptionPromptText = `Describe the attached screenshot in detail. I will send what you give me to a developer to recreate the original screenshot of a website that I sent you. Please listen very carefully. It's very important for my job that you follow these instructions:

- Think step by step and describe the UI in great detail.
- Make sure to describe where everything is in the UI so the developer can recreate it and how elements are aligned.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
`;


;
    const codingPrompt = getCodingPrompt();
    const descriptionPromptContent = `${getDescriptionPromptText}\nImage: ${imageURL}`;

    const initialResponse = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo", // e.g., "gpt-3.5-turbo" or "gpt-4"
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: descriptionPromptContent,
        },
      ],
    });

    console.log({ initialResponse });
    const descriptionFromChatGPT = initialResponse.choices[0].message?.content;
    if (!descriptionFromChatGPT) {
      throw new BadRequestException('No description returned from ChatGPT.');
    }

    // Second ChatGPT call: stream the generated code based on the description and coding prompt
    const completionResponse = await this.openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: codingPrompt,
          },
          {
            role: "user",
            content:
              descriptionFromChatGPT +
              "\nPlease ONLY return code, NO backticks or language names.",
          },
        ],
        stream: true,
        temperature: 0.2,
      },
      { responseType: 'stream' } as any
    );

    const readableStream = new Readable({
      objectMode: true,
      async read() {
        for await (const chunk of completionResponse) {
          const content = chunk.choices[0]?.delta?.content || '';
          this.push(content);
        }
        this.push(null); // End stream
      },
    });
  
    return new StreamableFile(readableStream);
  }
  
}


