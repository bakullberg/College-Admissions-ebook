// Personal Essay Structure Explorer
// CANVAS_HEIGHT: 600
// Choose a structure (narrative arc, montage, idea-driven). The 650-word bar is split into the
// structure's parts; click a part to read its job and a sample excerpt. Use the sliders to plan
// your own word budget. The total turns orange over 650 and gray under 500.

let canvasWidth = 400;
let drawHeight = 300;
let controlHeight = 300;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 230;
let defaultTextSize = 16;

const TINTS = ['lightsteelblue', 'thistle', 'navajowhite', 'lightgreen', 'lightpink'];

const STRUCTURES = {
  'Narrative arc': {
    sample: "Ana's essay (Chapter 9)",
    parts: [
      { name: 'Opening scene', words: 100, job: 'Drop the reader into one specific moment, with no throat-clearing.',
        excerpt: 'Every night at 8:30, after the dishes, Mateo and I sat on the kitchen floor with Charlotte\'s Web. He\'d guess at words from the pictures.' },
      { name: 'Story and detail', words: 275, job: 'Tell what happened with concrete detail: the routine, the struggle, the specifics only you know.',
        excerpt: 'I\'d cover the pictures with my hand. He\'d cry. We\'d try again. I noticed he got stuck on the same kinds of words, so I made flash cards on the backs of grocery receipts.' },
      { name: 'The turn', words: 100, job: 'The moment something shifts or becomes clear.',
        excerpt: 'On the eleventh night, he read the book\'s first line, the one about Papa and the ax, without looking up at me.' },
      { name: 'Reflection and ending', words: 175, job: 'Say what it means, reaching beyond the story to who you are now.',
        excerpt: 'Since then I watch for the moment someone stops looking at the page, whether it\'s Mateo, my parents at the doctor\'s office, or the kids I tutor at church. (Sample excerpt.)' }
    ]
  },
  'Montage': {
    sample: 'A short fictional sample',
    parts: [
      { name: 'Opening image', words: 80, job: 'Introduce the thread that ties the scenes together: an object, place, or quality.',
        excerpt: 'The radio in my grandmother\'s kitchen has one working station and a dial held on with tape.' },
      { name: 'Scene 1', words: 140, job: 'A short, specific scene connected by the thread.',
        excerpt: 'At seven, I learned the weather report by heart because she wanted to know if her tomatoes would survive the night.' },
      { name: 'Scene 2', words: 140, job: 'A second scene, often from a different time, that adds something new.',
        excerpt: 'At twelve, I translated a call-in show for her, line by line, and realized she laughed at the jokes before I finished.' },
      { name: 'Scene 3', words: 140, job: 'A third scene that brings the thread to the present.',
        excerpt: 'Last spring I fixed the dial with a part from the hardware store. She switched the station off and asked me to just talk.' },
      { name: 'Connecting reflection', words: 150, job: 'Tie the scenes together and say what the thread means to you.',
        excerpt: 'I used to think the radio was how we passed time. It was how she taught me to listen.' }
    ]
  },
  'Idea-driven': {
    sample: 'A short fictional sample',
    parts: [
      { name: 'The question', words: 90, job: 'Open with a question or idea you genuinely care about.',
        excerpt: 'Why does the bridge on Route 9 hum when trucks cross it, and why does no one else seem to hear it?' },
      { name: 'Example 1', words: 150, job: 'A first example from your life that explores the question.',
        excerpt: 'I spent a summer recording the hum on my phone and graphing it against the traffic counts the city posts online.' },
      { name: 'Example 2', words: 150, job: 'A second example that pushes the idea further.',
        excerpt: 'In physics I learned the word resonance, and suddenly the hum, the school gym floor, and my cello all made sense together.' },
      { name: 'Complication', words: 110, job: 'Where the idea gets harder or your first answer falls short.',
        excerpt: 'Then an engineer told me the hum was normal, and I was disappointed. A solved mystery felt smaller than an open one.' },
      { name: 'What I think now', words: 150, job: 'Where your thinking landed, and why it matters to you.',
        excerpt: 'I\'ve stopped wanting the mystery to stay a mystery. I want to be the person who explains the hum to the next kid who hears it.' }
    ]
  }
};

const PRESETS = {
  "Ana's outline": [100, 275, 100, 175],
  'Too much story': [60, 480, 60, 50],
  'All reflection': [40, 100, 40, 470]
};

let structSelect, structLabel, presetLabel;
let sliders = [];
let presetButtons = [];
let selectedPart = -1;
let presetNote = '';
let segRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  structLabel = createSpan('Structure:');
  structSelect = createSelect();
  Object.keys(STRUCTURES).forEach(k => structSelect.option(k));
  structSelect.changed(loadStructure);
  presetLabel = createSpan('Presets:');
  Object.keys(PRESETS).forEach(k => {
    const b = createButton(k);
    b.mousePressed(() => {
      structSelect.selected('Narrative arc');
      loadStructure();
      PRESETS[k].forEach((v, i) => sliders[i].value(v));
      presetNote = k === 'Too much story' ? 'Reflection is thin.' : (k === 'All reflection' ? 'Ground it in a scene.' : '');
    });
    presetButtons.push(b);
  });
  [structLabel, presetLabel].forEach(s => s.style('font-size', '14px'));
  for (let i = 0; i < 5; i++) {
    const s = createSlider(0, 500, 100, 5);
    s.input(() => { presetNote = ''; });
    sliders.push(s);
  }
  loadStructure();
  describe('A personal essay structure explorer. Choose narrative arc, montage, or idea-driven. A 650-word bar is divided into the structure\'s parts; click a part to read its job and a sample excerpt. Sliders let you plan your own word budget, with a running total.');
}

