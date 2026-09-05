// Letter - warm paper, one serif, nothing decorative
import { lightThemeVars } from "@lekoarts/gatsby-theme-minimal-blog/src/utils/prism-themes"

const serif = `'EB Garamond', Garamond, Georgia, 'Times New Roman', serif`

const theme = {
  config: {
    useColorSchemeMediaQuery: false,
    initialColorModeName: `light`,
  },
  colors: {
    text: `#1c1b18`,
    background: `#fbf9f4`,
    heading: `#1c1b18`,
    secondary: `#7a756b`,
    muted: `#f1ede4`,
    divide: `#e6e1d6`,
    underline: `#c9c2b4`,
    primary: `#1c1b18`,
    toggleIcon: `#1c1b18`,
    highlightLineBg: `rgba(0, 0, 0, 0.04)`,
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
      maxWidth: `664px`,
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
      color: `#4a463f`,
    },
  },
}

export default theme
