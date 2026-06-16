"use client"

import { useState } from "react"
import { useApp, mockDrivers, Driver } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Star,
  Phone,
  Car,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react"

export function AdminDrivers() {
  const { setCurrentScreen } = useApp()
  const [drivers, setDrivers] = useState(mockDrivers)

  const toggleAvailability = (driverId: string) => {
    setDrivers(
      drivers.map((d) =>
        d.id === driverId ? { ...d, available: !d.available } : d
      )
    )
  }

  const activeDrivers = drivers.filter((d) => d.available).length
  const totalTrips = drivers.reduce((acc, d) => acc + d.trips, 0)
  const avgRating = (
    drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length
  ).toFixed(1)

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentScreen("admin-dashboard")}
              className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Manage Drivers
              </h1>
              <p className="text-sm text-muted-foreground">
                {drivers.length} total drivers
              </p>
            </div>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-2">
                <Car className="w-5 h-5 text-success" />
              </div>
              <p className="text-lg font-bold text-foreground">{activeDrivers}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">{totalTrips}</p>
              <p className="text-xs text-muted-foreground">Total Trips</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-warning" />
              </div>
              <p className="text-lg font-bold text-foreground">{avgRating}</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Driver List */}
        <div className="space-y-4">
          {drivers.map((driver) => (
            <Card key={driver.id} className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={driver.image} />
                    <AvatarFallback className="text-lg">
                      {driver.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-foreground">
                          {driver.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {driver.phone}
                          </span>
                        </div>
                      </div>
                      <Switch
                        checked={driver.available}
                        onCheckedChange={() => toggleAvailability(driver.id)}
                      />
                    </div>

                    <div className="flex items-center gap-4 py-2 border-t border-border mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="font-semibold text-foreground">
                          {driver.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Car className="w-4 h-4" />
                        <span>{driver.trips} trips</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          driver.available
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {driver.available ? "Active" : "Offline"}
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive/20 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
