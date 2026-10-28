// Award Letter Decoder
// CANVAS_HEIGHT: 720
// Sort every line of an award letter into free money (grants and scholarships), earned money
// (work-study), or borrowed money (all loans, including Parent PLUS). Then ignore the letter's
// totals and use your own:
//   Net price = cost of attendance − free money
//   Out-of-pocket cost = net price − work-study − student federal loans you accept
// Parent PLUS isn't subtracted: it's one way your family could pay the out-of-pocket cost.

let canvasWidth = 400;
let drawHeight = 580;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

const ZONES = [
  { key: 'free', label: 'Free money', sub: 'grants and scholarships', color: 'mediumseagreen' },
  { key: 'earned', label: 'Earned money', sub: 'work-study', color: 'darkcyan' },
  { key: 'borrowed', label: 'Borrowed money', sub: 'loans', color: 'darkorange' }
];
const HINTS = {
  free: 'Grants and scholarships are free money: you never repay them.',
  earned: 'Work-study is money you earn at a job, paid as you work. It isn\'t a loan.',
  student: 'Any loan is borrowed money, even when the letter calls it an "award."',
  parent: 'Parent PLUS is a loan your parents repay.'
};

const LETTERS = {
  'Lakeshore': { college: 'Lakeshore University', cost: 52000, listed: true, lines: [
    ['Lakeshore Grant', 30000, 'free'], ['Federal Work-Study', 2500, 'earned'], ['Direct Subsidized Loan', 3500, 'student'],
    ['Direct Unsubsidized Loan', 2000, 'student'], ['Parent PLUS Loan', 8000, 'parent']] },
  'College C': { college: 'College C', cost: 64000, listed: false, lines: [
    ['Presidential Merit Scholarship', 12000, 'free'], ['College C Grant', 6000, 'free'], ['Federal Direct Loans', 5500, 'student'],
    ['Federal Work-Study', 2000, 'earned']] },
  'Hillcrest': { college: 'Hillcrest College', cost: 82000, listed: true, lines: [
    ['Hillcrest Grant (need-based)', 54000, 'free'], ['Hillcrest Merit Scholarship', 6000, 'free'],
    ['Federal Work-Study', 2500, 'earned'], ['Direct Subsidized Loan', 3500, 'student']] }
};

let letter = null;      // { college, cost, listed, own }
let lines = [];         // { name, amount, kind, zone, x, y, w, h }
let dragLine = null, dragOffX = 0, dragOffY = 0;
let tapped = null;      // narrow screens: tap a line, then tap a zone
let hint = '', hintUntil = 0;
let zoneRects = {};
let numberRects = [];

let presetButtons = [], costLabel, costInput, wsBox, loansBox;
let ownName, ownAmount, ownType, ownAdd, ownRemove;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  ['Lakeshore', 'College C', 'Hillcrest', 'Enter my own'].forEach(k => {
    const b = createButton(k);
    b.mousePressed(() => loadLetter(k));
    presetButtons.push(b);
  });
  costLabel = createSpan('Cost of attendance $');
  costLabel.style('font-size', '14px');
  costInput = createInput('', 'number');
  costInput.size(80);
  wsBox = createCheckbox(' I\'ll accept work-study', true);
  loansBox = createCheckbox(' I\'ll accept the federal student loans', true);
  ownName = createInput('');
  ownName.attribute('placeholder', 'Aid line name');
  ownName.size(150);
  ownAmount = createInput('', 'number');
  ownAmount.attribute('placeholder', 'Amount');
  ownAmount.size(70);
  ownType = createSelect();
  [['Grant or scholarship', 'free'], ['Work-study', 'earned'], ['Student loan', 'student'], ['Parent PLUS loan', 'parent']].forEach(([l, v]) => ownType.option(l, v));
  ownAdd = createButton('Add line');
  ownAdd.mousePressed(addOwnLine);
  ownRemove = createButton('Remove last');
  ownRemove.mousePressed(() => { if (letter && letter.own) { lines.pop(); layoutLetter(); } });

  loadLetter('Lakeshore');
  describe('An award letter decoder. A mock award letter lists aid lines as the college presents them. Drag each line into free money, earned money, or borrowed money. Your numbers then show the real net price, out-of-pocket cost, and borrowing, compared with the letter\'s remaining balance.');
}

