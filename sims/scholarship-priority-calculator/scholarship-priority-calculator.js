// Scholarship Priority Calculator
// CANVAS_HEIGHT: 660
// Chance = min(1, awards ÷ applicants). Expected value = amount × years (if renewable) × chance.
// Hours drop 40% when you can reuse an existing essay. Value per hour = expected value ÷ hours.
// The time budget fills your available hours from the top of the ranked list down.
// Chances are estimates; ask your counselor how many students applied last year.

let canvasWidth = 400;
let drawHeight = 390;
let controlHeight = 270;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const PRESETS = {
  "Marcus's three": [
    ['National tech scholarship', 10000, 1, 200, 8, false, 1, false],
    ['County community foundation', 2000, 3, 30, 4, false, 1, false],
    ['Local restaurant association', 1000, 1, 4, 2, false, 1, false]
  ],
  "Ana's top eight": [
    ['County community foundation', 1500, 4, 40, 4, false, 1, false],
    ['First-generation student nonprofit', 2500, 5, 120, 6, true, 4, false],
    ['Church youth scholarship', 500, 2, 8, 1.5, false, 1, true],
    ['Mother\'s employer award', 1000, 3, 25, 3, false, 1, false],
    ['National identity-based scholarship', 5000, 50, 5000, 8, false, 1, false],
    ['Rotary-style civic club award', 1000, 1, 12, 3, false, 1, true],
    ['Future teachers award', 2000, 2, 30, 4, true, 2, false],
    ['Credit union scholarship', 750, 2, 20, 2, false, 1, false]
  ]
};

let list = [];       // { name, amount, awards, applicants, hours, renewable, years, reuse }
let selected = -1;
let inputs = {}, labels = {};
let renewBox, reuseBox, addButton, removeButton, presetButtons = [], clearButton, hoursSlider;
let cardRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  const field = (k, label, ph, w, type) => {
    labels[k] = createSpan(label);
    labels[k].style('font-size', '13px');
    inputs[k] = createInput('', type || 'text');
    inputs[k].attribute('placeholder', ph);
    inputs[k].size(w);
  };
  field('name', '', 'Scholarship name', 170);
  field('amount', 'Amount $', '1000', 66, 'number');
  field('awards', 'Awards', '1', 44, 'number');
  field('applicants', 'Applicants', '20', 58, 'number');
  field('hours', 'Hours', '3', 44, 'number');
  renewBox = createCheckbox(' Renewable', false);
  field('years', 'Years', '4', 40, 'number');
  reuseBox = createCheckbox(' Can reuse an existing essay', false);
  addButton = createButton('Add');
  addButton.mousePressed(addItem);
  removeButton = createButton('Remove selected');
  removeButton.mousePressed(() => { if (selected >= 0) { list.splice(selected, 1); selected = -1; } });
  Object.keys(PRESETS).forEach(k => {
    const b = createButton(k);
    b.mousePressed(() => { loadPreset(k); });
    presetButtons.push(b);
  });
  clearButton = createButton('Clear');
  clearButton.mousePressed(() => { list = []; selected = -1; });
  hoursSlider = createSlider(5, 80, 12, 1);
  labels.budget = createSpan('');
  labels.budget.style('font-size', '14px');
  labels.budget.style('display', 'inline-block');
  labels.budget.style('width', '300px');

  loadPreset("Marcus's three");
  positionControls();
  describe('A scholarship priority calculator. Add scholarships with amount, number of awards, estimated applicants, and hours to apply. Cards are ranked by expected value per hour, renewable awards count every year, and reusing an essay cuts the hours. A time budget slider shows which applications fit and the expected total dollars.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([inputs.name, labels.amount, inputs.amount, labels.awards, inputs.awards, labels.applicants, inputs.applicants, labels.hours, inputs.hours], 10, y, 30) + 32;
  y = flowRow([renewBox, labels.years, inputs.years, reuseBox, addButton], 10, y, 30) + 36;
  y = flowRow([removeButton, ...presetButtons, clearButton], 10, y, 30) + 38;
  const labelW = canvasWidth < 560 ? 90 : 300;
  labels.budget.position(10, y + 2);
  hoursSlider.position(10 + labelW + 10, y);
  hoursSlider.size(max(120, canvasWidth - labelW - 40));
}

// Place controls left to right using their real widths; wrap when the row is full.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style('white-space', 'nowrap');
    c.position(x, y);
    const w = c.elt.offsetWidth || c.cachedWidth || 60;
    c.cachedWidth = w;
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 5;
  }
  return y;
}

function loadPreset(k) {
  list = PRESETS[k].map(p => ({ name: p[0], amount: p[1], awards: p[2], applicants: p[3], hours: p[4], renewable: p[5], years: p[6], reuse: p[7] }));
  selected = -1;
}

function addItem() {
  const n = k => parseFloat(inputs[k].value());
  const amount = n('amount'), awards = n('awards'), applicants = n('applicants'), hours = n('hours');
  if (!inputs.name.value().trim() || [amount, awards, applicants, hours].some(v => isNaN(v) || v <= 0)) return;
  list.push({ name: inputs.name.value().trim(), amount, awards, applicants, hours,
              renewable: renewBox.checked(), years: max(1, n('years') || 1), reuse: reuseBox.checked() });
  inputs.name.value('');
}

function evaluate(s, useRenew, useReuse) {
  const chance = min(1, s.awards / s.applicants);
  const years = (useRenew && s.renewable) ? s.years : 1;
  const hours = (useReuse && s.reuse) ? s.hours * 0.6 : s.hours;
  const ev = s.amount * years * chance;
  return { chance, years, hours, ev, perHour: ev / hours };
}

function ranked(useRenew, useReuse) {
  return list.map((s, i) => ({ i, e: evaluate(s, useRenew, useReuse) })).sort((a, b) => b.e.perHour - a.e.perHour);
}

