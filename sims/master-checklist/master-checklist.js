// Master Checklist
// CANVAS_HEIGHT: 640
// Every step of the admissions process, in twelve stages taken from the Chapter 20 planner.
// Scout the Turtle walks the road as steps get done. Finishing a stage sets off confetti, and
// finishing everything opens a celebration screen. Steps that not every student needs have a
// "Doesn't apply to me" box, so 100% is reachable on any path.
// Your checks are saved in this browser (localStorage) when storage is available.

let canvasWidth = 400;
let drawHeight = 210;
let controlHeight = 430;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

const STORAGE_KEY = 'master-checklist-v1';
const MASCOT_PATH = '../../img/mascot/';

const CHAPTER_SLUGS = {
  3: '03-finding-your-fit', 4: '04-researching-your-list', 5: '05-getting-organized',
  6: '06-sat-act-question', 7: '07-senior-year-course-load', 8: '08-activities-and-resume',
  9: '09-personal-essay', 10: '10-supplemental-essays', 11: '11-letters-of-recommendation',
  12: '12-common-app-coalition-app', 14: '14-understanding-financial-aid', 15: '15-scholarships',
  16: '16-comparing-award-letters', 17: '17-waiting-and-anxiety', 18: '18-handling-decisions',
  19: '19-making-your-final-choice', 20: '20-getting-ready-for-fall'
};

// opt: true adds the "Doesn't apply to me" box
const STAGES = [
  { name: 'Spring of junior year', done: 'Spring is done. You know what you want to look for, and you have people in your corner.', items: [
    { id: 'self-assessment', label: 'Do your self-assessment', ch: 3 },
    { id: 'long-list', label: 'Start your long college list', ch: 4 },
    { id: 'first-test', label: 'Take your first SAT or ACT', ch: 6, opt: true },
    { id: 'ask-teachers', label: 'Ask two teachers for letters', ch: 11, opt: true },
    { id: 'counselor', label: 'Meet with your counselor', ch: 5 }
  ]},
  { name: 'Summer before senior year', done: 'Summer is done. A rough draft beats a blank page every time.', items: [
    { id: 'visit', label: 'Visit colleges', ch: 4, opt: true },
    { id: 'narrow', label: 'Narrow your long list', ch: 4 },
    { id: 'common-app', label: 'Open your Common App account', ch: 5, opt: true },
    { id: 'resume', label: 'Draft your activities resume', ch: 8 },
    { id: 'essay-draft', label: 'Draft your personal essay', ch: 9 }
  ]},
  { name: 'August and September', done: 'August and September are done. Your list is set. Slow and steady gets you there.', items: [
    { id: 'final-list', label: 'Finalize your college list', ch: 4 },
    { id: 'plan-supplements', label: 'Plan your supplemental essays', ch: 10, opt: true },
    { id: 'packets', label: 'Send your recommender packets', ch: 11, opt: true },
    { id: 'transcripts', label: 'Request your transcripts', ch: 12 },
    { id: 'schedule', label: 'Confirm your senior schedule', ch: 7 }
  ]},
  { name: 'October', done: 'October is done. That\'s a big month behind you.', items: [
    { id: 'retest', label: 'Retest, if you planned to', ch: 6, opt: true },
    { id: 'early-apps', label: 'Finish your early applications', ch: 12, opt: true },
    { id: 'fafsa', label: 'File the FAFSA', ch: 14, opt: true },
    { id: 'css', label: 'Complete the CSS Profile, if required', ch: 14, opt: true }
  ]},
  { name: 'November', done: 'November is done. Take a breath. You\'ve earned it.', items: [
    { id: 'submit-early', label: 'Submit your early applications', ch: 12, opt: true },
    { id: 'regular-supplements', label: 'Keep working on regular supplements', ch: 10, opt: true }
  ]},
  { name: 'December', done: 'December is done. One step at a time, and look how many that is.', items: [
    { id: 'early-decisions', label: 'Read your early decisions', ch: 18, opt: true },
    { id: 'deferrals', label: 'Respond to any deferrals', ch: 18, opt: true },
    { id: 'december-apps', label: 'Submit applications due this month', ch: 12, opt: true },
    { id: 'aid-priority', label: 'Meet aid priority deadlines', ch: 14, opt: true }
  ]},
  { name: 'January', done: 'January is done. Most of the application deadlines are behind you now.', items: [
    { id: 'regular-apps', label: 'Submit remaining regular applications', ch: 12, opt: true },
    { id: 'mid-year', label: 'Confirm your mid-year report was sent', ch: 7 },
    { id: 'css-deadlines', label: 'Meet CSS Profile deadlines', ch: 14, opt: true },
    { id: 'start-scholarships', label: 'Start your scholarship applications', ch: 15, opt: true }
  ]},
  { name: 'February', done: 'February is done. You kept going through the quiet part, and that counts.', items: [
    { id: 'finish-scholarships', label: 'Finish your scholarship applications', ch: 15, opt: true },
    { id: 'verification', label: 'Respond to aid verification, if asked', ch: 14, opt: true },
    { id: 'grades', label: 'Keep your grades strong', ch: 7 },
    { id: 'rest', label: 'Use the lull to rest', ch: 17 }
  ]},
  { name: 'March', done: 'March is done. You looked at your options carefully. That takes some nerve.', items: [
    { id: 'regular-decisions', label: 'Read your regular decisions', ch: 18 },
    { id: 'award-letters', label: 'Read and compare your award letters', ch: 16, opt: true }
  ]},
  { name: 'April', done: 'April is done. You weighed it all, and the decision is yours.', items: [
    { id: 'admitted-days', label: 'Go to admitted student days', ch: 19, opt: true },
    { id: 'appeal', label: 'Appeal your aid, if it makes sense', ch: 16, opt: true },
    { id: 'decide', label: 'Compare your options and decide', ch: 19 }
  ]},
  { name: 'May', done: 'May is done. You can see the end of the road from here.', items: [
    { id: 'deposit', label: 'Pay your deposit (usually by May 1)', ch: 19 },
    { id: 'decline', label: 'Decline your other offers', ch: 19, opt: true },
    { id: 'waitlist', label: 'Write any waitlist letters', ch: 18, opt: true },
    { id: 'ap-exams', label: 'Take your AP exams', ch: 7, opt: true },
    { id: 'housing', label: 'Start housing and orientation', ch: 20, opt: true }
  ]},
  { name: 'June to August', done: 'The last stop is done. Anything left unchecked? Let\'s check the map.', items: [
    { id: 'ap-send', label: 'Use your free AP score send by June 20', ch: 20, opt: true },
    { id: 'final-transcript', label: 'Confirm your final transcript was sent', ch: 20 },
    { id: 'registration', label: 'Finish orientation and registration', ch: 20 },
    { id: 'health-forms', label: 'Turn in your health forms', ch: 20, opt: true },
    { id: 'college-email', label: 'Check your college email every week', ch: 20 },
    { id: 'move-in', label: 'Move in', ch: 20, opt: true }
  ]}
];

