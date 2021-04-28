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
let moonMode = false, solarSystemMode = false;
let started = false;
let breakMe = false;
let fade = 155; let fade2 = 155
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
let tremoloMap = 1;
let tempMoonIndex;
let diff = [];
let eccentricityNewPlanet;
let tremolo;
let pan;
let panMap = 0;
let panners = [];
let tremolos = [];
  let volDistance = [];
  let volMap = [];
  let stars = [];
  let partials = 10;
  let xx = 0
  let xxs = []
  let chorusValue = 0, chorusTrigger = false, chorusButton, chorusX, chorusY, chorusR, chorusAlpha = 100;
  let helpTrigger = false, helpButton, helpX, helpY, helpR, helpAlpha = 100;
let boundary, boundaryR;
let newPlanet;
let screenZero = false, screenOne = false, screenTwo = false, screenThree = false, screenFour = false, screenFive = false, screenSix = false;

const channel = new Tone.Channel({
  volume: 0
}).toDestination();
let panner //= new Tone.Panner(xx).toDestination();
//const reverb = new Tone.Chorus(4, 2.5, 1).connect(channel);



//panner.panningModel = 'HRTF'


function preload() {
  binIcon = loadImage('bin.png');
  helpIcon = loadImage('help.png');
}
function setup(){
  createCanvas(windowWidth, windowHeight);
  planetNumber = -1;
  //pixelDensity(1);
  sun = new Sun(width/2, height/2);
  for (let i = 0; i < width/30; i++) {
    stars[i] = new Star(random(0, width), random(0, height), random(1, 2));
  }
}

