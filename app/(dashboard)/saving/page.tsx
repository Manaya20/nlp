"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  PiggyBank,
  DollarSign,
  Calendar,
  Target,
  TrendingUp,
  Scissors,
  ArrowRight,
  Check,
  Plus,
  Trash2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define saving goal type
type SavingGoal = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  priority: "high" | "medium" | "low"
}

// Define expense cut tip type
type ExpenseCutTip = {
  id: string
  category: string
  description: string
  potentialSavings: number
  difficulty: "easy" | "medium" | "hard"
  implemented: boolean
}

// Mock expense cut tips
const mockExpenseCutTips: ExpenseCutTip[] = [
  {
    id: "1",
    category: "Subscriptions",
    description: "Review and cancel unused streaming services or subscriptions",
    potentialSavings: 30,
    difficulty: "easy",
    implemented: false,
  },
  {
    id: "2",
    category: "Food",
    description: "Meal prep and bring lunch to work instead of eating out",
    potentialSavings: 200,
    difficulty: "medium",
    implemented: false,
  },
  {
    id: "3",
    category: "Utilities",
    description: "Lower thermostat by 2 degrees and use energy-efficient appliances",
    potentialSavings: 50,
    difficulty: "easy",
    implemented: false,
  },
  {
    id: "4",
    category: "Transportation",
    description: "Use public transportation or carpool instead of driving alone",
    potentialSavings: 120,
    difficulty: "medium",
    implemented: false,
  },
  {
    id: "5",
    category: "Shopping",
    description: "Implement a 48-hour rule before making non-essential purchases",
    potentialSavings: 100,
    difficulty: "easy",
    implemented: false,
  },
  {
    id: "6",
    category: "Entertainment",
    description: "Look for free or low-cost entertainment options in your community",
    potentialSavings: 80,
    difficulty: "easy",
    implemented: false,
  },
  {
    id: "7",
    category: "Housing",
    description: "Negotiate rent or refinance mortgage for better rates",
    potentialSavings: 150,
    difficulty: "hard",
    implemented: false,
  },
  {
    id: "8",
    category: "Insurance",
    description: "Shop around and bundle insurance policies for better rates",
    potentialSavings: 75,
    difficulty: "medium",
    implemented: false,
  },
]

