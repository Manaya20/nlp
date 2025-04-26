"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, DollarSign, FileText, HelpCircle, AlertTriangle, CheckCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TaxesPage() {
  // Tax Calculator State
  const [income, setIncome] = useState(50000)
  const [filingStatus, setFilingStatus] = useState("single")
  const [deductions, setDeductions] = useState(12950) // Standard deduction for single filer 2022
  const [taxLiability, setTaxLiability] = useState(0)
  const [effectiveRate, setEffectiveRate] = useState(0)
  const [showResults, setShowResults] = useState(false)

  // Tax brackets for 2022 (simplified for demo)
  const taxBrackets = {
    single: [
      { rate: 0.1, min: 0, max: 10275 },
      { rate: 0.12, min: 10276, max: 41775 },
      { rate: 0.22, min: 41776, max: 89075 },
      { rate: 0.24, min: 89076, max: 170050 },
      { rate: 0.32, min: 170051, max: 215950 },
      { rate: 0.35, min: 215951, max: 539900 },
      { rate: 0.37, min: 539901, max: Number.POSITIVE_INFINITY },
    ],
    married: [
      { rate: 0.1, min: 0, max: 20550 },
      { rate: 0.12, min: 20551, max: 83550 },
      { rate: 0.22, min: 83551, max: 178150 },
      { rate: 0.24, min: 178151, max: 340100 },
      { rate: 0.32, min: 340101, max: 431900 },
      { rate: 0.35, min: 431901, max: 647850 },
      { rate: 0.37, min: 647851, max: Number.POSITIVE_INFINITY },
    ],
    head: [
      { rate: 0.1, min: 0, max: 14650 },
      { rate: 0.12, min: 14651, max: 55900 },
      { rate: 0.22, min: 55901, max: 89050 },
      { rate: 0.24, min: 89051, max: 170050 },
      { rate: 0.32, min: 170051, max: 215950 },
      { rate: 0.35, min: 215951, max: 539900 },
      { rate: 0.37, min: 539901, max: Number.POSITIVE_INFINITY },
    ],
  }

  // Standard deductions
  const standardDeductions = {
    single: 12950,
    married: 25900,
    head: 19400,
  }

  // Important tax dates
  const taxDates = [
    { date: "January 31", description: "W-2 and 1099 forms due from employers" },
    { date: "April 15", description: "Federal tax filing deadline" },
    { date: "April 15", description: "First quarter estimated tax payment due" },
    { date: "June 15", description: "Second quarter estimated tax payment due" },
    { date: "September 15", description: "Third quarter estimated tax payment due" },
    { date: "October 15", description: "Extended tax filing deadline" },
    { date: "January 15", description: "Fourth quarter estimated tax payment due" },
  ]

  // Common deductions
  const commonDeductions = [
    {
      name: "Student Loan Interest",
      description: "Up to ₹2,500 of student loan interest paid",
      eligibility: "Income below ₹85,000 (single) or ₹170,000 (married)",
    },
    {
      name: "Mortgage Interest",
      description: "Interest paid on home mortgages up to ₹750,000",
      eligibility: "Homeowners with mortgage",
    },
    {
      name: "Charitable Contributions",
      description: "Donations to qualified charitable organizations",
      eligibility: "Must itemize deductions",
    },
    {
      name: "Medical Expenses",
      description: "Medical expenses exceeding 7.5% of AGI",
      eligibility: "Must itemize deductions",
    },
    {
      name: "Retirement Contributions",
      description: "Contributions to qualified retirement accounts",
      eligibility: "Income limits apply for some accounts",
    },
    {
      name: "Self-Employment Expenses",
      description: "Business expenses for self-employed individuals",
      eligibility: "Must have self-employment income",
    },
  ]

  // Tax tips
  const taxTips = [
    {
      title: "Maximize Retirement Contributions",
      description: "Contributing to 401(k)s and IRAs can reduce your taxable income.",
      icon: <CheckCircle className="h-10 w-10 text-green-500" />,
    },
    {
      title: "Track Deductible Expenses",
      description: "Keep detailed records of potentially deductible expenses throughout the year.",
      icon: <FileText className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Consider Tax-Loss Harvesting",
      description: "Offset capital gains by selling investments at a loss.",
      icon: <DollarSign className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Don't Miss Filing Deadlines",
      description: "Late filing and payment penalties can add up quickly.",
      icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
    },
  ]

  // Calculate tax liability
  const calculateTax = () => {
    // Update standard deduction based on filing status
    setDeductions(standardDeductions[filingStatus as keyof typeof standardDeductions])

    // Calculate taxable income
    const taxableIncome = Math.max(0, income - deductions)

    // Calculate tax based on brackets
    let tax = 0
    const brackets = taxBrackets[filingStatus as keyof typeof taxBrackets]

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i]
      if (taxableIncome > bracket.min) {
        const amountInBracket = Math.min(taxableIncome, bracket.max) - bracket.min
        tax += amountInBracket * bracket.rate
      }
    }

    setTaxLiability(tax)
    setEffectiveRate((tax / income) * 100)
    setShowResults(true)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
        Taxes 101
      </h1>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
          <TabsTrigger value="guide">Tax Guide</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="deadlines">Important Dates</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Income Tax Calculator
              </CardTitle>
              <CardDescription>
                Estimate your federal income tax liability based on your income and filing status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="income">Annual Income</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Input
                        id="income"
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="filing-status">Filing Status</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <Button
                        variant={filingStatus === "single" ? "default" : "outline"}
                        onClick={() => setFilingStatus("single")}
                        className="w-full"
                      >
                        Single
                      </Button>
                      <Button
                        variant={filingStatus === "married" ? "default" : "outline"}
                        onClick={() => setFilingStatus("married")}
                        className="w-full"
                      >
                        Married
                      </Button>
                      <Button
                        variant={filingStatus === "head" ? "default" : "outline"}
                        onClick={() => setFilingStatus("head")}
                        className="w-full"
                      >
                        Head of Household
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deductions">Deductions</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Input
                        id="deductions"
                        type="number"
                        value={deductions}
                        onChange={(e) => setDeductions(Number(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <Button onClick={calculateTax} className="w-full">
                    Calculate Tax
                  </Button>
                </div>

                {showResults && (
                  <Card className="border-2 border-purple-200 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Tax Calculation Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Taxable Income</p>
                          <p className="text-lg font-semibold">{formatCurrency(Math.max(0, income - deductions))}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Estimated Tax Liability</p>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {formatCurrency(taxLiability)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Effective Tax Rate</p>
                          <p className="text-lg font-semibold">{effectiveRate.toFixed(2)}%</p>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                          <p className="text-sm font-medium mb-2">Tax Bracket Breakdown</p>
                          <div className="space-y-2">
                            {taxBrackets[filingStatus as keyof typeof taxBrackets].map((bracket, index) => {
                              const taxableIncome = Math.max(0, income - deductions)
                              const isInBracket = taxableIncome > bracket.min
                              const amountInBracket = isInBracket
                                ? Math.min(taxableIncome, bracket.max) - bracket.min
                                : 0
                              const taxInBracket = amountInBracket * bracket.rate

                              return (
                                <div
                                  key={index}
                                  className={`flex justify-between text-sm ${isInBracket ? "font-medium" : "text-gray-500"}`}
                                >
                                  <span>{(bracket.rate * 100).toFixed(0)}% bracket</span>
                                  <span>{formatCurrency(taxInBracket)}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Taxes</CardTitle>
              <CardDescription>A beginner's guide to the U.S. tax system and how it affects you.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What are income taxes?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      Income taxes are fees charged on the income you earn throughout the year. The federal government,
                      most states, and some local governments collect income taxes.
                    </p>
                    <p>
                      The U.S. has a progressive tax system, meaning that people with higher incomes pay a higher
                      percentage of their income in taxes than those with lower incomes.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How are taxes calculated?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      Taxes are calculated based on your taxable income, which is your total income minus deductions and
                      exemptions.
                    </p>
                    <p className="mb-2">
                      The U.S. uses marginal tax brackets, which means different portions of your income are taxed at
                      different rates. As your income increases, the additional income may be taxed at a higher rate.
                    </p>
                    <p>
                      For example, in 2022, a single filer pays 10% on the first {formatCurrency(10275)} of income, 12% on income
                      between {formatCurrency(10276)} and {formatCurrency(41775)}, and so on.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What's the difference between tax deductions and tax credits?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      <strong>Tax deductions</strong> reduce your taxable income. For example, if you have {formatCurrency(50000)} in
                      income and {formatCurrency(12000)} in deductions, you'll only be taxed on {formatCurrency(38000)}.
                    </p>
                    <p>
                      <strong>Tax credits</strong> directly reduce the amount of tax you owe, dollar for dollar. For
                      example, a {formatCurrency(1000)} tax credit reduces your tax bill by {formatCurrency(1000)}, regardless of your tax bracket.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What are the different types of taxes?</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        <strong>Income Tax:</strong> Tax on earnings from work, investments, etc.
                      </li>
                      <li>
                        <strong>Payroll Tax:</strong> Includes Social Security and Medicare taxes
                      </li>
                      <li>
                        <strong>Capital Gains Tax:</strong> Tax on profits from selling investments
                      </li>
                      <li>
                        <strong>Property Tax:</strong> Tax on real estate and some personal property
                      </li>
                      <li>
                        <strong>Sales Tax:</strong> Tax on purchases of goods and services
                      </li>
                      <li>
                        <strong>Estate Tax:</strong> Tax on the transfer of property after death
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I file my taxes?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">You can file your taxes in several ways:</p>
                    <ul className="list-disc list-inside space-y-1 mb-2">
                      <li>Use tax preparation software (like TurboTax, H&R Block, etc.)</li>
                      <li>File online through the IRS Free File program</li>
                      <li>Hire a tax professional</li>
                      <li>Complete paper forms and mail them to the IRS</li>
                    </ul>
                    <p>
                      Most people need to file their federal tax return by April 15th each year, though extensions are
                      available.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Tax Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {taxTips.map((tip, index) => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Deductions and Credits</CardTitle>
              <CardDescription>
                Learn about common tax deductions and credits that can reduce your tax liability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Standard vs. Itemized Deductions</h3>
                <p className="mb-4">
                  When filing your taxes, you can choose either the standard deduction or itemize your deductions,
                  whichever gives you the greater tax benefit.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Standard Deduction (2022)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Single: {formatCurrency(12950)}</li>
                        <li>Married Filing Jointly: {formatCurrency(25900)}</li>
                        <li>Head of Household: {formatCurrency(19400)}</li>
                      </ul>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        The standard deduction is a fixed amount that reduces your taxable income. It's simpler than
                        itemizing and beneficial for many taxpayers.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Itemized Deductions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="mb-2 text-sm">
                        Itemizing allows you to deduct specific expenses, which may include:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Mortgage interest</li>
                        <li>State and local taxes (up to {formatCurrency(10000)})</li>
                        <li>Charitable contributions</li>
                        <li>Medical expenses (exceeding 7.5% of AGI)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-4">Common Tax Deductions</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deduction</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Eligibility</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commonDeductions.map((deduction, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{deduction.name}</TableCell>
                      <TableCell>{deduction.description}</TableCell>
                      <TableCell>{deduction.eligibility}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Popular Tax Credits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Earned Income Tax Credit (EITC)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">
                        A refundable credit for low to moderate-income workers. The amount varies based on income and
                        number of children.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Child Tax Credit</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">
                        A credit of up to {formatCurrency(2000)} per qualifying child under age 17. Partially refundable up to {formatCurrency(1500)}
                        per child.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">American Opportunity Credit</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">
                        A credit of up to {formatCurrency(2500)} per eligible student for qualified education expenses during the first
                        four years of higher education.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Retirement Savings Contributions Credit</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">
                        A credit of up to {formatCurrency(1000)} ({formatCurrency(2000)} if married filing jointly) for contributions to retirement
                        accounts like 401(k)s and IRAs.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Important Tax Dates and Deadlines</CardTitle>
              <CardDescription>
                Keep track of key tax dates to avoid penalties and ensure timely filing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Tax Calendar</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxDates.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.date}</TableCell>
                        <TableCell>{item.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Filing Extensions</h3>
                  <Card className="bg-gray-50 dark:bg-gray-900">
                    <CardContent className="p-6">
                      <p className="mb-4">
                        If you need more time to file your tax return, you can request an automatic extension until
                        October 15th.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            <strong>Important:</strong> An extension gives you more time to file your return, but not
                            more time to pay any taxes owed. You should estimate and pay any owed taxes by the regular
                            deadline to avoid penalties and interest.
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            To request an extension, file Form 4868 by the regular tax deadline (usually April 15th).
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Penalties for Late Filing</h3>
                  <Card className="bg-gray-50 dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Late Filing Penalty</h4>
                          <p className="text-sm">
                            5% of unpaid taxes for each month your return is late, up to 25% of your unpaid taxes.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-1">Late Payment Penalty</h4>
                          <p className="text-sm">
                            0.5% of unpaid taxes for each month your payment is late, up to 25% of your unpaid taxes.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-1">Interest</h4>
                          <p className="text-sm">
                            Interest compounds daily on any unpaid tax from the due date of the return until the date of
                            payment.
                          </p>
                        </div>
                      </div>
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
