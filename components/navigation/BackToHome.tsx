"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export function BackToHome() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link href="/">
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <Link href="/wireframes">
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Home className="h-4 w-4" />
          All Wireframes
        </Button>
      </Link>
    </div>
  )
}
