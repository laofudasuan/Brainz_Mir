import { articleIdFromLink } from './articleReferences.js'

// Read Markdown's parsed links, never strings in code, JSX attributes or JS.
// Export just target IDs alongside the already-compiled article, not raw MDX.
export default function remarkArticleLinks() {
  return (tree, file) => {
    const path = String(file.path || '').replace(/\\/g, '/').split('?')[0]
    const match = /(?:^|\/)src\/data\/logs\/([^/]+)\.mdx$/.exec(path)
    if (!match) return
    const sourceId = match[1]
    const definitions = new Map()
    const links = []
    const walk = node => {
      if (['code', 'inlineCode'].includes(node.type)) return
      if (/^mdxJsx/.test(node.type) && ['pre', 'code', 'script', 'style'].includes(node.name)) return
      if (node.type === 'definition' && !definitions.has(node.identifier)) definitions.set(node.identifier, node.url)
      if (node.type === 'link' || node.type === 'linkReference') links.push(node)
      node.children?.forEach(walk)
    }
    walk(tree)
    const targets = [...new Set(links.map(node => articleIdFromLink(
      node.type === 'link' ? node.url : definitions.get(node.identifier), sourceId,
    )).filter(id => id && id !== sourceId))]
    tree.children.push({
      type: 'mdxjsEsm',
      value: `export const __articleLinkTargets = ${JSON.stringify(targets)}`,
      data: { estree: {
        type: 'Program', sourceType: 'module', body: [{
          type: 'ExportNamedDeclaration', specifiers: [], source: null,
          declaration: { type: 'VariableDeclaration', kind: 'const', declarations: [{
            type: 'VariableDeclarator', id: { type: 'Identifier', name: '__articleLinkTargets' },
            init: { type: 'ArrayExpression', elements: targets.map(value => ({ type: 'Literal', value })) },
          }] },
        }],
      } },
    })
  }
}
