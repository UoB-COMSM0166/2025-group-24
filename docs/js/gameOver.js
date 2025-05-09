/** Game over (clear all game elements) */
function doGameOver() {
  clearInterval(movementTimer); movementTimer = null;
  clearInterval(enemyTimer);    enemyTimer = null;
  clearInterval(enemyFireTimer); enemyFireTimer = null;
  clearInterval(bgTimer);       bgTimer = null;
  clearInterval(meteoriteTimer); meteoriteTimer = null;

  gameStatus = false;
  isDouble   = false;
  HaveEnteredGame = false;
  
  // Reset left/right hand mode selection status
  leftModel = false;
  rightModel = false;
  leftEnter = false;
  rightEnter = false;

  // Reset player health
  plane1Hp = 5;
  totalHp =5;

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

  // Reset keyboard control states (critical fix)
  p1Up = p1Down = p1Left = p1Right = false;
  p2Up = p2Down = p2Left = p2Right = false;

  alert("Game Over! Final Score: " + score);

  // Add player score to leaderboard
  if (isDouble) {
      addScore(`${playerName1} & ${playerName2}`, score, true); // Two-player mode
  } else {
      addScore(playerName1, score, false); // Single-player mode
  }

  // Return to homepage
  homePage.style.display = "block";
  gameEnter.style.display = "none";

  // Reset game status variables
  score = 0;
  currentRound = 1;
  maxRound     = 3;

  
  /** 
 * Plane movement speed (may be modified by Buffs)
 */
  player1SpeedFactor=1.0;
  player2SpeedFactor=1.0


// Enemy damage factors: higher means enemies deal more damage
enemyDamageFactor = 1.0;
enemyBulletFactor = 1.0;

// Enemy speed factors
  enemySpeedFactor = 1.0;
  bulletSpeedFactor = 1.0;

meteoriteSpeedFactor=1.0;



// Player bullets / enemy array / enemy bullets / meteorite array
window.bullets      = [];
window.enemys       = [];
window.enemyBullets = [];
window.meteoriteArray = [];
window.treasures = [];

 /** DOM variables (assigned in onload), and shield states */
window.plane1ShieldActive=false;
window.plane2ShieldActive=false;
}






