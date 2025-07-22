"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mic, MicOff, Play } from "lucide-react"

export function CPRLoopScreen() {
  const [compressionCount, setCompressionCount] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [showDemo, setShowDemo] = useState(false)
  const [pulsePhase, setPulsePhase] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pulseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)

  // 110 BPM = 545ms per compression
  const COMPRESSION_INTERVAL = 545

  // Start counter function
  const startCounter = useCallback(() => {
    if (isActive) return // Already running

    setIsActive(true)

    // Start compression counter
    timerRef.current = setInterval(() => {
      setCompressionCount((prev) => {
        const newCount = prev + 1
        if (newCount >= 30) {
          completeCycle()
          return 30
        }
        return newCount
      })
    }, COMPRESSION_INTERVAL)

    // Start pulse animation
    pulseTimerRef.current = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 4)
    }, COMPRESSION_INTERVAL / 4)
  }, [isActive])

  // Pause counter function
  const pauseCounter = useCallback(() => {
    setIsActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (pulseTimerRef.current) {
      clearInterval(pulseTimerRef.current)
      pulseTimerRef.current = null
    }
  }, [])

  // Complete cycle function
  const completeCycle = useCallback(() => {
    setIsActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (pulseTimerRef.current) {
      clearInterval(pulseTimerRef.current)
      pulseTimerRef.current = null
    }

    // Navigate to AED screen
    setTimeout(() => {
      window.location.href = "/cpr-aed"
    }, 500)
  }, [])

  // Voice command handlers
  const onSay = useCallback(
    (command: string, callback: () => void) => {
      if (!voiceEnabled || !recognitionRef.current) return

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim()

        if (transcript.includes(command.toLowerCase())) {
          callback()
        }
      }
    },
    [voiceEnabled],
  )

  // Initialize wake lock with error handling
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          await navigator.wakeLock.request("screen")
        }
      } catch (error) {
        console.log("Wake lock not available")
      }
    }
    requestWakeLock()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pulseTimerRef.current) clearInterval(pulseTimerRef.current)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  }, [])

  // Voice recognition setup
  useEffect(() => {
    if (!voiceEnabled) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          // Ignore errors
        }
      }
      return
    }

    try {
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim()

          if (transcript.includes("begin") || transcript.includes("start")) {
            startCounter()
          } else if (transcript.includes("pause") || transcript.includes("stop")) {
            pauseCounter()
          } else if (transcript.includes("done")) {
            completeCycle()
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.log("Speech recognition error:", event.error)
          // Restart recognition on error
          setTimeout(() => {
            if (voiceEnabled && recognitionRef.current) {
              try {
                recognitionRef.current.start()
              } catch (error) {
                // Ignore restart errors
              }
            }
          }, 1000)
        }

        recognitionRef.current.onend = () => {
          // Restart recognition when it ends
          if (voiceEnabled && recognitionRef.current) {
            try {
              recognitionRef.current.start()
            } catch (error) {
              // Ignore restart errors
            }
          }
        }

        recognitionRef.current.start()
      }
    } catch (error) {
      console.log("Speech recognition not available")
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  }, [voiceEnabled, startCounter, pauseCounter, completeCycle])

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
  }

  // Calculate pulse animation
  const pulseScale = 1 + Math.sin(pulsePhase * Math.PI * 0.5) * 0.2
  const pulseOpacity = 0.6 + Math.sin(pulsePhase * Math.PI * 0.5) * 0.4

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-3xl font-bold mb-6">START COMPRESSIONS</h1>

        {/* Instructions */}
        <div className="px-6 space-y-3 text-lg">
          <p className="font-bold">Place the heel of one hand on the center of the chest.</p>
          <p className="font-bold">Place your other hand on top. Lock your elbows.</p>
          <p className="font-bold">
            Push hard and fast — at least 2 inches deep and at a rate of 100–120 compressions per minute.
          </p>
        </div>
      </div>

      {/* Center - Counter and Metronome */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Counter with Circle - Tightly around the number only */}
        <div className="relative inline-block mb-12">
          {/* Pulsing Circle - Sized exactly for the number */}
          <div
            className="absolute inset-0 rounded-full border-4 border-red-500 transition-all duration-150 ease-in-out"
            style={{
              transform: `scale(${pulseScale})`,
              opacity: pulseOpacity,
              backgroundColor: `rgba(239, 68, 68, ${isActive ? 0.1 : 0.03})`,
              boxShadow: isActive ? `0 0 30px rgba(239, 68, 68, ${pulseOpacity * 0.3})` : "none",
              width: "180px",
              height: "180px",
              left: "50%",
              top: "50%",
              marginLeft: "-90px",
              marginTop: "-90px",
            }}
          />

          {/* Compression Counter - Centered in the circle */}
          <div className="relative z-10 text-8xl font-bold text-white tabular-nums w-[180px] h-[180px] flex items-center justify-center">
            {compressionCount}
          </div>
        </div>

        {/* Text content - Completely separate from circle */}
        <div className="text-center space-y-4">
          {/* Progress indicator */}
          <div className="text-xl text-gray-300">{compressionCount}/30 compressions</div>

          {/* Progress bar */}
          <div className="w-64 bg-gray-700 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(compressionCount / 30) * 100}%` }}
            />
          </div>

          {/* Status indicator */}
          <div className="text-lg">
            {isActive ? (
              <span className="text-green-400 font-bold">● ACTIVE - Keep Going!</span>
            ) : compressionCount >= 30 ? (
              <span className="text-blue-400 font-bold">✓ COMPLETE - Ready for Next Step</span>
            ) : (
              <span className="text-yellow-400 font-bold">● READY - Say "Begin" or Tap Start</span>
            )}
          </div>
        </div>
      </div>

      {/* Voice Prompts */}
      {voiceEnabled && (
        <div className="text-center px-6 mb-6">
          <p className="text-sm italic text-gray-300">
            Say "Begin" to start • Say "Pause" to stop • Say "Done" when completed
          </p>
        </div>
      )}

      {/* Bottom Buttons */}
      <div className="p-6 space-y-4">
        {/* Main action button */}
        {!isActive && compressionCount < 30 ? (
          <Button
            onClick={startCounter}
            className="w-full h-14 bg-red-600 text-white font-bold text-lg hover:bg-red-700"
          >
            ▶️ START COMPRESSIONS
          </Button>
        ) : isActive ? (
          <Button
            onClick={pauseCounter}
            className="w-full h-14 bg-yellow-600 text-white font-bold text-lg hover:bg-yellow-700"
          >
            ⏸️ PAUSE
          </Button>
        ) : (
          <Button
            onClick={completeCycle}
            className="w-full h-14 bg-white text-black font-bold text-lg hover:bg-gray-200"
          >
            ✅ Done with 30 Compressions
          </Button>
        )}

        <div className="flex gap-4">
          <Button
            onClick={toggleVoice}
            variant="outline"
            className="flex-1 h-12 border-white text-white hover:bg-white hover:text-black bg-transparent"
          >
            {voiceEnabled ? <Mic className="w-5 h-5 mr-2" /> : <MicOff className="w-5 h-5 mr-2" />}
            Voice {voiceEnabled ? "On" : "Off"}
          </Button>

          <Button
            onClick={() => setShowDemo(true)}
            variant="outline"
            className="flex-1 h-12 border-white text-white hover:bg-white hover:text-black bg-transparent"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>
      </div>

      {/* Demo Modal */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="bg-black border-white text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">CPR Compression Demo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-transparent border border-white rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-4">
                  <div className="w-full h-full rounded-full animate-ping bg-red-400" />
                </div>
                <p className="text-sm font-bold">Push Hard & Fast</p>
                <p className="text-xs text-gray-400">100-120 per minute</p>
                <p className="text-xs text-gray-400">At least 2 inches deep</p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div className="bg-red-500 h-2 rounded-full animate-pulse w-full" />
              </div>
              <p className="text-xs text-gray-400">Continuous rhythm - don't stop</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
