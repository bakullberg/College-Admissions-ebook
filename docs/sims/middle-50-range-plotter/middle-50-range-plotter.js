// Middle 50% Range Plotter - Chart.js
// CANVAS_HEIGHT: 570
// Two floating-bar panels (GPA and ACT). Each shows the college's middle 50% (25th to 75th
// percentile) in blue, the bottom and top quarters in gray, and the student's value as a
// gold diamond. The label classifies the value as below, inside (lower or upper half), or
// above the range. The example colleges are fictional.

document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('main');

  const style = document.createElement('style');
  style.textContent = `
    .m50 { background: aliceblue; border: 1px solid silver; padding: 8px 12px; box-sizing: border-box; font-size: 15px; }
    .m50 h2 { font-size: 20px; text-align: center; margin: 2px 0 8px; }
    .m50 .row { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; margin-bottom: 6px; }
    .m50 label { white-space: nowrap; }
    .m50 input[type=number] { width: 64px; font-size: 14px; }
    .m50 select { font-size: 14px; max-width: calc(100vw - 40px); }
    .m50 label.college { white-space: normal; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; max-width: 100%; }
    .m50 .panel { background: white; border: 1px solid silver; border-radius: 8px; padding: 6px 8px 2px; margin-top: 6px; }
    .m50 .panel-title { font-weight: bold; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; }
    .m50 .verdict { font-weight: bold; color: darkgoldenrod; }
    .m50 .chart-box { position: relative; height: 92px; }
    .m50 .note { font-size: 13px; color: dimgray; margin: 4px 0 2px; min-height: 18px; }
  `;
  document.head.appendChild(style);

  main.innerHTML = `
    <div class="m50">
      <h2>Middle 50% Range Plotter</h2>
      <div class="row">
        <label class="college">Example college:
          <select id="college">
            <option value="westbrook">Westbrook University (GPA 3.60–3.95, ACT 26–31)</option>
            <option value="lakeside">Lakeside State (GPA 3.30–3.85, ACT 21–27)</option>
            <option value="harrow">Harrow College (GPA 3.85–4.00, ACT 32–35)</option>
            <option value="custom">My own numbers</option>
          </select>
        </label>
        <label><input type="checkbox" id="testOptional"> Test-optional college</label>
      </div>
      <div class="row">
        <label>Your GPA <input type="number" id="gpa" min="2" max="4" step="0.01" value="3.71"></label>
        <label>GPA 25th <input type="number" id="g25" min="2" max="4" step="0.01"></label>
        <label>GPA 75th <input type="number" id="g75" min="2" max="4" step="0.01"></label>
      </div>
      <div class="row">
        <label>Your ACT <input type="number" id="act" min="12" max="36" step="1" value="27"></label>
        <label>ACT 25th <input type="number" id="a25" min="12" max="36" step="1"></label>
        <label>ACT 75th <input type="number" id="a75" min="12" max="36" step="1"></label>
      </div>
      <div class="panel">
        <div class="panel-title"><span>Unweighted GPA</span><span class="verdict" id="gpaVerdict"></span></div>
        <div class="chart-box"><canvas id="gpaChart"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-title"><span>ACT composite</span><span class="verdict" id="actVerdict"></span></div>
        <div class="chart-box"><canvas id="actChart"></canvas></div>
        <div class="note" id="actNote"></div>
      </div>
      <div class="note">Example colleges are fictional and illustrative. Each gray zone holds 25% of admitted students; the blue bar holds the middle 50%.</div>
    </div>`;

  const colleges = {
    westbrook: { g: [3.60, 3.95], a: [26, 31] },
    lakeside: { g: [3.30, 3.85], a: [21, 27] },
    harrow: { g: [3.85, 4.00], a: [32, 35] }
  };

  const $ = id => document.getElementById(id);

  function fillCollege(key) {
    if (key === 'custom') return;
    const c = colleges[key];
    $('g25').value = c.g[0].toFixed(2);
    $('g75').value = c.g[1].toFixed(2);
    $('a25').value = c.a[0];
    $('a75').value = c.a[1];
  }

  // Classify a value against a [low, high] middle-50% range
  function classify(v, lo, hi) {
    if (isNaN(v) || isNaN(lo) || isNaN(hi)) return '';
    if (v > hi) return 'Above range';
    if (v < lo) return 'Below range';
    return v >= (lo + hi) / 2 ? 'Inside range — upper half' : 'Inside range — lower half';
  }

  // Plugin: draw the student's value as a gold diamond with a short label
  const markerPlugin = {
    id: 'studentMarker',
    afterDatasetsDraw(chart) {
      const v = chart.options.plugins.studentMarker.value;
      if (v === null || isNaN(v)) return;
      const x = chart.scales.x.getPixelForValue(v);
      const y = chart.scales.y.getPixelForValue(0);
      const ctx = chart.ctx;
      ctx.save();
      ctx.fillStyle = 'gold';
      ctx.strokeStyle = 'darkgoldenrod';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y - 14);
      ctx.lineTo(x + 10, y);
      ctx.lineTo(x, y + 14);
      ctx.lineTo(x - 10, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'black';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('You: ' + chart.options.plugins.studentMarker.label, x, y - 18);
      ctx.restore();
    }
  };

  function makeChart(canvasId, min, max, step) {
    return new Chart($(canvasId), {
      type: 'bar',
      data: {
        labels: [''],
        datasets: [
          { label: 'Below range', data: [[min, min]], backgroundColor: 'gainsboro', barPercentage: 0.55, categoryPercentage: 1 },
          { label: 'Middle 50%', data: [[min, max]], backgroundColor: 'steelblue', barPercentage: 0.55, categoryPercentage: 1 },
          { label: 'Above range', data: [[max, max]], backgroundColor: 'gainsboro', barPercentage: 0.55, categoryPercentage: 1 }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        layout: { padding: { top: 22, right: 12, left: 4 } },
        scales: {
          x: { min: min, max: max, ticks: { stepSize: step, font: { size: 12 } }, grid: { color: '#eee' } },
          y: { stacked: false, grid: { display: false } }
        },
        datasets: { bar: { grouped: false } },
        plugins: {
          legend: { display: false },
          studentMarker: { value: null, label: '' },
          tooltip: {
            callbacks: {
              title: () => '',
              label: ctx => {
                const [lo, hi] = ctx.raw;
                const fmtv = v => (step < 1 ? v.toFixed(2) : v);
                if (ctx.datasetIndex === 1) return 'Middle 50% of admitted students: ' + fmtv(lo) + '–' + fmtv(hi);
                if (ctx.datasetIndex === 0) return 'Below range: 25% of admitted students were under ' + fmtv(hi);
                return 'Above range: 25% of admitted students were over ' + fmtv(lo);
              }
            }
          }
        }
      },
      plugins: [markerPlugin]
    });
  }

  const gpaChart = makeChart('gpaChart', 2.0, 4.0, 0.25);
  const actChart = makeChart('actChart', 12, 36, 2);

  function updatePanel(chart, min, max, v, lo, hi, verdictId, digits) {
    chart.data.datasets[0].data = [[min, Math.max(min, lo)]];
    chart.data.datasets[1].data = [[lo, hi]];
    chart.data.datasets[2].data = [[Math.min(max, hi), max]];
    chart.options.plugins.studentMarker.value = v;
    chart.options.plugins.studentMarker.label = isNaN(v) ? '' : v.toFixed(digits);
    chart.update();
    $(verdictId).textContent = classify(v, lo, hi);
  }

  function update() {
    const g = parseFloat($('gpa').value), g25 = parseFloat($('g25').value), g75 = parseFloat($('g75').value);
    const a = parseFloat($('act').value), a25 = parseFloat($('a25').value), a75 = parseFloat($('a75').value);
    updatePanel(gpaChart, 2.0, 4.0, g, Math.min(g25, g75), Math.max(g25, g75), 'gpaVerdict', 2);
    updatePanel(actChart, 12, 36, a, Math.min(a25, a75), Math.max(a25, a75), 'actVerdict', 0);
    $('actNote').textContent = $('testOptional').checked
      ? 'Test-optional: this range includes only students who submitted scores, so it likely overstates the typical admitted student\'s score.'
      : '';
  }

  $('college').addEventListener('change', e => { fillCollege(e.target.value); update(); });
  ['g25', 'g75', 'a25', 'a75'].forEach(id => $(id).addEventListener('input', () => { $('college').value = 'custom'; update(); }));
  ['gpa', 'act', 'testOptional'].forEach(id => $(id).addEventListener('input', update));

  fillCollege('westbrook');
  update();
});
