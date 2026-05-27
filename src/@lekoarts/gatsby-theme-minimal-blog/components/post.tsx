/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "./layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import PostFooter from "@lekoarts/gatsby-theme-minimal-blog/src/components/post-footer"
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
    <article
      sx={{
        maxWidth: `720px`,
        mx: `auto`,
        width: `100%`,
      }}
    >
      <h1
        sx={{
          fontFamily: `body`,
          fontWeight: 500,
          fontSize: [`28px`, `34px`, `38px`],
          lineHeight: 1.2,
          letterSpacing: `-0.012em`,
          color: `heading`,
          m: 0,
          mt: [3, 4],
          mb: 3,
        }}
      >
        {post.title}
      </h1>

      <div
        sx={{
          display: `flex`,
          flexWrap: `wrap`,
          alignItems: `center`,
          gap: 2,
          fontFamily: `monospace`,
          fontSize: `11px`,
          letterSpacing: `0.08em`,
          textTransform: `uppercase`,
          color: `rgba(244,240,232,0.6)`,
          mb: 3,
        }}
      >
        <time>{post.displayDate || post.date}</time>
        {post.timeToRead && (
          <React.Fragment>
            <span sx={{ opacity: 0.5 }}>·</span>
            <span>{post.timeToRead} min read</span>
          </React.Fragment>
        )}
      </div>

      <div
        sx={{
          height: `1px`,
          bg: `rgba(247,233,200,0.18)`,
          mb: 4,
        }}
      />

      <section
        sx={{
          ".gatsby-resp-image-wrapper": {
            my: [4, 4, 5],
            borderRadius: `2px`,
            boxShadow: `0 16px 24px rgba(0,0,0,0.4)`,
          },
        }}
      >
        {children}
      </section>

      <SubscribeButton />
      <PostFooter post={post} />
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