function loadLetter(k) {
  if (k === 'Enter my own') {
    letter = { college: 'My college', cost: 0, listed: false, own: true };
    lines = [];
    costInput.value('');
  } else {
    const L = LETTERS[k];
    letter = { college: L.college, cost: L.cost, listed: L.listed, own: false };
    lines = L.lines.map(l => ({ name: l[0], amount: l[1], kind: l[2], zone: null }));
    costInput.value(L.listed ? L.cost : '');
  }
  tapped = null;
  hint = '';
  layoutLetter();
  positionControls();
}

function addOwnLine() {
  const amt = parseFloat(ownAmount.value());
  if (!ownName.value().trim() || isNaN(amt) || amt <= 0 || lines.length >= 8) return;
  const kind = ownType.value();
  // lines you type in are already labeled, so they go straight into their zone
  lines.push({ name: ownName.value().trim(), amount: amt, kind, zone: kind === 'free' ? 'free' : (kind === 'earned' ? 'earned' : 'borrowed') });
  ownName.value('');
  ownAmount.value('');
  layoutLetter();
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow(presetButtons, 10, y, 30) + 34;
  y = flowRow([costLabel, costInput, wsBox, loansBox], 10, y, 28) + 32;
  const own = letter && letter.own;
  [ownName, ownAmount, ownType, ownAdd, ownRemove].forEach(c => own ? c.show() : c.hide());
  if (own) flowRow([ownName, ownAmount, ownType, ownAdd, ownRemove], 10, y, 30);
  // the cost box can be edited only when the letter leaves the cost out
  if (letter && letter.listed) costInput.attribute('disabled', ''); else costInput.removeAttribute('disabled');
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

function isWide() {
  return canvasWidth >= 700;
}

// Geometry for the letter column, zones, and numbers panel
function layout() {
  if (isWide()) {
    const colW = (canvasWidth - 4 * margin) / 3;
    return {
      letter: { x: margin, y: 40, w: colW, h: drawHeight - 50 },
      zones: ZONES.map((z, i) => ({ x: 2 * margin + colW, y: 40 + i * ((drawHeight - 50) / 3), w: colW, h: (drawHeight - 50) / 3 - 6 })),
      numbers: { x: 3 * margin + 2 * colW, y: 40, w: colW, h: drawHeight - 50 }
    };
  }
  const w = canvasWidth - 2 * margin;
  const zw = (w - 2 * margin) / 3;
  return {
    letter: { x: margin, y: 38, w, h: 236 },
    zones: ZONES.map((z, i) => ({ x: margin + i * (zw + margin), y: 280, w: zw, h: 122 })),
    numbers: { x: margin, y: 408, w, h: drawHeight - 414 }
  };
}

// Place unsorted lines in the letter and sorted lines inside their zone
function layoutLetter() {
  const L = layout();
  let ly = L.letter.y + 56;
  const counts = { free: 0, earned: 0, borrowed: 0 };
  lines.forEach(l => {
    l.h = 24;
    if (l === dragLine) { if (!l.zone) ly += 27; return; }   // the line being dragged follows the mouse
    if (l.zone) {
      const zi = ZONES.findIndex(z => z.key === l.zone);
      const z = L.zones[zi];
      l.w = z.w - 12;
      l.x = z.x + 6;
      l.y = z.y + 34 + counts[l.zone] * 27;
      counts[l.zone]++;
    } else {
      l.w = L.letter.w - 20;
      l.x = L.letter.x + 10;
      l.y = ly;
      ly += 27;   // unsorted lines close up as others are sorted
    }
  });
}

function totals() {
  const sum = f => lines.filter(f).reduce((s, l) => s + l.amount, 0);
  const cost = letter.listed ? letter.cost : (parseFloat(costInput.value()) || 0);
  const free = sum(l => l.zone === 'free');
  const earned = sum(l => l.zone === 'earned');
  const student = sum(l => l.zone === 'borrowed' && l.kind === 'student');
  const parent = sum(l => l.zone === 'borrowed' && l.kind === 'parent');
  const net = cost - free;
  const oop = net - (wsBox.checked() ? earned : 0) - (loansBox.checked() ? student : 0);
  const letterTotal = lines.reduce((s, l) => s + l.amount, 0);
  return { cost, free, earned, student, parent, net, oop, letterTotal, remaining: cost - letterTotal };
}

function money(v) {
  return (v < 0 ? '−$' : '$') + abs(round(v)).toLocaleString('en-US');
}

function draw() {
  layoutLetter();
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
  text('Award Letter Decoder', canvasWidth / 2, 8);

  const L = layout();
  const t = totals();
  drawLetterPaper(L.letter, t);
  zoneRects = {};
  ZONES.forEach((z, i) => drawZone(z, L.zones[i]));
  lines.filter(l => l !== dragLine).forEach(drawLine);
  if (dragLine) drawLine(dragLine);
  drawNumbers(L.numbers, t);

  if (hint && millis() < hintUntil) {
    textSize(13);
    const tw = min(textWidth(hint) + 20, canvasWidth - 20);
    const hx = (canvasWidth - tw) / 2;
    stroke('firebrick');
    fill('mistyrose');
    rect(hx, drawHeight - 34, tw, 26, 6);
    noStroke();
    fill('firebrick');
    textAlign(CENTER, CENTER);
    text(hint, hx + 4, drawHeight - 34, tw - 8, 26);
  }
}

function drawLetterPaper(b, t) {
  stroke('tan');
  fill('cornsilk');
  rect(b.x, b.y, b.w, b.h, 6);
  noStroke();
  fill('saddlebrown');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('The letter as written', b.x + 10, b.y + 6);
  textStyle(NORMAL);
  fill('black');
  textSize(12);
  textStyle(BOLD);
  text(letter.college, b.x + 10, b.y + 22, b.w - 20);
  textStyle(NORMAL);
  text(letter.listed ? 'Cost of attendance: ' + money(letter.cost) : (letter.own ? 'Enter the cost below, then add aid lines.' : 'Cost not listed'), b.x + 10, b.y + 36);
  if (!lines.length) return;
  const unsorted = lines.filter(l => !l.zone).length;
  const fy = b.y + b.h - 40;
  stroke('tan');
  line(b.x + 10, fy - 4, b.x + b.w - 10, fy - 4);
  noStroke();
  fill('black');
  textStyle(BOLD);
  text('Total financial aid: ' + money(t.letterTotal), b.x + 10, fy);
  if (letter.listed) text('Remaining balance: ' + money(t.remaining), b.x + 10, fy + 17);
  textStyle(NORMAL);
  if (unsorted) {
    fill('dimgray');
    textSize(11);
    textAlign(RIGHT, TOP);
    text(isWide() ? 'Drag each line →' : 'Tap a line, then a zone', b.x + b.w - 10, b.y + 6);
  }
}

function drawZone(z, b) {
  const hover = (dragLine || tapped) && mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h;
  stroke(z.color);
  strokeWeight(hover ? 3 : 1.5);
  fill(hover ? color(255, 255, 224) : 'white');
  rect(b.x, b.y, b.w, b.h, 8);
  strokeWeight(1);
  noStroke();
  fill(z.color);
  textAlign(LEFT, TOP);
  textSize(isWide() ? 14 : 12);
  textStyle(BOLD);
  const sum = lines.filter(l => l.zone === z.key).reduce((s, l) => s + l.amount, 0);
  text(z.label + ' ' + money(sum), b.x + 8, b.y + 6, b.w - 12);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(11);
  if (isWide()) text('(' + z.sub + ')', b.x + 8, b.y + 22);
  zoneRects[z.key] = b;
}

function drawLine(l) {
  const zoneColor = l.zone ? ZONES.find(z => z.key === l.zone).color : null;
  stroke(l === tapped ? 'goldenrod' : (zoneColor || 'tan'));
  strokeWeight(l === tapped || l === dragLine ? 2.5 : 1);
  fill(l.zone ? 'white' : 'ivory');
  rect(l.x, l.y, l.w, l.h, 4);
  strokeWeight(1);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(l.w < 140 ? 10 : 12);
  const amt = money(l.amount);
  let name = l.name;
  while (textWidth(name + '  ' + amt) > l.w - 10 && name.length > 4) name = name.slice(0, -2);
  if (name !== l.name) name += '…';
  text(name, l.x + 6, l.y + l.h / 2);
  textAlign(RIGHT, CENTER);
  textStyle(BOLD);
  text(amt, l.x + l.w - 6, l.y + l.h / 2);
  textStyle(NORMAL);
}

function drawNumbers(b, t) {
  stroke('silver');
  fill('white');
  rect(b.x, b.y, b.w, b.h, 8);
  noStroke();
  numberRects = [];
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Your numbers', b.x + 10, b.y + 8);
  textStyle(NORMAL);
  const unsorted = lines.filter(l => !l.zone).length;
  const costTxt = t.cost ? money(t.cost) : 'enter the cost';
  const rows = [
    ['Cost of attendance', t.cost ? money(t.cost) : '—', letter.listed ? 'Listed on the letter.' : 'Not on the letter: look it up on the college\'s website and enter it below.'],
    ['Net price', t.cost ? money(t.net) : '—', costTxt + ' − ' + money(t.free) + ' free money = ' + money(t.net)],
    ['Out-of-pocket cost', t.cost ? money(t.oop) : '—', money(t.net) + ' net price − ' + money(wsBox.checked() ? t.earned : 0) + ' work-study − ' + money(loansBox.checked() ? t.student : 0) + ' student loans = ' + money(t.oop)],
    ['Borrowed this year (student)', money(loansBox.checked() ? t.student : 0), 'Federal student loans you accept. Repaid with interest after you leave school.'],
    ['Borrowed this year (parent)', money(t.parent), 'Parent PLUS listed on the letter: family debt, not aid.']
  ];
  const lh = isWide() ? 40 : 21;
  rows.forEach((r, i) => {
    const y = b.y + 32 + i * lh;
    fill('dimgray');
    textSize(12);
    textAlign(LEFT, TOP);
    if (isWide()) {
      text(r[0], b.x + 10, y);
      fill(i === 1 ? 'navy' : (i === 2 ? 'seagreen' : 'black'));
      textSize(17);
      textStyle(BOLD);
      text(r[1], b.x + 10, y + 15);
      textStyle(NORMAL);
    } else {
      text(r[0], b.x + 10, y);
      fill(i === 1 ? 'navy' : (i === 2 ? 'seagreen' : 'black'));
      textStyle(BOLD);
      textAlign(RIGHT, TOP);
      text(r[1], b.x + b.w - 10, y);
      textStyle(NORMAL);
    }
    numberRects.push({ x: b.x, y, w: b.w, h: lh, tip: r[2] });
  });
  const cy = b.y + 32 + rows.length * lh + 4;
  textAlign(LEFT, TOP);
  textSize(12);
  if (unsorted) {
    fill('darkorange');
    text('Sort all ' + lines.length + ' lines to finish (' + unsorted + ' left).', b.x + 10, cy, b.w - 20);
  } else if (lines.length && letter.listed) {
    fill('firebrick');
    textStyle(BOLD);
    text('The letter\'s remaining balance: ' + money(t.remaining) + ' vs. your real net price: ' + money(t.net) + '.', b.x + 10, cy, b.w - 20, 40);
    textStyle(NORMAL);
  } else if (lines.length && t.cost) {
    fill('navy');
    text('Your real net price: ' + money(t.net) + '.', b.x + 10, cy, b.w - 20);
  }

  const h = numberRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (h) {
    textSize(12);
    const tw = min(300, canvasWidth - 20);
    const tx = constrain(mouseX - tw / 2, 6, canvasWidth - tw - 6);
    const ty = constrain(h.y + h.h, 6, drawHeight - 50);
    stroke('gray');
    fill('lightyellow');
    rect(tx, ty, tw, 44, 5);
    noStroke();
    fill('black');
    text(h.tip, tx + 8, ty + 5, tw - 16, 38);
  }
}

function lineAt(mx, my) {
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i];
    if (mx > l.x && mx < l.x + l.w && my > l.y && my < l.y + l.h) return l;
  }
  return null;
}

