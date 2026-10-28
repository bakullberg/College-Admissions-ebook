// Personal Application Roadmap
// CANVAS_HEIGHT: 700
// Nineteen stops, one per row of Chapter 20's capstone table, from learning the landscape to fall.
// For each stop, record this college's specifics and date, and check "Verified" once you've
// confirmed it on the college's own website. The road shows progress (gray empty, blue filled,
// green verified); the mini-calendar lists every date in order, with past dates in red.
// Roadmaps are saved per college name in this browser when storage is available.

let canvasWidth = 400;
let drawHeight = 250;
let controlHeight = 450;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const STORAGE_PREFIX = 'personal-application-roadmap-v1:';
const CHAPTER_DIRS = ['01-college-landscape-and-rounds', '02-how-colleges-evaluate', '03-finding-your-fit', '04-researching-your-list',
  '05-getting-organized', '06-sat-act-question', '07-senior-year-course-load', '08-activities-and-resume', '09-personal-essay',
  '10-supplemental-essays', '11-letters-of-recommendation', '12-common-app-coalition-app', '13-interviews', '14-understanding-financial-aid',
  '15-scholarships', '16-comparing-award-letters', '17-waiting-and-anxiety', '18-handling-decisions', '19-making-your-final-choice',
  '20-getting-ready-for-fall'];

// stop name, chapter numbers, Iowa specifics, Iowa date
const STOPS = [
  ['Landscape', [1], 'Large public research university; Early Action and Regular, no Early Decision; non-binding rounds', ''],
  ['Evaluation', [2], 'RAI = 3 × ACT + 30 × GPA + 5 × core years; 245 resident minimum (255 nonresident)', ''],
  ['Fit', [3], 'In-state cost; strong writing programs; a true safety: admissible, affordable, and liked', ''],
  ['Research', [4], 'Visited campus; net price calculator on Iowa\'s financial aid site', ''],
  ['Organization', [5], 'Every Iowa date in the tracker; documents due November 9', '2026-11-09'],
  ['Testing', [6], 'Test-optional; merit scholarships start around ACT 26 / SAT 1230', ''],
  ['Course load', [2, 7], 'Full core senior schedule; each core year adds 5 RAI points', ''],
  ['Activities and essay', [8, 9, 12], 'Iowa\'s own application requires no essay; the Common App sends it', ''],
  ['Supplements and letters', [10, 11], 'No supplements or recommendations required for general admission', ''],
  ['Application', [12], 'Early Action through the Common App, due November 2; ACT code 1356; SAT code 6681', '2026-11-02'],
  ['Financial aid', [14], 'FAFSA only (school code 001892), no CSS Profile; priority deadline December 1', '2026-12-01'],
  ['Scholarships', [15], 'Most merit awards are automatic with a complete application by the deadline', ''],
  ['Award letter', [16], 'Compare net price, not sticker price', ''],
  ['Waiting and decision', [17, 18], 'Admission conditional on finishing senior year', ''],
  ['Final choice', [19], 'Acceptance deadline May 3; $325 acceptance fee, refundable until then', '2027-05-03'],
  ['Housing', [20], 'Apply January 6–May 3; by May 1 plus orientation by May 15 for June room selection', '2027-05-01'],
  ['Orientation', [20], 'Reservations open after the acceptance fee; schedule by May 15', '2027-05-15'],
  ['AP credit and summer', [20], 'Free AP score send by June 20; check Iowa\'s AP credit chart before registration', '2027-06-20'],
  ['Fall', [20], 'On Iowa! runs the week before fall classes; covered by the acceptance fee', '2027-08-16']
];
// stops a student starting later should catch up on first
const CATCH_UP = { 'Spring of junior year': 0, 'Summer': 4, 'Fall of senior year': 7 };

