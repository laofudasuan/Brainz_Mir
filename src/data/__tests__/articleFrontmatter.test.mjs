import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluate } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import * as runtime from 'react/jsx-runtime'
import { createArticleIndex, countByCategory, filterArticles } from '../articleModel.js'

// Exercise the same frontmatter plugins used by Vite, including YAML values.
async function metadata(source) {
  const result = await evaluate(source, {
    ...runtime, remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  })
  return result.frontmatter
}

test('editing only MDX category updates the feed, counts and existing URL filters', async () => {
  const source = `---
title: "文章标题"
date: "2026-01-01"
time: "10:00"
category: "学习笔记"
tags: ["教育"]
hidden: false
---

正文保持原样。
`
  const before = createArticleIndex({ './logs/note.mdx': await metadata(source) })
  const after = createArticleIndex({ './logs/note.mdx': await metadata(source.replace('学习笔记', '生活随想')) })
  assert.equal(before[0].category, '学习笔记')
  assert.equal(after[0].category, '生活随想')
  assert.deepEqual({ ...before[0], category: after[0].category }, after[0])
  assert.deepEqual(countByCategory(after), { '学习笔记': 0, '折腾记录': 0, '生活随想': 1, '未分类': 0 })
  const filters = Object.fromEntries(new URLSearchParams('category=%E7%94%9F%E6%B4%BB%E9%9A%8F%E6%83%B3&tag=%E6%95%99%E8%82%B2'))
  assert.deepEqual(filterArticles(before, filters), [])
  assert.deepEqual(filterArticles(after, filters).map(article => article.id), ['note'])
})

test('frontmatter fallbacks do not make hidden articles visible or infer categories', async () => {
  const sources = {
    './logs/missing.mdx': 'hidden: false',
    './logs/unknown.mdx': 'category: "新分组"\nhidden: false',
    './logs/list.mdx': 'category: ["学习笔记"]\nhidden: false',
    './logs/hidden.mdx': 'category: "生活随想"\nhidden: true',
  }
  const entries = await Promise.all(Object.entries(sources).map(async ([path, yaml]) => [path, await metadata(`---\n${yaml}\n---\n`)]))
  const articles = createArticleIndex(Object.fromEntries(entries))
  assert.deepEqual(articles.map(article => article.id), ['list', 'missing', 'unknown'])
  assert.ok(articles.every(article => article.category === '未分类'))
  assert.equal(countByCategory(articles)['未分类'], 3)
})
