import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import OpenAI from 'openai';
import { getCodingPrompt } from 'src/prompt';
import { codingPrompt } from 'src/prompt/codingPrompt';

import { Readable } from 'stream';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import shadcnDocs from 'src/lib/shadcn-docs';

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
    const systemPrompt = codingPrompt;
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
        max_tokens: 1200,
        temperature: 0.0,
      });

      let content = response.choices[0].message.content;
      const fixedRaw = content.replace(/(\r\n|\n|\r)/gm, " ");

      let ontent = JSON.parse(fixedRaw);
   
    return {
      framework: ontent.framework,
      code: ontent.code,
      otherResponse: ontent.otherResponse,
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
