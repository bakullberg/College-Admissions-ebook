// Rigor in Context
// CANVAS_HEIGHT: 495
// Course rigor is judged against what a high school offers. This illustrative model rates
// a schedule by the share of available advanced courses taken:
//   ≥ 80% Most demanding · 55–79% Very demanding · 30–54% Demanding · 10–29% Average · < 10% Less than demanding
// Real counselors also weigh subjects and grade levels; the model uses the share alone.

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 14;
let sliderLeftMargin = 260;
let defaultTextSize = 16;

let offeredSlider, takenSlider;
let elenaButton, jordanButton, priyaButton;
let presetNote = '';

const bands = [
  { name: 'Less than demanding', min: 0, color: 'gainsboro',
    tip: 'Took few of the advanced courses available. A reader may wonder why.' },
  { name: 'Average', min: 10, color: 'honeydew',
    tip: 'A typical schedule for the school: solid, but not stretching.' },
  { name: 'Demanding', min: 30, color: 'palegreen',
    tip: 'Took a good share of the hardest courses available.' },
  { name: 'Very demanding', min: 55, color: 'mediumseagreen',
    tip: 'Took most of the hardest courses available, a strong signal.' },
  { name: 'Most demanding', min: 80, color: 'seagreen',
    tip: 'Took nearly every advanced course the school offers. The top counselor rating.' }
];

let gauge = { x: 0, y: 0, w: 0, h: 0 };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  offeredSlider = createSlider(0, 30, 12, 1);
  offeredSlider.input(() => { presetNote = ''; syncTakenMax(); });
  takenSlider = createSlider(0, 12, 4, 1);
  takenSlider.input(() => { presetNote = ''; });

  elenaButton = createButton('Elena');
  elenaButton.mousePressed(() => preset(3, 3, 'Elena\'s small rural school offers 3 AP courses. She took all 3.'));
  jordanButton = createButton('Jordan');
  jordanButton.mousePressed(() => preset(22, 3, 'Jordan took 3 of 22. Jordan\'s counselor checked "demanding" because Jordan also took honors courses, which this share-only model can\'t see.'));
  priyaButton = createButton('Priya');
  priyaButton.mousePressed(() => preset(12, 7, 'Priya took 7 of her school\'s 12 APs across junior and senior years.'));

  positionControls();
  describe('A rigor-in-context model. Sliders set how many advanced courses a high school offers and how many a student took. Course tiles, a share bar, and a five-band counselor rating gauge show how a reader sees that schedule relative to the school.');
}

function positionControls() {
  offeredSlider.position(sliderLeftMargin, drawHeight + 8);
  offeredSlider.size(canvasWidth - sliderLeftMargin - margin);
  takenSlider.position(sliderLeftMargin, drawHeight + 43);
  takenSlider.size(canvasWidth - sliderLeftMargin - margin);
  elenaButton.position(10, drawHeight + 80);
  jordanButton.position(80, drawHeight + 80);
  priyaButton.position(160, drawHeight + 80);
}

// The student can't take more advanced courses than the school offers
function syncTakenMax() {
  const offered = offeredSlider.value();
  takenSlider.elt.max = offered;
  if (takenSlider.value() > offered) takenSlider.value(offered);
}

function preset(offered, taken, note) {
  offeredSlider.value(offered);
  syncTakenMax();
  takenSlider.value(taken);
  presetNote = note;
}

function bandFor(share) {
  let b = bands[0];
  for (const band of bands) if (share >= band.min) b = band;
  return b;
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
  text('Rigor in Context', canvasWidth / 2, 8);

  const offered = offeredSlider.value();
  const taken = min(takenSlider.value(), offered);

  // Two tile panels side by side
  const pw = (canvasWidth - 3 * margin) / 2;
  const ph = 168;
  drawTilePanel(margin, 40, pw, ph, 'The high school', offered + ' advanced course' + (offered === 1 ? '' : 's') + ' offered', offered, -1);
  drawTilePanel(2 * margin + pw, 40, pw, ph, "The student's schedule", taken + ' taken', offered, taken);

  drawReaderPanel(margin, 40 + ph + 10, canvasWidth - 2 * margin, drawHeight - (40 + ph + 10) - 10, offered, taken);

  // control labels
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Advanced courses offered: ' + offered, 10, drawHeight + 18);
  text('Advanced courses taken: ' + taken, 10, drawHeight + 53);
  textSize(14);
  fill('dimgray');
  text('Presets from the chapter', 240, drawHeight + 91);
}

