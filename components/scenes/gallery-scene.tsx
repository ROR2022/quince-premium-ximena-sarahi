import React, { useEffect, useState } from "react";
import { Sparkles } from "@/components/sparkles";
import { quinceMainData } from "../sections/data/main-data";
import { PremiumGallery } from "../sections/PremiumGallery";

const { videoFondos } = quinceMainData;

const galleryVideo = videoFondos.gallery;

interface GallerySceneProps {
  onComplete?: () => void;
  isActive?: boolean;
}

const GalleryScene: React.FC<GallerySceneProps> = ({
  onComplete,
  isActive = true,
}) => {
  const [showContent, setShowContent] = useState(false);
  // Video loading states
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Video loading handlers
  const handleVideoLoaded = () => {
    console.log("Video loaded successfully in reception-scene");
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    console.log("Video failed to load in reception-scene");
    setVideoError(true);
    setVideoLoaded(true); // Show content anyway
  };

  useEffect(() => {
    if (videoLoaded) {
      setShowContent(true);
    }
  }, [videoLoaded]);

  // Safety timeout in case video events don't fire
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!videoLoaded) {
        console.log(
          "Video loading timeout in reception-scene, showing content anyway"
        );
        setVideoLoaded(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    onComplete?.();
  };

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
          filter: "brightness(1.05) contrast(1.05)",
          opacity: videoLoaded ? 1 : 0,
        }}
      >
        <source src={galleryVideo.src} type="video/mp4" />
        {/* Fallback to image if video fails to load */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fotoVideo8-VbuMeeRnwH48b73enAL6llvNC1IKMQ.png"
          alt="Reception location"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {videoLoaded && showContent && (
        <div className="flex flex-col min-h-screen justify-center items-center relative z-10 p-10">
            <div className="">
          <PremiumGallery />
          </div>
          <div className="animate-fade-in">
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg md:text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-yellow-400/50"
            >
              ✨ Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryScene;