function startScreen() {
    if (started == false) {
    graphics();
    sun.glow();
    sun.show();
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
  textSize(height/35);
  textAlign(CENTER, CENTER);
  textFont('Georgia');
  welcomeText = text("Touch to Begin", width/2, height/2.5);
  textSize(width/15);
  titleText = text("Harmony of the Spheres", width/2, height/4);
}

let fader = false;
let textIsOnscreen = false;

function planetAddedText() {
    fill(250, fade2);
    //let planetAddText = text("Planet Added", width/2, height - 30);
      setTimeout(textFade, 600)
    if (textIsOnscreen == false){
      textIsOnscreen = true;
      setTimeout(textOff, 1100);
    }
}

function textOff() {
    fader = false;
    fade2 = 105;
    newPlanet = false;
    textIsOnscreen = false;
}

function textFade() {
    fader = true;
    fade2 -= 5;
}


function draw(){
  background(45, 35, 35);
  startScreen();
  //show sun + stars
  for (let i = 0; i < stars.length; i++) {
    stars[i].show();
  }
// if we're in solar system mode
  if (solarSystemMode){
    solarSystemDraw();
  }
// if we're in moon mode
  if (moonMode) {
    moonModeDraw();
  }
//help mode screen
  if (helpTrigger) {
    helpModeDraw();
  }
// sound synthesis + effects control
  timbralProperties();
// show left hand planets menu
  for (i = 0; i < planetOptions.length; i++) {
    planetOptions[i].showOptions();
    options();
  }

  buttons();
  push();
  fill(255, 3);
  stroke(255, 8);
  strokeWeight(2);
  boundaryR = height - 40
  boundary = ellipse(width/2, height/2, boundaryR);
  pop();

  for (let t = 0; t < planets.length; t++){
    for(let i = 1; i < planets.length - 1; i++){
      //console.log(i);

      if (dist(planets[t].pos.x, planets[t].pos.y, planets[i].pos.x, planets[i].pos.y) < (planets[t].r + planets[i].r)){
        //console.log('overlap');
      }
     // if (dist(mouseX, mouseY, planets[t].pos.x, planets[t].pos.y) < planets[t].r){
     //   if (!tempPlanet){
     //     planets.splice(t, 1);
     //     timer();
     //  }
    }
  }
}

function timbralProperties() {
  //map tremolo to second moon
  if (moons[tempPlanetIndex].length > 1){
    let tremoloDistance = dist(moons[tempPlanetIndex][1].pos.x, moons[tempPlanetIndex][1].pos.y, sun.pos.x, sun.pos.y);
    tremoloMap = map(tremoloDistance, 0, width/2, 0.99, 1.04)
    }
  //map chorus to third moon
  if (moons[tempPlanetIndex].length > 2){
    let panDistance = dist(moons[tempPlanetIndex][2].pos.x, moons[tempPlanetIndex][2].pos.y, sun.pos.x, sun.pos.y);
    partials = round(map(panDistance, 0, width/2, 10, 100));
    }
  //map modulation index to first moon
  if (moons[tempPlanetIndex].length > 0){
    let modDistance = dist(moons[tempPlanetIndex][0].pos.x, moons[tempPlanetIndex][0].pos.y, sun.pos.x, sun.pos.y);
    modulationIndexMap = map(modDistance, 0, width/2, 0, 4);
  }
  //assign mappings to values
  if (moons[tempPlanetIndex].length > 0) {
    oscillators[tempPlanetIndex].modulationIndex.value = modulationIndexMap;
    oscillators[tempPlanetIndex].harmonicity.value = tremoloMap;
    oscillators[tempPlanetIndex].modulationType = `square${partials}`;
    //console.log(oscillators[tempPlanetIndex].modulationType);
    //panners[tempPlanetIndex].feedback.value = panMap;
    //panners[tempPlanetIndex].depth = panMap;
    //tremolos[tempPlanetIndex].decay.value = tremoloMap;
  }
}

function solarSystemDraw() {
  textSize(height/30)
  fill(255, 150);
  textAlign(CENTER, CENTER);
  text("Solar System", width/2, 30);
  sun.show();
  sun.glow();
//move, show and apply gravitational force to planets
  for (let i = 0; i < planets.length; i++) {
    planets[i].show();
    planets[i].move();
    planets[i].angleFind();
    sun.attract(planets[i]);
//REALLY BUGGY HOMIE
    if (planets[i].pos.x > width || planets[i].pos.x < 0) {
      planetOutOfBounds();
    } else if (planets[i].pos.y > height || planets[i].pos.y < 0) {
      planetOutOfBounds();
    }
    //console.log(freq);
  //xxs[i] = planets[i].pos.x - width/2;
  //console.log(xx);
  //console.log(xx/400);
   //panners[i].pan.value = xxs[i]/300;
  }
  //freqModBodge();
  //move + apply gravitational force to moons, but don't show . . .
  //this keeps the moons moving behind the scenes
  //moving moons means moving timbre!
  if (moons.length > 0){
    for (j = 0; j < moons.length; j++){
      if (moons[j].length > 0){
        for (i = 0; i < moons[j].length; i++) {
          moons[j][i].move();
          sun.attract(moons[j][i]);
        }
      }
    }
  }
// create a temporary planet to replace existing one
  if (tempPlanet == true) {
    createTempPlanet();
  }
  if (newPlanet == true) {
    planetAddedText()
  }
}

function helpModeDraw() {
  //console.log(screenTwo);
  fill(50, 155);
  gradient = rect(0, 0, width, height);
  if (screenOne && moonMode) {
    fill(255)
    textAlign(LEFT, CENTER);
    text("Return to Solar System", planetOptions[tempPlanetIndex].pos.x + planetOptions[tempPlanetIndex].r/2 + 10, planetOptions[tempPlanetIndex].pos.y);
    noFill();
    for (let i = 0; i < 20; i++){
      stroke(255, 155 - (i * 10));
      strokeWeight(1);
      ellipse(planetOptions[tempPlanetIndex].pos.x, planetOptions[tempPlanetIndex].pos.y, planetOptions[tempPlanetIndex].r + 10 + (i + 1))
    }
  } else if (screenOne){
    fill(255)
    text('Touch to Add More Planets to the Solar System', width/2, height/4);
    noFill();
    for (let i = 0; i < 20; i++){
      stroke(255, 155 - (i * 10));
      strokeWeight(1);
      ellipse(width/2, height/4 + 60, 50 + (i + 1))
    }
  }
  if (screenTwo) {
    fill(255)
    textAlign(LEFT, CENTER);
    text("Take a Closer Look at One of the Planets", planetOptions[1].pos.x + planetOptions[1].r/2 + 20, planetOptions[1].pos.y);
    noFill();
    for (let i = 0; i < 20; i++){
      stroke(255, 155 - (i * 10));
      strokeWeight(1);
      ellipse(planetOptions[1].pos.x, planetOptions[1].pos.y, planetOptions[1].r + 10 + (i + 1))
    }
  }
  if (screenThree) {
    fill(255)
    textAlign(CENTER, CENTER);
    text("Add Moons to Change this Planet's Sound", width/2, height/4);
    noFill();
    for (let i = 0; i < 20; i++){
      stroke(255, 155 - (i * 10));
      strokeWeight(1);
      ellipse(width/2, height/4 + 60, 50 + (i + 1))
    }
  }
  if (screenFour) {
    fill(255);
    text("Drag Moons Away from Planet in the Centre to Increase Effect", width/2, height/4);
    noFill();
    for (let i = 0; i < 20; i++){
      stroke(255, 155 - (i * 10));
      strokeWeight(1);
      ellipse(moons[tempPlanetIndex][0].pos.x, moons[tempPlanetIndex][0].pos.y, moons[tempPlanetIndex][0].r + 10 + (i + 1))
    }
  }
  if (screenFive) {
    fill(255)
    textAlign(LEFT, CENTER);
    text("Return to Solar System", planetOptions[1].pos.x + planetOptions[1].r/2 + 20, planetOptions[1].pos.y);
    noFill();
    for (let i = 0; i < 20; i++){
      stroke(255, 155 - (i * 10));
      strokeWeight(1);
      ellipse(planetOptions[1].pos.x, planetOptions[1].pos.y, planetOptions[1].r + 10 + (i + 1))
    }
  }
  if (screenSix) {
    helpTrigger = false;
    screenSix = false;
  }
}

function helpModeClick() {
  if(screenFive && dist(mouseX, mouseY, planetOptions[1].pos.x, planetOptions[1].pos.y) < planetOptions[1].r) {
    screenFive = false;
    screenSix = true;
  }
  if (screenFour) {
    screenFive = true;
    screenFour = false;
  }
  if (screenThree && spaceClicked) {
    screenFour = true;
    screenThree = false;
  }
  if (screenTwo && dist(mouseX, mouseY, planetOptions[1].pos.x, planetOptions[1].pos.y) < planetOptions[1].r) {
    screenThree = true;
    screenTwo = false;
  }
  if (screenOne && spaceClicked) {
    screenTwo = true;
    screenOne = false;
  }
  if (screenZero) {
    screenOne = true;
    screenZero = false;
  }
}

function planetOutOfBounds() {
  planetNumber--;
  planets.splice(i, 1);
// rearrange planet menu on left
  planetOptions.splice(tempPlanetIndex, 1);
  planetOptionsOrganize();
}

function freqModBodge() {
    for (let i = 0; i < planets.length; i++) {
      let distances = [];
      distances[i] = (dist(planets[i].pos.x, planets[i].pos.y, width/2, height/2));

      distMap = map(distances[i], 0, width/2, -20, 20);
      //console.log(distMap);
      let freq = pitches[i];
      freq = freq + distMap;
      oscillators[i].frequency.value = freq
    }
}

function moonModeDraw() {
  textSize(height/30)
  fill(255, 150);
  textAlign(CENTER, CENTER);
  text("Planet Mode", width/2, 30);
  //replace sun with selected planet
  fill(tempPlanetSpecs[1][0], tempPlanetSpecs[1][1], tempPlanetSpecs[1][2]);
  ellipse(sun.pos.x, sun.pos.y, sun.r*2);
  //move, show and apply gravitational force to moons
   for (i = 0; i < moons[tempPlanetIndex].length; i++) {
       moons[tempPlanetIndex][i].show();
       moons[tempPlanetIndex][i].move();
       sun.attract(moons[tempPlanetIndex][i]);
   }
}

function options() {
  //applies alpha to planets menu if hovering when using mouse
  for (let i = 0; i < planetOptions.length; i++){
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r){
      planetOptions[i].optionAlpha = 150;
    } else if (moonMode) {
      planetOptions[tempPlanetIndex].optionAlpha = 150;
      planetOptions[i].optionAlpha = 50;
    } else {
      planetOptions[i].optionAlpha = 50;
    }
  }
}

