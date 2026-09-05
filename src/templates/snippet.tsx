/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { HeadFC, Link, PageProps, graphql } from "gatsby"
import Layout from "../@lekoarts/gatsby-theme-minimal-blog/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

type SnippetProps = {
  mdxSnippet: {
    slug: string
    title: string
    date: string
    displayDate?: string
  }
}

const SnippetTemplate: React.FC<React.PropsWithChildren<PageProps<SnippetProps>>> = ({
  data: { mdxSnippet },
  children,
}) => (
  <Layout>
    <article sx={{ mt: [`56px`, `96px`] }}>
      <div sx={{ fontSize: `13px`, letterSpacing: `0.14em`, textTransform: `uppercase`, color: `secondary` }}>
        Note
      </div>
      <h1
        sx={{
          fontSize: [`34px`, `46px`],
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: `-0.005em`,
          m: 0,
          mt: `10px`,
        }}
      >
        {mdxSnippet.title}
      </h1>
      <div sx={{ fontSize: `17px`, color: `secondary`, mt: `14px`, mb: `44px` }}>
        <time>{mdxSnippet.displayDate || mdxSnippet.date}</time>
      </div>

      <section sx={{ ".gatsby-resp-image-wrapper": { my: 4 } }}>{children}</section>

      <div sx={{ mt: `56px` }}>
        <Link
          to="/"
          sx={{
            fontSize: `17px`,
            color: `secondary`,
            textDecoration: `none`,
            borderBottom: `none`,
            "&:hover": { color: `text` },
          }}
        >
          ← Home
        </Link>
      </div>
    </article>
  </Layout>
)

export default SnippetTemplate

export const Head: HeadFC<SnippetProps> = ({ data: { mdxSnippet } }) => (
  <Seo
    title={mdxSnippet.title}
    description={`Note: ${mdxSnippet.title}`}
    pathname={mdxSnippet.slug}
  />
)

export const query = graphql`
  query ($slug: String!) {
    mdxSnippet(slug: { eq: $slug }) {
      slug
      title
      date(formatString: "MMMM YYYY")
      displayDate
    }
  }
`
