"use client"

import { useApp, mockVehicles, VehicleType } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Bike,
  Truck,
  Search,
  Bell,
  MapPin,
  Calendar,
  Star,
  ChevronRight,
  Home,
  Clock,
  User,
  Sparkles,
} from "lucide-react"

const categoryIcons = {
  car: Car,
  auto: Bike,
  lorry: Truck,
}

const categoryColors = {
  car: "bg-primary text-primary-foreground",
  auto: "bg-accent text-accent-foreground",
  lorry: "bg-chart-3 text-success-foreground",
}

const categoryLabels = {
  car: "Cars",
  auto: "Autos",
  lorry: "Lorries",
}

export function HomeScreen() {
  const {
    user,
    setCurrentScreen,
    setSelectedVehicleType,
    notifications,
    bookings,
    pickupLocation,
    setPickupLocation,
    pickupDate,
    setPickupDate,
  } = useApp()

  const unreadCount = notifications.filter((n) => !n.read).length
  const activeBooking = bookings.find((b) => b.status === "approved")

  const handleCategorySelect = (type: VehicleType) => {
    setSelectedVehicleType(type)
    setCurrentScreen("vehicles")
  }

  const featuredVehicles = mockVehicles.filter((v) => v.rating >= 4.8).slice(0, 3)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary-foreground/20">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-primary-foreground/70 text-sm">Welcome back</p>
              <h2 className="text-primary-foreground font-semibold text-lg">
                {user?.name || "User"}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen("notifications")}
            className="relative p-3 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors"
          >
            <Bell className="w-5 h-5 text-primary-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-medium">Pickup Location</span>
                </div>
                <Input
                  placeholder="Enter pickup location"
                  className="border-0 bg-muted/50 h-10"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Date</span>
                </div>
                <Input
                  type="date"
                  className="border-0 bg-muted/50 h-10"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              <Button size="icon" className="h-12 w-12 rounded-xl shrink-0">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 space-y-6">
        {/* Active Booking Banner */}
        {activeBooking && (
          <Card
            className="border-0 bg-gradient-to-r from-success/10 to-success/5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentScreen("history")}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Car className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Active Booking
                </p>
                <p className="text-xs text-muted-foreground">
                  {activeBooking.vehicle.name} - {activeBooking.pickupDate}
                </p>
              </div>
              <Badge variant="secondary" className="bg-success/20 text-success border-0">
                Confirmed
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Categories</h3>
            <button className="text-sm text-primary font-medium">See All</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["car", "auto", "lorry"] as VehicleType[]).map((type) => {
              const Icon = categoryIcons[type]
              const vehicleCount = mockVehicles.filter(
                (v) => v.type === type
              ).length
              return (
                <button
                  key={type}
                  onClick={() => handleCategorySelect(type)}
                  className="group"
                >
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardContent className="p-4 flex flex-col items-center gap-2">
                      <div
                        className={`w-14 h-14 rounded-2xl ${categoryColors[type]} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="font-medium text-sm text-foreground">
                        {categoryLabels[type]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {vehicleCount} available
                      </span>
                    </CardContent>
                  </Card>
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured Vehicles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-warning" />
              <h3 className="text-lg font-semibold text-foreground">Featured</h3>
            </div>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {featuredVehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                onClick={() => {
                  setSelectedVehicleType(vehicle.type)
                  setCurrentScreen("vehicles")
                }}
              >
                <CardContent className="p-0 flex">
                  <div className="w-32 h-24 bg-muted overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">
                          {vehicle.name}
                        </h4>
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium text-foreground">
                            {vehicle.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {vehicle.seats} seats | {vehicle.transmission} |{" "}
                        {vehicle.fuel}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-primary">
                          ${vehicle.pricePerDay}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          /day
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setCurrentScreen("home")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-primary"
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
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs font-medium">Alerts</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-destructive rounded-full" />
            )}
          </button>
          <button
            onClick={() => setCurrentScreen("profile")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
