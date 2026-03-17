interface LengthInputProps {
  value: number
  onChange: (valueMm: number) => void
  placeholder?: string
  id?: string
  label?: string
}

export function LengthInput({
  value,
  onChange,
  placeholder = '0',
  id,
  label,
}: LengthInputProps) {
  const displayValue = value === 0 ? '' : value.toString()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(',', '.')
    if (raw === '') {
      onChange(0)
      return
    }
    const parsed = Number.parseFloat(raw)
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onChange(Math.round(parsed))
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-10 w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />
      <span className="block min-h-[1.25rem] text-xs text-gray-500 dark:text-gray-400">
        mm
      </span>
    </div>
  )
}
