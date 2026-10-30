import Reflection from './Reflection'

// 小站印记：“蒜”字立在一条虎斑色水平线上，下面是它的倒影（Brainz_Mir 的“镜像”）。
export default function BrandMark({ size = 'md' }) {
  return <span className={`brand-mark brand-mark--${size}`} aria-hidden="true">
    <span className="brand-glyph">蒜</span>
    <Reflection><span className="brand-glyph">蒜</span></Reflection>
  </span>
}
