/** Drops treasure after destroying enemy with probability */
function dropTreasure(enemy) {
  var dropProb = 0.25; 
  if (currentRound === 2) dropProb = 0.35;
  if (currentRound === 3) dropProb = 0.45;
  if (Math.random() > dropProb) return;

  var eL = getStyle(enemy, "left"),
      eT = getStyle(enemy, "top");
  var treasure = document.createElement("div");
  treasure.className = "treasure";
  treasure.style.left = eL + "px";
  treasure.style.top  = eT + "px";
  treasureContainer.appendChild(treasure);
  moveTreasure(treasure);
}

/** Moves treasure downward and checks player collision */
function moveTreasure(treasure) {
  var speed = 3;
  treasure.timer = setInterval(() => {
    if (!gameStatus) return;
    let topVal = getStyle(treasure, "top");
    topVal += speed;
    if (topVal >= gameH) {
      removeTreasure(treasure);
      return;
    }
    treasure.style.top = topVal + "px";
    checkTreasureHitPlayer(treasure);
  }, 30);
}

/** Removes treasure (clears timer + DOM) */
function removeTreasure(treasure) {
  clearInterval(treasure.timer);
  if (treasure.parentNode) treasure.parentNode.removeChild(treasure);
}

/** Checks collision between treasure and player */
function checkTreasureHitPlayer(treasure) {
  let tL = getStyle(treasure, "left"),
      tT = getStyle(treasure, "top"),
      tW = getStyle(treasure, "width"),
      tH = getStyle(treasure, "height");

  // Player 1
  if (collide(tL, tT, tW, tH, plane1X, plane1Y, myPlaneW, myPlaneH, 1, planeScale)) {
    applyTreasureEffect(1);
    removeTreasure(treasure);
    return;
  }
  // Player 2
  if (isDouble && collide(tL, tT, tW, tH, plane2X, plane2Y, myPlane2W, myPlane2H, 1, planeScale)) {
    applyTreasureEffect(2);
    removeTreasure(treasure);
  }
}

/** Randomly applies treasure effect: shield/speed/fog etc */
function applyTreasureEffect(playerId) {
  let r = Math.random();
  if (r < 0.20) {
    activateShield(playerId);
    showBuff("Shield +5s", 5000);
  } else if (r < 0.35) {
    boostPlayerSpeed(playerId);
    showBuff("Speed Boost +5s", 5000);
  } else if (r < 0.55) {
    boostBulletSpeed();
    showBuff("Bullet Speed Up +5s", 5000);
  } else if (r < 0.70) {
    boostEnemySpeed();
    showBuff("Enemy Speed Up +5s", 5000);
  } else if (r < 0.95) {
    showFog();
    showBuff("Fog Effect +5s", 5000);
  } else {
    increaseEnemyDamage();
    showBuff("Enemy Damage Up +5s", 5000);
  }
}

// ------------------- Buff Effect Functions -------------------

/** Activates player shield (lasts SHIELD_DURATION ms) */
function activateShield(playerId) {
  if (playerId === 1) {
    if (plane1ShieldActive) return;
    plane1ShieldActive = true;
    plane1Shield.style.display = "block";
    setTimeout(() => {
      plane1ShieldActive = false;
      plane1Shield.style.display = "none";
    }, SHIELD_DURATION);
  } else {
    if (plane2ShieldActive) return;
    plane2ShieldActive = true;
    plane2Shield.style.display = "block";
    setTimeout(() => {
      plane2ShieldActive = false;
      plane2Shield.style.display = "none";
    }, SHIELD_DURATION);
  }
}

/** Increases player movement speed for 5 seconds */
function boostPlayerSpeed(playerId) {
  if (playerId === 1) {
    player1SpeedFactor = 2;
    setTimeout(() => { player1SpeedFactor = 1.0; }, 5000);
  } else {
    player2SpeedFactor = 2;
    setTimeout(() => { player2SpeedFactor = 1.0; }, 5000);
  }
}

/** Increases bullet speed for 5 seconds */
function boostBulletSpeed() {
  bulletSpeedFactor = 2.5;
  setTimeout(() => { bulletSpeedFactor = 1.0; }, 5000);
}

/** Increases enemy damage for 5 seconds */
function increaseEnemyDamage() {
  enemyDamageFactor = 2;
  setTimeout(() => { enemyDamageFactor = 1.0; }, 5000);
}

/** Increases enemy speed for 5 seconds */
function boostEnemySpeed() {
  enemySpeedFactor = 3;
  setTimeout(() => { enemySpeedFactor = 1.0; }, 5000);
}

/** Creates fog effect */
function showFog() {
  fogContainer.innerHTML = "";
  let fogCount = Math.floor(Math.random() * 3) + 3;

  for (let i = 0; i < fogCount; i++) {
    let fog = document.createElement("div");
    fog.className = "fog";
    let width  = Math.random() * 200 + 100;
    let height = Math.random() * 200 + 100;
    fog.style.width  = width  + "px";
    fog.style.height = height + "px";

    let left = Math.random() * (gameW - width);
    let top  = Math.random() * (gameH - height);
    fog.style.left = left + "px";
    fog.style.top  = top  + "px";

    // Use background image
    fog.style.backgroundImage = "url('image/cloud2.png')";
    fog.style.backgroundSize = "contain"; // Show full cloud image
    fog.style.backgroundRepeat = "no-repeat";

    fogContainer.appendChild(fog);
  }
  setTimeout(() => { fogContainer.innerHTML = ""; }, 5000);
}

/** Displays buff notification text */
function showBuff(buffName, duration) {
  if (!buffContainer) return;
  let buffItem = document.createElement("div");
  buffItem.className = "buff-item";
  buffItem.innerText = buffName + '\n(effect will last for 5 seconds)\n\n';
  buffContainer.appendChild(buffItem);
  buffContainer.style.display = "block";

  setTimeout(() => {
    buffItem.remove();
    if (buffContainer.children.length === 0) {
      buffContainer.style.display = "none";
    }
  }, duration);
}

// Post-level upgrade functions
function buySpeed(){
  player1SpeedFactor *= 1.5;
  player2SpeedFactor *= 1.5;
}
function buyDamage(){
  bulletSpeedFactor *=2;
}
function buyHp(){
  plane1Hp +=2;
  totalHp +=2
}