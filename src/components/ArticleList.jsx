import { Link } from 'react-router-dom'

export default function ArticleList({ articles }) {
  if (!articles.length) return <p className="empty-note" role="status">这里还没有文章，等有了想记录的事再慢慢添上。</p>
  return <ol className="article-list">
    {articles.map(article => <li key={article.id}>
      <div className="article-meta"><time dateTime={article.date}>{article.date || '日期未填写'}</time><span className="category-label">{article.category}</span>{article.updated && article.updated !== article.date && <span>补记于 <time dateTime={article.updated}>{article.updated}</time></span>}</div>
      <h2><Link to={'/articles/' + encodeURIComponent(article.id)}>{article.title}<span aria-hidden="true" className="article-arrow">↗</span></Link></h2>
      {article.description && <p>{article.description}</p>}
      {article.tags.length > 0 && <div className="article-tags">{article.tags.map(tag => <span key={tag}>#{tag}</span>)}</div>}
    </li>)}
  </ol>
}
