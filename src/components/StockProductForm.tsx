import { type StockProduct } from '../types'
import { FormField } from './FormField'

interface StockProductFormProps {
  products: StockProduct[]
  onAdd: (product: StockProduct) => void
  onRemove: (id: string) => void
  onUpdate?: (id: string, updates: Partial<StockProduct>) => void
}

export function StockProductForm({ products, onAdd, onRemove, onUpdate }: StockProductFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = (formData.get('name') as string)?.trim()
    const lengthStr = (formData.get('length') as string)?.replace(',', '.')
    const lengthMm = Number.parseFloat(lengthStr ?? '0')
    const priceStr = (formData.get('price') as string)?.replace(',', '.')
    const pricePerUnit = Number.parseFloat(priceStr ?? '0') || 0

    if (!name || Number.isNaN(lengthMm) || lengthMm <= 0) return

    onAdd({
      id: crypto.randomUUID(),
      name,
      lengthMm: Math.round(lengthMm),
      pricePerUnit,
    })
    form.reset()
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Produits du magasin
      </h2>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap items-end gap-6">
        <FormField id="product-name" label="Nom">
          <input
            id="product-name"
            name="name"
            type="text"
            placeholder="Planche 3 m"
            required
            className="h-10 w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </FormField>
        <FormField id="product-length" label="Longueur" helptext="mm">
          <input
            id="product-length"
            name="length"
            type="text"
            inputMode="decimal"
            placeholder="3000"
            required
            className="h-10 w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </FormField>
        <FormField id="product-price" label="Prix unitaire" helptext="CHF">
          <input
            id="product-price"
            name="price"
            type="text"
            inputMode="decimal"
            placeholder="0"
            className="h-10 w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </FormField>
        <div className="flex flex-col gap-1">
          <span className="block min-h-[1.25rem] text-sm font-medium" aria-hidden>
            {'\u00A0'}
          </span>
          <button
            type="submit"
            className="h-10 rounded-lg bg-violet-600 px-5 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Ajouter
          </button>
          <span className="block min-h-[1.25rem]" aria-hidden>
            {'\u00A0'}
          </span>
        </div>
      </form>

      {products.length > 0 && (
        <ul className="space-y-2">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              <span className="min-w-0 flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {p.name}
              </span>
              <span className="shrink-0 text-sm text-gray-600 dark:text-gray-400">
                {p.lengthMm} mm
              </span>
              <div className="flex shrink-0 items-center gap-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={(p.pricePerUnit ?? 0) === 0 ? '' : (p.pricePerUnit ?? 0)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(',', '.')
                    const v = raw === '' ? 0 : Number.parseFloat(raw)
                    if (!Number.isNaN(v) && v >= 0) onUpdate?.(p.id, { pricePerUnit: v })
                  }}
                  placeholder="0"
                  className="h-8 w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  aria-label={`Prix ${p.name}`}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">CHF</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                aria-label={`Supprimer ${p.name}`}
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
