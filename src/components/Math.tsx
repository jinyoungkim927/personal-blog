import * as React from "react"
import { useEffect, useRef } from "react"

interface MathProps {
  children: string
  display?: boolean
}

// Renders LaTeX math using KaTeX
const Math: React.FC<MathProps> = ({ children, display = false }) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (ref.current && typeof window !== "undefined") {
      import("katex").then((katex) => {
        katex.default.render(children, ref.current!, {
          displayMode: display,
          throwOnError: false,
        })
      })
    }
  }, [children, display])

  // Use span with display:block to avoid DOM nesting issues in MDX paragraphs
  // (div cannot be inside p, but span with display:block can)
  return display ? (
    <span style={{ display: "block", textAlign: "center", margin: "1.5em 0", overflowX: "auto" }}>
      <span ref={ref} />
    </span>
  ) : (
    <span ref={ref} />
  )
}

export default Math

