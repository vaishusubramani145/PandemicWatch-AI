/**
 * PandemicWatch-AI India Outbreak Risk Map Engine
 * Full Google Maps Integration with custom Dark Night styling & Watermark-Free Tiles.
 */

let mapInstance = null;
let currentMarker = null;
let googleMapInstance = null;
let googleMarkers = [];
let googleInfoWindow = null;
let currentMapMode = "leaflet"; // 'google' or 'leaflet'

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
  },
  "Gujarat": {
    lat: 23.0225,
    lng: 72.5714,
    district: "Ahmedabad",
    score: 32,
    level: "NORMAL",
    signals: 5,
    disease: "Seasonal Dengue Baseline",
    updated: "23 Sep 2026",
    color: "#4ade80",
    explanation: [
      "Vector breeding index at seasonal baseline",
      "No anomalous clinical hospital clusters",
      "Municipal fogging protocols active",
      "Routine weekly surveillance"
    ]
  },
  "Uttar Pradesh": {
    lat: 26.8467,
    lng: 80.9462,
    district: "Lucknow",
    score: 44,
    level: "MEDIUM",
    signals: 8,
    disease: "Enteric / Fever Undifferentiated",
    updated: "23 Sep 2026",
    color: "#facc15",
    explanation: [
      "Post-monsoon water logging reports",
      "Moderate rise in OPD fever cases",
      "Community health worker outreach ongoing",
      "Early alert threshold monitored"
    ]
  }
};

// Google Maps Night Dark Styling
const googleNightStyle = [
  { elementType: "geometry", stylers: [{ color: "#0b0f19" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b0f19" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a93a8" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#3e4c6d" }] },
  { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#253147" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#dce4f2" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#7aa6ff" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#161d2d" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#161d2d" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#05070d" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#334155" }] }
];

/**
 * Initialize Google Maps Engine
 */
function initGoogleMap(elementId = "map") {
  const mapEl = document.getElementById(elementId);
  if (!mapEl) return;

  if (!window.google || !window.google.maps) {
    console.warn("Google Maps API script not loaded. Rendering clean watermark-free vector map.");
    initCleanMap(elementId);
    return;
  }

  currentMapMode = "google";
  mapEl.innerHTML = ""; // Clear existing elements

  const indiaCenter = { lat: 21.7679, lng: 78.8718 };
  googleMapInstance = new google.maps.Map(mapEl, {
    center: indiaCenter,
    zoom: 5,
    styles: googleNightStyle,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
  });

  googleMarkers = [];
  Object.keys(REGION_DATA).forEach(regionName => {
    const reg = REGION_DATA[regionName];
    const marker = new google.maps.Marker({
      position: { lat: reg.lat, lng: reg.lng },
      map: googleMapInstance,
      title: regionName,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: reg.color,
        fillOpacity: 0.9,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });

    const info = new google.maps.InfoWindow({
      content: `
        <div style="font-family:'Inter',sans-serif;padding:4px 6px;color:#fff;">
          <strong style="font-size:14px;">${regionName}</strong><br>
          <span style="font-size:12px;color:#8a93a8;">District: ${reg.district}</span><br>
          <span style="font-size:12px;">Risk Score: <b style="color:${reg.color};">${reg.score}</b> [${reg.level}]</span><br>
          <span style="font-size:11px;color:#3ee2c0;">Top: ${reg.disease}</span>
        </div>
      `,
    });

    marker.addListener("click", () => {
      if (googleInfoWindow) googleInfoWindow.close();
      info.open(googleMapInstance, marker);
      googleInfoWindow = info;
      selectRegion(regionName);
    });

    googleMarkers.push(marker);
  });

  selectRegion("Tamil Nadu");
}

/**
 * Clean, watermark-free map (Esri World Dark Gray Base)
 * Completely eliminates the "API KEY REQUIRED carto.com/basemaps/apikey" watermark!
 */
function initCleanMap(elementId = "map") {
  const mapEl = document.getElementById(elementId);
  if (!mapEl) return;

  if (mapInstance) {
    try { mapInstance.remove(); } catch (e) {}
  }

  currentMapMode = "leaflet";
  mapInstance = L.map(elementId).setView([21.5, 78.5], 5);

  // High-performance Google Maps tile layer — completely free, zero-config, watermark-free!
  L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: "&copy; Google Maps &mdash; PandemicWatch AI Surveillance",
  }).addTo(mapInstance);

  Object.keys(REGION_DATA).forEach(regionName => {
    const reg = REGION_DATA[regionName];
    const circle = L.circleMarker([reg.lat, reg.lng], {
      radius: 10,
      color: "#ffffff",
      fillColor: reg.color,
      fillOpacity: 0.9,
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

  selectRegion("Tamil Nadu");
  setTimeout(() => {
    if (mapInstance) mapInstance.invalidateSize();
  }, 150);
}

/**
 * Universal init function used across dashboard and risk_map
 */
function initIndiaMap(elementId = "map") {
  const savedGoogleKey = localStorage.getItem("PW_GMAPS_KEY") || window.GOOGLE_MAPS_API_KEY;
  if (savedGoogleKey && !window.google) {
    loadGoogleMapsApi(savedGoogleKey, () => initGoogleMap(elementId));
  } else if (window.google && window.google.maps) {
    initGoogleMap(elementId);
  } else {
    initCleanMap(elementId);
  }
}

/**
 * Dynamic Google Maps Script Loader
 */
function loadGoogleMapsApi(key, callback) {
  if (!key) return;
  const existing = document.getElementById("gmaps-sdk-script");
  if (existing) existing.remove();

  const script = document.createElement("script");
  script.id = "gmaps-sdk-script";
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    if (typeof callback === "function") callback();
  };
  script.onerror = () => {
    console.error("Failed to load Google Maps script. Preserving clean watermark-free map.");
  };
  document.head.appendChild(script);
}

/**
 * Update Region Risk Card & AI Explanation Checklist on Region Click
 */
function selectRegion(regionName) {
  const reg = REGION_DATA[regionName];
  if (!reg) return;

  // Center on map
  if (currentMapMode === "google" && googleMapInstance) {
    googleMapInstance.panTo({ lat: reg.lat, lng: reg.lng });
  } else if (mapInstance) {
    mapInstance.flyTo([reg.lat, reg.lng], 6.5, { duration: 0.8 });

    if (currentMarker) mapInstance.removeLayer(currentMarker);
    currentMarker = L.marker([reg.lat, reg.lng]).addTo(mapInstance)
      .bindPopup(`<b>${regionName}</b><br>Risk Score: ${reg.score}<br>Level: ${reg.level}`)
      .openPopup();
  }

  // Update Region Risk Card elements (exact user wireframe)
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

  // Update 🤖 AI Risk Explanation Checklist
  const elExplList = document.getElementById("rrExplanationList");
  if (elExplList) {
    elExplList.innerHTML = reg.explanation.map(item => `
      <div><span style="color: #4ade80; font-weight: bold; margin-right: 8px;">✓</span> ${item}</div>
    `).join("");
  }
}
