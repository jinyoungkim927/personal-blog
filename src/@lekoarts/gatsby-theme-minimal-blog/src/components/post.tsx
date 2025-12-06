/** @jsx jsx */
import type { HeadFC, PageProps } from "gatsby"
import * as React from "react"
import { jsx, Heading, Flex, Box } from "theme-ui"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import ItemTags from "@lekoarts/gatsby-theme-minimal-blog/src/components/item-tags"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import PostFooter from "@lekoarts/gatsby-theme-minimal-blog/src/components/post-footer"

export type MBPostProps = {
  post: {
    slug: string
    title: string
    date: string
    tags?: {
      name: string
      slug: string
    }[]
    description?: string
    canonicalUrl?: string
    excerpt: string
    timeToRead?: number
    banner?: {
      childImageSharp: {
        resize: {
          src: string
        }
      }
    }
  }
}

const px = [`16px`, `8px`, `4px`]
const shadow = px.map((v) => `rgba(0, 0, 0, 0.1) 0px ${v} ${v} 0px`)

const Post: React.FC<React.PropsWithChildren<PageProps<MBPostProps>>> = ({ data: { post }, children }) => (
  <Layout>
    <Flex sx={{ alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
      <Heading as="h1" variant="styles.h1" sx={{ flex: "1 1 auto", minWidth: "200px" }}>
        {post.title}
      </Heading>
      {post.tags && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
          <ItemTags tags={post.tags} />
        </Box>
      )}
    </Flex>
    <p sx={{ color: `secondary`, mt: 2, a: { color: `secondary` }, fontSize: [1, 1, 2] }}>
      <time>{post.date}</time>
      {post.timeToRead && ` — `}
      {post.timeToRead && <span>{post.timeToRead} min read</span>}
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
    <PostFooter post={post} />
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

