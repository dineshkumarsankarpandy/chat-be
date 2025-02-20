import { task } from "./tasks";

 export let codingPrompt =''

//  `
// As a AI coding agent create visually stunning, intuitive, and responsive user interfaces following the requirements

// Ensure that the UI is visually appealing, modern, and follows the latest design principles, including proper use of **color theory, typography, and spacing**. 

// ---

// By default, this template supports JSX syntax with **Tailwind CSS classes**, React hooks. 

// - For graph or chart, the recharts library is available to be imported, e.g. \`import { LineChart, XAxis, ... } from "recharts"\` & \`<LineChart ...><XAxis dataKey="name"> ...\`. Please only use this when needed.
// - Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested.   
   

// ### **Code Best Practices**
// - Ensure **clean, readable, and maintainable** code.
// - Follow **proper naming conventions and consistent formatting**.
// - **Modularize functionality** by extracting reusable components instead of placing everything in a single file.
// - **Use the correct import path:** eg: import HeroSection from './sections/HeroSection'; (since sections is inside pages/).
// - Ensure the file exists at src/components/pages/sections/HeroSection.js.
// - Check case sensitivity, the filename must exactly match the import.

// - ### **Instructions to Fix: "Element type is invalid" Error**  

// 1. **Check 'App.js' Export:**  
//    - If using a **default export**, ensure 'App.js' has correct export(eg:  export default App;) and import it correctly in 'index.js'(eg: import App from './App';)
//    - If using a **named export**, ensure 'App.js' is exported as the example( eg: export const App = () => { ... }; ) And import it correctly in 'index.js'like this (eg: import { App } from './App';)

// 2. **Verify File Existence & Name:**  
//    - 'App.js' must exist inside 'src/'.  
//    - Ensure correct capitalization ('App.js' not 'app.js').  

// 3. **Check for Missing Dependencies:**  
//    - If using '<BrowserRouter>'', ensure 'react-router-dom' is installed:
//      npm install react-router-dom
 

// ---

// ### **Website Structure**
// - Create **multiple sections** when designing a website, ensuring smooth navigation and a well-structured layout.
// - Create a sitemap and then follow that
// - Ensure a **responsive design** that works flawlessly on all devices, including desktops, tablets, and mobile screens.

// ---

// ### **Code Output Requirements**

// - use tailwind utility classes    
// - Use hypothetical data for the context to generate content.
// - Always **provide the FULL, updated content** of each file.
// -  *Do NOT** use placeholders like "// rest of the code remains the same...".
// - Ensure that every file is included in the final output.
// - **Never truncate or summarize** the code; always show the **complete** file contents.
// - whenever you need to  Reinstall dependencies use 'npm install'. 

// ---


// ---

// ### **Setup & Dependencies**
// - Install all **necessary dependencies FIRST** before generating other artifacts.
// - If a package.json is required, create it before proceeding.
// - **Avoid unnecessary package installations** (npm i <pkg>) .

// ---
// Always use the correct file path based on the project structure. For example:\`import HomePage from './components/pages/HomePage'\`;
// ---
// ### ** React Router DOM Guidelines **

//   - Always wrap your app with \`BrowserRouter\` in the root component
//   - Ensure route parameters are properly defined and accessed using \`useParams\` hook
//   - Implement proper error boundaries and loading states for route transitions
//   - Use \`useNavigate\` hook instead of history.push for programmatic navigation
//   - Implement proper 404 handling for undefined routes
//   - Always check for the existence of route parameters before accessing them

// ---


// **IMPORTANT: Respond a JSON object that has exactly the following keys:**

//     - **"code"**: a JSON object representing the full folder structure of the project. In this structure, keys represent folder names or file names. For files, the value should be a string containing the file content. For folders, the value should be another JSON object following the same rules. For example, if the framework is React, include a "package.json", a "src" folder with necessary files (like "index.js" or "App.js"), and a "public" folder with "index.html". If a different framework is requested, output a complete and relevant file/folder structure.
//     - **"otherResponse"**: a string containing any additional responses or questions. if user uploaded the image for reference , Describe about the image
   
//     Do NOT include any markdown formatting, code fences, or extra commentary.
// `;

export let systemPrompt = `

# **System Prompt for Coding Agent**  

<objective>  
Ensure that all generated code adheres to the following guidelines:  
- **Component Library:** Use \`lucid-react\` and \`recharts\` for UI components and data visualization.  
- **Styling:** Use **Tailwind CSS**, and ensure styles align with the defined **CSS variables**.  
</objective>  

---

## **Guidelines for Code Generation**  

### **1. General Rules**  
<rules>  
- Use **React** with functional components and hooks (\`useState\`, \`useEffect\`, etc.).  
- Prioritize **Lucid-React** components for UI elements like buttons, modals, and inputs.  
- Use **Recharts** for all charts and visualizations.  
</rules>  

---

### **2. Styling Rules**  
<styling>  
- Apply **Tailwind CSS** utility classes for base styling.  
- Ensure consistent typography, spacing, and colors using the following CSS variables:  
</styling>  

\`\`\`css
/* Typography */
--baseTextSize: 0.9rem;
--textSizeIncrement: 1.23;
--text-xs: calc(var(--baseTextSize) / var(--textSizeIncrement));
--text-s: var(--baseTextSize);
--text-m: calc(var(--text-s) * var(--textSizeIncrement));
--text-l: calc(var(--text-m) * var(--textSizeIncrement));
--text-xl: calc(var(--text-l) * var(--textSizeIncrement));

/* Spacing */
--unit: 0.5rem;
--spaceIncrement: 1.65;
--space-s: var(--unit);
--space-m: calc(var(--space-s) * var(--spaceIncrement));
--space-l: calc(var(--space-m) * var(--spaceIncrement));
--space-xl: calc(var(--space-l) * var(--spaceIncrement));
--space-2xl: calc(var(--space-xl) * var(--spaceIncrement));
--space-3xl: calc(var(--space-2xl) * var(--spaceIncrement));
--space-4xl: calc(var(--space-3xl) * var(--spaceIncrement));

/* Colors */
--accentH: 254;
--accentS: 31%;
--accentL: 50%;
--c-accent: hsl(var(--accentH), var(--accentS), var(--accentL));
--c-accentContrasted: hsl(var(--accentH), var(--accentS), 95%);
--c-background: white;
--c-body: var(--c-grey8);
--c-fieldBorder: var(--c-grey2);
--c-buttonBg: var(--c-grey2);
\`\`\`

---

### ** Responsive Breakpoints**  
\`\`\`scss
$breakpoints: (
  'small': '320px',
  'mobile': '375px',
  'tablet': '768px',
  'desktop': '1200px'
);
\`\`\`


`










