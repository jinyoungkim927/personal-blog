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
  onNavigate?: () => void  // Callback to close modal
}

const GraphView: React.FC<GraphViewProps> = ({ width = 800, height = 600, onNavigate }) => {
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
    if (node.exists && node.slug) {
      const displayName = node.isTag ? `#${node.title}` : node.title
      setLoading(displayName)
      
      // Navigate after brief loading display, then close modal
      setTimeout(() => {
        if (onNavigate) onNavigate() // Close modal first
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

      // Reduced size difference: base 6, max 14
      const getNodeSize = (d: GraphNode) => Math.max(6, Math.min(14, 6 + d.totalLinks * 1.5))

      // Colors: Tags = cherry red, Posts = orange, Unlinked = gray/black
      const getNodeFill = (d: GraphNode) => {
        if (d.isTag) return "#dc2626" // Cherry red
        if (d.exists) return "#f97316" // Orange
        return "#4b5563" // Gray
      }
      
      const getNodeStroke = (d: GraphNode) => {
        if (d.isTag) return "#991b1b" // Dark red
        if (d.exists) return "#c2410c" // Dark orange
        return "#1f2937" // Dark gray
      }

      const simulation = d3
        .forceSimulation<GraphNode>(graphData.nodes)
        .force("link", d3.forceLink<GraphNode, GraphLink>(graphData.links).id((d) => d.id).distance(80))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(25))

      const link = g.append("g").attr("class", "links").selectAll("line")
        .data(graphData.links).enter().append("line")
        .attr("stroke", "#d4c9b9").attr("stroke-width", 1).attr("stroke-opacity", 0.5)

      const node = g.append("g").attr("class", "nodes").selectAll("g")
        .data(graphData.nodes).enter().append("g")
        .attr("cursor", (d) => (d.exists ? "pointer" : "default"))
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
        .attr("stroke-dasharray", (d) => (d.exists ? "none" : "3,2"))

      // Node labels
      node.append("text")
        .text((d) => d.isTag ? `#${d.title}` : d.title)
        .attr("x", 0)
        .attr("y", (d) => getNodeSize(d) + 12)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#3d2817")
        .attr("font-family", "system-ui, sans-serif")

      node.on("mouseenter", function (event, d) {
        d3.select(this).select("circle").attr("stroke-width", 2.5)
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
  }, [graphData, width, height, onNavigate])

  if (!graphData) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>Loading graph...</div>
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}>
      {loading && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(250,249,247,0.95)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, borderRadius: 8
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#3d2817", marginBottom: 8 }}>Loading</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#f97316" }}>{loading}</div>
          </div>
        </div>
      )}
      <svg ref={svgRef} width={width} height={height} style={{ background: "#faf9f7", borderRadius: "8px", display: "block" }} />
      {/* Legend - positioned outside SVG with enough margin */}
      <div style={{ 
        position: "absolute", 
        bottom: 20, 
        left: 20, 
        fontSize: "11px", 
        color: "#555", 
        background: "rgba(255,255,255,0.98)", 
        padding: "12px 16px", 
        borderRadius: "8px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        zIndex: 50,
        lineHeight: 1.6
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#f97316", marginRight: 8, flexShrink: 0 }} />
          <span>Post</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#dc2626", marginRight: 8, flexShrink: 0 }} />
          <span>Tag</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#4b5563", border: "1px dashed #1f2937", marginRight: 8, flexShrink: 0 }} />
          <span>Unlinked</span>
        </div>
      </div>
      {/* Stats */}
      <div style={{ position: "absolute", top: 12, left: 12, fontSize: "11px", color: "#888", zIndex: 50 }}>
        {graphData.nodes.length} nodes · {graphData.links.length} links
      </div>
    </div>
  )
}

export default GraphView
