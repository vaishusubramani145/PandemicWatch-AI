/**
 * Main dashboard script for PandemicWatch-AI
 */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof initIndiaMap === "function") {
    initIndiaMap("map");
  }
  if (typeof renderDiseaseChart === "function") {
    renderDiseaseChart("dengue");
  }
  if (typeof renderHistoricalChart === "function") {
    renderHistoricalChart("dengue", "2024");
  }
});

function switchView(tabId) {
  document.querySelectorAll(".pw-view-panel").forEach(el => el.style.display = "none");
  document.querySelectorAll(".pw-nav-item").forEach(el => el.classList.remove("active"));

  const target = document.getElementById(tabId);
  if (target) target.style.display = "block";
  if (event && event.currentTarget) event.currentTarget.classList.add("active");

  if (tabId === "viewRiskMap" && mapInstance) {
    setTimeout(() => mapInstance.invalidateSize(), 150);
  }
  if (tabId === "viewDiseaseAnalysis" && typeof renderDiseaseChart === "function") {
    setTimeout(() => renderDiseaseChart(document.getElementById("diseasePicker")?.value || "dengue"), 150);
  }
  if (tabId === "viewHistorical" && typeof renderHistoricalChart === "function") {
    setTimeout(() => {
      const d = document.getElementById("histDiseaseSelect")?.value || "dengue";
      const y = document.getElementById("histYearSelect")?.value || "2024";
      renderHistoricalChart(d, y);
    }, 150);
  }
}

function filterSurveillanceList() {
  const query = (document.getElementById("survSearchInput")?.value || "").toLowerCase().trim();
  document.querySelectorAll(".pw-surv-card").forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = (!query || text.includes(query)) ? "block" : "none";
  });
}

function updateDiseaseSelection() {
  const d = document.getElementById("diseasePicker")?.value || "dengue";
  renderDiseaseChart(d);
}

function updateHistoricalSelection() {
  const d = document.getElementById("histDiseaseSelect")?.value || "dengue";
  const y = document.getElementById("histYearSelect")?.value || "2024";
  renderHistoricalChart(d, y);
}

function loadReportType(type, btn) {
  document.querySelectorAll(".pw-report-type-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  fetch(`/api/reports/preview?type=${type}`)
    .then(r => r.json())
    .then(data => {
      document.getElementById("repTitle").textContent = data.title;
      document.getElementById("repDate").textContent = data.date;
      document.getElementById("repSignals").textContent = data.total_signals;
      document.getElementById("repHigh").textContent = data.high_risk_regions;
      document.getElementById("repMed").textContent = data.medium_risk_regions;
      document.getElementById("repTopDisease").textContent = data.top_detected_disease;
      document.getElementById("repSummary").textContent = data.summary;
    })
    .catch(err => console.error("Report preview failed", err));
}

function downloadReport() {
  window.location.href = "/api/reports/download";
}
