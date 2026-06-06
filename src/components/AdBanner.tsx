'use client'
// src/components/AdBanner.tsx
// Google AdSense を設置する場所。
// AdSense 審査が通ったら <ins> タグと Script を追加してください。

import { useEffect } from 'react'
import styles from './AdBanner.module.css'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

// AdSense の設定（審査通過後に入力）
const AD_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX' // ← あなたのパブリッシャーID
const AD_SLOT = 'XXXXXXXXXX'                // ← 広告ユニットID
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export default function AdBanner() {
  useEffect(() => {
    if (!IS_PRODUCTION) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch { /* ignore */ }
  }, [])

  // 開発環境ではプレースホルダーを表示
  if (!IS_PRODUCTION) {
    return (
      <div className={styles.placeholder} aria-hidden="true">
        <p>広告スペース（Google AdSense）</p>
        <p className={styles.placeholderSub}>
          本番環境では Google AdSense 広告が表示されます
        </p>
      </div>
    )
  }

  // 本番環境では実際の AdSense タグを返す
  return (
    <div className={styles.adWrapper}>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
