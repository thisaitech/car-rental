"use client"

import { useApp, BookingStatus } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Star,
  User,
  Car,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Home,
  Bell,
} from "lucide-react"

const statusConfig: Record<
  BookingStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "bg-warning/10 text-warning border-warning/20",
    icon: Loader2,
  },
  approved: {
    label: "Approved",
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-primary/10 text-primary border-primary/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-muted text-muted-foreground border-border",
    icon: AlertCircle,
  },
}

export function HistoryScreen() {
  const { bookings, setCurrentScreen } = useApp()

  const activeBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "approved"
  )
  const pastBookings = bookings.filter(
    (b) =>
      b.status === "completed" ||
      b.status === "rejected" ||
      b.status === "cancelled"
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentScreen("home")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">My Bookings</h1>
            <p className="text-sm text-muted-foreground">
              {bookings.length} total bookings
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active" className="relative">
              Active
              {activeBookings.length > 0 && (
                <span className="ml-2 w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full inline-flex items-center justify-center">
                  {activeBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  No active bookings
                </h3>
                <p className="text-muted-foreground text-sm">
                  Book a vehicle to get started
                </p>
              </div>
            ) : (
              activeBookings.map((booking) => {
                const status = statusConfig[booking.status]
                const StatusIcon = status.icon

                return (
                  <Card
                    key={booking.id}
                    className="border-0 shadow-md overflow-hidden"
                  >
                    <CardContent className="p-0">
                      {/* Vehicle Image */}
                      <div className="relative h-36 bg-muted">
                        <img
                          src={booking.vehicle.image}
                          alt={booking.vehicle.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                        <Badge
                          className={`absolute top-3 right-3 ${status.color} border`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      {/* Booking Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-foreground">
                              {booking.vehicle.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.needsDriver ? "With Driver" : "Self Drive"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              ${booking.totalPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 py-3 border-y border-border mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">From:</span>
                            <span className="text-foreground">
                              {booking.pickupLocation}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span className="text-muted-foreground">To:</span>
                            <span className="text-foreground">
                              {booking.dropoffLocation}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-success" />
                            <span className="text-foreground">
                              {formatDate(booking.pickupDate)} -{" "}
                              {formatDate(booking.dropoffDate)}
                            </span>
                          </div>
                        </div>

                        {booking.driver && (
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                              <img
                                src={booking.driver.image}
                                alt={booking.driver.name}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {booking.driver.name}
                              </p>
                              <div className="flex items-center gap-1 text-warning">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs text-foreground">
                                  {booking.driver.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  No past bookings
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your completed trips will appear here
                </p>
              </div>
            ) : (
              pastBookings.map((booking) => {
                const status = statusConfig[booking.status]
                const StatusIcon = status.icon

                return (
                  <Card
                    key={booking.id}
                    className="border-0 shadow-sm"
                  >
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-20 h-16 bg-muted rounded-xl overflow-hidden">
                        <img
                          src={booking.vehicle.image}
                          alt={booking.vehicle.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-foreground">
                            {booking.vehicle.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${status.color}`}
                          >
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(booking.pickupDate)}
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          ${booking.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
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
            className="flex flex-col items-center gap-1 py-2 px-4 text-primary"
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
