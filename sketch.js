// // Harmony of the Spheres Draft
// // Nathan Ó Maoilearca 2021

//visuals

let sun, planets = [], radii = [], moons = [[], [], [], [], [], [], [], []], e = [15.36, 14.01, 12.98, 12.14, 11.45, 10.86, 10.35, 10.15] /*15.36*/, planetRadii = [10, 15, 25, 20, 40, 35, 30, 27],
planetColours = [[233, 163, 100], [216, 157, 145], [15, 92, 166], [191, 54, 27], [143, 105, 64], [217, 177, 56], [121, 183, 224], [38, 104, 148]], moonColours = [175, 174, 175];
let planetNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']
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
  let reverbValue = 0, reverbTrigger = false, reverbButton, reverbX, reverbY, reverbR, reverbAlpha = 100, reverbFade;
  let helpTrigger = false, helpButton, helpX, helpY, helpR, helpAlpha = 100;
  let infoTrigger = false, infoX, infoY, infoR, infoAlpha = 100;
let boundary, boundaryR;
let newPlanet;
let screenZero = false, screenOne = false, screenTwo = false, screenThree = false, screenFour = false, screenFive = false, screenSix = false;
let boundaryAlpha = 3;
let hoverClick = false;

const channel = new Tone.Channel({
  volume: 0
}).toDestination();
let panner //= new Tone.Panner(xx).toDestination();
//const reverb = new Tone.Chorus(4, 2.5, 1).connect(channel);



//panner.panningModel = 'HRTF'


function preload() {
  binIcon = loadImage('bin.png');
  helpIcon = loadImage('help.svg');
  infoIcon = loadImage('info.svg');
  buttonBorder = loadImage('buttonBorder.svg');
}
function setup(){
  createCanvas(windowWidth, windowHeight);
  planetNumber = -1;
  //pixelDensity(1);
  for (let i = 0; i < width/30; i++) {
    stars[i] = new Star(random(0, width), random(0, height), random(1, 2));
  };
  sun = new Sun(width/2, height/2);
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
  welcomeText = text("Please Use Headphones", width/2, height/2.9);
  push();
  stroke(255, fade);
  line(width/2 - width/10, height/2.7, width/2 + width/10, height/2.7);
  pop();
  welcomeText = text("Touch Around the Sun to Begin", width/2, height/2.5);
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
  buttons();
  //buttonsHighlight();
// sound synthesis + effects control
  timbralProperties();
// show left hand planets menu
  for (i = 0; i < planetOptions.length; i++) {
    planetOptions[i].showOptions();
    options();
  }
  push();
  fill(255, boundaryAlpha);
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
  if (infoTrigger) {
    infoModeDraw();
  }
}

