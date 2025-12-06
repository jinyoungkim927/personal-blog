import * as React from "react"

interface FigureProps {
  src: string
  alt: string
  caption?: string
}

const Figure: React.FC<FigureProps> = ({ src, alt, caption }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <>
      <figure
        style={{
          margin: "2rem 0",
          padding: 0,
          cursor: "pointer",
        }}
        onClick={() => setIsExpanded(true)}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {caption && (
          <figcaption
            style={{
              marginTop: "8px",
              fontSize: "14px",
              color: "#7a6b5a",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox overlay */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: "85vw",
                maxHeight: "75vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
          {caption && (
            <p
              style={{
                marginTop: "16px",
                fontSize: "16px",
                color: "#e8e0d5",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {caption}
            </p>
          )}
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}

export default Figure

