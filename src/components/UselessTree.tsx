/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"

// Zhuangzi's tree is useless as timber, so no one cuts it down, so it grows
// enormous. Hover the mark and it does exactly that; leave and it draws back.

type Segment = { d: string; len: number; depth: number; dist: number; jitter: number }
type Tree = { segments: Segment[]; reach: number }

const MAX_DEPTH = 5
// every tip advances at this many px per second; a branch starts the moment
// its parent's tip reaches it, so the whole thing grows continuously
const GROW_SPEED = 230
const SHRINK_SPEED = 650

// deterministic, so the same tree grows every time
const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const quadLength = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
  let len = 0
  let px = x0
  let py = y0
  for (let i = 1; i <= 10; i++) {
    const t = i / 10
    const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1
    const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1
    len += Math.hypot(x - px, y - py)
    px = x
    py = y
  }
  return len
}

const growTree = (ox: number, oy: number, width: number, height: number): Tree => {
  const rand = mulberry32(20260905)
  const segments: Segment[] = []
  const margin = 60
  let reach = 0

  const limb = (x: number, y: number, angle: number, length: number, depth: number, dist: number) => {
    if (depth > MAX_DEPTH || length < 14) return
    const ex = x + Math.cos(angle) * length
    const ey = y + Math.sin(angle) * length
    const bend = (rand() - 0.5) * length * 0.55
    const mx = (x + ex) / 2 - Math.sin(angle) * bend
    const my = (y + ey) / 2 + Math.cos(angle) * bend
    const len = quadLength(x, y, mx, my, ex, ey)
    segments.push({
      d: `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      len,
      depth,
      dist,
      jitter: rand(),
    })
    reach = Math.max(reach, dist + len)
    if (ex < -margin || ex > width + margin || ey < -margin || ey > height + margin) return
    const kids = depth === 0 || rand() < 0.2 ? 3 : 2
    for (let i = 0; i < kids; i++) {
      const spread = 0.5 + rand() * 0.4
      const turn = (i - (kids - 1) / 2) * spread + (rand() - 0.5) * 0.35
      limb(ex, ey, angle + turn, length * (0.7 + rand() * 0.14), depth + 1, dist + len)
    }
  }

  const trunk = Math.hypot(width, height) * 0.21
  // primary limbs fan out from the crown of the icon into the page (y grows downward)
  const limbs = [-0.4, 0.2, 0.8, 1.35, 1.95]
  limbs.forEach((angle, i) => limb(ox, oy, angle, trunk * (0.75 + (i % 2) * 0.25), 0, 0))
  return { segments, reach }
}

const TreeIcon: React.FC = () => (
  <svg
    viewBox="0 0 200 320"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    sx={{ width: `18px`, height: `29px`, display: `block` }}
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

const UselessTree: React.FC = () => {
  const linkRef = React.useRef<HTMLAnchorElement>(null)
  const [tree, setTree] = React.useState<Tree>({ segments: [], reach: 0 })
  const { segments, reach } = tree
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  const [grown, setGrown] = React.useState(false)
  const [reduceMotion, setReduceMotion] = React.useState(false)
  const keyRef = React.useRef(``)

  React.useEffect(() => {
    setReduceMotion(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)
  }, [])

  const prepare = React.useCallback(() => {
    const el = linkRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const w = window.innerWidth
    const h = window.innerHeight
    const ox = Math.round(rect.left + rect.width / 2)
    const oy = Math.round(rect.top + 3)
    const key = `${w}x${h}@${ox},${oy}`
    if (key === keyRef.current) return
    keyRef.current = key
    setSize({ w, h })
    setTree(growTree(ox, oy, w, h))
  }, [])

  const grow = React.useCallback(() => {
    prepare()
    // let the branches mount hidden and get styled before they start drawing,
    // otherwise the first hover pops in with no transition
    window.setTimeout(() => {
      void document.body.offsetHeight
      setGrown(true)
    }, 0)
  }, [prepare])

  const shrink = React.useCallback(() => setGrown(false), [])

  // /#tree grows it without a mouse, so it can be linked to and seen on a phone
  React.useEffect(() => {
    if (window.location.hash === `#tree`) grow()
  }, [grow])

  return (
    <React.Fragment>
      <Link
        ref={linkRef}
        to="/"
        aria-label="more useless - home"
        onMouseEnter={grow}
        onMouseLeave={shrink}
        onFocus={grow}
        onBlur={shrink}
        sx={{
          display: `inline-flex`,
          color: `text`,
          transition: `color 0.15s ease`,
          "&:hover": { color: `secondary` },
        }}
      >
        <TreeIcon />
      </Link>

      {segments.length > 0 && (
        <svg
          aria-hidden
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          sx={{
            position: `fixed`,
            top: 0,
            left: 0,
            width: `100vw`,
            height: `100vh`,
            pointerEvents: `none`,
            zIndex: 30,
            color: `text`,
            overflow: `visible`,
          }}
        >
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {segments.map((s, i) => {
              const width = Math.max(0.6, 3.2 * Math.pow(0.72, s.depth))
              // Hidden: the dash sits just before the path's start, far enough that
              // its round cap can't show as a dot, and the gap is longer than the
              // path so the next dash can't creep in from the far end either.
              const hidden = s.len + width + 2
              const growDelay = s.dist / GROW_SPEED + s.jitter * 0.12
              const growDuration = Math.max(0.15, s.len / GROW_SPEED)
              const shrinkDelay = (reach - (s.dist + s.len)) / SHRINK_SPEED
              const shrinkDuration = Math.max(0.12, s.len / SHRINK_SPEED)
              return (
                <path
                  key={i}
                  d={s.d}
                  strokeWidth={width}
                  opacity={0.62 - s.depth * 0.06}
                  style={{
                    strokeDasharray: `${s.len} ${s.len + 60}`,
                    strokeDashoffset: grown ? 0 : hidden,
                    transition: reduceMotion
                      ? `none`
                      : grown
                      ? `stroke-dashoffset ${growDuration.toFixed(2)}s linear ${growDelay.toFixed(2)}s`
                      : `stroke-dashoffset ${shrinkDuration.toFixed(2)}s linear ${shrinkDelay.toFixed(2)}s`,
                  }}
                />
              )
            })}
          </g>
        </svg>
      )}

      {segments.length > 0 && (
        <p
          aria-hidden
          sx={{
            position: `fixed`,
            right: `32px`,
            bottom: `28px`,
            width: `300px`,
            m: 0,
            px: `16px`,
            py: `12px`,
            borderRadius: `3px`,
            background: `rgba(251, 249, 244, 0.94)`,
            textAlign: `right`,
            fontSize: `17px`,
            // only where the page has an empty right margin to sit in
            "@media (max-width: 1180px)": { display: `none` },
            lineHeight: 1.5,
            color: `secondary`,
            pointerEvents: `none`,
            zIndex: 31,
            opacity: grown ? 1 : 0,
            transition: reduceMotion
              ? `none`
              : grown
              ? `opacity 1.2s ease ${(reach / GROW_SPEED + 0.3).toFixed(2)}s`
              : `opacity 0.4s ease`,
          }}
        >
          Everyone knows the use of the useful, but no one knows the use of the useless.
          <br />
          Zhuangzi
        </p>
      )}
    </React.Fragment>
  )
}

export default UselessTree
