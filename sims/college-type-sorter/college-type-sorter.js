// College Type Sorter
// CANVAS_HEIGHT: 536
// Drag each school card into the 2×2 grid: Public or Private (columns) by Research
// university or Liberal arts college (rows). Correct cards snap in; wrong ones return with
// a hint. After a public research university lands, a Flagship? question appears.
// "Add my own school" places a school from three yes/no answers and shows the reasoning.

let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 96;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// Controls
let resetButton, schoolInput, addButton;
let stateBox, gradBox, undergradBox, placeButton;
let yesButton, noButton;

// fund: 'public' | 'private'; focus: 'research' | 'lac' | 'either'
const deck = [
  { name: 'University of Iowa', fund: 'public', focus: 'research', flagship: true,
    profile: 'Funded partly by the state of Iowa. About 22,000 undergraduates plus law, medical, and doctoral programs. The oldest public university in Iowa.',
    fundClue: 'Funded partly by the state of Iowa → public.', focusClue: 'Law, medical, and doctoral programs → research university.' },
  { name: 'Iowa State University', fund: 'public', focus: 'research', flagship: false,
    profile: 'Funded partly by the state of Iowa. About 26,000 undergraduates and large graduate programs in engineering, agriculture, and science.',
    fundClue: 'Funded partly by the state of Iowa → public.', focusClue: 'Large graduate and research programs → research university.' },
  { name: 'University of Michigan', fund: 'public', focus: 'research', flagship: true,
    profile: 'Funded partly by the state of Michigan. More than 30,000 undergraduates and a huge range of graduate and professional schools.',
    fundClue: 'State of Michigan funding → public.', focusClue: 'Graduate and professional schools → research university.' },
  { name: 'University of Texas at Austin', fund: 'public', focus: 'research', flagship: true,
    profile: 'Funded partly by the state of Texas. Over 40,000 undergraduates and graduate programs in nearly every field.',
    fundClue: 'State of Texas funding → public.', focusClue: 'Graduate programs in nearly every field → research university.' },
  { name: 'Grinnell College', fund: 'private', focus: 'lac', flagship: false,
    profile: 'Privately funded through tuition and a large endowment. About 1,700 students, all undergraduates, in a small Iowa town.',
    fundClue: 'Tuition and endowment, no state funding → private.', focusClue: 'All undergraduates, small classes → liberal arts college.' },
  { name: 'Williams College', fund: 'private', focus: 'lac', flagship: false,
    profile: 'Privately funded. About 2,000 undergraduates in Massachusetts studying the arts, humanities, social sciences, and sciences.',
    fundClue: 'Privately funded → private.', focusClue: 'Undergraduates across the liberal arts → liberal arts college.' },
  { name: 'Pomona College', fund: 'private', focus: 'lac', flagship: false,
    profile: 'Privately funded. About 1,800 undergraduates in California, taught in small classes by professors.',
    fundClue: 'Privately funded → private.', focusClue: 'Small, undergraduate-only, broad curriculum → liberal arts college.' },
  { name: 'Stanford University', fund: 'private', focus: 'research', flagship: false,
    profile: 'Privately funded with a very large endowment. About 7,800 undergraduates and even more graduate students.',
    fundClue: 'No state funding → private.', focusClue: 'More graduate students than undergraduates → research university.' },
  { name: 'Dartmouth College', fund: 'private', focus: 'research', flagship: false,
    profile: 'Privately funded. About 4,500 undergraduates plus graduate schools of medicine, business, and engineering. Its name says "College."',
    fundClue: 'Privately funded → private.', focusClue: 'Graduate schools of medicine, business, and engineering → research university, despite the name "College."' },
  { name: 'University of Chicago', fund: 'private', focus: 'research', flagship: false,
    profile: 'Privately funded. About 7,000 undergraduates and a large set of doctoral and professional programs.',
    fundClue: 'Privately funded → private.', focusClue: 'Doctoral and professional programs → research university.' },
  { name: "St. Mary's College of Maryland", fund: 'public', focus: 'lac', flagship: false,
    profile: 'Funded partly by the state of Maryland. About 1,500 undergraduates in a small liberal arts setting. Maryland\'s public honors college.',
    fundClue: 'State of Maryland funding → public.', focusClue: 'Small, undergraduate liberal arts → liberal arts college. A public liberal arts college is rare, but it exists.' },
  { name: 'University of Northern Iowa', fund: 'public', focus: 'either', flagship: false,
    profile: 'Funded partly by the state of Iowa. About 8,000 undergraduates, mostly in teaching, business, and the arts and sciences, plus some master\'s programs.',
    fundClue: 'Funded partly by the state of Iowa → public.', focusClue: 'UNI is a regional public university: mostly undergraduates, some master\'s programs, little doctoral research. It sits between the two rows, so either Public row counts. It is not the flagship.' }
];

