// College Self-Assessment Builder
// CANVAS_HEIGHT: 560
// Five steps (Majors, Size, Setting, Culture, Cost), each with an importance slider (1–5) and a
// "This is a dealbreaker" box, then a profile that ranks the factors. Dealbreakers sit at the
// top with a lock; the summary names top priorities and flexible factors. Setting uses the
// higher of its two sliders (setting type and distance from home).

let canvasWidth = 400;
let drawHeight = 320;
let controlHeight = 240;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

const STEPS = ['Majors', 'Size', 'Setting', 'Culture', 'Cost', 'Your profile'];
const FACTORS = ['Major', 'Size', 'Setting', 'Culture', 'Cost'];
let step = 0;

// controls, grouped by step
let ui = [];          // ui[step] = array of rows; each row = array of p5 elements
let importance = [];  // importance sliders: [major, size, setting, distance, culture, cost]
let impLabels = [];
let deal = [];        // dealbreaker checkboxes per factor
let majorKnow, majorInput, sizeSelect, settingSelect, distanceSelect, cultureBoxes = [], costTalk, costAmount;
let backButton, nextButton, marcusButton, resetButton;

const stepHelp = [
  'What do you want to study? If you know your major, a college\'s strength in it matters a lot. If you don\'t, look for flexibility and breadth.',
  'Size shapes class sizes, the range of majors and clubs, and how easy it is to know people.',
  'Setting is the place around the campus. Distance from home affects travel cost and how often you can visit.',
  'Culture is how campus feels day to day: competitive or collaborative, spirited or low-key, religious, political.',
  'Cost may be the most important fit of all. Talk with your family about what they can pay before you finalize your list.'
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  const lab = t => { const s = createSpan(t); s.style('font-size', '15px'); return s; };
  const sel = opts => { const s = createSelect(); opts.forEach(o => s.option(o)); return s; };
  const imp = () => {
    const s = createSlider(1, 5, 3, 1);
    s.size(140);
    const l = lab('Importance: 3 of 5');
    l.style('display', 'inline-block');
    l.style('width', '205px');
    importance.push(s);
    impLabels.push(l);
    return [l, s];
  };
  const dealBox = () => { const c = createCheckbox(' This is a dealbreaker', false); deal.push(c); return c; };

  // Step 1: Majors
  majorKnow = sel(["Yes, I'm fairly sure", 'I have a few ideas', 'Not yet']);
  majorKnow.selected('Not yet');
  majorInput = createInput('');
  majorInput.attribute('placeholder', 'e.g., computer science');
  majorInput.size(180);
  ui.push([[lab('Do you know your intended major?'), majorKnow], [lab('Major or interests:'), majorInput], imp(), [dealBox()]]);

  // Step 2: Size
  sizeSelect = sel(['No preference', 'Small, under 5,000', 'Medium, 5,000–20,000', 'Large, over 20,000']);
  ui.push([[lab('Preferred size:'), sizeSelect], imp(), [dealBox()]]);

  // Step 3: Setting (two sliders)
  settingSelect = sel(['No preference', 'Urban', 'Suburban', 'College town', 'Rural']);
  distanceSelect = sel(['Anywhere in the country', 'Commuting distance', "Within a day's drive", 'Anywhere in the world']);
  const settingImp = imp();
  const distImp = imp();
  impLabels[2].html('Setting importance: 3');
  impLabels[3].html('Distance importance: 3');
  ui.push([[lab('Setting:'), settingSelect], settingImp, [lab('Distance from home:'), distanceSelect], distImp, [dealBox()]]);

  // Step 4: Culture
  ['Strong school spirit and athletics', 'Collaborative rather than competitive academics',
   'Religious or cultural community', 'Active political or social engagement'].forEach(t => cultureBoxes.push(createCheckbox(' ' + t, false)));
  ui.push([[cultureBoxes[0], cultureBoxes[1]], [cultureBoxes[2], cultureBoxes[3]], imp(), [dealBox()]]);

  // Step 5: Cost
  costTalk = sel(['Not yet', 'Yes']);
  costAmount = createInput('');
  costAmount.attribute('placeholder', 'optional, e.g. 15000');
  costAmount.size(150);
  ui.push([[lab('Talked with your family about what you can pay?'), costTalk], [lab('Yearly family contribution ($):'), costAmount], imp(), [dealBox()]]);

  backButton = createButton('◀ Back');
  backButton.mousePressed(() => goTo(step - 1));
  nextButton = createButton('Next ▶');
  nextButton.mousePressed(() => goTo(step + 1));
  marcusButton = createButton('Load Marcus');
  marcusButton.mousePressed(loadMarcus);
  resetButton = createButton('Start over');
  resetButton.mousePressed(resetAll);

  goTo(0);
  describe('A five-step college self-assessment covering majors, size, setting, culture, and cost. Each step has questions, an importance slider from 1 to 5, and a dealbreaker checkbox. The final step ranks the factors in a bar chart with dealbreakers locked at the top and a written summary.');
}

