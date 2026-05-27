// Painterly dark theme — Fujimura mineral pigments on warm ink
const theme = {
  config: {
    useColorSchemeMediaQuery: false,
  },
  colors: {
    // surface
    text: "#f4f0e8",          // bone — body text on dark
    background: "#000000",    // true black — seamless overscroll
    heading: "#fdf8ec",       // brighter bone for titles
    secondary: "#a89e8b",     // muted bone for meta
    muted: "#1c1812",         // surface elevation
    divide: "rgba(247,233,200,0.22)",
    // accent — Fujimura gold leaf (was ember vermillion)
    primary: "#d4a24e",
    accent: "#d4a24e",
    accentSoft: "rgba(212,162,78,0.5)",
    ember: "#d4a24e",         // alias kept so existing refs keep working
    emberSoft: "rgba(212,162,78,0.5)",
    leaf: "#d6cfbb",          // silver-leaf bone
    leafWarm: "#c8a86a",      // gold-leaf (slightly cooler than primary)
    toggleIcon: "#f4f0e8",
    highlightLineBg: "rgba(212,162,78,0.10)",
  },
  fonts: {
    body: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Space Grotesk', 'Inter', sans-serif",
    serif: "'Cormorant Garamond', Georgia, serif",
    monospace: "'JetBrains Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace",
  },
  fontSizes: [12, 14, 16, 18, 24, 32, 48, 64, 72],
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 700,
  },
  lineHeights: {
    body: 1.7,
    heading: 1.15,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  layout: {
    container: {
      maxWidth: `1080px`,
      px: [3, 4, 4],
    },
    main: {
      maxWidth: `1080px`,
      width: `100%`,
      mx: `auto`,
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      color: "text",
      backgroundColor: "background",
      WebkitFontSmoothing: "antialiased",
    },
    a: {
      color: "primary",
      textDecoration: "none",
      transition: "color 0.2s",
      "&:hover": {
        color: "heading",
      },
    },
    p: {
      fontSize: [1, 1, 2],
      lineHeight: "body",
      mb: 3,
      color: "text",
    },
    // article body headings: stay in Inter (body) so they don't feel
    // like a different typographic system from the surrounding text.
    h1: {
      fontFamily: "body",
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "-0.012em",
      fontSize: [4, 5],
      mt: 4,
      mb: 3,
      color: "heading",
    },
    h2: {
      fontFamily: "body",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.008em",
      fontSize: [3, 4],
      mt: 4,
      mb: 2,
      color: "heading",
    },
    h3: {
      fontFamily: "body",
      fontWeight: 600,
      lineHeight: 1.35,
      fontSize: [2, 3],
      mt: 3,
      mb: 2,
      color: "heading",
    },
    pre: {
      fontFamily: "monospace",
      fontSize: 1,
      p: 3,
      bg: "muted",
      borderRadius: 2,
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
      color: "secondary",
    },
  },
}

export default theme
