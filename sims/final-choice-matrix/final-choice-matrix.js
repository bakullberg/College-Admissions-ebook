// Final Choice Decision Matrix
// CANVAS_HEIGHT: 730
// Weighted total = Σ (factor weight × college score). Weights run 0–5; scores 1 (weak) to 5 (excellent).
// If you enter four-year net prices, cost is scored automatically: lowest price = 5, others scaled
// down in proportion (5 × lowest ÷ price, minimum 1), unless you check "Override cost scores."
// The total is a tool for thinking, not a verdict.

let canvasWidth = 400;
let drawHeight = 310;
let controlHeight = 420;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

const BASE_FACTORS = [
  { name: 'Cost (four-year net price)', short: 'Cost' },
  { name: 'Academic fit', short: 'Academic' },
  { name: 'Social and campus fit', short: 'Social' },
  { name: 'Outcomes', short: 'Outcomes' },
  { name: 'Distance from home', short: 'Distance' },
  { name: 'Gut sense', short: 'Gut' }
];
const SEG_COLORS = ['seagreen', 'steelblue', 'mediumpurple', 'darkorange', 'teal', 'crimson', 'goldenrod', 'sienna'];
const MAX_COLLEGES = 4, MAX_FACTORS = 8;

const PRESETS = {
  'Priya: Hillcrest vs. Flagship honors': {
    names: ['Hillcrest', 'Flagship honors'], prices: [88000, 56000],
    weights: [4, 5, 4, 3, 2, 4], scores: [[3, 5], [5, 4], [5, 3], [4, 4], [3, 5], [5, 3]] },
  'Marcus: Lakeshore vs. Brookfield vs. Regional': {
    names: ['Lakeshore', 'Brookfield', 'Regional'], prices: [97549, 90506, 56407],
    weights: [5, 5, 3, 4, 4, 3], scores: [[3, 3, 5], [5, 3, 3], [4, 4, 3], [5, 3, 3], [3, 3, 5], [5, 3, 3]] }
};

let factors = [];        // { name, short, slider, label, nameInput (custom), selects[] }
let nameInputs = [], priceInputs = [];
let overrideBox, addFactorButton, presetButtons = [], priceLabel, collegeCount = 2;
let addCollegeButton, removeCollegeButton;
let segRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (let c = 0; c < MAX_COLLEGES; c++) {
    const n = createInput('College ' + (c + 1));
    n.size(78);
    nameInputs.push(n);
    const p = createInput('', 'number');
    p.attribute('placeholder', '4-yr $');
    p.size(78);
    priceInputs.push(p);
  }
  priceLabel = createSpan('Four-year net price');
  priceLabel.style('font-size', '12px');
  BASE_FACTORS.forEach(f => addFactorRow(f.name, f.short, false));
  overrideBox = createCheckbox(' Override cost scores', false);
  addFactorButton = createButton('Add factor');
  addFactorButton.mousePressed(() => { if (factors.length < MAX_FACTORS) { addFactorRow('My factor', 'Custom', true); positionControls(); } });
  addCollegeButton = createButton('Add college');
  addCollegeButton.mousePressed(() => { collegeCount = min(MAX_COLLEGES, collegeCount + 1); positionControls(); });
  removeCollegeButton = createButton('Remove college');
  removeCollegeButton.mousePressed(() => { collegeCount = max(2, collegeCount - 1); positionControls(); });
  Object.keys(PRESETS).forEach(k => {
    const b = createButton(k);
    b.mousePressed(() => loadPreset(PRESETS[k]));
    presetButtons.push(b);
  });

  loadPreset(PRESETS['Priya: Hillcrest vs. Flagship honors']);
  describe('A weighted decision matrix for choosing among two to four finalist colleges. Weight factors such as cost, academic fit, social fit, outcomes, distance, and gut sense, score each college from 1 to 5, and see each college\'s weighted total as a segmented bar, plus the factors driving the difference between the top two.');
}

