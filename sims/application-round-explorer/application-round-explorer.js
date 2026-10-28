// Application Round Explorer
// CANVAS_HEIGHT: 576
// Answer five questions about one college and one student; the explorer recommends an
// application round (ED, ED II, EA, REA, RD, or Rolling), explains why, states what an
// admission would commit you to, and draws the round on a September–May timeline.
// The input that decided the recommendation is highlighted in gold.

let canvasWidth = 400;
let drawHeight = 340;
let controlHeight = 236;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let roundsLabel, roundBoxes = {};
let firstLabel, firstSelect, aidLabel, aidSelect, gradesLabel, gradesSelect, elseLabel, elseSelect;
let scenarioLabel, samButton, iowaButton, certainButton;

const roundNames = ['ED', 'ED II', 'EA', 'REA', 'RD', 'Rolling'];

// Timeline dates for each round, in months after September 1 (Sep = 0 ... May 1 = 8)
const roundInfo = {
  'ED':      { title: 'Early Decision', deadline: [2.0, 'Nov 1'], decision: [3.5, 'mid-Dec'], commit: [3.6, 'Commit right away'], binding: true },
  'ED II':   { title: 'Early Decision II', deadline: [4.0, 'Jan 1'], decision: [5.5, 'mid-Feb'], commit: [5.6, 'Commit right away'], binding: true },
  'EA':      { title: 'Early Action', deadline: [2.0, 'Nov 1'], decision: [4.0, 'Dec–Feb'], commit: [8.0, 'May 1'], binding: false },
  'REA':     { title: 'Restrictive Early Action', deadline: [2.0, 'Nov 1'], decision: [3.5, 'mid-Dec'], commit: [8.0, 'May 1'], binding: false },
  'RD':      { title: 'Regular Decision', deadline: [4.0, 'Jan 1–Feb 1'], decision: [6.6, 'late Mar'], commit: [8.0, 'May 1'], binding: false },
  'Rolling': { title: 'Rolling admission', deadline: [1.0, 'Apply early (Oct)'], decision: [2.0, 'a few weeks later'], commit: [8.0, 'May 1'], binding: false }
};

let result = null;   // { round, text, admitted, warnings[], decider }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  roundsLabel = createSpan('Rounds this college offers:');
  roundNames.forEach(r => {
    roundBoxes[r] = createCheckbox(' ' + r, r === 'ED' || r === 'RD');
    roundBoxes[r].changed(recompute);
  });

  firstLabel = createSpan('Clearly your first choice?');
  firstSelect = makeSelect(['Yes', 'Probably', 'Not sure'], 'Probably');
  aidLabel = createSpan('Need to compare aid offers?');
  aidSelect = makeSelect(['Yes', 'No', 'Not sure'], 'Yes');
  gradesLabel = createSpan('Stronger after fall grades?');
  gradesSelect = makeSelect(['Yes', 'No'], 'No');
  elseLabel = createSpan('Applying early elsewhere?');
  elseSelect = makeSelect(['No', 'Yes, Early Action', 'Yes, Early Decision'], 'No');

  scenarioLabel = createSpan('Try a scenario:');
  samButton = createButton('Sam');
  samButton.mousePressed(() => loadScenario(['ED', 'RD'], 'Yes', 'Yes', 'Yes', 'No'));
  iowaButton = createButton('Iowa applicant');
  iowaButton.mousePressed(() => loadScenario(['EA', 'RD'], 'Probably', 'Not sure', 'No', 'No'));
  certainButton = createButton('Certain first choice, cost checked');
  certainButton.mousePressed(() => loadScenario(['ED', 'RD'], 'Yes', 'No', 'No', 'No'));

  [roundsLabel, firstLabel, aidLabel, gradesLabel, elseLabel, scenarioLabel].forEach(s => {
    s.style('font-size', '15px');
    s.style('padding', '2px 4px');
    s.style('border-radius', '4px');
  });

  positionControls();
  recompute();
  describe('An application round explorer. Checkboxes and dropdowns describe a college and a student. The result card recommends an application round, explains why, says whether an admission is binding and when you must decide, and shows the round on a timeline from September to May 1.');
}

