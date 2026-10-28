// Superscore Calculator
// CANVAS_HEIGHT: 540
// SAT total = Reading and Writing + Math. ACT composite = average of English, Math, and
// Reading, rounded to the nearest whole number. A superscore takes the highest score in each
// section across all test dates, then applies the same rule. Not every college superscores.

let canvasWidth = 400;
let drawHeight = 320;
let controlHeight = 220;
let canvasHeight = drawHeight + controlHeight;
let margin = 14;
let defaultTextSize = 16;

const SECTIONS = { SAT: ['Reading and Writing', 'Math'], ACT: ['English', 'Math', 'Reading'] };
const SHORT = { 'Reading and Writing': 'R&W', 'Math': 'Math', 'English': 'English', 'Reading': 'Reading' };
const RANGE = { SAT: [200, 800, 10], ACT: [1, 36, 1] };
const DATE_GRAYS = ['silver', 'darkgray', 'gray', 'dimgray'];

let testSelect, addButton, removeButton, priyaButton, caseyButton, testLabel;
let rows = [];       // { date: input, scores: [inputs] }
let dateCount = 2;
let barRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  testLabel = createSpan('Test:');
  testSelect = createSelect();
  testSelect.option('SAT');
  testSelect.option('ACT');
  testSelect.changed(() => { buildRows(); loadDefaults(); });
  addButton = createButton('Add test date');
  addButton.mousePressed(() => { if (dateCount < 4) { dateCount++; positionControls(); } });
  removeButton = createButton('Remove last');
  removeButton.mousePressed(() => { if (dateCount > 1) { dateCount--; positionControls(); } });
  priyaButton = createButton('Load Priya');
  priyaButton.mousePressed(loadPriya);
  caseyButton = createButton('Load Casey');
  caseyButton.mousePressed(loadCasey);
  testLabel.style('font-size', '15px');

  buildRows();
  loadPriya();
  describe('A superscore calculator. Enter section scores for up to four SAT or ACT test dates. Bars compare each section across dates with the best outlined in gold, and a second chart compares the superscore with the best single-sitting score.');
}

// Create four rows of inputs for the current test (hidden rows are kept for later)
function buildRows() {
  rows.forEach(r => { r.date.remove(); r.scores.forEach(s => s.remove()); });
  rows = [];
  const t = testSelect.value();
  const [lo, hi, step] = RANGE[t];
  for (let i = 0; i < 4; i++) {
    const date = createInput('Date ' + (i + 1));
    date.size(84);
    const scores = SECTIONS[t].map(() => {
      const s = createInput('', 'number');
      s.attribute('min', lo);
      s.attribute('max', hi);
      s.attribute('step', step);
      s.size(t === 'SAT' ? 62 : 48);
      return s;
    });
    rows.push({ date, scores });
  }
  positionControls();
}