function buttons() {
    fill(150, chorusAlpha);
    chorusX = width - 60;
    chorusY = height/2;
    chorusR = height/32;
    chorusButton = ellipse(chorusX, chorusY, chorusR*2);

    fill(150, helpAlpha/2);
     helpX = width - 60;
     helpY = height - 40;
     helpR = height/32;
     helpButton = ellipse(helpX, helpY, helpR*2);
     imageMode(CENTER);
     image(helpIcon, helpX, helpY, helpR * 1.5, helpR * 1.5);
     if (helpTrigger == false){
       helpButton = ellipse(helpX, helpY, helpR*2);
     }
}


function mouseDragged(){
// delete dragged planet, replace with temporary one
  if (solarSystemMode && dragging == true){
    for (let i = 0; i < planets.length; i++){
      if (dist(mouseX, mouseY, planets[i].pos.x, planets[i].pos.y) < planets[i].r){
        if (!tempPlanet){
          planets.splice(i, 1);
          setTimeout(timer, 10);
        }
      }
    }
  }
// drag moon
  if (moonMode && dragging == true){
    for (let i = 0; i < moons[tempPlanetIndex].length; i++){
      if (dist(mouseX, mouseY, moons[tempPlanetIndex][i].pos.x, moons[tempPlanetIndex][i].pos.y) < moons[tempPlanetIndex][i].r){
        moons[tempPlanetIndex][i].pos.x = mouseX - xOffset;
        moons[tempPlanetIndex][i].pos.y = mouseY - yOffset;
        tempMoon = true;
      }
    }
  }
}