let order = [];          // shuffled indices into deck
let current = 0;         // position in order
let placed = [];         // {name, fund, focus, custom}
let firstTry = 0;
let triedThisCard = false;

let card = { x: 0, y: 0, w: 0, h: 0, homeX: 0, homeY: 0 };
let dragging = false, dragOffX = 0, dragOffY = 0;

let feedback = 'Drag the card into the cell that matches the school.';
let feedbackColor = 'black';
let pendingFlagship = null;   // deck entry waiting on the Flagship? answer
let customMode = false;

let grid = {};                // computed cell geometry

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Reset');
  resetButton.mousePressed(resetDeck);
  schoolInput = createInput('');
  schoolInput.attribute('placeholder', 'Type any school name');
  addButton = createButton('Add my own school');
  addButton.mousePressed(startCustom);

  stateBox = createCheckbox(' State funded?', false);
  gradBox = createCheckbox(' Many graduate programs?', false);
  undergradBox = createCheckbox(' Mainly undergraduates?', false);
  placeButton = createButton('Place it');
  placeButton.mousePressed(placeCustom);

  yesButton = createButton('Yes, a flagship');
  yesButton.mousePressed(() => answerFlagship(true));
  noButton = createButton('No, not the flagship');
  noButton.mousePressed(() => answerFlagship(false));

  positionControls();
  resetDeck();
  describe('A sorting activity. A school card appears at the top. Drag it into a two-by-two grid with columns Public and Private and rows Research university and Liberal arts college. Feedback names the clue that decides each label.');
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 44;
  resetButton.position(10, y1);
  schoolInput.position(75, y1);
  schoolInput.size(max(120, min(240, canvasWidth - 260)));
  addButton.position(75 + schoolInput.width + 12, y1);

  // row 2 holds either the custom-school questions or the flagship answer buttons
  flowRow([stateBox, gradBox, undergradBox, placeButton], 10, y2, 24);
  yesButton.position(10, y2);
  noButton.position(140, y2);
  updateRow2();
}

// Place controls left to right using their real widths; wrap when the row is full.
function flowRow(controls, x0, y, lineH) {
  let x = x0;
  for (const c of controls) {
    c.style("white-space", "nowrap");
    c.position(x, y);  // absolute positioning first, so the width shrinks to fit the label
    const w = c.elt.offsetWidth || c.cachedWidth || 120;
    c.cachedWidth = w;  // hidden controls report 0, so remember the last real width
    if (x > x0 && x + w > canvasWidth - 10) { x = x0; y += lineH; c.position(x, y); }
    x += w + 14;
  }
}

function updateRow2() {
  const showCustom = customMode;
  [stateBox, gradBox, undergradBox, placeButton].forEach(c => showCustom ? c.show() : c.hide());
  const showFlag = pendingFlagship !== null;
  [yesButton, noButton].forEach(c => showFlag ? c.show() : c.hide());
}

function layoutGrid() {
  const top = 168;
  const labelW = canvasWidth < 520 ? 92 : 120;
  const left = margin + labelW;
  const colW = (canvasWidth - left - margin) / 2;
  const headerH = 24;
  const rowH = (drawHeight - 74 - top - headerH) / 2;
  grid = { top: top, left: left, colW: colW, rowH: rowH, headerH: headerH, labelW: labelW };
}

function cellRect(fund, focus) {
  const col = fund === 'public' ? 0 : 1;
  const row = focus === 'research' ? 0 : 1;
  return { x: grid.left + col * grid.colW, y: grid.top + grid.headerH + row * grid.rowH, w: grid.colW, h: grid.rowH };
}

function cellAt(mx, my) {
  for (const fund of ['public', 'private']) {
    for (const focus of ['research', 'lac']) {
      const r = cellRect(fund, focus);
      if (mx > r.x && mx < r.x + r.w && my > r.y && my < r.y + r.h) return { fund, focus };
    }
  }
  return null;
}

