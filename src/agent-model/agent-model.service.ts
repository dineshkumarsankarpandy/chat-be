import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSystemPrompt } from 'src/prompt';

@Injectable()
export class AgentModelService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateCodeResponse(userPrompt: string): Promise<any> {
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
    IMPORTANT: Respond with the artifact directly without additional explanations unless asked.
    If the user requests code in a specific framework, mention that framework in a separate variable called 'framework' in your response.
  `;

    const combinedPrompt = `${systemPrompt}\n\nUser Request:\n${userPrompt}`;

    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: combinedPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      },
    });

    const response = result.response;
  
    return response.text();

  }
}