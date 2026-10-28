import { Link } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import { articles } from '../data/articles'
import { blog } from '../data/blog'

export default function Home() {
  return <div className="blog-page home-page">
    <section className="home-intro" aria-labelledby="hello">
      <p className="eyebrow">一点学习，一点生活</p>
      <h1 id="hello">你好，我是<span>老虎大蒜</span>。</h1>
      <p className="intro-copy">{blog.introduction.slice('你好，我是老虎大蒜。'.length)}</p>
      <Link className="text-link" to="/about">多认识我一点 <span aria-hidden="true">↗</span></Link>
    </section>
    <section className="now-section" aria-labelledby="now">
      <div><h2 id="now"><span className="status-dot" aria-hidden="true" />最近在忙</h2>{blog.nowUpdated && <time dateTime={blog.nowUpdated}>{blog.nowUpdated} 更新</time>}</div>
      {blog.now.length ? <ul>{blog.now.map((item, index) => <li key={index}>{item.href ? <Link to={item.href}>{item.text}</Link> : item.text}</li>)}</ul> : <p>近况还没写下，先从这里的文章逛起吧。</p>}
    </section>
    <section className="latest-section" aria-labelledby="latest">
      <div className="section-heading"><h2 id="latest">最近写下的</h2><Link className="text-link" to="/articles">全部文章 <span aria-hidden="true">→</span></Link></div>
      <ArticleList articles={articles.slice(0, 5)} />
    </section>
    <aside className="algorithm-invitation">
      <span className="small-symbol" aria-hidden="true">{'{ }'}</span>
      <div><h2>偶尔，也一起玩玩算法</h2><p>原来的课件、知识图谱和交互演示，都收在算法小屋里。</p><Link className="text-link" to="/algorithms">去算法小屋坐坐 <span aria-hidden="true">→</span></Link></div>
    </aside>
  </div>
}
