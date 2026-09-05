/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import Location from "../../../components/Location"
import ModeToggle from "../../../components/ModeToggle"
import UselessMark from "../../../components/UselessMark"

const Header = () => (
  <header
    sx={{
      display: `flex`,
      justifyContent: `space-between`,
      alignItems: `center`,
      pt: [`32px`, `40px`],
    }}
  >
    <UselessMark />
    <div sx={{ display: `flex`, alignItems: `baseline`, gap: `24px` }}>
      <Location />
      <ModeToggle />
    </div>
  </header>
)

export default Header
