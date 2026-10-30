// 水面倒影：把同样的文字翻转后只露出靠近水平线的一截，纯装饰，对读屏软件隐藏。
export default function Reflection({ children }) {
  return <span className="reflection" aria-hidden="true"><span>{children}</span></span>
}
