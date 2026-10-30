import { useId, useLayoutEffect, useRef, useState } from 'react'

// 演示的画框：图比画框宽时只在框里横向滚动，页面本身不会变宽。
// 需要滚动时，画框可以用 Tab 聚焦后用方向键滚动，下面再多一行提示。
export default function DemoStage({ label, children }) {
  const frame = useRef(null)
  const hintId = useId()
  const [scrollable, setScrollable] = useState(false)

  useLayoutEffect(() => {
    const el = frame.current
    if (!el) return
    const measure = () => setScrollable(el.scrollWidth - el.clientWidth > 1)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollProps = scrollable ? { role: 'region', 'aria-label': label, 'aria-describedby': hintId, tabIndex: 0 } : {}
  return <>
    <div ref={frame} className="stage" {...scrollProps}>{children}</div>
    {scrollable && <p className="stage-hint" id={hintId}><span aria-hidden="true">↔</span>图示比画框宽，可以在框里左右滑动查看。</p>}
  </>
}
