export const categories = ['学习笔记', '折腾记录', '生活随想']
const dateText = value => value instanceof Date ? value.toISOString().slice(0, 10) : String(value || '')
export const isArticleHidden = value => [true, 'true', 1, '1'].includes(value)

const normalizeCategory = value => {
  const category = typeof value === 'string' ? value.trim() : ''
  return categories.includes(category) ? category : '未分类'
}

export function createArticleIndex(metadata) {
  return Object.entries(metadata)
    .filter(([, meta]) => meta && !isArticleHidden(meta.hidden))
    .map(([path, meta]) => {
      const id = path.split('/').pop().replace(/\.mdx$/, '')
      const date = dateText(meta.date || meta.created)
      const updated = dateText(meta.updated)
      const time = String(meta.time || '00:00').padStart(5, '0')
      return { ...meta, id, path, date, updated, sortDate: date + 'T' + time, title: meta.title || id,
        sourceUrl: /^https?:\/\//i.test(meta.sourceUrl || '') ? meta.sourceUrl : '',
        category: normalizeCategory(meta.category),
        tags: Array.isArray(meta.tags) ? meta.tags : [] }
    })
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate) || a.id.localeCompare(b.id))
}

// 分类在界面上的配色键：学习笔记=蒜苗绿，折腾记录=虎斑橙，生活随想=紫皮色。
const categoryKeys = { '学习笔记': 'learn', '折腾记录': 'tinker', '生活随想': 'life' }
export const categoryKey = category => categoryKeys[category] || 'none'

export function countByCategory(articles) {
  const counts = Object.fromEntries([...categories, '未分类'].map(category => [category, 0]))
  articles.forEach(article => { counts[article.category] = (counts[article.category] || 0) + 1 })
  return counts
}

export function collectTags(articles) {
  const counts = new Map()
  articles.forEach(article => article.tags.forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1)))
  return [...counts].map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'))
}

export function filterArticles(articles, { category = '', tag = '' } = {}) {
  return articles.filter(article => (!category || article.category === category) && (!tag || article.tags.includes(tag)))
}

// 保持原有的从新到旧顺序，只在年份变化处分组。
export function groupByYear(articles) {
  const groups = []
  articles.forEach(article => {
    const year = /^\d{4}/.test(article.date) ? article.date.slice(0, 4) : '日期未填写'
    if (!groups.length || groups[groups.length - 1].year !== year) groups.push({ year, items: [] })
    groups[groups.length - 1].items.push(article)
  })
  return groups
}

export function neighbors(articles, id) {
  const index = articles.findIndex(article => article.id === id)
  if (index < 0) return { newer: null, older: null }
  return { newer: articles[index - 1] || null, older: articles[index + 1] || null }
}

export function splitDate(date) {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(date || '')
  return match ? { year: match[1], monthDay: `${match[2].padStart(2, '0')}.${match[3].padStart(2, '0')}` } : { year: '', monthDay: '' }
}

export function sourceHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}
