import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  title: 'No Code Taipei | 無代碼台北',
  description: '來自東京的私人料理體驗，在台北品味無界限的美食哲學。No Code Taipei — 完全推薦制高級餐廳。',
  openGraph: {
    title: 'No Code Taipei | 無代碼台北',
    description: '來自東京的私人料理體驗，在台北品味無界限的美食哲學。',
    type: 'website',
    locale: 'zh_TW',
  },
};

export default function TaipeiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
