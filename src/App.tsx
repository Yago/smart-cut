import { useRef, useState } from 'react'
import { CuttingResult } from './components/CuttingResult'
import { CutListForm } from './components/CutListForm'
import { FormField } from './components/FormField'
import { StockProductForm } from './components/StockProductForm'
import { useCuttingOptimizer } from './hooks/useCuttingOptimizer'
import type { CutItem, ProjectState, StockProduct } from './types'

function App() {
  const [products, setProducts] = useState<StockProduct[]>([])
  const [cutItemsByProduct, setCutItemsByProduct] = useState<Record<string, CutItem[]>>({})
  const [kerfMm, setKerfMm] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    const state: ProjectState = {
      products,
      cutItemsByProduct,
      kerfMm,
    }
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quincaillerie-project.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLoad = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const state = JSON.parse(reader.result as string) as ProjectState
        if (
          Array.isArray(state.products) &&
          typeof state.cutItemsByProduct === 'object' &&
          typeof state.kerfMm === 'number'
        ) {
          setProducts(state.products)
          setCutItemsByProduct(state.cutItemsByProduct ?? {})
          setKerfMm(state.kerfMm)
        }
      } catch {
        // Invalid JSON or structure — ignore
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleAddProduct = (product: StockProduct) => {
    setProducts((prev) => [...prev, product])
    setCutItemsByProduct((prev) => ({ ...prev, [product.id]: [] }))
  }

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setCutItemsByProduct((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const handleUpdateProduct = (id: string, updates: Partial<StockProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  const handleCutItemsChange = (productId: string, items: CutItem[]) => {
    setCutItemsByProduct((prev) => ({ ...prev, [productId]: items }))
  }

  const results = useCuttingOptimizer({
    products,
    cutItemsByProduct,
    kerfMm,
  })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white px-4 py-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Liste de courses — Planches et Chevrons
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Optimisez vos achats en répartissant les longueurs sur les planches et chevrons du magasin.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden
            />
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={handleLoad}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Charger
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <StockProductForm
          products={products}
          onAdd={handleAddProduct}
          onRemove={handleRemoveProduct}
          onUpdate={handleUpdateProduct}
        />

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Paramètres
          </h2>
          <FormField id="kerf" label="Épaisseur de coupe (kerf) — optionnel" helptext="mm">
            <input
              id="kerf"
              type="number"
              min={0}
              step={0.5}
              value={kerfMm}
              onChange={(e) => setKerfMm(Math.max(0, e.target.valueAsNumber || 0))}
              className="h-10 w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </FormField>
        </section>

        {products.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Listes de découpe
            </h2>
            {products.map((product) => (
              <CutListForm
                key={product.id}
                product={product}
                items={cutItemsByProduct[product.id] ?? []}
                onItemsChange={(items) => handleCutItemsChange(product.id, items)}
              />
            ))}
          </section>
        )}

        {results.length > 0 && <CuttingResult results={results} />}
      </main>
    </div>
  )
}

export default App
