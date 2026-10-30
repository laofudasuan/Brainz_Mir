import { Suspense, lazy, useLayoutEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Loading from './components/Loading'
import './index.css'
import './styles/blog.css'
import './styles/workbench.css'

const Home = lazy(() => import('./pages/Home'))
const Articles = lazy(() => import('./pages/Articles'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Algorithms = lazy(() => import('./pages/Algorithms'))
const About = lazy(() => import('./pages/About'))
const KnowledgeGraphPage = lazy(() => import('./pages/KnowledgeGraphPage'))
const CoursewareList = lazy(() => import('./pages/CoursewareList'))
const CoursewareDetail = lazy(() => import('./pages/CoursewareDetail'))
const VisualizationsIndex = lazy(() => import('./pages/VisualizationsIndex'))
const VisualizationsDetail = lazy(() => import('./pages/VisualizationsDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const { pathname } = useLocation()
  const firstRender = useRef(true)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.body.scrollTo({ top: 0, behavior: 'instant' })
    // 站内跳转后把键盘焦点放回正文开头，而不是留在已经消失的链接上（首次打开时不移动）。
    if (firstRender.current) firstRender.current = false
    else document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [pathname])
  // 课件地图与课件阅读是全屏的工作台，不显示页脚。
  const immersive = /^\/courseware(\/|$)/.test(pathname)

  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#main-content">跳到正文</a>
    <Navbar />
    <main id="main-content" className="site-main" tabIndex={-1}>
      <Suspense fallback={<div className="page"><Loading label="正在打开这一页…" block /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/logs" element={<Articles />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/about" element={<About />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="/courseware" element={<CoursewareList />} />
          <Route path="/courseware/:id" element={<CoursewareDetail />} />
          <Route path="/visualizations" element={<VisualizationsIndex />} />
          <Route path="/visualizations/:slug" element={<VisualizationsDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
    {!immersive && <Footer />}
    <ScrollToTop />
  </MotionConfig>
}
