let myData;
let creatures = []; 
let isDataLoaded = false;
let dataPool = [];  
let btn;            

const backupData = [
  { "name": "Na (Mosuo)", "vitality": 85 },
  { "name": "Lazé", "vitality": 42 },
  { "name": "Khaling", "vitality": 67 },
  { "name": "Japhug", "vitality": 93 },
  { "name": "Corpora", "vitality": 47 }
];

function preload() {
  myData = loadJSON('data.json', () => { isDataLoaded = true; }, () => { isDataLoaded = false; });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  let rawData = (isDataLoaded && Object.keys(myData).length > 0) ? Object.values(myData) : [];
  dataPool = rawData.concat(backupData);

  // --- 按钮文字已改为纯英文 ---
  btn = createButton('Discover Language Cloud');
  btn.position(30, 30); 
  btn.mousePressed(addCreature); 
  
  btn.style('padding', '10px 20px');
  btn.style('background', 'rgba(20, 30, 80, 0.6)');
  btn.style('color', '#fff');
  btn.style('border', '1px solid rgba(255,255,255,0.2)');
  btn.style('border-radius', '20px');
  btn.style('cursor', 'pointer');
  btn.style('font-family', 'Helvetica, Arial, sans-serif');
}

function addCreature() {
  let d = random(dataPool);
  creatures.push(new CreatureCloud(
    random(width * 0.2, width * 0.8), 
    random(height * 0.2, height * 0.8), 
    d.vitality || 50, 
    d.name || "Unknown"
  ));
}

function draw() {
  background(240, 80, 8, 10); 

  if (creatures.length === 0) {
    drawInstruction("Click the button to summon voices from the void...");
  } else {
    drawInstruction("Reach out with your cursor to drift with them...", 40);
  }

  for (let c of creatures) {
    c.update();
    c.render();
  }
  
  addGrain(); 
}

function drawInstruction(phrase, baseAlpha = 50) {
  push();
  let alpha = baseAlpha + sin(frameCount * 0.05) * 20;
  fill(0, 0, 100, alpha);
  textAlign(CENTER);
  noStroke();
  textFont('Helvetica, Arial');
  textSize(12);
  let msg = phrase.toUpperCase().split('').join('  ');
  text(msg, width/2, height - 60); 
  pop();
}

class CreatureCloud {
  constructor(x, y, vit, name) {
    this.x = x; 
    this.y = y;
    this.name = name;
    this.vit = vit;
    this.particles = [];
    this.radius = map(vit, 0, 100, 65, 170);
    
    // 冷紫与蓝紫调色逻辑
    let coin = random();
    if (coin > 0.5) {
      this.hue = random(265, 290); 
      this.sat = random(40, 60); 
    } else {
      this.hue = random(230, 260); 
      this.sat = random(30, 50);
    }
    
    for(let i=0; i<180; i++) {
      this.particles.push({
        angle: random(TWO_PI),
        dist: random(this.radius),
        size: random(0.5, 2.5),
        speed: random(0.004, 0.012)
      });
    }
  }

  update() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 200) {
      this.x += (this.x - mouseX) * 0.03;
      this.y += (this.y - mouseY) * 0.03;
    }
    this.x += sin(frameCount * 0.01 + this.hue) * 0.3;
    this.y += cos(frameCount * 0.01 + this.hue) * 0.3;
  }

  render() {
    push();
    translate(this.x, this.y);
    
    noStroke();
    for (let r = 12; r > 0; r--) {
      fill(this.hue, this.sat, 100, 1.1);
      ellipse(0, 0, this.radius * (r * 0.18));
    }

    for (let p of this.particles) {
      p.angle += p.speed;
      let px = cos(p.angle) * p.dist;
      let py = sin(p.angle) * p.dist;
      fill(this.hue, this.sat - 10, 100, random(5, 20));
      ellipse(px, py, p.size);
    }

    fill(0, 0, 100, 45);
    textAlign(CENTER);
    textSize(10);
    let spacedName = this.name.toUpperCase().split('').join('  ');
    text(spacedName, 0, this.radius + 28);
    pop();
  }
}

function addGrain() {
  for (let i = 0; i < 220; i++) {
    stroke(0, 0, 100, 8);
    strokeWeight(random(0.5, 1.2));
    point(random(width), random(height));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}