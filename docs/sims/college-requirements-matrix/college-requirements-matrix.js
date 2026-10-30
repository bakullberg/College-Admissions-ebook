// College Requirements Matrix
// CANVAS_HEIGHT: 630
// Rows are colleges, columns are requirement types. Gray = not required, blue = required and
// shared by more than one college on the list, gold = required by only one college (easy to miss).
// Totals and a summary line show the whole list's workload. Emily's data is fictional.

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

const COLS = [
  { key: 'platform', label: 'Platform', tip: 'Common App, the college\'s own application, or either. See Chapter 12.' },
  { key: 'essays', label: 'Supplements', tip: 'Supplemental essays or short answers beyond the main essay. See Chapter 10.' },
  { key: 'recs', label: 'Teacher recs', tip: 'Teacher letters of recommendation required. The same two teachers usually cover every college. See Chapter 11.' },
  { key: 'counselor', label: 'Counselor rec', tip: 'A counselor recommendation and school report. See Chapter 11.' },
  { key: 'testing', label: 'Testing', tip: 'Test-optional: you choose whether to send scores. Required: you must send them. See Chapter 6.' },
  { key: 'interview', label: 'Interview', tip: 'Optional interviews are worth considering; required ones must be scheduled early. See Chapter 13.' },
  { key: 'portfolio', label: 'Portfolio', tip: 'Some art, music, and design programs require a portfolio or audition.' },
  { key: 'special', label: 'Special', tip: 'Anything unusual: a graded paper, a specific course, a program application. Often only on the college\'s own site.' },
  { key: 'fee', label: 'Fee', tip: 'Application fee. Ask your counselor about fee waivers if cost is a barrier.' }
];

const EMILY = [
  ['College A', 'Common App', 3, 2, 'Yes', 'Test-optional', 'Optional', 'None', 'None', 90],
  ['College B', 'Common App', 2, 2, 'Yes', 'Test-optional', 'None', 'None', 'None', 85],
  ['Northfield College', 'Common App', 2, 2, 'Yes', 'Test-optional', 'Optional', 'None', 'None', 75],
  ['College C', 'Common App', 1, 1, 'Yes', 'Test-optional', 'None', 'None', 'None', 70],
  ['Hillcrest College', 'Common App', 1, 2, 'Yes', 'Test-optional', 'None', 'None', 'None', 65],
  ['Brookside University', 'Common App', 1, 2, 'Yes', 'Test-optional', 'None', 'None', 'Graded paper', 60],
  ['Maple State', 'Common App', 0, 1, 'Yes', 'Test-optional', 'None', 'None', 'None', 50],
  ['Riverton College', 'Common App', 2, 2, 'Yes', 'Test-optional', 'None', 'None', 'None', 55],
  ['State flagship', 'Own application', 1, 0, 'No', 'Test-optional', 'None', 'None', 'None', 85],
  ['Regional public university', 'Own application', 0, 0, 'No', 'Test-optional', 'None', 'None', 'None', 40]
];

let rows = [];          // { name, platform, essays, recs, counselor, testing, interview, portfolio, special, fee }
let selected = -1;
let editing = -2;       // -2 not editing, -1 adding, >=0 editing row
let sortKey = null;
let pulseUntil = 0;
let lastUnique = '';
let hoverTip = null;
let headerRects = [], rowRects = [];

