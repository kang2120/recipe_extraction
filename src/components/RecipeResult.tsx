'use client'
// src/components/RecipeResult.tsx

import { useState } from 'react'
import type { RecipeData } from '@/app/api/extract/route'
import styles from './RecipeResult.module.css'

interface Props {
  recipe: RecipeData
}

type Tab = 'ingredients' | 'steps' | 'tips'

export default function RecipeResult({ recipe }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('ingredients')
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function copyText() {
    const lines = [
      `【${recipe.title}】`,
      `${recipe.servings}  ⏱ ${recipe.cooktime}  難易度: ${recipe.difficulty}`,
      '',
      '▼ 材料',
      ...recipe.ingredients.map((i) => `・${i.name}  ${i.amount}`),
      '',
      '▼ 手順',
      ...recipe.steps.map((s, i) => `${i + 1}. ${s}`),
      '',
      '▼ コツ',
      ...recipe.tips.map((t) => `・${t}`),
      '',
      '-- recipeAI で抽出 --',
    ]
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <article className={styles.card} aria-label="抽出されたレシピ">
      {/* サムネイル + タイトル */}
      <div className={styles.recipeHeader}>
        <div className={styles.thumb}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.thumbnailUrl}
            alt={recipe.title}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
        <div className={styles.meta}>
          <h2 className={styles.recipeTitle}>{recipe.title}</h2>
          <div className={styles.metaRow}>
            {recipe.servings && <span>👥 {recipe.servings}</span>}
            {recipe.cooktime && <span>⏱ {recipe.cooktime}</span>}
            {recipe.difficulty && (
              <span className={styles.diffBadge}>{recipe.difficulty}</span>
            )}
          </div>
          {recipe.channelTitle && (
            <p className={styles.channel}>by {recipe.channelTitle}</p>
          )}
        </div>
      </div>

      {/* タブ */}
      <div className={styles.tabBar} role="tablist">
        {(['ingredients', 'steps', 'tips'] as Tab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'ingredients' ? '🧺 材料' : tab === 'steps' ? '📋 手順' : '💡 コツ'}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div className={styles.tabContent}>
        {/* 材料 */}
        {activeTab === 'ingredients' && (
          <div
            role="tabpanel"
            aria-label="材料一覧"
            className={styles.ingredientsGrid}
          >
            {recipe.ingredients.map((item, i) => (
              <div
                key={i}
                className={`${styles.ingredientItem} ${checked.has(i) ? styles.checked : ''}`}
                onClick={() => toggleCheck(i)}
                role="checkbox"
                aria-checked={checked.has(i)}
                tabIndex={0}
                onKeyDown={(e) => e.key === ' ' && toggleCheck(i)}
              >
                <div className={styles.checkCircle} aria-hidden="true">
                  {checked.has(i) && '✓'}
                </div>
                <span className={styles.ingredientName}>{item.name}</span>
                <span className={styles.ingredientAmount}>{item.amount}</span>
              </div>
            ))}
          </div>
        )}

        {/* 手順 */}
        {activeTab === 'steps' && (
          <ol className={styles.stepList} role="tabpanel" aria-label="調理手順">
            {recipe.steps.map((step, i) => (
              <li key={i} className={styles.stepItem}>
                <div className={styles.stepNum} aria-hidden="true">
                  {i + 1}
                </div>
                <p className={styles.stepText}>{step}</p>
              </li>
            ))}
          </ol>
        )}

        {/* コツ */}
        {activeTab === 'tips' && (
          <ul
            className={styles.tipsList}
            role="tabpanel"
            aria-label="料理のコツ"
          >
            {recipe.tips.map((tip, i) => (
              <li key={i} className={styles.tipItem}>
                <span className={styles.tipIcon} aria-hidden="true">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* シェア・コピーバー */}
      <div className={styles.actionBar}>
        <button className={styles.actionBtn} onClick={copyText}>
          {copied ? '✓ コピーしました！' : '📋 テキストでコピー'}
        </button>
        <a
          href={`https://www.youtube.com/watch?v=${recipe.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.actionBtn}
        >
          ▶ 動画を見る
        </a>
      </div>
    </article>
  )
}
