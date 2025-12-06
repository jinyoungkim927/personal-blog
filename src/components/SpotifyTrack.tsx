import * as React from "react"

interface SpotifyTrackProps {
  trackId: string
  startTime?: number // in seconds
  size?: "normal" | "compact"
}

const sizePresets = {
  normal: {
    width: `100%`,
    height: `352px`,
  },
  compact: {
    width: `100%`,
    height: `152px`,
  },
}

function SpotifyTrack({ trackId, startTime = 0, size = `normal` }: SpotifyTrackProps) {
  const src = `https://open.spotify.com/embed/track/${trackId}?start=${startTime}`
  
  return (
    <iframe
      title="Spotify"
      style={{
        borderRadius: `12px`,
        margin: `1.5em 0`,
      }}
      src={src}
      width={sizePresets[size].width}
      height={sizePresets[size].height}
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  )
}

export default SpotifyTrack