let collegeInput, startSelect, iowaButton, blankButton, printButton, prevButton, nextButton, labels = {};
let rows = [];   // { label, link, spec, date, verified }
let page = 0;
let loadedKey = '';
let storageOK = true;
let iowaNote = false;
let dotRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // print stylesheet: hide navigation links and keep inputs readable on paper
  const ps = createElement('style', '@media print { body > a { display: none; } input { border: none; } button { display: none; } }');
  ps.parent(document.head);

  labels.college = createSpan('College name');
  collegeInput = createInput('');
  collegeInput.size(150);
  collegeInput.changed(loadFromStorage);
  labels.start = createSpan('Starting from');
  startSelect = createSelect();
  Object.keys(CATCH_UP).forEach(k => startSelect.option(k));
  startSelect.selected('Fall of senior year');
  iowaButton = createButton('Load Iowa (Casey)');
  iowaButton.mousePressed(loadIowa);
  blankButton = createButton('Blank roadmap');
  blankButton.mousePressed(() => { clearRows(); iowaNote = false; saveRoadmap(); });
  printButton = createButton('Print / save as PDF');
  printButton.mousePressed(() => window.print());
  prevButton = createButton('◀ Earlier stops');
  prevButton.mousePressed(() => { page = max(0, page - 1); positionControls(); });
  nextButton = createButton('Later stops ▶');
  nextButton.mousePressed(() => { page = min(pageCount() - 1, page + 1); positionControls(); });
  Object.values(labels).forEach(l => l.style('font-size', '13px'));

  STOPS.forEach((s, i) => {
    const label = createSpan((i + 1) + '. ' + s[0]);
    label.style('font-size', '13px');
    label.style('font-weight', 'bold');
    const link = createA('../../chapters/' + CHAPTER_DIRS[s[1][0] - 1] + '/', 'Ch ' + s[1].join(', '), '_parent');
    link.style('font-size', '12px');
    const spec = createInput('');
    spec.attribute('placeholder', 'This college\'s specifics');
    spec.input(saveRoadmap);
    const date = createInput('', 'date');
    date.style('font-size', '12px');
    date.input(saveRoadmap);
    const verified = createCheckbox(' Verified', false);
    verified.style('font-size', '12px');
    verified.changed(saveRoadmap);
    rows.push({ label, link, spec, date, verified });
  });

  loadIowa();
  describe('A personal application roadmap with nineteen stops from learning the landscape to moving in. For each stop, record one college\'s specific policies and dates and mark them verified on the college\'s website. A road shows progress, a mini-calendar lists dates in order, and a preset fills in the University of Iowa example.');
}

function perPage() {
  return canvasWidth < 640 ? 4 : 10;
}

function pageCount() {
  return ceil(STOPS.length / perPage());
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([labels.college, collegeInput, labels.start, startSelect], 10, y, 30) + 32;
  y = flowRow([iowaButton, blankButton, printButton], 10, y, 30) + 38;
  page = constrain(page, 0, pageCount() - 1);
  const first = page * perPage(), last = min(STOPS.length, first + perPage());
  const wide = canvasWidth >= 640;
  rows.forEach((r, i) => {
    const show = i >= first && i < last;
    [r.label, r.link, r.spec, r.date, r.verified].forEach(e => show ? e.show() : e.hide());
    if (!show) return;
    if (wide) {
      r.label.position(10, y + 4);
      r.link.position(170, y + 5);
      r.spec.position(222, y);
      r.spec.size(canvasWidth - 222 - 250);
      r.date.position(canvasWidth - 240, y);
      r.verified.position(canvasWidth - 100, y + 2);
      y += 30;
    } else {
      r.label.position(10, y + 2);
      r.link.position(10 + (r.label.elt.offsetWidth || 120) + 8, y + 3);
      r.verified.position(canvasWidth - 92, y);
      r.spec.position(10, y + 24);
      r.spec.size(canvasWidth - 160);
      r.date.position(canvasWidth - 140, y + 24);
      y += 60;
    }
  });
  const ny = drawHeight + controlHeight - 38;
  prevButton.position(10, ny);
  nextButton.position(10 + (prevButton.elt.offsetWidth || 120) + 10, ny);
  page === 0 ? prevButton.attribute('disabled', '') : prevButton.removeAttribute('disabled');
  page === pageCount() - 1 ? nextButton.attribute('disabled', '') : nextButton.removeAttribute('disabled');
}

// Place controls left to right using their real widths; wrap when the row is full.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style('white-space', 'nowrap');
    c.position(x, y);
    const w = c.elt.offsetWidth || c.cachedWidth || 80;
    c.cachedWidth = w;
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 6;
  }
  return y;
}

function clearRows() {
  rows.forEach(r => { r.spec.value(''); r.date.value(''); r.verified.checked(false); });
}

function loadIowa() {
  collegeInput.value('University of Iowa');
  STOPS.forEach((s, i) => { rows[i].spec.value(s[2]); rows[i].date.value(s[3]); rows[i].verified.checked(true); });
  iowaNote = true;
  loadedKey = roadmapKey();
  page = 0;
  saveRoadmap();
  positionControls();
}

function roadmapKey() {
  return STORAGE_PREFIX + collegeInput.value().trim().toLowerCase();
}

function saveRoadmap() {
  try {
    window.localStorage.setItem(roadmapKey(), JSON.stringify({
      start: startSelect.value(), iowa: iowaNote,
      rows: rows.map(r => [r.spec.value(), r.date.value(), r.verified.checked()])
    }));
  } catch (e) { storageOK = false; }
}

function loadFromStorage() {
  loadedKey = roadmapKey();
  let saved = null;
  try {
    const raw = window.localStorage.getItem(loadedKey);
    saved = raw ? JSON.parse(raw) : null;
  } catch (e) { storageOK = false; }
  if (saved) {
    saved.rows.forEach((v, i) => { rows[i].spec.value(v[0]); rows[i].date.value(v[1]); rows[i].verified.checked(v[2]); });
    if (saved.start) startSelect.selected(saved.start);
    iowaNote = !!saved.iowa;
  } else {
    clearRows();
    iowaNote = false;
  }
  positionControls();
}

