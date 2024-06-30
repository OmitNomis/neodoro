const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeBtn = document.getElementsByClassName("close")[0];

settingsBtn.addEventListener("click", () => {
  settingsModal.style.display = "block";
});
closeBtn.addEventListener("click", () => {
  settingsModal.style.display = "none";
});
