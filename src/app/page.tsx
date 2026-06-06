'use client'
// src/app/page.tsx

import { useState, useRef } from 'react'
import type { RecipeData } from './api/extract/route'
import RecipeResult from '@/components/RecipeResult'
import AdBanner from '@/components/AdBanner'
import styles from './page.module.css'

const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [recipe, setRecipe] = useState<RecipeData | null>(null)
  const [error, setError] = useState('')
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadingMessages = [
    '動画の情報を取得中...',
    '字幕を解析しています...',
    'AIがレシピを認識中...',
    '材料と手順を整理中...',
    'もうすぐ完成です...',
  ]

  async function handleExtract() {
    setError('')
    const trimmed = url.trim()

    if (!trimmed) {
      setError('YouTubeのURLを入力してください。')
      inputRef.current?.focus()
      return
    }

    if (!YOUTUBE_REGEX.test(trimmed)) {
      setError('有効なYouTube URLを入力してください。（例: https://youtube.com/watch?v=xxxxx）')
      return
    }

    setLoading(true)
    setRecipe(null)

    // ローディングメッセージをサイクル
    let idx = 0
    setLoadingMsg(loadingMessages[0])
    const interval = setInterval(() => {
      idx = (idx + 1) % loadingMessages.length
      setLoadingMsg(loadingMessages[idx])
    }, 2000)

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'エラーが発生しました。もう一度お試しください。')
        return
      }

      setRecipe(data.recipe)
      setUsage(data.usage)
    } catch {
      setError('ネットワークエラーが発生しました。接続を確認してください。')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-1722119470458198"></meta>
      </head>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoDot} aria-hidden="true" />
          recipe<span className={styles.logoAccent}>AI</span>
        </div>
        <p className={styles.tagline}>
          YouTubeのURLを貼るだけで材料・手順を自動抽出
        </p>
      </header>

      {/* URL入力カード */}
      <section className={styles.inputCard} aria-label="URL入力">
        <div className={styles.urlRow}>
          {/* YouTubeアイコン */}
          <div className={styles.ytIcon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.3 5 12 5 12 5s-4.3 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.9C6.8 19 12 19 12 19s4.3 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.2 3L10 15z" />
            </svg>
          </div>

          <input
            ref={inputRef}
            className={styles.urlInput}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
            placeholder="YouTubeのURLを貼り付け（例: https://youtube.com/watch?v=...）"
            aria-label="YouTube URL"
            disabled={loading}
          />

          <button
            className={styles.extractBtn}
            onClick={handleExtract}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                解析中...
              </>
            ) : (
              <>
                ✦ 抽出する
              </>
            )}
          </button>
        </div>

        <p className={styles.hint}>
          ℹ️ 日本語・英語のレシピ動画に対応。字幕がある動画ほど精度が上がります。
        </p>

        {/* エラーメッセージ */}
        {error && (
          <div className={styles.errorBox} role="alert">
            {error}
          </div>
        )}

        {/* 利用回数表示 */}
        {usage && (
          <p className={styles.usageInfo}>
            本日の利用: {usage.used} / {usage.limit} 回
            {usage.used >= usage.limit && '（上限に達しました）'}
          </p>
        )}
      </section>

      {/* ローディング */}
      {loading && (
        <div className={styles.loadingCard} aria-live="polite">
          <div className={styles.loadingSpinner} aria-hidden="true" />
          <p className={styles.loadingText}>{loadingMsg}</p>
        </div>
      )}

      {/* レシピ結果 */}
      {recipe && !loading && (
        <>
          <RecipeResult recipe={recipe} />
          {/* 広告バナー（AdSense設置場所） */}
          <AdBanner />
        </>
      )}

      {/* フッター */}
      <footer className={styles.footer}>
        <p>© 2026 recipeAI — Powered by Claude API</p>
        <p className={styles.footerLinks}>
          <a href="/privacy">プライバシーポリシー</a>
        </p>
        <p className={styles.footerSub}>
          ※ 本サービスはYouTube動画の字幕・説明文をもとにAIが解析します
        </p>
      </footer>
    </main>
  )
}
