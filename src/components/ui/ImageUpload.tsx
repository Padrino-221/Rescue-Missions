'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { PiUploadSimple, PiX, PiSpinnerGap } from 'react-icons/pi'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  className?: string
}

export default function ImageUpload({ value, onChange, folder = 'rescue-mission', label, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) onChange(data.url)
    } catch {}
    setUploading(false)
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
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${
          dragOver ? 'border-lime bg-lime/5' : 'border-dark/15 hover:border-dark/30'
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
            <button
              onClick={(e) => { e.stopPropagation(); onChange('') }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-dark/70 flex items-center justify-center text-white hover:bg-dark/90 transition-colors"
            >
              <PiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center gap-3">
            {uploading ? (
              <PiSpinnerGap className="w-8 h-8 text-dark/30 animate-spin" />
            ) : (
              <PiUploadSimple className="w-8 h-8 text-dark/30" />
            )}
            <p className="text-sm text-dark/45">
              {uploading ? 'Uploading...' : 'Click or drag to upload an image'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
