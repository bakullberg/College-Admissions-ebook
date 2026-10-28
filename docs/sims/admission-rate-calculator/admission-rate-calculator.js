// Admission Rate Calculator
// CANVAS_HEIGHT: 495
// Admission rate = students admitted ÷ applications received × 100%.
// A 10×10 grid of applicant icons fills one icon per percentage point. "Application surge"
// raises applications by 25% while admits stay fixed, so the rate falls even though the
// college admits exactly as many students as before.

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

let appsSlider, admitSlider;
let collegeAButton, collegeBButton, surgeButton;
let caption = '';

// Selectivity bands used in Chapter 1
const bands = [
  { max: 10, name: 'Most selective', color: 'firebrick' },
  { max: 30, name: 'Highly selective', color: 'darkorange' },
  { max: 60, name: 'Selective', color: 'goldenrod' },
  { max: 90, name: 'Less selective', color: 'seagreen' },
  { max: 101, name: 'Open or nearly open', color: 'steelblue' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  appsSlider = createSlider(1000, 100000, 40000, 1000);
  appsSlider.input(() => { caption = ''; clampAdmits(); });
  admitSlider = createSlider(100, 50000, 6000, 100);
  admitSlider.input(() => { caption = ''; clampAdmits(); });

  collegeAButton = createButton('College A');
  collegeAButton.mousePressed(() => setValues(40000, 6000, ''));
  collegeBButton = createButton('College B');
  collegeBButton.mousePressed(() => setValues(9000, 6300, ''));
  surgeButton = createButton('Application surge (+25%)');
  surgeButton.mousePressed(applySurge);

  positionControls();
  describe('An admission rate calculator. Two sliders set applications received and students admitted. A grid of 100 applicant icons fills in to show the admission rate, and the formula is written out with the current numbers, along with the selectivity band.');
}

function positionControls() {
  appsSlider.position(sliderLeftMargin, drawHeight + 8);
  appsSlider.size(canvasWidth - sliderLeftMargin - margin);
  admitSlider.position(sliderLeftMargin, drawHeight + 43);
  admitSlider.size(canvasWidth - sliderLeftMargin - margin);
  collegeAButton.position(10, drawHeight + 80);
  collegeBButton.position(100, drawHeight + 80);
  surgeButton.position(190, drawHeight + 80);
}

function setValues(apps, admits, msg) {
  appsSlider.value(apps);
  admitSlider.value(admits);
  clampAdmits();
  caption = msg;
}

// Admitted students can never outnumber applicants
function clampAdmits() {
  if (admitSlider.value() > appsSlider.value()) admitSlider.value(appsSlider.value());
}

function applySurge() {
  const before = appsSlider.value();
  const admits = admitSlider.value();
  const after = min(100000, round(before * 1.25 / 1000) * 1000);
  const oldRate = admits / before * 100;
  appsSlider.value(after);
  clampAdmits();
  const newRate = admitSlider.value() / after * 100;
  caption = 'Applications rose ' + fmt(before) + ' → ' + fmt(after) + ' while admits stayed at ' +
            fmt(admitSlider.value()) + '. The rate fell ' + nf(oldRate, 1, 1) + '% → ' + nf(newRate, 1, 1) +
            '%, yet the college admitted exactly as many students.';
}

function fmt(n) {
  return n.toLocaleString('en-US');
}

function bandFor(rate) {
  return bands.find(b => rate < b.max);
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
  text('Admission Rate Calculator', canvasWidth / 2, 10);

  const apps = appsSlider.value();
  const admits = admitSlider.value();
  const rate = admits / apps * 100;
  const filled = round(rate);
  const band = bandFor(rate);

  // Layout: grid on the left with the readout on the right, or stacked when narrow
  const wide = canvasWidth >= 600;
  const gridSize = wide ? min(236, drawHeight - 130) : min(160, canvasWidth - 2 * margin);
  const gx = margin;
  const gy = 48;
  drawIconGrid(gx, gy, gridSize, filled, band.color);

  noStroke();
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(13);
  text('Each icon = 1% of applicants', gx + gridSize / 2, gy + gridSize + 6);

  const px = wide ? gx + gridSize + 30 : (gridSize + 2 * margin + 10);
  const pw = canvasWidth - px - margin;
  drawReadout(px, gy, pw, apps, admits, rate, band, wide);

  if (caption) {
    const cy = wide ? drawHeight - 64 : drawHeight - 62;
    stroke('silver');
    fill('lightyellow');
    rect(margin, cy, canvasWidth - 2 * margin, 56, 8);
    noStroke();
    fill('black');
    textSize(13);
    textAlign(LEFT, TOP);
    text(caption, margin + 8, cy + 5, canvasWidth - 2 * margin - 16, 50);
  }

  // control labels
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Applications received: ' + fmt(apps), 10, drawHeight + 18);
  text('Students admitted: ' + fmt(admits), 10, drawHeight + 53);
}

function drawIconGrid(x, y, size, filled, col) {
  const cell = size / 10;
  for (let i = 0; i < 100; i++) {
    const cx = x + (i % 10) * cell + cell / 2;
    const cy = y + floor(i / 10) * cell + cell / 2;
    const admitted = i < filled;
    strokeWeight(1.2);
    stroke(admitted ? col : 'gray');
    fill(admitted ? col : 'white');
    // simple person icon: head + shoulders
    circle(cx, cy - cell * 0.18, cell * 0.32);
    arc(cx, cy + cell * 0.32, cell * 0.62, cell * 0.6, PI, TWO_PI, CHORD);
  }
  strokeWeight(1);
}

function drawReadout(x, y, w, apps, admits, rate, band, wide) {
  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textSize(wide ? 16 : 14);
  text('Admission rate = admitted ÷ applications × 100%', x, y, w);

  const lineY = y + (wide ? 34 : 50);
  textSize(wide ? 18 : 15);
  textStyle(BOLD);
  fill('navy');
  text(fmt(admits) + ' ÷ ' + fmt(apps) + ' × 100% = ' + nf(rate, 1, 1) + '%', x, lineY, w);
  textStyle(NORMAL);

  const bigY = lineY + (wide ? 36 : 44);
  fill(band.color);
  textSize(wide ? 44 : 32);
  textStyle(BOLD);
  text(nf(rate, 1, 1) + '%', x, bigY);
  textStyle(NORMAL);

  const n = apps / admits;
  let odds;
  if (n >= 1.95) odds = 'About 1 in ' + round(n) + ' applicants is admitted.';
  else odds = 'About ' + round(rate / 10) + ' in 10 applicants are admitted.';
  fill('black');
  textSize(wide ? 16 : 14);
  text(odds, x, bigY + (wide ? 54 : 40), w);

  // selectivity band label
  const by = bigY + (wide ? 88 : 84);
  stroke(band.color);
  strokeWeight(2);
  fill('white');
  rect(x, by, min(w, 220), 30, 6);
  strokeWeight(1);
  noStroke();
  fill(band.color);
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT, CENTER);
  text(band.name, x + 10, by + 15);
  textStyle(NORMAL);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  sliderLeftMargin = canvasWidth < 500 ? 230 : 250;
}
