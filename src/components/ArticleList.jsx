import { Link } from 'react-router-dom'
import { categoryKey, splitDate } from '../data/articleModel'

// 页边写日期，主栏写标题；“补记于”表示之后回来补充过，“附原文来源”表示读后笔记带着原文链接。
export default function ArticleList({ articles, headingLevel = 2, showYear = true, emptyText = '这里还没有文章，等有了想记录的事再慢慢添上。' }) {
  if (!articles.length) return <p className="empty-note" role="status">{emptyText}</p>
  const Title = `h${headingLevel}`
  return <ol className="entries">
    {articles.map((article, index) => {
      const { year, monthDay } = splitDate(article.date)
      return <li key={article.id} className={`entry rise cat--${categoryKey(article.category)}`} style={{ '--i': index }}>
        <div className="entry-when">
          {monthDay ? <time dateTime={article.date}><span className="entry-md">{monthDay}</span>{showYear && <span className="entry-year">{year}</span>}</time> : <span className="entry-md">日期未填写</span>}
        </div>
        <div className="entry-body">
          <div className="entry-kicker">
            <span className="chip">{article.category}</span>
            {article.updated && article.updated !== article.date && <span className="echo-mark">补记于 <time dateTime={article.updated}>{article.updated}</time></span>}
            {article.sourceUrl && <span className="source-mark">附原文来源</span>}
          </div>
          <Title className="entry-title"><Link to={'/articles/' + encodeURIComponent(article.id)}>{article.title}<span aria-hidden="true" className="entry-arrow">→</span></Link></Title>
          {article.description && <p className="entry-desc">{article.description}</p>}
          {article.tags.length > 0 && <ul className="entry-tags" aria-label="标签">
            {article.tags.map(tag => <li key={tag}><Link to={'/articles?tag=' + encodeURIComponent(tag)}>#{tag}</Link></li>)}
          </ul>}
        </div>
      </li>
    })}
  </ol>
}
