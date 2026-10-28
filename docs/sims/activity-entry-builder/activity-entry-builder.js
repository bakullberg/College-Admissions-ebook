// Activity Entry Builder
// CANVAS_HEIGHT: 690
// Draft a Common App-style activity entry within the real limits (position 50 characters,
// organization 100, description 150). The reader's view previews the entry; the feedback
// panel checks for an action verb, a number, no "I"/filler, no repeated position text,
// sensible hours, and shows total hours per year (hours per week × weeks per year).

let canvasWidth = 400;
let drawHeight = 300;
let controlHeight = 390;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const TYPES = ['Work (paid)', 'Family responsibilities', 'Community service', 'Athletics', 'Arts', 'Club', 'Research', 'Independent project', 'Other'];
const ACTION_VERBS = ['achieved', 'advised', 'analyzed', 'arranged', 'assembled', 'assisted', 'authored', 'built', 'campaigned', 'captained',
  'cared', 'chaired', 'coached', 'collaborated', 'competed', 'composed', 'conducted', 'cooked', 'coordinated', 'created', 'cut', 'debated',
  'delivered', 'designed', 'developed', 'directed', 'drafted', 'drew', 'earned', 'edited', 'established', 'expanded', 'facilitated',
  'filmed', 'fixed', 'founded', 'fundraised', 'grew', 'guided', 'hosted', 'illustrated', 'improved', 'increased', 'initiated', 'interpreted',
  'interviewed', 'invented', 'launched', 'led', 'maintained', 'managed', 'mentored', 'modeled', 'monitored', 'negotiated', 'operated',
  'organized', 'painted', 'performed', 'photographed', 'planned', 'presented', 'produced', 'programmed', 'published', 'raised', 'ran',
  'recruited', 'redesigned', 'refurbished', 'repaired', 'reported', 'researched', 'restored', 'scheduled', 'served', 'sold', 'solved',
  'spearheaded', 'started', 'supervised', 'taught', 'tested', 'trained', 'translated', 'tutored', 'volunteered', 'wrote', 'won',
  // present-tense forms for ongoing activities
  'build', 'coach', 'cook', 'create', 'design', 'direct', 'edit', 'lead', 'manage', 'mentor', 'organize', 'plan', 'repair', 'run',
  'serve', 'supervise', 'teach', 'train', 'translate', 'tutor', 'write'];
const WEAK_OPENERS = ['was', 'member', 'participated', 'helped', 'involved', 'part', 'did', 'went', 'attended', 'i', 'my', 'a', 'the'];
const NUMBER_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'dozen', 'hundred', 'thousand', 'twenty', 'thirty', 'fifty'];

const PRESETS = {
  'Marcus — restaurant': { type: 'Work (paid)', pos: 'Server and inventory lead (family restaurant)', org: 'Family restaurant',
    desc: 'Trained 2 new servers; built inventory spreadsheet that cut weekly food waste about 20%; work 15 hrs/wk during school year.',
    grades: [10, 11, 12], timing: 'All year', hours: 15, weeks: 48 },
  'Sam — tutoring before': { type: 'Community service', pos: 'Tutor', org: 'Middle school tutoring program',
    desc: 'Helped with tutoring at the middle school.', grades: [11], timing: 'School year', hours: 2, weeks: 30 },
  'Sam — tutoring after': { type: 'Community service', pos: 'Math tutor', org: 'Middle school tutoring program',
    desc: 'Tutored 3 middle schoolers weekly in math; planned practice sets; led pre-test review for 20 students.', grades: [11, 12], timing: 'School year', hours: 2, weeks: 30 },
  'Applicant B — bike shop': { type: 'Community service', pos: 'Volunteer mechanic and Saturday shop lead', org: 'Community bike shop',
    desc: 'Repair and refurbish donated bikes; now help run Saturday shop; about 150 bikes given to kids each year.', grades: [10, 11, 12], timing: 'All year', hours: 8, weeks: 40 }
};

