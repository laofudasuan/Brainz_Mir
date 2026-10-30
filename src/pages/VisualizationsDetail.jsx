import React, { Suspense, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../components/Loading'

const modules = {
  ...import.meta.glob('/src/pages/visualization/*.jsx'),
  ...import.meta.glob('/src/pages/visualization/*.jdx')
}

const VisualizationsDetail = () => {
  const { slug } = useParams()

  const matchPath = useMemo(() => {
    const keys = Object.keys(modules)
    return keys.find((p) => p.endsWith(`/${slug}.jsx`) || p.endsWith(`/${slug}.jdx`))
  }, [slug])

  // 只在换演示时创建一次 lazy 组件，避免每次重新渲染都把演示重新挂载。
  const LazyPage = useMemo(() => (matchPath ? React.lazy(modules[matchPath]) : null), [matchPath])

  const back = <nav className="crumbs" aria-label="返回"><Link to="/visualizations"><span className="arrow arrow--back" aria-hidden="true">←</span> 交互可视化</Link></nav>

  if (!LazyPage) {
    return (
      <div className="page">
        {back}
        <h1 className="page-title">没有找到这个演示</h1>
        <p className="empty-note">未找到可视化：{slug}</p>
        <Link className="text-link" to="/visualizations">看看全部演示 <span className="arrow" aria-hidden="true">→</span></Link>
      </div>
    )
  }

  return (
    <div className="page page--wide">
      {back}
      <Suspense fallback={<Loading label="正在搭好演示…" block />}>
        <LazyPage />
      </Suspense>
    </div>
  )
}

export default VisualizationsDetail
