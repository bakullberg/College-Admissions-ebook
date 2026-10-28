// Interview Practice Deck
// CANVAS_HEIGHT: 550
// Practice answering common interview questions out loud. Press "Start answering" and the timer
// counts up: green from 0:30 to 2:00, yellow from 2:00 to 3:00, orange after 3:00. After "Stop,"
// a quick self-check encourages specific stories over scripted answers. The deck doesn't repeat
// a question until every card in the chosen category has been shown.

let canvasWidth = 400;
let drawHeight = 330;
let controlHeight = 220;
let canvasHeight = drawHeight + controlHeight;
let margin = 14;
let defaultTextSize = 16;

const DECK = [
  ['About you', 'Tell me about yourself.', 'What\'s something about you that wouldn\'t show up on your application?'],
  ['About you', 'What would your friends say surprises people about you?', 'Why do you think that surprises people?'],
  ['About you', 'What do you do when you\'re not doing schoolwork?', 'How did you get into that?'],
  ['About you', 'What will you look for in a roommate?', 'What would a roommate need to know about you?'],
  ['Why us', 'Why are you interested in this college?', 'What would you do here that you couldn\'t do somewhere else?'],
  ['Why us', 'What would you contribute to our campus?', 'Can you give me an example of doing that already?'],
  ['Why us', 'What other colleges are you considering?', 'What do they have in common?'],
  ['Why us', 'What do you hope to get out of your four years?', 'How will you know if you got it?'],
  ['Academics', 'What do you want to study, and why?', 'When did you first get interested in that?'],
  ['Academics', 'What\'s your favorite class right now, and why?', 'What\'s something you learned there that stuck with you?'],
  ['Academics', 'Tell me about a class that challenged you.', 'What did you do when it got hard?'],
  ['Activities', 'What do you do outside of class? Which activity matters most to you?', 'What\'s been the hardest part of it?'],
  ['Activities', 'Tell me about an activity you\'ve stuck with for a long time.', 'How has your role changed over time?'],
  ['Activities', 'Describe a time you led or organized something.', 'What would you do differently next time?'],
  ['Challenge', 'Tell me about a challenge you\'ve faced, or a mistake you learned from.', 'What do you do differently now because of it?'],
  ['Challenge', 'Tell me about a time you disagreed with someone.', 'How did it end, and what did you learn about the other person?'],
  ['Challenge', 'Tell me about a time something didn\'t go the way you planned.', 'Who helped you get through it?'],
  ['Curiosity', 'What\'s something you\'ve read, watched, or learned recently that interested you?', 'What question did it leave you with?'],
  ['Curiosity', 'What\'s a book or idea you\'ve changed your mind about?', 'What changed your mind?'],
  ['Curiosity', 'If you could research anything, what would it be?', 'How would you start?'],
  ['Curiosity', 'What\'s a question you\'ve been thinking about lately?', 'Why does it matter to you?'],
  ['Your questions', 'Do you have any questions for me?', 'Ask about the interviewer\'s own experience: "What surprised you most when you got there?"'],
  ['Your questions', 'What would you like to know about student life here?', 'Follow up on their answer with "Can you give me an example?"'],
  ['Your questions', 'Is there anything else you\'d like me to know about you?', 'Use this to add one specific thing you didn\'t get to say.']
];
const CATEGORIES = ['All categories', 'About you', 'Why us', 'Academics', 'Activities', 'Challenge', 'Curiosity', 'Your questions'];
const CHECKS = [
  ['I used a specific example or story', 'Tip: answer with one short story, like your essays: a moment, not a summary.'],
  ['I said why it matters to me', 'Tip: end with a sentence about what it means to you or what you learned.'],
  ['It sounded like me, not a speech', 'Tip: don\'t memorize scripts. Practice the story, not the sentences.'],
  ['I could stop there or keep going if asked', 'Tip: give a complete answer in under two minutes, and leave room for a follow-up.']
];

