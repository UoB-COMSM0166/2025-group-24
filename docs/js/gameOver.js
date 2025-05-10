/** Game over (clear all game elements) */
function doGameOver() {
  clearInterval(movementTimer); movementTimer = null;
  clearInterval(enemyTimer);    enemyTimer = null;
  clearInterval(enemyFireTimer); enemyFireTimer = null;
  clearInterval(bgTimer);       bgTimer = null;
  clearInterval(meteoriteTimer); meteoriteTimer = null;

  gameStatus = false;
  HaveEnteredGame = false;

  // Reset left/right hand mode selection status
  leftModel = false;
  rightModel = false;
  leftEnter = false;
  rightEnter = false;

  // Reset player health
  plane1Hp = 5;
  totalHp = 5;

  // Clear game element containers
  heartsContainer.innerHTML = '';
  treasureContainer.innerHTML = "";
  enemysP.innerHTML = "";
  bulletsP.innerHTML = "";
  enemyBulletsP.innerHTML = "";
  meteorites.innerHTML = "";
  buffContainer.innerHTML = "";

  // Hide player planes
  myPlane.style.display = "none";
  myPlane2.style.display = "none";

  // Reset keyboard control states
  p1Up = p1Down = p1Left = p1Right = false;
  p2Up = p2Down = p2Left = p2Right = false;

  alert("Game Over! Final Score: " + score);

  // Add player score to leaderboard
  if (isDouble) {
    if (playerName1 && playerName2) {
      // Use sorted names as unique key, and display input order
      const displayName = `${playerName1} & ${playerName2}`;
      const keyName = [playerName1, playerName2].sort().join(' & ');
      addScore(displayName, score, true, keyName);
    }
  } else {
    if (playerName1) {
      addScore(playerName1, score, false);
    }
  }

  // Now it's safe to reset isDouble
  isDouble = false;

  // Return to homepage
  homePage.style.display = "block";
  gameEnter.style.display = "none";

  // Reset game status variables
  score = 0;
  currentRound = 1;
  maxRound = 3;

  // Reset multipliers
  player1SpeedFactor = 1.0;
  player2SpeedFactor = 1.0;
  enemyDamageFactor = 1.0;
  enemyBulletFactor = 1.0;
  enemySpeedFactor = 1.0;
  bulletSpeedFactor = 1.0;
  meteoriteSpeedFactor = 1.0;

  // Clear game data arrays
  window.bullets = [];
  window.enemys = [];
  window.enemyBullets = [];
  window.meteoriteArray = [];
  window.treasures = [];

  // Reset shield states
  window.plane1ShieldActive = false;
  window.plane2ShieldActive = false;
}







