import { useSearchParams } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import useDocumentTitle from '../components/useDocumentTitle'
import { articles } from '../data/articles'
import { categories, categoryKey, collectTags, countByCategory, filterArticles, groupByYear } from '../data/articleModel'

export default function Articles() {
  useDocumentTitle('文章')
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''
  const tag = params.get('tag') || ''
  const counts = countByCategory(articles)
  const options = ['', ...categories, ...(counts['未分类'] ? ['未分类'] : [])]
  const tags = collectTags(articles)
  const filtered = filterArticles(articles, { category, tag })
  const groups = groupByYear(filtered)
  const scope = [category, tag && `#${tag}`].filter(Boolean).join(' · ')
  const hasEcho = filtered.some(article => article.updated && article.updated !== article.date)
  const hasSource = filtered.some(article => article.sourceUrl)

  const update = changes => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key))
    setParams(next)
  }

  return <div className="page">
    <header className="page-intro">
      <p className="eyebrow">慢慢写，慢慢积累</p>
      <h1>文章</h1>
      <p>学习中的发现、折腾中的记录，还有生活里的小想法。</p>
    </header>

    <div className="filters">
      <div className="filter-row" role="group" aria-label="按分类筛选">
        {options.map(option => <button key={option || 'all'} type="button" className={option ? `filter-chip cat--${categoryKey(option)}` : 'filter-chip'} aria-pressed={category === option} onClick={() => update({ category: option })}>
          {option || '全部'}<span className="count">{option ? counts[option] : articles.length}</span>
        </button>)}
      </div>
      {tags.length > 0 && <div className="filter-row" role="group" aria-label="按标签筛选">
        <span className="filter-label">标签</span>
        {tags.map(({ tag: name, count }) => <button key={name} type="button" className="filter-chip filter-chip--tag" aria-pressed={tag === name} onClick={() => update({ tag: tag === name ? '' : name })}>
          #{name}<span className="count">{count}</span>
        </button>)}
      </div>}
      <div className="filter-status">
        <p role="status">{scope && `${scope}：`}{filtered.length} 篇 · 按首发时间从新到旧</p>
        {(category || tag) && <button type="button" onClick={() => update({ category: '', tag: '' })}>看全部文章</button>}
      </div>
      {(hasEcho || hasSource) && <p className="marker-legend">
        {hasEcho && <span className="echo-mark">补记：之后回来补充的理解</span>}
        {hasSource && <span className="source-mark">附原文来源：读后笔记，附有原文链接</span>}
      </p>}
    </div>

    {groups.length
      ? groups.map(group => <section key={group.year} className="year-group" aria-labelledby={`year-${group.year}`}>
        <h2 className="year-label" id={`year-${group.year}`}><span>{group.year}</span><span className="year-count">{group.items.length} 篇</span></h2>
        <ArticleList articles={group.items} headingLevel={3} showYear={false} />
      </section>)
      : <ArticleList articles={[]} emptyText={articles.length ? '没有找到符合条件的文章，换个分类或标签看看吧。' : undefined} />}
  </div>
}
