"use client"

import { Sparkles } from "@/components/sparkles"
import { TypewriterText } from "@/components/typewriter-text"
import { useState, useEffect } from "react"

import { quinceMainData } from "../sections/data/main-data"

const { videoFondos, event } = quinceMainData;

const nameVideo = videoFondos.name
const dateEvent = event.date.full

interface NameSceneProps {
  onComplete: () => void
  isActive: boolean
}

export function NameScene({ onComplete, isActive }: NameSceneProps) {
  const [firstTextComplete, setFirstTextComplete] = useState(false)
  const [secondTextComplete, setSecondTextComplete] = useState(false)
  const [thirdTextComplete, setThirdTextComplete] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const firstMessage = "¡La cuenta regresiva ha comenzado!"
  const secondMessage = "FECHA ESPECIAL"
  const thirdMessage = dateEvent

  // Handle video loading
  const handleVideoLoaded = () => {
    console.log('NameScene - Video loaded successfully')
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.log('NameScene - Video failed to load, using fallback')
    setVideoError(true)
    setVideoLoaded(true) // Proceed with fallback image
  }

  // Fallback timeout - if video doesn't load in 5 seconds, proceed anyway
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!videoLoaded) {
        console.log('NameScene - Video loading timeout, proceeding with fallback')
        setVideoLoaded(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(fallbackTimer)
  }, [videoLoaded])

  // Handle 2 second delay before advancing to next scene
  useEffect(() => {
    if (thirdTextComplete && isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [thirdTextComplete, isActive, onComplete]);

  const handleFirstTextComplete = () => {
    setFirstTextComplete(true);
  };

  const handleSecondTextComplete = () => {
    setSecondTextComplete(true);
  };

  const handleThirdTextComplete = () => {
    setThirdTextComplete(true);
  };
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Sparkles count={25} />

      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoLoaded}
        onError={handleVideoError}
        style={{
          filter: 'brightness(1.05) contrast(1.05)',
          opacity: videoLoaded && !videoError ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <source src={nameVideo.src} type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo4-Dhmx2pFAGiovwD1sVLQOUSie8Nndew.png"
          alt="Martina"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: videoError ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        />
      </video>

      {/* No dark overlay - keep original video colors */}

      {/* Loading Indicator */}
      {!videoLoaded && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-800 border-t-transparent mx-auto"></div>
            <p className="text-white text-lg font-semibold">Cargando experiencia...</p>
          </div>
        </div>
      )}

      {/* Text Container - Organized vertically */}
      {videoLoaded && (
        <div className="relative z-20 text-center px-6 md:px-8 lg:px-12 space-y-8">
          {/* First Text: "¡La cuenta regresiva ha comenzado!" */}
          <div className="rounded-2xl p-4 md:p-6 lg:p-8">
            <TypewriterText
              text={firstMessage}
              delay={100}
              className="font-main-text text-4xl md:text-6xl lg:text-7xl text-amber-500 font-bold tracking-wide drop-shadow-2xl"
              onComplete={handleFirstTextComplete}
              isActive={isActive}
            />
          </div>

          {/* Second Text: "FECHA ESPECIAL" - appears after first text completes */}
          {firstTextComplete && (
            <div className="animate-fade-in rounded-2xl p-4 md:p-6 lg:p-8">
              <TypewriterText
                text={secondMessage}
                delay={120}
                className="font-main-text text-5xl md:text-7xl lg:text-8xl text-amber-500 font-bold tracking-wider drop-shadow-2xl"
                onComplete={handleSecondTextComplete}
                isActive={isActive}
              />
            </div>
          )}

          {/* Third Text: "Sábado 15 de Noviembre 2025" - appears after second text completes */}
          {secondTextComplete && (
            <div className="animate-fade-in rounded-2xl p-4 md:p-6 lg:p-8">
              <TypewriterText
                text={thirdMessage}
                delay={80}
                className="font-main-text text-3xl md:text-5xl lg:text-6xl text-amber-500 font-bold tracking-wide drop-shadow-2xl"
                onComplete={handleThirdTextComplete}
                isActive={isActive}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
