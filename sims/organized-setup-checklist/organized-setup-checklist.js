// Getting Organized Setup Checklist
// CANVAS_HEIGHT: 640
// Twelve setup tasks in two groups, a progress ring, and a "why it matters" panel for the task
// you last hovered or clicked. Two tasks show a hint until their prerequisite is checked.
// Your checks are saved in this browser (localStorage) when storage is available.

let canvasWidth = 400;
let drawHeight = 190;
let controlHeight = 450;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

const STORAGE_KEY = 'organized-setup-checklist-v1';

const TASKS = [
  { group: 0, label: 'Shared tracker set up', why: 'One place for every deadline, shared with your family, keeps a dozen applications from becoming chaos.', ch: 'Chapter 5' },
  { group: 0, label: 'Common App account created', why: 'Your profile, activities, and essays carry over when the new application year opens on August 1.', ch: 'Chapters 5 and 12', hint: 'Create your dedicated email first' },
  { group: 0, label: 'Two teachers asked', why: 'Teachers write many letters. Asking in spring or early fall gives them time to write a strong one.', ch: 'Chapter 11' },
  { group: 0, label: 'Activities resume drafted', why: 'A resume becomes your activities list and gives recommenders something specific to write about.', ch: 'Chapter 8' },
  { group: 0, label: 'Essay-material list started', why: 'Jotting down stories and moments now makes the personal essay much easier to start.', ch: 'Chapter 9' },
  { group: 1, label: 'Dedicated email created', why: 'A professional address you check daily means no college message gets lost among other email.', ch: 'Chapter 5' },
  { group: 1, label: 'Login credentials record set up', why: 'You\'ll create a portal account for every college. A secure record of logins saves hours later.', ch: 'Chapter 5' },
  { group: 1, label: 'Document folder with subfolders', why: 'A folder per college lets you find a confirmation or screenshot in thirty seconds.', ch: 'Chapter 5' },
  { group: 1, label: 'Unofficial transcript saved', why: 'You\'ll need your courses and grades to fill in the Common App\'s Education section.', ch: 'Chapters 2 and 12' },
  { group: 1, label: 'Calendar reminders for first deadlines', why: 'Reminders set a week or two ahead of each deadline turn the tracker into action.', ch: 'Chapter 5', hint: 'Set up the tracker first' },
  { group: 1, label: 'Counselor meeting scheduled', why: 'Your counselor sends your transcript and school report and knows the school\'s deadlines.', ch: 'Chapters 5 and 11' },
  { group: 1, label: 'Family roles discussed', why: 'Deciding who handles what (forms, deadlines, money conversations) prevents arguments in October.', ch: 'Chapters 5 and 14' }
];

let boxes = [], hints = [];
let groupLabels = [];
let resetButton, nextButton;
let focusTask = -1;
let nextHighlight = -1;
let storageOK = true;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // prerequisites by label, so the order of TASKS can change safely
  const idx = l => TASKS.findIndex(t => t.label === l);
  TASKS[idx('Common App account created')].needs = idx('Dedicated email created');
  TASKS[idx('Calendar reminders for first deadlines')].needs = idx('Shared tracker set up');

  groupLabels = ['Five First Steps', 'Foundations'].map(t => {
    const s = createSpan(t);
    s.style('font-weight', 'bold');
    s.style('font-size', '15px');
    return s;
  });
  const saved = loadState();
  TASKS.forEach((t, i) => {
    const c = createCheckbox(' ' + t.label, !!saved[i]);
    c.style('font-size', '15px');
    c.changed(() => { saveState(); focusTask = i; nextHighlight = -1; styleBoxes(); });
    c.mouseOver(() => { focusTask = i; });
    boxes.push(c);
    const h = createSpan(t.hint ? '🔒 ' + t.hint : '');
    h.style('font-size', '12px');
    h.style('color', 'darkorange');
    hints.push(h);
  });

  resetButton = createButton('Reset');
  resetButton.mousePressed(() => { boxes.forEach(b => b.checked(false)); saveState(); nextHighlight = -1; styleBoxes(); });
  nextButton = createButton("Show me what's next");
  nextButton.mousePressed(() => {
    nextHighlight = boxes.findIndex(b => !b.checked());
    if (nextHighlight >= 0) focusTask = nextHighlight;
    styleBoxes();
  });

  positionControls();
  styleBoxes();
  describe('A checklist of twelve setup tasks for getting organized for college applications, in two groups: Five First Steps and Foundations. A progress ring shows how many are done, and a panel explains why each task matters and which chapter covers it.');
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    storageOK = false;
    return [];
  }
}

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(boxes.map(b => b.checked())));
  } catch (e) {
    storageOK = false;
  }
}

