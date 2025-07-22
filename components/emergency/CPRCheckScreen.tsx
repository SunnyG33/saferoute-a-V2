"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Phone, X } from "lucide-react"

interface CPRCheckScreenProps {
  onStartCPR: () => void
  onExit: () => void
  autoCall911?: boolean
}

export default function CPRCheckScreen({ onStartCPR, onExit, autoCall911 = true }: CPRCheckScreenProps) {
  const [showDemo, setShowDemo] = useState(false)
  const [show911Modal, setShow911Modal] = useState(false)
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)
  const [voicePromptTimer, setVoicePromptTimer] = useState<NodeJS.Timeout | null>(null)
  const [demoProgress, setDemoProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const screenRef = useRef<HTMLDivElement>(null)
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Set max brightness and prevent sleep
  useEffect(() => {
    // Request wake lock to prevent screen from sleeping
    let wakeLock: any = null

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await (navigator as any).wakeLock.request("screen")
        }
      } catch (err) {
        console.log("Wake lock failed:", err)
      }
    }

    requestWakeLock()

    // Set screen brightness to max (if supported)
    if ("screen" in navigator && "brightness" in (navigator as any).screen) {
      try {
        ;(navigator as any).screen.brightness = 1.0
      } catch (err) {
        console.log("Brightness control not supported")
      }
    }

    return () => {
      if (wakeLock) {
        wakeLock.release()
      }
    }
  }, [])

  // Voice recognition setup
  useEffect(() => {
    let recognition: any = null

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase()

        if (transcript.includes("start") || transcript.includes("cpr")) {
          handleStartCPR()
        }
      }

      recognition.onerror = (event: any) => {
        console.log("Speech recognition error:", event.error)
      }

      recognition.start()
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  // Timer management
  useEffect(() => {
    startTimers()
    return () => {
      clearAllTimers()
    }
  }, [])

  const startTimers = () => {
    clearAllTimers()

    // Voice prompt timer (15 seconds)
    const voiceTimer = setTimeout(() => {
      speakPrompt("Say 'Start' or tap below to begin CPR")
    }, 15000)
    setVoicePromptTimer(voiceTimer)

    // 911 modal timer (20 seconds)
    if (autoCall911) {
      const modalTimer = setTimeout(() => {
        setShow911Modal(true)
      }, 20000)
      setIdleTimer(modalTimer)
    }
  }

  const clearAllTimers = () => {
    if (idleTimer) {
      clearTimeout(idleTimer)
      setIdleTimer(null)
    }
    if (voicePromptTimer) {
      clearTimeout(voicePromptTimer)
      setVoicePromptTimer(null)
    }
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current)
      demoIntervalRef.current = null
    }
  }

  const resetTimers = () => {
    startTimers()
  }

  const speakPrompt = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      speechSynthesis.speak(utterance)
    }
  }

  const handleStartCPR = () => {
    clearAllTimers()
    onStartCPR()
  }

  const handleCall911 = () => {
    setShow911Modal(false)
    // Simulate calling 911
    if ("navigator" in window && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200])
    }
    alert("Emergency services are being contacted...")
  }

  const handleDismiss911Modal = () => {
    setShow911Modal(false)
    resetTimers()
  }

  const showModal = (modalType: string) => {
    if (modalType === "CPRBreathingDemo") {
      clearAllTimers()
      setShowDemo(true)
      startDemoAnimation()
    }
  }

  const startDemoAnimation = () => {
    setIsPlaying(true)
    setDemoProgress(0)

    // 15-second looping animation
    demoIntervalRef.current = setInterval(() => {
      setDemoProgress((prev) => {
        if (prev >= 100) {
          return 0 // Loop back to start
        }
        return prev + 100 / 150 // 15 seconds = 150 intervals of 100ms
      })
    }, 100)
  }

  const handleCloseDemo = () => {
    setShowDemo(false)
    setIsPlaying(false)
    setDemoProgress(0)
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current)
      demoIntervalRef.current = null
    }
    resetTimers()
  }

  const handleUserInteraction = () => {
    resetTimers()
  }

  const getDemoStep = () => {
    if (demoProgress < 33) {
      return {
        title: "Step 1: Tap & Shout",
        description: "Tap their shoulder and shout 'Are you OK?'",
        icon: "👋",
      }
    } else if (demoProgress < 66) {
      return {
        title: "Step 2: Chin Lift",
        description: "Tilt their head back and lift their chin",
        icon: "🤲",
      }
    } else {
      return {
        title: "Step 3: Check Breathing",
        description: "Look, listen, and feel for normal breathing",
        icon: "👂",
      }
    }
  }

  const currentStep = getDemoStep()

  return (
    <div
      ref={screenRef}
      className="min-h-screen bg-black text-white flex flex-col font-sans"
      style={{ fontFamily: "Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" }}
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      {/* Exit Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={onExit}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 border border-white/30"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white leading-tight">IS THE PERSON BREATHING?</h1>
        </div>

        {/* Step List */}
        <div className="space-y-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p className="text-lg leading-relaxed">Tap their shoulder and shout, "Are you OK?"</p>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p className="text-lg leading-relaxed">Tilt their head back and lift their chin.</p>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p className="text-lg leading-relaxed">Look, listen, and feel for normal breathing (10 seconds max).</p>
          </div>
        </div>

        {/* Voice Prompt Footer */}
        <div className="text-center">
          <p className="text-white/80 text-sm italic">Say 'Start' or tap below to begin CPR.</p>
        </div>

        {/* CTA Button */}
        <div className="px-4">
          <Button
            onClick={handleStartCPR}
            className="w-full bg-white text-black font-bold text-xl py-6 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ minHeight: "64px", fontSize: "20px" }}
          >
            START CPR NOW
          </Button>
        </div>

        {/* Watch Demo */}
        <div className="text-center">
          <button
            onClick={() => showModal("CPRBreathingDemo")}
            className="flex items-center justify-center space-x-2 text-white/80 hover:text-white transition-colors mx-auto"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <Play className="h-4 w-4" />
            <span className="text-sm">Watch Demo</span>
          </button>
        </div>
      </div>

      {/* Demo Modal - 15 Second Silent Looping Animation */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-black mb-2">CPR Breathing Check Demo</h3>

              {/* Animated Demo Area */}
              <div className="bg-gray-100 rounded-lg h-48 flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-2 left-2 right-2 h-1 bg-gray-300 rounded">
                  <div
                    className="h-full bg-blue-500 rounded transition-all duration-100"
                    style={{ width: `${demoProgress}%` }}
                  />
                </div>

                {/* Demo Content */}
                <div className="text-center">
                  <div className="text-4xl mb-2">{currentStep.icon}</div>
                  <h4 className="font-semibold text-gray-800 mb-1">{currentStep.title}</h4>
                  <p className="text-sm text-gray-600 px-2">{currentStep.description}</p>
                </div>

                {/* Loop Indicator */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {isPlaying ? "Playing..." : "Paused"} • 15s Loop
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">Silent demonstration • Loops automatically</p>
            </div>

            <Button onClick={handleCloseDemo} className="w-full bg-black text-white hover:bg-gray-800">
              Close Demo
            </Button>
          </div>
        </div>
      )}

      {/* 911 Modal */}
      {show911Modal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <div className="mb-6">
              <Phone className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-black mb-2">Emergency Detected</h2>
              <p className="text-gray-600">Do you want to call emergency services now?</p>
            </div>

            <div className="space-y-3">
              <Button onClick={handleCall911} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">
                <Phone className="h-5 w-5 mr-2" />
                Call 911 Now
              </Button>
              <Button
                onClick={handleDismiss911Modal}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 bg-transparent"
              >
                I'm OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
