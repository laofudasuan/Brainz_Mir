import { Link } from 'react-router-dom'
import Reflection from '../components/Reflection'
import useDocumentTitle from '../components/useDocumentTitle'

const NotFound = () => {
  useDocumentTitle('页面未找到')
  return (
    <div className="page lost">
      <p className="lost-code" aria-hidden="true"><span>404</span><Reflection>404</Reflection></p>
      <h1 className="page-title">页面未找到</h1>
      <p className="lead">抱歉，你访问的页面不存在或已被移除。</p>
      <div className="hero-actions">
        <Link className="btn btn-primary" to="/"><span className="arrow arrow--back" aria-hidden="true">←</span> 返回首页</Link>
        <Link className="text-link" to="/articles">去读读文章 <span className="arrow" aria-hidden="true">→</span></Link>
      </div>
    </div>
  )
}

export default NotFound
