import { useState } from 'react'
import { type CutItem, type StockProduct } from '../types'
import { FormField } from './FormField'
import { LengthInput } from './LengthInput'

interface CutListFormProps {
  product: StockProduct
  items: CutItem[]
  onItemsChange: (items: CutItem[]) => void
}

export function CutListForm({ product, items, onItemsChange }: CutListFormProps) {
  const [lengthMm, setLengthMm] = useState(0)

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const quantityStr = (formData.get('quantity') as string)?.trim()
    const quantity = Number.parseInt(quantityStr ?? '1', 10)

    if (lengthMm <= 0 || Number.isNaN(quantity) || quantity < 1) return
    if (lengthMm > product.lengthMm) return

    onItemsChange([
      ...items,
      { id: crypto.randomUUID(), lengthMm, quantity },
    ])
    setLengthMm(0)
    form.reset()
  }

  const handleRemove = (id: string) => {
    onItemsChange(items.filter((i) => i.id !== id))
  }

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return
    onItemsChange(
      items.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
        Liste de découpe — {product.name}
      </h3>

      <form onSubmit={handleAdd} className="mb-4 flex flex-wrap items-end gap-6">
        <LengthInput
          id={`cut-length-${product.id}`}
          label="Longueur"
          value={lengthMm}
          onChange={setLengthMm}
          placeholder="1500"
        />
        <FormField id={`cut-qty-${product.id}`} label="Quantité">
          <input
            id={`cut-qty-${product.id}`}
            name="quantity"
            type="number"
            min={1}
            defaultValue={1}
            className="h-10 w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </FormField>
        <div className="flex flex-col gap-1">
          <span className="block min-h-[1.25rem] text-sm font-medium" aria-hidden>
            {'\u00A0'}
          </span>
            <button
            type="submit"
            disabled={lengthMm <= 0}
            className="h-10 rounded-lg bg-violet-600 px-5 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
          >
            Ajouter
          </button>
          <span className="block min-h-[1.25rem]" aria-hidden>
            {'\u00A0'}
          </span>
        </div>
      </form>

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {item.lengthMm} mm
              </span>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.valueAsNumber || 1)}
                className="w-16 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                aria-label="Supprimer"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
