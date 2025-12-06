/** @jsx jsx */
import { jsx, Box } from "theme-ui"
import { Link } from "gatsby"

const Footer = () => (
  <Box
    as="footer"
    sx={{
      mt: 5,
      pt: 4,
      borderTop: "1px solid",
      borderColor: "divide",
      color: "secondary",
      fontSize: 0,
      textAlign: "center",
    }}
  >
    <Link to="/disclaimer" sx={{ color: "secondary", textDecoration: "none", "&:hover": { color: "primary" } }}>
      Disclaimer
    </Link>
  </Box>
)

export default Footer
