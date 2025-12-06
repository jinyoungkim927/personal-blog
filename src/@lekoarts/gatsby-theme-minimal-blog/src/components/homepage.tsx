/** @jsx jsx */
import { jsx, Box, Container, Flex } from "theme-ui"
import { HeadFC } from "gatsby"
import { Link } from "gatsby"
import * as React from "react"
import { Global } from "@emotion/react"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import useSiteMetadata from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-site-metadata"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

const tagColors = [
  { bg: "rgba(251, 191, 36, 0.2)", color: "#92400e" },
  { bg: "rgba(244, 114, 182, 0.2)", color: "#9d174d" },
  { bg: "rgba(74, 222, 128, 0.2)", color: "#166534" },
  { bg: "rgba(96, 165, 250, 0.2)", color: "#1e40af" },
  { bg: "rgba(251, 146, 60, 0.2)", color: "#9a3412" },
  { bg: "rgba(192, 132, 252, 0.2)", color: "#6b21a8" },
]

const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h); return Math.abs(h) }

export type MBHomepageProps = {
  posts: { slug: string; title: string; date: string; excerpt: string; description: string; timeToRead?: number; tags?: { name: string; slug: string }[] }[]
}

const Homepage = ({ posts }: MBHomepageProps) => {
  const { navigation, tagsPath, basePath } = useMinimalBlogConfig()
  const { siteTitle } = useSiteMetadata()

  return (
    <React.Fragment>
      <Global styles={{ "*": { boxSizing: "border-box" }, body: { margin: 0, padding: 0 } }} />
      <Container sx={{ maxWidth: 720, px: [3, 4], py: [4, 5] }}>
        {/* Header */}
        <Flex as="header" sx={{ mb: 5, alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" sx={{ color: "heading", textDecoration: "none", fontWeight: 600, fontSize: [2, 3] }}>{siteTitle}</Link>
          <Flex as="nav" sx={{ gap: 4 }}>
            {navigation.map((n: any) => <Link key={n.slug} to={n.slug} sx={{ color: "secondary", textDecoration: "none", fontSize: 1, "&:hover": { color: "heading" } }}>{n.title}</Link>)}
          </Flex>
        </Flex>

        {/* Posts */}
        <Box as="main">
          {posts.map((post) => (
            <Flex key={post.slug} sx={{ mb: 4, justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Link to={post.slug} sx={{ color: "heading", textDecoration: "none", fontSize: [1, 2], fontWeight: 500, "&:hover": { color: "primary" } }}>{post.title}</Link>
                <Box sx={{ color: "secondary", fontSize: 0, mt: 1 }}>{post.date}</Box>
              </Box>
              {post.tags && post.tags.length > 0 && (
                <Flex sx={{ gap: 1, flexWrap: "wrap" }}>
                  {post.tags.map((tag) => {
                    const c = tagColors[hash(tag.slug) % tagColors.length]
                    return <Link key={tag.slug} to={`/${basePath}/${tagsPath}/${tag.slug}`.replace(/\/\/+/g, "/")} sx={{ px: "6px", py: "2px", borderRadius: 3, bg: c.bg, color: c.color, textDecoration: "none", fontSize: "11px", fontWeight: 500 }}>#{tag.name}</Link>
                  })}
                </Flex>
              )}
            </Flex>
          ))}
        </Box>

        {/* Footer */}
        <Box as="footer" sx={{ mt: 6, pt: 4, borderTop: "1px solid", borderColor: "divide", textAlign: "center" }}>
          <Link to="/disclaimer" sx={{ color: "secondary", textDecoration: "none", fontSize: 0, "&:hover": { color: "primary" } }}>Disclaimer</Link>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default Homepage
export const Head: HeadFC = () => <Seo />
