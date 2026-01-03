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
          height: window.innerHeight - 60, // Account for header
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
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Minimal header */}
      <header style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        padding: "16px 24px",
        background: "rgba(250, 248, 243, 0.95)",
        backdropFilter: "blur(8px)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(232, 224, 213, 0.5)",
      }}>
        <Link 
          to="/" 
          style={{ 
            color: "#2d1f14", 
            textDecoration: "none", 
            fontWeight: 600, 
            fontSize: 18,
          }}
        >
          More Useless
        </Link>
        <nav style={{ display: "flex", gap: 20, fontSize: 14 }}>
          <Link to="/blog/" style={{ color: "#7a6b5a", textDecoration: "none" }}>Posts</Link>
          <Link to="/graph/" style={{ color: "#8b6f47", textDecoration: "none", fontWeight: 500 }}>Graph</Link>
          <Link to="/about/" style={{ color: "#7a6b5a", textDecoration: "none" }}>About</Link>
        </nav>
      </header>

      {/* Full-page graph */}
      <div style={{ 
        flex: 1, 
        marginTop: 60, // Header height
        position: "relative",
      }}>
        <GraphView 
          width={dimensions.width} 
          height={dimensions.height} 
          fullPage={true}
        />
      </div>

      {/* Instructions - bottom right */}
      <div style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        fontSize: 11,
        color: "#888",
        background: "rgba(255,255,255,0.95)",
        padding: "10px 14px",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        lineHeight: 1.5,
        maxWidth: 200,
        zIndex: 50,
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
