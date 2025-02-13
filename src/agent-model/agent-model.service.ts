import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import OpenAI from 'openai';
import { getCodingPrompt } from 'src/prompt';
import { codingPrompt } from 'src/prompt/codingPrompt';
import { stripIndents } from 'src/stirpend';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { CreateAgentModelDto } from './dto/create-agent-model.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HelperService } from 'src/core/helper/helper.service';


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
          const model = this.genAI.getGenerativeModel({model:process.env.GEMINI_MODEL})
          const imgDescription = await model.generateContent([
            getDescriptionPrompt,
            {inlineData:{data:base64Image,mimeType:'image/jpeg'}}
          ])
          descpOutput = imgDescription.response.text();

      } 


      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data.prompt },
      ];


      if (descpOutput) {
        messages.push({ role: 'assistant', content: descpOutput });
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.2,
        max_tokens: 5000,
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
