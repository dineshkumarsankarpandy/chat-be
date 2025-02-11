import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import OpenAI from 'openai';
import { getCodingPrompt } from 'src/prompt';
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
    const systemPrompt = `
    You are an expert frontend frontend React developer operating in a sandpack environment. You will be given a description of a website from the user, and then you will return code for it using React and Tailwind CSS. Follow the instructions carefully, it is very important for my job.
    - Think carefully step by step about how to create the UI for the feature described in the prompt.
    - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export.
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
     <examples>
            Example 1: E-commerce Dashboard
            Project Request: "Create an e-commerce analytics dashboard"
            Implementation Steps:
            1. Project Setup:
               - Create new React project: npx create-react-app ecommerce-dashboard
               - Install dependencies:
                 npm install @/components/ui recharts tailwindcss lucide-react
               - Configure tailwind.config.js and postcss.config.js
               - Set up project structure:
                 /src
                   /components
                     /dashboard
                     /charts
                     /common
                   /hooks
                   /utils
                   /styles

            2. Core Components Creation:
               - DashboardLayout.jsx: Main layout with sidebar and content area
               - MetricCard.jsx: Reusable card for displaying KPIs
               - SalesChart.jsx: Revenue visualization component
               - ProductTable.jsx: Popular products list

            3. Feature Implementation:
               - Theme toggle using React context
               - Data fetching hooks with loading states
               - Responsive grid system using Tailwind CSS
               - Chart configurations with Recharts
               - Error boundary wrapper components

            Expected Output:
            - Interactive charts showing sales trends, revenue, and popular products
            - Responsive grid layout with card components for key metrics
            - Dark/light theme toggle functionality
            - Mobile-friendly design with collapsible sidebar

            Example 2: Social Media Feed
            Project Request: "Build a social media feed interface"
            Implementation Steps:
            1. Project Setup:
               - Initialize project: npx create-react-app social-feed
               - Install required packages:
                 npm install @/components/ui tailwindcss lucide-react lodash
               - Create directory structure:
                 /src
                   /components
                     /feed
                     /post
                     /story
                   /hooks
                   /context
                   /utils

            2. Component Development:
               - Create base components:
                 - Post.jsx: Individual post component
                 - Story.jsx: Story component with carousel
                 - Comment.jsx: Comment thread component
               - Implement custom hooks:
                 - useInfiniteScroll.js
                 - usePostActions.js

            3. Feature Implementation:
               - Infinite scroll logic
               - Post interaction handlers
               - Image lazy loading
               - Comment system
               - Responsive styling

            Expected Output:
            - Infinite scroll implementation for post loading
            - Interactive post components with likes, comments, and sharing
            - Story carousel at the top with horizontal scrolling
            - Responsive design with mobile-first approach

            Example 3: Project Management Board
            Project Request: "Create a project management board"
            Implementation Steps:
            1. Initial Setup:
               - Create project: npx create-react-app project-board
               - Install dependencies:
                 npm install @/components/ui tailwindcss lucide-react
               - Set up project structure:
                 /src
                   /components
                     /board
                     /tasks
                     /modals
                   /hooks
                   /context
                   /utils
                   /styles

            2. Core Components:
               - Create essential components:
                 - Board.jsx: Main kanban board
                 - TaskCard.jsx: Draggable task component
                 - Column.jsx: Board column component
                 - TaskModal.jsx: Task creation/editing modal

            3. State Management:
               - Implement React Context for task state
               - Create custom hooks for task operations
               - Set up localStorage persistence

            4. UI Implementation:
               - Style components with Tailwind CSS
               - Add drag-and-drop functionality
               - Implement responsive design
               - Add loading states and animations

            Expected Output:
            - Kanban board with draggable task cards
            - Task creation modal with form validation
            - Filter and search functionality
            - Local storage integration for data persistence

            Key Technical Considerations for All Projects:
            1. Performance:
               - Implement React.memo() for expensive renders
               - Use proper key props for lists
               - Lazy load components when appropriate
               - Optimize re-renders with useMemo and useCallback

            2. Code Organization:
               - Follow feature-based folder structure
               - Maintain separate files for types/interfaces
               - Keep components focused and single-responsibility
               - Use consistent naming conventions

            3. Testing Considerations:
               - Set up Jest configuration
               - Write unit tests for utilities
               - Component testing with React Testing Library
               - Test key user interactions

            4. Error Handling:
               - Implement error boundaries
               - Add proper error states
               - Include fallback UI components
               - Log errors appropriately

            5. Accessibility:
               - Include proper ARIA labels
               - Ensure keyboard navigation
               - Maintain proper contrast ratios
               - Test with screen readers
          </examples>
          IMPORTANT: Check the file path you have imported in the code is the same path of the file you have created, check imports and codes for twice before responding.
          <system-message>
           the project includes the following:
                  - Buttons that trigger events such as opening modals or showing alerts.
                  - Forms with real-time validation and error feedback.
                  - Animations for user feedback (button hover, modals opening/closing).
                  - Manage UI state using React hooks to update components dynamically. 
                  - Provide a visually interactive and engaging user experience.
          <system-message>
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
