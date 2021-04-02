// // Harmony of the Spheres Draft
// // Nathan Ó Maoilearca 2021

//visuals

let sun, planets = [], radii = [], moons = [[], [], [], [], [], [], [], []], e = [15.36, 14.01, 12.98, 12.14, 11.45, 10.86, 10.35, /*this is random*/ 10.15] /*15.36*/, planetRadii = [10, 15, 25, 20, 40, 35, 30, 27],
planetColours = [[233, 163, 100], [216, 157, 145], [15, 92, 166], [191, 54, 27], [143, 105, 64], [217, 177, 56], [121, 183, 224], [38, 104, 148]], moonColours = [175, 174, 175];
let tempPlanetSpecs = [];
let deletedPlanets = [];
let deletedIndices = [];
let planetOptions = [];
let fixedPlanetIndices = [];
//sounds
//A major7      A6      E        A     Csharp    Gsharp E      A    A

let pitches = [1760/2, 1318.5/2, 880/2, 554.4/2, 415.3, 329.6/2, 220/2, 55];
let fixedPitches = [1760/2, 1318.5/2, 880/2, 554.4/2, 415.3, 329.6/2, 220/2, 55];
var audio;

/*
let pitches = [3321, 1300, 800, 425.2, 67.49, 27.16, 9.523, 4.855, 3.221];
let fixedPitches = [3321, 1300, 800, 425.2, 67.49, 27.16, 9.523, 4.855, 3.221];
*/

let playing = false, oscillators = [], frequencies = [], initalDistances = [], currentDistances = [], differenceDistances = [],
soundLoop, intervalInSeconds = Infinity;
//maths
let gConst = 0.01, tempPlanet = false, tempMoon = false, pulse = 0, angleNewPlanet;
let currentPlanetPeriod, maxDistanceFromSun, minDistanceFromSun;
let tempPlanetIndex = 0;
let tempPitch;
let planetNumber;
let lpFreq = 20;
let hpFreq = 20000;
let maxPlanetNumber = 0;
let amp = 0.2/8;
let xOffset, yOffset;
let moonMode = false, solarSystemMode = true;
let started = false;
let breakMe = false;
let fade = 155;
let dragging = false;
let sorted = true;
let spaceClicked = true;
var fmOsc;
var order;

const harmonicityVal = [0.25, 0.5, 1, 2, 4, 8, 16];
let harmonicityMap;
let prevHarmonicityMap;
let frequencyMap = 0;
let modulationIndexMap = 10;

function setup(){
  createCanvas(windowWidth, windowHeight);
  planetNumber = 0;
  pixelDensity(1);
  sun = new Sun(width/2, height/2, 33000, gConst);
}

function startScreen() {
    if (started == false) {
    graphics();
  } else if (!breakMe && started == true) {
    fade -= 10;
    graphics();
    if (fade < 1) {
      breakMe = true;
    }
  }
}

function graphics(){
  let gradient;
  let welcomeText;
  fill(50, fade);
  gradient = rect(0, 0, width, height);
  fill(250, fade);
  textSize(width/25);
  textAlign(CENTER, CENTER);
  welcomeText = text("Touch to Begin", width/2, height/2);
}

