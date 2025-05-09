/**
 * After the player enters their name, officially enter the game
 * Set initial player positions, display round prompts, and start main logic
 */
function showGameEnter() {
  gameEnter.style.display = "block";
  myPlane.style.display = "block";


   // Check if it's two-player mode
  if (isDouble) {
    myPlane2.style.display = "block";
    playerInfo.innerText = "Two-player mode: P1(" + playerName1 + ") & P2(" + playerName2 + ")";
  } else {
    myPlane2.style.display = "none";
    playerInfo.innerText = "Single-player mode: Player(" + playerName1 + ")";
  }

  // Set initial position for player 1
  plane1X = 440;
  plane1Y = 400;
  myPlane.style.left = plane1X + "px";
  myPlane.style.top  = plane1Y + "px";
  myPlane.style.display = "block";

   // Set initial position for player 2 (if two-player mode)
  plane2X = 880;
  plane2Y = 400;
  myPlane2.style.left = plane2X + "px";
  myPlane2.style.top  = plane2Y + "px";

  // Display round prompt
  if (currentRound === 1) {
    roundPopup.innerText = "ROUND ONE";
  } else if (currentRound === 2) {
    roundPopup.innerText = "ROUND TWO";
  } else if (currentRound === 3) {
    roundPopup.innerText = "FINAL ROUND";
  } 
  roundPopup.style.display = "block";
  setTimeout(() => {
    roundPopup.style.display = "none";
  }, 2000);


  // Increase enemy HP based on round
  if (currentRound === 2) {
    enemyObj.enemy1.hp = 150;
    enemyObj.enemy2.hp = 350;
    enemyObj.enemy3.hp = 550;
  } else if (currentRound === 3) {
    enemyObj.enemy1.hp = 200;
    enemyObj.enemy2.hp = 400;
    enemyObj.enemy3.hp = 600;
  } 

  // Start the game
  gameStatus = true;
  pauseTip.style.display = "none";
  score += 0;
  scoreVal.innerHTML = score;

  // Start main logic
  startMovement();
  startEnemySpawn();
  startEnemyFire();
  initializeHearts();

  
}

/**
 * Make the screen shake for a short time (for impact, damage effects, etc.)
 * duration: duration of shake in milliseconds, intensity: strength of the shake
 */
function shakeWindow(duration = 500, intensity = 10) {
  const body = document.body;
  const originalPosition = window.getComputedStyle(body).position;
  if (originalPosition === "static") {
    body.style.position = "relative";
  }
  const startTime = Date.now();

  function shake() {
    let elapsed = Date.now() - startTime;
    if (elapsed < duration) {
      let x = (Math.random() - 0.5) * 2 * intensity;
      let y = (Math.random() - 0.5) * 2 * intensity;
      body.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(shake);
    } else {
      body.style.transform = "translate(0,0)";
      if (originalPosition === "static") {
        body.style.position = originalPosition;
      }
    }
  }

  requestAnimationFrame(shake);
}