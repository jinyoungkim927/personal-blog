/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "theme-ui"
import { Link as GatsbyLink } from "gatsby"

const Footer = () => {
  return (
    <footer
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
    </footer>
  )
}

export default Footer
