import fs from 'fs';
import path from 'path';
import ClientPage from './client-page';

// 1. Force Dynamic Rendering (Fixes useSearchParams build error)
export const dynamic = 'force-dynamic';
// export const revalidate = 3600; // Conflict with force-dynamic? Let's comment out for now.

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

    return (
        <main>
            <ClientPage categories={topicsData.categories} />
        </main>
    );
}
