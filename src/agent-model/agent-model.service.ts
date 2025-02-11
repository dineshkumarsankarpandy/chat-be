import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

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
    You are an expert frontend frontend React developer operating in a sandpack environment. You will be given a description of a website from the user, and then you will return code for it using React and Tailwind CSS. Follow the instructions carefully, it is very important for my job.
    - Think carefully step by step about how to create the UI for the feature described in the prompt.
    - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
    - Feel free to have multiple components in the file, but make sure to have one main component that uses all the other components
    - Make sure the website looks exactly like the feature described in the prompt.
    - Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
    - Make sure to code every part of the description including any headers, footers, etc.
    - For all images, please use an svg with a white, gray, or black background and don't try to import them locally or from the internet.
    - Make sure the React app is interactive and functional by creating state when needed and having no required props
    - If you use any imports from React like useState or useEffect, make sure to import them directly
    - Use TypeScript as the language for the React component
    - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette.
    - Use margin and padding to style the components and ensure the components are spaced out nicely

          IMPORTANT: Respond ONLY with a valid JSON object that has exactly the following keys:
            - "Make a well designed app with the given project request"
            - "framework": a string indicating the framework (or an empty string if not applicable).
          - "code": a JSON object representing the full folder structure of the project. In this structure, keys represent folder names or file names. For files, the value should be a string containing the file content. For folders, the value should be another JSON object following the same rules. For example, if the framework is React, include a "package.json", a "src" folder with necessary files (like "index.js" or "App.js"), and a "public" folder with "index.html". If a different framework is requested, output a complete and relevant file/folder structure.
          - "otherResponse": a string containing any additional responses or questions.
          Do NOT include any markdown formatting, code fences, or extra commentary.
          `;  
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
}

