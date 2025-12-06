/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import { Link } from "gatsby"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import useSiteMetadata from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-site-metadata"

const Header = () => {
  const { navigation } = useMinimalBlogConfig()
  const { siteTitle } = useSiteMetadata()

  return (
    <header sx={{ mb: [4, 5] }}>
      <Flex sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Link
          to="/"
          sx={{
            color: "heading",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: [2, 3],
            "&:hover": { color: "primary" },
          }}
        >
          {siteTitle}
        </Link>
        <nav sx={{ display: "flex", gap: [3, 4] }}>
          {navigation.map((item) => (
            <Link
              key={item.slug}
              to={item.slug}
              sx={{
                color: "secondary",
                textDecoration: "none",
                fontSize: [0, 1],
                letterSpacing: "0.02em",
                "&:hover": { color: "heading" },
              }}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </Flex>
    </header>
  )
}

export default Header
