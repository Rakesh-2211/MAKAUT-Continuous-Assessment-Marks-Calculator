/**
 * MAKAUT Continuous Assessment (CA) System Calculator Engine
 * Handles real-time score conversion, visual gauge updates, target prediction,
 * subject storage, and print generation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // SVG Gradient Definition for Ring Gauge
  injectSvgGradient();

  // Elements - Single Subject Calculator Inputs
  const subjectTitleInput = document.getElementById('subject-title-input');
  const ca1Input = document.getElementById('ca1-input');
  const ca2Input = document.getElementById('ca2-input');
  const ecaInput = document.getElementById('eca-input');
  const wcaInput = document.getElementById('wca-input');

  // Formula & Breakdown Outputs
  const caAvgDisplay = document.getElementById('ca-avg-display');
  const compAScoreDisplay = document.getElementById('comp-a-score');
  const compBScoreDisplay = document.getElementById('comp-b-score');
  const compCScoreDisplay = document.getElementById('comp-c-score');

  // Summary Visuals
  const summarySubjectName = document.getElementById('summary-subject-name');
  const totalScoreVal = document.getElementById('total-score-val');
  const totalPercentVal = document.getElementById('total-percent-val');
  const ringProgressBar = document.getElementById('ring-progress-bar');
  const statusIndicator = document.getElementById('status-indicator');
  const statusTitle = document.getElementById('status-title');
  const statusDesc = document.getElementById('status-desc');

  // Breakdown List
  const bdCa1 = document.getElementById('bd-ca1');
  const bdCa2 = document.getElementById('bd-ca2');
  const bdCompA = document.getElementById('bd-comp-a');
  const bdEcaRaw = document.getElementById('bd-eca-raw');
  const bdCompB = document.getElementById('bd-comp-b');
  const bdCompC = document.getElementById('bd-comp-c');
  const barA = document.getElementById('bar-a');
  const barB = document.getElementById('bar-b');
  const barC = document.getElementById('bar-c');

  // Buttons
  const btnSaveSubject = document.getElementById('btn-save-subject');
  const btnPrintReport = document.getElementById('btn-print-report');
  const themeToggle = document.getElementById('theme-toggle');

  // Multi-Subject Tracker Elements
  const btnPrintSemester = document.getElementById('btn-print-semester');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnClearAll = document.getElementById('btn-clear-all');
  const semTotalSubjects = document.getElementById('sem-total-subjects');
  const semAvgScore = document.getElementById('sem-avg-score');
  const semAvgPercent = document.getElementById('sem-avg-percent');
  const semHighestSubject = document.getElementById('sem-highest-subject');
  const subjectTableBody = document.getElementById('subject-table-body');
  const emptyStateMsg = document.getElementById('empty-state-msg');

  // Tab Navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Storage Key
  const STORAGE_KEY = 'makaut_ca_subjects_v1';

  // State
  let savedSubjects = loadSavedSubjects();

  // --- Initial Setup ---
  initTheme();
  setupTabNavigation();
  attachInputListeners();
  calculateAndRender();
  renderSemesterTracker();

  // --- SVG Gradient Injection ---
  function injectSvgGradient() {
    const svg = document.querySelector('.score-ring');
    if (!svg) return;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00b4d8" />
        <stop offset="100%" stop-color="#06d6a0" />
      </linearGradient>
    `;
    svg.prepend(defs);
  }

  // --- Tab Switcher ---
  function setupTabNavigation() {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const content = document.getElementById(targetTab);
        if (content) content.classList.add('active');

        if (targetTab === 'semester-manager') {
          renderSemesterTracker();
        }
      });
    });
  }

  // --- Theme Toggle ---
  function initTheme() {
    const savedTheme = localStorage.getItem('makaut_theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('makaut_theme', next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const label = document.getElementById('theme-mode-label');
    if (label) {
      label.textContent = theme === 'dark' ? 'Night Mode' : 'Day Mode';
    }
  }

  // --- Input Listeners ---
  function attachInputListeners() {
    [subjectTitleInput, ca1Input, ca2Input, ecaInput, wcaInput].forEach(input => {
      input.addEventListener('input', () => {
        validateInputs();
        calculateAndRender();
      });
    });

    btnSaveSubject.addEventListener('click', saveCurrentSubject);
    btnPrintReport.addEventListener('click', generatePrintReport);
    if (btnPrintSemester) btnPrintSemester.addEventListener('click', generateSemesterPrintReport);
    btnExportCsv.addEventListener('click', exportToCsv);
    btnClearAll.addEventListener('click', clearAllSubjects);
  }

  // --- Input Bounds Validation ---
  function validateInputs() {
    clampInputValue(ca1Input, 0, 25);
    clampInputValue(ca2Input, 0, 25);
    clampInputValue(ecaInput, 0, 70);
    clampInputValue(wcaInput, 0, 10);
  }

  function clampInputValue(inputEl, min, max) {
    if (!inputEl) return;
    let val = parseFloat(inputEl.value);
    if (isNaN(val)) return;
    if (val > max) inputEl.value = max;
    if (val < min) inputEl.value = min;
  }

  // --- Core Calculation Logic ---
  function getScores() {
    const ca1 = Math.max(0, Math.min(25, parseFloat(ca1Input.value) || 0));
    const ca2 = Math.max(0, Math.min(25, parseFloat(ca2Input.value) || 0));
    const eca = Math.max(0, Math.min(70, parseFloat(ecaInput.value) || 0));
    const wca = Math.max(0, Math.min(10, parseFloat(wcaInput.value) || 0));

    const caAvg = (ca1 + ca2) / 2;
    const compA = (caAvg / 25) * 10; // (ca1 + ca2) / 5
    const compB = (eca / 70) * 10;
    const compC = wca;

    const totalScore = compA + compB + compC;
    const totalPercent = (totalScore / 30) * 100;

    return {
      subjectName: subjectTitleInput.value.trim() || 'Untitled Subject',
      ca1,
      ca2,
      caAvg,
      compA,
      eca,
      compB,
      wca,
      compC,
      totalScore,
      totalPercent
    };
  }

  // --- Render Single Subject Results ---
  function calculateAndRender() {
    const s = getScores();

    // Text & Math Updates
    caAvgDisplay.textContent = `${s.caAvg.toFixed(2)} / 25`;
    compAScoreDisplay.textContent = `${s.compA.toFixed(2)} / 10`;
    compBScoreDisplay.textContent = `${s.compB.toFixed(2)} / 10`;
    compCScoreDisplay.textContent = `${s.compC.toFixed(2)} / 10`;

    summarySubjectName.textContent = s.subjectName;
    totalScoreVal.textContent = s.totalScore.toFixed(2);
    totalPercentVal.textContent = `${s.totalPercent.toFixed(1)}%`;

    // Gauge Ring update
    // Circumference of r=70 is 2 * PI * 70 = 439.82
    const circumference = 439.82;
    const offset = circumference - (s.totalScore / 30) * circumference;
    ringProgressBar.style.strokeDashoffset = Math.max(0, offset);

    // Breakdown Elements
    bdCa1.textContent = s.ca1.toFixed(1);
    bdCa2.textContent = s.ca2.toFixed(1);
    bdCompA.textContent = s.compA.toFixed(2);
    bdEcaRaw.textContent = s.eca.toFixed(1);
    bdCompB.textContent = s.compB.toFixed(2);
    bdCompC.textContent = s.compC.toFixed(2);

    barA.style.width = `${(s.compA / 10) * 100}%`;
    barB.style.width = `${(s.compB / 10) * 100}%`;
    barC.style.width = `${(s.compC / 10) * 100}%`;

    // Performance Status Classification
    updateStatusBadge(s.totalScore, s.totalPercent);
  }

  function updateStatusBadge(score, percent) {
    let title = '';
    let desc = '';
    let color = '';

    if (score >= 27.0) { // 90%+
      title = 'Excellent (O Grade Target)';
      desc = 'Outstanding performance across all continuous assessment components!';
      color = '#06d6a0';
    } else if (score >= 24.0) { // 80%+
      title = 'Very Good (E Grade Target)';
      desc = 'Strong continuous evaluation scores. Maintain this pace!';
      color = '#00b4d8';
    } else if (score >= 21.0) { // 70%+
      title = 'Good (A Grade Target)';
      desc = 'Solid progress! A small boost in ECA can push you higher.';
      color = '#ffd166';
    } else if (score >= 15.0) { // 50%+
      title = 'Satisfactory / Average';
      desc = 'Passing continuous score, but room for improvement in ECA/WCA.';
      color = '#f77f00';
    } else {
      title = 'Needs Improvement';
      desc = 'Score is currently below 50%. Focus on upcoming ECA & WCA assignments.';
      color = '#ef476f';
    }

    statusTitle.textContent = title;
    statusDesc.textContent = desc;
    statusIndicator.style.background = color;
    statusIndicator.style.boxShadow = `0 0 12px ${color}`;
  }



  // --- Multi-Subject Storage & Management ---
  function loadSavedSubjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse stored subject data:", e);
      return [];
    }
  }

  function saveSubjectData(data) {
    savedSubjects = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSubjects));
    renderSemesterTracker();
  }

  function saveCurrentSubject() {
    const s = getScores();
    const existingIndex = savedSubjects.findIndex(item => item.subjectName.toLowerCase() === s.subjectName.toLowerCase());

    const subjectItem = {
      id: existingIndex >= 0 ? savedSubjects[existingIndex].id : Date.now(),
      subjectName: s.subjectName,
      ca1: s.ca1,
      ca2: s.ca2,
      compA: s.compA,
      eca: s.eca,
      compB: s.compB,
      wca: s.wca,
      compC: s.compC,
      totalScore: s.totalScore,
      totalPercent: s.totalPercent
    };

    if (existingIndex >= 0) {
      savedSubjects[existingIndex] = subjectItem;
    } else {
      savedSubjects.push(subjectItem);
    }

    saveSubjectData(savedSubjects);

    // Show feedback toast or alert
    showToast(`Saved "${s.subjectName}" to Semester Tracker!`);
  }

  function renderSemesterTracker() {
    if (!savedSubjects || savedSubjects.length === 0) {
      emptyStateMsg.style.display = 'block';
      subjectTableBody.innerHTML = '';
      semTotalSubjects.textContent = '0';
      semAvgScore.textContent = '0.00 / 30';
      semAvgPercent.textContent = '0.0%';
      semHighestSubject.textContent = 'N/A';
      return;
    }

    emptyStateMsg.style.display = 'none';
    subjectTableBody.innerHTML = '';

    let totalSum = 0;
    let highestScore = -1;
    let highestName = '';

    savedSubjects.forEach(s => {
      totalSum += s.totalScore;
      if (s.totalScore > highestScore) {
        highestScore = s.totalScore;
        highestName = `${s.subjectName} (${s.totalScore.toFixed(1)})`;
      }

      const tr = document.createElement('tr');
      const statusTag = getStatusBadgeTag(s.totalScore);

      tr.innerHTML = `
        <td><strong>${escapeHtml(s.subjectName)}</strong></td>
        <td>${s.ca1.toFixed(1)}</td>
        <td>${s.ca2.toFixed(1)}</td>
        <td><strong>${s.compA.toFixed(2)}</strong></td>
        <td>${s.eca.toFixed(1)}</td>
        <td><strong>${s.compB.toFixed(2)}</strong></td>
        <td><strong>${s.compC.toFixed(1)}</strong></td>
        <td><strong style="color: var(--accent-cyan); font-size: 1.05rem;">${s.totalScore.toFixed(2)}</strong></td>
        <td>${statusTag}</td>
        <td>
          <button class="btn-icon delete-btn" data-id="${s.id}" title="Delete Subject" style="width: 32px; height: 32px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </td>
      `;

      subjectTableBody.appendChild(tr);
    });

    const count = savedSubjects.length;
    const avgScore = totalSum / count;
    const avgPercent = (avgScore / 30) * 100;

    semTotalSubjects.textContent = count.toString();
    semAvgScore.textContent = `${avgScore.toFixed(2)} / 30`;
    semAvgPercent.textContent = `${avgPercent.toFixed(1)}%`;
    semHighestSubject.textContent = highestName || 'N/A';

    // Delete Event Delegation
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.getAttribute('data-id'));
        deleteSubject(id);
      });
    });
  }

  function getStatusBadgeTag(score) {
    if (score >= 27) return `<span class="chip chip-exc">Excellent</span>`;
    if (score >= 24) return `<span class="chip chip-vgood">Very Good</span>`;
    if (score >= 21) return `<span class="chip chip-good">Good</span>`;
    if (score >= 15) return `<span class="chip chip-avg">Average</span>`;
    return `<span class="chip chip-fail">Needs Work</span>`;
  }

  function deleteSubject(id) {
    const filtered = savedSubjects.filter(item => item.id !== id);
    saveSubjectData(filtered);
    showToast('Subject deleted.');
  }

  function clearAllSubjects() {
    if (confirm('Are you sure you want to clear all saved subject continuous assessment scores?')) {
      saveSubjectData([]);
      showToast('All subjects cleared.');
    }
  }

  // --- Export CSV ---
  function exportToCsv() {
    if (!savedSubjects || savedSubjects.length === 0) {
      alert('No subjects available to export!');
      return;
    }

    const headers = ['Subject Name', 'CA1 (25)', 'CA2 (25)', 'Component A (10)', 'ECA (70)', 'Component B (10)', 'WCA (10)', 'Total CA (30)', 'Percentage'];
    const rows = savedSubjects.map(s => [
      `"${s.subjectName.replace(/"/g, '""')}"`,
      s.ca1,
      s.ca2,
      s.compA.toFixed(2),
      s.eca,
      s.compB.toFixed(2),
      s.wca,
      s.totalScore.toFixed(2),
      `${s.totalPercent.toFixed(1)}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MAKAUT_Continuous_Assessment_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Print Single Subject Report ---
  function generatePrintReport() {
    const s = getScores();
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const printArea = document.getElementById('printable-report');
    printArea.innerHTML = `
      <div class="print-header">
        <div class="print-logo">MAKAUT</div>
        <div class="print-title">
          <h3>CONTINUOUS ASSESSMENT SYSTEM (CA) GRADE REPORT</h3>
        </div>
      </div>

      <div class="print-meta-grid">
        <div><strong>Subject Name:</strong> ${escapeHtml(s.subjectName)}</div>
        <div><strong>Date Generated:</strong> ${dateStr}</div>
        <div><strong>Evaluation Scheme:</strong> Theory Course Continuous Assessment (30 Marks)</div>
      </div>

      <table class="print-table">
        <thead>
          <tr>
            <th>Assessment Component</th>
            <th style="text-align: center;">Raw Input Score</th>
            <th style="text-align: center;">Max Raw Marks</th>
            <th style="text-align: center;">Converted Score</th>
            <th style="text-align: center;">Weightage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Component A: Class Test 1 (CA1)</td>
            <td style="text-align: center;">${s.ca1.toFixed(2)}</td>
            <td style="text-align: center;">25</td>
            <td rowspan="2" style="vertical-align: middle; text-align: center;">${s.compA.toFixed(2)}</td>
            <td rowspan="2" style="vertical-align: middle; text-align: center;">10 Marks</td>
          </tr>
          <tr>
            <td>Component A: Class Test 2 (CA2)</td>
            <td style="text-align: center;">${s.ca2.toFixed(2)}</td>
            <td style="text-align: center;">25</td>
          </tr>
          <tr>
            <td>Component B: End-Semester CA (ECA) Mock Test</td>
            <td style="text-align: center;">${s.eca.toFixed(2)}</td>
            <td style="text-align: center;">70</td>
            <td style="vertical-align: middle; text-align: center;">${s.compB.toFixed(2)}</td>
            <td style="vertical-align: middle; text-align: center;">10 Marks</td>
          </tr>
          <tr>
            <td>Component C: Whole-Semester CA (WCA) Continuous Effort</td>
            <td style="text-align: center;">${s.wca.toFixed(2)}</td>
            <td style="text-align: center;">10</td>
            <td style="vertical-align: middle; text-align: center;">${s.compC.toFixed(2)}</td>
            <td style="vertical-align: middle; text-align: center;">10 Marks</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colspan="3" style="text-align: right;">FINAL CONTINUOUS ASSESSMENT SCORE:</th>
            <th style="font-size: 1.2rem; color: #000; text-align: center; vertical-align: middle;">${s.totalScore.toFixed(2)} / 30.00</th>
            <th style="text-align: center; vertical-align: middle;">${s.totalPercent.toFixed(2)}%</th>
          </tr>
        </tfoot>
      </table>

      <div class="print-signature-space">
        <div class="sig-box">
          <div class="sig-line"></div>
          <p>Subject Teacher Signature</p>
        </div>
        <div class="sig-box">
          <div class="sig-line"></div>
          <p>HOD / Departmental Seal</p>
        </div>
      </div>
    `;

    window.print();
  }

  // --- Print Multi-Subject Semester Report ---
  function generateSemesterPrintReport() {
    if (!savedSubjects || savedSubjects.length === 0) {
      alert('No saved subjects found! Add subjects on the calculator tab and click "Save Subject to Semester" first.');
      return;
    }

    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const totalCount = savedSubjects.length;
    const sumTotal = savedSubjects.reduce((acc, s) => acc + s.totalScore, 0);
    const semAvg = sumTotal / totalCount;
    const semPercent = (semAvg / 30) * 100;

    let tableRowsHtml = savedSubjects.map((s, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td><strong>${escapeHtml(s.subjectName)}</strong></td>
        <td style="text-align: center;">${s.ca1.toFixed(1)}</td>
        <td style="text-align: center;">${s.ca2.toFixed(1)}</td>
        <td style="text-align: center; font-weight: bold;">${s.compA.toFixed(2)}</td>
        <td style="text-align: center;">${s.eca.toFixed(1)}</td>
        <td style="text-align: center; font-weight: bold;">${s.compB.toFixed(2)}</td>
        <td style="text-align: center; font-weight: bold;">${s.wca.toFixed(1)}</td>
        <td style="text-align: center; font-weight: bold; color: #000;">${s.totalScore.toFixed(2)} / 30</td>
        <td style="text-align: center;">${s.totalPercent.toFixed(1)}%</td>
      </tr>
    `).join('');

    const printArea = document.getElementById('printable-report');
    printArea.innerHTML = `
      <div class="print-header">
        <div class="print-logo">MAKAUT</div>
        <div class="print-title">
          <h3>SEMESTER CONTINUOUS ASSESSMENT SUMMARY REPORT</h3>
        </div>
      </div>

      <div class="print-meta-grid">
        <div><strong>Report Type:</strong> Multi-Subject Semester CA Summary</div>
        <div><strong>Date Generated:</strong> ${dateStr}</div>
        <div><strong>Total Subjects Evaluated:</strong> ${totalCount}</div>
        <div><strong>Semester CA Average:</strong> <strong>${semAvg.toFixed(2)} / 30.00 (${semPercent.toFixed(1)}%)</strong></div>
      </div>

      <table class="print-table">
        <thead>
          <tr>
            <th style="text-align: center;">#</th>
            <th>Subject / Course Name</th>
            <th style="text-align: center;">CA1 (25)</th>
            <th style="text-align: center;">CA2 (25)</th>
            <th style="text-align: center;">Comp A (10)</th>
            <th style="text-align: center;">ECA (70)</th>
            <th style="text-align: center;">Comp B (10)</th>
            <th style="text-align: center;">WCA (10)</th>
            <th style="text-align: center;">Total CA (30)</th>
            <th style="text-align: center;">Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
        <tfoot>
          <tr>
            <th colspan="8" style="text-align: right;">OVERALL SEMESTER CA AVERAGE:</th>
            <th style="font-size: 1.1rem; color: #000; text-align: center; vertical-align: middle;">${semAvg.toFixed(2)} / 30.00</th>
            <th style="text-align: center; vertical-align: middle;">${semPercent.toFixed(2)}%</th>
          </tr>
        </tfoot>
      </table>

      <div class="print-signature-space">
        <div class="sig-box">
          <div class="sig-line"></div>
          <p>Class Co-ordinator Signature</p>
        </div>
        <div class="sig-box">
          <div class="sig-line"></div>
          <p>HOD / Departmental Seal</p>
        </div>
      </div>
    `;

    window.print();
  }

  // --- Helper Utilities ---
  function showToast(message) {
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--accent-blue);
      color: #fff;
      padding: 12px 20px;
      border-radius: var(--radius-md);
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
