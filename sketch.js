// // Harmony of the Spheres Draft
// // Nathan Ó Maoilearca 2021

//visuals

let sun, planets = [], radii = [], moons = [[], [], [], [], [], [], [], []], e = [15.36, 14.01, 12.98, 12.14, 11.45, 10.86, 10.35, /*this is random*/ 10.15] /*15.36*/, planetRadii = [10, 15, 25, 20, 40, 35, 30, 27],
planetColours = [[233, 163, 100], [216, 157, 145], [15, 92, 166], [191, 54, 27], [143, 105, 64], [217, 177, 56], [121, 183, 224], [38, 104, 148]], moonColours = [175, 174, 175];
let tempPlanetSpecs = [];
let deletedPlanets = [];
let deletedIndices = [];
let deletedPitches = [];
let planetOptions = [];
let fixedPlanetIndices = [];
//sounds
//A major7      A6      E        A     Csharp    Gsharp E      A    A

//let pitches = [1760/2, 1318.5/2, 880/2, 554.4/2, 415.3/2, 329.6/2, 220/2, 55];
var pitches = [220/2, 329.6/2, 415.3/2, 554.4/2, 880/2, 1318.5/2, 1760/2, 55];

let fixedPitches = [1760/2, 1318.5/2, 880/2, 554.4/2, 415.3, 329.6/2, 220/2, 55];
var audio;

/*
let pitches = [3321, 1300, 800, 425.2, 67.49, 27.16, 9.523, 4.855, 3.221];
let fixedPitches = [3321, 1300, 800, 425.2, 67.49, 27.16, 9.523, 4.855, 3.221];
*/

let playing = false, oscillators = [], frequencies = [], initalDistances = [], currentDistances = [], differenceDistances = [],
soundLoop, intervalInSeconds = Infinity;
let oscillatorsDetune = [];
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
let tempPlanetNumber;

const harmonicityVal = [0, 0.25, 0.5, 1, 2, 4, 8];
let harmonicityMap = 0;
let prevHarmonicityMap;
let frequencyMap = 0;
let modulationIndexMap = 0;
let filter;
let filterFreq = 1500;
let distortion;
let distortionMap = 0;
let tempMoonIndex;
let diff = [];
let eccentricityNewPlanet;

function setup(){
  createCanvas(windowWidth, windowHeight);
  planetNumber = -1;
  pixelDensity(1);
  sun = new Sun(width/2, height/2);
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
  textSize(width/35);
  textAlign(CENTER, CENTER);
  welcomeText = text("Touch to Begin", width/2, height/2);
}

