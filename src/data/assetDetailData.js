export const assetDetailData = {
  id: 'Asset-01',
  name: 'Asset-01',
  type: 'Server',
  status: 'Active',
  ipAddress: '192.168.1.1',
  lastUpdated: '10 March 2026, 14:32',
  currentRiskScore: 86,
  currentRiskScoreReport: 85,
  riskLevel: 'HIGH',
  summary:
    'Aset ini memiliki tingkat risiko tinggi dan memerlukan perhatian segera untuk mencegah potensi ancaman keamanan yang lebih serius.',
  riskHistory: [
    {
      date: 'Mon, 18 March 2026',
      riskScore: 85,
      status: 'High',
      detail: 'Terjadi sesuatu',
    },
    {
      date: 'Sun, 17 March 2026',
      riskScore: 85,
      status: 'High',
      detail: 'Terjadi sesuatu',
    },
    {
      date: 'Sat, 16 March 2026',
      riskScore: 85,
      status: 'High',
      detail: 'Terjadi sesuatu',
    },
    {
      date: 'Fri, 15 March 2026',
      riskScore: 85,
      status: 'High',
      detail: 'Terjadi sesuatu',
    },
    {
      date: 'Thu, 14 March 2026',
      riskScore: 85,
      status: 'High',
      detail: 'Terjadi sesuatu',
    },
    {
      date: 'Wed, 13 March 2026',
      riskScore: 85,
      status: 'High',
      detail: 'Terjadi sesuatu',
    },
    {
      date: 'Tue, 12 March 2026',
      riskScore: 85,
      status: 'High',
      detail: 'Terjadi sesuatu',
    },
  ],
  analysis:
    'Terjadi peningkatan signifikan pada hari Kamis yang menunjukkan adanya potensi ancaman atau aktivitas mencurigakan pada sistem.',
  vulnerabilities: ['CVE-2023-XXXX', 'Open port 22'],
  vulnerabilityDescription:
    'Kerentanan ini dapat dimanfaatkan oleh pihak tidak bertanggung jawab untuk mengakses sistem secara ilegal.',
  securityAlerts: [
    {
      severity: 'High',
      description: 'Alert Description',
      time: '5 min ago',
    },
    {
      severity: 'Medium',
      description: 'Alert Description',
      time: '10 min ago',
    },
    {
      severity: 'Low',
      description: 'Alert Description',
      time: '30 min ago',
    },
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
    'Asset-01 berada dalam kondisi risiko tinggi dan membutuhkan tindakan segera untuk mengurangi potensi ancaman keamanan. Implementasi langkah mitigasi yang direkomendasikan diharapkan dapat menurunkan tingkat risiko secara signifikan.',
}