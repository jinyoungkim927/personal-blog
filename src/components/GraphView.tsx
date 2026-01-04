import { navigate } from "gatsby"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

interface GraphNode {
  id: string
  title: string
  slug: string | null
  exists: boolean
  linkCount: number
  incomingLinks: number
  totalLinks: number
  isTag?: boolean
  isSnippet?: boolean
  accessible?: boolean
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface GraphLink {
  source: string | GraphNode
  target: string | GraphNode
  targetTitle: string
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

interface GraphViewProps {
  width?: number
  height?: number
  fullPage?: boolean
  onNavigate?: () => void
}

const GraphView: React.FC<GraphViewProps> = ({ width = 800, height = 600, fullPage = false, onNavigate }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch("/graph-data.json")
      .then((res) => res.json())
      .then((data: GraphData) => setGraphData(data))
      .catch((err) => console.error("Failed to load graph data:", err))
  }, [])

  const handleNodeClick = (node: GraphNode) => {
    // Only navigate if node exists, has a slug, and is accessible
    const canNavigate = node.exists && node.slug && (node.accessible !== false)
    
    if (canNavigate) {
      const displayName = node.isTag ? `#${node.title}` : node.title
      setLoading(displayName)
      
      setTimeout(() => {
        if (onNavigate) onNavigate()
        navigate(node.slug!)
      }, 400)
    }
  }

