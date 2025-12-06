/** @jsx jsx */
import { jsx } from "theme-ui"
import { Link } from "gatsby"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"

type TagsProps = {
  tags: { name: string; slug: string }[]
}

// Obsidian-style soft highlight colors
const tagColors = [
  { bg: "rgba(251, 191, 36, 0.15)", color: "#b45309" },  // amber
  { bg: "rgba(244, 114, 182, 0.15)", color: "#be185d" }, // pink
  { bg: "rgba(74, 222, 128, 0.15)", color: "#15803d" },  // green
  { bg: "rgba(96, 165, 250, 0.15)", color: "#1d4ed8" },  // blue
  { bg: "rgba(251, 146, 60, 0.15)", color: "#c2410c" },  // orange
  { bg: "rgba(192, 132, 252, 0.15)", color: "#7e22ce" }, // purple
]

const hashString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

const ItemTags = ({ tags }: TagsProps) => {
  const { tagsPath, basePath } = useMinimalBlogConfig()

  return (
    <span sx={{ display: "inline-flex", flexWrap: "wrap", gap: 1 }}>
      {tags.map((tag) => {
        const colors = tagColors[hashString(tag.slug) % tagColors.length]
        return (
          <Link
            key={tag.slug}
            to={`/${basePath}/${tagsPath}/${tag.slug}`.replace(/\/\/+/g, "/")}
            sx={{
              display: "inline-block",
              px: "6px",
              py: "2px",
              borderRadius: "3px",
              backgroundColor: colors.bg,
              color: colors.color,
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 500,
              transition: "opacity 0.15s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            #{tag.name}
          </Link>
        )
      })}
    </span>
  )
}

export default ItemTags
