import { type BoardCut, type CuttingResult as CuttingResultType } from '../types'

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

interface CuttingResultProps {
  results: CuttingResultType[]
}

const PIECE_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
]

function CuttingDiagram({
  stockLengthMm,
  boards,
}: {
  stockLengthMm: number
  boards: BoardCut[]
}) {
  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        Schéma de répartition
      </p>
      {boards.map((board, boardIndex) => (
        <div key={boardIndex} className="space-y-1">
          <label className="text-xs text-gray-600 dark:text-gray-400">
            Planche {boardIndex + 1}
          </label>
          <div className="flex h-10 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
            {board.pieces.map((pieceMm, pieceIndex) => {
              const widthPct = (pieceMm / stockLengthMm) * 100
              const color =
                PIECE_COLORS[pieceIndex % PIECE_COLORS.length]
              const showLabel = widthPct >= 12
              return (
                <div
                  key={pieceIndex}
                  className={`flex shrink-0 items-center justify-center overflow-hidden border-r border-white/30 last:border-r-0 ${color} text-xs font-medium text-white`}
                  style={{ width: `${widthPct}%` }}
                  title={`Coupe : ${pieceMm} mm`}
                >
                  {showLabel ? `${pieceMm} mm` : null}
                </div>
              )
            })}
            {board.wasteMm > 0 && (
              <div
                className="flex shrink-0 items-center justify-center overflow-hidden bg-gray-200 dark:bg-gray-600"
                style={{
                  width: `${(board.wasteMm / stockLengthMm) * 100}%`,
                }}
                title={`Chute : ${board.wasteMm} mm`}
              >
                {(board.wasteMm / stockLengthMm) * 100 >= 8 ? (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {board.wasteMm} mm
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function CuttingResult({ results }: CuttingResultProps) {
  const toShow = results.filter((r) => r.stockCount > 0)
  if (toShow.length === 0) return null

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Résultat — Liste de courses
      </h2>

      <ul className="space-y-4">
        {toShow.map((r) => (
          <li
            key={r.stockProduct.id}
            className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-700 dark:bg-gray-800/80"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {r.stockProduct.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
                  {r.stockCount} à acheter
                </span>
                {(r.stockProduct.pricePerUnit ?? 0) > 0 && (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatPrice(r.stockCount * (r.stockProduct.pricePerUnit ?? 0))}
                  </span>
                )}
              </div>
            </div>
            {r.cuts.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {r.cuts.map((c, i) => (
                  <li key={i}>
                    {c.quantity} × {c.lengthMm} mm
                  </li>
                ))}
              </ul>
            )}
            {r.boards.length > 0 && (
              <CuttingDiagram
                stockLengthMm={r.stockProduct.lengthMm}
                boards={r.boards}
              />
            )}
            {r.wasteMm > 0 && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                Chute totale : {r.wasteMm} mm
              </p>
            )}
          </li>
        ))}
      </ul>

      {(() => {
        const total = toShow.reduce(
          (sum, r) => sum + r.stockCount * (r.stockProduct.pricePerUnit ?? 0),
          0
        )
        if (total > 0) {
          return (
            <div className="mt-6 flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Coût total : {formatPrice(total)}
              </p>
            </div>
          )
        }
        return null
      })()}
    </section>
  )
}