function timer() {
  if (solarSystemMode) {
    tempPlanet = true;
  }
}

function touchStarted() {
//begin interface with touch
  Tone.start();
    if (started == false) {
    //Tone.js doesn't always begin first time round (particularly ...
    // ... on touch devices) so, it is started for a second time
      started = true;
      Tone.start();
      solarSystemMode = true;
    }
// if a planet on the left menu is clicked
    planetOptionsClick();
// if a planet is clicked
    planetClick();
// if a moon is clicked
    moonClick();
// if a button on the right is clicked
    buttonClick();
// if sun is clicked, do not add planet as it otherwise flies away
    constraint();
// if a random space is touched, add planet or moon
    helpModeClick();
    if (spaceClicked && planets.length < 8 && solarSystemMode) {
      planetAdd();
    }
    if (spaceClicked && moonMode) {
      moonAdd();
    }
    if (started == true) {
      return false;
    }
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


function timerDrag() {
  if (dragging || mouseIsPressed) {
  } else {
    moonMode = true;
    solarSystemMode = false;
    spaceClicked = false;
  }
}

function constraint() {
  if (dist(mouseX, mouseY, sun.pos.x, sun.pos.y) < sun.r*1.5 && solarSystemMode){
    alert("Try Clicking Around the Sun Instead!");
    spaceClicked = false;
  }
  if (dist(mouseX, mouseY, sun.pos.x, sun.pos.y) < sun.r*1.5 && moonMode){
    alert("Try Clicking Around the Planet Instead!");
    spaceClicked = false;
  }
  if (dist(mouseX, mouseY, sun.pos.x, sun.pos.y) > boundaryR/2 && spaceClicked == true){
    alert("Out of Bounds!");
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
        tempMoonIndex = t;
        xOffset = mouseX - moons[tempPlanetIndex][t].pos.x;
        yOffset = mouseY - moons[tempPlanetIndex][t].pos.y;
        spaceClicked = false;
        dragging = true;
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
      //maybe this'll need fixing, deleting values for specific moon mode
      tremoloMap = 1;
      partials = 10;
      for (var o = 0; o < planets.length; o++) {
          oscillators[planets[o].number].volume.rampTo(-25, 0.05);
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
          oscillators[tempPlanetIndex].volume.rampTo(-20, 0.05);
      }
      //maybe delete
      tremoloMap = 1;
      partials = 10;
    }
  }
}

function buttonClick() {
  if (helpTrigger == false && dist(mouseX, mouseY, helpX, helpY) < helpR){
    helpTrigger = true;
    helpMode = true;
    spaceClicked = false;
    screenZero = true;
    helpAlpha = 255*2;
  } else if (dist(mouseX, mouseY, helpX, helpY) < helpR) {
    helpTrigger = false;
    spaceClicked = false;
    helpAlpha = 100;
    screenZero = false, screenOne = false, screenTwo = false, screenThree = false, screenFour = false, screenFive = false, screenSix = false;
  }
  if (chorusTrigger == false && dist(mouseX, mouseY, chorusX, chorusY) < chorusR){
    chorusTrigger = true;
    chorus.depth = 0.8
    spaceClicked = false;
    chorusAlpha = 255
  } else if (dist(mouseX, mouseY, chorusX, chorusY) < chorusR) {
    chorusTrigger = false;
    chorus.depth = 0
    spaceClicked = false;
    chorusAlpha = 100;
  }
}