function timbralProperties() {
  //map tremolo to second moon
  //map chorus to third moon
  if (moonMode){
    if (moons[tempPlanetIndex].length > 2){
      let panDistance = dist(moons[tempPlanetIndex][2].pos.x, moons[tempPlanetIndex][2].pos.y, sun.pos.x, sun.pos.y);
      partials = round(map(panDistance, 0, width/2, 10, 100));
      oscillators[tempPlanetIndex].modulationType = `square${partials}`;
      let tremoloDistance = dist(moons[tempPlanetIndex][1].pos.x, moons[tempPlanetIndex][1].pos.y, sun.pos.x, sun.pos.y);
      tremoloMap = map(tremoloDistance, 0, width/2, 0.99, 1.04);
      oscillators[tempPlanetIndex].harmonicity.value = tremoloMap;
      let modDistance = dist(moons[tempPlanetIndex][0].pos.x, moons[tempPlanetIndex][0].pos.y, sun.pos.x, sun.pos.y);
      modulationIndexMap = map(modDistance, 0, width/2, 0, 4);
      oscillators[tempPlanetIndex].modulationIndex.value = modulationIndexMap;
    } else if (moons[tempPlanetIndex].length > 1){
      let tremoloDistance = dist(moons[tempPlanetIndex][1].pos.x, moons[tempPlanetIndex][1].pos.y, sun.pos.x, sun.pos.y);
      tremoloMap = map(tremoloDistance, 0, width/2, 0.99, 1.04);
      oscillators[tempPlanetIndex].harmonicity.value = tremoloMap;
      let modDistance = dist(moons[tempPlanetIndex][0].pos.x, moons[tempPlanetIndex][0].pos.y, sun.pos.x, sun.pos.y);
      modulationIndexMap = map(modDistance, 0, width/2, 0, 4);
      oscillators[tempPlanetIndex].modulationIndex.value = modulationIndexMap;
      oscillators[tempPlanetIndex].modulationType = `square${10}`;
    } else if (moons[tempPlanetIndex].length > 0){
      let modDistance = dist(moons[tempPlanetIndex][0].pos.x, moons[tempPlanetIndex][0].pos.y, sun.pos.x, sun.pos.y);
      modulationIndexMap = map(modDistance, 0, width/2, 0, 4);
      oscillators[tempPlanetIndex].modulationIndex.value = modulationIndexMap;
      oscillators[tempPlanetIndex].modulationType = `square${10}`;
      oscillators[tempPlanetIndex].harmonicity.value = 1;
    } else if (moons[tempPlanetIndex].length == 0){
      oscillators[tempPlanetIndex].modulationIndex.value = 0;
      oscillators[tempPlanetIndex].modulationType = `square${10}`;
      oscillators[tempPlanetIndex].harmonicity.value = 1;
    }
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
    // if (planets[i].pos.x > width || planets[i].pos.x < 0) {
    //   planetOutOfBounds();
    // } else if (planets[i].pos.y > height || planets[i].pos.y < 0) {
    //   planetOutOfBounds();
    // }
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
  }
  if (screenOne && solarSystemMode){
    fill(255)
    text('Touch to Add More Planets to the Solar System', width/2, height/4);
    noFill();
    boundaryAlpha = 25;
  }
  if (screenTwo) {
    fill(50, 155);
    gradient = rect(0, 0, width, height);
    fill(255)
    textAlign(LEFT, CENTER);
    text("Take a Closer Look at One of the Planets", planetOptions[0].pos.x + planetOptions[0].r/2 + 20, height/2);
    noFill();
    boundaryAlpha = 3;
    for (let j = 0; j < planetOptions.length; j++){
      for (let i = 0; i < 20; i++){
        stroke(255, 155 - (i * 10));
        strokeWeight(1);
        ellipse(planetOptions[j].pos.x, planetOptions[j].pos.y, planetOptions[j].r + 10 + (i + 1))
      }
    }
  }
  if (screenThree) {
    fill(255)
    textAlign(CENTER, CENTER);
    text("Add Moons to Change this Planet's Sound", width/2, height/4);
    noFill();
    boundaryAlpha = 25;
  }
  if (screenFour) {
    fill(255);
    text("Drag Moons Away from Planet in the Centre to Increase Effect", width/2, height/4);
    noFill();
  }
  if (screenFive) {
    fill(50, 155);
    gradient = rect(0, 0, width, height);
    fill(255)
    textAlign(LEFT, CENTER);
    text("Return to Solar System", planetOptions[tempPlanetIndex].pos.x + planetOptions[tempPlanetIndex].r/2 + 20, planetOptions[tempPlanetIndex].pos.y);
    noFill();
    boundaryAlpha = 3;
    for (let i = 0; i < 20; i++){
      stroke(255, 155 - (i * 10));
      strokeWeight(1);
      ellipse(planetOptions[tempPlanetIndex].pos.x, planetOptions[tempPlanetIndex].pos.y, planetOptions[tempPlanetIndex].r + 10 + (i + 1))
    }
  }
  if (screenSix) {
    helpTrigger = false;
    screenSix = false;
  }
}

function infoModeDraw() {
  fill(50, 245);
  gradient = rect(0, 0, width, height);

  fill(215, 255);
  textAlign(CENTER, CENTER);
  textSize(height/16);
  text("Harmony of the Spheres is a digital musical instrument which revisits the age-old relationship between music and the cosmos", width/8, height/8, width/2 + width/4);
  textSize(height/22);
  text("In Ancient Greece, Pythagoras and his followers believed that the motion of each planet produced a musical note. The planets combined to create a divine harmonic instrument. Create your own Harmony of the Spheres in this virtual Solar System", width/8, height/2, width/2+width/4);
  push();
  rectMode(CENTER);
  rect(width/2, height - height/10, width/15, height/20, 10);
  fill(55);
  textSize(width/60);
  text('OK!', width/2, height - height/10)
  pop();
}

