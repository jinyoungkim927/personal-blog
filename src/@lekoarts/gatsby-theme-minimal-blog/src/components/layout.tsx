/** @jsx jsx */
import * as React from "react"
import { Global } from "@emotion/react"
import { Box, Container, jsx } from "theme-ui"
import Header from "./header"
import Footer from "./footer"

type LayoutProps = { children: React.ReactNode; className?: string }

const Layout = ({ children, className = `` }: LayoutProps) => (
  <React.Fragment>
    <Global
      styles={{
        "*": { boxSizing: "border-box" },
        body: { margin: 0, padding: 0 },
      }}
    />
    <Container sx={{ maxWidth: 680, px: [3, 4], py: [4, 5] }}>
      <Header />
      <Box as="main" className={className}>
        {children}
      </Box>
      <Footer />
    </Container>
  </React.Fragment>
)

export default Layout
