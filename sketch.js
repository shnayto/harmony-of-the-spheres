// // Harmony of the Spheres Draft
// // Nathan Ó Maoilearca 2020

//visuals
let sun, planets = [], radii = [], e = [15.36, 14.01, 12.98, 12.14, 11.45, 10.86, 10.35, /*this is random*/ 10.15] /*15.36*/, planetRadii = [10, 15, 25, 20, 40, 35, 30, 27],
planetColours = [[233, 163, 100], [216, 157, 145], [15, 92, 166], [191, 54, 27], [143, 105, 64], [217, 177, 56], [121, 183, 224], [38, 104, 148]],
tempPlanetSpecs = [];
let planetOptions = [];
//sounds
//A major7      A6      E        A     Csharp    Gsharp E      A    A

let pitches = [1760/2, 1318.5/2, 880/2, 554.4/2, 415.3, 329.6/2, 220/2, 55];
let fixedPitches = [1760/2, 1318.5/2, 880/2, 554.4/2, 415.3, 329.6/2, 220/2, 55];

/*
let pitches = [3321, 1300, 800, 425.2, 67.49, 27.16, 9.523, 4.855, 3.221];
let fixedPitches = [3321, 1300, 800, 425.2, 67.49, 27.16, 9.523, 4.855, 3.221];
*/
let playing = false, oscillators = [], frequencies = [], initalDistances = [], currentDistances = [], differenceDistances = [],
soundLoop, intervalInSeconds = Infinity;
//maths
let gConst = 0.01, slider, tempPlanet = false, pulse = 0, angleNewPlanet;

let prevx = [];
let prevy = [];
let vertices = [];
let vertice
let currentTimeArray = [];
let currentPlanetPeriod, maxDistanceFromSun, minDistanceFromSun;
let tempPlanetIndex;
let tempPitch;
let planetNumber;
let lpFreq = 20;
let hpFreq = 20000;
//        rnd/maxPlanetNumber
let amp = 0.2/8;


function setup(){
  createCanvas(windowWidth, windowHeight);
  //soundLoop temporarily set to loop every minute
  soundLoop = new p5.SoundLoop(onSoundLoop, intervalInSeconds);
  soundLoop.start();
  lp = new p5.LowPass();
  lp.freq(lpFreq);
  planetNumber = 1;
  for (i = 0; i < planetNumber; i++) {
// arguments:              x ,           y,             m, radius,         colour,        g,      eccentricty
  planets.push(new Planet((i * 0.2) + 1, (i * 0.2) + 1, 1, planetRadii[i] * 2, planetColours[i], gConst, e[i]));
  initalDistances[i] = dist(planets[i].pos.x, planets[i].pos.y, width/2, height/2);
  planetOptions.push(new Planet(1, 1, 1, height/16, planetColours[i], gConst, e - i, width / 20 - width / 2, i * height/planetNumber - height / 2 + height / (planetNumber*2) + 1));
  oscillators.push(new p5.Oscillator('sine'));
  radii.push(new Radius());
  vertices.push(vertice);
  //inp = createInput('');
  //inp.input(myInputEvent);
//  inp.position(100, 100 * i);
  let button = createButton('add Planet');
  button.mousePressed(planetNumber);
  }
  //gravity slider (gConst)

  gravity = createSlider(0.0005, 0.5, gConst, 0.00001);
  gConst = gravity.value();
  sun = new Sun(width/2, height/2, 33000, gConst);
}

function overPlanetOptions() {
  console.log('okay')
}

function myInputEvent() {
console.log('you are typing: ', this.value());
}
//(width/2 +(this.initialX * x), height/2 + (this.initialY * y)


