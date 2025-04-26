"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart, TrendingUp, Shield, IndianRupee, AlertTriangle } from "lucide-react"

export default function InvestmentsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [riskProfile, setRiskProfile] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Quiz questions
  const questions = [
    {
      question: "How long do you plan to invest your money?",
      options: [
        { value: "a", label: "Less than 1 year" },
        { value: "b", label: "1-3 years" },
        { value: "c", label: "3-5 years" },
        { value: "d", label: "5-10 years" },
        { value: "e", label: "More than 10 years" },
      ],
    },
    {
      question: "How would you react if your investments lost 20% of their value in a month?",
      options: [
        { value: "a", label: "Sell everything immediately to prevent further losses" },
        { value: "b", label: "Sell some investments to reduce risk" },
        { value: "c", label: "Do nothing and wait for recovery" },
        { value: "d", label: "Buy more investments at the lower price" },
        { value: "e", label: "Significantly increase your investments to capitalize on the dip" },
      ],
    },
    {
      question: "What is your primary investment goal?",
      options: [
        { value: "a", label: "Preserve capital with minimal risk" },
        { value: "b", label: "Generate income with low to moderate risk" },
        { value: "c", label: "Balance growth and income with moderate risk" },
        { value: "d", label: "Achieve growth with moderate to high risk" },
        { value: "e", label: "Maximize growth with high risk" },
      ],
    },
    {
      question: "How much investment experience do you have?",
      options: [
        { value: "a", label: "None" },
        { value: "b", label: "Limited (less than 1 year)" },
        { value: "c", label: "Some (1-3 years)" },
        { value: "d", label: "Experienced (3-10 years)" },
        { value: "e", label: "Very experienced (more than 10 years)" },
      ],
    },
    {
      question: "What percentage of your total savings are you planning to invest?",
      options: [
        { value: "a", label: "Less than 10%" },
        { value: "b", label: "10-25%" },
        { value: "c", label: "25-50%" },
        { value: "d", label: "50-75%" },
        { value: "e", label: "More than 75%" },
      ],
    },
  ]

  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
  }

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateRiskProfile()
      setShowResults(true)
    }
  }

  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Calculate risk profile based on answers
  const calculateRiskProfile = () => {
    // Count the frequency of each answer
    const answerCounts: Record<string, number> = answers.reduce(
      (acc, answer) => {
        acc[answer] = (acc[answer] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Determine the most frequent answer
    let maxCount = 0
    let mostFrequentAnswer = ""

    for (const [answer, count] of Object.entries(answerCounts)) {
      if (count > maxCount) {
        maxCount = count
        mostFrequentAnswer = answer
      }
    }

    // Map the most frequent answer to a risk profile
    switch (mostFrequentAnswer) {
      case "a":
        setRiskProfile("Conservative")
        break
      case "b":
        setRiskProfile("Moderately Conservative")
        break
      case "c":
        setRiskProfile("Moderate")
        break
      case "d":
        setRiskProfile("Moderately Aggressive")
        break
      case "e":
        setRiskProfile("Aggressive")
        break
      default:
        setRiskProfile("Moderate") // Default to moderate if no clear pattern
    }
  }

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setRiskProfile(null)
    setShowResults(false)
  }

  // Investment recommendations based on risk profile
  const investmentRecommendations: Record<string, any> = {
    Conservative: {
      description: "You prioritize capital preservation and are uncomfortable with significant market fluctuations.",
      allocation: {
        Bonds: 60,
        "Large-Cap Stocks": 20,
        "Mid-Cap Stocks": 10,
        "International Stocks": 5,
        Cash: 5,
      },
      funds: [
        {
          name: "Treasury Bond Fund",
          risk: "Low",
          return: "2-4%",
          description: "Government-backed securities with minimal risk",
        },
        {
          name: "Investment Grade Corporate Bond Fund",
          risk: "Low-Medium",
          return: "3-5%",
          description: "High-quality corporate bonds",
        },
        {
          name: "Dividend Aristocrats ETF",
          risk: "Medium",
          return: "4-6%",
          description: "Companies with long history of dividend increases",
        },
      ],
    },
    "Moderately Conservative": {
      description: "You seek some growth but still prioritize stability and are cautious about market volatility.",
      allocation: {
        Bonds: 45,
        "Large-Cap Stocks": 30,
        "Mid-Cap Stocks": 15,
        "International Stocks": 5,
        "Small-Cap Stocks": 5,
      },
      funds: [
        {
          name: "Balanced Fund",
          risk: "Medium",
          return: "4-6%",
          description: "Mix of stocks and bonds for stability with growth",
        },
        {
          name: "Blue-Chip Stock Fund",
          risk: "Medium",
          return: "5-7%",
          description: "Established companies with strong track records",
        },
        {
          name: "Municipal Bond Fund",
          risk: "Low-Medium",
          return: "3-5%",
          description: "Tax-advantaged government bonds",
        },
      ],
    },
    Moderate: {
      description:
        "You balance growth and stability, accepting moderate market fluctuations for better long-term returns.",
      allocation: {
        Bonds: 30,
        "Large-Cap Stocks": 30,
        "Mid-Cap Stocks": 20,
        "International Stocks": 15,
        "Small-Cap Stocks": 5,
      },
      funds: [
        {
          name: "Total Market Index Fund",
          risk: "Medium",
          return: "6-8%",
          description: "Broad market exposure across all sectors",
        },
        {
          name: "Growth & Income Fund",
          risk: "Medium",
          return: "5-8%",
          description: "Balance of dividend stocks and growth opportunities",
        },
        {
          name: "International Developed Markets Fund",
          risk: "Medium-High",
          return: "6-9%",
          description: "Exposure to established global economies",
        },
      ],
    },
    "Moderately Aggressive": {
      description:
        "You prioritize growth and can tolerate significant market fluctuations for potentially higher returns.",
      allocation: {
        Bonds: 15,
        "Large-Cap Stocks": 30,
        "Mid-Cap Stocks": 25,
        "International Stocks": 20,
        "Small-Cap Stocks": 10,
      },
      funds: [
        {
          name: "Growth Stock Fund",
          risk: "High",
          return: "8-12%",
          description: "Companies with above-average growth potential",
        },
        {
          name: "Emerging Markets Fund",
          risk: "High",
          return: "8-14%",
          description: "Exposure to developing economies with high growth potential",
        },
        {
          name: "Mid-Cap Value Fund",
          risk: "Medium-High",
          return: "7-10%",
          description: "Medium-sized companies trading below intrinsic value",
        },
      ],
    },
    Aggressive: {
      description:
        "You seek maximum growth and can tolerate substantial market volatility for potentially the highest long-term returns.",
      allocation: {
        Bonds: 5,
        "Large-Cap Stocks": 25,
        "Mid-Cap Stocks": 25,
        "International Stocks": 25,
        "Small-Cap Stocks": 20,
      },
      funds: [
        {
          name: "Small-Cap Growth Fund",
          risk: "Very High",
          return: "10-15%",
          description: "Small companies with high growth potential",
        },
        {
          name: "Sector-Specific Technology Fund",
          risk: "Very High",
          return: "10-18%",
          description: "Focused on technology sector innovation",
        },
        {
          name: "Global Opportunities Fund",
          risk: "Very High",
          return: "9-16%",
          description: "Worldwide investments in high-growth regions and sectors",
        },
      ],
    },
  }

  // Diversification tips
  const diversificationTips = [
    {
      title: "Asset Class Diversification",
      description:
        "Spread investments across different asset classes like stocks, bonds, real estate, and commodities to reduce risk.",
      icon: <BarChart className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Sector Diversification",
      description: "Invest across different industry sectors to protect against downturns in specific industries.",
      icon: <PieChart className="h-10 w-10 text-indigo-500" />,
    },
    {
      title: "Geographic Diversification",
      description:
        "Invest in different countries and regions to reduce exposure to economic or political risks in any single area.",
      icon: <TrendingUp className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Time Diversification",
      description:
        "Invest regularly over time rather than all at once to reduce the impact of market timing and volatility.",
      icon: <Shield className="h-10 w-10 text-green-500" />,
    },
    {
      title: "Risk Level Diversification",
      description: "Balance high-risk, high-return investments with more stable, lower-return options.",
      icon: <AlertTriangle className="h-10 w-10 text-yellow-500" />,
    },
    {
      title: "Investment Size Diversification",
      description:
        "Avoid putting too much of your portfolio in a single investment, regardless of how promising it seems.",
      icon: <IndianRupee className="h-10 w-10 text-red-500" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
        Investment Planning
      </h1>

      <Tabs defaultValue={showResults ? "recommendations" : "quiz"} className="w-full">
        <TabsList className="w-full flex flex-wrap">
          <TabsTrigger value="quiz" className="flex-1 text-xs sm:text-sm">
            Risk Tolerance Quiz
          </TabsTrigger>
          <TabsTrigger value="recommendations" disabled={!showResults} className="flex-1 text-xs sm:text-sm">
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="diversification" className="flex-1 text-xs sm:text-sm">
            Diversification Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assess Your Risk Tolerance</CardTitle>
              <CardDescription>
                Answer these questions to help us understand your investment style and risk tolerance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showResults ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">
                      Question {currentQuestion + 1} of {questions.length}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{questions[currentQuestion].question}</p>
                    <RadioGroup
                      value={answers[currentQuestion]}
                      onValueChange={handleAnswerSelect}
                      className="space-y-3"
                    >
                      {questions[currentQuestion].options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Your Risk Profile: {riskProfile}</h3>
                  <p className="mb-4">{riskProfile && investmentRecommendations[riskProfile].description}</p>
                  <Button onClick={resetQuiz} variant="outline" className="mt-4">
                    Retake Quiz
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0 || showResults}
                variant="outline"
              >
                Previous
              </Button>
              <Button onClick={handleNextQuestion} disabled={!answers[currentQuestion] || showResults}>
                {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          {riskProfile && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Asset Allocation</CardTitle>
                  <CardDescription>
                    Based on your {riskProfile} risk profile, here's a suggested asset allocation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Allocation Breakdown</h3>
                      <div className="space-y-2">
                        {Object.entries(investmentRecommendations[riskProfile].allocation).map(
                          ([asset, percentage]) => (
                            <div key={asset} className="flex justify-between items-center">
                              <span>{asset}</span>
                              <span className="font-medium">{percentage}%</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      {/* Placeholder for a chart - in a real app, you would use a chart library */}
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-white font-bold">Asset Allocation Chart</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Funds</CardTitle>
                  <CardDescription>These funds align with your risk profile and investment goals.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {investmentRecommendations[riskProfile].funds.map((fund, index) => (
                      <Card key={index} className="border border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{fund.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Risk:</span>
                              <span className="font-medium">{fund.risk}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Expected Return:</span>
                              <span className="font-medium">{fund.return}</span>
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{fund.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="diversification" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Diversification Strategies</CardTitle>
              <CardDescription>
                Learn how to spread your investments to reduce risk and optimize returns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diversificationTips.map((tip, index) => (
                  <Card key={index} className="border border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex justify-center mb-2">{tip.icon}</div>
                      <CardTitle className="text-lg text-center">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700 dark:text-gray-300 text-center">{tip.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Sample Diversified Portfolio Models</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conservative Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        <li>60% Bonds</li>
                        <li>25% Large-Cap Stocks</li>
                        <li>10% International Stocks</li>
                        <li>5% Cash</li>
                      </ul>
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Focused on capital preservation with minimal risk.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Balanced Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        <li>40% Bonds</li>
                        <li>30% Large-Cap Stocks</li>
                        <li>15% Mid-Cap Stocks</li>
                        <li>15% International Stocks</li>
                      </ul>
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Equal emphasis on growth and income with moderate risk.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Growth Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        <li>15% Bonds</li>
                        <li>40% Large-Cap Stocks</li>
                        <li>20% Mid-Cap Stocks</li>
                        <li>15% International Stocks</li>
                        <li>10% Small-Cap Stocks</li>
                      </ul>
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Focused on long-term growth with higher risk tolerance.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
