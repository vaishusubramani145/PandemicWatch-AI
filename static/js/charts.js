/**
 * PandemicWatch-AI Charts Library
 * Interactive charts for Disease Analysis & Historical Trends.
 */

let diseaseChartInstance = null;
let historicalChartInstance = null;

const DISEASE_SERIES = {
  dengue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    data: [12, 18, 25, 42, 68, 95, 134, 178, 152],
    regions: ['Tamil Nadu', 'Kerala', 'Karnataka'],
    analysis: 'Increasing disease-related signals were detected in multiple locations. Climatic indicators show ambient temperature within the optimal vector transmission window (26–29°C), with elevated syndromic search activity.',
    params: '<div><strong>R₀ Range:</strong> 1.5 – 3.2 (Vector-mediated)</div><div><strong>Incubation:</strong> 4 – 10 days</div><div><strong>Transmission:</strong> Mosquito (Aedes aegypti)</div>'
  },
  nipah: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    data: [0, 0, 0, 1, 4, 18, 5, 2, 8],
    regions: ['Kerala (Kozhikode)', 'Kerala (Malappuram)', 'Karnataka Border'],
    analysis: 'High-severity zoonotic spillover alert. Sentinel encephalitis admissions in Kozhikode correlate with fruit bat feeding cycles and palm sap harvesting.',
    params: '<div><strong>R₀ Range:</strong> 0.4 – 1.2 (Spillover driven)</div><div><strong>Incubation:</strong> 4 – 18 days</div><div><strong>Transmission:</strong> Pteropus fruit bats / palm sap</div>'
  },
  h5n1: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    data: [5, 12, 45, 80, 110, 60, 30, 75, 98],
    regions: ['Maharashtra (Nagpur)', 'Andhra Pradesh', 'Odisha'],
    analysis: 'Poultry mortality clusters detected along the Central Asian Flyway corridor. One Health inter-sectoral veterinary alert triggered.',
    params: '<div><strong>R₀ Range:</strong> 0.1 – 0.7 (Avian-to-human)</div><div><strong>Incubation:</strong> 2 – 8 days</div><div><strong>Transmission:</strong> Infected poultry & migratory waterfowl</div>'
  },
  respiratory: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    data: [75, 62, 58, 50, 85, 110, 105, 78, 92],
    regions: ['Tamil Nadu', 'Delhi NCR', 'Maharashtra'],
    analysis: 'Increasing disease-related signals were detected in multiple locations. Secondary wave of respiratory fever queries noted.',
    params: '<div><strong>R₀ Range:</strong> 1.8 – 4.5</div><div><strong>Incubation:</strong> 2 – 14 days</div><div><strong>Transmission:</strong> Airborne respiratory droplets</div>'
  }
};

const HISTORICAL_SERIES = {
  dengue_2024: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [14, 19, 28, 45, 72, 98, 140, 185, 160, 115, 64, 32],
    peak: 'August',
    regions: ['Tamil Nadu', 'Kerala', 'Karnataka']
  },
  dengue_2022: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [10, 15, 22, 38, 60, 82, 120, 165, 140, 95, 50, 25],
    peak: 'August',
    regions: ['Kerala', 'Tamil Nadu', 'Andhra Pradesh']
  },
  nipah_2022: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [0, 0, 1, 0, 2, 1, 3, 8, 42, 14, 3, 0],
    peak: 'September',
    regions: ['Kerala (Kozhikode)', 'Malappuram', 'Wayanad']
  },
  nipah_2018: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [0, 0, 0, 2, 58, 22, 5, 1, 0, 0, 0, 0],
    peak: 'May',
    regions: ['Kerala (Kozhikode)', 'Malappuram']
  },
  h5n1_2024: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [12, 88, 45, 20, 8, 5, 3, 11, 24, 18, 12, 15],
    peak: 'February',
    regions: ['Maharashtra (Nagpur)', 'Andhra Pradesh']
  }
};

function renderDiseaseChart(diseaseKey = 'dengue', canvasId = 'diseaseChart') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const dataset = DISEASE_SERIES[diseaseKey] || DISEASE_SERIES.dengue;
  const ctx = canvas.getContext('2d');

  if (diseaseChartInstance) {
    diseaseChartInstance.destroy();
  }

  diseaseChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataset.labels,
      datasets: [{
        label: 'Cases / Signals',
        data: dataset.data,
        borderColor: '#3ee2c0',
        backgroundColor: 'rgba(62, 226, 192, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3ee2c0',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#8a93a8' } },
        y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#8a93a8' } }
      }
    }
  });

  // Update text
  const elAnalysis = document.getElementById('diseaseAiAnalysis');
  const elRegions = document.getElementById('affectedRegionsList');
  const elParams = document.getElementById('diseaseParams');

  if (elAnalysis) elAnalysis.textContent = dataset.analysis;
  if (elRegions) elRegions.innerHTML = dataset.regions.map(r => `<li>${r}</li>`).join('');
  if (elParams) elParams.innerHTML = dataset.params;
}

function renderHistoricalChart(disease = 'dengue', year = '2024', canvasId = 'historicalChart') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const key = `${disease}_${year}`;
  const dataset = HISTORICAL_SERIES[key] || HISTORICAL_SERIES.dengue_2024;
  const ctx = canvas.getContext('2d');

  if (historicalChartInstance) {
    historicalChartInstance.destroy();
  }

  historicalChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataset.labels,
      datasets: [{
        label: 'Signal Trend',
        data: dataset.data,
        borderColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#facc15',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#8a93a8' } },
        y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#8a93a8' } }
      }
    }
  });

  // Update Peak badge & Regions
  const elPeak = document.getElementById('histPeakBadge');
  const elRegions = document.getElementById('histAffectedRegions');
  if (elPeak) elPeak.textContent = `Peak Signal: ${dataset.peak}`;
  if (elRegions) elRegions.innerHTML = dataset.regions.map(r => `<li>${r}</li>`).join('');
}
