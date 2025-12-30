# Vakalath Drafting & e-Filing Portal

An AI-assisted legal drafting system for advocates.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Forms**: React Hook Form + Zod
- **PDF Generation**: pdf-lib
- **DOCX Generation**: docx

## Getting Started

1.  **Install Dependencies**
    ```bash
    pnpm install
    # or
    npm install
    ```

2.  **Environment Setup**
    - Copy `.env.example` to `.env.local`.
    - Fill in your Firebase configuration keys.

3.  **Run Development Server**
    ```bash
    pnpm dev
    # or
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features
- Advocate Login/Signup
- Dashboard for managing drafts
- Vakalath Drafting Form with validation
- AI Refinement (Stubbed in UI)
- PDF and DOCX generation

## Folder Structure
- `/app`: App Router pages and layouts
- `/components`: Reusable UI components
- `/lib`: Utilities (Firebase, Validators, Generators)
