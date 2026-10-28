// College Admissions Process Roadmap
// CANVAS_HEIGHT: 480
// Six stops on a road, left to right. Hover a stop for a tooltip, click it for the full
// infobox. "Quiz me" hides the labels and asks the student to drag each label tile onto
// the correct stop. On narrow screens the road wraps into two rows of three.

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let quizButton, answersButton;

// The six stages, in order, with the infobox text from the chapter
const stages = [
  { name: 'Build Your List', months: 'Summer before senior year – September',
    detail: 'Choose 8–12 colleges based on fit, cost, and admission chances.', chapters: 'Chapters 3–4' },
  { name: 'Test', months: 'Spring of junior year – October',
    detail: 'Decide whether to take the SAT/ACT and whether to submit scores to each school.', chapters: 'Chapter 6' },
  { name: 'Apply', months: 'August – January',
    detail: 'Complete forms, essays, activities, and recommendations.', chapters: 'Chapters 8–13' },
  { name: 'Seek Aid', months: 'October – February',
    detail: 'File the FAFSA (and CSS Profile where required) and apply for scholarships.', chapters: 'Chapters 14–16' },
  { name: 'Decide', months: 'March – April',
    detail: 'Compare admission and aid offers and pick one school.', chapters: 'Chapters 17–19' },
  { name: 'Enroll', months: 'May – August',
    detail: 'Pay the deposit by May 1, decline other offers, and finish housing and orientation tasks.', chapters: 'Chapter 20' }
];

let stops = [];          // computed rectangles for each stop
let selected = -1;       // index of the stop whose infobox is open
let hovered = -1;

// Quiz state
let quizMode = false;
let showAnswers = false;
let tiles = [];          // {stage, x, y, w, h, homeX, homeY, placed}
let dragTile = null;
let dragOffX = 0, dragOffY = 0;
let quizMessage = '';
let flashTile = null, flashUntil = 0;

let panelTop = 210;      // where the infobox / tile tray begins (set in layout)

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  quizButton = createButton('Quiz me');
  quizButton.position(10, drawHeight + 12);
  quizButton.mousePressed(toggleQuiz);

  answersButton = createButton('Show answers');
  answersButton.position(100, drawHeight + 12);
  answersButton.mousePressed(revealAnswers);

  layoutStops();
  describe('A road with six numbered stops showing the college admissions process in order: Build Your List, Test, Apply, Seek Aid, Decide, Enroll. Click a stop to read when it happens and what you do. A quiz mode asks you to drag each stage name onto the correct stop.');
}

// Compute stop rectangles for one row (wide) or two rows of three (narrow)
function layoutStops() {
  stops = [];
  const twoRows = canvasWidth < 640;
  const perRow = twoRows ? 3 : 6;
  const gap = twoRows ? 34 : 26;
  const w = (canvasWidth - 2 * margin - gap * (perRow - 1)) / perRow;
  const h = 74;
  for (let i = 0; i < 6; i++) {
    const row = floor(i / perRow);
    const col = i % perRow;
    stops.push({ x: margin + col * (w + gap), y: 64 + row * 104, w: w, h: h, row: row });
  }
  panelTop = twoRows ? 258 : 168;
  if (quizMode) layoutTiles(false);
}

function draw() {
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('College Admissions Process Roadmap', canvasWidth / 2, 10);
  textSize(15);
  fill('dimgray');
  text(quizMode ? 'Drag each stage name onto its stop, in order.' : 'Hover a stop for its months. Click it for details.',
       canvasWidth / 2, 38);

  drawRoad();
  hovered = quizMode ? -1 : stopAt(mouseX, mouseY);
  drawStops();

  if (quizMode) {
    drawTray();
    drawTiles();
  } else {
    drawInfobox();
    if (hovered >= 0 && hovered !== selected) drawTooltip(hovered);
  }

  cursor(hovered >= 0 || (quizMode && tileAt(mouseX, mouseY)) ? HAND : ARROW);
}

