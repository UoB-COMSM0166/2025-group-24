//陨石下落


function startMeteoriteSpawn() {
    if (meteoriteTimer) return; // 若已在生成中，则不重复
    meteoriteTimer = setInterval(() => {
      createMeteorite()
    }, 2000);
  }

  
  
  function createMeteorite() {
    // 陨石类型概率分布（1:小, 2:中, 3:大）
    var percentData = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3];
    var meteoriteType = percentData[Math.floor(Math.random() * percentData.length)];
    var data = meteoriteObj["meteorite" + meteoriteType];
  
    // 创建陨石元素（img），设置相关属性
    var meteorite = document.createElement("img");
    meteorite.src = "image/meteorite" + meteoriteType + ".png";
    meteorite.t = meteoriteType;           
    meteorite.score = data.score;      
    meteorite.hp = data.hp;            
    meteorite.className = "m";
    meteorite.dead = false;
  
    if (meteoriteType === 1) { 
        meteorite.style.width = "67px";
        meteorite.style.height = "75px";
    } else if (meteoriteType === 2) { 
      meteorite.style.width = "67px";
      meteorite.style.height = "75px";
    } else { 
        meteorite.style.width = "67px";
        meteorite.style.height = "75px";
    }
  
    // 随机生陨石在屏幕顶部出现的初始 x 坐标
    var meteoriteL = Math.floor(Math.random() * (gameW - data.width + 1));
    var meteoriteT = -data.height; // 陨石从屏幕上方之外进入
    meteorite.style.left = meteoriteL + "px";
    meteorite.style.top  = meteoriteT + "px";
  
    // 放入 enemysP 容器，并加入 enemys 数组，最后调用 moveEnemy()
    meteorites.appendChild(meteorite);
    meteoriteArray.push(meteorite);
    moveMeteorite(meteorite);
  }
  
  /**
   * 让敌机不断向下移动，若超出屏幕则移除
   * 并检测与玩家子弹/玩家飞机的碰撞
   * @param {HTMLElement} m - 敌机元素
   */
  function moveMeteorite(m) {
    var meteoriteBaseSpeed;
    if (m.t === 1) meteoriteBaseSpeed = 5;   
    else if (m.t === 2) meteoriteBaseSpeed = 3; 
    else meteoriteBaseSpeed = 1.5;              
  
    m.timer = setInterval(() => {
      if (!gameStatus) return; // 暂停或结束时，不更新
      var topVal = getStyle(m, "top");
      // 若超出屏幕底部，移除
      if (topVal >= gameH) {
        clearInterval(m.timer);
        if (m.parentNode) m.parentNode.removeChild(m);
        var idx = meteoriteArray.indexOf(m);
        if (idx !== -1) meteoriteArray.splice(idx, 1);
      } else {
        // 陨石移动速度 = baseSpeed * enemySpeedFactor
        var finalSpeed = meteoriteBaseSpeed * meteoriteSpeedFactor;
        m.style.top = (topVal + finalSpeed) + "px";
  
    
        // 检测是否与玩家飞机碰撞
        checkCollisionWithMeteorite(m);
        bulletsCollisionWithMeteorites(m);
      }
    }, 30);
  }
  



  /** 
 * 玩家子弹 vs 敌机 
 * 在 enemy.js 的 moveEnemy(e) 中会调用此函数
 */
function bulletsCollisionWithMeteorites(m){
  for(var i=0; i<bullets.length; i++){
    var b = bullets[i];

    // 获取子弹位置 & 大小
    var bL = getStyle(b, "left"),
        bT = getStyle(b, "top"),
        bW = getStyle(b, "width"),
        bH = getStyle(b, "height");

    // 获取敌机位置 & 大小
    var eL = getStyle(m, "left"),
        eT = getStyle(m, "top"),
        eW = getStyle(m, "width"),
        eH = getStyle(m, "height");

    // 碰撞检测
    if(collide(bL, bT, bW, bH, eL, eT, eW, eH, bulletScale, enemyScale)){
      // 1. 停止子弹
      clearInterval(b.timer);
      if(b.parentNode) b.parentNode.removeChild(b);
      bullets.splice(i,1);

      // 2. 敌机扣血
      m.hp -= 100;

      // 3. 如果敌机血量 <= 0，调用 killEnemy(e)
      if(m.hp <= 0){
        killMeteorite(m);
      }
      break; // 只处理一次碰撞
    }
  }
}



  function killMeteorite(m){
    if (m.dead) return;
    m.dead = true;
    clearInterval(m.timer);
    m.src = "image/bz.gif"; // 爆炸动画
  
    setTimeout(function(){
      if(m.parentNode){
        meteorites.removeChild(m);
        var idx = meteoriteArray.indexOf(m);
        if(idx !== -1) meteoriteArray.splice(idx,1);
      }
    }, 500);
}


function checkCollisionWithMeteorite(m){

    var mL = getStyle(m,"left"),
        mT = getStyle(m,"top"),
        mW = getStyle(m,"width"),
        mH = getStyle(m,"height");
  
    // ---------------- 玩家1护盾判断 ----------------
    if(plane1ShieldActive){
      var shieldX= plane1X + myPlaneW/2 -50;
      var shieldY= plane1Y + myPlaneH/2 -50;
      var shieldW= 100, shieldH=100;
  

      if(collide(mL,mT,mW,mH, shieldX,shieldY,shieldW,shieldH, enemyScale,1)){
        killMeteorite(m)
        return;
      }
    }
  
    // 玩家1机体
    if(collide(mL,mT,mW,mH, plane1X,plane1Y, myPlaneW,myPlaneH, enemyScale, planeScale)){
      // 这里做受击处理
      shakeWindow(300,8);
      plane1Hp--;
      loseHeart();
      killMeteorite(m) 
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
        if(collide(mL,mT,mW,mH, shield2X,shield2Y,100,100, enemyScale,1)){
        killMeteorite(m)
          return;
        }
      }
      if(collide(mL,mT,mW,mH, plane2X,plane2Y, myPlane2W,myPlane2H, enemyScale, planeScale)){
        shakeWindow(300,8);
        plane2Hp--;
        loseHeart();
        killMeteorite(m)
        if(plane2Hp<=0){
          doGameOver();
          return;
        }
      }
    }
  }

  
  function pauseAllmeteorites() {
    if (currentRound < 3) return;
    clearInterval(meteoriteTimer);
    meteoriteTimer = null;
    for (let i = 0; i < meteoriteArray.length; i++) {
      clearInterval(meteoriteArray[i].timer);
      meteoriteArray[i].timer = null;
    }
  }
  
  
  function resumeAllmeteorites() {
    if (currentRound < 3) return; // 
    if (!meteoriteTimer) startMeteoriteSpawn(); // 确保重新开始生成
    for (let i = 0; i < meteoriteArray.length; i++) {
        if (!meteoriteArray[i].timer) {
            moveMeteorite(meteoriteArray[i]); // 让所有陨石继续移动
        }
    }
}
  


  
