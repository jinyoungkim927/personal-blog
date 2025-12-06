import { HeadFC, Link } from "gatsby"
import * as React from "react"
import { useEffect, useState } from "react"
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
    <div style={{ minHeight: "100vh", background: "#faf9f7", padding: "32px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ color: "#1a1815", textDecoration: "none", fontWeight: 600, fontSize: 20 }}>More Useless</Link>
          <nav style={{ display: "flex", gap: 24 }}>
            <Link to="/blog" style={{ color: "#a09080", textDecoration: "none", fontSize: 14 }}>Useless Posts</Link>
            <Link to="/about" style={{ color: "#a09080", textDecoration: "none", fontSize: 14 }}>About</Link>
          </nav>
        </div>

        <h1 style={{ marginBottom: 24, fontSize: 28, color: "#1a1815" }}>Knowledge Graph</h1>

        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <GraphView width={dimensions.width} height={dimensions.height} />
        </div>

        <div style={{ marginTop: 24, color: "#a09080", fontSize: 13 }}>
          <p>This graph shows connections between posts based on wiki-style <code>[[links]]</code>.</p>
          <p style={{ marginTop: 8 }}>
            • <strong>Solid nodes</strong> are existing posts (click to navigate)<br />
            • <strong>Dashed nodes</strong> are referenced but don't have posts yet<br />
            • Drag nodes to rearrange · Scroll to zoom · Click and drag background to pan
          </p>
        </div>
      </div>
    </div>
  )
}

export default GraphPage

export const Head: HeadFC = () => (
  <>
    <title>Knowledge Graph | More Useless</title>
    <meta name="description" content="Interactive knowledge graph showing connections between posts" />
  </>
)