function addFactorRow(name, short, custom) {
  const f = { name, short, custom };
  f.slider = createSlider(0, 5, 3, 1);
  f.label = createSpan(name);
  f.label.style('font-size', '13px');
  if (custom) {
    f.nameInput = createInput(name);
    f.nameInput.size(90);
    f.nameInput.input(() => { f.name = f.nameInput.value() || 'My factor'; f.short = f.name; });
    f.label.hide();
  }
  f.selects = [];
  for (let c = 0; c < MAX_COLLEGES; c++) {
    const s = createSelect();
    [1, 2, 3, 4, 5].forEach(v => s.option(String(v)));
    s.selected('3');
    f.selects.push(s);
  }
  factors.push(f);
}

function loadPreset(p) {
  collegeCount = p.names.length;
  p.names.forEach((n, c) => nameInputs[c].value(n));
  for (let c = 0; c < MAX_COLLEGES; c++) priceInputs[c].value(p.prices[c] !== undefined ? p.prices[c] : '');
  // drop custom factors
  while (factors.length > BASE_FACTORS.length) {
    const f = factors.pop();
    [f.slider, f.label, f.nameInput, ...f.selects].forEach(e => e && e.remove());
  }
  factors.forEach((f, i) => {
    f.slider.value(p.weights[i]);
    p.scores[i].forEach((v, c) => f.selects[c].selected(String(v)));
  });
  overrideBox.checked(false);
  positionControls();
}

function narrow() {
  return canvasWidth < 560;
}

function positionControls() {
  const labelW = narrow() ? 74 : 190;
  const sliderW = narrow() ? 64 : 110;
  const colX0 = 10 + labelW + sliderW + 36;
  const colW = min(96, (canvasWidth - colX0 - 6) / collegeCount);
  let y = drawHeight + 8;
  // college names
  nameInputs.forEach((n, c) => {
    if (c < collegeCount) { n.show(); n.position(colX0 + c * colW, y); n.size(colW - 10); } else n.hide();
  });
  y += 30;
  // factor rows
  factors.forEach(f => {
    if (f.custom) { f.nameInput.position(10, y); f.nameInput.size(labelW - 6); }
    else { f.label.html(narrow() ? f.short : f.name); f.label.position(10, y + 4); }
    f.slider.position(10 + labelW, y + 2);
    f.slider.size(sliderW);
    f.selects.forEach((s, c) => {
      if (c < collegeCount) { s.show(); s.position(colX0 + c * colW, y); s.style('width', (colW - 10) + 'px'); } else s.hide();
    });
    f.rowY = y;
    y += 29;
  });
  // price row
  priceLabel.position(10, y + 4);
  priceInputs.forEach((p, c) => {
    if (c < collegeCount) { p.show(); p.position(colX0 + c * colW, y); p.size(colW - 10); } else p.hide();
  });
  y += 32;
  y = flowRow([overrideBox, addFactorButton, addCollegeButton, removeCollegeButton], 10, y, 30) + 34;
  flowRow(presetButtons, 10, y, 30);
  weightX = 10 + labelW + sliderW + 4;
}
let weightX = 0;

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

// Apply automatic cost scores from four-year prices when all colleges have one
function autoCost() {
  const prices = priceInputs.slice(0, collegeCount).map(p => parseFloat(p.value()));
  const usable = !overrideBox.checked() && prices.every(p => p > 0);
  factors[0].selects.forEach((s, c) => {
    if (c >= collegeCount) return;
    if (usable) {
      const lowest = min(prices);
      s.selected(String(max(1, round(5 * lowest / prices[c]))));
      s.attribute('disabled', '');
    } else s.removeAttribute('disabled');
  });
  return usable;
}

