// src/app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import Script from "next/script";
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'recipeAI — YouTubeレシピを瞬時に整理',
  description:
    'YouTubeのURLを貼り付けるだけで、材料・手順・コツを自動抽出。AIが動画の内容を解析して見やすくまとめます。',
  openGraph: {
    title: 'recipeAI',
    description: 'YouTubeレシピを瞬時に整理するAIツール',
    type: 'website',
  },
  other: {
    "google-adsense-account": "ca-pub-1722119470458198", 
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>{children}</body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1722119470458198"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  )
}
