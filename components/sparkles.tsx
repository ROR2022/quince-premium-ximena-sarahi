"use client"

import { useEffect, useState } from "react"

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

export function Sparkles({ count = 20 }: { count?: number }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
    }))
    setSparkles(newSparkles)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full bg-accent sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
