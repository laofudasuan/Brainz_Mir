import { Children, Component, Suspense, isValidElement, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReadingProgress from '../components/ReadingProgress'
import useDocumentTitle from '../components/useDocumentTitle'
import { articles } from '../data/articles'
import { categoryKey, neighbors, sourceHost } from '../data/articleModel'
import { blog } from '../data/blog'
import { imageComponents, boxWithTagComponent, CodeBlock } from '../data/courseware/markdownConfig'
import 'katex/dist/katex.min.css'

class ArticleErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <p className="notice notice--error" role="alert">这篇文章暂时没能打开，请刷新重试，或先返回文章列表。</p> : this.props.children }
}

const textOf = node => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  return isValidElement(node) ? textOf(node.props.children) : ''
}

// Markdown 里“图片下面紧跟一行短横线”会被解析成只装着图片的标题，这里按插图展示。
const onlyImages = children => {
  const parts = Children.toArray(children).filter(child => !(typeof child === 'string' && !child.trim()))
  return parts.length > 0 && parts.every(child => isValidElement(child) && child.props.src)
}

// 以“补记 / 后续补记”开头的标题是之后回来补充的理解（写法见 BLOG_GUIDE.md）。
const reflectionTitle = /^\s*(后续)?补记/
const heading = Tag => function ArticleHeading({ children, ...props }) {
  if (onlyImages(children)) return <div className="prose-figure">{children}</div>
  if (!reflectionTitle.test(textOf(children))) return <Tag {...props}>{children}</Tag>
  return <Tag {...props} className="reflection-heading"><span className="reflection-mark" aria-hidden="true" />{children}</Tag>
}

const components = {
  ...imageComponents,
  BoxWithTag: boxWithTagComponent,
  pre: CodeBlock,
  table: ({ children, ...props }) => <div className="prose-table"><table {...props}>{children}</table></div>,
  h1: heading('h1'),
  h2: heading('h2'),
  h3: heading('h3'),
  h4: heading('h4'),
}

export default function ArticleDetail() {
  const { id } = useParams()
  const article = articles.find(item => item.id === id)
  const readingRef = useRef(null)
  useDocumentTitle(article ? article.title : '文章未找到')

  if (!article) return <div className="page">
    <nav className="crumbs" aria-label="返回"><Link to="/articles"><span className="arrow arrow--back" aria-hidden="true">←</span> 全部文章</Link></nav>
    <h1 className="page-title">这篇文章还没在这里</h1>
    <p className="empty-note">链接可能有误，或文章尚未公开。</p>
    <Link className="text-link" to="/articles">回到文章列表 <span className="arrow" aria-hidden="true">→</span></Link>
  </div>

  const Body = article.Component
  const updated = article.updated && article.updated !== article.date ? article.updated : ''
  const host = article.sourceUrl ? sourceHost(article.sourceUrl) : ''
  const { newer, older } = neighbors(articles, article.id)

  return <article key={article.id} ref={readingRef} className={`page page--reading cat--${categoryKey(article.category)}`}>
    <ReadingProgress target={readingRef} />
    <header className="article-head">
      <nav className="crumbs" aria-label="返回"><Link to="/articles"><span className="arrow arrow--back" aria-hidden="true">←</span> 全部文章</Link></nav>
      <p><Link className="chip" to={'/articles?category=' + encodeURIComponent(article.category)}>{article.category}</Link></p>
      <h1 className="article-title">{article.title}</h1>
      {article.description && <p className="article-lede">{article.description}</p>}
      <span className="article-rule" aria-hidden="true" />
    </header>

    <div className="reading-grid">
      <aside className="reading-margin" aria-label="文章信息">
        <div className="reading-margin-inner">
          <dl className="timeline">
            <div><dt>首发</dt><dd>{article.date ? <time dateTime={article.date}>{article.date}</time> : '日期未填写'}</dd></div>
            {updated && <div className="is-echo"><dt>补记</dt><dd><time dateTime={updated}>{updated}</time></dd></div>}
          </dl>
          <p className="byline">文 · <b>{blog.author}</b></p>
          {article.tags.length > 0 && <ul className="margin-tags" aria-label="标签">
            {article.tags.map(tag => <li key={tag}><Link to={'/articles?tag=' + encodeURIComponent(tag)}>#{tag}</Link></li>)}
          </ul>}
          {article.sourceUrl && <a className="source-card" href={article.sourceUrl} target="_blank" rel="noreferrer">
            <span className="source-label">阅读来源</span>
            <span className="source-title">{article.sourceTitle || '查看原文'}</span>
            {host && <span className="source-host">{host} ↗</span>}
          </a>}
        </div>
      </aside>

      <div className="reading-main">
        <div className="prose article-body">
          <ArticleErrorBoundary key={id}>
            <Suspense fallback={<p className="breath" role="status">正在展开文章…</p>}><Body components={components} /></Suspense>
          </ArticleErrorBoundary>
        </div>

        <footer className="article-foot">
          <p className="sign-off">写到这里，下次再聊。</p>
          {(newer || older) && <nav className="neighbors" aria-label="相邻文章">
            {older && <Link className="neighbor" to={'/articles/' + encodeURIComponent(older.id)}><span className="neighbor-label">← 更早的一篇</span><span className="neighbor-title">{older.title}</span></Link>}
            {newer && <Link className="neighbor neighbor--newer" to={'/articles/' + encodeURIComponent(newer.id)}><span className="neighbor-label">较新的一篇 →</span><span className="neighbor-title">{newer.title}</span></Link>}
          </nav>}
          <div className="foot-links">
            <Link className="text-link" to="/articles">继续逛逛文章 <span className="arrow" aria-hidden="true">→</span></Link>
            <Link className="text-link" to="/algorithms">去算法小屋看看 <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
        </footer>
      </div>
    </div>
  </article>
}
