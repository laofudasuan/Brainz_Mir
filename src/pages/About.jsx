import { Link } from 'react-router-dom'
import CategoryShelf from '../components/CategoryShelf'
import Reflection from '../components/Reflection'
import useDocumentTitle from '../components/useDocumentTitle'
import { articles } from '../data/articles'
import { blog } from '../data/blog'

export default function About() {
  useDocumentTitle('关于我')
  // 只在这篇介绍仍然公开时才链接它。
  const origin = articles.find(article => article.id === 'top')
  const word = <>Brainz<i>_</i>Mir</>

  return <div className="page about-page">
    <header className="page-intro">
      <p className="eyebrow">很高兴在这里遇见你</p>
      <h1>关于我</h1>
    </header>

    <div className="ledger">
      <div className="ledger-label"><h2>你好</h2></div>
      <div className="about-copy">
        <p>{blog.introduction}</p>
        <p>你可以叫我<strong>{blog.author}</strong>。这个小站用来分享我现在做的事、学习的新知识，以及生活感悟。</p>
        <p>算法可视化也会继续留在这里，成为小站的一个专题。</p>
      </div>
    </div>

    <section className="mirror-panel" aria-labelledby="mirror-name">
      <p className="mirror-word" id="mirror-name"><span>{word}</span><Reflection>{word}</Reflection></p>
      <p>我给这个项目起名 <strong>{blog.projectName}</strong>，意思是{blog.projectMeaning}。把一时的想法留下来，也给之后的理解留一点空间。</p>
    </section>

    <section className="about-section" aria-labelledby="notebooks">
      <h2 id="notebooks">在这里会读到</h2>
      <CategoryShelf articles={articles} />
    </section>

    <nav className="about-links" aria-label="从这里出发">
      <Link className="text-link" to="/articles">从文章开始认识我 <span className="arrow" aria-hidden="true">→</span></Link>
      <Link className="text-link" to="/algorithms">去算法小屋看看 <span className="arrow" aria-hidden="true">→</span></Link>
      {origin && <Link className="text-link" to={'/articles/' + encodeURIComponent(origin.id)}>读读《{origin.title}》 <span className="arrow" aria-hidden="true">→</span></Link>}
    </nav>
  </div>
}
