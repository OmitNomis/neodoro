// Timer variables
let isRunning = false;
let workTime = 25 * 60;
let breakTime = 5 * 60;
let longBreakTime = 15 * 60;
let currentTime = workTime;
let timerInterval;
let isWorkMode = true;
let cycles = 0;
let sessionsBeforeLongBreak = 4;
let muteSounds = false;

// DOM elements
const timerDisplay = document.getElementById("timer");
const modeDisplay = document.getElementById("mode");
const toggleBtn = document.getElementById("toggleBtn");
const resetBtn = document.getElementById("resetBtn");
const skipBtn = document.getElementById("skipBtn");
const cyclesDisplay = document.getElementById("cycles");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const settingsForm = document.getElementById("settingsForm");
const closeBtn = document.getElementsByClassName("close")[0];
const skipConfirmModal = document.getElementById("skipConfirmModal");
const confirmSkipBtn = document.getElementById("confirmSkip");
const cancelSkipBtn = document.getElementById("cancelSkip");

// audio elements
const clickSound1 = document.getElementById("click1");
const clickSound2 = document.getElementById("click2");
const clickSound3 = document.getElementById("click3");
const openSound = document.getElementById("open");
const closeSound = document.getElementById("close");
const alarmSound = document.getElementById("alarm");

const clickSounds = [clickSound1, clickSound2, clickSound3];

// play random sound for click.
function playRandomClickSound() {
  const randomIndex = Math.floor(Math.random() * clickSounds.length);
  const selectedSound = clickSounds[randomIndex];
  selectedSound.play();
}

// event listeners
toggleBtn.addEventListener("click", toggleTimer);

settingsBtn.addEventListener("click", () => {
  settingsModal.style.display = "block";
  if (!muteSounds) openSound.play();
});
closeBtn.addEventListener("click", () => {
  if (!muteSounds) closeSound.play();
  settingsModal.style.display = "none";
});
skipBtn.addEventListener("click", showSkipConfirmation);
cancelSkipBtn.addEventListener("click", hideSkipConfirmation);
confirmSkipBtn.addEventListener("click", skipTimer);
resetBtn.addEventListener("click", resetTimer);
settingsForm.addEventListener("submit", saveSettings);

// functions

function updateTimerDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function toggleTimer() {
  if (!muteSounds) playRandomClickSound();
  if (isRunning) {
    clearInterval(timerInterval);
    toggleBtn.textContent = "Resume";
  } else {
    timerInterval = setInterval(updateTimer, 1000);
    toggleBtn.textContent = "Pause";
  }
  isRunning = !isRunning;
  resetBtn.disabled = isRunning;
}

function updateTimer() {
  if (currentTime > 1) {
    currentTime--;
    updateTimerDisplay();
  } else {
    alarmSound.play();
    clearInterval(timerInterval);
    isRunning = false;
    if (isWorkMode) {
      cycles++;
      cyclesDisplay.textContent = cycles;
      if (cycles % sessionsBeforeLongBreak === 0) {
        currentTime = longBreakTime;
        modeDisplay.textContent = "Long Break Mode";
      } else {
        currentTime = breakTime;
        modeDisplay.textContent = "Break Mode";
      }
    } else {
      currentTime = workTime;
      modeDisplay.textContent = "Work Mode";
    }
    isWorkMode = !isWorkMode;
    document.body.classList.toggle("break-mode");
    updateTimerDisplay();
    toggleBtn.textContent = "Start";
    resetBtn.disabled = false;
  }
}
// skip timer

function skipTimer() {
  if (!muteSounds) playRandomClickSound();
  if (isWorkMode) {
    cycles++;
    cyclesDisplay.textContent = cycles;
    if (cycles % sessionsBeforeLongBreak === 0) {
      currentTime = longBreakTime;
      modeDisplay.textContent = "Long Break Mode";
    } else {
      currentTime = breakTime;
      modeDisplay.textContent = "Break Mode";
    }
  } else {
    currentTime = workTime;
    modeDisplay.textContent = "Work Mode";
  }
  isWorkMode = !isWorkMode;
  document.body.classList.toggle("break-mode");
  if (isRunning) {
    toggleTimer();
  }
  toggleBtn.textContent = "Start";
  resetBtn.disabled = true;
  updateTimerDisplay();
  skipConfirmModal.style.display = "none";
}

function showSkipConfirmation() {
  if (!muteSounds) openSound.play();
  skipConfirmModal.style.display = "block";
}

function hideSkipConfirmation() {
  if (!muteSounds) closeSound.play();
  skipConfirmModal.style.display = "none";
}

// reset
function resetTimer() {
  if (!muteSounds) playRandomClickSound();
  clearInterval(timerInterval);
  isRunning = false;
  console.log(modeDisplay.textContent);
  if (modeDisplay.textContent === "Work Mode") {
    currentTime = workTime;
  } else if (modeDisplay.textContent === "Break Mode") {
    currentTime = breakTime;
  } else {
    currentTime = longBreakTime;
  }
  updateTimerDisplay();
  toggleBtn.textContent = "Start";
  resetBtn.disabled = true;
}
function saveSettings(e) {
  e.preventDefault();
  workTime = document.getElementById("workDuration").value * 60;
  breakTime = document.getElementById("breakDuration").value * 60;
  longBreakTime = document.getElementById("longBreakDuration").value * 60;
  sessionsBeforeLongBreak = document.getElementById(
    "sessionsBeforeLongBreak"
  ).value;
  muteSounds = document.getElementById("muteSounds").checked;
  if (!muteSounds) playRandomClickSound();

  // Save settings to localStorage
  const settings = {
    workTime,
    breakTime,
    longBreakTime,
    sessionsBeforeLongBreak,
    muteSounds,
  };
  localStorage.setItem("pomodoroSettings", JSON.stringify(settings));

  if (isWorkMode) {
    currentTime = workTime;
  } else if (cycles % sessionsBeforeLongBreak === 0) {
    currentTime = longBreakTime;
  } else {
    currentTime = breakTime;
  }

  updateTimerDisplay();
  settingsModal.style.display = "none";
}
function loadSettings() {
  const savedSettings = localStorage.getItem("pomodoroSettings");
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    workTime = settings.workTime;
    breakTime = settings.breakTime;
    longBreakTime = settings.longBreakTime;
    sessionsBeforeLongBreak = settings.sessionsBeforeLongBreak;
    muteSounds = settings.muteSounds;

    document.getElementById("workDuration").value = workTime / 60;
    document.getElementById("breakDuration").value = breakTime / 60;
    document.getElementById("longBreakDuration").value = longBreakTime / 60;
    document.getElementById("sessionsBeforeLongBreak").value =
      sessionsBeforeLongBreak;
    document.getElementById("muteSounds").checked = muteSounds;

    currentTime = workTime;
    updateTimerDisplay();
  }
}

// Call loadSettings when the page loads
document.addEventListener("DOMContentLoaded", loadSettings);
