// Summer Countdown to Move-In
// CANVAS_HEIGHT: 820
// Every task between committing and move-in, in five lanes, placed at its deadline from May 1 to
// move-in day. Unchecked tasks past their date turn red, tasks due within 14 days turn yellow,
// finished tasks turn green. The melt-risk meter counts overdue Money and Records tasks, the
// steps that most often keep admitted students from arriving. Progress is saved in this browser.

let canvasWidth = 400;
let drawHeight = 370;         // recomputed for narrow screens; the canvas height stays fixed
const CANVAS_H = 820;
let canvasHeight = CANVAS_H;
let margin = 12;
let defaultTextSize = 16;

const STORAGE_KEY = 'summer-countdown-v1';
const LANES = ['Housing', 'Orientation and academics', 'Health', 'Money', 'Records'];
const LANE_COLORS = ['steelblue', 'mediumpurple', 'seagreen', 'darkorange', 'sienna'];

const DEFAULT_TASKS = [
  ['Pay enrollment deposit', 3, '2027-05-01'],
  ['Accept aid in the portal', 3, '2027-05-15'],
  ['Housing application', 0, '2027-05-15'],
  ['LLC application', 0, '2027-05-15'],
  ['Orientation registration', 1, '2027-05-30'],
  ['Roommate questionnaire', 0, '2027-06-01'],
  ['Placement tests', 1, '2027-06-10'],
  ['Course registration', 1, '2027-06-18'],
  ['Free AP score send', 4, '2027-06-20'],
  ['Final transcript request', 4, '2027-06-30'],
  ['Immunization records', 2, '2027-07-01'],
  ['Dual-enrollment transcript', 4, '2027-07-15'],
  ['Loan counseling and promissory note', 3, '2027-07-15'],
  ['Health insurance waiver', 2, '2027-08-01'],
  ['Packing list and room dimensions', 0, '2027-08-01'],
  ['Pay first bill', 3, '2027-08-10'],
  ['Move-in day', 0, '2027-08-19']
];
const IOWA_DATES = {
  'Pay enrollment deposit': '2027-05-03', 'Housing application': '2027-05-01', 'Orientation registration': '2027-05-15',
  'Free AP score send': '2027-06-20', 'Move-in day': '2027-08-16'
};

let tasks = [];   // { name, lane, box, dateInput }
let collegeInput, moveInput, todayInput, addName, addLane, addButton, iowaButton, resetButton;
let contactInputs = [], labels = {};
let storageOK = true;
let iowaNote = false;
let chipRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  const lab = (k, t) => { labels[k] = createSpan(t); labels[k].style('font-size', '13px'); return labels[k]; };
  lab('college', 'My college');
  collegeInput = createInput('');
  collegeInput.size(130);
  lab('move', 'Move-in');
  moveInput = createInput('2027-08-19', 'date');
  lab('today', 'Today');
  todayInput = createInput(isoDate(new Date()), 'date');
  todayInput.attribute('title', 'Change this to practice: what if today were in July?');
  addName = createInput('');
  addName.attribute('placeholder', 'New task');
  addName.size(120);
  addLane = createSelect();
  LANES.forEach((l, i) => addLane.option(l, String(i)));
  addButton = createButton('Add task');
  addButton.mousePressed(() => {
    const n = addName.value().trim();
    if (!n) return;
    makeTask(n, int(addLane.value()), todayInput.value(), false);
    addName.value('');
    saveTasks();
    positionControls();
  });
  iowaButton = createButton('Load Iowa example');
  iowaButton.mousePressed(loadIowa);
  resetButton = createButton('Reset');
  resetButton.mousePressed(() => { loadDefaults(); iowaNote = false; saveTasks(); positionControls(); });
  lab('who', 'Who to call:');
  ['First-year office', 'Financial aid office', 'Housing office'].forEach(p => {
    const c = createInput('');
    c.attribute('placeholder', p + ' phone/email');
    c.size(150);
    c.input(saveTasks);
    contactInputs.push(c);
  });
  [collegeInput, moveInput, todayInput].forEach(e => e.input(() => { saveTasks(); }));

  if (!restore()) loadDefaults();
  positionControls();
  describe('A summer countdown from commitment to move-in day. Tasks in five lanes (housing, orientation and academics, health, money, records) appear on a timeline at their deadlines, colored by status. Check off tasks, edit dates, and watch a melt-risk meter that rises with overdue money and records tasks.');
}

function isoDate(d) {
  return d.getFullYear() + '-' + nf(d.getMonth() + 1, 2) + '-' + nf(d.getDate(), 2);
}

function parseDate(s) {
  const [y, m, d] = (s || '').split('-').map(Number);
  return y ? new Date(y, m - 1, d) : null;
}

function makeTask(name, lane, date, done) {
  const box = createCheckbox(' ' + name, done);
  box.style('font-size', '13px');
  box.changed(saveTasks);
  const dateInput = createInput(date, 'date');
  dateInput.style('font-size', '12px');
  dateInput.input(saveTasks);
  tasks.push({ name, lane, box, dateInput });
}

