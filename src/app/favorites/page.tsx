'use client'
// src/app/favorites/page.tsx

import { useState } from 'react'
import { useFavorites } from '@/hooks/useFavorites'
import type { FavoriteRecipe } from '@/hooks/useFavorites'
import { shareToLine, buildShoppingListText } from '@/lib/lineShare'
import styles from './favorites.module.css'

export default function FavoritesPage() {
  const { favorites, removeFavorite, loaded } = useFavorites()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [removed, setRemoved] = useState<string | null>(null)

  function handleRemove(videoId: string) {
    setRemoved(videoId)
    setTimeout(() => {
      removeFavorite(videoId)
      setRemoved(null)
    }, 300)
  }

  function handleLineShare(recipe: FavoriteRecipe) {
    shareToLine(buildShoppingListText(recipe))
  }

  if (!loaded) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>読み込み中...</div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <a href="/" className={styles.back}>← recipeAI に戻る</a>
          <h1 className={styles.title}>❤️ お気に入りレシピ</h1>
          <p className={styles.count}>
            {favorites.length > 0 ? `${favorites.length}件保存中` : '保存済みレシピはありません'}
          </p>
        </div>

        {favorites.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🍳</p>
            <p className={styles.emptyText}>お気に入りはまだありません</p>
            <p className={styles.emptySubtext}>
              レシピを抽出したら ❤️ ボタンで保存できます
            </p>
            <a href="/" className={styles.emptyBtn}>レシピを探す</a>
          </div>
        )}

        <ul className={styles.recipeList}>
          {favorites.map((recipe) => {
            const isExpanded = expanded === recipe.id
            const isRemoving = removed === recipe.videoId

            return (
              <li
                key={recipe.id}
                className={`${styles.recipeCard} ${isRemoving ? styles.removing : ''}`}
              >
                {/* カードヘッダー */}
                <div
                  className={styles.cardHeader}
                  onClick={() => setExpanded(isExpanded ? null : recipe.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => e.key === 'Enter' && setExpanded(isExpanded ? null : recipe.id)}
                >
                  <div className={styles.cardThumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={recipe.thumbnailUrl}
                      alt={recipe.title}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <div className={styles.cardMeta}>
                    <p className={styles.cardTitle}>{recipe.title}</p>
                    <div className={styles.cardSub}>
                      {recipe.servings && <span>👥 {recipe.servings}</span>}
                      {recipe.cooktime && <span>⏱ {recipe.cooktime}</span>}
                      {recipe.difficulty && (
                        <span className={styles.diffBadge}>{recipe.difficulty}</span>
                      )}
                    </div>
                    <p className={styles.savedAt}>
                      保存日: {new Date(recipe.savedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <span className={styles.chevron} aria-hidden="true">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>

                {/* 展開コンテンツ */}
                {isExpanded && (
                  <div className={styles.cardBody}>
                    {/* 材料 */}
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle}>🧺 材料</h3>
                      <ul className={styles.ingredientList}>
                        {recipe.ingredients.map((item, i) => (
                          <li key={i} className={styles.ingredientItem}>
                            <span className={styles.ingredientName}>{item.name}</span>
                            <span className={styles.ingredientAmount}>{item.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* 手順 */}
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle}>📋 手順</h3>
                      <ol className={styles.stepList}>
                        {recipe.steps.map((step, i) => (
                          <li key={i} className={styles.stepItem}>
                            <span className={styles.stepNum}>{i + 1}</span>
                            <p className={styles.stepText}>{step}</p>
                          </li>
                        ))}
                      </ol>
                    </section>

                    {/* アクション */}
                    <div className={styles.cardActions}>
                      <button
                        className={styles.lineBtn}
                        onClick={() => handleLineShare(recipe)}
                      >
                        <LineIcon />
                        買い物リストをLINEで送る
                      </button>
                      <a
                        href={`https://www.youtube.com/watch?v=${recipe.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.ytBtn}
                      >
                        ▶ 動画を見る
                      </a>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemove(recipe.videoId)}
                        aria-label="お気に入りから削除"
                      >
                        🗑 削除
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}

function LineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  )
}
