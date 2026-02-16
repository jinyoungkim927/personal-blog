import * as React from "react"
import { useState } from "react"

// TODO: Replace with your Buttondown username after signing up at buttondown.email
const BUTTONDOWN_USERNAME = "moreuseless"

const SubscribeButton: React.FC = () => {
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

    try {
      // Submit to Buttondown's public embed endpoint (no API key needed)
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
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: "transparent",
          border: "none",
          color: "#8b6f47",
          fontSize: "14px",
          cursor: "pointer",
          padding: "8px 0",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          marginTop: "24px",
          display: "block",
          textAlign: "left",
        }}
      >
        subscribe
      </button>
    )
  }

  if (isSubmitted) {
    return (
      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          background: "rgba(139, 111, 71, 0.08)",
          borderRadius: "8px",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#3d2817",
          textAlign: "left",
        }}
      >
        <p style={{ margin: 0 }}>
          Hi! Please email jinyoungkim927 at gmail dot com for thoughts and suggestions, especially if they're useless{" "}
          <img 
            src="/favicon.svg" 
            alt="🌳" 
            style={{ 
              width: "18px", 
              height: "18px", 
              display: "inline",
              verticalAlign: "text-bottom",
              marginLeft: "2px",
            }} 
          />
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "20px",
        background: "rgba(139, 111, 71, 0.05)",
        borderRadius: "8px",
        textAlign: "left",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          textAlign: "left",
        }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          style={{
            padding: "10px 12px",
            border: "1px solid #e8e0d5",
            borderRadius: "6px",
            fontSize: "14px",
            background: "#faf8f3",
            color: "#3d2817",
            textAlign: "left",
          }}
        />
        
        {error && (
          <p style={{ color: "#b91c1c", fontSize: "13px", margin: 0 }}>{error}</p>
        )}
        
        <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "10px 20px",
              background: "#8b6f47",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: isSubmitting ? "wait" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "..." : "subscribe"}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              padding: "10px 16px",
              background: "transparent",
              color: "#8b7a6f",
              border: "1px solid #e8e0d5",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SubscribeButton
