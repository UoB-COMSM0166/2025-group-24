/** 
 * Set event listeners with UI
 * Note: Core logic functions (e.g., showGameEnter, createBulletForPlane) are provided by part2.js
 */
window.onload = function(){
  initLeaderboard(); // Initialize leaderboard
  setupLeaderboardPanels(); // Set up leaderboard panels
  // ==========  Homepage button events ==========
  startBtn.onclick=function(){
    homePage.style.display="none";
    selectMode.style.display="block";
  };
  // Leaderboard button click event
rankBtn.onclick = function () {
   // Hide other screens
  homePage.style.display = "none";
  selectMode.style.display = "none";
  gameEnter.style.display = "none";

  // Show single-player leaderboard by default
  displayLeaderboard(false);
};

// Single/Double leaderboard switch buttons
document.querySelectorAll("#rankSingle").forEach(button => {
  button.onclick = function () {
    // Hide double-player leaderboard
    document.getElementById("rankPanel2").style.display = "none";
     // Show single-player leaderboard
    displayLeaderboard(false);
  };
});

document.querySelectorAll("#rankDouble").forEach(button => {
  button.onclick = function () {
     // Hide single-player leaderboard
    document.getElementById("rankPanel1").style.display = "none";
    // Show double-player leaderboard
    displayLeaderboard(true);
  };
});

// Clear leaderboard button
function addClearButton(panelId, isDouble) {
  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear Leaderboard";
  // Add CSS class name for styling
  clearButton.className = "clear-leaderboard-button";

  clearButton.onclick = function () {
    clearLeaderboard(isDouble); // Clear leaderboard for corresponding mode
  };

  // Add the button to the specified panel (DOM element specified by panelId)
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.appendChild(clearButton);
  }
}


 // Add clear button when leaderboard page is loaded
function setupLeaderboardPanels() {
  addClearButton("rankPanel1", false); // Single-player clear button
  addClearButton("rankPanel2", true);  // Double-player clear button
}

// Handle back button click
function handleBackButtonClick(isDouble) {
  if (isDouble) {
     // Handle return logic for double-player mode
    document.getElementById("rankPanel2").style.display = "none";
    document.getElementById("homePage").style.display = "block";
  } else {
     // Handle return logic for single-player mode
    document.getElementById("rankPanel1").style.display = "none";
    document.getElementById("homePage").style.display = "block";
  }
}

// Bind event listeners
document.getElementById("backBtn1").addEventListener("click", function() {
  handleBackButtonClick(false); // Single-player
});

document.getElementById("backBtn2").addEventListener("click", function() {
  handleBackButtonClick(true); // Double-player
});





  // ========== Single / Double buttons ==========
  singleBtn.onclick=function(){
    isDouble=false;
    nameInput.value="";
    nameInput1.value="";
    nameInput2.value="";
    errMsg1.innerText="";
    errMsg2.innerText="";
    errMsg3.innerText="";
    selectMode.style.display="none";
    enterName.style.display="block";
  };

  
  doubleBtn.onclick=function(){
  isDouble=true;
  playerName1 = ""; 
  playerName2 = ""; 
  nameInput.value="";
  nameInput1.value="";
  nameInput2.value="";
  errMsg1.innerText="";
  errMsg2.innerText="";
  errMsg3.innerText="";
  selectMode.style.display="none";
  enterName2.style.display="block";
};

  // Double-player mode start button
doubleEnter.onclick=function(){
  const val = nameInput1.value.trim();
  if (!val) {
    errMsg2.innerText = "Player name cannot be empty!";
    return;
  }

  errMsg2.innerText = "";
  playerName1 = val;
  nameInput.value = "";

  // Mode flag
  leftModel = true;
  rightModel = false;

  // Page transition
  enterName2.style.display="none";
  enterName3.style.display="block";
};

// Double-player mode second entry
doubleEnter1.onclick=function(){
  const val = nameInput2.value.trim();
  if (!val) {
    errMsg3.innerText = "Player name cannot be empty!";
    return;
  }

  errMsg1.innerText = "";
  playerName2 = val;
  nameInput.value = "";

  // Mode flag
  leftModel = true;
  rightModel = false;

  // Page transition
  enterName3.style.display="none";
  Intro2.style.display="block";
};

  

  // ========== Single-player left/right hand mode selection ==========
 // Left CHOOSE click: input name and enter left mode
leftEnter.onclick = function () {
  const val = nameInput.value.trim();
  if (!val) {
    errMsg1.innerText = "Player name cannot be empty!";
    return;
  }

  errMsg1.innerText = "";
  playerName1 = val;
  nameInput.value = "";

  // Mode flag
  leftModel = true;
  rightModel = false;

  // Page transition
  enterName.style.display = "none";
  Intro2.style.display = "block";
};



