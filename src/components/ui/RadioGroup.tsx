'use client'

import { useState } from 'react'

export interface RadioOption {
  label: string
  value: string
}

export interface RadioGroupProps {
  label?: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export default function RadioGroup({ label, options, value, onChange, className = '' }: RadioGroupProps) {
  const [selected, setSelected] = useState(value || '')

  function handleSelect(val: string) {
    setSelected(val)
    onChange?.(val)
  }

  return (
    <div className={className}>
      {label && <p className="text-sm font-medium text-dark mb-3">{label}</p>}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <button
              type="button"
              role="radio"
              aria-checked={selected === option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                selected === option.value ? 'border-dark' : 'border-dark/20 group-hover:border-dark/40'
              }`}
            >
              {selected === option.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-dark" />
              )}
            </button>
            <span className="text-sm text-dark/70">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
