/** @jsx jsx */
import * as React from "react"
import { jsx, Heading } from "theme-ui"
import { HeadFC, PageProps, graphql } from "gatsby"
import Layout from "../@lekoarts/gatsby-theme-minimal-blog/components/layout"
import ItemTags from "@lekoarts/gatsby-theme-minimal-blog/src/components/item-tags"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

type SnippetProps = {
  mdxSnippet: {
    slug: string
    title: string
    date: string
    displayDate?: string
    tags?: {
      name: string
      slug: string
    }[]
  }
}

type SnippetPageContext = {
  slug: string
  title: string
  displayDate?: string
}

const px = [`16px`, `8px`, `4px`]
const shadow = px.map((v) => `rgba(0, 0, 0, 0.1) 0px ${v} ${v} 0px`)

const SnippetTemplate: React.FC<React.PropsWithChildren<PageProps<SnippetProps>>> = ({ 
  data: { mdxSnippet }, 
  children 
}) => {
  return (
    <Layout>
      <Heading as="h1" variant="styles.h1">
        {mdxSnippet.title}
      </Heading>
      <p sx={{ color: `secondary`, mt: 3, a: { color: `secondary` }, fontSize: [1, 1, 2] }}>
        <time>{mdxSnippet.displayDate || mdxSnippet.date}</time>
        {mdxSnippet.tags && mdxSnippet.tags.length > 0 && (
          <React.Fragment>
            {` — `}
            <ItemTags tags={mdxSnippet.tags} />
          </React.Fragment>
        )}
      </p>
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
      <section
        sx={{
          my: 5,
          ".gatsby-resp-image-wrapper": {
            my: [4, 4, 5],
            borderRadius: `4px`,
            boxShadow: shadow.join(`, `),
            ".gatsby-resp-image-image": {
              borderRadius: `4px`,
            },
          },
          variant: `layout.content`,
        }}
      >
        {children}
      </section>
    </Layout>
  )
}

export default SnippetTemplate

export const Head: HeadFC<SnippetProps> = ({ data: { mdxSnippet } }) => (
  <Seo
    title={mdxSnippet.title}
    description={`Snippet: ${mdxSnippet.title}`}
    pathname={mdxSnippet.slug}
  />
)

export const query = graphql`
  query ($slug: String!) {
    mdxSnippet(slug: { eq: $slug }) {
      slug
      title
      date(formatString: "MMMM D, YYYY")
      displayDate
      tags {
        name
        slug
      }
    }
  }
`
