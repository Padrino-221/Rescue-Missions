'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Cropper, { type Area } from 'react-easy-crop'
import { PiUploadSimple, PiX, PiSpinnerGap, PiWarning, PiCheck, PiCrop } from 'react-icons/pi'
import { useToast } from './Toast'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  className?: string
  /**
   * Crop shape (width / height, e.g. 4 / 3, 3 / 4, 1).
   * When set, uploads go through a crop step so the saved photo already
   * matches the frame it will be shown in. Omit to keep the old behaviour.
   */
  aspect?: number
}

const MAX_SIZE_MB = 10
const MAX_CROP_EDGE = 1600

async function cropFile(imageSrc: string, pixels: Area): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read image'))
    img.src = imageSrc
  })
  const scale = Math.min(1, MAX_CROP_EDGE / Math.max(pixels.width, pixels.height))
  const outW = Math.max(1, Math.round(pixels.width * scale))
  const outH = Math.max(1, Math.round(pixels.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Crop failed')
  ctx.drawImage(image, pixels.x, pixels.y, pixels.width, pixels.height, 0, 0, outW, outH)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
  if (!blob) throw new Error('Crop failed')
  return new File([blob], 'photo.jpg', { type: 'image/jpeg' })
}

export default function ImageUpload({ value, onChange, folder = 'rescue-mission', label, className = '', aspect }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null)
  const [cropping, setCropping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const closeCropper = useCallback(() => {
    setCropSrc((src) => {
      if (src) URL.revokeObjectURL(src)
      return null
    })
    setPendingFile(null)
    setCroppedPixels(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCropping(false)
  }, [])

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      if (data.url) {
        onChange(data.url)
        toast('Image uploaded successfully')
      } else {
        throw new Error('No URL returned from upload')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to upload image'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setUploading(false)
    }
  }, [folder, onChange, toast])

  const beginFile = useCallback((file: File) => {
    setError(null)

    if (!file.type.startsWith('image/')) {
      const msg = 'Only image files are allowed'
      setError(msg)
      toast(msg, 'error')
      return
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_SIZE_MB) {
      const msg = `Image is too large (${sizeMB.toFixed(1)}MB). Maximum size is ${MAX_SIZE_MB}MB`
      setError(msg)
      toast(msg, 'error')
      return
    }

    if (aspect) {
      const src = URL.createObjectURL(file)
      setPendingFile(file)
      setCropSrc(src)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedPixels(null)
    } else {
      void uploadFile(file)
    }
  }, [aspect, toast, uploadFile])

  const applyCrop = useCallback(async () => {
    if (!cropSrc || !croppedPixels) return
    setCropping(true)
    try {
      const file = await cropFile(cropSrc, croppedPixels)
      closeCropper()
      await uploadFile(file)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not crop image'
      setError(msg)
      toast(msg, 'error')
      setCropping(false)
    }
  }, [cropSrc, croppedPixels, closeCropper, toast, uploadFile])

  const useOriginal = useCallback(() => {
    const file = pendingFile
    closeCropper()
    if (file) void uploadFile(file)
  }, [pendingFile, closeCropper, uploadFile])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) beginFile(file)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-dark mb-2">{label}</label>
      )}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${
          error ? 'border-red-300 bg-red-50/50' : dragOver ? 'border-lime bg-lime/5' : 'border-dark/15 hover:border-dark/30'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) beginFile(file)
            e.target.value = ''
          }}
        />

        {value ? (
          <div className="relative bg-dark/5" style={aspect ? { aspectRatio: aspect } : undefined}>
            <div className={aspect ? 'absolute inset-0' : 'relative aspect-video'}>
              <Image src={value} alt="Uploaded image" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            {!uploading && (
              <button
                onClick={(e) => { e.stopPropagation(); onChange(''); setError(null) }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-dark/70 flex items-center justify-center text-white hover:bg-dark/90 transition-colors"
              >
                <PiX className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center gap-3">
            {uploading ? (
              <PiSpinnerGap className="w-8 h-8 text-dark/30 animate-spin" />
            ) : error ? (
              <PiWarning className="w-8 h-8 text-red-400" />
            ) : (
              <PiUploadSimple className="w-8 h-8 text-dark/30" />
            )}
            <p className={`text-sm ${error ? 'text-red-500' : 'text-dark/45'}`}>
              {uploading ? 'Uploading...' : error || 'Click or drag to upload an image'}
            </p>
            {!uploading && !error && (
              <p className="text-xs text-dark/30">Max {MAX_SIZE_MB}MB{aspect ? ' • crop to fit' : ''}</p>
            )}
          </div>
        )}
      </div>

      {cropSrc && (
        <div className="fixed inset-0 z-[100] bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-1 flex items-center gap-2">
              <PiCrop className="w-5 h-5 text-dark/60" />
              <div>
                <h3 className="font-semibold text-dark">Adjust photo</h3>
                <p className="text-xs text-dark/50">Drag to position, scroll or slide to zoom. Faces should sit inside the frame.</p>
              </div>
            </div>
            <div className="relative h-[50vh] bg-dark/95 m-4 rounded-2xl overflow-hidden">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect ?? 4 / 3}
                onCropChange={setCrop}
                onCropComplete={(_, pixels) => setCroppedPixels(pixels)}
                onZoomChange={setZoom}
              />
            </div>
            <div className="px-4 pb-4 flex items-center gap-3">
              <span className="text-xs text-dark/50 font-medium">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[#0e3b2b]"
              />
            </div>
            <div className="px-4 pb-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={closeCropper}
                disabled={cropping}
                className="px-5 py-2.5 rounded-xl border border-dark/15 text-sm font-semibold text-dark hover:bg-dark/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={useOriginal}
                disabled={cropping || uploading}
                className="px-5 py-2.5 rounded-xl border border-dark/15 text-sm font-semibold text-dark hover:bg-dark/5 disabled:opacity-50"
              >
                Use original
              </button>
              <button
                type="button"
                onClick={applyCrop}
                disabled={cropping || uploading || !croppedPixels}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold hover:bg-dark-50 disabled:opacity-60"
              >
                {cropping ? <PiSpinnerGap className="animate-spin" /> : <PiCheck className="text-base" />}
                {cropping ? 'Cropping...' : 'Crop & upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
