export const securityStatusData = [
  { label: 'Secure', value: 0, suffix: 'Assets', tone: 'green' },
  { label: 'Warning', value: 0, suffix: 'Assets', tone: 'yellow' },
  { label: 'Critical', value: 0, suffix: 'Assets', tone: 'red' },
]

export const assetRows = [
  {
    id: 'asset-01',
    name: 'Asset-01',
    type: 'Tipe Aset',
    score: 86,
    status: 'Tinggi',
    updatedAt: 'Update Terakhir',
  },
  {
    id: 'asset-02',
    name: 'Asset-02',
    type: 'Tipe Aset',
    score: 74,
    status: 'Sedang',
    updatedAt: 'Update Terakhir',
  },
  {
    id: 'asset-03',
    name: 'Asset-03',
    type: 'Tipe Aset',
    score: 22,
    status: 'Rendah',
    updatedAt: 'Update Terakhir',
  },
  {
    id: 'asset-04',
    name: 'Asset-04',
    type: 'Tipe Aset',
    score: 67,
    status: 'Sedang',
    updatedAt: 'Update Terakhir',
  },
  {
    id: 'asset-05',
    name: 'Asset-05',
    type: 'Tipe Aset',
    score: 85,
    status: 'Tinggi',
    updatedAt: 'Update Terakhir',
  },
  {
    id: 'asset-06',
    name: 'Asset-06',
    type: 'Tipe Aset',
    score: 18,
    status: 'Rendah',
    updatedAt: 'Update Terakhir',
  },
  {
    id: 'asset-07',
    name: 'Asset-07',
    type: 'Tipe Aset',
    score: 20,
    status: 'Rendah',
    updatedAt: 'Update Terakhir',
  },
  {
    id: 'asset-08',
    name: 'Asset-08',
    type: 'Tipe Aset',
    score: 17,
    status: 'Rendah',
    updatedAt: 'Update Terakhir',
  },
  {
    id: 'asset-09',
    name: 'Asset-09',
    type: 'Tipe Aset',
    score: 62,
    status: 'Sedang',
    updatedAt: 'Update Terakhir',
  },
  {
    id: 'asset-10',
    name: 'Asset-10',
    type: 'Tipe Aset',
    score: 45,
    status: 'Sedang',
    updatedAt: 'Update Terakhir',
  },
]

export const previewAssetDetail = {
  score: 86,
  riskLabel: 'HIGH RISK',
  assetName: 'Asset-01',
  vulnerabilities: ['CVE-2023-xxxx', 'Open port 22'],
  securityAlerts: ['Brute force detected', 'Suspicious login'],
  activities: ['Login attempt 10x', 'Config change detected'],
  lastUpdated: '10 min ago',
}

export const riskTrendData = []

export const recentAlerts = []

export const technicalAnalysisPoints = [
  {
    id: 'analysis-01',
    segments: [
      { text: 'Risk has increased by ' },
      { text: '0%', highlight: true },
      { text: ' on selected date' },
    ],
  },
  {
    id: 'analysis-02',
    segments: [
      { text: 'Server 1 memiliki risiko paling ' },
      { text: 'tinggi', highlight: true },
      { text: ' dengan skor ' },
      { text: '85', highlight: true },
    ],
  },
  {
    id: 'analysis-03',
    segments: [
      { text: 'Sebagian besar alert berasal dari ' },
      { text: 'brute force', highlight: true },
    ],
  },
  {
    id: 'analysis-04',
    segments: [{ text: 'Direkomendasikan untuk menangani 22 aset prioritas' }],
  },
]