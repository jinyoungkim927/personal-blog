import baseTheme from "@lekoarts/gatsby-theme-minimal-blog/src/gatsby-plugin-theme-ui"
import { merge } from "theme-ui"

// Warm sepia/golden theme
const theme = merge(baseTheme, {
  colors: {
    text: "#3d2817",
    background: "#faf8f3",
    primary: "#8b6f47",
    secondary: "#7a6b5a",
    muted: "#f5f1e8",
    heading: "#2d1f14",
    divide: "#e8e0d5",
    toggleIcon: "#6b5435",
    // Code
    "plain-color": "#3d2817",
    "plain-backgroundColor": "#f5f1e8",
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: "inherit",
  },
  styles: {
    root: {
      color: "text",
      backgroundColor: "background",
    },
    a: {
      color: "primary",
      "&:hover": {
        color: "heading",
      },
    },
  },
})

export default theme