function draw(){
  background(45, 35, 35);
  sun.show();
  startScreen();

  prevHarmonicityMap = harmonicityMap;
// for (var i = 0  ;  i < touches.length  ;  i++) {
//    modulationIndexMap = map(touches[0].x, 0, width, 0.02, 20);
//    frequencyMap = map(touches[0].y, 0, height, -2, 2);
// }
  if (moons[tempPlanetIndex].length > 0){
    modulationIndexMap = map(moons[0][0].pos.x, 0, width, 0.02, 20);
    frequencyMap = map(moons[0][0].pos.y, 0, height, -2, 2);
  }
  if (tempMoon){
    modulationIndexMap = map(mouseX, 0, width, 0.02, 20);
  }

  if (oscillators.length > 0) {
    oscillators[0].modulationIndex.value = modulationIndexMap;
  }
//display planets, sun, radius lines & apply gravity
  for (i = 0; i < planetOptions.length; i++) {
    planetOptions[i].showOptions();
    options();
  }
  if (moonMode) {
    fill(tempPlanetSpecs[1][0], tempPlanetSpecs[1][1], tempPlanetSpecs[1][2]);
    ellipse(sun.pos.x, sun.pos.y, sun.r*2);
     for (i = 0; i < moons[tempPlanetIndex].length; i++) {
         moons[tempPlanetIndex][i].show();
         moons[tempPlanetIndex][i].move();
         sun.attract(moons[tempPlanetIndex][i]);
     }
     if (tempMoon == true) {
       createTempMoon();
       console.log('temp')
     }
  }
  if (solarSystemMode){
    for (i = 0; i < planets.length; i++) {
      planets[i].show();
      planets[i].move();
      sun.attract(planets[i]);
    if (moons[tempPlanetIndex].length > 0){
      for (i = 0; i < moons[tempPlanetIndex].length; i++) {
      //  moons[tempPlanetIndex][i].show();
          moons[tempPlanetIndex][i].move();
        //sun.attract(moons[tempPlanetIndex][i]);
      }
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
}

function options() {
  let optionsTrigger;
  for (let i = 0; i < planetOptions.length; i++){
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r){
      planetOptions[i].optionAlpha = 150;
//width / 20 - width / 2, i * height/8 - height / 2 + height / 16)
      text(pitches[i].toFixed(1) + ' Hz', planetOptions[i].pos.x + 30, planetOptions[i].pos.y);
    } else if (moonMode) {
      planetOptions[tempPlanetIndex].optionAlpha = 150;
      planetOptions[i].optionAlpha = 50;
    } else {
      planetOptions[i].optionAlpha = 50;
    }
  }
}

function mouseDragged(){
  if (solarSystemMode){
    for (let t = 0; t < planets.length; t++){
      if (dist(mouseX, mouseY, planets[t].pos.x, planets[t].pos.y) < planets[t].r){
         dragging = true;
        // tempPlanetSpecs.push(planets[t].r, planets[t].c);
         // for (let j = 0; j < planets.length; j++){
         //     oscillators[j].disconnect();
         //     oscillators[j].connect(lp);
         // }
         // oscillators[t].disconnect();
         // oscillators[t].connect();
        if (!tempPlanet){
          planets.splice(t, 1);
          //tempPlanetIndex = t;
        }
        setTimeout(timer, 10);
      }
    }
  }
  if (moonMode){
    for (let i = 0; i < moons[tempPlanetIndex].length; i++){
      if (dist(mouseX, mouseY, moons[tempPlanetIndex][i].pos.x, moons[tempPlanetIndex][i].pos.y) < moons[tempPlanetIndex][i].r){
        if (!tempMoon){
          moons[tempPlanetIndex].splice(i, 1);
          setTimeout(timer, 10);
        }
      }
    }
  }
}

function touchStarted() {
  Tone.start();
    if (started == false) {
      started = true;
      Tone.start;
    }
    planetOptionsHover();
    planetClick();
    moonClick();
    returnToSolarSystemMode();
    if (spaceClicked && planetNumber < 8 && solarSystemMode) {
      planetAdd();
    }
    if (spaceClicked && moonMode) {
      moonAdd();
    }
    spaceClicked = true;
    return false;
}

function touchEnded() {
  // if (tempPlanet) {
  //   resetPlanet();
  // }
  if (solarSystemMode) {
    planetReleased();
    spaceClicked = true;
  } else {
    moonReleased();
    spaceClicked = true;
  }

}

function timer() {
  if (solarSystemMode) {
    tempPlanet = true;
  } else {
    tempMoon = true;
  }
}

function timerDrag() {
  if (dragging || mouseIsPressed) {
  } else {
    moonMode = true;
    solarSystemMode = false;
    spaceClicked = false;
  }
}
function returnToSolarSystemMode() {
  if (moonMode && dist(mouseX, mouseY, sun.pos.x, sun.pos.y) < sun.r*2){
    moonMode = false;
    solarSystemMode = true;
    spaceClicked = false;
    //tempPlanetSpecs.length = 0;
  }
}
function planetClick() {
  if (solarSystemMode){
    for (let t = 0; t < planets.length; t++){
      if (dist(mouseX, mouseY, planets[t].pos.x, planets[t].pos.y) < planets[t].r){
        xOffset = mouseX - planets[t].pos.x;
        yOffset = mouseY - planets[t].pos.y;
        tempPlanetIndex = t;
        tempPlanetSpecs.length = 0;
        tempPlanetSpecs.push(planets[t].r, planets[t].c, pitches[t]);
        spaceClicked = false;
        if (!dragging) {
          setTimeout(timerDrag, 200);
        }
        dragging = false;
      }
    }
  }
}
function moonClick() {
  if (moonMode){
    for (let t = 0; t < moons[tempPlanetIndex].length; t++){
      if (dist(mouseX, mouseY, moons[tempPlanetIndex][t].pos.x, moons[tempPlanetIndex][t].pos.y) < moons[tempPlanetIndex][t].r){
        console.log(tempPlanetIndex)
        xOffset = mouseX - moons[tempPlanetIndex][t].pos.x;
        yOffset = mouseY - moons[tempPlanetIndex][t].pos.y;
        console.log('offset set')
        spaceClicked = false;
      }
    }
  }
}
function planetOptionsHover() {
  for (let i = 0; i < planetOptions.length; i++){
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r){
      tempPlanetSpecs.length = 0;
      tempPlanetIndex = i;
      tempPlanetSpecs.push(planets[i].r, planets[i].c);
      spaceClicked = false;
      moonMode = true;
      solarSystemMode = false;
    }
  }
}
function planetReleased() {
  if (tempPlanet == true && mouseY > height - height/10) {
    //this should be somewhere else;
  //  console.log(tempPlanetIndex);

  //   if ((tempPlanetIndex + 1) == fixedPlanetIndices.length) {
  //     fixedPlanetIndices.pop();
  //     maxPlanetNumber--;
  //   } else if ((tempPlanetIndex + 1) < fixedPlanetIndices.length &&
  //             planets.length + 1 == fixedPlanetIndices.length){
  //     fixedPlanetIndices.splice(tempPlanetIndex, 1);
  //     deletedIndices.push(tempPlanetIndex);
  // }
  //   checkOrder();
      planetDelete();
      tempPlanetSpecs.length = 0;
      spaceClicked = false;
      //PROBLEM CHILD !!!!!!!!
  } else if (tempPlanet == true) {
      resetPlanet();
      spaceClicked = false;
  }
}

function moonReleased() {
  if (tempMoon) {
    resetMoon();
    spaceClicked = false;
  }
}

function resetPlanet() {
// push a new planet into the planets array, with the same specs as the one spliced
  tempPlanet = false;
  planets.splice(tempPlanetIndex, 0, new Planet(1, 1, 1, tempPlanetSpecs[0], tempPlanetSpecs[1], gConst, e[tempPlanetIndex], mouseX - xOffset - width/2, mouseY - yOffset - height/2, angleNewPlanet));
  //tempPlanetSpecs.length = 0;
}
function resetMoon() {
  tempMoon = false;
  moons[tempPlanetIndex].push(new Planet(1, 1, 1, planetRadii[2] * 2, moonColours, gConst, e[tempPlanetIndex], mouseX - xOffset - width/2, mouseY - yOffset - height/2, angleNewPlanet));
  console.log('reset')
}
function planetDelete() {
  //!! STORE DELETED SPECS TO AVOID REPEATS
  tempPlanet = false;
  planetNumber--;
  oscillators[planetNumber].stop();
  planetOptions.splice(tempPlanetIndex, 1);
  for (let i = 0; i < planetOptions.length; i++) {
    planetOptions[i].pos.x = width / 20;
    planetOptions[i].pos.y = i * height/planetOptions.length + height / (planetOptions.length*2) + 1;
  }
}
function checkOrder(){
  for (let i = 0; i < fixedPlanetIndices.length - 1; i++) {
      if ((fixedPlanetIndices[i+1] - fixedPlanetIndices[i]) > 1) {
          sorted = false;
          break;
      }
  }
}

function planetAdd() {
  //planetOptions.length - 1 == planetNumber
  //planetNumber is increased at the end
  deletedIndices.sort();
  let p = planetNumber;
  let d = deletedIndices[0];
  //let d = 1;

if (d == 0 || sorted == false || deletedIndices.length > 0){
    fixedPlanetIndices.push(deletedIndices[0] + 1);
    fixedPlanetIndices.sort();
    planets.splice(d, 0, new Planet((d * 0.2) + 1, (d * 0.2) + 1, 1, planetRadii[d] * 2, planetColours[d], gConst, e[d]));
    planetOptions.splice(d, 0, new Planet(1, 1, 1, height/16, planetColours[d], gConst, e - i, width / 20 - width / 2, i * height/d - height / 2 + height / (d*2) + 1));
    deletedIndices.splice(0, 1);
    sorted = true;
  } else if (sorted == true){
      planets.push(new Planet((p * 0.2) + 1, (p * 0.2) + 1, 1, planetRadii[p] * 2, planetColours[p], gConst, e[p]));
      planetOptions.push(new Planet(1, 1, 1, height/16, planetColours[p], gConst, e - p, width / 20 - width / 2, p * height/p - height / 2 + height / (p*2) + 1));
    }
  if (planetNumber == fixedPlanetIndices.length) {
    maxPlanetNumber++;
    fixedPlanetIndices.push(maxPlanetNumber);
  }
  planetNumber++;

  fmOsc = new Tone.FMOscillator({
    frequency: pitches[p],
    type: "sine",
    partialCount: 0,
    modulationType: "sine",
    harmonicity: 0.2,
		modulationIndex: 0,
    volume: -40
  }).toDestination();

  oscillators.push(fmOsc);
  oscillators[p].start();
  // oscillators.push(new p5.Oscillator('sine'));
  // oscillators[p].freq(pitches[p]);
  // oscillators[p].start();
   for (let i = 0; i < planetOptions.length; i++) {
    // oscillators[i].amp(0.2/8);
     planetOptions[i].pos.x = width / 20;
     planetOptions[i].pos.y = i * height/planetOptions.length + height / (planetOptions.length*2) + 1;
   }
}
function moonAdd() {
  let moonNumber = moons.length;
  let m = moonNumber;
  let rm = random(1, moonNumber);
  if (moons[tempPlanetIndex].length < 3){
    moons[tempPlanetIndex].push(new Planet((2 * 0.2) + 1, (2 * 0.2) + 1, 1, planetRadii[2] * 2, moonColours, gConst, e[2]));
  }
}

function createTempPlanet(){
  tempPlanetPulse();
  tempPlanetAngle();
  tempLowPassFall();
}

function createTempMoon() {
  let pulsing = sin(pulse += 0.05);
  fill(moonColours[0], moonColours[1], moonColours[2]);
  ellipse(mouseX - xOffset, mouseY - yOffset, planetRadii[2]*2 + pulsing*5);
  tempPlanetAngle();
}

function tempLowPassFall() {
  // lpFreq = constrain(lpFreq, 100, 10000);
  // lpFreq *= 0.7;
  // lp.freq(lpFreq);
}
function tempLowPassRise() {
  // lpFreq = constrain(lpFreq, 300, 13333);
  // lpFreq *= 1.5;
  // lp.freq(lpFreq);
}
function tempPlanetPulse() {
  let pulsing = sin(pulse += 0.05);
  fill(tempPlanetSpecs[1][0], tempPlanetSpecs[1][1], tempPlanetSpecs[1][2], 100)
  ellipse(mouseX - xOffset, mouseY - yOffset, tempPlanetSpecs[0] + pulsing*5);
}

function tempPlanetAngle(){
  let v2 = createVector(width/2, 0);
  let v1 = createVector(mouseX - width/2, mouseY - height/2);
  let angleBetween = v1.angleBetween(v2);
  if (angleBetween < 0) {
    angleNewPlanet = angleBetween  + TWO_PI;
  } else {angleNewPlanet = angleBetween};
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
