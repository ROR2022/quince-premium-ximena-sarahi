"use client"

import { Sparkles } from "@/components/sparkles"
import { TypewriterText } from "@/components/typewriter-text"
import { useState, useEffect } from "react"

import { quinceMainData } from "../sections/data/main-data"

const { videoFondos } = quinceMainData;

const message2Video = videoFondos.message2;

interface MessageScene2Props {
  onComplete: () => void
  isActive: boolean
}

export function MessageScene2({ onComplete, isActive }: MessageScene2Props) {
  const [firstTextComplete, setFirstTextComplete] = useState(false)
  const [secondTextComplete, setSecondTextComplete] = useState(false)
  const [thirdTextComplete, setThirdTextComplete] = useState(false)
  const [fourthTextComplete, setFourthTextComplete] = useState(false)
  const [fifthTextComplete, setFifthTextComplete] = useState(false)
  const [sixthMessageComplete, setSixthMessageComplete] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const firstMessage = "Mis Padres"
  const secondMessage = "Cynthia Reyna González"
  const thirdMessage = "Jose Guadalupe Fuentes Ortiz"
  const fourthMessage = "Mis Padrinos"
  const fifthMessage = "Antonio López Gallardo"
  const sixthMessage = "Alma Rosa Guzmán Avila"

  // Handle video loading
  const handleVideoLoaded = () => {
    console.log('MessageScene2 - Video loaded successfully')
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.log('MessageScene2 - Video failed to load, using fallback')
    setVideoError(true)
    setVideoLoaded(true) // Proceed with fallback image
  }

  // Fallback timeout - if video doesn't load in 5 seconds, proceed anyway
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!videoLoaded) {
        console.log('MessageScene2 - Video loading timeout, proceeding with fallback')
        setVideoLoaded(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(fallbackTimer)
  }, [videoLoaded])

  // Handle 2 second delay before advancing to next scene
  useEffect(() => {
    if (sixthMessageComplete && isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [sixthMessageComplete, isActive, onComplete]);

  const handleFirstTextComplete = () => {
    setFirstTextComplete(true);
  };

  const handleSecondTextComplete = () => {
    setSecondTextComplete(true);
  };

  const handleThirdTextComplete = () => {
    setThirdTextComplete(true);
  };

  const handleFourthTextComplete = () => {
    setFourthTextComplete(true);
  };

  const handleFifthTextComplete = () => {
    setFifthTextComplete(true);
  };

  const handleSixthTextComplete = () => {
    setSixthMessageComplete(true);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Sparkles count={20} />

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
        <source src={message2Video.src} type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo3-fU4fQLXpKVDGkvxylef7pszW6qJCT8.png"
          alt=""
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
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto"></div>
            <p className="text-white text-lg font-semibold">Cargando experiencia...</p>
          </div>
        </div>
      )}

      {/* Text Container - Organized vertically */}
      {videoLoaded && (
        <div className="relative z-20 text-center px-6 md:px-8 lg:px-12 space-y-8">
          {/* First Text */}
          <div className="rounded-2xl p-4 md:p-6 lg:p-8">
            <TypewriterText
              text={firstMessage}
              delay={150}
              className="font-main-text text-5xl md:text-7xl lg:text-8xl text-amber-500 font-bold tracking-wide drop-shadow-2xl"
              onComplete={handleFirstTextComplete}
              isActive={isActive}
            />
          </div>

          {/* Second Text */}
          {firstTextComplete && (
            <div className="animate-fade-in rounded-2xl p-4 md:p-6 lg:p-8">
              <TypewriterText
                text={secondMessage}
                delay={120}
                className="font-main-text text-3xl md:text-4xl lg:text-5xl text-white font-bold tracking-wide drop-shadow-2xl"
                onComplete={handleSecondTextComplete}
                isActive={isActive}
              />
            </div>
          )}

          {/* Third Text */}
          {secondTextComplete && (
            <div className="animate-fade-in rounded-2xl p-4 md:p-6 lg:p-8">
              <TypewriterText
                text={thirdMessage}
                delay={150}
                className="font-main-text text-3xl md:text-4xl lg:text-5xl text-white font-bold tracking-wide drop-shadow-2xl"
                onComplete={handleThirdTextComplete}
                isActive={isActive}
              />
            </div>
          )}

          {/* Fourth Text */}
          {thirdTextComplete && (
            <div className="animate-fade-in rounded-2xl p-4 md:p-6 lg:p-8">
              <TypewriterText
                text={fourthMessage}
                delay={120}
                className="font-main-text text-5xl md:text-7xl lg:text-8xl text-amber-500 font-bold tracking-wide drop-shadow-2xl"
                onComplete={handleFourthTextComplete}
                isActive={isActive}
              />
            </div>
          )}

          {/* Fifth Text */}
          {fourthTextComplete && (
            <div className="animate-fade-in rounded-2xl p-4 md:p-6 lg:p-8">
              <TypewriterText
                text={fifthMessage}
                delay={120}
                className="font-main-text text-3xl md:text-4xl lg:text-5xl text-white font-bold tracking-wide drop-shadow-2xl"
                onComplete={handleFifthTextComplete}
                isActive={isActive}
              />
            </div>
          )}

          {/* Sixth Text */}
          {fifthTextComplete && (
            <div className="animate-fade-in rounded-2xl p-4 md:p-6 lg:p-8">
              <TypewriterText
                text={sixthMessage}
                delay={150}
                className="font-main-text text-3xl md:text-4xl lg:text-5xl text-white font-bold tracking-wide drop-shadow-2xl"
                onComplete={handleSixthTextComplete}
                isActive={isActive}
              />
            </div>
          )}

        </div>
      )}

    </div>
  )
}