// The six importance sliders map onto the five factors (setting uses the higher of two)
function factorImportance(f) {
  if (f === 0) return importance[0].value();
  if (f === 1) return importance[1].value();
  if (f === 2) return max(importance[2].value(), importance[3].value());
  if (f === 3) return importance[4].value();
  return importance[5].value();
}

function goTo(s) {
  step = constrain(s, 0, STEPS.length - 1);
  positionControls();
}

function positionControls() {
  // hide everything, then show and place the current step's rows
  ui.flat(2).forEach(e => e.hide());
  let y = drawHeight + 10;
  if (step < 5) {
    for (const row of ui[step]) {
      row.forEach(e => e.show());
      y = flowRow(row, 10, y, 28) + 32;
    }
  }
  const by = drawHeight + controlHeight - 38;
  backButton.position(10, by);
  nextButton.position(90, by);
  marcusButton.position(175, by);
  resetButton.position(175 + (marcusButton.elt.offsetWidth || 100) + 10, by);
  step === 0 ? backButton.attribute('disabled', '') : backButton.removeAttribute('disabled');
  step === 5 ? nextButton.attribute('disabled', '') : nextButton.removeAttribute('disabled');
}

// Place controls left to right using their real widths; wrap when the row is full.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style('white-space', 'nowrap');
    c.position(x, y);
    const w = c.elt.offsetWidth || c.cachedWidth || 120;
    c.cachedWidth = w;
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 8;
  }
  return y;
}

function loadMarcus() {
  majorKnow.selected("Yes, I'm fairly sure");
  majorInput.value('Computer science');
  sizeSelect.selected('Medium, 5,000–20,000');
  settingSelect.selected('No preference');
  distanceSelect.selected("Within a day's drive");
  cultureBoxes.forEach((c, i) => c.checked(i === 0));
  costTalk.selected('Yes');
  costAmount.value('15000');
  const vals = [5, 3, 2, 4, 2, 5];
  importance.forEach((s, i) => s.value(vals[i]));
  deal.forEach((d, i) => d.checked(i === 4));
  goTo(5);
}

function resetAll() {
  majorKnow.selected('Not yet');
  majorInput.value('');
  sizeSelect.selected('No preference');
  settingSelect.selected('No preference');
  distanceSelect.selected('Anywhere in the country');
  cultureBoxes.forEach(c => c.checked(false));
  costTalk.selected('Not yet');
  costAmount.value('');
  importance.forEach(s => s.value(3));
  deal.forEach(d => d.checked(false));
  goTo(0);
}

function draw() {
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // live slider labels
  impLabels.forEach((l, i) => {
    const prefix = i === 2 ? 'Setting importance: ' : (i === 3 ? 'Distance importance: ' : 'Importance: ');
    l.html(prefix + importance[i].value() + ' of 5');
  });

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('College Self-Assessment', canvasWidth / 2, 8);

  drawStepper(margin, 44, canvasWidth - 2 * margin);
  if (step < 5) drawStepCard(margin, 98, canvasWidth - 2 * margin, drawHeight - 108);
  else {
    drawProfile(margin, 98, canvasWidth - 2 * margin, drawHeight - 108);
    noStroke();
    fill('dimgray');
    textAlign(LEFT, TOP);
    textSize(15);
    text('Use ◀ Back to revisit any step and change an answer. Keep this profile next to you as you research colleges in Chapter 4.',
         12, drawHeight + 16, canvasWidth - 24, 80);
  }
}

