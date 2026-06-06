// src/app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>{children}</body>
    </html>
  )
}
