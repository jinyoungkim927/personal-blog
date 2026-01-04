/** @jsx jsx */
import * as React from "react"
import { jsx } from "theme-ui"
import { useState, useCallback, useRef, useEffect } from "react"

// 40+ WILD animation effects - go crazy!
const ANIMATION_EFFECTS = [
  // Motion effects
  { name: "wave", className: "anim-wave" },
  { name: "bounce", className: "anim-bounce" },
  { name: "spin", className: "anim-spin" },
  { name: "jello", className: "anim-jello" },
  { name: "rubber", className: "anim-rubber" },
  { name: "flip", className: "anim-flip" },
  { name: "shake", className: "anim-shake" },
  { name: "pulse", className: "anim-pulse" },
  { name: "explode", className: "anim-explode" },
  { name: "squish", className: "anim-squish" },
  { name: "tornado", className: "anim-tornado" },
  { name: "float", className: "anim-float" },
  
  // Color effects
  { name: "rainbow", className: "anim-rainbow" },
  { name: "neon", className: "anim-neon" },
  { name: "disco", className: "anim-disco" },
  { name: "fire", className: "anim-fire" },
  { name: "ice", className: "anim-ice" },
  { name: "galaxy", className: "anim-galaxy" },
  { name: "sunset", className: "anim-sunset" },
  { name: "candy", className: "anim-candy" },
  { name: "matrix", className: "anim-matrix" },
  { name: "holographic", className: "anim-holographic" },
  
  // Pattern effects
  { name: "zebra", className: "anim-zebra" },
  { name: "leopard", className: "anim-leopard" },
  { name: "tiger", className: "anim-tiger" },
  { name: "cow", className: "anim-cow" },
  { name: "glitter", className: "anim-glitter" },
  { name: "sparkle", className: "anim-sparkle" },
  
  // Texture effects
  { name: "furry", className: "anim-furry" },
  { name: "slime", className: "anim-slime" },
  { name: "chrome", className: "anim-chrome" },
  { name: "lava", className: "anim-lava" },
  { name: "underwater", className: "anim-underwater" },
  { name: "electric", className: "anim-electric" },
  
  // Style effects
  { name: "glitch", className: "anim-glitch" },
  { name: "retro", className: "anim-retro" },
  { name: "comic", className: "anim-comic" },
  { name: "graffiti", className: "anim-graffiti" },
  { name: "psychedelic", className: "anim-psychedelic" },
  { name: "vaporwave", className: "anim-vaporwave" },
  
  // Special effects
  { name: "scramble", className: "anim-scramble" },
  { name: "drip", className: "anim-drip" },
  { name: "balloon", className: "anim-balloon" },
  { name: "confetti", className: "anim-confetti" },
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
