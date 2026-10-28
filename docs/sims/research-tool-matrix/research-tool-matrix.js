// Research Tool Matrix
// CANVAS_HEIGHT: 570
// Nine research tools (rows) against six questions (columns). Filled circle = strong source,
// half = partial, empty = weak (illustrative ratings). Click a cell for why, click a column
// header (or use the dropdown) to highlight the best tools, or press "Quiz me."
// Narrow screens show one tool card at a time.

let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

const QUESTIONS = ['Can I get in?', 'What will it cost me?', 'Do students graduate?', 'Is my major strong?', "What's the culture like?", 'Could I see myself there?'];

// r: ratings per question (2 strong, 1 partial, 0 weak); tips: per-question explanations for strong/partial cells
const TOOLS = [
  { name: 'College Scorecard', group: 'data', tag: 'Neutral', r: [1, 2, 2, 1, 0, 0],
    tips: ['Partial: it shows admission rates and some test data, but the Common Data Set has more detail.',
           'Strong: average net price by family income, from federal data collected the same way everywhere.',
           'Strong: graduation rates and typical debt for nearly every college that takes federal aid.',
           'Partial: field-of-study pages show earnings and debt for graduates in your major.'] },
  { name: 'Common Data Set', group: 'data', tag: 'From the college (standard format)', r: [2, 1, 2, 0, 0, 0],
    tips: ['Strong: Section C has admit counts and middle 50% ranges in the same format at every college.',
           'Partial: Sections G and H list prices and aid averages, but not your own net price.',
           'Strong: Section B reports retention and four- and six-year graduation rates.'] },
  { name: 'Net price calculator', group: 'data', tag: 'From the college', r: [0, 2, 0, 0, 0, 0],
    tips: [null, 'Strong: your own estimated price after grants, using your family\'s numbers. Required on every college\'s website.'] },
  { name: 'College search website', group: 'data', tag: 'Third party', r: [1, 1, 1, 1, 1, 0],
    tips: ['Partial: convenient summaries, but check the year and source of every number.',
           'Partial: sticker prices and averages, not your own price.',
           'Partial: often repeats federal graduation data. Confirm against the Scorecard.',
           'Partial: lists of majors and popularity, rarely program quality.',
           'Partial: survey snippets and student polls, a starting point only.'] },
  { name: 'Campus visit', group: 'exp', tag: 'From the college', r: [0, 0, 0, 1, 2, 2],
    tips: [null, null, null, 'Partial: sit in on a class or meet the department, but you see a curated slice.',
           'Strong: you see how students actually treat each other between classes.',
           'Strong: nothing replaces standing on campus and asking yourself the question.'] },
  { name: 'Virtual tour', group: 'exp', tag: 'From the college', r: [0, 0, 0, 0, 1, 1],
    tips: [null, null, null, null, 'Partial: you see the buildings, not the people.', 'Partial: a good first filter before you spend money on a trip.'] },
  { name: 'Information session', group: 'exp', tag: 'From the college', r: [1, 1, 0, 1, 1, 0],
    tips: ['Partial: officers explain what they look for, and you can ask questions.',
           'Partial: you hear about aid policies, but not your own price.', null,
           'Partial: ask how hard it is to get into your major after you enroll.',
           'Partial: the college\'s own description of itself.'] },
  { name: 'College fair', group: 'exp', tag: 'From the college', r: [1, 0, 0, 1, 0, 0],
    tips: ['Partial: a quick conversation with a representative, often a regional officer.', null, null,
           'Partial: a chance to ask whether your major is offered and how it works.'] },
  { name: 'Student reviews', group: 'exp', tag: 'Third party, unverified', r: [0, 0, 0, 1, 2, 1],
    tips: [null, null, null, 'Partial: current students\' views of their own programs. Look for patterns, not single posts.',
           'Strong: many voices on daily life, though anyone can post. Look for patterns.',
           'Partial: helps you imagine daily life, but it\'s someone else\'s experience.'] }
];

let questionSelect, quizButton, prevButton, nextButton;
let selectedCell = null;       // { t, q }
let highlightQ = -1;
let quiz = null;               // { q, answered, correct, msg }
let cardIndex = 0;             // narrow mode
let grid = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  questionSelect = createSelect();
  questionSelect.option('I want to know...');
  QUESTIONS.forEach(q => questionSelect.option(q));
  questionSelect.changed(() => {
    highlightQ = QUESTIONS.indexOf(questionSelect.value());
    quiz = null;
  });
  quizButton = createButton('Quiz me');
  quizButton.mousePressed(startQuiz);
  prevButton = createButton('◀ Previous tool');
  prevButton.mousePressed(() => { cardIndex = (cardIndex + TOOLS.length - 1) % TOOLS.length; selectedCell = null; });
  nextButton = createButton('Next tool ▶');
  nextButton.mousePressed(() => { cardIndex = (cardIndex + 1) % TOOLS.length; selectedCell = null; });

  positionControls();
  describe('A matrix of nine college research tools against six questions. Each cell shows a full, half, or empty circle for strong, partial, or weak. Click a cell to see why, highlight the best tools for a question, or take a quiz.');
}

