"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, TrendingUp, FileText, CheckCircle, XCircle, Info, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define policy types
type PolicyCategory = "insurance" | "retirement" | "mutualFunds"

type Policy = {
  id: string
  name: string
  provider: string
  coverage: string
  premium: number
  term: string
  riskLevel: "low" | "medium" | "high"
  returnPotential?: "low" | "medium" | "high"
  features: string[]
  pros: string[]
  cons: string[]
}

// Mock policy data
const mockPolicies: Record<PolicyCategory, Policy[]> = {
  insurance: [
    {
      id: "ins1",
      name: "Comprehensive Health Plan",
      provider: "HealthGuard",
      coverage: "₹1,000,000",
      premium: 350,
      term: "Annual",
      riskLevel: "low",
      features: [
        "Hospitalization coverage",
        "Outpatient care",
        "Prescription drugs",
        "Preventive care",
        "Mental health services",
      ],
      pros: ["Extensive network of providers", "Low deductible", "Includes dental and vision"],
      cons: ["Higher premium", "Some specialized treatments require pre-approval", "Out-of-network costs are higher"],
    },
    {
      id: "ins2",
      name: "Basic Health Plan",
      provider: "MediCare Plus",
      coverage: "₹500,000",
      premium: 200,
      term: "Annual",
      riskLevel: "medium",
      features: [
        "Hospitalization coverage",
        "Limited outpatient care",
        "Basic prescription coverage",
        "Preventive care",
      ],
      pros: ["Affordable premium", "Good for young, healthy individuals", "No referrals needed for specialists"],
      cons: ["Higher deductible", "Limited coverage for specialized treatments", "No dental or vision coverage"],
    },
    {
      id: "ins3",
      name: "Term Life Insurance",
      provider: "LifeSecure",
      coverage: "₹500,000",
      premium: 30,
      term: "20 years",
      riskLevel: "low",
      features: ["Death benefit", "Level premium", "Convertible to permanent policy", "Accelerated death benefit"],
      pros: ["Affordable coverage", "Simple to understand", "Fixed premium for term length"],
      cons: ["No cash value accumulation", "Coverage ends after term", "Premiums increase if renewed after term"],
    },
    {
      id: "ins4",
      name: "Whole Life Insurance",
      provider: "Guardian Life",
      coverage: "₹250,000",
      premium: 150,
      term: "Lifetime",
      riskLevel: "low",
      features: ["Lifetime coverage", "Cash value accumulation", "Fixed premium", "Dividend potential"],
      pros: ["Permanent coverage", "Builds cash value over time", "Can borrow against cash value"],
      cons: [
        "Higher premiums than term life",
        "Lower initial death benefit for same premium",
        "Complex policy structure",
      ],
    },
  ],
  retirement: [
    {
      id: "ret1",
      name: "Traditional 401(k)",
      provider: "Employer-sponsored",
      coverage: "Varies by contribution",
      premium: 0,
      term: "Until retirement",
      riskLevel: "medium",
      returnPotential: "medium",
      features: [
        "Pre-tax contributions",
        "Employer matching (varies)",
        "Tax-deferred growth",
        "Multiple investment options",
        "Required minimum distributions at 72",
      ],
      pros: [
        "Reduces current taxable income",
        "Potential employer match is free money",
        "Higher contribution limits than IRAs",
      ],
      cons: ["Taxes paid on withdrawals", "Early withdrawal penalties", "Limited investment options compared to IRA"],
    },
    {
      id: "ret2",
      name: "Roth IRA",
      provider: "Self-directed",
      coverage: "Varies by contribution",
      premium: 0,
      term: "Until retirement",
      riskLevel: "medium",
      returnPotential: "medium",
      features: [
        "After-tax contributions",
        "Tax-free growth",
        "Tax-free qualified withdrawals",
        "No required minimum distributions",
        "Flexible investment options",
      ],
      pros: [
        "Tax-free withdrawals in retirement",
        "Can withdraw contributions anytime without penalty",
        "No required minimum distributions",
      ],
      cons: [
        "No tax deduction for contributions",
        "Income limits for eligibility",
        "Lower contribution limits than 401(k)",
      ],
    },
    {
      id: "ret3",
      name: "Traditional IRA",
      provider: "Self-directed",
      coverage: "Varies by contribution",
      premium: 0,
      term: "Until retirement",
      riskLevel: "medium",
      returnPotential: "medium",
      features: [
        "Potentially tax-deductible contributions",
        "Tax-deferred growth",
        "Flexible investment options",
        "Required minimum distributions at 72",
      ],
      pros: [
        "May reduce current taxable income",
        "More investment options than 401(k)",
        "Available to anyone with earned income",
      ],
      cons: [
        "Taxes paid on withdrawals",
        "Early withdrawal penalties",
        "Deduction may be limited if covered by workplace plan",
      ],
    },
    {
      id: "ret4",
      name: "SEP IRA",
      provider: "Self-employed",
      coverage: "Varies by contribution",
      premium: 0,
      term: "Until retirement",
      riskLevel: "medium",
      returnPotential: "medium",
      features: [
        "Higher contribution limits",
        "Tax-deductible contributions",
        "Tax-deferred growth",
        "Flexible investment options",
        "Easy setup and maintenance",
      ],
      pros: [
        "Higher contribution limits than traditional IRAs",
        "Reduces current taxable income",
        "Easy to set up and administer",
      ],
      cons: [
        "Taxes paid on withdrawals",
        "Early withdrawal penalties",
        "Employer must contribute equally for all eligible employees",
      ],
    },
  ],
  mutualFunds: [
    {
      id: "mf1",
      name: "Index Fund - S&P 500",
      provider: "Vanguard",
      coverage: "Large-cap U.S. stocks",
      premium: 0,
      term: "No fixed term",
      riskLevel: "medium",
      returnPotential: "medium",
      features: [
        "Passive management",
        "Low expense ratio (0.03%)",
        "Tracks S&P 500 index",
        "Dividend reinvestment",
        "High liquidity",
      ],
      pros: ["Low fees", "Broad market exposure", "Historically reliable long-term returns"],
      cons: ["No downside protection", "Limited to large U.S. companies", "No active management to beat the market"],
    },
    {
      id: "mf2",
      name: "Total Bond Market Fund",
      provider: "Fidelity",
      coverage: "U.S. bond market",
      premium: 0,
      term: "No fixed term",
      riskLevel: "low",
      returnPotential: "low",
      features: [
        "Diversified bond exposure",
        "Low expense ratio (0.05%)",
        "Regular income distributions",
        "Government and corporate bonds",
        "Various maturities",
      ],
      pros: ["Lower volatility than stocks", "Regular income generation", "Portfolio diversification"],
      cons: ["Lower long-term returns than stocks", "Interest rate risk", "Inflation risk"],
    },
    {
      id: "mf3",
      name: "Growth Stock Fund",
      provider: "T. Rowe Price",
      coverage: "Growth-oriented stocks",
      premium: 0,
      term: "No fixed term",
      riskLevel: "high",
      returnPotential: "high",
      features: [
        "Actively managed",
        "Focus on companies with above-average growth",
        "Higher expense ratio (0.65%)",
        "Potential for capital appreciation",
        "Lower dividend yield",
      ],
      pros: ["Potential for higher returns", "Professional management", "Focus on innovative companies"],
      cons: ["Higher fees", "Greater volatility", "May underperform in market downturns"],
    },
    {
      id: "mf4",
      name: "International Equity Fund",
      provider: "BlackRock",
      coverage: "International developed markets",
      premium: 0,
      term: "No fixed term",
      riskLevel: "high",
      returnPotential: "high",
      features: [
        "Global diversification",
        "Exposure to foreign economies",
        "Currency diversification",
        "Moderate expense ratio (0.45%)",
        "Mix of growth and value stocks",
      ],
      pros: [
        "Geographic diversification",
        "Exposure to global growth opportunities",
        "Potential hedge against U.S. market downturns",
      ],
      cons: ["Currency risk", "Political and regulatory risks", "Higher volatility than U.S.-only funds"],
    },
  ],
}

