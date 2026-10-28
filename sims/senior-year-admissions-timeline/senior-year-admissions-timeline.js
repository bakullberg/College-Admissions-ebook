// Senior Year Admissions Timeline - vis-timeline
// CANVAS_HEIGHT: 590
// Two tracks: the shared admissions calendar (grey, red for May 1) and "Your plan," which
// changes with the scenario dropdown. Click any item to read what it is and which chapter
// covers it. The dates use the 2026–27 senior year; the pattern repeats every year.

document.addEventListener('DOMContentLoaded', function () {
  const main = document.querySelector('main');

  // ----- styles -----
  const style = document.createElement('style');
  style.textContent = `
    .tl-wrap { background: aliceblue; border: 1px solid silver; padding: 8px 10px; box-sizing: border-box; }
    .tl-title { font-size: 20px; font-weight: bold; text-align: center; margin: 2px 0 6px; }
    .tl-controls { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; font-size: 15px; margin-bottom: 6px; }
    .tl-controls select, .tl-controls button { font-size: 14px; padding: 3px 6px; }
    .tl-caption { font-size: 15px; min-height: 40px; margin: 6px 2px; line-height: 1.35; }
    .tl-info { background: white; border: 1px solid silver; border-radius: 10px; padding: 8px 12px; font-size: 15px;
               height: 92px; overflow: auto; box-sizing: border-box; line-height: 1.35; }
    .tl-info b { color: #1f3b57; }
    #timeline { background: white; border: 1px solid silver; }
    .vis-item { font-size: 13px; border-radius: 5px; }
    .vis-item .vis-item-content { white-space: nowrap !important; padding: 3px 6px !important; }
    .vis-item.vis-range, .vis-item.vis-box { min-width: fit-content !important; }
    .vis-item.shared { background: gainsboro; border-color: gray; color: black; }
    .vis-item.deadline { background: crimson; border-color: darkred; color: white; font-weight: bold; }
    .vis-item.plan-rd { background: lightsteelblue; border-color: steelblue; color: black; }
    .vis-item.plan-ea { background: palegreen; border-color: seagreen; color: black; }
    .vis-item.plan-ed { background: navajowhite; border-color: darkorange; color: black; }
    .vis-item.vis-selected { border-color: goldenrod !important; border-width: 3px; }
    .vis-item.vis-point.shared .vis-dot, .vis-item.vis-dot.shared { border-color: gray; }
    .vis-label .vis-inner { font-size: 14px; font-weight: bold; padding: 4px 6px; }
    .vis-tooltip { max-width: 260px; white-space: normal !important; font-size: 13px; }
  `;
  document.head.appendChild(style);

  // ----- layout -----
  main.innerHTML = `
    <div class="tl-wrap">
      <div class="tl-title">Senior Year Admissions Timeline</div>
      <div class="tl-controls">
        <label for="scenario">Your plan:</label>
        <select id="scenario">
          <option value="rd">All Regular Decision</option>
          <option value="ea">Early Action + Regular</option>
          <option value="ed-yes">Early Decision (admitted in December)</option>
          <option value="ed-no">Early Decision (deferred or denied)</option>
        </select>
        <button id="zoomIn" title="Zoom in">+</button>
        <button id="zoomOut" title="Zoom out">−</button>
        <button id="panLeft" title="Earlier">◀</button>
        <button id="panRight" title="Later">▶</button>
        <button id="fitAll">Show all</button>
      </div>
      <div id="timeline"></div>
      <div class="tl-caption" id="caption"></div>
      <div class="tl-info" id="info">Click any bar or dot on the timeline to see what it is and which chapter covers it.</div>
    </div>`;

  const d = (y, m, day) => new Date(y, m - 1, day);

  // Shared anchor events that every senior lives through
  const shared = [
    { id: 's1', content: 'Common App opens', start: d(2026, 8, 1), type: 'box', className: 'shared',
      info: '<b>August 1: Common App opens.</b> The shared application most colleges accept opens for the new year. Set up your account and start the activities list. (Chapter 5)' },
    { id: 's2', content: 'FAFSA opens (≈ Oct 1)', start: d(2026, 10, 1), type: 'box', className: 'shared',
      info: '<b>About October 1: FAFSA opens.</b> The federal financial aid form opens in the fall. Its exact opening date has varied in recent years, so confirm the current one. (Chapter 14)' },
    { id: 's3', content: 'Nov 1 early deadline', start: d(2026, 11, 1), type: 'box', className: 'shared',
      info: '<b>November 1: the most common early deadline.</b> Many Early Decision and Early Action applications are due today. (Chapter 1)' },
    { id: 's4', content: 'Nov 15 early deadline', start: d(2026, 11, 15), type: 'box', className: 'shared',
      info: '<b>November 15: the second common early deadline.</b> Some colleges use this date for ED or EA instead of November 1. (Chapter 1)' },
    { id: 's5', content: 'Most ED decisions', start: d(2026, 12, 15), type: 'box', className: 'shared',
      info: '<b>Mid-December: most Early Decision results.</b> Early applicants hear admit, deny, or defer. (Chapters 1 and 18)' },
    { id: 's6', content: 'Most RD deadlines (Jan 1–Feb 1)', start: d(2027, 1, 15), type: 'box', className: 'shared',
      info: '<b>January 1 – February 1: most Regular Decision deadlines.</b> This is when most students submit most of their applications. (Chapters 1 and 12)' },
    { id: 's7', content: 'Most RD decisions (mid-Mar–early Apr)', start: d(2027, 3, 25), type: 'box', className: 'shared',
      info: '<b>Mid-March to early April: most Regular Decision results.</b> Admission decisions, and often financial aid offers, arrive. (Chapters 17–18)' },
    { id: 's8', content: 'May 1: commit + deposit', start: d(2027, 5, 1), type: 'box', className: 'deadline',
      info: '<b>May 1: National Candidates Reply Date.</b> Choose one college and pay its enrollment deposit, then decline your other offers. (Chapter 19)' },
    { id: 's9', content: 'Summer tasks', start: d(2027, 6, 1), end: d(2027, 8, 20), className: 'shared',
      info: '<b>June – August: getting ready for fall.</b> Housing forms, orientation, and your final high school transcript. (Chapter 20)' }
  ];

  // Personal tracks for each scenario
  const plans = {
    rd: {
      caption: '<b>All Regular Decision:</b> your applications go in during early January, so fall is lighter. Every decision arrives in March, and you compare every offer in April before May 1.',
      items: [
        { content: 'Submit all applications', start: d(2027, 1, 2), type: 'box',
          info: '<b>Early January: submit every application.</b> You have all fall to polish essays, and colleges can see your fall grades. (Chapter 12)' },
        { content: 'All decisions arrive', start: d(2027, 3, 15), type: 'box',
          info: '<b>March: every decision arrives.</b> Admissions and aid offers come in close together. (Chapter 18)' },
        { content: 'Compare every offer', start: d(2027, 4, 1), type: 'box',
          info: '<b>April: compare every offer side by side.</b> Because nothing is binding, you can weigh every admission and aid offer. (Chapters 16 and 19)' }
      ]
    },
    ea: {
      caption: '<b>Early Action + Regular:</b> two applications are due November 1, so October gets busy. You may have an admission in hand by January, but you still compare every offer before May 1.',
      items: [
        { content: 'Submit 2 EA applications', start: d(2026, 11, 1), type: 'box',
          info: '<b>November 1: submit two Early Action applications.</b> They must be finished in October, alongside your senior classes. (Chapter 1)' },
        { content: 'EA decisions arrive', start: d(2026, 12, 15), type: 'box',
          info: '<b>December – January: Early Action decisions.</b> An early admit is non-binding: you can still say no. (Chapter 18)' },
        { content: 'Submit remaining RD apps', start: d(2027, 1, 2), type: 'box',
          info: '<b>Early January: submit the rest of your applications Regular Decision.</b> (Chapter 12)' },
        { content: 'RD decisions arrive', start: d(2027, 3, 15), type: 'box',
          info: '<b>March: Regular Decision results.</b> (Chapter 18)' },
        { content: 'Compare every offer', start: d(2027, 4, 1), type: 'box',
          info: '<b>April: compare every offer.</b> Early Action admits stay open until May 1. (Chapter 19)' }
      ]
    },
    'ed-yes': {
      caption: '<b>Early Decision, admitted:</b> one binding application on November 1. Admitted in December, you withdraw every other application and your plan ends early. You give up the chance to compare aid offers.',
      items: [
        { content: 'Submit 1 ED application', start: d(2026, 11, 1), type: 'box',
          info: '<b>November 1: submit one Early Decision application.</b> You, a parent, and your counselor sign the ED agreement. (Chapter 1)' },
        { content: 'Admitted ED', start: d(2026, 12, 15), type: 'box',
          info: '<b>Mid-December: admitted Early Decision.</b> The commitment is binding: you will attend if the aid makes it affordable. (Chapter 18)' },
        { content: 'Withdraw other apps + deposit', start: d(2026, 12, 16), type: 'box',
          info: '<b>Late December: withdraw every other application and pay the deposit.</b> Your application season is over. (Chapters 18–19)' }
      ]
    },
    'ed-no': {
      caption: '<b>Early Decision, deferred or denied:</b> the ED result comes in mid-December, and your Regular Decision applications carry on. Have them nearly finished before the December result.',
      items: [
        { content: 'Submit 1 ED application', start: d(2026, 11, 1), type: 'box',
          info: '<b>November 1: submit one Early Decision application.</b> (Chapter 1)' },
        { content: 'Deferred or denied', start: d(2026, 12, 15), type: 'box',
          info: '<b>Mid-December: deferred or denied.</b> A deferral moves you into the Regular Decision pool; a denial is final for that college. (Chapter 18)' },
        { content: 'Submit RD applications', start: d(2027, 1, 2), type: 'box',
          info: '<b>Early January: submit your Regular Decision applications.</b> Only two or three weeks after the ED result, so start them in the fall. (Chapter 12)' },
        { content: 'RD decisions arrive', start: d(2027, 3, 15), type: 'box',
          info: '<b>March: Regular Decision results, including a deferred ED school.</b> (Chapter 18)' },
        { content: 'Compare offers', start: d(2027, 4, 1), type: 'box',
          info: '<b>April: compare the offers you have.</b> (Chapter 19)' }
      ]
    }
  };

  const planClass = { rd: 'plan-rd', ea: 'plan-ea', 'ed-yes': 'plan-ed', 'ed-no': 'plan-ed' };

  const groups = new vis.DataSet([
    { id: 'shared', content: 'Shared calendar' },
    { id: 'plan', content: 'Your plan' }
  ]);
  const items = new vis.DataSet();
  const infoById = {};

  shared.forEach(it => {
    items.add({ ...it, group: 'shared', title: it.content });
    infoById[it.id] = it.info;
  });

  function loadPlan(key) {
    items.remove(items.getIds({ filter: it => it.group === 'plan' }));
    plans[key].items.forEach((it, k) => {
      const id = 'p-' + key + '-' + k;
      items.add({ ...it, id: id, group: 'plan', className: planClass[key], title: it.content });
      infoById[id] = it.info;
    });
    document.getElementById('caption').innerHTML = plans[key].caption;
    document.getElementById('info').innerHTML = 'Click any bar or dot on the timeline to see what it is and which chapter covers it.';
  }

  const rangeStart = d(2026, 6, 15), rangeEnd = d(2027, 9, 20);
  const timeline = new vis.Timeline(document.getElementById('timeline'), items, groups, {
    height: '340px',
    align: 'left',
    start: rangeStart,
    end: rangeEnd,
    min: d(2026, 5, 1),
    max: d(2027, 10, 15),
    zoomMin: 1000 * 60 * 60 * 24 * 30,      // one month
    zoomMax: 1000 * 60 * 60 * 24 * 500,     // about 16 months
    zoomable: false,                       // keep page scrolling; use the +/− buttons
    moveable: true,
    stack: true,
    verticalScroll: true,
    showCurrentTime: false,
    orientation: 'top',
    margin: { item: { horizontal: 4, vertical: 6 }, axis: 6 },
    format: { minorLabels: { month: 'MMM' }, majorLabels: { month: 'YYYY' } },
    tooltip: { followMouse: true }
  });

  timeline.on('select', props => {
    if (props.items.length) {
      document.getElementById('info').innerHTML = infoById[props.items[0]] || '';
    }
  });

  document.getElementById('scenario').addEventListener('change', e => loadPlan(e.target.value));

  function zoom(factor) {
    const w = timeline.getWindow();
    const mid = (w.start.valueOf() + w.end.valueOf()) / 2;
    const half = (w.end - w.start) * factor / 2;
    timeline.setWindow(new Date(mid - half), new Date(mid + half));
  }
  function pan(fraction) {
    const w = timeline.getWindow();
    const shift = (w.end - w.start) * fraction;
    timeline.setWindow(new Date(w.start.valueOf() + shift), new Date(w.end.valueOf() + shift));
  }
  document.getElementById('zoomIn').onclick = () => zoom(0.6);
  document.getElementById('zoomOut').onclick = () => zoom(1.6);
  document.getElementById('panLeft').onclick = () => pan(-0.3);
  document.getElementById('panRight').onclick = () => pan(0.3);
  document.getElementById('fitAll').onclick = () => timeline.setWindow(rangeStart, rangeEnd);

  loadPlan('rd');
  window.addEventListener('resize', () => timeline.redraw());
});
