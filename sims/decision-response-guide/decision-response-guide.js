// Decision Response Guide
// CANVAS_HEIGHT: 620
// "What did you receive?" branches into six kinds of decisions, each with a chain of next steps
// ending in a gold deadline. Click a decision or a step to read it, use Back and Next step to walk
// the chain, and mark steps done. Choose up to three decisions to see your chains side by side
// with every deadline collected in one list. Narrow screens show one decision at a time.

let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

const DECISIONS = [
  { name: 'Acceptance (regular or EA)', short: 'Acceptance', color: 'mediumseagreen', steps: [
    ['Celebrate', 'You earned this. Tell the people who helped you.'],
    ['Record decision and deposit deadline', 'Add the decision, the deposit amount, and the deadline to your tracker.'],
    ['Review the aid offer', 'Sort the award letter into free, earned, and borrowed money (Chapter 16).'],
    ['Visit or attend admitted student day', 'See campus again as an admitted student and ask current students your questions.'],
    ['Decide by May 1; decline other offers', 'Deposit at one college by May 1 and politely decline the others so their seats go to someone else (Chapter 19).', true]] },
  { name: 'Early Decision acceptance', short: 'ED acceptance', color: 'darkcyan', steps: [
    ['Review the aid offer immediately', 'Compare it with your net price calculator estimate right away. ED deposits are usually due within a few weeks.'],
    ['If affordable: deposit and withdraw', 'Pay the deposit and withdraw every other application, as your ED agreement requires.'],
    ['If not: contact financial aid', 'Call the financial aid office, explain the gap, and ask for a review, with documents.'],
    ['If the gap remains, request release', 'If the offer still doesn\'t work for your family, ask to be released from the binding commitment. Deadline: the ED deposit date in your letter.', true]] },
  { name: 'Deferral', short: 'Deferral', color: 'steelblue', steps: [
    ['Confirm the mid-year report will be sent', 'Ask your counselor to send first-semester senior grades as soon as they post.'],
    ['Send a short update', 'Email new information since you applied (grades, awards, achievements), and say whether the college is still your first choice.'],
    ['Keep applying elsewhere', 'Treat the deferral as a "maybe" and finish your other applications.'],
    ['Wait for the regular-round decision', 'Decisions come with the Regular Decision pool, usually March–April. A deferred ED applicant is released from the binding commitment.', true]] },
  { name: 'Waitlist', short: 'Waitlist', color: 'mediumpurple', steps: [
    ['Decide whether to stay on', 'Stay on only if you would truly enroll if admitted.'],
    ['Confirm your spot by the college\'s deadline', 'Most colleges require you to opt in to the waitlist by a stated date.'],
    ['Send a letter of continued interest', 'If the college allows it, send a short, specific letter with any new achievements.'],
    ['Deposit elsewhere by May 1', 'Never count on a waitlist. Deposit at your best other option by May 1. If the waitlisted college admits you later, you may switch, but tell the first college right away.', true]] },
  { name: 'Denial', short: 'Denial', color: 'gray', steps: [
    ['Take time; talk to someone', 'It\'s normal to feel disappointed. Talk to a friend, family member, or counselor.'],
    ['Remember: fit, not worth', 'A denial is about a college\'s choices among many strong applicants, not your value as a person.'],
    ['Focus on your acceptances', 'Turn your attention to the colleges that said yes.'],
    ['If no acceptances: talk to your counselor', 'Many colleges still have openings after May 1. Your counselor can help you find them.', true]] },
  { name: 'Accepted to a different program or term', short: 'Different program/term', color: 'darkorange', steps: [
    ['Read the conditions', 'Spring start, a different major, or a guaranteed transfer path: read exactly what\'s offered.'],
    ['Ask how to move into your preferred program', 'Ask what grades and courses it would take, and how many students make the switch.'],
    ['Compare with other offers by May 1', 'Weigh this offer against your other acceptances before the May 1 deadline.', true]] }
];

