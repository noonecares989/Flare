import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlareForge AI Studio - Created by CyberSultan',
  description: 'Revolutionary 3D AI-powered full-stack application builder - Created by CyberSultan',
  keywords: ['AI', '3D', 'Code Generation', 'Real-time Collaboration', 'Next.js', 'CyberSultan'],
  authors: [{ name: 'CyberSultan' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <div className="cybersultan-watermark">CyberSultan</div>
        </Providers>
      </body>
    </html>
  );
}