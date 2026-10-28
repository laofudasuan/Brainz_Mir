import { Link } from 'react-router-dom'

export default function Algorithms() {
  return <div className="blog-page">
    <header className="page-intro"><p className="eyebrow">小站里的一个专题</p><h1>算法小屋</h1><p>把抽象的思路变得看得见、摸得着。原来的算法资料都在这里，可以继续慢慢探索。</p></header>
    <div className="topic-list">
      <Link to="/courseware"><span className="topic-number">01</span><div><h2>算法课件 <span aria-hidden="true">↗</span></h2><p>沿着课件中的讲解、例题和交互演示，一步步理解算法。</p></div></Link>
      <Link to="/knowledge-graph"><span className="topic-number">02</span><div><h2>知识图谱 <span aria-hidden="true">↗</span></h2><p>从知识之间的联系出发，寻找下一条学习路径。</p></div></Link>
      <Link to="/visualizations"><span className="topic-number">03</span><div><h2>交互可视化 <span aria-hidden="true">↗</span></h2><p>动手试试数组、链表、队列，看看数据结构如何运作。</p></div></Link>
    </div>
    <p className="quiet-note">想换换脑子？<Link className="text-link" to="/articles">也可以读读其他文章 →</Link></p>
  </div>
}
