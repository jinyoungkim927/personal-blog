/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"

export type WritingItem = {
  slug: string
  title: string
  date: string
}

const WritingList: React.FC<{ items: WritingItem[] }> = ({ items }) => (
  <div sx={{ display: `flex`, flexDirection: `column`, borderBottom: `1px solid`, borderColor: `divide` }}>
    {items.map((item) => (
      <Link
        key={item.slug}
        to={item.slug}
        sx={{
          display: `flex`,
          justifyContent: `space-between`,
          alignItems: `baseline`,
          gap: `24px`,
          py: `10px`,
          borderTop: `1px solid`,
          borderColor: `divide`,
          color: `text`,
          textDecoration: `none`,
          "&:hover span:first-of-type": { borderBottomColor: `text` },
        }}
      >
        <span
          sx={{
            fontSize: [`19px`, `21px`],
            borderBottom: `1px solid transparent`,
            transition: `border-color 0.15s ease`,
          }}
        >
          {item.title}
        </span>
        <span
          sx={{
            fontSize: [`15px`, `17px`],
            color: `secondary`,
            whiteSpace: `nowrap`,
            fontVariantNumeric: `tabular-nums`,
          }}
        >
          {item.date}
        </span>
      </Link>
    ))}
  </div>
)

export default WritingList
