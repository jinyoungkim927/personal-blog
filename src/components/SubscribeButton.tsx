import * as React from "react"
import { useState } from "react"

const SubscribeButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error("Form submission error:", error)
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
        }}
      >
        <p style={{ margin: 0 }}>
          Hi! Thanks for subscribing. My turn: my email is jinyoungkim927 at gmail dot com. Send me thoughts and suggestions.
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
      }}
    >
      <form
        name="subscribe"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <input type="hidden" name="form-name" value="subscribe" />
        <p style={{ display: "none" }}>
          <label>
            Don't fill this out if you're human: <input name="bot-field" />
          </label>
        </p>
        
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            required
            style={{
              flex: "1 1 120px",
              padding: "10px 12px",
              border: "1px solid #e8e0d5",
              borderRadius: "6px",
              fontSize: "14px",
              background: "#faf8f3",
              color: "#3d2817",
            }}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            required
            style={{
              flex: "1 1 120px",
              padding: "10px 12px",
              border: "1px solid #e8e0d5",
              borderRadius: "6px",
              fontSize: "14px",
              background: "#faf8f3",
              color: "#3d2817",
            }}
          />
        </div>
        
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
          }}
        />
        
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

