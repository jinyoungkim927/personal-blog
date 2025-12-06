import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

export type MBPageProps = {
  page: {
    title: string
    slug: string
    excerpt: string
    body: string
  }
}

const Page: React.FC<PageProps<MBPageProps>> = ({ data: { page }, children }) => (
  <Layout>
    {/* Title removed - just show the content */}
    <section style={{ marginTop: "32px" }}>
      {children}
    </section>
  </Layout>
)

export default Page

export const Head: HeadFC<MBPageProps> = ({ data: { page } }) => (
  <Seo title={page.title} description={page.excerpt} />
)