const STEP_CHEERS = ['One step at a time.', 'Nice. That one\'s done.', 'Slow and steady gets you there.', 'Good. Let\'s check the map.', 'Another one down.', 'Keep that pace. It\'s working.'];
const MILESTONES = { 1: 'A quarter of the way there. Look how far you\'ve come.', 2: 'Halfway there. Scout is impressed, and turtles don\'t rush to judgment.', 3: 'Three quarters done. The end of the road is in sight.' };
const CONFETTI_COLORS = ['#3f51b5', '#ff9800', '#2e8b57', '#ffc107', '#e91e63', '#7986cb'];

let rows = [];      // one per item: { item, stage, box, na, link }
let state = {};     // item id -> 0 open, 1 done, 2 doesn't apply
let stage = 0;
let highlight = null;
let message = 'Check off a step to get rolling. One step at a time.';
let messageColor = 'black';
let cheerIndex = 0;
let stageSelect, prevButton, nextButton, whatsNextButton, resetButton, celebrateButton;
let againButton, backButton;
let scoutImg = null, celebrateImg = null;
let confetti = [];
let finale = false;
let finaleBursts = 0;
let bounce = 0;
let scoutPos = 0;
let storageOK = true;
let reducedMotion = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Loaded here rather than in preload() so a missing image never blocks the checklist
  loadImage(MASCOT_PATH + 'neutral.png', img => { scoutImg = img; }, () => {});
  loadImage(MASCOT_PATH + 'celebration.png', img => { celebrateImg = img; }, () => {});

  state = loadState();

  stageSelect = createSelect();
  STAGES.forEach((s, i) => stageSelect.option((i + 1) + '. ' + s.name, String(i)));
  stageSelect.style('font-size', '15px');
  stageSelect.changed(() => goToStage(stageSelect.elt.selectedIndex));
  prevButton = createButton('◀');
  prevButton.attribute('aria-label', 'Previous stage');
  prevButton.mousePressed(() => goToStage(stage - 1));
  nextButton = createButton('▶');
  nextButton.attribute('aria-label', 'Next stage');
  nextButton.mousePressed(() => goToStage(stage + 1));

  STAGES.forEach((s, si) => s.items.forEach(item => {
    const box = createCheckbox(' ' + item.label, state[item.id] === 1);
    box.style('font-size', '15px');
    box.changed(() => setItem(item, box.checked() ? 1 : 0));
    const link = createA('../../chapters/' + CHAPTER_SLUGS[item.ch] + '/', 'Chapter ' + item.ch, '_parent');
    link.style('font-size', '12px');
    link.style('color', 'steelblue');
    let na = null;
    if (item.opt) {
      na = createCheckbox(" Doesn't apply to me", state[item.id] === 2);
      na.style('font-size', '12px');
      na.style('color', 'dimgray');
      na.changed(() => setItem(item, na.checked() ? 2 : 0));
    }
    rows.push({ item, stage: si, box, na, link });
  }));

  whatsNextButton = createButton("Show me what's next");
  whatsNextButton.mousePressed(showWhatsNext);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);
  celebrateButton = createButton('See your celebration');
  celebrateButton.mousePressed(() => openFinale());
  againButton = createButton('Celebrate again');
  againButton.mousePressed(() => openFinale());
  backButton = createButton('Back to my checklist');
  backButton.mousePressed(closeFinale);

  // Open on the first stage with something left to do
  const open = firstOpenStage();
  stage = open >= 0 ? open : 0;
  if (open < 0) showMessage('Every step is done. You did this, one step at a time.', 'seagreen');
  else if (doneCount() > 0) showMessage('Welcome back. Next up: ' + STAGES[stage].name + '.', 'black');
  scoutPos = doneCount() / rows.length;

  refreshControls();
  describe('A master checklist of every college admissions step, grouped into twelve stages from spring of junior year to move-in. A road with twelve stops shows progress, with Scout the Turtle walking along it. Finishing a stage sets off confetti, and finishing every stage opens a celebration screen.');
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    storageOK = false;
    return {};
  }
}

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    storageOK = false;
  }
}

