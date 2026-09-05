// Letter - warm paper, one serif, nothing decorative. The colours live as CSS
// variables in custom.css (day on :root, night on html.night); theme-ui's tokens
// just point at them, so the mode switch is a single class on <html>.
import { lightThemeVars } from "@lekoarts/gatsby-theme-minimal-blog/src/utils/prism-themes"

const serif = `'EB Garamond', Garamond, Georgia, 'Times New Roman', serif`

const theme = {
  config: {
    useColorSchemeMediaQuery: false,
    useLocalStorage: false,
    initialColorModeName: `light`,
  },
  colors: {
    text: `var(--ink)`,
    background: `var(--paper)`,
    heading: `var(--ink)`,
    secondary: `var(--sec)`,
    muted: `var(--muted)`,
    divide: `var(--rule)`,
    underline: `var(--under)`,
    primary: `var(--ink)`,
    toggleIcon: `var(--ink)`,
    highlightLineBg: `rgba(128, 124, 116, 0.08)`,
    ...lightThemeVars,
  },
  fonts: {
    body: serif,
    heading: serif,
    monospace: `'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`,
  },
  fontSizes: [13, 15, 17, 19, 21, 24, 28, 34, 40, 46],
  fontWeights: {
    body: 400,
    heading: 400,
    bold: 600,
  },
  lineHeights: {
    body: 1.55,
    heading: 1.1,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  layout: {
    container: {
      maxWidth: `744px`,
      px: [`24px`, `32px`],
      mx: `auto`,
    },
    main: {
      width: `100%`,
    },
  },
  styles: {
    root: {
      fontFamily: `body`,
      lineHeight: `body`,
      fontWeight: `body`,
      color: `text`,
      backgroundColor: `background`,
      WebkitFontSmoothing: `antialiased`,
    },
    a: {
      color: `text`,
      textDecoration: `none`,
    },
    p: {
      fontSize: [3, 4],
      lineHeight: `body`,
      color: `text`,
    },
    h1: {
      fontFamily: `heading`,
      fontWeight: 400,
      lineHeight: 1.1,
      letterSpacing: `-0.005em`,
      fontSize: [7, 9],
      color: `heading`,
    },
    h2: {
      fontFamily: `heading`,
      fontWeight: 400,
      lineHeight: 1.2,
      fontSize: [5, 6],
      color: `heading`,
    },
    h3: {
      fontFamily: `heading`,
      fontWeight: 500,
      lineHeight: 1.25,
      fontSize: [4, 5],
      color: `heading`,
    },
    pre: {
      fontFamily: `monospace`,
      fontSize: 1,
      bg: `muted`,
      borderRadius: `4px`,
      overflowX: `auto`,
    },
    code: {
      fontFamily: `monospace`,
      fontSize: `0.8em`,
    },
    blockquote: {
      borderLeftColor: `underline`,
      borderLeftWidth: `2px`,
      borderLeftStyle: `solid`,
      ml: 0,
      pl: `20px`,
      color: `secondary`,
    },
  },
}

export default theme
