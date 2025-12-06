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
}

const GraphView: React.FC<GraphViewProps> = ({ width = 800, height = 600 }) => {
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
      setLoading(node.title)
      setTimeout(() => navigate(node.slug!), 300)
    } else if (node.isTag) {
      setLoading(`#${node.title}`)
      setTimeout(() => navigate(`/tags/${node.id}/`), 300)
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
        .attr("cursor", (d) => (d.exists || d.isTag ? "pointer" : "default"))
        .call(d3.drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
          .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y })
          .on("end", (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null }))

      // Node circles - tags get different color
      node.append("circle")
        .attr("r", getNodeSize)
        .attr("fill", (d) => d.isTag ? "#a09080" : d.exists ? "#8b6f47" : "#d4c9b9")
        .attr("stroke", (d) => d.isTag ? "#7a6b5a" : d.exists ? "#6b5435" : "#a09080")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", (d) => (d.exists || d.isTag ? "none" : "3,2"))

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
        link.attr("stroke", (l: any) => l.source.id === d.id || l.target.id === d.id ? "#8b6f47" : "#d4c9b9")
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
  }, [graphData, width, height])

  if (!graphData) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>Loading graph...</div>
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {loading && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(250,249,247,0.9)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10, borderRadius: 8
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#3d2817", marginBottom: 8 }}>Loading</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#8b6f47" }}>{loading}</div>
          </div>
        </div>
      )}
      <svg ref={svgRef} width={width} height={height} style={{ background: "#faf9f7", borderRadius: "8px" }} />
      <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: "11px", color: "#888", background: "rgba(250,249,247,0.9)", padding: "6px 10px", borderRadius: "4px" }}>
        <div><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#8b6f47", marginRight: 4 }} />Post</div>
        <div style={{ marginTop: 3 }}><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#a09080", marginRight: 4 }} />Tag</div>
        <div style={{ marginTop: 3 }}><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#d4c9b9", border: "1px dashed #a09080", marginRight: 4 }} />Unlinked</div>
      </div>
      <div style={{ position: "absolute", top: 12, left: 12, fontSize: "11px", color: "#888" }}>
        {graphData.nodes.length} nodes · {graphData.links.length} links
      </div>
    </div>
  )
}

export default GraphView
