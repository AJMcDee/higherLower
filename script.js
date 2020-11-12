//DOM and Event Listeners

let resultRevealSection = document.getElementById("resultReveal");

document
  .getElementById("play")
  .addEventListener("click", () => playRound(stage, difficultyLevel));

document.getElementById("ishigher").addEventListener("click", () => {
  // document.getElementById("play").removeEventListener("click", playItSam);
  isHigher(notes) ? success() : failure();
});

document.getElementById("islower").addEventListener("click", () => {
  // document.getElementById("play").removeEventListener("click", playItSam);s
  isHigher(notes) ? failure() : success();
});

//Settings and setup
let musicalNotes = [
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
  "C",
];

function generateRandomNote() {
  let index = Math.floor(Math.random() * musicalNotes.length);
  let selection = musicalNotes[index];
  return { selection, index };
}

function notesSelection(noteAmount, difficultyLevel) {
  //Scaling from 5 as easiest to 1 as hardest
  let finalNotes = [];
  for (let i = 0; i < noteAmount - 1; i++) {
    finalNotes.push(generateRandomNote());
  }
  do {
    let firstNote = generateRandomNote();
    let lastNote = generateRandomNote();
    if (Math.abs(firstNote.index - lastNote.index) === difficultyLevel) {
      finalNotes[0] = firstNote;
      finalNotes.push(lastNote);
    }
  } while (finalNotes.length < noteAmount);
  return finalNotes;
}

function isHigher(arrOfNotes) {
  let isHigher =
    arrOfNotes[arrOfNotes.length - 1].index > arrOfNotes[0].index
      ? true
      : false;
  return isHigher;
}

// Audio functions

function playNote(noteObject) {
  let testNote = new Audio(`./files/${noteObject.index}.mp3`);
  testNote.addEventListener("canplaythrough", () => {
    document
      .getElementById("play")
      .addEventListener("click", () => testNote.play());
  });
}

function playAllNotes(arrOfNotes) {
  let arrOfAudio = [];
  for (let note of arrOfNotes) {
    let noteAudio = new Audio(`./files/${note.index}.mp3`);
    arrOfAudio.push(noteAudio);
  }

  let currentAudio = null;
  let index = 0;
  function playNote() {
    if (currentAudio) {
      currentAudio.removeEventListener("ended", playNote); // remove the event listener from the audio that has just stopped playing
    }
    if (index >= arrOfAudio.length) {
      return;
    }
    currentAudio = arrOfAudio[index];
    index++; // when 'playNote' is called the next time, the next note will be played
    currentAudio.play(); // when this ends, the 'ended' event will be fired and 'playNote' will be called
    currentAudio.addEventListener("ended", playNote);
  }
  playNote();
}

// Gameplay

let stage = 2;
let difficultyLevel = 5;
let notes;
let roundNum = 1;

function playRound(stage, difficultyLevel) {
  notes = notesSelection(stage, difficultyLevel);
  playAllNotes(notes);
}

function success() {
  toggleButtonDisplay();
  displayCountdown("success");
  if (difficultyLevel === 1) {
    stage += 1;
    difficultyLevel = 5;
  } else {
    difficultyLevel -= 1;
  }
  roundNum++;
  updateRound();
}

function failure() {
  toggleButtonDisplay();
  displayCountdown("failure");
  stage = 2;
  difficultyLevel = 5;
  roundNum = 1;
  updateRound();
}

// DOM Updates and Toggles

function updateRound() {
  document.getElementById(
    "roundDisplay"
  ).textContent = `You will hear ${stage} notes. You are on Round ${roundNum}.`;
}

function toggleButtonDisplay() {
  let buttonContainer = document.getElementById("buttonzone");
  buttonContainer.style.display =
    buttonContainer.style.display === "none" ? "block" : "none";
}

function displayCountdown(status) {
  let count = 4;
  resultRevealSection.textContent =
    status === "success"
      ? `Correct! Next round in...`
      : "WHOMP WHOMP! Start again from the beginning in...";
  let countdownDiv = document.getElementById("countdown");
  let countdown = window.setInterval(() => {
    count--;
    countdownDiv.textContent = count;
  }, 1000);
  window.setTimeout(() => {
    clearInterval(countdown);
    resultRevealSection.textContent = "";
    countdownDiv.textContent = "";
    toggleButtonDisplay();
  }, 4000);
}