function positionControls() {
  const twoCol = canvasWidth >= 700;
  const lineH = 26;
  const colX = [10, twoCol ? floor(canvasWidth / 2) + 5 : 10];
  const y0 = drawHeight + 10;
  let y = y0;
  [0, 1].forEach(g => {
    if (twoCol) y = y0;          // side-by-side columns both start at the top
    else if (g === 1) y += 8;    // single column: group 1 continues below group 0
    groupLabels[g].position(colX[g], y);
    y += lineH;
    TASKS.forEach((t, i) => {
      if (t.group !== g) return;
      boxes[i].position(colX[g] + 6, y);
      boxes[i].style('white-space', 'nowrap');
      hints[i].position(colX[g] + 30, y + 19);
      y += lineH + (t.hint ? 12 : 0);
    });
  });
  const by = drawHeight + controlHeight - 40;
  resetButton.position(10, by);
  nextButton.position(80, by);
}

function styleBoxes() {
  boxes.forEach((b, i) => {
    b.style('background', i === nextHighlight ? 'gold' : 'none');
    b.style('border-radius', '4px');
    b.style('padding', '0 4px');
    const t = TASKS[i];
    const locked = t.needs !== undefined && !boxes[t.needs].checked() && !b.checked();
    locked ? hints[i].show() : hints[i].hide();
  });
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
  text('Getting Organized Checklist', canvasWidth / 2, 8);

  const done = boxes.filter(b => b.checked()).length;
  const total = TASKS.length;
  const complete = done === total;

  // progress ring
  const cx = margin + 70, cy = 108, d = 120;
  noFill();
  strokeWeight(14);
  stroke('gainsboro');
  circle(cx, cy, d);
  stroke(complete ? 'seagreen' : 'steelblue');
  if (done > 0) arc(cx, cy, d, d, -HALF_PI, -HALF_PI + TWO_PI * done / total);
  strokeWeight(1);
  noStroke();
  fill(complete ? 'seagreen' : 'navy');
  textAlign(CENTER, CENTER);
  textSize(26);
  textStyle(BOLD);
  text(round(done / total * 100) + '%', cx, cy - 6);
  textStyle(NORMAL);
  textSize(13);
  fill('dimgray');
  text(done + ' of ' + total + ' done', cx, cy + 20);

  // info panel
  const px = margin + 160, pw = canvasWidth - px - margin, py = 44, ph = drawHeight - 56;
  stroke('silver');
  fill('white');
  rect(px, py, pw, ph, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (complete) {
    fill('seagreen');
    textSize(16);
    textStyle(BOLD);
    text('Your systems are in place. Next: testing decisions in Chapter 6.', px + 12, py + 12, pw - 24, ph - 24);
    textStyle(NORMAL);
  } else if (focusTask >= 0) {
    const t = TASKS[focusTask];
    fill('darkgoldenrod');
    textSize(15);
    textStyle(BOLD);
    text(t.label, px + 12, py + 10, pw - 24);
    textStyle(NORMAL);
    fill('black');
    textSize(canvasWidth < 500 ? 13 : 14);
    text(t.why, px + 12, py + 34, pw - 24, ph - 60);
    fill('steelblue');
    textSize(12);
    text('Covered in ' + t.ch, px + 12, py + ph - 20, pw - 24);
  } else {
    fill('dimgray');
    textSize(14);
    text('Hover over or check a task below to see why it matters. Press "Show me what\'s next" to find your next step.', px + 12, py + 12, pw - 24, ph - 24);
  }
  if (!storageOK) {
    fill('gray');
    textSize(10);
    textAlign(RIGHT, BOTTOM);
    text('Progress won\'t be saved in this browser.', canvasWidth - margin - 4, drawHeight - 4);
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
