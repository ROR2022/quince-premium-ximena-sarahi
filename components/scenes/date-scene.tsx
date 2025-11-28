"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "@/components/sparkles"
import GiftsSection from "@/components/sections/GiftsSection"
import { quinceMainData } from "../sections/data/main-data"

const { videoFondos } = quinceMainData;

const dateVideo = videoFondos.date;

interface DateSceneProps {
  onComplete?: () => void
  isActive?: boolean
}

export function DateScene({ onComplete, isActive = true }: DateSceneProps) {
  const [showContent, setShowContent] = useState(false)
  
  // Video loading states
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Video loading handlers
  const handleVideoLoaded = () => {
    console.log('Video loaded successfully in date-scene')
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.log('Video failed to load in date-scene')
    setVideoError(true)
    setVideoLoaded(true) // Show content anyway
  }

  useEffect(() => {
    if (videoLoaded) {
      setShowContent(true)
      const timer = setTimeout(() => {
        onComplete?.()
      }, 6000)

      return () => clearTimeout(timer)
    }
  }, [videoLoaded, onComplete])

  // Safety timeout in case video events don't fire
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!videoLoaded) {
        console.log('Video loading timeout in date-scene, showing content anyway')
        setVideoLoaded(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Sparkles />

      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoLoaded}
        onError={handleVideoError}
        className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
        style={{
          filter: 'brightness(1.05) contrast(1.05)',
          opacity: videoLoaded ? 1 : 0
        }}
      >
        <source src={dateVideo.src} type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo7-gurPRtNhvTix6LQQCmEvsmec5HoLBm.png"
          alt="Date announcement"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {/* No dark overlay - keep original video colors */}

      {/* Loading indicator */}
      {!videoLoaded && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            <p className="mt-4 text-yellow-500 text-lg font-serif">Cargando experiencia...</p>
          </div>
        </div>
      )}

      {/* Content is already in the background image */}
      {videoLoaded && (
        <div className="relative z-20 animate-fade-in">
          {showContent && <GiftsSection />}
        </div>
      )}
    </div>
  )
}
