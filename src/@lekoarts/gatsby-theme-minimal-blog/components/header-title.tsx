/** @jsx jsx */
import { Link } from "gatsby"
import { jsx } from "theme-ui"
import replaceSlashes from "@lekoarts/gatsby-theme-minimal-blog/src/utils/replaceSlashes"
import useSiteMetadata from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-site-metadata"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import AnimatedUseless from "../../../components/AnimatedUseless"

const HeaderTitle = () => {
  const { siteTitle } = useSiteMetadata()
  const { basePath } = useMinimalBlogConfig()

  // Split "More Useless" into parts
  const titleParts = siteTitle.split("Useless")
  const hasUseless = titleParts.length > 1

  return (
    <Link
      to={replaceSlashes(`/${basePath}`)}
      aria-label={`${siteTitle} - Back to home`}
      sx={{ color: `heading`, textDecoration: `none` }}
    >
      <div sx={{ my: 0, fontWeight: `semibold`, fontSize: [3, 4] }}>
        {hasUseless ? (
          <>
            {titleParts[0]}
            <AnimatedUseless text="Useless" inline />
            {titleParts[1]}
          </>
        ) : (
          siteTitle
        )}
      </div>
    </Link>
  )
}

export default HeaderTitle

