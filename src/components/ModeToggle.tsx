/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"

// one word in the corner: the name of the other mode. The mode itself is a
// class on <html>, set before paint by the script in gatsby-ssr.js.
const ModeToggle: React.FC = () => {
  const [night, setNight] = React.useState(false)

  React.useEffect(() => {
    setNight(document.documentElement.classList.contains(`night`))
  }, [])

  const flip = () => {
    const next = !night
    document.documentElement.classList.toggle(`night`, next)
    try {
      localStorage.setItem(`mode`, next ? `night` : `day`)
    } catch {
      // private mode; the choice just won't be remembered
    }
    setNight(next)
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={night ? `Switch to day` : `Switch to night`}
      sx={{
        all: `unset`,
        cursor: `pointer`,
        font: `inherit`,
        fontSize: `17px`,
        color: `secondary`,
        transition: `color 0.15s ease`,
        "&:hover": { color: `text` },
        "&:focus-visible": { outline: `1px solid`, outlineColor: `text`, outlineOffset: `3px` },
      }}
    >
      {night ? `Day` : `Night`}
    </button>
  )
}

export default ModeToggle
