// Recommender Comparison Tool
// CANVAS_HEIGHT: 620
// Letter strength (0–100) = how well they know you (50%) + recency (20%: 11th or 12th full,
// 10th half, 9th a quarter) + core subject (15%) + known for thoughtful, on-time letters (15%).
// Your grade in the class is shown but not counted. The best pair takes the top two, preferring
// different subjects when the scores are within 10%.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 220;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const SUBJECTS = ['English', 'Math', 'Science', 'Social studies', 'World language', 'Arts', 'Other'];
const CORE = ['English', 'Math', 'Science', 'Social studies', 'World language'];
const RECENCY = { 9: 0.25, 10: 0.5, 11: 1, 12: 1 };

const PRESETS = {
  "Priya's four teachers": [
    { name: 'Mr. Okafor (AP U.S. History)', subject: 'Social studies', taught: 11, grade: 'A', knows: 5, reliable: true },
    { name: 'Ms. Chen (AP English Language)', subject: 'English', taught: 11, grade: 'A', knows: 3, reliable: true },
    { name: 'Mr. Grant (AP Chemistry)', subject: 'Science', taught: 11, grade: 'B', knows: 5, reliable: true },
    { name: 'Mrs. Diaz (Spanish III)', subject: 'World language', taught: 11, grade: 'A', knows: 3, reliable: false }
  ],
  'Two English teachers': [
    { name: 'Ms. Alvarez (English 11)', subject: 'English', taught: 11, grade: 'A', knows: 5, reliable: true },
    { name: 'Mr. Brooks (English 12)', subject: 'English', taught: 12, grade: 'A', knows: 4, reliable: true },
    { name: 'Ms. Cole (Precalculus)', subject: 'Math', taught: 12, grade: 'B', knows: 4, reliable: true }
  ]
};

let teachers = [];
let selected = -1;
let cardRects = [];
let nameInput, subjectSelect, taughtSelect, gradeSelect, knowsSlider, knowsLabel, reliableBox;
let addButton, removeButton, presetButtons = [], clearButton;
let labels = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  const lab = t => { const s = createSpan(t); s.style('font-size', '14px'); labels.push(s); return s; };
  lab('Teacher:');
  nameInput = createInput('');
  nameInput.size(170);
  lab('Subject');
  subjectSelect = createSelect(); SUBJECTS.forEach(s => subjectSelect.option(s));
  lab('Grade taught');
  taughtSelect = createSelect(); [9, 10, 11, 12].forEach(g => taughtSelect.option(String(g)));
  lab('Your grade');
  gradeSelect = createSelect(); ['A', 'B', 'C'].forEach(g => gradeSelect.option(g));
  knowsLabel = lab('Knows you: 3');
  knowsLabel.style('display', 'inline-block');
  knowsLabel.style('width', '96px');
  knowsSlider = createSlider(1, 5, 3, 1);
  knowsSlider.size(120);
  reliableBox = createCheckbox(' Known for thoughtful, on-time letters', false);
  [nameInput, knowsSlider].forEach(e => e.input(saveEdit));
  [subjectSelect, taughtSelect, gradeSelect, reliableBox].forEach(e => e.changed(saveEdit));

  addButton = createButton('Add teacher');
  addButton.mousePressed(addTeacher);
  removeButton = createButton('Remove selected');
  removeButton.mousePressed(() => { if (selected >= 0) { teachers.splice(selected, 1); selected = min(selected, teachers.length - 1); loadEditor(); } });
  Object.keys(PRESETS).forEach(k => {
    const b = createButton(k);
    b.mousePressed(() => { teachers = PRESETS[k].map(t => ({ ...t })); selected = 0; loadEditor(); });
    presetButtons.push(b);
  });
  clearButton = createButton('Clear');
  clearButton.mousePressed(() => { teachers = []; selected = -1; loadEditor(); });

  teachers = PRESETS["Priya's four teachers"].map(t => ({ ...t }));
  selected = 0;
  loadEditor();
  describe('A recommender comparison tool. Each teacher card shows a letter strength bar weighted by how well the teacher knows you, how recently they taught you, whether it is a core subject, and whether they write thoughtful, on-time letters. Your grade is shown but not counted. A best pair panel picks two teachers and explains why.');
}

