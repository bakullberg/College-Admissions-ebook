// Why Us Specificity Checker
// CANVAS_HEIGHT: 640
// Simple patterns, not a judgment of quality:
//   orange  = a sentence with a generic phrase ("excellent," "sense of community," "grow as a person"…)
//   green   = a sentence with a likely specific detail (a proper noun other than the college's name,
//             a course number, an italic or quoted title, or a number)
//   blue line under a green sentence = it also connects the detail to you ("I," "my," "me")
// The swap test replaces the college's name with another college's name.

let canvasWidth = 400;
let drawHeight = 370;
let controlHeight = 270;
let canvasHeight = drawHeight + controlHeight;
let margin = 14;
let defaultTextSize = 16;

const GENERIC = ['excellent', 'world-class', 'world class', 'beautiful campus', 'sense of community', 'welcoming community',
  'diverse', 'renowned', 'grow as a person', 'challenged academically', 'vibrant', 'prestigious', 'small class sizes',
  'top-notch', 'amazing opportunities', 'perfect fit', 'great reputation', 'state-of-the-art', 'well-rounded', 'dream school'];
const NUMBER_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'twenty', 'thirty', 'forty', 'fifty', 'hundred', 'first', 'second', 'third'];

const DRAFTS = {
  first: 'I want to attend Hillcrest College because of its excellent English program, small class sizes, and welcoming community. ' +
         'I know that at Hillcrest I will be challenged academically and grow as a person. ' +
         'The beautiful campus and strong sense of community make Hillcrest the perfect fit for me.',
  revision: 'On my visit, I sat in on Professor Lin\'s seminar on the novel and memory, where eleven students argued for forty minutes about one paragraph of *Mrs. Dalloway* and nobody checked their phone. ' +
            'I want four years of that. ' +
            'Hillcrest\'s writing-intensive first-year seminar and its student-run literary review, the *Hillcrest Quarterly*, would let me keep doing what I love most about editing my school\'s magazine: arguing over a single sentence until it\'s right.'
};

