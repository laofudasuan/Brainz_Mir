import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import { blog } from '../data/blog'

export default function Footer() {
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="footer-brand">
        <BrandMark size="sm" />
        <div><strong>{blog.siteName}</strong><span>学习、折腾，也记录生活。</span></div>
      </div>
      <nav className="footer-links" aria-label="页脚导航">
        <Link to="/articles">文章</Link>
        <Link to="/algorithms">算法小屋</Link>
        <Link to="/about">关于我</Link>
      </nav>
      <p className="footer-legal">
        <span>{blog.projectName} · {blog.projectMeaning}</span>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">湘ICP备2025147087号</a>
      </p>
    </div>
  </footer>
}
