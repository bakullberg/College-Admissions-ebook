// Financial Aid Map
// CANVAS_HEIGHT: 620
// Four sources (federal, state, institutional, private) by four forms (grants, scholarships,
// loans, work-study). Chips are colored by basis: blue need-based, gold merit, blue-and-gold
// either, gray not based on need. Grants and scholarships are gift aid; loans and work-study are
// self-help aid. Click a chip for details; filter buttons narrow the view.

let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

const SOURCES = [
  { name: 'Federal', tip: 'The U.S. Department of Education. Unlocked by the FAFSA.' },
  { name: 'State', tip: 'Your state\'s grant and scholarship programs, usually for in-state colleges.' },
  { name: 'Institutional', tip: 'The college\'s own money, often the largest source at private colleges.' },
  { name: 'Private', tip: 'Community groups, foundations, employers, and lenders.' }
];
const FORMS = ['Grants', 'Scholarships', 'Loans', 'Work-study'];
const BASIS_COLORS = { need: 'steelblue', merit: 'goldenrod', nonneed: 'gray' };

const CHIPS = [
  { name: 'Pell Grant', src: 0, form: 0, basis: 'need', fafsa: true, unlock: 'the FAFSA',
    info: 'The federal government\'s main need-based grant for undergraduates, up to $7,395 a year for 2026–27. It follows you to any eligible college. Never repaid.' },
  { name: 'FSEOG', src: 0, form: 0, basis: 'need', fafsa: true, unlock: 'the FAFSA',
    info: 'The Federal Supplemental Educational Opportunity Grant: a smaller grant for students with exceptional need, awarded by colleges from limited funds, so file early. Never repaid.' },
  { name: 'Direct Subsidized Loan', src: 0, form: 2, basis: 'need', fafsa: true, unlock: 'the FAFSA',
    info: 'A federal loan for students with need. The government pays the interest while you\'re in school. Must be repaid.' },
  { name: 'Direct Unsubsidized Loan', src: 0, form: 2, basis: 'nonneed', fafsa: true, unlock: 'the FAFSA',
    info: 'A federal student loan available regardless of need. Interest builds from the start. Must be repaid.' },
  { name: 'Parent PLUS Loan', src: 0, form: 2, basis: 'nonneed', fafsa: true, unlock: 'the FAFSA plus a separate parent application',
    info: 'A federal loan your parent borrows, based on credit, not need. Your parent must repay it. Borrow with care.' },
  { name: 'Federal Work-Study', src: 0, form: 3, basis: 'need', fafsa: true, unlock: 'the FAFSA',
    info: 'A part-time job, usually on campus, paid as you work. You earn it rather than repay it, but it doesn\'t lower your bill.' },
  { name: 'State need-based grant', src: 1, form: 0, basis: 'need', fafsa: true, unlock: 'the FAFSA (some states add their own form)',
    info: 'Most states use the FAFSA to award need-based grants, sometimes with early deadlines. Never repaid.' },
  { name: 'State merit scholarship', src: 1, form: 1, basis: 'merit', fafsa: false, unlock: 'your grades or scores (check your state\'s rules)',
    info: 'Awarded for grades or test scores to residents attending in-state colleges, usually renewable with a minimum GPA. Never repaid.' },
  { name: 'College need-based grant', src: 2, form: 0, basis: 'need', fafsa: true, unlock: 'the FAFSA, and at some colleges the CSS Profile',
    info: 'The college\'s own grant money, based on your demonstrated need. It\'s often the biggest piece of aid at private colleges. Never repaid.' },
  { name: 'Automatic merit scholarship', src: 2, form: 1, basis: 'merit', fafsa: false, unlock: 'your college application',
    info: 'Awarded automatically from GPA and test scores, often listed on the college\'s website. Never repaid, but check the renewal rules.' },
  { name: 'Local community scholarship', src: 3, form: 1, basis: 'either', fafsa: false, unlock: 'a separate application',
    info: 'From local groups, foundations, and businesses. Some use need, some merit. Each requires its own application. Never repaid.' },
  { name: 'Employer scholarship', src: 3, form: 1, basis: 'either', fafsa: false, unlock: 'a separate application',
    info: 'Offered by a parent\'s employer or your own. Criteria vary. Never repaid.' },
  { name: 'Private bank loan', src: 3, form: 2, basis: 'nonneed', fafsa: false, unlock: 'a separate application, usually with a cosigner',
    info: 'A loan from a bank or private lender, usually requiring a cosigner and offering fewer protections than federal loans. A last resort. Must be repaid.' }
];

