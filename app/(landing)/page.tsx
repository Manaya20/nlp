import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PiggyBank, LineChart, Shield, FileText, Landmark, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with animated background */}
      <section className="relative min-h-[94vh] py-32 px-4 text-white overflow-hidden">
        {/* Animated background with enhanced visual effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-900 dark:via-indigo-800 dark:to-purple-950">
          {/* Animated particles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-fuchsia-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
          </div>

          {/* Light beams effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-1 h-full bg-white/20 skew-x-12 transform"></div>
            <div className="absolute top-0 left-1/2 w-1 h-full bg-white/10 -skew-x-12 transform"></div>
            <div className="absolute top-0 right-1/4 w-1 h-full bg-white/15 skew-x-12 transform"></div>
          </div>

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100 drop-shadow-sm">
              Your Personal Financial Genius
            </h1>
            <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed max-w-2xl">
              Genie helps you manage your finances, save money, and make smarter financial decisions through AI-powered
              guidance tailored to your unique financial situation.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-700 hover:bg-white/90 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/register">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white bg-purple-700/30 hover:bg-purple-700/50 px-8 py-6 text-lg rounded-full dark:bg-transparent"
              >
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Financial Tools at Your Fingertips</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/budgeting">
              <FeatureCard
                icon={<PiggyBank className="h-10 w-10 text-purple-500" />}
                title="Budgeting"
                description="Create personalized budgets and track your spending habits to stay on top of your finances."
              />
            </Link>
            <Link href="/investments">
              <FeatureCard
                icon={<LineChart className="h-10 w-10 text-blue-500" />}
                title="Investments"
                description="Get tailored investment advice based on your risk tolerance and financial goals."
              />
            </Link>
            <Link href="/policies">
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-green-500" />}
                title="Insurance Policies"
                description="Compare insurance policies and find the best coverage for your needs and budget."
              />
            </Link>
            <Link href="/loans">
              <FeatureCard
                icon={<Landmark className="h-10 w-10 text-yellow-500" />}
                title="Loans"
                description="Calculate loan EMIs and get personalized recommendations for your loan requirements."
              />
            </Link>
            <Link href="/taxes">
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-red-500" />}
                title="Taxes"
                description="Understand your tax liabilities and learn about deductions to optimize your tax payments."
              />
            </Link>
            <Link href="/assistant">
              <FeatureCard
                icon={<MessageSquare className="h-10 w-10 text-indigo-500" />}
                title="AI Assistant"
                description="Chat with our AI assistant to get instant answers to all your financial questions."
              />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How Genie Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowItWorksCard
              step="1"
              title="Create Your Profile"
              description="Sign up and tell us about your financial goals and current situation."
            />
            <HowItWorksCard
              step="2"
              title="Get Personalized Insights"
              description="Our AI analyzes your data and provides tailored financial recommendations."
            />
            <HowItWorksCard
              step="3"
              title="Take Action & Track Progress"
              description="Implement the suggestions and track your progress towards financial freedom."
            />
          </div>
        </div>
      </section>

      {/* Security Message */}
      <section id="security" className="py-10 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/4 flex justify-center">
                <Shield className="h-16 w-16 text-purple-500" />
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold mb-2">Your Data is Secure with Us</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Genie is fully GDPR-compliant and uses bank-level encryption to protect your financial information. We
                  never share your data with third parties without your explicit consent. Your privacy and security are
                  our top priorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow h-full">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function HowItWorksCard({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center">
      <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {step}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