// Right CHOOSE click: input name and enter right mode
rightEnter.onclick = function () {
  const val = nameInput.value.trim();
  if (!val) {
    errMsg1.innerText = "Player name cannot be empty!";
    return;
  }

  errMsg1.innerText = "";
  playerName1 = val;
  nameInput.value = "";

  rightModel = true;
  leftModel = false;

  enterName.style.display = "none";
  Intro2.style.display = "block";
};






  // ========== Enter Introduction 2 ==========
  nextBtn.onclick = function(){
    Intro2.style.display = "none";
    Intro3.style.display = "block";
  }

  // ========== Enter Introduction 3 ==========
  finalStartBtn.onclick = function(){
    Intro3.style.display = "none";
    HaveEnteredGame  = true ;
    // Also call showGameEnter() from part2.js
    showGameEnter();
  }


  
  // ========== Keyboard control movement ==========
  document.onkeydown = function(e) {
    if(!gameStatus) return;
    let key=e.key.toLowerCase();
    // If in double-player mode
  // player1 (WASD / F)
    if(isDouble){
    switch(e.key){
      case 'w': p1Up=true;   break;
      case 's': p1Down=true; break;
      case 'a': p1Left=true; break;
      case 'd': p1Right=true;break;
      case 'f':
        // createBulletForPlane from part2.js
        createBulletForPlane(myPlane, plane1X, plane1Y, myPlaneW, myPlaneH);
        break;
    }

    // Player 2 (Arrow keys / L)
    switch(e.key){
      case 'ArrowUp':   p2Up=true;   break;
      case 'ArrowDown': p2Down=true; break;
      case 'ArrowLeft': p2Left=true; break;
      case 'ArrowRight':p2Right=true;break;
      case 'l':
        // createBulletForPlane from part2.js
        createBulletForPlane(myPlane2, plane2X, plane2Y, myPlane2W, myPlane2H);
        break;
    }
  }

   // If in single-player mode
   // Left-hand mode
    if(leftModel){
      switch(key){
        case 'w': p1Up=true;   break;
        case 's': p1Down=true; break;
        case 'a': p1Left=true; break;
        case 'd': p1Right=true;break;
        case 'f':

          createBulletForPlane(myPlane, plane1X, plane1Y, myPlaneW, myPlaneH);
          break;
      }
    
    }
  // Right-hand mode
    if(rightModel){
        switch(e.key){
          case 'ArrowUp':   p1Up=true;   break;
          case 'ArrowDown': p1Down=true; break;
          case 'ArrowLeft': p1Left=true; break;
          case 'ArrowRight':p1Right=true;break;
          case 'l':
            createBulletForPlane(myPlane, plane1X, plane1Y, myPlaneW, myPlaneH);
            break;
        }
      }

  };


   // ========== Pause and resume ==========
   document.onkeyup=function(e){
    if(HaveEnteredGame){
        // Press space to pause/resume
        if(e.keyCode===32){
          if(gameStatus){
            gameStatus=false;
            pauseTip.style.display="block";
            pauseAllBullets();
            pauseAllEnemies();
            pauseAllmeteorites();
            clearInterval(bgTimer);
            clearInterval(enemyFireTimer);
            clearInterval(meteoriteTimer);
            meteoriteTimer
            bgTimer=null;
            enemyFireTimer=null;
            meteoriteTimer-null;
          } else {
            gameStatus=true;
            pauseTip.style.display="none";
            resumeAllBullets();
            resumeAllEnemies();
            resumeAllmeteorites()
            startEnemyFire();
            createEnemyBullet(e);
          }
          return;
        }
    
        var key=e.key.toLowerCase();                       
        // player1
        switch(key){
          case 'w': p1Up=false;   break;
          case 's': p1Down=false; break;
          case 'a': p1Left=false; break;
          case 'd': p1Right=false;break;
        }
    
        switch (e.key) {
          case 'ArrowUp': p1Up = false; break;
          case 'ArrowDown': p1Down = false; break;
          case 'ArrowLeft': p1Left = false; break;
          case 'ArrowRight': p1Right = false; break;
      }
      
        // player2
        if(isDouble){
          switch(e.key){
            case 'ArrowUp':   p2Up=false;   break;
            case 'ArrowDown': p2Down=false; break;
            case 'ArrowLeft': p2Left=false; break;
            case 'ArrowRight':p2Right=false;break;
          }
        }
      };
      }
    
    
    }; 



// ==========  Display HP hearts  ==========

const heartsContainer = document.getElementById('hearts-container');

function initializeHearts() {
  heartsContainer.innerHTML = '';
  
  let hp = isDouble ? totalHp : plane1Hp; // Use total HP for double, plane1Hp for single
  for (let i = 0; i < hp; i++) {
      const heart = document.createElement('div');
      heart.classList.add('heart');
      heartsContainer.appendChild(heart);
  }
}

// Lose one heart
function loseHeart() {
   {
      heartsContainer.removeChild(heartsContainer.lastChild);
  } 
}


// ========== Audio ==========
// Create audio object
const bgm = new Audio("audio/Red Doors.mp3");
bgm.loop = true; // Loop playback
bgm.volume = 0.5; // Volume

// Play music after user interaction
document.getElementById("startBtn").addEventListener("click", () => {
  bgm.play();
});



