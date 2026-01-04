/** @jsx jsx */
import * as React from "react"
import { jsx, Heading } from "theme-ui"
import { HeadFC, PageProps } from "gatsby"
import Layout from "../@lekoarts/gatsby-theme-minimal-blog/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

type SnippetPageContext = {
  slug: string
  title: string
  displayDate?: string
  body?: string
}

// Simple markdown-to-JSX converter for basic content
const renderMarkdown = (text: string) => {
  if (!text) return null
  
  // Split into paragraphs
  const paragraphs = text.split(/\n\n+/)
  
  return paragraphs.map((para, i) => {
    // Skip empty paragraphs and hashtag-only lines
    const trimmed = para.trim()
    if (!trimmed || /^#[a-zA-Z]/.test(trimmed)) return null
    
    // Handle headers
    if (trimmed.startsWith('### ')) {
      return <h3 key={i} sx={{ mt: 4, mb: 2 }}>{trimmed.replace(/^###\s*\*?\*?/, '').replace(/\*?\*?$/, '')}</h3>
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={i} sx={{ mt: 4, mb: 2 }}>{trimmed.replace(/^##\s*\*?\*?/, '').replace(/\*?\*?$/, '')}</h2>
    }
    if (trimmed.startsWith('# ')) {
      return <h1 key={i} sx={{ mt: 4, mb: 2 }}>{trimmed.replace(/^#\s*/, '')}</h1>
    }
    
    // Handle blockquotes
    if (trimmed.startsWith('>')) {
      return (
        <blockquote key={i} sx={{ 
          borderLeft: '4px solid', 
          borderColor: 'primary', 
          pl: 3, 
          ml: 0,
          my: 3,
          fontStyle: 'italic',
          color: 'secondary'
        }}>
          {trimmed.replace(/^>\s*/, '')}
        </blockquote>
      )
    }
    
    // Handle lists
    if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      const lines = trimmed.split('\n')
      const isOrdered = /^\d+\./.test(lines[0])
      const ListComponent = isOrdered ? 'ol' : 'ul'
      return (
        <ListComponent key={i} sx={{ my: 2, pl: 4 }}>
          {lines.map((line, j) => (
            <li key={j} sx={{ mb: 1 }}>
              {line.replace(/^[-*\d.]+\s*/, '')}
            </li>
          ))}
        </ListComponent>
      )
    }
    
    // Handle horizontal rules
    if (/^[-_*]{3,}$/.test(trimmed)) {
      return <hr key={i} sx={{ my: 4, border: 0, borderTop: '1px solid', borderColor: 'muted' }} />
    }
    
    // Regular paragraph - handle bold/italic
    let processed = trimmed
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
    
    return (
      <p key={i} sx={{ my: 2, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: processed }} />
    )
  }).filter(Boolean)
}

const SnippetTemplate: React.FC<PageProps<{}, SnippetPageContext>> = ({ pageContext }) => {
  const { title, displayDate, slug, body } = pageContext
  
  return (
    <Layout>
      <Heading as="h1" variant="styles.h1">
        {title || slug}
      </Heading>
      {displayDate && (
        <p sx={{ color: `secondary`, mt: 3, fontSize: [1, 1, 2] }}>
          {displayDate}
        </p>
      )}
      <p sx={{ 
        mt: 2,
        mb: 4,
      }}>
        <span sx={{ 
          fontSize: 0, 
          color: "secondary",
          bg: "muted",
          px: 2,
          py: 1,
          borderRadius: 4,
        }}>
          Snippet
        </span>
      </p>
      <section sx={{
        my: 5,
        variant: "layout.content",
      }}>
        {renderMarkdown(body || '')}
      </section>
    </Layout>
  )
}

export default SnippetTemplate

export const Head: HeadFC<{}, SnippetPageContext> = ({ pageContext }) => (
  <Seo
    title={pageContext.title || pageContext.slug}
    description={`Snippet: ${pageContext.title || pageContext.slug}`}
  />
)
