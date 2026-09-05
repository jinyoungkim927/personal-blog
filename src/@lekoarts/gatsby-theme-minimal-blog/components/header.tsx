/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import Location from "../../../components/Location"
import UselessTree from "../../../components/UselessTree"

const Header = () => (
  <header
    sx={{
      display: `flex`,
      justifyContent: `space-between`,
      alignItems: `center`,
      pt: [`32px`, `40px`],
    }}
  >
    <UselessTree />
    <Location />
  </header>
)

export default Header
