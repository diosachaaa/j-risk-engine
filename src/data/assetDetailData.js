import { assetDetails } from './assetDetailMock'

export function getAssetDetailById(assetId) {
  if (!assetId) return assetDetails[0]

  return (
    assetDetails.find((item) => item.id === assetId) ??
    assetDetails.find((item) => item.id.toLowerCase() === String(assetId).toLowerCase()) ??
    null
  )
}

export function getFallbackAssetDetail(assetId = 'asset-01') {
  return {
    id: assetId,
    reportTitle: assetId,
    assetName: assetId,
    assetType: 'Server',
    status: 'Active',
    ipAddress: '192.168.1.1',
    updatedAt: '10 March 2026, 14:32',
    currentRiskScore: 86,
    riskLevel: 'High',
    riskSummaryDescription:
      'Aset ini memiliki tingkat risiko tinggi dan memerlukan perhatian segera untuk mencegah potensi ancaman keamanan yang lebih serius.',
    riskHistory: Array.from({ length: 7 }, () => ({
      date: 'Mon, 18 Maret 2026',
      score: '85',
      status: 'High',
      detail: 'Terjadi sesuatu',
    })),
    riskHistoryAnalysis:
      'Terjadi peningkatan signifikan pada hari Kamis yang menunjukkan adanya potensi ancaman atau aktivitas mencurigakan pada sistem.',
    vulnerabilities: ['CVE-2023-xxxx', 'Open port 22'],
    vulnerabilityDescription:
      'Kerentanan ini dapat dimanfaatkan oleh pihak tidak bertanggung jawab untuk mengakses sistem secara ilegal.',
    securityAlerts: [
      { severity: 'High', description: 'Alert Description', time: '5 min ago' },
      { severity: 'Medium', description: 'Alert Description', time: '10 min ago' },
      { severity: 'Low', description: 'Alert Description', time: '30 min ago' },
    ],
    alertDescription:
      'Terdapat beberapa aktivitas mencurigakan yang terdeteksi, terutama percobaan brute force yang berulang.',
    technicalAnalysis: [
      'Risiko meningkat sebesar 12% dalam 7 hari terakhir',
      'Aktivitas brute force terdeteksi secara berulang',
      'Aset ini termasuk dalam kategori prioritas tinggi',
      'Terdapat celah keamanan pada konfigurasi SSH',
    ],
    recommendations: [
      'Segera lakukan patch terhadap vulnerability yang terdeteksi',
      'Tutup atau batasi akses pada port 22',
      'Aktifkan proteksi tambahan terhadap brute force attack',
      'Lakukan monitoring intensif selama 24–48 jam ke depan',
    ],
    conclusion:
      `${assetId} berada dalam kondisi risiko tinggi dan membutuhkan tindakan segera untuk mengurangi potensi ancaman keamanan. Implementasi langkah mitigasi yang direkomendasikan diharapkan dapat menurunkan tingkat risiko secara signifikan.`,
  }
}