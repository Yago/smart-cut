import { describe, expect, it } from 'vitest'
import { optimizeCutting } from './cuttingOptimizer'

describe('optimizeCutting', () => {
  it('exemple utilisateur : 10 cm, 1 m, 1,50 m tiennent dans 1 planche de 3 m', () => {
    const result = optimizeCutting({
      stockLengthMm: 3000,
      pieces: [
        { lengthMm: 100, quantity: 1 },
        { lengthMm: 1000, quantity: 1 },
        { lengthMm: 1500, quantity: 1 },
      ],
    })
    expect(result.stockCount).toBe(1)
    expect(result.cuts).toEqual([
      { lengthMm: 1500, quantity: 1 },
      { lengthMm: 1000, quantity: 1 },
      { lengthMm: 100, quantity: 1 },
    ])
    expect(result.boards).toHaveLength(1)
    expect(result.boards[0].pieces).toEqual([1500, 1000, 100])
    expect(result.boards[0].wasteMm).toBe(400)
  })

  it('cas trivial : 1 pièce de 2 m dans planche 3 m → 1 planche', () => {
    const result = optimizeCutting({
      stockLengthMm: 3000,
      pieces: [{ lengthMm: 2000, quantity: 1 }],
    })
    expect(result.stockCount).toBe(1)
    expect(result.cuts).toEqual([{ lengthMm: 2000, quantity: 1 }])
    expect(result.wasteMm).toBe(1000)
  })

  it('cas limite : pièces exactement égales à la planche', () => {
    const result = optimizeCutting({
      stockLengthMm: 3000,
      pieces: [{ lengthMm: 3000, quantity: 2 }],
    })
    expect(result.stockCount).toBe(2)
    expect(result.cuts).toEqual([{ lengthMm: 3000, quantity: 2 }])
    expect(result.wasteMm).toBe(0)
  })

  it('cas avec quantités : 4 × 1 m dans planche 3 m → 2 planches', () => {
    const result = optimizeCutting({
      stockLengthMm: 3000,
      pieces: [{ lengthMm: 1000, quantity: 4 }],
    })
    expect(result.stockCount).toBe(2)
    expect(result.cuts).toEqual([{ lengthMm: 1000, quantity: 4 }])
    expect(result.wasteMm).toBe(2000)
  })

  it('cas kerf : épaisseur de coupe augmente le nombre de planches si nécessaire', () => {
    const withoutKerf = optimizeCutting({
      stockLengthMm: 1000,
      pieces: [
        { lengthMm: 500, quantity: 2 },
      ],
    })
    expect(withoutKerf.stockCount).toBe(1)

    const withKerf = optimizeCutting({
      stockLengthMm: 1000,
      pieces: [
        { lengthMm: 500, quantity: 2 },
      ],
      kerfMm: 5,
    })
    expect(withKerf.stockCount).toBe(2)
  })

  it('cas nécessitant 2 planches : 1,50 m + 1,50 m + 10 cm = 3,10 m', () => {
    const result = optimizeCutting({
      stockLengthMm: 3000,
      pieces: [
        { lengthMm: 1500, quantity: 2 },
        { lengthMm: 100, quantity: 1 },
      ],
    })
    expect(result.stockCount).toBe(2)
    expect(result.cuts).toEqual([
      { lengthMm: 1500, quantity: 2 },
      { lengthMm: 100, quantity: 1 },
    ])
  })

  it('cas vide : liste vide → 0 planche', () => {
    const result = optimizeCutting({
      stockLengthMm: 3000,
      pieces: [],
    })
    expect(result.stockCount).toBe(0)
    expect(result.cuts).toEqual([])
    expect(result.wasteMm).toBe(0)
    expect(result.boards).toEqual([])
  })
})
