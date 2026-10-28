import { useSearchParams } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import { articles } from '../data/articles'
import { categories } from '../data/articleModel'

export default function Articles() {
  const [params, setParams] = useSearchParams()
  const selected = params.get('category') || '全部'
  const options = ['全部', ...categories, ...(articles.some(a => a.category === '未分类') ? ['未分类'] : [])]
  const filtered = selected === '全部' ? articles : articles.filter(a => a.category === selected)
  return <div className="blog-page">
    <header className="page-intro"><p className="eyebrow">慢慢写，慢慢积累</p><h1>文章</h1><p>学习中的发现、折腾中的记录，还有生活里的小想法。</p></header>
    <div className="article-filters" aria-label="按文章分类筛选">{options.map(option => <button key={option} aria-pressed={selected === option} onClick={() => setParams(option === '全部' ? {} : { category: option })}>{option}</button>)}</div>
    <p className="result-count" role="status">{filtered.length} 篇文章 · 按时间从新到旧</p>
    <ArticleList articles={filtered} />
  </div>
}
