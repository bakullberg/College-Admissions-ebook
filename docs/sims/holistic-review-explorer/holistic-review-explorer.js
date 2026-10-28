// Holistic Review Explorer
// CANVAS_HEIGHT: 560
// A simplified model of a first reader's rating sheet (1 = exceptional ... 5 = weak):
//   Academic   = the applicant's record in context (one step weaker for a small-school
//                applicant if the reader lacks the school profile)
//   Activities = depth select (5 / 3 / 2), adjusted by the applicant's file
//   Personal   = average of essay specificity and recommendation detail, rounded toward stronger
// The three ratings are never added together.

let canvasWidth = 400;
let drawHeight = 370;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let margin = 14;
let defaultTextSize = 16;

let aButton, bButton, danaButton, presetLabel;
let actLabel, actSelect, essayLabel, essaySelect, recLabel, recSelect, profileBox;

const ACT = ['Many short-term clubs', 'A few long-term commitments', 'Long-term commitment with leadership or a job'];
const ACT_RATING = [5, 3, 2];
const ESSAY = ['General', 'Specific', 'Specific and reflective'];
const ESSAY_RATING = [4, 3, 1];
const REC = ['Brief and generic', 'Detailed with examples'];
const REC_RATING = [4, 2];

const levelText = {
  1: '1 — exceptional: among the very best in the pool',
  2: '2 — strong: stands out at most schools',
  3: '3 — good: solid, typical of admitted students',
  4: '4 — fair: some strengths, some concerns',
  5: '5 — weak: little evidence in the file'
};

const applicants = {
  'Applicant A': {
    academic: 2, smallSchool: false, actAdjust: -1, defaults: [0, 0, 0],
    adjustNote: 'Ten clubs show curiosity, so the reader softens the rating by one step.',
    tabs: {
      Academics: 'Strong grades (about 3.7 unweighted) in a demanding schedule for the school.',
      Context: 'Mid-sized suburban public high school with a detailed school profile.'
    }
  },
  'Applicant B': {
    academic: 2, smallSchool: false, actAdjust: 0, defaults: [2, 2, 1],
    adjustNote: '',
    tabs: {
      Academics: 'Strong grades (about 3.7 unweighted) in a demanding schedule for the school, the same academic picture as Applicant A.',
      Context: 'Mid-sized suburban public high school with a detailed school profile.'
    }
  },
  'Dana': {
    academic: 2, smallSchool: true, actAdjust: 1, defaults: [2, 2, 1],
    adjustNote: 'One serious commitment, but only one, so the reader rates it a step lower.',
    tabs: {
      Academics: 'A/A- record. Took all 3 AP courses her school offers, plus dual-enrollment calculus at the community college.',
      Context: 'Small rural high school offering 3 AP courses. The school profile shows that 3 of 3 is the maximum.'
    }
  }
};

// Descriptions of the parts of a file that change with the selects
const actText = {
  'Applicant A': ['Ten clubs, each for a year or less, with no leadership.', 'A few clubs kept up for several years.', 'A long-running commitment with real responsibility.'],
  'Applicant B': ['A list of short-term clubs.', 'Three years building and repairing bikes for a community shop, plus a part-time job.', 'Three years at a community bike shop, which they now help run, plus a part-time job.'],
  'Dana': ['A list of short-term clubs.', 'A few long-term activities.', 'Works 15 hours a week at the family hardware store.']
};
const essayText = {
  'Applicant A': ['Recounts a service trip in general terms.', 'Describes one specific moment on the service trip.', 'Describes one moment on the trip and what it changed in how they think.'],
  'Applicant B': ['A general essay about volunteering.', 'Describes teaching a younger kid to true a bike wheel.', 'Describes teaching a younger kid to true a wheel, and what it taught them about patience.'],
  'Dana': ['A general essay about hard work.', 'Describes running the store for a week.', 'Describes running the store during a parent\'s surgery, specific and mature.']
};
const recText = {
  'Applicant A': ['Positive but brief teacher letters.', 'Letters with concrete classroom examples.'],
  'Applicant B': ['Positive but brief letters.', 'A teacher describes them as the student who stays after class to help classmates who are stuck.'],
  'Dana': ['Positive but brief letters.', 'Teachers describe her as the student who asks the second question.']
};

