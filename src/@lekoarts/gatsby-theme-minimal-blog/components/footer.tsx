/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"

const Footer = () => (
  <footer
    sx={{
      mt: 6,
      pt: 4,
      pb: 4,
      borderTop: `1px solid`,
      borderColor: `rgba(247,233,200,0.14)`,
      display: `flex`,
      justifyContent: `space-between`,
      alignItems: `baseline`,
      flexWrap: `wrap`,
      gap: 2,
      fontFamily: `monospace`,
      fontSize: `11px`,
      letterSpacing: `0.12em`,
      color: `rgba(244,240,232,0.45)`,
    }}
  >
    <span>© {new Date().getFullYear()} jinyoungkim</span>
    <Link
      to="/disclaimer/"
      sx={{
        color: `rgba(244,240,232,0.45)`,
        textDecoration: `none`,
        transition: `color 0.2s`,
        "&:hover": { color: `ember` },
      }}
    >
      disclaimer
    </Link>
  </footer>
)

export default Footer
