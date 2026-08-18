const buttonColours = ["red", "blue", "green", "yellow"];

let gamePattern = [];
let userClickedPattern = [];

let started = false;
let canClick = false;
let level = 0;
let highScore =
  Number(localStorage.getItem("simonHighScore")) || 0;


// START GAME
$(document).keydown(() => {
  if (!started) {
    started = true;
    canClick = false;

    $("#level-title").text("Get Ready!");

    setTimeout(() => {
      nextSequence();
    }, 1500);
  }
});


// BUTTON CLICK
$(".btn").click(function () {
  if (!started || !canClick) return;

  const userChosenColour = $(this).attr("id");

  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});


// NEXT LEVEL
const nextSequence = () => {
  canClick = false;

  userClickedPattern = [];

  level++;
  if (level > highScore) {
  highScore = level;

  localStorage.setItem(
    "simonHighScore",
    highScore
  );
}

  $("#level-title").text(
  `Level ${level} | High Score: ${highScore}`
  );

  const randomNumber = Math.floor(
    Math.random() * buttonColours.length
  );

  const randomChosenColour = buttonColours[randomNumber];

  gamePattern.push(randomChosenColour);

  $(`#${randomChosenColour}`)
    .fadeOut(100)
    .fadeIn(100);

  playSound(randomChosenColour);

  setTimeout(() => {
    canClick = true;
  }, 500);
};


// CHECK ANSWER
const checkAnswer = (currentIndex) => {
  if (
    gamePattern[currentIndex] !==
    userClickedPattern[currentIndex]
  ) {
    canClick = false;

    playSound("wrong");

    $("body").addClass("game-over");

    $("#level-title").text("Wrong! Restarting...");

    setTimeout(() => {
      $("body").removeClass("game-over");

      startOver();

      started = true;

      $("#level-title").text("Get Ready!");

      setTimeout(() => {
        nextSequence();
      }, 1500);

    }, 1000);

    return;
  }

  if (userClickedPattern.length === gamePattern.length) {
    canClick = false;

    setTimeout(() => {
      nextSequence();
    }, 1000);
  }
};


// BUTTON ANIMATION
const animatePress = (currentColour) => {
  $(`#${currentColour}`).addClass("pressed");

  setTimeout(() => {
    $(`#${currentColour}`).removeClass("pressed");
  }, 100);
};


// SOUND
const playSound = (name) => {
  const audioContext =
    new (window.AudioContext || window.webkitAudioContext)();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  const frequencies = {
    red: 261.63,
    blue: 329.63,
    green: 392,
    yellow: 523.25,
    wrong: 110
  };

  oscillator.frequency.value = frequencies[name];

  oscillator.type =
    name === "wrong" ? "sawtooth" : "sine";

  gainNode.gain.setValueAtTime(
    0.4,
    audioContext.currentTime
  );

  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.4
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + 0.4
  );
};


// RESET GAME
const startOver = () => {
  level = 0;

  gamePattern = [];
  userClickedPattern = [];

  started = false;
  canClick = false;
};