// Store leaderboard data for single-player and two-player modes
let singlePlayerLeaderboard = []; // Single-player leaderboard
let dualPlayerLeaderboard = [];   // Two-player leaderboard

// Add player score
function addScore(displayName, score, isDouble, keyName = null) {
  const leaderboard = isDouble ? dualPlayerLeaderboard : singlePlayerLeaderboard;

  let nameKey = isDouble ? keyName : displayName;

  // Search for existing records
  const existingPlayer = leaderboard.find((player) => player.key === nameKey);

  if (existingPlayer) {
    if (score > existingPlayer.score) {
      existingPlayer.score = score;
      existingPlayer.name = displayName; // Update the display name as the current input order
    }
  } else {
    leaderboard.push({ name: displayName, score, key: nameKey });
  }

  sortLeaderboard(leaderboard);
  saveLeaderboard();
}


// Sort the leaderboard
function sortLeaderboard(leaderboard) {
  leaderboard.sort((a, b) => b.score - a.score); // Sort by score descending
}

// Save leaderboard to localStorage
function saveLeaderboard() {
  localStorage.setItem("singlePlayerLeaderboard", JSON.stringify(singlePlayerLeaderboard));
  localStorage.setItem("dualPlayerLeaderboard", JSON.stringify(dualPlayerLeaderboard));
}

// Load leaderboard from localStorage
function loadLeaderboard() {
  const singleData = localStorage.getItem("singlePlayerLeaderboard");
  const dualData = localStorage.getItem("dualPlayerLeaderboard");

  if (singleData) {
    singlePlayerLeaderboard = JSON.parse(singleData);
  }
  if (dualData) {
    dualPlayerLeaderboard = JSON.parse(dualData);
  }
}

// Get single-player leaderboard data
function getSinglePlayerLeaderboard() {
  return singlePlayerLeaderboard;
}

// Get two-player leaderboard data
function getDualPlayerLeaderboard() {
  return dualPlayerLeaderboard;
}

// Initialize leaderboard
function initLeaderboard() {
  loadLeaderboard();
}

// Clear leaderboard
function clearLeaderboard(isDouble) {
  if (isDouble) {
    dualPlayerLeaderboard = [];
  } else {
    singlePlayerLeaderboard = [];
  }
  saveLeaderboard();
  displayLeaderboard(isDouble); // Refresh the leaderboard display
}

// Display leaderboard
function displayLeaderboard(isDouble) {
   // Get leaderboard panel
  const rankPanel = isDouble ? document.getElementById("rankPanel2") : document.getElementById("rankPanel1");
  const scoreList = rankPanel.querySelector("#scoreList");

   // Clear old data
  scoreList.innerHTML = "";

  // Get leaderboard data based on mode
  const leaderboard = isDouble ? getDualPlayerLeaderboard() : getSinglePlayerLeaderboard();
  const maxEntries = 5; // Show only top 5

  // Fill in leaderboard data
  leaderboard.slice(0, maxEntries).forEach((player, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${player.name}: ${player.score} points`;
    scoreList.appendChild(listItem);
  });

  // Show leaderboard panel
  rankPanel.style.display = "block";

  // Add clear button
function addClearButton(panelId, isDouble) {
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.classList.add("clear-button"); // Use CSS class
  
    clearButton.onclick = function () {
      clearLeaderboard(isDouble); // Clear leaderboard for corresponding mode
    };
  
    // Add clear button to leaderboard panel
    const rankPanel = document.getElementById(panelId);
    rankPanel.appendChild(clearButton);
  }
}

// Initialize leaderboard
initLeaderboard();