let filterButtons = [];
let filter = 'all';
let selected = null;
let chipRects = [];
let headRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  [['Show only gift aid', 'gift'], ['Show only need-based', 'need'], ['Show only what the FAFSA unlocks', 'fafsa'], ['Show all', 'all']].forEach(([label, key]) => {
    const b = createButton(label);
    b.mousePressed(() => { filter = key; styleButtons(); });
    b.key = key;
    filterButtons.push(b);
  });
  styleButtons();
  positionControls();
  describe('A financial aid map: a grid of four aid sources (federal, state, institutional, private) by four forms (grants, scholarships, loans, work-study), with chips for real examples colored by need-based, merit, or not need-based. Click a chip to learn what it is, what unlocks it, and whether it is repaid.');
}

function styleButtons() {
  filterButtons.forEach(b => b.style('font-weight', b.key === filter ? 'bold' : 'normal'));
}

function positionControls() {
  let x = 10, y = drawHeight + 10;
  filterButtons.forEach(b => {
    b.style('white-space', 'nowrap');
    b.position(x, y);
    const w = b.elt.offsetWidth || 120;
    if (x > 10 && x + w > canvasWidth - 10) { x = 10; y += 30; b.position(x, y); }
    x += w + 6;
  });
}

function passes(c) {
  if (filter === 'gift') return c.form <= 1;
  if (filter === 'need') return c.basis === 'need' || c.basis === 'either';
  if (filter === 'fafsa') return c.fafsa;
  return true;
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
  text('Financial Aid Map', canvasWidth / 2, 8);

  chipRects = [];
  headRects = [];
  let bottom;
  if (canvasWidth >= 680) bottom = drawGrid();
  else bottom = drawCards();
  drawLegend(bottom + 6);
  drawInfo(bottom + 30);
  drawHeadTip();
}

function chip(c, x, y, maxW) {
  textSize(11);
  const w = min(maxW, textWidth(c.name) + 14);
  const h = 20;
  const on = passes(c);
  const sel = selected === c;
  if (c.basis === 'either') {
    // half blue, half gold
    noStroke();
    fill(on ? 'steelblue' : 'gainsboro');
    rect(x, y, w / 2, h, 10, 0, 0, 10);
    fill(on ? 'goldenrod' : 'gainsboro');
    rect(x + w / 2, y, w / 2, h, 0, 10, 10, 0);
  } else {
    noStroke();
    fill(on ? BASIS_COLORS[c.basis] : 'gainsboro');
    rect(x, y, w, h, 10);
  }
  if (sel) { noFill(); stroke('black'); strokeWeight(2); rect(x - 1, y - 1, w + 2, h + 2, 11); strokeWeight(1); }
  noStroke();
  fill(on ? 'white' : 'darkgray');
  textAlign(CENTER, CENTER);
  let label = c.name;
  while (textWidth(label) > w - 10 && label.length > 4) label = label.slice(0, -2);
  if (label !== c.name) label += '…';
  text(label, x + w / 2, y + h / 2);
  chipRects.push({ c, x, y, w, h });
  return w;
}

function drawGrid() {
  const labelW = 120, top = 40, headH = 26;
  const colW = (canvasWidth - labelW - margin) / 4;
  const rowH = 80;
  SOURCES.forEach((s, i) => {
    const x = labelW + i * colW;
    noStroke();
    fill('navy');
    rect(x + 2, top, colW - 4, headH, 5, 5, 0, 0);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(s.name, x + colW / 2, top + headH / 2);
    textStyle(NORMAL);
    headRects.push({ i, x: x + 2, y: top, w: colW - 4, h: headH });
  });
  FORMS.forEach((f, r) => {
    const y = top + headH + 4 + r * rowH;
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(f, 34, y + rowH / 2);
    textStyle(NORMAL);
    SOURCES.forEach((s, i) => {
      const x = labelW + i * colW;
      stroke('gainsboro');
      fill('white');
      rect(x + 2, y, colW - 4, rowH - 4, 4);
      let cx = x + 7, cy = y + 6;
      CHIPS.filter(c => c.src === i && c.form === r).forEach(c => {
        textSize(11);
        const w = min(colW - 14, textWidth(c.name) + 14);
        if (cx + w > x + colW - 5) { cx = x + 7; cy += 24; }
        chip(c, cx, cy, colW - 14);
        cx += w + 4;
      });
    });
  });
  // gift / self-help brackets
  const gTop = top + headH + 4, mid = gTop + 2 * rowH, end = gTop + 4 * rowH - 4;
  stroke('seagreen'); strokeWeight(2);
  line(14, gTop + 4, 14, mid - 8);
  stroke('darkorange');
  line(14, mid + 4, 14, end - 4);
  strokeWeight(1);
  noStroke();
  push();
  translate(8, (gTop + mid) / 2);
  rotate(-HALF_PI);
  fill('seagreen');
  textAlign(CENTER, CENTER);
  textSize(11);
  text('Gift aid — don\'t repay', 0, 0);
  pop();
  push();
  translate(8, (mid + end) / 2);
  rotate(-HALF_PI);
  fill('darkorange');
  textAlign(CENTER, CENTER);
  textSize(11);
  text('Self-help aid', 0, 0);
  pop();
  return end;
}

