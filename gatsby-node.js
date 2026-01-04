const fs = require("fs")
const path = require("path")

// Tags to always filter out
const FILTERED_TAGS = ['personal', 'insights']

function extractWikiLinks(content) {
  const links = []
  
  // Extract Obsidian-style wiki-links: [[Target]] or [[Target|Display]]
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g
  let match
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    links.push(match[1].trim())
  }
  
  // Also extract converted markdown links to snippets: [text](/snippets/slug/)
  const snippetLinkRegex = /\[[^\]]+\]\(\/snippets\/([^/)]+)\/?\)/g
  while ((match = snippetLinkRegex.exec(content)) !== null) {
    // Convert slug back to a rough title match (we'll resolve by slug)
    links.push(`snippet:${match[1]}`)
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

// Extend schema to add displayDate field to MdxPost
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  
  // Add displayDate field to MdxPost
  createTypes(`
    type MdxPost implements Node {
      displayDate: String
    }
  `)
}

// Gatsby API: Filter out unwanted tags from MdxPost and adjust timeToRead
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
      // Reduce timeToRead by 1/3 (multiply by 2/3)
      timeToRead: {
        resolve: (source) => {
          if (!source.timeToRead) return null
          return Math.max(1, Math.round(source.timeToRead * 0.67))
        },
      },
      // Add displayDate from frontmatter
      displayDate: {
        resolve: (source, args, context, info) => {
          // Try to get displayDate from the parent MDX node's frontmatter
          if (source.contentFilePath) {
            try {
              const content = fs.readFileSync(source.contentFilePath, 'utf-8')
              const match = content.match(/displayDate:\s*["']?([^"'\n]+)["']?/i)
              if (match) {
                return match[1].trim()
              }
            } catch (e) {
              // Fall back to null if file can't be read
            }
          }
          return null
        },
      },
    },
  })
}

// Load hidden snippets config
function loadHiddenSnippets() {
  const configPath = path.join(__dirname, "scripts", "hidden_snippets.json")
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"))
    } catch (e) {
      console.warn("Failed to load hidden_snippets.json:", e)
    }
  }
  return { hidden: [] }
}

// Create pages for snippets
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions
  const snippetsDir = path.join(__dirname, "content", "snippets")
  const snippetTemplate = path.resolve("./src/templates/snippet.tsx")
  
  if (!fs.existsSync(snippetsDir)) return
  
  // Load hidden snippets config
  const hiddenConfig = loadHiddenSnippets()
  const hiddenSlugs = new Set(hiddenConfig.hidden || [])
  
  const snippetDirs = fs.readdirSync(snippetsDir).filter(f => {
    const fullPath = path.join(snippetsDir, f)
    return fs.statSync(fullPath).isDirectory() && !f.startsWith('_')
  })
  
  for (const dir of snippetDirs) {
    // Skip hidden snippets
    if (hiddenSlugs.has(dir)) {
      console.log(`Skipping hidden snippet: ${dir}`)
      continue
    }
    
    const mdxPath = path.join(snippetsDir, dir, "index.mdx")
    const mdPath = path.join(snippetsDir, dir, "index.md")
    const contentFilePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null
    
    if (contentFilePath) {
      // Read the file to get title and body
      const content = fs.readFileSync(contentFilePath, "utf-8")
      const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/i)
      const title = titleMatch ? titleMatch[1].trim() : dir
      
      // Check for displayDate
      const displayDateMatch = content.match(/displayDate:\s*["']?([^"'\n]+)["']?/i)
      const displayDate = displayDateMatch ? displayDateMatch[1].trim() : null
      
      // Extract body content (after frontmatter)
      let body = content
      if (content.startsWith('---')) {
        const parts = content.split('---')
        if (parts.length >= 3) {
          body = parts.slice(2).join('---').trim()
        }
      }
      
      createPage({
        path: `/snippets/${dir}/`,
        component: snippetTemplate,
        context: {
          slug: dir,
          title: title,
          displayDate: displayDate,
          body: body,
        },
      })
    }
  }
}

