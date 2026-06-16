"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  UserCheck,
  FileText,
  Check,
  X,
  Car,
  Star,
} from "lucide-react"

export function DriverOptionScreen() {
  const {
    selectedVehicle,
    setNeedsDriver,
    setCurrentScreen,
  } = useApp()

  const handleDriverOption = (needsDriver: boolean) => {
    setNeedsDriver(needsDriver)
    if (needsDriver) {
      setCurrentScreen("booking-details")
    } else {
      setCurrentScreen("license-upload")
    }
  }

  if (!selectedVehicle) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentScreen("vehicles")}
            className="p-2 -ml-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">
              Driver Option
            </h1>
            <p className="text-sm text-primary-foreground/70">
              Choose how you want to drive
            </p>
          </div>
        </div>

        {/* Selected Vehicle Card */}
        <Card className="border-0 shadow-lg">
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
              <p className="text-sm text-muted-foreground mt-1">
                {selectedVehicle.seats} seats | {selectedVehicle.transmission}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Need a Driver?
          </h2>
          <p className="text-muted-foreground">
            Choose whether you want to drive yourself or have one of our
            professional drivers take you to your destination
          </p>
        </div>

        <div className="space-y-4">
          {/* With Driver Option */}
          <Card
            className="border-2 border-transparent hover:border-primary cursor-pointer transition-all hover:shadow-lg group"
            onClick={() => handleDriverOption(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <UserCheck className="w-8 h-8 text-primary group-hover:text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    Yes, I Need a Driver
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Our experienced drivers will ensure a safe and comfortable
                    journey
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${selectedVehicle.priceWithDriver}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per day
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" /> Professional drivers
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" /> Fully insured
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" /> 24/7 support
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Self Drive Option */}
          <Card
            className="border-2 border-transparent hover:border-primary cursor-pointer transition-all hover:shadow-lg group"
            onClick={() => handleDriverOption(false)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Car className="w-8 h-8 text-accent group-hover:text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    No, I&apos;ll Drive Myself
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload your driving license and enjoy the freedom of
                    self-drive
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${selectedVehicle.pricePerDay}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per day
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-warning bg-warning/10 px-2 py-1 rounded-full">
                    <FileText className="w-3 h-3" /> License required
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" /> Unlimited miles
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" /> Flexible schedule
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Comparison */}
        <Card className="mt-6 bg-muted/50 border-0">
          <CardContent className="p-4">
            <h4 className="font-semibold text-foreground mb-3">
              Price Comparison
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Self Drive</span>
                <span className="font-semibold text-foreground">
                  ${selectedVehicle.pricePerDay}/day
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  With Driver
                </span>
                <span className="font-semibold text-foreground">
                  ${selectedVehicle.priceWithDriver}/day
                </span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Driver Convenience Fee
                </span>
                <span className="font-semibold text-primary">
                  +${selectedVehicle.priceWithDriver - selectedVehicle.pricePerDay}/day
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