function draw(){
  background(45, 35, 35);
  sun.show();
  startScreen();
// for (var i = 0  ;  i < touches.length  ;  i++) {
//    modulationIndexMap = map(touches[0].x, 0, width, 0.02, 20);
//    frequencyMap = map(touches[0].y, 0, height, -2, 2);
// }

  if (moons[tempPlanetIndex].length > 2){
    console.log('something')
    // let distortionDistance = dist(moons[0][2].pos.x, moons[0][2].pos.y, sun.pos.x, sun.pos.y);
    // distortionMap = map(distortionDistance, 0, width/2, 0, 1);
    }
  if (moons[tempPlanetIndex].length > 0){
    let modDistance = dist(moons[tempPlanetIndex][0].pos.x, moons[tempPlanetIndex][0].pos.y, sun.pos.x, sun.pos.y);
    modulationIndexMap = map(modDistance, 0, width/2, -1, 4);
    console.log(modulationIndexMap)
    }
  if (moons[tempPlanetIndex].length > 1){
    let detuneDistance = dist(moons[tempPlanetIndex][1].pos.x, moons[tempPlanetIndex][1].pos.y, sun.pos.x, sun.pos.y);
    frequencyMap = map(detuneDistance, 0, width/2, -10, 10);
    }
  if (tempMoon){
    // let modDistance = dist(mouseX, mouseY, sun.pos.x, sun.pos.y);
    // modulationIndexMap = map(modDistance, 0, width/2, 0.02, 4);
    // let detuneDistance = dist(mouseX, mouseY, sun.pos.x, sun.pos.y);
    // frequencyMap = map(detuneDistance, 0, width/2, -20, 20);
  }


  if (moons[tempPlanetIndex].length > 0) {
    oscillators[tempPlanetIndex].modulationIndex.value = modulationIndexMap;
    oscillators[tempPlanetIndex].frequency.value = pitches[tempPlanetIndex];
    oscillatorsDetune[tempPlanetIndex].modulationIndex.value = modulationIndexMap;
    oscillatorsDetune[tempPlanetIndex].frequency.value = pitches[tempPlanetIndex] + frequencyMap;
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
     }
  }
  if (solarSystemMode){
    for (i = 0; i < planets.length; i++) {
      planets[i].show();
      planets[i].move();
      sun.attract(planets[i]);
    }
    if (moons[0].length > 0){
      for (i = 0; i < moons[0].length; i++) {
      //  moons[tempPlanetIndex][i].show();
        moons[0][i].move();
        sun.attract(moons[0][i]);
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
      //text(pitches[i].toFixed(1) + ' Hz', planetOptions[i].pos.x + 30, planetOptions[i].pos.y);
    } else if (moonMode) {
      planetOptions[tempPlanetIndex].optionAlpha = 150;
      planetOptions[i].optionAlpha = 50;
    } else {
      planetOptions[i].optionAlpha = 50;
    }
  }
}

