import fs from 'fs';
import path from 'path';
import ClientPage from '../client-page'; // Adjusted path

// 1. Force Dynamic Rendering (Fixes useSearchParams build error)
export const dynamic = 'force-dynamic';

async function getTopics(lang = 'en') {
    // Determine file based on lang
    // Security check: simple allowlist
    const validLangs = ['en', 'ja'];
    const safeLang = validLangs.includes(lang) ? lang : 'en';

    try {
        const fileName = `topics.${safeLang}.json`;
        const filePath = path.join(process.cwd(), 'src/app/data', fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) {
        console.error(`Error reading ${fileName}:`, e);
        // Fallback to en if ja fails
        if (safeLang !== 'en') {
            try {
                const fallbackPath = path.join(process.cwd(), 'src/app/data', 'topics.en.json');
                return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
            } catch (e2) {
                return { categories: [] };
            }
        }
        return { categories: [] };
    }
}

export default async function Home({ params }) {
    // In Next.js 15+, params is a Promise
    const { lang } = await params;
    let topicsData = await getTopics(lang);

    return (
        <main>
            <ClientPage categories={topicsData.categories} lang={lang} />
        </main>
    );
}
