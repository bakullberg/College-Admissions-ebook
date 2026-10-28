// GPA Calculator
// CANVAS_HEIGHT: 586
// Unweighted GPA = Σ(grade points × credits) ÷ Σ(credits), with A=4, B=3, C=2, D=1, F=0.
// The core-only GPA repeats the calculation using only rows marked "Core," the way many
// colleges recalculate. The readouts sit in the drawing area; the course table below is
// the control region. "What moved it?" names the row whose last change shifted the GPA.

let canvasWidth = 400;
let drawHeight = 226;
let controlHeight = 360;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

const MAX_ROWS = 8;
const ROW_H = 31;
const HEADER_H = 26;
const gradePoints = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };

let rows = [];           // { name, grade, credit, core }  (p5 DOM elements)
let rowCount = 0;
let addButton, removeButton, loadButton, mathButton;
let showMath = false;
let moved = null;        // { label, delta }
let lastGPA = null;

const priya = [
  ['AP English Language', 'A', '1.0', true],
  ['Precalculus', 'B', '1.0', true],
  ['AP Chemistry', 'B', '1.0', true],
  ['AP U.S. History', 'A', '1.0', true],
  ['Spanish III', 'A', '1.0', true],
  ['Health', 'A', '0.5', false]
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create all eight rows up front; unused rows are hidden.
  for (let i = 0; i < MAX_ROWS; i++) {
    const name = createInput('');
    name.attribute('placeholder', 'Course name');
    const grade = createSelect();
    ['—', 'A', 'B', 'C', 'D', 'F'].forEach(g => grade.option(g));
    const credit = createSelect();
    ['1.0', '0.5'].forEach(c => credit.option(c));
    const core = createCheckbox('', true);
    const r = { name, grade, credit, core };
    name.input(() => recompute(i));
    grade.changed(() => recompute(i));
    credit.changed(() => recompute(i));
    core.changed(() => recompute(i));
    rows.push(r);
  }

  addButton = createButton('Add course');
  addButton.mousePressed(addRow);
  removeButton = createButton('Remove last');
  removeButton.mousePressed(removeRow);
  loadButton = createButton("Load Priya's year");
  loadButton.mousePressed(loadPriya);
  mathButton = createButton('Show the math');
  mathButton.mousePressed(() => {
    showMath = !showMath;
    mathButton.html(showMath ? 'Hide the math' : 'Show the math');
  });

  loadPriya();
  positionControls();
  describe('A GPA calculator. A table of up to eight courses lets you set each grade, credit value, and whether it is a core course. Two readouts show the unweighted GPA for all courses and the core-only GPA, each with a bar from 0 to 4.');
}

function positionControls() {
  const top = drawHeight + HEADER_H;
  const nameW = constrain(canvasWidth - 250, 110, 300);
  for (let i = 0; i < MAX_ROWS; i++) {
    const r = rows[i];
    const y = top + i * ROW_H;
    r.name.position(10, y);
    r.name.size(nameW);
    r.grade.position(nameW + 22, y);
    r.credit.position(nameW + 80, y);
    r.core.position(nameW + 146, y + 2);
    const visible = i < rowCount;
    [r.name, r.grade, r.credit, r.core].forEach(e => visible ? e.show() : e.hide());
  }
  const by = drawHeight + HEADER_H + MAX_ROWS * ROW_H + 6;
  flowRow([addButton, removeButton, loadButton, mathButton], 10, by, 32);
}

// Place controls left to right using their real widths; wrap when the row is full.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style('white-space', 'nowrap');
    c.position(x, y);
    const w = c.elt.offsetWidth || c.cachedWidth || 100;
    c.cachedWidth = w;
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 8;
  }
}

function addRow() {
  if (rowCount >= MAX_ROWS) return;
  const r = rows[rowCount];
  r.name.value('');
  r.grade.selected('—');
  r.credit.selected('1.0');
  r.core.checked(true);
  rowCount++;
  positionControls();
  recompute(-1);
}

function removeRow() {
  if (rowCount <= 1) return;
  rowCount--;
  positionControls();
  const before = lastGPA;
  recompute(-1);
  if (before !== null && lastGPA !== null) moved = { label: 'Removed the last row', delta: lastGPA - before };
}

function loadPriya() {
  priya.forEach((p, i) => {
    rows[i].name.value(p[0]);
    rows[i].grade.selected(p[1]);
    rows[i].credit.selected(p[2]);
    rows[i].core.checked(p[3]);
  });
  rowCount = priya.length;
  moved = null;
  lastGPA = null;
  positionControls();
  recompute(-1);
}

