/**
 * First Fit Decreasing (FFD) algorithm for 1D cutting stock problem.
 * Sorts pieces by length descending, places each in the first board where it fits.
 */

export interface OptimizeCuttingInput {
  stockLengthMm: number
  pieces: ReadonlyArray<{ lengthMm: number; quantity: number }>
  kerfMm?: number
}

export interface BoardCut {
  pieces: number[]
  wasteMm: number
}

export interface OptimizeCuttingOutput {
  stockCount: number
  cuts: Array<{ lengthMm: number; quantity: number }>
  wasteMm: number
  boards: BoardCut[]
}

export function optimizeCutting(input: OptimizeCuttingInput): OptimizeCuttingOutput {
  const { stockLengthMm, pieces, kerfMm = 0 } = input

  const flatPieces: number[] = []
  for (const { lengthMm, quantity } of pieces) {
    for (let i = 0; i < quantity; i++) {
      flatPieces.push(lengthMm)
    }
  }

  if (flatPieces.length === 0) {
    return { stockCount: 0, cuts: [], wasteMm: 0, boards: [] }
  }

  flatPieces.sort((a, b) => b - a)

  const boardStates: Array<{ remaining: number; pieces: number[] }> = [
    { remaining: stockLengthMm, pieces: [] },
  ]
  const cuts: Array<{ lengthMm: number; quantity: number }> = []

  for (const pieceLength of flatPieces) {
    const required = pieceLength + kerfMm
    let placed = false

    for (let i = 0; i < boardStates.length; i++) {
      if (boardStates[i].remaining >= required) {
        boardStates[i].remaining -= required
        boardStates[i].pieces.push(pieceLength)
        const existing = cuts.find((c) => c.lengthMm === pieceLength)
        if (existing) {
          existing.quantity += 1
        } else {
          cuts.push({ lengthMm: pieceLength, quantity: 1 })
        }
        placed = true
        break
      }
    }

    if (!placed) {
      boardStates.push({
        remaining: stockLengthMm - required,
        pieces: [pieceLength],
      })
      const existing = cuts.find((c) => c.lengthMm === pieceLength)
      if (existing) {
        existing.quantity += 1
      } else {
        cuts.push({ lengthMm: pieceLength, quantity: 1 })
      }
    }
  }

  const wasteMm = boardStates.reduce((sum, b) => sum + b.remaining, 0)
  cuts.sort((a, b) => b.lengthMm - a.lengthMm)

  const boards: BoardCut[] = boardStates.map((b) => ({
    pieces: b.pieces,
    wasteMm: b.remaining,
  }))

  return {
    stockCount: boards.length,
    cuts,
    wasteMm,
    boards,
  }
}
