import { HeadFC } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Listing from "@lekoarts/gatsby-theme-minimal-blog/src/components/listing"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

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

// Blog page - just shows all posts (no header, no "View all tags" link)
const Blog = ({ posts }: MBBlogProps) => {
  return (
    <Layout>
      <div style={{ marginTop: "32px" }}>
        <Listing posts={posts} />
      </div>
    </Layout>
  )
}

export default Blog

export const Head: HeadFC = () => <Seo title="Blog" />
