"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, CloudRain, Route, MessageSquare, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const tools = [
  { name: "Weather Dashboard", href: "/tools/weather", icon: CloudRain },
  { name: "Route Optimizer", href: "/tools/route-optimizer", icon: Route },
  { name: "Maritime Chatbot", href: "/tools/chatbot", icon: MessageSquare },
  { name: "Risk Assessment", href: "/tools/risk-assessment", icon: AlertTriangle },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    setIsLoaded(true)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-[#003366] shadow-md py-2" : "bg-[#003366]/90 py-4",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden">
              {isLoaded ? (
                <Image
                  src="https://app.panyero.website/main/assets/images/logo/panyero.png"
                  alt="Panyero Logo"
                  width={40}
                  height={40}
                  className="object-contain transition-opacity duration-300"
                  priority={false}
                />
              ) : (
                <div className="h-10 w-10 bg-blue-200/20 animate-pulse rounded-md"></div>
              )}
            </div>
            <span className="text-white font-bold text-xl font-['Roboto',_'Helvetica',_sans-serif]">
              Maritime Tools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium font-['Roboto',_'Helvetica',_sans-serif] flex items-center gap-1.5 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{tool.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-3">
            <div className="flex flex-col space-y-1">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="text-white/90 hover:text-white px-2 py-2 rounded-md text-base font-medium font-['Roboto',_'Helvetica',_sans-serif] flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tool.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
