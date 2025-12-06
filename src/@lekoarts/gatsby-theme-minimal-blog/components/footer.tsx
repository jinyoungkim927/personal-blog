import { Link } from "gatsby"

const Footer = () => {
  return (
    <footer
      style={{
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        marginTop: "64px",
        paddingTop: "24px",
        paddingBottom: "24px",
        borderTop: "1px solid #e8e0d5",
      }}
    >
      <Link
        to="/disclaimer/"
        style={{
          color: "#8b7a6f",
          fontSize: "12px",
          textDecoration: "none",
        }}
      >
        Disclaimer
      </Link>
    </footer>
  )
}

export default Footer
