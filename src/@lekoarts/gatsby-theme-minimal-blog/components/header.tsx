/** @jsx jsx */
import { jsx, Flex } from "theme-ui"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import Navigation from "@lekoarts/gatsby-theme-minimal-blog/src/components/navigation"
import HeaderTitle from "./header-title"  // Use local shadowed component
import HeaderExternalLinks from "@lekoarts/gatsby-theme-minimal-blog/src/components/header-external-links"

const Header = () => {
  const { navigation: nav } = useMinimalBlogConfig()

  return (
    <header sx={{ mb: [5, 6] }}>
      <Flex sx={{ alignItems: `center`, justifyContent: `space-between` }}>
        <HeaderTitle />
        {/* Color mode toggle removed - light mode only */}
      </Flex>
      <div
        sx={{
          boxSizing: `border-box`,
          display: `flex`,
          variant: `dividers.bottom`,
          alignItems: `center`,
          justifyContent: `space-between`,
          mt: 3,
          color: `secondary`,
          a: { color: `secondary`, ":hover": { color: `heading` } },
          flexFlow: `wrap`,
        }}
      >
        <Navigation nav={nav} />
        <HeaderExternalLinks />
      </div>
    </header>
  )
}

export default Header


