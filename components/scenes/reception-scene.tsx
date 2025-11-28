"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "@/components/sparkles"
import AttendanceConfirmation from "@/components/sections/AttendanceConfirmation"
import { quinceMainData } from "../sections/data/main-data"

const { videoFondos } = quinceMainData;

const receptionVideo = videoFondos.reception;

interface ReceptionSceneProps {
  onComplete?: () => void
  isActive?: boolean
}

export function ReceptionScene({ onComplete, isActive = true }: ReceptionSceneProps) {
  const [showContent, setShowContent] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false)
  const [showContinueButton, setShowContinueButton] = useState(false)
  
  // Video loading states
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Video loading handlers
  const handleVideoLoaded = () => {
    console.log('Video loaded successfully in reception-scene')
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.log('Video failed to load in reception-scene')
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
        console.log('Video loading timeout in reception-scene, showing content anyway')
        setVideoLoaded(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timer)
  }, [])

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    if (!attendanceConfirmed) {
      // If they close without confirming, show continue button anyway
      setShowContinueButton(true)
    }
  }

  const handleAttendanceConfirmed = () => {
    setAttendanceConfirmed(true)
    setShowModal(false)
    setShowContinueButton(true)
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
        <source src={receptionVideo.src} type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo8-VbuMeeRnwH48b73enAL6llvNC1IKMQ.png"
          alt="Reception location"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {/* No dark overlay - keep original video colors */}
      
      {/* Loading indicator */}
      {!videoLoaded && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-pink-500 text-lg font-serif">Cargando experiencia...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {videoLoaded && (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center">
          {showContent && !showModal && (
            <div className="space-y-8">
              {/* Main CTA Button */}
              <div className="animate-fade-in">
                <button
                  onClick={handleOpenModal}
                  className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 text-white font-bold px-12 py-6 rounded-full text-xl md:text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-pink-500/50"
                >
                  💌 Confirmar Asistencia
                </button>
              </div>

              {/* Continue Button (shows after confirmation or closing modal) */}
              {showContinueButton && (
                <div className="animate-fade-in mt-8">
                  <button
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg md:text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-yellow-400/50"
                  >
                    ✨ Continuar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto mx-2 md:mx-4 animate-fade-in">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
            >
              ✕
            </button>
            
            {/* AttendanceConfirmation Component */}
            <div className="p-2 md:p-4 lg:p-6">
              <AttendanceConfirmation />
              
              {/* Custom confirmation button inside modal */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200 text-center flex flex-col md:flex-row justify-center items-center gap-2">
                <button
                  onClick={handleAttendanceConfirmed}
                  className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 mr-4"
                >
                  ✅ Ya confirmé mi asistencia
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white font-bold px-6 py-4 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  ⏭️ Continuar sin confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
