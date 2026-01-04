/** @jsx jsx */
import { jsx, Flex, Container } from "theme-ui"
import { HeadFC, Link } from "gatsby"
import * as React from "react"
import { useEffect, useState } from "react"
import { Global } from "@emotion/react"
import useMinimalBlogConfig from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-minimal-blog-config"
import useSiteMetadata from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-site-metadata"
import Navigation from "@lekoarts/gatsby-theme-minimal-blog/src/components/navigation"
import HeaderExternalLinks from "@lekoarts/gatsby-theme-minimal-blog/src/components/header-external-links"
import replaceSlashes from "@lekoarts/gatsby-theme-minimal-blog/src/utils/replaceSlashes"
import GraphView from "../components/GraphView"

const GraphPage: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const { siteTitle } = useSiteMetadata()
  const { navigation: nav, basePath } = useMinimalBlogConfig()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  return (
    <React.Fragment>
      <Global
        styles={{
          "*": { boxSizing: `inherit` },
          body: { margin: 0, padding: 0 },
        }}
      />
      
      {/* Full-page graph as background */}
      <div sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}>
        <GraphView 
          width={dimensions.width} 
          height={dimensions.height} 
          fullPage={true}
        />
      </div>

      {/* Floating header - same structure as theme header */}
      <Container sx={{ position: "relative", zIndex: 10 }}>
        <header sx={{ 
          pt: 4,
          pb: 3,
        }}>
          <Flex sx={{ alignItems: `center`, justifyContent: `space-between` }}>
            <Link
              to={replaceSlashes(`/${basePath}`)}
              aria-label={`${siteTitle} - Back to home`}
              sx={{ color: `heading`, textDecoration: `none` }}
            >
              <div sx={{ my: 0, fontWeight: `semibold`, fontSize: [3, 4] }}>{siteTitle}</div>
            </Link>
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
              borderColor: `rgba(0,0,0,0.1)`,
            }}
          >
            <Navigation nav={nav} />
            <HeaderExternalLinks />
          </div>
        </header>
      </Container>

      {/* Instructions - bottom right */}
      <div sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        fontSize: 0,
        color: "secondary",
        bg: "rgba(255,255,255,0.92)",
        px: 3,
        py: 2,
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        zIndex: 50,
      }}>
        Drag to move · Scroll to zoom · Click nodes to navigate
      </div>
    </React.Fragment>
  )
}

export default GraphPage

export const Head: HeadFC = () => (
  <>
    <title>Knowledge Graph | More Useless</title>
    <meta name="description" content="Interactive knowledge graph showing connections between posts" />
  </>
)
