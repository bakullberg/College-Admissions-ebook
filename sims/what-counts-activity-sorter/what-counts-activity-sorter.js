// What Counts as an Activity?
// CANVAS_HEIGHT: 500
// One scenario at a time: decide "List it" or "Probably not," then read the recommended answer,
// the Common App activity type it would go under, and why. Gray-area cards are never "wrong";
// they explain what would make them count.

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;

// answer: 'list' | 'not' | 'depends'
const DECK = [
  { s: 'Pick up younger siblings and supervise homework, 12 hrs/wk', answer: 'list', type: 'Family responsibilities', why: 'Real, regular responsibility that takes significant time.' },
  { s: 'Bag groceries at a supermarket, 10 hrs/wk', answer: 'list', type: 'Work (paid)', why: 'Jobs show reliability and time management.' },
  { s: 'Taught yourself guitar; play at open mics monthly', answer: 'list', type: 'Music (or Independent)', why: 'Self-directed and sustained, with something to show.' },
  { s: 'Watched a lot of cooking videos', answer: 'not', type: null, why: 'Consuming isn\'t the same as doing. Cooking regularly for your family would count.' },
  { s: 'Translate for parents at appointments, 2–3 hrs/wk', answer: 'list', type: 'Family responsibilities', why: 'A real skill and responsibility.' },
  { s: 'Went to two meetings of Spanish Club in 9th grade', answer: 'not', type: null, why: 'Too brief to say much. Leave the slot for something deeper.' },
  { s: 'Run a small lawn-mowing business in summer, 6 clients', answer: 'list', type: 'Work (paid) or Independent', why: 'Initiative plus real responsibility.' },
  { s: 'Weekly volunteer at an animal shelter for 2 years', answer: 'list', type: 'Community service', why: 'Sustained service.' },
  { s: 'Attended a $6,000 two-week summer "leadership" program', answer: 'depends', type: 'Other', why: 'List it only if you can describe what you did. Readers weigh paid programs lightly, so describe specifics.' },
  { s: 'Help run family\'s food truck on weekends, 8 hrs/wk', answer: 'list', type: 'Work or Family responsibilities', why: 'Both a job and a family duty.' },
  { s: 'Play video games', answer: 'depends', type: null, why: 'Probably not, unless… Casual play isn\'t an activity. Competing, streaming, modding, or organizing a club could be.' },
  { s: 'Write and post a short story every week on a writing site, 300 followers', answer: 'list', type: 'Independent or Journalism/Writing', why: 'Self-directed creative work with an audience.' },
  { s: 'Youth group at your place of worship, leading the middle school group', answer: 'list', type: 'Religious', why: 'Leadership in a community.' },
  { s: 'Took an online course for fun and finished it', answer: 'depends', type: 'Academic or Independent', why: 'Maybe. List it if it was substantial or led to something you made.' }
];

let listButton, notButton, nextButton, restartButton;
let order = [], pos = 0;
let answered = null;     // { pick, result: 'match' | 'depends' | 'mismatch' }
let score = 0, scored = 0;
let types = new Set();

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  listButton = createButton('List it');
  listButton.mousePressed(() => answer('list'));
  notButton = createButton('Probably not');
  notButton.mousePressed(() => answer('not'));
  nextButton = createButton('Next ▶');
  nextButton.mousePressed(next);
  restartButton = createButton('Restart');
  restartButton.mousePressed(restart);
  [listButton, notButton].forEach(b => { b.style('font-size', '16px'); b.style('padding', '4px 14px'); });

  restart();
  positionControls();
  describe('An activity sorting game. A card describes an everyday commitment, such as a job, family duty, or hobby. Choose List it or Probably not, then read whether it belongs on the activities list, which activity type it fits, and why.');
}

function positionControls() {
  let x = 10;
  [listButton, notButton, nextButton, restartButton].forEach(b => {
    b.position(x, drawHeight + 10);
    x += (b.elt.offsetWidth || 90) + 10;
  });
}

function restart() {
  order = shuffle([...Array(DECK.length).keys()]);
  pos = 0;
  answered = null;
  score = 0;
  scored = 0;
  types = new Set();
  updateButtons();
}

