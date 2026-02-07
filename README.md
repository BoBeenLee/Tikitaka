# Tikitaka - English Conversation Topic Generator

Tikitaka is a Next.js application designed to help English learners practice conversation. It generates engaging questions across various categories using Google's Gemini AI.

[**Live Demo**](https://tikitaka-nine.vercel.app/)

## Features

-   **Dynamic Daily Topics**: Questions are automatically refreshed daily using the Gemini API.
-   **Swipeable Card UI**: Tinder-like interface for browsing questions.
-   **Category Selection**: Choose from topics like Daily Life, Business, Travel, etc.
-   **Random Start**: If no specific question is selected, the app starts at a random question index for variety.
-   **Deep Linking**: Share specific questions via URL (e.g., `/?c=travel&q=5`).

## Getting Started

1.  **Clone the repository**

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file and add your Google Gemini API key:
    ```bash
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment on Vercel

This project is optimized for deployment on Vercel.

### Important Notes for Vercel

1.  **Environment Variables**: Ensure you add `GEMINI_API_KEY` in your Vercel Project Settings.
2.  **Daily Updates Persistence**: 
    -   The application attempts to update topics daily.
    -   **Constraint**: Since Vercel Serverless Functions have a read-only file system, updated topics **cannot be saved permanently to `topics.json`**.
    -   **Behavior**: Updates happen in-memory for the current server instance. If the instance restarts, topics revert to the state in the repository.
    -   **Solution (Optional)**: For permanent storage, integration with a database (e.g., Vercel KV, Postgres) is required.

### Build Configuration

-   The main page is configured with `export const dynamic = 'force-dynamic'` to ensure search parameters (`?q=...`) function correctly without static build errors.

## Tech Stack

-   **Framework**: Next.js 16 (App Router)
-   **AI Model**: Google Gemini Flash (via `@google/generative-ai`)
-   **Styling**: Vanilla CSS, Framer Motion
-   **Deployment**: Vercel

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
