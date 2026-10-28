import { articleCategories } from './blog'
import { createArticleIndex } from './articleModel'

// Reuse the existing small MDX collection; avoid importing the same module both
// eagerly for metadata and lazily for its body (which Rollup cannot split).
const modules = import.meta.glob('./logs/*.mdx', { eager: true })
const metadata = Object.fromEntries(Object.entries(modules).map(([path, module]) => [path, module.frontmatter || module.attributes]))
export const articles = createArticleIndex(metadata, articleCategories).map(article => ({
  ...article, Component: modules[article.path].default,
}))
