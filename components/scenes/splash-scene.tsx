"use client"

import { Sparkles } from "@/components/sparkles"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { quinceMainData } from "../sections/data/main-data"

const { videoFondos } = quinceMainData;

const splashVideo= videoFondos.splash;
interface SplashSceneProps {
  onStart: () => void
}

function SplashSceneContent({ onStart }: SplashSceneProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [dataInvitation, setDataInvitation] = useState<any>(null)
  const searchParams = useSearchParams()
  const guestParam = searchParams.get('guest') || ''

  useEffect(() => {
    if (guestParam && guestParam.trim() !== '') {
      //console.log(`Guest parameter detected: ${guestParam}`)
      // Fetch data based on guest parameter
      fetchDataForGuest(guestParam)
    }
  }, [guestParam]);

  const fetchDataForGuest = async (guest: string) => {
    try {
      const response = await fetch(`/api/guests/${guest}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      //console.log('Fetched guest data:', data);
      const guestName = data.data.name;
      const personalInvitation = data.data.personalInvitation;
      const numberOfGuests = personalInvitation.numberOfGuests;
      const specialMessage = personalInvitation.message;
      console.log(`Guest Name: ${guestName}`);
      //console.log(`Personal Invitation:`, personalInvitation);
      console.log(`Number of Guests Allowed: ${numberOfGuests}`);
      console.log(`Special Message: ${specialMessage}`);
      if (guestName) {
        setDataInvitation({
          guestName,
          numberOfGuests,
          specialMessage
        });
      }
      // You can use this data to customize the experience further
    } catch (error) {
      console.error('Error fetching guest data:', error);
    }
  };

  // Handle video loading
  const handleVideoLoaded = () => {
    console.log('Splash video loaded successfully')
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.log('Splash video failed to load, using fallback')
    setVideoError(true)
    setVideoLoaded(true) // Proceed with fallback
  }

  // Fallback timeout - if video doesn't load in 5 seconds, proceed anyway
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!videoLoaded) {
        console.log('Splash video loading timeout, proceeding with fallback')
        setVideoLoaded(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(fallbackTimer)
  }, [videoLoaded])
  return (
    <div
      onClick={onStart}
      className="relative w-full h-screen flex items-center justify-center cursor-pointer overflow-hidden"
    >
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
          opacity: videoLoaded && !videoError ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <source src={splashVideo.src} type="video/mp4" />
        {/* Fallback gradient if video fails to load */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#f5d5d8] via-[#e8c4c8] to-[#d4a5a8]"
          style={{
            opacity: videoError ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        />
      </video>

      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 z-10" />

      {/* Loading Indicator */}
      {!videoLoaded && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto"></div>
            <p className="text-white text-lg font-semibold">Cargando experiencia...</p>
          </div>
        </div>
      )}

      <Sparkles count={30} />

    

      {videoLoaded && (
        <div className="text-center z-30 space-y-8 px-4">
          

          {/* Enhanced message with better visibility */}
          <div className="relative">
            {/* Background blur effect for the message */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full -m-4"></div>
            {/* Main Title */}
            <div 
            //style={{display:'none'}}
            className="my-4">
              <h2>
                <span className="relative text-2xl md:text-3xl lg:text-4xl text-white font-semibold drop-shadow-lg">¡Mis XV años!</span>
              </h2>
              <h1 className="relative text-4xl md:text-6xl lg:text-7xl text-white font-extrabold drop-shadow-lg">
                Ximena Sarahí
              </h1>
            </div>

            <div
            style={{display:'none'}}
            >
              {dataInvitation && (
                <div>
                  <p className="relative text-2xl md:text-3xl text-white font-medium drop-shadow-lg">
                    Bienvenid@, {dataInvitation.guestName}!
                  </p>
                  {dataInvitation.specialMessage && (
                    <p className="relative mt-2 text-lg md:text-xl text-white font-light italic drop-shadow-lg">
                      "{dataInvitation.specialMessage}"
                    </p>
                  )}
                  {dataInvitation.numberOfGuests && (<div className="relative mt-2">
                    <p className="relative text-lg md:text-xl text-white font-bold drop-shadow-lg">
                      Pase para: {dataInvitation.numberOfGuests} invitado{dataInvitation.numberOfGuests > 1 ? 's' : ''}.
                    </p>
                  </div>
                  )}
                </div>
              )}
            </div>
            <p className="relative text-2xl md:text-3xl text-white font-medium animate-pulse drop-shadow-lg">
              ✨ Toca para comenzar ✨
            </p>
          </div>
        </div>
      )}

     
    </div>
  )
}

function SplashSceneWrapper(props: SplashSceneProps) {
  return (
    <Suspense fallback={
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5d5d8] via-[#e8c4c8] to-[#d4a5a8]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto"></div>
          <p className="text-white text-lg font-semibold">Cargando experiencia...</p>
        </div>
      </div>
    }>
      <SplashSceneContent {...props} />
    </Suspense>
  )
}

export { SplashSceneWrapper as SplashScene }

