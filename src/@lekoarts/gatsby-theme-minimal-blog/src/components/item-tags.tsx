/** @jsx jsx */
import { jsx } from "theme-ui"
import * as React from "react"
import { Link } from "gatsby"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import replaceSlashes from "@lekoarts/gatsby-theme-minimal-blog/src/utils/replaceSlashes"

type TagsProps = {
  tags: {
    name: string
    slug: string
  }[]
}

// Soft highlight colors: yellow, pink, green, blue, orange
const tagColors = [
  { bg: "#fef3c7", color: "#92400e" }, // soft yellow
  { bg: "#fce7f3", color: "#9f1239" }, // soft pink
  { bg: "#d1fae5", color: "#065f46" }, // soft green
  { bg: "#dbeafe", color: "#1e40af" }, // soft blue
  { bg: "#fed7aa", color: "#9a3412" }, // soft orange
]

// Hash function to consistently assign colors to tags
const getTagColor = (tagSlug: string) => {
  let hash = 0
  for (let i = 0; i < tagSlug.length; i++) {
    hash = tagSlug.charCodeAt(i) + ((hash << 5) - hash)
  }
  return tagColors[Math.abs(hash) % tagColors.length]
}

const ItemTags = ({ tags }: TagsProps) => {
  const { tagsPath, basePath } = useMinimalBlogConfig()

  return (
    <React.Fragment>
      {tags.map((tag) => {
        const colors = getTagColor(tag.slug)
        return (
          <Link
            key={tag.slug}
            to={replaceSlashes(`/${basePath}/${tagsPath}/${tag.slug}`)}
            sx={{
              display: "inline-block",
              px: 2,
              py: 1,
              mr: 1,
              mb: 1,
              borderRadius: "4px",
              backgroundColor: colors.bg,
              color: colors.color,
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            #{tag.name}
          </Link>
        )
      })}
    </React.Fragment>
  )
}

export default ItemTags

