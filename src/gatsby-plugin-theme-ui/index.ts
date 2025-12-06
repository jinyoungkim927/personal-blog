import type { Theme } from "theme-ui"

const theme: Theme = {
  colors: {
    text: "#3d2817", // Deep sepia brown for text
    background: "#faf8f3", // Warm cream/ivory background
    primary: "#8b6f47", // Golden sepia for links and accents
    primaryHover: "#6b5435", // Darker sepia on hover
    secondary: "#7a6b5a", // Muted sepia for secondary text
    muted: "#f5f1e8", // Very light sepia for backgrounds
    success: "#9a8b6f",
    info: "#8b7a5f",
    warning: "#b8a082",
    danger: "#a68b6f",
    light: "#faf8f3",
    dark: "#2d1f14", // Deep sepia for dark mode
    textMuted: "#8b7a6f", // Muted sepia text
    toggleIcon: "#6b5435",
    heading: "#2d1f14", // Deep sepia for headings
    divide: "#e8e0d5", // Subtle sepia divider
    highlightLineBg: "rgba(139, 111, 71, 0.08)", // Very subtle golden highlight
    // Code block colors - subtle sepia tones
    "plain-color": "#3d2817",
    "plain-backgroundColor": "#f5f1e8",
    "comment-color": "#8b7a6f",
    "comment-fontStyle": "italic",
    "prolog-color": "#8b7a6f",
    "prolog-fontStyle": "italic",
    "doctype-color": "#8b7a6f",
    "doctype-fontStyle": "italic",
    "cdata-color": "#8b7a6f",
    "cdata-fontStyle": "italic",
    "namespace-opacity": 0.7,
    "string-color": "#8b6f47",
    "attr-value-color": "#8b6f47",
    "punctuation-color": "#3d2817",
    "operator-color": "#3d2817",
    "entity-color": "#7a6b5a",
    "url-color": "#7a6b5a",
    "symbol-color": "#7a6b5a",
    "number-color": "#7a6b5a",
    "boolean-color": "#7a6b5a",
    "variable-color": "#3d2817",
    "constant-color": "#3d2817",
    "property-color": "#3d2817",
    "regex-color": "#7a6b5a",
    "inserted-color": "#7a6b5a",
    "atrule-color": "#8b6f47",
    "keyword-color": "#2d1f14",
    "attr-name-color": "#8b6f47",
    "selector-color": "#2d1f14",
    "function-color": "#6b5435",
    "deleted-color": "#6b5435",
    "tag-color": "#2d1f14",
    "function-variable-color": "#8b6f47",
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    monospace: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontWeights: {
    body: 400,
    heading: 500, // Lighter, more subtle
    bold: 600,
  },
  lineHeights: {
    body: 1.7, // More breathing room
    heading: 1.3,
  },
  fontSizes: [12, 14, 16, 18, 20, 24, 30, 36, 48, 64],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    container: 1024,
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      color: "text",
      bg: "background",
    },
    h1: {
      color: "heading",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: [5, 6, 7],
      mt: 4,
      mb: 2,
    },
    h2: {
      color: "heading",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: [4, 5, 6],
      mt: 4,
      mb: 2,
    },
    h3: {
      color: "heading",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: [3, 4, 5],
      mt: 3,
      mb: 2,
    },
    h4: {
      color: "heading",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: [2, 3, 4],
      mt: 3,
      mb: 2,
    },
    h5: {
      color: "heading",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: [1, 2, 3],
      mt: 2,
      mb: 1,
    },
    h6: {
      color: "heading",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: [0, 1, 2],
      mt: 2,
      mb: 1,
    },
    p: {
      color: "text",
      mb: 3,
      fontSize: [1, 1, 2],
      lineHeight: "body",
    },
    a: {
      color: "primary",
      textDecoration: "none",
      transition: "color 0.2s ease",
      "&:hover": {
        color: "primaryHover",
        textDecoration: "underline",
      },
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: "divide",
      p: 2,
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: "divide",
      p: 2,
    },
    img: {
      maxWidth: "100%",
    },
  },
  // Dark mode removed
}

export default theme

