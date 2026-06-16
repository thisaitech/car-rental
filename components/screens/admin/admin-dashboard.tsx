"use client"

import { useApp, mockVehicles, mockDrivers } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut,
  LayoutDashboard,
  ListOrdered,
  Truck,
  User,
  Settings,
  BarChart3,
  ChevronRight,
} from "lucide-react"

export function AdminDashboard() {
  const { firebaseLogout, setCurrentScreen, bookings } = useApp()

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    approvedBookings: bookings.filter((b) => b.status === "approved").length,
    totalRevenue: bookings
      .filter((b) => b.status === "approved" || b.status === "completed")
      .reduce((acc, b) => acc + b.totalPrice, 0),
    activeVehicles: mockVehicles.filter((v) => v.available).length,
    totalDrivers: mockDrivers.length,
  }

  const recentBookings = bookings.slice(0, 3)

  const handleLogout = () => firebaseLogout()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar for larger screens / Top nav for mobile */}
      <div className="bg-sidebar text-sidebar-foreground">
        {/* Mobile Header */}
        <div className="lg:hidden px-4 py-4 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">RideFleet</h1>
              <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <Button
            size="sm"
            className="shrink-0 bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setCurrentScreen("admin-bookings")}
          >
            <ListOrdered className="w-4 h-4 mr-2" />
            Bookings
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setCurrentScreen("admin-vehicles")}
          >
            <Truck className="w-4 h-4 mr-2" />
            Vehicles
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setCurrentScreen("admin-drivers")}
          >
            <Users className="w-4 h-4 mr-2" />
            Drivers
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalBookings}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.pendingBookings}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ${stats.totalRevenue.toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.activeVehicles}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Vehicles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => setCurrentScreen("admin-bookings")}
            >
              <ListOrdered className="w-6 h-6 text-primary" />
              <span>Manage Bookings</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => setCurrentScreen("admin-vehicles")}
            >
              <Truck className="w-6 h-6 text-primary" />
              <span>Manage Vehicles</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => setCurrentScreen("admin-drivers")}
            >
              <Users className="w-6 h-6 text-primary" />
              <span>Manage Drivers</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
            >
              <BarChart3 className="w-6 h-6 text-primary" />
              <span>View Reports</span>
            </Button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Recent Bookings</h3>
            <Button
              variant="link"
              className="text-primary p-0 h-auto"
              onClick={() => setCurrentScreen("admin-bookings")}
            >
              View All
            </Button>
          </div>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0 divide-y divide-border">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-10 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={booking.vehicle.image}
                      alt={booking.vehicle.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {booking.vehicle.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.pickupDate}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      booking.status === "pending"
                        ? "bg-warning/10 text-warning"
                        : booking.status === "approved"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Driver Stats */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Top Drivers</h3>
          <div className="space-y-3">
            {mockDrivers.slice(0, 3).map((driver, index) => (
              <Card key={driver.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={driver.image} />
                      <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{driver.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{driver.trips} trips</span>
                      <span>|</span>
                      <span className="text-warning">★ {driver.rating}</span>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      driver.available
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {driver.available ? "Active" : "Busy"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
