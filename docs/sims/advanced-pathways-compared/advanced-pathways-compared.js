// Advanced Pathways Compared: AP, IB, and Dual Enrollment
// CANVAS_HEIGHT: 630
// Three columns (pathways) by seven rows (dimensions). Click a cell for a fuller explanation,
// click a column header for a summary, or answer the three "Which fits me?" questions to
// highlight the best-matching pathway. Narrow screens show one pathway at a time as tabs.

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

const PATHS = [
  { name: 'Advanced Placement', short: 'AP', color: 'steelblue', tint: 'aliceblue',
    summary: 'AP lets you pick individual college-level courses one at a time. Each course ends with an optional May exam scored 1–5, and colleges set their own rules for which scores earn credit.' },
  { name: 'International Baccalaureate', short: 'IB', color: 'teal', tint: 'azure',
    summary: 'The IB Diploma is a connected two-year program of six subjects plus a core (an Extended Essay, a Theory of Knowledge course, and service). You can also take individual IB courses.' },
  { name: 'Dual Enrollment', short: 'DE', color: 'rebeccapurple', tint: 'lavender',
    summary: 'Dual enrollment means taking real college courses while in high school, through a partner college. The grade goes on a permanent college transcript as well as your high school record.' }
];

const ROWS = ['How you sign up', 'Commitment', 'How it\'s assessed', 'Shows on', 'College credit', 'Best when', 'Watch out for'];

// cells[row][path] = [short text, fuller explanation]
const CELLS = [
  [['Pick individual courses', 'You choose AP courses one by one, usually with a teacher or counselor\'s approval. You can take as many or as few as fit your schedule.'],
   ['Choose the full program (or single courses) by end of 10th grade', 'The full Diploma is a two-year commitment you make before junior year. Many schools also let students take individual IB courses without the Diploma.'],
   ['Enroll through a partner college', 'Your school or state partners with a community college or university. There are often eligibility rules, such as a minimum GPA or placement test.']],
  [['One course at a time', 'Each AP course stands on its own. Dropping one doesn\'t affect the others.'],
   ['A two-year connected program', 'Diploma courses and the core are designed to work together over two years, and it\'s hard to leave partway through.'],
   ['One college course at a time, on the college\'s calendar', 'College terms, class times, and holidays may not match your high school\'s, so check the schedule carefully.']],
  [['Class grade plus an optional May exam scored 1–5', 'Your teacher grades the class. The AP exam is separate, scored 1 (lowest) to 5 (highest), and you decide whether to report it.'],
   ['Exams and coursework scored 1–7; Diploma out of 45', 'Each IB subject is scored 1–7 from external exams and internal coursework. The full Diploma is scored out of 45, including up to 3 points from the core.'],
   ['A college course grade', 'You earn a regular college grade, just as a college student would.']],
  [['Your high school transcript', 'AP courses appear on your high school transcript, usually labeled "AP."'],
   ['High school transcript plus predicted grades', 'IB teachers often submit predicted IB grades, which some colleges, especially outside the U.S., use in admission.'],
   ['Your high school transcript and a separate college transcript', 'The course appears on both. You\'ll send the college transcript when colleges ask for it.']],
  [['By exam score, set by each college', 'A 4 or 5 often earns credit or placement, but each college decides. Some give none.'],
   ['Usually for Higher Level scores, set by each college', 'Many colleges give credit for Higher Level scores of 5 or above; Standard Level credit is less common.'],
   ['By course transfer, set by each college', 'Credit usually transfers well within your state\'s public colleges. Private and out-of-state colleges vary.']],
  [['Your school offers the subjects you want', 'AP is the most widely available pathway and the easiest to tailor subject by subject.'],
   ['You want an integrated, writing-heavy program and can commit early', 'Students who love writing, research, and connections across subjects often thrive in the Diploma.'],
   ['Your school has run out of advanced options', 'When you\'ve taken every advanced course your school offers in a subject, a college course continues your sequence.']],
  [['Exams cost fees', 'Each AP exam has a fee. Ask your counselor about fee reductions if cost is a barrier.'],
   ['The core adds real hours', 'The Extended Essay, Theory of Knowledge, and service hours sit on top of six demanding courses.'],
   ['Grades are permanent on a college transcript', 'A poor dual-enrollment grade follows you into college and can affect future GPA and aid.']]
];