function planetReleased() {
  if (tempPlanet == true && mouseY > height - height/10) {
      planetDelete();
      tempPlanetSpecs.length = 0;
  } else if (tempPlanet == true) {
      resetPlanet();
  }
  spaceClicked = false;
}

function moonReleased() {
  if (tempMoon == true && mouseY > height - height/10) {
      moonDelete();
  } else if (tempMoon) {
      resetMoon();
  }
  spaceClicked = false;
}

function resetPlanet() {
// push a new planet into the planets array, with the same specs as the one spliced
  tempPlanet = false;
  dragging = false;
  tempPlanetAngle();
  tempPlanetEccentricity();
  planets.splice(tempPlanetIndex, 0, new Planet(mouseX - xOffset, mouseY - yOffset, tempPlanetSpecs[0], tempPlanetSpecs[1], eccentricityNewPlanet, angleNewPlanet, tempPlanetNumber));
}

// this.velY = cos(this.angle);
// this.velX = sin(this.angle);
// // set coordinates to planet pos
// this.pos = createVector(x, y);
// // set initial ang velocity based on initial angle
// this.vel = createVector(this.eccentricity * this.velX, this.eccentricity * this.velY

function resetMoon() {
  tempMoon = false;
  tempPlanetAngle();
  tempPlanetEccentricity();
  //moons[tempPlanetIndex][tempMoonIndex].eccentricity = eccentricityNewPlanet;
  moons[tempPlanetIndex][tempMoonIndex].vel.x = sin(angleNewPlanet) * eccentricityNewPlanet;
  moons[tempPlanetIndex][tempMoonIndex].vel.y = cos(angleNewPlanet) * eccentricityNewPlanet;

  //moons[tempPlanetIndex].push(new Planet(mouseX - xOffset, mouseY - yOffset, planetRadii[2] * 2, moonColours, eccentricityNewPlanet, angleNewPlanet));
  console.log(moons[tempPlanetIndex][tempMoonIndex].angle)
}

function planetDelete() {
  tempPlanet = false;
  planetNumber--;
// this checks the fixed planet order
// i.e if you delete random planets, they'll get readded in the original order
  planetOrderLogger();
// ensure other planets are at -25dB
  for (var i = 0; i < planets.length; i++) {
      oscillators[planets[i].number].volume.rampTo(-25, 0.05);
  }
// mute the deleted planet's oscillator
  for (let i = 0; i < diff.length; i++){
    oscillators[diff[i]].volume.rampTo(-100, 0.05);
  }
// rearrange planet menu on left
  planetOptions.splice(tempPlanetIndex, 1);
  planetOptionsOrganize();
}

function planetOrderLogger() {
  let fixedPlanetNumbers = []
  for (let i = 0; i < planets.length; i++){
    fixedPlanetNumbers.push(planets[i].number)
  }
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
}

function moonDelete() {
  moons[tempPlanetIndex].splice(tempMoonIndex, 0);
  tempMoon = false;
}

function planetAdd() {
  planetNumber++;
  let p = planetNumber;
  let d = diff[0];
  let maxDist = dist(width/2, height/2, mouseX, mouseY)
  //angle of velocity to be passed to a new planet
  tempPlanetAngle();
  //eccentricity offset for new planet
  tempPlanetEccentricity();

  // if delted planets bank is empty, add new planets
  if (diff.length == 0){
    planets.push(new Planet(mouseX, mouseY, planetRadii[p] * 2, planetColours[p], eccentricityNewPlanet, angleNewPlanet, p));
    planetOptions.push(new Planet(width / 20 - width / 2, p * height/p - height / 2 + height / (p*2) + 1, height/16, planetColours[p]));
    loadSounds(p);
    startSounds(p);
    newPlanet = true;
  //else re-add from deleted planets bank
  } else {
    oscillators[d].volume.rampTo(-25, 0.05);
    planets.splice(d, 0, new Planet(mouseX, mouseY, planetRadii[d] * 2, planetColours[d], eccentricityNewPlanet, angleNewPlanet, d));
    planetOptions.splice(d, 0, new Planet(width / 20 - width / 2, i * height/d - height / 2 + height / (d*2) + 1, height/16, planetColours[d]));
    diff.splice(0, 1);
    }

  //cOME BACK T THIS!!!!!
  if (planetNumber == fixedPlanetIndices.length) {
    maxPlanetNumber++;
    fixedPlanetIndices.push(maxPlanetNumber - 1);
  }

  //reorganizes planets menu button on the left hand side
  planetOptionsOrganize();
}

