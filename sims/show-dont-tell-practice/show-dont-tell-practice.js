// Show, Don't Tell Practice
// CANVAS_HEIGHT: 610
// Each card states a quality ("telling"). Pick the revision that shows it: the strong one uses a
// specific action and concrete detail; the weak one stays general; the overloaded one piles on
// adjectives and still tells. "Write your own" checks a revision for concrete words, a number,
// an action verb, and whether the original adjective is gone.

let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 260;
let canvasHeight = drawHeight + controlHeight;
let margin = 14;
let defaultTextSize = 16;

const CARDS = [
  { tell: 'I am patient.', strong: 'I read the same page to my brother eleven nights in a row.',
    weak: 'I was very patient with my brother when he was learning.', over: 'I am an incredibly, deeply, endlessly patient and kind person.',
    why: 'Eleven nights of one page shows patience without naming it.' },
  { tell: 'I love science.', strong: 'I\'ve kept a notebook of 62 questions about how our creek floods.',
    weak: 'Science has always been my passion.', over: 'I am truly, deeply, endlessly fascinated by every amazing part of science.',
    why: 'A notebook of 62 questions is evidence a reader can picture.' },
  { tell: 'Work taught me responsibility.', strong: 'At 16, I was the one who counted the register at closing, and the one who called when it was $4 short.',
    weak: 'My job made me very responsible.', over: 'Work turned me into an extremely dependable, mature, trustworthy, and responsible young adult.',
    why: 'Counting the register and making the call shows responsibility in one scene.' },
  { tell: 'I am a natural leader.', strong: 'When our robotics captain quit in October, I split the team into three build crews and posted a schedule by Friday.',
    weak: 'I have always taken on leadership roles in my activities.', over: 'I am a confident, inspiring, motivated, and natural-born leader.',
    why: 'Three crews and a schedule by Friday show what leading looked like.' },
  { tell: 'I am curious.', strong: 'I took apart our broken toaster to find out why only one side browned, and found a snapped coil.',
    weak: 'I have always been a curious person who asks questions.', over: 'I am endlessly, wildly, passionately curious about absolutely everything.',
    why: 'Taking apart a toaster to find a snapped coil is curiosity in action.' },
  { tell: 'I don\'t give up.', strong: 'I failed my driving test twice, then practiced parallel parking in the church lot every Sunday until I could do it in one try.',
    weak: 'I have learned to keep going when things get hard.', over: 'I am incredibly resilient, determined, tough, and unstoppable.',
    why: 'Two failures and every Sunday in the lot show persistence step by step.' },
  { tell: 'I\'m funny.', strong: 'At my grandmother\'s 80th, I read a ten-line poem about her terrible parking, and she laughed so hard she cried.',
    weak: 'People say I have a great sense of humor.', over: 'I am hilarious, witty, clever, and always the funniest person in any room.',
    why: 'The poem and her reaction let the reader decide you\'re funny.' },
  { tell: 'I care about others.', strong: 'Every Tuesday I walk Mrs. Okafor\'s dog so she can rest her knee after physical therapy.',
    weak: 'I always try to be kind and help people.', over: 'I am a deeply caring, generous, compassionate, and selfless person.',
    why: 'A named neighbor and a weekly walk show care concretely.' }
];

const ABSTRACT = ['patient', 'patience', 'kind', 'kindness', 'caring', 'care', 'dedicated', 'dedication', 'passionate', 'passion', 'responsible',
  'responsibility', 'hardworking', 'leader', 'leadership', 'curious', 'curiosity', 'resilient', 'resilience', 'funny', 'humor', 'generous',
  'compassionate', 'selfless', 'determined', 'motivated', 'confident', 'inspiring', 'mature', 'dependable', 'trustworthy', 'helpful',
  'love', 'loved', 'always', 'very', 'really', 'truly', 'deeply', 'learned', 'taught', 'person', 'people', 'things', 'something'];
const STOP = ['that', 'this', 'with', 'from', 'have', 'were', 'when', 'then', 'they', 'their', 'there', 'about', 'what', 'into', 'every', 'because'];
const NUMBER_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'twenty', 'hundred', 'dozen', 'first', 'second', 'third', 'once', 'twice'];