export default function SavingPage() {
  const { toast } = useToast()
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000)
  const [monthlySavingTarget, setMonthlySavingTarget] = useState<number>(1000)
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 2500,
      targetDate: "2023-12-31",
      priority: "high",
    },
    {
      id: "2",
      name: "Vacation",
      targetAmount: 3000,
      currentAmount: 1200,
      targetDate: "2023-09-30",
      priority: "medium",
    },
  ])
  const [expenseCutTips, setExpenseCutTips] = useState<ExpenseCutTip[]>(mockExpenseCutTips)
  const [newGoal, setNewGoal] = useState<Partial<SavingGoal>>({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
    priority: "medium",
  })
  const [activeTab, setActiveTab] = useState<string>("goals")

  // Calculate total potential savings
  const totalPotentialSavings = expenseCutTips.reduce(
    (sum, tip) => (tip.implemented ? sum : sum + tip.potentialSavings),
    0,
  )

  // Calculate total implemented savings
  const totalImplementedSavings = expenseCutTips.reduce(
    (sum, tip) => (tip.implemented ? sum + tip.potentialSavings : sum),
    0,
  )

  // Calculate saving rate
  const savingRate = monthlyIncome > 0 ? (monthlySavingTarget / monthlyIncome) * 100 : 0

  // Handle saving goal form submission
  const handleAddSavingGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      })
      return
    }

    const goal: SavingGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: newGoal.targetAmount || 0,
      currentAmount: newGoal.currentAmount || 0,
      targetDate: newGoal.targetDate,
      priority: (newGoal.priority as "high" | "medium" | "low") || "medium",
    }

    setSavingGoals([...savingGoals, goal])
    setNewGoal({
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: "",
      priority: "medium",
    })

    toast({
      title: "Goal added",
      description: `${goal.name} has been added to your saving goals.`,
    })
  }

  // Handle removing a saving goal
  const handleRemoveSavingGoal = (id: string) => {
    setSavingGoals(savingGoals.filter((goal) => goal.id !== id))

    toast({
      title: "Goal removed",
      description: "The saving goal has been removed.",
    })
  }

  // Handle toggling expense cut tip implementation
  const handleToggleTipImplementation = (id: string) => {
    setExpenseCutTips(expenseCutTips.map((tip) => (tip.id === id ? { ...tip, implemented: !tip.implemented } : tip)))

    const tip = expenseCutTips.find((tip) => tip.id === id)
    if (tip) {
      toast({
        title: tip.implemented ? "Tip unmarked" : "Tip implemented",
        description: tip.implemented
          ? `${tip.description} has been removed from your implemented tips.`
          : `${tip.description} has been marked as implemented.`,
      })
    }
  }

  // Calculate months to reach goal
  const calculateMonthsToGoal = (goal: SavingGoal) => {
    const remainingAmount = goal.targetAmount - goal.currentAmount
    if (monthlySavingTarget <= 0) return Number.POSITIVE_INFINITY
    return Math.ceil(remainingAmount / monthlySavingTarget)
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Saving Advice</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Set saving goals, create monthly saving plans, and find ways to cut expenses
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="goals">Saving Goals</TabsTrigger>
            <TabsTrigger value="plan">Monthly Plan</TabsTrigger>
            <TabsTrigger value="tips">Expense Cutting</TabsTrigger>
          </TabsList>

          <TabsContent value="goals">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savingGoals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{goal.name}</CardTitle>
                        <CardDescription>Target: ₹{goal.targetAmount.toLocaleString()}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveSavingGoal(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove {goal.name}</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-sm font-medium">
                            ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Target Date</span>
                          </div>
                          <p className="text-sm font-medium">{formatDate(goal.targetDate)}</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <div className="flex items-center mb-1">
                            <Target className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Priority</span>
                          </div>
                          <p className="text-sm font-medium capitalize">{goal.priority}</p>
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <div className="flex items-center mb-1">
                          <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Monthly Projection</span>
                        </div>
                        <p className="text-sm">
                          {monthlySavingTarget > 0
                            ? `You'll reach this goal in approximately ${calculateMonthsToGoal(goal)} months.`
                            : "Set a monthly saving target to see projections."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Goal Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Goal</CardTitle>
                  <CardDescription>Create a new saving goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-name">Goal Name</Label>
                      <Input
                        id="goal-name"
                        placeholder="e.g., New Car, Vacation"
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target-amount">Target Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          id="target-amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-10"
                          value={newGoal.targetAmount || ""}
                          onChange={(e) =>
                            setNewGoal({ ...newGoal, targetAmount: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current-amount">Current Amount (Optional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          id="current-amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-10"
                          value={newGoal.currentAmount || ""}
                          onChange={(e) =>
                            setNewGoal({ ...newGoal, currentAmount: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target-date">Target Date</Label>
                      <Input
                        id="target-date"
                        type="date"
                        value={newGoal.targetDate}
                        onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newGoal.priority}
                        onValueChange={(value) =>
                          setNewGoal({ ...newGoal, priority: value as "high" | "medium" | "low" })
                        }
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-2" onClick={handleAddSavingGoal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plan">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Saving Plan</CardTitle>
                  <CardDescription>Set your monthly saving target</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="monthly-income">Monthly Income (After Tax)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          id="monthly-income"
                          type="number"
                          placeholder="0.00"
                          className="pl-10"
                          value={monthlyIncome || ""}
                          onChange={(e) => setMonthlyIncome(Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label htmlFor="monthly-saving">Monthly Saving Target</Label>
                        <span className="text-sm font-medium">₹{monthlySavingTarget}</span>
                      </div>
                      <Slider
                        id="monthly-saving"
                        min={0}
                        max={monthlyIncome}
                        step={50}
                        value={[monthlySavingTarget]}
                        onValueChange={(value) => setMonthlySavingTarget(value[0])}
                      />
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>₹0</span>
                        <span>₹{monthlyIncome}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Saving Rate</span>
                        <span className="text-sm font-medium">{savingRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={savingRate} className="h-2" />
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        {savingRate < 10
                          ? "Your saving rate is low. Consider increasing your savings to at least 10-15% of your income."
                          : savingRate < 20
                            ? "Your saving rate is good. The recommended saving rate is 15-20% of your income."
                            : "Excellent saving rate! You're on track to build significant savings."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Saving Allocation</CardTitle>
                  <CardDescription>How your monthly savings are allocated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {savingGoals.length > 0 ? (
                      <>
                        <div className="space-y-4">
                          {savingGoals.map((goal) => {
                            // Calculate allocation based on priority
                            let allocation = 0
                            const totalGoals = savingGoals.length

                            if (goal.priority === "high") {
                              allocation =
                                (monthlySavingTarget * 0.5) /
                                (savingGoals.filter((g) => g.priority === "high").length || 1)
                            } else if (goal.priority === "medium") {
                              allocation =
                                (monthlySavingTarget * 0.3) /
                                (savingGoals.filter((g) => g.priority === "medium").length || 1)
                            } else {
                              allocation =
                                (monthlySavingTarget * 0.2) /
                                (savingGoals.filter((g) => g.priority === "low").length || 1)
                            }

                            return (
                              <div key={goal.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                  <div>
                                    <h3 className="font-medium">{goal.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      ₹{goal.currentAmount.toLocaleString()} of ₹{goal.targetAmount.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">₹{allocation.toFixed(2)}/month</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {((allocation / monthlySavingTarget) * 100).toFixed(0)}% of savings
                                    </p>
                                  </div>
                                </div>
                                <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2" />
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                  At this rate, you'll reach your goal in approximately{" "}
                                  {Math.ceil((goal.targetAmount - goal.currentAmount) / allocation)} months.
                                </p>
                              </div>
                            )
                          })}
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 flex items-center">
                            <PiggyBank className="h-4 w-4 text-purple-500 mr-2" />
                            Saving Recommendation
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {savingRate < 15
                              ? "Try to increase your saving rate to at least 15-20% of your income for long-term financial security."
                              : "You're on track with your saving goals. Consider automating your savings to make it even easier."}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <PiggyBank className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="font-medium mb-2">No Saving Goals Yet</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Create saving goals to see how your monthly savings should be allocated.
                        </p>
                        <Button onClick={() => setActiveTab("goals")} className="bg-purple-600 hover:bg-purple-700">
                          Create Saving Goals
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Cutting Tips</CardTitle>
                    <CardDescription>Implement these tips to increase your saving potential</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expenseCutTips.map((tip) => (
                        <div
                          key={tip.id}
                          className={`p-4 rounded-lg border ${
                            tip.implemented
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className="font-medium">{tip.category}</span>
                                <span
                                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                    tip.difficulty === "easy"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : tip.difficulty === "medium"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {tip.difficulty}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">{tip.description}</p>
                              <div className="flex items-center">
                                <Scissors className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium">
                                  Potential monthly savings: ₹{tip.potentialSavings}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant={tip.implemented ? "default" : "outline"}
                              size="sm"
                              className={tip.implemented ? "bg-green-600 hover:bg-green-700" : ""}
                              onClick={() => handleToggleTipImplementation(tip.id)}
                            >
                              {tip.implemented ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Implemented
                                </>
                              ) : (
                                "Mark as Implemented"
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Savings Summary</CardTitle>
                    <CardDescription>Track your potential savings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Potential Monthly Savings</h3>
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-2xl font-bold">₹{totalPotentialSavings}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Implement all tips to save this amount monthly
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Implemented Savings</h3>
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-2xl font-bold">₹{totalImplementedSavings}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-sm font-medium">
                              {totalImplementedSavings > 0
                                ? `${((totalImplementedSavings / (totalImplementedSavings + totalPotentialSavings)) * 100).toFixed(0)}%`
                                : "0%"}
                            </span>
                          </div>
                          <Progress
                            value={
                              totalImplementedSavings > 0
                                ? (totalImplementedSavings / (totalImplementedSavings + totalPotentialSavings)) * 100
                                : 0
                            }
                            className="h-2"
                          />
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
                          Impact on Saving Goals
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          By implementing all tips, you could increase your monthly savings by ₹{totalPotentialSavings},
                          potentially reaching your goals{" "}
                          {totalPotentialSavings > 0
                            ? `${Math.round((totalPotentialSavings / (monthlySavingTarget || 1)) * 100)}% faster`
                            : "faster"}
                          .
                        </p>
                      </div>

                      <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setActiveTab("plan")}>
                        Update Saving Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
