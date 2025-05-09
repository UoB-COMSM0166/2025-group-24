/***** collisions.js *****/

// Helper function: Calculate bounding box based on position, size and scale factor
function getBoundingBox(l, t, w, h, scale) {
  const scaledW = w * scale;
  const scaledH = h * scale;
  return {
    left: l + (w - scaledW) / 2,
    top: t + (h - scaledH) / 2,
    right: l + (w - scaledW) / 2 + scaledW,
    bottom: t + (h - scaledH) / 2 + scaledH
  };
}

// Generic collision detection - checks if two bounding boxes overlap
function isColliding(boxA, boxB) {
  return (
    boxA.right >= boxB.left &&
    boxA.left <= boxB.right &&
    boxA.bottom >= boxB.top &&
    boxA.top <= boxB.bottom
  );
}

// Improved collision detection function using bounding boxes
function collide(bL, bT, bW, bH, pL, pT, pW, pH, scaleB, scaleP) {
  const boxB = getBoundingBox(bL, bT, bW, bH, scaleB);
  const boxP = getBoundingBox(pL, pT, pW, pH, scaleP);
  return isColliding(boxB, boxP);
}

/** 
 * Player bullets vs Enemy aircraft collision detection 
 */
function checkCollisionWithBullets(e) {
  for (let i = 0; i < bullets.length; i++) {
    const b = bullets[i];

    const bL = getStyle(b, "left"),
          bT = getStyle(b, "top"),
          bW = getStyle(b, "width"),
          bH = getStyle(b, "height");

    const eL = getStyle(e, "left"),
          eT = getStyle(e, "top"),
          eW = getStyle(e, "width"),
          eH = getStyle(e, "height");

    if (collide(bL, bT, bW, bH, eL, eT, eW, eH, bulletScale, enemyScale)) {
      clearInterval(b.timer);
      if (b.parentNode) b.parentNode.removeChild(b);
      bullets.splice(i, 1);

      e.hp -= 100;
      if (e.hp <= 0) {
        killEnemy(e);
      }
      break;
    }
  }
}

/** 
 * Destroy enemy aircraft
 */
function killEnemy(e) {
  if (e.dead) return;
  e.dead = true;
  
  clearInterval(e.timer);
  e.src = "image/bz1.gif?" + new Date().getTime();
  e.style.position = "absolute";
  
  e.onload = function() {
    setTimeout(() => {
      removeEnemyElement(e);
    }, 300);
  };
  
  e.onerror = function() {
    removeEnemyElement(e);
  };

  score += e.score;
  scoreVal.innerHTML = score;
  checkRound();
  dropTreasure(e);
}

// Dedicated function for removing enemy elements
function removeEnemyElement(e) {
  if (!e) return;
  
  if (e.parentNode) {
    e.parentNode.removeChild(e);
  }
  
  const idx = enemys.indexOf(e);
  if (idx !== -1) {
    enemys.splice(idx, 1);
  }
  
  e.onload = null;
  e.onerror = null;
}

/** 
 * Enemy bullets vs Player aircraft collision detection
 */
function checkBulletHitPlayer(b) {
  const bL = getStyle(b, "left"),
        bT = getStyle(b, "top"),
        bW = getStyle(b, "width"),
        bH = getStyle(b, "height");

  // Player 1 shield check
  if (plane1ShieldActive) {
    const shieldX = plane1X + myPlaneW / 2 - 50,
          shieldY = plane1Y + myPlaneH / 2 - 50,
          shieldW = 100,
          shieldH = 100;
    if (collide(bL, bT, bW, bH, shieldX, shieldY, shieldW, shieldH, 1, 1)) {
      removeEnemyBullet(b);
      return;
    }
  }

  // Player 1 aircraft collision
  if (collide(bL, bT, bW, bH, plane1X, plane1Y, myPlaneW, myPlaneH, enemyBulletScale, planeScale)) {
    shakeWindow(300, 8);
    plane1Hp -= (1 * enemyDamageFactor); 
    totalHp --;
    loseHeart();
    removeEnemyBullet(b);

    // Modified game over condition
    if ((isDouble && totalHp <= 0) || (!isDouble && plane1Hp <= 0)) {
      doGameOver();
      return;
    }
  }

  // Player 2 check (two-player mode)
  if (isDouble) {
    if (plane2ShieldActive) {
      const shield2X = plane2X + myPlane2W / 2 - 50,
            shield2Y = plane2Y + myPlane2H / 2 - 50,
            shield2W = 100,
            shield2H = 100;
      if (collide(bL, bT, bW, bH, shield2X, shield2Y, shield2W, shield2H, 1, 1)) {
        removeEnemyBullet(b);
        return;
      }
    }

    if (collide(bL, bT, bW, bH, plane2X, plane2Y, myPlane2W, myPlane2H, enemyBulletScale, planeScale)) {
      shakeWindow(300, 8);
      totalHp -=(1 * enemyDamageFactor);
      loseHeart();
      removeEnemyBullet(b);

      // Modified game over condition
      if ((isDouble && totalHp <= 0) || (!isDouble && plane1Hp <= 0)) {
        doGameOver();
        return;
      }
    }
  }
}

/**
 * Enemy aircraft vs Player aircraft collision detection 
 */
function checkCollisionWithPlanes(e) {
  const eL = getStyle(e, "left"),
        eT = getStyle(e, "top"),
        eW = getStyle(e, "width"),
        eH = getStyle(e, "height");

  // Player 1 shield check
  if (plane1ShieldActive) {
    const shieldX = plane1X + myPlaneW / 2 - 50,
          shieldY = plane1Y + myPlaneH / 2 - 50,
          shieldW = 100,
          shieldH = 100;
    if (collide(eL, eT, eW, eH, shieldX, shieldY, shieldW, shieldH, enemyScale, 1)) {
      killEnemy(e);
      return;
    }
  }

  // Player 1 aircraft collision
  if (collide(eL, eT, eW, eH, plane1X, plane1Y, myPlaneW, myPlaneH, enemyScale, planeScale)) {
    shakeWindow(300, 8);
    plane1Hp--;
    totalHp --;
    loseHeart();
    killEnemy(e);
    
    // Modified game over condition
    if ((isDouble && totalHp <= 0) || (!isDouble && plane1Hp <= 0)) {
      doGameOver();
      return;
    }
  }

  // Player 2 check (two-player mode)
  if (isDouble) {
    if (plane2ShieldActive) {
      const shield2X = plane2X + myPlane2W / 2 - 50,
            shield2Y = plane2Y + myPlane2H / 2 - 50;
      if (collide(eL, eT, eW, eH, shield2X, shield2Y, 100, 100, enemyScale, 1)) {
        killEnemy(e);
        return;
      }
    }
    if (collide(eL, eT, eW, eH, plane2X, plane2Y, myPlane2W, myPlane2H, enemyScale, planeScale)) {
      shakeWindow(300, 8);
      totalHp --;
      loseHeart();
      killEnemy(e);
      
      // Modified game over condition
      if ((isDouble && totalHp <= 0) || (!isDouble && plane1Hp <= 0)) {
        doGameOver();
        return;
      }
    }
  }
}