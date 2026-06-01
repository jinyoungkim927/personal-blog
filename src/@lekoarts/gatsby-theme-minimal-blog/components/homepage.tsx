/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Global } from "@emotion/react"
import { HeadFC, Link, graphql, useStaticQuery } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import AnimatedUseless from "../../../components/AnimatedUseless"

type Tag = { name: string; slug: string }
type Post = {
  slug: string
  title: string
  date: string
  excerpt?: string
  description?: string
  timeToRead?: number
  tags?: Tag[]
}

const Homepage = () => {
  const data = useStaticQuery(graphql`
    query {
      allPost(sort: { date: DESC }) {
        nodes {
          slug
          title
          date(formatString: "MMMM YYYY")
          excerpt
          description
          timeToRead
          tags {
            name
            slug
          }
        }
      }
    }
  `)

  const posts: Post[] = data.allPost.nodes

  return (
    <Layout>
      {/* painterly hero bg - only mounted on homepage */}
      <Global
        styles={{
          body: {
            // gradient: solid black at very top/bottom for seamless overscroll,
            // painterly visible in middle hero zone, fades back to black below.
            background: `
              linear-gradient(to bottom,
                rgba(0,0,0,1)    0%,
                rgba(0,0,0,1)    3%,
                rgba(0,0,0,0)    10%,
                rgba(0,0,0,0)    25%,
                rgba(0,0,0,0.55) 45%,
                rgba(0,0,0,0.92) 62%,
                rgba(0,0,0,1)    78%) fixed,
              #000 url('/hero-bg.jpg') center top / cover no-repeat fixed
            `,
          },
        }}
      />
      {/* HERO - masthead + sumi ink tree */}
      <section
        sx={{
          position: `relative`,
          mt: [2, 3],
          mb: [4, 5],
          minHeight: [`240px`, `320px`],
        }}
      >
        {/* sumi-ink tree, top-right, sits below the header */}
        <svg
          viewBox="0 0 200 320"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          sx={{
            position: `absolute`,
            top: 0,
            right: 0,
            width: [`120px`, `180px`, `200px`],
            height: `auto`,
            pointerEvents: `none`,
            opacity: 0.95,
            zIndex: 1,
          }}
        >
          <g fill="none" stroke="#f4f0e8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 100 320 C 96 280 104 240 100 200 C 96 160 102 120 98 80 C 96 50 102 30 100 16" strokeWidth="3.4" opacity="0.7" />
            <path d="M 98 130 C 88 116 72 108 56 102 C 44 98 32 96 22 95" strokeWidth="2.2" opacity="0.62" />
            <path d="M 100 100 C 112 86 130 78 148 72 C 162 68 174 66 184 64" strokeWidth="2.2" opacity="0.62" />
            <path d="M 99 70 C 90 58 76 50 60 44" strokeWidth="1.8" opacity="0.55" />
            <path d="M 100 50 C 112 40 128 32 144 28" strokeWidth="1.8" opacity="0.55" />
            <path d="M 99 200 C 88 192 76 188 64 188" strokeWidth="1.6" opacity="0.5" />
            <path d="M 56 102 C 48 96 38 92 30 90" strokeWidth="1.0" opacity="0.5" />
            <path d="M 148 72 C 156 66 164 62 172 60" strokeWidth="1.0" opacity="0.5" />
            <path d="M 60 44 C 54 38 48 34 42 32" strokeWidth="0.9" opacity="0.45" />
            <path d="M 144 28 C 152 22 158 18 164 16" strokeWidth="0.9" opacity="0.45" />
            <path d="M 22 95 L 14 92" strokeWidth="0.8" opacity="0.4" />
            <path d="M 184 64 L 192 60" strokeWidth="0.8" opacity="0.4" />
          </g>
          <g fill="#d4a24e" opacity="0.85">
            <circle cx="22" cy="95" r="2.4" />
            <circle cx="184" cy="64" r="2.0" />
            <circle cx="42" cy="32" r="1.6" />
            <circle cx="164" cy="16" r="1.6" />
            <circle cx="64" cy="188" r="1.4" />
          </g>
          <circle cx="172" cy="60" r="2.6" fill="#bf3a1c" opacity="0.95" />
        </svg>

        {/* masthead - matches demo HTML exactly */}
        <h1
          sx={{
            fontFamily: `heading`,
            fontWeight: 700,
            fontSize: [`48px`, `64px`, `72px`],
            lineHeight: 0.92,
            letterSpacing: `-0.045em`,
            color: `heading`,
            m: 0,
            whiteSpace: `nowrap`,
          }}
        >
          more{` `}
          <span
            aria-hidden
            style={{
              display: `inline-block`,
              width: `11px`,
              height: `11px`,
              background: `#d4a24e`,
              verticalAlign: `baseline`,
              margin: `0 8px 10px 8px`,
              transform: `rotate(-2deg)`,
              boxShadow: `-1px 1px 0 rgba(212,162,78,0.6), 0 0 6px rgba(212,162,78,0.5)`,
            }}
          />
          {` `}
          <AnimatedUseless text="useless" />
        </h1>
      </section>

      {/* POSTS */}
      <section
        sx={{
          borderTop: `1px solid`,
          borderColor: `divide`,
        }}
      >
        {posts.map((post) => (
          <article
            key={post.slug}
            sx={{
              display: `grid`,
              gridTemplateColumns: [`1fr`, `1fr 200px`],
              gap: [3, 4],
              alignItems: `baseline`,
              py: 3,
              borderBottom: `1px solid`,
              borderColor: `rgba(247,233,200,0.14)`,
            }}
          >
            <Link
              to={post.slug}
              sx={{
                color: `heading`,
                textDecoration: `none`,
                "&:hover h2": { color: `ember` },
              }}
            >
              <h2
                sx={{
                  fontFamily: `body`,
                  fontWeight: 500,
                  fontSize: [`20px`, `24px`],
                  lineHeight: 1.25,
                  letterSpacing: `-0.008em`,
                  color: `heading`,
                  m: 0,
                  transition: `color 0.2s`,
                }}
              >
                {post.title}
              </h2>
            </Link>
            <div sx={{ textAlign: [`left`, `right`], pt: [1, 1] }}>
              <div
                sx={{
                  fontFamily: `body`,
                  fontSize: `12px`,
                  letterSpacing: `0.04em`,
                  color: `rgba(251,238,196,0.78)`,
                }}
              >
                {post.date}
              </div>
            </div>
          </article>
        ))}
      </section>
    </Layout>
  )
}

export default Homepage

export const Head: HeadFC = () => <Seo />
