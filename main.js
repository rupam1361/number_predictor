let c = document.getElementById("canvas");
const clear = document.getElementById("clear");
const predict = document.getElementById("predict");

let ctx = c.getContext("2d");
c.style.backgroundColor = "rgb(50, 50, 50)";
let model;

let coord = { x: 0, y: 0 };

c.addEventListener("mousedown", start);
c.addEventListener("mouseup", stop);

c.addEventListener("touchstart", start);
c.addEventListener("touchend", stop);

function reposition(event) {
  coord.x = event.clientX - c.offsetLeft;
  coord.y = event.clientY - c.offsetTop;
}

function repositionTouch(event) {
  console.log(c);
  coord.x = event.changedTouches[0].clientX - c.offsetLeft;
  coord.y = event.changedTouches[0].clientY - c.offsetTop;
}

function start(event) {
  console.log("lol");
  c.addEventListener("mousemove", draw);
  c.addEventListener("touchmove", drawTouch);
  reposition(event);
  repositionTouch(event);
}

function stop() {
  c.removeEventListener("mousemove", draw);
  c.removeEventListener("touchmove", draw);
}

async function loadModel() {
  // model = undefined;
  model = await tf.loadLayersModel("models/model.json");
}

loadModel();

let maxIndex;

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const results = document.getElementById("results");
let predictionBarWrapper;
let predictionBar;
let listNum;

numbers.map((num) => {
  let numList = document.createElement("numbersList");
  let number = document.createElement("div");
  predictionBarWrapper = document.createElement("div");
  predictionBar = document.createElement("div");
  numList.setAttribute("id", num);
  number.setAttribute("id", num);
  predictionBarWrapper.setAttribute("id", num);
  predictionBar.setAttribute("id", num);
  number.setAttribute("class", "numbersList");
  predictionBarWrapper.setAttribute("class", "predictionBarWrapper");
  predictionBar.setAttribute("class", "predictionBar");

  number.innerText = num;
  predictionBarWrapper.appendChild(predictionBar);

  numList.appendChild(predictionBarWrapper);
  numList.appendChild(number);
  results.appendChild(numList);
});

function preProcessCanvas(image) {
  let tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([28, 28])
    .mean(2)
    .expandDims(2)
    .expandDims()
    .toFloat();

  return tensor;
}

const predictResultsArr = document.getElementsByClassName("predictionBar");

predict.addEventListener("click", () => {
  if (model !== undefined) {
    gotResults();
  }
});

async function gotResults() {
  for (let i = 0; i < numbers.length; i++) {
    predictResultsArr[i].style.backgroundColor = "white";
    predictResultsArr[i].style.height = "0";
  }

  let tensor = preProcessCanvas(c);

  let predictions = await model.predict(tensor).data();

  let results = Array.from(predictions);

  var max = results[0];
  var maxIndex = 0;

  for (var i = 1; i < results.length; i++) {
    if (results[i] > max) {
      maxIndex = i;
      max = results[i];
    }
  }

  // console.log(predictResultsArr[maxIndex].id);

  predictResultsArr[maxIndex].style.backgroundColor = "rgb(50, 50, 50)";
  predictResultsArr[maxIndex].style.height = "200px";
}

function draw(event) {
  console.log(event);
  ctx.beginPath();
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.moveTo(coord.x, coord.y);
  reposition(event);
  ctx.lineTo(coord.x, coord.y);
  ctx.closePath();
  ctx.stroke();

  // gotResults();
}

function drawTouch(event) {
  console.log(event);
  ctx.beginPath();
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.moveTo(coord.x, coord.y);
  repositionTouch(event);
  ctx.lineTo(coord.x, coord.y);
  ctx.closePath();
  ctx.stroke();

  // gotResults();
}

clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
});
