// src/lib/youtube.ts
// YouTubeのURLからVideo IDを取得し、字幕を取得するユーティリティ

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
    /(?:youtube\.com\/shorts\/)([\w-]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function getThumbnailUrl(videoId: string): string {
  // maxresdefault > hqdefault > mqdefault の順で高解像度
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

// YouTube Data API v3 で動画タイトル・説明文を取得
export async function fetchVideoInfo(videoId: string): Promise<{
  title: string
  description: string
  channelTitle: string
  duration: string
} | null> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return null

  const url =
    `https://www.googleapis.com/youtube/v3/videos` +
    `?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    const item = data.items?.[0]
    if (!item) return null

    return {
      title: item.snippet.title,
      description: item.snippet.description?.slice(0, 2000) ?? '',
      channelTitle: item.snippet.channelTitle,
      duration: item.contentDetails.duration, // ISO 8601 形式 (PT1H2M3S)
    }
  } catch {
    return null
  }
}

// 字幕テキストを取得（youtube-transcript ライブラリ使用）
export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    // youtube-transcript は動的インポートで使用
    const { YoutubeTranscript } = await import('youtube-transcript')
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: 'ja', // まず日本語を試みる
    }).catch(() =>
      YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' }) // 失敗したら英語
    )

    // テキストのみ結合（最大8000文字）
    return transcript
      .map((t) => t.text)
      .join(' ')
      .slice(0, 8000)
  } catch {
    // 字幕が取得できない場合は空文字を返す（説明文で補完）
    return ''
  }
}
