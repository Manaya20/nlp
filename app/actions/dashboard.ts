"use server"

import { createClient } from "@supabase/supabase-js"

// Create a server-side Supabase client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export async function getDashboardData(userId: string) {
  try {
    // Create a supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user profile
    const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (profileError) {
      throw new Error(profileError.message)
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false })
      .limit(3)

    if (transactionsError) {
      throw new Error(transactionsError.message)
    }

    // Calculate total balance, income, and expenses
    const { data: allTransactions, error: allTransactionsError } = await supabase
      .from("transactions")
      .select("amount, transaction_type, transaction_date")
      .eq("user_id", userId)

    if (allTransactionsError) {
      throw new Error(allTransactionsError.message)
    }

    // Calculate totals
    const totalBalance = allTransactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0)

    // Calculate monthly income and expenses (current month)
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toISOString()
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString()

    const monthlyTransactions = allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transaction_date)
      return transactionDate >= new Date(firstDayOfMonth) && transactionDate <= new Date(lastDayOfMonth)
    })

    const monthlyIncome = monthlyTransactions
      .filter((transaction) => Number(transaction.amount) > 0)
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

    const monthlyExpenses = monthlyTransactions
      .filter((transaction) => Number(transaction.amount) < 0)
      .reduce((sum, transaction) => sum + Math.abs(Number(transaction.amount)), 0)

    // Calculate savings rate
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0

    // Get monthly data for charts (last 6 months)
    const chartData = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1)
      const monthName = month.toLocaleString("default", { month: "short" })
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1).toISOString()
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString()

      const monthTransactions = allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_date)
        return transactionDate >= new Date(monthStart) && transactionDate <= new Date(monthEnd)
      })

      const income = monthTransactions
        .filter((transaction) => Number(transaction.amount) > 0)
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

      const expenses = monthTransactions
        .filter((transaction) => Number(transaction.amount) < 0)
        .reduce((sum, transaction) => sum + Math.abs(Number(transaction.amount)), 0)

      const savings = income - expenses

      chartData.push({
        name: monthName,
        income,
        expenses,
        savings,
      })
    }

    // Get budget data
    const { data: budgets, error: budgetsError } = await supabase
      .from("budgets")
      .select("*, budget_categories(name, color)")
      .eq("user_id", userId)
      .eq("month", currentMonth + 1) // Supabase months are 1-indexed
      .eq("year", currentYear)

    if (budgetsError) {
      throw new Error(budgetsError.message)
    }

    // Format budget data for pie chart
    const budgetData = budgets.map((budget) => ({
      name: budget.budget_categories?.name || "Uncategorized",
      value: Number(budget.amount),
      color: budget.budget_categories?.color || "#8b5cf6",
    }))

    // If no budgets, use default data
    const defaultBudgetData = [
      { name: "Housing", value: 1200, color: "#8b5cf6" },
      { name: "Food", value: 500, color: "#6366f1" },
      { name: "Transportation", value: 300, color: "#a855f7" },
      { name: "Utilities", value: 200, color: "#d946ef" },
      { name: "Entertainment", value: 150, color: "#ec4899" },
      { name: "Other", value: 250, color: "#f43f5e" },
    ]

    return {
      success: true,
      data: {
        profile,
        transactions,
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        savingsRate,
        chartData,
        budgetData: budgetData.length > 0 ? budgetData : defaultBudgetData,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return {
      success: false,
      error: (error as Error).message,
      data: null,
    }
  }
}
