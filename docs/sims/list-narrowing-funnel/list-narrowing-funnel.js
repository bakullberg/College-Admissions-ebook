// List Narrowing Funnel
// CANVAS_HEIGHT: 600
// Marcus's 18-college long list goes through three passes:
//   Pass 1: Fit — cut colleges that are out of reach financially, weak in CS, or fail a campus priority
//   Pass 2: Balance — trim a crowded reach category to three (stretch-cost reaches go first)
//   Pass 3: Picture yourself — cut any college he can't say why he wants
// "Let me decide" switches to manual cuts with a reason for each. College names are fictional.

let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let pass1Button, pass2Button, pass3Button, resetButton, manualBox, reasonSelect, reasonLabel;

const REASONS = ['Out of reach financially', 'Weak in my major', 'Fails campus priority', 'Too many in this category', "Can't say why I want it"];
const CAT_LETTER = ['R', 'T', 'S'];
const CAT_COLOR = ['rebeccapurple', 'royalblue', 'seagreen'];
const FIN_COLOR = { A: 'limegreen', S: 'gold', O: 'red' };
const FIN_NAME = { A: 'Affordable', S: 'Stretch', O: 'Out of reach' };

// name, category (0 R, 1 T, 2 S), financial fit, strong CS?, campus match?, campus note, knows why?
const LONG_LIST = [
  ['Pacific Tech Institute', 0, 'O', true, true, '', true],
  ['Eastbrook University', 0, 'A', true, false, 'two flights from home', true],
  ['Northgate University', 0, 'S', true, true, '', true],
  ['Summit College', 0, 'S', true, true, '', true],
  ['Ashford University', 0, 'A', true, true, '', true],
  ['Carver Institute', 0, 'A', true, true, '', true],
  ['Bellmont University', 0, 'A', true, true, '', true],
  ['Midland State', 1, 'A', true, true, '', true],
  ['Lakeshore University', 1, 'A', true, true, '', true],
  ['Ridgeview Polytechnic', 1, 'A', true, true, '', true],
  ['Coastline University', 1, 'O', true, true, '', true],
  ['Grandview College', 1, 'A', false, true, '', true],
  ['Metro State University', 1, 'A', true, false, '45,000 students: too large', true],
  ['Harbor University', 1, 'A', true, true, '', true],
  ['Cedar Valley University', 1, 'S', true, true, '', true],
  ['Oak Ridge College', 1, 'A', true, true, '', false],
  ['Hawkins State University', 2, 'A', true, true, '', true],
  ['Riverside State (in-state)', 2, 'A', true, true, '', true]
];

