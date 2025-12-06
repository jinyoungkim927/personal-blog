import * as React from "react"
import { useEffect, useState } from "react"

// Lazy load GraphView to avoid SSR issues with d3
const GraphView = React.lazy(() => import("./GraphView"))

const GraphButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
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

  // Don't render anything during SSR
  if (!isMounted) return null

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="graph-button" aria-label="Open knowledge graph" title="View knowledge graph">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="18" r="3" />
          <line x1="8.5" y1="7.5" x2="15.5" y2="16.5" /><line x1="15.5" y1="7.5" x2="8.5" y2="16.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="graph-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
          <div className="graph-modal" style={{ width: dimensions.width, height: dimensions.height, overflow: "visible" }}>
            <button className="graph-modal-close" onClick={() => setIsOpen(false)} aria-label="Close graph">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", fontWeight: 600, color: "#1a1815", fontSize: "16px", zIndex: 10 }}>Knowledge Graph</div>
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
