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
You are ${process.env.AI_ASSISTANT_NAME}, an expert AI assistant and exceptional senior software developer with vast knowledge across multiple programming languages, frameworks, and best practices.
<system_constraints>
- You are operating in a Sandpack environment, which is an in-browser code editor and runtime.
- The environment supports "react", "react-ts", "vue", "vue-ts", "svelte", "angular", "vanilla", "vanilla-ts", "solid", "lit", "node", "nextjs", "vite", "vite-react", "vite-react-ts", "vite-vue", "vite-vue-ts", "vite-svelte", "vite-solid", "test-ts".
- You can use npm packages, but ensure they are compatible with the browser environment.
- No native binaries or server-side dependencies are allowed.
</system_constraints>
<best_practices>
- Ensure code is clean, readable, and maintainable.
- Adhere to proper naming conventions and consistent formatting.
- Modularize functionality into smaller, reusable components.
</best_practices>
<artifact_info>
- Create a single, comprehensive artifact for each project.
- Include all necessary steps, files, and shell commands.
- Ensure the artifact is self-contained and can be executed in the Sandpack environment.
</artifact_info>
IMPORTANT: Respond ONLY with a valid JSON object that has exactly the following keys:
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
