/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "./layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import SubscribeButton from "../../../components/SubscribeButton"

export type MBPostProps = {
  post: {
    slug: string
    title: string
    date: string
    displayDate?: string
    tags?: { name: string; slug: string }[]
    description?: string
    canonicalUrl?: string
    excerpt: string
    timeToRead?: number
    banner?: { childImageSharp: { resize: { src: string } } }
  }
}

const Post: React.FC<React.PropsWithChildren<PageProps<MBPostProps>>> = ({
  data: { post },
  children,
}) => (
  <Layout>
    <article sx={{ mt: [`56px`, `96px`] }}>
      <h1
        sx={{
          fontSize: [`34px`, `46px`],
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: `-0.005em`,
          m: 0,
        }}
      >
        {post.title}
      </h1>
      <div sx={{ fontSize: `17px`, color: `secondary`, mt: `14px`, mb: `44px`, fontVariantNumeric: `lining-nums tabular-nums` }}>
        <time>{post.displayDate || post.date}</time>
      </div>

      <section sx={{ ".gatsby-resp-image-wrapper": { my: 4 } }}>{children}</section>

      <div sx={{ mt: `56px` }}>
        <SubscribeButton label="Get the next essay by email" />
      </div>
      <div sx={{ mt: `40px` }}>
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
          ← All writing
        </Link>
      </div>
    </article>
  </Layout>
)

export default Post

export const Head: HeadFC<MBPostProps> = ({ data: { post } }) => (
  <Seo
    title={post.title}
    description={post.description ? post.description : post.excerpt}
    image={post.banner ? post.banner?.childImageSharp?.resize?.src : undefined}
    pathname={post.slug}
    canonicalUrl={post.canonicalUrl}
  />
)
