/** @jsx jsx */
import * as React from "react"
import { jsx, Box, Flex } from "theme-ui"
import { Link } from "gatsby"
import ItemTags from "@lekoarts/gatsby-theme-minimal-blog/src/components/item-tags"

type BlogListItemProps = {
  post: {
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
  }
  showTags?: boolean
}

const BlogListItem = ({ post, showTags = true }: BlogListItemProps) => (
  <Box mb={4}>
    <Flex sx={{ alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 1 }}>
      <Link 
        to={post.slug} 
        sx={{
          fontSize: [1, 2, 3], 
          color: `text`,
          flex: "1 1 auto",
          minWidth: "200px",
          textDecoration: "none",
          transition: "color 0.2s ease",
          "&:hover": {
            color: "primary",
          },
        }}
      >
        {post.title}
      </Link>
      {post.tags && showTags && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
          <ItemTags tags={post.tags} />
        </Box>
      )}
    </Flex>
    <p sx={{ color: `secondary`, mt: 1, fontSize: [0, 1] }}>
      <time>{post.date}</time>
    </p>
  </Box>
)

export default BlogListItem
