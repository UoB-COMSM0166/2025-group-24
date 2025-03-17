/***** bullet.js *****/

/** 
 * 子弹速度系数，可能被 Buff 效果修改 
 * 默认值：1.0 (正常速度)
 */
var bulletSpeedFactor = 1.0;

function createBulletForPlane(ele, x, y, w, h) {
  if (!gameStatus) return; // 暂停或结束时不发射子弹

  var b = document.createElement("div");
  b.className = "b"; // 在 CSS 中定义了子弹的外观

  // 让子弹从飞机顶部中央发射
  var bulletL = x + w / 2 - bulletW / 2;
  var bulletT = y - bulletH;
  b.style.left = bulletL + "px";
  b.style.top  = bulletT + "px";

  bulletsP.appendChild(b);
  bullets.push(b);
  moveBullet(b);
}

/**
 * 让子弹不断向上运动，超出屏幕后移除
 * @param {HTMLElement} b - 子弹元素
 */
function moveBullet(b) {
  var baseSpeed = -15; // 基础速度，负值表示向上
  b.timer = mySetInterval(() => {
    if (!gameStatus) return;
    var topVal = getStyle(b, "top");
    // 子弹超出屏幕时，移除
    if (topVal <= -bulletH) {
      myClearInterval(b.timer);
      if (b.parentNode) b.parentNode.removeChild(b);
      let idx = bullets.indexOf(b);
      if (idx !== -1) bullets.splice(idx, 1);
    } else {
      // 结合子弹速度系数 bulletSpeedFactor
      let speed = baseSpeed * bulletSpeedFactor;
      b.style.top = (topVal + speed) + "px";
    }
  }, 30);
}

/**
 * 暂停所有玩家子弹（清除它们的移动定时器）
 */
function pauseAllBullets() {
  for (let i = 0; i < bullets.length; i++) {
    myClearInterval(bullets[i].timer);
    bullets[i].timer = null;
  }
}

/**
 * 恢复所有玩家子弹的运动（重新启动它们的定时器）
 */
function resumeAllBullets() {
  for (let i = 0; i < bullets.length; i++) {
    if (!bullets[i].timer) {
      moveBullet(bullets[i]);
    }
  }
}
function resumeAllEnemyBullets() {
  for (var i = 0; i < enemyBullets.length; i++) {
      if (!enemyBullets[i].timer) { // 确保不会重复启动定时器
          moveEnemyBullet(enemyBullets[i]); // 重新调用子弹移动函数
      }
  }
}

// 导出创建子弹及其移动函数，供测试调用这部分大哥你删了就行
// window.createBulletForPlane = createBulletForPlane;
// window.moveBullet = moveBullet;
// window.resumeAllEnemyBullets = resumeAllEnemyBullets;