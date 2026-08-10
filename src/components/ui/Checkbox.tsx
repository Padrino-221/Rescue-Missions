'use client'

import { useState } from 'react'
import { PiCheck } from 'react-icons/pi'

export interface CheckboxProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export default function Checkbox({ label, checked = false, onChange, className = '' }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked)

  function handleChange() {
    const next = !isChecked
    setIsChecked(next)
    onChange?.(next)
  }

  return (
    <label className={`flex items-start gap-3 cursor-pointer group ${className}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        onClick={handleChange}
        className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          isChecked ? 'bg-dark border-dark' : 'border-dark/20 bg-white group-hover:border-dark/40'
        }`}
      >
        {isChecked && <PiCheck className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>
      <span className="text-sm text-dark/70 leading-snug">{label}</span>
    </label>
  )
}