let q1, q2, q3, l1, l2, l3, fitLabel;
let tabButtons = [];
let activeTab = 0;
let selectedCell = null;   // { r, p }
let selectedPath = -1;
let fit = { path: -1, reason: '' };
let cellRects = [], headRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  fitLabel = createSpan('Which fits me?');
  fitLabel.style('font-weight', 'bold');
  const sel = (opts) => { const s = createSelect(); opts.forEach(o => s.option(o)); s.changed(computeFit); return s; };
  l1 = createSpan('Does your school offer IB?'); q1 = sel(['—', 'Yes', 'No', 'Not sure']);
  l2 = createSpan('Run out of advanced courses in a subject?'); q2 = sel(['—', 'Yes', 'No']);
  l3 = createSpan('Want a connected two-year program?'); q3 = sel(['—', 'Yes', 'No', 'Not sure']);
  [fitLabel, l1, l2, l3].forEach(s => s.style('font-size', '14px'));
  PATHS.forEach((p, i) => {
    const b = createButton(p.short);
    b.mousePressed(() => { activeTab = i; selectedPath = i; selectedCell = null; });
    tabButtons.push(b);
  });

  positionControls();
  describe('A comparison of Advanced Placement, International Baccalaureate, and dual enrollment across seven dimensions: how you sign up, commitment, assessment, where it shows, college credit, when it is best, and what to watch out for. Click a cell for details, and answer three questions to see which pathway fits you.');
}

function isNarrow() {
  return canvasWidth < 640;
}

function positionControls() {
  let y = drawHeight + 8;
  if (isNarrow()) {
    // built-in buttons switch the pathway tab on narrow screens
    tabButtons.forEach(b => b.show());
    flowRow([createSpanOnce('Show:'), ...tabButtons], 10, y, 28);
    y += 32;
  } else {
    tabButtons.forEach(b => b.hide());
    if (showLabel) showLabel.hide();
  }
  y = flowRow([fitLabel, l1, q1], 10, y, 28) + 30;
  y = flowRow([l2, q2], 10, y, 28) + 30;
  y = flowRow([l3, q3], 10, y, 28);
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

let showLabel = null;
function createSpanOnce(t) {
  if (!showLabel) { showLabel = createSpan(t); showLabel.style('font-size', '14px'); }
  showLabel.show();
  return showLabel;
}

function computeFit() {
  const a = q1.value(), b = q2.value(), c = q3.value();
  if (a === '—' && b === '—' && c === '—') { fit = { path: -1, reason: '' }; return; }
  if (b === 'Yes') {
    fit = { path: 2, reason: 'You\'ve run out of advanced courses in a subject, so a college course continues your sequence.' };
  } else if (a === 'Yes' && c === 'Yes') {
    fit = { path: 1, reason: 'Your school offers IB and you want a connected two-year program, which is what the Diploma is.' };
  } else if (a === 'Yes') {
    fit = { path: 0, reason: 'You prefer flexibility, so AP courses (or individual IB courses) let you choose subject by subject.' };
  } else {
    fit = { path: 0, reason: a === 'No' && c === 'Yes'
      ? 'Your school doesn\'t offer IB, so AP courses in the subjects you love are the closest way to build a connected program.'
      : 'AP lets you add college-level courses one at a time in the subjects your school offers.' };
  }
  if (isNarrow() && fit.path >= 0) activeTab = fit.path;
}

function draw() {
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 440 ? 18 : 22);
  text('AP, IB, and Dual Enrollment Compared', canvasWidth / 2, 8);

  cellRects = [];
  headRects = [];
  if (isNarrow()) drawTabs();
  else drawTable();
  drawInfo();
}

function drawIcon(i, x, y, col) {
  noStroke();
  fill(col);
  if (i === 0) {           // a single book
    rect(x - 9, y - 11, 18, 22, 2);
    fill('white');
    rect(x - 5, y - 7, 10, 2);
  } else if (i === 1) {    // ring of six subjects
    for (let k = 0; k < 6; k++) circle(x + cos(k * TWO_PI / 6) * 9, y + sin(k * TWO_PI / 6) * 9, 7);
  } else {                 // a college building
    triangle(x - 12, y - 4, x, y - 12, x + 12, y - 4);
    rect(x - 10, y - 3, 20, 13);
    fill('white');
    for (let k = -6; k <= 6; k += 6) rect(x + k - 1, y, 2, 8);
  }
}

