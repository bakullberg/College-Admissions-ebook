// Campus Size and Setting Explorer
// CANVAS_HEIGHT: 640
// A 3 × 4 grid of school size (rows) by campus setting (columns). Click a cell for typical
// classes, weekends, and things to watch for. Your preferred size and setting highlight your
// target zone in gold, and you can pin up to eight colleges you're considering onto the grid.

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const SIZES = ['Small', 'Medium', 'Large'];
const SIZE_DETAIL = ['under 5,000', '5,000–20,000', 'over 20,000'];
const SIZE_SHORT = ['< 5k', '5k–20k', '> 20k'];
const SETTINGS = ['Urban', 'Suburban', 'College town', 'Rural'];
const TINTS = ['lavender', 'honeydew', 'oldlace', 'azure'];

// cells[size][setting] = [classes, weekends, watch for]
const cells = [
  [
    ['Small classes, often with city-based internships or field work.', 'Students head into the city; campus life is compact.', 'Limited campus space and housing, and city living costs add up.'],
    ['Seminar classes; faculty know you by name.', 'Campus events and nearby towns, with a city a short trip away.', 'Fewer majors to choose from, so confirm your program exists.'],
    ['Discussion classes and close advising.', 'Campus and town blend together: local cafés, concerts, trails.', 'The town can be very quiet over breaks and summers.'],
    ['Seminars and close faculty contact from the first year.', 'Campus events and outdoor trips; most students stay on campus.', 'Fewer off-campus internships and options; travel can be harder.']
  ],
  [
    ['Mix of mid-size lectures and seminars; internships nearby.', 'City neighborhoods plus a real campus core.', 'Housing may be guaranteed only for the first year or two.'],
    ['Classes of 20–40 are common; undergraduate research is possible.', 'Campus traditions, clubs, and trips to a nearby city.', 'You may need a car or reliable transit to get off campus.'],
    ['A good range of majors with manageable class sizes.', 'Campus events, a local downtown, and some athletics.', 'Off-campus jobs and internships can be limited.'],
    ['Close faculty contact with more majors than a small college.', 'Clubs and outdoor recreation; campus is the social center.', 'Travel home and to internships takes planning.']
  ],
  [
    ['Wide course range; city internships.', 'The city is the campus.', 'Higher living costs; campus can feel less unified.'],
    ['Big intro lectures with discussion sections; a huge range of majors.', 'Big athletics, many clubs, and a city within reach.', 'Popular classes can fill fast, so plan registration carefully.'],
    ['Big intro lectures, smaller upper-level classes.', 'Game days, downtown, huge range of clubs.', 'You need to seek out your smaller communities.'],
    ['Large lectures early; specialized programs such as agriculture or engineering.', 'The campus is the town: games, clubs, and events.', 'Distance from cities limits internships during the school year.']
  ]
];

let sizePref, settingPref, sizeLabel, settingLabel;
let pinInput, pinSize, pinSetting, placeButton, clearButton;
let note;
let pins = [];          // { name, size, setting }
let selected = null;    // { r, c }
let grid = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  sizeLabel = createSpan('Your preferred size:');
  sizePref = createSelect();
  ['No preference', ...SIZES].forEach(o => sizePref.option(o));
  settingLabel = createSpan('setting:');
  settingPref = createSelect();
  ['No preference', ...SETTINGS].forEach(o => settingPref.option(o));

  pinInput = createInput('');
  pinInput.attribute('placeholder', 'Place a college');
  pinInput.size(140);
  pinSize = createSelect();
  SIZES.forEach(o => pinSize.option(o));
  pinSetting = createSelect();
  SETTINGS.forEach(o => pinSetting.option(o));
  placeButton = createButton('Place pin');
  placeButton.mousePressed(placePin);
  clearButton = createButton('Clear pins');
  clearButton.mousePressed(() => { pins = []; });

  note = createSpan('Tip: copy your size and setting answers from the College Self-Assessment.');
  [sizeLabel, settingLabel, note].forEach(s => s.style('font-size', '14px'));
  note.style('color', 'dimgray');

  positionControls();
  describe('A three by four grid of college size (small, medium, large) by setting (urban, suburban, college town, rural). Click a cell to read typical classes, weekends, and what to watch for. Dropdowns highlight your preferred size and setting, and you can pin colleges you are considering onto the grid.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([sizeLabel, sizePref, settingLabel, settingPref], 10, y, 30) + 34;
  y = flowRow([pinInput, pinSize, pinSetting, placeButton, clearButton], 10, y, 30) + 32;
  flowRow([note], 10, y, 30);
  note.style('white-space', 'normal');
  note.style('width', (canvasWidth - 24) + 'px');
}