// The road: a grey band behind each row with arrows between stops
function drawRoad() {
  const rows = {};
  stops.forEach(s => { rows[s.row] = s.y; });
  for (const r in rows) {
    const y = rows[r] + stops[0].h / 2;
    noStroke();
    fill('gainsboro');
    rect(margin / 2, y - 8, canvasWidth - margin, 16, 8);
  }
  // arrows between consecutive stops in the same row
  for (let i = 0; i < 5; i++) {
    const a = stops[i], b = stops[i + 1];
    if (a.row !== b.row) {
      // curve down from the end of row 1 to the start of row 2
      stroke('gray');
      strokeWeight(2);
      noFill();
      const x1 = a.x + a.w / 2, y1 = a.y + a.h;
      const x2 = b.x + b.w / 2, y2 = b.y;
      bezier(x1, y1, x1, y1 + 30, x2, y2 - 30, x2, y2 - 4);
      drawArrowHead(x2, y2 - 2, HALF_PI);
      continue;
    }
    const y = a.y + a.h / 2;
    stroke('gray');
    strokeWeight(2);
    line(a.x + a.w + 3, y, b.x - 5, y);
    drawArrowHead(b.x - 3, y, 0);
  }
  strokeWeight(1);
}

function drawArrowHead(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  noStroke();
  fill('gray');
  triangle(0, 0, -9, -5, -9, 5);
  pop();
}

function drawStops() {
  for (let i = 0; i < 6; i++) {
    const s = stops[i];
    let c = 'steelblue';
    const placedTile = tiles.find(t => t.placed && t.stage === i);
    if (quizMode && placedTile) c = 'seagreen';
    if (!quizMode && i === selected) c = 'goldenrod';
    stroke(i === hovered ? 'navy' : 'white');
    strokeWeight(i === hovered ? 3 : 2);
    fill(c);
    rect(s.x, s.y, s.w, s.h, 12);

    // number badge
    noStroke();
    fill('white');
    circle(s.x + 16, s.y + 16, 22);
    fill(c);
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(i + 1, s.x + 16, s.y + 16);
    textStyle(NORMAL);

    // label, unless hidden in quiz mode
    const showLabel = !quizMode || showAnswers || placedTile;
    fill('white');
    textSize(s.w < 90 ? 13 : 15);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(showLabel ? stages[i].name : '?', s.x + 4, s.y + 30, s.w - 8, s.h - 34);
    textStyle(NORMAL);
  }
}

// Infobox for the selected stop
function drawInfobox() {
  const x = margin, y = panelTop, w = canvasWidth - 2 * margin, h = drawHeight - panelTop - 12;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (selected < 0) {
    fill('dimgray');
    textSize(16);
    text('Click any stop on the road to see what happens at that stage and when.', x + 16, y + 16, w - 32, h - 32);
    return;
  }
  const st = stages[selected];
  fill('darkgoldenrod');
  textSize(18);
  textStyle(BOLD);
  text((selected + 1) + '. ' + st.name, x + 16, y + 14, w - 32);
  textStyle(NORMAL);
  fill('black');
  textSize(16);
  text('When: ' + st.months, x + 16, y + 44, w - 32);
  text(st.detail, x + 16, y + 70, w - 32, h - 110);
  fill('steelblue');
  text('Covered in ' + st.chapters, x + 16, y + h - 28, w - 32);
}

function drawTooltip(i) {
  const s = stops[i];
  const label = stages[i].name + ': ' + stages[i].months;
  textSize(14);
  const tw = min(textWidth(label) + 16, canvasWidth - 20);
  let tx = constrain(s.x + s.w / 2 - tw / 2, 10, canvasWidth - tw - 10);
  const ty = s.y + s.h + 6;
  stroke('gray');
  fill('lightyellow');
  rect(tx, ty, tw, 24, 6);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(label, tx + 8, ty + 12);
}

// ----- Quiz mode -----

function toggleQuiz() {
  quizMode = !quizMode;
  showAnswers = false;
  quizMessage = '';
  if (quizMode) {
    quizButton.html('Exit quiz');
    layoutTiles(true);
  } else {
    quizButton.html('Quiz me');
    tiles = [];
  }
}

function revealAnswers() {
  if (!quizMode) {
    toggleQuiz();
  }
  showAnswers = true;
  tiles.forEach(t => { snapToStop(t); t.placed = true; });
  quizMessage = 'Answers shown. Exit, then Quiz me to retry.';
}

