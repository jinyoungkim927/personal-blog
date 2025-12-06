/** @jsx jsx */
import { jsx, Box } from "theme-ui"
import BlogListItem from "./blog-list-item"

type ListingProps = {
  posts: {
    slug: string
    title: string
    date: string
    excerpt: string
    description: string
    timeToRead?: number
    tags?: { name: string; slug: string }[]
  }[]
  className?: string
}

const Listing = ({ posts, className = `` }: ListingProps) => (
  <Box as="section" className={className}>
    {posts.map((post) => (
      <BlogListItem key={post.slug} post={post} />
    ))}
  </Box>
)

export default Listing
