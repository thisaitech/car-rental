"use client"

import { useState } from "react"
import { useApp, Booking, BookingStatus } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Check,
  X,
  Star,
  Phone,
  Car,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
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

export function AdminBookings() {
  const { bookings, setBookings, setCurrentScreen } = useApp()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const allBookings = bookings

  const handleApprove = async (bookingId: string) => {
    setProcessingId(bookingId)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "approved" as BookingStatus } : b
      )
    )
    setProcessingId(null)
  }

  const handleReject = async (bookingId: string) => {
    setProcessingId(bookingId)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "rejected" as BookingStatus } : b
      )
    )
    setProcessingId(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const renderBookingCard = (booking: Booking, showActions = false) => {
    const status = statusConfig[booking.status]
    const StatusIcon = status.icon
    const isProcessing = processingId === booking.id

    return (
      <Card key={booking.id} className="border-0 shadow-md overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-center gap-4 border-b border-border">
            <div className="w-16 h-12 bg-muted rounded-lg overflow-hidden">
              <img
                src={booking.vehicle.image}
                alt={booking.vehicle.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">
                {booking.vehicle.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                ID: {booking.id}
              </p>
            </div>
            <Badge className={`${status.color} border`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          {/* Details */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  {formatDate(booking.pickupDate)} - {formatDate(booking.dropoffDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Car className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">
                  {booking.needsDriver ? "With Driver" : "Self Drive"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-foreground">{booking.pickupLocation}</span>
                <span className="text-muted-foreground"> → </span>
                <span className="text-foreground">{booking.dropoffLocation}</span>
              </div>
            </div>

            {booking.driver && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-success" />
                <span className="text-muted-foreground">Driver:</span>
                <span className="text-foreground">{booking.driver.name}</span>
                <span className="text-warning">★ {booking.driver.rating}</span>
              </div>
            )}

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="text-lg font-bold text-primary">
                  ${booking.totalPrice.toFixed(2)}
                </p>
              </div>

              {showActions && booking.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive/20 hover:bg-destructive/10"
                    onClick={() => handleReject(booking.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-success hover:bg-success/90 text-success-foreground"
                    onClick={() => handleApprove(booking.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentScreen("admin-dashboard")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Manage Bookings
            </h1>
            <p className="text-sm text-muted-foreground">
              {pendingBookings.length} pending approval
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingBookings.length > 0 && (
                <span className="ml-2 w-5 h-5 text-xs bg-warning text-warning-foreground rounded-full inline-flex items-center justify-center">
                  {pendingBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  All caught up!
                </h3>
                <p className="text-muted-foreground text-sm">
                  No pending bookings to review
                </p>
              </div>
            ) : (
              pendingBookings.map((booking) =>
                renderBookingCard(booking, true)
              )
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {allBookings.map((booking) => renderBookingCard(booking, false))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