function parseDate(s) {
  const [y, m, d] = (s || '').split('-').map(Number);
  return y ? new Date(y, m - 1, d) : null;
}

function draw() {
  if (roadmapKey() !== loadedKey) loadFromStorage();   // switching colleges loads that college's roadmap
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 480 ? 18 : 22);
  const college = collegeInput.value().trim();
  text('Application Roadmap' + (college ? ': ' + college : ''), 10, 8, canvasWidth - 20);

  const filled = rows.filter(r => r.spec.value().trim()).length;
  const verified = rows.filter(r => r.verified.checked()).length;
  const catchUp = CATCH_UP[startSelect.value()];
  const first = page * perPage(), last = min(STOPS.length, first + perPage());

  // the road: 19 stops in a line (two rows on narrow screens)
  dotRects = [];
  const perRow = canvasWidth < 640 ? 10 : 19;
  const roadW = canvasWidth - 2 * margin - 20;
  for (let r = 0; r < ceil(STOPS.length / perRow); r++) {
    const y = 56 + r * 44;
    stroke('gainsboro');
    strokeWeight(6);
    const n = min(perRow, STOPS.length - r * perRow);
    line(margin + 10, y, margin + 10 + roadW * (n - 1) / (perRow - 1), y);
    strokeWeight(1);
  }
  STOPS.forEach((s, i) => {
    const r = floor(i / perRow), k = i % perRow;
    const x = margin + 10 + roadW * k / (perRow - 1), y = 56 + r * 44;
    const row = rows[i];
    const has = row.spec.value().trim().length > 0;
    const ver = row.verified.checked();
    const onPage = i >= first && i < last;
    stroke(onPage ? 'black' : 'white');
    strokeWeight(onPage ? 2 : 1);
    fill(ver ? 'mediumseagreen' : (has ? 'steelblue' : 'lightgray'));
    circle(x, y, 18);
    strokeWeight(1);
    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(9);
    text(i + 1, x, y);
    if (i < catchUp && !has) { fill('darkorange'); textSize(9); text('catch up', x, y + 16); }
    else if (has && !ver) { fill('darkorange'); textSize(9); text('verify', x, y + 16); }
    dotRects.push({ i, x: x - 10, y: y - 10, w: 20, h: 20 });
  });

  const by = canvasWidth < 640 ? 150 : 102;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(filled + ' of 19 stops filled; ' + verified + ' verified', margin, by);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(11);
  text('Gray = empty · blue = filled · green = verified on the college\'s website. Click a stop to jump to it.' +
       (iowaNote ? ' Iowa: verified for 2026–27; confirm for your year.' : ''), margin, by + 20, canvasWidth * (canvasWidth < 640 ? 1 : 0.55) - margin);

  // mini-calendar of every entered date
  const today = new Date();
  const dated = rows.map((r, i) => ({ i, d: parseDate(r.date.value()) })).filter(o => o.d).sort((a, b) => a.d - b.d);
  const cx = canvasWidth < 640 ? margin : canvasWidth * 0.57, cy = canvasWidth < 640 ? by + 48 : by - 6;
  const cw = canvasWidth < 640 ? canvasWidth - 2 * margin : canvasWidth - cx - margin;
  const chH = drawHeight - cy - 8;
  stroke('silver');
  fill('white');
  rect(cx, cy, cw, chH, 8);
  noStroke();
  fill('black');
  textSize(12);
  textStyle(BOLD);
  text('Dates in order', cx + 8, cy + 5);
  textStyle(NORMAL);
  const maxLines = floor((chH - 24) / 14);
  textSize(11);
  if (!dated.length) { fill('dimgray'); text('Add dates to see them here.', cx + 8, cy + 22); }
  dated.slice(0, maxLines).forEach((o, k) => {
    fill(o.d < today ? 'crimson' : 'black');
    let line = o.d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + STOPS[o.i][0];
    while (textWidth(line) > cw - 16 && line.length > 10) line = line.slice(0, -2);
    text(line, cx + 8, cy + 22 + k * 14);
  });
  if (dated.length > maxLines) { fill('gray'); text('+' + (dated.length - maxLines) + ' more', cx + cw - 60, cy + 5); }
  if (!storageOK) { fill('gray'); textSize(10); textAlign(RIGHT, BOTTOM); text('Not saved in this browser.', canvasWidth - margin, drawHeight - 2); }

  // page label in the control region
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(RIGHT, CENTER);
  text('Stops ' + (first + 1) + '–' + last + ' of 19', canvasWidth - 12, drawHeight + controlHeight - 26);
}

function mousePressed() {
  const d = dotRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (d) { page = floor(d.i / perPage()); positionControls(); }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