// Sum points × credits and credits for the visible rows that have a grade
function totals(coreOnly) {
  let pts = 0, cred = 0;
  for (let i = 0; i < rowCount; i++) {
    const g = rows[i].grade.value();
    if (!(g in gradePoints)) continue;
    if (coreOnly && !rows[i].core.checked()) continue;
    const c = parseFloat(rows[i].credit.value());
    pts += gradePoints[g] * c;
    cred += c;
  }
  return { pts, cred, gpa: cred > 0 ? pts / cred : null };
}

function recompute(changedRow) {
  const now = totals(false).gpa;
  if (changedRow >= 0 && lastGPA !== null && now !== null) {
    const r = rows[changedRow];
    const label = (r.name.value() || 'Row ' + (changedRow + 1)) + ' ' + (r.grade.value() in gradePoints ? r.grade.value() : '(no grade)') +
                  ' (' + r.credit.value() + ' credit)';
    moved = { label, delta: now - lastGPA };
  }
  lastGPA = now;
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
  text('GPA Calculator', canvasWidth / 2, 8);

  const all = totals(false), core = totals(true);
  const wide = canvasWidth >= 640;
  const readW = wide ? canvasWidth * 0.6 : canvasWidth - 2 * margin;
  drawReadout(margin, 42, readW, 'Unweighted GPA (all courses)', all);
  drawReadout(margin, 112, readW, 'Core-only GPA', core);

  // "What moved it?" panel
  const px = wide ? margin + readW + 16 : margin;
  const py = wide ? 42 : 180;
  const pw = wide ? canvasWidth - px - margin : canvasWidth - 2 * margin;
  const ph = wide ? 130 : 38;
  stroke('silver');
  fill('white');
  rect(px, py, pw, ph, 8);
  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textSize(wide ? 15 : 13);
  textStyle(BOLD);
  if (wide) text('What moved it?', px + 10, py + 8);
  textStyle(NORMAL);
  textSize(wide ? 14 : 13);
  let msg = 'Change a grade, credit, or core box to see its effect.';
  if (moved && moved.delta !== 0) {
    fill(moved.delta > 0 ? 'seagreen' : 'darkorange');
    msg = moved.label + ': ' + (moved.delta > 0 ? '+' : '') + nf(moved.delta, 1, 2);
  } else {
    fill('dimgray');
  }
  text((wide ? '' : 'What moved it? ') + msg, px + 10, wide ? py + 32 : py + 6, pw - 20, ph - 10);

  if (showMath) {
    noStroke();
    fill('navy');
    textSize(13);
    textAlign(LEFT, TOP);
    const line1 = 'All: ' + nf(all.pts, 1, 1) + ' grade points ÷ ' + nf(all.cred, 1, 1) + ' credits' + (all.gpa !== null ? ' = ' + nf(all.gpa, 1, 2) : '');
    const line2 = 'Core: ' + nf(core.pts, 1, 1) + ' ÷ ' + nf(core.cred, 1, 1) + (core.gpa !== null ? ' = ' + nf(core.gpa, 1, 2) : '');
    if (wide) {
      text(line1, px + 10, py + 74, pw - 20);
      text(line2, px + 10, py + 106, pw - 20);
    } else {
      fill(255, 255, 255, 235);
      rect(margin, 42, canvasWidth - 2 * margin, 36, 6);
      fill('navy');
      text(line1 + '   ' + line2, margin + 6, 45, canvasWidth - 2 * margin - 12);
    }
  }

  // table header in the control region
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, CENTER);
  const nameW = constrain(canvasWidth - 250, 110, 300);
  const hy = drawHeight + HEADER_H / 2;
  text('Course', 12, hy);
  text('Grade', nameW + 22, hy);
  text('Credits', nameW + 80, hy);
  text('Core?', nameW + 146, hy);
  if (rowCount >= MAX_ROWS && canvasWidth >= 500) {
    fill('gray');
    textAlign(RIGHT, CENTER);
    text('8 rows max', canvasWidth - 10, hy);
  }
}

function drawReadout(x, y, w, label, t) {
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  text(label, x, y);
  textAlign(RIGHT, TOP);
  textSize(24);
  textStyle(BOLD);
  fill('navy');
  text(t.gpa === null ? '—' : nf(t.gpa, 1, 2), x + w, y - 4);
  textStyle(NORMAL);

  // bar 0.0 → 4.0
  const by = y + 26, bh = 16;
  fill('gainsboro');
  rect(x, by, w, bh, 4);
  if (t.gpa !== null) {
    fill('steelblue');
    rect(x, by, w * t.gpa / 4, bh, 4);
  }
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, TOP);
  for (let v = 0; v <= 4; v++) {
    const tx = x + w * v / 4;
    textAlign(v === 0 ? LEFT : (v === 4 ? RIGHT : CENTER), TOP);
    text(nf(v, 1, 1), tx, by + bh + 2);
  }
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
