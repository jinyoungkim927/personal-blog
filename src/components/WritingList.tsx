/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"

export type WritingItem = {
  title: string
  date: string
  slug?: string
  href?: string
}

const rowStyle = {
  display: `flex`,
  justifyContent: `space-between`,
  alignItems: `baseline`,
  gap: `24px`,
  py: `10px`,
  borderTop: `1px solid`,
  borderColor: `divide`,
  color: `text`,
  textDecoration: `none`,
  "&:hover span:first-of-type": { textDecorationColor: `text` },
}

const Row: React.FC<{ item: WritingItem }> = ({ item }) => {
  const inner = (
    <React.Fragment>
      <span
        sx={{
          fontSize: [`19px`, `21px`],
          textDecoration: `underline`,
          textDecorationColor: `transparent`,
          textDecorationThickness: `1px`,
          textUnderlineOffset: `0.16em`,
          transition: `text-decoration-color 0.15s ease`,
        }}
      >
        {item.title}
      </span>
      <span
        sx={{
          fontSize: [`15px`, `17px`],
          color: `secondary`,
          whiteSpace: `nowrap`,
          fontVariantNumeric: `oldstyle-nums tabular-nums`,
        }}
      >
        {item.date}
      </span>
    </React.Fragment>
  )
  return item.href ? (
    <a href={item.href} sx={rowStyle}>
      {inner}
    </a>
  ) : (
    <Link to={item.slug || `/`} sx={rowStyle}>
      {inner}
    </Link>
  )
}

const WritingList: React.FC<{ items: WritingItem[] }> = ({ items }) => (
  <div sx={{ display: `flex`, flexDirection: `column`, borderBottom: `1px solid`, borderColor: `divide` }}>
    {items.map((item) => (
      <Row key={item.href || item.slug} item={item} />
    ))}
  </div>
)

export default WritingList
