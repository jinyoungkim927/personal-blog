/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"

// Zhuangzi's tree: gnarled enough that no carpenter would want it, which is
// why it gets to grow old. Hover it and its shade settles over the page.

export const TREE_PATHS: [string, number][] = [
  [`M 104 320 C 70 270 140 240 96 190 C 60 150 132 120 98 84 C 72 58 112 40 100 14`, 13],
  [`M 96 190 C 70 176 40 186 22 172`, 9],
  [`M 110 176 C 140 166 150 138 182 132`, 9],
  [`M 98 84 C 74 78 60 56 38 52`, 8],
  [`M 106 96 C 136 92 152 70 176 74`, 8],
  [`M 101 40 C 118 30 128 14 148 10`, 7],
  [`M 22 172 C 16 160 8 158 4 148`, 6],
]

export const TreeIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    viewBox="0 0 200 320"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    sx={{ width: `${size}px`, height: `${Math.round(size * 1.6)}px`, display: `block` }}
  >
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {TREE_PATHS.map(([d, w]) => (
        <path key={d} d={d} strokeWidth={w} />
      ))}
    </g>
  </svg>
)

type Blob = { x: number; y: number; r: number; p: number; s: number }
type Fleck = { x: number; y: number; r: number; p: number }

// deterministic, so the shade falls the same way every time
const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const UselessMark: React.FC = () => {
  const linkRef = React.useRef<HTMLAnchorElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const state = React.useRef({ alpha: 0, target: 0, raf: 0, blobs: [] as Blob[], flecks: [] as Fleck[], reduce: false })

  // a canopy's worth of soft dark patches, laid out from wherever the mark is,
  // and the sun-flecks that get through it
  const makeCanopy = React.useCallback(() => {
    const link = linkRef.current
    if (!link) return
    const rect = link.getBoundingClientRect()
    const rand = mulberry32(3)
    const cx = rect.left + 400
    const cy = rect.top + 260
    const blobs: Blob[] = []
    for (let i = 0; i < 70; i++) {
      const a = rand() * Math.PI * 2
      const rr = Math.sqrt(rand())
      blobs.push({ x: cx + Math.cos(a) * rr * 620, y: cy + Math.sin(a) * rr * 380, r: 60 + rand() * 120, p: rand() * 6.28, s: 0.7 + rand() * 0.6 })
    }
    const flecks: Fleck[] = []
    for (let i = 0; i < 48; i++) {
      const a = rand() * Math.PI * 2
      const rr = Math.sqrt(rand())
      flecks.push({ x: cx + Math.cos(a) * rr * 560, y: cy + Math.sin(a) * rr * 340, r: 18 + rand() * 48, p: rand() * 6.28 })
    }
    state.current.blobs = blobs
    state.current.flecks = flecks
  }, [])

  const resize = React.useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const d = window.devicePixelRatio || 1
    c.width = window.innerWidth * d
    c.height = window.innerHeight * d
    state.current.blobs = []
    state.current.flecks = []
  }, [])

  const run = React.useCallback(() => {
    const st = state.current
    if (st.raf) return
    const loop = (ts: number) => {
      const c = canvasRef.current
      const ctx = c?.getContext(`2d`)
      if (!c || !ctx) {
        st.raf = 0
        return
      }
      const d = window.devicePixelRatio || 1
      const t = ts / 1000
      st.alpha += (st.target - st.alpha) * (st.target ? (st.reduce ? 1 : 0.012) : 0.03)
      ctx.setTransform(d, 0, 0, d, 0, 0)
      ctx.clearRect(0, 0, c.width / d, c.height / d)
      if (st.alpha > 0.002) {
        ctx.globalCompositeOperation = `source-over`
        for (const b of st.blobs) {
          const x = b.x + 7 * Math.sin(t * 0.25 * b.s + b.p)
          const y = b.y + 4 * Math.sin(t * 0.31 * b.s + b.p * 1.3)
          const g = ctx.createRadialGradient(x, y, 0, x, y, b.r)
          g.addColorStop(0, `rgba(28,27,24,${(0.13 * st.alpha).toFixed(3)})`)
          g.addColorStop(0.7, `rgba(28,27,24,${(0.07 * st.alpha).toFixed(3)})`)
          g.addColorStop(1, `rgba(28,27,24,0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(x, y, b.r, 0, 6.2832)
          ctx.fill()
        }
        // light through the leaves: erase soft spots that drift a little
        ctx.globalCompositeOperation = `destination-out`
        for (const f of st.flecks) {
          const x = f.x + 9 * Math.sin(t * 0.22 + f.p)
          const y = f.y + 5 * Math.sin(t * 0.29 + f.p * 1.7)
          const g = ctx.createRadialGradient(x, y, 0, x, y, f.r)
          g.addColorStop(0, `rgba(0,0,0,0.85)`)
          g.addColorStop(1, `rgba(0,0,0,0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(x, y, f.r, 0, 6.2832)
          ctx.fill()
        }
        ctx.globalCompositeOperation = `source-over`
      }
      if (st.target === 0 && st.alpha < 0.002) {
        st.alpha = 0
        ctx.clearRect(0, 0, c.width / d, c.height / d)
        st.raf = 0
        return
      }
      st.raf = requestAnimationFrame(loop)
    }
    st.raf = requestAnimationFrame(loop)
  }, [])

  React.useEffect(() => {
    state.current.reduce = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
    resize()
    window.addEventListener(`resize`, resize)
    return () => {
      window.removeEventListener(`resize`, resize)
      cancelAnimationFrame(state.current.raf)
    }
  }, [resize])

  const enter = () => {
    if (!state.current.blobs.length) makeCanopy()
    state.current.target = 1
    run()
  }
  const leave = () => {
    state.current.target = 0
    run()
  }

  return (
    <React.Fragment>
      <Link
        ref={linkRef}
        to="/"
        aria-label="more useless - home"
        onMouseEnter={enter}
        onMouseLeave={leave}
        sx={{
          display: `inline-flex`,
          color: `text`,
          transition: `color 0.15s ease`,
          "&:hover": { color: `secondary` },
        }}
      >
        <TreeIcon />
      </Link>
      <canvas
        ref={canvasRef}
        aria-hidden
        sx={{
          position: `fixed`,
          top: 0,
          left: 0,
          width: `100vw`,
          height: `100vh`,
          pointerEvents: `none`,
          mixBlendMode: `multiply`,
          zIndex: 20,
        }}
      />
    </React.Fragment>
  )
}

export default UselessMark
