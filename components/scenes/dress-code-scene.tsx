"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "@/components/sparkles"

interface DressCodeSceneProps {
  onComplete?: () => void
  isActive?: boolean
}

export function DressCodeScene({ onComplete, isActive = true }: DressCodeSceneProps) {
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
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo10-UmS3LrNT9SPO8bmLT6bWFOoHEFPzEH.png"
        alt="Dress code"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none animate-fade-in"
      />
    </div>
  )
}
