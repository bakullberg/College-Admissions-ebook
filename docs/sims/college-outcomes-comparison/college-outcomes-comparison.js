// College Outcomes Comparison - Chart.js
// CANVAS_HEIGHT: 690
// Grouped bars per college: retention, 4-year graduation, 6-year graduation (0–100%).
// The notes panel flags retention under 85%, a 4-to-6-year gap over 20 points, and a
// 6-year rate over 85%. Defaults are the fictional colleges from Chapter 4.

document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('main');

  const style = document.createElement('style');
  style.textContent = `
    .oc { background: aliceblue; border: 1px solid silver; padding: 8px 12px; box-sizing: border-box; font-size: 15px; }
    .oc h2 { font-size: 20px; text-align: center; margin: 2px 0 6px; }
    .oc .rows { display: grid; gap: 4px; margin-bottom: 6px; }
    .oc .r { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: center; }
    .oc .r input[type=text] { width: 150px; font-size: 14px; }
    .oc .r input[type=number] { width: 52px; font-size: 14px; }
    .oc .r label { white-space: nowrap; font-size: 13px; }
    .oc .bar { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; margin-bottom: 4px; }
    .oc button { font-size: 14px; }
    .oc .chart-box { position: relative; height: 250px; background: white; border: 1px solid silver; border-radius: 8px; }
    .oc .notes { background: white; border: 1px solid silver; border-radius: 8px; padding: 6px 10px; margin-top: 6px; font-size: 13px; line-height: 1.45; min-height: 60px; }
    .oc .flag { color: darkorange; }
    .oc .good { color: seagreen; }
    .oc .fine { color: dimgray; }
    @media (max-width: 560px) {
      .oc .r input[type=text] { width: 96px; }
      .oc .r input[type=number] { width: 42px; }
      .oc .r { gap: 2px 6px; }
      .oc .chart-box { height: 220px; }
      .oc .notes { max-height: 120px; overflow-y: auto; font-size: 12px; }
    }
    .oc .cap { font-size: 12px; color: dimgray; text-align: center; margin-top: 2px; }
  `;
  document.head.appendChild(style);

  main.innerHTML = `
    <div class="oc">
      <h2>College Outcomes Comparison</h2>
      <div class="rows" id="rows"></div>
      <div class="bar">
        <button id="add">Add college</button>
        <label><input type="checkbox" id="gap"> Show the four-to-six-year gap</label>
        <button id="reset">Reset to example</button>
      </div>
      <div class="chart-box"><canvas id="chart"></canvas></div>
      <div class="cap" id="cap">Fictional colleges for illustration.</div>
      <div class="notes" id="notes"></div>
    </div>`;

  const $ = id => document.getElementById(id);
  const EXAMPLE = [['Midland State', 88, 52, 74], ['Lakeshore University', 94, 71, 86], ['Ridgeview Polytechnic', 81, 30, 61]];
  const MEASURES = [
    { name: 'Retention rate', color: 'mediumseagreen', def: 'share of first-year students who return for a second year' },
    { name: '4-year graduation rate', color: 'steelblue', def: 'share of first-time, full-time students who finish within four years' },
    { name: '6-year graduation rate', color: 'navy', def: 'share who finish within six years (the standard federal measure)' }
  ];
  let colleges = [];

  function renderRows() {
    $('rows').innerHTML = '';
    colleges.forEach((c, i) => {
      const div = document.createElement('div');
      div.className = 'r';
      div.innerHTML = `<input type="text" value="${c[0].replace(/"/g, '&quot;')}" data-i="${i}" data-k="0" aria-label="College name">
        <label title="Retention rate">Ret. <input type="number" min="0" max="100" value="${c[1]}" data-i="${i}" data-k="1">%</label>
        <label>4-yr <input type="number" min="0" max="100" value="${c[2]}" data-i="${i}" data-k="2">%</label>
        <label>6-yr <input type="number" min="0" max="100" value="${c[3]}" data-i="${i}" data-k="3">%</label>
        <button data-remove="${i}" title="Remove this college" aria-label="Remove ${c[0].replace(/"/g, '&quot;')}">✕</button>`;
      $('rows').appendChild(div);
    });
    $('rows').querySelectorAll('input').forEach(inp => inp.addEventListener('input', e => {
      const i = +e.target.dataset.i, k = +e.target.dataset.k;
      colleges[i][k] = k === 0 ? e.target.value : Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
      $('cap').textContent = 'Your numbers. Check each college\'s Common Data Set (Section B) or the College Scorecard.';
      update();
    }));
    $('rows').querySelectorAll('button[data-remove]').forEach(b => b.addEventListener('click', () => {
      colleges.splice(+b.dataset.remove, 1);
      renderRows();
      update();
    }));
    $('add').disabled = colleges.length >= 4;
  }

  // Plugin: bracket between each college's 4-year and 6-year bars with the gap in points
  const gapPlugin = {
    id: 'gapBrackets',
    afterDatasetsDraw(chart) {
      if (!$('gap').checked) return;
      const ctx = chart.ctx;
      const four = chart.getDatasetMeta(1), six = chart.getDatasetMeta(2);
      ctx.save();
      four.data.forEach((bar4, i) => {
        const bar6 = six.data[i];
        if (!bar6) return;
        const gap = colleges[i][3] - colleges[i][2];
        const yTop = Math.min(bar4.y, bar6.y) - 22;
        ctx.strokeStyle = gap > 20 ? 'darkorange' : 'dimgray';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bar4.x, bar4.y - 4); ctx.lineTo(bar4.x, yTop); ctx.lineTo(bar6.x, yTop); ctx.lineTo(bar6.x, bar6.y - 4);
        ctx.stroke();
        ctx.fillStyle = gap > 20 ? 'darkorange' : 'dimgray';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('+' + gap + ' pts', (bar4.x + bar6.x) / 2, yTop - 4);
      });
      ctx.restore();
    }
  };

  const chart = new Chart($('chart'), {
    type: 'bar',
    data: { labels: [], datasets: MEASURES.map(m => ({ label: m.name, data: [], backgroundColor: m.color })) },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { top: 26 } },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + '%', font: { size: 12 } } },
        x: { ticks: { font: { size: 12, weight: 'bold' } } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => MEASURES[ctx.datasetIndex].name + ': ' + ctx.raw + '%',
            afterLabel: ctx => MEASURES[ctx.datasetIndex].name + ': ' + MEASURES[ctx.datasetIndex].def
          }
        }
      }
    },
    plugins: [gapPlugin]
  });

  function notesFor(c) {
    const [name, ret, four, six] = c;
    const out = [];
    if (ret < 85) out.push(`<span class="flag">⚠ Retention ${ret}%: many first-years leave — ask why.</span>`);
    if (six - four > 20) out.push(`<span class="flag">⚠ ${six - four}-point gap between 4- and 6-year rates: finishing in four years is less common — budget for extra time.</span>`);
    if (six > 85) out.push(`<span class="good">✓ 6-year rate ${six}%: strong completion.</span>`);
    if (!out.length) out.push('<span class="fine">No flags. Compare against similar colleges.</span>');
    return `<b>${name || 'Unnamed college'}:</b> ` + out.join(' ');
  }

  function update() {
    chart.data.labels = colleges.map(c => c[0].length > 18 ? c[0].split(' ') : c[0]);
    MEASURES.forEach((m, k) => { chart.data.datasets[k].data = colleges.map(c => c[k + 1]); });
    chart.update();
    $('notes').innerHTML = colleges.length ? colleges.map(notesFor).join('<br>') : 'Add a college to compare.';
  }

  $('add').addEventListener('click', () => {
    if (colleges.length >= 4) return;
    colleges.push(['New college', 85, 50, 70]);
    renderRows();
    update();
  });
  $('gap').addEventListener('change', update);
  $('reset').addEventListener('click', () => {
    colleges = EXAMPLE.map(c => c.slice());
    $('cap').textContent = 'Fictional colleges for illustration.';
    renderRows();
    update();
  });

  colleges = EXAMPLE.map(c => c.slice());
  renderRows();
  update();
});
