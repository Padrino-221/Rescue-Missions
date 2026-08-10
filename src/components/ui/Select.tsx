'use client'

import { useState, useRef, useEffect } from 'react'
import { PiCaretDown, PiCheck } from 'react-icons/pi'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  className?: string
}

export default function Select({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  error,
  className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value || '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentValue = value !== undefined ? value : internalValue
  const selectedLabel = options.find((o) => o.value === currentValue)?.label

  function handleSelect(val: string) {
    if (value === undefined) setInternalValue(val)
    onChange?.(val)
    setOpen(false)
  }

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-dark mb-2">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-left flex items-center justify-between transition-colors ${
          error ? 'border-red-400' : open ? 'border-dark/40' : 'border-dark/15'
        } ${currentValue ? 'text-dark' : 'text-dark/35'}`}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <PiCaretDown className={`w-4 h-4 text-dark/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1.5 py-1.5 bg-white border border-dark/15 rounded-xl shadow-lg max-h-56 overflow-auto z-50">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between transition-colors ${
                currentValue === option.value ? 'bg-lime/15 text-dark' : 'text-dark/65 hover:bg-cream'
              }`}
            >
              <span className="truncate">{option.label}</span>
              {currentValue === option.value && <PiCheck className="w-4 h-4 text-dark flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}
