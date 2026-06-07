'use client'
// src/hooks/useFavorites.ts
// お気に入りレシピをlocalStorageで管理するカスタムフック

import { useState, useEffect, useCallback } from 'react'
import type { RecipeData } from '@/app/api/extract/route'

export interface FavoriteRecipe extends RecipeData {
  savedAt: string // ISO 8601
  id: string      // videoId + savedAt のハッシュ
}

const STORAGE_KEY = 'recipeai_favorites'
const MAX_FAVORITES = 50

function loadFromStorage(): FavoriteRecipe[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(favorites: FavoriteRecipe[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // ストレージ容量超過時は古いものを削除して再試行
    try {
      const trimmed = favorites.slice(-MAX_FAVORITES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    } catch { /* ignore */ }
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([])
  const [loaded, setLoaded] = useState(false)

  // クライアントサイドのみ読み込み
  useEffect(() => {
    setFavorites(loadFromStorage())
    setLoaded(true)
  }, [])

  const isFavorite = useCallback(
    (videoId: string) => favorites.some((f) => f.videoId === videoId),
    [favorites]
  )

  const addFavorite = useCallback((recipe: RecipeData) => {
    setFavorites((prev) => {
      // 重複チェック
      if (prev.some((f) => f.videoId === recipe.videoId)) return prev
      const entry: FavoriteRecipe = {
        ...recipe,
        savedAt: new Date().toISOString(),
        id: `${recipe.videoId}_${Date.now()}`,
      }
      const next = [entry, ...prev].slice(0, MAX_FAVORITES)
      saveToStorage(next)
      return next
    })
  }, [])

  const removeFavorite = useCallback((videoId: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.videoId !== videoId)
      saveToStorage(next)
      return next
    })
  }, [])

  const toggleFavorite = useCallback(
    (recipe: RecipeData) => {
      if (isFavorite(recipe.videoId)) {
        removeFavorite(recipe.videoId)
        return false
      } else {
        addFavorite(recipe)
        return true
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  )

  return { favorites, isFavorite, toggleFavorite, removeFavorite, loaded }
}
