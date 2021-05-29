const droptarget = document.querySelector(".drop-target");
const filltarget = document.querySelector(".fill");
const texts = document.querySelectorAll(".game-info")
const goal = texts[0];
const margin = texts[1];
const currentLevel = texts[2];
const overlayWin = document.querySelector('.win');
const overlayLost = document.querySelector('.lost');
const overlayFinished = document.querySelector('.finish');
const nextButton = document.querySelector('.next');
const restartButtons = document.querySelectorAll('.restart');
const resetButton = document.querySelector('.reset');
let height = 0;

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.ceil(max));
}
let threshold = getRandomInt(100000);
let marginOfError = 10;

const nextLevel = () => {
  if (localStorage.getItem('marginOfError')) {
    marginOfError = localStorage.getItem('marginOfError');
    marginOfError--;
    localStorage.setItem('marginOfError', marginOfError);
  }
  threshold = getRandomInt(100000);
  goal.innerText = `Goal: ${threshold} bytes`;
  localStorage.setItem('marginOfError', marginOfError);
  overlayWin.style.display = 'none';
  height = 0;
  filltarget.style.height = height;
  output.innerHTML = "";
  margin.innerText = `Margin of error: ${localStorage.getItem('marginOfError') || marginOfError}%`;
  currentLevel.innerText = `Current Level: ${localStorage.getItem('marginOfError') ? 11 - localStorage.getItem('marginOfError'): 1}`;
};

const restart = () => {
  location.reload();
};

const reset = () => {
  localStorage.removeItem('marginOfError');
  location.reload();
};

const isWin = (result, margin) => Math.abs(100 - result) <= margin;
const isLost = (result, margin) => result - 100 > margin;
const isFinish = () => localStorage.getItem('marginOfError') === "1";
function handleEvent(event) {
  let output = document.getElementById("output"),
    files, i, len;
  event.preventDefault();
  
  if (event.type == "drop") {
    files = event.dataTransfer.files;
    i = 0;
    len = files.length;
  
    while (i < len) {
      height += files[i].size;
      i++;
    }
    let result = (height/threshold) * 100;
    filltarget.style.height = result + "%";
    output.innerHTML = filltarget.style.height;
    if (isWin(result, marginOfError) && isFinish()) {
      overlayFinished.style.display = "flex";
    }  else if (isWin(result, marginOfError)) {
      overlayWin.style.display = 'flex';
    } else if (isLost(result, marginOfError)) {
      overlayLost.style.display = 'flex';
    }
  }
}

droptarget.addEventListener("dragenter", handleEvent);
droptarget.addEventListener("dragover", handleEvent);
droptarget.addEventListener("drop", handleEvent);    
goal.innerText = `Goal: ${threshold} bytes`;
margin.innerText = `Margin of error: ${localStorage.getItem('marginOfError') || marginOfError}%`;
currentLevel.innerText = `Current Level: ${localStorage.getItem('marginOfError') ? 11 - localStorage.getItem('marginOfError'): 1}`;
overlayWin.style.display = 'none';
overlayLost.style.display = 'none';
overlayFinished.style.display = 'none';
restartButtons.forEach(btn => {
  btn.addEventListener("click", restart);
});
nextButton.addEventListener("click", nextLevel);
resetButton.addEventListener("click", reset);
