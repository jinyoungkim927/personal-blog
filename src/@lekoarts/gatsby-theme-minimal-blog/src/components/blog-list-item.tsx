/** @jsx jsx */
import { jsx, Box, Flex } from "theme-ui"
import { Link } from "gatsby"
import ItemTags from "./item-tags"

type BlogListItemProps = {
  post: {
    slug: string
    title: string
    date: string
    excerpt: string
    description: string
    timeToRead?: number
    tags?: { name: string; slug: string }[]
  }
}

const BlogListItem = ({ post }: BlogListItemProps) => (
  <Box sx={{ mb: 4 }}>
    <Flex sx={{ alignItems: "baseline", flexWrap: "wrap", gap: 2 }}>
      <Link
        to={post.slug}
        sx={{
          color: "heading",
          textDecoration: "none",
          fontSize: [1, 2],
          fontWeight: 500,
          "&:hover": { color: "primary" },
        }}
      >
        {post.title}
      </Link>
      {post.tags && post.tags.length > 0 && (
        <ItemTags tags={post.tags} />
      )}
    </Flex>
    <Box sx={{ color: "secondary", fontSize: 0, mt: 1 }}>
      {post.date}
    </Box>
  </Box>
)

export default BlogListItem
