"use client"

import { Check } from "lucide-react"

interface CustomCheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function CustomCheckbox({ checked, onCheckedChange, disabled = false, className = "" }: CustomCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`
        w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors
        ${checked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-500"}
        ${className}
      `}
    >
      {checked && <Check className="w-3 h-3 text-white" />}
    </button>
  )
}