exports.onPostBuild = async () => {
  const postsDir = path.join(__dirname, "content", "posts")
  const snippetsDir = path.join(__dirname, "content", "snippets")
  
  const snippetMeta = loadSnippetMetadata()
  const hiddenConfig = loadHiddenSnippets()
  const hiddenSlugs = new Set(hiddenConfig.hidden || [])
  
  // Process posts and snippets
  const { nodes: postNodes, titleToSlug: postTitleToSlug } = processContentDir(postsDir, false)
  const { nodes: snippetNodes, titleToSlug: snippetTitleToSlug } = processContentDir(snippetsDir, true, snippetMeta)
  
  // Filter out hidden snippets from nodes
  const visibleSnippetNodes = snippetNodes.filter(n => !hiddenSlugs.has(n.id.replace('snippet-', '')))
  
  // Merge title maps
  const titleToSlug = new Map([...postTitleToSlug, ...snippetTitleToSlug])
  
  // Combine all nodes
  const allContentNodes = [...postNodes, ...visibleSnippetNodes]
  
  const nodes = []
  const links = []
  const allTags = new Map()
  
  // Process each content node
  for (const node of allContentNodes) {
    const { tags, wikiLinks, ...nodeData } = node
    nodes.push(nodeData)
    
    // Count tags
    tags.forEach(tag => {
      const tagSlug = slugify(tag)
      if (tagSlug) allTags.set(tag, (allTags.get(tag) || 0) + 1)
    })
    
    // Wiki links - only create for non-snippet nodes (posts)
    // This connects posts TO snippets
    if (!node.isSnippet) {
      wikiLinks.forEach((linkTitle) => {
        let targetSlug, targetId, displayTitle
        
        // Check if this is a converted snippet link (snippet:slug format)
        if (linkTitle.startsWith('snippet:')) {
          targetSlug = linkTitle.replace('snippet:', '')
          targetId = `snippet-${targetSlug}`
          displayTitle = targetSlug // Will be resolved to title if exists
        } else {
          targetSlug = titleToSlug.get(linkTitle.toLowerCase()) || slugify(linkTitle)
          // Check if target is a snippet
          const isSnippetTarget = snippetTitleToSlug.has(linkTitle.toLowerCase())
          targetId = isSnippetTarget ? `snippet-${targetSlug}` : targetSlug
          displayTitle = linkTitle
        }
        
        // Skip hidden snippets
        if (hiddenSlugs.has(targetSlug)) return
        
        // Only add link if target exists (valid link)
        if (targetSlug && targetSlug.length > 0) {
          links.push({
            source: node.id,
            target: targetId,
            targetTitle: displayTitle,
          })
        }
      })
    }

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

  // Add unresolved wiki-link nodes (pages that don't exist yet)
  const existingIds = new Set(nodes.map(n => n.id))
  links.forEach((link) => {
    if (!existingIds.has(link.target) && !link.target.startsWith('tag-')) {
      const isSnippet = link.target.startsWith('snippet-')
      const slug = isSnippet ? link.target.replace('snippet-', '') : link.target
      
      // Skip adding nodes for hidden snippets
      if (hiddenSlugs.has(slug)) return
      
      nodes.push({
        id: link.target,
        title: link.targetTitle,
        slug: isSnippet ? `/snippets/${slug}/` : null,
        exists: false,
        isTag: false,
        isSnippet: isSnippet,
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
  
  // Filter out links with empty targets or to hidden nodes
  const validLinks = links.filter(l => {
    if (!l.target || l.target.length === 0) return false
    const slug = l.target.replace('snippet-', '').replace('tag-', '')
    if (hiddenSlugs.has(slug)) return false
    return true
  })
  
  fs.writeFileSync(
    path.join(__dirname, "public", "graph-data.json"),
    JSON.stringify({ nodes, links: validLinks })
  )
  console.log(`Graph: ${nodes.length} nodes (${postNodes.length} posts, ${visibleSnippetNodes.length} snippets), ${validLinks.length} links`)
}
