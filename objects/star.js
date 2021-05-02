class Star {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  show() {
    noStroke();
    fill(114);
    ellipse(this.x, this.y, this.r*2);
  }
}