function buttonsHighlight() {
  if (started){
    push();
    textAlign(RIGHT, CENTER);
    fill(255, 150);
    if (dist(mouseX, mouseY, helpX, helpY) < helpR){
      helpAlpha = 255;
      text('Help', helpX - helpR*1.3, helpY);
    } else if (helpTrigger == false && dist(mouseX, mouseY, helpX, helpY) > helpR) {
      helpAlpha = 100;
    }
    if (dist(mouseX, mouseY, infoX, infoY) < infoR){
      infoAlpha = 255;
      text('Info', infoX - infoR*1.3, infoY);
    } else if (dist(mouseX, mouseY, infoX, infoY) > infoR) {
      infoAlpha = 100;
    }
    if (dist(mouseX, mouseY, chorusX, chorusY) < chorusR){
      chorusAlpha = 255;
      text('Chorus', chorusX - chorusR*1.3, chorusY);
    } else if (chorusTrigger == false && dist(mouseX, mouseY, chorusX, chorusY) > chorusR) {
      chorusAlpha = 100;
    }
    if (dist(mouseX, mouseY, reverbX, reverbY) < reverbR){
      reverbAlpha = 255
      text('Stereo Reverb', reverbX - reverbR*1.3, reverbY);
    } else if (reverbTrigger == false && dist(mouseX, mouseY, reverbX, reverbY) > reverbR) {
      reverbAlpha = 100;
    }
    pop();
  }
}

let helpCount = 0;

function helpModeClick() {
  if(screenFive && dist(mouseX, mouseY, planetOptions[tempPlanetIndex].pos.x, planetOptions[tempPlanetIndex].pos.y) < planetOptions[tempPlanetIndex].r) {
    screenFive = false;
    screenSix = true;
    helpAlpha = 100;
  }
  if (screenFour) {
    helpCount++
    if (helpCount > 1){
      screenFive = true;
      screenFour = false;
    }
  }
  if (screenThree &&
    dist(mouseX, mouseY, width/2, height/2) < boundaryR/2 &&
    dist(mouseX, mouseY, width/2, height/2) > sun.r) {
    screenFour = true;
    screenThree = false;
  }
  if (screenTwo) {
    for (let i = 0; i < planetOptions.length; i++){
      if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r) {
        screenThree = true;
        screenTwo = false;
      }
    }
  }
  if (screenOne && spaceClicked && moonMode) {
    screenOne = true;
  }
  if (screenOne && solarSystemMode &&
    dist(mouseX, mouseY, width/2, height/2) < boundaryR/2 &&
    dist(mouseX, mouseY, width/2, height/2) > sun.r*1.5) {
    console.log(boundaryR);
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

let alertCount = 0;
function moonModeDraw() {
  textSize(height/30)
  fill(255, 150);
  textAlign(CENTER, CENTER);
  text('Planet Mode', width/2, 30);
  //replace sun with selected planet
  fill(tempPlanetSpecs[1][0], tempPlanetSpecs[1][1], tempPlanetSpecs[1][2]);
  ellipse(sun.pos.x, sun.pos.y, sun.r*2);
  //move, show and apply gravitational force to moons
   for (i = 0; i < moons[tempPlanetIndex].length; i++) {
      moons[tempPlanetIndex][i].show();
      moons[tempPlanetIndex][i].glow();
      if (moons[tempPlanetIndex][i].pos.x > width*1.2 || moons[tempPlanetIndex][i].pos.x < -20
      || moons[tempPlanetIndex][i].pos.y > height*1.2 || moons[tempPlanetIndex][i].pos.y < -20){
        moons[tempPlanetIndex].splice(i, 1);
        alertCount++;
        if (alertCount == 2) {
          alert('If a moon is too close to a planet, it will slingshot away!')
        }
      }

   }
   if (dragging == false) {
     for (i = 0; i < moons[tempPlanetIndex].length; i++) {
       moons[tempPlanetIndex][i].move();
       sun.attract(moons[tempPlanetIndex][i]);
     }
   } else if (moons[tempPlanetIndex].length == 3){
       let tempMoonArray = [0, 1, 2];
       tempMoonArray.splice(tempMoonIndex, 1);
       for (i = 0; i < tempMoonArray.length; i++) {
         moons[tempPlanetIndex][tempMoonArray[i]].move();
         sun.attract(moons[tempPlanetIndex][tempMoonArray[i]]);
       }
   } else if (moons[tempPlanetIndex].length == 2) {
        let tempMoonArray = [0, 1];
        tempMoonArray.splice(tempMoonIndex, 1);
        moons[tempPlanetIndex][tempMoonArray[0]].move();
        sun.attract(moons[tempPlanetIndex][tempMoonArray[0]]);
   }
   if (dragging){
     showBin();
   }
   if (tempMoon){
     moons[tempPlanetIndex][tempMoonIndex].pos.x = mouseX - xOffset;
     moons[tempPlanetIndex][tempMoonIndex].pos.y = mouseY - yOffset;
  }
}

function options() {
  //applies alpha to planets menu if hovering when using mouse
  for (let i = 0; i < planetOptions.length; i++){
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r){
      if (helpTrigger == false){
        planetOptions[i].optionAlpha = 150;
        push();
        textAlign(LEFT, CENTER);
        if (hoverClick == false) {
          text(planetNames[i], planetOptions[i].pos.x + planetOptions[i].r/2*1.3, planetOptions[i].pos.y);
        }
        if (hoverClick) {
          planetOptions[i].optionAlpha = 50;
        }
        pop();
      }
    } else if (moonMode) {
      if (hoverClick == false) {
        planetOptions[tempPlanetIndex].optionAlpha = 150;
      }
      planetOptions[i].optionAlpha = 50;
    } else {
      planetOptions[i].optionAlpha = 50;
    }
  }
}

