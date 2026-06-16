"use client"

import { AppProvider, useApp } from "@/lib/app-context"
import { LoginScreen } from "@/components/screens/login-screen"
import { HomeScreen } from "@/components/screens/home-screen"
import { VehicleSelectionScreen } from "@/components/screens/vehicle-selection-screen"
import { DriverOptionScreen } from "@/components/screens/driver-option-screen"
import { LicenseUploadScreen } from "@/components/screens/license-upload-screen"
import { BookingDetailsScreen } from "@/components/screens/booking-details-screen"
import { BookingConfirmationScreen } from "@/components/screens/booking-confirmation-screen"
import { NotificationsScreen } from "@/components/screens/notifications-screen"
import { HistoryScreen } from "@/components/screens/history-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import { AdminDashboard } from "@/components/screens/admin/admin-dashboard"
import { AdminBookings } from "@/components/screens/admin/admin-bookings"
import { AdminVehicles } from "@/components/screens/admin/admin-vehicles"
import { AdminDrivers } from "@/components/screens/admin/admin-drivers"

function AppContent() {
  const { currentScreen } = useApp()

  const screens: Record<string, React.ReactNode> = {
    login: <LoginScreen />,
    home: <HomeScreen />,
    vehicles: <VehicleSelectionScreen />,
    "driver-option": <DriverOptionScreen />,
    "license-upload": <LicenseUploadScreen />,
    "booking-details": <BookingDetailsScreen />,
    "booking-confirmation": <BookingConfirmationScreen />,
    notifications: <NotificationsScreen />,
    history: <HistoryScreen />,
    profile: <ProfileScreen />,
    "admin-dashboard": <AdminDashboard />,
    "admin-bookings": <AdminBookings />,
    "admin-vehicles": <AdminVehicles />,
    "admin-drivers": <AdminDrivers />,
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background rounded-3xl shadow-2xl overflow-hidden border border-border/50">
        {screens[currentScreen] || <LoginScreen />}
      </div>
    </div>
  )
}

export default function VehicleRentalApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
