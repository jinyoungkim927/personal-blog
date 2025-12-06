/** @jsx jsx */
import { jsx } from "theme-ui"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { navigate } from "gatsby"

interface GraphNode {
  id: string
  title: string
  slug: string | null
  exists: boolean
  linkCount: number
  incomingLinks: number
  totalLinks: number
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
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 })

  useEffect(() => {
    // Fetch graph data
    fetch("/graph-data.json")
      .then((res) => res.json())
      .then((data: GraphData) => {
        setGraphData(data)
      })
      .catch((err) => {
        console.error("Failed to load graph data:", err)
      })
  }, [])

  useEffect(() => {
    if (!graphData || !svgRef.current) return

    // Dynamic import of D3 (only in browser)
    import("d3").then((d3) => {
      const svg = d3.select(svgRef.current)
      svg.selectAll("*").remove()

      const g = svg.append("g")

      // Create simulation
      const simulation = d3
        .forceSimulation<GraphNode>(graphData.nodes)
        .force(
          "link",
          d3
            .forceLink<GraphNode, GraphLink>(graphData.links)
            .id((d) => d.id)
            .distance(100)
        )
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(30))

      // Create links
      const link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graphData.links)
        .enter()
        .append("line")
        .attr("stroke", "#d4c9b9")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.6)

      // Create nodes
      const node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graphData.nodes)
        .enter()
        .append("g")
        .attr("cursor", (d) => (d.exists ? "pointer" : "default"))
        .call(
          d3
            .drag<SVGGElement, GraphNode>()
            .on("start", (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart()
              d.fx = d.x
              d.fy = d.y
            })
            .on("drag", (event, d) => {
              d.fx = event.x
              d.fy = event.y
            })
            .on("end", (event, d) => {
              if (!event.active) simulation.alphaTarget(0)
              d.fx = null
              d.fy = null
            })
        )

      // Node circles
      node
        .append("circle")
        .attr("r", (d) => Math.max(8, Math.min(20, 8 + d.totalLinks * 2)))
        .attr("fill", (d) => (d.exists ? "#8b6f47" : "#d4c9b9"))
        .attr("stroke", (d) => (d.exists ? "#6b5435" : "#a09080"))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", (d) => (d.exists ? "none" : "4,2"))

      // Node labels
      node
        .append("text")
        .text((d) => d.title)
        .attr("x", 0)
        .attr("y", (d) => Math.max(8, Math.min(20, 8 + d.totalLinks * 2)) + 14)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#3d2817")
        .attr("font-family", "system-ui, sans-serif")

      // Hover effects
      node
        .on("mouseenter", function (event, d) {
          setHoveredNode(d.id)
          d3.select(this).select("circle").attr("stroke-width", 3)
          
          // Highlight connected links
          link
            .attr("stroke", (l: any) =>
              l.source.id === d.id || l.target.id === d.id
                ? "#8b6f47"
                : "#d4c9b9"
            )
            .attr("stroke-width", (l: any) =>
              l.source.id === d.id || l.target.id === d.id ? 2 : 1
            )
        })
        .on("mouseleave", function () {
          setHoveredNode(null)
          d3.select(this).select("circle").attr("stroke-width", 2)
          link.attr("stroke", "#d4c9b9").attr("stroke-width", 1)
        })
        .on("click", (event, d) => {
          if (d.exists && d.slug) {
            navigate(d.slug)
          }
        })

      // Zoom behavior
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 4])
        .on("zoom", (event) => {
          g.attr("transform", event.transform)
          setTransform({
            x: event.transform.x,
            y: event.transform.y,
            k: event.transform.k,
          })
        })

      svg.call(zoom)

      // Update positions on tick
      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y)

        node.attr("transform", (d) => `translate(${d.x},${d.y})`)
      })

      return () => {
        simulation.stop()
      }
    })
  }, [graphData, width, height])

  if (!graphData) {
    return (
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "secondary",
        }}
      >
        Loading graph...
      </div>
    )
  }

  return (
    <div sx={{ position: "relative", width: "100%", height: "100%" }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        sx={{
          background: "#faf9f7",
          borderRadius: "8px",
        }}
      />
      <div
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          fontSize: "12px",
          color: "secondary",
          background: "rgba(250, 249, 247, 0.9)",
          padding: "8px 12px",
          borderRadius: "6px",
        }}
      >
        <div>
          <span sx={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#8b6f47", mr: 1 }} />
          Existing post
        </div>
        <div sx={{ mt: 1 }}>
          <span sx={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#d4c9b9", border: "2px dashed #a09080", mr: 1 }} />
          Unlinked reference
        </div>
      </div>
      <div
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          fontSize: "12px",
          color: "secondary",
        }}
      >
        {graphData.nodes.length} nodes · {graphData.links.length} links
      </div>
    </div>
  )
}

export default GraphView