let selected = 0;      // decision index
let stepIndex = 0;
let done = DECISIONS.map(d => d.steps.map(() => false));
let picks = [];        // up to three decision indices to show side by side
let nodeRects = [];

let backButton, nextButton, doneBox, multiLabel, pickSelects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  backButton = createButton('◀ Back');
  backButton.mousePressed(() => { stepIndex = max(0, stepIndex - 1); syncDone(); });
  nextButton = createButton('Next step ▶');
  nextButton.mousePressed(() => { stepIndex = min(DECISIONS[selected].steps.length - 1, stepIndex + 1); syncDone(); });
  doneBox = createCheckbox(' Mark this step done', false);
  doneBox.changed(() => { done[selected][stepIndex] = doneBox.checked(); });
  multiLabel = createSpan('I have multiple decisions:');
  multiLabel.style('font-size', '14px');
  for (let k = 0; k < 3; k++) {
    const s = createSelect();
    s.option('—', '-1');
    DECISIONS.forEach((d, i) => s.option(d.short, String(i)));
    s.changed(updatePicks);
    pickSelects.push(s);
  }
  positionControls();
  syncDone();
  describe('A decision response guide. A flowchart branches from What did you receive into acceptance, Early Decision acceptance, deferral, waitlist, denial, and a different program or term. Each decision leads to a chain of next steps ending in a deadline. Click steps to read them, mark them done, and compare up to three decisions with their deadlines listed together.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([backButton, nextButton, doneBox], 10, y, 30) + 36;
  flowRow([multiLabel, ...pickSelects], 10, y, 30);
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

function updatePicks() {
  picks = [...new Set(pickSelects.map(s => int(s.value())).filter(v => v >= 0))];
  if (picks.length && !picks.includes(selected)) { selected = picks[0]; stepIndex = 0; syncDone(); }
}

function syncDone() {
  doneBox.checked(done[selected][stepIndex]);
}

function visibleDecisions() {
  return picks.length ? picks : DECISIONS.map((d, i) => i);
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
  text('Decision Response Guide', canvasWidth / 2, 8);

  nodeRects = [];
  const infoTop = canvasWidth >= 700 ? drawFlowchart() : drawAccordion();
  drawInfo(infoTop);
}

function drawFlowchart() {
  const vis = visibleDecisions();
  const top = 40;
  // root node
  const rootW = 200;
  stroke('navy');
  fill('navy');
  rect((canvasWidth - rootW) / 2, top, rootW, 28, 14);
  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text('What did you receive?', canvasWidth / 2, top + 14);
  textStyle(NORMAL);

  const colW = (canvasWidth - 2 * margin) / vis.length;
  const decY = top + 52, decH = 40, stepH = 40, gap = 8;
  let maxY = decY + decH;
  vis.forEach((di, c) => {
    const d = DECISIONS[di];
    const x = margin + c * colW + 4, w = colW - 8;
    // connector from the root
    stroke('silver');
    line(canvasWidth / 2, top + 28, x + w / 2, decY);
    const active = di === selected;
    stroke(active ? 'black' : d.color);
    strokeWeight(active ? 2.5 : 1);
    fill(d.color);
    rect(x, decY, w, decH, 8);
    strokeWeight(1);
    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(d.short, x + 3, decY, w - 6, decH);
    textStyle(NORMAL);
    nodeRects.push({ di, si: -1, x, y: decY, w, h: decH });

    d.steps.forEach((s, si) => {
      const y = decY + decH + gap + si * (stepH + gap);
      const isDeadline = s[2];
      const isDone = done[di][si];
      const cur = active && si === stepIndex;
      stroke('silver');
      line(x + w / 2, y - gap, x + w / 2, y);
      stroke(cur ? 'black' : (isDeadline ? 'goldenrod' : 'gainsboro'));
      strokeWeight(cur ? 2.5 : 1);
      fill(isDone ? 'palegreen' : (isDeadline ? 'lightgoldenrodyellow' : 'white'));
      rect(x, y, w, stepH, 6);
      strokeWeight(1);
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(vis.length > 4 ? 10 : 12);
      text((isDone ? '✓ ' : '') + (isDeadline ? '⏰ ' : '') + s[0], x + 3, y, w - 6, stepH);
      nodeRects.push({ di, si, x, y, w, h: stepH });
      maxY = max(maxY, y + stepH);
    });
  });
  return maxY + 10;
}

function drawAccordion() {
  const vis = visibleDecisions();
  let y = 40;
  const w = canvasWidth - 2 * margin;
  vis.forEach(di => {
    const d = DECISIONS[di];
    const open = di === selected;
    noStroke();
    fill(d.color);
    rect(margin, y, w, 26, 6);
    fill('white');
    textAlign(LEFT, CENTER);
    textSize(13);
    textStyle(BOLD);
    text((open ? '▾ ' : '▸ ') + d.name, margin + 8, y + 13);
    textStyle(NORMAL);
    nodeRects.push({ di, si: -1, x: margin, y, w, h: 26 });
    y += 30;
    if (open) {
      d.steps.forEach((s, si) => {
        const isDeadline = s[2];
        const cur = si === stepIndex;
        stroke(cur ? 'black' : (isDeadline ? 'goldenrod' : 'gainsboro'));
        strokeWeight(cur ? 2 : 1);
        fill(done[di][si] ? 'palegreen' : (isDeadline ? 'lightgoldenrodyellow' : 'white'));
        rect(margin + 14, y, w - 14, 24, 5);
        strokeWeight(1);
        noStroke();
        fill('black');
        textSize(12);
        textAlign(LEFT, CENTER);
        let label = (si + 1) + '. ' + (done[di][si] ? '✓ ' : '') + (isDeadline ? '⏰ ' : '') + s[0];
        while (textWidth(label) > w - 30 && label.length > 8) label = label.slice(0, -2);
        text(label, margin + 22, y + 12);
        nodeRects.push({ di, si, x: margin + 14, y, w: w - 14, h: 24 });
        y += 27;
      });
      y += 3;
    }
  });
  return y + 4;
}

function drawInfo(top) {
  const x = margin, w = canvasWidth - 2 * margin, h = drawHeight - top - 8;
  if (h < 40) return;
  stroke('silver');
  fill('white');
  rect(x, top, w, h, 8);
  noStroke();
  const d = DECISIONS[selected];
  const s = d.steps[stepIndex];
  const split = picks.length > 1;
  const tw = split ? (w > 500 ? w * 0.55 : w - 20) : w - 20;   // width for the step text
  textAlign(LEFT, TOP);
  fill(d.color);
  textSize(13);
  textStyle(BOLD);
  text(d.short + ' · step ' + (stepIndex + 1) + ' of ' + d.steps.length + (s[2] ? ' · DEADLINE' : ''), x + 10, top + 6, tw);
  fill('black');
  textSize(15);
  text(s[0], x + 10, top + 24, tw);
  textStyle(NORMAL);
  textSize(13);
  const bodyH = split && w <= 500 ? h - 50 - picks.length * 15 - 22 : h - 50;
  text(s[1], x + 10, top + 46, tw, bodyH);

  // collected deadlines for the chosen decisions
  if (split) {
    const dx = w > 500 ? x + w * 0.6 : x + 10;
    const dy = w > 500 ? top + 8 : top + h - 8 - picks.length * 15 - 18;
    fill('darkgoldenrod');
    textSize(12);
    textStyle(BOLD);
    text('Your deadlines', dx, dy);
    textStyle(NORMAL);
    picks.forEach((di, i) => text('⏰ ' + DECISIONS[di].short + ': ' + DECISIONS[di].steps[DECISIONS[di].steps.length - 1][0],
                                  dx, dy + 18 + i * (w > 500 ? 30 : 15), w > 500 ? w * 0.38 : w - 20, w > 500 ? 30 : 15));
  }
}

function mousePressed() {
  if (mouseY > drawHeight) return;
  const n = nodeRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (!n) return;
  selected = n.di;
  stepIndex = n.si < 0 ? 0 : n.si;
  syncDone();
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
