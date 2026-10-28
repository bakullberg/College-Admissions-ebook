// SAT-ACT Converter
// CANVAS_HEIGHT: 470
// Uses the official 2018 ACT/SAT concordance (College Board and ACT): each ACT composite
// from 11 to 36 maps to an SAT range and a single-point SAT equivalent. ACT ticks sit above
// their single-point SAT value, so the ACT scale is nonlinear. Concordance is approximate.

let canvasWidth = 400;
let drawHeight = 300;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let margin = 30;
let defaultTextSize = 16;

// ACT composite: [SAT low, SAT high, SAT single-point]
const CONCORD = {
  36: [1570, 1600, 1590], 35: [1530, 1560, 1540], 34: [1490, 1520, 1500], 33: [1450, 1480, 1460],
  32: [1420, 1440, 1430], 31: [1390, 1410, 1400], 30: [1360, 1380, 1370], 29: [1330, 1350, 1340],
  28: [1300, 1320, 1310], 27: [1260, 1290, 1280], 26: [1230, 1250, 1240], 25: [1200, 1220, 1210],
  24: [1160, 1190, 1180], 23: [1130, 1150, 1140], 22: [1100, 1120, 1110], 21: [1060, 1090, 1080],
  20: [1030, 1050, 1040], 19: [990, 1020, 1010], 18: [960, 980, 970], 17: [920, 950, 930],
  16: [880, 910, 890], 15: [830, 870, 850], 14: [780, 820, 800], 13: [730, 770, 760],
  12: [690, 720, 710], 11: [650, 680, 670]
};

let testSelect, scoreSlider, lowInput, highInput, rangeTest;
let haveLabel, rangeLabel, toLabel, presetLabel;
let priyaButton, caseyButton, iowaButton;
let presetNote = '';
let ticks = [];

function satToAct(sat) {
  for (let a = 36; a >= 11; a--) {
    const [lo, hi] = CONCORD[a];
    if (sat >= lo && sat <= hi) return a;
  }
  return null;  // below 650: no official concordance
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  haveLabel = createSpan('I have a score on the');
  testSelect = createSelect();
  testSelect.option('SAT');
  testSelect.option('ACT');
  testSelect.changed(switchTest);
  scoreSlider = createSlider(400, 1600, 1280, 10);
  scoreSlider.input(() => { presetNote = ''; });

  rangeLabel = createSpan('College middle 50%:');
  lowInput = createInput('', 'number');
  lowInput.size(64);
  lowInput.attribute('placeholder', 'low');
  toLabel = createSpan('to');
  highInput = createInput('', 'number');
  highInput.size(64);
  highInput.attribute('placeholder', 'high');
  rangeTest = createSelect();
  rangeTest.option('SAT');
  rangeTest.option('ACT');

  presetLabel = createSpan('Try:');
  priyaButton = createButton('Priya (SAT 1280)');
  priyaButton.mousePressed(() => preset('SAT', 1280, '', '', 'SAT', ''));
  caseyButton = createButton('Casey (ACT 24)');
  caseyButton.mousePressed(() => preset('ACT', 24, 1100, 1280, 'SAT', 'A college Casey is considering reports only SAT ranges: 1100–1280.'));
  iowaButton = createButton('Iowa merit threshold (ACT 26 / SAT 1230)');
  iowaButton.mousePressed(() => preset('ACT', 26, '', '', 'SAT', 'Iowa states its merit threshold as an ACT 26 or SAT 1230. Both fall in the same concordance row.'));
  [haveLabel, rangeLabel, toLabel, presetLabel].forEach(s => s.style('font-size', '15px'));

  positionControls();
  describe('An SAT to ACT converter. Two aligned scales show ACT composite on top and SAT total below, matched by the official concordance. A slider sets your score, gold markers show it on both scales, and an optional blue band shows a college\'s middle 50% range.');
}

