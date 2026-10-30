// Score Submission Planner
// CANVAS_HEIGHT: 740
// Rules, college by college:
//   1. Test-required → Must submit.     2. Test-blind → Don't send.
//   3. Test-optional with a merit cutoff your score clears → Submit (money).
//   4. Test-optional: score ≥ estimated midpoint → Submit; below the 25th percentile → Don't submit;
//      otherwise a Judgment call. ACT scores are converted to SAT with the official concordance.

let canvasWidth = 400;
let drawHeight = 530;
let controlHeight = 210;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

const ACT_TO_SAT = { 36: 1590, 35: 1540, 34: 1500, 33: 1460, 32: 1430, 31: 1400, 30: 1370, 29: 1340, 28: 1310,
  27: 1280, 26: 1240, 25: 1210, 24: 1180, 23: 1140, 22: 1110, 21: 1080, 20: 1040, 19: 1010, 18: 970, 17: 930,
  16: 890, 15: 850, 14: 800, 13: 760, 12: 710, 11: 670 };
const POLICIES = ['Test-optional', 'Test-required', 'Test-blind'];
const BADGES = {
  must: { label: 'Must submit', color: 'rebeccapurple' },
  submit: { label: 'Submit', color: 'seagreen' },
  money: { label: 'Submit (money)', color: 'seagreen' },
  judgment: { label: 'Judgment call', color: 'goldenrod' },
  dont: { label: "Don't submit", color: 'darkorange' },
  blind: { label: "Don't send — test-blind", color: 'gray' }
};

const EMILY = [
  { name: 'College A', policy: 'Test-required', p25: 1500, p75: 1560, merit: null, inflated: false },
  { name: 'College B', policy: 'Test-optional', p25: 1350, p75: 1480, merit: null, inflated: true },
  { name: 'College C', policy: 'Test-optional', p25: 1220, p75: 1390, merit: null, inflated: true },
  { name: 'State flagship', policy: 'Test-optional', p25: 1150, p75: 1320, merit: null, inflated: true },
  { name: 'Merit-cutoff college', policy: 'Test-optional', p25: 1180, p75: 1350, merit: 1250, inflated: true }
];

let colleges = [];
let selected = -1;
let flashUntil = {};
let lastBadges = [];
let rowRects = [];

let testSelect, scoreInput, scoreLabel;
let addButton, removeButton, loadButton, retestButton, retestSlider, retestLabel;
let ed = {};
let editing = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  scoreLabel = createSpan('Your score:');
  testSelect = createSelect();
  testSelect.option('SAT');
  testSelect.option('ACT');
  testSelect.changed(onScoreChange);
  scoreInput = createInput('1280', 'number');
  scoreInput.size(70);
  scoreInput.input(onScoreChange);

  addButton = createButton('Add college');
  addButton.mousePressed(addCollege);
  removeButton = createButton('Remove selected');
  removeButton.mousePressed(() => { if (selected >= 0) { colleges.splice(selected, 1); selected = -1; refreshEditor(); } });
  loadButton = createButton("Load Emily's list");
  loadButton.mousePressed(loadEmily);
  retestButton = createButton('Try a retest score');
  retestButton.mousePressed(toggleRetest);
  retestLabel = createSpan('Retest score:');
  retestSlider = createSlider(400, 1600, 1280, 10);
  retestSlider.input(() => { scoreInput.value(testSelect.value() === 'SAT' ? retestSlider.value() : retestSlider.value()); onScoreChange(); });

  // editor for the selected row
  ed.name = createInput(''); ed.name.size(130);
  ed.policy = createSelect(); POLICIES.forEach(p => ed.policy.option(p));
  ed.l25 = createSpan('25th'); ed.p25 = createInput('', 'number'); ed.p25.size(56);
  ed.l75 = createSpan('75th'); ed.p75 = createInput('', 'number'); ed.p75.size(56);
  ed.lm = createSpan('Merit cutoff'); ed.merit = createInput('', 'number'); ed.merit.size(56);
  ed.inflated = createCheckbox(' Range is test-optional (likely inflated)', false);
  [ed.name, ed.p25, ed.p75, ed.merit].forEach(e => e.input(saveEditor));
  ed.policy.changed(saveEditor);
  ed.inflated.changed(saveEditor);
  [scoreLabel, retestLabel, ed.l25, ed.l75, ed.lm].forEach(s => s.style('font-size', '14px'));

  loadEmily();
  describe('A score submission planner. Enter your SAT or ACT score. Each college on your list shows its testing policy, a bar for its middle 50% range with the midpoint, your score as a gold marker, and a badge: must submit, submit, judgment call, don\'t submit, or don\'t send. Select a row to edit it and read the rule that fired.');
}

