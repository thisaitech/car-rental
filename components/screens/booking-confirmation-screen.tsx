"use client"

import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Car,
  User,
  Star,
  ArrowRight,
  Home,
  Share2,
} from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"

export function BookingConfirmationScreen() {
  const { bookings, setCurrentScreen, needsDriver } = useApp()

  const latestBooking = bookings[0]

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#2563eb", "#60a5fa", "#93c5fd"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#2563eb", "#60a5fa", "#93c5fd"],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  if (!latestBooking) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Success Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-bounce">
            <Star className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
          Booking Confirmed!
        </h1>
        <p className="text-muted-foreground text-center mb-8 max-w-xs">
          Your reservation has been submitted successfully. You&apos;ll receive a
          confirmation shortly.
        </p>

        {/* Booking Summary */}
        <Card className="w-full max-w-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-16 bg-muted rounded-xl overflow-hidden">
                <img
                  src={latestBooking.vehicle.image}
                  alt={latestBooking.vehicle.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {latestBooking.vehicle.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {latestBooking.needsDriver ? "With Driver" : "Self Drive"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pickup</p>
                  <p className="text-sm font-medium text-foreground">
                    {latestBooking.pickupLocation || "To be confirmed"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Drop-off</p>
                  <p className="text-sm font-medium text-foreground">
                    {latestBooking.dropoffLocation || "To be confirmed"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {latestBooking.pickupDate} - {latestBooking.dropoffDate}
                  </p>
                </div>
              </div>

              {latestBooking.driver && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Driver</p>
                    <p className="text-sm font-medium text-foreground">
                      {latestBooking.driver.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  ${latestBooking.totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Booking ID: {latestBooking.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="px-4 pb-8 space-y-3">
        <Button
          className="w-full h-14 text-base font-semibold"
          onClick={() => setCurrentScreen("history")}
        >
          View Booking Details
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button
          variant="outline"
          className="w-full h-12"
          onClick={() => setCurrentScreen("home")}
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