function draw() {
  const auto = autoCost();
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
  text('Final Choice Decision Matrix', canvasWidth / 2, 8);

  const names = nameInputs.slice(0, collegeCount).map(n => n.value() || '—');
  const contrib = names.map((_, c) => factors.map(f => f.slider.value() * int(f.selects[c].value())));
  const totals = contrib.map(a => a.reduce((s, v) => s + v, 0));
  const maxPossible = factors.reduce((s, f) => s + 5 * f.slider.value(), 0) || 1;
  const order = names.map((n, c) => c).sort((a, b) => totals[b] - totals[a]);
  const lead = order[0];

  // bars
  const wide = !narrow();
  const barX = margin + (wide ? 120 : 90);
  const barW = (wide ? canvasWidth * 0.62 : canvasWidth - 2 * margin) - (barX - margin) - 40;
  const top = 42, bh = 26;
  segRects = [];
  order.forEach((c, k) => {
    const y = top + k * (bh + 10);
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    textSize(13);
    textStyle(c === lead ? BOLD : NORMAL);
    let nm = names[c];
    while (textWidth(nm) > barX - margin - 8 && nm.length > 3) nm = nm.slice(0, -2);
    text(nm, barX - 6, y + bh / 2);
    textStyle(NORMAL);
    let x = barX;
    factors.forEach((f, i) => {
      const w = barW * contrib[c][i] / maxPossible;
      fill(SEG_COLORS[i % SEG_COLORS.length]);
      rect(x, y, w, bh);
      segRects.push({ x, y, w, h: bh, tip: names[c] + ' · ' + f.short + ': weight ' + f.slider.value() + ' × score ' + f.selects[c].value() + ' = ' + contrib[c][i] });
      x += w;
    });
    if (c === lead) { noFill(); stroke('goldenrod'); strokeWeight(3); rect(barX - 1, y - 1, x - barX + 2, bh + 2); strokeWeight(1); }
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text(totals[c], x + 6, y + bh / 2);
    textStyle(NORMAL);
  });
  // legend
  let lx = margin, ly = top + collegeCount * (bh + 10) + 4;
  textSize(11);
  factors.forEach((f, i) => {
    const w = textWidth(f.short) + 22;
    if (lx + w > (wide ? canvasWidth * 0.62 : canvasWidth - margin)) { lx = margin; ly += 16; }
    noStroke();
    fill(SEG_COLORS[i % SEG_COLORS.length]);
    rect(lx, ly, 10, 10, 2);
    fill('black');
    textAlign(LEFT, TOP);
    text(f.short, lx + 13, ly - 1);
    lx += w;
  });

  // what's driving this
  const px = wide ? canvasWidth * 0.64 : margin;
  const py = wide ? 40 : ly + 22;
  const pw = wide ? canvasWidth - px - margin : canvasWidth - 2 * margin;
  const ph = wide ? drawHeight - 92 : drawHeight - py - 34;
  stroke('silver');
  fill('white');
  rect(px, py, pw, ph, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text("What's driving this?", px + 8, py + 6);
  textStyle(NORMAL);
  if (collegeCount >= 2) {
    const a = order[0], b = order[1];
    const diffs = factors.map((f, i) => ({ f, d: contrib[a][i] - contrib[b][i] })).filter(x => x.d !== 0)
                         .sort((x, y) => abs(y.d) - abs(x.d)).slice(0, 2);
    textSize(12);
    const lines = diffs.map(x => x.f.short + ': ' + (x.d > 0 ? names[a] : names[b]) + ' +' + abs(x.d));
    text(totals[a] === totals[b] ? 'A tie. Look at the factors you care about most.' :
         names[a] + ' leads ' + names[b] + ' by ' + (totals[a] - totals[b]) + '.\n' + (lines.length ? lines.join('\n') : ''),
         px + 8, py + 26, pw - 16, ph - 30);
  }
  if (auto && ph > 90) {
    fill('seagreen');
    textSize(11);
    textAlign(LEFT, BOTTOM);
    text('Cost scored from four-year prices', px + 8, py + ph - 6, pw - 16);
  }

  fill('dimgray');
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('The total is a tool for thinking, not a verdict. If your gut disagrees with the total, look at what\'s driving the difference.', margin, drawHeight - 4, canvasWidth - 2 * margin);

  // control-region headers
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Factor', 12, drawHeight + 18);
  text('Weight', 10 + (narrow() ? 74 : 190), drawHeight + 18);
  factors.forEach(f => { fill('black'); textSize(12); text(f.slider.value(), weightX, f.rowY + 11); });

  const h = segRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (h) {
    textSize(12);
    const tw = textWidth(h.tip) + 14;
    const tx = constrain(mouseX - tw / 2, 4, canvasWidth - tw - 4);
    stroke('gray');
    fill('lightyellow');
    rect(tx, h.y + h.h + 2, tw, 20, 4);
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    text(h.tip, tx + 7, h.y + h.h + 12);
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