let typeSelect, timingSelect, posInput, orgInput, descInput, hoursInput, weeksInput;
let gradeBoxes = [];
let labels = {};
let counters = {};
let presetButtons = [], copyButton;
let copyMsg = '', copyUntil = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  const lab = (k, t) => { labels[k] = createSpan(t); labels[k].style('font-size', '14px'); return labels[k]; };
  const counter = k => { counters[k] = createSpan(''); counters[k].style('font-size', '13px'); return counters[k]; };

  lab('type', 'Activity type');
  typeSelect = createSelect();
  TYPES.forEach(t => typeSelect.option(t));
  lab('grades', 'Grades');
  [9, 10, 11, 12].forEach(g => gradeBoxes.push(createCheckbox(' ' + g, false)));
  lab('timing', 'Timing');
  timingSelect = createSelect();
  ['School year', 'School break', 'All year'].forEach(t => timingSelect.option(t));

  lab('pos', 'Position or leadership');
  posInput = createInput('');
  counter('pos');
  lab('org', 'Organization');
  orgInput = createInput('');
  counter('org');
  lab('desc', 'Description');
  descInput = createInput('');
  counter('desc');
  lab('hours', 'Hours per week');
  hoursInput = createInput('', 'number');
  hoursInput.size(52);
  lab('weeks', 'Weeks per year');
  weeksInput = createInput('', 'number');
  weeksInput.size(52);

  Object.keys(PRESETS).forEach(k => {
    const b = createButton(k);
    b.mousePressed(() => loadPreset(PRESETS[k]));
    presetButtons.push(b);
  });
  copyButton = createButton('Copy entry text');
  copyButton.mousePressed(copyEntry);

  loadPreset(PRESETS['Sam — tutoring before']);
  positionControls();
  describe('An activity entry builder. Fill in an activity type, position, organization, description, grades, timing, and hours, with live character counters for the Common App limits. A reader\'s view previews the entry and a feedback panel checks for an action verb, numbers, filler, and sensible hours.');
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([labels.type, typeSelect, labels.timing, timingSelect], 10, y, 30) + 32;
  y = flowRow([labels.grades, ...gradeBoxes, labels.hours, hoursInput, labels.weeks, weeksInput], 10, y, 30) + 32;
  const inputW = max(160, canvasWidth - 230);
  posInput.size(min(360, inputW));
  orgInput.size(min(360, inputW));
  descInput.size(canvasWidth - 20);
  y = flowRow([labels.pos, posInput, counters.pos], 10, y, 30) + 32;
  y = flowRow([labels.org, orgInput, counters.org], 10, y, 30) + 32;
  y = flowRow([labels.desc, counters.desc], 10, y, 22) + 22;
  descInput.position(10, y);
  y += 34;
  flowRow([...presetButtons, copyButton], 10, y, 30);
}

// Place controls left to right using their real widths; wrap when the row is full.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style('white-space', 'nowrap');
    c.position(x, y);
    const w = c.elt.offsetWidth || c.cachedWidth || 60;
    c.cachedWidth = w;
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 6;
  }
  return y;
}

function loadPreset(p) {
  typeSelect.selected(p.type);
  posInput.value(p.pos);
  orgInput.value(p.org);
  descInput.value(p.desc);
  gradeBoxes.forEach((b, i) => b.checked(p.grades.includes(9 + i)));
  timingSelect.selected(p.timing);
  hoursInput.value(p.hours);
  weeksInput.value(p.weeks);
}

function entryText() {
  const grades = gradeBoxes.map((b, i) => b.checked() ? 9 + i : null).filter(Boolean).join(', ');
  return typeSelect.value() + '\n' + posInput.value() + ', ' + orgInput.value() + '\n' + descInput.value().slice(0, 150) +
    '\nGrades: ' + (grades || '—') + ' · ' + timingSelect.value() + ' · ' + (hoursInput.value() || 0) + ' hr/wk, ' + (weeksInput.value() || 0) + ' wk/yr';
}

function copyEntry() {
  const t = entryText();
  try {
    navigator.clipboard.writeText(t).then(() => { copyMsg = 'Copied!'; copyUntil = millis() + 1500; },
                                          () => { copyMsg = 'Copy blocked. Select the preview text instead.'; copyUntil = millis() + 2500; });
  } catch (e) {
    copyMsg = 'Copy not available here.';
    copyUntil = millis() + 2500;
  }
}

