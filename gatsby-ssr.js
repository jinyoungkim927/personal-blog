// Import KaTeX CSS for SSR
import "katex/dist/katex.min.css"

// Fix KaTeX SSR issue by providing globals
export const onRenderBody = ({ setHeadComponents }) => {
  // KaTeX expects certain globals during SSR
  if (typeof global !== 'undefined') {
    global.document = global.document || {
      createElement: () => ({}),
      createElementNS: () => ({ setAttribute: () => {} }),
    }
  }
}
