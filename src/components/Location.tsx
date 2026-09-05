/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { LOCATION_URL } from "../config/location"

type LocationData = { city?: string; updated?: string }

// Shows the city my phone last reported. Renders nothing until it loads,
// and nothing at all if the URL is unset or the fetch fails.
const Location: React.FC = () => {
  const [city, setCity] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!LOCATION_URL) return
    let cancelled = false
    fetch(LOCATION_URL, { cache: `no-store` })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LocationData | null) => {
        if (cancelled || !data || typeof data.city !== `string`) return
        const value = data.city.trim()
        if (value) setCity(value)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!city) return null

  return (
    <span sx={{ fontSize: `17px`, color: `secondary` }} title="Where I am right now, from my phone">
      Currently in {city}
    </span>
  )
}

export default Location
