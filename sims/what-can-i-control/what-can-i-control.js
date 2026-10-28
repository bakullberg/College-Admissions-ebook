// What Can I Control?
// CANVAS_HEIGHT: 560
// Sort each waiting-period worry into "I can do something about this" or "Out of my hands."
// For controllable worries, edit the suggested next step and save it to "My plan," which is kept
// in this browser (localStorage) when storage is available.

let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

const STORAGE_KEY = 'what-can-i-control-plan-v1';

// pile: 'can' | 'out' | 'mixed'
const DECK = [
  { w: 'Did my recommendation get submitted?', pile: 'can', why: 'You can check, and you can ask.', step: 'Check each portal this weekend; if a letter is missing, politely ask the teacher.' },
  { w: 'How many people applied this year?', pile: 'out', why: 'The size of the applicant pool is completely out of your hands.' },
  { w: 'Will my mid-year grades hurt me?', pile: 'can', why: 'Your senior grades are still being earned, and many colleges see them.', step: 'Keep up with homework this semester and ask for help early in my hardest class.' },
  { w: 'Is the committee reading my essay right now?', pile: 'out', why: 'Once it\'s submitted, the reading happens without you.' },
  { w: 'Can my family afford any of these?', pile: 'can', why: 'You can\'t set prices, but you can get the information you need.', step: 'Finish the aid forms, run each net price calculator, and plan to compare award letters.' },
  { w: 'Did my friend get in already?', pile: 'out', why: 'Other people\'s decisions don\'t change yours. Consider muting the group chat for a while.' },
  { w: 'What if I get rejected everywhere?', pile: 'mixed', why: 'You can\'t control decisions, but you can remind yourself of your safeties and talk to your counselor about late-deadline options.', step: 'Reread my list\'s safeties and ask my counselor which colleges accept applications late.' },
  { w: 'Is my essay good enough?', pile: 'out', why: 'It\'s already submitted. Rereading it now won\'t change what readers see.' },
  { w: 'Did I miss a scholarship deadline?', pile: 'can', why: 'Scholarship season runs well into spring.', step: 'Check my tracker for every scholarship deadline in the next two months.' },
  { w: 'What if a college lost my test scores?', pile: 'can', why: 'Portals show what\'s missing.', step: 'Log in to each portal and resend scores to any college showing them missing.' },
  { w: 'Will the admissions officer like me?', pile: 'out', why: 'You put your best self in the file. How it\'s read is up to the reader.' },
  { w: 'I can\'t stop checking the portal.', pile: 'can', why: 'The decision date is fixed, but your habits aren\'t.', step: 'Check portals once a day, at one set time, and turn off the rest of the notifications.' },
  { w: 'What will I do if I\'m waitlisted?', pile: 'can', why: 'You can learn the steps now, so you\'re ready.', step: 'Read the waitlist steps in Chapter 18 and keep my other options open.' },
  { w: 'Is my high school\'s reputation hurting me?', pile: 'out', why: 'Readers judge you in the context of your school. That context is out of your hands and isn\'t a penalty.' }
];

let canButton, outButton, nextButton, saveButton, restartButton, stepInput, stepLabel;
let order = [], pos = 0;
let answered = null;
let plan = [];
let letGo = 0;
let storageOK = true;
let savedThisCard = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  canButton = createButton('I can do something about this');
  canButton.mousePressed(() => sortWorry('can'));
  outButton = createButton('Out of my hands');
  outButton.mousePressed(() => sortWorry('out'));
  nextButton = createButton('Next ▶');
  nextButton.mousePressed(next);
  restartButton = createButton('Start over');
  restartButton.mousePressed(startOver);
  stepLabel = createSpan('My next step:');
  stepLabel.style('font-size', '14px');
  stepInput = createInput('');
  saveButton = createButton('Save step');
  saveButton.mousePressed(saveStep);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    if (saved) { plan = saved.plan || []; letGo = saved.letGo || 0; }
  } catch (e) { storageOK = false; }

  order = shuffle([...Array(DECK.length).keys()]);
  positionControls();
  describe('A worry sorter for the waiting period. A card shows a worry. Choose I can do something about this or Out of my hands. For worries you can act on, edit a suggested next step and save it to My plan, which collects every saved step and counts the worries you let go.');
}

function persist() {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan, letGo })); } catch (e) { storageOK = false; }
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([canButton, outButton, nextButton, restartButton], 10, y, 30) + 34;
  const showStep = answered && DECK[order[pos]] && DECK[order[pos]].step && answered.pick !== 'out';
  [stepLabel, stepInput, saveButton].forEach(e => showStep ? e.show() : e.hide());
  if (showStep) {
    stepInput.size(max(150, canvasWidth - 230));
    flowRow([stepLabel, stepInput, saveButton], 10, y, 30);
  }
  const done = pos >= order.length;
  [canButton, outButton].forEach(b => (answered || done) ? b.attribute('disabled', '') : b.removeAttribute('disabled'));
  (answered && !done) ? nextButton.removeAttribute('disabled') : nextButton.attribute('disabled', '');
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

