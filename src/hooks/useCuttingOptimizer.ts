import { useMemo } from 'react'
import { optimizeCutting } from '../lib/cuttingOptimizer'
import type { CutItem, CuttingResult, StockProduct } from '../types'

interface UseCuttingOptimizerParams {
  products: StockProduct[]
  cutItemsByProduct: Record<string, CutItem[]>
  kerfMm: number
}

export function useCuttingOptimizer({
  products,
  cutItemsByProduct,
  kerfMm,
}: UseCuttingOptimizerParams): CuttingResult[] {
  return useMemo(() => {
    const results: CuttingResult[] = []

    for (const product of products) {
      const items = cutItemsByProduct[product.id] ?? []
      const pieces = items
        .filter((i) => i.quantity > 0 && i.lengthMm <= product.lengthMm)
        .map((i) => ({ lengthMm: i.lengthMm, quantity: i.quantity }))

      const { stockCount, cuts, wasteMm, boards } = optimizeCutting({
        stockLengthMm: product.lengthMm,
        pieces,
        kerfMm,
      })

      results.push({
        stockProduct: product,
        stockCount,
        cuts,
        wasteMm,
        boards,
      })
    }

    return results
  }, [products, cutItemsByProduct, kerfMm])
}
