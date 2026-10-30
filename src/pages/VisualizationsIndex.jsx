import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import useDocumentTitle from '../components/useDocumentTitle'

const VisualizationsIndex = () => {
  useDocumentTitle('交互可视化')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const modsJsx = import.meta.glob('/src/pages/visualization/*.jsx')
    const modsJdx = import.meta.glob('/src/pages/visualization/*.jdx')
    const modules = { ...modsJsx, ...modsJdx }
    const keys = Object.keys(modules)
    ;(async () => {
      const list = []
      for (const path of keys) {
        try {
          const mod = await modules[path]()
          const comp = mod.default
          const file = path.split('/').pop()
          const slug = file.replace(/\.(jsx|jdx)$/i, '')
          const title = comp?.title || mod.title || slug
          const description = comp?.description || mod.description || ''
          list.push({ slug, title, description })
        } catch {
          const file = path.split('/').pop()
          const slug = file.replace(/\.(jsx|jdx)$/i, '')
          list.push({ slug, title: slug, description: '' })
        }
      }
      setItems(list)
      setLoading(false)
    })()
  }, [])

  return (
    <div className="page">
      <nav className="crumbs" aria-label="返回"><Link to="/algorithms"><span className="arrow arrow--back" aria-hidden="true">←</span> 算法小屋</Link></nav>
      <header className="page-intro">
        <p className="eyebrow">算法小屋 · 交互可视化</p>
        <h1>可视化模块</h1>
        <p>动手试试数组、链表、队列，看看数据结构如何运作。</p>
      </header>
      {loading ? (
        <Loading label="正在整理演示…" block />
      ) : (
        <ol className="viz-list">
          {items.map((it, index) => (
            <li key={it.slug} className="rise" style={{ '--i': index }}>
              <Link className="viz-row" to={`/visualizations/${it.slug}`}>
                <span className="viz-index">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="viz-title">{it.title}</span>
                  {it.description && <span className="viz-desc">{it.description}</span>}
                </span>
                <span className="viz-go">打开 <span className="arrow" aria-hidden="true">→</span></span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default VisualizationsIndex
