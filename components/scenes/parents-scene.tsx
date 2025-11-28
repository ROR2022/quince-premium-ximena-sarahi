"use client"

import { useEffect, useState } from "react"
import { TypewriterText } from "@/components/typewriter-text"
import { Sparkles } from "@/components/sparkles"
import { quinceMainData } from "../sections/data/main-data"

const { videoFondos, event } = quinceMainData;

const parentsVideo = videoFondos.parents;

interface ParentsSceneProps {
  onComplete?: () => void
  isActive?: boolean
}

export function ParentsScene({ onComplete, isActive = true }: ParentsSceneProps) {
  const [showContent, setShowContent] = useState(false)
  const [firstTextComplete, setFirstTextComplete] = useState(false)
  const [secondTextComplete, setSecondTextComplete] = useState(false)
  const [thirdTextComplete, setThirdTextComplete] = useState(false)
  const [fourthTextComplete, setFourthTextComplete] = useState(false)
  const [fifthTextComplete, setFifthTextComplete] = useState(false)
  const [showButton, setShowButton] = useState(false)
  
  // Video loading states
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  
  const firstMessage = "Recepción"
  const secondMessage = event.party.venue
  const thirdMessage = event.party.time
  const fourthMessage = event.party.address
  const fifthMessage = event.party.type
  const ubiLink = event.party.ubiLink

  // Video loading handlers
  const handleVideoLoaded = () => {
    console.log('Video loaded successfully in parents-scene')
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.log('Video failed to load in parents-scene')
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
        console.log('Video loading timeout in parents-scene, showing content anyway')
        setVideoLoaded(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timer)
  }, [])

  // Handle completion flow
  useEffect(() => {
    if (showButton && isActive) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 3000) // 3 seconds after button appears

      return () => clearTimeout(timer)
    }
  }, [showButton, isActive, onComplete])

  const handleFirstTextComplete = () => {
    setFirstTextComplete(true)
  }

  const handleSecondTextComplete = () => {
    setSecondTextComplete(true)
  }

  const handleThirdTextComplete = () => {
    setThirdTextComplete(true)
  }

  const handleFourthTextComplete = () => {
    setFourthTextComplete(true)
  }

  const handleFifthTextComplete = () => {
    setFifthTextComplete(true)
    // Show button after all text is complete
    setTimeout(() => setShowButton(true), 1000)
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
        <source src={parentsVideo.src} type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo5-H2o3Q9PtL8Yas0yO418s6nTktcG7Xe.png"
          alt="Decorative flowers"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {/* No dark overlay - keep original video colors */}

      {/* Loading indicator */}
      {!videoLoaded && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
            <p className="mt-4 text-amber-600 text-lg font-serif">Cargando experiencia...</p>
          </div>
        </div>
      )}

      {/* Content */}
      {videoLoaded && (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center">
          {/* Decorative element at top */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-300">
              <path d="M50 10 L60 30 L80 30 L65 45 L70 65 L50 55 L30 65 L35 45 L20 30 L40 30 Z" fill="currentColor" />
            </svg>
          </div>

          {/* Message content */}
          <div className="max-w-2xl mx-auto space-y-8">
            {/* First text */}
            {showContent && (
              <div className="mb-8">
                <TypewriterText 
                  text={firstMessage}
                  delay={100}
                  className="text-6xl md:text-8xl font-bold text-amber-500 font-serif leading-tight"
                  onComplete={handleFirstTextComplete}
                />
              </div>
            )}

            {/* Second text */}
            {firstTextComplete && (
              <div className="mb-6">
                <TypewriterText 
                  text={secondMessage}
                  delay={80}
                  className="text-2xl md:text-3xl text-amber-500 font-serif"
                  onComplete={handleSecondTextComplete}
                />
              </div>
            )}

            {/* Third text */}
            {secondTextComplete && (
              <div className="mb-6">
                <TypewriterText 
                  text={thirdMessage}
                  delay={100}
                  className="text-3xl md:text-4xl font-bold text-amber-500 font-serif"
                  onComplete={handleThirdTextComplete}
                />
              </div>
            )}

            {/* Fourth text */}
            {thirdTextComplete && (
              <div className="mb-6">
                <TypewriterText 
                  text={fourthMessage}
                  delay={60}
                  className="text-lg md:text-xl text-amber-500 font-serif leading-relaxed"
                  onComplete={handleFourthTextComplete}
                />
              </div>
            )}

            {/* Fifth text */}
            {fourthTextComplete && (
              <div className="mb-8">
                <TypewriterText 
                  text={fifthMessage}
                  delay={80}
                  className="text-2xl md:text-3xl text-amber-500 font-serif italic"
                  onComplete={handleFifthTextComplete}
                />
              </div>
            )}

            {/* CTA Button */}
            {showButton && (
              <div className="mt-8 animate-fade-in">
                <a 
                  href={ubiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg md:text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-yellow-400/50"
                >
                  📍 Ver Ubicación
                </a>
              </div>
            )}
          </div>

          {/* Decorative element at bottom */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-300">
              <path d="M50 10 L60 30 L80 30 L65 45 L70 65 L50 55 L30 65 L35 45 L20 30 L40 30 Z" fill="currentColor" />
            </svg>
          </div>

          {/* Decorative blur element */}
          <div className="absolute top-1/4 right-8 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl opacity-50"></div>
          <div className="absolute bottom-1/4 left-8 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg opacity-40"></div>
        </div>
      )}
      
    </div>
  )
}