function draw(){
  background(45, 35, 35);
    sun.show();
  let radiusLines;
  noFill();
  stroke(60, 50, 50);
//  for every planet begin loop
  // if (prevy.length > 9000) {
  //   prevy.length = 8999;
  //   prevx.length = 8999;
  // }
  // for (let j = 0; j < planets.length; j++) {
  //   beginShape();
  //   //for every planet create vertex between every point it hit
  //   for (let i = j; i < prevy.length; i = i + planets.length) {
  //     vertices[j] = vertex(prevx[i], prevy[i]);
  //   }
  //   endShape();
  // }
//display planets, sun, radius lines & apply gravity
  for (i = 0; i < planetOptions.length; i++) {
    planetOptions[i].showOptions();
    options();
  }
  for (i = 0; i < planets.length; i++) {
    planets[i].show();
    planets[i].move();
    sun.attract(planets[i]);
    currentDistances[i] = dist(planets[i].pos.x, planets[i].pos.y, sun.pos.x, sun.pos.y);
    differenceDistances[i] = initalDistances[i] - currentDistances[i]
                                // + differenceDistances[i]
    oscillators[i].freq(pitches[i] + differenceDistances[i]);
    oscillators[i].amp(0.2/8);

  //  radii[i].show(sun, planets[i]);
  //  radiusLines = line(sun.pos.x, sun.pos.y, planets[i].pos.x, planets[i].pos.y);
    prevx.push(planets[i].pos.x);
    prevy.push(planets[i].pos.y);

    let lineA = line(sun.pos.x, sun.pos.y, planets[i].pos.x, planets[i].pos.y);
    let lineB = line(sun.pos.x, sun.pos.y, width, height/2);
    let planetRound = round(planets[i].pos.y);
    let yMidpoint = round(height/2);

  // when the planet line aligns with the horizon
    if (planetRound > yMidpoint - 5 && planets[i].pos.x > width/2 && planetRound < yMidpoint + 5) {
      //add current time to array
      currentTimeArray.push(performance.now());
      maxDistanceFromSun = dist(sun.pos.x, sun.pos.y, planets[i].pos.x, planets[i].pos.y);
      //run function that returns an approximation of planet period
      periodApprox(currentTimeArray);
    //  console.log(currentPlanetPeriod);
      setTimeout(minDist, currentPlanetPeriod/2);
  }
}

// create a new temporary planet when one is selected
  if (tempPlanet == true) {
    createTempPlanet();
  }
  if (tempPlanet == false) {
    tempLowPassRise()
  }
}

function minDist() {
  for (i = 0; i < planets.length; i++) {
    minDistanceFromSun = dist(sun.pos.x, sun.pos.y, planets[i].pos.x, planets[i].pos.y);
  }
}

function periodApprox(array){
  let intervalArray = [];
  let interval;
    if (array.length == 1){
      intervalArray.push(array[array.length - 1]);
    } else {
      interval = array[array.length - 1] - array[array.length - 2];
      intervalArray.push(interval);
    }
  currentPlanetPeriod = intervalArray[intervalArray.length - 1];
}

function frequencyCalculator() {
  for (let i = 0; i < planets.length; i++){

  }
}

function createTempPlanet(){
  tempPlanetPulse();
  tempPlanetAngle();
  tempLowPassFall();
}

function tempLowPassFall() {
  lpFreq = constrain(lpFreq, 100, 10000);
  lpFreq *= 0.7;
  lp.freq(lpFreq);
}

function tempLowPassRise() {
  lpFreq = constrain(lpFreq, 300, 13333);
  lpFreq *= 1.5;
  lp.freq(lpFreq);
}

function tempPlanetPulse() {
  let pulsing = sin(pulse += 0.05);
  fill(tempPlanetSpecs[1][0], tempPlanetSpecs[1][1], tempPlanetSpecs[1][2], 100)
  ellipse(mouseX, mouseY, tempPlanetSpecs[0] + pulsing*5);
}

function tempPlanetAngle(){
  let v2 = createVector(width/2, 0);
  let v1 = createVector(mouseX - width/2, mouseY - height/2);
  let angleBetween = v1.angleBetween(v2);
  if (angleBetween < 0) {
    angleNewPlanet = angleBetween  + TWO_PI;
  } else {angleNewPlanet = angleBetween};
}

function onSoundLoop(){
  if (playing == true) {
    playing = false
    for (let i = 0; i < planets.length; i++){
      oscillators[i].stop();
    }
  } else {
    playing = true;
    for (let i = 0; i < planets.length; i++){
      oscillators[i].start();
    }
  }
}


function options() {
  let optionsTrigger;
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r){
      planetOptions[i].optionAlpha = 150;
//width / 20 - width / 2, i * height/8 - height / 2 + height / 16)
      text(pitches[i].toFixed(1) + ' Hz', planetOptions[i].pos.x + 30, planetOptions[i].pos.y);
    } else {
      planetOptions[i].optionAlpha = 50;
    }
 }


