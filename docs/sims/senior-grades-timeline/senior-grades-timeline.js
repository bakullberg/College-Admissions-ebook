// What Colleges See in Senior Year - vis-timeline
// CANVAS_HEIGHT: 520
// When colleges receive senior-year course and grade information, August of senior year
// through August after graduation. "Show me as" highlights the events that matter for an
// Early Action, Regular Decision, or deferred early applicant, and dims the rest.

document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('main');

  const style = document.createElement('style');
  style.textContent = `
    .sg { background: aliceblue; border: 1px solid silver; padding: 8px 10px; box-sizing: border-box; font-size: 15px; }
    .sg h2 { font-size: 20px; text-align: center; margin: 2px 0 6px; }
    .sg .row { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; margin-bottom: 6px; }
    .sg select, .sg button { font-size: 14px; }
    #tl { background: white; border: 1px solid silver; }
    .sg .caption { font-size: 14px; min-height: 36px; margin: 6px 2px; line-height: 1.35; }
    .sg .info { background: white; border: 1px solid silver; border-radius: 10px; padding: 8px 12px; font-size: 15px;
                height: 96px; overflow: auto; box-sizing: border-box; line-height: 1.35; }
    .sg .info b { color: #1f3b57; }
    .vis-item { font-size: 13px; border-radius: 5px; background: lightsteelblue; border-color: steelblue; color: black; }
    .vis-item .vis-item-content { white-space: nowrap !important; padding: 3px 6px !important; }
    .vis-item.hl { background: gold; border-color: darkgoldenrod; font-weight: bold; }
    .vis-item.dim { opacity: 0.35; }
    .vis-item.vis-selected { border-color: darkorange !important; border-width: 3px; }
    .vis-item.vis-background.fall { background: rgba(70, 130, 180, 0.12); }
    .vis-item.vis-background.spring { background: rgba(46, 139, 87, 0.12); }
    .vis-item.vis-background .vis-item-content { font-size: 12px; color: dimgray; font-weight: normal; }
  `;
  document.head.appendChild(style);

  main.innerHTML = `
    <div class="sg">
      <h2>What Colleges See in Senior Year</h2>
      <div class="row">
        <label for="who">Show me as:</label>
        <select id="who">
          <option value="all">Everything</option>
          <option value="ea">Early Action applicant</option>
          <option value="rd">Regular Decision applicant</option>
          <option value="def">Deferred early applicant</option>
        </select>
        <button id="panL" title="Earlier">◀</button>
        <button id="panR" title="Later">▶</button>
        <button id="fit">Show all</button>
      </div>
      <div id="tl"></div>
      <div class="caption" id="caption"></div>
      <div class="info" id="info">Click any event to see what colleges learn at that point.</div>
    </div>`;

  const d = (y, m, day) => new Date(y, m - 1, day);
  const events = [
    { id: 'app', content: 'Application submitted', start: d(2026, 10, 15),
      info: '<b>Fall: application submitted.</b> Colleges see your senior courses listed as in progress, and the counselor\'s rigor rating includes them. Your senior schedule counts before you have a single senior grade.' },
    { id: 'q1', content: 'First-quarter grades (some colleges)', start: d(2026, 11, 10),
      info: '<b>October–November: first-quarter grades.</b> A few colleges or early rounds ask for them. Most don\'t, but the grades still feed your mid-year report.' },
    { id: 'ed', content: 'Early decisions released', start: d(2026, 12, 15),
      info: '<b>Mid-December: early decisions released.</b> Deferred applicants will be reconsidered with senior grades, so the mid-year report matters a great deal for them.' },
    { id: 'mid', content: 'Mid-year report', start: d(2027, 1, 25),
      info: '<b>January–February: mid-year report.</b> Your counselor sends first-semester senior grades. It arrives before most regular decisions, so fall grades can help or hurt.' },
    { id: 'rd', content: 'Regular decisions released', start: d(2027, 3, 25),
      info: '<b>March–April: regular decisions released.</b> Admission offers are conditional on finishing the year as strongly as you started it.' },
    { id: 'exams', content: 'AP and IB exams', start: d(2027, 5, 10),
      info: '<b>May: AP and IB exams.</b> Results come in July. They affect college credit and placement, not admission.' },
    { id: 'final', content: 'Final transcript', start: d(2027, 6, 20),
      info: '<b>June–July: final transcript.</b> Sent to your enrolling college only. It confirms that you met the conditions of your admission.' },
    { id: 'scores', content: 'AP scores and IB results released', start: d(2027, 7, 8),
      info: '<b>July: AP scores and IB results released.</b> Send them to your college for credit or placement.' },
    { id: 'drop', content: 'Possible grade-drop letter', start: d(2027, 7, 28),
      info: '<b>Summer: possible grade-drop letter.</b> Only if the final transcript shows a serious decline. Colleges usually ask for an explanation; in rare cases an offer is rescinded.' }
  ];
  const views = {
    all: { hl: [], caption: 'Every point in senior year when colleges learn something about your senior courses and grades.' },
    ea: { hl: ['app', 'ed', 'final', 'drop'], caption: '<b>Early Action:</b> colleges decide in December–February using your senior course list, before most senior grades exist. Your final transcript still confirms your admission.' },
    rd: { hl: ['app', 'q1', 'mid', 'rd', 'final', 'drop'], caption: '<b>Regular Decision:</b> your mid-year report arrives before the decision, so first-semester senior grades are part of the file.' },
    def: { hl: ['app', 'q1', 'ed', 'mid', 'rd', 'final', 'drop'], caption: '<b>Deferred early applicant:</b> after the December deferral, the college reconsiders you with your mid-year grades. A strong fall semester is your best argument.' }
  };

  const items = new vis.DataSet([
    { id: 'fall', content: 'Senior fall semester (counts for the mid-year report)', start: d(2026, 8, 20), end: d(2027, 1, 15), type: 'background', className: 'fall' },
    { id: 'spring', content: 'Senior spring semester (counts for the final transcript)', start: d(2027, 1, 15), end: d(2027, 6, 5), type: 'background', className: 'spring' },
    ...events.map(e => ({ id: e.id, content: e.content, start: e.start, type: 'box' }))
  ]);
  const info = Object.fromEntries(events.map(e => [e.id, e.info]));

  const rangeStart = d(2026, 8, 1), rangeEnd = d(2027, 10, 20);
  const timeline = new vis.Timeline(document.getElementById('tl'), items, {
    height: '250px',
    start: rangeStart, end: rangeEnd,
    min: d(2026, 7, 1), max: d(2027, 11, 15),
    zoomMin: 1000 * 60 * 60 * 24 * 45,
    zoomable: false,
    moveable: true,
    stack: true,
    align: 'left',
    showCurrentTime: false,
    orientation: 'top',
    margin: { item: { horizontal: 4, vertical: 6 } },
    format: { minorLabels: { month: 'MMM' }, majorLabels: { month: 'YYYY' } }
  });

  function applyView(key) {
    const v = views[key];
    events.forEach(e => {
      const cls = v.hl.length === 0 ? '' : (v.hl.includes(e.id) ? 'hl' : 'dim');
      items.update({ id: e.id, className: cls });
    });
    document.getElementById('caption').innerHTML = v.caption;
  }

  timeline.on('select', p => {
    if (p.items.length && info[p.items[0]]) document.getElementById('info').innerHTML = info[p.items[0]];
  });
  document.getElementById('who').addEventListener('change', e => applyView(e.target.value));
  const pan = f => {
    const w = timeline.getWindow();
    const s = (w.end - w.start) * f;
    timeline.setWindow(new Date(w.start.valueOf() + s), new Date(w.end.valueOf() + s));
  };
  document.getElementById('panL').onclick = () => pan(-0.3);
  document.getElementById('panR').onclick = () => pan(0.3);
  document.getElementById('fit').onclick = () => timeline.setWindow(rangeStart, rangeEnd);
  window.addEventListener('resize', () => timeline.redraw());

  applyView('all');
});