function drawStepper(x, y, w) {
  const n = STEPS.length;
  const gap = w / n;
  stroke('silver');
  strokeWeight(2);
  line(x + gap / 2, y + 12, x + w - gap / 2, y + 12);
  strokeWeight(1);
  STEPS.forEach((s, i) => {
    const cx = x + gap * i + gap / 2;
    const done = i < step, cur = i === step;
    stroke(cur ? 'goldenrod' : 'steelblue');
    strokeWeight(cur ? 3 : 1);
    fill(done ? 'steelblue' : (cur ? 'gold' : 'white'));
    circle(cx, y + 12, 24);
    strokeWeight(1);
    noStroke();
    fill(done ? 'white' : 'black');
    textAlign(CENTER, CENTER);
    textSize(12);
    text(i < 5 ? i + 1 : '★', cx, y + 12);
    fill(cur ? 'black' : 'dimgray');
    textSize(canvasWidth < 500 ? 10 : 12);
    textStyle(cur ? BOLD : NORMAL);
    text(s, cx - gap / 2 + 2, y + 28, gap - 4, 24);
    textStyle(NORMAL);
  });
}

function drawStepCard(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(17);
  textStyle(BOLD);
  text('Step ' + (step + 1) + ': ' + STEPS[step], x + 12, y + 10);
  textStyle(NORMAL);
  textSize(15);
  text(stepHelp[step], x + 12, y + 36, w - 24, 64);

  // a live preview of every factor's importance so far
  const py = y + 104;
  textSize(13);
  fill('dimgray');
  text('Your answers so far:', x + 12, py);
  const barW = (w - 24) / 5;
  FACTORS.forEach((f, i) => {
    const bx = x + 12 + i * barW;
    const v = factorImportance(i);
    const isDeal = deal[i].checked();
    noStroke();
    fill(i === step ? 'gold' : 'lightsteelblue');
    rect(bx + 4, py + 64 - v * 9, barW - 8, v * 9, 3);
    fill('black');
    textAlign(CENTER, TOP);
    textSize(12);
    text(f + (isDeal ? ' 🔒' : ''), bx + barW / 2, py + 68);
    textAlign(LEFT, TOP);
  });
}

function drawProfile(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);

  // dealbreakers first, then by importance
  const items = FACTORS.map((f, i) => ({ name: f, v: factorImportance(i), deal: deal[i].checked() }));
  items.sort((a, b) => (b.deal - a.deal) || (b.v - a.v));

  const labelW = 90;
  const rowH = min(22, (h - 74) / 5);
  const bx = x + 12 + labelW, bw = w - labelW - 50;
  items.forEach((it, k) => {
    const ry = y + 10 + k * (rowH + 4);
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(14);
    text((it.deal ? '🔒 ' : '') + it.name, x + 12, ry + rowH / 2);
    fill('gainsboro');
    rect(bx, ry, bw, rowH, 4);
    fill(it.deal ? 'firebrick' : 'steelblue');
    rect(bx, ry, bw * it.v / 5, rowH, 4);
    fill('black');
    textAlign(LEFT, CENTER);
    text(it.v, bx + bw + 6, ry + rowH / 2);
  });

  // summary sentence
  const deals = items.filter(i => i.deal).map(i => i.name.toLowerCase());
  const rest = items.filter(i => !i.deal);
  const top = rest.filter(i => i.v >= 4).slice(0, 2);
  const flexible = rest.filter(i => !top.includes(i) && i.v <= 3).map(i => i.name.toLowerCase());
  let summary = '';
  summary += deals.length ? 'Dealbreaker' + (deals.length > 1 ? 's' : '') + ': ' + deals.join(', ') + '. ' : 'No dealbreakers. ';
  summary += top.length ? 'Top priorities: ' + top.map(i => i.name.toLowerCase() + ' (' + i.v + ')').join(', ') + '. ' : 'No factor rated 4 or 5 yet. ';
  if (flexible.length) summary += 'Flexible: ' + flexible.join(', ') + '.';

  const sy = y + 10 + 5 * (rowH + 4) + 4;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  text(summary, x + 12, sy, w - 24, 40);
  if (costTalk.value() === 'Not yet') {
    fill('darkorange');
    textSize(13);
    textStyle(BOLD);
    text('Talk with your family about cost before you finalize your list.', x + 12, sy + 38, w - 24);
    textStyle(NORMAL);
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
}
