"use server"

import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

// Create a server-side Supabase client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export type TransactionFormData = {
  amount: number
  category: string
  description: string
  transactionType: "income" | "expense"
  transactionDate: string
  userId: string
}

export async function addTransaction(formData: TransactionFormData) {
  try {
    // Create a supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        id: uuidv4(),
        user_id: formData.userId,
        amount: formData.transactionType === "expense" ? -Math.abs(formData.amount) : Math.abs(formData.amount),
        category: formData.category,
        transaction_type: formData.transactionType,
        description: formData.description,
        transaction_date: new Date(formData.transactionDate).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error adding transaction:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function getTransactions(userId: string) {
  try {
    // Create a supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false })
      .limit(10)

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { success: false, error: (error as Error).message, data: [] }
  }
}

export async function getCategories(userId: string) {
  try {
    // Create a supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase.from("budget_categories").select("id, name, color").eq("user_id", userId)

    if (error) {
      throw new Error(error.message)
    }

    // If no categories found, return default categories
    if (!data || data.length === 0) {
      return {
        success: true,
        data: [
          { id: "expense-housing", name: "Housing", color: "#8b5cf6" },
          { id: "expense-food", name: "Food", color: "#6366f1" },
          { id: "expense-transportation", name: "Transportation", color: "#a855f7" },
          { id: "expense-utilities", name: "Utilities", color: "#d946ef" },
          { id: "expense-entertainment", name: "Entertainment", color: "#ec4899" },
          { id: "expense-healthcare", name: "Healthcare", color: "#f43f5e" },
          { id: "income-salary", name: "Salary", color: "#10b981" },
          { id: "income-freelance", name: "Freelance", color: "#14b8a6" },
          { id: "income-investments", name: "Investments", color: "#06b6d4" },
        ],
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: (error as Error).message, data: [] }
  }
}