function isResolved(item) { return state[item.id] === 1 || state[item.id] === 2; }
function doneCount() { return rows.filter(r => isResolved(r.item)).length; }
function stageComplete(i) { return STAGES[i].items.every(isResolved); }
function firstOpenStage() { return STAGES.findIndex(s => !s.items.every(isResolved)); }

function setItem(item, value) {
  const wasStageDone = stageComplete(rows.find(r => r.item === item).stage);
  const wasAllDone = doneCount() === rows.length;
  const wasQuarter = floor(doneCount() / rows.length * 4);
  const si = rows.find(r => r.item === item).stage;

  state[item.id] = value;
  saveState();
  highlight = null;

  const nowQuarter = floor(doneCount() / rows.length * 4);
  if (doneCount() === rows.length && !wasAllDone) {
    openFinale();
  } else if (stageComplete(si) && !wasStageDone) {
    showMessage(STAGES[si].done, 'seagreen');
    burst(160, canvasWidth / 2, 0);
    bounce = 1;
  } else if (nowQuarter > wasQuarter && MILESTONES[nowQuarter]) {
    showMessage(MILESTONES[nowQuarter], 'darkgoldenrod');
    burst(70, canvasWidth / 2, 0);
    bounce = 1;
  } else if (value === 1) {
    showMessage(STEP_CHEERS[cheerIndex++ % STEP_CHEERS.length], 'black');
    const p = roadPoint(scoutPos * (STAGES.length - 1));
    burst(14, p.x, p.y - 20);
    bounce = 1;
  }
  refreshControls();
}

function showMessage(text, color) {
  message = text;
  messageColor = color;
}

function goToStage(i) {
  stage = constrain(i, 0, STAGES.length - 1);
  highlight = null;
  refreshControls();
}

function showWhatsNext() {
  const open = firstOpenStage();
  if (open < 0) { openFinale(); return; }
  stage = open;
  highlight = STAGES[open].items.find(it => !isResolved(it)).id;
  showMessage('Here\'s your next step. Just this one for now.', 'black');
  refreshControls();
}

function resetAll() {
  if (!window.confirm('Clear every check on your master checklist?')) return;
  state = {};
  saveState();
  stage = 0;
  highlight = null;
  confetti = [];
  showMessage('A fresh start. One step at a time.', 'black');
  refreshControls();
}

function openFinale() {
  finale = true;
  finaleBursts = reducedMotion ? 0 : 5;
  burst(240, canvasWidth / 2, 0);
  refreshControls();
}

