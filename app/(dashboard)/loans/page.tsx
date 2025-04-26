"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  DollarSign,
  Calendar,
  Percent,
  ArrowRight,
  TrendingDown,
  Home,
  Car,
  GraduationCap,
  CreditCard,
} from "lucide-react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LoansPage() {
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(100000)
  const [interestRate, setInterestRate] = useState(8)
  const [loanTerm, setLoanTerm] = useState(5)
  const [emi, setEmi] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [loanType, setLoanType] = useState("home")

  // Loan Comparison State
  const [showComparison, setShowComparison] = useState(false)

  // Sample loan types with typical rates
  const loanTypes = {
    home: {
      name: "Home Loan",
      icon: <Home className="h-5 w-5" />,
      typicalRate: "5.5-8.5%",
      termRange: "15-30 years",
      description: "Financing for purchasing or refinancing a home",
      eligibility: "Good credit score, stable income, low debt-to-income ratio",
      documents: ["Proof of income", "Credit history", "Property details", "Employment verification"],
    },
    car: {
      name: "Auto Loan",
      icon: <Car className="h-5 w-5" />,
      typicalRate: "3.5-7.5%",
      termRange: "3-7 years",
      description: "Financing for purchasing a new or used vehicle",
      eligibility: "Fair to good credit score, proof of income",
      documents: ["Driver's license", "Proof of income", "Vehicle information", "Insurance proof"],
    },
    education: {
      name: "Education Loan",
      icon: <GraduationCap className="h-5 w-5" />,
      typicalRate: "3.5-12.5%",
      termRange: "5-15 years",
      description: "Financing for higher education expenses",
      eligibility: "Admission to recognized institution, co-signer may be required",
      documents: ["Admission letter", "Course details", "Cost of attendance", "Co-signer details (if applicable)"],
    },
    personal: {
      name: "Personal Loan",
      icon: <CreditCard className="h-5 w-5" />,
      typicalRate: "7.5-36%",
      termRange: "1-7 years",
      description: "Unsecured loan for various personal expenses",
      eligibility: "Good credit score, stable income, low debt-to-income ratio",
      documents: ["ID proof", "Income proof", "Bank statements", "Credit history"],
    },
  }

  // Sample loan offers for comparison
  const loanOffers = [
    {
      lender: "Prime Bank",
      rate: 5.75,
      term: 30,
      maxAmount: 500000,
      processingFee: "1%",
      prepaymentPenalty: "2% in first 3 years",
      features: ["Rate lock option", "Flexible payment schedule", "Online account management"],
    },
    {
      lender: "City Credit Union",
      rate: 5.5,
      term: 30,
      maxAmount: 400000,
      processingFee: "0.5%",
      prepaymentPenalty: "None",
      features: ["No application fee", "Rate discount with auto-pay", "First-time homebuyer programs"],
    },
    {
      lender: "National Mortgage",
      rate: 6.0,
      term: 30,
      maxAmount: 750000,
      processingFee: "1.5%",
      prepaymentPenalty: "1% in first 2 years",
      features: ["Fast approval", "Jumbo loans available", "Interest-only option"],
    },
  ]

  // Prepayment impact tips
  const prepaymentTips = [
    {
      title: "Reduce Total Interest",
      description:
        "Making extra payments reduces the principal faster, lowering the total interest paid over the loan term.",
      icon: <DollarSign className="h-10 w-10 text-green-500" />,
    },
    {
      title: "Shorten Loan Term",
      description: "Regular prepayments can significantly reduce your loan term, helping you become debt-free sooner.",
      icon: <Calendar className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Build Equity Faster",
      description: "For home loans, prepayments help build equity in your property more quickly.",
      icon: <Home className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Watch for Penalties",
      description: "Check if your loan has prepayment penalties that might offset the benefits of early payments.",
      icon: <TrendingDown className="h-10 w-10 text-red-500" />,
    },
  ]

  // Calculate EMI, total interest, and total amount
  useEffect(() => {
    if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
      const monthlyRate = interestRate / 12 / 100
      const totalMonths = loanTerm * 12

      // EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
      const calculatedEmi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)

      const calculatedTotalAmount = calculatedEmi * totalMonths
      const calculatedTotalInterest = calculatedTotalAmount - loanAmount

      setEmi(calculatedEmi)
      setTotalInterest(calculatedTotalInterest)
      setTotalAmount(calculatedTotalAmount)
    }
  }, [loanAmount, interestRate, loanTerm])

  // Generate amortization schedule
  const generateAmortizationSchedule = () => {
    const monthlyRate = interestRate / 12 / 100
    const totalMonths = loanTerm * 12
    let balance = loanAmount
    const schedule = []

    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = emi - interestPayment
      balance -= principalPayment

      schedule.push({
        month,
        payment: emi,
        principalPayment,
        interestPayment,
        balance: balance > 0 ? balance : 0,
      })

      // Limit to first 12 months for UI display
      if (month >= 12) break
    }

    return schedule
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
        Loan Assistance
      </h1>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">EMI Calculator</TabsTrigger>
          <TabsTrigger value="comparison">Loan Comparison</TabsTrigger>
          <TabsTrigger value="prepayment">Prepayment Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                EMI Calculator
              </CardTitle>
              <CardDescription>
                Calculate your Equated Monthly Installment (EMI) based on loan amount, interest rate, and term.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="loan-type">Loan Type</Label>
                      <span className="text-sm text-gray-500">
                        {loanTypes[loanType as keyof typeof loanTypes].name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(loanTypes).map(([key, value]) => (
                        <Button
                          key={key}
                          variant={loanType === key ? "default" : "outline"}
                          size="sm"
                          className="flex items-center justify-center"
                          onClick={() => setLoanType(key)}
                        >
                          {value.icon}
                          <span className="ml-1 text-xs">{value.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="loan-amount">Loan Amount</Label>
                      <span className="text-sm text-gray-500">₹{loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Input
                        id="loan-amount"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[loanAmount]}
                      min={1000}
                      max={1000000}
                      step={1000}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                      <span className="text-sm text-gray-500">{interestRate}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-gray-500" />
                      <Input
                        id="interest-rate"
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        step={0.1}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[interestRate]}
                      min={1}
                      max={20}
                      step={0.1}
                      onValueChange={(value) => setInterestRate(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="loan-term">Loan Term (years)</Label>
                      <span className="text-sm text-gray-500">{loanTerm} years</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <Input
                        id="loan-term"
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[loanTerm]}
                      min={1}
                      max={30}
                      step={1}
                      onValueChange={(value) => setLoanTerm(value[0])}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <Card className="border-2 border-purple-200 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Calculation Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Monthly Payment (EMI)</p>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{emi.toFixed(2)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Total Interest</p>
                            <p className="text-lg font-semibold">₹{totalInterest.toFixed(2)}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-lg font-semibold">₹{totalAmount.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                          <p className="text-sm font-medium mb-2">Payment Breakdown</p>
                          <div className="w-full h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                            <div
                              className="h-full bg-purple-600 dark:bg-purple-500"
                              style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span>Principal: {((loanAmount / totalAmount) * 100).toFixed(1)}%</span>
                            <span>Interest: {((totalInterest / totalAmount) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button onClick={() => setShowComparison(!showComparison)} className="mt-4">
                    {showComparison ? "Hide Amortization Schedule" : "View Amortization Schedule"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {showComparison && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Amortization Schedule (First Year)</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableCaption>Monthly breakdown of your loan payments for the first year.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Remaining Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generateAmortizationSchedule().map((row) => (
                          <TableRow key={row.month}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell>₹{row.payment.toFixed(2)}</TableCell>
                            <TableCell>₹{row.principalPayment.toFixed(2)}</TableCell>
                            <TableCell>₹{row.interestPayment.toFixed(2)}</TableCell>
                            <TableCell>₹{row.balance.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Comparison</CardTitle>
              <CardDescription>Compare different loan options to find the best one for your needs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  About {loanTypes[loanType as keyof typeof loanTypes].name}s
                </h3>
                <Card className="bg-gray-50 dark:bg-gray-900">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="mt-1">{loanTypes[loanType as keyof typeof loanTypes].description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Typical Terms</p>
                        <div className="mt-1 space-y-1">
                          <div className="flex justify-between">
                            <span>Interest Rate:</span>
                            <span>{loanTypes[loanType as keyof typeof loanTypes].typicalRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Term Range:</span>
                            <span>{loanTypes[loanType as keyof typeof loanTypes].termRange}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Eligibility</p>
                        <p className="mt-1">{loanTypes[loanType as keyof typeof loanTypes].eligibility}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Required Documents</p>
                        <ul className="mt-1 list-disc list-inside">
                          {loanTypes[loanType as keyof typeof loanTypes].documents.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-lg font-medium mb-4">Sample Loan Offers</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lender</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Term (years)</TableHead>
                      <TableHead>Max Amount</TableHead>
                      <TableHead>Processing Fee</TableHead>
                      <TableHead>Prepayment Penalty</TableHead>
                      <TableHead>Features</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanOffers.map((offer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{offer.lender}</TableCell>
                        <TableCell>{offer.rate}%</TableCell>
                        <TableCell>{offer.term}</TableCell>
                        <TableCell>₹{offer.maxAmount.toLocaleString()}</TableCell>
                        <TableCell>{offer.processingFee}</TableCell>
                        <TableCell>{offer.prepaymentPenalty}</TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside text-sm">
                            {offer.features.map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Loan Selection Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Look Beyond the Interest Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">
                        Consider all costs including processing fees, prepayment penalties, and other charges that can
                        affect the total cost of the loan.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Check Repayment Flexibility</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">
                        Some loans offer flexible repayment options, allowing you to make extra payments or adjust your
                        payment schedule.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Read the Fine Print</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">
                        Understand all terms and conditions, especially those related to late payments, defaults, and
                        changes in interest rates.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Consider Your Credit Score</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">
                        Your credit score affects the interest rate you'll be offered. Improving your score before
                        applying can save you money.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prepayment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Prepayment Impact</CardTitle>
              <CardDescription>
                Understand how making extra payments can affect your loan term and total interest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Benefits of Prepayment</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {prepaymentTips.map((tip, index) => (
                      <Card key={index} className="border border-gray-200 dark:border-gray-800">
                        <CardContent className="p-4 flex items-start space-x-4">
                          <div className="flex-shrink-0">{tip.icon}</div>
                          <div>
                            <h4 className="font-medium">{tip.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tip.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Prepayment Calculator</h3>
                  <Card className="border-2 border-purple-200 dark:border-purple-900">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="extra-payment">Extra Monthly Payment</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <Input id="extra-payment" type="number" placeholder="100" className="flex-1" />
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button className="w-full">Calculate Impact</Button>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Original Loan Term</span>
                              <span className="font-medium">{loanTerm} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">New Loan Term</span>
                              <span className="font-medium text-green-600">4 years 3 months</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Time Saved</span>
                              <span className="font-medium text-green-600">9 months</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Interest Saved</span>
                              <span className="font-medium text-green-600">₹4,328.45</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Prepayment Strategies</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Make one extra payment per year</li>
                      <li>Round up your monthly payment to the nearest hundred</li>
                      <li>Apply windfalls (tax refunds, bonuses) to your loan principal</li>
                      <li>Set up biweekly payments instead of monthly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