// Place controls left to right using their real widths; wrap when the row is full.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style('white-space', 'nowrap');
    c.position(x, y);
    const w = c.elt.offsetWidth || c.cachedWidth || 100;
    c.cachedWidth = w;
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 8;
  }
  return y;
}

function placePin() {
  const name = pinInput.value().trim();
  if (!name || pins.length >= 8) return;
  pins.push({ name: name, size: SIZES.indexOf(pinSize.value()), setting: SETTINGS.indexOf(pinSetting.value()) });
  pinInput.value('');
  selected = { r: pins[pins.length - 1].size, c: pins[pins.length - 1].setting };
}

function layoutGrid() {
  const narrow = canvasWidth < 560;
  const labelW = narrow ? 58 : 108;
  const top = 64;
  const colW = (canvasWidth - labelW - margin) / 4;
  const rowH = narrow ? 82 : 92;
  grid = { labelW, top, colW, rowH, narrow, left: labelW };
}

function cellRect(r, c) {
  return { x: grid.left + c * grid.colW, y: grid.top + r * grid.rowH, w: grid.colW, h: grid.rowH };
}

function cellAt(mx, my) {
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const b = cellRect(r, c);
    if (mx > b.x && mx < b.x + b.w && my > b.y && my < b.y + b.h) return { r, c };
  }
  return null;
}

function draw() {
  layoutGrid();
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
  text('Campus Size and Setting Explorer', canvasWidth / 2, 8);

  // column and row headers
  textStyle(BOLD);
  textSize(grid.narrow ? 12 : 15);
  SETTINGS.forEach((s, c) => {
    const b = cellRect(0, c);
    fill(settingPref.value() === s ? 'darkgoldenrod' : 'black');
    textAlign(CENTER, BOTTOM);
    text(s, b.x + b.w / 2, grid.top - 6);
  });
  SIZES.forEach((s, r) => {
    const b = cellRect(r, 0);
    fill(sizePref.value() === s ? 'darkgoldenrod' : 'black');
    textAlign(LEFT, CENTER);
    text(s, 8, b.y + b.h / 2 - 8);
    textStyle(NORMAL);
    textSize(grid.narrow ? 10 : 12);
    fill('dimgray');
    text(grid.narrow ? SIZE_SHORT[r] : SIZE_DETAIL[r], 8, b.y + b.h / 2 + 10, grid.labelW - 10);
    textStyle(BOLD);
    textSize(grid.narrow ? 12 : 15);
  });
  textStyle(NORMAL);

  const hovered = cellAt(mouseX, mouseY);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) drawCell(r, c, hovered);
  drawInfo();
  cursor(hovered ? HAND : ARROW);
}

function inTarget(r, c) {
  const sp = sizePref.value(), st = settingPref.value();
  if (sp === 'No preference' && st === 'No preference') return false;
  const sizeOK = sp === 'No preference' || SIZES[r] === sp;
  const setOK = st === 'No preference' || SETTINGS[c] === st;
  return sizeOK && setOK;
}

