/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { HeadFC, Link, graphql, useStaticQuery } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import SubscribeButton from "../../../components/SubscribeButton"
import WritingList, { WritingItem } from "../../../components/WritingList"
import hiddenSnippets from "../../../../scripts/hidden_snippets.json"

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    sx={{
      fontSize: `13px`,
      fontWeight: 400,
      letterSpacing: `0.14em`,
      textTransform: `uppercase`,
      color: `secondary`,
      m: 0,
      mb: `10px`,
    }}
  >
    {children}
  </h2>
)

const Homepage = () => {
  const data = useStaticQuery(graphql`
    query {
      allPost(sort: { date: DESC }) {
        nodes {
          slug
          title
          date(formatString: "MMMM YYYY")
        }
      }
      allMdxSnippet(sort: { title: ASC }) {
        nodes {
          slug
          title
        }
      }
    }
  `)

  const posts: WritingItem[] = data.allPost.nodes
  const hidden = new Set<string>(hiddenSnippets.hidden || [])
  const notes: { slug: string; title: string }[] = data.allMdxSnippet.nodes.filter(
    (n: { slug: string }) => !hidden.has(n.slug.split(`/`).filter(Boolean).pop() || ``)
  )

  return (
    <Layout>
      <section className="prose" sx={{ mt: [`56px`, `96px`] }}>
        <img
          src="/jin.jpg"
          alt="Jin Kim"
          width={148}
          height={185}
          sx={{
            width: `148px`,
            height: `185px`,
            objectFit: `cover`,
            borderRadius: `3px`,
            display: `block`,
          }}
        />
        <h1
          sx={{
            fontSize: [`34px`, `40px`],
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: `-0.005em`,
            m: 0,
            mt: `36px`,
          }}
        >
          Jin Kim
        </h1>
        <p sx={{ mt: `22px`, mb: 0 }}>
          Hi! I'm <a href="https://www.linkedin.com/in/jinkim2/">Jin</a>, a quantitative
          researcher at Two Sigma.
        </p>
        <p sx={{ mt: `18px`, mb: 0 }}>
          Previously, I studied maths at Stanford, wrote{` `}
          <a href="https://creative.gov.au/news-events/news/announcing-shortlists-2025-prime-ministers-literary-awards">
            a nationally award winning book on anti-racism
          </a>
          , was personally hired by Eric Schmidt after winning a hackathon to work at{` `}
          <a href="https://www.forbes.com/sites/sarahemerson/2024/01/23/eric-schmidts-secret-white-stork-project-aims-to-build-ai-combat-drones/">
            his stealth drone startup
          </a>
          , interned on D.E. Shaw's energy trading desk, and did AI research at the{` `}
          <a href="https://cs.stanford.edu/~ermon/website/">Ermon group</a> and{` `}
          <a href="https://stanfordmlgroup.github.io">Stanford ML group</a> under Andrew Ng.
        </p>
        <p sx={{ mt: `18px`, mb: 0 }}>
          I love learning and hacking on (useless) things, especially when it is{` `}
          <Link to="/orthogonality/">orthogonal</Link> to what I know.
        </p>
        <p sx={{ mt: `18px`, mb: 0 }}>Outside of work, I have recently:</p>
        <ul sx={{ mt: `10px`, mb: 0 }}>
          <li>
            7/26: published an astrophysics paper applying sequential hypothesis testing
            techniques to measure how fast our universe is accelerating,{` `}
            <a href="https://arxiv.org/abs/2607.28918">arxiv.org/abs/2607.28918</a>
          </li>
          <li>
            6/26 onwards: been leading a paper reading group of some extremely talented and
            intellectually vibrant people
          </li>
        </ul>
      </section>

      <section sx={{ mt: `64px` }}>
        <Label>Writing</Label>
        <WritingList items={posts} />
      </section>

      {notes.length > 0 && (
        <section className="prose" sx={{ mt: `48px` }}>
          <Label>Notes</Label>
          <p sx={{ fontSize: [`17px`, `19px`], lineHeight: 1.6, color: `#4a463f`, m: 0 }}>
            Short explanations I wrote for myself:{` `}
            {notes.map((note, i) => (
              <React.Fragment key={note.slug}>
                <Link to={note.slug}>{note.title}</Link>
                {i < notes.length - 1 ? `, ` : `.`}
              </React.Fragment>
            ))}
          </p>
        </section>
      )}

      <section id="subscribe" sx={{ mt: `56px` }}>
        <SubscribeButton label="Get new essays by email" />
      </section>
    </Layout>
  )
}

export default Homepage

export const Head: HeadFC = () => <Seo />
