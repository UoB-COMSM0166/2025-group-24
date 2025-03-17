

/** 击毁敌机后，有概率掉落宝藏 */
function dropTreasure(enemy) {
  var dropProb = 0.20; 
  if (currentRound === 2) dropProb = 0.30;
  if (currentRound === 3) dropProb = 0.40;
  if (currentRound === 4) dropProb = 0.50;
  if (currentRound === 5) dropProb = 0.60;
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

/** 让宝藏向下移动，并检测是否被玩家拾取 */
function moveTreasure(treasure) {
  var speed = 3;
  treasure.timer = mySetInterval(() => {
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

/** 移除宝藏（清理定时器 + DOM） */
function removeTreasure(treasure) {
  myClearInterval(treasure.timer);
  if (treasure.parentNode) treasure.parentNode.removeChild(treasure);
}

/** 判断宝藏与玩家碰撞 */
function checkTreasureHitPlayer(treasure) {
  let tL = getStyle(treasure, "left"),
      tT = getStyle(treasure, "top"),
      tW = getStyle(treasure, "width"),
      tH = getStyle(treasure, "height");

  // 玩家1
  if (collide(tL, tT, tW, tH, plane1X, plane1Y, myPlaneW, myPlaneH, 1, planeScale)) {
    applyTreasureEffect(1);
    removeTreasure(treasure);
    return;
  }
  // 玩家2
  if (isDouble && collide(tL, tT, tW, tH, plane2X, plane2Y, myPlane2W, myPlane2H, 1, planeScale)) {
    applyTreasureEffect(2);
    removeTreasure(treasure);
  }
}

/** 随机触发宝藏效果：护盾 / 加速 / 迷雾等 */
function applyTreasureEffect(playerId) {
  let r = Math.random();
  if (r < 0.25) {
    activateShield(playerId);
    showBuff("护盾 +5秒", 5000);
  } else if (r < 0.50) {
    boostPlayerSpeed(playerId);
    showBuff("移速提升 +5秒", 5000);
  } else if (r < 0.70) {
    boostBulletSpeed();
    showBuff("子弹速度提升 +5秒", 5000);
  } else if (r < 0.80) {
    boostEnemySpeed();
    showBuff("敌机加速 +5秒", 5000);
  } else if (r < 0.90) {
    showFog();
    showBuff("迷雾效果 +5秒", 5000);
  } else {
    increaseEnemyDamage();
    showBuff("敌机伤害提升 +5秒", 5000);
  }
}

// ------------------- Buff 效果函数 -------------------

/** 给玩家添加护盾（持续 SHIELD_DURATION 毫秒） */
function activateShield(playerId) {
  if (playerId === 1) {
    if (plane1ShieldActive) return;
    plane1ShieldActive = true;
    plane1Shield.style.display = "block";
    mySetTimeout(() => {
      plane1ShieldActive = false;
      plane1Shield.style.display = "none";
    }, SHIELD_DURATION);
  } else {
    if (plane2ShieldActive) return;
    plane2ShieldActive = true;
    plane2Shield.style.display = "block";
    mySetTimeout(() => {
      plane2ShieldActive = false;
      plane2Shield.style.display = "none";
    }, SHIELD_DURATION);
  }
}

/** 提升玩家移动速度，5秒后恢复 */
function boostPlayerSpeed(playerId) {
  if (playerId === 1) {
    player1SpeedFactor = 1.5;
    mySetTimeout(() => { player1SpeedFactor = 1.0; }, 5000);
  } else {
    player2SpeedFactor = 1.5;
    mySetTimeout(() => { player2SpeedFactor = 1.0; }, 5000);
  }
}

/** 提升玩家子弹速度，5秒后恢复 */
function boostBulletSpeed() {
  bulletSpeedFactor = 1.5;
  mySetTimeout(() => { bulletSpeedFactor = 1.0; }, 5000);
}

/** 敌机伤害加成 */
function increaseEnemyDamage() {
  enemyDamageFactor = 1.5;
  mySetTimeout(() => { enemyDamageFactor = 1.0; }, 5000);
}

/** 敌机整体加速 */
function boostEnemySpeed() {
  enemySpeedFactor = 1.5;
  mySetTimeout(() => { enemySpeedFactor = 1.0; }, 5000);
}

/** 在游戏中生成数块黑色方块，模拟迷雾效果 */
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
    fogContainer.appendChild(fog);
  }
  mySetTimeout(() => { fogContainer.innerHTML = ""; }, 5000);
}



/** 显示 Buff 提示文本 */
function showBuff(buffName, duration) {
  if (!buffContainer) return;
  let buffItem = document.createElement("div");
  buffItem.className = "buff-item";
  buffItem.innerText = buffName + " (持续 " + (duration / 1000) + " 秒)";
  buffContainer.appendChild(buffItem);
  buffContainer.style.display = "block";

  mySetTimeout(() => {
    buffItem.remove();
    if (buffContainer.children.length === 0) {
      buffContainer.style.display = "none";
    }
  }, duration);
}


//每关之后的buff属性增加
function buySpeed(){
  player1SpeedFactor += 1.0;
}
function buyDamage(){
  bulletSpeedFactor *= 1.2;
}

function buyHp(){
  plane1Hp +=2;
  plane2Hp +=2;
}
// 在 buff.js 末尾添加：
// 在 buff.js 文件末尾添加以下导出
window.dropTreasure = dropTreasure;
window.applyTreasureEffect = applyTreasureEffect;
window.checkTreasureHitPlayer = checkTreasureHitPlayer;
window.removeTreasure = removeTreasure;
window.moveTreasure = moveTreasure;
window.showBuff = showBuff;
window.activateShield = activateShield;
window.boostPlayerSpeed = boostPlayerSpeed;
window.boostBulletSpeed = boostBulletSpeed;
window.increaseEnemyDamage = increaseEnemyDamage;
window.boostEnemySpeed = boostEnemySpeed;
window.showFog = showFog;