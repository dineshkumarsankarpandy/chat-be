
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


let task1 = `

I want to create professional services app that connects service provides and people looking for services.
the name of my project is \"bydaygigs\" - all small letters. 

below are the details, take your time and execute step by step\n\n

An App Where Service Providers Interface with Potential Customers\n
1. Overview: This application will serve as a platform where service providers can connect with potential
             customers, showcasing their skills and availability while ensuring secure transactions.\n

2. Types of Services: The platform will support a wide range of services, including but not limited to:
● Cleaning Services (Home, Office, Industrial, etc.)
● Plumbing (Repairs, Installations, Maintenance)
● Electrical Work (Wiring, Repairs, Installations)
● Construction Work (Masonry, Carpentry, Roofing, etc.)
● Mechanic Services (Automobile, Motorbike Repairs, etc.)
● Barbering and Hairdressing
● Makeup and Beauty Services
● Massage and Therapy Services
● General Repairs (Home Appliances, Furniture, etc.)
● Laundering and Dry Cleaning
● Installation Services (DSTV, Internet, Home Security, etc.)\n

3. Core Functionalities
    3.1 User Registration &amp; Authentication
    ● Sign-up for Service Providers: Service providers must create an account.
    ● Sign-up for Customers: Customers must also register to book services.
    ● Login &amp; Authentication: Secure login system with email, phone, or social media integration.
    
    3.2 Service Provider Profile Management
    ● Profile Setup: Service providers must provide business details.
    ● Document Upload: Upload necessary personal/company documents for verification.
    ● Portfolio Upload: Upload images and videos of previous work for customer review.
    ● Business Description: Service providers can describe their expertise and offerings.
    ● Pricing Structure: Ability to set prices per hour, per job, or per day.
    
    3.3 Customer Features
    ● Service Search &amp; Filter: Customers can browse services based on categories, location,and pricing.
    ● Booking System: Customers can request services for a specific time and date.
    ● Review &amp; Rating System: Customers can rate and review service providers based on experience.
    ● Secure Payment System: All transactions will be processed within the app.
    
    3.4 Payment &amp; Revenue Model
    ● Integrated Payment System: Customers will make payments through the app.
    ● Escrow System: A percentage of the service cost will be held until the service is completed.
    ● Revenue Model:
        ○ Commission-Based: A percentage of the service fee is deducted per job.
        ○ Subscription Model: Service providers may opt for a subscription plan to avoid\nper-job deductions.
    
    3.5 Location &amp; Tracking
    ● Real-Time GPS Tracking: Customers and service providers can view each other’s locations.
    ● Route Optimization: Service providers can receive optimized directions to customer locations.
    ● Emergency Assistance: Built-in emergency reporting in case of issues. 
    
    3.6 Communication Features
    ● In-App Messaging: Customers and service providers can communicate before confirming a job.
    ● Call &amp; Video Call Options: Optional phone/video consultation before service booking.
    ● Notifications &amp; Alerts: Reminders for upcoming bookings and status updates.
    
    3.7 Admin Dashboard &amp; Management\n
    ● User Verification System: Admin can approve or reject service provider registrations.\n
    ● Dispute Resolution: A system for handling complaints and conflicts.\n
    ● Analytics &amp; Reporting: Insights on revenue, bookings, and user engagement.\n
    ● Promotion &amp; Discounts: Admin can offer discounts or promotions for users.\n
    
4. Security &amp; Compliance\n
    ● Data Protection &amp; Privacy: Adhering to data protection laws.\n
    ● Secure Payments: PCI-DSS compliant payment gateway integration.\n
    ● Background Verification: Ensuring service providers are verified and trustworthy.\n\n
    ● User Agreement &amp; Policies: Terms and conditions for both customers and service providers.\n\n


5. Conclusion:
This application aims to provide a seamless and secure way for customers to find reliable service providers while ensuring fair compensation and
trust through secure payments and verification systems.The goal is to create an efficient marketplace for local services, improving convenience and job opportunities.

build a micro saas that converts technical documentation of programming technologies into json files that preserved all the info including code snippets.
the goal of these files is to add them as context into coding editors with llm so that the latest code documentation can be referenced.
the user can can feed a url to the website and then a scraper will scrape all the data from the documentation, including following links.
the app needs to be connected to google gemini api to evaluate the data, whcih links to follow and how to strucutre the json data correctly to fit to a standardized model
that is ideal for llm's to understand so that it is the most useful to feed ai code editors.

the doc will then be stored.

Here's the **refined and fully integrated version** of the AI-powered **Smart Device Management App** with all your requested 

**advanced features**:  \n\n---\n\n

# **AI-Powered Smart Device Management App**
### **Revolutionizing Device Maintenance, Optimization, and Troubleshooting**  
  This app serves as a **one-stop AI-driven solution** for maintaining, troubleshooting, and optimizing **all smart devices** using **Agentic AI**. 
  The AI autonomously **monitors, predicts, and resolves** issues while offering **proactive insights, energy savings, and seamless integration with smart home ecosystems**. 
  
## **1️⃣ Core AI Capabilities & Mechanisms**\n### **Agentic AI for Autonomous Device Management**\nThe app leverages **Agentic AI** to:  \n✔ **Auto-detect** and register devices using Wi-Fi, Bluetooth, and APIs.  \n✔ **Analyze performance metrics** to detect anomalies.  \n✔ **Predict issues** based on device behavior, historical data, and manufacturer guidelines.  \n✔ **Provide real-time troubleshooting** via chatbot or AR-guided instructions.  \n✔ **Automate minor fixes** (e.g., adjusting settings, optimizing performance, force-resetting).  \n✔ **Connect to verified service providers** for escalated repairs.  \n\n### **Smart Detection & Learning Mechanisms**  \n🛠 **Device Auto-Detection:** Uses **Wi-Fi, Bluetooth, QR scanning, and APIs** to recognize devices.  \n📊 **Usage Pattern Learning:** AI analyzes how users operate devices to optimize performance.  \n🔍 **Live Issue Tracking:** Pulls **user complaints, bug reports, and manufacturer updates** from online sources.  \n⏳ **Failure Prediction Models:** Uses **historical trends and AI forecasting** to **prevent breakdowns** before they happen.  \n\n---\n\n## **2️⃣ Key Features & Functionalities**  \n### **🔔 Smart Maintenance Notifications & Proactive Care**  \n✅ **AI-powered reminders** for routine maintenance (e.g., clean air filters, reboot routers).  \n✅ **Customized alerts** based on device model, manufacturer recommendations, and usage history.  \n✅ **Live issue warnings** by pulling data from forums and repair databases (e.g., “This model’s battery has reported overheating issues”).  \n✅ **Firmware & software update alerts** to enhance security and performance.  \n\n---\n\n### **🤖 AI Chatbot for Troubleshooting & Self-Repair**  \n💬 **Conversational AI** diagnoses issues and offers **step-by-step resolutions**.  \n🔎 **AI-Driven Issue Identification:**  \n   - Auto-detects **device model & error logs**.  \n   - Runs **a quick health check** to detect internal failures.  \n🛠 **Step-by-Step Fixes:**  \n   - Provides **interactive repair guides** with AR overlays.  \n   - Suggests **optimized settings** to enhance performance.  \n   - Recommends **replacement parts** for broken components.  \n📞 **Escalation Support:**  \n   - Connects users to **manufacturer service or verified repair technicians** when DIY fails.  \n\n---\n\n### **📡 Device Auto-Detection & Learning**  \n🔗 **Automatic Connection:** Identifies all smart home devices **across brands** (IoT, appliances, computers, gaming consoles, etc.).  \n📈 **Adaptive Learning:** AI **learns from user behavior** and **adjusts maintenance schedules** accordingly.  \n🔌 **Power & Performance Optimization:**  \n   - AI **reduces energy consumption** by adjusting settings.  \n   - **Predicts battery degradation** and suggests preventive measures.  \n\n---\n\n### **💰 Energy Efficiency & Cost Savings**  \n🔋 **Real-Time Energy Tracking:** Monitors **power consumption** of connected devices.  \n📊 **Cost Analysis Reports:** Shows **which devices are draining electricity** and offers **eco-friendly alternatives**.  \n🔔 **High Energy Usage Alerts:** Notifies users if a device is **consuming excessive power** or has abnormal energy spikes.  \n\n---\n\n### **🛠 Warranty & Service History Management**  \n📜 **Warranty Tracker:** Automatically **stores & tracks warranty information** for each device.  \n🛠 **Service Log:** Keeps a **detailed history of maintenance and repairs**, making troubleshooting easier.  \n📅 **Service Reminders:** Alerts users when **warranty expiration** or **scheduled maintenance** is approaching.  \n\n---\n\n### **🎛 Remote Control & Smart Automation**  \n📲 **Device Control Panel:** Lets users **remotely adjust settings** or turn devices on/off.  \n📅 **Automation & Scheduling:** Allows **pre-set routines** (e.g., schedule dishwasher cycles, optimize thermostat settings).  \n🌐 **Cross-Platform Compatibility:** Works with **Google Home, Alexa, Apple HomeKit, and other smart ecosystems**.  \n\n---\n\n### **🛒 Smart Buying Guide & Issue Filtering**  \n🔍 **Before Buying a Device:** AI **analyzes online reviews and reports** to warn users of common failures.  \n📊 **Defect Risk Analysis:** Compares models based on **failure rates, customer complaints, and longevity scores**.  \n📢 **AI-Driven Upgrade Suggestions:** Recommends **newer, more reliable devices** when current ones start to fail.  \n\n---\n\n### **🔧 Augmented Reality (AR) Assistance for Self-Repair**  \n📷 **AR-Based Troubleshooting:** Users can **scan a faulty device** to receive **overlay repair instructions**.  \n📖 **Interactive User Manuals:** AI recognizes components and **provides real-time visual guides** for fixes.  \n\n---\n\n### **🛍 Marketplace & Vendor Integration**  \n🛒 **Parts & Accessories Store:** AI recommends **compatible parts** for repairs.  \n🛠 **In-App Repair Booking:** Users can book **certified repair services** directly from the app.  \n📦 **Real-Time Repair Status:** Tracks **ongoing repair progress** and **delivery updates** for parts.  \n\n---\n\n### **🌍 Community & Social Features**  \n👥 **User Forums & Q&A:** Users can **share experiences, tips, and fixes** within the app.  \n🔄 **Crowdsourced Issue Reporting:** Common problems **reported by users** help train AI to **detect emerging failures faster**.  \n\n---\n\n### **🛡 Security & Privacy Features**  \n🔑 **Device Security Audits:** AI periodically checks for **vulnerabilities and unpatched exploits**.  \n🛠 **Privacy Safeguards:** Ensures **secure access to IoT devices** with **end-to-end encryption**.  \n\n---\n\n### **🎙 Voice-Activated Assistance & Contextual Help**  \n🔊 **Voice-Controlled Diagnostics:** Users can ask AI for **troubleshooting tips via Alexa, Google Assistant, or Siri**.  \n📌 **Dynamic Help Center:** AI provides **real-time assistance** tailored to the current issue.  \n\n---\n\n## **3️⃣ User Flow: How the App Works**  \n1️⃣ **User Installs App & Connects Devices** via **Wi-Fi, Bluetooth, or QR scan**.  \n2️⃣ **AI Auto-Detects & Monitors Devices** to learn **usage patterns**.  \n3️⃣ **Predictive Issue Detection** proactively **alerts users** before failures occur.  \n4️⃣ **Troubleshooting AI Engages Users** with **step-by-step fixes & AR guides**.  \n5️⃣ If unresolved, **AI recommends repair services or warranty claims**.  \n6️⃣ **AI Learns Over Time & Improves Recommendations** for **efficiency & longevity**.  \n\n---\n\n## **4️⃣ Competitive Advantages Over Existing Solutions**\n🚀 **Full Cross-Brand Compatibility** – Works across **all smart devices** (not tied to one brand).  \n🛠 **Autonomous Troubleshooting AI** – Eliminates the need to call manufacturer support for minor issues.  \n🌐 **Live Internet-Based Issue Identification** – Pulls real-world **device failure trends** to warn users.  \n🔎 **AI-Powered Self-Repair** – **AR troubleshooting & voice-guided fixes** make DIY repair easier.  \n📊 **Predictive Maintenance** – AI **prevents breakdowns** before they happen.  \n\n---\n\n## **5️⃣ Future Expansions & Scalability**\n🚀 **AI-Powered Voice Repair Assistant** – Fully hands-free **smart home troubleshooting**.  \n🔗 **Blockchain-Based Repair Logs** – Keeps an **uneditable repair history** for **resale validation**.  \n📡 **Advanced IoT Sensor Support** – Integrates with **smart home sensors for deeper monitoring**.  \n💰 **Premium AI Repair Subscription** – Users can **pay for expert AI-driven diagnostics & live assistance**.  \n\n---\n\n## **Conclusion: The Future of Smart Device Maintenance**  \nThis AI-powered **smart device management app** offers **proactive maintenance, energy savings, security, and repair solutions** in one unified platform. With **Agentic AI**, **AR-assisted troubleshooting**, and **smart home integration**, users can **extend device lifespans, optimize performance, and avoid unnecessary repair costs**.   Enhancements to AI Capabilities\n🧠 Generative AI (GenAI):\n\nAI-Powered Content Generation: Helps the chatbot generate responses dynamically based on real-time device issues, repair steps, and financial data insights.\nData Analysis: AI interprets user queries, warranty information, energy usage reports, and repair cost predictions using adaptive data models.\nContext-Aware Conversations: The chatbot tailors responses based on the user’s device history and past interactions.\n🗣 Natural Language Processing (NLP):\n\nUser-Friendly Chatbot Interactions: Understands complex queries, recommends troubleshooting steps, and explains technical issues in layman’s terms.
\nVoice-Based AI Assistant: Users can interact using voice commands, making hands-free troubleshooting easier.
\nSentiment Analysis: Detects frustration or urgency in user messages and prioritizes critical device issues for faster resolution.




copei em esse site para mim e faça em python  - Copy from this site for me and make it in Python.


 Hi Lovable Team,
    
    I need help building a simple app that integrates with my Monday CRM to streamline sending requests for estimates to multiple suppliers. Below are the requirements and functionality details:
    
    Overview:
    The app's core concept is to quickly send a material list request to all suppliers in a specific group from my Monday CRM. For example, if a contractor needs an estimate for CertainTeed siding, the app will automatically send the material list to all 25 suppliers associated with CertainTeed in NJ in our CRM. This increases the chances of getting multiple estimates and helps save money.
    
    User Flow:
    Landing & Sign-In Pages:
    - Landing Page: A brief introduction to the app.
    - Sign-In Page: Allows users to create an account or log in.
    
    User Dashboard:
    - After signing in, users are redirected to a Dashboard.
    - Dashboard Interface: Contains a simple form with two main input options:
        - Product Selection: A dropdown or selection field where the user chooses the product they need a quote for (e.g., 'CertainTeed Siding'). This selection is used to determine the supplier group from the Monday CRM.
        - Material List Input: A text box where the user pastes the full material list or additional details.
    - Submit Button: Once clicked, the request is submitted and the user is redirected back to their Dashboard where they can view their recently submitted request.
    
    Admin Integration with Monday CRM:
    - On the backend, the app will connect with Monday CRM.
    - For each submitted request:
        - The product selection is used to identify the relevant supplier group (e.g., all suppliers tied to CertainTeed in NJ).
        - The entire material list is then sent automatically to all suppliers in that group (e.g., 25 suppliers).
    - The admin interface (or notification system) should display the submitted request details, including the selected product and material list.
    
    Additional Considerations:
    - Design & User Experience: The app should have a clean and simple design to ensure ease of use.
    - Scalability: While the initial focus is on a basic version (landing, sign-in, dashboard, and admin integration), please structure the app in a way that future enhancements can be added easily.
    - Error Handling: Ensure that if there is an issue with sending requests (e.g., CRM integration failure), both the user and admin are notified appropriately.
    - Security: Ensure that user data and CRM integrations are secure.
    
    Please let me know if you need any additional details or clarifications to get started. Thank you!

Hi Lovable Team,
I need help building a simple app that integrates with my Monday CRM to streamline sending requests for estimates to multiple suppliers.
Below are the requirements and functionality details:
Overview:
The app's core concept is to quickly send a material list request to all suppliers in a specific group from my Monday CRM.
For example, if a contractor needs an estimate for CertainTeed siding, the app will automatically send the material list to all 25 suppliers associated with CertainTeed in NJ in our CRM. This increases the chances of getting multiple estimates and helps save money.
    User Flow:
    Landing & Sign-In Pages:
    Landing Page: A brief introduction to the app.
    Sign-In Page: Allows users to create an account or log in.
User Dashboard:
After signing in, users are redirected to a Dashboard.
Dashboard Interface: Contains a simple form with two main input options:
Product Selection: A dropdown or selection field where the user chooses the product they need a quote for (e.g., 'CertainTeed Siding'). This selection is used to determine the supplier group from the Monday CRM.
Material List Input: A text box where the user pastes the full material list or additional details.
Submit Button: Once clicked, the request is submitted and the user is redirected back to their Dashboard where they can view their recently submitted request.

Admin Integration with Monday CRM:
On the backend, the app will connect with Monday CRM.
For each submitted request:
The product selection is used to identify the relevant supplier group (e.g., all suppliers tied to CertainTeed in NJ).
The entire material list is then sent automatically to all suppliers in that group (e.g., 25 suppliers).
The admin interface (or notification system) should display the submitted request details, including the selected product and material list.

Additional Considerations:
Design & User Experience: The app should have a clean and simple design to ensure ease of use.
Scalability: While the initial focus is on a basic version (landing, sign-in, dashboard, and admin integration), please structure the app in a way that future enhancements can be added easily.
Error Handling: Ensure that if there is an issue with sending requests (e.g., CRM integration failure), both the user and admin are notified appropriately.
Security: Ensure that user data and CRM integrations are secure.

Please let me know if you need any additional details or clarifications to get started. Thank you!""")



"## Product requirements\n- The user is building a SaaS platform named \"Planaris\" for standardized construction materials.\n- The platform includes:\n  - A landing page with a welcome message \"Le damos la bienvenida a Planaris\" and a bilingual materials table.\n  - CRUD functionalities for managing customer entities (Nombre Cliente, Dirección, Teléfono, Email, Nombre contacto principal, CUIT / CUIL).\n  - Backend connected to Supabase with Google account authentication.\n  - A navigation bar with links to \"Proyectos,\" \"Clientes,\" and \"Mi Perfil.\"\n  - CRUD functionality for managing \"Projects\" (Nombre del proyecto, Locación, Cliente).\n  - A \"Presupuesto\" action in the Projects table to initiate construction quotes, with a new \"Presupuestos\" page summarizing project and client information.\n  - An editable \"Tareas / Actividades\" table on the Presupuesto page for managing tasks.\n  - Management of \"Materiales\" and \"Mano de obra\" entities with independent editable tables on the Presupuesto page, including specific columns and calculations.\n  - Inline editing capabilities and notifications for the Materiales and Mano de obra tables.\n  - A \"Vista previa\" button on the Presupuesto page to open a print preview of the budget, including project and client details, and a unified table of tasks with associated materials and labor.\n  - A redesigned task table in the Print Preview to show a unified list of Materials and Labor grouped by tasks, with specific columns and a calculated total.\n  - Print and Share buttons in the print preview header, with the Share button allowing sending the preview as a PDF via email, pre-filling recipient and title fields.\n  - An email sharing form that allows users to modify the recipient's email and the email title before sending.\n  - A Supabase Edge Function for sending emails using Resend.\n  - A refactored PrintPreviewDialog component into smaller components for better maintainability.\n  - A refactored ProjectForm component into smaller components for better maintainability, including separate files for form fields and form logic.\n  - Proper type definitions and error handling in the ProjectForm component to ensure compliance with Supabase schema requirements.\n  - The Print and Share buttons have been moved inside the Print Preview dialog instead of being on the Presupuesto page.\n  - The \"Vista previa\" button is aligned to the right of the screen.\n  - A properly configured Edge Function for sending PDFs with correct CORS headers and error handling.\n  - The configuration for Supabase Edge Functions has been updated to remove invalid keys.\n  - Implementation of a model for converting the application into a SaaS platform, including subscription plans, user roles, multi-tenancy, and billing considerations.\n\n## Current goals\nThe user is focused on finalizing the implementation of the \"Planaris\" platform. They have set up the landing page, customer management, and project management functionalities. Currently, the user is enhancing the Presupuesto page, which includes an editable tasks table and tables for managing materials and labor costs. They have implemented a print preview feature that displays project and client information along with a detailed task list, redesigned to show a unified list of materials and labor grouped by tasks with calculated totals. The user is also working on adding print and share functionality to the print preview, including email sharing capabilities. Additionally, the user has refactored the code for better maintainability, specifically breaking down the PrintPreviewDialog and ProjectForm components into smaller, more manageable components. The user has resolved TypeScript errors related to the ProjectForm component by ensuring proper type definitions and handling of required fields. Recently, they have moved the print and share buttons to the Print Preview dialog and aligned the preview button to the right of the screen. The user is also addressing issues with the Supabase Edge Function for sending PDFs, ensuring it is properly set up and deployed, and has successfully added the Resend API key for email functionality. The user is currently troubleshooting deployment errors related to the Supabase Edge Function configuration and has made adjustments to the configuration file to resolve these issues. Furthermore, the user is seeking guidance on converting the application into a SaaS platform, considering aspects such as subscription models, user roles, multi-tenancy, and billing."

`