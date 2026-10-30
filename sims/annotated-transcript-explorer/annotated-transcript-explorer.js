// Annotated Transcript Explorer
// CANVAS_HEIGHT: 580
// A fictional transcript for Emily A. Johnson. Hover a region for a one-line tooltip, click it
// for the full explanation, or press "Read it like an officer" to step through the regions
// in the order an admissions reader usually scans them. The GPA box is computed from the
// course list below (A = 4, A- = 3.67, B = 3; weighted adds +1.0 for AP and +0.5 for Honors).

let canvasWidth = 400;
let drawHeight = 530;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

let officerButton, backButton, nextButton;

// The transcript is drawn in a fixed 520 × 480 "page" coordinate system and scaled to fit.
const PAGE_W = 520, PAGE_H = 480;
let pageX = 0, pageY = 0, pageScale = 1;
let infoBox = { x: 0, y: 0, w: 0, h: 0 };

const years = [
  { label: 'Grade 9 · 2023–24', courses: [
    ['English 9', 'A', 1], ['Honors Geometry', 'B', 1, 'H'], ['Earth Science', 'A-', 1],
    ['World Geography', 'A-', 1], ['Spanish I', 'A-', 1], ['Physical Education', 'A', 0.5]] },
  { label: 'Grade 10 · 2024–25', courses: [
    ['Honors English 10', 'A', 1, 'H'], ['Algebra II', 'A-', 1], ['Honors Biology', 'A', 1, 'H'],
    ['World History', 'A-', 1], ['Spanish II', 'A', 1]] },
  { label: 'Grade 11 · 2025–26', courses: [
    ['AP English Language', 'A', 1, 'AP'], ['Precalculus', 'B', 1], ['AP Chemistry', 'B', 1, 'AP'],
    ['AP U.S. History', 'A', 1, 'AP'], ['Spanish III', 'A', 1], ['Health (semester)', 'A', 0.5]] },
  { label: 'Grade 12 · 2026–27', inProgress: true, courses: [
    ['AP English Literature', 'IP', 1, 'AP'], ['AP Calculus AB', 'IP', 1, 'AP'], ['Physics', 'IP', 1],
    ['AP U.S. Government', 'IP', 1, 'AP'], ['AP Psychology', 'IP', 1, 'AP']] }
];

const points = { 'A': 4, 'A-': 3.67, 'B+': 3.33, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };

// Table geometry in page coordinates
const tables = [
  { x: 12, y: 84 }, { x: 266, y: 84 }, { x: 12, y: 236 }, { x: 266, y: 236 }
];
const TABLE_W = 242, ROW_H = 18, HEAD_H = 22;
const COL_NAME = 0, COL_GRADE = 168, COL_CRED = 206;

// Regions: each has one or more rectangles in page coordinates
let regions = [];

function buildRegions() {
  const nameRects = [], gradeRects = [], credRects = [], headRects = [];
  for (let k = 0; k < 3; k++) {
    const t = tables[k], n = years[k].courses.length;
    nameRects.push([t.x, t.y + HEAD_H, COL_GRADE - 2, n * ROW_H + 4]);
    gradeRects.push([t.x + COL_GRADE - 2, t.y + HEAD_H, COL_CRED - COL_GRADE, n * ROW_H + 4]);
    credRects.push([t.x + COL_CRED - 2, t.y + HEAD_H, TABLE_W - COL_CRED + 2, n * ROW_H + 4]);
    headRects.push([t.x, t.y, TABLE_W, HEAD_H]);
  }
  const t12 = tables[3];
  headRects.push([t12.x, t12.y, TABLE_W, HEAD_H]);
  regions = [
    { name: 'Header', rects: [[0, 0, PAGE_W, 74]],
      tip: 'Who you are and which school sent this.',
      info: 'Identifies you and your school. The CEEB code is the six-digit code colleges use to match the transcript to your school profile.' },
    { name: 'Course names', rects: nameRects,
      tip: 'What you studied, with advanced courses marked.',
      info: 'What you studied. Labels like H (honors), AP, IB, or DE (dual enrollment) mark advanced courses.' },
    { name: 'Grades column', rects: gradeRects,
      tip: 'How you did in each course.',
      info: 'How you did in each course, term by term or year by year depending on the school.' },
    { name: 'Credits column', rects: credRects,
      tip: 'How much each course counts.',
      info: 'How much each course counts. A full-year course is often 1.0 credit; a semester course 0.5.' },
    { name: 'Year-by-year layout', rects: headRects,
      tip: 'Shows your grade trend over time.',
      info: 'Lets the reader see your grade trend. An upward trend is a strong signal. Emily\'s record holds steady even as junior year got harder.' },
    { name: 'Cumulative GPA', rects: [[12, 396, 242, 44]],
      tip: 'Your average, as your school calculates it.',
      info: 'Your average. Schools differ in how they calculate it, so many colleges recalculate it themselves. Here the weighted GPA adds +1.0 for AP and +0.5 for Honors; other schools use other rules.' },
    { name: 'Class rank', rects: [[12, 444, 242, 22]],
      tip: 'Many schools no longer rank.',
      info: 'Many high schools no longer rank students. When they don\'t, colleges rely on the school profile instead.' },
    { name: 'Senior courses (In Progress)', rects: [[t12.x, t12.y + HEAD_H, TABLE_W, years[3].courses.length * ROW_H + 4]],
      tip: 'What you\'re taking this year.',
      info: 'Colleges see what you\'re taking this year and will ask for your final grades. Four APs as a senior shows Emily kept challenging herself.' },
    { name: 'Counselor signature and seal', rects: [[266, 396, 242, 70]],
      tip: 'Makes it official.',
      info: 'Marks the document as official. It must come from the school, not from you.' }
  ];
}

