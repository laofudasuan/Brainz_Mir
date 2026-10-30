import { useEffect } from 'react'
import { blog } from '../data/blog'

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${blog.siteName}` : blog.siteName
    return () => { document.title = blog.siteName }
  }, [title])
}
