"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

// ─── Types ────────────────────────────────────────────────────────────────────

export type VehicleType = "car" | "auto" | "lorry"
export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled"

export interface Vehicle {
  id: string
  name: string
  type: VehicleType
  image: string
  pricePerDay: number
  priceWithDriver: number
  seats: number
  transmission: string
  fuel: string
  rating: number
  available: boolean
}

export interface Driver {
  id: string
  name: string
  phone: string
  rating: number
  trips: number
  image: string
  available: boolean
}

export interface Booking {
  id: string
  vehicleId: string
  vehicle: Vehicle
  userId: string
  driverId?: string
  driver?: Driver
  needsDriver: boolean
  licenseImage?: string
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  dropoffDate: string
  totalPrice: number
  status: BookingStatus
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  isAdmin: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  authLoading: boolean
  currentScreen: string
  setCurrentScreen: (screen: string) => void
  selectedVehicleType: VehicleType | null
  setSelectedVehicleType: (type: VehicleType | null) => void
  selectedVehicle: Vehicle | null
  setSelectedVehicle: (vehicle: Vehicle | null) => void
  needsDriver: boolean | null
  setNeedsDriver: (needs: boolean | null) => void
  licenseImage: string | null
  setLicenseImage: (image: string | null) => void
  bookings: Booking[]
  setBookings: (bookings: Booking[]) => void
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  pickupLocation: string
  setPickupLocation: (location: string) => void
  dropoffLocation: string
  setDropoffLocation: (location: string) => void
  pickupDate: string
  setPickupDate: (date: string) => void
  dropoffDate: string
  setDropoffDate: (date: string) => void
  // Firebase actions
  firebaseLogin: (email: string, password: string) => Promise<void>
  firebaseRegister: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<void>
  firebaseAdminLogin: (email: string, password: string) => Promise<void>
  firebaseLogout: () => Promise<void>
  createBooking: (
    bookingData: Omit<Booking, "id" | "createdAt">
  ) => Promise<void>
  authError: string | null
  setAuthError: (err: string | null) => void
}

// ─── Static mock data (vehicles & drivers stay local — not in Firestore) ──────

export const mockVehicles: Vehicle[] = [
  {
    id: "car-1",
    name: "Toyota Camry",
    type: "car",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop",
    pricePerDay: 75,
    priceWithDriver: 120,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.8,
    available: true,
  },
  {
    id: "car-2",
    name: "Honda Accord",
    type: "car",
    image:
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=400&h=250&fit=crop",
    pricePerDay: 80,
    priceWithDriver: 130,
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    rating: 4.9,
    available: true,
  },
  {
    id: "car-3",
    name: "BMW 5 Series",
    type: "car",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
    pricePerDay: 150,
    priceWithDriver: 200,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.9,
    available: true,
  },
  {
    id: "auto-1",
    name: "Bajaj RE",
    type: "auto",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=250&fit=crop",
    pricePerDay: 25,
    priceWithDriver: 45,
    seats: 3,
    transmission: "Manual",
    fuel: "CNG",
    rating: 4.5,
    available: true,
  },
  {
    id: "auto-2",
    name: "Piaggio Ape",
    type: "auto",
    image:
      "https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=400&h=250&fit=crop",
    pricePerDay: 30,
    priceWithDriver: 50,
    seats: 4,
    transmission: "Manual",
    fuel: "Petrol",
    rating: 4.3,
    available: true,
  },
  {
    id: "lorry-1",
    name: "Tata 407",
    type: "lorry",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=250&fit=crop",
    pricePerDay: 100,
    priceWithDriver: 150,
    seats: 3,
    transmission: "Manual",
    fuel: "Diesel",
    rating: 4.6,
    available: true,
  },
  {
    id: "lorry-2",
    name: "Ashok Leyland",
    type: "lorry",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=250&fit=crop",
    pricePerDay: 180,
    priceWithDriver: 250,
    seats: 3,
    transmission: "Manual",
    fuel: "Diesel",
    rating: 4.7,
    available: true,
  },
]

