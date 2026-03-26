import { Link } from 'react-router-dom'

export default function AssetDetailPage() {
  return (
    <div className="dashboard-page dashboard-detail-page">
      <div className="dashboard-content width-constrained dashboard-panel">
        <Link to="/dashboard/ciso" className="detail-back-link">← Kembali</Link>
        <h1 className="detail-placeholder-title">Detail Asset akan kita rapikan setelah halaman CISO utama selesai.</h1>
      </div>
    </div>
  )
}
