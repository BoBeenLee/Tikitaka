import fs from 'fs';
import path from 'path';
import React from 'react';
import ClientPage from './client-page';

// 1. ISR Configuration (Revalidate every hour)
export const revalidate = 3600;

async function getTopics() {
    // Simulate fetching from an external API or DB
    // In a real ISR scenario, this would be a fetch() call.
    // For file-based data in Next.js, we read the file at build time/revalidation time.
    try {
        const filePath = path.join(process.cwd(), 'src/app/data/topics.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) {
        console.error("Error reading topics.json:", e);
        return { categories: [] };
    }
}

async function saveTopics(data) {
    // In Vercel (Production), file system is read-only.
    // We try to write, but catch the error so the app doesn't crash.
    try {
        const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'topics.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.warn("[WARNING] Failed to save topics.json (Expected in Vercel/Read-only fs):", error.message);
        // We continue without saving. The new questions will be used for this render
        // but won't persist to the next request if the server restarts.
    }
}

export default async function Home() {
    let topicsData = await getTopics();
    const today = new Date().toISOString().split('T')[0];

    // Check if update is needed (Daily Update Logic)
    if (topicsData.lastUpdated !== today) {
        console.log(`[Daily Update] Topics are outdated (Last: ${topicsData.lastUpdated}, Today: ${today}). Updating...`);

        // Dynamic import to keep server-side logic isolated if needed
        const { updateAllTopics } = await import('../lib/topic-generator');

        try {
            // Re-generate questions using Gemini
            // Note: This process might take a few seconds. In a real production app, 
            // this should be a background job or a separate API route called by a cron job.
            // For this demo, we do it lazily on the first request of the day.
            const updatedTopics = await updateAllTopics(topicsData.categories);

            if (updatedTopics && updatedTopics.categories.length > 0) {
                updatedTopics.lastUpdated = today;
                await saveTopics(updatedTopics);
                topicsData = updatedTopics; // Use new data for this render
                console.log("[Daily Update] Topics updated successfully.");
            }
        } catch (error) {
            console.error("[Daily Update] Failed to update topics:", error);
            // Gracefully degrade to showing old data
        }
    }

    return (
        <main>
            <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
                <ClientPage categories={topicsData.categories} />
            </React.Suspense>
        </main>
    );
}
