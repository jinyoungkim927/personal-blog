/** @jsx jsx */
import { jsx, Box, Button } from "theme-ui"
import * as React from "react"
import BlogListItem from "@lekoarts/gatsby-theme-minimal-blog/src/components/blog-list-item"

type ListingProps = {
  posts: {
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
  }[]
  className?: string
  showTags?: boolean
}

const Listing = ({ posts, className = ``, showTags = true }: ListingProps) => {
  const [tagsVisible, setTagsVisible] = React.useState(true)

  return (
    <section sx={{ mb: [5, 6, 7] }} className={className}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={() => setTagsVisible(!tagsVisible)}
          sx={{
            bg: "transparent",
            color: "text",
            border: "1px solid",
            borderColor: "divide",
            px: 3,
            py: 1,
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: 0,
            fontWeight: 400,
            transition: "all 0.2s ease",
            "&:hover": {
              bg: "muted",
              borderColor: "primary",
            },
          }}
        >
          {tagsVisible ? "Hide Tags" : "Show All Titles"}
        </Button>
      </Box>
      {!tagsVisible && (
        <Box sx={{ mt: 2 }}>
          {posts.map((post) => (
            <Box key={post.slug} sx={{ mb: 2 }}>
              <a
                href={post.slug}
                sx={{
                  color: "text",
                  textDecoration: "none",
                  fontSize: [1, 2],
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "primary",
                  },
                }}
              >
                {post.title}
              </a>
            </Box>
          ))}
        </Box>
      )}
      {tagsVisible && posts.map((post) => (
        <BlogListItem key={post.slug} post={post} showTags={showTags} />
      ))}
    </section>
  )
}

export default Listing
