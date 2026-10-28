// Senior Schedule Balance
// CANVAS_HEIGHT: 520
// Rigor signal: count AP/IB and dual-enrollment courses (honors count half).
//   < 1 Light · 1–1.5 Moderate · 2–2.5 Demanding · 3–4.5 Very demanding · 5+ Most demanding
//   Fewer than four core subjects drops the signal one band and shows a warning.
// Weekly load: homework hours per course (Regular 3, Honors 4, AP/IB 6, Dual enrollment 6,
//   Elective 2, Free period 0) plus job, activity, and application hours.
//   < 35 Sustainable · 35–49 Heavy · 50+ Burnout risk (also 6 AP/IB with more than 15 job/activity hours).

let canvasWidth = 400;
let drawHeight = 250;
let controlHeight = 270;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 290;
let defaultTextSize = 16;

const LEVELS = ['Regular', 'Honors', 'AP/IB', 'Dual enrollment', 'Elective', 'Free period'];
const HOURS = { 'Regular': 3, 'Honors': 4, 'AP/IB': 6, 'Dual enrollment': 6, 'Elective': 2, 'Free period': 0 };
const RIGOR = ['Light', 'Moderate', 'Demanding', 'Very demanding', 'Most demanding'];
const RIGOR_COLORS = ['gainsboro', 'honeydew', 'palegreen', 'mediumseagreen', 'seagreen'];

let slots = [];         // { label, level, core }
let jobSlider, activitySlider, appSlider;
let presetButtons = [];
let resetButton;

const PRESETS = {
  'Priya Draft 1': { slots: [['AP/IB', true], ['AP/IB', true], ['AP/IB', true], ['AP/IB', true], ['AP/IB', true], ['AP/IB', false]], job: 0, act: 6, app: 8 },
  'Priya Draft 2': { slots: [['AP/IB', true], ['AP/IB', true], ['AP/IB', true], ['AP/IB', true], ['Regular', true], ['Elective', false]], job: 0, act: 6, app: 8 },
  'Marcus': { slots: [['AP/IB', true], ['AP/IB', true], ['Dual enrollment', false], ['Dual enrollment', true], ['Regular', true], ['Elective', false]], job: 15, act: 0, app: 6 }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (let i = 0; i < 6; i++) {
    const label = createSpan('Course ' + (i + 1));
    label.style('font-size', '14px');
    const level = createSelect();
    LEVELS.forEach(l => level.option(l));
    const core = createCheckbox(' Core', i < 5);
    core.style('font-size', '14px');
    slots.push({ label, level, core });
  }
  jobSlider = createSlider(0, 25, 0, 1);
  activitySlider = createSlider(0, 20, 6, 1);
  appSlider = createSlider(0, 15, 6, 1);
  Object.keys(PRESETS).forEach(name => {
    const b = createButton(name);
    b.mousePressed(() => loadPreset(PRESETS[name]));
    presetButtons.push(b);
  });
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);

  resetAll();
  positionControls();
  describe('A senior schedule balance tool. Choose a level for six courses and mark core subjects, then set weekly job, activity, and application hours. Two gauges show the rigor signal the schedule sends and the estimated weekly load, with feedback combining both.');
}

function positionControls() {
  let y = drawHeight + 8;
  const narrow = canvasWidth < 560;
  // compact slot labels on narrow screens so two slots fit per line
  slots.forEach((s, i) => {
    s.label.html(narrow ? (i + 1) + '.' : 'Course ' + (i + 1));
    s.level.style('width', narrow ? '104px' : 'auto');
    const span = s.core.elt.querySelector('span');
    if (span) span.textContent = narrow ? '' : ' Core';
  });
  // keep each slot's three controls together by flowing slot groups
  let x = 10;
  slots.forEach(s => {
    const parts = [s.label, s.level, s.core];
    parts.forEach(p => { p.style('white-space', 'nowrap'); p.position(0, 0); });
    const w = parts.reduce((a, p) => a + (p.elt.offsetWidth || 80) + 4, 0) + 12;
    if (x > 10 && x + w > canvasWidth - 10) { x = 10; y += 30; }
    let px = x;
    parts.forEach(p => { p.position(px, y + (p === s.core ? 2 : 0)); px += (p.elt.offsetWidth || 80) + 4; });
    x += w;
  });
  y += 38;
  [jobSlider, activitySlider, appSlider].forEach((sl, k) => {
    sl.position(sliderLeftMargin, y + k * 32);
    sl.size(canvasWidth - sliderLeftMargin - margin);
  });
  slidersTop = y;
  y += 3 * 32 + 4;
  let bx = 10;
  [...presetButtons, resetButton].forEach(b => {
    b.position(bx, y);
    bx += (b.elt.offsetWidth || 90) + 8;
    if (bx > canvasWidth - 60) { bx = 10; y += 30; }
  });
}
let slidersTop = 0;

function loadPreset(p) {
  p.slots.forEach((s, i) => { slots[i].level.selected(s[0]); slots[i].core.checked(s[1]); });
  jobSlider.value(p.job);
  activitySlider.value(p.act);
  appSlider.value(p.app);
}

function resetAll() {
  slots.forEach((s, i) => { s.level.selected(i < 5 ? 'Regular' : 'Elective'); s.core.checked(i < 5); });
  jobSlider.value(0);
  activitySlider.value(6);
  appSlider.value(6);
}

