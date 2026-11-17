// Application Round Explorer
// CANVAS_HEIGHT: 670 (at the 688px chapter width)
// Describe one college (which rounds it offers) and one student (four questions).
// The explorer grades EVERY round the college offers -- best fit, works, or ruled out --
// with a one-line reason for each, so students see the whole comparison, not just a verdict.
// The best-fit round is drawn on a September-to-May-1 timeline.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 200;   // recomputed from the real control layout
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let roundsLabel, roundBoxes = {};
let firstLabel, firstSelect, aidLabel, aidSelect, gradesLabel, gradesSelect, elseLabel, elseSelect;
let scenarioLabel, samButton, iowaButton, certainButton;
let scenarioNote = '';

const roundNames = ['ED', 'ED II', 'EA', 'REA', 'RD', 'Rolling'];

// Timeline positions are months after September 1 (Sep = 0 ... May 1 = 8)
const roundInfo = {
  'ED':      { title: 'Early Decision', binding: true,
               deadline: [2.0, 'Nov 1'], decision: [3.5, 'mid-Dec'], commit: [3.6, 'right away'] },
  'ED II':   { title: 'Early Decision II', binding: true,
               deadline: [4.0, 'Jan 1'], decision: [5.5, 'mid-Feb'], commit: [5.6, 'right away'] },
  'EA':      { title: 'Early Action', binding: false,
               deadline: [2.0, 'Nov 1'], decision: [4.0, 'Dec–Feb'], commit: [8.0, 'May 1'] },
  'REA':     { title: 'Restrictive Early Action', binding: false,
               deadline: [2.0, 'Nov 1'], decision: [3.5, 'mid-Dec'], commit: [8.0, 'May 1'] },
  'RD':      { title: 'Regular Decision', binding: false,
               deadline: [4.0, 'Jan 1–Feb 1'], decision: [6.6, 'late Mar'], commit: [8.0, 'May 1'] },
  'Rolling': { title: 'Rolling Admission', binding: false,
               deadline: [1.0, 'early fall'], decision: [2.0, 'weeks later'], commit: [8.0, 'May 1'] }
};

const GOOD = 2, OK = 1, OUT = 0, NOT_OFFERED = -1;
let graded = [];     // [{ round, status, reason }] for all six rounds, in display order
let best = null;     // round name of the best fit, or null

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before positioning any of them
  roundsLabel = createSpan('<b>1. Rounds this college offers:</b>');
  roundNames.forEach(r => {
    roundBoxes[r] = createCheckbox(' ' + roundInfo[r].title, r === 'ED' || r === 'RD');
    roundBoxes[r].changed(userChanged);
  });

  firstLabel = createSpan('<b>2.</b> Is this college clearly your first choice?');
  firstSelect = makeSelect(['Yes', 'Not sure'], 'Not sure');
  aidLabel = createSpan('<b>3.</b> Does your family need to compare aid offers?');
  aidSelect = makeSelect(['Yes', 'No', 'Not sure'], 'Yes');
  gradesLabel = createSpan('<b>4.</b> Will fall senior grades make you stronger?');
  gradesSelect = makeSelect(['No', 'Yes'], 'No');
  elseLabel = createSpan('<b>5.</b> Applying early to another college?');
  elseSelect = makeSelect(['No', 'Yes, Early Action', 'Yes, Early Decision'], 'No');

  scenarioLabel = createSpan('Try a student from the chapter:');
  samButton = createButton('Sam');
  samButton.mousePressed(() => loadScenario('Sam', ['ED', 'RD'], 'Yes', 'Yes', 'Yes', 'No'));
  iowaButton = createButton('Iowa applicant');
  iowaButton.mousePressed(() => loadScenario('an Iowa applicant', ['EA', 'RD'], 'Not sure', 'Not sure', 'No', 'No'));
  certainButton = createButton('Certain first choice, cost checked');
  certainButton.mousePressed(() => loadScenario('a certain first choice', ['ED', 'RD'], 'Yes', 'No', 'No', 'No'));

  [roundsLabel, firstLabel, aidLabel, gradesLabel, elseLabel, scenarioLabel].forEach(s => s.style('font-size', '15px'));
  roundNames.forEach(r => roundBoxes[r].style('font-size', '15px'));

  positionControls();
  recompute();
  describe('An application round explorer. The student checks which rounds a college offers and answers four questions. The explorer lists every offered round as best fit, works, or ruled out with a reason, says what an admission would commit you to, and shows the best round on a timeline from September to May 1.');
}

