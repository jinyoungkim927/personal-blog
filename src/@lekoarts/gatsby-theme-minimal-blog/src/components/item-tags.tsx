/** @jsx jsx */
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import replaceSlashes from "@lekoarts/gatsby-theme-minimal-blog/src/utils/replaceSlashes"
import { Link } from "gatsby"
import * as React from "react"

type TagsProps = {
  tags: {
    name: string
    slug: string
  }[]
}

// Soft highlight colors: yellow, pink, green, blue, orange
const tagColors = [
  { bg: "#fef3c7", color: "#92400e", hoverBg: "#fde68a", hoverColor: "#78350f" }, // soft yellow
  { bg: "#fce7f3", color: "#9f1239", hoverBg: "#fbcfe8", hoverColor: "#831843" }, // soft pink
  { bg: "#d1fae5", color: "#065f46", hoverBg: "#a7f3d0", hoverColor: "#047857" }, // soft green
  { bg: "#dbeafe", color: "#1e40af", hoverBg: "#bfdbfe", hoverColor: "#1e3a8a" }, // soft blue
  { bg: "#fed7aa", color: "#9a3412", hoverBg: "#fdba74", hoverColor: "#7c2d12" }, // soft orange
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
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: colors.hoverBg,
                color: colors.hoverColor,
                transform: "translateY(-1px)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