function evaluate() {
  let adv = 0, apib = 0, core = 0, courseHours = 0;
  slots.forEach(s => {
    const l = s.level.value();
    if (l === 'AP/IB' || l === 'Dual enrollment') adv += 1;
    if (l === 'Honors') adv += 0.5;
    if (l === 'AP/IB') apib++;
    if (s.core.checked() && l !== 'Free period' && l !== 'Elective') core++;
    courseHours += HOURS[l];
  });
  let band = adv >= 5 ? 4 : adv >= 3 ? 3 : adv >= 2 ? 2 : adv >= 1 ? 1 : 0;
  const coreWarning = core < 4;
  if (coreWarning) band = max(0, band - 1);
  const job = jobSlider.value(), act = activitySlider.value(), app = appSlider.value();
  const load = courseHours + job + act + app;
  const comboBurnout = apib >= 6 && job + act > 15;
  const loadBand = (load >= 50 || comboBurnout) ? 2 : (load >= 35 ? 1 : 0);
  return { adv, core, band, coreWarning, load, loadBand, comboBurnout, courseHours };
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
  text('Senior Schedule Balance', canvasWidth / 2, 8);

  const e = evaluate();
  const wide = canvasWidth >= 620;
  const gw = wide ? (canvasWidth - 3 * margin) / 2 : canvasWidth - 2 * margin;
  drawRigorGauge(margin, 42, gw, e);
  drawLoadGauge(wide ? 2 * margin + gw : margin, wide ? 42 : 112, gw, e);

  // feedback
  const fy = wide ? 132 : 182;
  let msg, col = 'black';
  const rigorName = RIGOR[e.band].toLowerCase();
  if (e.loadBand === 2) {
    col = 'firebrick';
    msg = (e.band >= 3 ? capital(rigorName) + ' rigor, but this' : 'This') + ' load leaves little time for applications or sleep — consider swapping one AP for a regular course or cutting weekly hours.';
  } else if (e.loadBand === 1) {
    msg = capital(rigorName) + ' rigor with a heavy but manageable load.';
  } else {
    msg = capital(rigorName) + ' rigor with a sustainable load.' + (e.band <= 1 ? ' Could you add one more advanced course in a strong subject?' : '');
  }
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textSize(wide ? 15 : 13);
  textStyle(BOLD);
  text(msg, margin, fy, canvasWidth - 2 * margin, wide ? 44 : 50);
  textStyle(NORMAL);
  if (e.coreWarning) {
    fill('darkorange');
    textSize(13);
    text('⚠ Only ' + e.core + ' core subjects: dropping a core subject can weaken your application.', margin, fy + (wide ? 40 : 34), canvasWidth - 2 * margin);
  }
  fill('gray');
  textSize(11);
  textAlign(LEFT, BOTTOM);
  if (wide) text('Hour estimates are rough averages; your courses may differ. Core = English, math, science, social studies, world language.', margin, drawHeight - 6, canvasWidth - 2 * margin);

  // slider labels
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  const short = canvasWidth < 560;
  textSize(short ? 14 : 15);
  text((short ? 'Job hrs/week: ' : 'Job hours per week: ') + jobSlider.value(), 10, slidersTop + 10);
  text((short ? 'Activity hrs/week: ' : 'Sport or activity hours per week: ') + activitySlider.value(), 10, slidersTop + 42);
  text((short ? 'Applications hrs/wk: ' : 'Application work hours per week: ') + appSlider.value(), 10, slidersTop + 74);
  if (short) {
    // the core checkboxes have no labels on narrow screens, so name the column once
    fill('dimgray');
    textSize(11);
    textAlign(LEFT, TOP);
    text('☑ = core subject', canvasWidth - 110, drawHeight + 2);
  }
}

function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function drawRigorGauge(x, y, w, e) {
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Rigor signal: ' + RIGOR[e.band], x, y);
  textStyle(NORMAL);
  const segW = w / 5;
  RIGOR.forEach((r, i) => {
    stroke(i === e.band ? 'goldenrod' : 'white');
    strokeWeight(i === e.band ? 3 : 1);
    fill(RIGOR_COLORS[i]);
    rect(x + i * segW + 1, y + 22, segW - 2, 26, 4);
    strokeWeight(1);
    noStroke();
    fill(i >= 3 ? 'white' : 'black');
    textAlign(CENTER, CENTER);
    textSize(w < 360 ? 9 : 11);
    text(r, x + i * segW + 2, y + 22, segW - 4, 26);
  });
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  text(nf(e.adv, 1, 1).replace('.0', '') + ' advanced course' + (e.adv === 1 ? '' : 's') + ' · ' + e.core + ' core subjects', x, y + 52);
}

function drawLoadGauge(x, y, w, e) {
  const names = ['Sustainable', 'Heavy', 'Burnout risk'];
  const cols = ['seagreen', 'goldenrod', 'firebrick'];
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Weekly load: ' + e.load + ' hours · ' + names[e.loadBand], x, y);
  textStyle(NORMAL);
  const maxH = 80;
  const bx = x, bw = w;
  // background bands at 0–35, 35–50, 50–80
  const px = h => bx + bw * min(h, maxH) / maxH;
  noStroke();
  fill(220, 240, 225); rect(px(0), y + 22, px(35) - px(0), 26);
  fill(250, 240, 200); rect(px(35), y + 22, px(50) - px(35), 26);
  fill(250, 215, 215); rect(px(50), y + 22, px(maxH) - px(50), 26);
  fill(cols[e.loadBand]);
  rect(bx, y + 30, px(e.load) - bx, 10, 3);
  fill('dimgray');
  textSize(11);
  textAlign(CENTER, TOP);
  [0, 35, 50, 80].forEach(v => text(v, constrain(px(v), bx + 6, bx + bw - 8), y + 50));
  textAlign(LEFT, TOP);
  textSize(12);
  if (e.comboBurnout) {
    fill('firebrick');
    text('Six AP/IB courses plus more than 15 job or activity hours', x + 30, y + 50);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  sliderLeftMargin = canvasWidth < 560 ? 175 : 290;
}
