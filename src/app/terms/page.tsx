// src/app/terms/page.tsx
import type { Metadata } from 'next'
import styles from './terms.module.css'

export const metadata: Metadata = {
  title: '利用規約 | recipeAI',
  description: 'recipeAI の利用規約です。',
}

const LAST_UPDATED = '2026年6月6日'
const CONTACT_EMAIL = 'kangmc1011@gmail.com' // ← あなたのメールアドレスに変更

export default function TermsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <a href="/" className={styles.back}>← recipeAI に戻る</a>

        <h1 className={styles.title}>利用規約</h1>
        <p className={styles.updated}>最終更新日：{LAST_UPDATED}</p>

        <section className={styles.section}>
          <h2>第1条（適用）</h2>
          <p>
            本利用規約（以下「本規約」）は、recipeAI（以下「本サービス」）の利用条件を定めるものです。
            ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。
            本サービスを利用した時点で、本規約に同意したものとみなします。
          </p>
        </section>

        <section className={styles.section}>
          <h2>第2条（サービスの内容）</h2>
          <p>
            本サービスは、YouTubeの動画URLを入力することで、AIがその動画の内容を解析し、
            レシピの材料・手順・コツを自動的に抽出・表示するWebサービスです。
          </p>
          <p>
            本サービスは字幕・説明文等をもとにAIが解析するものであり、
            抽出結果の完全性・正確性を保証するものではありません。
          </p>
        </section>

        <section className={styles.section}>
          <h2>第3条（無料利用の制限）</h2>
          <p>
            無料ユーザーは1日あたり3回までレシピ抽出機能を利用できます。
            利用回数はブラウザのCookieで管理されており、日本時間の午前0時にリセットされます。
          </p>
        </section>

        <section className={styles.section}>
          <h2>第4条（禁止事項）</h2>
          <p>ユーザーは本サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ul>
            <li>法令または公序良俗に違反する行為</li>
            <li>本サービスのサーバーに過度な負荷をかける行為（自動化ツールによる大量アクセス等）</li>
            <li>本サービスを商業目的で無断利用する行為</li>
            <li>本サービスのリバースエンジニアリング・改ざんを行う行為</li>
            <li>他のユーザーまたは第三者に不利益・損害を与える行為</li>
            <li>その他、当サービスが不適切と判断する行為</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>第5条（知的財産権）</h2>
          <p>
            本サービスが生成・表示するレシピ情報は、YouTubeの動画コンテンツをもとにAIが解析したものです。
            元の動画の著作権はそれぞれの動画制作者に帰属します。
            本サービスが提供する情報の著作権は、当サービスまたは正当な権利を有する第三者に帰属します。
          </p>
        </section>

        <section className={styles.section}>
          <h2>第6条（免責事項）</h2>
          <p>
            本サービスは、レシピ情報の正確性・完全性・有用性を保証しません。
            本サービスを利用して行った調理・食事によって生じた損害について、当サービスは一切の責任を負いません。
          </p>
          <p>
            また、本サービスはシステムの安定稼働を努力目標としますが、
            サービスの継続的な提供を保証するものではなく、
            予告なくサービスを変更・中断・終了する場合があります。
          </p>
        </section>

        <section className={styles.section}>
          <h2>第7条（サービスの変更・終了）</h2>
          <p>
            当サービスは、ユーザーへの事前通知なく、本サービスの内容を変更または提供を終了することがあります。
            これによりユーザーに生じた損害について、当サービスは責任を負いません。
          </p>
        </section>

        <section className={styles.section}>
          <h2>第8条（広告について）</h2>
          <p>
            本サービスでは、サービス維持のためGoogle AdSenseによる広告を表示しています。
            広告の内容は第三者（広告主）によって提供されるものであり、当サービスはその内容に関する責任を負いません。
          </p>
        </section>

        <section className={styles.section}>
          <h2>第9条（準拠法・管轄裁判所）</h2>
          <p>
            本規約の解釈にあたっては日本法を準拠法とし、
            本サービスに関する紛争については東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <section className={styles.section}>
          <h2>第10条（お問い合わせ）</h2>
          <p>本規約に関するお問い合わせは、以下のメールアドレスまでご連絡ください。</p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </section>
      </div>
    </main>
  )
}
