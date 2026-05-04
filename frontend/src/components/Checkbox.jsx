import React from 'react'

export default function Checkbox({ id, checked, onChange, label, labelClassName }) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative flex items-center cursor-pointer" htmlFor={id}>
        <input
          className="sr-only peer"
          id={id}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <span
          className="w-4 h-4 rounded border-2 border-[#22c55e] bg-[#0a0a0a] flex items-center justify-center transition-colors duration-150
            peer-checked:bg-[#22c55e] peer-focus-visible:ring-2 peer-focus-visible:ring-[#22c55e]/50"
        >
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </label>
      {label && (
        <label className={`text-sm font-medium text-[#a3a3a3] select-none cursor-pointer ${labelClassName || ''}`} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  )
}
