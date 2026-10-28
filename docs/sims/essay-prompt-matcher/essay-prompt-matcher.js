// Essay Topic and Prompt Matcher
// CANVAS_HEIGHT: 600
// Describe a candidate topic with five questions. The seven Common App prompt cards light up
// green (strong fit) or yellow (possible fit) from what the story is mostly about. The
// "story strength" meter scores specificity, what it reveals, and meaning (0–2 points each):
// 0–1 Weak, 2–4 Promising, 5–6 Strong. Prompt summaries are paraphrased; read the exact wording
// on the Common App site.

let canvasWidth = 400;
let drawHeight = 340;
let controlHeight = 260;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const PROMPTS = [
  'Background, identity, interest, or talent',
  'Obstacle, setback, or failure',
  'Questioned or challenged a belief',
  'Gratitude for something someone did',
  'Accomplishment or realization that sparked growth',
  'A topic so engaging you lose track of time',
  'Any topic of your choice'
];
const PROMPT_LONG = [
  'A background, identity, interest, or talent so central to you that your application would feel incomplete without it.',
  'An obstacle, setback, or failure, and what you learned from it.',
  'A time you questioned or challenged a belief or idea.',
  'Something someone did for you that made you grateful in a surprising way.',
  'An accomplishment, event, or realization that sparked personal growth.',
  'A topic, idea, or concept so engaging that you lose track of time.',
  'Any topic of your choice. Any topic works here.'
];

const Q1 = ['A part of who I am', 'A setback or failure', 'Questioning a belief', 'Gratitude for someone', 'A moment of growth', 'Something I love to learn about', 'Something else'];
const Q2 = ['One moment or scene', 'A few connected moments', 'A long period summarized'];
const Q3 = ['Yes', 'Partly', 'No'];
const Q4 = ['Yes, clearly', 'Somewhat', 'Not yet'];
const Q5 = ['No', 'Big game or performance', 'Service trip', 'Grandparent', 'Job or sport lesson', 'Résumé of activities'];

// question 1 → [strong prompts, possible prompts] (1-based)
const MAP = {
  'A part of who I am': [[1], [5]],
  'A setback or failure': [[2], [5]],
  'Questioning a belief': [[3], []],
  'Gratitude for someone': [[4], []],
  'A moment of growth': [[5], [1, 2]],
  'Something I love to learn about': [[6], [1]],
  'Something else': [[7], []]
};
const COMMON_TIPS = {
  'Big game or performance': 'Readers have seen thousands of winning shots. Focus on an unexpected, specific moment, such as what you noticed on the bench, not the win.',
  'Service trip': 'It can read as "I helped them." Write about something you were wrong about, or choose service close to home.',
  'Grandparent': 'These essays are often more about the grandparent than you. Center a specific thing you learned or do differently because of them.',
  'Job or sport lesson': '"I learned hard work" is predictable. Show one specific skill or insight the reader wouldn\'t expect.',
  'Résumé of activities': 'This repeats your activities list. Choose one activity and go deep.'
};

let topicInput, selects = [], qLabels = [], presetButtons = [];
let cardRects = [];

const PRESETS = [
  { label: 'Ana — reading with my brother', topic: 'Reading with my brother every night', a: [4, 0, 0, 0, 0] },
  { label: 'The big game', topic: 'The championship game', a: [4, 2, 1, 1, 1] },
  { label: 'Translating at the doctor', topic: 'Translating for my parents at the doctor', a: [0, 0, 1, 0, 0] }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  const topicLabel = createSpan('Your topic in a few words:');
  topicInput = createInput('');
  topicInput.attribute('placeholder', 'e.g., teaching my brother to read');
  topicInput.size(240);
  qLabels.push(topicLabel);
  const questions = [
    ['What is the story mostly about?', Q1],
    ['How specific is it?', Q2],
    ['Does it reveal something not elsewhere in my application?', Q3],
    ['Can I say what it means to me?', Q4],
    ['Is it one of the common topics?', Q5]
  ];
  questions.forEach(([q, opts]) => {
    qLabels.push(createSpan(q));
    const s = createSelect();
    opts.forEach(o => s.option(o));
    selects.push(s);
  });
  qLabels.forEach(l => l.style('font-size', '14px'));
  PRESETS.forEach(p => {
    const b = createButton(p.label);
    b.mousePressed(() => {
      topicInput.value(p.topic);
      const lists = [Q1, Q2, Q3, Q4, Q5];
      p.a.forEach((v, i) => selects[i].selected(lists[i][v]));
    });
    presetButtons.push(b);
  });
  // start with a neutral topic description
  selects[0].selected('Something else');
  selects[1].selected('A few connected moments');
  selects[2].selected('Partly');
  selects[3].selected('Somewhat');

  positionControls();
  describe('An essay topic and prompt matcher. Describe a candidate essay topic with five questions. Seven Common App prompt cards light up green for a strong fit or yellow for a possible fit, and a story strength meter rates the topic weak, promising, or strong, with tips for common topics.');
}

const LONG_Q = ['Your topic in a few words:', 'What is the story mostly about?', 'How specific is it?',
  'Does it reveal something not elsewhere in my application?', 'Can I say what it means to me?', 'Is it one of the common topics?'];
const SHORT_Q = ['Topic:', 'Mostly about:', 'How specific:', 'Reveals something new?', 'Can I say what it means?', 'A common topic?'];

