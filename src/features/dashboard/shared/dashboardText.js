const dashboardText = {
  id: {
    titles: {
      ciso: 'CISO Dashboard',
      management: 'Management Dashboard',
      assetDetail: 'Detail Aset',
    },

    topbar: {
      user: 'User',
    },

    footer: {
      privacyPolicy: 'Kebijakan Privasi',
      termsOfUse: 'Syarat Penggunaan',
      copyright: 'Hak Cipta © 2026 Bank Jatim, Seluruh hak dilindungi',
    },

    metricStrip: {
      totalAssets: 'TOTAL JUMLAH ASET',
      low: 'RENDAH',
      medium: 'SEDANG',
      high: 'TINGGI',
    },

    recentAlert: {
      title: 'ALERT TERBARU',
    },

    riskTrend: {
      title: 'TREN RISIKO',
      today: 'Hari ini',
      selectPeriod: 'Pilih periode tren risiko',
      highestRiskPrefix: 'Risiko tertinggi pada',
      periods: {
        daily: 'Harian',
        weekly: 'Mingguan',
        monthly: 'Bulanan',
        yearly: 'Tahunan',
      },
    },

    securityStatus: {
      title: 'STATUS KEAMANAN',
    },

    technicalAnalysis: {
      title: 'ANALISIS TEKNIS',
      empty: 'Belum ada analisis teknis.',
    },

    topRiskTable: {
      searchPlaceholder: 'Cari aset...',
      riskFilter: 'Filter Risiko',
      typeFilter: 'Filter Tipe',
      columns: {
        assetName: 'Nama Aset',
        assetType: 'Tipe Aset',
        riskScore: 'Skor Risiko',
        assetStatus: 'Status Aset',
        status: 'Status Aset',
        lastUpdated: 'Update Terakhir',
      },
      empty: 'Data aset tidak ditemukan.',
    },

    assetPreview: {
      title: 'Detail Aset',
      closeLabel: 'Tutup detail aset',
      assetName: 'Nama Aset',
      vulnerabilities: 'Kerentanan',
      securityAlert: 'Peringatan Keamanan',
      activityLog: 'Log Aktivitas',
      lastUpdated: 'Terakhir diperbarui:',
      viewDetail: 'Lihat Detail',
      riskLabels: {
        high: 'RISIKO TINGGI',
        medium: 'RISIKO SEDANG',
        low: 'RISIKO RENDAH',
      },
    },

    managementPage: {
      distributionTitle: 'PIE CHART',
      trendTitle: 'CHART',
      trendAriaLabel: 'Grafik tren risiko mingguan',
      insightTitle: 'INSIGHTS & RECOMMENDATION',
      labels: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
      },
      insights: {
        riskTrendStart: 'Rata-rata indeks risiko mingguan berada di ',
        riskTrendMiddle: ' dengan perubahan ',
        riskTrendEnd: (isIncrease) =>
          isIncrease
            ? ' dibanding awal minggu.'
            : ' dibanding awal minggu.',
        topAssetStart: 'Aset dengan risiko tertinggi saat ini adalah ',
        topAssetMiddle: ' dengan skor ',
        topAssetEnd: '.',
        peakDayStart: 'Puncak tren risiko terjadi pada label ',
        peakDayMiddle: ' dengan nilai ',
        peakDayEnd: '.',
        priorityStart: 'Direkomendasikan memprioritaskan ',
        priorityMiddle: ' aset tinggi dan ',
        priorityEnd: ' aset sedang untuk mitigasi tahap awal.',
      },
    },
  },

  en: {
    titles: {
      ciso: 'CISO Dashboard',
      management: 'Management Dashboard',
      assetDetail: 'Asset Detail',
    },

    topbar: {
      user: 'User',
    },

    footer: {
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      copyright: 'Copyright © 2026 Bank Jatim, All rights reserved',
    },

    metricStrip: {
      totalAssets: 'TOTAL ASSETS',
      low: 'LOW',
      medium: 'MEDIUM',
      high: 'HIGH',
    },

    recentAlert: {
      title: 'RECENT ALERT',
    },

    riskTrend: {
      title: 'RISK TREND',
      today: 'Today',
      selectPeriod: 'Select risk trend period',
      highestRiskPrefix: 'Highest risk on',
      periods: {
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        yearly: 'Yearly',
      },
    },

    securityStatus: {
      title: 'SECURITY STATUS',
    },

    technicalAnalysis: {
      title: 'TECHNICAL ANALYSIS',
      empty: 'No technical analysis available yet.',
    },

    topRiskTable: {
      searchPlaceholder: 'Search assets...',
      riskFilter: 'Risk Filter',
      typeFilter: 'Type Filter',
      columns: {
        assetName: 'Asset Name',
        assetType: 'Asset Type',
        riskScore: 'Risk Score',
        assetStatus: 'Asset Status',
        status: 'Asset Status',
        lastUpdated: 'Last Updated',
      },
      empty: 'No asset data found.',
    },

    assetPreview: {
      title: 'Asset Detail',
      closeLabel: 'Close asset detail',
      assetName: 'Asset Name',
      vulnerabilities: 'Vulnerabilities',
      securityAlert: 'Security Alert',
      activityLog: 'Activity Log',
      lastUpdated: 'Last updated:',
      viewDetail: 'View Detail',
      riskLabels: {
        high: 'HIGH RISK',
        medium: 'MEDIUM RISK',
        low: 'LOW RISK',
      },
    },

    managementPage: {
      distributionTitle: 'PIE CHART',
      trendTitle: 'CHART',
      trendAriaLabel: 'Weekly risk trend chart',
      insightTitle: 'INSIGHTS & RECOMMENDATION',
      labels: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
      },
      insights: {
        riskTrendStart: 'The weekly risk index average is ',
        riskTrendMiddle: ' with a ',
        riskTrendEnd: (isIncrease) =>
          isIncrease
            ? ' change from the start of the week.'
            : ' change from the start of the week.',
        topAssetStart: 'The highest-risk asset currently is ',
        topAssetMiddle: ' with a score of ',
        topAssetEnd: '.',
        peakDayStart: 'The peak risk trend occurs on label ',
        peakDayMiddle: ' with a value of ',
        peakDayEnd: '.',
        priorityStart: 'It is recommended to prioritize ',
        priorityMiddle: ' high-risk assets and ',
        priorityEnd: ' medium-risk assets for the first mitigation phase.',
      },
    },
  },
}

export default dashboardText