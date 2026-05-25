let xPos, xDir;
let yPos, yDir;
let diam;
let speed = 3;
let padX;
let padWidth;

let score = 0;
let isGameOver = false;
let isGameWon = false;

let shakeTime = 0;
let particles = [];
let ballHistory = [];
let hitSound;
let bgMusic;

let bricks = [
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
];

function preload() {
  hitSound = loadSound('assets/벽돌에 닿는 소리.mp3');
}

function setup() {
  createCanvas(600, 600);
  resetGame();

  bgMusic = loadSound('assets/bgm.mp3', function() {
    bgMusic.loop();
    bgMusic.setVolume(0.15); 
  });
}

function draw() {
  userStartAudio(); 

  background(20);

  push();
  if (shakeTime > 0) {
    let dx = random(-10, 10);
    let dy = random(-10, 10);
    translate(dx, dy);
    shakeTime--;
  }
  
  if (isGameOver) {
    pop();
    if (bgMusic && bgMusic.isPlaying()) {
      bgMusic.stop();
    }
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("게임 오버ㅠ-ㅠ", width / 2, height / 2);
    textSize(24);
    text("Final Score: " + score, width / 2, height / 2 + 50);
    text("ENTER를 눌러 다시 시작", width / 2, height / 2 + 100);
    return;
  }

  if (isGameWon) {
    pop();
    if (bgMusic && bgMusic.isPlaying()) {
      bgMusic.stop();
    }
    fill(0, 255, 255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("승리! 대단해요!", width / 2, height / 2);
    fill(255);
    textSize(24);
    text("Final Score: " + score, width / 2, height / 2 + 50);
    text("Press ENTER to Play Again", width / 2, height / 2 + 100);
    return;
  }

  let activeBricks = 0;
  let i = 0;
  while (i < bricks.length) {
    if (bricks[i] > 0) {
      activeBricks++;
      let col = i % 12;      
      let row = int(i / 12); 
      
      let brickX = col * 50;
      let brickY = row * 50; 

      let r = 180, g = 100, b = 255;
      if (bricks[i] === 2) {
        r = 255; g = 50; b = 150;
      }

      push(); 
      if (bricks[i] === 2) {
        drawingContext.shadowColor = color(255, 50, 150, 220);
      } else {
        drawingContext.shadowColor = color(180, 100, 255, 220);
      }
      drawingContext.shadowBlur = 15; 
      
      fill(r, g, b);
      stroke(255, 255, 255, 200);
      strokeWeight(1.5);
      rect(brickX + 1, brickY + 1, 48, 48, 4);
      pop(); 

      if (xPos > brickX && xPos < brickX + 50 && yPos - diam / 2 < brickY + 50 && yPos + diam / 2 > brickY) {
        bricks[i] -= 1;
        score += 10;
        yDir *= -1;
        xDir *= 1.02; 
        yDir *= 1.02; 
        shakeTime = 10;

        if (hitSound) {
          if (hitSound.isPlaying()) {
            hitSound.stop();
          }
          hitSound.play();
        }

        for (let p = 0; p < 10; p++) {
          particles.push({
            x: brickX + 25,
            y: brickY + 25,
            vx: random(-4, 4),
            vy: random(-2, 4),
            alpha: 255,
            r: r,
            g: g,
            b: b
          });
        }
      }
    }
    i++;
  }
    
  if (activeBricks === 0) {
    isGameWon = true;
  }

  let pIndex = particles.length - 1;
  while (pIndex >= 0) {
    let p = particles[pIndex];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2; 
    p.alpha -= 4; 

    if (p.alpha <= 0) {
      particles.splice(pIndex, 1);
    } else {
      fill(p.r, p.g, p.b, p.alpha);
      noStroke();
      ellipse(p.x, p.y, random(3, 6));
    }
    pIndex--;
  }

  ballHistory.push({ x: xPos, y: yPos });
  if (ballHistory.length > 25) {
    ballHistory.shift();
  }

  noFill();
  let hIndex = 0;
  while (hIndex < ballHistory.length - 1) {
    let p1 = ballHistory[hIndex];
    let p2 = ballHistory[hIndex + 1];
    
    let trailAlpha = map(hIndex, 0, ballHistory.length - 1, 5, 150);
    let trailWeight = map(hIndex, 0, ballHistory.length - 1, 1, 5);

    stroke(255, 235, 80, trailAlpha);
    strokeWeight(trailWeight);
    line(p1.x, p1.y, p2.x, p2.y);
    hIndex++;
  }

  fill(255, 255, 200);
  stroke(255, 120, 0);
  strokeWeight(2);
  ellipse(xPos, yPos, diam, diam);
  xPos = xPos + xDir;
  yPos = yPos + yDir;
  
  padX = mouseX - padWidth/2;
  
  fill(0, 230, 230);
  noStroke();
  rect(padX, height - 30, padWidth, 15, 4);
    
  if (xPos - diam / 2 < 0) xDir *= -1;
  if (xPos + diam / 2 > width) xDir *= -1;
  if (yPos - diam / 2 < 0) yDir *= -1;
  
  if (yPos + diam / 2 > height) {
    isGameOver = true;
  }
    
  if (xPos + diam/2 > padX && xPos - diam/2 < padX + padWidth && yPos + diam/2 > height - 30) {
    if (yPos > height - 30) {
      xDir *= -1;
    } else if (yDir > 0) {
      yDir *= -1;
    }
  }

  fill(240);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Score: " + score, 15, height - 30);
  
  pop();
}

function keyPressed() {
  if (keyCode === ENTER && (isGameOver || isGameWon)) {
    resetGame();
  }
}

function resetGame() {
  xPos = width / 2;
  yPos = height / 2;
  xDir = speed;
  yDir = speed;
  diam = 24;
  padWidth = 200;
  score = 0;
  isGameOver = false;
  isGameWon = false;
  shakeTime = 0;
  particles = [];
  ballHistory = [];
  
  let i = 0;
  while (i < bricks.length) {
    bricks[i] = 2;
    i++;
  }
  
  bricks[0] = 0;
  bricks[11] = 0;

  if (bgMusic && !bgMusic.isPlaying()) {
    bgMusic.loop();
  }
}