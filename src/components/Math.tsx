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

  return display ? (
    <div style={{ textAlign: "center", margin: "1.5em 0", overflowX: "auto" }}>
      <span ref={ref} />
    </div>
  ) : (
    <span ref={ref} />
  )
}

export default Math

