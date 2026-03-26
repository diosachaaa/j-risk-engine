// src/components/dashboard/TopRiskTable.jsx
import { useMemo, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

export default function TopRiskTable({ rows = [], onOpenPreview }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const riskOptions = useMemo(() => {
    return [...new Set(rows.map((row) => row.status).filter(Boolean))]
  }, [rows])

  const typeOptions = useMemo(() => {
    return [...new Set(rows.map((row) => row.type).filter(Boolean))]
  }, [rows])

  const filteredRows = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesSearch =
        keyword === '' ||
        row.name.toLowerCase().includes(keyword) ||
        row.type.toLowerCase().includes(keyword) ||
        String(row.score).toLowerCase().includes(keyword) ||
        row.status.toLowerCase().includes(keyword) ||
        row.updatedAt.toLowerCase().includes(keyword)

      const matchesRisk = riskFilter === '' || row.status === riskFilter
      const matchesType = typeFilter === '' || row.type === typeFilter

      return matchesSearch && matchesRisk && matchesType
    })
  }, [rows, searchQuery, riskFilter, typeFilter])

  return (
    <section className="dashboard-panel top-risk-panel">
      <div className="top-risk-toolbar">
        <label className="top-risk-search">
          <Search size={24} />
          <input
            type="text"
            placeholder="Cari aset..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>

        <label className="top-risk-filter-button top-risk-filter-select">
          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
            aria-label="Filter Risiko"
          >
            <option value="">Filter Risiko</option>
            {riskOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={20} />
        </label>

        <label className="top-risk-filter-button top-risk-filter-select">
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter Tipe"
          >
            <option value="">Filter Tipe</option>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={20} />
        </label>
      </div>

      <div className="top-risk-table-wrap">
        <table className="top-risk-table">
          <thead>
            <tr>
              <th>Nama Aset</th>
              <th>Tipe Aset</th>
              <th>Skor Risiko</th>
              <th>Status</th>
              <th>Update Terakhir</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className={`status-${row.status.toLowerCase()}`}
                  onClick={() => onOpenPreview(row)}
                >
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td>{row.score}</td>
                  <td>{row.status}</td>
                  <td>{row.updatedAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="top-risk-empty-state">
                  Data aset tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}