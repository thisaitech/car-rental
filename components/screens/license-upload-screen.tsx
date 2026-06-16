"use client"

import { useState, useRef } from "react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Upload,
  Camera,
  FileText,
  Check,
  Image as ImageIcon,
  X,
  AlertCircle,
} from "lucide-react"

export function LicenseUploadScreen() {
  const { setLicenseImage, setCurrentScreen, selectedVehicle } = useApp()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    setIsUploading(true)
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleContinue = () => {
    if (uploadedImage) {
      setLicenseImage(uploadedImage)
      setCurrentScreen("booking-details")
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentScreen("driver-option")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Upload License
            </h1>
            <p className="text-sm text-muted-foreground">
              Verify your driving credentials
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Info Card */}
        <Card className="mb-6 border-0 bg-primary/5">
          <CardContent className="p-4 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Why we need this
              </h4>
              <p className="text-sm text-muted-foreground">
                To ensure safety for all parties, we require a valid driving
                license for self-drive rentals. Your information is encrypted
                and secure.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">
            Driving License
          </h3>

          {!uploadedImage ? (
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {isUploading ? (
                <div className="py-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Upload your license
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop or click to browse
                  </p>
                  <div className="flex justify-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      JPG
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      PNG
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      PDF
                    </span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-border">
              <img
                src={uploadedImage}
                alt="Uploaded license"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">License uploaded</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alternative Upload Options */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
          >
            <Camera className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Take Photo
            </span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
          >
            <ImageIcon className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-foreground">
              From Gallery
            </span>
          </button>
        </div>

        {/* Requirements */}
        <Card className="border-0 bg-muted/50 mb-8">
          <CardContent className="p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Requirements
            </h4>
            <ul className="space-y-2">
              {[
                "Clear photo of the front side",
                "All text must be readable",
                "License must be valid and not expired",
                "Name must match your account",
              ].map((req, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {req}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          className="w-full h-14 text-base font-semibold"
          onClick={handleContinue}
          disabled={!uploadedImage}
        >
          Continue to Booking
        </Button>
      </div>
    </div>
  )
}
