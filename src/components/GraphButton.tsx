import * as React from "react"
import { useEffect, useState } from "react"
import GraphView from "./GraphView"

const GraphButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: Math.min(window.innerWidth * 0.9, 1200),
          height: Math.min(window.innerHeight * 0.85, 800),
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
          <div className="graph-modal" style={{ width: dimensions.width, height: dimensions.height }}>
            <button className="graph-modal-close" onClick={() => setIsOpen(false)} aria-label="Close graph">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", fontWeight: 600, color: "#1a1815", fontSize: "16px" }}>Knowledge Graph</div>
            <div style={{ paddingTop: 50, height: "100%" }}>
              <GraphView width={dimensions.width} height={dimensions.height - 60} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GraphButton