function zoneAt(mx, my) {
  for (const k in zoneRects) {
    const b = zoneRects[k];
    if (mx > b.x && mx < b.x + b.w && my > b.y && my < b.y + b.h) return k;
  }
  return null;
}

function tryDrop(l, zone) {
  const correct = l.kind === 'free' ? 'free' : (l.kind === 'earned' ? 'earned' : 'borrowed');
  if (zone === correct) { l.zone = zone; hint = ''; }
  else { hint = 'Not quite. ' + HINTS[l.kind]; hintUntil = millis() + 2600; }
}

function mousePressed() {
  if (mouseY > drawHeight || !letter || letter.own) return;
  const l = lineAt(mouseX, mouseY);
  if (isWide()) {
    if (l && !l.zone) { dragLine = l; dragOffX = mouseX - l.x; dragOffY = mouseY - l.y; }
    return;
  }
  // narrow: tap a line, then tap a zone
  if (l && !l.zone) { tapped = l; return; }
  const z = zoneAt(mouseX, mouseY);
  if (z && tapped) { tryDrop(tapped, z); tapped = null; }
}

function mouseDragged() {
  if (dragLine) { dragLine.x = mouseX - dragOffX; dragLine.y = mouseY - dragOffY; }
}

function mouseReleased() {
  if (!dragLine) return;
  const z = zoneAt(mouseX, mouseY);
  if (z) tryDrop(dragLine, z);
  dragLine = null;
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
