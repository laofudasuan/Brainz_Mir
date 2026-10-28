import test from 'node:test'
import assert from 'node:assert/strict'
import { createArticleIndex } from '../articleModel.js'

test('drafts stay hidden while explicit false and legacy public posts remain visible', () => {
  const metadata = Object.fromEntries([true, 'true', 1, '1', false, 'false', undefined].map((hidden, i) => [`./${i}.mdx`, { hidden }]))
  assert.deepEqual(createArticleIndex(metadata).map(a => a.id), ['4', '5', '6'])
})
test('feed follows dates and times, ignoring legacy pinning', () => {
  const result = createArticleIndex({
    './old.mdx': { date: '2026-01-01', pinned: true },
    './morning.mdx': { date: '2026-05-02', time: '8:00' },
    './evening.mdx': { date: '2026-05-02', time: '18:00' },
  })
  assert.deepEqual(result.map(a => a.id), ['evening', 'morning', 'old'])
})
test('author metadata takes precedence, with safe fallbacks for unclassified notes', () => {
  const [post] = createArticleIndex({ './note.mdx': { category: '生活随想', tags: ['AI'], date: new Date('2026-01-01') } }, { note: '学习笔记' })
  assert.equal(post.category, '生活随想')
  assert.deepEqual(post.tags, ['AI'])
  assert.equal(post.date, '2026-01-01')
  assert.equal(post.id, 'note')
  assert.equal(createArticleIndex({ './short.mdx': {} })[0].category, '未分类')
})

test('later reflections preserve publication order and support created / updated dates', () => {
  const result = createArticleIndex({
    './old.mdx': { date: '2026-01-01', created: '2026-02-01', updated: '2026-10-28', sourceUrl: 'https://example.com/essay' },
    './new.mdx': { created: '2026-05-01', sourceUrl: 'javascript:alert(1)' },
  })
  assert.deepEqual(result.map(a => a.id), ['new', 'old'])
  assert.equal(result[1].date, '2026-01-01')
  assert.equal(result[1].updated, '2026-10-28')
  assert.equal(result[1].sourceUrl, 'https://example.com/essay')
  assert.equal(result[0].sourceUrl, '')
})
