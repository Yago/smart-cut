export interface StockProduct {
  id: string
  name: string
  lengthMm: number
  pricePerUnit: number
}

export interface CutItem {
  id: string
  lengthMm: number
  quantity: number
}

export interface BoardCut {
  pieces: number[]
  wasteMm: number
}

export interface CuttingResult {
  stockProduct: StockProduct
  stockCount: number
  cuts: Array<{ lengthMm: number; quantity: number }>
  wasteMm: number
  boards: BoardCut[]
}

export interface ProjectState {
  products: StockProduct[]
  cutItemsByProduct: Record<string, CutItem[]>
  kerfMm: number
}
