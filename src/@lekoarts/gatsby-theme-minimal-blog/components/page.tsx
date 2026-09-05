/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "./layout"
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
    <article sx={{ mt: [`56px`, `96px`] }}>
      <h1
        sx={{
          fontSize: [`34px`, `40px`],
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: `-0.005em`,
          m: 0,
          mb: `32px`,
        }}
      >
        {page.title}
      </h1>
      {children}
    </article>
  </Layout>
)

export default Page

export const Head: HeadFC<MBPageProps> = ({ data: { page } }) => (
  <Seo title={page.title} description={page.excerpt} />
)
