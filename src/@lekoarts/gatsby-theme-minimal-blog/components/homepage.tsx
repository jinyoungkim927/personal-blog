/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { HeadFC, graphql, useStaticQuery } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import SubscribeButton from "../../../components/SubscribeButton"
import WritingList, { WritingItem } from "../../../components/WritingList"
import AnimatedUseless from "../../../components/AnimatedUseless"

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
    }
  `)

  const posts: WritingItem[] = data.allPost.nodes

  return (
    <Layout>
      <section className="prose" sx={{ mt: [`48px`, `80px`] }}>
        <img
          src="/jin.jpg"
          alt="Jin Kim"
          width={148}
          height={148}
          sx={{
            width: `148px`,
            height: `148px`,
            objectFit: `cover`,
            borderRadius: `3px`,
            display: `block`,
          }}
        />
        <p sx={{ mt: `32px`, mb: 0 }}>
          Hi! I'm <a href="https://www.linkedin.com/in/jinkim2/">Jin</a>, a quantitative
          researcher at Two Sigma.
        </p>
        <p sx={{ mt: `18px`, mb: 0 }}>Previously, I:</p>
        <ul sx={{ mt: `10px`, mb: 0 }}>
          <li>studied maths at Stanford</li>
          <li>
            wrote{` `}
            <a href="https://creative.gov.au/news-events/news/announcing-shortlists-2025-prime-ministers-literary-awards">
              a nationally award winning book on anti-racism
            </a>
          </li>
          <li>
            was personally hired by Eric Schmidt to work at{` `}
            <a href="https://www.forbes.com/sites/sarahemerson/2024/01/23/eric-schmidts-secret-white-stork-project-aims-to-build-ai-combat-drones/">
              his stealth drone startup
            </a>
          </li>
          <li>interned on D.E. Shaw's energy trading desk</li>
          <li>
            did AI research at the <a href="https://cs.stanford.edu/~ermon/website/">Ermon group</a>
            {` `}and <a href="https://stanfordmlgroup.github.io">Stanford ML group</a> under Andrew Ng
          </li>
        </ul>
        <p sx={{ mt: `18px`, mb: 0 }}>
          I believe we are{` `}
          <a href="https://ctext.org/zhuangzi/man-in-the-world-associated-with/ens#n2746">
            amidst a time when what is useless becomes useful
          </a>
          {` `}and what is useful is becoming useless. I am pursuing the{` `}
          <AnimatedUseless text="useless" inline />.
        </p>
        <p sx={{ mt: `18px`, mb: 0 }}>Outside of work, I have recently:</p>
        <ul sx={{ mt: `10px`, mb: 0 }}>
          <li>
            July 2026: published <a href="https://arxiv.org/abs/2607.28918">an astrophysics paper</a>
            {` `}applying sequential hypothesis testing techniques to measure how fast our universe
            is accelerating
          </li>
          <li>
            June 2026 onwards: been leading a paper reading group of extremely talented, intellectually
            vibrant people.{` `}
            <a href="mailto:jinyoungkim927@gmail.com?subject=Paper%20reading%20group">
              Come read with us.
            </a>
          </li>
        </ul>
      </section>

      <section sx={{ mt: `64px` }}>
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
          Writing
        </h2>
        <WritingList items={posts} />
      </section>

      <section id="subscribe" sx={{ mt: `56px` }}>
        <SubscribeButton label="Get new essays by email" />
      </section>
    </Layout>
  )
}

export default Homepage

export const Head: HeadFC = () => <Seo />
