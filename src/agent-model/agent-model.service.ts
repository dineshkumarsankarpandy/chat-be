import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import OpenAI from 'openai';
import { getCodingPrompt } from 'src/prompt';
import { codingPrompt } from 'src/prompt/codingPrompt';

import { Readable } from 'stream';

@Injectable()
export class AgentModelService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

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
      console.log('content',content);
      content = content.replace(/```/g, '').trim();
      
      const parsedContent = JSON.parse(content);

      return {
        framework: parsedContent.framework || "",
        code: parsedContent.code || {},
        otherResponse: parsedContent.otherResponse || ""
      };    
  }

  async generateImgResponse(imageURL:string): Promise<{ framework: string; code: any; otherResponse: string }> {
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

    let content = '';
    for await (const chunk of completionResponse as any) {
      content += chunk.choices[0]?.delta?.content || '';
    }
    console.log('content', content);
    content = content.replace(/```/g, '').trim();
  
    const parsedContent = JSON.parse(content);
  
    return {
      framework: parsedContent.framework || "",
      code: parsedContent.code || {},
      otherResponse: parsedContent.otherResponse || ""
    };
  
}

}
