/** @jsx jsx */
import { jsx } from "theme-ui"
import { HeadFC, Link } from "gatsby"
import * as React from "react"
import { useEffect, useState } from "react"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import GraphView from "../components/GraphView"

const GraphPage: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: Math.min(window.innerWidth - 48, 1200),
          height: Math.max(window.innerHeight - 280, 500),
        })
      }
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  return (
    <Layout>
      <h1 sx={{ fontSize: [4, 5], fontWeight: "bold", color: "heading", mb: 4 }}>
        Knowledge Graph
      </h1>
      
      <div sx={{ 
        borderRadius: "12px", 
        overflow: "hidden", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divide"
      }}>
        <GraphView width={dimensions.width} height={dimensions.height} />
      </div>

      <div sx={{ mt: 4, color: "secondary", fontSize: 1 }}>
        <p>This graph shows connections between posts based on wiki-style <code sx={{ bg: "muted", px: 1, borderRadius: 4 }}>[[links]]</code> and shared tags.</p>
        <p sx={{ mt: 2 }}>
          • <strong>Orange nodes</strong> are existing posts (click to navigate)<br />
          • <strong>Red nodes</strong> are tags<br />
          • <strong>Dashed nodes</strong> are referenced but don't exist yet<br />
          • Drag nodes to rearrange · Scroll to zoom · Click and drag background to pan
        </p>
      </div>
    </Layout>
  )
}

export default GraphPage

export const Head: HeadFC = () => (
  <>
    <title>Knowledge Graph | More Useless</title>
    <meta name="description" content="Interactive knowledge graph showing connections between posts" />
  </>
)
