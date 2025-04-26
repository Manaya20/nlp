"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, Lock, CreditCard, MessageSquare, Trash2, Bell, Shield, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ProfilePage() {
  const { toast } = useToast()

  // User profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    occupation: "Software Developer",
    incomeRange: "₹75,000 - ₹100,000",
    financialGoals: "Save for retirement, buy a house",
  })

  // Fetch user profile data from Supabase
  const fetchProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const userId = session?.user?.id

      if (!userId) {
        console.error("User not logged in")
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not logged in.",
        })
        return
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, email")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile data.",
        })
        return
      }

      if (data) {
        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: "(555) 123-4567",
          address: "123 Main St, Anytown, USA",
          occupation: "Software Developer",
          incomeRange: "₹75,000 - ₹100,000",
          financialGoals: "Save for retirement, buy a house",
        })
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsAlerts: false,
    appNotifications: true,
    marketingEmails: false,
  })

  // Security settings state
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30 minutes",
    dataSharing: "minimal",
  })

  // Saved items state
  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      type: "Chat",
      title: "Retirement Planning Discussion",
      date: "2023-03-15",
      preview: "We discussed 401(k) contribution strategies and Roth IRA options...",
    },
    {
      id: 2,
      type: "Budget Plan",
      title: "Monthly Budget - March 2023",
      date: "2023-03-01",
      preview: "Income: ₹5,200, Expenses: ₹3,800, Savings: ₹1,400...",
    },
    {
      id: 3,
      type: "Chat",
      title: "Mortgage Refinancing Options",
      date: "2023-02-22",
      preview: "Current rates for 30-year fixed mortgages are around 6.5%...",
    },
  ])

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  // Handle notification preferences update
  const handleNotificationUpdate = () => {
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification settings have been saved.",
    })
  }

  // Handle security settings update
  const handleSecurityUpdate = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been updated.",
    })
  }

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    })
  }

  // Handle saved item deletion
  const handleDeleteSavedItem = (id: number) => {
    setSavedItems(savedItems.filter((item) => item.id !== id))
    toast({
      title: "Item Deleted",
      description: "The saved item has been removed from your account.",
    })
  }

  // Handle account deletion
  const handleAccountDeletion = () => {
    // In a real app, this would show a confirmation dialog and then process the deletion
    toast({
      title: "Account Deletion Requested",
      description: "We've sent a confirmation email to verify this request.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
        Profile Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.occupation}</p>

                <div className="w-full mt-6">
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-1">
                      <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="saved">Saved Items</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="address"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                          id="occupation"
                          value={profile.occupation}
                          onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="incomeRange">Income Range</Label>
                        <Select
                          value={profile.incomeRange}
                          onValueChange={(value) => setProfile({ ...profile, incomeRange: value })}
                        >
                          <SelectTrigger id="incomeRange">
                            <SelectValue placeholder="Select income range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Under ₹25,000">Under ₹25,000</SelectItem>
                            <SelectItem value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</SelectItem>
                            <SelectItem value="₹50,000 - ₹75,000">₹50,000 - ₹75,000</SelectItem>
                            <SelectItem value="₹75,000 - ₹100,000">₹75,000 - ₹100,000</SelectItem>
                            <SelectItem value="₹100,000 - ₹150,000">₹100,000 - ₹150,000</SelectItem>
                            <SelectItem value="Over ₹150,000">Over ₹150,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="financialGoals">Financial Goals</Label>
                        <Textarea
                          id="financialGoals"
                          value={profile.financialGoals}
                          onChange={(e) => setProfile({ ...profile, financialGoals: e.target.value })}
                          placeholder="Describe your financial goals..."
                          className="resize-none"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how and when you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailUpdates">Email Updates</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications about account activity via email
                        </p>
                      </div>
                      <Switch
                        id="emailUpdates"
                        checked={notifications.emailUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailUpdates: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="smsAlerts">SMS Alerts</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive important alerts via text message
                        </p>
                      </div>
                      <Switch
                        id="smsAlerts"
                        checked={notifications.smsAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, smsAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="appNotifications">App Notifications</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications within the application
                        </p>
                      </div>
                      <Switch
                        id="appNotifications"
                        checked={notifications.appNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, appNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive promotional content and special offers
                        </p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                      />
                    </div>

                    <Button onClick={handleNotificationUpdate} className="w-full">
                      <Bell className="mr-2 h-4 w-4" />
                      Update Notification Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and privacy preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={security.twoFactorAuth}
                        onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Automatically log out after a period of inactivity
                      </p>
                      <Select
                        value={security.sessionTimeout}
                        onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                      >
                        <SelectTrigger id="sessionTimeout">
                          <SelectValue placeholder="Select timeout period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15 minutes">15 minutes</SelectItem>
                          <SelectItem value="30 minutes">30 minutes</SelectItem>
                          <SelectItem value="1 hour">1 hour</SelectItem>
                          <SelectItem value="4 hours">4 hours</SelectItem>
                          <SelectItem value="Never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dataSharing">Data Sharing</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Control how your data is used and shared
                      </p>
                      <Select
                        value={security.dataSharing}
                        onValueChange={(value) => setSecurity({ ...security, dataSharing: value })}
                      >
                        <SelectTrigger id="dataSharing">
                          <SelectValue placeholder="Select data sharing level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal - Essential services only</SelectItem>
                          <SelectItem value="moderate">Moderate - Include personalization</SelectItem>
                          <SelectItem value="full">Full - Include third-party services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <h3 className="text-lg font-medium mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Lock className="h-4 w-4 text-gray-500" />
                            <Input id="currentPassword" type="password" placeholder="••••••••" className="flex-1" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Lock className="h-4 w-4 text-gray-500" />
                            <Input id="newPassword" type="password" placeholder="••••••••" className="flex-1" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Lock className="h-4 w-4 text-gray-500" />
                            <Input id="confirmPassword" type="password" placeholder="••••••••" className="flex-1" />
                          </div>
                        </div>

                        <Button type="submit">Change Password</Button>
                      </form>
                    </div>

                    <Button onClick={handleSecurityUpdate} className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Update Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Items</CardTitle>
                  <CardDescription>Manage your saved conversations, budgets, and plans.</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedItems.length > 0 ? (
                    <div className="space-y-4">
                      {savedItems.map((item) => (
                        <Card key={item.id} className="border border-gray-200 dark:border-gray-800">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center space-x-2">
                                  {item.type === "Chat" ? (
                                    <MessageSquare className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <CreditCard className="h-4 w-4 text-green-500" />
                                  )}
                                  <span className="text-sm text-gray-500">{item.type}</span>
                                </div>
                                <h3 className="font-medium mt-1">{item.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.preview}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  Saved on {new Date(item.date).toLocaleDateString()}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteSavedItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">You don't have any saved items yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6 border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                  <CardDescription>Actions here can't be undone. Be careful.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Permanently delete your account and all associated data.
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleAccountDeletion}>
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
