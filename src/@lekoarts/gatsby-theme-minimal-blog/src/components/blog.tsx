/** @jsx jsx */
import { jsx } from "theme-ui"
import { HeadFC } from "gatsby"
import Layout from "./layout"
import Listing from "./listing"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

export type MBBlogProps = {
  posts: {
    slug: string
    title: string
    date: string
    excerpt: string
    description: string
    timeToRead?: number
    tags?: { name: string; slug: string }[]
  }[]
}

const Blog = ({ posts }: MBBlogProps) => (
  <Layout>
    <Listing posts={posts} />
  </Layout>
)

export default Blog

export const Head: HeadFC = () => <Seo title="Blog" />
