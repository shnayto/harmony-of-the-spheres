class Sun {
  constructor(x, y) {
   this.pos = createVector(x, y);
   this.mass = 330;
   this.r = this.mass / 9;
   this.g = 1;
  }

  show() {
  noStroke();
  fill(235, 204, 35, 250);
  ellipse(this.pos.x, this.pos.y, this.r*2);
  }

  glow() {
   //adds a healthy glow around sun
   for (let i = 0; i < 30; i++){
     fill(235, 204, 35, 1);
     ellipse(this.pos.x, this.pos.y, this.r*2 + i * 3)
   }
  }

  attract(planet){
   let force = p5.Vector.sub(this.pos, planet.pos);
   let distanceSq = force.magSq();
   let strength = this.g * (this.mass * planet.mass) / distanceSq;
   force.setMag(strength);
   planet.applyForce(force);
  }
}
