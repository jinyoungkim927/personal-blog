const fs = require("fs")
const path = require("path")

function extractWikiLinks(content) {
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g
  const links = []
  let match
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    links.push(match[1].trim())
  }
  return [...new Set(links)]
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

exports.onPostBuild = async () => {
  const postsDir = path.join(__dirname, "content", "posts")
  if (!fs.existsSync(postsDir)) return

  const nodes = []
  const links = []
  const allLinkedTargets = new Set()
  const titleToSlug = new Map()

  const postDirs = fs.readdirSync(postsDir).filter(f => 
    fs.statSync(path.join(postsDir, f)).isDirectory()
  )

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

    nodes.push({
      id: dir,
      title,
      slug: `/${dir}/`,
      exists: true,
      linkCount: wikiLinks.length,
      incomingLinks: 0,
      totalLinks: wikiLinks.length,
    })

    wikiLinks.forEach((linkTitle) => {
      allLinkedTargets.add(linkTitle)
      links.push({
        source: dir,
        target: titleToSlug.get(linkTitle.toLowerCase()) || slugify(linkTitle),
        targetTitle: linkTitle,
      })
    })
  }

  allLinkedTargets.forEach((title) => {
    if (!titleToSlug.has(title.toLowerCase())) {
      const slug = slugify(title)
      if (!nodes.find(n => n.id === slug)) {
        nodes.push({ id: slug, title, slug: null, exists: false, linkCount: 0, incomingLinks: 0, totalLinks: 0 })
      }
    }
  })

  links.forEach((link) => {
    const node = nodes.find(n => n.id === link.target)
    if (node) { node.incomingLinks++; node.totalLinks++ }
  })

  fs.writeFileSync(path.join(__dirname, "public", "graph-data.json"), JSON.stringify({ nodes, links }))
  console.log(`Graph: ${nodes.length} nodes, ${links.length} links`)
}

