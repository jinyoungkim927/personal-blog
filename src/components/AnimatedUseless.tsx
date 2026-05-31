/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { useState, useCallback, useRef, useEffect } from "react"

const ANIMATION_EFFECTS = [
  { name: "mirror", className: "anim-mirror" },
]

// Shuffle array (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Random characters for scramble effect
const WACKY_CHARS = "!@#$%^&*()★☆♠♣♥♦●○◆◇■□▲△🔥💀👻🎃🌈✨💫🦄🐯🦓🐮🎪🍭🌊⚡🎨🪩"

interface AnimatedUselessProps {
  text?: string
  inline?: boolean
  as?: React.ElementType
}

const AnimatedUseless: React.FC<AnimatedUselessProps> = ({ 
  text = "Useless", 
  inline = false,
  as: Component = "span" 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [currentEffect, setCurrentEffect] = useState<typeof ANIMATION_EFFECTS[0] | null>(null)
  const [displayText, setDisplayText] = useState(text)
  const availableEffectsRef = useRef<typeof ANIMATION_EFFECTS>([])
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get next effect (sample without replacement)
  const getNextEffect = useCallback(() => {
    if (availableEffectsRef.current.length === 0) {
      availableEffectsRef.current = shuffleArray(ANIMATION_EFFECTS)
    }
    return availableEffectsRef.current.pop()!
  }, [])
  
  // Scramble text effect
  const scrambleText = useCallback((originalText: string) => {
    let iterations = 0
    const maxIterations = 12
    
    if (scrambleIntervalRef.current) {
      clearInterval(scrambleIntervalRef.current)
    }
    
    scrambleIntervalRef.current = setInterval(() => {
      setDisplayText(
        originalText
          .split("")
          .map((char, index) => {
            if (index < iterations) return originalText[index]
            if (char === " ") return " "
            return WACKY_CHARS[Math.floor(Math.random() * WACKY_CHARS.length)]
          })
          .join("")
      )
      
      iterations += 1
      if (iterations > maxIterations) {
        if (scrambleIntervalRef.current) {
          clearInterval(scrambleIntervalRef.current)
        }
        setDisplayText(originalText)
      }
    }, 60)
  }, [])
  
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    const effect = getNextEffect()
    setCurrentEffect(effect)
    
    // Special handling for scramble effect
    if (effect.name === "scramble") {
      scrambleText(text)
    }
  }, [getNextEffect, scrambleText, text])
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setCurrentEffect(null)
    setDisplayText(text)
    if (scrambleIntervalRef.current) {
      clearInterval(scrambleIntervalRef.current)
    }
  }, [text])
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (scrambleIntervalRef.current) {
        clearInterval(scrambleIntervalRef.current)
      }
    }
  }, [])
  
  const letters = displayText.split("")
  
  return (
    <Component
      className={`animated-useless ${isHovered && currentEffect ? currentEffect.className : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        display: inline ? "inline" : "inline-block",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className="animated-letter"
          style={{
            display: "inline-block",
            animationDelay: `${index * 0.05}s`,
            "--letter-index": index,
            "--total-letters": letters.length,
          } as React.CSSProperties}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </Component>
  )
}

export default AnimatedUseless
