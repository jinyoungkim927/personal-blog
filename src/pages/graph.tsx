/** @jsx jsx */
import { jsx } from "theme-ui"
import { HeadFC } from "gatsby"
import * as React from "react"
import { useEffect, useState } from "react"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import GraphView from "../components/GraphView"

const GraphPage: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        // Account for the layout padding
        const container = document.querySelector('main')
        const containerWidth = container ? container.clientWidth : window.innerWidth - 48
        setDimensions({
          width: Math.min(containerWidth, 1400),
          height: Math.max(window.innerHeight - 300, 500),
        })
      }
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  return (
    <Layout>
      <div sx={{ 
        borderRadius: "12px", 
        overflow: "hidden", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divide",
        background: "#faf9f7",
      }}>
        <GraphView 
          width={dimensions.width} 
          height={dimensions.height} 
          fullPage={false}
        />
      </div>

      <div sx={{ mt: 3, color: "secondary", fontSize: 1 }}>
        Drag to move · Scroll to zoom · Click nodes to navigate
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