function placeCardHome() {
  card.w = min(560, canvasWidth - 2 * margin);
  card.h = 112;
  card.homeX = (canvasWidth - card.w) / 2;
  card.homeY = 44;
  if (!dragging) { card.x = card.homeX; card.y = card.homeY; }
}

function draw() {
  layoutGrid();
  placeCardHome();

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
  text('College Type Sorter', canvasWidth / 2, 10);

  drawGrid();
  drawFeedback();
  drawCard();
}

function drawGrid() {
  // column headers
  noStroke();
  fill('black');
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Public', grid.left + grid.colW / 2, grid.top + grid.headerH / 2);
  text('Private', grid.left + grid.colW * 1.5, grid.top + grid.headerH / 2);
  // row labels
  textAlign(RIGHT, CENTER);
  textSize(canvasWidth < 520 ? 13 : 15);
  text('Research\nuniversity', grid.left - 8, grid.top + grid.headerH + grid.rowH / 2);
  text('Liberal arts\ncollege', grid.left - 8, grid.top + grid.headerH + grid.rowH * 1.5);
  textStyle(NORMAL);

  const hover = dragging ? cellAt(mouseX, mouseY) : null;
  for (const fund of ['public', 'private']) {
    for (const focus of ['research', 'lac']) {
      const r = cellRect(fund, focus);
      const isHover = hover && hover.fund === fund && hover.focus === focus;
      stroke(isHover ? 'goldenrod' : 'silver');
      strokeWeight(isHover ? 3 : 1);
      fill(isHover ? 'lightyellow' : 'white');
      rect(r.x + 3, r.y + 3, r.w - 6, r.h - 6, 8);
      strokeWeight(1);

      const names = placed.filter(p => p.fund === fund && p.focus === focus)
                          .map(p => p.name + (p.custom ? ' (yours)' : ''));
      noStroke();
      textAlign(LEFT, TOP);
      if (fund === 'public' && focus === 'lac' && names.length === 0) {
        fill('gray');
        textSize(14);
        textStyle(ITALIC);
        text('Rare, but it exists', r.x + 10, r.y + 8, r.w - 20);
        textStyle(NORMAL);
      }
      fill('seagreen');
      textSize(13);
      text(names.join(' · '), r.x + 10, r.y + (fund === 'public' && focus === 'lac' && names.length === 0 ? 28 : 8), r.w - 20, r.h - 14);
    }
  }
}

function drawFeedback() {
  const y = drawHeight - 68;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(margin, y, canvasWidth - 2 * margin, 60, 10);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  fill(feedbackColor);
  text(feedback, margin + 10, y + 6, canvasWidth - 2 * margin - 120, 52);
  fill('black');
  textAlign(RIGHT, TOP);
  textSize(15);
  textStyle(BOLD);
  const deckPlaced = placed.filter(p => !p.custom).length;
  text(deckPlaced + ' / 12 placed', canvasWidth - margin - 10, y + 8);
  textStyle(NORMAL);
  textSize(13);
  text(firstTry + ' on first try', canvasWidth - margin - 10, y + 30);
}

function drawCard() {
  if (current >= order.length) {
    noStroke();
    fill('seagreen');
    textAlign(CENTER, CENTER);
    textSize(18);
    text('All 12 schools sorted! Press Reset to shuffle, or add your own school.', margin, 44, canvasWidth - 2 * margin, 112);
    return;
  }
  const c = deck[order[current]];
  stroke(dragging ? 'goldenrod' : 'steelblue');
  strokeWeight(2);
  fill(pendingFlagship ? 'whitesmoke' : 'white');
  rect(card.x, card.y, card.w, card.h, 10);
  strokeWeight(1);
  noStroke();
  fill('navy');
  textAlign(LEFT, TOP);
  textSize(18);
  textStyle(BOLD);
  text(c.name, card.x + 12, card.y + 8, card.w - 24);
  textStyle(NORMAL);
  fill('black');
  textSize(14);
  text(c.profile, card.x + 12, card.y + 34, card.w - 24, card.h - 40);
  if (!dragging && !pendingFlagship) {
    fill('gray');
    textSize(12);
    textAlign(RIGHT, BOTTOM);
    text('drag me ↓', card.x + card.w - 8, card.y + card.h - 4);
  }
}

