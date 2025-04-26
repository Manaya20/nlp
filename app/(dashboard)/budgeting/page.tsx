"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, DollarSign, Lightbulb, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Import React Chart.js components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

// Define expense category types
type ExpenseCategory = {
  id: string
  name: string
  amount: number
  color: string
}

// Define budget tips
const budgetingTips = [
  "Follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
  "Track all your expenses for at least a month to understand your spending patterns.",
  "Use cash for discretionary spending to make it more tangible and help you spend less.",
  "Review and cancel unused subscriptions and memberships.",
  "Plan your meals and grocery shopping to reduce food waste and dining out expenses.",
  "Wait 24-48 hours before making non-essential purchases to avoid impulse buying.",
  "Set up automatic transfers to your savings account on payday.",
  "Use the envelope system for categories where you tend to overspend.",
  "Negotiate your bills annually (internet, phone, insurance, etc.).",
  "Consider a no-spend challenge for a week or month to reset your spending habits.",
]

// Random color generator for chart segments
const getRandomColor = () => {
  const colors = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(199, 199, 199, 0.8)",
    "rgba(83, 102, 255, 0.8)",
    "rgba(78, 205, 196, 0.8)",
    "rgba(255, 99, 71, 0.8)",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export default function BudgetingPage() {
  const { toast } = useToast()
  const [income, setIncome] = useState<number>(0)
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([
    { id: "1", name: "Housing", amount: 0, color: getRandomColor() },
    { id: "2", name: "Food", amount: 0, color: getRandomColor() },
    { id: "3", name: "Transportation", amount: 0, color: getRandomColor() },
    { id: "4", name: "Utilities", amount: 0, color: getRandomColor() },
    { id: "5", name: "Entertainment", amount: 0, color: getRandomColor() },
  ])
  const [newCategoryName, setNewCategoryName] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("input")

  // Calculate total expenses
  const totalExpenses = expenseCategories.reduce((sum, category) => sum + category.amount, 0)

  // Calculate remaining budget
  const remainingBudget = income - totalExpenses

  // Calculate percentages for the 50/30/20 rule
  const needsPercentage = 50
  const wantsPercentage = 30
  const savingsPercentage = 20

  const needsAmount = income * (needsPercentage / 100)
  const wantsAmount = income * (wantsPercentage / 100)
  const savingsAmount = income * (savingsPercentage / 100)

  // Handle income change
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    setIncome(value)
  }

  // Handle expense category amount change
  const handleCategoryAmountChange = (id: string, amount: number) => {
    setExpenseCategories(expenseCategories.map((category) => (category.id === id ? { ...category, amount } : category)))
  }

  // Add new expense category
  const addExpenseCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a category name.",
      })
      return
    }

    const newCategory: ExpenseCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      amount: 0,
      color: getRandomColor(),
    }

    setExpenseCategories([...expenseCategories, newCategory])
    setNewCategoryName("")

    toast({
      title: "Category added",
      description: `${newCategoryName} has been added to your budget.`,
    })
  }

  // Remove expense category
  const removeExpenseCategory = (id: string) => {
    setExpenseCategories(expenseCategories.filter((category) => category.id !== id))

    toast({
      title: "Category removed",
      description: "The category has been removed from your budget.",
    })
  }

  // Generate chart data for pie chart
  const pieChartData = {
    labels: expenseCategories.map((category) => category.name),
    datasets: [
      {
        data: expenseCategories.map((category) => category.amount),
        backgroundColor: expenseCategories.map((category) => category.color),
        borderWidth: 1,
      },
    ],
  }

  // Generate chart data for bar chart (50/30/20 rule)
  const barChartData = {
    labels: ["Needs (50%)", "Wants (30%)", "Savings (20%)"],
    datasets: [
      {
        label: "Recommended",
        data: [needsAmount, wantsAmount, savingsAmount],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Your Budget",
        data: [
          // Simplified categorization for demo purposes
          expenseCategories
            .filter((cat) => ["Housing", "Food", "Utilities", "Transportation", "Healthcare"].includes(cat.name))
            .reduce((sum, cat) => sum + cat.amount, 0),
          expenseCategories
            .filter((cat) => ["Entertainment", "Shopping", "Dining Out", "Hobbies"].includes(cat.name))
            .reduce((sum, cat) => sum + cat.amount, 0),
          remainingBudget > 0 ? remainingBudget : 0,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  }

  // Get random budget tip
  const getRandomTip = () => {
    return budgetingTips[Math.floor(Math.random() * budgetingTips.length)]
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Budgeting Tool</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create and visualize your budget to better manage your finances
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="input">Input Data</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="analysis">Analysis & Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income</CardTitle>
                  <CardDescription>Enter your monthly income after taxes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="income">Monthly Income</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          id="income"
                          type="number"
                          placeholder="0.00"
                          value={income || ""}
                          onChange={handleIncomeChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>Enter your monthly expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenseCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <div className="flex-1">
                          <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input
                              id={`category-${category.id}`}
                              type="number"
                              placeholder="0.00"
                              value={category.amount || ""}
                              onChange={(e) =>
                                handleCategoryAmountChange(category.id, Number.parseFloat(e.target.value) || 0)
                              }
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExpenseCategory(category.id)}
                          className="mt-6"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove {category.name}</span>
                        </Button>
                      </div>
                    ))}

                    <div className="flex items-end space-x-2 pt-4 border-t">
                      <div className="flex-1">
                        <Label htmlFor="new-category">Add New Category</Label>
                        <Input
                          id="new-category"
                          placeholder="Category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                      </div>
                      <Button onClick={addExpenseCategory}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Budget Summary</CardTitle>
                  <CardDescription>Overview of your monthly budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                      <p className="text-2xl font-bold">{formatCurrency(income)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Remaining Budget</p>
                      <p className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(remainingBudget)}
                      </p>
                    </div>
                  </div>

                  <Button
                    className="mt-6 bg-purple-600 hover:bg-purple-700"
                    onClick={() => setActiveTab("visualization")}
                  >
                    <PieChart className="h-4 w-4 mr-2" />
                    Visualize Budget
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visualization">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Visualization of your expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>50/30/20 Rule Analysis</CardTitle>
                  <CardDescription>Comparing your budget to the recommended rule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar
                      data={barChartData}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Amount (₹)",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Budget Insights</CardTitle>
                  <CardDescription>Key insights based on your budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Spending Breakdown</h3>
                      <ul className="space-y-2">
                        {expenseCategories.map((category) => (
                          <li key={category.id} className="flex justify-between">
                            <span>{category.name}</span>
                            <span className="font-medium">
                              {formatCurrency(category.amount)} (
                              {income > 0 ? ((category.amount / income) * 100).toFixed(1) : "0"}%)
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">50/30/20 Rule Recommendation</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>Needs (50%)</span>
                          <span className="font-medium">{formatCurrency(needsAmount)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Wants (30%)</span>
                          <span className="font-medium">{formatCurrency(wantsAmount)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Savings (20%)</span>
                          <span className="font-medium">{formatCurrency(savingsAmount)}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Button className="mt-6 bg-purple-600 hover:bg-purple-700" onClick={() => setActiveTab("analysis")}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    View Tips & Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Analysis</CardTitle>
                  <CardDescription>Insights based on your financial data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Income vs. Expenses</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {remainingBudget >= 0
                          ? `You have a budget surplus of ${formatCurrency(remainingBudget)}. Great job managing your expenses!`
                          : `You have a budget deficit of ${formatCurrency(Math.abs(remainingBudget))}. Consider reducing expenses or increasing income.`}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Expense Categories</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your highest expense category is{" "}
                        {expenseCategories.length > 0
                          ? `${expenseCategories.reduce((prev, current) => (prev.amount > current.amount ? prev : current)).name} at ${formatCurrency(expenseCategories.reduce((prev, current) => (prev.amount > current.amount ? prev : current)).amount)}`
                          : "not available due to no expense data"}
                        .
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">50/30/20 Rule Analysis</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Based on the 50/30/20 rule, you should allocate:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>{formatCurrency(needsAmount)} for needs (housing, food, utilities)</li>
                        <li>{formatCurrency(wantsAmount)} for wants (entertainment, dining out)</li>
                        <li>{formatCurrency(savingsAmount)} for savings and debt repayment</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Smart Budgeting Tips</CardTitle>
                  <CardDescription>Personalized tips to improve your financial health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600 dark:text-gray-400">{getRandomTip()}</p>
                      </div>
                    ))}

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-purple-700 dark:text-purple-300">
                        Personalized Recommendation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {remainingBudget < 0
                          ? "Your expenses exceed your income. Consider reviewing your 'wants' categories to find areas where you can cut back."
                          : remainingBudget < income * 0.1
                            ? "You're living within your means, but your savings margin is thin. Try to increase your savings to at least 10-20% of your income."
                            : "You're doing well with a healthy surplus! Consider allocating more to savings or investments to grow your wealth."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <Button variant="outline" onClick={() => setActiveTab("input")}>
                      Edit Budget
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        toast({
                          title: "Budget saved",
                          description: "Your budget has been saved successfully.",
                        })
                      }}
                    >
                      Save Budget
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
