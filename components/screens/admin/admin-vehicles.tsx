"use client"

import { useState } from "react"
import { useApp, mockVehicles, Vehicle, VehicleType } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Car,
  Bike,
  Truck,
  Star,
  Users,
  Fuel,
  Settings2,
  Plus,
  Edit,
  Trash2,
  DollarSign,
} from "lucide-react"

const categoryIcons = {
  car: Car,
  auto: Bike,
  lorry: Truck,
}

export function AdminVehicles() {
  const { setCurrentScreen } = useApp()
  const [vehicles, setVehicles] = useState(mockVehicles)

  const toggleAvailability = (vehicleId: string) => {
    setVehicles(
      vehicles.map((v) =>
        v.id === vehicleId ? { ...v, available: !v.available } : v
      )
    )
  }

  const getVehiclesByType = (type: VehicleType) => {
    return vehicles.filter((v) => v.type === type)
  }

  const renderVehicleCard = (vehicle: Vehicle) => {
    const CategoryIcon = categoryIcons[vehicle.type]

    return (
      <Card key={vehicle.id} className="border-0 shadow-md overflow-hidden">
        <CardContent className="p-0">
          {/* Vehicle Image */}
          <div className="relative h-36 bg-muted">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <Badge
              className={`absolute top-3 left-3 ${
                vehicle.available
                  ? "bg-success/90 text-success-foreground"
                  : "bg-muted text-muted-foreground"
              } border-0`}
            >
              {vehicle.available ? "Available" : "Unavailable"}
            </Badge>
            <div className="absolute top-3 right-3 flex gap-2">
              <button className="p-2 bg-card/90 rounded-full hover:bg-card transition-colors">
                <Edit className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 bg-card/90 rounded-full hover:bg-destructive/90 hover:text-destructive-foreground transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-foreground">{vehicle.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground capitalize">
                    {vehicle.type}
                  </span>
                  <span className="text-warning">★ {vehicle.rating}</span>
                </div>
              </div>
              <Switch
                checked={vehicle.available}
                onCheckedChange={() => toggleAvailability(vehicle.id)}
              />
            </div>

            {/* Specs */}
            <div className="flex items-center gap-4 py-3 border-y border-border mb-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{vehicle.seats}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Settings2 className="w-4 h-4" />
                <span>{vehicle.transmission}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Fuel className="w-4 h-4" />
                <span>{vehicle.fuel}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Self Drive</p>
                <p className="font-bold text-foreground">
                  ${vehicle.pricePerDay}/day
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">With Driver</p>
                <p className="font-bold text-primary">
                  ${vehicle.priceWithDriver}/day
                </p>
              </div>
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
                Manage Vehicles
              </h1>
              <p className="text-sm text-muted-foreground">
                {vehicles.length} total vehicles
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
        <div className="grid grid-cols-3 gap-3 mb-4">
          {(["car", "auto", "lorry"] as VehicleType[]).map((type) => {
            const Icon = categoryIcons[type]
            const count = getVehiclesByType(type).length
            const available = getVehiclesByType(type).filter(
              (v) => v.available
            ).length

            return (
              <Card key={type} className="border-0 shadow-sm">
                <CardContent className="p-3 text-center">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {type}s
                  </p>
                  <p className="text-xs text-success">{available} available</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Vehicle Tabs */}
      <div className="px-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="car">Cars</TabsTrigger>
            <TabsTrigger value="auto">Autos</TabsTrigger>
            <TabsTrigger value="lorry">Lorries</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {vehicles.map((vehicle) => renderVehicleCard(vehicle))}
          </TabsContent>

          {(["car", "auto", "lorry"] as VehicleType[]).map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              {getVehiclesByType(type).map((vehicle) =>
                renderVehicleCard(vehicle)
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