function parts() {
  return STRUCTURES[structSelect.value()].parts;
}

function loadStructure() {
  selectedPart = -1;
  presetNote = '';
  parts().forEach((p, i) => sliders[i].value(p.words));
  positionControls();
}

function positionControls() {
  let y = drawHeight + 8;
  y = flowRow([structLabel, structSelect, presetLabel, ...presetButtons], 10, y, 30) + 38;
  const n = parts().length;
  sliders.forEach((s, i) => {
    if (i < n) {
      s.show();
      s.position(sliderLeftMargin, y + i * 30);
      s.size(canvasWidth - sliderLeftMargin - margin);
    } else s.hide();
  });
  slidersTop = y;
}
let slidersTop = 0;

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
  text('Personal Essay Structure Explorer', canvasWidth / 2, 8);

  const ps = parts();
  const words = ps.map((p, i) => sliders[i].value());
  const total = words.reduce((a, b) => a + b, 0);

  // 650-word bar (the bar's full width is 650 words; plans over 650 overflow past the marker)
  const bx = margin, bw = canvasWidth - 2 * margin, by = 48, bh = 46;
  const scaleMax = max(650, total);
  stroke('silver');
  fill('white');
  rect(bx, by, bw, bh, 4);
  segRects = [];
  let x = bx;
  const hovered = segAt(mouseX, mouseY);
  ps.forEach((p, i) => {
    const w = bw * words[i] / scaleMax;
    stroke(i === selectedPart ? 'goldenrod' : 'white');
    strokeWeight(i === selectedPart ? 3 : 1);
    fill(TINTS[i]);
    rect(x, by, w, bh);
    strokeWeight(1);
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(w < 80 ? 10 : 12);
    if (w > 34) text(p.name + '\n' + words[i], x + 2, by, w - 4, bh);
    segRects.push({ i, x, w });
    x += w;
  });
  const x650 = bx + bw * 650 / scaleMax;
  stroke(total > 650 ? 'darkorange' : 'dimgray');
  strokeWeight(2);
  line(x650, by - 6, x650, by + bh + 6);
  strokeWeight(1);
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(RIGHT, TOP);
  text('650-word limit', x650 - 2, by + bh + 6);

  // total
  const ty = by + bh + 24;
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  fill(total > 650 ? 'darkorange' : (total < 500 ? 'gray' : 'seagreen'));
  let note = total > 650 ? 'Over the limit — cut' : (total < 500 ? 'Under 500 — is reflection missing?' : 'Within the usual 550–650 range for strong essays');
  if (total >= 500 && total < 550) note = 'A little short; most strong essays use 550–650 words';
  text('Total: ' + total + ' / 650 · ' + note, margin, ty, canvasWidth - 2 * margin);
  textStyle(NORMAL);
  if (presetNote) {
    fill('darkorange');
    textSize(14);
    text('Note: ' + presetNote, margin, ty + 22);
  }

  // infobox
  const iy = ty + (presetNote ? 44 : 30);
  stroke('silver');
  fill('white');
  rect(margin, iy, canvasWidth - 2 * margin, drawHeight - iy - 8, 8);
  noStroke();
  textAlign(LEFT, TOP);
  const show = selectedPart >= 0 ? selectedPart : -1;
  if (show < 0) {
    fill('dimgray');
    textSize(14);
    text('Click a part of the bar to see its job and an excerpt from ' + STRUCTURES[structSelect.value()].sample.toLowerCase() + '.', margin + 10, iy + 10, canvasWidth - 2 * margin - 20);
  } else {
    const p = ps[show];
    fill('darkgoldenrod');
    textSize(15);
    textStyle(BOLD);
    text(p.name + ' — ' + words[show] + ' words (' + round(words[show] / max(1, total) * 100) + '%)', margin + 10, iy + 8, canvasWidth - 2 * margin - 20);
    textStyle(NORMAL);
    fill('black');
    textSize(13);
    text(p.job, margin + 10, iy + 28, canvasWidth - 2 * margin - 20);
    fill('dimgray');
    textStyle(ITALIC);
    text('"' + p.excerpt + '"', margin + 10, iy + 50, canvasWidth - 2 * margin - 20, drawHeight - iy - 60);
    textStyle(NORMAL);
  }

  // hover tip on the bar
  if (hovered >= 0) {
    const s = ps[hovered].name + ': ' + words[hovered] + ' words, ' + round(words[hovered] / max(1, total) * 100) + '% of the essay';
    textSize(12);
    const tw = textWidth(s) + 14;
    const tx = constrain(mouseX + 10, 4, canvasWidth - tw - 4);
    stroke('gray');
    fill('lightyellow');
    rect(tx, by + bh + 4, tw, 20, 4);
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    text(s, tx + 7, by + bh + 14);
  }

  // slider labels
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  ps.forEach((p, i) => text(p.name + ': ' + words[i], 10, slidersTop + i * 30 + 10));
}

function segAt(mx, my) {
  if (my < 48 || my > 94) return -1;
  const s = segRects.find(r => mx > r.x && mx < r.x + r.w);
  return s ? s.i : -1;
}

function mousePressed() {
  const i = segAt(mouseX, mouseY);
  if (i >= 0) selectedPart = i;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  sliderLeftMargin = canvasWidth < 480 ? 210 : 230;
}