function makeSelect(options, value) {
  const s = createSelect();
  options.forEach(o => s.option(o));
  s.selected(value);
  s.style('font-size', '15px');
  s.changed(userChanged);
  return s;
}

function positionControls() {
  let y = drawHeight + 10;
  y = flowRow([roundsLabel, ...roundNames.map(r => roundBoxes[r])], 10, y, 26) + 34;
  [[firstLabel, firstSelect], [aidLabel, aidSelect], [gradesLabel, gradesSelect], [elseLabel, elseSelect]]
    .forEach(pair => { y = flowRow(pair, 10, y, 28) + 32; });
  y = flowRow([scenarioLabel, samButton, iowaButton, certainButton], 10, y, 30) + 36;
  const needed = y - drawHeight;
  if (needed !== controlHeight) {
    controlHeight = needed;
    canvasHeight = drawHeight + controlHeight;
    resizeCanvas(canvasWidth, canvasHeight);
  }
}

// Place controls left to right using their real widths; wrap when the row is full.
// Returns the y of the last line used.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style('white-space', 'nowrap');
    c.position(x, y);
    const w = c.elt.offsetWidth || 120;
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 10;
  }
  return y;
}

function userChanged() {
  scenarioNote = '';
  recompute();
}

function loadScenario(name, offered, first, aid, grades, elsewhere) {
  roundNames.forEach(r => roundBoxes[r].checked(offered.includes(r)));
  firstSelect.selected(first);
  aidSelect.selected(aid);
  gradesSelect.selected(grades);
  elseSelect.selected(elsewhere);
  scenarioNote = 'Showing ' + name + '. Change any answer to explore.';
  recompute();
}

// ----- the decision rules: grade each offered round -----
function gradeRound(r, a) {
  const binding = roundInfo[r].binding;
  if (binding) {
    if (a.edElsewhere) return [OUT, 'You can apply Early Decision to only one college.'];
    if (a.aid !== 'No') return [OUT, a.aid === 'Yes'
      ? 'Binding, so you could not compare aid offers first.'
      : 'Binding. Not sure about cost? Treat that as needing to compare.'];
    if (a.first !== 'Yes') return [OUT, 'Binding, and it is not clearly your first choice.'];
    if (r === 'ED' && a.later) return [OK, 'Possible, but the college won’t see your fall grades.'];
    return [GOOD, r === 'ED'
      ? 'Sure first choice, cost checked: ED can boost your chances.'
      : 'Sure first choice, and the January deadline shows fall grades.'];
  }
  if (r === 'REA') {
    if (a.anyElsewhere) return [OUT, 'REA usually bars early applications to other private colleges.'];
    if (a.later) return [OK, 'Not binding, but the college won’t see your fall grades.'];
    return [GOOD, 'Early answer, not binding, and you aren’t applying early elsewhere.'];
  }
  if (r === 'EA') {
    if (a.later) return [OK, 'Not binding, but the college won’t see your fall grades.'];
    return [GOOD, 'Early answer with no obligation. Compare offers until May 1.'];
  }
  if (r === 'Rolling') {
    return [GOOD, a.later
      ? 'Apply right after fall grades post, before the class fills.'
      : 'Apply early in the fall and hear back within weeks.'];
  }
  // RD
  if (a.later) return [GOOD, 'Your fall grades count, and you keep every option open.'];
  if (a.aid !== 'No') return [GOOD, 'Not binding: compare every aid offer before May 1.'];
  return [OK, 'Always safe, but you wait until spring for an answer.'];
}

function recompute() {
  const a = {
    first: firstSelect.value(),
    aid: aidSelect.value(),
    later: gradesSelect.value() === 'Yes',
    edElsewhere: elseSelect.value() === 'Yes, Early Decision',
    anyElsewhere: elseSelect.value() !== 'No'
  };
  // Grade all six rounds; rounds this college doesn't offer are shown greyed out
  graded = roundNames.map(r => {
    if (!roundBoxes[r].checked()) return { round: r, status: NOT_OFFERED, reason: 'This college doesn\u2019t offer this round.' };
    const g = gradeRound(r, a);
    return { round: r, status: g[0], reason: g[1] };
  });

  // Among the best-graded rounds, prefer early ones for a sure, affordable first choice
  // and non-binding ones otherwise.
  const bindingFits = graded.some(g => roundInfo[g.round].binding && g.status === GOOD);
  const priority = bindingFits
    ? ['ED', 'ED II', 'REA', 'EA', 'Rolling', 'RD']
    : (a.later ? ['RD', 'Rolling', 'EA', 'REA', 'ED II', 'ED'] : ['EA', 'REA', 'Rolling', 'RD', 'ED II', 'ED']);
  best = null;
  const top = Math.max(-1, ...graded.map(g => g.status));
  if (top > OUT) best = priority.find(r => graded.some(g => g.round === r && g.status === top));
}

