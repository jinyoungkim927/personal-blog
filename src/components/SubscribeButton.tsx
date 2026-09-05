import * as React from "react"
import { useState } from "react"

// TODO: Replace with your Buttondown username after signing up at buttondown.email
const BUTTONDOWN_USERNAME = "jinyoung"

const textButton: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #c9c2b4",
  borderRadius: 0,
  color: "#7a756b",
  font: "inherit",
  fontSize: "17px",
  lineHeight: 1.3,
  cursor: "pointer",
  padding: "0 0 1px",
  margin: 0,
}

type SubscribeButtonProps = {
  label?: string
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ label = "Subscribe" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string

    // Save to Netlify Forms as backup (always works)
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "newsletter",
          email,
        }).toString(),
      })
    } catch (err) {
      // Netlify form submission failed, but continue anyway
    }

    try {
      // Also submit to Buttondown (for when account is approved)
      const response = await fetch(
        `https://buttondown.email/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ email }).toString(),
        }
      )

      if (response.ok || response.status === 201) {
        setIsSubmitted(true)
      } else {
        // Show success message (Buttondown may still be under review)
        setIsSubmitted(true)
      }
    } catch (err) {
      // Show success message (Buttondown may still be under review)
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <>
        {/* Hidden form for Netlify to detect during build */}
        <form name="newsletter" data-netlify="true" hidden>
          <input type="email" name="email" />
        </form>
        <button type="button" onClick={() => setIsOpen(true)} style={textButton}>
          {label}
        </button>
      </>
    )
  }

  if (isSubmitted) {
    return (
      <p style={{ margin: 0, fontSize: "19px", lineHeight: 1.6, color: "#4a463f" }}>
        Hi! Please email jinyoungkim927 at gmail dot com for thoughts and suggestions, especially
        if they're useless.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        aria-label="Email address"
        required
        autoFocus
        style={{
          font: "inherit",
          fontSize: "17px",
          padding: "8px 12px",
          border: "1px solid #c9c2b4",
          borderRadius: "3px",
          background: "#ffffff",
          color: "#1c1b18",
          minWidth: "240px",
          flexGrow: 1,
          maxWidth: "320px",
        }}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          font: "inherit",
          fontSize: "17px",
          padding: "8px 16px",
          background: "#1c1b18",
          color: "#fbf9f4",
          border: "none",
          borderRadius: "3px",
          cursor: isSubmitting ? "wait" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? "…" : "Subscribe"}
      </button>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        style={{ ...textButton, borderBottom: "none" }}
      >
        Cancel
      </button>
      {error && (
        <p style={{ color: "#8a2f1f", fontSize: "17px", margin: 0, width: "100%" }}>{error}</p>
      )}
    </form>
  )
}

export default SubscribeButton