// Draw a grid of course tiles. takenCount < 0 means "show the school's offerings."
function drawTilePanel(x, y, w, h, title, sub, offered, takenCount) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text(title, x + 10, y + 8, w - 20);
  textStyle(NORMAL);
  textSize(13);
  fill('dimgray');
  text(sub, x + 10, y + 28, w - 20);

  const cols = 6;
  const gap = 4;
  const tile = min(20, (w - 20 - gap * (cols - 1)) / cols);
  const gx = x + 10, gy = y + 50;
  for (let i = 0; i < 30; i++) {
    const tx = gx + (i % cols) * (tile + gap);
    const ty = gy + floor(i / cols) * (tile + gap);
    if (i >= offered) {
      // not offered at this school
      stroke('gainsboro');
      noFill();
      rect(tx, ty, tile, tile, 3);
      continue;
    }
    noStroke();
    if (takenCount < 0) fill('darkgray');
    else fill(i < takenCount ? 'royalblue' : 'lightgray');
    rect(tx, ty, tile, tile, 3);
  }
  if (offered === 0) {
    noStroke();
    fill('dimgray');
    textSize(13);
    textAlign(CENTER, CENTER);
    text('No advanced courses offered', x + 10, gy, w - 20, 5 * (tile + gap));
  }
}

function drawReaderPanel(x, y, w, h, offered, taken) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text('How a reader sees it', x + 10, y + 8);
  textStyle(NORMAL);

  if (offered === 0) {
    fill('darkslategray');
    textSize(15);
    text('No advanced courses offered: readers look at core-course completion and grades instead.', x + 10, y + 36, w - 20, 60);
    gauge.w = 0;
    return;
  }

  const share = taken / offered * 100;
  const band = bandFor(share);

  // share bar
  const bx = x + 10, by = y + 34, bw = w - 20;
  textSize(13);
  fill('black');
  text('Share of available advanced courses taken: ' + taken + ' ÷ ' + offered + ' = ' + round(share) + '%', bx, by);
  fill('gainsboro');
  rect(bx, by + 18, bw, 12, 4);
  fill('royalblue');
  rect(bx, by + 18, bw * share / 100, 12, 4);

  // five-band gauge
  gauge = { x: bx, y: by + 40, w: bw, h: 24 };
  const segW = bw / bands.length;
  const hovered = gaugeBandAt(mouseX, mouseY);
  bands.forEach((b, i) => {
    const sx = bx + i * segW;
    const active = b === band;
    stroke(active ? 'goldenrod' : 'white');
    strokeWeight(active ? 3 : 1);
    fill(b.color);
    rect(sx + 1, gauge.y, segW - 2, gauge.h, 4);
    strokeWeight(1);
    noStroke();
    fill(i >= 3 ? 'white' : 'black');
    textAlign(CENTER, CENTER);
    textSize(canvasWidth < 560 ? 10 : 12);
    text(b.name, sx + 3, gauge.y, segW - 6, gauge.h);
  });

  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  if (hovered >= 0) {
    fill('navy');
    text(bands[hovered].name + ': ' + bands[hovered].tip, bx, gauge.y + 30, bw, 34);
  } else if (presetNote) {
    fill('darkslategray');
    text(presetNote, bx, gauge.y + 30, bw, 34);
  } else {
    fill('dimgray');
    text('Rating: ' + band.name + '. Real counselors also consider which subjects and grade levels the courses fall in; this model uses the share alone.', bx, gauge.y + 30, bw, 34);
  }
}

function gaugeBandAt(mx, my) {
  if (!gauge.w || my < gauge.y || my > gauge.y + gauge.h || mx < gauge.x || mx > gauge.x + gauge.w) return -1;
  return floor((mx - gauge.x) / (gauge.w / bands.length));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  sliderLeftMargin = canvasWidth < 480 ? 236 : 260;
}
