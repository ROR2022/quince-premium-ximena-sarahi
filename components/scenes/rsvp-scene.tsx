"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "@/components/sparkles"

interface RsvpSceneProps {
  onComplete?: () => void
  isActive?: boolean
}

export function RsvpScene({ onComplete, isActive = true }: RsvpSceneProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
    const timer = setTimeout(() => {
      onComplete?.()
    }, 6000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Sparkles />

      {/* Background image */}
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo12-WtLFV2Bqmb0UBAhbJsmng3EH4KJjn0.png"
        alt="RSVP"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none animate-fade-in"
      />
    </div>
  )
}
