"use client"

import { useState, useEffect } from "react"

interface TypewriterTextProps {
  text: string
  delay?: number
  className?: string
  onComplete?: () => void
  isActive?: boolean
}

export function TypewriterText({ text, delay = 50, className = "", onComplete, isActive = true }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setDisplayedText(text)
      setCurrentIndex(text.length)
      return
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    } else if (currentIndex === text.length && onComplete) {
      onComplete()
    }
  }, [currentIndex, text, delay, onComplete, isActive])

  return <span className={className}>{displayedText}</span>
}
