// src/app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

const BASE_URL = 'https://recipeextraction.vercel.app'

export const metadata: Metadata = {
  title: 'recipeAI — YouTubeレシピを瞬時に整理',
  description:
    'YouTubeのURLを貼り付けるだけで、材料・手順・コツを自動抽出。AIが動画の内容を解析して見やすくまとめます。',
  openGraph: {
    title: 'recipeAI — YouTubeレシピを瞬時に整理',
    description: 'YouTubeのURLを貼るだけで材料・手順を自動抽出するAIツール',
    type: 'website',
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/ogp.png`,
        width: 1200,
        height: 630,
        alt: 'recipeAI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'recipeAI — YouTubeレシピを瞬時に整理',
    description: 'YouTubeのURLを貼るだけで材料・手順を自動抽出するAIツール',
    images: [`${BASE_URL}/ogp.png`],
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
