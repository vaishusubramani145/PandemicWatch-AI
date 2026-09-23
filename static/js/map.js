/**
 * PandemicWatch-AI India Risk Map
 * Renders Leaflet map with 🟢 Low Risk, 🟡 Medium Risk, 🔴 High Risk indicators.
 */

let mapInstance = null;
let currentMarker = null;

const REGION_DATA = {
  "Tamil Nadu": {
    lat: 13.0827,
    lng: 80.2707,
    district: "Chennai",
    score: 72,
    level: "HIGH",
    signals: 18,
    disease: "Respiratory illness",
    updated: "23 Sep 2026",
    color: "#ff5c7c",
    explanation: [
      "Increase in disease-related reports",
      "Multiple reports from the same region",
      "Increasing symptom mentions",
      "Environmental changes"
    ]
  },
  "Kerala": {
    lat: 11.2588,
    lng: 75.7804,
    district: "Kozhikode",
    score: 84,
    level: "HIGH",
    signals: 24,
    disease: "Nipah Virus",
    updated: "23 Sep 2026",
    color: "#ff5c7c",
    explanation: [
      "Sentinel encephalitis admissions cluster",
      "Correlated fruit bat roosting activity",
      "Elevated public chatter and hospital queries",
      "Monsoon high humidity incubation window"
    ]
  },
  "Maharashtra": {
    lat: 21.1458,
    lng: 79.0882,
    district: "Nagpur",
    score: 67,
    level: "MEDIUM",
    signals: 14,
    disease: "Avian Influenza (H5N1)",
    updated: "23 Sep 2026",
    color: "#facc15",
    explanation: [
      "Commercial poultry mortality die-offs",
      "Central Asian Flyway wild waterfowl arrivals",
      "Moderate respiratory symptom keywords",
      "Inter-district containment protocol ongoing"
    ]
  },
  "Karnataka": {
    lat: 12.9716,
    lng: 77.5946,
    district: "Bengaluru",
    score: 24,
    level: "NORMAL",
    signals: 3,
    disease: "Seasonal baseline",
    updated: "23 Sep 2026",
    color: "#4ade80",
    explanation: [
      "Normal baseline vector counts",
      "No localized fever clusters detected",
      "Syndromic search trends within expected bounds",
      "Standard surveillance conditions"
    ]
  },
  "Delhi": {
    lat: 28.6139,
    lng: 77.2090,
    district: "New Delhi",
    score: 38,
    level: "MEDIUM",
    signals: 11,
    disease: "ILI / SARI Viral",
    updated: "23 Sep 2026",
    color: "#facc15",
    explanation: [
      "Seasonal flu search spike (+18%)",
      "Sentinel pediatric fever OPD visits",
      "Air quality index impact on respiratory complaints",
      "Controlled positivity rates"
    ]
  },
  "West Bengal": {
    lat: 22.5726,
    lng: 88.3639,
    district: "Kolkata",
    score: 48,
    level: "MEDIUM",
    signals: 9,
    disease: "Acute Watery Diarrhoea",
    updated: "23 Sep 2026",
    color: "#facc15",
    explanation: [
      "Localized water pipeline contamination reports",
      "Modest AWD admissions spike in northern wards",
      "Water sampling dispatched",
      "Chlorination treatment initiated"
    ]
  }
};

function initIndiaMap(elementId = "map") {
  const mapEl = document.getElementById(elementId);
  if (!mapEl) return;

  if (mapInstance) {
    mapInstance.remove();
  }

  mapInstance = L.map(elementId).setView([21.5, 78.5], 5);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OSM &copy; CARTO",
    maxZoom: 18,
  }).addTo(mapInstance);

  // Plot India regions
  Object.keys(REGION_DATA).forEach(regionName => {
    const reg = REGION_DATA[regionName];
    const circle = L.circleMarker([reg.lat, reg.lng], {
      radius: 9,
      color: reg.color,
      fillColor: reg.color,
      fillOpacity: 0.85,
      weight: 2,
    }).addTo(mapInstance);

    circle.bindTooltip(`<b>${regionName}</b> (${reg.district})<br>Risk: ${reg.score} [${reg.level}]`, {
      permanent: false,
      direction: "top",
    });

    circle.on("click", () => {
      selectRegion(regionName);
    });
  });

  // Default selection
  selectRegion("Tamil Nadu");
}

function selectRegion(regionName) {
  const reg = REGION_DATA[regionName];
  if (!reg) return;

  // Center map
  if (mapInstance) {
    mapInstance.flyTo([reg.lat, reg.lng], 6.5, { duration: 0.8 });

    if (currentMarker) mapInstance.removeLayer(currentMarker);
    currentMarker = L.marker([reg.lat, reg.lng]).addTo(mapInstance)
      .bindPopup(`<b>${regionName}</b><br>Risk Score: ${reg.score}<br>Level: ${reg.level}`)
      .openPopup();
  }

  // Update Region Risk Card elements
  const elRegion = document.getElementById("rrRegionName");
  const elScore = document.getElementById("rrRiskScore");
  const elLevel = document.getElementById("rrRiskLevel");
  const elBadge = document.getElementById("rrRiskBadge");
  const elSignals = document.getElementById("rrDetectedSignals");
  const elDisease = document.getElementById("rrTopDisease");
  const elUpdated = document.getElementById("rrLastUpdated");

  if (elRegion) elRegion.textContent = regionName;
  if (elScore) {
    elScore.textContent = reg.score;
    elScore.style.color = reg.color;
  }
  if (elLevel) elLevel.textContent = reg.level;
  if (elSignals) elSignals.textContent = reg.signals;
  if (elDisease) elDisease.textContent = reg.disease;
  if (elUpdated) elUpdated.textContent = reg.updated;

  if (elBadge) {
    elBadge.className = "status-pill " + (reg.level === "HIGH" ? "status-high" : (reg.level === "MEDIUM" ? "status-med" : "status-low"));
  }

  // Update AI Explanation Checklist
  const elExplList = document.getElementById("rrExplanationList");
  if (elExplList) {
    elExplList.innerHTML = reg.explanation.map(item => `
      <div><span style="color: #4ade80; font-weight: bold; margin-right: 8px;">✓</span> ${item}</div>
    `).join("");
  }
}