let cards = [];      // { name, cat, fin, major, campus, note, why, cut: null | {pass, reason}, confirm }
let passDone = 0;    // 0 = long list, 1..3 = passes finished
let log = [];        // { text, color }
let hoverCard = null;
let cardRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  pass1Button = createButton('Run Pass 1');
  pass1Button.mousePressed(() => runPass(1));
  pass2Button = createButton('Run Pass 2');
  pass2Button.mousePressed(() => runPass(2));
  pass3Button = createButton('Run Pass 3');
  pass3Button.mousePressed(() => runPass(3));
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);
  manualBox = createCheckbox(' Let me decide', false);
  manualBox.changed(resetAll);
  reasonLabel = createSpan('Reason for my cuts:');
  reasonLabel.style('font-size', '14px');
  reasonSelect = createSelect();
  REASONS.forEach(r => reasonSelect.option(r));

  resetAll();
  describe('A college list narrowing funnel. Eighteen college cards pass through three narrowing passes: fit, balance, and picturing yourself there. Cut cards gray out with their reason in a cut log, and the final list is checked for balance.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([pass1Button, pass2Button, pass3Button, resetButton, manualBox], 10, y, 30) + 34;
  if (manualBox.checked()) { reasonLabel.show(); reasonSelect.show(); flowRow([reasonLabel, reasonSelect], 10, y, 30); }
  else { reasonLabel.hide(); reasonSelect.hide(); }
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

function resetAll() {
  cards = LONG_LIST.map(c => ({ name: c[0], cat: c[1], fin: c[2], major: c[3], campus: c[4], note: c[5], why: c[6], cut: null, confirm: false }));
  passDone = 0;
  log = [{ text: manualBox.checked()
    ? 'Manual mode: click cards to cut them during each pass, choosing a reason first. Then press Finish Pass.'
    : 'Marcus\'s long list: 18 colleges. Press Run Pass 1.', color: 'dimgray' }];
  updateButtons();
  positionControls();
}

function updateButtons() {
  const manual = manualBox.checked();
  [pass1Button, pass2Button, pass3Button].forEach((b, i) => {
    b.html((manual ? 'Finish Pass ' : 'Run Pass ') + (i + 1));
    if (i === passDone) b.removeAttribute('disabled');
    else b.attribute('disabled', '');
  });
}

function kept() {
  return cards.filter(c => !c.cut);
}

function cutCard(c, pass, reason) {
  c.cut = { pass, reason };
  log.push({ text: 'Pass ' + pass + ': cut ' + c.name + ' — ' + reason + (c.note && reason === 'Fails campus priority' ? ' (' + c.note + ')' : ''), color: 'firebrick' });
}

function runPass(p) {
  if (p !== passDone + 1) return;
  if (!manualBox.checked()) {
    if (p === 1) {
      kept().forEach(c => {
        if (c.fin === 'O') cutCard(c, 1, 'Out of reach financially');
        else if (!c.major) cutCard(c, 1, 'Weak in my major');
        else if (!c.campus) cutCard(c, 1, 'Fails campus priority');
      });
    } else if (p === 2) {
      // trim reaches to three, cutting stretch-cost reaches first
      let reaches = kept().filter(c => c.cat === 0);
      reaches.sort((a, b) => (a.fin === 'S' ? -1 : 0) - (b.fin === 'S' ? -1 : 0));
      while (reaches.length > 3) cutCard(reaches.shift(), 2, 'Too many in this category');
    } else {
      kept().forEach(c => { if (!c.why) cutCard(c, 3, "Can't say why I want it"); });
    }
  }
  passDone = p;
  const k = kept();
  const counts = [0, 1, 2].map(i => k.filter(c => c.cat === i).length);
  log.push({ text: 'After Pass ' + p + ': ' + k.length + ' colleges (' + counts[0] + ' reach, ' + counts[1] + ' target, ' + counts[2] + ' safety).', color: 'navy' });
  if (p === 2 && counts[2] < 3) log.push({ text: 'Note: one more safety would help.', color: 'darkorange' });
  updateButtons();
}

// In manual mode, clicking a kept card during an open pass cuts it with the chosen reason
function manualCut(c) {
  if (!manualBox.checked() || passDone >= 3 || c.cut) return;
  const fitsAll = c.fin !== 'O' && c.major && c.campus && c.why;
  if (fitsAll && !c.confirm) {
    c.confirm = true;
    log.push({ text: 'Are you sure? ' + c.name + ' fits every priority. Click it again to cut it anyway.', color: 'darkorange' });
    return;
  }
  cutCard(c, passDone + 1, reasonSelect.value());
}

function balanceChecks() {
  const k = kept();
  const n = k.length;
  const counts = [0, 1, 2].map(i => k.filter(c => c.cat === i).length);
  const goodSafety = k.some(c => c.cat === 2 && c.fin === 'A');
  return [
    [n >= 8 && n <= 12, '8–12 total (' + n + ')'],
    [counts[0] >= 2 && counts[0] <= 3, '2–3 reach (' + counts[0] + ')'],
    [counts[1] >= 4 && counts[1] <= 6, '4–6 target (' + counts[1] + ')'],
    [counts[2] >= 2 && counts[2] <= 3, '2–3 safety (' + counts[2] + ')'],
    [goodSafety, 'At least one affordable safety']
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
  text('Narrowing the List', canvasWidth / 2, 8);

  const wide = canvasWidth >= 760;
  if (wide) {
    drawFunnel(margin, 40, 150, 250);
    drawCards(170, 40, canvasWidth - 170 - 250, 300);
    drawLog(canvasWidth - 240, 40, 230, drawHeight - 50);
    drawSummary(margin, 350, canvasWidth - 260, drawHeight - 360);
  } else {
    drawStageStrip(margin, 38, canvasWidth - 2 * margin);
    drawCards(margin, 66, canvasWidth - 2 * margin, 262);
    drawLog(margin, 334, canvasWidth - 2 * margin, 86);
    drawSummary(margin, 426, canvasWidth - 2 * margin, drawHeight - 434);
  }
  drawHoverTip();
  cursor(hoverCard && manualBox.checked() && !hoverCard.cut && passDone < 3 ? HAND : ARROW);
}

function countAfter(p) {
  return cards.filter(c => !c.cut || c.cut.pass > p).length;
}

function drawFunnel(x, y, w, h) {
  const bands = ['Pass 1: Fit', 'Pass 2: Balance', 'Pass 3: Picture yourself'];
  const shades = ['lightsteelblue', 'cornflowerblue', 'royalblue'];
  const bh = h / 4;
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Long list: 18', x + w / 2, y);
  textStyle(NORMAL);
  bands.forEach((b, i) => {
    const top = y + 20 + i * bh, inset1 = i * 14, inset2 = (i + 1) * 14;
    fill(shades[i]);
    if (passDone === i) { stroke('goldenrod'); strokeWeight(3); } else noStroke();
    quad(x + inset1, top, x + w - inset1, top, x + w - inset2, top + bh - 4, x + inset2, top + bh - 4);
    strokeWeight(1);
    noStroke();
    fill(i === 2 ? 'white' : 'black');
    textSize(12);
    textAlign(CENTER, CENTER);
    text(b + (passDone > i ? '\n→ ' + countAfter(i + 1) + ' left' : ''), x + inset2, top, w - 2 * inset2, bh - 4);
  });
  const ty = y + 20 + 3 * bh + 4;
  fill(passDone === 3 ? 'honeydew' : 'whitesmoke');
  stroke(passDone === 3 ? 'seagreen' : 'silver');
  rect(x + 42, ty, w - 84, 34, 6);
  noStroke();
  fill(passDone === 3 ? 'seagreen' : 'gray');
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text('Final list' + (passDone === 3 ? ': ' + kept().length : ''), x + 42, ty, w - 84, 34);
  textStyle(NORMAL);
}

function drawStageStrip(x, y, w) {
  noStroke();
  fill('navy');
  textAlign(LEFT, TOP);
  textSize(13);
  const stages = ['Long list 18', 'Pass 1 → ' + (passDone >= 1 ? countAfter(1) : '?'), 'Pass 2 → ' + (passDone >= 2 ? countAfter(2) : '?'), 'Pass 3 → ' + (passDone >= 3 ? countAfter(3) : '?')];
  text(stages.join('   ›   '), x, y + 4, w);
}

function drawCards(x, y, w, h) {
  cardRects = [];
  hoverCard = null;
  const cols = 2;
  const cw = (w - 6) / cols;
  const ch = min(30, (h - 4) / ceil(cards.length / cols) - 3);
  cards.forEach((c, i) => {
    const cx = x + (i % cols) * (cw + 6);
    const cy = y + floor(i / cols) * (ch + 3);
    cardRects.push({ c, x: cx, y: cy, w: cw, h: ch });
    const over = mouseX > cx && mouseX < cx + cw && mouseY > cy && mouseY < cy + ch;
    if (over) hoverCard = c;
    const final = passDone === 3 && !c.cut;
    stroke(final ? 'seagreen' : (c.confirm && !c.cut ? 'darkorange' : (over ? 'navy' : 'gainsboro')));
    strokeWeight(final ? 2 : 1);
    fill(c.cut ? 'gainsboro' : (final ? 'honeydew' : 'white'));
    rect(cx, cy, cw, ch, 5);
    strokeWeight(1);
    noStroke();
    // category letter
    fill(c.cut ? 'gray' : CAT_COLOR[c.cat]);
    rect(cx + 3, cy + 3, 18, ch - 6, 3);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    text(CAT_LETTER[c.cat], cx + 12, cy + ch / 2);
    textStyle(NORMAL);
    // name
    fill(c.cut ? 'gray' : 'black');
    textAlign(LEFT, CENTER);
    textSize(cw < 190 ? 11 : 12);
    let label = c.name;
    while (textWidth(label) > cw - 82 && label.length > 4) label = label.slice(0, -2);
    if (label !== c.name) label = label.slice(0, -1) + '…';
    text(label, cx + 26, cy + ch / 2);
    if (c.cut) {
      stroke('gray');
      line(cx + 26, cy + ch / 2, cx + 26 + textWidth(label), cy + ch / 2);
      noStroke();
    }
    // icons: financial dot, CS star, campus check
    const ix = cx + cw - 50;
    fill(c.cut ? 'silver' : FIN_COLOR[c.fin]);
    circle(ix, cy + ch / 2, 10);
    fill(c.cut ? 'silver' : (c.major ? 'goldenrod' : 'white'));
    stroke(c.cut ? 'silver' : 'goldenrod');
    star(ix + 18, cy + ch / 2, 3, 7);
    noStroke();
    fill(c.cut ? 'silver' : (c.campus ? 'seagreen' : 'firebrick'));
    textAlign(CENTER, CENTER);
    textSize(13);
    text(c.campus ? '✓' : '✗', ix + 36, cy + ch / 2);
  });
}

function star(x, y, r1, r2) {
  beginShape();
  for (let a = -HALF_PI, k = 0; k < 10; k++, a += PI / 5) {
    const r = k % 2 ? r1 : r2;
    vertex(x + cos(a) * r, y + sin(a) * r);
  }
  endShape(CLOSE);
}

function drawLog(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Cut log', x + 8, y + 6);
  textStyle(NORMAL);
  textSize(11);
  // show the most recent entries that fit
  const lineH = 14;
  const lines = [];
  log.forEach(e => {
    const n = max(1, ceil(textWidth(e.text) / (w - 16)));
    lines.push({ e, n });
  });
  let room = floor((h - 28) / lineH);
  const shown = [];
  for (let i = lines.length - 1; i >= 0 && room > 0; i--) {
    if (lines[i].n > room) break;
    shown.unshift(lines[i]);
    room -= lines[i].n;
  }
  let ly = y + 24;
  shown.forEach(l => {
    fill(l.e.color);
    text(l.e.text, x + 8, ly, w - 16, l.n * lineH + 2);
    ly += l.n * lineH;
  });
}

function drawSummary(x, y, w, h) {
  stroke('silver');
  fill(passDone === 3 ? 'honeydew' : 'white');
  rect(x, y, w, h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  if (passDone < 3) {
    fill('dimgray');
    textSize(12);
    text('Card icons: R/T/S category · dot = financial fit (green affordable, yellow stretch, red out of reach) · star = strong CS · ✓/✗ = campus match. Hover a card for details.',
         x + 8, y + 6, w - 16, h - 10);
    return;
  }
  fill('black');
  textSize(13);
  textStyle(BOLD);
  text('Final list balance check', x + 8, y + 6);
  textStyle(NORMAL);
  textSize(12);
  const checks = balanceChecks();
  let cx = x + 8, cy = y + 26;
  checks.forEach(([ok, label]) => {
    const s = (ok ? '✓ ' : '⚠ ') + label;
    const tw = textWidth(s) + 14;
    if (cx + tw > x + w - 8) { cx = x + 8; cy += 16; }
    fill(ok ? 'seagreen' : 'darkorange');
    text(s, cx, cy);
    cx += tw;
  });
}

function drawHoverTip() {
  if (!hoverCard) return;
  const c = hoverCard;
  const lines = [c.name, ['Reach', 'Target', 'Safety'][c.cat] + ' · ' + FIN_NAME[c.fin],
    (c.major ? 'Strong' : 'Weak') + ' computer science program',
    c.campus ? 'Meets campus priorities' : 'Fails a campus priority: ' + c.note,
    c.why ? '' : 'Marcus can\'t say why he wants it',
    c.cut ? 'Cut in Pass ' + c.cut.pass + ': ' + c.cut.reason : ''].filter(Boolean);
  textSize(12);
  const tw = max(...lines.map(l => textWidth(l))) + 16;
  const th = lines.length * 16 + 8;
  const tx = constrain(mouseX + 12, 4, canvasWidth - tw - 4);
  const ty = constrain(mouseY + 12, 4, drawHeight - th - 4);
  stroke('gray');
  fill('lightyellow');
  rect(tx, ty, tw, th, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  lines.forEach((l, i) => {
    textStyle(i === 0 ? BOLD : NORMAL);
    text(l, tx + 8, ty + 5 + i * 16);
  });
  textStyle(NORMAL);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const hit = cardRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (hit) manualCut(hit.c);
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