function positionControls() {
  let y = drawHeight + 10;
  y = flowRow([haveLabel, testSelect], 10, y, 30);
  scoreSlider.position(10 + (haveLabel.elt.offsetWidth || 150) + (testSelect.elt.offsetWidth || 60) + 24, y + 2);
  scoreSlider.size(max(120, canvasWidth - scoreSlider.x - 20));
  if (canvasWidth < 520) {
    scoreSlider.position(10, y + 32);
    scoreSlider.size(canvasWidth - 40);
    y += 32;
  }
  y = flowRow([rangeLabel, lowInput, toLabel, highInput, rangeTest], 10, y + 36, 30) + 36;
  flowRow([presetLabel, priyaButton, caseyButton, iowaButton], 10, y, 30);
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

function switchTest() {
  // keep the same performance level when switching tests
  const t = testSelect.value();
  const v = scoreSlider.value();
  if (t === 'ACT') {
    const a = satToAct(v) || 11;
    scoreSlider.elt.min = 1; scoreSlider.elt.max = 36; scoreSlider.elt.step = 1;
    scoreSlider.value(a);
  } else {
    const a = constrain(round(v), 11, 36);
    scoreSlider.elt.min = 400; scoreSlider.elt.max = 1600; scoreSlider.elt.step = 10;
    scoreSlider.value(CONCORD[a][2]);
  }
  presetNote = '';
}

function preset(test, score, lo, hi, rTest, note) {
  if (testSelect.value() !== test) { testSelect.selected(test); switchTest(); }
  scoreSlider.value(score);
  lowInput.value(lo);
  highInput.value(hi);
  rangeTest.selected(rTest);
  presetNote = note;
}

function satX(sat) {
  return map(sat, 400, 1600, margin, canvasWidth - margin);
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
  text('SAT–ACT Converter', canvasWidth / 2, 8);

  const actY = 80, satY = 150;
  const test = testSelect.value();
  const score = scoreSlider.value();

  // current score on both scales
  let sat, act, readout;
  if (test === 'SAT') {
    sat = score;
    act = satToAct(sat);
    readout = act
      ? 'SAT ' + sat + ' ≈ ACT ' + act + ' (ACT ' + act + ' corresponds to SAT ' + CONCORD[act][0] + '–' + CONCORD[act][1] + ').'
      : 'SAT ' + sat + ' is below the concordance table (it starts at SAT 650 = ACT 11).';
  } else {
    act = score;
    if (act >= 11) {
      sat = CONCORD[act][2];
      readout = 'ACT ' + act + ' ≈ SAT ' + sat + ' (ACT ' + act + ' corresponds to SAT ' + CONCORD[act][0] + '–' + CONCORD[act][1] + ').';
    } else {
      sat = null;
      readout = 'There is no official concordance below ACT 11.';
    }
  }

  // college range band
  const lo = parseFloat(lowInput.value()), hi = parseFloat(highInput.value());
  const hasRange = !isNaN(lo) && !isNaN(hi) && hi > lo;
  if (hasRange) {
    const rt = rangeTest.value();
    const satLo = rt === 'SAT' ? lo : (CONCORD[constrain(round(lo), 11, 36)] || [400])[0];
    const satHi = rt === 'SAT' ? hi : (CONCORD[constrain(round(hi), 11, 36)] || [0, 1600])[1];
    noStroke();
    fill(70, 130, 180, 90);
    rect(satX(satLo), rt === 'SAT' ? satY - 12 : actY - 12, satX(satHi) - satX(satLo), 24, 4);
  }

  drawScales(actY, satY);

  // markers and connector
  if (sat !== null) {
    const x = satX(sat);
    stroke('goldenrod');
    strokeWeight(2);
    line(x, actY, x, satY);
    strokeWeight(1);
    drawMarker(x, satY, 'SAT ' + sat, false);
    if (act) drawMarker(satX(CONCORD[act][2]), actY, 'ACT ' + act, true);
  }

  // readouts
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(canvasWidth < 520 ? 14 : 16);
  text(readout, margin - 14, 196, canvasWidth - 2 * margin + 28);
  if (hasRange && sat !== null) {
    const rt = rangeTest.value();
    const v = rt === 'SAT' ? sat : act;
    const mid = (lo + hi) / 2;
    let where;
    if (v === null) where = 'No concordance for this score.';
    else if (v > hi) where = 'Above the range.';
    else if (v < lo) where = 'Below the range.';
    else where = v >= mid ? 'Inside the range, upper half.' : 'Inside the range, lower half.';
    fill('navy');
    textStyle(BOLD);
    text('Against ' + rt + ' ' + lo + '–' + hi + ' (midpoint ' + nf(mid, 1, rt === 'SAT' ? 0 : 1) + '): ' + where, margin - 14, 224, canvasWidth - 2 * margin + 28);
    textStyle(NORMAL);
  }
  if (presetNote) {
    fill('dimgray');
    textSize(13);
    text(presetNote, margin - 14, 250, canvasWidth - 2 * margin + 28);
  }
  fill('gray');
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('Official ACT/SAT concordance tables (College Board and ACT). Approximate.', margin - 14, drawHeight - 6);

  drawTickTip();
}

function drawScales(actY, satY) {
  stroke('gray');
  strokeWeight(3);
  line(margin, actY, canvasWidth - margin, actY);
  line(margin, satY, canvasWidth - margin, satY);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  text('ACT composite', margin - 14, actY - 26);
  text('SAT total', margin - 14, satY - 30);
  textStyle(NORMAL);

  ticks = [];
  // ACT ticks at their single-point SAT position
  const narrow = canvasWidth < 560;
  for (let a = 11; a <= 36; a++) {
    const x = satX(CONCORD[a][2]);
    stroke('gray');
    line(x, actY - 6, x, actY + 6);
    ticks.push({ x, y: actY, label: 'ACT ' + a + ' ↔ SAT ' + CONCORD[a][0] + '–' + CONCORD[a][1] });
    if (!narrow || a % 3 === 0 || a === 36) {
      noStroke();
      fill('dimgray');
      textSize(11);
      textAlign(CENTER, TOP);
      text(a, x, actY + 8);
    }
  }
  // SAT ticks every 100
  for (let s = 400; s <= 1600; s += 100) {
    const x = satX(s);
    stroke('gray');
    line(x, satY - 6, x, satY + 6);
    const a = satToAct(s);
    ticks.push({ x, y: satY, label: 'SAT ' + s + (a ? ' ↔ ACT ' + a : ' (below the table)') });
    if (!narrow || s % 200 === 0) {
      noStroke();
      fill('dimgray');
      textSize(11);
      textAlign(CENTER, TOP);
      text(s, x, satY + 8);
    }
  }
}

function drawMarker(x, y, label, above) {
  stroke('darkgoldenrod');
  fill('gold');
  quad(x, y - 11, x + 8, y, x, y + 11, x - 8, y);
  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, above ? BOTTOM : TOP);
  text(label, constrain(x, 40, canvasWidth - 40), above ? y - 13 : y + 22);
  textStyle(NORMAL);
}

function drawTickTip() {
  const t = ticks.find(k => abs(mouseX - k.x) < 4 && abs(mouseY - k.y) < 10);
  if (!t) return;
  textSize(12);
  const tw = textWidth(t.label) + 14;
  const tx = constrain(mouseX + 10, 4, canvasWidth - tw - 4);
  stroke('gray');
  fill('lightyellow');
  rect(tx, mouseY + 12, tw, 20, 4);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(t.label, tx + 7, mouseY + 22);
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
