/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"

const Footer = () => (
  <footer
    sx={{
      mt: `72px`,
      pb: [`48px`, `64px`],
      display: `flex`,
      justifyContent: `space-between`,
      alignItems: `baseline`,
      flexWrap: `wrap`,
      gap: `16px 28px`,
      fontSize: `17px`,
      color: `secondary`,
      a: {
        color: `secondary`,
        textDecoration: `none`,
        transition: `color 0.15s ease`,
        "&:hover": { color: `text` },
      },
    }}
  >
    <div sx={{ display: `flex`, gap: `28px` }}>
      <a href="https://x.com/jinkim00000">Twitter</a>
      <a href="https://www.linkedin.com/in/jinkim2/">LinkedIn</a>
      <a href="mailto:jinyoungkim927@gmail.com">Email</a>
    </div>
    <Link to="/disclaimer/">Disclaimer</Link>
  </footer>
)

export default Footer
