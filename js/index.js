// Timer variables
let isRunning = false;
let workTime = 25 * 60;
let breakTime = 5 * 60;
let longBreakTime = 15 * 60;
let currentTime = workTime;
let timerInterval;
let isWorkMode = true;
let cycles = 0;
let focusTimeInMinutes = 0;
let sessionsBeforeLongBreak = 4;
let muteSounds = false;

// DOM elements
const timerDisplay = document.getElementById("timer");
const modeDisplay = document.getElementById("mode");
const toggleBtn = document.getElementById("toggleBtn");
const resetBtn = document.getElementById("resetBtn");
const skipBtn = document.getElementById("skipBtn");
const cyclesDisplay = document.getElementById("cycles");
const focusTimeDisplay = document.getElementById("focusTime");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const settingsForm = document.getElementById("settingsForm");
const closeBtn = document.getElementsByClassName("close")[0];
const skipConfirmModal = document.getElementById("skipConfirmModal");
const confirmSkipBtn = document.getElementById("confirmSkip");
const cancelSkipBtn = document.getElementById("cancelSkip");

// event listeners
toggleBtn.addEventListener("click", toggleTimer);

settingsBtn.addEventListener("click", () => {
  settingsModal.style.display = "block";
});
closeBtn.addEventListener("click", () => {
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
  if (currentTime > 0) {
    currentTime--;
    updateTimerDisplay();
    if (isWorkMode) {
      focusTimeInMinutes = Math.floor((workTime - currentTime) / 60);
      focusTimeDisplay.textContent = focusTimeInMinutes;
    }
  } else {
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
  if (isRunning) {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }
  hideSkipConfirmation();
}

function showSkipConfirmation() {
  skipConfirmModal.style.display = "block";
}

function hideSkipConfirmation() {
  skipConfirmModal.style.display = "none";
}

// reset
function resetTimer() {
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

  if (isWorkMode) {
    currentTime = workTime;
  } else if (cycles % sessionsBeforeLongBreak === 0) {
    currentTime = longBreakTime;
  } else {
    currentTime = breakTime;
  }

  updateTimerDisplay();
  settingsModal.style.display = "none";
  if (!muteSounds) cyberBeep.play();
}