function isNarrow() {
  return canvasWidth < 640;
}

function positionControls() {
  const items = [questionSelect, quizButton];
  if (isNarrow()) { prevButton.show(); nextButton.show(); items.push(prevButton, nextButton); }
  else { prevButton.hide(); nextButton.hide(); }
  flowRow(items, 10, drawHeight + 12, 26);
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
    x += w + 8;
  }
}

function bestTools(q) {
  const strong = TOOLS.map((t, i) => i).filter(i => TOOLS[i].r[q] === 2);
  if (strong.length) return strong;
  return TOOLS.map((t, i) => i).filter(i => TOOLS[i].r[q] === 1);
}

function startQuiz() {
  // ask only questions that have at least one strong tool
  const pool = [0, 1, 2, 4, 5];
  quiz = { q: random(pool), done: false, msg: '', pick: -1 };
  highlightQ = -1;
  selectedCell = null;
  questionSelect.selected('I want to know...');
}

function cellInfo(t, q) {
  const tool = TOOLS[t];
  const r = tool.r[q];
  const tip = tool.tips[q];
  if (r > 0 && tip) return tip;
  const best = bestTools(q).map(i => TOOLS[i].name);
  return 'Weak: this isn\'t what ' + tool.name + ' is for. For "' + QUESTIONS[q] + '" try ' + best.slice(0, 2).join(' or ') + '.';
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
  text('Research Tool Matrix', canvasWidth / 2, 8);

  if (isNarrow()) drawCard();
  else drawGrid();
  drawInfo();
}

