const fs = require("fs")
const path = require("path")

// Tags to always filter out
const FILTERED_TAGS = ['personal', 'insights']

function extractWikiLinks(content) {
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g
  const links = []
  let match
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    links.push(match[1].trim())
  }
  return [...new Set(links)]
}

function extractTags(content) {
  // Extract tags from frontmatter YAML block only
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return []
  
  const frontmatter = frontmatterMatch[1]
  const tagsMatch = frontmatter.match(/tags:\s*\n((?:\s*-\s*.+\n?)+)/i)
  if (!tagsMatch) return []
  
  const tagLines = tagsMatch[1].match(/-\s*(.+)/g) || []
  return tagLines
    .map(line => line.replace(/^-\s*/, '').trim().toLowerCase())
    .filter(tag => tag.length > 1 && !/^-+$/.test(tag) && !/^loading$/i.test(tag) && !FILTERED_TAGS.includes(tag))
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

// Gatsby API: Filter out unwanted tags from MdxPost
exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    MdxPost: {
      tags: {
        resolve: (source) => {
          if (!source.tags) return []
          
          // Filter out personal/insights tags
          return source.tags.filter(tag => 
            tag && tag.name && !FILTERED_TAGS.includes(tag.name.toLowerCase())
          )
        },
      },
    },
  })
}

exports.onPostBuild = async () => {
  const postsDir = path.join(__dirname, "content", "posts")
  if (!fs.existsSync(postsDir)) return

  const nodes = []
  const links = []
  const allLinkedTargets = new Set()
  const allTags = new Map() // tag -> count
  const titleToSlug = new Map()

  const postDirs = fs.readdirSync(postsDir).filter(f => 
    fs.statSync(path.join(postsDir, f)).isDirectory()
  )

  // First pass: collect all posts and their tags
  for (const dir of postDirs) {
    const mdxPath = path.join(postsDir, dir, "index.mdx")
    const mdPath = path.join(postsDir, dir, "index.md")
    const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null
    if (!filePath) continue

    const content = fs.readFileSync(filePath, "utf-8")
    const titleMatch = content.match(/title:\s*(.+)/i)
    const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, "") : dir
    
    titleToSlug.set(title.toLowerCase(), dir)
    
    const wikiLinks = extractWikiLinks(content)
    const tags = extractTags(content)

    // Count tags
    tags.forEach(tag => {
      const slug = slugify(tag)
      if (slug) allTags.set(tag, (allTags.get(tag) || 0) + 1)
    })

    nodes.push({
      id: dir,
      title,
      slug: `/${dir}/`,
      exists: true,
      isTag: false,
      linkCount: wikiLinks.length + tags.length,
      incomingLinks: 0,
      totalLinks: wikiLinks.length + tags.length,
      tags,
    })

    // Wiki links
    wikiLinks.forEach((linkTitle) => {
      allLinkedTargets.add(linkTitle)
      links.push({
        source: dir,
        target: titleToSlug.get(linkTitle.toLowerCase()) || slugify(linkTitle),
        targetTitle: linkTitle,
      })
    })

    // Tag links
    tags.forEach((tag) => {
      const tagSlug = slugify(tag)
      if (tagSlug) {
        links.push({
          source: dir,
          target: `tag-${tagSlug}`,
          targetTitle: tag,
        })
      }
    })
  }

  // Add tag nodes
  allTags.forEach((count, tag) => {
    const tagSlug = slugify(tag)
    if (tagSlug) {
      nodes.push({
        id: `tag-${tagSlug}`,
        title: tag,
        slug: `/tags/${tagSlug}/`,
        exists: true,
        isTag: true,
        linkCount: count,
        incomingLinks: count,
        totalLinks: count,
      })
    }
  })

  // Add unresolved wiki-link nodes
  allLinkedTargets.forEach((title) => {
    if (!titleToSlug.has(title.toLowerCase())) {
      const slug = slugify(title)
      if (slug && !nodes.find(n => n.id === slug)) {
        nodes.push({ id: slug, title, slug: null, exists: false, isTag: false, linkCount: 0, incomingLinks: 0, totalLinks: 0 })
      }
    }
  })

  // Calculate incoming links for posts
  links.forEach((link) => {
    const node = nodes.find(n => n.id === link.target)
    if (node && !node.isTag) { node.incomingLinks++; node.totalLinks++ }
  })

  // Filter out links with empty targets
  const validLinks = links.filter(l => l.target && l.target.length > 0)

  // Remove tag property before serializing (not needed in output)
  const cleanNodes = nodes.map(({ tags, ...rest }) => rest)

  fs.writeFileSync(path.join(__dirname, "public", "graph-data.json"), JSON.stringify({ nodes: cleanNodes, links: validLinks }))
  console.log(`Graph: ${cleanNodes.length} nodes, ${validLinks.length} links`)
}
