import { useMemo, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

function normalizeText(value) {
  return String(value ?? '').toLowerCase()
}

function getRiskStatus(row) {
  return row?.riskStatus ?? row?.status ?? '-'
}

function getAssetStatusLabel(row) {
  return row?.assetStatusLabel ?? row?.assetStatus ?? '-'
}

export default function TopRiskTable({ rows = [], onOpenPreview }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const riskOptions = useMemo(() => {
    return [...new Set(rows.map((row) => getRiskStatus(row)).filter(Boolean))]
  }, [rows])

  const typeOptions = useMemo(() => {
    return [...new Set(rows.map((row) => row.type).filter(Boolean))]
  }, [rows])

  const filteredRows = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()

    return rows.filter((row) => {
      const riskStatus = getRiskStatus(row)
      const assetStatusLabel = getAssetStatusLabel(row)

      const matchesSearch =
        keyword === '' ||
        normalizeText(row.name).includes(keyword) ||
        normalizeText(row.type).includes(keyword) ||
        normalizeText(row.score).includes(keyword) ||
        normalizeText(riskStatus).includes(keyword) ||
        normalizeText(assetStatusLabel).includes(keyword) ||
        normalizeText(row.updatedAt).includes(keyword)

      const matchesRisk = riskFilter === '' || riskStatus === riskFilter
      const matchesType = typeFilter === '' || row.type === typeFilter

      return matchesSearch && matchesRisk && matchesType
    })
  }, [rows, searchQuery, riskFilter, typeFilter])

  function handleOpenPreview(row) {
    if (typeof onOpenPreview === 'function') {
      onOpenPreview(row)
    }
  }

  return (
    <section className="dashboard-panel top-risk-panel">
      <div className="top-risk-toolbar">
        <label className="top-risk-search">
          <Search size={24} />
          <input
            type="text"
            placeholder={t.topRiskTable.searchPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>

        <label className="top-risk-filter-button top-risk-filter-select">
          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
            aria-label={t.topRiskTable.riskFilter}
          >
            <option value="">{t.topRiskTable.riskFilter}</option>
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
            aria-label={t.topRiskTable.typeFilter}
          >
            <option value="">{t.topRiskTable.typeFilter}</option>
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
              <th>{t.topRiskTable.columns.assetName}</th>
              <th>{t.topRiskTable.columns.assetType}</th>
              <th>{t.topRiskTable.columns.riskScore}</th>
              <th>{t.topRiskTable.columns.assetStatus}</th>
              <th>{t.topRiskTable.columns.lastUpdated}</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => {
                const riskStatus = getRiskStatus(row)
                const assetStatusLabel = getAssetStatusLabel(row)

                return (
                  <tr
                    key={row.id}
                    className={`status-${row.level ?? normalizeText(riskStatus)}`}
                    onClick={() => handleOpenPreview(row)}
                  >
                    <td>{row.name ?? '-'}</td>
                    <td>{row.type ?? '-'}</td>
                    <td>{row.score ?? 0}</td>
                    <td>{assetStatusLabel}</td>
                    <td>{row.updatedAt ?? '-'}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="top-risk-empty-state">
                  {t.topRiskTable.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}