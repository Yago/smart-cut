interface FormFieldProps {
  id: string
  label: string
  children: React.ReactNode
  helptext?: string
}

export function FormField({ id, label, children, helptext }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      {children}
      <span className="block min-h-[1.25rem] text-xs text-gray-500 dark:text-gray-400">
        {helptext ?? '\u00A0'}
      </span>
    </div>
  )
}
