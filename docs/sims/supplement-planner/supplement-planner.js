// Supplement Planner
// CANVAS_HEIGHT: 580
// Enter every supplemental prompt, then view them grouped by type or on a week-by-week calendar.
// Community, Major, and Activity prompts share a core essay: the earliest one is written fresh
// and the rest are adapted. Why Us prompts always need fresh research.
// Writing week = two weeks before the deadline (one week for short answers). Weeks with more
// than three pieces turn orange.
// Hours: fresh essays 3 hours per 250 words; adaptations 1.5 hours; short answers 0.5 hours each.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

const TYPES = ['Why Us', 'Major', 'Community', 'Activity', 'Short answer', 'Optional', 'Other'];
const TYPE_COLORS = { 'Why Us': 'mediumpurple', 'Major': 'steelblue', 'Community': 'seagreen', 'Activity': 'darkorange',
                      'Short answer': 'goldenrod', 'Optional': 'gray', 'Other': 'rosybrown' };
const SHARED = ['Community', 'Major', 'Activity'];
const TIPS = {
  'Why Us': 'Fresh research for every college: two or three details only true of this school, each tied to you.',
  'Major': 'Write one core paragraph on why this field, then adapt it to each prompt\'s length.',
  'Community': 'One core story about a community you belong to, adapted to each prompt.',
  'Activity': 'Pick an activity not covered elsewhere and go deep.',
  'Short answer': 'Brainstorm several in one sitting; be direct and concrete.',
  'Optional': 'Answer real questions; use open boxes only when something needs explaining.',
  'Other': 'Read the prompt closely and decide whether existing material fits.'
};

const PRIYA = [
  ['State flagship', 'Major', 250, '2026-11-15'],
  ['College B', 'Why Us', 250, '2027-01-01'],
  ['College C', 'Why Us', 200, '2026-11-01'],
  ['Northfield College', 'Why Us', 300, '2027-01-01'],
  ['Brookside University', 'Why Us', 150, '2026-11-01'],
  ['Hillcrest College', 'Why Us', 300, '2027-01-15'],
  ['Hillcrest College', 'Community', 250, '2027-01-15'],
  ['Riverton College', 'Major', 200, '2027-01-15'],
  ['Riverton College', 'Short answer', 50, '2027-01-15'],
  ['Riverton College', 'Short answer', 50, '2027-01-15'],
  ['Riverton College', 'Short answer', 50, '2027-01-15'],
  ['College A', 'Activity', 250, '2026-11-01'],
  ['College A', 'Community', 250, '2026-11-01'],
  ['College A', 'Short answer', 100, '2026-11-01'],
  ['College A', 'Short answer', 100, '2026-11-01'],
  ['College A', 'Short answer', 100, '2026-11-01'],
  ['College A', 'Short answer', 100, '2026-11-01'],
  ['College A', 'Short answer', 100, '2026-11-01']
];

const WEEK0 = new Date(2026, 7, 3);   // Monday, August 3
const WEEKS = 27;                     // through the end of January

