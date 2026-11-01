import { isArticleHidden } from './articleModel.js'

// Resolve ordinary Markdown links as the browser does on an article's URL.
// An artificial origin keeps this independent of the site's current domain.
export function articleIdFromLink(href, sourceId) {
  if (typeof href !== 'string' || !href.trim() || typeof sourceId !== 'string') return null
  const link = href.trim()
  if (/^[a-z][a-z\d+.-]*:/i.test(link) || link.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(link)) return null
  try {
    const base = new URL('/articles/' + encodeURIComponent(sourceId), 'https://article.invalid')
    const target = new URL(link, base)
    const match = /^\/articles\/([^/]+)\/?$/i.exec(target.pathname)
    if (target.origin !== base.origin || !match) return null
    const id = decodeURIComponent(match[1])
    return id && !/[/\\\u0000-\u001f\u007f]/.test(id) ? id : null
  } catch {
    return null
  }
}

const compareText = (a, b) => a === b ? 0 : a < b ? -1 : 1

export function createBacklinkIndex(articles, outgoingTargets) {
  const publicArticles = articles.filter(article => !isArticleHidden(article.hidden))
    .slice().sort((a, b) => compareText(b.sortDate || '', a.sortDate || '') || compareText(a.id, b.id))
  const backlinks = new Map(publicArticles.map(article => [article.id, []]))
  for (const article of publicArticles) {
    for (const targetId of new Set(outgoingTargets.get(article.id) || [])) {
      if (targetId === article.id || !backlinks.has(targetId)) continue
      // Only the public display fields belong in this feature's index.
      backlinks.get(targetId).push({ id: article.id, title: article.title, date: article.date })
    }
  }
  return backlinks
}
