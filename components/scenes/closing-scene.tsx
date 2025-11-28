"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "@/components/sparkles"

interface ClosingSceneProps {
  onComplete?: () => void
  isActive?: boolean
}

export function ClosingScene({ onComplete, isActive = true }: ClosingSceneProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
  }, [])

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Sparkles />

      {/* Background image */}
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo13-ijK27Xk9U01GvmfTL70PXKkBNWmNka.png"
        alt="We're waiting for you"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none animate-fade-in"
      />

      {/* Extra sparkle effect for the finale */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-200/20 via-transparent to-transparent animate-pulse" />
    </div>
  )
}
