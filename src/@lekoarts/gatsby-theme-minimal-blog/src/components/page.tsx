/** @jsx jsx */
import { jsx, Box, Container, Flex } from "theme-ui"
import { HeadFC, PageProps } from "gatsby"
import { Link } from "gatsby"
import * as React from "react"
import { Global } from "@emotion/react"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import useSiteMetadata from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-site-metadata"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

export type MBPageProps = { page: { title: string; slug: string; excerpt: string } }

const Page: React.FC<React.PropsWithChildren<PageProps<MBPageProps>>> = ({ data: { page }, children }) => {
  const { navigation } = useMinimalBlogConfig()
  const { siteTitle } = useSiteMetadata()

  return (
    <React.Fragment>
      <Global styles={{ "*": { boxSizing: "border-box" }, body: { margin: 0, padding: 0 } }} />
      <Container sx={{ maxWidth: 720, px: [3, 4], py: [4, 5] }}>
        <Flex as="header" sx={{ mb: 5, alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" sx={{ color: "heading", textDecoration: "none", fontWeight: 600, fontSize: [2, 3] }}>{siteTitle}</Link>
          <Flex as="nav" sx={{ gap: 4 }}>
            {navigation.map((n: any) => <Link key={n.slug} to={n.slug} sx={{ color: "secondary", textDecoration: "none", fontSize: 1, "&:hover": { color: "heading" } }}>{n.title}</Link>)}
          </Flex>
        </Flex>

        <Box as="main">{children}</Box>

        <Box as="footer" sx={{ mt: 6, pt: 4, borderTop: "1px solid", borderColor: "divide", textAlign: "center" }}>
          <Link to="/disclaimer" sx={{ color: "secondary", textDecoration: "none", fontSize: 0, "&:hover": { color: "primary" } }}>Disclaimer</Link>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default Page
export const Head: HeadFC<MBPageProps> = ({ data: { page } }) => <Seo title={page.title} description={page.excerpt} />
