// Sepia theme - standalone definition
const theme = {
  config: {
    useColorSchemeMediaQuery: false,
  },
  colors: {
    text: "#3d2817",
    background: "#faf8f3",
    primary: "#8b6f47",
    secondary: "#7a6b5a",
    muted: "#f5f1e8",
    heading: "#2d1f14",
    divide: "#e8e0d5",
    toggleIcon: "#6b5435",
    highlightLineBg: "rgba(139, 111, 71, 0.1)",
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: "inherit",
    monospace: '"SF Mono", Menlo, Monaco, Consolas, monospace',
  },
  fontSizes: [12, 14, 16, 18, 24, 32, 48, 64],
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 700,
  },
  lineHeights: {
    body: 1.7,
    heading: 1.3,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
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
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
      fontSize: [4, 5],
      mt: 4,
      mb: 3,
      color: "heading",
    },
    h2: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
      fontSize: [3, 4],
      mt: 4,
      mb: 3,
      color: "heading",
    },
    h3: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
      fontSize: [2, 3],
      mt: 3,
      mb: 2,
      color: "heading",
    },
    pre: {
      fontFamily: "monospace",
      p: 3,
      bg: "muted",
      borderRadius: 4,
      overflowX: "auto",
    },
    code: {
      fontFamily: "monospace",
      fontSize: "0.875em",
    },
    blockquote: {
      borderLeftColor: "primary",
      borderLeftWidth: 3,
      borderLeftStyle: "solid",
      ml: 0,
      pl: 3,
      fontStyle: "italic",
    },
  },
}

export default theme
