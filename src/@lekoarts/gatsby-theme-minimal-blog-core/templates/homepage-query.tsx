import { graphql } from "gatsby"
import HomepageComponent from "../../gatsby-theme-minimal-blog/components/homepage"
import { Head } from "@lekoarts/gatsby-theme-minimal-blog/src/components/homepage"

export default HomepageComponent

export { Head }

// Removed limit: 3 to show ALL posts on homepage
export const query = graphql`
  query ($formatString: String!) {
    allPost(sort: { date: DESC }) {
      nodes {
        slug
        title
        date(formatString: $formatString)
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
`

