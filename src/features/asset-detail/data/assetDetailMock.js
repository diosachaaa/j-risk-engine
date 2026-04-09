export const assetDetails = [
  {
    id: 'asset-01',
    reportTitle: 'Asset-01',
    assetName: 'Asset-01',
    assetType: 'Server',
    status: 'Active',
    ipAddress: '192.168.1.1',
    updatedAt: '10 March 2026, 14:32',
    currentRiskScore: 86,
    riskLevel: 'High',

    riskSummaryDescription:
      'Aset ini memiliki tingkat risiko tinggi dan memerlukan perhatian segera untuk mencegah potensi ancaman keamanan yang lebih serius.',

    riskHistory: [
      {
        date: 'Mon, 18 Maret 2026',
        score: '85',
        status: 'High',
        detail: 'Terjadi sesuatu',
      },
      {
        date: 'Tue, 19 Maret 2026',
        score: '85',
        status: 'High',
        detail: 'Terjadi sesuatu',
      },
      {
        date: 'Wed, 20 Maret 2026',
        score: '85',
        status: 'High',
        detail: 'Terjadi sesuatu',
      },
      {
        date: 'Thu, 21 Maret 2026',
        score: '85',
        status: 'High',
        detail: 'Terjadi sesuatu',
      },
      {
        date: 'Fri, 22 Maret 2026',
        score: '85',
        status: 'High',
        detail: 'Terjadi sesuatu',
      },
      {
        date: 'Sat, 23 Maret 2026',
        score: '85',
        status: 'High',
        detail: 'Terjadi sesuatu',
      },
      {
        date: 'Sun, 24 Maret 2026',
        score: '85',
        status: 'High',
        detail: 'Terjadi sesuatu',
      },
    ],

    riskHistoryAnalysis:
      'Terjadi peningkatan signifikan pada hari Kamis yang menunjukkan adanya potensi ancaman atau aktivitas mencurigakan pada sistem.',

    vulnerabilities: ['CVE-2023-xxxx', 'Open port 22'],

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
  },
  {
    id: 'asset-02',
    reportTitle: 'Asset-02',
    assetName: 'Asset-02',
    assetType: 'Application',
    status: 'Active',
    ipAddress: '192.168.1.25',
    updatedAt: '10 March 2026, 15:10',
    currentRiskScore: 72,
    riskLevel: 'Medium',

    riskSummaryDescription:
      'Aset ini memiliki tingkat risiko sedang dan perlu dipantau secara berkala untuk memastikan tidak terjadi eskalasi ancaman.',

    riskHistory: [
      {
        date: 'Mon, 18 Maret 2026',
        score: '71',
        status: 'Medium',
        detail: 'Kenaikan minor',
      },
      {
        date: 'Tue, 19 Maret 2026',
        score: '72',
        status: 'Medium',
        detail: 'Stabil',
      },
      {
        date: 'Wed, 20 Maret 2026',
        score: '72',
        status: 'Medium',
        detail: 'Stabil',
      },
      {
        date: 'Thu, 21 Maret 2026',
        score: '73',
        status: 'Medium',
        detail: 'Terjadi spike kecil',
      },
      {
        date: 'Fri, 22 Maret 2026',
        score: '72',
        status: 'Medium',
        detail: 'Menurun',
      },
      {
        date: 'Sat, 23 Maret 2026',
        score: '72',
        status: 'Medium',
        detail: 'Stabil',
      },
      {
        date: 'Sun, 24 Maret 2026',
        score: '72',
        status: 'Medium',
        detail: 'Stabil',
      },
    ],

    riskHistoryAnalysis:
      'Skor risiko relatif stabil dengan sedikit peningkatan pada pertengahan minggu akibat aktivitas tidak biasa pada endpoint aplikasi.',

    vulnerabilities: ['CVE-2024-yyyy', 'Deprecated package'],

    vulnerabilityDescription:
      'Kerentanan pada dependency perlu diperbaiki untuk mengurangi peluang eksploitasi pada aplikasi.',

    securityAlerts: [
      {
        severity: 'Medium',
        description: 'API request anomaly',
        time: '15 min ago',
      },
      {
        severity: 'Low',
        description: 'Configuration drift detected',
        time: '1 hour ago',
      },
      {
        severity: 'Low',
        description: 'Repeated warning event',
        time: '2 hours ago',
      },
    ],

    alertDescription:
      'Mayoritas alert masih berada pada level sedang hingga rendah, tetapi perlu ditindaklanjuti untuk mencegah eskalasi.',

    technicalAnalysis: [
      'Terjadi anomali request pada endpoint tertentu',
      'Beberapa package aplikasi belum diperbarui',
      'Risiko masih dapat dikendalikan dengan mitigasi cepat',
      'Belum ditemukan indikasi compromise aktif',
    ],

    recommendations: [
      'Perbarui dependency aplikasi yang usang',
      'Lakukan review endpoint yang memicu anomali',
      'Perkuat rate limiting dan logging',
      'Pantau perubahan konfigurasi aplikasi',
    ],

    conclusion:
      'Asset-02 masih berada pada tingkat risiko yang dapat dikelola, namun tetap memerlukan mitigasi terarah agar tidak berkembang menjadi risiko tinggi.',
  },
]

export default assetDetails