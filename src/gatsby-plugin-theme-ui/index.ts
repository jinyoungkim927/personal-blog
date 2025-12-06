import baseTheme from "@lekoarts/gatsby-theme-minimal-blog/src/gatsby-plugin-theme-ui"

// Warm sepia/golden theme - spread base and override
const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    text: "#3d2817",
    background: "#faf8f3",
    primary: "#8b6f47",
    secondary: "#7a6b5a",
    muted: "#f5f1e8",
    heading: "#2d1f14",
    divide: "#e8e0d5",
    toggleIcon: "#6b5435",
    modes: {
      dark: {
        text: "#e8e0d5",
        background: "#1a1815",
        primary: "#c9a66b",
        secondary: "#a09080",
        muted: "#2d2a26",
        heading: "#faf8f3",
        divide: "#3d3530",
        toggleIcon: "#c9a66b",
      },
    },
  },
}

export default theme