var offset = 0;

function buttons() {
    fill(150, chorusAlpha);
    chorusX = width - width/30;
    chorusY = height/12;
    chorusR = height/25;
    if (solarSystemMode || moonMode){
      chorusButton = ellipse(chorusX, chorusY, chorusR*2);
      image(buttonBorder, chorusX, chorusY, chorusR * 2, chorusR * 2);
      push();
      stroke(255);
      strokeWeight(2.5);
      noFill();
      beginShape();
      //vertex(chorusX-chorusR, chorusY);
      for(var x = chorusX-chorusR*0.7; x < chorusX+chorusR*0.7; x++){
        //var angle = map(x, 0, width, 0, TWO_PI);
        var angle = offset + x * 0.3;
        // map x between 0 and width to 0 and Two Pi
        var y = map(sin(angle), -2, 2, chorusY-chorusR, chorusY+chorusR);
        vertex(x, y);
      }
      //vertex(chorusX+chorusR, chorusY);
      endShape();
      if (chorusTrigger){
        offset += 0.1;
      } else {
        offset = offset;
      }
      pop();
    }

    fill(150, reverbAlpha);
    reverbX = width - width/30;
    reverbY = height/9*2;
    reverbR = height/25;
    if (solarSystemMode || moonMode){
      reverbButton = ellipse(reverbX, reverbY, reverbR*2);
      image(buttonBorder, reverbX, reverbY, reverbR * 2, reverbR * 2);
      push();
      noFill();
      stroke(255);
      strokeWeight(2.5);
      if (reverbTrigger == false){
        ellipse(reverbX, reverbY, reverbR/1.5)
      } else {
        ellipse(reverbX-reverbR/4, reverbY, reverbR/2)
        ellipse(reverbX+reverbR/4, reverbY, reverbR/2)

      }
      pop();

    }

    fill(150, infoAlpha);
    infoX = width - width/30;
    infoY = height - height/9*2;
    infoR = height/25;
    if (solarSystemMode || moonMode){
      infoButton = ellipse(infoX, infoY, infoR*2);
      image(infoIcon, infoX, infoY, infoR * 2, infoR * 2);
    }

    fill(150, helpAlpha);
     helpX = width - width/30;
     helpY = height - height/12;
     helpR = height/25;
     if (solarSystemMode || moonMode){
       helpButton = ellipse(helpX, helpY, helpR*2);
       imageMode(CENTER);
       image(helpIcon, helpX, helpY, helpR * 2, helpR * 2);
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
        tempMoon = true;
        tempMoonIndex = i;
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
// if a button on the right is clicked
    if (started == true){
      buttonClick();
      helpModeClick();
    }
//begin interface with touch
  Tone.start();
    if (started == false) {
    //Tone.js doesn't always begin first time round (particularly ...
    // ... on touch devices) so, it is started for a second time
      started = true;
      Tone.start();
      solarSystemMode = true;
    }
    hoverClick = false;
// if a planet on the left menu is clicked
    planetOptionsClick();
// if a planet is clicked
    planetClick();
// if a moon is clicked
    moonClick();
// if sun is clicked, do not add planet as it otherwise flies away
    constraint();
// if a random space is touched, add planet or moon
    if (spaceClicked && planets.length < 8 && solarSystemMode) {
      planetAdd();
    }
    if (spaceClicked && moonMode) {
      moonAdd();
    }
    return false;
}

function touchEnded() {
  if (solarSystemMode && helpTrigger == false) {
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
  if (dist(mouseX, mouseY, sun.pos.x, sun.pos.y) > boundaryR/2 && spaceClicked == true){
    //alert("Out of Bounds!");
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
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r && tempPlanetIndex == i && moonMode){
      moonMode = false;
      solarSystemMode = true;
      spaceClicked = false;
      //maybe this'll need fixing, deleting values for specific moon mode
      tremoloMap = 1;
      partials = 10;
      hoverClick = true;
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
  if (helpTrigger == false && dist(mouseX, mouseY, helpX, helpY) < helpR*2){
    helpTrigger = true;
    helpMode = true;
    spaceClicked = false;
    screenZero = true;
    helpAlpha = 255;
  } else if (dist(mouseX, mouseY, helpX, helpY) < helpR*2) {
    helpTrigger = false;
    spaceClicked = false;
    boundaryAlpha = 3;
    helpAlpha = 100;
    screenZero = false, screenOne = false, screenTwo = false, screenThree = false, screenFour = false, screenFive = false, screenSix = false;
  }
  if (infoTrigger == false && dist(mouseX, mouseY, infoX, infoY) < infoR*2){
    infoTrigger = true;
    spaceClicked = false;
  } else if (infoTrigger) {
    infoTrigger = false;
    spaceClicked = false;
  }
  if (chorusTrigger == false && dist(mouseX, mouseY, chorusX, chorusY) < chorusR*2){
    chorusTrigger = true;
    chorus.frequency.value = 2;
    spaceClicked = false;
    chorusAlpha = 255
  } else if (dist(mouseX, mouseY, chorusX, chorusY) < chorusR*2) {
    chorusTrigger = false;
    chorus.frequency.value = 0;
    spaceClicked = false;
    chorusAlpha = 100;
  }
  if (reverbTrigger == false && dist(mouseX, mouseY, reverbX, reverbY) < reverbR*2){
    reverbTrigger = true;
    reverb.wet.rampTo(0.7, 0.5);
    spaceClicked = false;
    reverbAlpha = 255
  } else if (dist(mouseX, mouseY, reverbX, reverbY) < reverbR*2) {
    reverbTrigger = false;
    reverb.wet.rampTo(0.01, 0.5);
    //reverb.decay.rampTo(0.01, 1);
    spaceClicked = false;
    reverbAlpha = 100

  }
}


function planetReleased() {
  if (tempPlanet == true && mouseY > height - height/10) {
      //planetDelete();
      //tempPlanetSpecs.length = 0;
      console.log('delete function temporarily disabled due to bugs!')
      resetPlanet();
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
  dragging = false;
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
  moons[tempPlanetIndex].splice(tempMoonIndex, 1);
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
     planetOptions[i].pos.x = width/30;;
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
let chorus = new Tone.Chorus(0, 1, 1).toDestination().start();
let reverb = new Tone.Reverb({
  decay: 6.8,
  wet: 0
}).toDestination();
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
  oscillators[p].chain(reverb, chorus);
  //oscillators[p].connect(reverb);


  oscillators[p].volume.rampTo(-25, 0.05);
  //oscillators[p].();
  oscillators[p].start();
}

function createTempPlanet(){
  // showBin();
  //temp planet pulses
  let pulsing = sin(pulse += 0.05);
  // //if planet is in bin change colour to red, else remain as is
  // if (mouseY > height - height/10){
  //   fill(255, 0, 0, 50);
  // } else {
  fill(tempPlanetSpecs[1][0], tempPlanetSpecs[1][1], tempPlanetSpecs[1][2], 100)
  // }
  //temp planet
  ellipse(mouseX - xOffset, mouseY - yOffset, tempPlanetSpecs[0] + pulsing*5);
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

  glow() {
    //adds a healthy glow around moons
    for (let i = 0; i < 15; i++){
      fill(moonColours[0], moonColours[0], moonColours[0], 5);
      ellipse(this.pos.x, this.pos.y, this.r + i)
    }
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