let collegeInput, otherInput, draftBox, checkButton, swapButton, firstButton, revisionButton, clearButton;
let labels = {};
let mode = 'idle';   // 'idle' | 'check' | 'swap'
let results = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  labels.college = createSpan('College name:');
  collegeInput = createInput('Hillcrest College');
  collegeInput.size(150);
  labels.other = createSpan('A different college:');
  otherInput = createInput('College C');
  otherInput.size(120);
  labels.draft = createSpan('Your draft:');
  draftBox = createElement('textarea');
  draftBox.attribute('rows', '5');
  draftBox.attribute('placeholder', 'Paste your Why Us draft here.');
  draftBox.style('font-size', '14px');
  draftBox.style('box-sizing', 'border-box');
  draftBox.input(() => { if (mode !== 'idle') runCheck(mode); });
  labels.count = createSpan('0 words');
  Object.values(labels).forEach(l => l.style('font-size', '14px'));

  checkButton = createButton('Check');
  checkButton.mousePressed(() => runCheck('check'));
  swapButton = createButton('Swap test');
  swapButton.mousePressed(() => runCheck('swap'));
  firstButton = createButton('Priya — first draft');
  firstButton.mousePressed(() => { draftBox.value(DRAFTS.first); collegeInput.value('Hillcrest College'); otherInput.value('College C'); runCheck('check'); });
  revisionButton = createButton('Priya — revision');
  revisionButton.mousePressed(() => { draftBox.value(DRAFTS.revision); collegeInput.value('Hillcrest College'); otherInput.value('College C'); runCheck('check'); });
  clearButton = createButton('Clear');
  clearButton.mousePressed(() => { draftBox.value(''); mode = 'idle'; results = null; });

  positionControls();
  describe('A Why Us essay specificity checker. Paste a draft and the college name. Check highlights generic sentences in orange and specific sentences in green, underlining those that connect a detail to you. The swap test replaces the college name with another college to see if the essay still works.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([labels.college, collegeInput, labels.other, otherInput], 10, y, 30) + 34;
  flowRow([labels.draft, labels.count], 10, y, 22);
  y += 22;
  draftBox.position(10, y);
  draftBox.size(canvasWidth - 20, 100);
  y += 108;
  flowRow([checkButton, swapButton, firstButton, revisionButton, clearButton], 10, y, 30);
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

// Split into sentences without breaking after common abbreviations such as "Mrs." or "Dr."
function splitSentences(t) {
  const ABBR = /\b(Mr|Mrs|Ms|Dr|Prof|St|Jr|Sr|vs|etc|e\.g|i\.e)\./g;
  const guarded = t.replace(/\s+/g, ' ').trim().replace(ABBR, '$1§');
  return (guarded.match(/[^.!?]+[.!?]*["')\]*]*\s*/g) || []).map(s => s.trim().replace(/§/g, '.')).filter(Boolean);
}

function analyze(sentence, college) {
  const lower = sentence.toLowerCase();
  const generic = GENERIC.filter(g => lower.includes(g));
  const collegeWords = college.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const words = sentence.replace(/[*"“”]/g, ' ').split(/\s+/).filter(Boolean);
  // proper nouns: capitalized words that aren't the first word, "I", or part of the college's name
  const proper = words.slice(1).filter(w => /^[A-Z][a-z]/.test(w) && w !== 'I' &&
                                     !collegeWords.includes(w.toLowerCase().replace(/[^a-z]/g, '').replace(/s$/, '')) &&
                                     !collegeWords.includes(w.toLowerCase().replace(/[^a-z]/g, '')));
  const course = /\b[A-Z]{2,4}\s?\d{2,3}\b/.test(sentence);
  const title = /\*[^*]+\*|"[^"]+"|“[^”]+”/.test(sentence);
  const number = /\d/.test(sentence) || NUMBER_WORDS.some(n => new RegExp('\\b' + n + '\\b', 'i').test(sentence));
  const specific = proper.length > 0 || course || title || number;
  const personal = /\b(i|my|me)\b/i.test(sentence);
  return { text: sentence, generic, specific, personal: specific && personal };
}

function runCheck(m) {
  mode = m;
  const college = collegeInput.value().trim();
  const text = draftBox.value();
  const sentences = splitSentences(text).map(s => analyze(s, college));
  results = {
    sentences,
    specific: sentences.filter(s => s.specific).length,
    generic: sentences.reduce((n, s) => n + s.generic.length, 0),
    personal: sentences.filter(s => s.personal).length
  };
}

function swapText() {
  const college = collegeInput.value().trim();
  const other = otherInput.value().trim() || 'another college';
  let t = draftBox.value();
  if (!college) return t;
  // replace the full name first, then its distinctive first word (e.g., "Hillcrest")
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  t = t.replace(new RegExp(esc(college), 'gi'), other);
  const first = college.split(/\s+/)[0];
  if (first.length > 3 && !['the', 'university', 'college'].includes(first.toLowerCase())) {
    t = t.replace(new RegExp('\\b' + esc(first) + '\\b', 'g'), other.split(/\s+/)[0] === 'College' ? other : other.split(/\s+/)[0]);
  }
  return t;
}

function draw() {
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const words = (draftBox.value().match(/\S+/g) || []).length;
  labels.count.html(words + ' words');

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Why Us Specificity Checker', canvasWidth / 2, 8);

  const px = margin, pw = canvasWidth - 2 * margin, py = 40, ph = drawHeight - 40 - 76;
  stroke('silver');
  fill('white');
  rect(px, py, pw, ph, 8);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);

  if (mode === 'idle' || !results) {
    fill('dimgray');
    text('Paste your Why Us draft below and press Check, or load one of Priya\'s drafts. Then try the Swap test.', px + 12, py + 12, pw - 24);
  } else if (mode === 'swap') {
    const other = otherInput.value().trim() || 'another college';
    const college = collegeInput.value().trim() || 'your college';
    fill('navy');
    textStyle(BOLD);
    text('Swap test: "' + college + '" → "' + other + '"', px + 12, py + 8, pw - 24);
    textStyle(NORMAL);
    fill('black');
    textSize(13);
    text(swapText().replace(/\*/g, ''), px + 12, py + 30, pw - 24, ph - 72);
    fill('darkorange');
    textSize(13);
    textStyle(BOLD);
    text('Does this still make sense? If yes, add details only true of ' + college + '.', px + 12, py + ph - 38, pw - 24);
    textStyle(NORMAL);
  } else {
    drawHighlighted(px + 12, py + 10, pw - 24, ph - 20);
  }

  // summary and legend
  const sy = drawHeight - 70;
  noStroke();
  textAlign(LEFT, TOP);
  if (results && mode !== 'idle') {
    fill('black');
    textSize(15);
    textStyle(BOLD);
    const summary = canvasWidth < 560
      ? 'Specific: ' + results.specific + ' · Generic: ' + results.generic + ' · Connected to you: ' + results.personal
      : 'Specific details: ' + results.specific + '   Generic phrases: ' + results.generic + '   Sentences connecting a detail to you: ' + results.personal;
    text(summary, margin, sy, canvasWidth - 2 * margin);
    textStyle(NORMAL);
  }
  fill('gray');
  textSize(11);
  text('Orange = generic phrase · Green = specific detail · Blue underline = detail connected to you. This checker uses simple patterns. It can\'t judge quality, but it can show where a reader will see generic language.',
       margin, drawHeight - 34, canvasWidth - 2 * margin);
}

// Word-wrap each sentence and paint its background by category
function drawHighlighted(x, y, w, h) {
  textSize(14);
  const lineH = 21;
  let cx = x, cy = y;
  for (const s of results.sentences) {
    const bg = s.generic.length ? color(255, 200, 120, 160) : (s.specific ? color(150, 230, 160, 170) : null);
    const tokens = s.text.replace(/\*/g, '').split(' ');
    for (const t of tokens) {
      const word = t + ' ';
      const ww = textWidth(word);
      if (cx + ww > x + w) { cx = x; cy += lineH; }
      if (cy + lineH > y + h) {
        fill('gray');
        text('…', cx, cy - lineH);
        return;
      }
      if (bg) { noStroke(); fill(bg); rect(cx, cy - 1, ww, lineH - 2); }
      if (s.personal) { stroke('royalblue'); strokeWeight(2); line(cx, cy + lineH - 4, cx + ww - 3, cy + lineH - 4); strokeWeight(1); }
      noStroke();
      fill('black');
      text(word, cx, cy + 2);
      cx += ww;
    }
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