function mousePressed(){
  //inp.remove();
  if (mouseY > height - 100) {
    onSoundLoop();
  }
  if (mouseY < 30 && mouseX > width/2 && planetNumber < 8){
    //planetOptions.length - 1 == planetNumber
    //planetNumber is increased at the end
    let p = planetNumber;
    planets.push(new Planet((planetNumber * 0.2) + 1, (planetNumber * 0.2) + 1, 1, planetRadii[planetNumber] * 2, planetColours[planetNumber], gConst, e[planetNumber]));
    console.log(planetNumber);
    planetOptions.push(new Planet(1, 1, 1, height/16, planetColours[planetNumber], gConst, e - i, width / 20 - width / 2, i * height/planetNumber - height / 2 + height / (planetNumber*2) + 1));
    console.log(planetOptions.length);
    oscillators.push(new p5.Oscillator('sine'));
    oscillators[p].freq(pitches[p]);
    oscillators[p].start();
     for (let i = 0; i < planetOptions.length; i++) {
       oscillators[i].amp(0.2/8);
       planetOptions[i].pos.x = width / 20;
       planetOptions[i].pos.y = i * height/planetOptions.length + height / (planetOptions.length*2) + 1;
     }
    radii.push(new Radius());
    vertices.push(vertice);
    planetNumber++;
  }
  if (mouseY < 30 && mouseX < width/2 && planetNumber > 1){
    planetNumber--;
    planets.pop()
    planetOptions.pop();
    oscillators[planetNumber].stop();
    for (let i = 0; i < planetOptions.length; i++) {
      planetOptions[i].pos.x = width / 20;
      planetOptions[i].pos.y = i * height/planetOptions.length + height / (planetOptions.length*2) + 1;
    }
  }
  for (let i = 0; i < planetOptions.length; i++){
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r && mouseY < planetOptions[i].pos.y){
      pitches[i] *= 1.05948
      oscillators[i].freq(pitches[i]);
    } else if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r && mouseY > planetOptions[i].pos.y) {
      pitches[i] *= 0.944
      oscillators[i].freq(pitches[i]);
    }
  }
  for (let i = 0; i < planets.length; i++){
    if (dist(mouseX, mouseY, planets[i].pos.x, planets[i].pos.y) < planets[i].r){
      tempPlanetSpecs.push(planets[i].r, planets[i].c);
      for (let j = 0; j < planets.length; j++){
          oscillators[j].disconnect();
          oscillators[j].connect(lp);
      }
      oscillators[i].disconnect();
      oscillators[i].connect();
      planets.splice(i, 1);
      vertices.splice(i, 1);
      tempPlanetIndex = i;
      setTimeout(timer, 10);
    }
  }
  if (tempPlanet == true) {
    resetPlanet();
  }
}

function timer() {
  tempPlanet = true;
}

function resetPlanet() {
// push a new planet into the planets array, with the same specs as the one spliced
  planets.splice(tempPlanetIndex, 0, new Planet(1, 1, 1, tempPlanetSpecs[0], tempPlanetSpecs[1], gConst, e[tempPlanetIndex], mouseX - width/2, mouseY - height/2, angleNewPlanet));
  initalDistances[tempPlanetIndex] = dist(mouseX, mouseY, sun.pos.x, sun.pos.y);
  tempPlanet = false;
  tempPlanetSpecs.length = 0;
}

class Radius {
  show(sun, planet) {
    strokeWeight(2);
    stroke(232, 40);
    line(sun.pos.x, sun.pos.y, planet.pos.x, planet.pos.y);
  }
}
class Sun {
   constructor(x, y, m, g) {
     this.pos = createVector(x, y);
     this.mass = m;
     this.r = sqrt(this.mass) / 6;
     this.g = g
   }

   show() {
    noStroke();
    fill(245, 214, 38, 150);
    ellipse(this.pos.x, this.pos.y, this.r*2);
   }

   attract(planet){
     let force = p5.Vector.sub(this.pos, planet.pos);
     let distance = force.mag();
     let distanceSq = force.magSq();
     let strength = this.g * (this.mass * planet.mass) / distanceSq;
     force.setMag(strength);
     planet.applyForce(force);
     }
}
class Planet {
  constructor(x, y, m, r, c, g, e, mX, mY, a){
    //creates a random angle within unit circle
    let randomAngle = random(TWO_PI);
    //set X and Y coordinates on unit circle accordingly
    this.randAngleX = cos(a) || cos(randomAngle);
    this.initialX = mX || this.randAngleX * 140;
    this.randAngleY = - sin(a) || sin(randomAngle);
    this.initialY = mY || this.randAngleY * 140;
    // set coordinates to planet pos
    this.pos = createVector(width/2 +(this.initialX * x), height/2 + (this.initialY * y));
    // set initial ang velocity based on initial angle
    this.vel = createVector(sqrt(g) * e * -this.randAngleY, sqrt(g) * e * this.randAngleX);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = r;
    this.c = c;
    this.optionAlpha = 50;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  move(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show(){
    noStroke();
    fill(this.c[0], this.c[1], this.c[2], 200)
    ellipse(this.pos.x, this.pos.y, this.r);
  }

  showOptions(){
    noStroke();
    fill(this.c[0], this.c[1], this.c[2], this.optionAlpha)
    ellipse(this.pos.x, this.pos.y, this.r);
  }
}
