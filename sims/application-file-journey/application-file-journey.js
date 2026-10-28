// The Journey of an Application File
// CANVAS_HEIGHT: 556
// A swimlane flowchart of how an application moves through an admissions office.
// Click a step to read about it, or press "Follow a file" and then "Next" to move a file
// icon one step at a time. The checkbox shows how a formula-based public university
// shortens committee review. Narrow screens show the steps as a vertical list.

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 76;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let followButton, nextButton, formulaBox;

const lanes = [
  { name: 'Applicant', short: 'Applicant', color: 'lavender' },
  { name: 'Operations staff', short: 'Operations', color: 'honeydew' },
  { name: 'Admissions officer (first reader)', short: 'First reader', color: 'lightcyan' },
  { name: 'Second reader / committee', short: 'Committee', color: 'mistyrose' },
  { name: 'Dean or director', short: 'Dean', color: 'cornsilk' }
];

const steps = [
  { lane: 0, label: 'Application submitted',
    info: 'The form and essays arrive through the Common App or the college\'s own portal.' },
  { lane: 1, label: 'Documents matched',
    info: 'Staff match the transcript, recommendations, and scores to the file and send a missing-items notice if anything is absent. The file is "complete" only when everything is matched.' },
  { lane: 2, label: 'First read',
    info: 'The regional officer reads the whole file in the context of the high school, writes a short summary, and gives preliminary ratings (for example academic, activities, personal qualities).' },
  { lane: 3, label: 'Second read or committee',
    info: 'Another reader or a committee reviews the summary; the first reader may advocate for the applicant.',
    formulaLabel: 'Brief check',
    formulaInfo: 'At a formula-based public university, an application that clears the index threshold is admitted with little or no committee review. The University of Iowa, for example, admits residents with a Regent Admission Index of 245 or higher (255 for nonresidents) to its main college. Committees look closely only at files near or below the line.' },
  { lane: 3, label: 'Decision?', diamond: true,
    info: 'Admit, deny, waitlist, or (in early rounds) defer.' },
  { lane: 4, label: 'Final review',
    info: 'Decisions are checked against the class goals and approved.' },
  { lane: 0, label: 'Decision released',
    info: 'Posted in the applicant portal on the announced date.' }
];

let selected = -1;       // step shown in the info panel
let following = false;   // step-through mode
let fileStep = 0;        // which step the file icon is on
let iconX = 0, iconY = 0, iconTargetX = 0, iconTargetY = 0;
let boxes = [];          // computed geometry per step
let infoTop = 300;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  followButton = createButton('Follow a file');
  followButton.mousePressed(startFollow);
  nextButton = createButton('Next ▶');
  nextButton.mousePressed(nextStep);
  formulaBox = createCheckbox(' Formula-based public university', false);
  formulaBox.changed(() => { if (selected === 3) selected = 3; });

  positionControls();
  layout();
  describe('A swimlane flowchart with five lanes: Applicant, Operations staff, Admissions officer, Second reader or committee, and Dean or director. Seven steps take an application from submission to a released decision. Click a step or press Follow a file and Next to read what happens at each step.');
}

function positionControls() {
  flowRow([followButton, nextButton, formulaBox], 10, drawHeight + 13, 26);
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
    x += w + 14;
  }
}

function isWide() {
  return canvasWidth >= 620;
}

function layout() {
  boxes = [];
  if (isWide()) {
    const top = 44, laneH = 46, labelW = 144;
    const colW = (canvasWidth - labelW - margin) / steps.length;
    steps.forEach((s, i) => {
      const w = colW - 10, h = laneH - 10;
      boxes.push({ x: labelW + i * colW + 5, y: top + s.lane * laneH + 5, w: w, h: h });
    });
    infoTop = top + lanes.length * laneH + 12;
  } else {
    const top = 44, rowH = 34;
    steps.forEach((s, i) => {
      boxes.push({ x: margin + 26, y: top + i * rowH, w: canvasWidth - 2 * margin - 26, h: rowH - 8 });
    });
    infoTop = top + steps.length * rowH + 8;
  }
}

function boxCenter(i) {
  const b = boxes[i];
  return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
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
  text('The Journey of an Application File', canvasWidth / 2, 10);

  if (isWide()) drawLanes();
  drawArrows();
  drawSteps();
  drawFileIcon();
  drawInfo();

  cursor(stepAt(mouseX, mouseY) >= 0 ? HAND : ARROW);
}

function drawLanes() {
  const top = 44, laneH = 46, labelW = 144;
  lanes.forEach((l, k) => {
    noStroke();
    fill(l.color);
    rect(4, top + k * laneH, canvasWidth - 4 - margin + 10, laneH);
    stroke('white');
    line(4, top + k * laneH, canvasWidth - margin + 10, top + k * laneH);
    noStroke();
    fill('black');
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(l.name, 10, top + k * laneH + 2, labelW - 14, laneH - 4);
    textStyle(NORMAL);
  });
}

