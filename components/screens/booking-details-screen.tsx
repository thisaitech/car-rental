"use client"

import { useState } from "react"
import { useApp, mockDrivers } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Star,
  Phone,
  Car,
  User,
  CheckCircle2,
} from "lucide-react"

export function BookingDetailsScreen() {
  const {
    selectedVehicle,
    needsDriver,
    user,
    setCurrentScreen,
    pickupLocation,
    setPickupLocation,
    dropoffLocation,
    setDropoffLocation,
    pickupDate,
    setPickupDate,
    dropoffDate,
    setDropoffDate,
    createBooking,
  } = useApp()

  const [selectedDriver, setSelectedDriver] = useState(mockDrivers[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateDays = () => {
    if (!pickupDate || !dropoffDate) return 1
    const start = new Date(pickupDate)
    const end = new Date(dropoffDate)
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diff > 0 ? diff : 1
  }

  const days = calculateDays()
  const pricePerDay = needsDriver
    ? selectedVehicle?.priceWithDriver || 0
    : selectedVehicle?.pricePerDay || 0
  const subtotal = pricePerDay * days
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleSubmit = async () => {
    if (!selectedVehicle || !user) return
    setIsSubmitting(true)
    try {
      await createBooking({
        vehicleId: selectedVehicle.id,
        vehicle: selectedVehicle,
        userId: user.id,
        driverId: needsDriver ? selectedDriver.id : undefined,
        driver: needsDriver ? selectedDriver : undefined,
        needsDriver: needsDriver || false,
        pickupLocation,
        dropoffLocation,
        pickupDate,
        dropoffDate,
        totalPrice: total,
        status: "pending",
      })
    } catch (err) {
      console.error("Failed to create booking:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedVehicle) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setCurrentScreen(needsDriver ? "driver-option" : "license-upload")
            }
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Booking Details
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete your reservation
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Vehicle Summary */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4 flex gap-4">
            <div className="w-24 h-20 bg-muted rounded-xl overflow-hidden">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {selectedVehicle.name}
              </h3>
              <div className="flex items-center gap-1 text-warning mt-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm text-foreground">
                  {selectedVehicle.rating}
                </span>
              </div>
              <Badge
                variant="secondary"
                className={`mt-2 ${
                  needsDriver
                    ? "bg-primary/10 text-primary"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {needsDriver ? "With Driver" : "Self Drive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Trip Details */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Trip Details</h3>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Pickup Location
                </Label>
                <Input
                  placeholder="Enter pickup address"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Drop-off Location
                </Label>
                <Input
                  placeholder="Enter drop-off address"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Pickup Date
                  </Label>
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Return Date
                  </Label>
                  <Input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Selection (if needed) */}
        {needsDriver && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Select Your Driver
            </h3>
            <div className="space-y-3">
              {mockDrivers.map((driver) => (
                <Card
                  key={driver.id}
                  className={`border-2 cursor-pointer transition-all ${
                    selectedDriver?.id === driver.id
                      ? "border-primary shadow-md"
                      : "border-transparent shadow-sm hover:border-primary/30"
                  }`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={driver.image} />
                      <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {driver.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-sm text-foreground">
                            {driver.rating}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {driver.trips} trips
                        </span>
                      </div>
                    </div>
                    {selectedDriver?.id === driver.id && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Price Summary</h3>
          <Card className="border-0 shadow-sm bg-muted/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {needsDriver ? "With Driver" : "Self Drive"} ({days}{" "}
                  {days === 1 ? "day" : "days"})
                </span>
                <span className="font-medium text-foreground">
                  ${pricePerDay} x {days}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-medium text-foreground">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <Button
          className="w-full h-14 text-base font-semibold"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !pickupLocation ||
            !dropoffLocation ||
            !pickupDate ||
            !dropoffDate
          }
        >
          {isSubmitting ? "Confirming Booking..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  )
}
