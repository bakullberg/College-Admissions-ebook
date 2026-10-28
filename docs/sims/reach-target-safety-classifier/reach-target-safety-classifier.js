// Reach, Target, or Safety? Classifier
// CANVAS_HEIGHT: 620
// A simplified guide, not a prediction:
// 1. Admission rate under 10% → Reach for everyone.
// 2. Either value below the college's 25th percentile → Reach.
// 3. Both values above the 75th percentile AND admission rate ≥ 50% → candidate Safety.
// 4. Otherwise Target ("Target leaning reach" if the admission rate is under 25%).
// 5. A candidate Safety is a Safety only if it is Affordable and you'd be glad to attend.

let canvasWidth = 400;
let drawHeight = 370;
let controlHeight = 250;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let inputs = {};
let testType, fitSelect, gladBox;
let presetButtons = [];
let labels = {};
let result = null;
let badgeRect = { x: 0, y: 0, w: 0, h: 0 };

const COLORS = { 'Reach': 'rebeccapurple', 'Target': 'royalblue', 'Target leaning reach': 'slateblue',
                 'Safety': 'seagreen', 'Likely admit — not yet a safety': 'darkorange' };

const presets = [
  { label: 'Priya → College A', v: { gpa: 3.71, score: 1280, rate: 6, g25: 3.85, g75: 4.0, t25: 1500, t75: 1560 }, test: 'SAT', fit: 'Not checked yet', glad: true },
  { label: 'Priya → College C', v: { gpa: 3.71, score: 1280, rate: 45, g25: 3.5, g75: 3.9, t25: 1220, t75: 1390 }, test: 'SAT', fit: 'Affordable', glad: true },
  { label: 'Casey → state university (resident)', v: { gpa: 3.40, score: 24, rate: 85, g25: 3.0, g75: 3.35, t25: 19, t75: 23 }, test: 'ACT', fit: 'Affordable', glad: true,
    note: 'Illustrative numbers, not a real college\'s. At Iowa, Casey\'s RAI of 259 clears the resident threshold, so admission is very likely.' },
  { label: "Likely admit, can't afford", v: { gpa: 3.9, score: 1400, rate: 70, g25: 3.3, g75: 3.8, t25: 1150, t75: 1350 }, test: 'SAT', fit: 'Out of reach', glad: true }
];
let presetNote = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  const lab = (k, t) => { labels[k] = createSpan(t); labels[k].style('font-size', '14px'); return labels[k]; };
  const num = (k, v, w) => {
    const i = createInput(String(v), 'number');
    i.size(w || 62);
    i.input(() => { presetNote = ''; classify(); });
    inputs[k] = i;
    return i;
  };

  lab('student', 'You:');
  lab('gpa', 'GPA'); num('gpa', 3.71);
  testType = createSelect();
  testType.option('SAT');
  testType.option('ACT');
  testType.changed(classify);
  lab('score', 'score'); num('score', 1280, 70);

  lab('college', 'College:');
  lab('rate', 'Admission rate %'); num('rate', 45);
  lab('g', 'GPA 25th–75th'); num('g25', 3.5); num('g75', 3.9);
  lab('t', 'Test 25th–75th'); num('t25', 1220, 70); num('t75', 1390, 70);

  lab('fit', 'Financial fit');
  fitSelect = createSelect();
  ['Not checked yet', 'Affordable', 'Stretch', 'Out of reach'].forEach(o => fitSelect.option(o));
  fitSelect.changed(classify);
  gladBox = createCheckbox(" I'd be glad to attend", false);
  gladBox.changed(classify);

  lab('presets', 'Try:');
  presets.forEach(p => {
    const b = createButton(p.label);
    b.mousePressed(() => loadPreset(p));
    presetButtons.push(b);
  });

  positionControls();
  classify();
  describe('A reach, target, or safety classifier. Enter your GPA and test score and a college\'s admission rate, middle 50% ranges, and financial fit. Number lines show your values against the college\'s ranges, and a badge shows Reach, Target, or Safety with the deciding factors.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([labels.student, labels.gpa, inputs.gpa, testType, labels.score, inputs.score], 10, y, 30) + 32;
  y = flowRow([labels.college, labels.rate, inputs.rate, labels.g, inputs.g25, inputs.g75], 10, y, 30) + 32;
  y = flowRow([labels.t, inputs.t25, inputs.t75, labels.fit, fitSelect, gladBox], 10, y, 30) + 34;
  flowRow([labels.presets, ...presetButtons], 10, y, 30);
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

function loadPreset(p) {
  for (const k in p.v) inputs[k].value(p.v[k]);
  testType.selected(p.test);
  fitSelect.selected(p.fit);
  gladBox.checked(p.glad);
  presetNote = p.note || '';
  classify();
}

function val(k) {
  return parseFloat(inputs[k].value());
}

function classify() {
  const gpa = val('gpa'), score = val('score'), rate = val('rate');
  const g25 = val('g25'), g75 = val('g75'), t25 = val('t25'), t75 = val('t75');
  if ([gpa, score, rate, g25, g75, t25, t75].some(isNaN)) {
    result = { label: null, lines: ['Fill in every number to classify this college.'], rule: '' };
    return;
  }
  const fit = fitSelect.value(), glad = gladBox.checked();
  const test = testType.value();

  if (rate < 10) {
    result = { label: 'Reach', rule: 'Rule 1: admission rate under 10%',
      lines: ['Admission rate ' + rate + '%: most selective colleges are reaches for everyone.', 'Your numbers can\'t change that.', 'Keep it if you love it, alongside targets and safeties.'] };
    return;
  }
  const lowG = gpa < g25, lowT = score < t25;
  if (lowG || lowT) {
    const which = [lowG ? 'GPA ' + gpa + ' is below the 25th percentile (' + g25 + ')' : '', lowT ? test + ' ' + score + ' is below the 25th percentile (' + t25 + ')' : ''].filter(Boolean);
    result = { label: 'Reach', rule: 'Rule 2: a value below the 25th percentile',
      lines: [...which, 'Three of four admitted students had higher numbers than yours on that measure.'] };
    return;
  }
  const highBoth = gpa > g75 && score > t75;
  if (highBoth && rate >= 50) {
    const missing = [];
    if (fit !== 'Affordable') missing.push(fit === 'Not checked yet' ? 'Check net price' : 'Not affordable yet (' + fit.toLowerCase() + ')');
    if (!glad) missing.push('Would you be glad to attend?');
    if (missing.length === 0) {
      result = { label: 'Safety', rule: 'Rule 3 + Rule 5: above both 75th percentiles, rate ≥ 50%, affordable, glad to attend',
        lines: ['Both your GPA and ' + test + ' are above the 75th percentile.', 'The college admits ' + rate + '% of applicants, and it\'s affordable.', 'You\'d be glad to go, so it\'s a true safety.'] };
    } else {
      result = { label: 'Likely admit — not yet a safety', rule: 'Rule 3 passed, Rule 5 not yet met',
        lines: ['Your numbers are above both 75th percentiles at a ' + rate + '% college.', 'Missing: ' + missing.join('; ') + '.', 'A safety must be affordable and a place you\'d be glad to attend.'] };
    }
    return;
  }
  const lean = rate < 25;
  result = { label: lean ? 'Target leaning reach' : 'Target', rule: lean ? 'Rule 4: inside the ranges, admission rate under 25%' : 'Rule 4: inside the ranges',
    lines: ['Your GPA and ' + test + ' fall inside or near the middle 50% ranges.',
            'The college admits ' + rate + '% of applicants' + (lean ? ', so even strong applicants are often turned away.' : '.'),
            highBoth ? 'You\'re above both ranges, but the admission rate is under 50%.' : 'You\'d be a typical admitted student here.'] };
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
  text('Reach, Target, or Safety?', canvasWidth / 2, 8);

  const wide = canvasWidth >= 680;
  const lineW = wide ? canvasWidth * 0.5 : canvasWidth - 2 * margin;
  const test = testType.value();
  const tMin = test === 'SAT' ? 400 : 1, tMax = test === 'SAT' ? 1600 : 36;
  drawNumberLine(margin, 50, lineW, 'GPA', 2.0, 4.0, val('g25'), val('g75'), val('gpa'), 2);
  drawNumberLine(margin, 118, lineW, test, tMin, tMax, val('t25'), val('t75'), val('score'), 0);

  if (wide) drawBadge(margin * 2 + lineW, 44, canvasWidth - lineW - 3 * margin, drawHeight - 54);
  else drawBadge(margin, 180, canvasWidth - 2 * margin, drawHeight - 188);
}

function drawNumberLine(x, y, w, label, lo, hi, p25, p75, v, digits) {
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(label, x, y);
  textStyle(NORMAL);
  const ly = y + 34;
  const px = n => x + w * constrain((n - lo) / (hi - lo), 0, 1);
  stroke('gray');
  strokeWeight(2);
  line(x, ly, x + w, ly);
  strokeWeight(1);
  if (!isNaN(p25) && !isNaN(p75)) {
    noStroke();
    fill('steelblue');
    rect(px(min(p25, p75)), ly - 8, px(max(p25, p75)) - px(min(p25, p75)), 16, 3);
    fill('dimgray');
    textSize(11);
    textAlign(CENTER, TOP);
    text(nf(p25, 1, digits), px(p25), ly + 10);
    text(nf(p75, 1, digits), px(p75), ly + 10);
  }
  // scale end labels, skipped when a percentile label sits right next to them
  fill('gray');
  textSize(11);
  const near = n => !isNaN(p25) && !isNaN(p75) && (abs(px(n) - px(p25)) < 30 || abs(px(n) - px(p75)) < 30);
  textAlign(LEFT, TOP);
  if (!near(lo)) text(nf(lo, 1, digits), x, ly + 10);
  textAlign(RIGHT, TOP);
  if (!near(hi)) text(nf(hi, 1, digits), x + w, ly + 10);
  if (!isNaN(v)) {
    const vx = px(v);
    stroke('darkgoldenrod');
    fill('gold');
    quad(vx, ly - 13, vx + 9, ly, vx, ly + 13, vx - 9, ly);
    noStroke();
    fill('black');
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text('You: ' + nf(v, 1, digits), vx, ly - 14);
  }
}

function drawBadge(x, y, w, h) {
  badgeRect = { x, y, w, h };
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (!result || !result.label) {
    fill('firebrick');
    textSize(15);
    text(result ? result.lines[0] : '', x + 12, y + 12, w - 24);
    return;
  }
  const col = COLORS[result.label];
  fill(col);
  const bh = 40;
  rect(x + 10, y + 10, w - 20, bh, 20);
  fill('white');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(result.label.length > 16 ? (w < 360 ? 14 : 16) : 22);
  text(result.label, x + 10, y + 10, w - 20, bh);
  textStyle(NORMAL);

  const hovering = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  textAlign(LEFT, TOP);
  fill('black');
  textSize(13);
  let ty = y + bh + 18;
  if (hovering) {
    fill('navy');
    text('Rule that fired: ' + result.rule, x + 12, ty, w - 24);
    return;
  }
  result.lines.forEach(l => {
    text('• ' + l, x + 12, ty, w - 24, 40);
    ty += textHeightFor(l, w - 24);
  });
  if (presetNote) {
    fill('dimgray');
    textSize(12);
    text(presetNote, x + 12, ty + 2, w - 24, y + h - ty - 4);
  } else {
    fill('gray');
    textSize(11);
    text('A simplified guide, not a prediction. Hover for the rule.', x + 12, y + h - 18, w - 24);
  }
}

// Rough height of wrapped text at the current text size
function textHeightFor(s, w) {
  const lines = ceil(textWidth('• ' + s) / max(40, w));
  return lines * (textSize() + 4) + 2;
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