function closeFinale() {
  finale = false;
  confetti = [];
  showMessage('Every step is done. You did this, one step at a time.', 'seagreen');
  refreshControls();
}

// Brings every DOM control in line with the current state and positions it
function refreshControls() {
  const lineUp = el => { finale ? el.hide() : el.show(); };
  [stageSelect, prevButton, nextButton, resetButton].forEach(lineUp);
  rows.forEach(r => {
    const visible = !finale && r.stage === stage;
    [r.box, r.link].concat(r.na ? [r.na] : []).forEach(el => { visible ? el.show() : el.hide(); });
    const v = state[r.item.id];
    r.box.checked(v === 1);
    if (r.na) r.na.checked(v === 2);
    r.box.elt.querySelector('input').disabled = v === 2;
    r.box.style('color', v === 1 || v === 2 ? 'gray' : 'black');
    r.box.style('text-decoration', v === 1 || v === 2 ? 'line-through' : 'none');
    r.box.style('background', r.item.id === highlight ? 'gold' : 'none');
    r.box.style('border-radius', '4px');
    r.box.style('padding', '0 4px');
  });
  STAGES.forEach((s, i) => {
    stageSelect.elt.options[i].text = (i + 1) + '. ' + s.name + (stageComplete(i) ? ' ✓' : '');
  });
  stageSelect.elt.selectedIndex = stage;
  prevButton.elt.disabled = stage === 0;
  nextButton.elt.disabled = stage === STAGES.length - 1;
  const allDone = doneCount() === rows.length;
  allDone && !finale ? celebrateButton.show() : celebrateButton.hide();
  !allDone && !finale ? whatsNextButton.show() : whatsNextButton.hide();
  finale ? againButton.show() : againButton.hide();
  finale ? backButton.show() : backButton.hide();
  positionControls();
}

function positionControls() {
  const y0 = drawHeight + 10;
  prevButton.position(10, y0);
  stageSelect.position(46, y0);
  const selectW = min(canvasWidth - 96, 250);
  stageSelect.style('width', selectW + 'px');
  nextButton.position(46 + selectW + 6, y0);

  const rowH = 54;
  rows.filter(r => r.stage === stage).forEach((r, i) => {
    const y = y0 + 40 + i * rowH;
    r.box.position(6, y);
    r.box.style('width', (canvasWidth - 30) + 'px');
    // Measured so a label that wraps on a very narrow screen can't cover its chapter link
    const subY = y + max(24, r.box.elt.offsetHeight + 2);
    r.link.position(34, subY);
    if (r.na) r.na.position(100, subY - 2);
  });

  // Once everything is done there's no next step, so the celebration button takes that spot
  const by = canvasHeight - 36;
  whatsNextButton.position(10, by);
  celebrateButton.position(10, by);
  resetButton.position(175, by);
  backButton.position(canvasWidth / 2 - 150, canvasHeight - 50);
  againButton.position(canvasWidth / 2 + 20, canvasHeight - 50);
}

function burst(count, x, y) {
  if (reducedMotion) return;
  for (let i = 0; i < count; i++) {
    const spreadAll = y === 0;
    confetti.push({
      x: spreadAll ? random(canvasWidth) : x,
      y: spreadAll ? random(-120, 0) : y,
      vx: spreadAll ? random(-1, 1) : random(-3, 3),
      vy: spreadAll ? random(1, 4) : random(-5, -1),
      size: random(5, 10),
      angle: random(TWO_PI),
      spin: random(-0.2, 0.2),
      color: random(CONFETTI_COLORS)
    });
  }
}

function drawConfetti() {
  noStroke();
  confetti.forEach(c => {
    c.vy += 0.09;
    c.x += c.vx;
    c.y += c.vy;
    c.angle += c.spin;
    push();
    translate(c.x, c.y);
    rotate(c.angle);
    fill(c.color);
    rect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
    pop();
  });
  confetti = confetti.filter(c => c.y < canvasHeight + 20);
  if (finale && finaleBursts > 0 && frameCount % 50 === 0) {
    burst(120, canvasWidth / 2, 0);
    finaleBursts--;
  }
}

// t runs from 0 (first stop) to 11 (last stop)
function roadPoint(t) {
  const left = margin + 16, right = canvasWidth - margin - 16;
  return { x: left + (right - left) * t / (STAGES.length - 1), y: 112 + 13 * sin(t * 1.05) };
}

function drawScout(img, cx, baseY, h) {
  if (img) {
    const w = h * img.width / img.height;
    image(img, cx - w / 2, baseY - h, w, h);
  } else {
    noStroke();
    fill('seagreen');
    ellipse(cx, baseY - h / 2, h * 0.8, h);
  }
}