let collegeInput, typeSelect, wordsInput, dateInput, addButton;
let groupButton, calendarButton, removeButton, priyaButton, clearButton;
let pieces = [];     // { college, type, words, deadline: Date }
let view = 'group';
let selected = -1;
let hits = [];       // hover/click targets { i or list, x, y, w, h }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  collegeInput = createInput('');
  collegeInput.attribute('placeholder', 'College');
  collegeInput.size(130);
  typeSelect = createSelect();
  TYPES.forEach(t => typeSelect.option(t));
  wordsInput = createInput('250', 'number');
  wordsInput.size(60);
  wordsInput.attribute('title', 'Word limit');
  dateInput = createInput('2026-11-01', 'date');
  addButton = createButton('Add prompt');
  addButton.mousePressed(addPiece);

  groupButton = createButton('Group view');
  groupButton.mousePressed(() => { view = 'group'; styleViewButtons(); });
  calendarButton = createButton('Calendar view');
  calendarButton.mousePressed(() => { view = 'calendar'; styleViewButtons(); });
  removeButton = createButton('Remove selected');
  removeButton.mousePressed(() => { if (selected >= 0) { pieces.splice(selected, 1); selected = -1; } });
  priyaButton = createButton("Priya's list");
  priyaButton.mousePressed(loadPriya);
  clearButton = createButton('Clear');
  clearButton.mousePressed(() => { pieces = []; selected = -1; });

  loadPriya();
  styleViewButtons();
  positionControls();
  describe('A supplemental essay planner. Add each prompt with its college, type, word limit, and deadline. A group view sorts prompts by type and marks which can be adapted from a core essay, a calendar view schedules each piece two weeks before its deadline, and totals estimate the hours of work.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([collegeInput, typeSelect, wordsInput, dateInput, addButton], 10, y, 32) + 40;
  flowRow([groupButton, calendarButton, removeButton, priyaButton, clearButton], 10, y, 32);
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

function styleViewButtons() {
  groupButton.style('font-weight', view === 'group' ? 'bold' : 'normal');
  calendarButton.style('font-weight', view === 'calendar' ? 'bold' : 'normal');
}

function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function loadPriya() {
  pieces = PRIYA.map(p => ({ college: p[0], type: p[1], words: p[2], deadline: parseDate(p[3]) }));
  selected = -1;
}

function addPiece() {
  const c = collegeInput.value().trim();
  const d = dateInput.value();
  if (!c || !d) return;
  pieces.push({ college: c, type: typeSelect.value(), words: max(0, parseInt(wordsInput.value()) || 0), deadline: parseDate(d) });
  collegeInput.value('');
}

// Which pieces are core essays and which are adaptations
function roles() {
  const r = pieces.map(() => 'fresh');
  SHARED.forEach(t => {
    const idx = pieces.map((p, i) => i).filter(i => pieces[i].type === t).sort((a, b) => pieces[a].deadline - pieces[b].deadline);
    idx.forEach((i, k) => { r[i] = k === 0 ? (idx.length > 1 ? 'core' : 'fresh') : 'adapt'; });
  });
  pieces.forEach((p, i) => { if (p.type === 'Short answer') r[i] = 'short'; });
  return r;
}

function hoursFor(p, role) {
  if (role === 'short') return 0.5;
  if (role === 'adapt') return 1.5;
  return 3 * p.words / 250;
}

function writingWeek(p) {
  const d = new Date(p.deadline);
  d.setDate(d.getDate() - (p.type === 'Short answer' ? 7 : 14));
  return constrain(floor((d - WEEK0) / (7 * 24 * 3600 * 1000)), 0, WEEKS - 1);
}

function fmtDate(d) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate();
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
  textSize(22);
  text('Supplement Planner', canvasWidth / 2, 8);

  hits = [];
  const r = roles();
  const top = 40, bottom = drawHeight - 64;
  if (view === 'group') {
    if (canvasWidth >= 700) drawGroupColumns(top, bottom, r);
    else drawGroupRows(top, bottom, r);
  } else drawCalendar(top, bottom - 16, r);
  drawTotals(r);
  drawHover(r);
}

function drawGroupColumns(top, bottom, r) {
  const present = TYPES.filter(t => pieces.some(p => p.type === t));
  if (!present.length) { emptyNote(top); return; }
  const colW = (canvasWidth - 2 * margin) / present.length;
  present.forEach((t, c) => {
    const x = margin + c * colW;
    noStroke();
    fill(TYPE_COLORS[t]);
    rect(x + 2, top, colW - 4, 22, 5, 5, 0, 0);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    const n = pieces.filter(p => p.type === t).length;
    text(t + ' (' + n + ')', x + colW / 2, top + 11);
    textStyle(NORMAL);
    let y = top + 26;
    const cardH = 36;
    const cardsHere = pieces.map((p, i) => i).filter(i => pieces[i].type === t).sort((a, b) => pieces[a].deadline - pieces[b].deadline);
    let firstY = null, lastY = null;
    cardsHere.forEach(i => {
      if (y + cardH > bottom) return;
      drawCard(i, x + 4, y, colW - 8, cardH, r[i]);
      if (SHARED.includes(t)) { if (firstY === null) firstY = y + cardH / 2; lastY = y + cardH / 2; }
      y += cardH + 4;
    });
    // thin line linking cards that share a core essay
    if (SHARED.includes(t) && cardsHere.length > 1 && firstY !== null) {
      stroke(TYPE_COLORS[t]);
      strokeWeight(2);
      line(x + 3, firstY, x + 3, lastY);
      strokeWeight(1);
    }
  });
}

