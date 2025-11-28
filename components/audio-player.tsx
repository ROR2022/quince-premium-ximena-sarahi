"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

interface AudioPlayerProps {
  src?: string
  autoPlay?: boolean
  onPlay?: () => void
  startTime?: number // Segundo desde donde empezar (default: 0)
  endTime?: number   // Segundo donde terminar (si no se especifica, reproduce hasta el final)
}

export function AudioPlayer({ 
  src, 
  autoPlay = false, 
  onPlay,
  startTime = 0,
  endTime 
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Establecer el tiempo de inicio cuando el audio está listo
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return

    const handleLoadedMetadata = () => {
      if (startTime > 0) {
        audio.currentTime = startTime
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [src, startTime])

  // Monitorear el tiempo de reproducción y detener en endTime
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !endTime) return

    const handleTimeUpdate = () => {
      if (audio.currentTime >= endTime) {
        audio.currentTime = startTime
        // Si no está en loop, pausar
        if (!audio.loop) {
          audio.pause()
          setIsPlaying(false)
        }
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [endTime, startTime])

  useEffect(() => {
    if (autoPlay && audioRef.current && src && !hasError) {
      const audio = audioRef.current
      
      // Establecer tiempo inicial si no se ha cargado aún
      if (startTime > 0 && audio.currentTime === 0) {
        audio.currentTime = startTime
      }
      
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          onPlay?.()
        })
        .catch((error) => {
          console.log("[v0] Audio autoplay failed:", error.message)
          setHasError(true)
        })
    }
  }, [autoPlay, onPlay, src, hasError, startTime])

  const toggleMute = () => {
    if (audioRef.current && !hasError) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleError = () => {
    console.log("[v0] Audio failed to load - no audio file provided yet")
    setHasError(true)
  }

  if (!src || hasError) {
    return null
  }

  return (
    <div className="fixed top-6 left-6 z-50">
      <audio ref={audioRef} src={src} loop onError={handleError} />
      <Button
        onClick={toggleMute}
        size="icon"
        variant="secondary"
        className="rounded-full w-12 h-12 bg-primary/80 hover:bg-primary backdrop-blur-sm shadow-lg"
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Volume2 className="h-5 w-5 text-primary-foreground" />
        )}
      </Button>
    </div>
  )
}
