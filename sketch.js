//// Harmony of the Spheres v1.0
//// Nathan Ó Maoilearca 2021

////////////////////////////////
////////// VARIABLES ///////////
////////////////////////////////

/////VISUAL/////

//Core Elements
let sun, planets = [], moons = [[], [], [], [], [], [], [], []], stars = [];
let planetOptions = [], planetRadii = [10, 15, 25, 20, 40, 35, 30, 27];
let planetColours = [[233, 163, 100], [216, 157, 145], [15, 92, 166],
[191, 54, 27], [143, 105, 64], [217, 177, 56], [121, 183, 224], [38, 104, 148]];
let planetNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn',
'Uranus', 'Neptune'];
let planetNumber = -1;
let moonColours = [175, 174, 175];
let boundary, boundaryR, boundaryAlpha = 3;
//Temporary Elements
let tempPlanet = false, tempPlanetSpecs = [], tempPlanetIndex, tempPlanetNumber;
let tempMoon = false, tempMoonIndex;
let eccentricityOffsetResult, angleResult;
//Interactivity
let pulse = 0;
let xOffset, yOffset;
let offset = 0;
let diff = [];
let started = false;
let breakMe = false;
let fade = 155; let fade2 = 155
let dragging = false;
let spaceClicked = true;
let hoverClick = false;
//Modes & Screens
let planetMode = false, solarSystemMode = false;
let helpScreenZero = false, helpScreenOne = false, helpScreenTwo = false,
helpScreenThree = false, helpScreenFour = false, helpScreenFive = false,
helpScreenSix = false;
let helpCount = 0;
let alertCount = 0;
//Buttons
let chorusButton, chorusX, chorusY, chorusR, chorusAlpha = 100;
let reverbButton, reverbX, reverbY, reverbR, reverbAlpha = 100;
let helpTrigger = false, helpButton, helpX, helpY, helpR, helpAlpha = 100;
let infoTrigger = false, infoButton, infoX, infoY, infoR, infoAlpha = 100;


/////SOUND/////

//A major7     A    E       A    C#      G#     E       A    A
let pitches = [110, 164.81, 220, 277.18, 415.3, 659.25, 880, 55];
let oscillators = [];
let modulationIndexMap = 0;
let harmonicityMap = 1;
let partials = 10;
let chorusValue = 0, chorusTrigger = false;
let reverbValue = 0, reverbTrigger = false;
let chorus = new Tone.Chorus(0, 1, 1).toDestination().start();
let reverb = new Tone.Reverb({
  decay: 6.8,
  wet: 0
}).toDestination();

////////////////////////////////
//////////// SETUP /////////////
////////////////////////////////

//In Case of an Error, Display this Message
window.onerror = function() {
    alert("Oh no, an error occurred! Try refresh the page.")
}
function preload() {
  binIcon = loadImage('icons/bin.png');
  helpIcon = loadImage('icons/help.svg');
  infoIcon = loadImage('icons/info.svg');
  buttonBorder = loadImage('icons/buttonBorder.svg');
}
function setup(){
//canvas adjusts to any screen size
  createCanvas(windowWidth, windowHeight);
// If performance is poor, change pixelDensity:
  //pixelDensity(1);

//add sun and stars
  for (let i = 0; i < width/30; i++) {
    stars[i] = new Star(random(0, width), random(0, height), random(1, 2));
  };
  sun = new Sun(width/2, height/2);
}

////////////////////////////////
//////////// DRAW //////////////
////////////////////////////////

function draw(){
  background(45, 35, 35);
  startScreen();
//show sun + stars
  for (let i = 0; i < stars.length; i++) {
    stars[i].show();
  }
  sun.show();
// if we're in solar system mode
  if (solarSystemMode){
    solarSystemModeDraw();
  }
// if we're in planet mode
  if (planetMode) {
    planetModeDraw();
  // sound synthesis control
    timbralProperties();
  }
//show info, help and audio effects buttons on right hand side
  buttonsDraw();
// show left hand planets menu
  for (i = 0; i < planetOptions.length; i++) {
    planetOptions[i].optionsDraw();
    optionsHighlight();
  }
//help mode helpScreen
  if (helpTrigger) {
    helpModeDraw();
  }
//info screen
  if (infoTrigger) {
    infoModeDraw();
  }
// show boundary
  boundaryDraw();
}