function drawGroupRows(top, bottom, r) {
  const present = TYPES.filter(t => pieces.some(p => p.type === t));
  if (!present.length) { emptyNote(top); return; }
  let y = top;
  present.forEach(t => {
    if (y > bottom - 20) return;
    noStroke();
    fill(TYPE_COLORS[t]);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    const n = pieces.filter(p => p.type === t).length;
    text(t + ' (' + n + ')' + (t === 'Why Us' ? ' · needs fresh research' : (SHARED.includes(t) ? ' · adapt from core' : '')), margin, y);
    textStyle(NORMAL);
    y += 16;
    let x = margin;
    pieces.map((p, i) => i).filter(i => pieces[i].type === t).forEach(i => {
      const p = pieces[i];
      const label = p.college.split(' ').map(w => w.length > 9 ? w.slice(0, 8) + '.' : w).join(' ') + ' ' + p.words;
      textSize(11);
      const w = textWidth(label) + 12;
      if (x + w > canvasWidth - margin) { x = margin; y += 20; }
      if (y > bottom - 18) return;
      stroke(i === selected ? 'goldenrod' : TYPE_COLORS[t]);
      strokeWeight(i === selected ? 2 : 1);
      fill(r[i] === 'adapt' ? 'whitesmoke' : 'white');
      rect(x, y, w, 18, 9);
      strokeWeight(1);
      noStroke();
      fill('black');
      textAlign(LEFT, CENTER);
      text(label, x + 6, y + 9);
      hits.push({ i, x, y, w, h: 18 });
      x += w + 4;
    });
    y += 26;
  });
}

function drawCard(i, x, y, w, h, role) {
  const p = pieces[i];
  stroke(i === selected ? 'goldenrod' : 'gainsboro');
  strokeWeight(i === selected ? 2.5 : 1);
  fill(role === 'adapt' ? 'whitesmoke' : 'white');
  rect(x, y, w, h, 5);
  strokeWeight(1);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  let name = p.college;
  while (textWidth(name) > w - 10 && name.length > 4) name = name.slice(0, -2);
  if (name !== p.college) name += '…';
  text(name, x + 5, y + 3);
  textStyle(NORMAL);
  fill('dimgray');
  const tag = p.type === 'Why Us' ? 'fresh research' : (role === 'adapt' ? 'adapt from core' : (role === 'core' ? 'core essay' : ''));
  const base = p.words + ' w · ' + fmtDate(p.deadline);
  const full = tag ? base + ' · ' + tag : base;
  text(textWidth(full) <= w - 10 ? full : base, x + 5, y + 19);
  hits.push({ i, x, y, w, h });
}

