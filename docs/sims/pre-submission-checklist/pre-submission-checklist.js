// Pre-Submission Checklist
// CANVAS_HEIGHT: 640
// A college-by-college review before you press Submit. Hover or check an item to see why it
// matters. Checks are saved per college in this browser (localStorage) when storage is
// available. On narrow screens, use the group buttons to review one section at a time.

let canvasWidth = 400;
let drawHeight = 190;
let controlHeight = 450;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

const STORAGE_PREFIX = 'pre-submission-checklist-v1:';

const GROUPS = [
  { name: 'Core application', items: [
    ['Legal name matches transcript', 'A name mismatch means documents may not match your file. Use your legal name everywhere (Profile section).'],
    ['Address, phone, and dedicated email correct', 'Colleges send portal logins and decisions to this email. A typo means missed messages.'],
    ['Parent education complete', 'Family information is required, and some colleges use it to identify first-generation students.'],
    ['Every school and college course listed', 'List every high school and any college where you took a course, including dual enrollment.'],
    ['Current-year courses listed with full names', 'Readers judge senior rigor from this list. Write "AP Calculus AB," not "Calc."'],
    ['Scores entered exactly as on reports', 'Self-reported scores must match official reports, or leave them off per your testing decision.'],
    ['Activities in chosen order, none cut off', 'Put your most important activities first, and check that no description is truncated.'],
    ['Essay pasted and paragraphs intact', 'Pasting can drop paragraph breaks and special characters. Read it in the preview.'],
    ['Additional information used only if needed', 'Use it for something important that the rest of the application doesn\'t explain, not for more of the same.']
  ]},
  { name: 'Courses and Grades', conditional: true, items: [
    ['Checked line by line against unofficial transcript', 'Some colleges require the Courses and Grades section. Every grade must match your transcript exactly.']
  ]},
  { name: 'This college', items: [
    ['Correct round selected', 'Choosing ED instead of EA is a binding mistake. Confirm the round on the college\'s questions page.'],
    ['Major/program choices confirmed', 'Some majors are direct-admit or require a separate program application.'],
    ['Testing question answered per my decision', 'Answer the college\'s testing question to match your submit-or-not decision from Chapter 6.'],
    ['All member questions answered', 'Every required college question needs an answer before you can submit.'],
    ['Supplements pasted, within limits, correct prompt', 'Check each supplement against its prompt and word limit (Chapter 10).'],
    ['College name and details correct in every supplement', 'Naming the wrong college in a Why Us essay is a common, avoidable error.']
  ]},
  { name: 'Recommenders', items: [
    ['FERPA release complete', 'Your counselor can\'t send documents until you complete the FERPA release (Chapter 11).'],
    ['Counselor assigned', 'Your counselor sends the transcript and school report, so assign them first.'],
    ['Required teachers assigned to this college', 'Teachers must be assigned to each college to which their letter should go.']
  ]},
  { name: 'Final', items: [
    ['PDF preview read in full', 'The preview shows exactly what readers will see, including any formatting problems.'],
    ['Fee paid or waiver applied', 'An application isn\'t complete until the fee is paid or a waiver is approved.']
  ]}
];

let collegeInput, roundSelect, cgBox, resetButton, uncheckedButton, collegeLabel, roundLabel;
let groupHeaders = [], boxes = [], groupButtons = [];
let onlyUnchecked = false;
let activeGroup = 0;
let focusItem = null;
let storageOK = true;
let loadedKey = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  collegeLabel = createSpan('College:');
  collegeInput = createInput('Hillcrest College');
  collegeInput.size(150);
  collegeInput.changed(loadState);
  roundLabel = createSpan('Round:');
  roundSelect = createSelect();
  ['ED', 'EA', 'REA', 'RD', 'Rolling'].forEach(r => roundSelect.option(r));
  roundSelect.selected('RD');
  roundSelect.changed(saveState);
  cgBox = createCheckbox(' This college requires Courses and Grades', false);
  cgBox.changed(() => { saveState(); positionControls(); });
  resetButton = createButton('Reset');
  resetButton.mousePressed(() => { boxes.forEach(b => b.box.checked(false)); saveState(); positionControls(); });
  uncheckedButton = createButton('Show only unchecked');
  uncheckedButton.mousePressed(() => {
    onlyUnchecked = !onlyUnchecked;
    uncheckedButton.html(onlyUnchecked ? 'Show all' : 'Show only unchecked');
    positionControls();
  });
  [collegeLabel, roundLabel].forEach(s => s.style('font-size', '14px'));

  GROUPS.forEach((g, gi) => {
    const h = createSpan(g.name);
    h.style('font-weight', 'bold');
    h.style('font-size', '14px');
    groupHeaders.push(h);
    const gb = createButton(g.name);
    gb.mousePressed(() => { activeGroup = gi; positionControls(); });
    groupButtons.push(gb);
    g.items.forEach(([label, why]) => {
      const box = createCheckbox(' ' + label, false);
      box.style('font-size', '14px');
      const entry = { box, group: gi, label, why };
      box.changed(() => { focusItem = entry; saveState(); if (onlyUnchecked) positionControls(); });
      box.mouseOver(() => { focusItem = entry; });
      boxes.push(entry);
    });
  });

  loadState();
  describe('A pre-submission checklist for one college\'s Common App application, grouped into core application, courses and grades, this college, recommenders, and final checks. A progress ring tracks completion, and a panel explains why each item matters.');
}

