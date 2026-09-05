import * as React from "react"

interface FigureProps {
  src: string
  alt: string
  caption?: string
}

// House style for figures: full measure, square corners, no shadow, a small
// caption set flush left beneath. Click to see it large.
const Figure: React.FC<FigureProps> = ({ src, alt, caption }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  React.useEffect(() => {
    if (!isExpanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isExpanded])

  return (
    <>
      <figure className="plate" onClick={() => setIsExpanded(true)}>
        <img src={src} alt={alt} loading="lazy" />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>

      {isExpanded && (
        <div
          className="plate-lightbox"
          role="dialog"
          aria-label={caption || alt}
          onClick={() => setIsExpanded(false)}
        >
          <img src={src} alt={alt} />
          {caption && <p>{caption}</p>}
        </div>
      )}
    </>
  )
}

export default Figure