function drawCalendar(top, bottom, r) {
  const x0 = margin + 4, w = canvasWidth - 2 * margin - 8;
  const colW = w / WEEKS;
  const weeks = Array.from({ length: WEEKS }, () => []);
  // core essays first within a week so they're scheduled before adaptations
  const order = pieces.map((p, i) => i).sort((a, b) => (r[a] === 'core' ? -1 : 0) - (r[b] === 'core' ? -1 : 0));
  order.forEach(i => weeks[writingWeek(pieces[i])].push(i));
  // month labels
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, TOP);
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  months.forEach((m, k) => {
    const d = new Date(2026, 7 + k, 1);
    const wk = floor((d - WEEK0) / (7 * 24 * 3600 * 1000));
    const x = x0 + max(0, wk) * colW;
    stroke('gainsboro');
    line(x, top + 14, x, bottom);
    noStroke();
    text(m, x + 2, top);
  });
  const sq = min(colW - 3, 16);
  weeks.forEach((list, k) => {
    const x = x0 + k * colW;
    if (list.length > 3) {
      noStroke();
      fill(255, 165, 0, 60);
      rect(x, top + 16, colW, bottom - top - 16);
    }
    list.forEach((i, n) => {
      const y = bottom - (n + 1) * (sq + 2);
      if (y < top + 18) return;
      stroke(i === selected ? 'black' : 'white');
      fill(TYPE_COLORS[pieces[i].type]);
      rect(x + (colW - sq) / 2, y, sq, sq, 3);
      hits.push({ i, x: x + (colW - sq) / 2, y, w: sq, h: sq });
    });
    if (list.length) {
      noStroke();
      fill(list.length > 3 ? 'darkorange' : 'black');
      textAlign(CENTER, TOP);
      textSize(10);
      text(list.length, x + colW / 2, bottom + 2);
    }
  });
  // legend
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  let lx = x0;
  TYPES.filter(t => pieces.some(p => p.type === t)).forEach(t => {
    fill(TYPE_COLORS[t]);
    rect(lx, top + 18, 10, 10, 2);
    fill('black');
    text(t, lx + 13, top + 17);
    lx += textWidth(t) + 26;
  });
}

function emptyNote(top) {
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(15);
  text('Add your supplemental prompts below, or load Priya\'s list.', margin + 6, top + 10, canvasWidth - 2 * margin);
}

function drawTotals(r) {
  const y = drawHeight - 56;
  stroke('silver');
  fill('white');
  rect(margin, y, canvasWidth - 2 * margin, 48, 8);
  noStroke();
  const words = pieces.reduce((s, p) => s + p.words, 0);
  const cores = r.filter((x, i) => (x === 'core' || x === 'fresh') && pieces[i].type !== 'Short answer').length;
  const adapts = r.filter(x => x === 'adapt').length;
  const hours = pieces.reduce((s, p, i) => s + hoursFor(p, r[i]), 0);
  fill('black');
  textAlign(LEFT, TOP);
  textSize(canvasWidth < 560 ? 12 : 14);
  text(pieces.length + ' pieces · ' + words.toLocaleString('en-US') + ' words · ' + cores + ' essays to write fresh · ' + adapts + ' adaptations · about ' + round(hours) + ' hours of writing',
       margin + 10, y + 6, canvasWidth - 2 * margin - 20);
  if (canvasWidth >= 560) {
    fill('gray');
    textSize(10);
    text('Estimates: fresh essays 3 hrs per 250 words · adaptations 1.5 hrs · short answers 0.5 hr', margin + 10, y + 34);
  }
}

function drawHover(r) {
  const h = hits.find(t => mouseX > t.x && mouseX < t.x + t.w && mouseY > t.y && mouseY < t.y + t.h);
  if (!h) return;
  const p = pieces[h.i];
  const lines = [p.college + ' · ' + p.type, p.words + ' words · due ' + fmtDate(p.deadline) + ' · write the week of ' + fmtDate(new Date(WEEK0.getTime() + writingWeek(p) * 7 * 86400000)),
                 (r[h.i] === 'adapt' ? 'Adapt from your core essay. ' : (r[h.i] === 'core' ? 'Core essay: write this one first. ' : '')) + TIPS[p.type]];
  textSize(12);
  const tw = min(320, canvasWidth - 20);
  const tx = constrain(mouseX + 10, 6, canvasWidth - tw - 6);
  const ty = constrain(mouseY + 12, 6, drawHeight - 86);
  stroke('gray');
  fill('lightyellow');
  rect(tx, ty, tw, 76, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text(lines[0], tx + 8, ty + 5, tw - 16);
  textStyle(NORMAL);
  text(lines[1], tx + 8, ty + 21, tw - 16);
  fill('navy');
  text(lines[2], tx + 8, ty + 37, tw - 16, 36);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const h = hits.find(t => mouseX > t.x && mouseX < t.x + t.w && mouseY > t.y && mouseY < t.y + t.h);
  if (h) selected = h.i;
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
