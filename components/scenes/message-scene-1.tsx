"use client"
import { Sparkles } from "@/components/sparkles"
import { TypewriterText } from "@/components/typewriter-text"
import { useState, useEffect } from "react"
import { quinceMainData } from "../sections/data/main-data"

const { videoFondos } = quinceMainData;

const message1Video = videoFondos.message1;



interface MessageScene1Props {
  onComplete: () => void
  isActive: boolean
}

export const plateadoMetalicoText="bg-gradient-to-r from-[#e5e5e5] via-[#ffffff] to-[#bfbfbf] bg-clip-text text-transparent" 

export const oroRosaText="bg-gradient-to-r from-[#f7d7d0] via-[#f1b7b4] to-[#d49ca2] bg-clip-text text-transparent"

export function MessageScene1({ onComplete, isActive }: MessageScene1Props) {
  const [textComplete, setTextComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)



  const message = `
  Con el corazón lleno de gratitud, 
  agradezco a la vida por cada momento que me ha hecho soñar, crecer y sonreír.
  Hoy, al celebrar mis quince años, recibo esta nueva etapa con alegría, ilusión y esperanza, 
  agradeciendo a Dios por guiarme siempre y por todo lo maravilloso que está por venir. 🌷
  `

  // Handle video loading
  const handleVideoLoaded = () => {
    console.log('MessageScene1 - Video loaded successfully')
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.log('MessageScene1 - Video failed to load, using fallback')
    setVideoError(true)
    setVideoLoaded(true) // Proceed with fallback image
  }

  // Fallback timeout - if video doesn't load in 5 seconds, proceed anyway
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!videoLoaded) {
        console.log('MessageScene1 - Video loading timeout, proceeding with fallback')
        setVideoLoaded(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(fallbackTimer)
  }, [videoLoaded])

  // Debug logging
  useEffect(() => {
    console.log('MessageScene1 - isActive:', isActive, 'textComplete:', textComplete, 'hasStarted:', hasStarted, 'videoLoaded:', videoLoaded);
  }, [isActive, textComplete, hasStarted, videoLoaded]);

  // Initialize scene when it becomes active for the first time AND video is loaded
  useEffect(() => {
    if (isActive && !hasStarted && videoLoaded) {
      console.log('MessageScene1 - Scene activated and video ready, initializing...');
      setTextComplete(false);
      setHasStarted(true);
    } else if (!isActive) {
      // Reset when scene becomes inactive
      setHasStarted(false);
      setTextComplete(false);
    }
  }, [isActive, hasStarted, videoLoaded]);

  // Handle 2 second delay before advancing to next scene
  useEffect(() => {
    if (textComplete && isActive) {
      console.log('MessageScene1 - Starting 2 second delay...');
      const timer = setTimeout(() => {
        console.log('MessageScene1 - Calling onComplete after delay');
        onComplete();
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [textComplete, isActive, onComplete]);

  const handleTextComplete = () => {
    console.log('MessageScene1 - Text completed!');
    setTextComplete(true);
  };

  

  /**
   *  
   * class="bg-gradient-to-r from-[#f7d7d0] via-[#f1b7b4] to-[#d49ca2] bg-clip-text text-transparent"
   * 
   */

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
        <source src={message1Video.src} type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo2-Wm2VQWrwt1WtwvZvtaWlAId6zCG8iW.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: videoError ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        />
      </video>

      {/* Minimal overlay only where text appears - removed general dark overlay */}
      {/* <div className="absolute inset-0 bg-black/10 z-10" /> */}

      {/* Loading Indicator */}
      {!videoLoaded && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-400 border-t-transparent mx-auto"></div>
            <p className="text-white text-lg font-semibold">Cargando experiencia...</p>
          </div>
        </div>
      )}

      {/* Message Text */}
      {videoLoaded && hasStarted && (
        <div className="relative z-20 max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="rounded-2xl p-8 md:p-12 lg:p-16">
            <TypewriterText
              text={message}
              delay={80}
              className={`font-main-text font-bold text-2xl md:text-3xl lg:text-4xl ${oroRosaText} text-center leading-relaxed drop-shadow-lg`}
              onComplete={handleTextComplete}
              isActive={true}
            />
          </div>
        </div>
      )}
    </div>
  )
}
