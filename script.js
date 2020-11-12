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

function isSecondNoteHigher(arrOfNotes) {
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
  document.getElementById("play").addEventListener("click", () => {
    for (let audiofile of arrOfAudio) {
      audiofile.play();
    }
  });
}

let notes = notesSelection(2, 10);
playAllNotes(notes);
