import { Link } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import CategoryShelf from '../components/CategoryShelf'
import Reflection from '../components/Reflection'
import WorkbenchArt from '../components/WorkbenchArt'
import useDocumentTitle from '../components/useDocumentTitle'
import { articles } from '../data/articles'
import { blog } from '../data/blog'
import { coursewareCount, visualizationCount } from '../data/workbench'

const greeting = '你好，我是老虎大蒜。'

export default function Home() {
  useDocumentTitle('')
  const intro = blog.introduction.startsWith(greeting) ? blog.introduction.slice(greeting.length) : blog.introduction
  const title = <>你好，我是<em>{blog.author}</em>。</>

  return <div className="page home-page">
    <section className="hero" aria-labelledby="hello">
      <p className="eyebrow rise" style={{ '--i': 0 }}><b>{blog.projectName}</b> · {blog.projectMeaning}</p>
      <div className="hero-mirror rise" style={{ '--i': 1 }}>
        <h1 id="hello" className="hero-title">{title}</h1>
        <span className="hero-horizon" aria-hidden="true" />
        <Reflection>{title}</Reflection>
      </div>
      <p className="hero-lede rise" style={{ '--i': 2 }}>{intro}</p>
      <div className="hero-actions rise" style={{ '--i': 3 }}>
        <Link className="btn btn-primary" to="/articles">从文章读起 <span className="arrow" aria-hidden="true">→</span></Link>
        <Link className="text-link" to="/about">多认识我一点 <span className="arrow" aria-hidden="true">→</span></Link>
      </div>
    </section>

    <hr className="horizon" />

    <section className="ledger" aria-labelledby="now">
      <div className="ledger-label">
        <h2 id="now">最近在忙</h2>
        {blog.nowUpdated && <p><time dateTime={blog.nowUpdated}>{blog.nowUpdated}</time> 更新</p>}
      </div>
      <div>
        {blog.now.length
          ? <ul className="now-list">{blog.now.map((item, index) => <li key={index}>{item.href ? <Link to={item.href}>{item.text}</Link> : item.text}</li>)}</ul>
          : <p className="margin-note">近况还没写下，先从这里的文章逛起吧。</p>}
      </div>
    </section>

    <section className="ledger" aria-labelledby="latest">
      <div className="ledger-label">
        <h2 id="latest">最近写下的</h2>
        <Link className="text-link" to="/articles">全部文章 <span className="arrow" aria-hidden="true">→</span></Link>
      </div>
      <ArticleList articles={articles.slice(0, 5)} headingLevel={3} />
    </section>

    <section className="ledger" aria-labelledby="notebooks">
      <div className="ledger-label">
        <h2 id="notebooks">三种笔记</h2>
        <p>学习、折腾，也记录生活。</p>
      </div>
      <CategoryShelf articles={articles} />
    </section>

    <section className="ledger" aria-labelledby="workbench">
      <div className="ledger-label"><h2 id="workbench">算法小屋</h2></div>
      <div className="invite">
        <div>
          <h3>偶尔，也一起玩玩算法</h3>
          <p>原来的课件、知识图谱和交互演示，都收在算法小屋里。</p>
          <p className="facts"><span><b>{coursewareCount}</b>份课件</span><span><b>{visualizationCount}</b>个交互演示</span><span>知识图谱搭建中</span></p>
          <Link className="text-link" to="/algorithms">去算法小屋坐坐 <span className="arrow" aria-hidden="true">→</span></Link>
        </div>
        <div className="invite-art"><WorkbenchArt kind="map" /></div>
      </div>
    </section>
  </div>
}
