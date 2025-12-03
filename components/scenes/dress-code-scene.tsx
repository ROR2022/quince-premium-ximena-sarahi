"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "@/components/sparkles";

import { quinceMainData } from "../sections/data/main-data";

const { videoFondos } = quinceMainData;

const dressVideo = videoFondos.parents;

interface DressCodeSceneProps {
  onComplete?: () => void;
  isActive?: boolean;
}

export function DressCodeScene({
  onComplete,
  isActive = true,
}: DressCodeSceneProps) {
  const [showContent, setShowContent] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showText, setShowText] = useState(false);

  // Handle video loading
  const handleVideoLoaded = () => {
    //console.log("Video loaded successfully");
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    //console.log("MamaScene - Video failed to load, using fallback");
    setVideoError(true);
    setVideoLoaded(true); // Proceed with fallback image
  };

  // Fallback timeout - if video doesn't load in 5 seconds, proceed anyway
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!videoLoaded) {
        console.log(
          "MamaScene - Video loading timeout, proceeding with fallback"
        );
        setVideoLoaded(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(fallbackTimer);
  }, [videoLoaded]);

  useEffect(() => {
    if (videoLoaded) {
      setShowContent(true);
      
      // Staggered animations
      const titleTimer = setTimeout(() => setShowTitle(true), 500);
      const videoTimer = setTimeout(() => setShowVideo(true), 1500);
      const textTimer = setTimeout(() => setShowText(true), 2500);
      
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 9000);

      return () => {
        clearTimeout(titleTimer);
        clearTimeout(videoTimer);
        clearTimeout(textTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [videoLoaded, onComplete]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Sparkles />
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
          filter: "brightness(1.05) contrast(1.05)",
          opacity: videoLoaded && !videoError ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <source src={dressVideo.src} type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo3-fU4fQLXpKVDGkvxylef7pszW6qJCT8.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: videoError ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      </video>

      {/* Loading Indicator */}
      {!videoLoaded && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto"></div>
            <p className="text-white text-lg font-semibold">
              Cargando experiencia...
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {showContent && videoLoaded && (
        <div className="relative z-10 flex flex-col gap-6 items-center justify-center w-full h-full px-4">
          {/* Title - First element */}
          <div 
            className={`text-center transition-all duration-1000 ease-out transform ${
              showTitle 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <h2 className="font-main-title text-5xl text-amber-500 font-bold drop-shadow-lg">
              Código de Vestimenta
            </h2>
          </div>
          
          {/* Video - Second element */}
          <div 
            className={`w-[60vw] max-w-2xl transition-all duration-1000 ease-out transform ${
              showVideo 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto object-cover rounded-2xl shadow-2xl"
            >
              <source src="/video/dressCodeVideo01.mp4" type="video/mp4" />
              
              <img
                src="/images/dressCodeImage01.png"
                alt="image dress code"
                className="w-full h-auto object-cover rounded-2xl"
              />
            </video>
          </div>

          {/* Text - Third element */}
          <div 
            className={`text-center transition-all duration-1000 ease-out transform ${
              showText 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <p className="font-main-text font-bold text-5xl text-amber-500 flex flex-col gap-4 drop-shadow-2xl">
              <span>Formal</span>
              <span>¡Super Guapos!</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