// ----- drawing -----
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
  text('Application Round Explorer', canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  text(scenarioNote || 'Answer the questions below. Every round this college offers is graded here.', canvasWidth / 2, 36);

  drawRoundTable(margin, 60, canvasWidth - 2 * margin);
  drawMiniTimeline(margin, drawHeight - 74, canvasWidth - 2 * margin, 66);
}

function drawRoundTable(x, y, w) {
  if (!graded.some(g => g.status !== NOT_OFFERED)) {
    fill('firebrick');
    textAlign(LEFT, TOP);
    textSize(16);
    text('Check at least one round that this college offers (question 1).', x, y + 10, w);
    return;
  }
  const narrow = canvasWidth < 820;
  const rowH = narrow ? 42 : 30;
  const nameW = narrow ? w : 250;
  graded.forEach((g, i) => {
    const ry = y + i * rowH;
    const isBest = g.round === best;
    const off = g.status === NOT_OFFERED;
    const color = isBest ? 'seagreen' : off ? 'darkgray' : (g.status === OUT ? 'firebrick' : 'darkgoldenrod');
    const tag = isBest ? '★ Best fit' : off ? '– Not offered' : (g.status === OUT ? '✗ Ruled out' : '✓ Works');
    noStroke();
    fill(isBest ? 'honeydew' : off ? 'whitesmoke' : 'white');
    rect(x, ry, w, rowH - 4, 6);
    textAlign(LEFT, TOP);
    textSize(15);
    textStyle(BOLD);
    fill(color);
    text(tag, x + 8, ry + 6);
    fill(off ? 'darkgray' : 'black');
    text(roundInfo[g.round].title + (roundInfo[g.round].binding ? ' (binding)' : ''), x + 118, ry + 6);
    textStyle(NORMAL);
    textSize(narrow ? 13 : 14);
    fill(off ? 'darkgray' : 'dimgray');
    if (narrow) text(g.reason, x + 8, ry + 23, w - 16);
    else text(g.reason, x + 118 + nameW, ry + 7, w - nameW - 126);
  });

  // What an admission commits you to
  const ly = y + graded.length * rowH + 6;
  textAlign(LEFT, TOP);
  textSize(15);
  if (!best) {
    fill('firebrick');
    text('None of these rounds fits this student. Talk with your counselor before applying here.', x, ly, w);
    return;
  }
  fill('navy');
  text(roundInfo[best].binding
    ? 'If admitted in ' + roundInfo[best].title + ': you must enroll and withdraw every other application.'
    : 'If admitted in ' + roundInfo[best].title + ': no obligation. Compare offers and decide by May 1.', x, ly, w);
}

function drawMiniTimeline(x, y, w, h) {
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May 1'];
  const x0 = x + 14, x1 = x + w - 24;
  const ly = y + 22;
  const mx = m => x0 + (x1 - x0) * m / 8;

  stroke('gray');
  strokeWeight(2);
  line(x0, ly, x1, ly);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  months.forEach((m, i) => {
    if (canvasWidth < 500 && i % 2 === 1) return;  // thin out labels when narrow
    text(m, mx(i), y);
  });
  if (!best) return;

  const info = roundInfo[best];
  const marks = [
    { at: info.deadline, color: 'steelblue', label: 'Apply' },
    { at: info.decision, color: 'mediumpurple', label: 'Hear back' },
    { at: info.commit, color: info.binding ? 'darkorange' : 'crimson', label: 'Commit' }
  ];
  marks.forEach((m, k) => {
    const px = mx(m.at[0]);
    fill(m.color);
    circle(px, ly, 14);
    textSize(12);
    // Stagger labels on three rows so close dates never overlap
    const atEnd = m.at[0] > 7;
    textAlign(atEnd ? RIGHT : CENTER, TOP);
    text(m.label + ': ' + m.at[1], atEnd ? px + 8 : px, ly + 10 + k * 14);
  });
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  // Reserve room for all six rounds so the canvas height never jumps as boxes are checked
  const rowH = canvasWidth < 820 ? 42 : 30;
  drawHeight = 60 + 6 * rowH + 44 + 80;
  canvasHeight = drawHeight + controlHeight;
}