function clearTasks() {
  tasks.forEach(t => { t.box.remove(); t.dateInput.remove(); });
  tasks = [];
}

function loadDefaults() {
  clearTasks();
  DEFAULT_TASKS.forEach(([n, l, d]) => makeTask(n, l, d, false));
  collegeInput.value('');
  moveInput.value('2027-08-19');
}

function loadIowa() {
  loadDefaults();
  collegeInput.value('University of Iowa');
  moveInput.value('2027-08-16');
  tasks.forEach(t => { if (IOWA_DATES[t.name]) t.dateInput.value(IOWA_DATES[t.name]); });
  const mi = tasks.find(t => t.name === 'Move-in day');
  if (mi) { mi.box.elt.querySelector('span').textContent = ' Move-in and On Iowa! week'; mi.name = 'Move-in and On Iowa! week'; }
  iowaNote = true;
  saveTasks();
  positionControls();
}

function saveTasks() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      college: collegeInput.value(), move: moveInput.value(), iowa: iowaNote,
      tasks: tasks.map(t => [t.name, t.lane, t.dateInput.value(), t.box.checked()]),
      contacts: contactInputs.map(c => c.value())
    }));
  } catch (e) { storageOK = false; }
}

function restore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    clearTasks();
    s.tasks.forEach(([n, l, d, done]) => makeTask(n, l, d, done));
    collegeInput.value(s.college || '');
    moveInput.value(s.move || '2027-08-19');
    (s.contacts || []).forEach((v, i) => contactInputs[i] && contactInputs[i].value(v));
    iowaNote = !!s.iowa;
    return true;
  } catch (e) { storageOK = false; return false; }
}

function narrow() {
  return canvasWidth < 720;
}

function positionControls() {
  drawHeight = narrow() ? 190 : 370;
  let y = drawHeight + 8;
  y = flowRow([labels.college, collegeInput, labels.move, moveInput, labels.today, todayInput], 10, y, 30) + 34;
  // task list: two columns on wide screens, one date-sorted column on narrow screens
  const list = narrow() ? tasks.slice().sort((a, b) => (parseDate(a.dateInput.value()) || 0) - (parseDate(b.dateInput.value()) || 0)) : tasks;
  const cols = narrow() ? 1 : 2;
  const colW = (canvasWidth - 20) / cols;
  const rows = ceil(list.length / cols);
  list.forEach((t, i) => {
    const c = narrow() ? 0 : floor(i / rows), r = narrow() ? i : i % rows;
    const x = 10 + c * colW, ty = y + r * (narrow() ? 25 : 26);
    t.dateInput.position(x, ty);
    t.dateInput.size(118);
    t.box.style('white-space', 'nowrap');
    t.box.position(x + 132, ty + 2);
  });
  y += rows * (narrow() ? 25 : 26) + 8;
  contactInputs.forEach(c => c.size(narrow() ? floor((canvasWidth - 40) / 3) : 150));
  y = flowRow([addName, addLane, addButton, iowaButton, resetButton], 10, y, 30) + 34;
  flowRow([labels.who, ...contactInputs], 10, y, 30);
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

function status(t, today) {
  const d = parseDate(t.dateInput.value());
  if (t.box.checked()) return 'done';
  if (!d) return 'later';
  const days = (d - today) / 86400000;
  if (days < 0) return 'overdue';
  if (days <= 14) return 'soon';
  return 'later';
}
const STATUS_COLORS = { done: 'mediumseagreen', overdue: 'crimson', soon: 'gold', later: 'lightsteelblue' };

function draw() {
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);

  const today = parseDate(todayInput.value()) || new Date();
  // color each task's checkbox label by status
  tasks.forEach(t => {
    const s = status(t, today);
    t.box.style('color', s === 'overdue' ? 'crimson' : (s === 'done' ? 'seagreen' : (s === 'soon' ? 'darkgoldenrod' : 'black')));
  });

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(narrow() ? 18 : 22);
  const college = collegeInput.value().trim();
  text('Summer Countdown' + (college ? ': ' + college : ''), 10, 8, canvasWidth - 20);

  const overdue = tasks.filter(t => status(t, today) === 'overdue');
  const meltCount = overdue.filter(t => t.lane >= 3).length;
  chipRects = [];
  if (!narrow()) drawTimeline(today);
  else drawSummary(today);
  drawMelt(meltCount, overdue.length);
  drawChipTip();
}

