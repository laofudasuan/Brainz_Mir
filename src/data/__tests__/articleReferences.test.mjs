import test from 'node:test'
import assert from 'node:assert/strict'
import { compile, evaluate } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import * as runtime from 'react/jsx-runtime'
import { articleIdFromLink, createBacklinkIndex } from '../articleReferences.js'
import { createArticleIndex } from '../articleModel.js'
import remarkArticleLinks from '../remarkArticleLinks.js'

const remarkPlugins = [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter, remarkArticleLinks]
const articleModule = (value, id = 'source') => evaluate({ value, path: `src/data/logs/${id}.mdx` }, {
  ...runtime, remarkPlugins,
})

test('article links resolve relative routes, anchors, query strings and encoded filenames', () => {
  for (const href of ['/articles/target', '/articles/target/?from=note#section', './target#section', 'target?from=note', '../articles/target']) {
    assert.equal(articleIdFromLink(href, 'source'), 'target', href)
  }
  assert.equal(articleIdFromLink('/articles/%E4%B8%AD%E6%96%87', 'source'), '中文')
  assert.equal(articleIdFromLink('/articles/a%20b', 'source'), 'a b')
  assert.equal(articleIdFromLink('#section', 'source'), 'source')
  assert.equal(articleIdFromLink('?from=note#section', 'source'), 'source')
  assert.equal(articleIdFromLink('/articles/top', 'source'), 'top')
})

test('non-article, external and malformed links are ignored', () => {
  for (const href of [undefined, null, '', ' ', '/articles', '/articles/', '/articles/target/nested',
    '/courseware/target', 'https://example.com/articles/target', '//example.com/articles/target',
    'mailto:someone@example.com', 'javascript:alert(1)', '/articles/%zz', '/articles/a%2Fb',
    '/articles/a%5Cb', '/articles/a%00b', '/articles/ta\trget', '\\articles\\target']) {
    assert.equal(articleIdFromLink(href, 'source'), null, String(href))
  }
})

test('MDX parsing collects actual inline and reference links once, including links in components', async () => {
  const module = await articleModule(`---
title: "引用示例"
---

[正文](/articles/target#first) 和 [再次](/articles/target?from=note)。

[引用式][My ID]、[shortcut]、[collapsed][]。

[my id]: ./another#section
[MY ID]: /articles/not-the-first-definition
[shortcut]: /articles/third
[collapsed]: /articles/fourth
[unused]: /articles/not-used

<BoxWithTag tag="提示">

[组件内的正文](/articles/inside-box)

</BoxWithTag>

[自己](/articles/source?from=note#section) [外站](https://example.com/articles/external)
`)
  assert.deepEqual(module.__articleLinkTargets, ['target', 'another', 'third', 'fourth', 'inside-box'])
  assert.equal(module.frontmatter.title, '引用示例')
})

test('code, escaped text, JSX attributes, expressions, comments and unused definitions are not references', async () => {
  const source = [
    'export const example = "[JS string](/articles/in-js)"',
    '',
    '```md', '[fenced](/articles/fenced)', '```', '',
    '~~~md', '[tilde](/articles/tilde)', '~~~', '',
    '`[inline](/articles/inline)`', '',
    '\\[escaped](/articles/escaped)', '',
    '<BoxWithTag tag="[attribute](/articles/attribute)" />', '',
    '{"[expression](/articles/expression)"}', '',
    '{/* [comment](/articles/comment) */}', '',
    '<pre>', '', '[pre](/articles/pre)', '', '</pre>', '',
    '<code>', '', '[code](/articles/code)', '', '</code>', '',
    '![image](/articles/image)', '',
    '[unused]: /articles/unused', '',
    '[real](/articles/real)',
  ].join('\n')
  const module = await articleModule(source)
  assert.deepEqual(module.__articleLinkTargets, ['real'])
  assert.equal(module.example, '[JS string](/articles/in-js)')
})

