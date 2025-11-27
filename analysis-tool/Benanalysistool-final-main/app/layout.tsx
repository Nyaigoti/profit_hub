import { Suspense } from 'react';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type React from 'react';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Bena Analysis Tool',
    description: 'Real-time Deriv market analysis and trading signals',
    generator: 'v0.app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
                <Suspense fallback={null}>{children}</Suspense>
                <Analytics />
            </body>
        </html>
    );
}