function updateButtons() {
  const done = pos >= order.length;
  if (answered || done) { listButton.attribute('disabled', ''); notButton.attribute('disabled', ''); }
  else { listButton.removeAttribute('disabled'); notButton.removeAttribute('disabled'); }
  if (answered && !done) nextButton.removeAttribute('disabled'); else nextButton.attribute('disabled', '');
}

function answer(pick) {
  if (answered || pos >= order.length) return;
  const card = DECK[order[pos]];
  let result;
  if (card.answer === 'depends') result = 'depends';
  else result = pick === card.answer ? 'match' : 'mismatch';
  if (card.answer !== 'depends') { scored++; if (result === 'match') score++; }
  if (card.type && (card.answer === 'list' || pick === 'list')) card.type.split(/ or |\(|\)|\//).map(t => t.trim()).filter(t => t && t !== 'Independent' && t.length > 2).forEach(t => types.add(t));
  if (card.type && card.type.includes('Independent')) types.add('Independent');
  answered = { pick, result };
  updateButtons();
}

function next() {
  pos++;
  answered = null;
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
  text('What Counts as an Activity?', canvasWidth / 2, 8);

  const cardW = min(600, canvasWidth - 2 * margin);
  const cx = (canvasWidth - cardW) / 2;

  if (pos >= order.length) {
    drawFinish(cx, cardW);
  } else {
    const card = DECK[order[pos]];
    // scenario card
    stroke('steelblue');
    strokeWeight(2);
    fill('white');
    rect(cx, 42, cardW, 110, 12);
    strokeWeight(1);
    noStroke();
    fill('dimgray');
    textSize(12);
    textAlign(LEFT, TOP);
    text('Card ' + (pos + 1) + ' of ' + order.length, cx + 14, 50);
    fill('black');
    textSize(canvasWidth < 480 ? 17 : 20);
    textAlign(CENTER, CENTER);
    text(card.s, cx + 16, 62, cardW - 32, 84);

    // feedback
    if (answered) drawFeedback(card, cx, 162, cardW, 180);
    else {
      fill('dimgray');
      textSize(15);
      textAlign(CENTER, TOP);
      text('Would you put this on your activities list? Choose below.', cx, 176, cardW);
    }
  }

  // score and tally
  const ty = drawHeight - 92;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(cx, ty, cardW, 84, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text('Score: ' + score + ' / ' + scored + (scored ? '' : '') + '   (gray-area cards aren\'t scored)', cx + 12, ty + 8, cardW - 24);
  textStyle(NORMAL);
  textSize(13);
  fill('navy');
  text('Activity types discovered (' + types.size + '): ' + (types.size ? [...types].join(' · ') : 'none yet'), cx + 12, ty + 32, cardW - 24, 48);
}

function drawFeedback(card, x, y, w, h) {
  const r = answered.result;
  const col = r === 'match' ? 'seagreen' : (r === 'depends' ? 'darkorange' : 'dimgray');
  const head = r === 'match' ? '✓ Matches the recommendation' : (r === 'depends' ? '◐ It depends' : '✗ Different from the recommendation');
  stroke(col);
  strokeWeight(2);
  fill('white');
  rect(x, y, w, h, 10);
  strokeWeight(1);
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textSize(17);
  textStyle(BOLD);
  text(head, x + 14, y + 10, w - 28);
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  const rec = card.answer === 'list' ? 'List it' : (card.answer === 'not' ? 'Probably not' : 'It depends');
  text('Recommended: ' + rec, x + 14, y + 38, w - 28);
  fill('navy');
  text('Activity type: ' + (card.type || 'not listed'), x + 14, y + 60, w - 28);
  fill('black');
  text(card.why, x + 14, y + 86, w - 28, h - 90);
}

function drawFinish(cx, w) {
  stroke('seagreen');
  strokeWeight(2);
  fill('honeydew');
  rect(cx, 42, w, 200, 12);
  strokeWeight(1);
  noStroke();
  fill('seagreen');
  textAlign(CENTER, TOP);
  textSize(20);
  textStyle(BOLD);
  text('Deck complete!', cx, 60, w);
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  text('You matched ' + score + ' of ' + scored + ' clear-cut cards. The lesson: jobs, family duties, and self-directed projects count as much as school clubs. What matters is commitment, not who sponsors it. Press Restart to shuffle the deck again.',
       cx + 20, 96, w - 40, 140);
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
