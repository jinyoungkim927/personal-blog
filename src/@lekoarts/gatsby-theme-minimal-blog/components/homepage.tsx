import * as React from "react"
import { HeadFC, graphql, useStaticQuery } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Listing from "@lekoarts/gatsby-theme-minimal-blog/src/components/listing"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

// Homepage fetches ALL posts (not limited to 3)
const Homepage = () => {
  const data = useStaticQuery(graphql`
    query {
      allPost(sort: { date: DESC }) {
        nodes {
          slug
          title
          date(formatString: "MMMM D, YYYY")
          excerpt
          timeToRead
          description
          tags {
            name
            slug
          }
        }
      }
    }
  `)

  return (
    <Layout>
      <div style={{ marginTop: "32px" }}>
        <Listing posts={data.allPost.nodes} />
      </div>
    </Layout>
  )
}

export default Homepage

export const Head: HeadFC = () => <Seo />