let categorySelect, nextButton, startButton, stopButton, followButton, interviewerBox;
let checkBoxes = [];
let pool = [], current = -1;
let seen = new Set();
let practiced = 0;
let timerStart = 0, elapsed = 0, running = false, stopped = false;
let showFollow = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  categorySelect = createSelect();
  CATEGORIES.forEach(c => categorySelect.option(c));
  categorySelect.changed(() => { seen = new Set(); nextQuestion(); });
  nextButton = createButton('Next question');
  nextButton.mousePressed(nextQuestion);
  startButton = createButton('Start answering');
  startButton.mousePressed(startTimer);
  stopButton = createButton('Stop');
  stopButton.mousePressed(stopTimer);
  followButton = createButton('Follow-up');
  followButton.mousePressed(() => { showFollow = !showFollow; });
  interviewerBox = createCheckbox(' Interviewer mode', false);
  interviewerBox.changed(positionControls);
  CHECKS.forEach(c => checkBoxes.push(createCheckbox(' ' + c[0], false)));
  checkBoxes.forEach(b => b.style('font-size', '14px'));

  nextQuestion();
  describe('An interview practice deck. A card shows a common college interview question with its category. Press Start answering to time your spoken answer; the ring turns green between 30 seconds and 2 minutes. A follow-up button shows a likely next question, and a self-check helps you judge whether you used a specific story.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([categorySelect, nextButton, startButton, stopButton, followButton, interviewerBox], 10, y, 30) + 38;
  const showChecks = stopped && !interviewerBox.checked();
  checkBoxes.forEach(b => showChecks ? b.show() : b.hide());
  if (showChecks) {
    checkBoxes.forEach(b => {
      b.style('white-space', 'nowrap');
      b.position(10, y);
      y += 24;
    });
  }
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

function nextQuestion() {
  const cat = categorySelect.value();
  pool = DECK.map((d, i) => i).filter(i => cat === 'All categories' || DECK[i][0] === cat);
  let unseen = pool.filter(i => !seen.has(i));
  if (!unseen.length) { seen = new Set(); unseen = pool.slice(); }
  current = random(unseen);
  seen.add(current);
  running = false;
  stopped = false;
  elapsed = 0;
  showFollow = false;
  checkBoxes.forEach(b => b.checked(false));
  positionControls();
}

function startTimer() {
  running = true;
  stopped = false;
  timerStart = millis();
  elapsed = 0;
  positionControls();
}

function stopTimer() {
  if (!running) return;
  elapsed = millis() - timerStart;
  running = false;
  stopped = true;
  practiced++;
  positionControls();
}

function fmt(ms) {
  const s = floor(ms / 1000);
  return floor(s / 60) + ':' + nf(s % 60, 2);
}

function draw() {
  if (running) elapsed = millis() - timerStart;

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
  text('Interview Practice Deck', canvasWidth / 2, 8);

  const wide = canvasWidth >= 620;
  const [cat, q, follow] = DECK[current];
  const cardW = wide ? canvasWidth * 0.6 : canvasWidth - 2 * margin;
  // question card
  stroke('steelblue');
  strokeWeight(2);
  fill('white');
  rect(margin, 42, cardW, wide ? 160 : 112, 12);
  strokeWeight(1);
  noStroke();
  fill('steelblue');
  textSize(12);
  rect(margin + 12, 52, textWidth(cat) + 24, 20, 10);
  fill('white');
  textSize(12);
  textAlign(LEFT, CENTER);
  text(cat, margin + 22, 62);
  fill('black');
  textSize(wide ? 22 : 18);
  textAlign(LEFT, TOP);
  text(q, margin + 16, 82, cardW - 32, wide ? 112 : 70);

  // follow-up panel
  const fx = wide ? margin * 2 + cardW : margin, fy = wide ? 42 : 162;
  const fw = wide ? canvasWidth - cardW - 3 * margin : canvasWidth - 2 * margin;
  const fh = wide ? 160 : 52;
  stroke('silver');
  fill(showFollow ? 'lightyellow' : 'whitesmoke');
  rect(fx, fy, fw, fh, 10);
  noStroke();
  textAlign(LEFT, TOP);
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text('LIKELY FOLLOW-UP', fx + 10, fy + 8);
  textStyle(NORMAL);
  fill(showFollow ? 'black' : 'gray');
  textSize(wide ? 15 : 13);
  text(showFollow ? follow : 'Press Follow-up to reveal it.', fx + 10, fy + 26, fw - 20, fh - 30);

  // timer
  const ty = wide ? 270 : 262;
  const tx = margin + 50, d = 74;
  const sec = elapsed / 1000;
  const col = sec < 30 ? 'lightsteelblue' : (sec <= 120 ? 'mediumseagreen' : (sec <= 180 ? 'gold' : 'darkorange'));
  noFill();
  strokeWeight(9);
  stroke('gainsboro');
  circle(tx, ty, d);
  stroke(col);
  if (sec > 0) arc(tx, ty, d, d, -HALF_PI, -HALF_PI + TWO_PI * min(1, sec / 180));
  strokeWeight(1);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text(fmt(elapsed), tx, ty);
  textStyle(NORMAL);

  textAlign(LEFT, TOP);
  textSize(13);
  fill('black');
  let msg;
  if (running) msg = sec < 30 ? 'Keep going: give one specific example.' : (sec <= 120 ? 'Good length. Wrap up when your point is made.' : (sec <= 180 ? 'Getting long. Bring it to a close.' : 'Too long. Aim for under two minutes.'));
  else if (stopped) msg = 'Answer time ' + fmt(elapsed) + '. ' + (sec < 30 ? 'A little short; add a specific story.' : (sec <= 120 ? 'A natural length.' : 'Try a tighter version.'));
  else msg = 'Read the question, then press Start answering and answer out loud.';
  text(msg, tx + d / 2 + 14, ty - 26, canvasWidth - tx - d / 2 - 30, 40);
  fill('dimgray');
  textSize(11);
  text('Most good answers run 30 seconds to 2 minutes. Practiced this session: ' + practiced, tx + d / 2 + 14, ty + 18, canvasWidth - tx - d / 2 - 30);

  // self-check tips (in the control region, beside the checkboxes on wide screens)
  if (stopped && !interviewerBox.checked()) {
    const tips = CHECKS.filter((c, i) => !checkBoxes[i].checked()).map(c => c[1]);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(12);
    fill('darkorange');
    if (wide && tips.length) text(tips[0], canvasWidth * 0.52, drawHeight + 48, canvasWidth * 0.45, 90);
    else if (!tips.length) { fill('seagreen'); text('✓ That answer hit every check. Try the next question.', wide ? canvasWidth * 0.52 : 10, drawHeight + (wide ? 48 : controlHeight - 22)); }
    else if (!wide) text(tips[0], 10, drawHeight + controlHeight - 26, canvasWidth - 20, 24);
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
