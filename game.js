"use strict";

const buttonColours = ["red", "blue", "green", "yellow"];
const colourButtons = buttonColours.map(colour => document.getElementById(colour));
const title = document.getElementById("level-title");
const instruction = document.getElementById("instruction");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-button");

let gamePattern = [];
let userClickedPattern = [];
let started = false;
let canClick = false;
let level = 0;
let highScore = 0;
let sessionId = 0;
let audioContext;

try {
  highScore = Number(localStorage.getItem("simonHighScore")) || 0;
} catch {
  // Game remains playable when browser storage is unavailable.
}
updateScore();

function updateScore() {
  scoreDisplay.textContent = `Best completed level: ${highScore}`;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setInputEnabled(enabled) {
  canClick = enabled;
  colourButtons.forEach(button => {
    button.disabled = !enabled;
  });
}

function playSound(name) {
  const AudioContextType = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextType) return;
  try {
    if (!audioContext) audioContext = new AudioContextType();
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
    const frequencies = { red: 261.63, blue: 329.63, green: 392, yellow: 523.25, wrong: 110 };
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = name === "wrong" ? "sawtooth" : "sine";
    oscillator.frequency.setValueAtTime(frequencies[name], audioContext.currentTime);
    gain.gain.setValueAtTime(0.22, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.32);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.33);
  } catch {
    // Visual gameplay works even if sound playback is blocked.
  }
}

async function flashColour(colour, token) {
  if (token !== sessionId) return;
  const button = document.getElementById(colour);
  button.classList.add("flash");
  playSound(colour);
  await delay(420);
  button.classList.remove("flash");
  await delay(210);
}

async function nextSequence(token) {
  if (!started || token !== sessionId) return;
  setInputEnabled(false);
  userClickedPattern = [];
  level += 1;
  gamePattern.push(buttonColours[Math.floor(Math.random() * buttonColours.length)]);
  title.textContent = `Level ${level}`;
  instruction.textContent = "Watch the full sequence…";
  await delay(600);
  for (const colour of gamePattern) {
    if (token !== sessionId || !started) return;
    await flashColour(colour, token);
  }
  if (token !== sessionId || !started) return;
  instruction.textContent = "Your turn! Repeat the sequence.";
  setInputEnabled(true);
}

function beginGame() {
  if (started) return;
  sessionId += 1;
  const token = sessionId;
  started = true;
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  startButton.hidden = true;
  document.body.classList.remove("game-over");
  title.textContent = "Get Ready!";
  instruction.textContent = "Remember the order of the colors.";
  setInputEnabled(false);
  nextSequence(token);
}

function endGame() {
  const token = ++sessionId;
  started = false;
  setInputEnabled(false);
  playSound("wrong");
  document.body.classList.add("game-over");
  title.textContent = "Game Over!";
  instruction.textContent = `You completed ${Math.max(0, level - 1)} level(s). Try again!`;
  startButton.textContent = "Play Again";
  startButton.hidden = false;
  setTimeout(() => {
    if (token === sessionId) document.body.classList.remove("game-over");
  }, 550);
}

function checkAnswer(index) {
  if (gamePattern[index] !== userClickedPattern[index]) {
    endGame();
    return;
  }

  if (userClickedPattern.length === gamePattern.length) {
    setInputEnabled(false);
    // High scores count completed levels, not levels merely entered.
    if (level > highScore) {
      highScore = level;
      try { localStorage.setItem("simonHighScore", String(highScore)); } catch {}
      updateScore();
    }
    instruction.textContent = "Correct! Next level…";
    const token = sessionId;
    setTimeout(() => nextSequence(token), 950);
  }
}

colourButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (!started || !canClick) return;
    const colour = button.id;
    userClickedPattern.push(colour);
    playSound(colour);
    button.classList.add("pressed");
    setTimeout(() => button.classList.remove("pressed"), 150);
    checkAnswer(userClickedPattern.length - 1);
  });
});

startButton.addEventListener("click", beginGame);
document.addEventListener("keydown", event => {
  if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
  if (!started && !["Tab", "Shift", "Control", "Alt", "Meta"].includes(event.key)) beginGame();
});
