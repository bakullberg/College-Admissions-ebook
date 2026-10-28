// Depth vs. Breadth Activity Map - Chart.js bubble chart
// CANVAS_HEIGHT: 660
// X = years of involvement, Y = hours per week, bubble size = hours per year (hours × weeks).
// Gold = a leadership or growing role. The shaded "depth zone" covers 3+ years and 5+ hours a week.
// Applicant A's ten one-year activities are spread slightly along the x-axis so each is visible;
// tooltips show the true values.

document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('main');

  const style = document.createElement('style');
  style.textContent = `
    .db { background: aliceblue; border: 1px solid silver; padding: 8px 12px; box-sizing: border-box; font-size: 15px; }
    .db h2 { font-size: 20px; text-align: center; margin: 2px 0 6px; }
    .db .row { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; margin-bottom: 6px; }
    .db button { font-size: 14px; }
    .db button.on { font-weight: bold; outline: 2px solid goldenrod; }
    .db input[type=number] { width: 52px; font-size: 14px; }
    .db input[type=text] { width: 150px; font-size: 14px; }
    .db label { white-space: nowrap; font-size: 14px; }
    .db .chart-box { position: relative; height: 330px; background: white; border: 1px solid silver; border-radius: 8px; }
    .db .sum { font-size: 14px; margin-top: 6px; line-height: 1.5; }
    @media (max-width: 560px) { .db .chart-box { height: 260px; } .db .sum { font-size: 13px; } }
    .db .form { background: white; border: 1px solid silver; border-radius: 8px; padding: 6px 8px; margin-top: 6px; }
  `;
  document.head.appendChild(style);

  main.innerHTML = `
    <div class="db">
      <h2>Depth vs. Breadth Activity Map</h2>
      <div class="row">
        <button id="showA">Show Applicant A</button>
        <button id="showB">Show Applicant B</button>
        <button id="showBoth" class="on">Show both</button>
      </div>
      <div class="chart-box"><canvas id="chart"></canvas></div>
      <div class="sum" id="sum"></div>
      <div class="form">
        <div class="row">
          <b id="formTitle">Add my activity:</b>
          <input type="text" id="fName" placeholder="Activity name">
          <label>Years <input type="number" id="fYears" min="1" max="4" step="1" value="2"></label>
          <label>Hrs/wk <input type="number" id="fHours" min="0" max="25" step="0.5" value="4"></label>
          <label>Wks/yr <input type="number" id="fWeeks" min="1" max="52" step="1" value="30"></label>
          <label><input type="checkbox" id="fLead"> Leadership or growing role</label>
          <button id="fAdd">Add</button>
          <button id="fCancel" style="display:none">Cancel edit</button>
          <button id="clearMine">Clear mine</button>
        </div>
      </div>
    </div>`;

  const $ = id => document.getElementById(id);
  const A_NAMES = ['Spanish Club', 'Chess Club', 'Key Club', 'Model UN', 'Robotics', 'Drama Club', 'Environmental Club', 'Debate', 'Yearbook', 'Science Olympiad'];
  const applicantA = A_NAMES.map((n, i) => ({ name: n, years: 1, hours: i % 3 === 0 ? 2 : (i % 3 === 1 ? 1 : 1.5), weeks: 20, lead: false }));
  const applicantB = [
    { name: 'Community bike shop', years: 3, hours: 8, weeks: 40, lead: true },
    { name: 'Part-time job', years: 2, hours: 10, weeks: 40, lead: false },
    { name: 'Cross-country', years: 4, hours: 6, weeks: 14, lead: false },
    { name: 'Math tutoring', years: 2, hours: 2, weeks: 30, lead: true }
  ];
  let mine = [];
  let editIndex = -1;
  let view = 'both';

  const radius = a => 3 + Math.sqrt(a.hours * a.weeks) * 0.8;
  const inZone = a => a.years >= 3 && a.hours >= 5;
  const toPoints = (list, jitter) => list.map((a, i) => ({
    x: a.years + (jitter ? (i - (list.length - 1) / 2) * 0.05 : 0), y: a.hours, r: radius(a), a
  }));

  // Plugin: shade the depth zone behind the bubbles
  const zonePlugin = {
    id: 'depthZone',
    beforeDatasetsDraw(chart) {
      const { ctx, scales: { x, y } } = chart;
      const x1 = x.getPixelForValue(2.75), x2 = x.getPixelForValue(4.5);
      const y1 = y.getPixelForValue(25), y2 = y.getPixelForValue(5);
      ctx.save();
      ctx.fillStyle = 'rgba(46, 139, 87, 0.10)';
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      ctx.strokeStyle = 'rgba(46, 139, 87, 0.6)';
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.fillStyle = 'seagreen';
      ctx.font = 'bold 13px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('Depth zone', x2 - 6, y1 + 16);
      ctx.restore();
    }
  };

  const chart = new Chart($('chart'), {
    type: 'bubble',
    data: { datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { min: 0.5, max: 4.5, title: { display: true, text: 'Years of involvement' },
             afterBuildTicks: axis => { axis.ticks = [1, 2, 3, 4].map(v => ({ value: v })); } },
        y: { min: 0, max: 25, title: { display: true, text: 'Hours per week' } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const a = ctx.raw.a;
              return [a.name + (a.lead ? ' (leadership/growing role)' : ''),
                      a.years + ' yr · ' + a.hours + ' hrs/wk · ' + a.weeks + ' wks/yr',
                      'Total: ' + Math.round(a.hours * a.weeks) + ' hours per year'];
            }
          }
        }
      },
      onClick: (evt, els) => {
        const el = els.find(e => chart.data.datasets[e.datasetIndex].mine);
        if (el) startEdit(el.index);
      }
    },
    plugins: [zonePlugin]
  });

  function dataset(label, list, edge, jitter, isMine) {
    return {
      label, mine: isMine,
      data: toPoints(list, jitter),
      backgroundColor: list.map(a => isMine ? 'rgba(65, 105, 225, 0.15)' : (a.lead ? 'rgba(218, 165, 32, 0.75)' : 'rgba(128, 128, 128, 0.55)')),
      borderColor: list.map(a => isMine ? 'royalblue' : edge),
      borderWidth: isMine ? 2.5 : 1.5
    };
  }

  function summaryLine(label, list) {
    if (!list.length) return '';
    const z = list.filter(inZone).length;
    const total = list.reduce((s, a) => s + a.hours * a.weeks, 0);
    return `<b>${label}:</b> activities in the depth zone: ${z} of ${list.length}. Total hours per year: ${Math.round(total).toLocaleString('en-US')}.`;
  }

  function update() {
    const ds = [];
    if (view !== 'B') ds.push(dataset('Applicant A (broad)', applicantA, 'dimgray', true, false));
    if (view !== 'A') ds.push(dataset('Applicant B (deep)', applicantB, 'black', false, false));
    if (mine.length) ds.push(dataset('My activities', mine, 'royalblue', false, true));
    chart.data.datasets = ds;
    chart.update();
    const lines = [];
    if (view !== 'B') lines.push(summaryLine('Applicant A', applicantA));
    if (view !== 'A') lines.push(summaryLine('Applicant B', applicantB));
    if (mine.length) lines.push(summaryLine('Mine', mine) + ' <span style="color:gray">(click one of your bubbles to edit it)</span>');
    $('sum').innerHTML = lines.join('<br>') + '<br><span style="color:gray">Gold = leadership or growing role. Bubble size = hours per year.</span>';
    ['showA', 'showB', 'showBoth'].forEach(id => $(id).classList.toggle('on', (id === 'showA' && view === 'A') || (id === 'showB' && view === 'B') || (id === 'showBoth' && view === 'both')));
  }

  function readForm() {
    const clampNum = (v, lo, hi, d) => { const n = parseFloat(v); return isNaN(n) ? d : Math.min(hi, Math.max(lo, n)); };
    return {
      name: $('fName').value.trim() || 'My activity',
      years: Math.round(clampNum($('fYears').value, 1, 4, 1)),
      hours: clampNum($('fHours').value, 0, 25, 1),
      weeks: Math.round(clampNum($('fWeeks').value, 1, 52, 20)),
      lead: $('fLead').checked
    };
  }

  function startEdit(i) {
    const a = mine[i];
    editIndex = i;
    $('fName').value = a.name; $('fYears').value = a.years; $('fHours').value = a.hours; $('fWeeks').value = a.weeks; $('fLead').checked = a.lead;
    $('formTitle').textContent = 'Edit my activity:';
    $('fAdd').textContent = 'Save changes';
    $('fCancel').style.display = '';
  }

  function endEdit() {
    editIndex = -1;
    $('formTitle').textContent = 'Add my activity:';
    $('fAdd').textContent = 'Add';
    $('fCancel').style.display = 'none';
    $('fName').value = '';
    $('fLead').checked = false;
  }

  $('fAdd').addEventListener('click', () => {
    const a = readForm();
    if (editIndex >= 0) mine[editIndex] = a;
    else if (mine.length < 10) mine.push(a);
    endEdit();
    update();
  });
  $('fCancel').addEventListener('click', endEdit);
  $('clearMine').addEventListener('click', () => { mine = []; endEdit(); update(); });
  $('showA').addEventListener('click', () => { view = 'A'; update(); });
  $('showB').addEventListener('click', () => { view = 'B'; update(); });
  $('showBoth').addEventListener('click', () => { view = 'both'; update(); });

  update();
});
