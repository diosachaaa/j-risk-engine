export default function MetricStrip() {
  return (
    <section className="metric-strip dashboard-panel">
      <div className="metric-strip-total">
        <h2>TOTAL JUMLAH ASET</h2>
        <strong>0</strong>
      </div>

      <div className="metric-strip-breakdown">
        <div className="metric-strip-item green">
          <span>RENDAH</span>
          <strong>0</strong>
        </div>
        <div className="metric-strip-item yellow">
          <span>SEDANG</span>
          <strong>0</strong>
        </div>
        <div className="metric-strip-item red">
          <span>TINGGI</span>
          <strong>0</strong>
        </div>
      </div>
    </section>
  )
}
