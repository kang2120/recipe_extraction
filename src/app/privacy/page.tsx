// src/app/privacy/page.tsx
import type { Metadata } from 'next'
import styles from './privacy.module.css'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | recipeAI',
  description: 'recipeAI のプライバシーポリシーです。',
}

const LAST_UPDATED = '2026年6月6日'
const CONTACT_EMAIL = 'contact@example.com' // ← あなたのメールアドレスに変更

export default function PrivacyPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <a href="/" className={styles.back}>← recipeAI に戻る</a>

        <h1 className={styles.title}>プライバシーポリシー</h1>
        <p className={styles.updated}>最終更新日：{LAST_UPDATED}</p>

        <section className={styles.section}>
          <h2>1. はじめに</h2>
          <p>
            recipeAI（以下「本サービス」）は、YouTubeのレシピ動画から材料・手順を自動抽出するWebサービスです。
            本プライバシーポリシーは、本サービスの利用に際して収集する情報およびその取り扱いについて説明します。
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. 収集する情報</h2>
          <p>本サービスでは以下の情報を収集する場合があります。</p>
          <ul>
            <li>
              <strong>入力されたYouTube URL</strong>：レシピ抽出の処理にのみ使用し、サーバー上に保存しません。
            </li>
            <li>
              <strong>利用回数（Cookie）</strong>：無料利用回数の管理のため、ブラウザのCookieに当日の利用回数を保存します。個人を特定する情報は含まれません。
            </li>
            <li>
              <strong>アクセスログ</strong>：サーバーのアクセスログ（IPアドレス、ブラウザ情報など）をホスティングサービス（Vercel）が自動的に収集します。
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. 情報の利用目的</h2>
          <p>収集した情報は以下の目的にのみ使用します。</p>
          <ul>
            <li>レシピ抽出サービスの提供</li>
            <li>サービスの品質向上・不正利用防止</li>
            <li>利用状況の統計分析（個人を特定しない形式）</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. 第三者サービスの利用</h2>
          <p>本サービスは以下の第三者サービスを利用しています。</p>

          <h3>Anthropic Claude API</h3>
          <p>
            レシピの解析にAnthropicのClaude APIを使用しています。入力されたYouTube URLおよび動画の字幕テキストがAnthropicのサーバーに送信されます。
            詳細は<a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">Anthropicのプライバシーポリシー</a>をご確認ください。
          </p>

          <h3>YouTube Data API</h3>
          <p>
            動画情報の取得にGoogle LLC のYouTube Data APIを使用しています。
            詳細は<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Googleのプライバシーポリシー</a>をご確認ください。
          </p>

          <h3>Google AdSense</h3>
          <p>
            本サービスでは広告配信にGoogle AdSenseを使用しています。GoogleはCookieを使用してユーザーへの広告配信を行う場合があります。
            詳細は<a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Googleの広告に関するポリシー</a>をご確認ください。
            Googleによる広告のカスタマイズを無効にするには<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">広告設定ページ</a>をご利用ください。
          </p>

          <h3>Vercel</h3>
          <p>
            本サービスはVercel Inc. のインフラ上で動作しています。アクセスログはVercelのポリシーに従って管理されます。
            詳細は<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercelのプライバシーポリシー</a>をご確認ください。
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Cookieについて</h2>
          <p>
            本サービスでは、無料利用回数の管理のためにCookieを使用します。
            Cookieには個人情報は含まれておらず、当日の利用回数のみが記録されます。
            ブラウザの設定からCookieを無効にすることができますが、その場合サービスの一部機能が利用できない場合があります。
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. 情報の第三者提供</h2>
          <p>
            本サービスは、法令に基づく場合を除き、収集した情報を第三者に提供・販売・貸与しません。
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. プライバシーポリシーの変更</h2>
          <p>
            本ポリシーは必要に応じて変更される場合があります。変更後のポリシーはこのページに掲載され、掲載日をもって効力を生じます。
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは、以下のメールアドレスまでご連絡ください。
          </p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </section>
      </div>
    </main>
  )
}