const TABS = ['Academics', 'Activities', 'Essay', 'Recommendations', 'Context'];
let current = 'Applicant A';
let activeTab = 'Academics';
let ratings = { Academic: 2, Activities: 4, Personal: 4 };
let flash = { name: null, until: 0 };
let tabRects = [];
let boxRects = [];   // { rating, level, x, y, w, h }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  presetLabel = createSpan('Applicant:');
  aButton = createButton('Applicant A');
  aButton.mousePressed(() => loadApplicant('Applicant A'));
  bButton = createButton('Applicant B');
  bButton.mousePressed(() => loadApplicant('Applicant B'));
  danaButton = createButton('Dana');
  danaButton.mousePressed(() => loadApplicant('Dana'));

  actLabel = createSpan('Activities depth:');
  actSelect = makeSelect(ACT);
  essayLabel = createSpan('Essay specificity:');
  essaySelect = makeSelect(ESSAY);
  recLabel = createSpan('Recommendation detail:');
  recSelect = makeSelect(REC);
  profileBox = createCheckbox(' Reader has the school profile', true);
  profileBox.changed(recompute);
  [presetLabel, actLabel, essayLabel, recLabel].forEach(s => s.style('font-size', '15px'));

  positionControls();
  loadApplicant('Applicant A');
  describe('A holistic review explorer. An application folder with five tabs describes an applicant. A reader rating sheet shows Academic, Activities, and Personal ratings from 1 (exceptional) to 5 (weak). Dropdowns change one part of the file at a time, and a checkbox removes the school profile.');
}

function makeSelect(options) {
  const s = createSelect();
  options.forEach(o => s.option(o));
  s.changed(recompute);
  return s;
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([presetLabel, aButton, bButton, danaButton], 10, y, 30) + 34;
  y = flowRow([actLabel, actSelect], 10, y, 30) + 32;
  if (canvasWidth >= 720) {
    y = flowRow([essayLabel, essaySelect, recLabel, recSelect], 10, y, 30) + 32;
  } else {
    y = flowRow([essayLabel, essaySelect], 10, y, 30) + 32;
    y = flowRow([recLabel, recSelect], 10, y, 30) + 32;
  }
  flowRow([profileBox], 10, y, 30);
}

// Place controls left to right using their real widths; wrap when the row is full.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style('white-space', 'nowrap');
    c.position(x, y);
    const w = c.elt.offsetWidth || c.cachedWidth || 120;
    c.cachedWidth = w;
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 8;
  }
  return y;
}

function loadApplicant(name) {
  current = name;
  const d = applicants[name].defaults;
  actSelect.selected(ACT[d[0]]);
  essaySelect.selected(ESSAY[d[1]]);
  recSelect.selected(REC[d[2]]);
  profileBox.checked(true);
  [aButton, bButton, danaButton].forEach(b => b.style('font-weight', 'normal'));
  ({ 'Applicant A': aButton, 'Applicant B': bButton, 'Dana': danaButton })[name].style('font-weight', 'bold');
  recompute(true);
}

function recompute(silent) {
  const app = applicants[current];
  const act = ACT.indexOf(actSelect.value());
  const essay = ESSAY.indexOf(essaySelect.value());
  const rec = REC.indexOf(recSelect.value());

  let academic = app.academic;
  if (app.smallSchool && !profileBox.checked()) academic = min(5, academic + 1);
  const activities = constrain(ACT_RATING[act] + app.actAdjust, 1, 5);
  const personal = floor((ESSAY_RATING[essay] + REC_RATING[rec]) / 2);

  const next = { Academic: academic, Activities: activities, Personal: personal };
  if (silent !== true) {
    for (const k in next) {
      if (next[k] !== ratings[k]) flash = { name: k, until: millis() + 1200 };
    }
  }
  ratings = next;
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
  text('Holistic Review Explorer', canvasWidth / 2, 8);

  const wide = canvasWidth >= 680;
  if (wide) {
    const fw = canvasWidth * 0.52;
    drawFolder(margin, 42, fw, drawHeight - 52);
    drawSheet(margin * 2 + fw, 42, canvasWidth - fw - 3 * margin, drawHeight - 52);
  } else {
    drawFolder(margin, 40, canvasWidth - 2 * margin, 140);
    drawSheet(margin, 188, canvasWidth - 2 * margin, drawHeight - 196);
  }
}

function tabText(tab) {
  const app = applicants[current];
  const act = ACT.indexOf(actSelect.value());
  const essay = ESSAY.indexOf(essaySelect.value());
  const rec = REC.indexOf(recSelect.value());
  if (tab === 'Academics') return app.tabs.Academics;
  if (tab === 'Activities') return actText[current][act];
  if (tab === 'Essay') return essayText[current][essay];
  if (tab === 'Recommendations') return recText[current][rec];
  if (!profileBox.checked()) return 'The reader does not have the school profile, so they can\'t tell how many advanced courses the school offers.';
  return app.tabs.Context;
}