let optionButtons = [];
let nextButton, writeButton;
let tellInput, showInput, tellLabel, showLabel;
let order = [], pos = 0;
let choice = null;        // { kind, correct }
let options = [];         // shuffled kinds for this round
let score = 0, answered = 0;
let writeMode = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (let i = 0; i < 3; i++) {
    const b = createButton('');
    b.style('white-space', 'normal');
    b.style('text-align', 'left');
    b.style('font-size', '15px');
    b.style('padding', '6px 10px');
    b.mousePressed(() => choose(i));
    optionButtons.push(b);
  }
  nextButton = createButton('Next ▶');
  nextButton.mousePressed(nextCard);
  writeButton = createButton('Write your own');
  writeButton.mousePressed(toggleWrite);

  tellLabel = createSpan('Your telling sentence:');
  tellInput = createInput('I am hardworking.');
  showLabel = createSpan('Your showing revision:');
  showInput = createInput('');
  showInput.attribute('placeholder', 'What did it actually look like?');
  [tellLabel, showLabel].forEach(s => s.style('font-size', '14px'));

  order = shuffle([...Array(CARDS.length).keys()]);
  newRound();
  positionControls();
  describe('A show-don\'t-tell practice game. A card shows a telling sentence such as "I am patient." Choose the revision that shows the quality through specific action and detail, and read why. A write-your-own mode checks your revision for concrete words, numbers, an action verb, and whether the original adjective is gone.');
}

function positionControls() {
  const w = canvasWidth - 20;
  let y = drawHeight + 8;
  if (!writeMode) {
    [tellLabel, tellInput, showLabel, showInput].forEach(e => e.hide());
    optionButtons.forEach(b => {
      b.show();
      b.style('width', w + 'px');
      b.position(10, y);
      y += (b.elt.offsetHeight || 40) + 6;
    });
  } else {
    optionButtons.forEach(b => b.hide());
    [tellLabel, tellInput, showLabel, showInput].forEach(e => e.show());
    tellLabel.position(10, y); tellInput.position(10, y + 20); tellInput.size(w - 8);
    showLabel.position(10, y + 54); showInput.position(10, y + 74); showInput.size(w - 8);
    y += 110;
  }
  nextButton.position(10, drawHeight + controlHeight - 38);
  writeButton.position(writeMode ? 10 : 90, drawHeight + controlHeight - 38);
  writeButton.html(writeMode ? 'Back to the deck' : 'Write your own');
  writeMode ? nextButton.hide() : nextButton.show();
}

function newRound() {
  options = shuffle(['strong', 'weak', 'over']);
  const card = CARDS[order[pos % order.length]];
  optionButtons.forEach((b, i) => {
    b.html(card[options[i]]);
    b.style('background', '');
  });
  choice = null;
  positionControls();
}

function choose(i) {
  if (choice) return;
  const kind = options[i];
  choice = { kind, correct: kind === 'strong' };
  answered++;
  if (choice.correct) score++;
  optionButtons.forEach((b, k) => {
    const kk = options[k];
    b.style('background', kk === 'strong' ? 'palegreen' : (k === i ? 'mistyrose' : ''));
  });
}

function nextCard() {
  pos++;
  if (pos % order.length === 0) order = shuffle(order);
  newRound();
}

function toggleWrite() {
  writeMode = !writeMode;
  positionControls();
}

