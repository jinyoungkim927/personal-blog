/** @jsx jsx */
import { jsx, Box } from "theme-ui"
import { HeadFC, PageProps } from "gatsby"
import * as React from "react"
import { Global } from "@emotion/react"
import { Container } from "theme-ui"
import { Link } from "gatsby"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import useSiteMetadata from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-site-metadata"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

export type MBPageProps = {
  page: {
    title: string
    slug: string
    excerpt: string
  }
}

const Page: React.FC<React.PropsWithChildren<PageProps<MBPageProps>>> = ({ data: { page }, children }) => {
  const { navigation } = useMinimalBlogConfig()
  const { siteTitle } = useSiteMetadata()

  return (
    <React.Fragment>
      <Global styles={{ "*": { boxSizing: "border-box" }, body: { margin: 0, padding: 0 } }} />
      <Container sx={{ maxWidth: 680, px: [3, 4], py: [4, 5] }}>
        {/* Header */}
        <Box as="header" sx={{ mb: [4, 5], display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" sx={{ color: "heading", textDecoration: "none", fontWeight: 600, fontSize: [2, 3], "&:hover": { color: "primary" } }}>
            {siteTitle}
          </Link>
          <Box as="nav" sx={{ display: "flex", gap: [3, 4] }}>
            {navigation.map((item: { slug: string; title: string }) => (
              <Link key={item.slug} to={item.slug} sx={{ color: "secondary", textDecoration: "none", fontSize: [0, 1], "&:hover": { color: "heading" } }}>
                {item.title}
              </Link>
            ))}
          </Box>
        </Box>
        {/* Content - no title header */}
        <Box as="main">{children}</Box>
        {/* Minimal footer */}
        <Box as="footer" sx={{ mt: 5, pt: 4, borderTop: "1px solid", borderColor: "divide", color: "secondary", fontSize: 0, textAlign: "center" }}>
          <Link to="/disclaimer" sx={{ color: "secondary", textDecoration: "none", "&:hover": { color: "primary" } }}>
            Disclaimer
          </Link>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default Page

export const Head: HeadFC<MBPageProps> = ({ data: { page } }) => (
  <Seo title={page.title} description={page.excerpt} />
)
