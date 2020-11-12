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
let resultRevealSection = document.getElementById("resultReveal");

function generateRandomNote() {
  let index = Math.floor(Math.random() * musicalNotes.length);
  let selection = musicalNotes[index];
  return { selection, index };
}

function revealNoteName(arrOfNotes) {
  for (note of arrOfNotes) {
    let noteName = document.createElement("div");
    noteName.className = "noteReveal";
    noteName.innerHTML = note.selection;
    document.getElementById("noteRevealSection").appendChild(noteName);
  }
}

function notesSelection(noteAmount, difficultyLevel) {
  //Scaling from 10 as easiest to 1 as hardest
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
  let isHigher = arrOfNotes[1].index > arrOfNotes[0].index ? true : false;
  return isHigher;
}

function revealAnswer(isHigher) {
  let higherText = document.createElement("div");
  higherText.innerHTML = isHigher ? "Higher" : "Lower";
  document.getElementById("noteRevealSection").appendChild(higherText);
}

// let selection = notesSelection(3, 4);
// revealNoteName(selection);
// revealAnswer(isSecondNoteHigher(selection));

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

let stage = 2;
let difficultyLevel = 10;
let notes;
let roundNum = 1;

function updateRound() {
  document.getElementById(
    "roundDisplay"
  ).textContent = `You will hear ${stage} notes. You are on Round ${roundNum}`;
}

document
  .getElementById("play")
  .addEventListener("click", () => playRound(stage, difficultyLevel));

function playRound(stage, difficultyLevel) {
  notes = notesSelection(stage, difficultyLevel);
  playAllNotes(notes);
  console.log(notes[0].selection, notes[1].selection);
}
document.getElementById("ishigher").addEventListener("click", () => {
  // document.getElementById("play").removeEventListener("click", playItSam);
  isHigher(notes) ? success() : failure();
});

document.getElementById("islower").addEventListener("click", () => {
  // document.getElementById("play").removeEventListener("click", playItSam);s
  isHigher(notes) ? failure() : success();
});

function displayCountdown() {
  let count = 4;
  resultRevealSection.textContent = `Correct! Next round in...`;
  let countdownDiv = document.getElementById("countdown");
  let countdown = window.setInterval(() => {
    count--;
    countdownDiv.textContent = count;
  }, 1000);
  window.setTimeout(() => {
    clearInterval(countdown);
    resultRevealSection.textContent = `Click "Play Sound" to Start`;
    countdownDiv.textContent = "";
    toggleButtonDisplay();
  }, 4000);
}

function toggleButtonDisplay() {
  let buttonContainer = document.getElementById("buttonzone");
  buttonContainer.style.display =
    buttonContainer.style.display === "none" ? "block" : "none";
}

function success() {
  toggleButtonDisplay();
  displayCountdown();
  if (difficultyLevel === 1) {
    stage += 1;
    difficultyLevel = 10;
  } else {
    difficultyLevel -= 1;
  }
  roundNum++;
  updateRound();
}

function failure() {
  resultRevealSection.textContent = "WHOMP WHOMP! Start again.";
  stage = 2;
  difficultyLevel = 10;
  roundNum = 1;
  updateRound();
}
