// 算法小屋三个房间的线描小图，纯装饰。
const maps = {
  map: <>
    <path className="art-line" d="M58 40C84 40 82 66 108 66M58 92C84 92 82 66 108 66M152 66C166 66 164 38 180 38M152 66C166 66 164 96 180 96" />
    {[[18, 30, 40, 'learn'], [18, 82, 40, 'tiger'], [108, 56, 44, 'learn'], [180, 28, 24, 'plum'], [180, 86, 24, 'slate']].map(([x, y, w, tone]) => <g key={`${x}-${y}`}>
      <rect className="art-node" x={x} y={y} width={w} height="20" rx="7" />
      <rect className="art-text" x={x + 8} y={y + 9} width={w - 16} height="2.4" rx="1.2" />
      <circle className={`art-dot--${tone}`} cx={x + w / 2} cy={y} r="3.6" />
    </g>)}
  </>,
  graph: <>
    <ellipse className="art-orbit" cx="110" cy="66" rx="86" ry="34" />
    <path className="art-line" d="M110 66L46 50M110 66L70 98M110 66L156 40M110 66L176 88M110 66L88 30M156 40L176 88M46 50L88 30M70 98L130 108" />
    {[[110, 66, 9, 'learn'], [46, 50, 5, 'tiger'], [70, 98, 4.5, 'plum'], [156, 40, 6, 'slate'], [176, 88, 4.5, 'learn'], [130, 108, 3.6, 'tiger'], [88, 30, 3.6, 'learn']].map(([cx, cy, r, tone]) => <circle key={`${cx}-${cy}`} className={`art-dot--${tone}`} cx={cx} cy={cy} r={r} />)}
  </>,
  array: <>
    <path className="art-line" d="M126 22V42M121 37L126 43L131 37" />
    {[3, 1, 4, 1, 5, 9].map((value, index) => <g key={index}>
      <rect className={index === 3 ? 'art-cell art-cell--hot' : 'art-cell'} x={22 + index * 30} y="50" width="28" height="28" rx="5" />
      <text className="art-num" x={36 + index * 30} y="68">{value}</text>
      <text className="art-index" x={36 + index * 30} y="94">{index}</text>
    </g>)}
  </>,
}

export default function WorkbenchArt({ kind = 'map' }) {
  return <svg viewBox="0 0 220 132" fill="none" aria-hidden="true" focusable="false">{maps[kind]}</svg>
}
