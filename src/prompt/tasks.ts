
export let task  = `

        export let task  = \`\`\`
# AI Coding Agent Tasks: Bug Report UI Recreation

1.  **Create Project Skeleton and Install Dependencies**
    *   [ ] Create a new React project using Create React App or Vite.
    *   [ ] Install Tailwind CSS and PostCSS.
    *   [ ] Configure \`tailwind.config.js\` to include all project files.
    *   [ ] Install \`shadcn-ui\`.
    *   [ ] Install \`@radix-ui/react-slot\`.
    *   [ ] Install \`class-variance-authority\`, \`tailwind-merge\`, and \`clsx\`.
    *   [ ] Initialize Shadcn UI using \`npx shadcn-ui@latest init\`
    *   [ ] Import and configure the Tailwind directives in the global css file

2.  **Implement the Overall App Layout Component**
    *   [ ] Create a \`Layout\` component in \`src/components/Layout.jsx\`
    *   [ ] Add a \`div\` with \`class="flex min-h-screen bg-gray-50 dark:bg-gray-900"\` as the root element.
    *   [ ] Add a main content area with \`class="w-full max-w-2xl p-4 rounded-lg bg-white shadow-md dark:bg-gray-800 overflow-y-auto"\` inside the root.
    *   [ ] Add a sidebar area with \`class="hidden md:block w-full max-w-xs p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md ml-4"\` inside the root.
    *   [ ] Add a Storybook story for the \`Layout\` component with basic placeholder content in both main and sidebar areas.

3.  **Implement the Bug Report Section Component**
    *   [ ] Create a \`BugReportSection\` component in \`src/components/BugReportSection.jsx\`.
    *   [ ] Implement the component structure: A red circle, a title "Bug Report: BUG-123", a subtitle, and a description.
    *   [ ] Style the red circle using \`class="w-2 h-2 rounded-full bg-red-500 mr-2"\`.
    *   [ ] Style the main title using \`class="text-xl font-semibold text-gray-800 dark:text-white"\`.
    *   [ ] Style the subtitle using \`class="text-red-500 mt-2"\`.
    *   [ ] Style the description using \`class="text-gray-700 dark:text-gray-300 mt-2"\`.
    *   [ ] Create a Storybook story for the \`BugReportSection\` component.
        *   [ ] Storybook State:  Pass the following props: \`title="Bug Report: BUG-123"\`, \`subtitle="Login Screen Crashes on iOS Devices"\`, \`description="The application consistently crashes when users attempt to log in using iOS devices running version 15.0 or higher. This occurs after entering credentials and pressing the login button."\`.

4.  **Implement the Steps to Reproduce Section Component**
    *   [ ] Create a \`StepsToReproduceSection\` component in \`src/components/StepsToReproduceSection.jsx\`.
    *   [ ] Implement the section structure: A title "Steps to Reproduce (0/4)", two input fields, and an "Add Steps" button.
    *   [ ] Style the section title using \`class="text-lg font-semibold text-gray-700 dark:text-gray-300"\`.
    *   [ ] Style the input fields with appropriate border, padding, and focus styles.
    *   [ ] Style the "Add Steps" button to resemble a link with a plus icon.
    *   [ ] Create a Storybook story for the \`StepsToReproduceSection\` component.
        *   [ ] Storybook State:  No props needed initially.

...
\`\`\`

`