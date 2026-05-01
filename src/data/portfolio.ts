// src/data/portfolio.ts

export const personal = {
  name: 'Shakoor Shaik',
  age: 20,
  location: '🇨🇦 Toronto, ON',
  email: 'shakoorshaik7@gmail.com',
  github: 'https://github.com/shakoorshaik',
  githubwebsite: 'https://github.com/ShakoorShaik/shakoorshaik.github.io',
  linkedin: 'https://linkedin.com/in/shakoorshaik',
  university: 'University of Toronto Scarborough',
  degree: 'B.Sc. Computer Science — Software Engineering',
  graduation: 'April 2028 (Expected)',
}

export type ProjectLink = {
  label: string
  url: string
  icon: 'github' | 'external' | 'download' | 'demo' | 'play'
}

export type Project = {
  title: string
  period: string
  description: string
  tech: string[]
  links: ProjectLink[]
  image: string | null
  demoVideo: string | null
  featured: boolean
  readme: string
}

export const projects: Project[] = [
  {
    title: 'SmartAir Health',
    period: 'Fall 2025',
    description:
      'Full-stack Android health platform serving children, parents, and providers with real-time asthma zone monitoring, Firebase backend, and gamified adherence tracking.',
    tech: ['Java', 'Kotlin', 'Firebase', 'Jetpack Compose', 'Android', 'JUnit', 'Espresso'],
    links: [
      { label: 'Source Code', url: 'https://github.com/ShakoorShaik/smartair-android-app', icon: 'github' },
    ],
    image: '/assets/projects/smart-air.png',
    demoVideo: 'https://github.com/user-attachments/assets/5dccf876-4035-4406-8a99-d6700c6d609d',
    featured: true,
    readme: `## Overview

SmartAir is a comprehensive asthma management platform for children, parents, and healthcare providers. Built as a native Android application, it enables real-time respiratory health monitoring across three interconnected user roles in a single connected system.

The platform centres on the **asthma zone system** — a clinically recognized framework classifying respiratory control based on Peak Expiratory Flow (PEF) readings:

| Zone | PEF Range | Meaning |
|------|-----------|---------|
| Green | 80–100% of personal best | Good control |
| Yellow | 50–80% of personal best | Caution |
| Red | Below 50% of personal best | Emergency |

---

## Features

### Child
- Live zone status card with one-tap emergency alert and guided response steps
- Daily check-ins and inhaler usage logging (rescue vs. controller medication)
- Canister level tracking with low-canister push notifications
- Gamified task and badge system with streak tracking to encourage adherence

### Parent
- Multi-child monitoring dashboard with real-time zone status
- Medicine management with expiry dates, canister tracking, and calendar view
- Adherence scheduling and historical PEF trend review
- Health history PDF export with configurable provider visibility controls

### Provider
- Patient overview with PEF analytics visualized over time
- Adherence reports and rescue medication usage trend analysis
- Trigger and symptom pattern identification
- Emergency and triage history review

---

## Architecture

The app uses a hybrid architecture combining **MVP (Model-View-Presenter)** for the authentication layer with a **Manager/Singleton pattern** for domain data operations. Each manager encapsulates Firestore reads and writes with interface-based async callbacks — keeping business logic entirely decoupled from the UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java (primary), Kotlin (Compose + build scripts) |
| UI | Jetpack Compose + XML Layouts |
| Database | Firebase Firestore |
| Auth | Firebase Authentication — email/password, role-based routing |
| Charting | MPAndroidChart |
| PDF Export | iText7 |
| Testing | JUnit 4, Mockito, Espresso |
| Build | Gradle 8.13 with Kotlin DSL |`,
  },
  {
    title: 'Okra',
    period: 'Winter 2026',
    description:
      'AI-powered home care routing platform for elderly residents — voice-to-request dispatch, IBM watsonx.ai Granite 3, real-time Supabase sync, and a 3D Mapbox provider map. Built for UofT GenesisAI.',
    tech: ['Next.js', 'TypeScript', 'IBM watsonx.ai', 'Supabase', 'Mapbox GL', 'Tailwind CSS', 'Framer Motion'],
    links: [
      { label: 'Source Code', url: 'https://github.com/ShakoorShaik/okra', icon: 'github' },
      { label: 'Live Demo', url: 'https://okra-theta.vercel.app', icon: 'external' },
    ],
    image: '/assets/projects/okra.png',
    demoVideo: 'https://github.com/user-attachments/assets/f512d512-22e0-4889-a413-f2fbb74a738e',
    featured: true,
    readme: `## Overview

Ontario faces a critical care gap: over **50,000 seniors** require long-term home care, yet fewer than **7,000 registered caregivers** are actively available. Okra replaces the current phone-and-spreadsheet dispatch process with an AI-native routing pipeline.

**Built for UofT GenesisAI Hackathon**

---

## How It Works

1. Seniors **speak** their care needs — Okra transcribes and classifies via IBM watsonx.ai Granite 3
2. Caregivers **see** nearby, priority-ranked requests on a live 3D Mapbox map
3. IBM Granite 3 **generates** a personalized care plan the moment a provider accepts
4. Patients **confirm** their assigned caregiver in one tap — a real-time two-sided handshake
5. An **AI scheduling agent** lets providers manage their full schedule through natural language

---

## Key Features

### For Care Seekers
- Voice-to-request with real-time NLP classification of services, urgency, and time preferences
- 14 categorized care service types across High, Medium, and Low urgency
- Live appointment tracking from pending through confirmed to completed
- One-tap caregiver confirmation or decline

### For Care Providers
- 3D live Mapbox GL map with colour-coded urgency markers and pulsing animations
- **Best Picks engine** — geolocation and urgency scoring surfaces the top 3 optimal requests
- AI-generated care plans with step-by-step briefings, required items, and safety notes
- Natural language scheduling agent powered by IBM Granite 3
- Nearest-neighbour TSP algorithm for optimized daily route planning

---

## IBM watsonx.ai Integration

Three distinct agents power the platform using ibm/granite-3-8b-instruct:

| Agent | Endpoint | Purpose |
|-------|----------|---------|
| Router | /api/parse-request | Classifies voice transcripts into structured care data |
| Planner | /api/generate-care-plan | Generates personalized visit briefings on acceptance |
| Scheduler | /api/agent | Multi-turn conversational schedule management |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| Map | Mapbox GL JS v3 — 3D buildings, custom markers, route layers |
| AI / NLP | IBM watsonx.ai — Granite 3 8B Instruct |
| Database | Supabase — PostgreSQL + Realtime + Auth |
| State | Zustand |
| Speech | Web Speech API |`,
  },
  {
    title: 'Clippy',
    period: 'Fall 2025',
    description:
      '2nd Place Winner at MUES Hackathon TMU 2024 — AI-powered drawing app with a custom multi-layer canvas engine, OpenAI GPT-4 drawing challenges, and a full suite of drawing tools.',
    tech: ['JavaScript', 'p5.js', 'Node.js', 'Express.js', 'OpenAI API'],
    links: [
      { label: 'Source Code', url: 'https://github.com/ShakoorShaik/clippy', icon: 'github' },
      { label: 'Live Demo', url: 'https://clippys.vercel.app', icon: 'external' },
    ],
    image: '/assets/projects/clippy.png',
    demoVideo: 'https://github.com/user-attachments/assets/1f05ed35-a38f-4962-bda8-71261988edc0',
    featured: true,
    readme: `## Overview

Clippy is a modern drawing application inspired by MS Paint with AI-powered drawing challenges — built at the **MUES Hackathon TMU 2024**, where it placed **2nd overall**.

---

## Features

### Drawing Tools
- Brush, eraser, spray paint, line, rectangle, circle, triangle, and text tools
- Full RGB color picker for brush and background colors
- Adjustable brush size (1–50px) with real-time visual feedback

### Advanced Canvas
- **Multi-Layer System** — independent p5.Graphics layers, each with its own undo/redo history
- **Canvas Zoom** — scale from 30% to 300% with keyboard shortcuts
- **Export** — save artwork as PNG files

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| B | Brush tool |
| E | Eraser tool |
| S | Spray tool |
| L | Line tool |
| R | Rectangle tool |
| C | Circle tool |
| T | Text tool |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+S | Save canvas |

### AI Game Mode
- Random drawing challenges generated by OpenAI GPT-4o-mini
- Prompts displayed in the sidebar and as a canvas overlay
- Async API calls to keep the UI responsive at all times

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Graphics | p5.js v1.7.0 |
| Backend | Node.js + Express.js |
| AI | OpenAI API — GPT-4o-mini |
| Frontend | HTML5, CSS3, JavaScript |`,
  },
  {
    title: 'Lvcky',
    period: 'Winter 2026',
    description:
      '2nd Place Winner at MUES Winter Hackathon × Notion TMU 2025 — an AI Life OS that decomposes goals into actionable tasks and syncs them to a relational Notion database.',
    tech: ['JavaScript', 'Node.js', 'Express.js', 'Notion API', 'OpenAI API'],
    links: [
      { label: 'Source Code', url: 'https://github.com/ShakoorShaik/lvcky', icon: 'github' },
      { label: 'Notion Demo', url: 'https://lvcky.notion.site/2f249ff2083f801a8527c6ce2dec63bc', icon: 'external' },
    ],
    image: 'https://github.com/user-attachments/assets/c7512cbe-378d-4ffe-b432-754a3a97879a',
    demoVideo: null,
    featured: true,
    readme: `## Overview

Lvcky is a centralized productivity ecosystem built to engineer a user's life through a structured, relational framework — connecting long-term goals directly to daily actions in one command center.

**Award: 2nd Place Winner @ MUES Winter External Hackathon × Notion TMU 2025**

---

## Problem Statement

- **Goal Breakdown Paralysis** — Users struggle to decompose broad ambitions into manageable actions. Lvcky uses AI to automatically generate building blocks for any goal.
- **Disconnected Data** — Traditional tools separate high-level visions from daily tasks. A relational architecture links every task directly to monthly, quarterly, or yearly goals.
- **Entry Friction** — A minimalist search-bar interface enables rapid data entry and one-click Notion sync.
- **Lack of Reflection** — Built-in Daily Life Logs and Monthly Reviews with scoring systems ensure long-term accountability.

---

## How It Works

1. User enters a goal in the minimalist search-bar interface
2. OpenAI GPT-4o-mini decomposes it into exactly **5 actionable tasks** — output as structured JSON
3. One click creates a linked Goal page and 5 Task pages in Notion with pre-set priorities and deadlines
4. Notion formulas provide real-time countdown and status alerts (e.g., "Due Tomorrow", "Overdue")
5. Daily Life Logs and Monthly Reviews track adherence and progress scoring over time

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| AI | OpenAI API — GPT-4o-mini |
| Database | Notion API — Goals, Tasks, Daily Logs, Monthly Reviews |
| Frontend | Minimalist HTML/CSS/JavaScript interface |`,
  },
  {
    title: 'Nautica',
    period: 'Winter 2026',
    description:
      'Won Most Creative Implementation & 3rd Place at Code Clash UofT 2026 — an autonomous AI Battleship bot using a Hunt-Target algorithm, probability density mapping, and expected-value ability selection.',
    tech: ['Python', 'Algorithms', 'Probability Mapping', 'Heuristics'],
    links: [
      { label: 'Source Code', url: 'https://github.com/ShakoorShaik/battleship-ai-agent', icon: 'github' },
    ],
    image: '/assets/projects/nautica-bot.png',
    demoVideo: null,
    featured: true,
    readme: `## Overview

Nautica is an autonomous AI bot built for the **Code Clash: Battleship Challenge** at the University of Toronto — engineered under strict 10-hour hackathon constraints with no external dependencies.

**Awards: Winner of Most Creative Implementation and 3rd Place at Code Clash UofT Winter 2026**

---

## AI Strategy

### Ship Placement
Deterministic, rule-safe placements designed to minimize exposure to area-of-effect attacks and resist common targeting heuristics such as edge scanning and heat-map patterns.

### Hunt to Target Algorithm

- **Hunt Mode** — Searches unexplored cells using a lightweight probability density map, avoiding already-eliminated regions for maximum information gain
- **Target Mode** — Triggered on a confirmed hit; prioritizes adjacent cells consistent with ship geometry until the ship is fully sunk
- **Ability Deployment** — Special abilities are only deployed when their expected value exceeds a standard attack

### Design Philosophy
No machine learning was used. The bot favors interpretable, deterministic algorithms suitable for time-critical, single-file execution environments — every decision is traceable and explainable.

---

## Methodologies

- Heuristic-Based Decision Making
- Probability Mapping (Lightweight, Non-ML)
- Hunt-and-Target Battleship Algorithm
- Expected Value Comparison for Ability Selection
- Defensive Programming with Fallback Logic

---

## Tech Stack

| Detail | Value |
|--------|-------|
| Language | Python 3 |
| Libraries | Standard library only — json, sys, random |
| Constraints | Single executable file, max 3 seconds per move |
| Interface | Reads game state JSON, outputs a single valid JSON move |`,
  },
  {
    title: 'AI Course Planner UofT',
    period: 'Fall 2024',
    description:
      'Full-stack course planning tool for 15,000+ UofT students — prerequisite chain visualization, program requirement tracking, peer course ratings, and AI-powered course recommendations.',
    tech: ['JavaScript', 'Flask', 'Python', 'MySQL', 'HTML', 'CSS'],
    links: [
      { label: 'Source Code', url: 'https://github.com/ShakoorShaik/ai-course-planner', icon: 'github' },
    ],
    image: '/assets/projects/course-planner.png',
    demoVideo: null,
    featured: false,
    readme: `## Overview

UTSC Path Builder is a full-stack course planning tool designed to help students at the **University of Toronto Scarborough** efficiently navigate their academic journey — from prerequisite chains to graduation requirements.

**Team: Built collaboratively with Kevin, Maria, Mohamad, Madafue, and Shakoor (team of 5)**

---

## Features

- **My Courses** — View and manage completed and planned courses in one place
- **Course Prerequisites** — Visualize prerequisite chains to plan your academic path forward
- **Program Requirements** — Verify degree requirements against your completed coursework at a glance
- **Course Ratings** — View peer-contributed ratings and submit your own feedback
- **Course Recommendations** — Personalized course suggestions based on your academic history and goals
- **Course Feedback** — Share insights to improve the recommendation engine for future students

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Flask (Python) |
| Database | MySQL / PostgreSQL |
| Deployment | SSH-tunneled remote server |`,
  },
  {
    title: 'DS3 Datathon',
    period: 'Winter 2025',
    description:
      'Shallow learning models submitted to the DS3 Datathon 2025 at UofT — tackling three classification challenges: car evaluation, accident severity prediction, and fungi species classification.',
    tech: ['Python', 'scikit-learn', 'pandas', 'NumPy', 'Jupyter Notebook'],
    links: [
      { label: 'Source Code', url: 'https://github.com/ShakoorShaik/ds3-hackathon-shallow-learning-models', icon: 'github' },
    ],
    image: '/assets/projects/ds3.png',
    demoVideo: null,
    featured: false,
    readme: `## Overview

A collection of shallow learning models submitted to the **DS3 Datathon 2025** at the University of Toronto — tackling three classification challenges across diverse real-world datasets.

---

## Datasets and Tasks

| Dataset | Task | Type |
|---------|------|------|
| Car Evaluation | Predict car acceptability (good, acceptable, unacceptable) | Multi-class classification |
| Classifying Accidents | Predict accident severity from feature data | Binary/multi-class classification |
| Fungi Classification | Classify mushroom species from image data | Image classification |

---

## Approach

Each dataset was approached using classic shallow learning techniques — deliberate model selection, feature engineering, and hyperparameter tuning — rather than deep learning, reflecting the datathon's shallow learning constraint. Models were evaluated using cross-validation and compared on leaderboard metrics.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Python 3 | Core language |
| scikit-learn | Model training, cross-validation, and evaluation |
| pandas | Data loading and preprocessing |
| NumPy | Numerical operations |
| Jupyter Notebook | Exploratory analysis and submission pipeline |`,
  },
  {
    title: 'Wine Quality Regression',
    period: 'Spring 2026',
    description:
      'Comparative regression study on the UCI Wine Quality dataset using KNN, basis-function regression, local Bayesian regression, ANN, and symbolic regression.',
    tech: ['Python', 'NumPy', 'scikit-learn', 'Jupyter Notebook', 'Machine Learning'],
    links: [
      { label: 'Source Code', url: 'https://github.com/ShakoorShaik/wine-quality-regression', icon: 'github' },
    ],
    image: '/assets/projects/wine.png',
    demoVideo: null,
    featured: false,
    readme: `## Overview

Wine Quality Regression explores multiple regression paradigms on the UCI Wine Quality dataset to evaluate predictive performance, interpretability, and model behavior across different hypothesis classes.

The project implements and compares:
- K-Nearest Neighbors Regression (KNN)
- Basis Function Regression (BFR)
- Local Bayesian Regression (LBR)
- Artificial Neural Networks (ANN)
- Symbolic Regression (SR)

---

## Objective

Build a reproducible benchmarking pipeline that answers a practical question:
**Which regression family best balances predictive accuracy and interpretability for tabular wine chemistry data?**

---

## Methodology

1. Prepare and standardize wine feature data from the UCI Wine Quality dataset
2. Train each regression model with method-specific tuning
3. Evaluate predictions on shared validation/test splits
4. Compare metrics and error patterns across all approaches
5. Summarize strengths and trade-offs for each model class

---

## Why This Project Matters

- Demonstrates breadth across classical, probabilistic, neural, and symbolic regression
- Highlights practical model-selection trade-offs, not just one-off leaderboard scores
- Serves as a compact reference project for supervised learning experimentation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Python |
| ML Methods | KNN, Basis Function Regression, Local Bayesian Regression, ANN, Symbolic Regression |
| Data | UCI Wine Quality Dataset |
| Analysis | Jupyter-style experimentation + script-based pipelines |`,
  },
  {
    title: 'FINCH Smile & Keystone Correction',
    period: 'Summer 2025',
    description:
      'Satellite data-processing work to correct smile and keystone geometric distortions in FINCH hyperspectral imagery as part of an end-to-end calibration pipeline.',
    tech: ['Python', 'NumPy', 'Jupyter Notebook', 'Testing', 'Poetry'],
    links: [
      { label: 'Source Code', url: 'https://github.com/utat-ss/FINCH-smile_keystone', icon: 'github' },
    ],
    image: '/assets/projects/finch.png',
    demoVideo: null,
    featured: false,
    readme: `## Overview

FINCH Smile & Keystone Correction is a geometric calibration project focused on removing two critical distortions in hyperspectral satellite data:

- **Smile distortion**: spectral band misalignment along the spectral dimension
- **Keystone distortion**: spatial misalignment across detector columns

This work supports Level 1B geometric correction in the FINCH data-processing pipeline and improves downstream scientific reliability.

---

## Scope

The repository contains correction logic, experiments, and validation workflows for both distortion families, with structure for:
- Core correction modules
- Dataset-driven analysis notebooks
- Unit tests for pipeline reliability
- Documentation and reproducible local setup

---

## Engineering Highlights

- Practical scientific computing workflow with modular Python code
- Separation of analysis notebooks and testable library logic
- Reproducible dependency and environment management with Poetry
- Pre-commit and testing-oriented repository practices

---

## Impact

By reducing geometric distortion before later processing stages, this project improves:
- Spatial/spectral consistency in calibrated imagery
- Confidence in downstream interpretation and measurements
- Robustness of the broader FINCH remote-sensing pipeline

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Python 3 |
| Package Management | Poetry |
| Validation | Unit tests + notebook-based analysis |
| Domain | Hyperspectral geometric correction (smile + keystone) |`,
  },
]

