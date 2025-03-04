/***** collisions.js *****/

/** 
 * 通用碰撞检测函数
 * 碰撞盒支持缩放 (scaleB, scaleP)
 */
function collide(bL,bT,bW,bH, pL,pT,pW,pH, scaleB, scaleP){
  var bW2 = bW * scaleB;
  var bH2 = bH * scaleB;
  var pW2 = pW * scaleP;
  var pH2 = pH * scaleP;

  var bLeft   = bL + (bW - bW2)/2,
      bTop    = bT + (bH - bH2)/2,
      bRight  = bLeft   + bW2,
      bBottom = bTop    + bH2;

  var pLeft   = pL + (pW - pW2)/2,
      pTop    = pT + (pH - pH2)/2,
      pRight  = pLeft   + pW2,
      pBottom = pTop    + pH2;

  return (
    bRight  >= pLeft  &&
    bLeft   <= pRight &&
    bBottom >= pTop   &&
    bTop    <= pBottom
  );
}

/** 
 * 玩家子弹 vs 敌机 
 * 在 enemy.js 的 moveEnemy(e) 中会调用此函数
 */
function checkCollisionWithBullets(e){
  for(var i=0; i<bullets.length; i++){
    var b = bullets[i];

    // 获取子弹位置 & 大小
    var bL = getStyle(b, "left"),
        bT = getStyle(b, "top"),
        bW = getStyle(b, "width"),
        bH = getStyle(b, "height");

    // 获取敌机位置 & 大小
    var eL = getStyle(e, "left"),
        eT = getStyle(e, "top"),
        eW = getStyle(e, "width"),
        eH = getStyle(e, "height");

    // 碰撞检测
    if(collide(bL, bT, bW, bH, eL, eT, eW, eH, bulletScale, enemyScale)){
      // 1. 停止子弹
      clearInterval(b.timer);
      if(b.parentNode) b.parentNode.removeChild(b);
      bullets.splice(i,1);

      // 2. 敌机扣血
      e.hp -= 100;

      // 3. 如果敌机血量 <= 0，调用 killEnemy(e)
      if(e.hp <= 0){
        killEnemy(e);
      }
      break; // 只处理一次碰撞
    }
  }
}

/** 
 * 击毁敌机（播放爆炸动画 -> 移除）
 */
function killEnemy(e){
  clearInterval(e.timer);
  e.src = "image/bz.gif"; // 爆炸动画

  setTimeout(function(){
    if(e.parentNode){
      enemysP.removeChild(e);
      var idx = enemys.indexOf(e);
      if(idx !== -1) enemys.splice(idx,1);
    }
  }, 500);

  // 加分
  score += e.score;
  scoreVal.innerHTML = score;

  // 检查是否进下关
  checkRound();

  // 敌机被击毁后，可能掉落宝藏
  dropTreasure(e);
}

/** 
 * 敌机子弹 vs 玩家飞机 
 * 在 enemy.js 的 moveEnemyBullet(b) 中，会调用此函数 
 */
function checkBulletHitPlayer(b){
  var bL = getStyle(b, "left"),
      bT = getStyle(b, "top"),
      bW = getStyle(b, "width"),
      bH = getStyle(b, "height");

  // ---------------- 玩家1护盾判断 ----------------
  if(plane1ShieldActive){
    // 盾的位置
    var shieldX = plane1X + myPlaneW/2 - 50;
    var shieldY = plane1Y + myPlaneH/2 - 50;
    var shieldW = 100, shieldH = 100;

    if(collide(bL,bT,bW,bH, shieldX,shieldY,shieldW,shieldH, 1,1)){
      // 子弹击中护盾，不扣血
      removeEnemyBullet(b);
      return;
    }
  }

  // 若没护盾或没碰到护盾，则检测机体
  if(collide(bL,bT,bW,bH, plane1X,plane1Y, myPlaneW,myPlaneH, enemyBulletScale, planeScale)){
    shakeWindow(300,8);
    plane1Hp -= (1 * enemyDamageFactor); 
    loseHeart()
    removeEnemyBullet(b);

    if(plane1Hp <= 0){
      doGameOver();
      return;
    }
  }

  // ---------------- 玩家2护盾判断 ----------------
  if(isDouble){
    if(plane2ShieldActive){
      var shield2X = plane2X + myPlane2W/2 - 50;
      var shield2Y = plane2Y + myPlane2H/2 - 50;
      var shield2W = 100, shield2H= 100;

      if(collide(bL,bT,bW,bH, shield2X,shield2Y,shield2W,shield2H,1,1)){
        removeEnemyBullet(b);
        return;
      }
    }

    // 玩家2机体
    if(collide(bL,bT,bW,bH, plane2X,plane2Y, myPlane2W,myPlane2H, enemyBulletScale, planeScale)){
      shakeWindow(300,8);
      plane2Hp -= (1 * enemyDamageFactor);
      loseHeart()
      removeEnemyBullet(b);

      if(plane2Hp <= 0){
        doGameOver();
        return;
      }
    }
  }
}

/**
 * 【可选】敌机 vs 玩家飞机 
 * 在 enemy.js 的 moveEnemy(e) 里会调用 checkCollisionWithPlanes(e)
 * 若你的游戏不需要“敌机撞到玩家”这种判定，可移除这个函数和对应调用。
 */
function checkCollisionWithPlanes(e){
  // 获取敌机位置 & 大小
  var eL = getStyle(e,"left"),
      eT = getStyle(e,"top"),
      eW = getStyle(e,"width"),
      eH = getStyle(e,"height");

  // ---------------- 玩家1护盾判断 ----------------
  if(plane1ShieldActive){
    var shieldX= plane1X + myPlaneW/2 -50;
    var shieldY= plane1Y + myPlaneH/2 -50;
    var shieldW= 100, shieldH=100;

    // 如果敌机撞到护盾，直接 killEnemy(e) 或者让敌机弹走？
    if(collide(eL,eT,eW,eH, shieldX,shieldY,shieldW,shieldH, enemyScale,1)){
      // 这里演示：撞到护盾也让敌机死
      killEnemy(e);
      return;
    }
  }

  // 玩家1机体
  if(collide(eL,eT,eW,eH, plane1X,plane1Y, myPlaneW,myPlaneH, enemyScale, planeScale)){
    // 这里做受击处理
    shakeWindow(300,8);
    plane1Hp--;
    loseHeart();
    killEnemy(e); // 敌机也会被消灭，或者你可以让它保持
    if(plane1Hp <= 0){
      doGameOver();
      return;
    }
  }

  // ---------------- 玩家2护盾 & 机体 ---------------
  if(isDouble){
    if(plane2ShieldActive){
      var shield2X= plane2X+ myPlane2W/2-50;
      var shield2Y= plane2Y+ myPlane2H/2-50;
      if(collide(eL,eT,eW,eH, shield2X,shield2Y,100,100, enemyScale,1)){
        killEnemy(e);
        return;
      }
    }
    if(collide(eL,eT,eW,eH, plane2X,plane2Y, myPlane2W,myPlane2H, enemyScale, planeScale)){
      shakeWindow(300,8);
      plane2Hp--;
      loseHeart();
      killEnemy(e);
      if(plane2Hp<=0){
        doGameOver();
        return;
      }
    }
  }
}