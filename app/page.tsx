"use client"

import { useState, useEffect } from "react"
import { SplashScene } from "@/components/scenes/splash-scene"
import { TitleScene } from "@/components/scenes/title-scene"
import { MessageScene1 } from "@/components/scenes/message-scene-1"
import { MessageScene2 } from "@/components/scenes/message-scene-2"
import { NameScene } from "@/components/scenes/name-scene"
import { MessageScene3 } from "@/components/scenes/message-scene-3"
import { ParentsScene } from "@/components/scenes/parents-scene"
import { DateScene } from "@/components/scenes/date-scene"
import { ReceptionScene } from "@/components/scenes/reception-scene"
import { ScheduleScene } from "@/components/scenes/schedule-scene"
import { DressCodeScene } from "@/components/scenes/dress-code-scene"
import { GiftScene } from "@/components/scenes/gift-scene"
import { RsvpScene } from "@/components/scenes/rsvp-scene"
import { ClosingScene } from "@/components/scenes/closing-scene"
import { SceneControls } from "@/components/scene-controls"
import { AudioPlayer } from "@/components/audio-player"
import GalleryScene from "@/components/scenes/gallery-scene"
import { MamaScene } from "@/components/scenes/mama-scene"
import { PapaScene } from "@/components/scenes/papa-scene"
import { Papa2Scene } from "@/components/scenes/papa2-scene"
import { AbuelosScene } from "@/components/scenes/abuelos-scene"
import { ChambelanesScene } from "@/components/scenes/chambelanes-scene"
import { PadrinosScene } from "@/components/scenes/padrinos-scene"
import { PadresScene } from "@/components/scenes/padres-scene"

const SCENE_DURATION = 9000 // 9 seconds per scene

export default function QuinceaneraInvitation() {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)

  const totalScenes = 13

  // Scenes that have their own timing control (no auto-advance)
  const scenesWithCustomTiming = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // TitleScene, MessageScene1, MessageScene2, NameScene, MessageScene3, ParentsScene, ReceptionScene, GalleryScene, ScheduleScene

  useEffect(() => {
    if (!hasStarted || isPaused || currentScene >= totalScenes - 1) return
    
    // Skip auto-advance for scenes with custom timing
    if (scenesWithCustomTiming.includes(currentScene)) {
      console.log('Parent - Scene', currentScene, 'has custom timing, skipping auto-advance');
      return;
    }

    console.log('Parent - Setting auto-advance timer for scene', currentScene);
    const timer = setTimeout(() => {
      console.log('Parent - Auto-advancing from scene', currentScene);
      setCurrentScene((prev) => Math.min(prev + 1, totalScenes - 1))
    }, SCENE_DURATION)

    return () => clearTimeout(timer)
  }, [currentScene, hasStarted, isPaused])

  const handleStart = () => {
    setHasStarted(true)
    setShowAudioPlayer(true)
    setCurrentScene(0)
  }

  const handlePrevious = () => {
    setCurrentScene((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentScene((prev) => Math.min(prev + 1, totalScenes - 1))
  }

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const handleSceneComplete = () => {
    console.log('Parent - Scene', currentScene, 'completed, isPaused:', isPaused);
    if (!isPaused && currentScene < totalScenes - 1) {
      console.log('Parent - Advancing to scene', currentScene + 1);
      setCurrentScene((prev) => prev + 1)
    }
  }

  if (!hasStarted) {
    return <SplashScene onStart={handleStart} />
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {currentScene === 0 && <TitleScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 1 && <MessageScene1 onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 2 && <PadresScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 3 && <PadrinosScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 4 && <ChambelanesScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 5 && <NameScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 6 && <MessageScene3 onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 7 && <ParentsScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 8 && <DateScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 9 && <DressCodeScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 10 && <ReceptionScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 11 && <GalleryScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      {currentScene === 12 && <ScheduleScene onComplete={handleSceneComplete} isActive={!isPaused} />}
      
       {showAudioPlayer && <AudioPlayer src="/audio/musica.mp3" autoPlay startTime={5} />} 

      <SceneControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTogglePause={handleTogglePause}
        isPaused={isPaused}
        canGoPrevious={currentScene > 0}
        canGoNext={currentScene < totalScenes - 1}
      />
    </div>
  )
}
