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

// Extend schema to add displayDate field to MdxPost and create MdxSnippet type
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes, createFieldExtension } = actions
  
  // Create mdxpassthrough extension for snippet fields
  createFieldExtension({
    name: `snippetMdxPassthrough`,
    args: {
      fieldName: `String!`,
    },
    extend({ fieldName }) {
      return {
        async resolve(source, args, context, info) {
          const type = info.schema.getType(`Mdx`)
          const mdxNode = context.nodeModel.getNodeById({ id: source.parent })
          const resolver = type.getFields()[fieldName].resolve
          return resolver(mdxNode, args, context, info)
        },
      }
    },
  })

  createTypes(`
    type MdxPost implements Node {
      displayDate: String
    }
    
    type SnippetTag {
      name: String
      slug: String
    }
    
    type MdxSnippet implements Node {
      id: ID!
      slug: String!
      title: String!
      date: Date! @dateformat
      displayDate: String
      contentFilePath: String!
      excerpt(pruneLength: Int = 140): String! @snippetMdxPassthrough(fieldName: "excerpt")
      tags: [SnippetTag]
    }
  `)
}

// Create MdxSnippet nodes from MDX files in snippets directory
exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  const { createNode, createParentChildLink } = actions
  
  // Only process MDX nodes
  if (node.internal.type !== `Mdx`) return
  
  // Check if this is from the snippets source
  const fileNode = getNode(node.parent)
  if (!fileNode || fileNode.sourceInstanceName !== `snippets`) return
  
  // Skip _metadata.json and other non-mdx files
  if (!fileNode.absolutePath.endsWith('.mdx') && !fileNode.absolutePath.endsWith('.md')) return
  
  // Extract slug from the file path
  const pathParts = fileNode.absolutePath.split('/')
  const snippetDir = pathParts[pathParts.length - 2]
  
  // Skip if this is the root index.mdx (shouldn't exist anymore but just in case)
  if (snippetDir === 'snippets') return
  
  // Process tags
  let modifiedTags = null
  if (node.frontmatter && node.frontmatter.tags) {
    modifiedTags = node.frontmatter.tags
      .filter(tag => tag && !FILTERED_TAGS.includes(tag.toLowerCase()))
      .map((tag) => ({
        name: tag,
        slug: slugify(tag),
      }))
  }
  
  const fieldData = {
    slug: `/snippets/${snippetDir}/`,
    title: node.frontmatter?.title || snippetDir,
    date: node.frontmatter?.date || new Date().toISOString(),
    displayDate: node.frontmatter?.displayDate || null,
    contentFilePath: fileNode.absolutePath,
    tags: modifiedTags,
  }
  
  const mdxSnippetId = createNodeId(`${node.id} >>> MdxSnippet`)
  
  createNode({
    ...fieldData,
    id: mdxSnippetId,
    parent: node.id,
    children: [],
    internal: {
      type: `MdxSnippet`,
      contentDigest: createContentDigest(fieldData),
      content: JSON.stringify(fieldData),
      description: `Mdx implementation of the Snippet interface`,
    },
  })
  
  createParentChildLink({ parent: node, child: getNode(mdxSnippetId) })
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

// Create pages for snippets using GraphQL query for proper MDX processing
exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const snippetTemplate = path.resolve("./src/templates/snippet.tsx")
  
  // Load hidden snippets config
  const hiddenConfig = loadHiddenSnippets()
  const hiddenSlugs = new Set(hiddenConfig.hidden || [])
  
  // Query for all MdxSnippet nodes
  const result = await graphql(`
    {
      allMdxSnippet {
        nodes {
          id
          slug
          title
          displayDate
          contentFilePath
        }
      }
    }
  `)
  
  if (result.errors) {
    reporter.panicOnBuild(`Error loading snippets`, result.errors)
    return
  }
  
  const snippets = result.data?.allMdxSnippet?.nodes || []
  
  snippets.forEach((snippet) => {
    // Extract slug from path (e.g., "/snippets/game-theory/" -> "game-theory")
    const slugParts = snippet.slug.split('/').filter(Boolean)
    const dirName = slugParts[slugParts.length - 1]
    
    // Skip hidden snippets
    if (hiddenSlugs.has(dirName)) {
      console.log(`Skipping hidden snippet: ${dirName}`)
      return
    }
    
    createPage({
      path: snippet.slug,
      component: `${snippetTemplate}?__contentFilePath=${snippet.contentFilePath}`,
      context: {
        slug: snippet.slug,
        title: snippet.title,
        displayDate: snippet.displayDate,
      },
    })
  })
}

// Generate graph data - shared function for both dev and build
function generateGraphData() {
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

// Generate graph data during development (after bootstrap)
exports.onPostBootstrap = async () => {
  generateGraphData()
}

// Also generate during production build
exports.onPostBuild = async () => {
  generateGraphData()
}
