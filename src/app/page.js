import fs from 'fs';
import path from 'path';
import ClientPage from './client-page';

// 1. ISR Configuration (Revalidate every hour)
export const revalidate = 3600;

async function getTopics() {
    // Simulate fetching from an external API or DB
    // In a real ISR scenario, this would be a fetch() call.
    // For file-based data in Next.js, we read the file at build time/revalidation time.
    const filePath = path.join(process.cwd(), 'src/app/data/topics.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export default async function Home() {
    const data = await getTopics();

    return (
        <main>
            <ClientPage categories={data.categories} />
        </main>
    );
}