function checks() {
  const desc = descInput.value().trim();
  const lower = desc.toLowerCase();
  const first = (lower.match(/^[a-z']+/) || [''])[0];
  const pos = posInput.value().trim().toLowerCase();
  const h = parseFloat(hoursInput.value()) || 0, w = parseFloat(weeksInput.value()) || 0;
  // the position repeated as a whole phrase (word boundaries), not just as part of a longer word
  const esc = pos.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const repeats = pos.length >= 4 && new RegExp('\\b' + esc + '\\b').test(lower);
  const hasNumber = /\d/.test(desc) || NUMBER_WORDS.some(n => new RegExp('\\b' + n + '\\b').test(lower));
  const filler = /\bi\b/.test(lower) || /\bmy\b/.test(lower) || lower.includes('was responsible for');
  const verbOK = ACTION_VERBS.includes(first);
  const weak = WEAK_OPENERS.includes(first);
  return [
    { ok: verbOK, text: verbOK ? 'Starts with an action verb ("' + first + '").' :
      (weak ? 'Starts with "' + first + '". Lead with what you did: trained, built, led, organized…' : 'Start with an action verb such as trained, built, led, or organized.') },
    { ok: hasNumber, text: hasNumber ? 'Includes a number.' : 'Add a number: how many people, hours, events, or items?' },
    { ok: !filler, text: !filler ? 'No "I," "my," or filler.' : 'Cut "I," "my," and "was responsible for." Headline style saves space.' },
    { ok: !repeats, text: repeats ? 'The description repeats your position. Use the space for new detail.' : 'Doesn\'t repeat the position.' },
    { ok: h <= 40 && w <= 52, text: (h <= 40 && w <= 52) ? 'Hours look realistic.' : 'Check the hours: more than 40 a week or 52 weeks a year isn\'t possible to average.' },
    { ok: true, info: true, text: 'Total: ' + round(h * w).toLocaleString('en-US') + ' hours per year (' + h + ' × ' + w + ').' }
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
  text('Activity Entry Builder', canvasWidth / 2, 8);

  // live counters
  setCounter('pos', posInput.value().length, 50);
  setCounter('org', orgInput.value().length, 100);
  setCounter('desc', descInput.value().length, 150);

  const wide = canvasWidth >= 640;
  const cardW = wide ? canvasWidth * 0.55 : canvasWidth - 2 * margin;
  drawPreview(margin, 40, cardW, wide ? drawHeight - 50 : 118);
  if (wide) drawFeedback(2 * margin + cardW, 40, canvasWidth - 3 * margin - cardW, drawHeight - 50);
  else drawFeedback(margin, 164, canvasWidth - 2 * margin, drawHeight - 172);

  if (millis() < copyUntil) {
    fill('seagreen');
    textSize(13);
    textAlign(RIGHT, TOP);
    text(copyMsg, canvasWidth - margin, 14);
  }
}

function setCounter(k, n, max) {
  counters[k].html(n + ' / ' + max);
  counters[k].style('color', n > max ? 'red' : (n > max - 10 ? 'darkorange' : 'dimgray'));
  counters[k].style('font-weight', n > max - 10 ? 'bold' : 'normal');
}

function drawPreview(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(11);
  text((w < 520 ? '' : "READER'S VIEW · ") + typeSelect.value().toUpperCase(), x + 10, y + 8);
  const grades = gradeBoxes.map((b, i) => b.checked() ? 9 + i : null).filter(Boolean);
  textAlign(RIGHT, TOP);
  text('Grades ' + (grades.length ? grades.join(', ') : '—') + ' · ' + timingSelect.value(), x + w - 10, y + 8);

  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  const pos = posInput.value().slice(0, 50), org = orgInput.value().slice(0, 100);
  text((pos || 'Position') + (org ? ', ' + org : ''), x + 10, y + 24, w - 20, 36);
  textStyle(NORMAL);

  const desc = descInput.value();
  textSize(13);
  const shown = desc.slice(0, 150);
  const over = desc.slice(150);
  const dy = y + 24 + (textWidth(pos + ', ' + org) > w - 20 ? 38 : 20);
  text(shown || 'Your description appears here.', x + 10, dy, w - 20, h - (dy - y) - 26);
  if (over) {
    fill('red');
    const cut = 'Cut: ' + over;
    text(cut, x + 10, y + h - 40, w - 20, 18);
    stroke('red');
    line(x + 10 + textWidth('Cut: '), y + h - 31, x + 10 + min(textWidth(cut), w - 20), y + h - 31);
    noStroke();
  }
  fill('dimgray');
  textSize(12);
  text((hoursInput.value() || 0) + ' hr/wk · ' + (weeksInput.value() || 0) + ' wk/yr', x + 10, y + h - 20);
}

function drawFeedback(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Feedback', x + 10, y + 6);
  textStyle(NORMAL);
  const list = checks();
  const small = w < 330;
  textSize(small ? 11 : 12);
  let ly = y + 26;
  const lineH = small ? 14 : 15;
  list.forEach(c => {
    fill(c.info ? 'navy' : (c.ok ? 'seagreen' : 'darkorange'));
    const s = (c.info ? '• ' : (c.ok ? '✓ ' : '⚠ ')) + c.text;
    const lines = ceil(textWidth(s) / (w - 20));
    text(s, x + 10, ly, w - 20, lines * lineH + 2);
    ly += lines * lineH + 4;
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
