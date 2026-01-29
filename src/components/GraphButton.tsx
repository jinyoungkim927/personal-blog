import * as React from "react"
import { useEffect, useState } from "react"
import { navigate } from "gatsby"
import features from "../config/features"

// Lazy load GraphView to avoid SSR issues with d3
const GraphView = React.lazy(() => import("./GraphView"))

const GraphButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isMounted, setIsMounted] = useState(false)
  const [isGraphPage, setIsGraphPage] = useState(false)
  const [isHomePage, setIsHomePage] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if we're on the graph page or home page
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      setIsGraphPage(path === "/graph/" || path === "/graph")
      setIsHomePage(path === "/" || path === "/blog/" || path === "/blog")
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: Math.min(window.innerWidth * 0.95, 1800),
          height: Math.min(window.innerHeight * 0.92, 1000),
        })
      }
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false) }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = "" }
  }, [isOpen])

  const closeModal = () => setIsOpen(false)

  // Don't render during SSR, on graph page, or on home page when graph disabled
  if (!isMounted || isGraphPage || (!features.graphEnabled && isHomePage)) return null

  const handleClick = () => {
    if (features.graphEnabled) {
      setIsOpen(true)
    } else {
      navigate("/")
    }
  }

  return (
    <>
      <button onClick={handleClick} className="graph-button" aria-label={features.graphEnabled ? "Open idea graph" : "Go to home"} title={features.graphEnabled ? "View idea graph" : "Go to home"}>
        <img
          src="/favicon.svg"
          alt="Idea Graph" 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "contain",
          }} 
        />
      </button>

      {isOpen && (
        <div className="graph-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
          <div className="graph-modal" style={{ width: dimensions.width, height: dimensions.height, overflow: "visible" }}>
            <button className="graph-modal-close" onClick={() => setIsOpen(false)} aria-label="Close graph">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", fontWeight: 600, color: "#1a1815", fontSize: "16px", zIndex: 10 }}>Idea Graph</div>
            <div style={{ paddingTop: 50, height: "calc(100% - 50px)", overflow: "visible" }}>
              <React.Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>Loading graph...</div>}>
                <GraphView 
                  width={dimensions.width} 
                  height={dimensions.height - 60} 
                  onNavigate={closeModal}
                />
              </React.Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GraphButton
