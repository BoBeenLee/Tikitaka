import './globals.css';

export const metadata = {
    title: 'Tikitaka - English Conversation Topics',
    description: 'Generate engaging English conversation topics for study groups.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
