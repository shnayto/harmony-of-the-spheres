class Planet {
  constructor(x, y, r, c, e, a, n){
    this.eccentricity = e;
    this.angle = a;
    //this.angle2 = a;
    //set X and Y coordinates on unit circle accordingly
    this.velY = cos(this.angle);
    this.velX = sin(this.angle);
    // set coordinates to planet pos
    this.pos = createVector(x, y);
    // set initial ang velocity based on initial angle
    this.vel = createVector(this.eccentricity * this.velX, this.eccentricity * this.velY);
    this.acc = createVector(0, 0);
    this.mass = 1;
    this.r = r;
    this.c = c;
    this.optionAlpha = 50;
    this.number = n;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc = f;
  }

  move(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  angleFind(){
    let v2 = createVector(width/2, 0);
    let v1 = createVector(this.pos.x - width/2, this.pos.y - height/2);
    let angleBetween = v1.angleBetween(v2);
    if (angleBetween < 0) {
      this.angle2 = angleBetween  + TWO_PI;
    } else {this.angle2 = angleBetween};
  }

  show(){
    noStroke();
    fill(this.c[0]+60, this.c[1]+60, this.c[2]+60, 200);
    ellipse(this.pos.x, this.pos.y, this.r);
    for (let i = 0; i < 5; i++){
      fill(this.c[0]-5 * (i + 1), this.c[1]-5 * (i + 1), this.c[2]-5 * (i + 1), 40);
      ellipse(this.pos.x + cos(this.angle2) * (i + 1), this.pos.y - sin(this.angle2) * (i + 1), this.r - (2 * (i + 1)));
    }
  }

  glow() {
    //adds a healthy glow around moons
    for (let i = 0; i < 15; i++){
      fill(moonColours[0], moonColours[0], moonColours[0], 5);
      ellipse(this.pos.x, this.pos.y, this.r + i)
    }
  }

  optionsDraw(){
    noStroke();
    fill(this.c[0], this.c[1], this.c[2], this.optionAlpha)
    ellipse(this.pos.x, this.pos.y, this.r);
  }
}
