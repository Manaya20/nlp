"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Home,
  MessageSquare,
  PiggyBank,
  LineChart,
  Shield,
  IndianRupee,
  Landmark,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function Sidebar() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Navigation items for the sidebar
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Assistant",
      //href: "/assistant",
      href:"https://geniestockbot.vercel.app/",
      icon: MessageSquare,
    },
    {
      name: "Budgeting",
      href: "/budgeting",
      icon: PiggyBank,
    },
    {
      name: "Saving",
      href: "/saving",
      icon: IndianRupee,
    },
    {
      name: "Investments",
      href: "/investments",
      icon: LineChart,
    },
    {
      name: "Policies",
      href: "/policies",
      icon: Shield,
    },
    {
      name: "Loans",
      href: "/loans",
      icon: Landmark,
    },
    {
      name: "Taxes",
      href: "/taxes",
      icon: FileText,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: Settings,
    },
  ]

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 z-40 h-screen
          bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-[70px]" : "w-64"}
          ${isMobileOpen ? "left-0" : "-left-full md:left-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/dashboard" className="flex items-center">
              {!isCollapsed && (
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                  Genie
                </span>
              )}
              {isCollapsed && (
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                  G
                </span>
              )}
            </Link>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronRight className={`h-4 w-4 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center rounded-md px-3 py-2 text-sm font-medium
                      ${
                        pathname === item.href
                          ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    <item.icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              aria-label="Log out"
              className="text-gray-700 dark:text-gray-300"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
