export const categories = ['学习笔记', '折腾记录', '生活随想']
const dateText = value => value instanceof Date ? value.toISOString().slice(0, 10) : String(value || '')

export function createArticleIndex(metadata, overrides = {}) {
  return Object.entries(metadata)
    .filter(([, meta]) => meta && ![true, 'true', 1, '1'].includes(meta.hidden))
    .map(([path, meta]) => {
      const id = path.split('/').pop().replace(/\.mdx$/, '')
      const category = meta.category || overrides[id]
      const date = dateText(meta.date || meta.created)
      const updated = dateText(meta.updated)
      const time = String(meta.time || '00:00').padStart(5, '0')
      return { ...meta, id, path, date, updated, sortDate: date + 'T' + time, title: meta.title || id,
        sourceUrl: /^https?:\/\//i.test(meta.sourceUrl || '') ? meta.sourceUrl : '',
        category: categories.includes(category) ? category : '未分类',
        tags: Array.isArray(meta.tags) ? meta.tags : [] }
    })
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate) || a.id.localeCompare(b.id))
}
