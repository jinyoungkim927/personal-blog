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
    <div style={{ 
      minHeight: "100vh", 
      background: "#faf8f3",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative",
    }}>
      {/* Graph fills entire viewport */}
      <div style={{ 
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <GraphView 
          width={dimensions.width} 
          height={dimensions.height} 
          fullPage={true}
        />
      </div>

      {/* Transparent floating header */}
      <header style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        padding: "16px 24px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "transparent",
      }}>
        <Link 
          to="/" 
          style={{ 
            color: "#2d1f14", 
            textDecoration: "none", 
            fontWeight: 600, 
            fontSize: 18,
            fontFamily: "inherit",
          }}
        >
          More Useless
        </Link>
        <nav style={{ display: "flex", gap: 20, fontSize: 14, fontFamily: "inherit" }}>
          <Link to="/blog/" style={{ color: "#7a6b5a", textDecoration: "none" }}>Posts</Link>
          <Link to="/graph/" style={{ color: "#8b6f47", textDecoration: "none", fontWeight: 500 }}>Graph</Link>
          <Link to="/about/" style={{ color: "#7a6b5a", textDecoration: "none" }}>About</Link>
        </nav>
      </header>

      {/* Instructions - bottom right */}
      <div style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        fontSize: 11,
        color: "#888",
        background: "rgba(255,255,255,0.92)",
        padding: "10px 14px",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        lineHeight: 1.5,
        maxWidth: 200,
        zIndex: 50,
        fontFamily: "inherit",
      }}>
        Drag to move · Scroll to zoom · Click nodes to navigate
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
