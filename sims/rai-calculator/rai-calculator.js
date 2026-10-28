// Regent Admission Index (RAI) Calculator
// CANVAS_HEIGHT: 500
// RAI = (3 × ACT composite) + (30 × cumulative GPA) + (5 × years of core courses)
// Thresholds for Iowa's College of Liberal Arts and Sciences in recent cycles:
// 245 for Iowa residents, 255 for nonresidents. Confirm current figures at admissions.uiowa.edu.

let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 18;
let sliderLeftMargin = 230;
let defaultTextSize = 16;

let gpaSlider, actSlider, coreSlider;
let residencySelect, casey24Button, casey22Button, formulaButton;
let showFormula = false;

const RESIDENT = 245, NONRESIDENT = 255;
const SCALE_MAX = 340;   // the largest possible RAI is 3×36 + 30×4 + 5×22 = 338

let segments = [];       // hit-test rectangles for the bar

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  gpaSlider = createSlider(2.0, 4.0, 3.4, 0.01);
  actSlider = createSlider(12, 36, 24, 1);
  coreSlider = createSlider(10, 22, 17, 0.5);

  residencySelect = createSelect();
  residencySelect.option('Iowa resident');
  residencySelect.option('Nonresident');
  casey24Button = createButton('Casey (ACT 24)');
  casey24Button.mousePressed(() => setInputs(3.40, 24, 17));
  casey22Button = createButton('Casey (ACT 22)');
  casey22Button.mousePressed(() => setInputs(3.40, 22, 17));
  formulaButton = createButton('Show formula');
  formulaButton.mousePressed(() => {
    showFormula = !showFormula;
    formulaButton.html(showFormula ? 'Hide formula' : 'Show formula');
  });

  positionControls();
  describe('A Regent Admission Index calculator. Sliders set GPA, ACT composite, and years of core courses. A stacked bar shows the index split into ACT, GPA, and core-course points, with threshold lines at 245 for residents and 255 for nonresidents, and status lines say how far above or below each threshold the score is.');
}

