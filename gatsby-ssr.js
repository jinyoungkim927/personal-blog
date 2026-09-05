import * as React from "react"

// Import KaTeX CSS for SSR
import "katex/dist/katex.min.css"

// decide day or night before anything paints: the visitor's saved choice,
// otherwise the system setting
const modeScript = `(function(){try{var m=localStorage.getItem("mode");if(!m){m=window.matchMedia("(prefers-color-scheme: dark)").matches?"night":"day"}if(m==="night"){document.documentElement.classList.add("night")}}catch(e){}})();`

export const onRenderBody = ({ setHeadComponents, setPreBodyComponents }) => {
  if (typeof global !== "undefined") {
    global.document = global.document || {
      createElement: () => ({}),
      createElementNS: () => ({ setAttribute: () => {} }),
    }
  }

  setPreBodyComponents([
    <script key="mode" dangerouslySetInnerHTML={{ __html: modeScript }} />,
  ])

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
      key="gfonts-garamond"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
    />,
  ])
}
