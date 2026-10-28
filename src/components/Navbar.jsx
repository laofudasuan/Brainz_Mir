import { Link, useLocation } from 'react-router-dom'

const links = [['首页', '/'], ['文章', '/articles'], ['算法小屋', '/algorithms'], ['关于我', '/about']]

export default function Navbar() {
  const { pathname } = useLocation()
  const active = path => path === '/' ? pathname === '/' :
    pathname.startsWith(path) || (path === '/articles' && pathname.startsWith('/logs')) ||
    (path === '/algorithms' && /^\/(courseware|visualizations|knowledge-graph)(\/|$)/.test(pathname))
  return <header className="site-header navbar">
    <div className="site-header-inner">
      <Link className="site-brand" to="/" aria-label="老虎大蒜的小站，首页">
        <span className="brand-mark" aria-hidden="true">蒜</span>老虎大蒜的小站
      </Link>
      <nav aria-label="主导航" className="site-nav">
        {links.map(([label, path]) => <Link key={path} to={path} aria-current={active(path) ? 'page' : undefined}>{label}</Link>)}
      </nav>
    </div>
  </header>
}
