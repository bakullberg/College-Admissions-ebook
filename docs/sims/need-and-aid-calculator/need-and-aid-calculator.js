// Need and Aid Calculator
// CANVAS_HEIGHT: 560
// Demonstrated need = cost of attendance − Student Aid Index (never below $0; an SAI below 0 counts as 0).
// Gift aid = grants. Self-help aid = work-study + loans. Unmet need = need − total aid.
// Net price = cost − gift aid. A "meets full need" college fills any gap with more grant aid.
// Aid can't exceed need unless "Allow aid above need (merit)" is checked.

let canvasWidth = 400;
let drawHeight = 300;
let controlHeight = 260;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

let costSlider, saiSlider, grantSlider, wsSlider, loanSlider;
let aboveBox, fullNeedBox;
let presetButtons = [];
let segs = [];

const PRESETS = {
  'Marcus at the regional public': [24000, 9500, 11000, 0, 3500],
  'Marcus at the private college with strong aid': [79000, 9500, 60000, 2500, 5500],
  'Gapping college': [60000, 9500, 25000, 0, 5500]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  costSlider = createSlider(10000, 95000, 79000, 500);
  saiSlider = createSlider(-1500, 60000, 9500, 500);
  grantSlider = createSlider(0, 80000, 60000, 500);
  wsSlider = createSlider(0, 80000, 2500, 500);
  loanSlider = createSlider(0, 80000, 5500, 500);
  [costSlider, saiSlider].forEach(s => s.input(() => clampAid(null)));
  grantSlider.input(() => clampAid(grantSlider));
  wsSlider.input(() => clampAid(wsSlider));
  loanSlider.input(() => clampAid(loanSlider));
  aboveBox = createCheckbox(' Allow aid above need (merit)', false);
  aboveBox.changed(() => clampAid(null));
  fullNeedBox = createCheckbox(' This college meets full need', false);
  Object.keys(PRESETS).forEach(k => {
    const b = createButton(k);
    b.mousePressed(() => {
      const [c, s, g, w, l] = PRESETS[k];
      costSlider.value(c); saiSlider.value(s); grantSlider.value(g); wsSlider.value(w); loanSlider.value(l);
      fullNeedBox.checked(false);
      aboveBox.checked(false);
    });
    presetButtons.push(b);
  });
  positionControls();
  describe('A need and aid calculator. Sliders set the cost of attendance, the Student Aid Index, and grant, work-study, and loan amounts. Two bars show how cost splits into the Student Aid Index and demonstrated need, and how aid fills that need, with readouts for gift aid, self-help aid, unmet need, and net price.');
}

