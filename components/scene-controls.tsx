"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface SceneControlsProps {
  onPrevious: () => void
  onNext: () => void
  onTogglePause: () => void
  isPaused: boolean
  canGoPrevious: boolean
  canGoNext: boolean
}

export function SceneControls({
  onPrevious,
  onNext,
  onTogglePause,
  isPaused,
  canGoPrevious,
  canGoNext,
}: SceneControlsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-2">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        size="icon"
        variant="secondary"
        className="rounded-full w-12 h-12 bg-primary/80 hover:bg-primary backdrop-blur-sm shadow-lg disabled:opacity-30"
      >
        <ChevronLeft className="h-5 w-5 text-primary-foreground" />
      </Button>

      <Button
        onClick={onTogglePause}
        size="icon"
        variant="secondary"
        className="rounded-full w-12 h-12 bg-primary/80 hover:bg-primary backdrop-blur-sm shadow-lg"
      >
        {isPaused ? (
          <Play className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Pause className="h-5 w-5 text-primary-foreground" />
        )}
      </Button>

      <Button
        onClick={onNext}
        disabled={!canGoNext}
        size="icon"
        variant="secondary"
        className="rounded-full w-12 h-12 bg-primary/80 hover:bg-primary backdrop-blur-sm shadow-lg disabled:opacity-30"
      >
        <ChevronRight className="h-5 w-5 text-primary-foreground" />
      </Button>
    </div>
  )
}
