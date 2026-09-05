/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"

// Zhuangzi's useless tree - the site's one mark
const TreeIcon: React.FC = () => (
  <svg
    viewBox="0 0 200 320"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    sx={{ width: `16px`, height: `26px`, display: `block`, flexShrink: 0 }}
  >
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 100 320 C 96 280 104 240 100 200 C 96 160 102 120 98 80 C 96 50 102 30 100 16" strokeWidth="12" />
      <path d="M 98 130 C 88 116 72 108 56 102 C 44 98 32 96 22 95" strokeWidth="9" />
      <path d="M 100 100 C 112 86 130 78 148 72 C 162 68 174 66 184 64" strokeWidth="9" />
      <path d="M 99 70 C 90 58 76 50 60 44" strokeWidth="8" />
      <path d="M 100 50 C 112 40 128 32 144 28" strokeWidth="8" />
      <path d="M 99 200 C 88 192 76 188 64 188" strokeWidth="7" />
    </g>
  </svg>
)

const Header = () => (
  <header
    sx={{
      display: `flex`,
      justifyContent: `space-between`,
      alignItems: `center`,
      pt: [`32px`, `40px`],
    }}
  >
    <Link
      to="/"
      aria-label="more useless - home"
      sx={{
        display: `inline-flex`,
        alignItems: `center`,
        gap: `10px`,
        color: `text`,
        textDecoration: `none`,
        fontStyle: `italic`,
        fontSize: `19px`,
        transition: `color 0.15s ease`,
        "&:hover": { color: `secondary` },
      }}
    >
      <TreeIcon />
      <span>more useless</span>
    </Link>

    <Link
      to="/#subscribe"
      sx={{
        color: `secondary`,
        textDecoration: `none`,
        fontSize: `17px`,
        transition: `color 0.15s ease`,
        "&:hover": { color: `text` },
      }}
    >
      Subscribe
    </Link>
  </header>
)

export default Header
