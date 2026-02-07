import './globals.css';

export const metadata = {
    title: {
        default: 'Tikitaka - English Conversation Topics',
        template: '%s | Tikitaka',
    },
    description: 'Generate engaging English conversation topics for study groups, classes, and ice breakers. Never run out of things to talk about.',
    keywords: ['English conversation', 'ESL', 'study group', 'discussion topics', 'ice breakers', 'conversation questions', 'Tikitaka'],
    authors: [{ name: 'Tikitaka Team' }],
    creator: 'Tikitaka Team',
    publisher: 'Tikitaka',
    metadataBase: new URL('https://tikitaka-talk.vercel.app'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Tikitaka - English Conversation Topics',
        description: 'Generate engaging English conversation topics for study groups, classes, and ice breakers.',
        url: 'https://tikitaka-talk.vercel.app',
        siteName: 'Tikitaka',
        locale: 'en_US',
        type: 'website',

    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tikitaka - English Conversation Topics',
        description: 'Generate engaging English conversation topics for study groups.',

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

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
