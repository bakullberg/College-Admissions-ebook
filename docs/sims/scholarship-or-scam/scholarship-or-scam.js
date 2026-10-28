// Scholarship or Scam?
// CANVAS_HEIGHT: 530
// Read each offer and decide whether it looks legitimate or like a scam. Feedback highlights the
// phrase that decides it and names the warning sign (any fee, guarantees, "you've been selected,"
// requests for bank information, pressure to act now, a vague sponsor, or charging to file the
// FAFSA) or the signs of legitimacy. All sponsors are fictional.

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;

// answer: 'legit' | 'scam' | 'check'; marks: [phrase, sign]
const DECK = [
  { from: 'awards@national-achievement-prize.net', subject: 'Congratulations, finalist!',
    body: 'Congratulations! You\'ve been selected as a finalist for the $5,000 National Achievement Award. Pay a $35 processing fee within 24 hours to claim it.',
    answer: 'scam', marks: [['You\'ve been selected', 'Selected without applying'], ['Pay a $35 processing fee', 'Any fee'], ['within 24 hours', 'Pressure to act now']] },
  { from: 'Johnson County Community Foundation', subject: 'Senior scholarships now open',
    body: 'The Johnson County Community Foundation is accepting applications for 12 scholarships for graduating seniors. Deadline March 1. Apply through your school counselor.',
    answer: 'legit', marks: [['Apply through your school counselor', 'Comes through your counselor'], ['12 scholarships', 'A real, local sponsor with a clear process']] },
  { from: 'ScholarMatch Premium', subject: 'Win money for college, guaranteed',
    body: 'Scholarship search service: we guarantee you\'ll win at least $1,000 or your money back. Just $99.',
    answer: 'scam', marks: [['we guarantee you\'ll win', 'Guarantees'], ['Just $99', 'Any fee']] },
  { from: 'FAFSA Experts LLC', subject: 'Let us file your FAFSA',
    body: 'Your FAFSA can be filed by our experts for $79.',
    answer: 'scam', marks: [['for $79', 'Charging to file the FAFSA (it\'s free at studentaid.gov)']] },
  { from: 'Hillcrest College Office of Financial Aid', subject: 'Merit scholarships',
    body: 'Hillcrest College merit scholarships: all admitted first-year applicants are considered automatically. No separate application.',
    answer: 'legit', marks: [['considered automatically', 'Automatic consideration by the college itself'], ['No separate application', 'No fee or extra steps']] },
  { from: 'College Funding Secrets', subject: 'FREE seminar tonight!',
    body: 'Free seminar on financial aid secrets! Seats limited — sign up for our $1,200 counseling package today to reserve your scholarship.',
    answer: 'scam', marks: [['Seats limited', 'Pressure to act now'], ['$1,200 counseling package', 'Any fee']] },
  { from: 'Grant Verification Department', subject: 'Action required: verify eligibility',
    body: 'To verify your eligibility for this grant, please provide your bank routing and account numbers.',
    answer: 'scam', marks: [['bank routing and account numbers', 'Requests for bank information']] },
  { from: 'Your parent\'s employer, HR department', subject: 'Employee family scholarship',
    body: 'Employer scholarship for children of employees. Applications available from HR; winners announced in May.',
    answer: 'legit', marks: [['Applications available from HR', 'A known sponsor with a clear process'], ['winners announced in May', 'A normal timeline, no fee']] },
  { from: 'Horizon Foundation', subject: 'National Scholars Program applications open',
    body: 'The Horizon Foundation National Scholars Program awards 150 scholarships of $10,000. Apply online by October 31. There is no application fee, and past winners are listed on our website.',
    answer: 'legit', marks: [['no application fee', 'No fee'], ['past winners are listed', 'A verifiable sponsor with past winners']] },
  { from: 'American Youth Excellence Council', subject: 'You may qualify for a leadership award',
    body: 'The American Youth Excellence Council invites you to apply for its $2,000 leadership award. Learn more at our website.',
    answer: 'check', marks: [['American Youth Excellence Council', 'Unfamiliar sponsor: verify before you share anything']] },
  { from: 'grants@student-relief-fund.org', subject: 'Guaranteed grant: 50 spots left',
    body: 'Act now: a guaranteed $2,500 grant for every applicant. Only 50 spots left!',
    answer: 'scam', marks: [['guaranteed $2,500 grant', 'Guarantees'], ['Only 50 spots left', 'Pressure to act now']] },
  { from: 'State Higher Education Agency', subject: 'State scholarship reminder',
    body: 'Seniors who file the FAFSA by March 1 and have a 3.0 GPA are considered automatically for the state scholarship. Details are on the state agency\'s official website.',
    answer: 'legit', marks: [['considered automatically', 'Automatic consideration through the FAFSA'], ['official website', 'An official government source']] }
];