function money(v) {
  return '$' + round(v).toLocaleString('en-US');
}

function draw() {
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  labels.budget.html((canvasWidth < 560 ? 'My hours: ' : 'Hours I have for scholarships this season: ') + hoursSlider.value());
  labels.budget.style('width', canvasWidth < 560 ? '90px' : '300px');

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Scholarship Priority Calculator', canvasWidth / 2, 8);

  const order = ranked(true, true);
  const wide = canvasWidth >= 680;
  const listW = wide ? canvasWidth * 0.62 : canvasWidth - 2 * margin;
  const cardH = 32;
  const maxCards = floor((wide ? drawHeight - 70 : drawHeight - 200) / (cardH + 3));
  cardRects = [];

  // fill the time budget from the top down
  let used = 0;
  const fits = new Set();
  order.forEach(o => { if (used + o.e.hours <= hoursSlider.value() + 1e-9) { used += o.e.hours; fits.add(o.i); } });

  order.slice(0, maxCards).forEach((o, k) => {
    const s = list[o.i], e = o.e;
    const y = 40 + k * (cardH + 3);
    const inBudget = fits.has(o.i);
    stroke(o.i === selected ? 'goldenrod' : (inBudget ? 'seagreen' : 'gainsboro'));
    strokeWeight(o.i === selected ? 2 : 1);
    fill(inBudget ? 'honeydew' : 'white');
    rect(margin, y, listW, cardH, 5);
    strokeWeight(1);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    let name = (k + 1) + '. ' + s.name;
    while (textWidth(name) > listW - 90 && name.length > 6) name = name.slice(0, -2);
    if (name !== (k + 1) + '. ' + s.name) name += '…';
    text(name, margin + 6, y + 3);
    textStyle(NORMAL);
    textAlign(RIGHT, TOP);
    fill('navy');
    textStyle(BOLD);
    text(money(e.perHour) + '/hr', margin + listW - 6, y + 3);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    fill('dimgray');
    textSize(11);
    const f = money(s.amount) + (e.years > 1 ? ' × ' + e.years + ' yrs' : '') + ' × (' + s.awards + ' ÷ ' + s.applicants + ') ÷ ' +
              nf(e.hours, 1, e.hours % 1 ? 1 : 0) + ' hrs' + (s.reuse ? ' (reused essay)' : '');
    text(f, margin + 6, y + 18, listW - 12);
    cardRects.push({ i: o.i, x: margin, y, w: listW, h: cardH });
  });
  if (!list.length) {
    fill('dimgray');
    textAlign(LEFT, TOP);
    textSize(15);
    text('Add scholarships below, or load a preset.', margin + 6, 46);
  } else if (order.length > maxCards) {
    fill('dimgray');
    textSize(11);
    textAlign(LEFT, TOP);
    text('+ ' + (order.length - maxCards) + ' more not shown', margin + 6, 40 + maxCards * (cardH + 3));
  }

  // time budget panel
  const px = wide ? 2 * margin + listW : margin;
  const py = wide ? 40 : drawHeight - 154;
  const pw = wide ? canvasWidth - px - margin : canvasWidth - 2 * margin;
  const ph = wide ? drawHeight - 80 : 120;
  stroke('silver');
  fill('white');
  rect(px, py, pw, ph, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Time budget: ' + hoursSlider.value() + ' hours', px + 10, py + 8);
  textStyle(NORMAL);
  const expected = order.filter(o => fits.has(o.i)).reduce((t, o) => t + o.e.ev, 0);
  textSize(13);
  text('Applications that fit: ' + fits.size + ' of ' + list.length + ' (' + nf(used, 1, 1) + ' hrs)', px + 10, py + 30, pw - 20);
  fill('seagreen');
  textStyle(BOLD);
  text('Expected total: ' + money(expected), px + 10, py + 50, pw - 20);
  textStyle(NORMAL);
  const left = order.filter(o => !fits.has(o.i)).map(o => list[o.i].name);
  fill('dimgray');
  textSize(12);
  text(left.length ? 'Left out: ' + left.join(', ') : 'Everything fits.', px + 10, py + 72, pw - 20, ph - 80);

  fill('gray');
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('Chances are estimates. Ask your counselor how many students applied last year.', margin, drawHeight - 6, canvasWidth - 2 * margin);

  drawCardTip(order);
}

function drawCardTip(order) {
  const h = cardRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (!h) return;
  const s = list[h.i];
  const rankNow = order.findIndex(o => o.i === h.i) + 1;
  const rankBase = ranked(false, false).findIndex(o => o.i === h.i) + 1;
  let msg;
  if (!s.renewable && !s.reuse) msg = 'Expected value ' + money(evaluate(s, true, true).ev) + ' over ' + nf(evaluate(s, true, true).hours, 1, 1) + ' hours.';
  else {
    const parts = [];
    if (s.renewable) parts.push('renewal (' + s.years + ' years)');
    if (s.reuse) parts.push('essay reuse');
    msg = 'Without ' + parts.join(' and ') + ' it would rank #' + rankBase + '; with ' + (parts.length > 1 ? 'them' : 'it') + ' it ranks #' + rankNow + '.' +
          (s.renewable ? ' Total value if renewed: ' + money(s.amount * s.years) + '.' : '');
  }
  textSize(12);
  const tw = min(320, canvasWidth - 20);
  const tx = constrain(mouseX + 10, 6, canvasWidth - tw - 6);
  const ty = constrain(mouseY + 12, 6, drawHeight - 50);
  stroke('gray');
  fill('lightyellow');
  rect(tx, ty, tw, 44, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  text(msg, tx + 8, ty + 5, tw - 16, 38);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const h = cardRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
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