// Place tiles in the tray in shuffled order. If reshuffle is false, keep the current order.
function layoutTiles(reshuffle) {
  if (reshuffle) {
    const order = shuffle([0, 1, 2, 3, 4, 5]);
    tiles = order.map(i => ({ stage: i, placed: false }));
  }
  const cols = canvasWidth < 640 ? 3 : 6;
  const gap = 10;
  const w = (canvasWidth - 2 * margin - 20 - gap * (cols - 1)) / cols;
  const h = 34;
  tiles.forEach((t, k) => {
    t.w = w; t.h = h;
    t.homeX = margin + 10 + (k % cols) * (w + gap);
    t.homeY = panelTop + 34 + floor(k / cols) * (h + gap);
    if (t.placed) snapToStop(t);
    else { t.x = t.homeX; t.y = t.homeY; }
  });
}

function snapToStop(t) {
  const s = stops[t.stage];
  t.x = s.x + (s.w - t.w) / 2;
  t.y = s.y + s.h - t.h / 2;
}

function drawTray() {
  const x = margin, y = panelTop, w = canvasWidth - 2 * margin, h = drawHeight - panelTop - 12;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  const placed = tiles.filter(t => t.placed).length;
  text('Label tiles (' + placed + ' of 6 placed)', x + 12, y + 10);
  if (quizMessage) {
    // message sits just below the tile rows
    const rows = canvasWidth < 640 ? 2 : 1;
    const my = y + 34 + rows * 44 + 4;
    fill(placed === 6 && !showAnswers ? 'seagreen' : 'dimgray');
    text(quizMessage, x + 12, my, w - 24, y + h - my - 4);
  }
}

function drawTiles() {
  // draw the dragged tile last so it sits on top
  const order = tiles.filter(t => t !== dragTile);
  if (dragTile) order.push(dragTile);
  for (const t of order) {
    if (t.placed && showAnswers) continue; // labels already visible on the stops
    if (t.placed) continue;
    const flashing = t === flashTile && millis() < flashUntil;
    stroke(flashing ? 'firebrick' : 'gray');
    strokeWeight(flashing ? 3 : 1);
    fill(t === dragTile ? 'lightyellow' : 'white');
    rect(t.x, t.y, t.w, t.h, 8);
    noStroke();
    fill('black');
    textSize(t.w < 90 ? 13 : 15);
    textAlign(CENTER, CENTER);
    text(stages[t.stage].name, t.x + t.w / 2, t.y + t.h / 2);
  }
  strokeWeight(1);
}

function tileAt(mx, my) {
  for (let k = tiles.length - 1; k >= 0; k--) {
    const t = tiles[k];
    if (!t.placed && mx > t.x && mx < t.x + t.w && my > t.y && my < t.y + t.h) return t;
  }
  return null;
}

function stopAt(mx, my) {
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    if (mx > s.x && mx < s.x + s.w && my > s.y && my < s.y + s.h) return i;
  }
  return -1;
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  if (quizMode) {
    const t = tileAt(mouseX, mouseY);
    if (t) {
      dragTile = t;
      dragOffX = mouseX - t.x;
      dragOffY = mouseY - t.y;
    }
    return;
  }
  const i = stopAt(mouseX, mouseY);
  if (i >= 0) selected = i;
}

function mouseDragged() {
  if (dragTile) {
    dragTile.x = mouseX - dragOffX;
    dragTile.y = mouseY - dragOffY;
  }
}

function mouseReleased() {
  if (!dragTile) return;
  const t = dragTile;
  dragTile = null;
  const i = stopAt(t.x + t.w / 2, t.y + t.h / 2);
  if (i === t.stage) {
    t.placed = true;
    snapToStop(t);
    const placed = tiles.filter(x => x.placed).length;
    quizMessage = placed === 6
      ? 'All six stages are in order. Nice work!'
      : 'Correct! Stage ' + (i + 1) + ': ' + stages[i].months + '.';
  } else {
    // bounce back to the tray
    t.x = t.homeX;
    t.y = t.homeY;
    flashTile = t;
    flashUntil = millis() + 800;
    quizMessage = i >= 0
      ? 'Not quite: "' + stages[t.stage].name + '" isn\'t stage ' + (i + 1) + '.'
      : 'Drop the tile directly on a stop.';
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutStops();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
