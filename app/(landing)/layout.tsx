import type React from "react"
import { LandingNavbar } from "@/components/landing-navbar"
import { Footer } from "@/components/footer"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