function positionControls() {
  const w = canvasWidth - sliderLeftMargin - margin;
  [costSlider, saiSlider, grantSlider, wsSlider, loanSlider].forEach((s, i) => {
    s.position(sliderLeftMargin, drawHeight + 8 + i * 30);
    s.size(w);
  });
  let y = drawHeight + 8 + 5 * 30 + 4;
  y = flowRow([aboveBox, fullNeedBox], 10, y, 26) + 30;
  flowRow(presetButtons, 10, y, 30);
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

function need() {
  return max(0, costSlider.value() - max(0, saiSlider.value()));
}

// Keep total aid within demonstrated need (unless merit aid above need is allowed)
function clampAid(changed) {
  if (aboveBox.checked()) {
    // even merit aid can't exceed the cost of attendance
    const over = grantSlider.value() + wsSlider.value() + loanSlider.value() - costSlider.value();
    if (over > 0) reduce(changed, over);
    return;
  }
  const over = grantSlider.value() + wsSlider.value() + loanSlider.value() - need();
  if (over > 0) reduce(changed, over);
}

function reduce(changed, over) {
  const order = changed ? [changed, loanSlider, wsSlider, grantSlider].filter((s, i, a) => a.indexOf(s) === i) : [loanSlider, wsSlider, grantSlider];
  for (const s of order) {
    if (over <= 0) break;
    const cut = min(s.value(), over);
    s.value(s.value() - cut);
    over -= cut;
  }
}

function money(v) {
  return (v < 0 ? '−$' : '$') + abs(round(v)).toLocaleString('en-US');
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
  text('Need and Aid Calculator', canvasWidth / 2, 8);

  const cost = costSlider.value();
  const sai = saiSlider.value();
  const saiPart = min(cost, max(0, sai));
  const dn = need();
  let grants = grantSlider.value();
  const ws = wsSlider.value(), loans = loanSlider.value();
  let filled = 0;
  if (fullNeedBox.checked()) {
    filled = max(0, dn - (grants + ws + loans));
    grants += filled;
  }
  const aid = grants + ws + loans;
  const unmet = max(0, dn - aid);
  const net = max(0, cost - grants);

  segs = [];
  const bx = margin, bw = canvasWidth - 2 * margin, bh = 34;
  const px = v => bw * v / cost;

  // bar 1: cost = SAI + demonstrated need
  noStroke();
  fill('black');
  textAlign(LEFT, BOTTOM);
  textSize(13);
  text('Cost of attendance ' + money(cost) + ' = Student Aid Index + demonstrated need', bx, 58);
  drawSeg(bx, 62, px(saiPart), bh, 'darkgray', 'Student Aid Index', saiPart, 'The FAFSA\'s index of ability to pay. It isn\'t a bill, but it sets need.');
  drawSeg(bx + px(saiPart), 62, px(dn), bh, 'steelblue', 'Demonstrated need', dn, 'Cost of attendance minus Student Aid Index.');

  // bar 2: how the college fills the need
  fill('black');
  noStroke();
  textAlign(LEFT, BOTTOM);
  text('How this college fills the need', bx, 122);
  const aboveNeed = max(0, aid - dn);
  let x = bx;
  const saiShown = max(0, saiPart - aboveNeed);
  x = drawSeg(x, 126, px(saiShown), bh, 'darkgray', 'Student Aid Index', saiShown, 'Your family\'s part before aid.');
  x = drawSeg(x, 126, px(grants), bh, 'mediumseagreen', 'Grants' + (filled ? ' (incl. gap filled)' : ''), grants, 'Gift aid: never repaid.');
  x = drawSeg(x, 126, px(ws), bh, 'darkcyan', 'Work-study', ws, 'Earned through a part-time job; doesn\'t lower the bill.');
  x = drawSeg(x, 126, px(loans), bh, 'darkorange', 'Loans', loans, 'Must be repaid. Not a discount.');
  if (unmet > 0) {
    const w = px(unmet);
    fill('mistyrose');
    noStroke();
    rect(x, 126, w, bh);
    stroke('crimson');
    for (let s = -bh; s < w; s += 8) line(x + max(0, s), 126 + (s < 0 ? -s : 0), x + min(w, s + bh), 126 + min(bh, w - s));
    noStroke();
    segs.push({ x, y: 126, w, h: bh, name: 'Unmet need', v: unmet, def: 'Need the college doesn\'t cover: the "gap" your family must find.' });
    if (w > 60) { fill('crimson'); textAlign(CENTER, CENTER); textSize(11); text('Unmet ' + money(unmet), x + w / 2, 126 + bh / 2); }
  }

  // readouts
  const ry = 178;
  const items = [
    ['Demonstrated need', dn, 'steelblue'], ['Gift aid', grants, 'seagreen'], ['Self-help aid', ws + loans, 'darkorange'],
    ['Unmet need', unmet, unmet > 0 ? 'crimson' : 'dimgray'], ['Net price (cost − gift aid)', net, 'navy']
  ];
  const cols = canvasWidth >= 620 ? 5 : 3;
  const cw = (canvasWidth - 2 * margin) / cols;
  items.forEach(([label, v, c], i) => {
    const cx = margin + (i % cols) * cw, cy = ry + floor(i / cols) * 42;
    noStroke();
    fill('dimgray');
    textAlign(LEFT, TOP);
    textSize(11);
    text(label, cx, cy, cw - 6);
    fill(c);
    textSize(18);
    textStyle(BOLD);
    text(money(v), cx, cy + 15);
    textStyle(NORMAL);
  });
  if (filled > 0) {
    fill('seagreen');
    textSize(13);
    textAlign(LEFT, TOP);
    text('Meets-full-need college: gap of ' + money(filled) + ' filled with grant aid.', margin, drawHeight - 22);
  } else if (sai >= cost) {
    fill('dimgray');
    textSize(13);
    textAlign(LEFT, TOP);
    text('The Student Aid Index is at or above the cost, so demonstrated need is $0. Only merit aid could lower the price.', margin, drawHeight - 34, canvasWidth - 2 * margin);
  }

  // hover tip
  const h = segs.find(s => mouseX > s.x && mouseX < s.x + s.w && mouseY > s.y && mouseY < s.y + s.h);
  if (h) {
    const s = h.name + ': ' + money(h.v) + '. ' + h.def;
    textSize(12);
    const tw = min(textWidth(s) + 14, canvasWidth - 20);
    const tx = constrain(mouseX - tw / 2, 4, canvasWidth - tw - 4);
    stroke('gray');
    fill('lightyellow');
    rect(tx, h.y + h.h + 3, tw, 34, 4);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    text(s, tx + 7, h.y + h.h + 6, tw - 12, 30);
  }

  // slider labels
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  const labels = ['Cost of attendance: ' + money(cost), 'Student Aid Index: ' + sai.toLocaleString('en-US'),
                  'Grants: ' + money(grantSlider.value()), 'Work-study: ' + money(ws), 'Loans: ' + money(loans)];
  labels.forEach((l, i) => text(l, 10, drawHeight + 18 + i * 30));
}

// Draw one bar segment with a label if it fits; returns the right edge
function drawSeg(x, y, w, h, c, name, v, def) {
  if (w <= 0) return x;
  noStroke();
  fill(c);
  rect(x, y, w, h);
  if (w > 70) {
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(11);
    text(name + '\n' + money(v), x + 2, y, w - 4, h);
  }
  segs.push({ x, y, w, h, name, v, def });
  return x + w;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  sliderLeftMargin = canvasWidth < 480 ? 220 : 250;
}
