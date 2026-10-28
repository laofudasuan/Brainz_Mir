import { Suspense, lazy, useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import './index.css'
import './styles/blog.css'

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
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    // Legacy global overflow styles make body the scroll container in Chromium.
    document.body.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return <>
    <a className="skip-link" href="#main-content">跳到正文</a>
    <Navbar />
    <main id="main-content" tabIndex={-1}>
      <Suspense fallback={<div className="blog-page" role="status">正在打开这一页…</div>}>
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
    <footer className="site-footer"><span>老虎大蒜的小站</span><span>学习、折腾，也记录生活。</span><span>湘ICP备2025147087号</span></footer>
    <ScrollToTop />
  </>
}