  useEffect(() => {
    if (!graphData || !svgRef.current) return

    import("d3").then((d3) => {
      const svg = d3.select(svgRef.current)
      svg.selectAll("*").remove()

      const g = svg.append("g")

      // Node sizes based on type: Posts (2x), Tags (1.5x), Snippets (1x)
      const baseSize = fullPage ? 6 : 5
      const getNodeSize = (d: GraphNode) => {
        const linkBonus = Math.min(8, d.totalLinks * 0.8)
        if (d.isTag) {
          // Tags: 1.5x (medium)
          return (baseSize * 1.5) + linkBonus
        } else if (d.isSnippet) {
          // Snippets: 1x (smallest)
          return baseSize + linkBonus * 0.5
        } else {
          // Posts: 2x (largest)
          return (baseSize * 2) + linkBonus
        }
      }

      // Colors based on node type and accessibility
      const getNodeFill = (d: GraphNode) => {
        // Inaccessible snippets are gray
        if (d.isSnippet && d.accessible === false) return "#9ca3af"
        // Tags are red
        if (d.isTag) return "#dc2626"
        // Snippets are blue-ish
        if (d.isSnippet) return "#3b82f6"
        // Existing posts are orange
        if (d.exists) return "#f97316"
        // Non-existent nodes are dark gray
        return "#4b5563"
      }
      
      const getNodeStroke = (d: GraphNode) => {
        if (d.isSnippet && d.accessible === false) return "#6b7280"
        if (d.isTag) return "#991b1b"
        if (d.isSnippet) return "#1d4ed8"
        if (d.exists) return "#c2410c"
        return "#1f2937"
      }
      
      // Check if node is clickable
      const isClickable = (d: GraphNode) => {
        return d.exists && d.slug && (d.accessible !== false)
      }

      const simulation = d3
        .forceSimulation<GraphNode>(graphData.nodes)
        .force("link", d3.forceLink<GraphNode, GraphLink>(graphData.links).id((d) => d.id).distance(fullPage ? 120 : 80))
        .force("charge", d3.forceManyBody().strength(fullPage ? -300 : -200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(fullPage ? 35 : 25))

      const link = g.append("g").attr("class", "links").selectAll("line")
        .data(graphData.links).enter().append("line")
        .attr("stroke", "#d4c9b9").attr("stroke-width", 1).attr("stroke-opacity", 0.5)

      const node = g.append("g").attr("class", "nodes").selectAll("g")
        .data(graphData.nodes).enter().append("g")
        .attr("cursor", (d) => isClickable(d) ? "pointer" : "default")
        .call(d3.drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
          .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y })
          .on("end", (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null }))

      // Node circles
      node.append("circle")
        .attr("r", getNodeSize)
        .attr("fill", getNodeFill)
        .attr("stroke", getNodeStroke)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", (d) => {
          // Dashed for non-existent or inaccessible
          if (!d.exists) return "3,2"
          if (d.isSnippet && d.accessible === false) return "3,2"
          return "none"
        })
        .attr("opacity", (d) => (d.isSnippet && d.accessible === false) ? 0.6 : 1)

      // Node labels
      node.append("text")
        .text((d) => {
          if (d.isTag) return `#${d.title}`
          if (d.isSnippet && d.accessible === false) return `🔒 ${d.title}`
          return d.title
        })
        .attr("x", 0)
        .attr("y", (d) => getNodeSize(d) + (fullPage ? 14 : 12))
        .attr("text-anchor", "middle")
        .attr("font-size", fullPage ? "12px" : "10px")
        .attr("fill", (d) => (d.isSnippet && d.accessible === false) ? "#9ca3af" : "#3d2817")
        .attr("font-family", "system-ui, sans-serif")

      node.on("mouseenter", function (event, d) {
        if (isClickable(d)) {
          d3.select(this).select("circle").attr("stroke-width", 2.5)
        }
        link.attr("stroke", (l: any) => l.source.id === d.id || l.target.id === d.id ? "#f97316" : "#d4c9b9")
            .attr("stroke-width", (l: any) => l.source.id === d.id || l.target.id === d.id ? 2 : 1)
      }).on("mouseleave", function () {
        d3.select(this).select("circle").attr("stroke-width", 1.5)
        link.attr("stroke", "#d4c9b9").attr("stroke-width", 1)
      }).on("click", (event, d) => handleNodeClick(d))

      svg.call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.2, 4]).on("zoom", (event) => g.attr("transform", event.transform)))

      simulation.on("tick", () => {
        link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y)
        node.attr("transform", (d) => `translate(${d.x},${d.y})`)
      })

      return () => simulation.stop()
    })
  }, [graphData, width, height, fullPage, onNavigate])

  if (!graphData) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>Loading graph...</div>
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {loading && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(250,248,243,0.95)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#3d2817", marginBottom: 8 }}>Loading</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#f97316" }}>{loading}</div>
          </div>
        </div>
      )}
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        style={{ 
          background: fullPage ? "transparent" : "#faf9f7", 
          borderRadius: fullPage ? 0 : "8px", 
          display: "block" 
        }} 
      />
      {/* Legend - bottom left */}
      <div style={{ 
        position: "absolute", 
        bottom: fullPage ? 24 : 20, 
        left: fullPage ? 24 : 20, 
        fontSize: fullPage ? "12px" : "11px", 
        color: "#555", 
        background: "rgba(255,255,255,0.95)", 
        padding: fullPage ? "14px 18px" : "12px 16px", 
        borderRadius: "8px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        zIndex: 50,
        lineHeight: 1.6
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#f97316", marginRight: 8, flexShrink: 0 }} />
          <span>Post</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#3b82f6", marginRight: 8, flexShrink: 0 }} />
          <span>Snippet</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#dc2626", marginRight: 8, flexShrink: 0 }} />
          <span>Tag</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#9ca3af", border: "1px dashed #6b7280", marginRight: 8, flexShrink: 0 }} />
          <span>Locked</span>
        </div>
      </div>
      {/* Stats */}
      <div style={{ 
        position: "absolute", 
        top: fullPage ? 120 : 12, 
        right: fullPage ? 24 : undefined,
        left: fullPage ? undefined : 12, 
        fontSize: "11px", 
        color: "#888", 
        zIndex: 50,
        background: fullPage ? "rgba(255,255,255,0.9)" : "transparent",
        padding: fullPage ? "6px 12px" : 0,
        borderRadius: fullPage ? "6px" : 0,
      }}>
        {graphData.nodes.length} nodes · {graphData.links.length} links
      </div>
    </div>
  )
}

export default GraphView