export const mockDrivers: Driver[] = [
  {
    id: "driver-1",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.9,
    trips: 1250,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    available: true,
  },
  {
    id: "driver-2",
    name: "Amit Singh",
    phone: "+91 98765 43211",
    rating: 4.8,
    trips: 980,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    available: true,
  },
  {
    id: "driver-3",
    name: "Suresh Patel",
    phone: "+91 98765 43212",
    rating: 4.7,
    trips: 750,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    available: true,
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Booking Confirmed",
    message: "Your Toyota Camry rental has been approved. Pickup on Dec 15.",
    type: "success",
    read: false,
    createdAt: "2024-12-13T10:30:00Z",
  },
  {
    id: "notif-2",
    title: "Driver Assigned",
    message: "Rajesh Kumar will be your driver for the upcoming trip.",
    type: "info",
    read: false,
    createdAt: "2024-12-13T09:15:00Z",
  },
  {
    id: "notif-3",
    title: "Payment Received",
    message: "Your payment of $240 has been successfully processed.",
    type: "success",
    read: true,
    createdAt: "2024-12-12T14:20:00Z",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a Firestore doc snapshot into a Booking.
 * Handles both Timestamp and plain string createdAt values.
 */
function docToBooking(id: string, data: Record<string, unknown>): Booking {
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : typeof data.createdAt === "string"
      ? data.createdAt
      : new Date().toISOString()

  return {
    id,
    vehicleId: data.vehicleId as string,
    vehicle: data.vehicle as Vehicle,
    userId: data.userId as string,
    driverId: data.driverId as string | undefined,
    driver: data.driver as Driver | undefined,
    needsDriver: data.needsDriver as boolean,
    licenseImage: data.licenseImage as string | undefined,
    pickupLocation: data.pickupLocation as string,
    dropoffLocation: data.dropoffLocation as string,
    pickupDate: data.pickupDate as string,
    dropoffDate: data.dropoffDate as string,
    totalPrice: data.totalPrice as number,
    status: data.status as BookingStatus,
    createdAt,
  }
}

/** Maps a Firebase Auth error code to a human-readable message. */
function friendlyAuthError(code: string): string {
  const map: Record<string, string> = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/invalid-credential": "Invalid email or password.",
  }
  return map[code] ?? "An unexpected error occurred. Please try again."
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState("login")
  const [selectedVehicleType, setSelectedVehicleType] =
    useState<VehicleType | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [needsDriver, setNeedsDriver] = useState<boolean | null>(null)
  const [licenseImage, setLicenseImage] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications)
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [dropoffDate, setDropoffDate] = useState("")

  // ── 1. Restore auth session on mount ──────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            const restoredUser: User = {
              id: firebaseUser.uid,
              name: data.name ?? "",
              email: firebaseUser.email ?? "",
              phone: data.phone ?? "",
              avatar: data.avatar,
              isAdmin: data.isAdmin === true,
            }
            setUser(restoredUser)
            setCurrentScreen(restoredUser.isAdmin ? "admin-dashboard" : "home")
          }
        } catch {
          // Silently fail — user will stay on login screen
        }
      } else {
        setUser(null)
        setCurrentScreen("login")
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // ── 2. Real-time bookings listener ────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setBookings([])
      return
    }

    // Admins see ALL bookings; regular users see only their own
    const bookingsRef = collection(db, "bookings")
    const q = user.isAdmin
      ? query(bookingsRef, orderBy("createdAt", "desc"))
      : query(
          bookingsRef,
          where("userId", "==", user.id),
          orderBy("createdAt", "desc")
        )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const live = snapshot.docs.map((d) =>
          docToBooking(d.id, d.data() as Record<string, unknown>)
        )
        setBookings(live)
      },
      (error) => {
        console.error("Bookings snapshot error:", error)
      }
    )

    return () => unsubscribe()
  }, [user])

  // ── 3. Auth actions ───────────────────────────────────────────────────────

  const firebaseLogin = useCallback(
    async (email: string, password: string) => {
      setAuthError(null)
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).catch((err) => {
        throw new Error(friendlyAuthError(err.code))
      })

      const userDoc = await getDoc(
        doc(db, "users", credential.user.uid)
      ).catch(() => null)

      const data = userDoc?.data() ?? {}
      const loggedInUser: User = {
        id: credential.user.uid,
        name: (data.name as string) ?? credential.user.displayName ?? "",
        email: credential.user.email ?? email,
        phone: (data.phone as string) ?? "",
        avatar: data.avatar as string | undefined,
        isAdmin: data.isAdmin === true,
      }

      setUser(loggedInUser)
      setCurrentScreen(loggedInUser.isAdmin ? "admin-dashboard" : "home")
    },
    []
  )

  const firebaseRegister = useCallback(
    async (name: string, email: string, phone: string, password: string) => {
      setAuthError(null)
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).catch((err) => {
        throw new Error(friendlyAuthError(err.code))
      })

      // Persist extra profile fields to Firestore 'users' collection
      await setDoc(doc(db, "users", credential.user.uid), {
        name,
        email,
        phone,
        isAdmin: false,
        createdAt: serverTimestamp(),
      })

      const newUser: User = {
        id: credential.user.uid,
        name,
        email,
        phone,
        isAdmin: false,
      }

      setUser(newUser)
      setCurrentScreen("home")
    },
    []
  )

  /**
   * Admin login — authenticates with Firebase Auth then verifies
   * the `isAdmin: true` flag in the 'users' Firestore document.
   */
  const firebaseAdminLogin = useCallback(
    async (email: string, password: string) => {
      setAuthError(null)
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).catch((err) => {
        throw new Error(friendlyAuthError(err.code))
      })

      const userDoc = await getDoc(
        doc(db, "users", credential.user.uid)
      ).catch(() => null)

      const data = userDoc?.data() ?? {}
      if (data.isAdmin !== true) {
        await signOut(auth)
        throw new Error("Access denied. This account does not have admin privileges.")
      }

      const adminUser: User = {
        id: credential.user.uid,
        name: (data.name as string) ?? "Admin",
        email: credential.user.email ?? email,
        phone: (data.phone as string) ?? "",
        isAdmin: true,
      }

      setUser(adminUser)
      setCurrentScreen("admin-dashboard")
    },
    []
  )

  const firebaseLogout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
    setBookings([])
    setCurrentScreen("login")
  }, [])

  // ── 4. Create booking ─────────────────────────────────────────────────────

  const createBooking = useCallback(
    async (bookingData: Omit<Booking, "id" | "createdAt">) => {
      const docRef = await addDoc(collection(db, "bookings"), {
        ...bookingData,
        status: "pending",
        createdAt: serverTimestamp(),
      })

      // Optimistically prepend so the confirmation screen sees it immediately
      // (the onSnapshot listener will reconcile it shortly after)
      const optimistic: Booking = {
        ...bookingData,
        id: docRef.id,
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      setBookings((prev) => [optimistic, ...prev])
      setCurrentScreen("booking-confirmation")
    },
    []
  )

  // ── 5. Provider ───────────────────────────────────────────────────────────

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        currentScreen,
        setCurrentScreen,
        selectedVehicleType,
        setSelectedVehicleType,
        selectedVehicle,
        setSelectedVehicle,
        needsDriver,
        setNeedsDriver,
        licenseImage,
        setLicenseImage,
        bookings,
        setBookings,
        notifications,
        setNotifications,
        pickupLocation,
        setPickupLocation,
        dropoffLocation,
        setDropoffLocation,
        pickupDate,
        setPickupDate,
        dropoffDate,
        setDropoffDate,
        firebaseLogin,
        firebaseRegister,
        firebaseAdminLogin,
        firebaseLogout,
        createBooking,
        authError,
        setAuthError,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
