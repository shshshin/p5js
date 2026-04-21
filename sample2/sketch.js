function setup() {
  createCanvas(400, 400);
  noLoop();
}

function draw() {
  let c1 = color(255, 255, 0);
  let c2 = color(0, 255, 255);
  
  for (let x = 0; x < width; x++) {
    let inter = map(x, 0, width, 0, 1); // 변수 x의 값을 0에서 1사이 값으로 보정해준다.
    let c = lerpColor(c1, c2, inter); // c1과 c2 색상 사이에서 inter 값에 따라 색상 혼합
    stroke(c);
    line(x, 0, x, height);
  }
}