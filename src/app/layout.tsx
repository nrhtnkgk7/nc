import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'No Code | Creative Lab',
  description: '「No Code」に生きていく — 規定に捕らわれず、新しい価値を創造する。',
  openGraph: {
    title: 'No Code | Creative Lab',
    description: '「No Code」に生きていく',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@100;200;300;400;500;600;700&family=Jost:wght@100;200;300;400;500&family=Noto+Sans+TC:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
