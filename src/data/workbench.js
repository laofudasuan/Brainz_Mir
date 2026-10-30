import coursewareMap from './courseware/courseware-map.json'

// 算法小屋的真实数量。非 eager 的 glob 只用来取文件名，不会提前加载课件或演示页。
const coursewareFiles = import.meta.glob(['./courseware/*.json', './courseware/*.mdx', '!./courseware/courseware-map.json'])
const visualizationPages = import.meta.glob(['../pages/visualization/*.jsx', '../pages/visualization/*.jdx'])

const coursewareIds = new Set(Object.keys(coursewareFiles).map(path => path.split('/').pop().replace(/\.(json|mdx)$/, '')))

// 只数课件地图上点得开的课件：地图里还有几个暂时没有对应文件的节点，没放在地图上的课件也不计入。
export const coursewareCount = (Array.isArray(coursewareMap.nodes) ? coursewareMap.nodes : []).filter(node => coursewareIds.has(node.id)).length
export const visualizationCount = Object.keys(visualizationPages).length