// Tech stack as flat list with icon keys (matching devicon slugs)
export const techStack = [
  { name: 'Python', icon: 'python' },
  { name: 'Java', icon: 'java' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'C', icon: 'c' },
  { name: 'SQL', icon: 'postgresql' },
  { name: 'React', icon: 'react' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'Express', icon: 'express' },
  { name: 'Flask', icon: 'flask' },
  { name: 'FastAPI', icon: 'fastapi' },
  { name: 'Django', icon: 'django' },
  { name: 'scikit-learn', icon: 'scikitlearn' },
  { name: 'TensorFlow', icon: 'tensorflow' },
  { name: 'pandas', icon: 'pandas' },
  { name: 'Firebase', icon: 'firebase' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'MySQL', icon: 'mysql' },
  { name: 'Git', icon: 'git' },
  { name: 'Linux', icon: 'linux' },
  { name: 'Android', icon: 'android' },
  { name: 'p5.js', icon: 'p5js' },
  { name: 'R', icon: 'r' },
  { name: 'Kotlin', icon: 'kotlin' },
]

export const tools = [
  { name: 'VS Code', icon: 'vscode' },
  { name: 'Android Studio', icon: 'androidstudio' },
  { name: 'IntelliJ', icon: 'intellij' },
  { name: 'GitHub', icon: 'github' },
  { name: 'Figma', icon: 'figma' },
  { name: 'Google Cloud', icon: 'googlecloud' },
  { name: 'Jupyter', icon: 'jupyter' },
  { name: 'PyCharm', icon: 'pycharm' },
  { name: 'RStudio', icon: 'rstudio' },
  { name: 'Jira', icon: 'jira' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Postman', icon: 'postman' },
]
