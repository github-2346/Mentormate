import type { Metadata } from 'next';
import { Syne, Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'MentorMate — Real-time Mentorship Platform',
  description: '1-on-1 sessions with video, collaborative code editing, and live chat.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="noise bg-bg-primary min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111118',
              color: '#F0F0FF',
              border: '1px solid #1e1e2e',
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#00D4FF', secondary: '#050507' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#050507' } },
          }}
        />
      </body>
    </html>
  );
}