function makeSelect(options, value) {
  const s = createSelect();
  options.forEach(o => s.option(o));
  s.selected(value);
  s.changed(recompute);
  return s;
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([roundsLabel, ...roundNames.map(r => roundBoxes[r])], 10, y, 26) + 32;
  if (canvasWidth >= 700) {
    y = flowRow([firstLabel, firstSelect, aidLabel, aidSelect], 10, y, 30) + 32;
    y = flowRow([gradesLabel, gradesSelect, elseLabel, elseSelect], 10, y, 30) + 32;
  } else {
    y = flowRow([firstLabel, firstSelect], 10, y, 30) + 30;
    y = flowRow([aidLabel, aidSelect], 10, y, 30) + 30;
    y = flowRow([gradesLabel, gradesSelect], 10, y, 30) + 30;
    y = flowRow([elseLabel, elseSelect], 10, y, 30) + 30;
  }
  flowRow([scenarioLabel, samButton, iowaButton, certainButton], 10, y, 30);
}

// Place controls left to right using their real widths; wrap when the row is full.
// Returns the y of the last line used.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style('white-space', 'nowrap');
    c.position(x, y);
    const w = c.elt.offsetWidth || c.cachedWidth || 120;
    c.cachedWidth = w;
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 10;
  }
  return y;
}

function loadScenario(offered, first, aid, grades, elsewhere) {
  roundNames.forEach(r => roundBoxes[r].checked(offered.includes(r)));
  firstSelect.selected(first);
  aidSelect.selected(aid);
  gradesSelect.selected(grades);
  elseSelect.selected(elsewhere);
  recompute();
}

// ----- the decision rules -----
function recompute() {
  const offered = roundNames.filter(r => roundBoxes[r].checked());
  const first = firstSelect.value();
  const aid = aidSelect.value();
  const later = gradesSelect.value() === 'Yes';
  const elsewhere = elseSelect.value();
  const warnings = [];

  if (elsewhere === 'Yes, Early Decision' && (offered.includes('ED') || offered.includes('ED II'))) {
    warnings.push('You may apply to only one college Early Decision at a time.');
  }
  if (offered.includes('REA') && elsewhere !== 'No') {
    warnings.push('Check this college\'s Restrictive Early Action rules: most bar early applications to other private colleges.');
  }

  if (offered.length === 0) {
    result = { round: null, text: 'Check at least one round that this college offers.', warnings: warnings, decider: null };
    highlight(null);
    return;
  }

  // Binding rounds only make sense for a clear first choice whose cost is already checked
  const bindingOK = first === 'Yes' && aid === 'No' && elsewhere !== 'Yes, Early Decision';
  let blocker = null;  // why ED was ruled out, if it was offered
  if (!bindingOK) {
    if (aid !== 'No') blocker = 'aid';
    else if (first !== 'Yes') blocker = 'first';
    else blocker = 'else';
  }

  let round, text, decider;
  if (offered.includes('ED') && bindingOK && !later) {
    round = 'ED';
    decider = 'first';
    text = 'Early Decision: this is clearly your first choice, your family has already checked the cost, and your application is as strong now as it will be. ED can raise your chances, but it is binding, so be sure.';
  } else if (offered.includes('ED II') && bindingOK) {
    round = 'ED II';
    decider = later ? 'grades' : 'first';
    text = 'Early Decision II: a clear first choice with the cost checked. The January deadline lets the college see your fall grades and still gives you the binding-round advantage.';
  } else if (later && (offered.includes('RD') || offered.includes('Rolling'))) {
    round = offered.includes('RD') ? 'RD' : 'Rolling';
    decider = (blocker && (offered.includes('ED') || offered.includes('ED II'))) ? blocker : 'grades';
    text = (round === 'RD' ? 'Regular Decision: ' : 'Rolling admission, applying right after fall grades post: ') +
      'your application will be stronger once fall grades are in' +
      (blocker === 'aid' && (offered.includes('ED') || offered.includes('ED II')) ? ', and you need to compare aid offers, which a binding round would not let you do.' : '.') +
      ' You keep every option open until May 1.';
  } else if (offered.includes('EA')) {
    round = 'EA';
    decider = (blocker && offered.includes('ED')) ? blocker : 'grades';
    text = 'Early Action: you get an early answer with no obligation, so you can still compare every offer and decide by May 1.' +
      (blocker && offered.includes('ED') ? ' ED is offered, but ' + blockerReason(blocker) + '.' : '');
  } else if (offered.includes('REA') && elsewhere === 'No' && first !== 'Not sure') {
    round = 'REA';
    decider = 'else';
    text = 'Restrictive Early Action: you hear early and the admission is not binding. In exchange you agree not to apply early to most other private colleges, which works because you aren\'t applying early anywhere else.';
  } else if (offered.includes('Rolling')) {
    round = 'Rolling';
    decider = 'grades';
    text = 'Rolling admission: apply early in the fall, before the class fills, and you will often hear back within a few weeks. It is not binding.';
  } else if (offered.includes('RD')) {
    round = 'RD';
    decider = blocker || 'grades';
    text = 'Regular Decision' + (blocker ? ': ' + capitalize(blockerReason(blocker)) + ', so a binding round is a poor fit.' : '.') +
      ' Regular Decision is non-binding and lets you compare every admission and aid offer before May 1.';
  } else {
    // only binding rounds are offered and binding isn't a good fit
    round = offered[0];
    decider = blocker;
    text = 'This college offers only a binding round, but ' + blockerReason(blocker) + '. Talk with your counselor before applying here.';
  }

  const info = roundInfo[round];
  const admitted = info.binding
    ? 'If you\'re admitted: you must enroll and withdraw every other application. Decide immediately; the deposit is usually due within a few weeks.'
    : 'If you\'re admitted: no obligation. You can compare offers and decide by May 1.';
  result = { round: round, text: text, admitted: admitted, warnings: warnings, decider: decider };
  highlight(decider);
}

