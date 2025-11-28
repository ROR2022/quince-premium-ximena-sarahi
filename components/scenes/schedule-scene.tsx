"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "@/components/sparkles"
import BasicCTA from "@/components/sections/BasicCTA"
import { quinceMainData } from "../sections/data/main-data"

const { videoFondos } = quinceMainData;

const scheduleVideo = videoFondos.schedule;

interface ScheduleSceneProps {
  onComplete?: () => void
  isActive?: boolean
}

export function ScheduleScene({ onComplete, isActive = true }: ScheduleSceneProps) {
  const [showContent, setShowContent] = useState(false)
  
  // Video loading states
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Video loading handlers
  const handleVideoLoaded = () => {
    console.log('Video loaded successfully in schedule-scene')
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.log('Video failed to load in schedule-scene')
    setVideoError(true)
    setVideoLoaded(true) // Show content anyway
  }

  useEffect(() => {
    if (videoLoaded) {
      setShowContent(true)
    }
  }, [videoLoaded])

  // Safety timeout in case video events don't fire
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!videoLoaded) {
        console.log('Video loading timeout in schedule-scene, showing content anyway')
        setVideoLoaded(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timer)
  }, [])

  const handleGoToStart = () => {
    // Reload the page to start from the beginning
    window.location.reload()
  }

  const handleContinue = () => {
    onComplete?.()
  }

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
        <source src={scheduleVideo.src} type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo9-FHTBMsEcGFSin6I6VmwHEJxWLSV31F.png"
          alt="Event schedule"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {/* No dark overlay - keep original video colors */}
      
      {/* Loading indicator */}
      {!videoLoaded && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-blue-500 text-lg font-serif">Cargando experiencia...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {videoLoaded && (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center">
          {showContent && (
            <div className="space-y-8">
              {/* BasicCTA Component */}
              <div className="mb-8">
                <BasicCTA />
              </div>

              {/* Control Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Go to Start Button */}
                <button
                  onClick={handleGoToStart}
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-bold px-8 py-4 rounded-full text-lg md:text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-blue-500/50"
                >
                  🏠 Volver al Inicio
                </button>

                {/* Continue Button */}
                <button
                style={{display:'none'}}
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg md:text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-yellow-400/50"
                >
                  ✨ Continuar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