function writeChecks() {
  const tell = tellInput.value().toLowerCase();
  const show = showInput.value().toLowerCase();
  const words = show.match(/[a-z'$0-9]+/g) || [];
  const concrete = words.filter(w => w.length >= 4 && !ABSTRACT.includes(w) && !STOP.includes(w));
  const hasNumber = /\d/.test(show) || words.some(w => NUMBER_WORDS.includes(w));
  const hasAction = words.some(w => /ed$/.test(w) && w.length > 4) || words.some(w => ['ran', 'built', 'made', 'read', 'wrote', 'took', 'drove', 'taught', 'fixed', 'walk', 'walked', 'split', 'led', 'cook', 'drew', 'sang', 'gave', 'found', 'counted'].includes(w));
  const tellAdj = (tell.match(/[a-z']+/g) || []).filter(w => ABSTRACT.includes(w) || /(ful|ive|ous|ing|ent|ant|ible|able)$/.test(w) && w.length > 5);
  const keepsAdj = tellAdj.filter(a => words.includes(a));
  return [
    { ok: concrete.length >= 5, text: concrete.length >= 5 ? 'Uses concrete words (' + concrete.slice(0, 4).join(', ') + '…).' : 'Add concrete nouns: places, objects, names, times.' },
    { ok: hasNumber, text: hasNumber ? 'Includes a number or count.' : 'Add a number: how many, how often, how long?' },
    { ok: hasAction, text: hasAction ? 'Has an action verb.' : 'Show someone doing something: an action verb.' },
    { ok: show.length > 0 && keepsAdj.length === 0, text: keepsAdj.length ? 'Still says "' + keepsAdj[0] + '". Let the action show it instead.' : (show.length ? 'The original adjective is gone.' : 'Write your revision above.') }
  ];
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
  text('Show, Don\'t Tell Practice', canvasWidth / 2, 8);

  const cardW = min(620, canvasWidth - 2 * margin);
  const cx = (canvasWidth - cardW) / 2;

  if (writeMode) {
    drawWriteOwn(cx, cardW);
    return;
  }
  const card = CARDS[order[pos % order.length]];
  stroke('steelblue');
  strokeWeight(2);
  fill('white');
  rect(cx, 42, cardW, 70, 12);
  strokeWeight(1);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('TELLING · card ' + ((pos % CARDS.length) + 1) + ' of ' + CARDS.length, cx + 12, 48);
  fill('black');
  textSize(22);
  textStyle(ITALIC);
  textAlign(CENTER, CENTER);
  text('"' + card.tell + '"', cx, 66, cardW, 44);
  textStyle(NORMAL);

  const fy = 124;
  stroke('silver');
  fill('white');
  rect(cx, fy, cardW, drawHeight - fy - 44, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (!choice) {
    fill('dimgray');
    textSize(15);
    text('Which revision below shows the quality instead of telling it? Pick one.', cx + 12, fy + 12, cardW - 24);
  } else {
    fill(choice.correct ? 'seagreen' : 'firebrick');
    textSize(16);
    textStyle(BOLD);
    text(choice.correct ? '✓ That one shows it.' : (choice.kind === 'weak' ? '✗ That one is still general.' : '✗ That one piles on adjectives.'), cx + 12, fy + 10, cardW - 24);
    textStyle(NORMAL);
    fill('black');
    textSize(13);
    const lines = [
      'Strong (green): specific action and concrete detail. ' + card.why,
      'Weak: still a general statement. There\'s no scene, number, or detail a reader can picture.',
      'Overloaded: more adjectives make it louder, not truer. It still tells.'
    ];
    let ly = fy + 36;
    lines.forEach(l => {
      const n = ceil(textWidth('• ' + l) / (cardW - 30));
      text('• ' + l, cx + 12, ly, cardW - 24, n * 17 + 4);
      ly += n * 17 + 5;
    });
  }
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Score: ' + score + ' / ' + answered, cx, drawHeight - 22);
}

function drawWriteOwn(cx, w) {
  stroke('silver');
  fill('white');
  rect(cx, 42, w, drawHeight - 52, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  text('Write your own', cx + 12, 52);
  textStyle(NORMAL);
  textSize(13);
  fill('dimgray');
  text('Type a telling sentence and a showing revision below. Ask yourself: what did that actually look like?', cx + 12, 76, w - 24);
  let y = 118;
  textSize(15);
  writeChecks().forEach(c => {
    fill(c.ok ? 'seagreen' : 'darkorange');
    const line = (c.ok ? '✓ ' : '⚠ ') + c.text;
    const n = ceil(textWidth(line) / (w - 30));
    text(line, cx + 12, y, w - 24, n * 20 + 4);
    y += n * 20 + 8;
  });
  fill('gray');
  textSize(11);
  text('These are simple checks, not a grade. A real reader cares most whether they can picture the moment.', cx + 12, drawHeight - 32, w - 24);
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
