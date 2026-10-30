import test from 'node:test'
import assert from 'node:assert/strict'
import { createArticleIndex, categoryKey, countByCategory, collectTags, filterArticles, groupByYear, neighbors, splitDate, sourceHost } from '../articleModel.js'

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
test('category comes from author metadata, with surrounding whitespace normalized', () => {
  const [post] = createArticleIndex({ './note.mdx': { category: ' 生活随想 ', tags: ['AI'], date: new Date('2026-01-01') } })
  assert.equal(post.category, '生活随想')
  assert.deepEqual(post.tags, ['AI'])
  assert.equal(post.date, '2026-01-01')
  assert.equal(post.id, 'note')
  assert.equal(createArticleIndex({ './short.mdx': {} })[0].category, '未分类')
})

test('missing, unknown and malformed categories stay unclassified regardless of filename', () => {
  for (const category of [undefined, null, '', '  ', '未分类', '新分组', '__proto__', 1, true, ['学习笔记'], { name: '学习笔记' }]) {
    const [post] = createArticleIndex({ './top.mdx': { category } })
    assert.equal(post.category, '未分类')
    assert.equal(countByCategory([post])['未分类'], 1)
    assert.deepEqual(filterArticles([post], { category: '未分类' }), [post])
  }
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

const shelf = createArticleIndex({
  './a.mdx': { date: '2026-05-02', category: '学习笔记', tags: ['教育', '系统论'] },
  './b.mdx': { date: '2026-01-21', category: '生活随想', tags: ['教育', 'AI'] },
  './c.mdx': { date: '2025-12-30', tags: [] },
})

test('categories map to stable colour keys and counts include unclassified notes', () => {
  assert.deepEqual(['学习笔记', '折腾记录', '生活随想', '未分类', undefined].map(categoryKey), ['learn', 'tinker', 'life', 'none', 'none'])
  assert.deepEqual(countByCategory(shelf), { '学习笔记': 1, '折腾记录': 0, '生活随想': 1, '未分类': 1 })
})

test('tags are counted, filters combine, and an empty filter keeps everything', () => {
  assert.deepEqual(collectTags(shelf).map(t => [t.tag, t.count]).slice(0, 1), [['教育', 2]])
  assert.equal(collectTags(shelf).length, 3)
  assert.deepEqual(filterArticles(shelf, { tag: '教育' }).map(a => a.id), ['a', 'b'])
  assert.deepEqual(filterArticles(shelf, { tag: '教育', category: '生活随想' }).map(a => a.id), ['b'])
  assert.equal(filterArticles(shelf).length, 3)
  assert.equal(filterArticles(shelf, { category: '不存在' }).length, 0)
})

test('year groups keep newest-first order and neighbours follow the feed', () => {
  assert.deepEqual(groupByYear(shelf).map(g => [g.year, g.items.map(a => a.id)]), [['2026', ['a', 'b']], ['2025', ['c']]])
  assert.equal(groupByYear([{ id: 'x', date: '' }])[0].year, '日期未填写')
  assert.deepEqual(neighbors(shelf, 'b'), { newer: shelf[0], older: shelf[2] })
  assert.deepEqual(neighbors(shelf, 'a'), { newer: null, older: shelf[1] })
  assert.deepEqual(neighbors(shelf, 'missing'), { newer: null, older: null })
})

test('dates split for the margin and source links show a readable host', () => {
  assert.deepEqual(splitDate('2026-5-2'), { year: '2026', monthDay: '05.02' })
  assert.deepEqual(splitDate(''), { year: '', monthDay: '' })
  assert.equal(sourceHost('https://www.zhihu.com/question/1'), 'zhihu.com')
  assert.equal(sourceHost('not a url'), '')
})