function drawTimeline(today) {
  const start = new Date(today.getFullYear() + (today.getMonth() > 7 ? 1 : 0), 4, 1);
  const mv = parseDate(moveInput.value()) || new Date(start.getFullYear(), 7, 19);
  const x0 = margin + 150, x1 = canvasWidth - margin - 10;
  const tx = d => map(constrain(d, start, mv), start, mv, x0, x1);
  const top = 46, laneH = 46;
  // month labels
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(CENTER, TOP);
  for (let m = 4; m <= mv.getMonth(); m++) {
    const d = new Date(start.getFullYear(), m, 1);
    stroke('gainsboro');
    line(tx(d), top + 14, tx(d), top + 16 + LANES.length * laneH);
    noStroke();
    text(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][m], tx(d) + 14, top);
  }
  LANES.forEach((l, i) => {
    const y = top + 18 + i * laneH;
    noStroke();
    fill(i % 2 ? color(245, 248, 252) : 'white');
    rect(margin, y, canvasWidth - 2 * margin, laneH - 2, 4);
    fill(LANE_COLORS[i]);
    textAlign(LEFT, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(l, margin + 6, y + laneH / 2, 140);
    textStyle(NORMAL);
    let k = 0;
    tasks.filter(t => t.lane === i).sort((a, b) => (parseDate(a.dateInput.value()) || 0) - (parseDate(b.dateInput.value()) || 0)).forEach(t => {
      const d = parseDate(t.dateInput.value());
      if (!d) return;
      const x = tx(d), cy = y + 12 + (k % 2) * 20;
      const s = status(t, today);
      stroke('white');
      fill(STATUS_COLORS[s]);
      circle(x, cy, 12);
      noStroke();
      fill('black');
      textSize(10);
      textAlign(x > x1 - 80 ? RIGHT : LEFT, CENTER);
      const short = t.name.length > 18 ? t.name.slice(0, 17) + '…' : t.name;
      text(short, x + (x > x1 - 80 ? -9 : 9), cy);
      chipRects.push({ x: x - 7, y: cy - 7, w: 14, h: 14, t, d, s });
      k++;
    });
  });
  // today marker
  if (today >= start && today <= mv) {
    stroke('crimson');
    strokeWeight(2);
    line(tx(today), top + 14, tx(today), top + 18 + LANES.length * laneH);
    strokeWeight(1);
    noStroke();
    fill('crimson');
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text('Today', tx(today), top + 14);
  }
}

function drawSummary(today) {
  const upcoming = tasks.filter(t => !t.box.checked())
    .map(t => ({ t, d: parseDate(t.dateInput.value()) })).filter(o => o.d).sort((a, b) => a.d - b.d).slice(0, 3);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Next up', margin, 38);
  textStyle(NORMAL);
  upcoming.forEach((o, i) => {
    const s = status(o.t, today);
    fill(STATUS_COLORS[s]);
    circle(margin + 6, 62 + i * 18, 10);
    fill('black');
    textSize(12);
    text(o.d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + o.t.name, margin + 16, 55 + i * 18, canvasWidth - 2 * margin - 20);
  });
  if (!upcoming.length) { fill('seagreen'); textSize(12); text('Everything is done. See you on campus!', margin, 56); }
}

function drawMelt(meltCount, overdueCount) {
  const wide = !narrow();
  const x = margin, y = wide ? drawHeight - 64 : drawHeight - 74, w = canvasWidth - 2 * margin;
  const level = meltCount === 0 ? 0 : (meltCount <= 2 ? 1 : 2);
  const names = ['Low', 'Rising', 'High'];
  const cols = ['mediumseagreen', 'gold', 'crimson'];
  stroke('silver');
  fill('white');
  rect(x, y, w, wide ? 56 : 66, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Melt risk: ' + names[level], x + 10, y + 6);
  textStyle(NORMAL);
  for (let k = 0; k < 3; k++) {
    fill(k <= level ? cols[level] : 'gainsboro');
    rect(x + 120 + k * 34, y + 8, 30, 12, 3);
  }
  fill('dimgray');
  textSize(11);
  const meta = overdueCount + ' overdue · ' + meltCount + ' in Money or Records' + (iowaNote ? ' · Iowa dates are for 2026–27; confirm for your year' : '');
  if (wide) text(meta, x + 230, y + 8, w - 240);
  else text(meta, x + 10, y + 24, w - 20);
  fill(level ? 'crimson' : 'dimgray');
  textSize(12);
  text(level ? 'If something is blocking you, contact your college\'s first-year office or financial aid office today.'
             : 'Money and Records tasks are the ones that most often derail enrollment. Keep them on time.', x + 10, y + (wide ? 26 : 38), w - 20, 30);
  if (!storageOK) { fill('gray'); textSize(10); textAlign(RIGHT, BOTTOM); text('Progress won\'t be saved in this browser.', x + w - 6, y + (wide ? 54 : 64)); }
}

function drawChipTip() {
  const h = chipRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (!h) return;
  const s = h.t.name + ' · ' + h.d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
            { done: 'done', overdue: 'overdue', soon: 'due within 14 days', later: 'coming up' }[h.s];
  textSize(12);
  const tw = textWidth(s) + 14;
  const tx = constrain(mouseX - tw / 2, 4, canvasWidth - tw - 4);
  stroke('gray');
  fill('lightyellow');
  rect(tx, h.y - 24, tw, 20, 4);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(s, tx + 7, h.y - 14);
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
