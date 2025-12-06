import * as React from "react"
import { Link as GatsbyLink } from "gatsby"
import { Box } from "theme-ui"

const Footer = () => {
  return (
    <Box
      as="footer"
      sx={{
        boxSizing: `border-box`,
        display: `flex`,
        justifyContent: `center`,
        mt: [6],
        color: `secondary`,
        a: {
          variant: `links.secondary`,
        },
        variant: `dividers.top`,
        py: 4,
      }}
    >
      <GatsbyLink
        to="/disclaimer/"
        sx={{
          color: `#8b7a6f`,
          fontSize: `12px`,
          textDecoration: `none`,
          "&:hover": {
            textDecoration: `underline`,
          },
        }}
      >
        Disclaimer
      </GatsbyLink>
    </Box>
  )
}

export default Footer
