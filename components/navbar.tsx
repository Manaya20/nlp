"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, LogIn } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isLoggedIn =
    pathname.includes("/dashboard") ||
    pathname.includes("/assistant") ||
    pathname.includes("/budgeting") ||
    pathname.includes("/saving") ||
    pathname.includes("/policies") ||
    pathname.includes("/investments") ||
    pathname.includes("/loans") ||
    pathname.includes("/taxes") ||
    pathname.includes("/profile")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Genie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium ${pathname === "/" ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"}`}
            >
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium ${pathname === "/dashboard" ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/assistant"
                  className={`text-sm font-medium ${pathname === "/assistant" ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"}`}
                >
                  Assistant
                </Link>
                <Link
                  href="/profile"
                  className={`text-sm font-medium ${pathname === "/profile" ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"}`}
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="#features"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <ModeToggle />

            {isLoggedIn ? (
              <Button asChild variant="default" size="sm">
                <Link href="/">Log Out</Link>
              </Button>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Log In
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/"
              className={`block py-2 px-3 rounded-md ${pathname === "/" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block py-2 px-3 rounded-md ${pathname === "/dashboard" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/assistant"
                  className={`block py-2 px-3 rounded-md ${pathname === "/assistant" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  onClick={toggleMenu}
                >
                  Assistant
                </Link>
                <Link
                  href="/profile"
                  className={`block py-2 px-3 rounded-md ${pathname === "/profile" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="#features"
                  className="block py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={toggleMenu}
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={toggleMenu}
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={toggleMenu}
                >
                  Contact
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
