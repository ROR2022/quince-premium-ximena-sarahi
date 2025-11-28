"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "@/components/sparkles"

interface GiftSceneProps {
  onComplete?: () => void
  isActive?: boolean
}

export function GiftScene({ onComplete, isActive = true }: GiftSceneProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
    const timer = setTimeout(() => {
      onComplete?.()
    }, 7000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Sparkles />

      {/* Background image */}
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo11-nceXNPUMNG8IOqGpqCFSCC5fQZFNhY.png"
        alt="Gift option"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none animate-fade-in"
      />
    </div>
  )
}