let legitButton, scamButton, nextButton, restartButton;
let order = [], pos = 0;
let answered = null;
let score = 0, scored = 0;
let signs = new Set();

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  legitButton = createButton('Looks legitimate');
  legitButton.mousePressed(() => answer('legit'));
  scamButton = createButton('Looks like a scam');
  scamButton.mousePressed(() => answer('scam'));
  nextButton = createButton('Next ▶');
  nextButton.mousePressed(() => { pos++; answered = null; updateButtons(); });
  restartButton = createButton('Restart');
  restartButton.mousePressed(restart);
  [legitButton, scamButton].forEach(b => b.style('font-size', '15px'));
  restart();
  positionControls();
  describe('A scholarship scam detector. An email or flyer offer appears; choose Looks legitimate or Looks like a scam. Feedback highlights the deciding phrase and names the warning sign or the sign of legitimacy, and a running list collects the warning signs you have found.');
}

function positionControls() {
  let x = 10, y = drawHeight + 10;
  [legitButton, scamButton, nextButton, restartButton].forEach(b => {
    b.style('white-space', 'nowrap');
    b.position(x, y);
    const w = b.elt.offsetWidth || 100;
    if (x > 10 && x + w > canvasWidth - 10) { x = 10; y += 32; b.position(x, y); }
    x += w + 8;
  });
}

function restart() {
  order = shuffle([...Array(DECK.length).keys()]);
  pos = 0;
  answered = null;
  score = 0;
  scored = 0;
  signs = new Set();
  updateButtons();
}

function updateButtons() {
  const done = pos >= order.length;
  [legitButton, scamButton].forEach(b => (answered || done) ? b.attribute('disabled', '') : b.removeAttribute('disabled'));
  (answered && !done) ? nextButton.removeAttribute('disabled') : nextButton.attribute('disabled', '');
}

