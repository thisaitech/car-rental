"use client"

import { useApp, mockVehicles, Vehicle } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Bike,
  Truck,
  ArrowLeft,
  Star,
  Users,
  Fuel,
  Settings2,
  Filter,
  SlidersHorizontal,
} from "lucide-react"

const categoryIcons = {
  car: Car,
  auto: Bike,
  lorry: Truck,
}

const categoryLabels = {
  car: "Cars",
  auto: "Autos",
  lorry: "Lorries",
}

export function VehicleSelectionScreen() {
  const {
    selectedVehicleType,
    setSelectedVehicle,
    setCurrentScreen,
  } = useApp()

  const vehicles = mockVehicles.filter(
    (v) => v.type === selectedVehicleType
  )

  const CategoryIcon = selectedVehicleType
    ? categoryIcons[selectedVehicleType]
    : Car

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setCurrentScreen("driver-option")
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card sticky top-0 z-10 border-b border-border">
        <div className="px-4 pt-12 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentScreen("home")}
              className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">
                {selectedVehicleType ? categoryLabels[selectedVehicleType] : "Vehicles"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {vehicles.length} vehicles available
              </p>
            </div>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <Badge
            variant="secondary"
            className="shrink-0 px-4 py-2 bg-primary text-primary-foreground cursor-pointer"
          >
            All
          </Badge>
          <Badge
            variant="secondary"
            className="shrink-0 px-4 py-2 cursor-pointer hover:bg-muted"
          >
            <Filter className="w-3 h-3 mr-1" />
            Price
          </Badge>
          <Badge
            variant="secondary"
            className="shrink-0 px-4 py-2 cursor-pointer hover:bg-muted"
          >
            <Star className="w-3 h-3 mr-1" />
            Top Rated
          </Badge>
          <Badge
            variant="secondary"
            className="shrink-0 px-4 py-2 cursor-pointer hover:bg-muted"
          >
            Available Now
          </Badge>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="px-4 pt-4 space-y-4">
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            className="border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-0">
              {/* Vehicle Image */}
              <div className="relative h-44 bg-muted overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-card/90 text-foreground backdrop-blur-sm border-0">
                    <Star className="w-3 h-3 mr-1 fill-warning text-warning" />
                    {vehicle.rating}
                  </Badge>
                </div>
                {vehicle.available && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-success/90 text-success-foreground border-0">
                      Available
                    </Badge>
                  </div>
                )}
              </div>

              {/* Vehicle Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {vehicle.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      ${vehicle.pricePerDay}
                    </div>
                    <p className="text-xs text-muted-foreground">per day</p>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 mb-4 py-3 border-y border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{vehicle.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Settings2 className="w-4 h-4" />
                    <span className="text-sm">{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Fuel className="w-4 h-4" />
                    <span className="text-sm">{vehicle.fuel}</span>
                  </div>
                </div>

                {/* Pricing Options */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">
                      Self Drive
                    </p>
                    <p className="text-base font-bold text-foreground">
                      ${vehicle.pricePerDay}/day
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">
                      With Driver
                    </p>
                    <p className="text-base font-bold text-primary">
                      ${vehicle.priceWithDriver}/day
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold"
                  onClick={() => handleSelectVehicle(vehicle)}
                  disabled={!vehicle.available}
                >
                  {vehicle.available ? "Select Vehicle" : "Not Available"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <CategoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No vehicles found
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
