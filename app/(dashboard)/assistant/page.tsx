"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Send, Bot, User, Paperclip, Mic, Loader2 } from "lucide-react"

// Define message type
type Message = {
  id: string
  content: string
  role: "assistant" | "user"
  timestamp: Date
}

// Sample responses for the AI assistant
const sampleResponses = [
  "Based on your current spending habits, I recommend setting aside 20% of your income for savings and investments.",
  "Looking at your budget, your dining out expenses are higher than average. Consider cooking at home more often to save money.",
  "Your emergency fund should ideally cover 3-6 months of expenses. Based on your current situation, aim for at least $12,000.",
  "I've analyzed your investment portfolio. Consider diversifying more by adding some index funds to reduce risk.",
  "For your income level, a Roth IRA might be more beneficial than a traditional IRA. Would you like me to explain why?",
  "Your debt-to-income ratio is currently 28%, which is within the healthy range. Keep up the good work!",
  "Based on your goals, you should be able to save enough for a down payment on a house within 2 years if you increase your monthly savings by $200.",
  "I notice you haven't been maximizing your 401(k) contributions. Increasing your contribution rate could significantly reduce your tax burden.",
]

export default function AssistantPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Genie, your AI financial assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking and responding
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Handle file upload
  const handleFileUpload = () => {
    toast({
      title: "File upload",
      description: "File upload functionality is not implemented in this demo.",
    })
  }

  // Handle voice input
  const handleVoiceInput = () => {
    toast({
      title: "Voice input",
      description: "Voice input functionality is not implemented in this demo.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">AI Financial Assistant</CardTitle>
          <CardDescription>
            Ask me anything about your finances, budgeting, investments, or financial planning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 h-[60vh] flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <Avatar className={message.role === "assistant" ? "mt-1" : "mt-1"}>
                        {message.role === "assistant" ? (
                          <>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="bg-purple-600 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="bg-blue-600 text-white">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "assistant"
                            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            : "bg-purple-600 text-white"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === "assistant" ? "text-gray-500" : "text-purple-200"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <Avatar className="mt-1">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-purple-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="p-3 rounded-lg bg-white dark:bg-gray-800">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleFileUpload}>
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleVoiceInput}>
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </Button>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
              {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