function drawFolder(x, y, w, h) {
  // tabs
  tabRects = [];
  const tabH = 26;
  const short = { Recommendations: w < 420 ? 'Recs' : 'Recommendations', Academics: 'Academics', Activities: 'Activities', Essay: 'Essay', Context: 'Context' };
  const tabColors = ['lightsteelblue', 'thistle', 'navajowhite', 'lightgreen', 'lightpink'];
  let tx = x + 8;
  textSize(13);
  TABS.forEach((t, i) => {
    const tw = textWidth(short[t]) + 16;
    tabRects.push({ tab: t, x: tx, y: y, w: tw, h: tabH });
    noStroke();
    fill(tabColors[i]);
    rect(tx, y + (t === activeTab ? 0 : 4), tw, tabH, 6, 6, 0, 0);
    fill('black');
    textAlign(CENTER, CENTER);
    textStyle(t === activeTab ? BOLD : NORMAL);
    text(short[t], tx + tw / 2, y + tabH / 2 + 2);
    tx += tw + 3;
  });
  textStyle(NORMAL);

  const i = TABS.indexOf(activeTab);
  stroke('silver');
  fill(tabColors[i]);
  rect(x, y + tabH, w, h - tabH, 0, 8, 8, 8);
  noStroke();
  fill('white');
  rect(x + 8, y + tabH + 8, w - 16, h - tabH - 16, 6);
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text(current + ': ' + activeTab, x + 18, y + tabH + 16, w - 36);
  textStyle(NORMAL);
  textSize(w < 420 ? 13 : 15);
  text(tabText(activeTab), x + 18, y + tabH + 40, w - 36, h - tabH - 56);
}

function drawSheet(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text("Reader's rating sheet", x + 10, y + 8);
  textStyle(NORMAL);
  textSize(11);
  fill('dimgray');
  text('1 = exceptional · 5 = weak', x + 10, y + 27);

  boxRects = [];
  const names = ['Academic', 'Activities', 'Personal'];
  const labelW = 74;
  const boxW = min(34, (w - labelW - 30) / 5);
  const rowGap = canvasWidth >= 680 ? 40 : 30;
  names.forEach((n, r) => {
    const ry = y + 46 + r * rowGap;
    const flashing = flash.name === n && millis() < flash.until;
    noStroke();
    fill('black');
    textSize(14);
    textAlign(LEFT, CENTER);
    text(n, x + 10, ry + boxW / 2 - 2);
    for (let lvl = 1; lvl <= 5; lvl++) {
      const bx = x + 10 + labelW + (lvl - 1) * (boxW + 4);
      const filled = ratings[n] === lvl;
      stroke(filled && flashing ? 'gold' : 'steelblue');
      strokeWeight(filled && flashing ? 3 : 1);
      fill(filled ? 'royalblue' : 'white');
      rect(bx, ry - 2, boxW, boxW - 6, 4);
      strokeWeight(1);
      noStroke();
      fill(filled ? 'white' : 'steelblue');
      textAlign(CENTER, CENTER);
      textSize(13);
      text(lvl, bx + boxW / 2, ry - 2 + (boxW - 6) / 2);
      boxRects.push({ level: lvl, x: bx, y: ry - 2, w: boxW, h: boxW - 6 });
    }
  });

  // summary or hover text
  const sy = y + 46 + 3 * rowGap;
  const hover = boxRects.find(b => mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  if (hover) {
    fill('navy');
    text(levelText[hover.level], x + 10, sy, w - 20, h - (sy - y) - 6);
    return;
  }
  const best = names.reduce((a, b) => ratings[b] < ratings[a] ? b : a);
  const app = applicants[current];
  let summary = 'Strongest area: ' + best + ' (' + ratings[best] + '). The ratings are read side by side, never added into a total.';
  if (app.smallSchool && !profileBox.checked()) {
    summary += ' Without the profile, the reader can\'t see that 3 APs is the maximum, so Academic slips a step. Context matters.';
  } else if (app.adjustNote && ACT.indexOf(actSelect.value()) === app.defaults[0]) {
    summary += ' ' + app.adjustNote;
  }
  fill('black');
  text(summary, x + 10, sy, w - 20, h - (sy - y) - 6);
}

function mousePressed() {
  for (const t of tabRects) {
    if (mouseX > t.x && mouseX < t.x + t.w && mouseY > t.y && mouseY < t.y + t.h) activeTab = t.tab;
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
