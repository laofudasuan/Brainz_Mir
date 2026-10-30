import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BrandMark from './BrandMark'
import { blog } from '../data/blog'

const links = [['首页', '/'], ['文章', '/articles'], ['算法小屋', '/algorithms'], ['关于我', '/about']]

export default function Navbar() {
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [raised, setRaised] = useState(false)

  useEffect(() => { setHidden(false) }, [pathname])

  // 向下读时让出空间，向上滑一点就回来；减少动态效果时始终停留。
  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY
      if (Math.abs(delta) > 6 || y < 80) {
        setHidden(!calm.matches && y > 160 && delta > 0)
        lastY = y
      }
      setRaised(y > 8)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const active = path => path === '/' ? pathname === '/' :
    pathname.startsWith(path) || (path === '/articles' && pathname.startsWith('/logs')) ||
    (path === '/algorithms' && /^\/(courseware|visualizations|knowledge-graph)(\/|$)/.test(pathname))

  return <header className="site-header navbar" data-hidden={hidden ? 'true' : 'false'} data-raised={raised ? 'true' : 'false'}>
    <div className="site-header-inner">
      <Link className="site-brand" to="/" aria-label={`${blog.siteName}，首页`}>
        <BrandMark />
        <span className="brand-text"><span className="brand-name">{blog.siteName}</span><span className="brand-sub">{blog.projectName}</span></span>
      </Link>
      <nav aria-label="主导航" className="site-nav">
        {links.map(([label, path]) => <Link key={path} to={path} aria-current={active(path) ? 'page' : undefined}>{label}</Link>)}
      </nav>
    </div>
  </header>
}