function drawCards() {
  let y = 40;
  SOURCES.forEach((s, i) => {
    const chips = CHIPS.filter(c => c.src === i);
    noStroke();
    fill('navy');
    rect(margin, y, canvasWidth - 2 * margin, 22, 5, 5, 0, 0);
    fill('white');
    textAlign(LEFT, CENTER);
    textSize(13);
    textStyle(BOLD);
    text(s.name, margin + 8, y + 11);
    textStyle(NORMAL);
    headRects.push({ i, x: margin, y, w: canvasWidth - 2 * margin, h: 22 });
    y += 26;
    let cx = margin + 4;
    chips.forEach(c => {
      textSize(11);
      const label = c.name + ' · ' + FORMS[c.form].replace(/s$/, '');
      const w = min(canvasWidth - 2 * margin - 8, textWidth(c.name) + 14);
      if (cx + w > canvasWidth - margin) { cx = margin + 4; y += 24; }
      chip(c, cx, y, canvasWidth - 2 * margin - 8);
      cx += w + 4;
    });
    y += 30;
  });
  return y - 6;
}

function drawLegend(y) {
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(11);
  const items = [['steelblue', 'Need-based'], ['goldenrod', 'Merit'], ['either', 'Either'], ['gray', 'Not based on need (loans)']];
  let x = margin + 4;
  items.forEach(([c, label]) => {
    if (c === 'either') { fill('steelblue'); rect(x, y, 6, 12, 3, 0, 0, 3); fill('goldenrod'); rect(x + 6, y, 6, 12, 0, 3, 3, 0); }
    else { fill(c); rect(x, y, 12, 12, 3); }
    fill('black');
    text(label, x + 16, y + 6);
    x += textWidth(label) + 34;
  });
  if (canvasWidth < 680) {
    fill('dimgray');
    text('Gift aid = grants and scholarships. Self-help = loans and work-study.', margin + 4, y + 20);
  }
}

function drawInfo(y) {
  const top = canvasWidth < 680 ? y + 12 : y;
  const h = drawHeight - top - 8;
  stroke('silver');
  fill('white');
  rect(margin, top, canvasWidth - 2 * margin, h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  if (!selected) {
    fill('dimgray');
    textSize(14);
    text('Click any chip to see what it is, what unlocks it, and whether it must be repaid.', margin + 10, top + 10, canvasWidth - 2 * margin - 20);
    return;
  }
  const c = selected;
  fill('navy');
  textSize(15);
  textStyle(BOLD);
  text(c.name + ' · ' + SOURCES[c.src].name + ' ' + FORMS[c.form].toLowerCase().replace(/s$/, ''), margin + 10, top + 8, canvasWidth - 2 * margin - 20);
  textStyle(NORMAL);
  fill('black');
  textSize(13);
  text(c.info + ' Unlocked by ' + c.unlock + '.', margin + 10, top + 30, canvasWidth - 2 * margin - 20, h - 36);
}

function drawHeadTip() {
  const h = headRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (!h) return;
  const s = SOURCES[h.i].tip;
  textSize(12);
  const tw = min(textWidth(s) + 14, canvasWidth - 20);
  const tx = constrain(mouseX - tw / 2, 4, canvasWidth - tw - 4);
  stroke('gray');
  fill('lightyellow');
  rect(tx, h.y + h.h + 2, tw, 20, 4);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(s, tx + 7, h.y + h.h + 12);
}

function mousePressed() {
  const c = chipRects.find(r => mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h);
  if (c) selected = c.c;
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