// The order an officer typically scans: header, senior courses, course names, grades, trend, GPA
const officerOrder = [0, 7, 1, 2, 4, 5];
let touring = false, tourIndex = 0;
let selected = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  buildRegions();

  officerButton = createButton('Read it like an officer');
  officerButton.mousePressed(startTour);
  backButton = createButton('◀ Back');
  backButton.mousePressed(() => stepTour(-1));
  nextButton = createButton('Next ▶');
  nextButton.mousePressed(() => stepTour(1));
  positionControls();
  layout();
  describe('A fictional high school transcript for Emily A. Johnson with nine labeled regions: header, course names, grades, credits, year-by-year layout, cumulative GPA, class rank, senior courses in progress, and the counselor signature. Hover or click a region to read what it tells an admissions reader.');
}

function positionControls() {
  officerButton.position(10, drawHeight + 12);
  backButton.position(10 + officerButton.elt.offsetWidth + 12, drawHeight + 12);
  nextButton.position(10 + officerButton.elt.offsetWidth + backButton.elt.offsetWidth + 22, drawHeight + 12);
}

function layout() {
  const wide = canvasWidth >= 760;
  if (wide) {
    const pw = min(PAGE_W, canvasWidth * 0.62);
    pageScale = pw / PAGE_W;
    pageX = margin;
    pageY = 40;
    infoBox = { x: pageX + pw + 16, y: 40, w: canvasWidth - (pageX + pw + 16) - margin, h: PAGE_H * pageScale };
  } else {
    const pw = canvasWidth - 2 * margin;
    pageScale = min(1, pw / PAGE_W);
    pageX = (canvasWidth - PAGE_W * pageScale) / 2;
    pageY = 38;
    const top = pageY + PAGE_H * pageScale + 8;
    infoBox = { x: margin, y: top, w: canvasWidth - 2 * margin, h: drawHeight - top - 8 };
  }
}

function gpa(weighted) {
  let total = 0, credits = 0;
  for (let k = 0; k < 3; k++) {
    for (const c of years[k].courses) {
      let p = points[c[1]];
      if (weighted && c[3] === 'AP') p += 1;
      if (weighted && c[3] === 'H') p += 0.5;
      total += p * c[2];
      credits += c[2];
    }
  }
  return total / credits;
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
  textSize(20);
  text('Annotated Transcript Explorer', canvasWidth / 2, 9);

  const hovered = regionAt(mouseX, mouseY);
  push();
  translate(pageX, pageY);
  scale(pageScale);
  drawPage();
  drawRegionOutlines(hovered);
  pop();

  drawInfo();
  if (hovered >= 0 && hovered !== selected) drawTooltip(hovered);
  cursor(hovered >= 0 ? HAND : ARROW);
}

function drawPage() {
  // paper
  stroke('gray');
  fill('white');
  rect(0, 0, PAGE_W, PAGE_H, 4);
  noStroke();
  fill(40);
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  text('LINCOLN HIGH SCHOOL', 12, 8);
  textStyle(NORMAL);
  textSize(11);
  fill(70);
  text('Official Academic Transcript · CEEB code 123456', 12, 28);
  textSize(12);
  fill(30);
  text('Student: Emily A. Johnson', 12, 48);
  text('Date of birth: 03/14/2009', 170, 48);
  text('Expected graduation: June 2027', 330, 48);
  stroke(180);
  line(8, 74, PAGE_W - 8, 74);

  years.forEach((y, k) => drawTable(y, tables[k]));

  // GPA box
  stroke(150);
  fill(248);
  rect(12, 396, 242, 44, 3);
  noStroke();
  fill(30);
  textSize(12);
  textStyle(BOLD);
  text('Cumulative GPA (grades 9–11)', 18, 404);
  textStyle(NORMAL);
  text('Unweighted ' + nf(gpa(false), 1, 2) + '   ·   Weighted ' + nf(gpa(true), 1, 2), 18, 422);

  fill(30);
  textSize(12);
  text('Class rank: Not ranked', 18, 449);

  // signature and seal
  fill(30);
  textSize(12);
  text('Certified by: M. Alvarez, School Counselor', 272, 404, 165);
  stroke(60);
  line(272, 448, 420, 448);
  noStroke();
  textStyle(ITALIC);
  textSize(14);
  text('M. Alvarez', 280, 430);
  textStyle(NORMAL);
  stroke('firebrick');
  strokeWeight(2);
  noFill();
  circle(470, 430, 54);
  circle(470, 430, 44);
  strokeWeight(1);
  noStroke();
  fill('firebrick');
  textSize(9);
  textAlign(CENTER, CENTER);
  text('LINCOLN\nH.S.\nSEAL', 470, 430);

  fill(130);
  textSize(10);
  textAlign(RIGHT, BOTTOM);
  text('Sample transcript · fictional student', PAGE_W - 8, PAGE_H - 4);
}

