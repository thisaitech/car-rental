"use client"

import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CreditCard,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Car,
  Bell,
  Clock,
  Home,
  FileText,
  Star,
} from "lucide-react"

const menuItems = [
  {
    icon: User,
    label: "Edit Profile",
    description: "Update your personal information",
  },
  {
    icon: CreditCard,
    label: "Payment Methods",
    description: "Manage your payment options",
  },
  {
    icon: FileText,
    label: "Documents",
    description: "Upload ID and license",
  },
  {
    icon: Bell,
    label: "Notifications",
    description: "Customize alerts",
  },
  {
    icon: Shield,
    label: "Security",
    description: "Password and 2FA",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    description: "Get help with your account",
  },
  {
    icon: Settings,
    label: "Settings",
    description: "App preferences",
  },
]

export function ProfileScreen() {
  const { user, firebaseLogout, setCurrentScreen, bookings } = useApp()

  const completedTrips = bookings.filter((b) => b.status === "completed").length
  const totalSpent = bookings
    .filter((b) => b.status === "completed" || b.status === "approved")
    .reduce((acc, b) => acc + b.totalPrice, 0)

  const handleLogout = () => firebaseLogout()

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-12 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentScreen("home")}
            className="p-2 -ml-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <h1 className="text-xl font-bold text-primary-foreground">Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-primary/20">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">
                  {user?.name || "User"}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user?.email || "email@example.com"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{user?.phone || "+91 98765 43210"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{completedTrips}</p>
              <p className="text-xs text-muted-foreground">Trips</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-5 h-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Spent</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-foreground">4.9</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 pt-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0 divide-y divide-border">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full mt-6 h-12 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          RideFleet v1.0.0
        </p>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setCurrentScreen("home")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setCurrentScreen("history")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs font-medium">History</span>
          </button>
          <button
            onClick={() => setCurrentScreen("notifications")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs font-medium">Alerts</span>
          </button>
          <button
            onClick={() => setCurrentScreen("profile")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-primary"
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
