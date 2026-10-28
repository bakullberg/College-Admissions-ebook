// Balanced College List Builder
// CANVAS_HEIGHT: 590
// Add colleges as Reach, Target, or Safety with a financial fit and a "glad to attend" heart.
// The balance check recomputes on every change:
//   8–12 schools · 2–3 reaches · 4–6 targets · 2–3 safeties ·
//   at least one Affordable safety you'd be glad to attend (required) · no "Not checked" fits

let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const CATS = ['Reach', 'Target', 'Safety'];
const CAT_COLORS = ['rebeccapurple', 'royalblue', 'seagreen'];
const FITS = ['Affordable', 'Stretch', 'Out of reach', 'Not checked'];
const FIT_COLORS = { 'Affordable': 'limegreen', 'Stretch': 'gold', 'Out of reach': 'red', 'Not checked': 'darkgray' };

let nameInput, catSelect, fitSelect, gladBox, addButton;
let removeButton, leftButton, rightButton, originalButton, rebalancedButton, clearButton;
let colleges = [];      // { name, cat, fit, glad }
let selected = -1;
let cardRects = [];

const original = [
  ['Ranked U 1', 0, 'Not checked', false], ['Ranked U 2', 0, 'Not checked', true], ['Ranked U 3', 0, 'Not checked', false],
  ['College A', 0, 'Not checked', true], ['College B', 0, 'Not checked', true], ["Friend's pick 1", 0, 'Not checked', false],
  ["Friend's pick 2", 0, 'Not checked', false], ["Cousin's university", 1, 'Not checked', true], ["Friend's pick 3", 1, 'Not checked', false],
  ['Lakeview College', 2, 'Out of reach', true]
];
const rebalanced = [
  ['College A', 0, 'Stretch', true], ['College B', 0, 'Stretch', true], ['Northfield College', 0, 'Affordable', true],
  ['College C', 1, 'Affordable', true], ['Hillcrest College', 1, 'Stretch', true], ['Brookside University', 1, 'Affordable', true],
  ['Maple State', 1, 'Affordable', true], ['Riverton College', 1, 'Stretch', true],
  ['State flagship (honors)', 2, 'Affordable', true], ['Regional public university', 2, 'Affordable', true]
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nameInput = createInput('');
  nameInput.attribute('placeholder', 'College name');
  nameInput.size(150);
  catSelect = createSelect();
  CATS.forEach(c => catSelect.option(c));
  fitSelect = createSelect();
  FITS.forEach(f => fitSelect.option(f));
  fitSelect.selected('Not checked');
  gladBox = createCheckbox(" I'd be glad to attend", false);
  addButton = createButton('Add');
  addButton.mousePressed(addCollege);

  removeButton = createButton('Remove selected');
  removeButton.mousePressed(() => { if (selected >= 0) { colleges.splice(selected, 1); selected = -1; } });
  leftButton = createButton('◀ Move left');
  leftButton.mousePressed(() => moveSelected(-1));
  rightButton = createButton('Move right ▶');
  rightButton.mousePressed(() => moveSelected(1));
  originalButton = createButton("Priya's original list");
  originalButton.mousePressed(() => loadList(original));
  rebalancedButton = createButton("Priya's rebalanced list");
  rebalancedButton.mousePressed(() => loadList(rebalanced));
  clearButton = createButton('Clear');
  clearButton.mousePressed(() => { colleges = []; selected = -1; });

  positionControls();
  describe('A college list builder with three columns: Reach, Target, and Safety. Add colleges with a financial fit and a glad-to-attend heart, move or remove them, and a balance check lists whether the list has 8 to 12 schools, the right mix of categories, and at least one affordable safety you would be glad to attend.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([nameInput, catSelect, fitSelect, gladBox, addButton], 10, y, 30) + 36;
  flowRow([removeButton, leftButton, rightButton, originalButton, rebalancedButton, clearButton], 10, y, 30);
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

function addCollege() {
  const name = nameInput.value().trim();
  if (!name) return;
  colleges.push({ name: name, cat: CATS.indexOf(catSelect.value()), fit: fitSelect.value(), glad: gladBox.checked() });
  nameInput.value('');
  gladBox.checked(false);
}

function loadList(list) {
  colleges = list.map(c => ({ name: c[0], cat: c[1], fit: c[2], glad: c[3] }));
  selected = -1;
}

function moveSelected(d) {
  if (selected < 0) return;
  colleges[selected].cat = constrain(colleges[selected].cat + d, 0, 2);
}

// ----- the balance check -----
function checks() {
  const n = colleges.length;
  const count = c => colleges.filter(x => x.cat === c).length;
  const r = count(0), t = count(1), s = count(2);
  const goodSafety = colleges.find(x => x.cat === 2 && x.fit === 'Affordable' && x.glad);
  const unchecked = colleges.filter(x => x.fit === 'Not checked').length;
  return [
    { ok: n >= 8 && n <= 12, text: 'Total schools between 8 and 12 (you have ' + n + ')',
      why: n < 8 ? 'Add more targets or safeties.' : 'More than 12 is a lot of applications to do well.' },
    { ok: r >= 2 && r <= 3, text: '2–3 reaches (' + r + ')', why: r > 3 ? 'Too many reaches makes the list risky.' : 'One or two dream schools are fine.' },
    { ok: t >= 4 && t <= 6, text: '4–6 targets (' + t + ')', why: 'Targets are the heart of a good list.' },
    { ok: s >= 2 && s <= 3, text: '2–3 safeties (' + s + ')', why: 'You need more than one sure option.' },
    { ok: !!goodSafety, bold: true, text: 'At least one safety that is Affordable and you\'d be glad to attend',
      why: 'Required. This is your guaranteed good outcome.' },
    { ok: unchecked === 0, text: 'No college with financial fit "Not checked"' + (unchecked ? ' (' + unchecked + ' unchecked)' : ''),
      why: 'Run each college\'s net price calculator.' },
    goodSafety
  ];
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
  text('Balanced College List Builder', canvasWidth / 2, 8);

  const colTop = 40, colH = 236;
  const colW = (canvasWidth - 4 * margin) / 3;
  cardRects = [];
  CATS.forEach((c, i) => {
    const x = margin + i * (colW + margin);
    stroke('silver');
    fill('white');
    rect(x, colTop, colW, colH, 8);
    noStroke();
    fill(CAT_COLORS[i]);
    rect(x, colTop, colW, 26, 8, 8, 0, 0);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(15);
    textStyle(BOLD);
    const n = colleges.filter(x => x.cat === i).length;
    text(c + ' (' + n + ')', x + colW / 2, colTop + 13);
    textStyle(NORMAL);

    let cy = colTop + 32;
    colleges.forEach((col, k) => {
      if (col.cat !== i) return;
      if (cy + 22 > colTop + colH) return;  // column full: extra cards are counted but not drawn
      drawCard(col, k, x + 4, cy, colW - 8, 20);
      cy += 24;
    });
  });

  drawBalance(margin, colTop + colH + 8, canvasWidth - 2 * margin, drawHeight - (colTop + colH + 8) - 8);
}

function drawCard(col, k, x, y, w, h) {
  cardRects.push({ k, x, y, w, h });
  const isSel = k === selected;
  stroke(isSel ? 'goldenrod' : 'gainsboro');
  strokeWeight(isSel ? 2.5 : 1);
  fill(isSel ? 'lightyellow' : 'whitesmoke');
  rect(x, y, w, h, 5);
  strokeWeight(1);
  noStroke();
  fill(FIT_COLORS[col.fit]);
  circle(x + 10, y + h / 2, 10);
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(w < 140 ? 11 : 13);
  let label = col.name;
  const maxW = w - 38;
  while (textWidth(label) > maxW && label.length > 3) label = label.slice(0, -2);
  if (label !== col.name) label = label.slice(0, -1) + '…';
  text(label, x + 19, y + h / 2);
  if (col.glad) {
    fill('crimson');
    textAlign(RIGHT, CENTER);
    textSize(13);
    text('♥', x + w - 5, y + h / 2);
  }
}

function drawBalance(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  const list = checks();
  const goodSafety = list.pop();
  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textSize(15);
  textStyle(BOLD);
  text('Balance check', x + 10, y + 6);
  textStyle(NORMAL);

  const narrow = w < 560;
  textSize(narrow ? 11 : 13);
  let ly = y + 28;
  list.forEach(c => {
    fill(c.ok ? 'seagreen' : 'darkorange');
    textStyle(c.bold ? BOLD : NORMAL);
    text((c.ok ? '✓ ' : '⚠ ') + c.text + (c.ok || narrow ? '' : ' — ' + c.why), x + 10, ly, w - 20);
    textStyle(NORMAL);
    ly += narrow ? 15 : 17;
  });

  const balanced = list.every(c => c.ok);
  textSize(13);
  textStyle(BOLD);
  if (goodSafety) {
    fill(balanced ? 'seagreen' : 'black');
    text('Balanced: ' + (balanced ? 'yes' : 'not yet') + '. Your safest good outcome: ' + goodSafety.name + '.', x + 10, ly + 2, w - 20);
  } else {
    fill('darkorange');
    text('No safe, affordable option yet — add or research a safety.', x + 10, ly + 2, w - 20);
  }
  textStyle(NORMAL);
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('Dot: green affordable · yellow stretch · red out of reach · gray not checked.  ♥ = glad to attend', x + 10, y + h - 6, w - 20);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const hit = cardRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (hit) selected = hit.k;
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