function blockerReason(b) {
  if (b === 'aid') return 'you need to compare aid offers, and a binding round would lock you in before you can';
  if (b === 'first') return 'it is not clearly your first choice';
  return 'you are already applying Early Decision somewhere else';
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Paint the deciding input's label gold
function highlight(decider) {
  const map = { first: firstLabel, aid: aidLabel, grades: gradesLabel, else: elseLabel };
  Object.values(map).forEach(l => { l.style('background', 'none'); l.style('font-weight', 'normal'); });
  if (decider && map[decider]) {
    map[decider].style('background', 'gold');
    map[decider].style('font-weight', 'bold');
  }
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
  text('Application Round Explorer', canvasWidth / 2, 10);

  drawResultCard(margin, 42, canvasWidth - 2 * margin, 198);
  drawMiniTimeline(margin, 252, canvasWidth - 2 * margin, 78);
}

function drawResultCard(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (!result || !result.round) {
    fill('firebrick');
    textSize(16);
    text(result ? result.text : '', x + 12, y + 12, w - 24);
    return;
  }
  const info = roundInfo[result.round];
  fill(info.binding ? 'darkorange' : 'seagreen');
  const small = canvasWidth < 600;
  textSize(small ? 16 : 19);
  textStyle(BOLD);
  text((small ? '→ ' : 'Recommended: ') + info.title + (info.binding ? ' (binding)' : ' (non-binding)'), x + 12, y + 10, w - 24);
  textStyle(NORMAL);
  fill('black');
  textSize(small ? 13 : 15);
  text(result.text, x + 12, y + 36, w - 24, small ? 96 : 80);
  fill('navy');
  textSize(small ? 13 : 14);
  text(result.admitted, x + 12, y + (small ? 132 : 120), w - 24, 36);
  if (result.warnings.length) {
    fill('firebrick');
    textSize(12);
    const shown = small && result.warnings.length > 1
      ? result.warnings[0] + ' (+' + (result.warnings.length - 1) + ' more warning)'
      : result.warnings.join(' ');
    text('⚠ ' + shown, x + 12, y + h - 32, w - 24, 30);
  }
}

function drawMiniTimeline(x, y, w, h) {
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May 1'];
  const x0 = x + 10, x1 = x + w - 20;
  const ly = y + 26;
  const mx = m => x0 + (x1 - x0) * m / 8;

  stroke('gray');
  strokeWeight(2);
  line(x0, ly, x1, ly);
  strokeWeight(1);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  months.forEach((m, i) => {
    if (canvasWidth < 500 && i % 2 === 1) return;  // thin out labels when narrow
    text(m, mx(i), y + 2);
  });

  if (!result || !result.round) return;
  const info = roundInfo[result.round];
  const marks = [
    { at: info.deadline, color: 'steelblue', label: 'Deadline' },
    { at: info.decision, color: 'mediumpurple', label: 'Decision' },
    { at: info.commit, color: info.binding ? 'darkorange' : 'crimson', label: 'Commit' }
  ];
  marks.forEach((m, k) => {
    const px = mx(m.at[0]);
    fill(m.color);
    noStroke();
    circle(px, ly, 14);
    textSize(12);
    textAlign(k === 2 && m.at[0] > 7 ? RIGHT : CENTER, TOP);
    const tx = k === 2 && m.at[0] > 7 ? px + 6 : px;
    text(m.label + ': ' + m.at[1], tx, ly + 10 + (k % 2) * 16);
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
}
