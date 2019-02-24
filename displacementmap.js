"use strict";

let img = new Image();
let mapImg = new Image();

let canvas = document.getElementById("imageCanvas");
let ctx = canvas.getContext("2d");

let map = document.getElementById("map");
let ctxMap = map.getContext("2d");

let output = document.getElementById("output");
let ctxOutput = output.getContext("2d");

let imageData = null;
let mapData = null;
let outputData = null;

let xPos = null;
let yPos = null;

let xVal = null;
let yVal = null;

let greyvalue = null;

let w = ctx.canvas.width;
let h = ctx.canvas.height;
let displacementX = null;
let displacementY = null;

let offsetX = null;
let offsetY = null;
let originalPixelIndex = null;

const MAX_MOVEMENT = 25;

window.addEventListener("load", init());
function init() {
  img.addEventListener(
    "load",
    function() {
      ctx.drawImage(img, 0, 0);
      ctxMap.drawImage(mapImg, 0, 0);

      getImageData();
      updatePixels();
      drawOutputData();
      mouseMoved();
    },
    false
  );
  img.src = "cat.jpg"; // Set source path
  mapImg.src = "map.jpg";
}

function updatePixels() {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      let data = outputData.data;

      let imgX = i + xPos;
      let imgY = j + yPos;

      let pixelIndex = 4 * (imgX + imgY * ctx.canvas.width);
      greyvalue = mapData.data[pixelIndex] / 255;

      offsetX = Math.round(i + displacementX * greyvalue);
      offsetY = Math.round(j + displacementY * greyvalue);

      originalPixelIndex = (offsetY * w + offsetX) * 4;

      let pi = 4 * (i + j * ctxOutput.canvas.width);

      data[pi + 0] = imageData.data[pixelIndex];
      data[pi + 1] = imageData.data[pixelIndex + 1];
      data[pi + 2] = imageData.data[pixelIndex + 2];
      data[pi + 3] = imageData.data[pixelIndex + 3];
    }
  }
}

function getImageData() {
  imageData = ctx.getImageData(0, 0, w, h);
  mapData = ctxMap.getImageData(0, 0, w, h);
  outputData = ctxOutput.createImageData(w, h);

  console.log(imageData);
  console.log(mapData);
  console.log(outputData);
}

function drawOutputData() {
  ctxOutput.putImageData(outputData, 0, 0);
}

function mouseMoved() {
  canvas.addEventListener("mousemove", function() {
    //CLEAR RECT - 500x600
    //ctx.clearRect(0, 0, w, h);
    //PUT IMAGEDATA ON CANVAS
    //ctx.putImageData(imageData, 0, 0);

    xPos = event.offsetX; // Get the horizontal coordinate
    yPos = event.offsetY; // Get the vertical coordinate

    xVal = (xPos / w) * 2 - 1;
    yVal = (yPos / h) * 2 - 1;

    //DRAW SMALL RECTANGLE AT THE X AND Y POS
    // ctx.strokeRect(25 + displacementX, 25 + displacementY, 450, 550);

    document.querySelector(".xVal").textContent = xVal;
    document.querySelector(".yVal").textContent = yVal;

    //CALCULATE DISPLACEMENTS WITH MULTIPLYING WITH MAX MOVEMENT

    displacementX = xVal * MAX_MOVEMENT;
    displacementY = yVal * MAX_MOVEMENT;

    //console.log(displacementX, displacementY);
  });
}
