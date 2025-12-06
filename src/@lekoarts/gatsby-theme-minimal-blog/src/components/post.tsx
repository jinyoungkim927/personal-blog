/** @jsx jsx */
import { jsx, Box, Container, Flex, Heading } from "theme-ui"
import { HeadFC, PageProps } from "gatsby"
import { Link } from "gatsby"
import * as React from "react"
import { Global } from "@emotion/react"
import { MDXProvider } from "@mdx-js/react"
import MdxComponents from "@lekoarts/gatsby-theme-minimal-blog/src/components/mdx-components"
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

type PostProps = {
  post: {
    slug: string
    title: string
    date: string
    tags?: { name: string; slug: string }[]
    description?: string
    excerpt: string
    timeToRead?: number
  }
}

const Post: React.FC<React.PropsWithChildren<PageProps<PostProps>>> = ({ data: { post }, children }) => {
  const { navigation, tagsPath, basePath } = useMinimalBlogConfig()
  const { siteTitle } = useSiteMetadata()

  return (
    <MDXProvider components={MdxComponents}>
      <Global styles={{ "*": { boxSizing: "border-box" }, body: { margin: 0, padding: 0 } }} />
      <Container sx={{ maxWidth: 720, px: [3, 4], py: [4, 5] }}>
        <Flex as="header" sx={{ mb: 5, alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" sx={{ color: "heading", textDecoration: "none", fontWeight: 600, fontSize: [2, 3] }}>{siteTitle}</Link>
          <Flex as="nav" sx={{ gap: 4 }}>
            {navigation.map((n: any) => <Link key={n.slug} to={n.slug} sx={{ color: "secondary", textDecoration: "none", fontSize: 1, "&:hover": { color: "heading" } }}>{n.title}</Link>)}
          </Flex>
        </Flex>

        <Box as="main">
          <Heading as="h1" sx={{ fontSize: [4, 5], mb: 3 }}>{post.title}</Heading>
          <Flex sx={{ color: "secondary", fontSize: 0, mb: 4, alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <span>{post.date}</span>
            {post.tags && post.tags.length > 0 && (
              <Flex sx={{ gap: 1 }}>
                {post.tags.map((tag) => {
                  const c = tagColors[hash(tag.slug) % tagColors.length]
                  return <Link key={tag.slug} to={`/${basePath}/${tagsPath}/${tag.slug}`.replace(/\/\/+/g, "/")} sx={{ px: "6px", py: "2px", borderRadius: 3, bg: c.bg, color: c.color, textDecoration: "none", fontSize: "11px", fontWeight: 500 }}>#{tag.name}</Link>
                })}
              </Flex>
            )}
          </Flex>
          <Box sx={{ lineHeight: 1.7 }}>{children}</Box>
        </Box>

        <Box as="footer" sx={{ mt: 6, pt: 4, borderTop: "1px solid", borderColor: "divide", textAlign: "center" }}>
          <Link to="/disclaimer" sx={{ color: "secondary", textDecoration: "none", fontSize: 0, "&:hover": { color: "primary" } }}>Disclaimer</Link>
        </Box>
      </Container>
    </MDXProvider>
  )
}

export default Post
export const Head: HeadFC<PostProps> = ({ data: { post } }) => <Seo title={post.title} description={post.description || post.excerpt} />
