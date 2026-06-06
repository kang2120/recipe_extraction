// src/lib/rateLimit.ts
// 無料ユーザーの利用回数を管理するユーティリティ
// 本番では Redis や Supabase に切り替えることを推奨

import { cookies } from 'next/headers'

const LIMIT = parseInt(process.env.FREE_DAILY_LIMIT ?? '3', 10)
const COOKIE_KEY = 'recipe_usage'

interface UsageData {
  count: number
  date: string // YYYY-MM-DD
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getRemainingUsage(): { remaining: number; limit: number } {
  const cookieStore = cookies()
  const raw = cookieStore.get(COOKIE_KEY)?.value

  if (!raw) return { remaining: LIMIT, limit: LIMIT }

  try {
    const data: UsageData = JSON.parse(raw)
    if (data.date !== todayString()) return { remaining: LIMIT, limit: LIMIT }
    return { remaining: Math.max(0, LIMIT - data.count), limit: LIMIT }
  } catch {
    return { remaining: LIMIT, limit: LIMIT }
  }
}

export function incrementUsage(): boolean {
  // true = OK, false = 上限超過
  const cookieStore = cookies()
  const raw = cookieStore.get(COOKIE_KEY)?.value
  const today = todayString()

  let data: UsageData = { count: 0, date: today }

  if (raw) {
    try {
      const parsed: UsageData = JSON.parse(raw)
      data = parsed.date === today ? parsed : { count: 0, date: today }
    } catch {
      /* ignore */
    }
  }

  if (data.count >= LIMIT) return false

  data.count++

  // Note: Next.js 14 App Router では Response に Set-Cookie が必要
  // API Route 内で直接返す形にしています
  return true
}

export { LIMIT }
