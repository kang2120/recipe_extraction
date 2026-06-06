# recipeAI 🍳

YouTubeのURLを貼るだけで、材料・手順・コツを自動抽出するWebアプリ。

## 技術スタック

| 役割 | 技術 |
|---|---|
| フロントエンド | Next.js 14 (App Router) + TypeScript |
| AI解析 | Claude API (claude-sonnet-4) |
| 字幕取得 | YouTube Data API v3 + youtube-transcript |
| スタイル | CSS Modules |
| ホスティング | Vercel（推奨） |
| 広告 | Google AdSense |

---

## セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/yourname/recipeai.git
cd recipeai
npm install
```

### 2. APIキーを取得

#### Anthropic Claude API
1. https://console.anthropic.com にアクセス
2. 「API Keys」→「Create Key」
3. キーをコピー

#### YouTube Data API v3
1. https://console.cloud.google.com にアクセス
2. 新規プロジェクト作成
3. 「APIとサービス」→「ライブラリ」→「YouTube Data API v3」を有効化
4. 「認証情報」→「APIキーを作成」

### 3. 環境変数を設定

`.env.local` を編集：

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx
YOUTUBE_API_KEY=AIzaxxxxxxxxxx
FREE_DAILY_LIMIT=3
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000 を開く

---

## Vercel へのデプロイ

```bash
npm install -g vercel
vercel
```

Vercel ダッシュボードで環境変数（ANTHROPIC_API_KEY / YOUTUBE_API_KEY）を追加。

---

## Google AdSense の設置

1. https://adsense.google.com でアカウント作成
2. サイトを登録 → 審査を通過（1〜2週間）
3. `src/components/AdBanner.tsx` の以下を更新：
   ```
   const AD_CLIENT = 'ca-pub-あなたのID'
   const AD_SLOT = 'あなたの広告スロットID'
   ```

---

## 収益化ロードマップ

| フェーズ | 機能 | 収益 |
|---|---|---|
| MVP | 無料3回/日 + AdSense | 広告収入 |
| Phase 2 | Supabase認証 + お気に入り保存 | ユーザー定着 |
| Phase 3 | 有料プラン（Stripe） | サブスク収入 |
| Phase 4 | 材料のAmazonアフィリエイトリンク | アフィリエイト収入 |

---

## フォルダ構成

```
recipeai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── extract/
│   │   │       └── route.ts    ← メインAPIエンドポイント
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx            ← トップページ
│   │   └── page.module.css
│   ├── components/
│   │   ├── RecipeResult.tsx    ← レシピ表示コンポーネント
│   │   ├── RecipeResult.module.css
│   │   ├── AdBanner.tsx        ← 広告コンポーネント
│   │   └── AdBanner.module.css
│   └── lib/
│       ├── youtube.ts          ← YouTube API ユーティリティ
│       └── rateLimit.ts        ← 利用回数制限
├── .env.local                  ← APIキー（gitignoreに追加）
├── package.json
└── README.md
```