function answer(pick) {
  if (answered || pos >= order.length) return;
  const card = DECK[order[pos]];
  let result;
  if (card.answer === 'check') result = 'check';
  else {
    result = pick === card.answer ? 'right' : 'wrong';
    scored++;
    if (result === 'right') score++;
  }
  if (card.answer === 'scam') card.marks.forEach(m => signs.add(m[1]));
  answered = { pick, result };
  updateButtons();
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
  text('Scholarship or Scam?', canvasWidth / 2, 8);

  const cw = min(620, canvasWidth - 2 * margin);
  const cx = (canvasWidth - cw) / 2;

  if (pos >= order.length) {
    stroke('seagreen');
    strokeWeight(2);
    fill('honeydew');
    rect(cx, 44, cw, 160, 10);
    strokeWeight(1);
    noStroke();
    fill('seagreen');
    textAlign(CENTER, TOP);
    textSize(19);
    textStyle(BOLD);
    text('Deck complete: ' + score + ' / ' + scored, cx, 60, cw);
    textStyle(NORMAL);
    fill('black');
    textSize(14);
    text('Remember: never pay to apply, never share bank information, and when in doubt, search the sponsor\'s name with "scam" and ask your counselor. Report scams at reportfraud.ftc.gov. Press Restart to play again.', cx + 16, 96, cw - 32, 100);
  } else {
    const card = DECK[order[pos]];
    // email card
    stroke('silver');
    fill('white');
    rect(cx, 42, cw, 168, 10);
    noStroke();
    fill('whitesmoke');
    rect(cx + 1, 43, cw - 2, 46, 10, 10, 0, 0);
    fill('dimgray');
    textAlign(LEFT, TOP);
    textSize(12);
    let from = 'From: ' + card.from;
    while (textWidth(from) > cw - 24 && from.length > 10) from = from.slice(0, -2);
    if (from !== 'From: ' + card.from) from += '…';
    text(from, cx + 12, 48);
    fill('black');
    textSize(15);
    textStyle(BOLD);
    text(card.subject, cx + 12, 66, cw - 24);
    textStyle(NORMAL);
    drawBody(card, cx + 12, 98, cw - 24, 106);

    if (answered) drawFeedback(card, cx, 220, cw, 130);
    else {
      fill('dimgray');
      textSize(14);
      textAlign(CENTER, TOP);
      text('Does this offer look legitimate, or like a scam? Choose below.', cx, 232, cw);
    }
  }

  // score and signs
  const ty = drawHeight - 88;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(cx, ty, cw, 80, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Score: ' + score + ' / ' + scored + (pos < order.length ? '   ·   card ' + (pos + 1) + ' of ' + order.length : ''), cx + 10, ty + 6);
  textStyle(NORMAL);
  fill('firebrick');
  textSize(12);
  text('Warning signs found: ' + (signs.size ? [...signs].join(' · ') : 'none yet'), cx + 10, ty + 26, cw - 20, 52);
}

// Wrap the offer text word by word, highlighting the marked phrases once answered
function drawBody(card, x, y, w, h) {
  textSize(14);
  const body = card.body;
  const marked = new Array(body.length).fill(false);
  if (answered) card.marks.forEach(([p]) => {
    const i = body.indexOf(p);
    if (i >= 0) for (let k = i; k < i + p.length; k++) marked[k] = true;
  });
  const hl = card.answer === 'scam' ? color(255, 160, 160, 170) : (card.answer === 'legit' ? color(150, 230, 160, 170) : color(255, 220, 120, 190));
  let cx = x, cy = y, idx = 0;
  const lineH = 20;
  body.split(' ').forEach(word => {
    const token = word + ' ';
    const ww = textWidth(token);
    if (cx + ww > x + w) { cx = x; cy += lineH; }
    const isMarked = marked[idx];
    if (isMarked) {
      noStroke();
      fill(hl);
      // don't highlight the trailing space if the next word isn't marked
      const nextMarked = marked[idx + word.length + 1];
      rect(cx, cy - 1, nextMarked ? ww : textWidth(word), lineH - 2, 2);
    }
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    text(token, cx, cy + 2);
    cx += ww;
    idx += word.length + 1;
  });
}

function drawFeedback(card, x, y, w, h) {
  const r = answered.result;
  let col, head;
  if (r === 'check') { col = 'darkorange'; head = '◐ Check it: search the sponsor\'s name with "scam" and ask your counselor.'; }
  else if (card.answer === 'scam') { col = 'firebrick'; head = (r === 'right' ? '⚠ Right, that\'s a scam.' : '⚠ Careful: that\'s a scam.'); }
  else { col = 'seagreen'; head = (r === 'right' ? '✓ Right, that looks legitimate.' : '✓ Actually, that looks legitimate.'); }
  stroke(col);
  strokeWeight(2);
  fill('white');
  rect(x, y, w, h, 10);
  strokeWeight(1);
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text(head, x + 12, y + 10, w - 24, 40);
  textStyle(NORMAL);
  fill('black');
  textSize(13);
  const label = card.answer === 'scam' ? 'Warning signs: ' : (card.answer === 'legit' ? 'Signs of legitimacy: ' : 'Why it\'s unclear: ');
  text(label + card.marks.map(m => m[1]).join('; ') + '.', x + 12, y + (textWidth(head) > w - 24 ? 52 : 36), w - 24, h - 56);
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
