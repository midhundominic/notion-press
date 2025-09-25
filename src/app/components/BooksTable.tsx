import React, { useMemo, useState } from 'react'
import { Row } from "../../../utils/csv"

type Props = {
  headers: string[]
  original: Row[]
  edited: Row[]
  setEdited: (r: Row[]) => void
}

export default function BooksTable({ headers, original, edited, setEdited }: Props) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' | null }>({
    key: headers[0] ?? '',
    dir: null,
  })
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(50)
  const [filterText, setFilterText] = useState('')


  ;(window as any).setFilterFromToolbar = (v: string) => setFilterText(v)

  const editedMap = useMemo(() => {
    const map = new Map<number, Set<string>>()
    for (let i = 0; i < original.length; i++) {
      const o = original[i]
      const e = edited[i]
      if (!e) continue
      for (const h of headers) {
        if ((o[h] ?? '') !== (e[h] ?? '')) {
          if (!map.has(i)) map.set(i, new Set())
          map.get(i)!.add(h)
        }
      }
    }
    return map
  }, [original, edited, headers])

  const filtered = useMemo(() => {
    if (!filterText) return edited
    const t = filterText.toLowerCase()
    return edited.filter(
      (r) =>
        (r.title ?? '').toLowerCase().includes(t) ||
        (r.author ?? '').toLowerCase().includes(t)
    )
  }, [edited, filterText])

  const sorted = useMemo(() => {
    if (!sort.dir) return filtered
    const copy = [...filtered]
    copy.sort((a, b) => {
      const A = (a[sort.key] ?? '').toString()
      const B = (b[sort.key] ?? '').toString()
      if (A === B) return 0
      if (sort.dir === 'asc') return A > B ? 1 : -1
      return A < B ? 1 : -1
    })
    return copy
  }, [filtered, sort])

  const total = sorted.length
  const pages = Math.max(1, Math.ceil(total / perPage))
  const current = sorted.slice((page - 1) * perPage, page * perPage)

  function setCell(rowIndex: number, key: string, value: string) {
    const globalIndex = (page - 1) * perPage + rowIndex
    const copy = edited.map((r) => ({ ...r }))
    copy[globalIndex] = { ...copy[globalIndex], [key]: value }
    setEdited(copy)
  }

  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="p-2 text-left sticky top-0">
                <div className="flex items-center gap-2">
                  <button
                    className="font-medium"
                    onClick={() =>
                      setSort((s) => ({
                        key: h,
                        dir: s.key === h && s.dir === 'asc' ? 'desc' : 'asc',
                      }))
                    }
                  >
                    {h}
                  </button>
                  {sort.key === h && sort.dir && (
                    <span className="text-xs">
                      {sort.dir === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {current.map((row, idx) => {
            const globalIndex = (page - 1) * perPage + idx
            const changedCols = editedMap.get(globalIndex)
            const rowChanged = !!changedCols && changedCols.size > 0
            return (
              <tr
                key={globalIndex}
                className={rowChanged ? 'bg-amber-50' : ''}
              >
                {headers.map((h) => {
                  const changed = changedCols?.has(h)
                  return (
                    <td key={h} className="p-2 align-top border-t">
                      <input
                        value={row[h] ?? ''}
                        onChange={(e) => setCell(idx, h, e.target.value)}
                        className={`w-full bg-transparent outline-none ${
                          changed ? 'edited-cell border rounded px-1' : ''
                        }`}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Rows per page:</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value))
              setPage(1)
            }}
            className="border rounded px-2 py-1"
          >
            {[25, 50, 100, 250].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-2 py-1 border rounded"
          >
            First
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 border rounded"
          >
            Prev
          </button>
          <div className="px-3">
            Page <strong>{page}</strong> / {pages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
            disabled={page === pages}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
          <button
            onClick={() => setPage(pages)}
            disabled={page === pages}
            className="px-2 py-1 border rounded"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  )
}
