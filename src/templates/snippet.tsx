/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { HeadFC, PageProps } from "gatsby"
import Layout from "../@lekoarts/gatsby-theme-minimal-blog/components/layout"

type SnippetPageContext = {
  slug: string
}

const SnippetTemplate: React.FC<PageProps<{}, SnippetPageContext>> = ({ children, pageContext }) => {
  return (
    <Layout>
      <div sx={{ variant: "layout.content" }}>
        <article>
          <div sx={{ 
            mb: 4, 
            pb: 3, 
            borderBottom: "1px solid",
            borderColor: "divide"
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
          </div>
          <section sx={{
            my: 5,
            ".gatsby-resp-image-wrapper": { my: 4 },
            variant: "layout.content",
          }}>
            {children}
          </section>
        </article>
      </div>
    </Layout>
  )
}

export default SnippetTemplate

export const Head: HeadFC<{}, SnippetPageContext> = ({ pageContext }) => (
  <title>{pageContext.slug} | Snippet</title>
)