let addButton, editButton, removeButton, loadButton, uniqueBox;
let ed = {};            // editor controls
let saveButton, cancelButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  addButton = createButton('Add college');
  addButton.mousePressed(() => openEditor(-1));
  editButton = createButton('Edit selected');
  editButton.mousePressed(() => { if (selected >= 0) openEditor(selected); });
  removeButton = createButton('Remove selected');
  removeButton.mousePressed(() => { if (selected >= 0) { rows.splice(selected, 1); selected = -1; changed(); } });
  loadButton = createButton("Load Emily's list");
  loadButton.mousePressed(loadEmily);
  uniqueBox = createCheckbox(' Highlight unique requirements only', false);

  const sel = opts => { const s = createSelect(); opts.forEach(o => s.option(o)); return s; };
  ed.name = createInput(''); ed.name.attribute('placeholder', 'College name'); ed.name.size(140);
  ed.platform = sel(['Common App', 'Own application', 'Either']);
  ed.essays = sel(['0', '1', '2', '3', '4', '5']);
  ed.recs = sel(['0', '1', '2', '3']);
  ed.counselor = sel(['Yes', 'No']);
  ed.testing = sel(['Test-optional', 'Required', 'Test-blind']);
  ed.interview = sel(['None', 'Optional', 'Required']);
  ed.portfolio = sel(['None', 'Required']);
  ed.special = createInput(''); ed.special.attribute('placeholder', 'Special requirement'); ed.special.size(130);
  ed.fee = createInput('0', 'number'); ed.fee.size(60);
  ed.labels = ['Supplements', 'Teacher recs', 'Counselor', 'Fee $'].map(t => { const s = createSpan(t); s.style('font-size', '13px'); return s; });
  saveButton = createButton('Save');
  saveButton.mousePressed(saveEditor);
  cancelButton = createButton('Cancel');
  cancelButton.mousePressed(() => { editing = -2; positionControls(); });

  loadEmily();
  describe('A requirements matrix for a list of colleges. Rows are colleges and columns are requirements such as platform, supplemental essays, recommendations, testing, interviews, and fees. Gray cells are not required, blue cells are shared requirements, and gold cells are unique to one college. Totals and a summary show the workload.');
}

function editorControls() {
  return [ed.name, ed.platform, ed.labels[0], ed.essays, ed.labels[1], ed.recs, ed.labels[2], ed.counselor,
          ed.testing, ed.interview, ed.portfolio, ed.special, ed.labels[3], ed.fee, saveButton, cancelButton];
}

