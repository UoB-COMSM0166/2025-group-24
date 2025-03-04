/***** enemy.js *****/

/** 
 * 敌机生成计时器，用于定时创建敌机 
 * 若不为 null，则说明已在生成中 
 */





/**
 * 开始定时生成敌机
 * 每 1.8 秒调用 createEnemy() 一次
 */
function startEnemySpawn() {
  if (enemyTimer) return; // 若已在生成中，则不重复
  enemyTimer = setInterval(() => {
    createEnemy();
  }, 1800);
}

/**
 * 创建一架敌机（小、中、大随机）
 * 计算其起始坐标后，添加到 enemysP 容器，并调用 moveEnemy() 让其移动
 */
function createEnemy() {
  // 敌机类型概率分布（1:小, 2:中, 3:大）
  var percentData = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3];
  var enemyType = percentData[Math.floor(Math.random() * percentData.length)];
  var data = enemyObj["enemy" + enemyType];

  // 创建敌机元素（img），设置相关属性
  var enemy = document.createElement("img");
  enemy.src = "image/enemy" + enemyType + ".png";
  enemy.t = enemyType;           // 敌机类型
  enemy.score = data.score;      // 击毁后可得分
  enemy.hp = data.hp;            // 敌机血量
  enemy.className = "e";
  enemy.dead = false;

  if (enemyType === 1) { // 小型敌机
    enemy.style.width = "35px";
    enemy.style.height = "35px";
  } else if (enemyType === 2) { // 中型敌机
    enemy.style.width = "60px";
    enemy.style.height = "60px";
  } else { // 大型敌机
    enemy.style.width = "90px";
    enemy.style.height = "90px";
  }

  // 随机生成敌机在屏幕顶部出现的初始 x 坐标
  var enemyL = Math.floor(Math.random() * (gameW - data.width + 1));
  var enemyT = -data.height; // 敌机从屏幕上方之外进入
  enemy.style.left = enemyL + "px";
  enemy.style.top  = enemyT + "px";

  // 放入 enemysP 容器，并加入 enemys 数组，最后调用 moveEnemy()
  enemysP.appendChild(enemy);
  enemys.push(enemy);
  moveEnemy(enemy);
}

/**
 * 让敌机不断向下移动，若超出屏幕则移除
 * 并检测与玩家子弹/玩家飞机的碰撞
 * @param {HTMLElement} e - 敌机元素
 */
function moveEnemy(e) {
  var baseSpeed;
  if (e.t === 1) baseSpeed = 5;   // 小型机速度快
  else if (e.t === 2) baseSpeed = 3; // 中型机中速
  else baseSpeed = 1.5;              // 大型机最慢

  e.timer = setInterval(() => {
    if (!gameStatus) return; // 暂停或结束时，不更新敌机

    var topVal = getStyle(e, "top");
    // 若超出屏幕底部，移除
    if (topVal >= gameH) {
      clearInterval(e.timer);
      if (e.parentNode) e.parentNode.removeChild(e);
      var idx = enemys.indexOf(e);
      if (idx !== -1) enemys.splice(idx, 1);
    } else {
      // 敌机移动速度 = baseSpeed * enemySpeedFactor
      var finalSpeed = baseSpeed * enemySpeedFactor;
      e.style.top = (topVal + finalSpeed) + "px";

      // 检测是否被玩家子弹击中
      checkCollisionWithBullets(e);
      // 检测是否与玩家飞机碰撞
      checkCollisionWithPlanes(e);
    }
  }, 30);
}

/**
 * 暂停所有敌机的移动，并停止新的敌机生成
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
 * 恢复所有敌机的移动，并重新开始生成
 */
function resumeAllEnemies() {
  startEnemySpawn();
  for (let i = 0; i < enemys.length; i++) {
    if (!enemys[i].timer) {
      moveEnemy(enemys[i]);
    }
  }
}

// ========== 敌机子弹部分 ==========

/** 敌机子弹生成计时器 */
var enemyFireTimer = null;

/**
 * 开始让所有敌机周期性地发射子弹
 * 每 1.5 秒，遍历 enemys 数组，令每个敌机都发射一颗子弹
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
 * 为某个敌机创建一发子弹，初始位置在敌机下方中心
 */
function createEnemyBullet(enemy) {
  // 若敌机已被销毁或移除，不生成子弹
  if (!enemy || !enemy.parentNode) return;

  var eL = getStyle(enemy, "left"),
      eT = getStyle(enemy, "top");
  var eW = getStyle(enemy, "width"),
      eH = getStyle(enemy, "height");

  var bullet = document.createElement("div");
  bullet.className = "enemy-bullet";
  var bulletW = 16, bulletH = 16;
  // 子弹从敌机正中心下方发射
  var bulletL = eL + eW / 2 - bulletW / 2;
  var bulletT = eT + eH;

  bullet.style.left = bulletL + "px";
  bullet.style.top  = bulletT + "px";
  enemyBulletsP.appendChild(bullet);
  enemyBullets.push(bullet);
  moveEnemyBullet(bullet);
}

/**
 * 让敌机子弹不断向下运动，若超出屏幕则移除
 * 并检测是否击中玩家
 */
function moveEnemyBullet(b) {
  var baseSpeed = 8; // 敌机子弹速度
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


 /* 移除敌机子弹 DOM 及其定时器*/

function removeEnemyBullet(b) {
  clearInterval(b.timer);
  if (b.parentNode) b.parentNode.removeChild(b);
  var idx = enemyBullets.indexOf(b);
  if (idx !== -1) enemyBullets.splice(idx, 1);
}