function drawTable(y, t) {
  noStroke();
  fill(y.inProgress ? 'lightyellow' : 235);
  rect(t.x, t.y, TABLE_W, HEAD_H);
  fill(30);
  textAlign(LEFT, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(y.inProgress ? 'Grade 12 · In Progress' : y.label, t.x + 4, t.y + HEAD_H / 2);
  textStyle(NORMAL);
  textSize(10);
  fill(90);
  text('Grade', t.x + COL_GRADE, t.y + HEAD_H / 2);
  text('Credit', t.x + COL_CRED, t.y + HEAD_H / 2);
  y.courses.forEach((c, i) => {
    const ry = t.y + HEAD_H + 2 + i * ROW_H + ROW_H / 2;
    fill(30);
    textSize(12);
    text(c[0] + (c[3] && !c[0].startsWith('AP') && !c[0].startsWith('Honors') ? ' (' + c[3] + ')' : ''), t.x + 4, ry);
    text(c[1], t.x + COL_GRADE + 4, ry);
    text(nf(c[2], 1, 1), t.x + COL_CRED + 6, ry);
  });
  stroke(200);
  noFill();
  rect(t.x, t.y, TABLE_W, HEAD_H + y.courses.length * ROW_H + 6);
}

function drawRegionOutlines(hovered) {
  regions.forEach((r, i) => {
    const active = i === hovered || i === selected;
    stroke(active ? 'gold' : 'lightsteelblue');
    strokeWeight(active ? 3 / pageScale : 1.2 / pageScale);
    if (active) fill(255, 215, 0, 40); else noFill();
    r.rects.forEach(b => rect(b[0], b[1], b[2], b[3], 3));
  });
  strokeWeight(1);
}

function drawInfo() {
  const b = infoBox;
  stroke('silver');
  fill(255, 255, 255, 240);
  rect(b.x, b.y, b.w, b.h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (selected < 0) {
    fill('dimgray');
    textSize(15);
    text('Hover over the transcript to see its parts. Click a part to read what it tells an admissions reader, or press "Read it like an officer."',
         b.x + 12, b.y + 12, b.w - 24, b.h - 24);
    return;
  }
  const r = regions[selected];
  fill('darkgoldenrod');
  textSize(17);
  textStyle(BOLD);
  const head = touring ? 'Step ' + (tourIndex + 1) + ' of ' + officerOrder.length + ': ' + r.name : r.name;
  text(head, b.x + 12, b.y + 10, b.w - 24);
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  text(r.info, b.x + 12, b.y + 54, b.w - 24, b.h - 64);
}

function drawTooltip(i) {
  const label = regions[i].name + ': ' + regions[i].tip;
  textSize(13);
  const tw = min(textWidth(label) + 14, canvasWidth - 20);
  const tx = constrain(mouseX + 12, 10, canvasWidth - tw - 10);
  const ty = constrain(mouseY + 14, 10, drawHeight - 30);
  stroke('gray');
  fill('lightyellow');
  rect(tx, ty, tw, 22, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(label, tx + 7, ty + 11, tw - 10);
}

function regionAt(mx, my) {
  const px = (mx - pageX) / pageScale, py = (my - pageY) / pageScale;
  if (px < 0 || py < 0 || px > PAGE_W || py > PAGE_H) return -1;
  // later regions (senior table, GPA) are checked first so small regions win
  for (let i = regions.length - 1; i >= 0; i--) {
    for (const b of regions[i].rects) {
      if (px > b[0] && px < b[0] + b[2] && py > b[1] && py < b[1] + b[3]) return i;
    }
  }
  return -1;
}

function startTour() {
  touring = true;
  tourIndex = 0;
  selected = officerOrder[0];
}

function stepTour(d) {
  if (!touring) { startTour(); return; }
  tourIndex = constrain(tourIndex + d, 0, officerOrder.length - 1);
  selected = officerOrder[tourIndex];
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const i = regionAt(mouseX, mouseY);
  if (i >= 0) {
    selected = i;
    touring = false;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layout();
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