function drawRoad() {
  noFill();
  stroke('gainsboro');
  strokeWeight(10);
  strokeCap(ROUND);
  beginShape();
  for (let t = 0; t <= STAGES.length - 1; t += 0.1) { const p = roadPoint(t); vertex(p.x, p.y); }
  endShape();
  const target = doneCount() / rows.length;
  scoutPos += (target - scoutPos) * (reducedMotion ? 1 : 0.08);
  stroke('steelblue');
  beginShape();
  for (let t = 0; t <= scoutPos * (STAGES.length - 1); t += 0.1) { const p = roadPoint(t); vertex(p.x, p.y); }
  endShape();
  strokeWeight(1);

  const r = canvasWidth < 500 ? 9 : 11;
  STAGES.forEach((s, i) => {
    const p = roadPoint(i);
    const complete = stageComplete(i);
    stroke(i === stage ? 'darkorange' : 'gray');
    strokeWeight(i === stage ? 3 : 1);
    fill(complete ? 'seagreen' : 'white');
    circle(p.x, p.y, r * 2);
    strokeWeight(1);
    noStroke();
    fill(complete ? 'white' : 'black');
    textAlign(CENTER, CENTER);
    textSize(canvasWidth < 500 ? 9 : 11);
    text(complete ? '✓' : i + 1, p.x, p.y);
  });

  // finish flag
  const end = roadPoint(STAGES.length - 1);
  stroke('dimgray');
  strokeWeight(2);
  line(end.x, end.y - r, end.x, end.y - r - 22);
  noStroke();
  fill('darkorange');
  triangle(end.x, end.y - r - 22, end.x, end.y - r - 11, end.x - 14, end.y - r - 16);

  if (bounce > 0.01) bounce *= 0.9;
  const hop = reducedMotion ? 0 : -abs(sin(bounce * 8)) * 12 * bounce;
  const sp = roadPoint(scoutPos * (STAGES.length - 1));
  drawScout(scoutImg, sp.x, sp.y - 4 + hop, 44);
}

function drawChecklistView() {
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const done = doneCount(), total = rows.length;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(canvasWidth < 500 ? 17 : 22);
  text('Your Master Checklist', margin, 10);
  textAlign(RIGHT, TOP);
  fill(done === total ? 'seagreen' : 'navy');
  textSize(canvasWidth < 500 ? 16 : 20);
  text(round(done / total * 100) + '%', canvasWidth - margin, 8);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(12);
  text(done + ' of ' + total + ' done', canvasWidth - margin, 32);

  drawRoad();

  // Scout's message
  const py = 146, ph = 54;
  stroke('silver');
  fill('white');
  rect(margin, py, canvasWidth - 2 * margin, ph, 10);
  noStroke();
  fill(messageColor);
  textAlign(LEFT, CENTER);
  textSize(canvasWidth < 500 ? 14 : 16);
  text(message, margin + 12, py + 4, canvasWidth - 2 * margin - 24, ph - 8);

  if (canvasWidth >= 520) {
    const items = STAGES[stage].items;
    fill('dimgray');
    textAlign(RIGHT, TOP);
    textSize(13);
    text(items.filter(isResolved).length + ' of ' + items.length + ' in this stage', canvasWidth - margin, drawHeight + 15);
  }
  if (!storageOK) {
    fill('gray');
    textSize(10);
    textAlign(RIGHT, BOTTOM);
    text('Progress won\'t be saved in this browser.', canvasWidth - margin, canvasHeight - 4);
  }
}

function drawFinale() {
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, canvasHeight);
  noStroke();
  textAlign(CENTER, TOP);
  fill('seagreen');
  textStyle(BOLD);
  textSize(canvasWidth < 500 ? 32 : 42);
  text('You did it!', canvasWidth / 2, 28);
  textStyle(NORMAL);
  drawScout(celebrateImg, canvasWidth / 2, 370, 290);
  const w = min(canvasWidth - 40, 600);
  fill('black');
  textSize(canvasWidth < 500 ? 16 : 19);
  text('Every step on your roadmap is done, from your first college list to move-in day. You did this, one step at a time.', canvasWidth / 2 - w / 2, 392, w);
  fill('dimgray');
  textSize(canvasWidth < 500 ? 14 : 16);
  text('Scout would run a victory lap, but it may take a while.', canvasWidth / 2 - w / 2, canvasWidth < 500 ? 500 : 470, w);
}

function draw() {
  textStyle(NORMAL);
  finale ? drawFinale() : drawChecklistView();
  drawConfetti();
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
