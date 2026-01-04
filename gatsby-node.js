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

// Load snippet metadata (quality check results)
function loadSnippetMetadata() {
  const metaPath = path.join(__dirname, "content", "snippets", "_metadata.json")
  if (fs.existsSync(metaPath)) {
    try {
      return JSON.parse(fs.readFileSync(metaPath, "utf-8"))
    } catch (e) {
      console.warn("Failed to load snippet metadata:", e)
    }
  }
  return {}
}

// Process a content directory (posts or snippets)
function processContentDir(dirPath, isSnippet = false, snippetMeta = {}) {
  if (!fs.existsSync(dirPath)) return { nodes: [], titleToSlug: new Map() }
  
  const nodes = []
  const titleToSlug = new Map()
  
  const contentDirs = fs.readdirSync(dirPath).filter(f => {
    const fullPath = path.join(dirPath, f)
    return fs.statSync(fullPath).isDirectory() && !f.startsWith('_')
  })
  
  for (const dir of contentDirs) {
    const mdxPath = path.join(dirPath, dir, "index.mdx")
    const mdPath = path.join(dirPath, dir, "index.md")
    const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null
    if (!filePath) continue

    const content = fs.readFileSync(filePath, "utf-8")
    const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/i)
    const title = titleMatch ? titleMatch[1].trim() : dir
    
    titleToSlug.set(title.toLowerCase(), dir)
    
    const wikiLinks = extractWikiLinks(content)
    const tags = extractTags(content)
    
    // For snippets, check if accessible (quality passed)
    let accessible = true
    if (isSnippet) {
      const meta = snippetMeta[dir] || snippetMeta[title.toLowerCase()]
      if (meta && meta.passes === false) {
        accessible = false
      }
    }

    nodes.push({
      id: isSnippet ? `snippet-${dir}` : dir,
      title,
      slug: isSnippet ? `/snippets/${dir}/` : `/${dir}/`,
      exists: true,
      isTag: false,
      isSnippet,
      accessible,
      linkCount: wikiLinks.length + tags.length,
      incomingLinks: 0,
      totalLinks: wikiLinks.length + tags.length,
      tags,
      wikiLinks,
    })
  }
  
  return { nodes, titleToSlug }
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

// Create pages for snippets
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions
  const snippetsDir = path.join(__dirname, "content", "snippets")
  
  if (!fs.existsSync(snippetsDir)) return
  
  const snippetDirs = fs.readdirSync(snippetsDir).filter(f => {
    const fullPath = path.join(snippetsDir, f)
    return fs.statSync(fullPath).isDirectory() && !f.startsWith('_')
  })
  
  for (const dir of snippetDirs) {
    const mdxPath = path.join(snippetsDir, dir, "index.mdx")
    const mdPath = path.join(snippetsDir, dir, "index.md")
    
    if (fs.existsSync(mdxPath) || fs.existsSync(mdPath)) {
      createPage({
        path: `/snippets/${dir}/`,
        component: require.resolve("./src/templates/snippet.tsx"),
        context: {
          slug: dir,
        },
      })
    }
  }
}

exports.onPostBuild = async () => {
  const postsDir = path.join(__dirname, "content", "posts")
  const snippetsDir = path.join(__dirname, "content", "snippets")
  
  const snippetMeta = loadSnippetMetadata()
  
  // Process posts and snippets
  const { nodes: postNodes, titleToSlug: postTitleToSlug } = processContentDir(postsDir, false)
  const { nodes: snippetNodes, titleToSlug: snippetTitleToSlug } = processContentDir(snippetsDir, true, snippetMeta)
  
  // Merge title maps
  const titleToSlug = new Map([...postTitleToSlug, ...snippetTitleToSlug])
  
  // Combine all nodes
  const allContentNodes = [...postNodes, ...snippetNodes]
  
  const nodes = []
  const links = []
  const allTags = new Map()
  
  // Process each content node
  for (const node of allContentNodes) {
    const { tags, wikiLinks, ...nodeData } = node
    nodes.push(nodeData)
    
    // Count tags
    tags.forEach(tag => {
      const slug = slugify(tag)
      if (slug) allTags.set(tag, (allTags.get(tag) || 0) + 1)
    })
    
    // Wiki links
    wikiLinks.forEach((linkTitle) => {
      const targetSlug = titleToSlug.get(linkTitle.toLowerCase()) || slugify(linkTitle)
      // Check if target is a snippet
      const isSnippetTarget = snippetTitleToSlug.has(linkTitle.toLowerCase())
      links.push({
        source: node.id,
        target: isSnippetTarget ? `snippet-${targetSlug}` : targetSlug,
        targetTitle: linkTitle,
      })
    })
    
    // Tag links
    tags.forEach((tag) => {
      const tagSlug = slugify(tag)
      if (tagSlug) {
        links.push({
          source: node.id,
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
        isSnippet: false,
        accessible: true,
        linkCount: count,
        incomingLinks: count,
        totalLinks: count,
      })
    }
  })
  
  // Add unresolved wiki-link nodes (pages that don't exist)
  const existingIds = new Set(nodes.map(n => n.id))
  links.forEach((link) => {
    if (!existingIds.has(link.target) && !link.target.startsWith('tag-')) {
      const slug = link.target.replace('snippet-', '')
      nodes.push({
        id: link.target,
        title: link.targetTitle,
        slug: null,
        exists: false,
        isTag: false,
        isSnippet: link.target.startsWith('snippet-'),
        accessible: false,
        linkCount: 0,
        incomingLinks: 0,
        totalLinks: 0,
      })
      existingIds.add(link.target)
    }
  })
  
  // Calculate incoming links
  links.forEach((link) => {
    const node = nodes.find(n => n.id === link.target)
    if (node && !node.isTag) {
      node.incomingLinks++
      node.totalLinks++
    }
  })
  
  // Filter out links with empty targets
  const validLinks = links.filter(l => l.target && l.target.length > 0)
  
  fs.writeFileSync(
    path.join(__dirname, "public", "graph-data.json"),
    JSON.stringify({ nodes, links: validLinks })
  )
  console.log(`Graph: ${nodes.length} nodes (${postNodes.length} posts, ${snippetNodes.length} snippets), ${validLinks.length} links`)
}
