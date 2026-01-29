/** @jsx jsx */
import { jsx } from "theme-ui"
import { HeadFC, navigate } from "gatsby"
import * as React from "react"
import { useEffect, useState } from "react"
import { Global } from "@emotion/react"
import { MDXProvider } from "@mdx-js/react"
import { Container } from "theme-ui"
import Header from "../@lekoarts/gatsby-theme-minimal-blog/components/header"
import GraphView from "../components/GraphView"
import features from "../config/features"

const GraphPage: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    if (!features.graphEnabled) {
      navigate("/", { replace: true })
      return
    }
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

  if (!features.graphEnabled) return null

  return (
    <MDXProvider components={{}}>
      <Global
        styles={{
          "*": { boxSizing: `inherit` },
          "[hidden]": { display: `none` },
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
        bg: "background",
      }}>
        <GraphView 
          width={dimensions.width} 
          height={dimensions.height} 
          fullPage={true}
        />
      </div>

      {/* Floating header - uses the same shadowed Header component */}
      <Container sx={{ position: "relative", zIndex: 10 }}>
        <Header />
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
    </MDXProvider>
  )
}

export default GraphPage

export const Head: HeadFC = () => (
  <>
    <title>Idea Graph | More Useless</title>
    <meta name="description" content="Interactive idea graph showing connections between posts" />
  </>
)
