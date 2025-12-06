/** @jsx jsx */
import { jsx, Box } from "theme-ui"
import { HeadFC, PageProps } from "gatsby"
import Layout from "./layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

export type MBPageProps = {
  page: {
    title: string
    slug: string
    excerpt: string
  }
}

const Page: React.FC<React.PropsWithChildren<PageProps<MBPageProps>>> = ({ data: { page }, children }) => (
  <Layout>
    {/* No title header - minimalist */}
    <Box sx={{ variant: "layout.content" }}>{children}</Box>
  </Layout>
)

export default Page

export const Head: HeadFC<MBPageProps> = ({ data: { page } }) => (
  <Seo title={page.title} description={page.excerpt} />
)
