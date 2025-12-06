/** @jsx jsx */
import { jsx, Box, Container } from "theme-ui"
import { HeadFC } from "gatsby"
import { Link } from "gatsby"
import * as React from "react"
import { Global } from "@emotion/react"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import useSiteMetadata from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-site-metadata"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

const tagColors = [
  { bg: "rgba(251, 191, 36, 0.15)", color: "#b45309" },
  { bg: "rgba(244, 114, 182, 0.15)", color: "#be185d" },
  { bg: "rgba(74, 222, 128, 0.15)", color: "#15803d" },
  { bg: "rgba(96, 165, 250, 0.15)", color: "#1d4ed8" },
  { bg: "rgba(251, 146, 60, 0.15)", color: "#c2410c" },
  { bg: "rgba(192, 132, 252, 0.15)", color: "#7e22ce" },
]

const hashString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash)
}

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

const Blog = ({ posts }: MBBlogProps) => {
  const { navigation, tagsPath, basePath } = useMinimalBlogConfig()
  const { siteTitle } = useSiteMetadata()

  return (
    <React.Fragment>
      <Global styles={{ "*": { boxSizing: "border-box" }, body: { margin: 0, padding: 0 } }} />
      <Container sx={{ maxWidth: 680, px: [3, 4], py: [4, 5] }}>
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
        <Box as="section">
          {posts.map((post) => (
            <Box key={post.slug} sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 2 }}>
                <Link to={post.slug} sx={{ color: "heading", textDecoration: "none", fontSize: [1, 2], fontWeight: 500, "&:hover": { color: "primary" } }}>
                  {post.title}
                </Link>
                {post.tags && post.tags.length > 0 && (
                  <Box sx={{ display: "inline-flex", flexWrap: "wrap", gap: 1 }}>
                    {post.tags.map((tag) => {
                      const colors = tagColors[hashString(tag.slug) % tagColors.length]
                      return (
                        <Link
                          key={tag.slug}
                          to={`/${basePath}/${tagsPath}/${tag.slug}`.replace(/\/\/+/g, "/")}
                          sx={{ display: "inline-block", px: "6px", py: "2px", borderRadius: "3px", backgroundColor: colors.bg, color: colors.color, textDecoration: "none", fontSize: "12px", fontWeight: 500, "&:hover": { opacity: 0.8 } }}
                        >
                          #{tag.name}
                        </Link>
                      )
                    })}
                  </Box>
                )}
              </Box>
              <Box sx={{ color: "secondary", fontSize: 0, mt: 1 }}>{post.date}</Box>
            </Box>
          ))}
        </Box>
        <Box as="footer" sx={{ mt: 5, pt: 4, borderTop: "1px solid", borderColor: "divide", color: "secondary", fontSize: 0, textAlign: "center" }}>
          <Link to="/disclaimer" sx={{ color: "secondary", textDecoration: "none", "&:hover": { color: "primary" } }}>
            Disclaimer
          </Link>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default Blog

export const Head: HeadFC = () => <Seo title="Blog" />
