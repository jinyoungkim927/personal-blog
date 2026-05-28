import * as React from "react"

// Import KaTeX CSS for SSR
import "katex/dist/katex.min.css"

export const onRenderBody = ({ setHeadComponents }) => {
  if (typeof global !== "undefined") {
    global.document = global.document || {
      createElement: () => ({}),
      createElementNS: () => ({ setAttribute: () => {} }),
    }
  }

  setHeadComponents([
    <link key="favicon-svg" rel="icon" type="image/svg+xml" href="/favicon.svg" />,
    <link key="favicon-32" rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />,
    <link key="favicon-16" rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />,
    <link key="favicon-apple" rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />,
    <link
      key="gfonts-preconnect-1"
      rel="preconnect"
      href="https://fonts.googleapis.com"
    />,
    <link
      key="gfonts-preconnect-2"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="gfonts-painterly"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap"
    />,
  ])
}