function planetOptionsOrganize() {
  for (let i = 0; i < planetOptions.length; i++) {
     planetOptions[i].pos.x = 30;
     planetOptions[i].pos.y = i * height/planetOptions.length + height / (planetOptions.length*2) + 1;
  }
}

function moonAdd() {
  let moonNumber = moons.length;
  //angle of velocity to be passed to a new moon
  tempPlanetAngle();
  //eccentricity offset for new moon
  tempPlanetEccentricity();
  if (moons[tempPlanetIndex].length < 3){
    moons[tempPlanetIndex].push(new Planet(mouseX, mouseY, planetRadii[2] * 2, moonColours, eccentricityNewPlanet, angleNewPlanet));
  }
}
let chorus = new Tone.Chorus(2, 1.5, 0).toDestination().start();
// let reverb = new Tone.Freeverb({
//   decay: 2,
//   wet: 0
// }).toDestination();

function loadSounds(p) {
  fmOsc = new Tone.FMOscillator({
    frequency: pitches[p],
    type: "sine",
    harmonicity: 1,
    modulationIndex: 0,
    modulationType: `square${partials}`,
    volume: - Infinity
  });
  //reverb = new Tone.Chorus(6, 1).toDestination().start();

}

function startSounds(p) {
  oscillators.push(fmOsc);

  //tremolos.push(tremolo);
  panners.push(panner);
  //oscillators[p].connect(tremolos[p]);

  //oscillators[p].connect(chorus);
  oscillators[p].connect(chorus);
  //oscillators[p].connect(reverb);


  oscillators[p].volume.rampTo(-25, 0.05);
  //oscillators[p].();
  oscillators[p].start();
}

function createTempPlanet(){
  showBin();
  //temp planet pulses
  let pulsing = sin(pulse += 0.05);
  //if planet is in bin change colour to red, else remain as is
  if (mouseY > height - height/10){
    fill(255, 0, 0, 50);
  } else {
  fill(tempPlanetSpecs[1][0], tempPlanetSpecs[1][1], tempPlanetSpecs[1][2], 100)
  }
  //temp planet
  ellipse(mouseX - xOffset, mouseY - yOffset, tempPlanetSpecs[0] + pulsing*5);
}

function createTempMoon() {
  showBin();
  //temp moon pulses
  let pulsing = sin(pulse += 0.05);
  //if moon is in bin change colour to red, else remain as is
  if (mouseY > height - height/10){
    fill(255, 0, 0, 50);
  } else {
  fill(moonColours[0], moonColours[1], moonColours[2]);
  }
  //temp moon
  ellipse(mouseX - xOffset, mouseY - yOffset, planetRadii[2]*2 + pulsing*5);
}

function showBin(){
  //bin image
  imageMode(CENTER);
  image(binIcon, width/2, height - 20, 30, 30);
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
  // let d = dist(width/2, height/2, mouseX, mouseY);
  // let dSr = Math.sqrt(d);
  // eccentricityNewPlanet = map(dSr, height/2, 0, height/2, 0);
  // eccentricityNewPlanet = map(eccentricityNewPlanet, 0, height/2, 3, -40);
  // console.log(eccentricityNewPlanet)
  //eccentricityNewPlanet = map(dSq, 0, height/2, height/331.3, -(height/30.48));
  //translate(width/2, height/2);
  let v1 = dist(width/2, height/2, mouseX, mouseY);
  v1 = Math.sqrt(v1);
  eccentricityNewPlanet = map(v1, 0, height/2, 2, -20)
}

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
  //(TOO CLOSE TO SUN REPLACMENT
  //MOON ADDED!
  //PLANET ADDED!
  //drag instructions
  //Infromation button as well!
  //menu bug!!

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

class Star {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  show() {
    //directionalLight(250, 250, 250, width/2, -height/2, -1);
    noStroke();
    fill(114);
    ellipse(this.x, this.y, this.r*2);
  }
}
