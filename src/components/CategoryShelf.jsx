import { Link } from 'react-router-dom'
import { categories, categoryKey, countByCategory } from '../data/articleModel'
import { categoryNotes } from '../data/blog'

// 三本“笔记本”：学习、折腾、生活，数字来自当前公开的文章。
export default function CategoryShelf({ articles, headingLevel = 3 }) {
  const counts = countByCategory(articles)
  const Title = `h${headingLevel}`
  return <ul className="shelf">
    {categories.map((category, index) => <li key={category} className={`rise cat--${categoryKey(category)}`} style={{ '--i': index }}>
      <Link className="shelf-link" to={'/articles?category=' + encodeURIComponent(category)}>
        <Title className="shelf-name">{category}</Title>
        <p className="shelf-note">{categoryNotes[category]}</p>
        <p className="shelf-count">{counts[category] ? <><b>{counts[category]}</b>篇公开</> : '还没有公开的文章'}</p>
      </Link>
    </li>)}
  </ul>
}
