import { Component, Suspense, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { articles } from '../data/articles'
import { blog } from '../data/blog'
import { imageComponents, boxWithTagComponent, CodeBlock } from '../data/courseware/markdownConfig'
import 'katex/dist/katex.min.css'

class ArticleErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <p role="alert">这篇文章暂时没能打开，请刷新重试，或先返回文章列表。</p> : this.props.children }
}

const components = {
  ...imageComponents,
  BoxWithTag: boxWithTagComponent,
  pre: CodeBlock,
  table: ({ children, ...props }) => <div className="article-table"><table {...props}>{children}</table></div>,
}

export default function ArticleDetail() {
  const { id } = useParams()
  const article = articles.find(item => item.id === id)
  useEffect(() => {
    document.title = article ? article.title + ' · 老虎大蒜的小站' : '文章未找到 · 老虎大蒜的小站'
    return () => { document.title = '老虎大蒜的小站' }
  }, [article])
  if (!article) return <div className="blog-page"><h1>这篇文章还没在这里</h1><p className="empty-note">链接可能有误，或文章尚未公开。</p><Link className="text-link" to="/articles">回到文章列表 →</Link></div>
  const Body = article.Component
  return <article className="blog-page reading-page">
    <Link className="text-link back-link" to="/articles">← 全部文章</Link>
    <header className="article-header"><div className="article-meta"><span>首发 <time dateTime={article.date}>{article.date}</time></span><span className="category-label">{article.category}</span>{article.updated && article.updated !== article.date && <span>更新 <time dateTime={article.updated}>{article.updated}</time></span>}</div><h1>{article.title}</h1><p>{blog.author}{article.tags.map(tag => <span key={tag}> · #{tag}</span>)}</p>{article.sourceUrl && <p className="article-source">阅读来源：<a className="text-link" href={article.sourceUrl} target="_blank" rel="noreferrer">{article.sourceTitle || '查看原文'} ↗</a></p>}</header>
    <div className="article-body"><ArticleErrorBoundary key={id}><Suspense fallback={<p role="status">正在展开文章…</p>}><Body components={components} /></Suspense></ArticleErrorBoundary></div>
    <div className="article-end"><span>写到这里，下次再聊。</span><Link className="text-link" to="/articles">继续逛逛文章 →</Link></div>
  </article>
}