function editorControls() {
  return [ed.name, ed.policy, ed.l25, ed.p25, ed.l75, ed.p75, ed.lm, ed.merit, ed.inflated];
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([scoreLabel, testSelect, scoreInput, addButton, removeButton, loadButton, retestButton], 10, y, 30) + 34;
  if (retestSlider.visible) {
    retestLabel.show(); retestSlider.show();
    retestLabel.position(10, y + 2);
    retestSlider.position(110, y);
    retestSlider.size(canvasWidth - 130);
    y += 32;
  } else { retestLabel.hide(); retestSlider.hide(); }
  if (selected >= 0) {
    editorControls().forEach(c => c.show());
    flowRow(editorControls(), 10, y, 30);
  } else editorControls().forEach(c => c.hide());
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

function toggleRetest() {
  retestSlider.visible = !retestSlider.visible;
  if (retestSlider.visible) {
    const isACT = testSelect.value() === 'ACT';
    retestSlider.elt.min = isACT ? 11 : 400;
    retestSlider.elt.max = isACT ? 36 : 1600;
    retestSlider.elt.step = isACT ? 1 : 10;
    retestSlider.value(+scoreInput.value() || (isACT ? 24 : 1200));
  }
  retestButton.html(retestSlider.visible ? 'Hide retest' : 'Try a retest score');
  positionControls();
}

function onScoreChange() {
  if (retestSlider.visible) {
    const isACT = testSelect.value() === 'ACT';
    retestSlider.elt.min = isACT ? 11 : 400;
    retestSlider.elt.max = isACT ? 36 : 1600;
    retestSlider.elt.step = isACT ? 1 : 10;
  }
}

function satScore() {
  const v = parseFloat(scoreInput.value());
  if (isNaN(v)) return null;
  if (testSelect.value() === 'SAT') return v;
  return ACT_TO_SAT[constrain(round(v), 11, 36)] || null;
}

function loadEmily() {
  colleges = EMILY.map(c => ({ ...c }));
  selected = -1;
  testSelect.selected('SAT');
  scoreInput.value(1280);
  lastBadges = [];
  refreshEditor();
}

function addCollege() {
  if (colleges.length >= 10) return;
  colleges.push({ name: 'New college', policy: 'Test-optional', p25: 1200, p75: 1380, merit: null, inflated: true });
  selected = colleges.length - 1;
  refreshEditor();
}

function refreshEditor() {
  if (selected >= 0) {
    const c = colleges[selected];
    ed.name.value(c.name);
    ed.policy.selected(c.policy);
    ed.p25.value(c.p25);
    ed.p75.value(c.p75);
    ed.merit.value(c.merit === null ? '' : c.merit);
    ed.inflated.checked(c.inflated);
  }
  positionControls();
}

function saveEditor() {
  if (selected < 0) return;
  const c = colleges[selected];
  c.name = ed.name.value();
  c.policy = ed.policy.value();
  c.p25 = parseFloat(ed.p25.value());
  c.p75 = parseFloat(ed.p75.value());
  const m = parseFloat(ed.merit.value());
  c.merit = isNaN(m) ? null : m;
  c.inflated = ed.inflated.checked();
}

// Decide one college; returns { key, rule }
function decide(c, s) {
  if (c.policy === 'Test-required') return { key: 'must', rule: 'Rule 1: this college requires a score, so you must send one.' + (s !== null && s < c.p25 ? ' Your score is below its 25th percentile, so consider retesting.' : '') };
  if (c.policy === 'Test-blind') return { key: 'blind', rule: 'Rule 2: this college won\'t consider scores for admission, even if you send them.' };
  if (s === null || isNaN(c.p25) || isNaN(c.p75)) return { key: 'judgment', rule: 'Enter a score and the college\'s range to get a recommendation.' };
  const mid = (c.p25 + c.p75) / 2;
  if (c.merit !== null && s >= c.merit) return { key: 'money', rule: 'Rule 3: your ' + s + ' clears the ' + c.merit + ' merit-scholarship cutoff, so submit. The score is worth money here' + (s >= mid ? ' and is above the estimated midpoint (' + round(mid) + ').' : '.') };
  if (s >= mid) return { key: 'submit', rule: 'Rule 4: your ' + s + ' is at or above the estimated midpoint (' + round(mid) + '), so it strengthens your application.' };
  if (s < c.p25) return { key: 'dont', rule: 'Rule 4: your ' + s + ' is below the 25th percentile (' + c.p25 + '). Your application will be read fully without it.' };
  return { key: 'judgment', rule: 'Rule 4: your ' + s + ' is between the 25th percentile (' + c.p25 + ') and the estimated midpoint (' + round(mid) + '). Lean toward submitting if it\'s close to the midpoint or your record needs the boost; lean toward withholding if your GPA and rigor are strong.' +
    (c.inflated ? ' This range likely overstates the typical admitted student\'s score.' : '') };
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
  text('Score Submission Planner', canvasWidth / 2, 8);

  const s = satScore();
  textSize(14);
  fill('dimgray');
  const shown = testSelect.value() === 'ACT' && s !== null ? 'ACT ' + scoreInput.value() + ' ≈ SAT ' + s + ' (concordance)' : (s !== null ? 'SAT ' + s : 'Enter a score');
  text(shown + ' · Click a college to edit it and see why', canvasWidth / 2, 34);

  // scale shared by every bar
  const vals = colleges.flatMap(c => [c.p25, c.p75]).filter(v => !isNaN(v));
  if (s !== null) vals.push(s);
  const lo = floor((min(vals.length ? vals : [1000]) - 60) / 100) * 100;
  const hi = ceil((max(vals.length ? vals : [1400]) + 60) / 100) * 100;

  const wide = canvasWidth >= 640;
  rowRects = [];
  const badges = colleges.map(c => decide(c, s));
  // flash badges that changed
  badges.forEach((b, i) => { if (lastBadges[i] && lastBadges[i] !== b.key) flashUntil[i] = millis() + 900; });
  lastBadges = badges.map(b => b.key);

  const top = 66;
  const rowH = wide ? 32 : 34;
  // score scale above the rows, aligned with the bars
  {
    const badgeW = wide ? 170 : 128;
    const bx = wide ? margin + 170 : margin + 10;
    const bw = wide ? canvasWidth - margin - badgeW - 14 - bx : canvasWidth - 2 * margin - badgeW - 24;
    noStroke();
    fill('gray');
    textSize(10);
    textAlign(CENTER, BOTTOM);
    const step = (hi - lo) > 600 ? 200 : 100;
    for (let v = lo; v <= hi; v += step) text(v, bx + bw * (v - lo) / (hi - lo), top - 2);
  }
  colleges.forEach((c, i) => {
    const y = top + i * (rowH + 2);
    rowRects.push({ i, y, h: rowH });
    stroke(i === selected ? 'goldenrod' : 'gainsboro');
    strokeWeight(i === selected ? 2 : 1);
    fill('white');
    rect(margin, y, canvasWidth - 2 * margin, rowH, 5);
    strokeWeight(1);
    const b = BADGES[badges[i].key];
    const badgeW = wide ? 170 : 128;
    let barX, barW, barY;
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    if (wide) {
      textSize(13);
      textStyle(BOLD);
      text(c.name, margin + 8, y + 11);
      textStyle(NORMAL);
      fill('dimgray');
      textSize(11);
      text(c.policy + (c.merit !== null ? ' · merit ' + c.merit : ''), margin + 8, y + 25);
      barX = margin + 170; barW = canvasWidth - margin - badgeW - 14 - barX; barY = y + rowH / 2;
    } else {
      textSize(12);
      textStyle(BOLD);
      text(c.name, margin + 6, y + 10);
      textStyle(NORMAL);
      fill('dimgray');
      textSize(10);
      textAlign(RIGHT, CENTER);
      text(c.policy, canvasWidth - margin - badgeW - 12, y + 10);
      barX = margin + 10; barW = canvasWidth - 2 * margin - badgeW - 24; barY = y + 25;
    }
    drawRangeBar(barX, barY, barW, lo, hi, c, s);
    // badge
    const flashing = flashUntil[i] && millis() < flashUntil[i];
    if (flashing) { stroke('gold'); strokeWeight(3); } else noStroke();
    fill(b.color);
    rect(canvasWidth - margin - badgeW - 4, y + 5, badgeW, rowH - 10, 12);
    strokeWeight(1);
    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(wide ? 13 : 11);
    textStyle(BOLD);
    text(b.label, canvasWidth - margin - badgeW / 2 - 4, y + rowH / 2);
    textStyle(NORMAL);
  });

  // explanation
  const ey = drawHeight - 104;
  stroke('silver');
  fill('white');
  rect(margin, ey, canvasWidth - 2 * margin, 96, 8);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  if (selected >= 0 && colleges[selected]) {
    fill('darkgoldenrod');
    textStyle(BOLD);
    text(colleges[selected].name + ': ' + BADGES[badges[selected].key].label, margin + 8, ey + 6, canvasWidth - 2 * margin - 16);
    textStyle(NORMAL);
    fill('black');
    text(badges[selected].rule, margin + 8, ey + 24, canvasWidth - 2 * margin - 16, 70);
  } else {
    fill('dimgray');
    text('Rules: required → must submit · test-blind → don\'t send · test-optional with a merit cutoff you clear → submit · ' +
         'at or above the estimated midpoint → submit · below the 25th percentile → don\'t submit · otherwise a judgment call. Click a row for its reason.',
         margin + 8, ey + 8, canvasWidth - 2 * margin - 16, 84);
  }
}

function drawRangeBar(x, y, w, lo, hi, c, s) {
  const px = v => x + w * constrain((v - lo) / (hi - lo), 0, 1);
  stroke('gainsboro');
  strokeWeight(2);
  line(x, y, x + w, y);
  strokeWeight(1);
  if (!isNaN(c.p25) && !isNaN(c.p75)) {
    noStroke();
    fill(c.policy === 'Test-blind' ? 'lightgray' : 'steelblue');
    rect(px(c.p25), y - 6, px(c.p75) - px(c.p25), 12, 3);
    const mid = (c.p25 + c.p75) / 2;
    stroke('dimgray');
    strokeWeight(2);
    line(px(mid), y - 9, px(mid), y + 9);
    strokeWeight(1);
    if (c.merit !== null) {
      stroke('seagreen');
      drawingContext.setLineDash([3, 3]);
      line(px(c.merit), y - 10, px(c.merit), y + 10);
      drawingContext.setLineDash([]);
    }
  }
  if (s !== null) {
    stroke('darkgoldenrod');
    fill('gold');
    const sx = px(s);
    quad(sx, y - 9, sx + 7, y, sx, y + 9, sx - 7, y);
  }
  noStroke();
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const r = rowRects.find(r => mouseY > r.y && mouseY < r.y + r.h && mouseX > margin && mouseX < canvasWidth - margin);
  if (r) { selected = r.i; refreshEditor(); }
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
