/** @jsx jsx */
import * as React from "react"
import { ThemeProvider } from "theme-ui"
import theme from "../../../gatsby-plugin-theme-ui"

type RootProps = { children: React.ReactNode }

const Root = ({ children }: RootProps) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

export default Root

