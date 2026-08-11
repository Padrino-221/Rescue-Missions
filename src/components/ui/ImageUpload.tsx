'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { PiUploadSimple, PiX, PiSpinnerGap, PiWarning } from 'react-icons/pi'
import { useToast } from './Toast'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  className?: string
}

const MAX_SIZE_MB = 10

export default function ImageUpload({ value, onChange, folder = 'rescue-mission', label, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleUpload = async (file: File) => {
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
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
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
            if (file) handleUpload(file)
            e.target.value = ''
          }}
        />

        {value ? (
          <div className="relative aspect-video bg-dark/5">
            <Image src={value} alt="Uploaded image" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
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
              <p className="text-xs text-dark/30">Max {MAX_SIZE_MB}MB</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