function positionControls() {
  const narrow = canvasWidth < 560;
  qLabels.forEach((l, i) => l.html(narrow ? SHORT_Q[i] : LONG_Q[i]));
  topicInput.size(narrow ? canvasWidth - 80 : 240);
  let y = drawHeight + 8;
  y = flowRow([qLabels[0], topicInput], 10, y, 28) + 30;
  for (let i = 0; i < 5; i++) y = flowRow([qLabels[i + 1], selects[i]], 10, y, 26) + 29;
  flowRow(presetButtons, 10, y + 2, 30);
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

function strength() {
  const pts = [2 - Q2.indexOf(selects[1].value()), 2 - Q3.indexOf(selects[2].value()), 2 - Q4.indexOf(selects[3].value())];
  const total = pts.reduce((a, b) => a + b, 0);
  const level = total >= 5 ? 2 : (total >= 2 ? 1 : 0);
  return { total, level, pts };
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
  text('Essay Topic and Prompt Matcher', canvasWidth / 2, 8);
  textSize(13);
  fill('dimgray');
  const topic = topicInput.value().trim();
  text(topic ? 'Topic: "' + topic + '"' : (canvasWidth < 560 ? 'The story comes first, then the prompt.' : 'Describe your topic below. The story comes first, then the prompt.'), 10, 34, canvasWidth - 20);

  const [strong, possible] = MAP[selects[0].value()];
  const cols = canvasWidth >= 640 ? 4 : 2;
  const gap = cols === 4 ? 8 : 5;
  const cw = (canvasWidth - 2 * margin - gap * (cols - 1)) / cols;
  const ch = cols === 4 ? 70 : 36;
  cardRects = [];
  for (let i = 0; i < 7; i++) {
    const n = i + 1;
    const x = margin + (i % cols) * (cw + gap);
    const y = 56 + floor(i / cols) * (ch + gap);
    const isStrong = strong.includes(n);
    const isPossible = possible.includes(n) || (n === 7 && !isStrong);
    stroke(isStrong ? 'seagreen' : (isPossible ? 'goldenrod' : 'silver'));
    strokeWeight(isStrong || isPossible ? 2 : 1);
    fill(isStrong ? 'palegreen' : (isPossible ? 'lightyellow' : 'gainsboro'));
    rect(x, y, cw, ch, 8);
    strokeWeight(1);
    noStroke();
    fill(isStrong || isPossible ? 'black' : 'gray');
    textAlign(LEFT, TOP);
    textSize(cols === 4 ? 13 : 11);
    textStyle(BOLD);
    text(n + (isStrong ? ' · strong' : (isPossible ? ' · possible' : '')), x + 7, y + 4);
    textStyle(NORMAL);
    text(PROMPTS[i], x + 7, y + (cols === 4 ? 22 : 17), cw - 12, ch - 20);
    cardRects.push({ i, x, y, w: cw, h: ch });
  }

  // strength meter
  const st = strength();
  const my = 56 + ceil(7 / cols) * (ch + gap) + 4;
  const names = ['Weak', 'Promising', 'Strong'];
  const cols3 = ['lightcoral', 'gold', 'mediumseagreen'];
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Story strength: ' + names[st.level] + ' (' + st.total + ' / 6)', margin, my);
  textStyle(NORMAL);
  const mw = min(300, canvasWidth - 2 * margin - (canvasWidth >= 640 ? 230 : 0));
  const mx = canvasWidth >= 640 ? margin + 230 : margin;
  const mby = canvasWidth >= 640 ? my : my + 20;
  for (let k = 0; k < 3; k++) {
    stroke(k === st.level ? 'black' : 'white');
    strokeWeight(k === st.level ? 2 : 1);
    fill(cols3[k]);
    rect(mx + k * mw / 3, mby, mw / 3 - 3, 18, 4);
    strokeWeight(1);
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(11);
    text(names[k], mx + k * mw / 3 + mw / 6, mby + 9);
  }

  // tip line
  let tip;
  const common = selects[4].value();
  if (common !== 'No') tip = 'Common topic: ' + COMMON_TIPS[common];
  else if (st.pts[0] < 2) tip = 'Tip: zoom in. One specific moment, told in detail, beats a summary of a long period.';
  else if (st.pts[2] < 2) tip = 'Tip: before drafting, write one sentence about what this story means to you.';
  else if (st.pts[1] < 2) tip = 'Tip: pick an angle that shows something the rest of your application doesn\'t.';
  else tip = 'This story is specific, reveals something new, and you know what it means. Draft it.';
  const ty = mby + 26;
  fill(common !== 'No' ? 'darkorange' : 'navy');
  textAlign(LEFT, TOP);
  textSize(cols === 4 ? 13 : 12);
  text(tip, margin, ty, canvasWidth - 2 * margin, drawHeight - ty - 4);

  // hover help for prompt cards
  const h = cardRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (h) {
    const s = 'Prompt ' + (h.i + 1) + ': ' + PROMPT_LONG[h.i] + ' Read the exact wording on the Common App site.';
    textSize(12);
    const tw = min(320, canvasWidth - 20);
    const tx = constrain(mouseX + 10, 6, canvasWidth - tw - 6);
    const tyy = constrain(mouseY + 14, 6, drawHeight - 70);
    stroke('gray');
    fill('lightyellow');
    rect(tx, tyy, tw, 60, 6);
    noStroke();
    fill('black');
    text(s, tx + 8, tyy + 6, tw - 16, 52);
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
