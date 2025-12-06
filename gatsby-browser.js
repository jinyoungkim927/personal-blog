import "./src/styles/custom.css"

// Add click handler for footer disclaimer link
export const onClientEntry = () => {
  if (typeof window !== "undefined") {
    const observer = new MutationObserver(() => {
      const footer = document.querySelector("footer")
      if (footer && !footer.dataset.customized) {
        footer.dataset.customized = "true"
        footer.addEventListener("click", () => {
          window.location.href = "/disclaimer/"
        })
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }
}