export default function PoliciesPage() {
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory>("insurance")
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [comparedPolicies, setComparedPolicies] = useState<Policy[]>([])

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as PolicyCategory)
    setSelectedPolicy(null)
    setCompareMode(false)
    setComparedPolicies([])
  }

  // Handle policy selection
  const handlePolicySelect = (policy: Policy) => {
    if (compareMode) {
      // In compare mode, add or remove from compared policies
      if (comparedPolicies.some((p) => p.id === policy.id)) {
        setComparedPolicies(comparedPolicies.filter((p) => p.id !== policy.id))
      } else if (comparedPolicies.length < 3) {
        setComparedPolicies([...comparedPolicies, policy])
      } else {
        toast({
          variant: "destructive",
          title: "Comparison limit reached",
          description: "You can compare up to 3 policies at a time.",
        })
      }
    } else {
      // In view mode, set the selected policy
      setSelectedPolicy(policy)
    }
  }

  // Toggle compare mode
  const toggleCompareMode = () => {
    setCompareMode(!compareMode)
    setSelectedPolicy(null)
    setComparedPolicies([])
  }

  // Get risk level badge color
  const getRiskBadgeColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return ""
    }
  }

  // Get return potential badge color
  const getReturnBadgeColor = (level?: "low" | "medium" | "high") => {
    if (!level) return ""

    switch (level) {
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "medium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "high":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
      default:
        return ""
    }
  }

  // Get category icon
  const getCategoryIcon = () => {
    switch (selectedCategory) {
      case "insurance":
        return <Shield className="h-5 w-5 text-blue-500" />
      case "retirement":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "mutualFunds":
        return <TrendingUp className="h-5 w-5 text-purple-500" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  // Get category display name
  const getCategoryDisplayName = () => {
    switch (selectedCategory) {
      case "insurance":
        return "Insurance Policies"
      case "retirement":
        return "Retirement Plans"
      case "mutualFunds":
        return "Mutual Funds"
      default:
        return "Policies"
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Policy Comparison</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Compare different financial policies to find the best option for your needs
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:w-64">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insurance">Insurance Policies</SelectItem>
                <SelectItem value="retirement">Retirement Plans</SelectItem>
                <SelectItem value="mutualFunds">Mutual Funds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={compareMode ? "default" : "outline"}
            onClick={toggleCompareMode}
            className={compareMode ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            {compareMode ? "Exit Compare Mode" : "Compare Policies"}
          </Button>
        </div>

        {compareMode && (
          <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Info className="h-5 w-5 text-purple-500 mr-2" />
              <p className="font-medium">Compare Mode Active</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Select up to 3 policies to compare their features side by side.
            </p>
            <div className="flex flex-wrap gap-2">
              {comparedPolicies.map((policy) => (
                <Badge key={policy.id} variant="outline" className="py-1">
                  {policy.name}
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setComparedPolicies(comparedPolicies.filter((p) => p.id !== policy.id))}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {comparedPolicies.length === 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">No policies selected</span>
              )}
            </div>
          </div>
        )}

        {/* Policy Listing */}
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                {getCategoryIcon()}
                <CardTitle className="ml-2">{getCategoryDisplayName()}</CardTitle>
              </div>
              <CardDescription>
                {selectedCategory === "insurance" && "Compare different insurance policies and their coverage"}
                {selectedCategory === "retirement" && "Explore retirement plans and their benefits"}
                {selectedCategory === "mutualFunds" && "Analyze mutual funds and their potential returns"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {compareMode && <TableHead className="w-[50px]">Select</TableHead>}
                      <TableHead>Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Coverage/Focus</TableHead>
                      <TableHead>{selectedCategory === "insurance" ? "Premium" : "Expense Ratio"}</TableHead>
                      <TableHead>Risk Level</TableHead>
                      {(selectedCategory === "retirement" || selectedCategory === "mutualFunds") && (
                        <TableHead>Return Potential</TableHead>
                      )}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPolicies[selectedCategory].map((policy) => (
                      <TableRow
                        key={policy.id}
                        className={`${
                          compareMode && comparedPolicies.some((p) => p.id === policy.id)
                            ? "bg-purple-50 dark:bg-purple-900/10"
                            : ""
                        }`}
                      >
                        {compareMode && (
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={comparedPolicies.some((p) => p.id === policy.id)}
                              onChange={() => handlePolicySelect(policy)}
                              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{policy.name}</TableCell>
                        <TableCell>{policy.provider}</TableCell>
                        <TableCell>{policy.coverage}</TableCell>
                        <TableCell>
                          {selectedCategory === "insurance"
                            ? `₹${policy.premium}/month`
                            : policy.premium === 0
                              ? "Varies"
                              : `${policy.premium}%`}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskBadgeColor(policy.riskLevel)}>{policy.riskLevel}</Badge>
                        </TableCell>
                        {(selectedCategory === "retirement" || selectedCategory === "mutualFunds") && (
                          <TableCell>
                            <Badge className={getReturnBadgeColor(policy.returnPotential)}>
                              {policy.returnPotential}
                            </Badge>
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handlePolicySelect(policy)}>
                            {compareMode ? "Select" : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Details or Comparison */}
        {selectedPolicy && !compareMode && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedPolicy.name}</CardTitle>
              <CardDescription>Provided by {selectedPolicy.provider}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Policy Information</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Provider</p>
                            <p className="font-medium">{selectedPolicy.provider}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Coverage/Focus</p>
                            <p className="font-medium">{selectedPolicy.coverage}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {selectedCategory === "insurance" ? "Premium" : "Expense Ratio"}
                            </p>
                            <p className="font-medium">
                              {selectedCategory === "insurance"
                                ? `₹${selectedPolicy.premium}/month`
                                : selectedPolicy.premium === 0
                                  ? "Varies"
                                  : `${selectedPolicy.premium}%`}
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Term</p>
                            <p className="font-medium">{selectedPolicy.term}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                            <p className="font-medium">Risk Assessment</p>
                          </div>
                          <div className="flex items-center">
                            <Badge className={getRiskBadgeColor(selectedPolicy.riskLevel)}>
                              {selectedPolicy.riskLevel} risk
                            </Badge>
                            {selectedPolicy.returnPotential && (
                              <Badge className={`ml-2 ${getReturnBadgeColor(selectedPolicy.returnPotential)}`}>
                                {selectedPolicy.returnPotential} return potential
                              </Badge>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {selectedPolicy.riskLevel === "low" &&
                              "This policy has a low risk profile, suitable for conservative investors or those seeking stable protection."}
                            {selectedPolicy.riskLevel === "medium" &&
                              "This policy has a moderate risk profile, balancing protection and growth potential."}
                            {selectedPolicy.riskLevel === "high" &&
                              "This policy has a higher risk profile, potentially offering greater returns but with increased volatility."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Pros & Cons</h3>
                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <p className="font-medium">Advantages</p>
                          </div>
                          <ul className="space-y-2">
                            {selectedPolicy.pros.map((pro, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                <span className="text-gray-600 dark:text-gray-400">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                            <p className="font-medium">Limitations</p>
                          </div>
                          <ul className="space-y-2">
                            {selectedPolicy.cons.map((con, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                <span className="text-gray-600 dark:text-gray-400">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features">
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Key Features</h3>
                      <ul className="space-y-3">
                        {selectedPolicy.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">
                        {selectedCategory === "insurance" && "Claim Process"}
                        {selectedCategory === "retirement" && "Withdrawal Process"}
                        {selectedCategory === "mutualFunds" && "Investment Process"}
                      </h3>

                      {selectedCategory === "insurance" && (
                        <div className="space-y-3">
                          <p className="text-gray-600 dark:text-gray-400">
                            The claim process typically involves the following steps:
                          </p>
                          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                            <li>Notify the insurance provider as soon as possible after the incident</li>
                            <li>Complete and submit the claim form with all required documentation</li>
                            <li>The insurance company will review your claim and may request additional information</li>
                            <li>Once approved, the payment will be processed according to the policy terms</li>
                            <li>For denied claims, you have the right to appeal the decision</li>
                          </ol>
                        </div>
                      )}

                      {selectedCategory === "retirement" && (
                        <div className="space-y-3">
                          <p className="text-gray-600 dark:text-gray-400">
                            The withdrawal process typically involves the following considerations:
                          </p>
                          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                            <li>Withdrawals before age 59½ may incur a 10% early withdrawal penalty</li>
                            <li>
                              Required minimum distributions (RMDs) may begin at age 72 (except for Roth accounts)
                            </li>
                            <li>Withdrawals from traditional accounts are taxed as ordinary income</li>
                            <li>
                              Roth withdrawals are tax-free if the account has been open for at least 5 years and you're
                              59½ or older
                            </li>
                            <li>
                              Consider the tax implications and timing of withdrawals as part of your retirement
                              strategy
                            </li>
                          </ol>
                        </div>
                      )}

                      {selectedCategory === "mutualFunds" && (
                        <div className="space-y-3">
                          <p className="text-gray-600 dark:text-gray-400">
                            The investment process typically involves the following steps:
                          </p>
                          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                            <li>Open an account with the fund provider or through a brokerage</li>
                            <li>Determine your investment amount (lump sum or regular contributions)</li>
                            <li>Choose between dividend reinvestment or cash distribution</li>
                            <li>Monitor your investment periodically and rebalance as needed</li>
                            <li>Consider tax implications when selling shares or receiving distributions</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analysis">
                  <div className="space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Expert Analysis</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {selectedCategory === "insurance" &&
                          `This ${selectedPolicy.name} offers ${selectedPolicy.riskLevel === "low" ? "comprehensive" : selectedPolicy.riskLevel === "medium" ? "balanced" : "basic"} 
                          coverage with a ${selectedPolicy.premium < 100 ? "competitive" : selectedPolicy.premium < 200 ? "moderate" : "premium"} monthly cost. 
                          It's particularly suitable for individuals seeking ${
                            selectedPolicy.riskLevel === "low"
                              ? "maximum protection with less concern about cost"
                              : selectedPolicy.riskLevel === "medium"
                                ? "a balance between coverage and affordability"
                                : "affordable basic coverage"
                          }.`}

                        {selectedCategory === "retirement" &&
                          `This ${selectedPolicy.name} is a ${selectedPolicy.riskLevel === "low" ? "conservative" : selectedPolicy.riskLevel === "medium" ? "balanced" : "growth-oriented"} 
                          retirement option. It offers ${selectedPolicy.returnPotential === "low" ? "stable but modest" : selectedPolicy.returnPotential === "medium" ? "moderate" : "potentially higher"} 
                          returns with ${selectedPolicy.riskLevel === "low" ? "minimal" : selectedPolicy.riskLevel === "medium" ? "moderate" : "significant"} risk exposure. 
                          This plan is well-suited for individuals who are ${
                            selectedPolicy.riskLevel === "low"
                              ? "approaching retirement or highly risk-averse"
                              : selectedPolicy.riskLevel === "medium"
                                ? "in mid-career or moderately risk-tolerant"
                                : "early in their career or comfortable with market volatility"
                          }.`}

                        {selectedCategory === "mutualFunds" &&
                          `This ${selectedPolicy.name} is a ${selectedPolicy.riskLevel === "low" ? "conservative" : selectedPolicy.riskLevel === "medium" ? "balanced" : "aggressive"} 
                          investment option focusing on ${selectedPolicy.coverage}. With a ${selectedPolicy.returnPotential === "low" ? "lower" : selectedPolicy.returnPotential === "medium" ? "moderate" : "higher"} 
                          return potential, it's suitable for investors who are ${
                            selectedPolicy.riskLevel === "low"
                              ? "risk-averse or nearing their investment goals"
                              : selectedPolicy.riskLevel === "medium"
                                ? "seeking balanced growth with moderate risk"
                                : "looking for maximum growth potential and can tolerate volatility"
                          }.`}
                      </p>

                      <h4 className="font-medium mb-2">Who is this ideal for?</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 mb-4">
                        {selectedCategory === "insurance" && selectedPolicy.riskLevel === "low" && (
                          <>
                            <li>Individuals seeking comprehensive coverage</li>
                            <li>Those who prioritize protection over cost</li>
                            <li>People with dependents or significant assets to protect</li>
                          </>
                        )}
                        {selectedCategory === "insurance" && selectedPolicy.riskLevel === "medium" && (
                          <>
                            <li>Budget-conscious individuals who still want good coverage</li>
                            <li>Those seeking a balance between protection and affordability</li>
                            <li>People with moderate insurance needs</li>
                          </>
                        )}
                        {selectedCategory === "insurance" && selectedPolicy.riskLevel === "high" && (
                          <>
                            <li>Young, healthy individuals with minimal insurance needs</li>
                            <li>Those primarily concerned with catastrophic coverage</li>
                            <li>People looking for the most affordable option</li>
                          </>
                        )}

                        {selectedCategory === "retirement" && selectedPolicy.riskLevel === "low" && (
                          <>
                            <li>Individuals approaching retirement (5-10 years away)</li>
                            <li>Conservative investors prioritizing capital preservation</li>
                            <li>Those with low risk tolerance</li>
                          </>
                        )}
                        {selectedCategory === "retirement" && selectedPolicy.riskLevel === "medium" && (
                          <>
                            <li>Mid-career professionals (10-25 years from retirement)</li>
                            <li>Balanced investors seeking growth with moderate risk</li>
                            <li>Those with average risk tolerance</li>
                          </>
                        )}
                        {selectedCategory === "retirement" && selectedPolicy.riskLevel === "high" && (
                          <>
                            <li>Young professionals early in their career (25+ years from retirement)</li>
                            <li>Growth-oriented investors comfortable with market volatility</li>
                            <li>Those with high risk tolerance seeking maximum returns</li>
                          </>
                        )}

                        {selectedCategory === "mutualFunds" && selectedPolicy.riskLevel === "low" && (
                          <>
                            <li>Conservative investors prioritizing capital preservation</li>
                            <li>Those nearing their investment goals</li>
                            <li>Investors seeking income generation over growth</li>
                          </>
                        )}
                        {selectedCategory === "mutualFunds" && selectedPolicy.riskLevel === "medium" && (
                          <>
                            <li>Balanced investors seeking moderate growth</li>
                            <li>Those with a medium-term investment horizon (5-10 years)</li>
                            <li>Investors comfortable with some market fluctuations</li>
                          </>
                        )}
                        {selectedCategory === "mutualFunds" && selectedPolicy.riskLevel === "high" && (
                          <>
                            <li>Aggressive investors seeking maximum growth</li>
                            <li>Those with a long-term investment horizon (10+ years)</li>
                            <li>Investors comfortable with significant market volatility</li>
                          </>
                        )}
                      </ul>

                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Report downloaded",
                              description: "The detailed analysis report has been downloaded.",
                            })
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Full Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Policy Comparison Table */}
        {compareMode && comparedPolicies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Policy Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of selected policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Feature</TableHead>
                      {comparedPolicies.map((policy) => (
                        <TableHead key={policy.id}>{policy.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Provider</TableCell>
                      {comparedPolicies.map((policy) => (
                        <TableCell key={policy.id}>{policy.provider}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Coverage/Focus</TableCell>
                      {comparedPolicies.map((policy) => (
                        <TableCell key={policy.id}>{policy.coverage}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        {selectedCategory === "insurance" ? "Premium" : "Expense Ratio"}
                      </TableCell>
                      {comparedPolicies.map((policy) => (
                        <TableCell key={policy.id}>
                          {selectedCategory === "insurance"
                            ? `₹${policy.premium}/month`
                            : policy.premium === 0
                              ? "Varies"
                              : `${policy.premium}%`}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Term</TableCell>
                      {comparedPolicies.map((policy) => (
                        <TableCell key={policy.id}>{policy.term}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Risk Level</TableCell>
                      {comparedPolicies.map((policy) => (
                        <TableCell key={policy.id}>
                          <Badge className={getRiskBadgeColor(policy.riskLevel)}>{policy.riskLevel}</Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    {(selectedCategory === "retirement" || selectedCategory === "mutualFunds") && (
                      <TableRow>
                        <TableCell className="font-medium">Return Potential</TableCell>
                        {comparedPolicies.map((policy) => (
                          <TableCell key={policy.id}>
                            <Badge className={getReturnBadgeColor(policy.returnPotential)}>
                              {policy.returnPotential}
                            </Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="font-medium">Key Features</TableCell>
                      {comparedPolicies.map((policy) => (
                        <TableCell key={policy.id}>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {policy.features.slice(0, 3).map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                            {policy.features.length > 3 && (
                              <li className="text-gray-500">+{policy.features.length - 3} more</li>
                            )}
                          </ul>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Pros</TableCell>
                      {comparedPolicies.map((policy) => (
                        <TableCell key={policy.id}>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {policy.pros.map((pro, index) => (
                              <li key={index}>{pro}</li>
                            ))}
                          </ul>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Cons</TableCell>
                      {comparedPolicies.map((policy) => (
                        <TableCell key={policy.id}>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {policy.cons.map((con, index) => (
                              <li key={index}>{con}</li>
                            ))}
                          </ul>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    toast({
                      title: "Comparison saved",
                      description: "The policy comparison has been saved to your account.",
                    })
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Save Comparison
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
