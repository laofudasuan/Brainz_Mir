// 等待时用一个缓慢“呼吸”的圆点代替旋转图标。
export default function Loading({ label = '正在打开…', block = false, night = false }) {
  const className = ['breath', block && 'breath--block', night && 'breath--night'].filter(Boolean).join(' ')
  return <div className={className} role="status">{label}</div>
}
