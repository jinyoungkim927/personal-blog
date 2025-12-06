import type { Theme } from "theme-ui"

// Hyper-minimalist sepia theme
const theme: Theme = {
  colors: {
    text: "#2d2a26",
    background: "#faf9f7",
    primary: "#8b7355",
    secondary: "#a09080",
    muted: "#f0ede8",
    heading: "#1a1815",
    divide: "#e5e0d8",
    // Code colors
    "plain-color": "#2d2a26",
    "plain-backgroundColor": "#f5f3ef",
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: 'inherit',
    monospace: '"SF Mono", Menlo, Monaco, monospace',
  },
  fontSizes: [13, 15, 17, 20, 26, 36, 48],
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 600,
  },
  lineHeights: {
    body: 1.7,
    heading: 1.3,
  },
  space: [0, 4, 8, 16, 32, 64, 128],
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      color: "text",
      backgroundColor: "background",
    },
    a: {
      color: "primary",
      textDecoration: "none",
      "&:hover": {
        color: "heading",
      },
    },
    p: {
      fontSize: [1, 1, 2],
      lineHeight: "body",
      mb: 3,
    },
    h1: {
      variant: "text.heading",
      fontSize: [4, 5],
      mt: 4,
      mb: 3,
    },
    h2: {
      variant: "text.heading",
      fontSize: [3, 4],
      mt: 4,
      mb: 3,
    },
    h3: {
      variant: "text.heading",
      fontSize: [2, 3],
      mt: 3,
      mb: 2,
    },
    code: {
      fontFamily: "monospace",
      fontSize: "0.9em",
      bg: "muted",
      px: 1,
      borderRadius: 3,
    },
    pre: {
      fontFamily: "monospace",
      p: 3,
      bg: "muted",
      borderRadius: 4,
      overflowX: "auto",
    },
  },
}

export default theme