function drawCell(r, c, hovered) {
  const b = cellRect(r, c);
  const isSel = selected && selected.r === r && selected.c === c;
  const isHover = hovered && hovered.r === r && hovered.c === c;
  const target = inTarget(r, c);
  stroke(isSel ? 'goldenrod' : (isHover ? 'navy' : 'white'));
  strokeWeight(isSel ? 3 : (isHover ? 2 : 1));
  fill(target ? 'lightgoldenrodyellow' : TINTS[c]);
  rect(b.x + 2, b.y + 2, b.w - 4, b.h - 4, 8);
  if (target) {
    noFill();
    stroke('gold');
    strokeWeight(2);
    rect(b.x + 5, b.y + 5, b.w - 10, b.h - 10, 6);
  }
  strokeWeight(1);

  // icon scaled by size
  const s = [0.55, 0.75, 1][r];
  push();
  translate(b.x + b.w / 2, b.y + b.h * 0.42);
  scale(s * min(1, b.w / 120));
  drawIcon(c);
  pop();

  // label and pins
  noStroke();
  fill('black');
  textAlign(CENTER, BOTTOM);
  textSize(grid.narrow ? 10 : 12);
  if (!grid.narrow) text(SIZES[r] + ' ' + SETTINGS[c].toLowerCase(), b.x + b.w / 2, b.y + b.h - 6);

  const here = pins.map((p, i) => ({ p, i })).filter(o => o.p.size === r && o.p.setting === c);
  here.forEach((o, k) => {
    const px = b.x + 14 + (k % 4) * 16;
    const py = b.y + 14 + floor(k / 4) * 16;
    fill('royalblue');
    circle(px, py, 15);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(10);
    text(o.i + 1, px, py);
  });
}

// Simple icons: 0 skyline, 1 houses, 2 main street, 3 hills
function drawIcon(kind) {
  noStroke();
  if (kind === 0) {
    fill('slategray');
    rect(-30, -10, 14, 40); rect(-14, -28, 16, 58); rect(4, -18, 12, 48); rect(18, -4, 14, 34);
    fill('lightyellow');
    for (let i = 0; i < 4; i++) rect(-10, -22 + i * 12, 4, 5);
  } else if (kind === 1) {
    fill('peru');
    rect(-30, 0, 22, 22); rect(4, 4, 22, 18);
    fill('brown');
    triangle(-33, 0, -19, -14, -5, 0);
    triangle(1, 4, 15, -8, 29, 4);
    fill('seagreen');
    circle(-40, 16, 14);
  } else if (kind === 2) {
    fill('burlywood');
    rect(-34, -6, 20, 28); rect(-12, -12, 22, 34); rect(12, -4, 22, 26);
    fill('firebrick');
    rect(-36, -8, 24, 5); rect(10, -6, 26, 5);
    fill('steelblue');
    rect(-10, -14, 26, 5);
    fill('gray');
    rect(-38, 22, 76, 4);
  } else {
    fill('darkseagreen');
    arc(-12, 24, 56, 50, PI, TWO_PI);
    fill('mediumseagreen');
    arc(16, 24, 48, 36, PI, TWO_PI);
    fill('saddlebrown');
    rect(28, 6, 3, 14);
    fill('forestgreen');
    triangle(22, 8, 30, -10, 38, 8);
  }
}

function drawInfo() {
  const y = grid.top + 3 * grid.rowH + 10;
  const x = margin, w = canvasWidth - 2 * margin, h = drawHeight - y - 8;
  stroke('silver');
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);

  if (!selected) {
    fill('dimgray');
    textSize(15);
    text('Click any cell to see typical classes, weekends, and what to watch for. Pick your preferred size and setting below to highlight your target zone.', x + 12, y + 10, w - 24, h - 20);
  } else {
    const info = cells[selected.r][selected.c];
    fill('darkgoldenrod');
    textSize(16);
    textStyle(BOLD);
    text(SIZES[selected.r] + ' ' + SETTINGS[selected.c].toLowerCase() + ' (' + SIZE_DETAIL[selected.r] + ' students)', x + 12, y + 8, w - 24);
    textStyle(NORMAL);
    const labels = ['Typical classes: ', 'Typical weekends: ', 'Watch for: '];
    textSize(grid.narrow ? 13 : 14);
    let ly = y + 32;
    labels.forEach((l, i) => {
      fill('black');
      text('• ' + l + info[i], x + 12, ly, w - 24, 40);
      ly += grid.narrow ? 34 : 22;
    });
  }

  // pin legend
  if (pins.length) {
    fill('royalblue');
    textSize(12);
    const legend = pins.map((p, i) => (i + 1) + ' ' + p.name).join('   ');
    text('Your pins: ' + legend, x + 12, y + h - 20, w - 24, 18);
  }
}

function mousePressed() {
  const c = cellAt(mouseX, mouseY);
  if (c) selected = c;
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