// ----- wide: full grid -----
function drawGrid() {
  const labelW = 178;
  const top = 40, headH = 40, rowH = 30, groupH = 18;
  const colW = (canvasWidth - labelW - margin) / 6;
  grid = { labelW, top, headH, rowH, groupH, colW };
  const activeQ = quiz ? -1 : highlightQ;
  const best = activeQ >= 0 ? bestTools(activeQ) : [];

  // column headers
  QUESTIONS.forEach((q, i) => {
    const x = labelW + i * colW;
    const active = i === activeQ || (quiz && i === quiz.q);
    noStroke();
    fill(active ? 'gold' : 'white');
    rect(x + 2, top, colW - 4, headH, 6);
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(q, x + 4, top, colW - 8, headH);
    textStyle(NORMAL);
  });

  let y = top + headH + 4;
  ['data', 'exp'].forEach(g => {
    noStroke();
    fill('dimgray');
    textAlign(LEFT, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(g === 'data' ? 'DATA TOOLS' : 'EXPERIENCE TOOLS', margin, y + groupH / 2);
    textStyle(NORMAL);
    y += groupH;
    TOOLS.forEach((t, ti) => {
      if (t.group !== g) return;
      t.y = y;
      const isBest = best.includes(ti);
      noStroke();
      fill(isBest ? 'lightyellow' : (g === 'data' ? 'aliceblue' : 'honeydew'));
      if (!isBest) fill(g === 'data' ? color(220, 235, 250) : color(222, 245, 225));
      rect(margin, y, canvasWidth - 2 * margin, rowH - 2, 4);
      fill('black');
      textAlign(LEFT, TOP);
      textSize(14);
      text(t.name, margin + 6, y + 2);
      fill('gray');
      textSize(10);
      text(t.tag, margin + 6, y + 17);
      t.r.forEach((r, qi) => {
        const cx = labelW + qi * colW + colW / 2, cy = y + rowH / 2 - 1;
        const sel = selectedCell && selectedCell.t === ti && selectedCell.q === qi;
        const quizMark = quiz && quiz.msg && quiz.pick === ti && qi === quiz.q;
        drawRating(cx, cy, r, sel, quizMark ? (quiz.correct ? 'seagreen' : 'firebrick') : null);
      });
      y += rowH;
    });
  });
}

function drawRating(cx, cy, r, selected, ringColor) {
  const d = 18;
  if (selected || ringColor) {
    noFill();
    stroke(ringColor || 'goldenrod');
    strokeWeight(3);
    circle(cx, cy, d + 8);
  }
  stroke('darkslategray');
  strokeWeight(1.5);
  fill('white');
  circle(cx, cy, d);
  noStroke();
  fill('darkslategray');
  if (r === 2) circle(cx, cy, d);
  if (r === 1) arc(cx, cy, d, d, HALF_PI, PI + HALF_PI, PIE);
  strokeWeight(1);
}

// ----- narrow: one tool card -----
function drawCard() {
  const t = TOOLS[cardIndex];
  const x = margin, y = 40, w = canvasWidth - 2 * margin, h = 290;
  stroke('silver');
  fill(t.group === 'data' ? color(220, 235, 250) : color(222, 245, 225));
  rect(x, y, w, h, 10);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text((t.group === 'data' ? 'DATA TOOL' : 'EXPERIENCE TOOL') + '  ·  ' + (cardIndex + 1) + ' of ' + TOOLS.length, x + 12, y + 10);
  fill('black');
  textSize(18);
  text(t.name, x + 12, y + 26);
  textStyle(NORMAL);
  fill('gray');
  textSize(12);
  text(t.tag, x + 12, y + 50);
  t.rows = [];
  QUESTIONS.forEach((q, qi) => {
    const ry = y + 76 + qi * 34;
    t.rows.push({ y: ry, q: qi });
    const active = qi === highlightQ || (quiz && qi === quiz.q);
    if (active) { fill('lightyellow'); rect(x + 6, ry - 4, w - 12, 30, 5); }
    const sel = selectedCell && selectedCell.t === cardIndex && selectedCell.q === qi;
    drawRating(x + 26, ry + 11, t.r[qi], sel, null);
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(14);
    text(q, x + 46, ry + 11);
    fill('dimgray');
    textAlign(RIGHT, CENTER);
    textSize(12);
    text(['weak', 'partial', 'strong'][t.r[qi]], x + w - 12, ry + 11);
  });
}

function drawInfo() {
  const y = isNarrow() ? 340 : grid.top + grid.headH + 4 + 2 * grid.groupH + TOOLS.length * grid.rowH + 8;
  const x = margin, w = canvasWidth - 2 * margin, h = drawHeight - y - 8;
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  if (quiz) {
    fill('black');
    textStyle(BOLD);
    const title = 'Quiz: Which tool best answers "' + QUESTIONS[quiz.q] + '"?';
    text(title, x + 10, y + 8, w - 20);
    const titleLines = ceil(textWidth(title) / (w - 20));
    textStyle(NORMAL);
    fill(quiz.msg ? (quiz.correct ? 'seagreen' : 'firebrick') : 'dimgray');
    text(quiz.msg ? quiz.msg : (isNarrow() ? 'Use Next tool to find it, then tap the question row on its card.' : 'Click any cell in that tool\'s row.'),
         x + 10, y + 12 + titleLines * 19, w - 20, h - 36);
    return;
  }
  if (selectedCell) {
    const t = TOOLS[selectedCell.t];
    fill('darkgoldenrod');
    textStyle(BOLD);
    text(t.name + ' × "' + QUESTIONS[selectedCell.q] + '"', x + 10, y + 8, w - 20);
    textStyle(NORMAL);
    fill('black');
    text(cellInfo(selectedCell.t, selectedCell.q), x + 10, y + 30, w - 20, h - 36);
    return;
  }
  if (highlightQ >= 0) {
    const best = bestTools(highlightQ);
    const strong = TOOLS[best[0]].r[highlightQ] === 2;
    fill('black');
    textStyle(BOLD);
    text('Best for "' + QUESTIONS[highlightQ] + '":', x + 10, y + 8, w - 20);
    textStyle(NORMAL);
    text(best.map(i => TOOLS[i].name).join(', ') + '.' +
         (strong ? '' : ' No single tool is strong here. Combine Scorecard field-of-study data with the department\'s own pages and a visit.'),
         x + 10, y + 30, w - 20, h - 36);
    return;
  }
  fill('dimgray');
  text('Click any circle to see why a tool is strong, partial, or weak for that question. ' +
       (isNarrow() ? 'Use Next tool to see the other tools.' : 'Click a column header to highlight the best tools.'), x + 10, y + 10, w - 20, h - 20);
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  let hitT = -1, hitQ = -1;
  if (isNarrow()) {
    const t = TOOLS[cardIndex];
    if (t.rows) t.rows.forEach(r => { if (mouseY > r.y - 4 && mouseY < r.y + 26) { hitT = cardIndex; hitQ = r.q; } });
  } else {
    // column header?
    if (mouseY > grid.top && mouseY < grid.top + grid.headH && mouseX > grid.labelW) {
      highlightQ = floor((mouseX - grid.labelW) / grid.colW);
      questionSelect.selected(QUESTIONS[highlightQ]);
      quiz = null;
      selectedCell = null;
      return;
    }
    TOOLS.forEach((t, ti) => {
      if (t.y !== undefined && mouseY > t.y && mouseY < t.y + grid.rowH) {
        hitT = ti;
        hitQ = mouseX > grid.labelW ? floor((mouseX - grid.labelW) / grid.colW) : (quiz ? quiz.q : -1);
      }
    });
  }
  if (hitT < 0 || hitQ < 0 || hitQ > 5) return;
  if (quiz && !quiz.done) {
    const r = TOOLS[hitT].r[quiz.q];
    quiz.pick = hitT;
    quiz.correct = r === 2;
    quiz.done = quiz.correct;
    quiz.msg = quiz.correct
      ? '✓ Yes! ' + cellInfo(hitT, quiz.q) + ' Press Quiz me for another.'
      : 'Not the best choice: ' + TOOLS[hitT].name + ' is ' + ['weak', 'partial'][r] + ' here. Hint: is this a numbers question or an experience question? Click another tool.';
    return;
  }
  if (quiz && quiz.done) quiz = null;
  selectedCell = { t: hitT, q: hitQ };
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
