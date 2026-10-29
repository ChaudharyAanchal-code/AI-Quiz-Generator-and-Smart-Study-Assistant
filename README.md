# AI-Quiz-Generator-and-Smart-Study-Assistant
**AI Quiz Generator and Smart Study Assistant** is a beginner-friendly web development project designed to make learning easier, faster, and more interactive through artificial intelligence. The application helps students understand academic concepts and prepare concise revision notes using a simple, user-friendly web interface.

The project is developed using **HTML5, CSS3, and JavaScript**, with integration of the browser’s native **LanguageModel Prompt API**, where supported. It demonstrates how modern web technologies can be combined with browser-based AI capabilities to create an accessible digital learning assistant without requiring a separate backend server or an external AI API key.

## Table of Contents

- [Overview](#overview)
- [Technologies Used]
- [Learning Objectives]
- [Future Enhancements]
- [Architecture & Edge AI Comparison](#architecture--edge-ai-comparison)
- [Key Features](#key-features)
- [System Workflow](#system-workflow)
- [Project Directory Structure](#project-directory-structure)
- [Prerequisites & Browser Configuration](#prerequisites--browser-configuration)
- [Quick Start Guide](#quick-start-guide)
- [Prompt Engineering & Core Logic](#prompt-engineering--core-logic)
- [Design System & Accessibility](#design-system--accessibility)
- [Troubleshooting & FAQs](#troubleshooting--faqs)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

The **AI Quiz Generator and Smart Study Assistant** is an educational web application designed to assist students and educators in analyzing complex topics. Given a single topic prompt, the system generates:

1. **Simplified Concept Explanations:** Real-world examples tailored for student comprehension.
2. **Revision Summaries:** Structured breakdowns presented in 3 to 5 clear bullet points.

Unlike conventional web applications that rely on cloud-hosted API services (such as OpenAI or Anthropic) and transmit user data over external networks, this application executes generative AI inference **entirely on the local client device** via Chromium's native `window.LanguageModel` interface (Gemini Nano).

---
### Technologies Used

**Frontend:** HTML5, CSS3, JavaScript  
**AI Integration:** Browser-native LanguageModel Prompt API  
**Development Tools:** Visual Studio Code and a modern web browser  
**Version Control:** Git and GitHub

### Learning Objectives

This project demonstrates practical skills in frontend development, DOM manipulation, event handling, asynchronous JavaScript, API availability checks, user input validation, error handling, and responsive web design. It also introduces students to the possibilities and limitations of integrating AI into web applications.

### Future Enhancements

Future versions could include automatic multiple-choice question generation, interactive quizzes, answer evaluation, scoring, difficulty levels, flashcards, saved study history, and downloadable revision notes.

**Note:** AI functionality depends on browser support and configuration. The current version focuses on topic explanations and summaries; a complete interactive quiz system can be added as a future enhancement.

This project is suitable for academic learning, experimentation with browser-based AI, and showcasing beginner-level AI and web development skills on GitHub.

## Architecture & Edge AI Comparison

| Metric / Requirement | Traditional Cloud AI Architecture | AI Smart Study Assistant (On-Device) |
| :--- | :--- | :--- |
| **Data Privacy** | Inbound requests sent to third-party endpoints | **100% On-Device**: Zero data transmitted off-device |
| **Operational Costs** | Variable cloud API usage fees | **Zero Costs**: Local client-side evaluation |
| **Authentication** | API keys and secret token management required | **None**: No key management or server auth required |
| **Backend Infrastructure** | Server runtime required (Node.js, Python, DB) | **Serverless Static Application**: Pure client-side HTML/JS |
| **Network Dependency** | Active network connection required | **Offline Capabilities**: Full offline availability after initialization |
| **Inference Latency** | Affected by network overhead and server queues | **Hardware Accelerated**: Direct CPU / GPU / NPU execution |

---

## Key Features

- **Concept Explanation:** Formulates structured prompt inputs to produce accessible topic explanations with relevant real-world context.
- **Revision Summaries:** Generates concise revision material constrained to 3–5 high-yield bullet points.
- **Session Optimization:** Reuses a single persistent `aiSession` instance across user queries to eliminate runtime latency and minimize memory consumption.
- **Runtime Monitoring:** Dynamically monitors Prompt API availability and reports execution states:
  - **Preparing:** Verifying local engine status or processing model weights.
  - **Ready:** AI engine initialized for prompt execution.
  - **Unavailable:** Reports browser or hardware compatibility issues.
- **Concurrency Guarding:** Disables interactive controls and displays active status indicators during inference tasks to prevent duplicate submissions.
- **Clipboard Integration:** Asynchronous Clipboard API implementation (`navigator.clipboard.writeText`) with interactive user feedback.
- **Interface Reset:** Complete state clearing mechanism to safely reset input contexts and output fields.
- **Accessibility Standards:** Built with mobile-responsive dynamic layouts, standard ARIA properties (`role="status"`, `aria-live="polite"`), and support for system motion settings (`prefers-reduced-motion`).

---

## System Workflow

```
flowchart TD
    User(["User Input"]) -->|Topic Input| Input["Textarea (#topicInput)"]
    User -->|Action Trigger| Triggers{"Task Selection"}

    Triggers -->|Explain Topic| T1["Task: Explain"]
    Triggers -->|Create Summary| T2["Task: Summary"]

    subgraph AppLogic ["Application Logic (script.js)"]
        Init["setupAI() Initialization"]
        Detect{"Detect 'LanguageModel'"}
        Avail{"LanguageModel.availability()"}
        CreateSession["aiSession = await LanguageModel.create()"]
        PromptEngine["Prompt Formulation"]
        LockUI["Disable Controls"]
        InferenceCall["await aiSession.prompt(prompt)"]
        UnlockUI["Enable Controls"]
    end

    subgraph BrowserEngine ["Chromium Runtime & Hardware"]
        LocalModel[("Gemini Nano Model Weights (~1.5GB)")]
        NPU_GPU["Client Hardware Acceleration"]
    end

    Init --> Detect
    Detect -- Unsupported --> ErrStatus["Status: Browser Unsupported"]
    Detect -- Supported --> Avail
    Avail -- Ready --> CreateSession
    CreateSession --> LocalModel
    CreateSession --> ReadyStatus["Status: Model Ready"]

    T1 --> PromptEngine
    T2 --> PromptEngine
    PromptEngine --> LockUI
    LockUI --> InferenceCall
    InferenceCall --> LocalModel
    LocalModel --> NPU_GPU
    NPU_GPU --> InferenceCall
    InferenceCall --> UnlockUI
    UnlockUI --> ResultBox["Render Output (#resultBox)"]
    ResultBox --> CopyBtn["Copy Action (#copyButton)"]
```

---

## Project Directory Structure

```text
ai-study-assistant/
├── index.html                  # Core HTML markup and accessible interface elements
├── style.css                   # CSS design tokens, modern layout structures, and responsive rules
├── script.js                   # Main application controller, lifecycle management, and Prompt API interaction
├── README.md                   # Technical documentation and setup guide
└── PROJECT_REPORT_SUMMARY.md   # Extended system specification and project report
```

### File Technical Summary

- **`index.html`:** Implements semantic structure (`<main>`, `<header>`, `<section>`), embeds typography imports, and handles accessibility attributes.
- **`style.css`:** Defines layout properties, CSS custom variables, UI state styling, and animation parameters.
- **`script.js`:** Manages DOM events, validates API presence (`window.LanguageModel`), executes model queries, and manages local memory state.
- **`PROJECT_REPORT_SUMMARY.md`:** Comprehensive technical specification containing architectural breakdowns and performance assessments.

---

## Prerequisites & Browser Configuration

This project relies on the **W3C / Chromium Web Incubator Community Group (WICG) Built-in Prompt API**. A compatible web browser is required (such as **Google Chrome 128+**, **Chrome Canary**, or **Chromium Dev Channel**).

### 1. Configure Feature Flags

If native support is not active by default:

1. Open Chrome and navigate to:
   ```text
   chrome://flags/#prompt-api-for-gemini-nano
   ```
   Set value to **Enabled**.

2. Navigate to:
   ```text
   chrome://flags/#optimization-guide-on-device-model
   ```
   Set value to **Enabled BypassPerfRequirement** (or **Enabled**).

3. Select **Relaunch** to apply configuration changes.

### 2. Confirm Local Model Weights

1. Navigate to:
   ```text
   chrome://components
   ```
2. Locate the **Optimization Guide On Device Model** entry.
3. If the version reports `0.0.0.0`, select **Check for update**.
4. The browser will retrieve the Gemini Nano model binaries (~1.5 GB). Once downloaded, the version string will update accordingly.

---

## Quick Start Guide

> **Note:** Prompt API features and Web Clipboard integrations require a **Secure Context** (`https://` or `http://localhost`). Direct invocation via `file:///` protocols will fail due to browser security restrictions.

### Option A: VS Code Live Server (Recommended)
1. Open the project root in **Visual Studio Code**.
2. Launch the project using the **Live Server** extension.
3. Access the running application at `http://127.0.0.1:5500/index.html`.

### Option B: Python HTTP Server
Launch a local HTTP server from the command line:

```bash
# Navigate to the project root
cd path/to/ai-study-assistant

# Start local server on port 8000
python -m http.server 8000
```

Open a browser instance and navigate to:
```text
http://localhost:8000
```

### Option C: Node.js Static Server
```bash
npx serve .
```

---

## Prompt Engineering & Core Logic

The application utilizes zero-shot prompt design patterns optimized for structured edge evaluation:

### 1. Concept Explanation (`task === "explain"`)
```javascript
const prompt = `Explain the topic "${topic}" in easy language for a college student. Use a short explanation and a simple example. Keep the original topic name unchanged.`;
```
- **Audience Scope:** Introductory level academic framing.
- **Constraints:** Enforces concise outputs, structural consistency, and retains exact topic nomenclature.

### 2. Revision Summary (`task === "summary"`)
```javascript
const prompt = `Write a short, clear summary of the topic "${topic}" for a student. Use simple language and 3 to 5 bullet points. Keep the original topic name unchanged.`;
```
- **Formatting Constraint:** Strictly limits output size to 3–5 concise bullet points.
- **Cognitive Load:** Optimized for rapid review and study workflows.

### 3. Lifecycle & Session Re-use
```javascript
// Initialized once during setup
aiSession = await LanguageModel.create();

// Invoked for ongoing user requests without re-allocating memory
const answer = await aiSession.prompt(prompt);
```

---

## Design System & Accessibility

- **Typography System:**
  - **Headings:** Editorial Serif (*Newsreader*) for high visual hierarchy.
  - **Body / Controls:** Clean Sans-Serif (*Figtree*) for reading clarity.
- **Color Palette:**
  - Ink (`--ink: #172042`): High contrast standard text.
  - Primary Indigo (`--primary: #3445c9`): Main interactive components.
  - Teal Accent (`--teal: #0c8c80`): Informational indicators and summary callouts.
  - Neutral Background (`--surface-alt: #f5f7fc`): Low-glare interface backdrop.
- **Accessibility Integration:**
  - Complete keyboard interaction support with explicit `:focus-visible` styling.
  - Non-disruptive ARIA status updates using `aria-live="polite"`.
  - Conditional CSS logic catering to `@media (prefers-reduced-motion)`.

---

## Troubleshooting & FAQs

### The status indicator reports "AI model unavailable".
- **Resolution:** Verify that Google Chrome 128+ is being used and that the `#prompt-api-for-gemini-nano` flag is properly enabled under `chrome://flags`.

### The status remains stuck on "Preparing the on-device AI model...".
- **Resolution:** The browser is downloading the necessary model weights in the background. Check `chrome://components` to verify download progress under **Optimization Guide On Device Model**.

### Clipboard action fails during execution.
- **Resolution:** Verify that the application is running within a secure context (`http://localhost` or `https://`). Operating directly via local file paths (`file:///`) prevents access to browser Clipboard APIs.

---

## Roadmap

- [ ] **Structured Multiple-Choice Quiz Engine:** Implement JSON output constraints to produce structured quiz formats with automated client-side evaluation.
- [ ] **Streaming Token Response (`promptStreaming`):** Integrate token streaming for real-time text generation rendering.
- [ ] **Document Processing:** Client-side document parsing via `pdf.js` to enable direct source document summarization.
- [ ] **Flashcard Export:** Capability to convert generated revision summaries directly into Anki-compatible flashcards.
- [ ] **Progressive Web App Support:** Service worker implementation for offline caching and installation capability.

---

## License

Distributed under the [MIT License](LICENSE).
