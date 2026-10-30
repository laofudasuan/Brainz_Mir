import { useEffect, useState } from 'react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const check = () => {
      frame = 0
      setIsVisible(Math.max(window.scrollY, document.body.scrollTop) > 640)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check) }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.body.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      document.body.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollToTop = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    document.body.scrollTo({ top: 0, behavior })
    window.scrollTo({ top: 0, behavior })
    // 按钮随即隐藏，把键盘焦点交还给正文开头。
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }

  return (
    <button type="button" className="to-top" data-visible={isVisible ? 'true' : 'false'} onClick={scrollToTop} aria-label="回到顶部">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  )
}

export default ScrollToTop
