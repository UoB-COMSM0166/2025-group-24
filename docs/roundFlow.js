/** 检查回合 */
function checkRound() {
// 如果玩家已死亡，直接触发游戏结束
/*if (plane1Hp <= 0 || (isDouble && plane2Hp <= 0)) {
  doGameOver();
  return;
}*/

    if (currentRound === 1 && score >= 1000) {
      currentRound = 2;
      marketPage();
      enemySpeedFactor *= 1.15;
      baseSpeed*=1.15
    }
    if (currentRound === 2 && score >= 3000) {
      currentRound = 3;
      marketPage();
      enemySpeedFactor *= 1.15;
      baseSpeed*=1.15
    }
    if (currentRound === 3 && score >= 4000) {
      currentRound = 4;
      marketPage();
      enemySpeedFactor *= 1.15;
      baseSpeed*=1.15
    }
    if (currentRound === 4 && score >= 5000) {
      currentRound = 5;
      marketPage();
      enemySpeedFactor *= 1.15;
      baseSpeed*=1.15
    }
  }
  
  /* 进如商品选择页面, marketPlace() */
  function marketPage(){
   gameEnter.style.display="none";//隐藏游戏
   marketPage1.style.display = "block";
   doMarketPage();
   removeAllBullets();
   removeEnemyBullet(b);
  }

  /** 进入下一关时，重置并再次 showGameEnter() */
  function resetGameForNextRound(){
    clearInterval(movementTimer);
    clearInterval(enemyTimer);
    clearInterval(enemyFireTimer);
    clearInterval(bgTimer);
    movementTimer = null;
    enemyTimer = null;
    enemyFireTimer = null;
    bgTimer = null;
  
    gameStatus = false;
  
    // 清空玩家子弹
    bullets.forEach(b => {
      clearInterval(b.timer);
      if(b.parentNode) b.parentNode.removeChild(b);
    });
    bullets = [];
  
    // 清空敌机
    enemys.forEach(e => {
      clearInterval(e.timer);
      if(e.parentNode) e.parentNode.removeChild(e);
    });
    enemys = [];
  
    // 清空敌机子弹
    enemyBullets.forEach(b => {
      clearInterval(b.timer);
      if(b.parentNode) b.parentNode.removeChild(b);
    });
    enemyBullets = [];
  
    // 再次进入
    showGameEnter();
    //初始化HP表达
    initializeHearts();
  }


  //进入商店页面时停止所有元素；
  function doMarketPage(){
    clearInterval(movementTimer);
    clearInterval(enemyTimer);
    clearInterval(enemyFireTimer);
    clearInterval(bgTimer);
    movementTimer = null;
    enemyTimer = null;
    enemyFireTimer = null;
    bgTimer = null;
  
    gameStatus = false;
    //treasureContainer.innerHTML = "";
    // 清空玩家子弹
    bullets.forEach(b => {
      clearInterval(b.timer);
      if(b.parentNode) b.parentNode.removeChild(b);
    });
    bullets = [];
  
    // 清空敌机
    enemys.forEach(e => {
      clearInterval(e.timer);
      if(e.parentNode) e.parentNode.removeChild(e);
    });
    enemys = [];
  
    // 清空敌机子弹
    enemyBullets.forEach(b => {
      clearInterval(b.timer);
      if(b.parentNode) b.parentNode.removeChild(b);
    });
    enemyBullets = [];
  }


  
  //购买属性
  hpPlus.onclick = function(){
    marketPage1.style.display = "none";
    gameEnter.style.display = "block"
    buyHp();
    showGameEnter();
    
  };
  speedPlus.onclick = function(){
    marketPage1.style.display = "none";
    gameEnter.style.display = "block"
    buySpeed();
    showGameEnter();
  };
  damagePlus.onclick = function(){
    marketPage1.style.display = "none";
    gameEnter.style.display = "block"
    buyDamage();
    showGameEnter();
  };