test('the link export is limited to article MDX, without changing courseware modules', async () => {
  const source = '[link](/articles/target)'
  const courseware = await evaluate({ value: source, path: 'src/data/courseware/pages/Graph/Test.mdx' }, { ...runtime, remarkPlugins })
  assert.equal(Object.hasOwn(courseware, '__articleLinkTargets'), false)
  const windowsPath = await compile({ value: source, path: 'D:\\Develop\\Brainz_Mir\\src\\data\\logs\\source.mdx' }, { remarkPlugins })
  assert.match(String(windowsPath), /__articleLinkTargets/)
})

test('backlinks discard duplicates, self references and missing targets with a stable date/id order', () => {
  const articles = [
    { id: 'target', title: '目标', date: '2026-01-01', sortDate: '2026-01-01T10:00' },
    { id: 'z', title: '较早', date: '2026-01-02', sortDate: '2026-01-02T09:00' },
    { id: 'b', title: '同日乙', date: '2026-02-01', sortDate: '2026-02-01T10:00' },
    { id: 'a', title: '同日甲', date: '2026-02-01', sortDate: '2026-02-01T10:00' },
  ]
  const outgoing = new Map([
    ['a', ['target', 'target', 'a', 'nonexistent']], ['b', ['target']], ['z', ['target']], ['target', ['target', 'a']],
  ])
  const index = createBacklinkIndex(articles, outgoing)
  assert.deepEqual(index.get('target').map(article => article.id), ['a', 'b', 'z'])
  assert.deepEqual(index.get('a'), [{ id: 'target', title: '目标', date: '2026-01-01' }])
  assert.equal(index.has('nonexistent'), false)
  assert.deepEqual([...createBacklinkIndex([...articles].reverse(), outgoing)], [...index])
  assert.deepEqual(articles.map(article => article.id), ['target', 'z', 'b', 'a'], 'input order is not mutated')
})

test('hidden sources and targets never enter backlink display data for all supported hidden values', () => {
  const publicArticle = { id: 'public', title: '公开标题', description: '公开摘要', date: '2026-01-01' }
  const hiddenArticles = [true, 'true', 1, '1'].map((hidden, index) => ({
    id: `secret-${index}`, title: `秘密标题${index}`, description: `秘密摘要${index}`,
    sourceUrl: `https://private.example/${index}`, hidden,
  }))
  const outgoing = new Map([
    ['public', hiddenArticles.map(article => article.id)],
    ...hiddenArticles.map(article => [article.id, ['public']]),
  ])
  const index = createBacklinkIndex([publicArticle, ...hiddenArticles], outgoing)
  assert.deepEqual([...index], [['public', []]])
  assert.doesNotMatch(JSON.stringify([...index]), /secret|秘密|private/)
})

test('public frontmatter and compiled links build the reading index; hiding either end removes a backlink', async () => {
  const target = await articleModule('---\ntitle: "目标"\ndate: "2026-01-01"\n---\n正文。', 'target')
  const source = await articleModule('---\ntitle: "来源"\ndate: "2026-02-01"\nhidden: false\n---\n[目标](/articles/target?x=1#part)', 'source')
  const modules = { './logs/target.mdx': target, './logs/source.mdx': source }
  const metadata = Object.fromEntries(Object.entries(modules).map(([path, module]) => [path, module.frontmatter]))
  const links = new Map([['target', target.__articleLinkTargets], ['source', source.__articleLinkTargets]])
  assert.deepEqual(createBacklinkIndex(createArticleIndex(metadata), links).get('target'), [
    { id: 'source', title: '来源', date: '2026-02-01' },
  ])
  const hiddenSource = { ...metadata, './logs/source.mdx': { ...source.frontmatter, hidden: true } }
  assert.deepEqual(createBacklinkIndex(createArticleIndex(hiddenSource), links).get('target'), [])
  const hiddenTarget = { ...metadata, './logs/target.mdx': { ...target.frontmatter, hidden: true } }
  assert.equal(createBacklinkIndex(createArticleIndex(hiddenTarget), links).has('target'), false)
})
