/** @jsx jsx */
import { jsx, Container, Heading, Box } from "theme-ui"
import * as React from "react"
import { useEffect, useState } from "react"
import { Link, HeadFC } from "gatsby"
import GraphView from "../components/GraphView"

const GraphPage: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: Math.min(window.innerWidth - 48, 1200),
          height: Math.max(window.innerHeight - 200, 400),
        })
      }
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  return (
    <Box sx={{ minHeight: "100vh", bg: "background", py: 4 }}>
      <Container sx={{ maxWidth: 1200 }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <Link
              to="/"
              sx={{
                color: "heading",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: [2, 3],
              }}
            >
              More Useless
            </Link>
          </div>
          <nav sx={{ display: "flex", gap: 4 }}>
            <Link
              to="/blog"
              sx={{
                color: "secondary",
                textDecoration: "none",
                fontSize: 1,
                "&:hover": { color: "heading" },
              }}
            >
              Useless Posts
            </Link>
            <Link
              to="/about"
              sx={{
                color: "secondary",
                textDecoration: "none",
                fontSize: 1,
                "&:hover": { color: "heading" },
              }}
            >
              About
            </Link>
          </nav>
        </Box>

        <Heading as="h1" sx={{ mb: 4, fontSize: [3, 4] }}>
          Knowledge Graph
        </Heading>

        <Box
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <GraphView width={dimensions.width} height={dimensions.height} />
        </Box>

        <Box sx={{ mt: 4, color: "secondary", fontSize: 0 }}>
          <p>
            This graph shows the connections between posts based on wiki-style{" "}
            <code>[[links]]</code>.
          </p>
          <p sx={{ mt: 2 }}>
            • <strong>Solid nodes</strong> are existing posts (click to navigate)
            <br />
            • <strong>Dashed nodes</strong> are referenced but don't have posts yet
            <br />
            • Drag nodes to rearrange · Scroll to zoom · Click and drag background to pan
          </p>
        </Box>
      </Container>
    </Box>
  )
}

export default GraphPage

export const Head: HeadFC = () => (
  <>
    <title>Knowledge Graph | More Useless</title>
    <meta name="description" content="Interactive knowledge graph showing connections between posts" />
  </>
)

