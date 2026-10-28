import { Link } from 'react-router-dom'
import { blog } from '../data/blog'

export default function About() {
  return <div className="blog-page about-page">
    <header className="page-intro"><p className="eyebrow">很高兴在这里遇见你</p><h1>关于我</h1></header>
    <div className="about-copy"><p>{blog.introduction}</p><p>你可以叫我<strong>老虎大蒜</strong>。这个小站用来分享我现在做的事、学习的新知识，以及生活感悟。</p><p>算法可视化也会继续留在这里，成为小站的一个专题。</p></div>
    <div className="about-copy"><p>我给这个项目起名 <strong>Brainz_Mir</strong>，意思是每天大脑思考的数字镜像。把一时的想法留下来，也给之后的理解留一点空间。</p></div>
    <div className="about-links"><Link className="text-link" to="/articles">从文章开始认识我 →</Link><Link className="text-link" to="/algorithms">去算法小屋看看 →</Link></div>
  </div>
}