//Welcome Screen Display
function startScreen() {
  //If
    if (started == false) {
    startScreenGraphics();
    sun.glow();
    sun.show();
  } else if (!breakMe && started == true) {
    fade -= 10;
    startScreenGraphics();
    if (fade < 1) {
      breakMe = true;
    }
  }
}
function startScreenGraphics(){
  let gradient;
  fill(50, fade);
  gradient = rect(0, 0, width, height);
  let welcomeText;
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

//Drawing Functions
function solarSystemModeDraw() {
  textSize(height/30)
  fill(255, 150);
  textAlign(CENTER, CENTER);
  text("Solar System", width/2, 30);
  sun.glow();
//move, show and apply gravitational force to planets
  for (let i = 0; i < planets.length; i++) {
    planets[i].show();
    planets[i].move();
    planets[i].angleFind();
    sun.attract(planets[i]);
  }
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
  //freqModBodge();
}
function planetModeDraw() {
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
     binDraw();
   }
   if (tempMoon){
     moons[tempPlanetIndex][tempMoonIndex].pos.x = mouseX - xOffset;
     moons[tempPlanetIndex][tempMoonIndex].pos.y = mouseY - yOffset;
  }
}
function helpModeDraw() {
  //What to Display During Help Mode!
  if (helpScreenOne && planetMode) {
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
  if (helpScreenOne && solarSystemMode){
    fill(255)
    text('Touch to Add More Planets to the Solar System', width/2, height/4);
    noFill();
    boundaryAlpha = 25;
  }
  if (helpScreenTwo) {
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
  if (helpScreenThree) {
    fill(255)
    textAlign(CENTER, CENTER);
    text("Add Moons to Change this Planet's Sound", width/2, height/4);
    noFill();
    boundaryAlpha = 25;
  }
  if (helpScreenFour) {
    fill(255);
    text("Drag Moons Away from Planet in the Centre to Increase Effect", width/2, height/4);
    noFill();
  }
  if (helpScreenFive) {
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
  if (helpScreenSix) {
    helpTrigger = false;
    helpScreenSix = false;
  }
}
function infoModeDraw() {
  //What to display during info mode
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
function buttonsDraw() {
    fill(150, chorusAlpha);
    chorusX = width - width/30;
    chorusY = height/12;
    chorusR = height/25;
    if (solarSystemMode || planetMode){
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
    if (solarSystemMode || planetMode){
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
    if (solarSystemMode || planetMode){
      infoButton = ellipse(infoX, infoY, infoR*2);
      image(infoIcon, infoX, infoY, infoR * 2, infoR * 2);
    }

    fill(150, helpAlpha);
     helpX = width - width/30;
     helpY = height - height/12;
     helpR = height/25;
     if (solarSystemMode || planetMode){
       helpButton = ellipse(helpX, helpY, helpR*2);
       imageMode(CENTER);
       image(helpIcon, helpX, helpY, helpR * 2, helpR * 2);
     }
}
function boundaryDraw(){
  push();
  fill(255, boundaryAlpha);
  stroke(255, 8);
  strokeWeight(2);
  boundaryR = height - 40
  boundary = ellipse(width/2, height/2, boundaryR);
  pop();
}
function binDraw(){
  //bin image
  imageMode(CENTER);
  image(binIcon, width/2, height - 20, 30, 30);
}
function optionsHighlight() {
  //applies alpha to planets menu if hovering when using mouse
  for (let i = 0; i < planetOptions.length; i++){
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y)
    < planetOptions[i].r){
      if (helpTrigger == false){
        planetOptions[i].optionAlpha = 150;
        push();
        textAlign(LEFT, CENTER);
        if (hoverClick == false) {
          text(planetNames[i], planetOptions[i].pos.x +
          planetOptions[i].r/2*1.3, planetOptions[i].pos.y);
        }
        if (hoverClick) {
          planetOptions[i].optionAlpha = 50;
        }
        pop();
      }
    } else if (planetMode) {
      if (hoverClick == false) {
        planetOptions[tempPlanetIndex].optionAlpha = 150;
      }
      planetOptions[i].optionAlpha = 50;
    } else {
      planetOptions[i].optionAlpha = 50;
    }
  }
}

//Sound Synthesis
function timbralProperties() {
  if (moons[tempPlanetIndex].length > 2){
    //maps the partials of the modulator signal to the distance between
    //moon and planet, then assigns the value to modulationType
    let partialDistance = dist(moons[tempPlanetIndex][2].pos.x, moons[tempPlanetIndex][2].pos.y, sun.pos.x, sun.pos.y);
    partials = round(map(partialDistance, 0, height/2, 10, 100));
    oscillators[tempPlanetIndex].modulationType = `square${partials}`;
    //maps the harmonicity of the synth to the distance between
    //moon and planet, then assigns the value to harmoinicty.value
    let harmonicityDistance = dist(moons[tempPlanetIndex][1].pos.x, moons[tempPlanetIndex][1].pos.y, sun.pos.x, sun.pos.y);
    harmonicityMap = map(harmonicityDistance, 0, height/2, 0.99, 1.04);
    oscillators[tempPlanetIndex].harmonicity.value = harmonicityMap;
    //maps the modulation index of the synth to the distance between
    //moon and planet, then assigns the value to modulationIndex.value
    let modDistance = dist(moons[tempPlanetIndex][0].pos.x, moons[tempPlanetIndex][0].pos.y, sun.pos.x, sun.pos.y);
    modulationIndexMap = map(modDistance, 0, height/2, 0, 4);
    oscillators[tempPlanetIndex].modulationIndex.value = modulationIndexMap;
  } else if (moons[tempPlanetIndex].length > 1){
    let harmonicityDistance = dist(moons[tempPlanetIndex][1].pos.x, moons[tempPlanetIndex][1].pos.y, sun.pos.x, sun.pos.y);
    harmonicityMap = map(harmonicityDistance, 0, height/2, 0.99, 1.04);
    oscillators[tempPlanetIndex].harmonicity.value = harmonicityMap;
    let modDistance = dist(moons[tempPlanetIndex][0].pos.x, moons[tempPlanetIndex][0].pos.y, sun.pos.x, sun.pos.y);
    modulationIndexMap = map(modDistance, 0, height/2, 0, 4);
    oscillators[tempPlanetIndex].modulationIndex.value = modulationIndexMap;
    oscillators[tempPlanetIndex].modulationType = `square${10}`;
  } else if (moons[tempPlanetIndex].length > 0){
    let modDistance = dist(moons[tempPlanetIndex][0].pos.x, moons[tempPlanetIndex][0].pos.y, sun.pos.x, sun.pos.y);
    modulationIndexMap = map(modDistance, 0, height/2, 0, 4);
    oscillators[tempPlanetIndex].modulationIndex.value = modulationIndexMap;
    oscillators[tempPlanetIndex].modulationType = `square${10}`;
    oscillators[tempPlanetIndex].harmonicity.value = 1;
  } else if (moons[tempPlanetIndex].length == 0){
    oscillators[tempPlanetIndex].modulationIndex.value = 0;
    oscillators[tempPlanetIndex].modulationType = `square${10}`;
    oscillators[tempPlanetIndex].harmonicity.value = 1;
  }
}

////////////////////////////////
///// MOUSE OR TOUCH DRAG /////
////////////////////////////////

function mouseDragged(){
// delete dragged planet, replace with temporary one that can be dragged
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
  if (planetMode && dragging == true){
    for (let i = 0; i < moons[tempPlanetIndex].length; i++){
      if (dist(mouseX, mouseY, moons[tempPlanetIndex][i].pos.x,
      moons[tempPlanetIndex][i].pos.y) < moons[tempPlanetIndex][i].r){
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
function createTempPlanet() {
  //temp planet pulses
  let pulsing = sin(pulse += 0.05);
  //temp planet colour
  fill(tempPlanetSpecs[1][0], tempPlanetSpecs[1][1], tempPlanetSpecs[1][2], 100)
  //temp planet
  ellipse(mouseX - xOffset, mouseY - yOffset, tempPlanetSpecs[0] + pulsing*5);
  // showBin();
  // //if planet is in bin change colour to red, else remain as is
  // if (mouseY > height - height/10){
  //   fill(255, 0, 0, 50);
  // }
}

////////////////////////////////
///// MOUSE OR TOUCH STARTED /////
////////////////////////////////

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
// hoverClick permits both touch & mouse functionality
    hoverClick = false;
// if a planet on the left menu is clicked
    planetOptionsClick();
// if a planet is clicked
    planetClick();
// if a moon is clicked
    moonClick();
// constrains clicking to within the boundary
    constraint();
// if a random space is touched, add planet or moon
    if (spaceClicked && planets.length < 8 && solarSystemMode) {
      planetAdd();
    }
    if (spaceClicked && planetMode) {
      moonAdd();
    }
// returns false, as otherwise, any touch onscreen will be registered . . .
// . . . by p5.js twice
    return false;
}

//Clicking Functions
function planetClick() {
  if (solarSystemMode){
    for (let t = 0; t < planets.length; t++){
      if (dist(mouseX, mouseY, planets[t].pos.x, planets[t].pos.y) < planets[t].r){
        //sets the offset for a picked up planet
        xOffset = mouseX - planets[t].pos.x;
        yOffset = mouseY - planets[t].pos.y;
        //these temporary specs will be reassigned to a new planet when the . . .
        // . . . mouse or touch is released
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
  if (planetMode){
    for (let t = 0; t < moons[tempPlanetIndex].length; t++){
      if (dist(mouseX, mouseY, moons[tempPlanetIndex][t].pos.x, moons[tempPlanetIndex][t].pos.y) < moons[tempPlanetIndex][t].r){
        //sets temporary index number and offset
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
  let tempPlanetOptionsIndex;
  for (let i = 0; i < planetOptions.length; i++){
    //return to solar system if in planet mode
    if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) <
    planetOptions[i].r && tempPlanetIndex == i && planetMode){
        planetMode = false;
        solarSystemMode = true;
        spaceClicked = false;
        //reset harmonicity and partials for next planet
        harmonicityMap = 1;
        partials = 10;
        hoverClick = true;
        //uniform volume between each planet
        for (var o = 0; o < planets.length; o++) {
            oscillators[planets[o].number].volume.rampTo(-25, 0.05);
        }
    // else remain in planet mode, but switch to another planet
    } else if (dist(mouseX, mouseY, planetOptions[i].pos.x,
    planetOptions[i].pos.y) < planetOptions[i].r){
      spaceClicked = false;
      planetMode = true;
      solarSystemMode = false;
      //delete previous temp specs, replace with specs of selected planet
      tempPlanetSpecs.length = 0;
      tempPlanetOptionsIndex = i;
      tempPlanetIndex = i;
      tempPlanetSpecs.push(planets[i].r, planets[i].c);
      //boost selected planet's volume,  decrease other planets
      for (var o = 0; o < planets.length; o++) {
        oscillators[planets[o].number].volume.rampTo(-55, 0.05);
        oscillators[tempPlanetIndex].volume.rampTo(-20, 0.05);
      }
      //reset harmonicity and partials for next planet
      harmonicityMap = 1;
      partials = 10;
    }
  }
}
function buttonClick() {
  if (helpTrigger == false && dist(mouseX, mouseY, helpX, helpY) < helpR*2){
    helpTrigger = true;
    helpMode = true;
    spaceClicked = false;
    helpScreenZero = true;
    helpAlpha = 255;
  } else if (dist(mouseX, mouseY, helpX, helpY) < helpR*2) {
    helpTrigger = false;
    spaceClicked = false;
    boundaryAlpha = 3;
    helpAlpha = 100;
    helpScreenZero = false, helpScreenOne = false, helpScreenTwo = false, helpScreenThree = false, helpScreenFour = false, helpScreenFive = false, helpScreenSix = false;
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
    //turn chorus on
    chorus.frequency.value = 2;
    spaceClicked = false;
    chorusAlpha = 255
  } else if (dist(mouseX, mouseY, chorusX, chorusY) < chorusR*2) {
    chorusTrigger = false;
    //turn chorus off
    chorus.frequency.value = 0;
    spaceClicked = false;
    chorusAlpha = 100;
  }
  if (reverbTrigger == false && dist(mouseX, mouseY, reverbX, reverbY) < reverbR*2){
    reverbTrigger = true;
    //turn reverb on
    reverb.wet.rampTo(0.7, 0.5);
    spaceClicked = false;
    reverbAlpha = 255
  } else if (dist(mouseX, mouseY, reverbX, reverbY) < reverbR*2) {
    reverbTrigger = false;
    //turn reverb off
    reverb.wet.rampTo(0.01, 0.5);
    spaceClicked = false;
    reverbAlpha = 100
  }
}
function helpModeClick() {
//cycle through help screens
  if(helpScreenFive && dist(mouseX, mouseY, planetOptions[tempPlanetIndex].pos.x, planetOptions[tempPlanetIndex].pos.y) < planetOptions[tempPlanetIndex].r) {
    helpScreenFive = false;
    helpScreenSix = true;
    helpAlpha = 100;
  }
  if (helpScreenFour) {
    helpCount++
    if (helpCount > 1){
      helpScreenFive = true;
      helpScreenFour = false;
    }
  }
  if (helpScreenThree &&
    dist(mouseX, mouseY, width/2, height/2) < boundaryR/2 &&
    dist(mouseX, mouseY, width/2, height/2) > sun.r) {
    helpScreenFour = true;
    helpScreenThree = false;
  }
  if (helpScreenTwo) {
    for (let i = 0; i < planetOptions.length; i++){
      if (dist(mouseX, mouseY, planetOptions[i].pos.x, planetOptions[i].pos.y) < planetOptions[i].r) {
        helpScreenThree = true;
        helpScreenTwo = false;
      }
    }
  }
  if (helpScreenOne && spaceClicked && planetMode) {
    helpScreenOne = true;
  }
  if (helpScreenOne && solarSystemMode &&
    dist(mouseX, mouseY, width/2, height/2) < boundaryR/2 &&
    dist(mouseX, mouseY, width/2, height/2) > sun.r*1.5) {
    console.log(boundaryR);
    helpScreenTwo = true;
    helpScreenOne = false;
  }
  if (helpScreenZero) {
    helpScreenOne = true;
    helpScreenZero = false;
  }
}
function constraint() {
  if (dist(mouseX, mouseY, sun.pos.x, sun.pos.y) < sun.r*1.5 && solarSystemMode){
    alert("Try Clicking Around the Sun Instead!");
    spaceClicked = false;
  }
  if (dist(mouseX, mouseY, sun.pos.x, sun.pos.y) > boundaryR/2 &&
  spaceClicked == true){
    spaceClicked = false;
  }
}

//Result of Clicking
function angle(){
  //calculates the angle between two lines (vectors), v1 & v2
  //resulting angle is given to a new planet or moon to calculate its velocity
  push();
  translate(width/2, height/2);
  let v2 = createVector(width/2, 0);
  let v1 = createVector(mouseX - width/2, mouseY - height/2);
  let angleBetween = v1.angleBetween(v2);
  if (angleBetween < 0) {
    angleResult = angleBetween  + TWO_PI;
  } else {angleResult = angleBetween};
  pop();
}
function eccentricityOffset() {
  //this calculates the distanceSq between the sun and a new planet or moon
  //the result adjusts its velocity, and in turn its eccentricity
  //velocity is decreased the further a planet/moon is placed from the sun
  let v1 = dist(width/2, height/2, mouseX, mouseY);
  v1 = Math.sqrt(v1);
  eccentricityOffsetResult = map(v1, 0, height/2, 2, -20)
}
function planetAdd() {
  planetNumber++;
  let p = planetNumber;
  let d = diff[0];
  let maxDist = dist(width/2, height/2, mouseX, mouseY)
  //angle of velocity to be passed to a new planet
  angle();
  //eccentricity offset for new planet
  eccentricityOffset();
  // if deleted planets bank is empty, add new planets
  // cuurently, there is no option to delete planets, so diff.length is always 0
  if (diff.length == 0){
    planets.push(new Planet(mouseX, mouseY, planetRadii[p] * 2, planetColours[p], eccentricityOffsetResult, angleResult, p));
    planetOptions.push(new Planet(width / 20 - width / 2, p * height/p - height / 2 + height / (p*2) + 1, height/16, planetColours[p]));
    loadSounds(p);
    startSounds(p);
    newPlanet = true;
  //else re-add from deleted planets bank
  } else {
    oscillators[d].volume.rampTo(-25, 0.05);
    planets.splice(d, 0, new Planet(mouseX, mouseY, planetRadii[d] * 2, planetColours[d], eccentricityOffsetResult, angleResult, d));
    planetOptions.splice(d, 0, new Planet(width / 20 - width / 2, i * height/d - height / 2 + height / (d*2) + 1, height/16, planetColours[d]));
    diff.splice(0, 1);
    }

  //INCLUDE BELOW IN NEXT UPDATE
  // if (planetNumber == fixedPlanetIndices.length) {
  //   maxPlanetNumber++;
  //   fixedPlanetIndices.push(maxPlanetNumber - 1);
  // }

  //reorganizes planets menu button on the left hand side
  planetOptionsOrganize();
}
function moonAdd() {
  let moonNumber = moons.length;
  //angle of velocity to be passed to a new moon
  angle();
  //eccentricity offset for new moon
  eccentricityOffset();
  if (moons[tempPlanetIndex].length < 3){
    moons[tempPlanetIndex].push(new Planet(mouseX, mouseY, planetRadii[2] * 2, moonColours, eccentricityOffsetResult, angleResult));
  }
}
function planetOptionsOrganize() {
  //automatically rearranges planet menus on the left hand side, as . . .
  // . . . new planets are added
  for (let i = 0; i < planetOptions.length; i++) {
     planetOptions[i].pos.x = width/30;;
     planetOptions[i].pos.y = i * height/planetOptions.length + height / (planetOptions.length*2) + 1;
  }
}
function loadSounds(p) {
  //add a new FM oscillator
  fmOsc = new Tone.FMOscillator({
    frequency: pitches[p],
    type: "sine",
    harmonicity: 1,
    modulationIndex: 0,
    modulationType: `square${partials}`,
    volume: - Infinity
  });
}
function startSounds(p) {
  //starts and connects the oscillator to the reverb and chorus effects
  oscillators.push(fmOsc);
  oscillators[p].chain(reverb, chorus);
  oscillators[p].volume.rampTo(-25, 0.05);
  oscillators[p].start();
}

////////////////////////////////
///// MOUSE OR TOUCH ENDED /////
////////////////////////////////

function touchEnded() {
  if (solarSystemMode && helpTrigger == false) {
    planetReleased();
    spaceClicked = true;
  } else {
    moonReleased();
    spaceClicked = true;
  }
}

//Released
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

//Reset
function resetPlanet() {
// push a new planet into the planets array, with the same specs as the one spliced
  tempPlanet = false;
  dragging = false;
  angle();
  eccentricityOffset();
  planets.splice(tempPlanetIndex, 0, new Planet(mouseX - xOffset, mouseY - yOffset, tempPlanetSpecs[0], tempPlanetSpecs[1], eccentricityOffsetResult, angleResult, tempPlanetNumber));
}
function resetMoon() {
  tempMoon = false;
  angle();
  eccentricityOffset();
  //reassign velocity to a moon that's been released
  moons[tempPlanetIndex][tempMoonIndex].vel.x = sin(angleResult) * eccentricityOffsetResult;
  moons[tempPlanetIndex][tempMoonIndex].vel.y = cos(angleResult) * eccentricityOffsetResult;
}

//Delete
function moonDelete() {
  moons[tempPlanetIndex].splice(tempMoonIndex, 1);
  tempMoon = false;
}





//Not Being Used Currently
function buttonsHighlight() {
  //This code changes the alpha of the buttons when hovering over with a mouse
  //Although its currently not being used as it acts funny with touch controls
  if (started){
    push();
    textAlign(RIGHT, CENTER);
    fill(255, 150);
    if (dist(mouseX, mouseY, helpX, helpY) < helpR){
      helpAlpha = 255;
      text('Help', helpX - helpR*1.3, helpY);
    } else if (helpTrigger == false &&
    dist(mouseX, mouseY, helpX, helpY) > helpR) {
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
    } else if (chorusTrigger == false &&
    dist(mouseX, mouseY, chorusX, chorusY) > chorusR) {
      chorusAlpha = 100;
    }
    if (dist(mouseX, mouseY, reverbX, reverbY) < reverbR){
      reverbAlpha = 255
      text('Stereo Reverb', reverbX - reverbR*1.3, reverbY);
    } else if (reverbTrigger == false &&
    dist(mouseX, mouseY, reverbX, reverbY) > reverbR) {
      reverbAlpha = 100;
    }
    pop();
  }
}
function planetOutOfBounds() {
// Deletes Planet if it Goes offscreen
  planetNumber--;
  planets.splice(i, 1);
// rearrange planet menu on left
  planetOptions.splice(tempPlanetIndex, 1);
  planetOptionsOrganize();
}
function freqModBodge() {
  //alters planet's pitch depending on its distance to sun
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
function planetDelete() {
//deletes planet
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
//logs order of deleted planets
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
function variableStorage() {
  // TO BE INCLUDED IN THE NEXT UPDATE:
  // let deletedPlanets = [];
  // let deletedIndices = [];
  // let deletedPitches = [];
  // let fixedPlanetIndices = [];
  // let maxPlanetNumber = 0;
}