// ----- interaction -----

function mousePressed() {
  if (pendingFlagship || current >= order.length) return;
  if (mouseX > card.x && mouseX < card.x + card.w && mouseY > card.y && mouseY < card.y + card.h) {
    dragging = true;
    dragOffX = mouseX - card.x;
    dragOffY = mouseY - card.y;
  }
}

function mouseDragged() {
  if (dragging) {
    card.x = mouseX - dragOffX;
    card.y = mouseY - dragOffY;
  }
}

function mouseReleased() {
  if (!dragging) return;
  dragging = false;
  const cell = cellAt(mouseX, mouseY);
  card.x = card.homeX;
  card.y = card.homeY;
  if (!cell) return;
  const c = deck[order[current]];
  const fundOK = cell.fund === c.fund;
  const focusOK = c.focus === 'either' || cell.focus === c.focus;
  if (fundOK && focusOK) {
    if (!triedThisCard) firstTry++;
    placed.push({ name: c.name, fund: cell.fund, focus: cell.focus });
    feedback = '✓ ' + c.fundClue + ' ' + c.focusClue;
    feedbackColor = 'darkgreen';
    if (c.fund === 'public' && c.focus === 'research') {
      pendingFlagship = c;
      feedback += ' Is it its state\'s flagship?';
      updateRow2();
    } else {
      nextCard();
    }
  } else {
    triedThisCard = true;
    feedbackColor = 'firebrick';
    if (!fundOK) feedback = 'Not quite. Hint: look at who pays for the school. Does the profile mention a state?';
    else feedback = 'Funding is right. Hint: look for graduate programs versus an all-undergraduate campus.';
  }
}

function answerFlagship(saidYes) {
  const c = pendingFlagship;
  if (!c) return;
  const right = saidYes === c.flagship;
  feedbackColor = right ? 'darkgreen' : 'firebrick';
  if (c.flagship) {
    feedback = (right ? '✓ Yes. ' : 'Actually, yes. ') + c.name + ' is its state\'s flagship: the best-known, usually oldest public research university.';
  } else {
    feedback = (right ? '✓ Right, not the flagship. ' : 'Actually, no. ') + c.name + ' is a major public research university, but the University of Iowa is Iowa\'s flagship. Every flagship is a public research university, not the reverse.';
  }
  pendingFlagship = null;
  updateRow2();
  nextCard();
}

function nextCard() {
  current++;
  triedThisCard = false;
}

function resetDeck() {
  order = shuffle([...Array(deck.length).keys()]);
  current = 0;
  placed = [];
  firstTry = 0;
  triedThisCard = false;
  pendingFlagship = null;
  customMode = false;
  feedback = 'Drag the card into the cell that matches the school.';
  feedbackColor = 'black';
  updateRow2();
}

function startCustom() {
  const name = schoolInput.value().trim();
  if (!name) {
    feedback = 'Type a school name first, then press Add my own school.';
    feedbackColor = 'firebrick';
    return;
  }
  if (pendingFlagship) {
    feedback = 'Answer the Flagship? question first.';
    feedbackColor = 'firebrick';
    return;
  }
  customMode = true;
  stateBox.checked(false); gradBox.checked(false); undergradBox.checked(false);
  feedback = 'Answer the three questions about ' + name + ' below, then press Place it. Check the school\'s website if you\'re not sure.';
  feedbackColor = 'black';
  updateRow2();
}

function placeCustom() {
  const name = schoolInput.value().trim() || 'Your school';
  const fund = stateBox.checked() ? 'public' : 'private';
  let focus, why;
  if (gradBox.checked()) {
    focus = 'research';
    why = 'many graduate programs → research university';
  } else if (undergradBox.checked()) {
    focus = 'lac';
    why = 'mainly undergraduates without many graduate programs → liberal arts college (or a similar undergraduate-focused school)';
  } else {
    focus = 'research';
    why = 'not mainly undergraduates, so it likely has graduate students → research university';
  }
  placed.push({ name: name, fund: fund, focus: focus, custom: true });
  feedback = name + ': ' + (fund === 'public' ? 'state funded → public' : 'no state funding → private') + '; ' + why + '.';
  feedbackColor = 'navy';
  customMode = false;
  schoolInput.value('');
  updateRow2();
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