function mouseDragged(){
  if (solarSystemMode && dragging == true){
    for (let t = 0; t < planets.length; t++){
       if (dist(mouseX, mouseY, planets[t].pos.x, planets[t].pos.y) < planets[t].r){
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
          tempMoonIndex = i;
          console.log(tempMoonIndex);
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

    planetOptionsClick();
    planetClick();
    moonClick();
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

function planetClick() {
  if (solarSystemMode){
    for (let t = 0; t < planets.length; t++){
      if (dist(mouseX, mouseY, planets[t].pos.x, planets[t].pos.y) < planets[t].r){
        xOffset = mouseX - planets[t].pos.x;
        yOffset = mouseY - planets[t].pos.y;
        tempPlanetNumber = planets[t].number;
        tempPlanetIndex = t;
        tempPlanetSpecs.length = 0;
        tempPlanetSpecs.push(planets[t].r, planets[t].c, pitches[t]);
        spaceClicked = false;
        dragging = true;
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
function planetOptionsClick() {
  let tempPlanetOptionsIndex
  for (let i = 0; i < planetOptions.length; i++){
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r && tempPlanetIndex == i){
      moonMode = false;
      solarSystemMode = true;
      spaceClicked = false;
      for (var o = 0; o < planets.length; o++) {
          console.log(planets[o].number)
          oscillators[planets[o].number].volume.rampTo(-25, 0.05);
          oscillatorsDetune[planets[o].number].volume.rampTo(-25, 0.05);
      }
      // for (let o = 0; o < fixedPlanetNumbers.length; o++) {
      //     oscillators[fixedPlanetNumbers[o]].volume.rampTo(-25, 0.5);
      //     oscillatorsDetune[fixedPlanetNumbers[o]].volume.rampTo(-25, 0.5);
      // }
    } else if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r){
      tempPlanetSpecs.length = 0;
      tempPlanetOptionsIndex = i;
      tempPlanetIndex = i;
      tempPlanetSpecs.push(planets[i].r, planets[i].c);
      spaceClicked = false;
      moonMode = true;
      solarSystemMode = false;
      for (var o = 0; o < planets.length; o++) {
          oscillators[planets[o].number].volume.rampTo(-55, 0.05);
          oscillatorsDetune[planets[o].number].volume.rampTo(-55, 0.05);
          oscillators[tempPlanetIndex].volume.rampTo(-20, 0.05);
          oscillatorsDetune[tempPlanetIndex].volume.rampTo(-20, 0.05);
      }
      // for (i = 0; i < oscillators.length; i++) {
      //   oscillators[i].volume.rampTo(-50, 0.5);
      //   oscillatorsDetune[i].volume.rampTo(-50, 0.5);
        // oscillators[tempPlanetIndex].volume.rampTo(-20, 0.5);
        // oscillatorsDetune[tempPlanetIndex].volume.rampTo(-20, 0.5);
      // }
    }
  }
}
function planetReleased() {
  if (tempPlanet == true && mouseY > height - height/10) {
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
  dragging = false;
  tempPlanetAngle();
  tempPlanetEccentricity();
  console.log(eccentricityNewPlanet);
  console.log(angleNewPlanet);

  planets.splice(tempPlanetIndex, 0, new Planet(mouseX - xOffset, mouseY - yOffset, tempPlanetSpecs[0], tempPlanetSpecs[1], eccentricityNewPlanet, angleNewPlanet, tempPlanetNumber));
  //tempPlanetSpecs.length = 0;
}
function resetMoon() {
  tempMoon = false;
  tempPlanetAngle();
  tempPlanetEccentricity();
                            //                                mouseX - width/2, mouseY - height/2, 1, planetRadii[2] * 2, moonColours, gConst, 1, 1, eccentricityNewPlanet, angleNewPlanet
  moons[tempPlanetIndex].push(new Planet(mouseX - xOffset, mouseY - yOffset, planetRadii[2] * 2, moonColours, eccentricityNewPlanet, angleNewPlanet));
  console.log('reset')
}
function planetDelete() {
  //!! STORE DELETED SPECS TO AVOID REPEATS
  tempPlanet = false;
  planetNumber--;

// this checks the fixed planet order, with the current
// if you delete some random planets, they'll get readded in the original order
  let fixedPlanetNumbers = []
  for (let i = 0; i < planets.length; i++){
    fixedPlanetNumbers.push(planets[i].number)
  }
  console.log(fixedPlanetNumbers);

  var a = []

  for (var i = 0; i < fixedPlanetNumbers.length; i++) {
      a[fixedPlanetNumbers[i]] = true;
  }

  for (var i = 0; i < fixedPlanetIndices.length; i++) {
      if (a[fixedPlanetIndices[i]]) {
          delete a[fixedPlanetIndices[i]];
      } else {
          a[fixedPlanetIndices[i]] = true;
      }
  }

  diff.length = 0;
  for (var i in a) {
      diff.push(i);
  }

  for (var i = 0; i < planets.length; i++) {
      oscillators[planets[i].number].volume.rampTo(-25, 0.05);
      oscillatorsDetune[planets[i].number].volume.rampTo(-25, 0.05);
  }

  for (let i = 0; i < diff.length; i++){
      console.log(diff[i])
    oscillators[diff[i]].volume.rampTo(-100, 0.05);
    oscillatorsDetune[diff[i]].volume.rampTo(-100, 0.05);
  }
  setTimeout(splicer, 10);
}

function splicer() {
  planetOptions.splice(tempPlanetIndex, 1);
  for (let i = 0; i < planetOptions.length; i++) {
    planetOptions[i].pos.x = width / 20;
    planetOptions[i].pos.y = i * height/planetOptions.length + height / (planetOptions.length*2) + 1;
  }
}

function planetAdd() {
  //planetOptions.length - 1 == planetNumber
  //planetNumber is increased at the en
  planetNumber++;
  let p = planetNumber;
  let d = diff[0];

  fmOsc = new Tone.FMOscillator({
    frequency: pitches[p],
    type: "sine",
    harmonicity: 1,
    modulationIndex: 0,
    modulationType: "square",
    volume: -25
  }).toDestination();

  fmOsc2 = new Tone.FMOscillator({
    frequency: pitches[p],
    type: "sine",
    harmonicity: 1,
    modulationIndex: 0,
    modulationType: "square",
    volume: -25
  }).toDestination();


  //let d = 1;
  // REORGANISE THIS CODE SO THAT P || D CAN BE USED ON THE SAME CODE
  if (diff.length == 0){
    tempPlanetAngle();
    tempPlanetEccentricity();
    // new model
    if (dist(width/2, height/2, mouseX, mouseY) < height/2) {
      console.log(eccentricityNewPlanet);

      planets.push(new Planet(mouseX, mouseY, planetRadii[p] * 2, planetColours[p], eccentricityNewPlanet, angleNewPlanet, p));
      planetOptions.push(new Planet(width / 20 - width / 2, p * height/p - height / 2 + height / (p*2) + 1, height/16, planetColours[p]));
      oscillators.push(fmOsc);
      oscillatorsDetune.push(fmOsc2);
      oscillators[p].start();
      oscillatorsDetune[p].start();
    } else {
      console.log("outOfBounds!")
      spaceClicked = false;
    }
  } else {
    oscillators[d].volume.rampTo(-25, 0.05);
    oscillatorsDetune[d].volume.rampTo(-25, 0.05);
    tempPlanetAngle();
    tempPlanetEccentricity();
    planets.splice(d, 0, new Planet(mouseX, mouseY, planetRadii[d] * 2, planetColours[d], eccentricityNewPlanet, angleNewPlanet, d));
    planetOptions.splice(d, 0, new Planet(width / 20 - width / 2, i * height/d - height / 2 + height / (d*2) + 1, height/16, planetColours[d]));
    diff.splice(0, 1);

    }

  if (planetNumber == fixedPlanetIndices.length) {
    maxPlanetNumber++;
    fixedPlanetIndices.push(maxPlanetNumber - 1);
  }

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
  tempPlanetAngle();
  tempPlanetEccentricity();
  if (moons[tempPlanetIndex].length < 3){
    moons[tempPlanetIndex].push(new Planet(mouseX, mouseY, planetRadii[2] * 2, moonColours, eccentricityNewPlanet, angleNewPlanet));
  }
}

function createTempPlanet(){
  tempPlanetPulse();
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
  if (mouseY > height - height/10){
    fill(255, 0, 0, 50);
  } else {
  fill(tempPlanetSpecs[1][0], tempPlanetSpecs[1][1], tempPlanetSpecs[1][2], 100)
  }
  ellipse(mouseX - xOffset, mouseY - yOffset, tempPlanetSpecs[0] + pulsing*5);
}

function tempPlanetAngle(){
  translate(width/2, height/2);
  let v2 = createVector(width/2, 0);
  let v1 = createVector(mouseX - width/2, mouseY - height/2);
  let angleBetween = v1.angleBetween(v2);
  if (angleBetween < 0) {
    angleNewPlanet = angleBetween  + TWO_PI;
  } else {angleNewPlanet = angleBetween};
}

function tempPlanetEccentricity() {
  let d = dist(width/2, height/2, mouseX, mouseY);
  let dSq = Math.sqrt(d);
  eccentricityNewPlanet = map(dSq, 0, height/2, 2.3, -25);
}

class Planet {

  constructor(x, y, r, c, e, a, n){
    //set X and Y coordinates on unit circle accordingly
    this.velX = cos(a);
    this.velY = sin(a);
    // set coordinates to planet pos
    this.pos = createVector(x, y);
    // set initial ang velocity based on initial angle
    this.vel = createVector(e * this.velY, e * this.velX);
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

class Sun {
   constructor(x, y) {
     this.pos = createVector(x, y);
     this.mass = 330;
     this.r = this.mass / 10;
     this.g = 1;
   }

   show() {
    noStroke();
    fill(245, 214, 38, 150);
    ellipse(this.pos.x, this.pos.y, this.r*2);
   }

   attract(planet){
     let force = p5.Vector.sub(this.pos, planet.pos);
     let distanceSq = force.magSq();
     let strength = this.g * (this.mass * planet.mass) / distanceSq;
     force.setMag(strength);
     planet.applyForce(force);
     }
}