function positionControls() {
  let y = drawHeight + 8;
  const editing = selected >= 0;
  [labels[0], nameInput, labels[1], subjectSelect, labels[2], taughtSelect, labels[3], gradeSelect, knowsLabel, knowsSlider, reliableBox]
    .forEach(e => editing ? e.show() : e.hide());
  if (editing) {
    y = flowRow([labels[0], nameInput, labels[1], subjectSelect, labels[2], taughtSelect], 10, y, 30) + 32;
    y = flowRow([labels[3], gradeSelect, knowsLabel, knowsSlider, reliableBox], 10, y, 30) + 38;
  }
  flowRow([addButton, removeButton, ...presetButtons, clearButton], 10, y, 30);
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

function loadEditor() {
  if (selected >= 0 && teachers[selected]) {
    const t = teachers[selected];
    nameInput.value(t.name);
    subjectSelect.selected(t.subject);
    taughtSelect.selected(String(t.taught));
    gradeSelect.selected(t.grade);
    knowsSlider.value(t.knows);
    reliableBox.checked(t.reliable);
  } else selected = -1;
  positionControls();
}

function saveEdit() {
  if (selected < 0) return;
  const t = teachers[selected];
  t.name = nameInput.value();
  t.subject = subjectSelect.value();
  t.taught = int(taughtSelect.value());
  t.grade = gradeSelect.value();
  t.knows = knowsSlider.value();
  t.reliable = reliableBox.checked();
}

function addTeacher() {
  if (teachers.length >= 5) return;
  teachers.push({ name: 'New teacher', subject: 'English', taught: 11, grade: 'A', knows: 3, reliable: false });
  selected = teachers.length - 1;
  loadEditor();
}

function parts(t) {
  return {
    knows: 50 * t.knows / 5,
    recency: 20 * RECENCY[t.taught],
    core: CORE.includes(t.subject) ? 15 : 0,
    reliable: t.reliable ? 15 : 0
  };
}

function score(t) {
  const p = parts(t);
  return p.knows + p.recency + p.core + p.reliable;
}

function bestPair() {
  if (teachers.length < 2) return null;
  const idx = teachers.map((t, i) => i).sort((a, b) => score(teachers[b]) - score(teachers[a]));
  const first = idx[0];
  const rest = idx.slice(1);
  const second = rest[0];
  const diff = rest.find(i => teachers[i].subject !== teachers[first].subject);
  let pick = second, reason;
  if (teachers[second].subject === teachers[first].subject && diff !== undefined && score(teachers[diff]) >= score(teachers[second]) * 0.9) {
    pick = diff;
    reason = short(teachers[pick]) + ' scores within 10% of ' + short(teachers[second]) + ' and adds a different subject, so the two letters describe different sides of you.';
  } else if (teachers[pick].subject !== teachers[first].subject) {
    reason = 'They are your two strongest letters, and they come from different subjects.';
  } else {
    reason = 'They are your two strongest letters. Both teach ' + teachers[first].subject.toLowerCase() + ', so ask each to focus on different strengths.';
  }
  return { a: first, b: pick, reason };
}

function short(t) {
  return t.name.split(' (')[0];
}

function draw() {
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  knowsLabel.html('Knows you: ' + knowsSlider.value());

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Recommender Comparison', canvasWidth / 2, 8);

  const pair = bestPair();
  cardRects = [];
  const top = 40, cardH = 46;
  const narrow = canvasWidth < 560;
  let hoverParts = null;
  teachers.forEach((t, i) => {
    const y = top + i * (cardH + 4);
    const inPair = pair && (pair.a === i || pair.b === i);
    stroke(i === selected ? 'goldenrod' : (inPair ? 'seagreen' : 'gainsboro'));
    strokeWeight(i === selected || inPair ? 2 : 1);
    fill(inPair ? 'honeydew' : 'white');
    rect(margin, y, canvasWidth - 2 * margin, cardH, 6);
    strokeWeight(1);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    text((inPair ? '★ ' : '') + t.name, margin + 8, y + 5, canvasWidth * (narrow ? 0.9 : 0.42));
    textStyle(NORMAL);
    fill('dimgray');
    textSize(11);
    text(narrow ? t.subject + ' · gr ' + t.taught + ' · your ' + t.grade
                : t.subject + ' · grade ' + t.taught + ' · your grade ' + t.grade + ' (not counted)', margin + 8, y + 26);

    // strength bar
    const bx = narrow ? canvasWidth - margin - 130 : canvasWidth * 0.5;
    const bw = narrow ? 80 : canvasWidth - margin - bx - 50;
    const by = narrow ? y + 24 : y + 14;
    const p = parts(t);
    const segs = [['knows', 'steelblue'], ['recency', 'mediumpurple'], ['core', 'darkcyan'], ['reliable', 'goldenrod']];
    let sx = bx;
    fill('gainsboro');
    rect(bx, by, bw, 16, 3);
    segs.forEach(([k, c]) => {
      const w = bw * p[k] / 100;
      fill(c);
      rect(sx, by, w, 16);
      sx += w;
    });
    fill('black');
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(round(score(t)), bx + bw + 8, by + 8);
    textStyle(NORMAL);
    if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + 16) hoverParts = { p, x: bx, y: by + 20 };
    cardRects.push({ i, y, h: cardH });
  });
  if (!teachers.length) {
    fill('dimgray');
    textAlign(LEFT, TOP);
    textSize(15);
    text('Add up to five teachers you might ask, or load a preset.', margin + 6, top + 6);
  }

  // best pair panel
  const py = drawHeight - 96;
  stroke('silver');
  fill('white');
  rect(margin, py, canvasWidth - 2 * margin, 88, 8);
  noStroke();
  textAlign(LEFT, TOP);
  fill('black');
  textSize(14);
  textStyle(BOLD);
  text(pair ? 'Best pair: ' + short(teachers[pair.a]) + ' and ' + short(teachers[pair.b]) : 'Best pair: add at least two teachers', margin + 10, py + 6, canvasWidth - 2 * margin - 20);
  textStyle(NORMAL);
  textSize(13);
  if (pair) text(pair.reason, margin + 10, py + 26, canvasWidth - 2 * margin - 20, 34);
  fill('gray');
  textSize(11);
  text('Your grade isn\'t part of the score — readers care more about what the teacher can describe. Bar: knows you · recency · core subject · reliability.', margin + 10, py + 58, canvasWidth - 2 * margin - 20);

  if (hoverParts) {
    const s = 'Knows you ' + round(hoverParts.p.knows) + ' + recency ' + round(hoverParts.p.recency) + ' + core ' + hoverParts.p.core + ' + reliability ' + hoverParts.p.reliable;
    textSize(12);
    const tw = textWidth(s) + 14;
    const tx = constrain(mouseX - tw / 2, 4, canvasWidth - tw - 4);
    stroke('gray');
    fill('lightyellow');
    rect(tx, hoverParts.y, tw, 20, 4);
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    text(s, tx + 7, hoverParts.y + 10);
  }
}

function mousePressed() {
  if (mouseY > drawHeight - 100) return;
  const c = cardRects.find(r => mouseY > r.y && mouseY < r.y + r.h && mouseX > margin && mouseX < canvasWidth - margin);
  if (c) { selected = c.i; loadEditor(); }
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
