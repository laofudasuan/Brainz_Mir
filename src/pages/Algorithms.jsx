import { Link } from 'react-router-dom'
import WorkbenchArt from '../components/WorkbenchArt'
import useDocumentTitle from '../components/useDocumentTitle'
import { articles } from '../data/articles'
import { coursewareCount, visualizationCount } from '../data/workbench'

const rooms = [
  { to: '/courseware', art: 'map', title: '算法课件', text: '沿着课件中的讲解、例题和交互演示，一步步理解算法。', facts: <><span><b>{coursewareCount}</b>份课件</span><span>地图或列表浏览</span></> },
  { to: '/knowledge-graph', art: 'graph', title: '知识图谱', text: '从知识之间的联系出发，寻找下一条学习路径。', facts: <><span className="status-pill">框架搭建中</span><span>目前是示例数据</span></> },
  { to: '/visualizations', art: 'array', title: '交互可视化', text: '动手试试数组、链表、队列，看看数据结构如何运作。', facts: <><span><b>{visualizationCount}</b>个交互演示</span></> },
]

export default function Algorithms() {
  useDocumentTitle('算法小屋')
  // 引文摘自公开文章《欢迎来到老虎大蒜的个人网站》；文章不再公开时不显示。
  const origin = articles.find(article => article.id === 'top')

  return <div className="page">
    <header className="page-intro">
      <p className="eyebrow">小站里的一个专题</p>
      <h1>算法小屋</h1>
      <p>把抽象的思路变得看得见、摸得着。原来的算法资料都在这里，可以继续慢慢探索。</p>
    </header>

    <ol className="rooms">
      {rooms.map((room, index) => <li key={room.to} className="rise" style={{ '--i': index }}>
        <Link className="room-link" to={room.to}>
          <span className="room-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="room-go" aria-hidden="true">↗</span>
          <span className="room-art"><WorkbenchArt kind={room.art} /></span>
          <h2 className="room-title">{room.title}</h2>
          <p className="room-text">{room.text}</p>
          <p className="facts">{room.facts}</p>
        </Link>
      </li>)}
    </ol>

    {origin && <figure className="author-quote">
      <blockquote>我的目标是能在三年之内，让网站可视化组件的比重超过文字的比重。</blockquote>
      <figcaption>摘自 <Link to={'/articles/' + encodeURIComponent(origin.id)}>《{origin.title}》</Link></figcaption>
    </figure>}

    <p className="quiet-note">想换换脑子？<Link className="text-link" to="/articles">也可以读读其他文章 <span className="arrow" aria-hidden="true">→</span></Link></p>
  </div>
}
