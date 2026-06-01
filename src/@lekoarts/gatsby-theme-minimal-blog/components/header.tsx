/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"
import { useLocation } from "@gatsbyjs/reach-router"

const TreeIcon: React.FC = () => (
  <svg
    viewBox="0 0 200 320"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    sx={{
      width: [`28px`, `34px`],
      height: `auto`,
      display: `block`,
    }}
  >
    <g fill="none" stroke="#f4f0e8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 100 320 C 96 280 104 240 100 200 C 96 160 102 120 98 80 C 96 50 102 30 100 16" strokeWidth="3.4" opacity="0.85" />
      <path d="M 98 130 C 88 116 72 108 56 102 C 44 98 32 96 22 95" strokeWidth="2.4" opacity="0.78" />
      <path d="M 100 100 C 112 86 130 78 148 72 C 162 68 174 66 184 64" strokeWidth="2.4" opacity="0.78" />
      <path d="M 99 70 C 90 58 76 50 60 44" strokeWidth="2.0" opacity="0.7" />
      <path d="M 100 50 C 112 40 128 32 144 28" strokeWidth="2.0" opacity="0.7" />
      <path d="M 99 200 C 88 192 76 188 64 188" strokeWidth="1.8" opacity="0.65" />
    </g>
  </svg>
)

const Header = () => {
  const location = useLocation()
  const isHome = location.pathname === "/" || location.pathname === ""

  return (
    <header
      sx={{
        display: `flex`,
        justifyContent: `space-between`,
        alignItems: `center`,
        pt: [3, 4],
        pb: [3, 4],
        fontFamily: `monospace`,
        fontSize: `11px`,
        letterSpacing: `0.28em`,
        textTransform: `uppercase`,
        position: `relative`,
        zIndex: 5,
      }}
    >
      {/* tree home-button only on inner pages - homepage doesn't need it */}
      {!isHome ? (
        <Link
          to="/"
          aria-label="more useless - home"
          sx={{
            display: `inline-flex`,
            alignItems: `center`,
            textDecoration: `none`,
            opacity: 0.78,
            transition: `opacity 0.2s ease, transform 0.25s ease`,
            "&:hover": { opacity: 1, transform: `translateY(-1px)` },
          }}
        >
          <TreeIcon />
        </Link>
      ) : (
        <span />
      )}

      <nav>
        <Link
          to="/about"
          sx={{
            color: `text`,
            textDecoration: `none`,
            opacity: 0.92,
            transition: `color 0.2s`,
            "&:hover": { color: `accent`, opacity: 1 },
          }}
        >
          about →
        </Link>
      </nav>
    </header>
  )
}

export default Header
