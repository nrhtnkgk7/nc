import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  title: 'No Code | Creative Lab — 米澤文雄',
  description: '「No Code」に生きていく。規定に捕らわれず、新しい価値を創造する。Chef+ 米澤文雄が主宰するクリエイティブラボ。',
  keywords: ['No Code', 'ノーコード', '米澤文雄', 'レストラン', '西麻布', 'Chef+'],
  openGraph: {
    title: 'No Code | Creative Lab',
    description: '「No Code」に生きていく — 規定に捕らわれず、新しい価値を創造する。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'No Code, Inc.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'No Code | Creative Lab',
    description: '「No Code」に生きていく',
  },
  robots: { index: true, follow: true },
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
