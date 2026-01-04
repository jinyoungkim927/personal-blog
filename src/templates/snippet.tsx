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
}

// Client-only wrapper to avoid SSR issues with KaTeX
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  
  if (!hasMounted) {
    return <div style={{ minHeight: "200px" }}>Loading...</div>
  }
  
  return <>{children}</>
}

const SnippetTemplate: React.FC<PageProps<{}, SnippetPageContext>> = ({ children, pageContext }) => {
  const { title, displayDate, slug } = pageContext
  
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
        ".gatsby-resp-image-wrapper": { my: 4 },
        variant: "layout.content",
      }}>
        <ClientOnly>
          {children}
        </ClientOnly>
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