function drawTable() {
  const labelW = 120, top = 40, headH = 44;
  const colW = (canvasWidth - labelW - 2 * margin) / 3;
  const rowH = 46;
  PATHS.forEach((p, i) => {
    const x = margin + labelW + i * colW;
    const hl = fit.path === i;
    noStroke();
    fill(hl ? 'gold' : p.color);
    rect(x + 2, top, colW - 4, headH, 6, 6, 0, 0);
    drawIcon(i, x + 22, top + headH / 2, hl ? p.color : 'white');
    fill(hl ? 'black' : 'white');
    textAlign(LEFT, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(p.name, x + 40, top, colW - 44, headH);
    textStyle(NORMAL);
    headRects.push({ p: i, x: x + 2, y: top, w: colW - 4, h: headH });
  });
  ROWS.forEach((r, ri) => {
    const y = top + headH + 2 + ri * rowH;
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(13);
    textStyle(BOLD);
    text(r, margin + 2, y, labelW - 8, rowH);
    textStyle(NORMAL);
    PATHS.forEach((p, i) => {
      const x = margin + labelW + i * colW;
      const sel = selectedCell && selectedCell.r === ri && selectedCell.p === i;
      const colSel = selectedPath === i || fit.path === i;
      stroke(sel ? 'goldenrod' : 'white');
      strokeWeight(sel ? 3 : 1);
      fill(colSel ? 'lightyellow' : p.tint);
      rect(x + 2, y + 1, colW - 4, rowH - 2);
      strokeWeight(1);
      noStroke();
      fill('black');
      textAlign(LEFT, CENTER);
      textSize(12);
      text(CELLS[ri][i][0], x + 8, y + 2, colW - 14, rowH - 4);
      cellRects.push({ r: ri, p: i, x: x + 2, y, w: colW - 4, h: rowH });
    });
  });
}

function drawTabs() {
  const top = 40, tabH = 30;
  // tab strip drawn on canvas; the tab buttons in the control area do the same thing
  const tw = (canvasWidth - 2 * margin) / 3;
  PATHS.forEach((p, i) => {
    const x = margin + i * tw;
    noStroke();
    fill(i === activeTab ? p.color : 'gainsboro');
    rect(x + 1, top, tw - 2, tabH, 6, 6, 0, 0);
    fill(i === activeTab ? 'white' : 'black');
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(p.short + (fit.path === i ? ' ★' : ''), x + tw / 2, top + tabH / 2);
    textStyle(NORMAL);
  });
  const p = PATHS[activeTab];
  const y0 = top + tabH;
  const rowH = 40;
  noStroke();
  fill(p.tint);
  rect(margin, y0, canvasWidth - 2 * margin, ROWS.length * rowH + 4);
  ROWS.forEach((r, ri) => {
    const y = y0 + 2 + ri * rowH;
    const sel = selectedCell && selectedCell.r === ri && selectedCell.p === activeTab;
    stroke(sel ? 'goldenrod' : 'white');
    strokeWeight(sel ? 3 : 1);
    fill('white');
    rect(margin + 4, y, canvasWidth - 2 * margin - 8, rowH - 3, 4);
    strokeWeight(1);
    noStroke();
    fill(p.color);
    textAlign(LEFT, TOP);
    textSize(11);
    textStyle(BOLD);
    text(r, margin + 10, y + 3);
    textStyle(NORMAL);
    fill('black');
    textSize(12);
    text(CELLS[ri][activeTab][0], margin + 10, y + 17, canvasWidth - 2 * margin - 20, rowH - 18);
    cellRects.push({ r: ri, p: activeTab, x: margin + 4, y, w: canvasWidth - 2 * margin - 8, h: rowH - 3 });
  });
}

function drawInfo() {
  const y = isNarrow() ? 40 + 30 + ROWS.length * 40 + 12 : 40 + 44 + 2 + ROWS.length * 46 + 8;
  const x = margin, w = canvasWidth - 2 * margin, h = drawHeight - y - 8;
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  let head = '', body = '';
  if (selectedCell) {
    head = PATHS[selectedCell.p].short + ' · ' + ROWS[selectedCell.r];
    body = CELLS[selectedCell.r][selectedCell.p][1];
  } else if (selectedPath >= 0) {
    head = PATHS[selectedPath].name;
    body = PATHS[selectedPath].summary;
  } else if (fit.path >= 0) {
    head = 'Best match: ' + PATHS[fit.path].name;
    body = fit.reason;
  } else {
    body = 'Click any cell for a fuller explanation, or a column header for a summary. Answer the questions below to see which pathway fits you.';
  }
  if (fit.path >= 0 && (selectedCell || selectedPath >= 0)) body += '  ★ Your best match: ' + PATHS[fit.path].short + '.';
  if (head) {
    fill('darkgoldenrod');
    textStyle(BOLD);
    text(head, x + 8, y + 6, w - 16);
    textStyle(NORMAL);
  }
  fill(head ? 'black' : 'dimgray');
  text(body, x + 8, y + (head ? 24 : 8), w - 16, h - (head ? 28 : 12));
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const hh = headRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (hh) { selectedPath = hh.p; selectedCell = null; return; }
  const c = cellRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (c) { selectedCell = { r: c.r, p: c.p }; selectedPath = -1; }
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
