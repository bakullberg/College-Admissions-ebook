// Award Comparison Chart - Chart.js
// CANVAS_HEIGHT: 800
// Compare up to four award letters. For each college and year n (1–4):
//   cost_n = cost × (1 + increase)^(n−1)
//   grants_n = grants, or grants × (1 + increase)^(n−1) if grants rise with cost (never for merit)
//   net price_n = cost_n − grants_n
//   student loans follow the federal ladder from your year-1 amount ($5,500 → $6,500 → $7,500 → $7,500)
//   out-of-pocket_n = net price_n − work-study − student loans_n
// Status: "Fits budget" if every year's out-of-pocket ≤ the family contribution; otherwise the
// family would need Parent PLUS or other borrowing for the difference.

document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('main');
  const style = document.createElement('style');
  style.textContent = `
    .ac { background: aliceblue; border: 1px solid silver; padding: 8px 10px; box-sizing: border-box; font-size: 14px; }
    .ac h2 { font-size: 20px; text-align: center; margin: 2px 0 6px; }
    .ac .row { display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: center; margin-bottom: 6px; }
    .ac label { white-space: nowrap; }
    .ac input[type=number] { width: 72px; font-size: 13px; }
    .ac input[type=text] { width: 120px; font-size: 13px; }
    .ac button, .ac select { font-size: 13px; }
    .ac .cards { display: flex; gap: 6px; margin-bottom: 6px; }
    .ac .card { flex: 1; background: white; border: 1px solid silver; border-radius: 8px; padding: 5px 6px; min-width: 0; }
    .ac .card div { display: flex; justify-content: space-between; align-items: center; margin: 2px 0; gap: 4px; }
    .ac .card span { font-size: 12px; color: dimgray; white-space: nowrap; }
    .ac .charts { display: flex; gap: 6px; }
    .ac .panel { flex: 1; background: white; border: 1px solid silver; border-radius: 8px; position: relative; height: 230px; padding: 4px; box-sizing: border-box; }
    .ac table { width: 100%; border-collapse: collapse; background: white; margin-top: 6px; font-size: 12px; }
    .ac th, .ac td { border: 1px solid gainsboro; padding: 3px 5px; text-align: right; }
    .ac th:first-child, .ac td:first-child { text-align: left; }
    .ac .ok { color: seagreen; font-weight: bold; } .ac .plus { color: darkorange; font-weight: bold; } .ac .over { color: firebrick; font-weight: bold; }
    .ac .narrow-only { display: none; }
    @media (max-width: 640px) {
      .ac .narrow-only { display: inline-block; }
      .ac .card { display: none; } .ac .card.active { display: block; }
      .ac .panel { display: none; } .ac .panel.active { display: block; }
      .ac table { font-size: 11px; }
      .ac h2 { font-size: 17px; margin: 0 0 4px; }
      .ac .panel { height: 190px; }
      .ac .card div { margin: 0; }
      .ac .card input { padding: 1px 2px; }
      .ac th, .ac td { padding: 2px 3px; }
      .ac .row { margin-bottom: 4px; gap: 4px 8px; }
      .ac .long { display: none; }
      .ac .short { display: inline; }
    }
    @media (min-width: 641px) { .ac .short { display: none; } }
  `;
  document.head.appendChild(style);

  main.innerHTML = `
    <div class="ac">
      <h2>Award Comparison Chart</h2>
      <div class="row">
        <label><span class="long">Family yearly contribution $</span><span class="short">Family $/yr</span><input type="number" id="family" step="500" value="15000"></label>
        <label><span class="long">Yearly cost increase</span><span class="short">Cost rise</span> <input type="number" id="inc" min="0" max="6" step="0.5" value="3" style="width:48px">%</label>
        <label><input type="checkbox" id="rise"> Grants rise<span class="long"> with cost</span>?</label>
        <button id="add">Add<span class="long"> college</span></button>
        <button id="remove">Remove<span class="long"> last</span></button>
        <button id="reset">Reset<span class="long"> to Marcus</span></button>
      </div>
      <div class="row narrow-only">
        <label>Edit college <select id="pick"></select></label>
        <button id="showY1">Year 1</button>
        <button id="show4">Four years</button>
      </div>
      <div class="cards" id="cards"></div>
      <div class="charts">
        <div class="panel active" id="p1"><canvas id="c1"></canvas></div>
        <div class="panel" id="p2"><canvas id="c2"></canvas></div>
      </div>
      <table id="tbl"></table>
    </div>`;

  const $ = id => document.getElementById(id);
  const FIELDS = [['name', 'Name', 'text'], ['cost', 'Cost of attendance', 'number'], ['grants', 'Grants and scholarships', 'number'],
                  ['ws', 'Work-study', 'number'], ['loans', 'Student federal loans', 'number'], ['plus', 'Parent PLUS', 'number'], ['other', 'Other loans', 'number']];
  const MARCUS = [
    { name: 'Lakeshore', cost: 52000, grants: 30000, merit: false, ws: 2500, loans: 5500, plus: 8000, other: 0 },
    { name: 'Brookfield', cost: 79000, grants: 60000, merit: false, ws: 2500, loans: 5500, plus: 0, other: 0 },
    { name: 'Regional public', cost: 24000, grants: 11000, merit: false, ws: 0, loans: 5500, plus: 0, other: 0 }
  ];
  const COLORS = ['steelblue', 'darkorange', 'seagreen', 'mediumpurple'];
  let colleges = [];
  let active = 0;

  function renderCards() {
    $('cards').innerHTML = '';
    $('pick').innerHTML = '';
    colleges.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'card' + (i === active ? ' active' : '');
      card.style.borderTop = '4px solid ' + COLORS[i];
      card.innerHTML = FIELDS.map(([k, label, type]) =>
        `<div><span>${label}</span><input type="${type}" data-i="${i}" data-k="${k}" value="${c[k]}" ${type === 'number' ? 'step="500" min="0"' : ''}></div>`).join('') +
        `<div><span><input type="checkbox" data-i="${i}" data-k="merit" ${c.merit ? 'checked' : ''}> Includes merit that won't rise</span></div>`;
      $('cards').appendChild(card);
      $('pick').insertAdjacentHTML('beforeend', `<option value="${i}" ${i === active ? 'selected' : ''}>${c.name || 'College ' + (i + 1)}</option>`);
    });
    $('cards').querySelectorAll('input').forEach(inp => inp.addEventListener('input', e => {
      const i = +e.target.dataset.i, k = e.target.dataset.k;
      if (k === 'merit') colleges[i].merit = e.target.checked;
      else if (k === 'name') { colleges[i].name = e.target.value; $('pick').options[i].text = e.target.value || 'College ' + (i + 1); }
      else colleges[i][k] = Math.max(0, parseFloat(e.target.value) || 0);
      update();
    }));
    $('add').disabled = colleges.length >= 4;
  }

  const LADDER = [5500, 6500, 7500, 7500];
  function project(c) {
    const inc = (parseFloat($('inc').value) || 0) / 100;
    const rise = $('rise').checked && !c.merit;
    const family = parseFloat($('family').value) || 0;
    const years = [0, 1, 2, 3].map(n => {
      const cost = c.cost * Math.pow(1 + inc, n);
      const grants = rise ? c.grants * Math.pow(1 + inc, n) : c.grants;
      const net = Math.max(0, cost - grants);
      const loans = c.loans > 0 ? Math.max(0, Math.min(LADDER[n], c.loans + (LADDER[n] - 5500))) : 0;
      const oop = net - c.ws - loans;
      return { net, loans, oop, gap: Math.max(0, oop - family) };
    });
    const parentNeed = years.reduce((s, y) => s + y.gap, 0);
    const status = parentNeed <= 0.5 ? 'ok' : 'plus';
    return { years, four: years.reduce((s, y) => s + y.net, 0), debt: years.reduce((s, y) => s + y.loans, 0) + 4 * (c.other || 0),
             parentNeed, status, firstGap: years.findIndex(y => y.gap > 0.5) };
  }

  const money = v => '$' + Math.round(v).toLocaleString('en-US');

  const chart1 = new Chart($('c1'), {
    type: 'bar',
    data: { labels: [], datasets: [
      { label: 'Year-1 net price', data: [], backgroundColor: 'navy' },
      { label: 'Year-1 out-of-pocket', data: [], backgroundColor: 'seagreen' },
      { label: 'Student loans per year', data: [], backgroundColor: 'darkorange' }] },
    options: { responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { title: { display: true, text: 'First year' }, legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + money(ctx.raw),
          afterLabel: ctx => {
            const c = colleges[ctx.dataIndex];
            if (ctx.datasetIndex === 0) return money(c.cost) + ' cost − ' + money(c.grants) + ' grants';
            if (ctx.datasetIndex === 1) return 'net price − ' + money(c.ws) + ' work-study − ' + money(c.loans) + ' student loans';
            return 'Year-1 federal student loans';
          } } } },
      scales: { y: { beginAtZero: true, ticks: { callback: v => '$' + v / 1000 + 'k' } } } }
  });

  // Plugin: dashed four-year budget line
  const budgetPlugin = {
    id: 'budgetLine',
    afterDatasetsDraw(chart) {
      const v = chart.options.plugins.budgetLine.value;
      if (!v) return;
      const y = chart.scales.y.getPixelForValue(v);
      const { ctx, chartArea: a } = chart;
      ctx.save();
      ctx.strokeStyle = 'firebrick';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'firebrick';
      ctx.font = '11px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('Our four-year budget ' + money(v), a.right - 2, y - 4);
      ctx.restore();
    }
  };
  const chart2 = new Chart($('c2'), {
    type: 'bar',
    data: { labels: [], datasets: [1, 2, 3, 4].map((n, k) => ({ label: 'Year ' + n, data: [], backgroundColor: ['#1f4e79', '#2e75b6', '#5b9bd5', '#9dc3e6'][k], stack: 's' })) },
    options: { responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { title: { display: true, text: 'Four-year net price' }, budgetLine: { value: 0 },
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => ctx.dataset.label + ' net price: ' + money(ctx.raw) } } },
      scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { callback: v => '$' + v / 1000 + 'k' } } } },
    plugins: [budgetPlugin]
  });

  function update() {
    const family = parseFloat($('family').value) || 0;
    const proj = colleges.map(project);
    const labels = colleges.map(c => c.name || '—');
    chart1.data.labels = labels;
    chart1.data.datasets[0].data = proj.map(p => p.years[0].net);
    chart1.data.datasets[1].data = proj.map(p => p.years[0].oop);
    chart1.data.datasets[2].data = colleges.map(c => c.loans);
    chart1.update();
    chart2.data.labels = labels;
    for (let n = 0; n < 4; n++) chart2.data.datasets[n].data = proj.map(p => p.years[n].net);
    // budget: family contribution × 4 + planned student loans and work-study (the largest planned on any letter)
    const maxLoans = Math.max(0, ...colleges.map(c => c.loans));
    const plannedLoans = maxLoans > 0 ? LADDER.reduce((s, l) => s + Math.min(l, maxLoans + (l - 5500)), 0) : 0;
    const maxWS = Math.max(0, ...colleges.map(c => c.ws));
    chart2.options.plugins.budgetLine.value = family * 4 + plannedLoans + 4 * maxWS;
    chart2.update();

    const rows = [
      ['Year-1 net price', p => money(p.years[0].net)],
      ['Year-1 out-of-pocket', p => money(p.years[0].oop)],
      ['Four-year net price', p => money(p.four)],
      ['Four-year student debt', p => money(p.debt)],
      ['Parent borrowing needed (4 yrs)', p => money(p.parentNeed)],
      ['Status', (p, i) => p.status === 'ok' ? '<span class="ok">Fits budget</span>'
        : (p.parentNeed > 4 * 20000 ? '<span class="over">Over budget</span>' : '<span class="plus">Fits only with Parent PLUS</span>' + (p.firstGap >= 0 ? ' (from year ' + (p.firstGap + 1) + ')' : ''))]
    ];
    $('tbl').innerHTML = '<tr><th></th>' + labels.map((l, i) => `<th style="color:${COLORS[i]}">${l}</th>`).join('') + '</tr>' +
      rows.map(([label, f]) => '<tr><td>' + label + '</td>' + proj.map((p, i) => '<td>' + f(p, i) + '</td>').join('') + '</tr>').join('');
  }

  function setActive(i) {
    active = i;
    document.querySelectorAll('.ac .card').forEach((c, k) => c.classList.toggle('active', k === i));
  }

  $('pick').addEventListener('change', e => setActive(+e.target.value));
  $('showY1').addEventListener('click', () => { $('p1').classList.add('active'); $('p2').classList.remove('active'); chart1.resize(); });
  $('show4').addEventListener('click', () => { $('p2').classList.add('active'); $('p1').classList.remove('active'); chart2.resize(); });
  ['family', 'inc', 'rise'].forEach(id => $(id).addEventListener('input', update));
  $('add').addEventListener('click', () => {
    if (colleges.length >= 4) return;
    colleges.push({ name: 'College ' + (colleges.length + 1), cost: 40000, grants: 15000, merit: false, ws: 0, loans: 5500, plus: 0, other: 0 });
    active = colleges.length - 1;
    renderCards();
    update();
  });
  $('remove').addEventListener('click', () => {
    if (colleges.length <= 1) return;
    colleges.pop();
    active = Math.min(active, colleges.length - 1);
    renderCards();
    update();
  });
  $('reset').addEventListener('click', () => {
    colleges = MARCUS.map(c => ({ ...c }));
    $('family').value = 15000; $('inc').value = 3; $('rise').checked = false;
    active = 0;
    renderCards();
    update();
  });

  // on wide screens both chart panels show side by side
  const mq = window.matchMedia('(max-width: 640px)');
  const syncPanels = () => { if (!mq.matches) { $('p1').classList.add('active'); $('p2').classList.add('active'); } else { $('p2').classList.remove('active'); $('p1').classList.add('active'); } };
  mq.addEventListener('change', syncPanels);
  syncPanels();

  colleges = MARCUS.map(c => ({ ...c }));
  renderCards();
  update();
});