function positionControls() {
  let y = drawHeight + 8;
  flowRow([testLabel, testSelect, addButton, removeButton, priyaButton, caseyButton], 10, y, 30);
  const wrapped = (caseyButton.y || 0) > y + 5;
  y += (wrapped ? 64 : 34) + 18;   // leave a line for the column headers drawn on the canvas
  rows.forEach((r, i) => {
    const visible = i < dateCount;
    [r.date, ...r.scores].forEach(e => visible ? e.show() : e.hide());
    let x = 10;
    r.date.position(x, y + i * 30);
    x += 96;
    r.scores.forEach(s => { s.position(x, y + i * 30); x += (testSelect.value() === 'SAT' ? 74 : 60); });
    r.compositeX = x + 6;
    r.y = y + i * 30;
  });
  rows.headerY = y - 16;
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

function setRows(test, data) {
  if (testSelect.value() !== test) { testSelect.selected(test); buildRows(); }
  dateCount = data.length;
  data.forEach((d, i) => {
    rows[i].date.value(d[0]);
    d.slice(1).forEach((v, k) => rows[i].scores[k].value(v));
  });
  positionControls();
}

function loadPriya() { setRows('SAT', [['June', 680, 600], ['October', 660, 650]]); }
function loadCasey() { setRows('ACT', [['Date 1', 25, 22, 26], ['Date 2', 24, 25, 26]]); }
function loadDefaults() { testSelect.value() === 'SAT' ? loadPriya() : loadCasey(); }

function scoresFor(i) {
  return rows[i].scores.map(s => parseFloat(s.value()));
}

function composite(arr) {
  if (arr.some(isNaN)) return null;
  if (testSelect.value() === 'SAT') return arr.reduce((a, b) => a + b, 0);
  return round(arr.reduce((a, b) => a + b, 0) / arr.length);
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
  text('Superscore Calculator', canvasWidth / 2, 8);

  const t = testSelect.value();
  const secs = SECTIONS[t];
  const data = [];
  for (let i = 0; i < dateCount; i++) data.push(scoresFor(i));
  const best = secs.map((_, k) => max(data.map(d => isNaN(d[k]) ? -1 : d[k])));
  const singles = data.map(composite);
  const validSingles = singles.filter(v => v !== null);
  const bestSingle = validSingles.length ? max(validSingles) : null;
  const superscore = best.every(v => v >= 0) ? composite(best) : null;

  barRects = [];
  const wide = canvasWidth >= 600;
  const leftW = wide ? (canvasWidth - 3 * margin) * 0.62 : canvasWidth - 2 * margin;
  const chartTop = 44, chartH = wide ? 190 : 110;
  drawSectionBars(margin, chartTop, leftW, chartH, data, best, secs);
  if (wide) drawCompositeBars(2 * margin + leftW, chartTop, canvasWidth - 3 * margin - leftW, chartH, superscore, bestSingle);
  else drawCompositeBars(margin, chartTop + chartH + 22, canvasWidth - 2 * margin, 76, superscore, bestSingle);

  // readout
  const ry = drawHeight - (wide ? 64 : 82);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(wide ? 17 : 14);
  textStyle(BOLD);
  if (superscore !== null && bestSingle !== null) {
    const gain = superscore - bestSingle;
    text('Superscore: ' + superscore + ' (best single sitting: ' + bestSingle + '). Gain from superscoring: ' + (gain >= 0 ? '+' : '') + gain + '.', margin, ry, canvasWidth - 2 * margin);
  } else {
    text('Fill in every section score to see the superscore.', margin, ry, canvasWidth - 2 * margin);
  }
  textStyle(NORMAL);
  if (t === 'ACT' && superscore !== null) {
    fill('dimgray');
    textSize(12);
    const sum = best.reduce((a, b) => a + b, 0);
    text('(' + best.join(' + ') + ') ÷ 3 = ' + nf(sum / 3, 1, 1) + ' → ' + superscore, margin, ry + (wide ? 22 : 40));
  }
  fill('darkorange');
  textSize(12);
  text('Not every college superscores. Check each college\'s policy.', margin, drawHeight - 20);

  // control-region headers and single-sitting composites
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Test date', 12, rows.headerY);
  let hx = 106;
  secs.forEach(s => { text(SHORT[s], hx, rows.headerY); hx += (t === 'SAT' ? 74 : 60); });
  text(t === 'SAT' ? 'Total' : 'Composite', hx + 6, rows.headerY);
  for (let i = 0; i < dateCount; i++) {
    fill(singles[i] !== null && singles[i] === bestSingle ? 'royalblue' : 'black');
    textSize(15);
    textStyle(singles[i] !== null && singles[i] === bestSingle ? BOLD : NORMAL);
    text(singles[i] === null ? '—' : singles[i], rows[i].compositeX, rows[i].y + 11);
    textStyle(NORMAL);
  }

  drawBarTip();
}

function drawSectionBars(x, y, w, h, data, best, secs) {
  const t = testSelect.value();
  const [lo, hi] = RANGE[t];
  const base = t === 'SAT' ? 200 : 0;
  const top = hi;
  const plotY = y + 10, plotH = h - 30;
  stroke('gainsboro');
  for (let v = base; v <= top; v += (t === 'SAT' ? 200 : 9)) {
    const yy = plotY + plotH - plotH * (v - base) / (top - base);
    line(x + 30, yy, x + w, yy);
    noStroke();
    fill('gray');
    textSize(10);
    textAlign(RIGHT, CENTER);
    text(v, x + 26, yy);
    stroke('gainsboro');
  }
  const groupW = (w - 40) / secs.length;
  const barW = min(34, (groupW - 16) / max(1, data.length));
  secs.forEach((s, k) => {
    const gx = x + 36 + k * groupW;
    data.forEach((d, i) => {
      const v = d[k];
      if (isNaN(v)) return;
      const bh = plotH * (constrain(v, base, top) - base) / (top - base);
      const groupBarsW = data.length * (barW + 3) - 3;
      const bx = gx + (groupW - 12 - groupBarsW) / 2 + i * (barW + 3);
      const isBest = v === best[k];
      stroke(isBest ? 'goldenrod' : 'white');
      strokeWeight(isBest ? 3 : 1);
      fill(DATE_GRAYS[i]);
      rect(bx, plotY + plotH - bh, barW, bh, 2);
      strokeWeight(1);
      noStroke();
      fill('black');
      textSize(10);
      textAlign(CENTER, BOTTOM);
      text(v, bx + barW / 2, plotY + plotH - bh - 2);
      barRects.push({ x: bx, y: plotY + plotH - bh, w: barW, h: bh, tip: SHORT[s] + ', ' + rows[i].date.value() + ': ' + v + (isBest ? ' (best)' : '') });
    });
    noStroke();
    fill('black');
    textSize(12);
    textAlign(CENTER, TOP);
    text(SHORT[s], gx + (groupW - 12) / 2, plotY + plotH + 4);
  });
}

function drawCompositeBars(x, y, w, h, superscore, bestSingle) {
  const t = testSelect.value();
  const base = t === 'SAT' ? 400 : 0, top = t === 'SAT' ? 1600 : 36;
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text(t === 'SAT' ? 'Total (400–1600)' : 'Composite (1–36)', x, y - 2);
  textStyle(NORMAL);
  const items = [['Superscore', superscore, 'seagreen'], ['Best single', bestSingle, 'royalblue']];
  if (h > 120) {
    // vertical bars
    const plotY = y + 18, plotH = h - 38;
    const bw = min(50, (w - 30) / 2);
    items.forEach(([label, v, col], i) => {
      const bx = x + 10 + i * (bw + 16);
      if (v !== null) {
        const bh = plotH * (v - base) / (top - base);
        fill(col);
        rect(bx, plotY + plotH - bh, bw, bh, 3);
        fill('black');
        textAlign(CENTER, BOTTOM);
        textSize(13);
        textStyle(BOLD);
        text(v, bx + bw / 2, plotY + plotH - bh - 2);
        textStyle(NORMAL);
      }
      fill('black');
      textSize(11);
      textAlign(CENTER, TOP);
      text(label, bx + bw / 2, plotY + plotH + 4);
    });
  } else {
    // horizontal bars when stacked under the section chart
    items.forEach(([label, v, col], i) => {
      const by = y + 18 + i * 26;
      fill('black');
      textSize(12);
      textAlign(LEFT, CENTER);
      text(label, x, by + 9);
      if (v !== null) {
        const bw = (w - 130) * (v - base) / (top - base);
        fill(col);
        rect(x + 80, by, bw, 18, 3);
        fill('black');
        textStyle(BOLD);
        text(v, x + 86 + bw, by + 9);
        textStyle(NORMAL);
      }
    });
  }
}

function drawBarTip() {
  const b = barRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (!b) return;
  textSize(12);
  const tw = textWidth(b.tip) + 14;
  const tx = constrain(mouseX + 10, 4, canvasWidth - tw - 4);
  stroke('gray');
  fill('lightyellow');
  rect(tx, mouseY - 26, tw, 20, 4);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(b.tip, tx + 7, mouseY - 16);
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
