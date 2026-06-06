// src/app/api/extract/route.ts
// YouTube URLを受け取り、Claude APIでレシピを抽出して返すAPIエンドポイント

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import {
  extractVideoId,
  fetchVideoInfo,
  fetchTranscript,
  getThumbnailUrl,
} from '@/lib/youtube'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const FREE_DAILY_LIMIT = parseInt(process.env.FREE_DAILY_LIMIT ?? '3', 10)

export interface RecipeData {
  title: string
  servings: string
  cooktime: string
  difficulty: string
  ingredients: { name: string; amount: string }[]
  steps: string[]
  tips: string[]
  thumbnailUrl: string
  channelTitle: string
  videoId: string
}

export async function POST(req: NextRequest) {
  // ───── 1. リクエスト検証 ─────
  const { url } = await req.json()
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URLが必要です' }, { status: 400 })
  }

  const videoId = extractVideoId(url)
  if (!videoId) {
    return NextResponse.json(
      { error: '有効なYouTube URLを入力してください' },
      { status: 400 }
    )
  }

  // ───── 2. レート制限チェック ─────
  // Cookie ベースの簡易制限（本番は Supabase + auth で管理推奨）
  const cookieHeader = req.cookies.get('recipe_usage')?.value
  const today = new Date().toISOString().slice(0, 10)
  let usage = { count: 0, date: today }

  if (cookieHeader) {
    try {
      const parsed = JSON.parse(cookieHeader)
      usage = parsed.date === today ? parsed : { count: 0, date: today }
    } catch { /* ignore */ }
  }

  if (usage.count >= FREE_DAILY_LIMIT) {
    return NextResponse.json(
      {
        error: `本日の無料利用上限（${FREE_DAILY_LIMIT}回）に達しました。明日またお試しください。`,
        limitReached: true,
      },
      { status: 429 }
    )
  }

  // ───── 3. YouTube情報取得 ─────
  const [videoInfo, transcript] = await Promise.all([
    fetchVideoInfo(videoId),
    fetchTranscript(videoId),
  ])

  const thumbnailUrl = getThumbnailUrl(videoId)

  // ───── 4. Claude API でレシピ抽出 ─────
  const contextParts: string[] = []

  if (videoInfo) {
    contextParts.push(`【動画タイトル】${videoInfo.title}`)
    contextParts.push(`【チャンネル名】${videoInfo.channelTitle}`)
    if (videoInfo.description) {
      contextParts.push(`【動画説明文（抜粋）】\n${videoInfo.description}`)
    }
  }

  if (transcript) {
    contextParts.push(`【字幕テキスト（抜粋）】\n${transcript}`)
  }

  if (contextParts.length === 0) {
    contextParts.push(`【YouTube URL】${url}`)
    contextParts.push('（字幕・説明文を取得できませんでした。URLから推測して回答してください）')
  }

  const prompt = `あなたはYouTubeのレシピ動画からレシピ情報を抽出する専門AIです。

以下の動画情報をもとに、レシピを抽出してください。

${contextParts.join('\n\n')}

---

以下のJSON形式で返してください。JSONのみを返し、マークダウンのコードブロック（\`\`\`）は不要です：

{
  "title": "料理名（日本語で具体的に）",
  "servings": "〇人分",
  "cooktime": "調理時間（例: 約30分）",
  "difficulty": "初級 / 中級 / 上級 のいずれか",
  "ingredients": [
    { "name": "材料名", "amount": "分量（例: 200g）" }
  ],
  "steps": [
    "手順の説明文（一文で具体的に）"
  ],
  "tips": [
    "料理のコツや注意点"
  ]
}

制約：
- ingredients: 6〜12個
- steps: 5〜10個（各ステップは一文で明確に）
- tips: 2〜4個（実践的なコツのみ）
- 日本語で返すこと
- 情報が不足している場合は一般的なレシピ知識で補完してください`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const responseText = message.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')
    .replace(/```json|```/g, '')
    .trim()

  let recipe: Omit<RecipeData, 'thumbnailUrl' | 'channelTitle' | 'videoId'>
  try {
    recipe = JSON.parse(responseText)
  } catch {
    return NextResponse.json(
      { error: 'レシピの解析に失敗しました。もう一度お試しください。' },
      { status: 500 }
    )
  }

  // ───── 5. 利用回数を更新してレスポンス ─────
  usage.count++
  const result: RecipeData = {
    ...recipe,
    thumbnailUrl,
    channelTitle: videoInfo?.channelTitle ?? '',
    videoId,
  }

  const res = NextResponse.json({
    recipe: result,
    usage: { used: usage.count, limit: FREE_DAILY_LIMIT },
  })

  // Cookie に利用回数を保存（翌日リセット）
  const midnight = new Date()
  midnight.setHours(23, 59, 59, 999)
  res.cookies.set('recipe_usage', JSON.stringify(usage), {
    expires: midnight,
    httpOnly: true,
    sameSite: 'strict',
  })

  return res
}
