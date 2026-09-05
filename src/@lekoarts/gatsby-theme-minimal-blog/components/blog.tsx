/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { HeadFC } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import WritingList from "../../../components/WritingList"

export type MBBlogProps = {
  posts: {
    slug: string
    title: string
    date: string
    excerpt: string
    description: string
    timeToRead?: number
    tags?: {
      name: string
      slug: string
    }[]
  }[]
}

const Blog = ({ posts }: MBBlogProps) => (
  <Layout>
    <section sx={{ mt: [`56px`, `96px`] }}>
      <h1
        sx={{
          fontSize: `13px`,
          fontWeight: 400,
          letterSpacing: `0.14em`,
          textTransform: `uppercase`,
          color: `secondary`,
          m: 0,
          mb: `10px`,
        }}
      >
        Writing
      </h1>
      <WritingList items={posts} />
    </section>
  </Layout>
)

export default Blog

export const Head: HeadFC = () => <Seo title="Writing" />