function storageKey() {
  return STORAGE_PREFIX + collegeInput.value().trim().toLowerCase();
}

function loadState() {
  loadedKey = storageKey();
  let saved = null;
  try {
    const raw = window.localStorage.getItem(loadedKey);
    saved = raw ? JSON.parse(raw) : null;
  } catch (e) { storageOK = false; }
  boxes.forEach((b, i) => b.box.checked(!!(saved && saved.checks && saved.checks[i])));
  if (saved && saved.round) roundSelect.selected(saved.round);
  cgBox.checked(!!(saved && saved.cg));
  positionControls();
}

function saveState() {
  try {
    window.localStorage.setItem(storageKey(), JSON.stringify({
      checks: boxes.map(b => b.box.checked()), round: roundSelect.value(), cg: cgBox.checked()
    }));
  } catch (e) { storageOK = false; }
}

function groupVisible(gi) {
  return !GROUPS[gi].conditional || cgBox.checked();
}

function positionControls() {
  const narrow = canvasWidth < 640;
  let y = drawHeight + 8;
  y = flowRow([collegeLabel, collegeInput, roundLabel, roundSelect], 10, y, 30) + 32;
  y = flowRow([cgBox], 10, y, 30) + 30;

  if (narrow) {
    if (!groupVisible(activeGroup)) activeGroup = 0;
    const shownButtons = groupButtons.filter((b, gi) => groupVisible(gi));
    groupButtons.forEach((b, gi) => { groupVisible(gi) ? b.show() : b.hide(); b.style('font-weight', gi === activeGroup ? 'bold' : 'normal'); });
    y = flowRow(shownButtons, 10, y, 30) + 36;
  } else groupButtons.forEach(b => b.hide());

  const lineH = 23;
  const colX = [10, narrow ? 10 : floor(canvasWidth / 2) + 4];
  const colOf = gi => (narrow ? 0 : (gi <= 1 ? 0 : 1));
  const yStart = y;
  const colY = [yStart, yStart];
  GROUPS.forEach((g, gi) => {
    const show = groupVisible(gi) && (!narrow || gi === activeGroup);
    const items = boxes.filter(b => b.group === gi);
    const visibleItems = items.filter(b => show && !(onlyUnchecked && b.box.checked()));
    if (!show) { groupHeaders[gi].hide(); items.forEach(b => b.box.hide()); return; }
    const c = colOf(gi);
    groupHeaders[gi].show();
    groupHeaders[gi].position(colX[c], colY[c]);
    colY[c] += lineH;
    items.forEach(b => {
      if (visibleItems.includes(b)) {
        b.box.show();
        b.box.style('white-space', 'nowrap');
        b.box.position(colX[c] + 6, colY[c]);
        colY[c] += lineH;
      } else b.box.hide();
    });
    colY[c] += 6;
  });
  resetButton.position(10, drawHeight + controlHeight - 38);
  uncheckedButton.position(80, drawHeight + controlHeight - 38);
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

function draw() {
  if (storageKey() !== loadedKey) loadState();   // switching colleges loads that college's checklist

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
  text('Pre-Submission Checklist', canvasWidth / 2, 8);

  const visible = boxes.filter(b => groupVisible(b.group));
  const done = visible.filter(b => b.box.checked()).length;
  const total = visible.length;
  const complete = done === total;
  const college = collegeInput.value().trim() || 'this college';

  const cx = margin + 62, cy = 112, d = 104;
  noFill();
  strokeWeight(12);
  stroke('gainsboro');
  circle(cx, cy, d);
  stroke(complete ? 'seagreen' : 'steelblue');
  if (done > 0) arc(cx, cy, d, d, -HALF_PI, -HALF_PI + TWO_PI * done / total);
  strokeWeight(1);
  noStroke();
  fill(complete ? 'seagreen' : 'navy');
  textAlign(CENTER, CENTER);
  textSize(22);
  textStyle(BOLD);
  text(done + '/' + total, cx, cy - 4);
  textStyle(NORMAL);
  textSize(11);
  fill('dimgray');
  text(roundSelect.value(), cx, cy + 18);

  const px = margin + 136, pw = canvasWidth - px - margin, py = 44, ph = drawHeight - 54;
  stroke('silver');
  fill('white');
  rect(px, py, pw, ph, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (complete) {
    fill('seagreen');
    textSize(15);
    textStyle(BOLD);
    text('Ready to submit ' + college + '. After submitting, look for the confirmation email and the dashboard check.', px + 12, py + 12, pw - 24, ph - 24);
    textStyle(NORMAL);
  } else if (focusItem) {
    fill('darkgoldenrod');
    textSize(14);
    textStyle(BOLD);
    text(focusItem.label, px + 12, py + 10, pw - 24);
    textStyle(NORMAL);
    fill('black');
    textSize(13);
    text('Why this matters: ' + focusItem.why, px + 12, py + 34, pw - 24, ph - 44);
  } else {
    fill('dimgray');
    textSize(14);
    text('Reviewing ' + college + '. Hover over or check any item below to see why it matters. Your checks are saved separately for each college name.', px + 12, py + 12, pw - 24, ph - 24);
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