function positionControls() {
  const w = canvasWidth - sliderLeftMargin - margin;
  gpaSlider.position(sliderLeftMargin, drawHeight + 8);
  gpaSlider.size(w);
  actSlider.position(sliderLeftMargin, drawHeight + 40);
  actSlider.size(w);
  coreSlider.position(sliderLeftMargin, drawHeight + 72);
  coreSlider.size(w);
  flowRow([residencySelect, casey24Button, casey22Button, formulaButton], 10, drawHeight + 108, 30);
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

function setInputs(gpa, act, core) {
  gpaSlider.value(gpa);
  actSlider.value(act);
  coreSlider.value(core);
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
  text('Regent Admission Index Calculator', canvasWidth / 2, 8);

  const gpa = gpaSlider.value(), act = actSlider.value(), core = coreSlider.value();
  const actPts = 3 * act, gpaPts = 30 * gpa, corePts = 5 * core;
  const rai = actPts + gpaPts + corePts;
  const resident = residencySelect.value() === 'Iowa resident';

  // total
  textSize(15);
  fill('dimgray');
  text('Your RAI', canvasWidth / 2, 40);
  textSize(42);
  textStyle(BOLD);
  fill('navy');
  text(fmt(rai), canvasWidth / 2, 58);
  textStyle(NORMAL);

  // stacked bar
  const bx = margin, bw = canvasWidth - 2 * margin, by = 132, bh = 40;
  const px = v => bx + bw * v / SCALE_MAX;
  const parts = [
    { name: 'ACT × 3', value: actPts, color: 'mediumpurple', tip: '+1 ACT point adds 3 RAI points' },
    { name: 'GPA × 30', value: gpaPts, color: 'royalblue', tip: '+0.1 GPA adds 3 RAI points' },
    { name: 'Core × 5', value: corePts, color: 'teal', tip: '+1 year of core courses adds 5 RAI points' }
  ];
  stroke('silver');
  fill('white');
  rect(bx, by, bw, bh, 4);
  segments = [];
  let start = 0;
  parts.forEach(p => {
    const x1 = px(start), x2 = px(start + p.value);
    noStroke();
    fill(p.color);
    rect(x1, by, x2 - x1, bh);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(canvasWidth < 500 ? 11 : 13);
    if (x2 - x1 > 50) text(p.name + '\n' + fmt(p.value), (x1 + x2) / 2, by + bh / 2);
    segments.push({ x: x1, w: x2 - x1, part: p });
    start += p.value;
  });

  // threshold lines
  [[RESIDENT, 'Resident 245', resident], [NONRESIDENT, 'Nonresident 255', !resident]].forEach(([v, label, active], k) => {
    const x = px(v);
    stroke(active ? 'goldenrod' : 'dimgray');
    strokeWeight(active ? 3 : 1.5);
    line(x, by - 10, x, by + bh + 10);
    strokeWeight(1);
    noStroke();
    fill(active ? 'darkgoldenrod' : 'dimgray');
    textSize(12);
    textStyle(active ? BOLD : NORMAL);
    textAlign(k === 0 ? RIGHT : LEFT, TOP);
    text(label, x + (k === 0 ? -4 : 4), by + bh + 8);
    textStyle(NORMAL);
  });
  // scale ticks
  fill('gray');
  textSize(11);
  textAlign(CENTER, BOTTOM);
  [0, 100, 200, 300].forEach(v => text(v, px(v), by - 2));

  // status lines
  const sy = by + bh + 32;
  textAlign(LEFT, TOP);
  textSize(15);
  [[RESIDENT, 'resident', resident], [NONRESIDENT, 'nonresident', !resident]].forEach(([v, who, active], k) => {
    const diff = round((rai - v) * 10) / 10;
    const clears = diff >= 0;
    fill(clears ? 'seagreen' : 'firebrick');
    textStyle(active ? BOLD : NORMAL);
    const msg = clears ? 'Clears ' + who + ' minimum by ' + diff : 'Below ' + who + ' minimum by ' + abs(diff);
    text((clears ? '✓ ' : '✗ ') + msg, margin, sy + k * 22);
    textStyle(NORMAL);
  });

  // hover help or formula
  let ly = sy + 50;
  const hovered = segments.find(s => mouseY > by && mouseY < by + bh && mouseX > s.x && mouseX < s.x + s.w);
  if (hovered) {
    fill('navy');
    textSize(14);
    text(hovered.part.name + ': ' + hovered.part.tip + '.', margin, ly, canvasWidth - 2 * margin);
  } else if (showFormula) {
    fill('navy');
    textSize(14);
    text('(3 × ' + act + ') + (30 × ' + nf(gpa, 1, 2) + ') + (5 × ' + fmt(core) + ') = ' +
         fmt(actPts) + ' + ' + fmt(gpaPts) + ' + ' + fmt(corePts) + ' = ' + fmt(rai),
         margin, ly, canvasWidth - 2 * margin);
  } else {
    fill('dimgray');
    textSize(13);
    text('Hover over a bar segment to see which input moves the score most.', margin, ly, canvasWidth - 2 * margin);
  }

  // caveats
  fill('dimgray');
  textSize(11);
  text('Thresholds are for the College of Liberal Arts and Sciences in recent cycles and can change; some colleges within the university set higher minimums. Applicants without a test score are reviewed individually instead of by formula. Confirm at admissions.uiowa.edu.',
       margin, drawHeight - 46, canvasWidth - 2 * margin, 44);

  // slider labels
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Cumulative GPA: ' + nf(gpa, 1, 2), 10, drawHeight + 18);
  text('ACT composite: ' + act, 10, drawHeight + 50);
  text('Years of core courses: ' + nf(core, 1, 1), 10, drawHeight + 82);
}

// Round to one decimal and drop a trailing ".0" (259, not 259.0)
function fmt(v) {
  const r = round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : nf(r, 1, 1);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  sliderLeftMargin = canvasWidth < 480 ? 216 : 230;
}
