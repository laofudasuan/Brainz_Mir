import { useEffect, useRef } from 'react'

// 页面顶端一条细线，显示读到了哪里；直接写 transform，避免滚动时重新渲染。
export default function ReadingProgress({ target }) {
  const bar = useRef(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = target.current
      if (!el || !bar.current) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1
      bar.current.style.transform = `scaleX(${progress})`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [target])

  return <div className="reading-progress" aria-hidden="true"><span ref={bar} /></div>
}
