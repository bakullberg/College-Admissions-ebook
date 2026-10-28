// Cost of Attendance Builder - Chart.js
// CANVAS_HEIGHT: 620
// Two stacked horizontal bars: your scenario (editable item by item) and a comparison
// scenario. Tuition and room and board are direct costs billed by the college; books,
// transportation, and personal expenses are indirect costs you still pay.
// Default: Midland State from Chapter 3 (in-state on campus $28,700; out-of-state $50,400).

document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('main');

  const style = document.createElement('style');
  style.textContent = `
    .coa { background: aliceblue; border: 1px solid silver; padding: 8px 12px; box-sizing: border-box; font-size: 15px; }
    .coa h2 { font-size: 20px; text-align: center; margin: 2px 0 8px; }
    .coa .row { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; margin-bottom: 6px; }
    .coa label { white-space: nowrap; }
    .coa input[type=number] { width: 78px; font-size: 14px; }
    .coa select, .coa button { font-size: 14px; }
    .coa .chart-box { position: relative; height: 210px; background: white; border: 1px solid silver; border-radius: 8px; margin-top: 4px; }
    .coa .stats { font-size: 14px; margin-top: 6px; line-height: 1.5; }
    .coa .note { font-size: 13px; color: dimgray; min-height: 18px; }
  `;
  document.head.appendChild(style);

  const ITEMS = [
    { key: 'tuition', name: 'Tuition and fees', color: 'steelblue', billed: true, def: 'the price of classes plus required fees' },
    { key: 'room', name: 'Room and board', color: 'cornflowerblue', billed: true, def: 'housing and a meal plan' },
    { key: 'books', name: 'Books and supplies', color: 'goldenrod', billed: false, def: 'textbooks, course materials, and a computer' },
    { key: 'transport', name: 'Transportation', color: 'darkorange', billed: false, def: 'getting to campus and home on breaks' },
    { key: 'personal', name: 'Personal expenses', color: 'peru', billed: false, def: 'phone, clothes, laundry, and other everyday costs' }
  ];

  main.innerHTML = `
    <div class="coa">
      <h2>Cost of Attendance Builder: Midland State</h2>
      <div class="row">
        <label>Residency <select id="res"><option>In-state</option><option>Out-of-state</option></select></label>
        <label>Housing <select id="housing"><option>On campus</option><option>Off campus</option><option>Living with family</option></select></label>
        <label>Compare against <select id="compare"></select></label>
        <button id="reset">Reset to Midland State</button>
      </div>
      <div class="row" id="items"></div>
      <div class="note" id="note"></div>
      <div class="chart-box"><canvas id="chart"></canvas></div>
      <div class="stats" id="stats"></div>
    </div>`;

  const $ = id => document.getElementById(id);
  ITEMS.forEach(it => {
    $('items').insertAdjacentHTML('beforeend',
      `<label>${it.name} $<input type="number" id="in-${it.key}" min="0" step="100"></label>`);
  });
  const combos = [];
  ['In-state', 'Out-of-state'].forEach(r => ['On campus', 'Off campus', 'Living with family'].forEach(h => combos.push(r + ', ' + h.toLowerCase())));
  combos.forEach(c => $('compare').insertAdjacentHTML('beforeend', `<option>${c}</option>`));
  $('compare').value = 'Out-of-state, on campus';

  // Midland State figures for a residency and housing choice
  function scenario(res, housing) {
    const inState = res === 'In-state';
    const v = { tuition: inState ? 11500 : 32000, room: 12500, books: 1000, transport: inState ? 1200 : 2400, personal: 2500 };
    if (housing === 'Off campus') v.room = 11000;
    if (housing === 'Living with family') { v.room = 3000; v.transport = 2000; }
    return v;
  }

  function fillInputs() {
    const v = scenario($('res').value, $('housing').value);
    ITEMS.forEach(it => { $('in-' + it.key).value = v[it.key]; });
    const h = $('housing').value;
    $('note').textContent = h === 'Off campus'
      ? 'Off campus: rent varies a lot by area. Check local listings before trusting this estimate.'
      : (h === 'Living with family' ? 'Living with family: room and board covers meals ($3,000), and commuting raises transportation to $2,000.' : '');
  }

  function currentValues() {
    const v = {};
    ITEMS.forEach(it => { v[it.key] = Math.max(0, parseFloat($('in-' + it.key).value) || 0); });
    return v;
  }

  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const total = v => ITEMS.reduce((s, it) => s + v[it.key], 0);

  // Plugin: totals at the end of each bar, and direct/indirect brackets over the first bar
  const annotate = {
    id: 'annotate',
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);
      const x = chart.scales.x;
      ctx.save();
      // totals
      chart.data.labels.forEach((_, i) => {
        const t = chart.data.datasets.reduce((s, d) => s + d.data[i], 0);
        const y = meta.data[i].y;
        ctx.fillStyle = 'black';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(money(t), x.getPixelForValue(t) + 6, y);
      });
      // brackets above bar 0
      const bar = meta.data[0];
      const top = bar.y - bar.height / 2 - 6;
      const v = chart.data.datasets.map(d => d.data[0]);
      const direct = v[0] + v[1];
      const all = v.reduce((a, b) => a + b, 0);
      // Draw a bracket over [from, to]; returns the label's right edge so labels don't collide
      const drawBracket = (from, to, label, color, minLeft) => {
        const x1 = x.getPixelForValue(from) + 1, x2 = x.getPixelForValue(to) - 1;
        if (x2 - x1 < 6) return minLeft;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, top + 6); ctx.lineTo(x1, top); ctx.lineTo(x2, top); ctx.lineTo(x2, top + 6);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = '12px Arial';
        ctx.textBaseline = 'bottom';
        const w = ctx.measureText(label).width;
        let lx = (x1 + x2) / 2 - w / 2;
        lx = Math.max(lx, minLeft + 10, 0);
        ctx.textAlign = 'left';
        ctx.fillText(label, lx, top - 3);
        return lx + w;
      };
      const narrow = chart.width < 500;
      const end = drawBracket(0, direct, narrow ? 'Direct (billed)' : 'Direct costs (billed by the college)', 'navy', -10);
      drawBracket(direct, all, narrow ? 'Indirect' : 'Indirect costs (not billed, but real)', 'saddlebrown', end);
      ctx.restore();
    }
  };

  const chart = new Chart($('chart'), {
    type: 'bar',
    data: {
      labels: ['Your scenario', 'Comparison'],
      datasets: ITEMS.map(it => ({ label: it.name, data: [0, 0], backgroundColor: it.color, barPercentage: 0.6 }))
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { top: 26, right: 70, left: 4, bottom: 0 } },
      scales: {
        x: { stacked: true, beginAtZero: true, ticks: { callback: v => '$' + (v / 1000) + 'k', font: { size: 12 } } },
        y: { stacked: true, ticks: { font: { size: 13, weight: 'bold' } } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const it = ITEMS[ctx.datasetIndex];
              return [it.name + ': ' + money(ctx.raw),
                      it.billed ? 'Billed by the college (direct cost)' : 'Not billed, but you pay it (indirect cost)',
                      it.name + ': ' + it.def];
            }
          }
        }
      }
    },
    plugins: [annotate]
  });

  function update() {
    const mine = currentValues();
    const [cr, ch] = $('compare').value.split(', ');
    const other = scenario(cr, ch.charAt(0).toUpperCase() + ch.slice(1));
    ITEMS.forEach((it, i) => { chart.data.datasets[i].data = [mine[it.key], other[it.key]]; });
    chart.data.labels = [[$('res').value + ',', $('housing').value.toLowerCase()], $('compare').value.split(', ').map((p, i) => i === 0 ? p + ',' : p)];
    chart.update();

    const t = total(mine), tOther = total(other);
    const indirect = mine.books + mine.transport + mine.personal;
    const diff = tOther - t;
    $('stats').innerHTML =
      `Tuition is <b>${t ? Math.round(mine.tuition / t * 100) : 0}%</b> of the total. ` +
      `Indirect costs are <b>${t ? Math.round(indirect / t * 100) : 0}%</b> of the total (${money(indirect)}).<br>` +
      (diff === 0 ? 'The two scenarios cost the same.'
        : `The comparison costs <b>${money(Math.abs(diff))} ${diff > 0 ? 'more' : 'less'}</b> per year than your scenario (${money(Math.abs(diff) * 4)} over four years).`);
  }

  ['res', 'housing'].forEach(id => $(id).addEventListener('change', () => { fillInputs(); update(); }));
  $('compare').addEventListener('change', update);
  ITEMS.forEach(it => $('in-' + it.key).addEventListener('input', update));
  $('reset').addEventListener('click', () => {
    $('res').value = 'In-state';
    $('housing').value = 'On campus';
    $('compare').value = 'Out-of-state, on campus';
    fillInputs();
    update();
  });

  fillInputs();
  update();
});