function drawArrows() {
  stroke('gray');
  strokeWeight(1.5);
  noFill();
  for (let i = 0; i < steps.length - 1; i++) {
    const a = boxes[i], b = boxes[i + 1];
    if (isWide()) {
      // elbow connector: right edge of a → left edge of b
      const x1 = a.x + a.w, y1 = a.y + a.h / 2;
      const x2 = b.x, y2 = b.y + b.h / 2;
      const mx = (x1 + x2) / 2;
      line(x1, y1, mx, y1);
      line(mx, y1, mx, y2);
      line(mx, y2, x2 - 3, y2);
      arrowHead(x2 - 2, y2, 0);
    } else {
      const x = a.x + 14;
      line(x, a.y + a.h, x, b.y - 3);
      arrowHead(x, b.y - 2, HALF_PI);
    }
  }
  strokeWeight(1);
}

function arrowHead(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  noStroke();
  fill('gray');
  triangle(0, 0, -7, -4, -7, 4);
  pop();
}

function stepLabel(i) {
  const s = steps[i];
  if (i === 3 && formulaBox.checked()) return s.formulaLabel;
  return s.label;
}

function drawSteps() {
  const hovered = stepAt(mouseX, mouseY);
  steps.forEach((s, i) => {
    const b = boxes[i];
    const active = i === selected;
    const shortened = i === 3 && formulaBox.checked();
    stroke(active ? 'goldenrod' : (i === hovered ? 'navy' : 'slategray'));
    strokeWeight(active ? 3 : 1.5);
    if (shortened) drawingContext.setLineDash([5, 4]);
    fill(isWide() ? 'white' : lanes[s.lane].color);
    if (s.diamond && isWide()) {
      const c = boxCenter(i);
      quad(c.x, b.y - 2, b.x + b.w, c.y, c.x, b.y + b.h + 2, b.x, c.y);
    } else {
      const w = shortened && isWide() ? b.w * 0.7 : b.w;
      const x = shortened && isWide() ? b.x + (b.w - w) / 2 : b.x;
      rect(x, b.y, w, b.h, s.diamond ? 2 : 10);
    }
    drawingContext.setLineDash([]);
    strokeWeight(1);

    noStroke();
    fill('black');
    if (isWide()) {
      textAlign(CENTER, CENTER);
      textSize(s.diamond ? 12 : 13);
      text(stepLabel(i), b.x + 3, b.y, b.w - 6, b.h);
    } else {
      textAlign(LEFT, CENTER);
      textSize(14);
      text((i + 1) + '. ' + stepLabel(i), b.x + 30, b.y + b.h / 2);
      fill('dimgray');
      textAlign(RIGHT, CENTER);
      textSize(12);
      text(lanes[s.lane].short, b.x + b.w - 8, b.y + b.h / 2);
    }
    // step number badge in wide mode
    if (isWide()) {
      fill('slategray');
      circle(b.x + 2, b.y + 2, 16);
      fill('white');
      textAlign(CENTER, CENTER);
      textSize(10);
      text(i + 1, b.x + 2, b.y + 2);
    }
  });
}

function drawFileIcon() {
  if (!following) return;
  // ease toward the current step
  iconX = lerp(iconX, iconTargetX, 0.25);
  iconY = lerp(iconY, iconTargetY, 0.25);
  push();
  translate(iconX, iconY);
  stroke('saddlebrown');
  strokeWeight(1.5);
  fill('burlywood');
  rect(-11, -8, 22, 16, 2);
  rect(-11, -11, 9, 4, 1);
  pop();
}

function drawInfo() {
  const x = margin, y = infoTop, w = canvasWidth - 2 * margin, h = drawHeight - infoTop - 10;
  stroke('silver');
  fill(255, 255, 255, 240);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (selected < 0) {
    fill('dimgray');
    textSize(15);
    text('Click any step to read what happens there, or press "Follow a file" and then "Next" to walk a file through the office.', x + 12, y + 10, w - 24, h - 20);
    return;
  }
  const s = steps[selected];
  const shortened = selected === 3 && formulaBox.checked();
  fill('darkgoldenrod');
  textSize(17);
  textStyle(BOLD);
  text('Step ' + (selected + 1) + ': ' + stepLabel(selected), x + 12, y + 10, w - 24);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(13);
  text('Who: ' + lanes[s.lane].name, x + 12, y + 34, w - 24);
  fill('black');
  textSize(15);
  text(shortened ? s.formulaInfo : s.info, x + 12, y + 54, w - 24, h - 60);
  if (following) {
    fill('steelblue');
    textSize(13);
    textAlign(RIGHT, BOTTOM);
    text(fileStep < steps.length - 1 ? 'Press Next ▶ to continue' : 'The file has reached the applicant. Press Follow a file to start over.',
         x + w - 10, y + h - 6);
  }
}

function stepAt(mx, my) {
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    if (mx > b.x && mx < b.x + b.w && my > b.y && my < b.y + b.h) return i;
  }
  return -1;
}

function moveIconTo(i, jump) {
  const b = boxes[i];
  iconTargetX = isWide() ? b.x + b.w - 6 : b.x - 14;
  iconTargetY = isWide() ? b.y - 4 : b.y + b.h / 2;
  if (jump) { iconX = iconTargetX; iconY = iconTargetY; }
}

function startFollow() {
  following = true;
  fileStep = 0;
  selected = 0;
  moveIconTo(0, true);
}

function nextStep() {
  if (!following) { startFollow(); return; }
  if (fileStep < steps.length - 1) {
    fileStep++;
    selected = fileStep;
    moveIconTo(fileStep, false);
  }
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const i = stepAt(mouseX, mouseY);
  if (i >= 0) selected = i;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layout();
  positionControls();
  if (following) moveIconTo(fileStep, true);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
