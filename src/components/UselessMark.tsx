/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"

// Zhuangzi's tree: gnarled enough that no carpenter would want it, which is
// why it gets to grow old. Hover it and its shade settles over the page; move
// past it and it bends in the wind you make, then settles.

const TRUNK: [string, number] = [`M 104 320 C 70 270 140 240 96 190 C 60 150 132 120 98 84 C 72 58 112 40 100 14`, 13]
// each branch with the point it grows from, so it can sway about its own base
const BRANCHES: { d: string; w: number; x: number; y: number }[] = [
  { d: `M 96 190 C 70 176 40 186 22 172`, w: 9, x: 96, y: 190 },
  { d: `M 110 176 C 140 166 150 138 182 132`, w: 9, x: 110, y: 176 },
  { d: `M 98 84 C 74 78 60 56 38 52`, w: 8, x: 98, y: 84 },
  { d: `M 106 96 C 136 92 152 70 176 74`, w: 8, x: 106, y: 96 },
  { d: `M 101 40 C 118 30 128 14 148 10`, w: 7, x: 101, y: 40 },
  { d: `M 22 172 C 16 160 8 158 4 148`, w: 6, x: 22, y: 172 },
]

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
  const rootRef = React.useRef<SVGGElement>(null)
  const branchRefs = React.useRef<(SVGGElement | null)[]>([])
  const breeze = React.useRef({ raf: 0, a: 0, v: 0, b: 0, bv: 0, gust: 0, lastX: 0, lastT: 0 })

  // the cursor is a wind: its horizontal speed, weighted by how close it
  // passes, pushes the trunk; two damped springs bring trunk and branches back
  React.useEffect(() => {
    if (window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) return
    const tick = () => {
      const st = breeze.current
      st.gust *= 0.85
      const target = Math.max(-14, Math.min(14, st.gust))
      st.v += -0.045 * (st.a - target) - 0.12 * st.v
      st.a += st.v
      st.bv += -0.06 * (st.b - st.a * 1.6) - 0.16 * st.bv
      st.b += st.bv
      const still = Math.abs(st.gust) < 0.01 && Math.abs(st.a) < 0.01 && Math.abs(st.v) < 0.005 && Math.abs(st.b - st.a) < 0.01 && Math.abs(st.bv) < 0.005
      if (still) {
        st.a = st.v = st.b = st.bv = st.gust = 0
        rootRef.current?.removeAttribute(`transform`)
        branchRefs.current.forEach((g) => g?.removeAttribute(`transform`))
        st.raf = 0
        return
      }
      rootRef.current?.setAttribute(`transform`, `rotate(${st.a.toFixed(2)} 104 320)`)
      branchRefs.current.forEach((g, i) => {
        const b = BRANCHES[i]
        g?.setAttribute(`transform`, `rotate(${((st.b - st.a) * (0.5 + (i % 3) * 0.25)).toFixed(2)} ${b.x} ${b.y})`)
      })
      st.raf = requestAnimationFrame(tick)
    }
    const onMove = (e: MouseEvent) => {
      const st = breeze.current
      const now = performance.now()
      const link = linkRef.current
      if (st.lastT && link) {
        const dt = Math.max(1, now - st.lastT)
        const vx = Math.max(-3, Math.min(3, (e.clientX - st.lastX) / dt))
        const r = link.getBoundingClientRect()
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - r.bottom)
        st.gust += vx * 14 * Math.max(0, 1 - d / 900)
      }
      st.lastX = e.clientX
      st.lastT = now
      if (!st.raf) st.raf = requestAnimationFrame(tick)
    }
    window.addEventListener(`mousemove`, onMove, { passive: true })
    return () => {
      window.removeEventListener(`mousemove`, onMove)
      cancelAnimationFrame(breeze.current.raf)
    }
  }, [])
  const state = React.useRef({ alpha: 0, target: 0, raf: 0, blobs: [] as Blob[], flecks: [] as Fleck[], reduce: false, night: false })

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
      if (st.alpha > 0.002 && st.night) {
        // at night the same canopy lets moonlight through instead of casting shade
        ctx.globalCompositeOperation = `source-over`
        for (const f of st.flecks) {
          const x = f.x + 9 * Math.sin(t * 0.22 + f.p)
          const y = f.y + 5 * Math.sin(t * 0.29 + f.p * 1.7)
          const r = f.r * 1.5
          const g = ctx.createRadialGradient(x, y, 0, x, y, r)
          g.addColorStop(0, `rgba(230,224,210,${(0.16 * st.alpha).toFixed(3)})`)
          g.addColorStop(1, `rgba(230,224,210,0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(x, y, r, 0, 6.2832)
          ctx.fill()
        }
      } else if (st.alpha > 0.002) {
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
    const night = window.matchMedia(`(prefers-color-scheme: dark)`).matches
    state.current.night = night
    if (canvasRef.current) canvasRef.current.style.mixBlendMode = night ? `screen` : `multiply`
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
        <svg
          viewBox="0 0 200 320"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          sx={{ width: `18px`, height: `29px`, display: `block`, overflow: `visible` }}
        >
          <g ref={rootRef} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d={TRUNK[0]} strokeWidth={TRUNK[1]} />
            {BRANCHES.map((b, i) => (
              <g
                key={b.d}
                ref={(el) => {
                  branchRefs.current[i] = el
                }}
              >
                <path d={b.d} strokeWidth={b.w} />
              </g>
            ))}
          </g>
        </svg>
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