function positionControls() {
  const main = [addButton, editButton, removeButton, loadButton, uniqueBox];
  let y = drawHeight + 8;
  if (editing > -2) {
    // the editor takes over the control area until Save or Cancel
    main.forEach(c => c.hide());
    editorControls().forEach(c => c.show());
    flowRow(editorControls(), 10, y, 32);
  } else {
    editorControls().forEach(c => c.hide());
    main.forEach(c => c.show());
    flowRow(main, 10, y, 32);
  }
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

function loadEmily() {
  rows = EMILY.map(r => ({ name: r[0], platform: r[1], essays: r[2], recs: r[3], counselor: r[4], testing: r[5],
                           interview: r[6], portfolio: r[7], special: r[8], fee: r[9] }));
  selected = -1;
  sortKey = null;
  editing = -2;
  changed();
  positionControls();
}

function openEditor(i) {
  editing = i;
  const r = i >= 0 ? rows[i] : { name: '', platform: 'Common App', essays: 1, recs: 2, counselor: 'Yes', testing: 'Test-optional',
                                interview: 'None', portfolio: 'None', special: 'None', fee: 50 };
  ed.name.value(r.name);
  ed.platform.selected(r.platform);
  ed.essays.selected(String(r.essays));
  ed.recs.selected(String(r.recs));
  ed.counselor.selected(r.counselor);
  ed.testing.selected(r.testing);
  ed.interview.selected(r.interview);
  ed.portfolio.selected(r.portfolio);
  ed.special.value(r.special === 'None' ? '' : r.special);
  ed.fee.value(r.fee);
  positionControls();
}

function saveEditor() {
  if (rows.length >= 10 && editing === -1) { editing = -2; positionControls(); return; }
  const r = {
    name: ed.name.value().trim() || 'New college', platform: ed.platform.value(), essays: +ed.essays.value(), recs: +ed.recs.value(),
    counselor: ed.counselor.value(), testing: ed.testing.value(), interview: ed.interview.value(), portfolio: ed.portfolio.value(),
    special: ed.special.value().trim() || 'None', fee: max(0, +ed.fee.value() || 0)
  };
  if (editing === -1) rows.push(r); else rows[editing] = r;
  editing = -2;
  changed();
  positionControls();
}

function changed() {
  const now = uniqueCells().join('|');
  if (now !== lastUnique) pulseUntil = millis() + 900;
  lastUnique = now;
}

// Is this cell a requirement (not gray)?
function isRequired(r, key) {
  const v = r[key];
  if (key === 'platform') return true;
  if (key === 'essays' || key === 'recs') return v > 0;
  if (key === 'counselor') return v === 'Yes';
  if (key === 'testing') return v === 'Required';
  if (key === 'interview') return v === 'Required';
  if (key === 'portfolio') return v === 'Required';
  if (key === 'special') return v !== 'None';
  if (key === 'fee') return v > 0;
  return false;
}

// A required cell is unique if no other college on the list shares it
function isUnique(r, key) {
  if (!isRequired(r, key) || rows.length < 2) return false;
  if (key === 'platform') return rows.filter(o => o.platform === r.platform).length === 1;
  if (key === 'special') return true;  // special requirements are always one college's own
  return rows.filter(o => isRequired(o, key)).length === 1;
}

function uniqueCells() {
  const out = [];
  rows.forEach(r => COLS.forEach(c => { if (isUnique(r, c.key)) out.push(r.name + ':' + c.key); }));
  return out;
}

function cellText(r, key) {
  const v = r[key];
  if (key === 'essays') return v === 0 ? 'None' : v + (v === 1 ? ' essay' : ' essays');
  if (key === 'recs') return v === 0 ? 'None' : v + ' letter' + (v === 1 ? '' : 's');
  if (key === 'counselor') return v === 'Yes' ? 'Required' : 'No';
  if (key === 'fee') return v === 0 ? '$0' : '$' + v;
  if (key === 'platform') return v === 'Common App' ? 'Common App' : (v === 'Either' ? 'Either' : 'Own app');
  return v;
}

function sortedIndices() {
  const idx = rows.map((r, i) => i);
  if (!sortKey) return idx;
  return idx.sort((a, b) => {
    const va = rows[a][sortKey], vb = rows[b][sortKey];
    if (typeof va === 'number') return vb - va;
    return String(va).localeCompare(String(vb));
  });
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
  text('College Requirements Matrix', canvasWidth / 2, 8);

  hoverTip = null;
  if (canvasWidth >= 700) drawGrid();
  else drawCards();
  drawSummary();
  if (hoverTip) drawTip(hoverTip);
}

function cellColor(r, key) {
  if (!isRequired(r, key)) return 'gainsboro';
  return isUnique(r, key) ? 'gold' : 'lightsteelblue';
}

function drawGrid() {
  const nameW = 150, top = 40, headH = 34, rowH = 25;
  const colW = (canvasWidth - nameW - margin * 2) / COLS.length;
  headerRects = [];
  rowRects = [];
  const pulse = millis() < pulseUntil;
  const uniqOnly = uniqueBox.checked();

  // headers
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  COLS.forEach((c, i) => {
    const x = margin + nameW + i * colW;
    headerRects.push({ key: c.key, x, y: top, w: colW, h: headH, tip: c.label + ': ' + c.tip });
    fill(sortKey === c.key ? 'gold' : 'white');
    rect(x + 1, top, colW - 2, headH, 4);
    fill('black');
    text(c.label + (sortKey === c.key ? ' ▼' : ''), x + 2, top, colW - 4, headH);
  });
  textStyle(NORMAL);
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(11);
  text('Click a header to sort', margin + 2, top + headH / 2);

  sortedIndices().forEach((ri, k) => {
    const r = rows[ri];
    const y = top + headH + 4 + k * rowH;
    rowRects.push({ ri, x: margin, y, w: canvasWidth - 2 * margin, h: rowH - 2 });
    if (ri === selected) {
      stroke('goldenrod');
      strokeWeight(2);
      noFill();
      rect(margin - 2, y - 1, canvasWidth - 2 * margin + 4, rowH, 4);
      strokeWeight(1);
    }
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(12);
    text(r.name, margin + 4, y + rowH / 2 - 1);
    COLS.forEach((c, i) => {
      const x = margin + nameW + i * colW;
      const uniq = isUnique(r, c.key);
      let col = color(cellColor(r, c.key));
      if (uniqOnly && !uniq) col.setAlpha(60);
      fill(col);
      if (uniq && pulse) { stroke('darkorange'); strokeWeight(2); } else noStroke();
      rect(x + 1, y, colW - 2, rowH - 2, 3);
      strokeWeight(1);
      noStroke();
      fill(uniqOnly && !uniq ? 'darkgray' : 'black');
      textAlign(CENTER, CENTER);
      fitText(cellText(r, c.key), x + colW / 2, y + rowH / 2 - 1, colW - 6, 11);
      if (mouseX > x && mouseX < x + colW && mouseY > y && mouseY < y + rowH) {
        hoverTip = c.label + ' — ' + cellText(r, c.key) + (uniq ? ' (unique to this college!)' : '') + '. ' + c.tip;
      }
    });
  });

  // totals row
  const ty = top + headH + 6 + rows.length * rowH;
  noStroke();
  fill('navy');
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Totals', margin + 4, ty + 11);
  const tot = totals();
  COLS.forEach((c, i) => {
    const x = margin + nameW + i * colW;
    textAlign(CENTER, CENTER);
    text(tot[c.key], x + 2, ty + 11);
  });
  textStyle(NORMAL);

  headerRects.forEach(h => { if (mouseX > h.x && mouseX < h.x + h.w && mouseY > h.y && mouseY < h.y + h.h) hoverTip = h.tip; });
}

function drawCards() {
  rowRects = [];
  headerRects = [];
  const top = 38, cardH = 32;
  const uniqOnly = uniqueBox.checked();
  sortedIndices().forEach((ri, k) => {
    const r = rows[ri];
    const y = top + k * (cardH + 2);
    rowRects.push({ ri, x: margin, y, w: canvasWidth - 2 * margin, h: cardH });
    stroke(ri === selected ? 'goldenrod' : 'gainsboro');
    strokeWeight(ri === selected ? 2 : 1);
    fill('white');
    rect(margin, y, canvasWidth - 2 * margin, cardH, 5);
    strokeWeight(1);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text(r.name, margin + 6, y + 2);
    textStyle(NORMAL);
    // chips for required items only
    let cx = margin + 6, cy = y + 17;
    textSize(10);
    COLS.forEach(c => {
      if (!isRequired(r, c.key)) return;
      const uniq = isUnique(r, c.key);
      if (uniqOnly && !uniq) return;
      const label = cellText(r, c.key);
      const w = textWidth(label) + 10;
      if (cx + w > canvasWidth - margin - 4) return;
      fill(uniq ? 'gold' : 'lightsteelblue');
      rect(cx, cy, w, 14, 7);
      fill('black');
      textAlign(LEFT, CENTER);
      text(label, cx + 5, cy + 7);
      cx += w + 4;
    });
  });
}

// Draw one line of text centered at (x, y), shrinking the size until it fits maxW
function fitText(s, x, y, maxW, size) {
  textSize(size);
  while (textWidth(s) > maxW && size > 8) textSize(--size);
  text(s, x, y);
}

function totals() {
  const sum = k => rows.reduce((s, r) => s + r[k], 0);
  const count = k => rows.filter(r => isRequired(r, k)).length;
  return {
    platform: rows.filter(r => r.platform !== 'Own application').length + ' CA',
    essays: sum('essays'), recs: sum('recs'), counselor: count('counselor'),
    testing: count('testing') + ' req.', interview: count('interview') + ' req.', portfolio: count('portfolio'),
    special: count('special'), fee: '$' + sum('fee')
  };
}

function drawSummary() {
  const y = drawHeight - 52;
  stroke('silver');
  fill('white');
  rect(margin, y, canvasWidth - 2 * margin, 44, 8);
  noStroke();
  const essays = rows.reduce((s, r) => s + r.essays, 0);
  const maxRecs = rows.reduce((m, r) => max(m, r.recs), 0);
  const uniq = uniqueCells().length;
  fill('black');
  textAlign(LEFT, TOP);
  textSize(canvasWidth < 500 ? 12 : 14);
  text('Your list requires ' + essays + ' supplemental essays and up to ' + maxRecs + ' teacher letters per college. ' +
       uniq + ' requirement' + (uniq === 1 ? ' is' : 's are') + ' unique to one college' + (uniq ? ' (gold) — don\'t miss ' + (uniq === 1 ? 'it' : 'them') : '') + '.',
       margin + 8, y + 5, canvasWidth - 2 * margin - 16, 38);
}

function drawTip(s) {
  textSize(12);
  const tw = min(300, textWidth(s) + 16);
  const lines = ceil(textWidth(s) / (tw - 16)) + 1;
  const th = lines * 15 + 6;
  const tx = constrain(mouseX + 12, 4, canvasWidth - tw - 4);
  const ty = constrain(mouseY + 12, 4, drawHeight - th - 4);
  stroke('gray');
  fill('lightyellow');
  rect(tx, ty, tw, th, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  text(s, tx + 8, ty + 4, tw - 16, th - 6);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const h = headerRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (h) { sortKey = sortKey === h.key ? null : h.key; return; }
  const r = rowRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (r) selected = r.ri;
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
