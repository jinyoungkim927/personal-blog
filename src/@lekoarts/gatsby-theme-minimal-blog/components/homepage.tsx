/** @jsx jsx */
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Listing from "@lekoarts/gatsby-theme-minimal-blog/src/components/listing"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import { HeadFC, graphql, useStaticQuery } from "gatsby"

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
      <Listing posts={data.allPost.nodes} sx={{ mt: [4, 5] }} />
    </Layout>
  )
}

export default Homepage

export const Head: HeadFC = () => <Seo />
