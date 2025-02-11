import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import OpenAI from 'openai';
import { getCodingPrompt } from 'src/prompt';
import { Readable } from 'stream';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

@Injectable()
export class AgentModelService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public folderStructureSchema = z.object({}).catchall(
    z.union([
      z.string(), // For file content
      z.object({}).catchall(
        z.union([
          z.string(), // For nested file content
          z.object({}).catchall(z.string()), // For deeply nested folders/files
        ])
      ), // For nested folders
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

  async generateCodeResponse(userPrompt: string): Promise<{ framework: string; code: any; otherResponse: string }> {
    const systemPrompt = `
      You are an expert frontend React developer operating in a sandpack environment. You will be given a description of a website from the user, and then you will return code for it using React. Follow the instructions carefully, it is very important for my job.
      - Think carefully step by step about how to create the UI for the feature described in the prompt.
      - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export.
      - Feel free to have multiple components in the file, but make sure to have one main component that uses all the other components.
      - Make sure the website looks exactly like the feature described in the prompt.
      - Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
      - Make sure to code every part of the description including any headers, footers, etc.
      - For all images, please use an SVG with a white, gray, or black background and don't try to import them locally or from the internet.
      - Make sure the React app is interactive and functional by creating state when needed and having no required props.
      - If you use any imports from React like useState or useEffect, make sure to import them directly.
      - Use TypeScript as the language for the React component.
      -  DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette.
      - Use margin and padding to style the components and ensure the components are spaced out nicely.
      IMPORTANT: Respond ONLY with a valid JSON object that has exactly the following keys:
      - "framework": a string indicating the framework (or an empty string if not applicable).
      - "code": a JSON object representing the full folder structure of the project. In this structure, keys represent folder names or file names. For files, the value should be a string containing the file content. For folders, the value should be another JSON object following the same rules. For example, if the framework is React, include a "package.json", a "src" folder with necessary files (like "index.js" or "App.js"), and a "public" folder with "index.html". If a different framework is requested, output a complete and relevant file/folder structure.
      - "otherResponse": a string containing any additional responses or questions.
      Do NOT include any markdown formatting, code fences, or extra commentary.
    `;

    const response = await this.openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1200,
      temperature: 0.0,
      response_format: zodResponseFormat(this.generateCode,'generate-code')
    });

   let content = response.choices[0].message.parsed;

    // try {
    //   content = JSON.parse(content.code);
    // } catch (e) {
    //   const fixedRaw = content.code.replace(/(\r\n|\n|\r)/gm, " ");
    //   try {
    //     content = JSON.parse(fixedRaw);
    //   } catch (err) {
    //     throw new BadRequestException(`Failed to parse JSON output. Original error: ${err}`);
    //   }
    // }

    // // If the code property is a string, remove newline characters.
    // if (typeof content.code === 'string') {
    //   content.code = content.code.split("\n").join("");
    // }
    
    return {
      framework: content.framework,
      code: content.code,
      otherResponse: content.otherResponse,
    };
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
      model: "gpt-3.5-turbo",
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
