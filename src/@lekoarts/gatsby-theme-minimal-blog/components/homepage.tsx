/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { HeadFC, graphql, useStaticQuery } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import SubscribeButton from "../../../components/SubscribeButton"
import WritingList, { WritingItem } from "../../../components/WritingList"
import AnimatedUseless from "../../../components/AnimatedUseless"

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

const projects: WritingItem[] = [
  {
    href: `https://arxiv.org/abs/2607.28918`,
    title: `An astrophysics paper applying sequential hypothesis testing techniques to measure how fast our universe is accelerating`,
    date: `July 2026`,
  },
  {
    href: `mailto:jinyoungkim927@gmail.com?subject=Paper%20reading%20group`,
    title: `NY paper reading group. Come read with some of my talented, intellectually vibrant friends.`,
    date: `June 2026 onwards`,
  },
]

// writing that lives elsewhere, slotted into the list by date
const elsewhere: (WritingItem & { sort: string })[] = [
  {
    href: `https://arxiv.org/abs/2410.06234`,
    title: `TEOChat: A Large Vision-Language Assistant for Temporal Earth Observation Data`,
    date: `October 2024`,
    sort: `2024-10`,
  },
  {
    href: `https://publishing.hardiegrant.com/en-us/books/the-anti-racism-kit-by-jinyoung-kim/9781761211171`,
    title: `The Anti-Racism Kit`,
    date: `July 2024`,
    sort: `2024-07`,
  },
]

const Homepage = () => {
  const data = useStaticQuery(graphql`
    query {
      allPost(sort: { date: DESC }) {
        nodes {
          slug
          title
          date(formatString: "MMMM YYYY")
          sort: date(formatString: "YYYY-MM")
        }
      }
    }
  `)

  const posts: WritingItem[] = [...data.allPost.nodes, ...elsewhere]
    .sort((a: { sort: string }, b: { sort: string }) => b.sort.localeCompare(a.sort))
    .map(({ sort, ...item }: WritingItem & { sort: string }) => item)

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
            outline: `1px solid rgba(28, 27, 24, 0.08)`,
            outlineOffset: `-1px`,
            display: `block`,
          }}
        />
        <p sx={{ mt: `32px`, mb: 0 }}>Hi! I'm Jin Kim, a quantitative researcher at Two Sigma.</p>
        <p sx={{ mt: `18px`, mb: 0 }}>Previously, I:</p>
        <ul sx={{ mt: `10px`, mb: 0 }}>
          <li>
            studied maths at Stanford, advised by Professor{` `}
            <a href="https://candes.su.domains/">Emmanuel Candès</a>
          </li>
          <li>
            was personally hired by Eric Schmidt to do ML research at{` `}
            <a href="https://www.forbes.com/sites/sarahemerson/2024/01/23/eric-schmidts-secret-white-stork-project-aims-to-build-ai-combat-drones/">
              his stealth drone startup
            </a>
          </li>
          <li>
            researched AI at the <a href="https://cs.stanford.edu/~ermon/website/">Ermon group</a>
            {` `}and <a href="https://stanfordmlgroup.github.io">Stanford ML group</a> under Andrew Ng
          </li>
          <li>interned on D.E. Shaw's energy trading desk</li>
          <li>
            wrote{` `}
            <a href="https://creative.gov.au/news-events/news/announcing-shortlists-2025-prime-ministers-literary-awards">
              a nationally award winning book on anti-racism
            </a>
          </li>
        </ul>
        <p sx={{ mt: `18px`, mb: 0 }}>
          I believe we are{` `}
          <a href="https://ctext.org/zhuangzi/man-in-the-world-associated-with/ens#n2746">
            amidst a time when what is useless is becoming useful and what is useful is becoming
            useless
          </a>
          .{` `}
          <em>
            To pursuing the <AnimatedUseless text="useless" inline />.
          </em>
        </p>
      </section>

      <section sx={{ mt: `64px` }}>
        <Label>Recent projects</Label>
        <WritingList items={projects} />
      </section>

      <section sx={{ mt: `48px` }}>
        <Label>Writing</Label>
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
