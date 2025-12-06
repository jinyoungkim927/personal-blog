/** @jsx jsx */
import { jsx } from "theme-ui"
import { HeadFC } from "gatsby"
import Layout from "./layout"
import Listing from "./listing"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

export type MBHomepageProps = {
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

const Homepage = ({ posts }: MBHomepageProps) => (
  <Layout>
    <Listing posts={posts} />
  </Layout>
)

export default Homepage

export const Head: HeadFC = () => <Seo />