function sortWorry(pick) {
  if (answered || pos >= order.length) return;
  const card = DECK[order[pos]];
  answered = { pick, match: card.pile === 'mixed' || card.pile === pick };
  savedThisCard = false;
  if (pick === 'out' && card.pile !== 'can') { letGo++; persist(); }
  if (card.step) stepInput.value(card.step);
  positionControls();
}

function saveStep() {
  const s = stepInput.value().trim();
  if (!s || savedThisCard) return;
  plan.push(s);
  savedThisCard = true;
  persist();
}

function next() {
  pos++;
  answered = null;
  positionControls();
}

function startOver() {
  plan = [];
  letGo = 0;
  persist();
  order = shuffle(order);
  pos = 0;
  answered = null;
  positionControls();
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
  text('What Can I Control?', canvasWidth / 2, 8);

  const cw = min(600, canvasWidth - 2 * margin);
  const cx = (canvasWidth - cw) / 2;
  const done = pos >= order.length;
  const card = done ? null : DECK[order[pos]];

  // worry card
  stroke('mediumpurple');
  strokeWeight(2);
  fill('white');
  rect(cx, 42, cw, 70, 12);
  strokeWeight(1);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(canvasWidth < 480 ? 16 : 19);
  textStyle(ITALIC);
  text(done ? 'You\'ve sorted every worry. Your plan is below.' : '"' + card.w + '"', cx + 12, 42, cw - 24, 70);
  textStyle(NORMAL);
  fill('gray');
  textSize(11);
  textAlign(RIGHT, TOP);
  if (!done) text((pos + 1) + ' of ' + order.length, cx + cw - 10, 46);

  // the two piles
  const r = canvasWidth < 480 ? 46 : 54;
  const cy = 170;
  const lx = canvasWidth / 2 - r - 30, rx = canvasWidth / 2 + r + 30;
  const pickColor = k => answered && answered.pick === k ? (answered.match ? 'seagreen' : 'darkorange') : null;
  [[lx, 'I can do something about this', 'can', 'seagreen'], [rx, 'Out of my hands', 'out', 'slategray']].forEach(([x, label, k, col]) => {
    stroke(pickColor(k) || col);
    strokeWeight(pickColor(k) ? 4 : 2);
    fill(k === 'can' ? 'honeydew' : 'whitesmoke');
    circle(x, cy, 2 * r);
    strokeWeight(1);
    noStroke();
    fill(col);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(label, x - r + 10, cy - r + 10, 2 * r - 20, 2 * r - 20);
    textStyle(NORMAL);
  });

  // feedback
  const fy = cy + r + 12;
  if (answered && card) {
    const mixed = card.pile === 'mixed';
    const head = mixed ? '◐ A bit of both.' : (answered.match ? '✓ Yes.' : (card.pile === 'can' ? 'Actually, you can do something here.' : 'This one is out of your hands.'));
    fill(mixed ? 'darkorange' : (answered.match ? 'seagreen' : 'darkorange'));
    textAlign(LEFT, TOP);
    textSize(15);
    textStyle(BOLD);
    text(head, cx, fy, cw);
    textStyle(NORMAL);
    fill('black');
    textSize(14);
    text(card.why + (card.step && answered.pick === 'out' && card.pile === 'can' ? ' Try a small step: ' + card.step : '') +
         (card.step && answered.pick !== 'out' ? ' Edit the next step below and press Save step.' : ''), cx, fy + 22, cw, 60);
  } else if (!done) {
    fill('dimgray');
    textAlign(CENTER, TOP);
    textSize(14);
    text('Which pile does this worry belong in? Choose below.', cx, fy, cw);
  }

  // my plan
  const py = drawHeight - 118;
  stroke('silver');
  fill('white');
  rect(cx, py, cw, 110, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('My plan (' + plan.length + ' step' + (plan.length === 1 ? '' : 's') + ')   ·   Let go: ' + letGo, cx + 10, py + 6);
  textStyle(NORMAL);
  textSize(12);
  const shown = plan.slice(-4);
  if (!shown.length) { fill('dimgray'); text('Steps you save will collect here.', cx + 10, py + 28); }
  shown.forEach((s, i) => {
    fill('navy');
    let line = '• ' + s;
    while (textWidth(line) > cw - 24 && line.length > 10) line = line.slice(0, -2);
    if (line !== '• ' + s) line += '…';
    text(line, cx + 10, py + 28 + i * 19);
  });
  if (plan.length > 4) { fill('gray'); textSize(11); text('(showing your latest 4)', cx + 10, py + 94); }
  if (!storageOK) { fill('gray'); textSize(10); textAlign(RIGHT, TOP); text('Your plan won\'t be saved in this browser.', cx + cw - 8, py + 94); }
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
