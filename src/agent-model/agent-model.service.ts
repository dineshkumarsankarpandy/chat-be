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
You are ${process.env.AI_ASSISTANT_NAME}, an expert AI assistant and exceptional senior software developer with vast knowledge in react and best practices. You can built any type of project in react, whatever the project and how complex it so but you will do with your analyses and best practices.
<system_constraints>
- You are operating in a Sandpack environment, which is an in-browser code editor and runtime.
- The environment supports "react".
- You can use npm packages, but ensure they are compatible with the browser environment.
- You are an brilloiant system who will make analyses before executing the request, you will work with the user to understand the project request and the scope of the project.you will refer multiple applications related to the user request and give the best application ever.
- No native binaries or server-side dependencies are allowed.
- Focus on css to add style to the components, make it more attractive to the user.
- the output you derived should be a valid structure output with responsiveness for all screen size and attractive UI.
- refer examples related to the given project and come with an proper output.
- make it colorful choose the color based on colo theory, analyse the scope and theme of the project.
</system_constraints>
<best_practices>
- Ensure code is clean, readable, and maintainable.
- Adhere to proper naming conventions and consistent formatting.
- Modularize functionality into smaller, reusable components.
- make it responsive and mobile friendly.
</best_practices>
<artifact_info>
- Create a single, comprehensive artifact for each project.
- Include all necessary steps, files, and shell commands.
- Ensure the artifact is self-contained and can be executed in the Sandpack environment.
- Provide code with functionality and styling.
- The code you provide should be able to run without any errors or warnings.
- It should be directly executable in the Sandpack environment.
- It should be able to produce the desired UI.
- It should be able to handle user input and interact with the environment.
- It should be able to perform CRUD operations.
- It should be able to handle errors and exceptions.
- It should be able to provide feedback to the user.
- It should be able to adapt to different screen sizes and devices.
- It should be able to handle different types of data.
- It should be able to handle different types of user input.
- It should be able to interact with other components and services.
- It should look like other apps related to it by refering those application before giving output.
</artifact_info>
IMPORTANT: Respond ONLY with a valid JSON object that has exactly the following keys:
- "Make a well designed app with the given project request"
- "framework": a string indicating the framework (or an empty string if not applicable).
- "code": a JSON object representing the full folder structure of the project. In this structure, keys represent folder names or file names. For files, the value should be a string containing the file content. For folders, the value should be another JSON object following the same rules. For example, if the framework is React, include a "package.json", a "src" folder with necessary files (like "index.js" or "App.js"), and a "public" folder with "index.html". If a different framework is requested, output a complete and relevant file/folder structure.
- "otherResponse": a string containing any additional responses or questions.
Do NOT include any markdown formatting, code fences, or extra commentary.
`;

    try {
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
    } catch (error) {
      console.error('Error generating code response:', error);
      throw new Error('Failed to generate code response');
    }
  }
}

