import '../globals.css';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const isJa = lang === 'ja';

    return {
        title: {
            default: isJa ? 'Tikitaka - 会話のトピック' : 'Tikitaka - English Conversation Topics',
            template: '%s | Tikitaka',
        },
        description: isJa
            ? '勉強会、クラス、アイスブレイクのための魅力的な会話トピックを生成します。話すことに困ることはもうありません。'
            : 'Generate engaging English conversation topics for study groups, classes, and ice breakers. Never run out of things to talk about.',
        keywords: isJa
            ? ['英会話', 'ESL', '勉強会', 'ディスカッショントピック', 'アイスブレイク', '会話の質問', 'Tikitaka']
            : ['English conversation', 'ESL', 'study group', 'discussion topics', 'ice breakers', 'conversation questions', 'Tikitaka'],
        authors: [{ name: 'Tikitaka Team' }],
        creator: 'Tikitaka Team',
        publisher: 'Tikitaka',
        metadataBase: new URL('https://tikitaka-talk.vercel.app'),
        alternates: {
            canonical: `/${lang}`,
            languages: {
                'en': '/en',
                'ja': '/ja',
            },
        },
        openGraph: {
            title: isJa ? 'Tikitaka - 会話のトピック' : 'Tikitaka - English Conversation Topics',
            description: isJa
                ? '勉強会、クラス、アイスブレイクのための魅力的な会話トピックを生成します。'
                : 'Generate engaging English conversation topics for study groups, classes, and ice breakers.',
            url: `https://tikitaka-talk.vercel.app/${lang}`,
            siteName: 'Tikitaka',
            locale: isJa ? 'ja_JP' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: isJa ? 'Tikitaka - 会話のトピック' : 'Tikitaka - English Conversation Topics',
            description: isJa
                ? '勉強会のための魅力的な会話トピックを生成します。'
                : 'Generate engaging English conversation topics for study groups.',
            creator: '@tikitaka',
        },
        icons: {
            icon: '/favicon.ico',
            shortcut: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
        viewport: {
            width: 'device-width',
            initialScale: 1,
            maximumScale: 1,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function RootLayout({ children, params }) {
    const { lang } = await params;
    return (
        <html lang={lang}>
            <body>{children}</body>
        </html>
    );
}
