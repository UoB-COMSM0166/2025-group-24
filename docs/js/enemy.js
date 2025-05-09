/***** enemy.js *****/

// Change: Added check in createEnemyBullet(enemy) - if (!enemy || !enemy.parentNode) return;

/*
 * Start periodic enemy spawning
 * Calls createEnemy() every 1.8 seconds
 */
function startEnemySpawn() {
  if (enemyTimer) return; // If already spawning, don't duplicate
  enemyTimer = setInterval(() => {
    createEnemy();
  }, 1800);
}

/**
 * Create an enemy aircraft (random small, medium, or large)
 * Calculates starting position, adds to enemysP container, and initiates movement
 */
function createEnemy() {
  // Enemy type probability distribution (1:small, 2:medium, 3:large)
  var percentData = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3];
  var enemyType = percentData[Math.floor(Math.random() * percentData.length)];
  var data = enemyObj["enemy" + enemyType];

  // Create enemy element (img) and set properties
  var enemy = document.createElement("img");
  enemy.src = "image/enemy" + enemyType + ".png";
  enemy.t = enemyType;           // Enemy type
  enemy.score = data.score;      // Points when destroyed
  enemy.hp = data.hp;            // Enemy health
  enemy.className = "e";
  enemy.dead = false;
  
  // Use dimensions defined in enemyObj
  enemy.style.width = data.width + "px";
  enemy.style.height = data.height + "px";
 

  // Random x-coordinate at top of screen
  var enemyL = Math.floor(Math.random() * (gameW - data.width + 1));
  var enemyT = -data.height; // Start above visible screen
  enemy.style.left = enemyL + "px";
  enemy.style.top  = enemyT + "px";

  // Add to container and array, then start movement
  enemysP.appendChild(enemy);
  enemys.push(enemy);
  moveEnemy(enemy);
}

/**
 * Move enemy downward continuously, remove if off-screen
 * Also checks collisions with player bullets/aircraft
 * @param {HTMLElement} e - Enemy element
 */
function moveEnemy(e) {
  var enemyBaseSpeed;
  if (e.t === 1) enemyBaseSpeed = 5;   // Small - fastest
  else if (e.t === 2) enemyBaseSpeed = 3; // Medium - medium speed
  else enemyBaseSpeed = 1.5;              // Large - slowest

  e.timer = setInterval(() => {
    if (!gameStatus) return; // Don't update when paused or game over

    var topVal = getStyle(e, "top");
    // Remove if past bottom of screen
    if (topVal >= gameH) {
      clearInterval(e.timer);
      if (e.parentNode) e.parentNode.removeChild(e);
      var idx = enemys.indexOf(e);
      if (idx !== -1) enemys.splice(idx, 1);
    } else {
      // Final speed = baseSpeed * enemySpeedFactor
      var finalSpeed = enemyBaseSpeed * enemySpeedFactor;
      e.style.top = (topVal + finalSpeed) + "px";

      // Check collision with player bullets
      checkCollisionWithBullets(e);
      // Check collision with player aircraft
      checkCollisionWithMeteorite(e);
    }
  }, 30);
}

/**
 * Pause all enemy movement and stop new enemy spawning
 */
function pauseAllEnemies() {
  clearInterval(enemyTimer);
  enemyTimer = null;
  for (let i = 0; i < enemys.length; i++) {
    clearInterval(enemys[i].timer);
    enemys[i].timer = null;
  }
}

/**
 * Resume all enemy movement and restart spawning
 */
function resumeAllEnemies() {
  startEnemySpawn();
  for (let i = 0; i < enemys.length; i++) {
    if (!enemys[i].timer) {
      moveEnemy(enemys[i]);
    }
  }
}

// ========== Enemy Bullet Section ==========

/** Enemy bullet generation timer */
var enemyFireTimer = null;

/**
 * Start periodic bullet firing from all enemies
 * Every 1.5 seconds, iterate through enemys array and make each fire a bullet
 */
function startEnemyFire() {
  if (enemyFireTimer) return;
  enemyFireTimer = setInterval(() => {
    if (!gameStatus) return;
    for (var i = 0; i < enemys.length; i++) {
      createEnemyBullet(enemys[i]);
    }
  }, 3000);
}

/**
 * Create a bullet for a specific enemy, starting at center bottom of enemy
 */
function createEnemyBullet(enemy) {
  // Don't create bullet if enemy is destroyed or removed
  if (!enemy || !enemy.parentNode) return;

  var eL = getStyle(enemy, "left"),
      eT = getStyle(enemy, "top");
  var eW = getStyle(enemy, "width"),
      eH = getStyle(enemy, "height");

  var bullet = document.createElement("div");
  bullet.className = "enemy-bullet";
  var bulletW = 16, bulletH = 16;
  // Bullet starts centered below enemy
  var bulletL = eL + eW / 2 - bulletW / 2;
  var bulletT = eT + eH;

  bullet.style.left = bulletL + "px";
  bullet.style.top  = bulletT + "px";
  enemyBulletsP.appendChild(bullet);
  enemyBullets.push(bullet);
  moveEnemyBullet(bullet);
}

/**
 * Move enemy bullet downward continuously, remove if off-screen
 * Also checks if it hits player
 */
function moveEnemyBullet(b) {
  var baseSpeed = 8; // Enemy bullet speed
  var speed=baseSpeed *enemyBulletFactor;
  b.timer = setInterval(() => {
    if (!gameStatus) return;
    var topVal = getStyle(b, "top");
    if (topVal >= gameH) {
      removeEnemyBullet(b);
    } else {
      b.style.top = (topVal + speed) + "px";
      checkBulletHitPlayer(b);
    }
  }, 30);
}

/**
 * Remove enemy bullet DOM element and clear its timer
 */
function removeEnemyBullet(b) {
  clearInterval(b.timer);
  if (b.parentNode) b.parentNode.removeChild(b);
  var idx = enemyBullets.indexOf(b);
  if (idx !== -1) enemyBullets.splice(idx, 1);
}