/***** bullet.js *****/

/** 
 * Bullet speed factor, can be modified by buff effects
 * Default value: 1.0 (normal speed)
 */

function createBulletForPlane(ele, x, y, w, h) {
  if (!gameStatus) return; // Don't fire bullets when paused or game over

  var b = document.createElement("div");
  b.className = "b"; // Bullet appearance defined in CSS

  // Position bullet at center top of plane
  var bulletL = x + w / 2 - bulletW / 2;
  var bulletT = y - bulletH;
  b.style.left = bulletL + "px";
  b.style.top  = bulletT + "px";

  bulletsP.appendChild(b);
  bullets.push(b);
  moveBullet(b);
}

/**
 * Moves bullet upward continuously, removes when off-screen
 * @param {HTMLElement} b - Bullet element
 */
function moveBullet(b) {
  var bulletBaseSpeed = -15; // Base speed (negative for upward movement)
  b.timer = setInterval(() => {
    if (!gameStatus) return;
    var topVal = getStyle(b, "top");
    // Remove bullet when off-screen
    if (topVal <= -bulletH) {
      clearInterval(b.timer);
      if (b.parentNode) b.parentNode.removeChild(b);
      let idx = bullets.indexOf(b);
      if (idx !== -1) bullets.splice(idx, 1);
    } else {
      // Apply bullet speed factor
      let speed = bulletBaseSpeed * bulletSpeedFactor;
      b.style.top = (topVal + speed) + "px";
    }
  }, 30);
}

/**
 * Pauses all player bullets (clears their movement timers)
 */
function pauseAllBullets() {
  for (let i = 0; i < bullets.length; i++) {
    clearInterval(bullets[i].timer);
    bullets[i].timer = null;
  }
}

/**
 * Resumes all player bullets movement (restarts their timers)
 */
function resumeAllBullets() {
  for (let i = 0; i < bullets.length; i++) {
    if (!bullets[i].timer) {
      moveBullet(bullets[i]);
    }
  }
}