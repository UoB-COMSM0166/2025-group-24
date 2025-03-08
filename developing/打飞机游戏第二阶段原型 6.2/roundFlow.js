/** 检查回合 */
function checkRound() {
    if (currentRound === 1 && score >= 1000) {
      currentRound = 2;
      marketPage();
      enemyRoundFlowUpgrade();
    }
    
    if (currentRound === 2 && score >= 3000) {
      currentRound = 3;
      marketPage();
      enemyRoundFlowUpgrade();
  
    }
    if (currentRound === 3 && score >= 4000) {
      currentRound = 4;
      marketPage();
      enemyRoundFlowUpgrade();
      
     
    }
    if (currentRound === 4 && score >= 5000) {
      currentRound = 5;
      marketPage();
      enemyRoundFlowUpgrade();
    }
  }
  
  //每关之后生敌方难度提升
  function enemyRoundFlowUpgrade(){
    enemySpeedFactor *= 1.15;
    enemyBulletFactor*= 1.15;

  }

  /* 进如商品选择页面, marketPlace() */
  function marketPage(){
   gameEnter.style.display="none";//隐藏游戏
   marketPage1.style.display = "block";
   resetGameForNextRound();
   removeAllBullets();
   removeEnemyBullet(b);
  }



  /** 进入下一关时，重置并再次 showGameEnter() */
  function resetGameForNextRound(){
    clearInterval(movementTimer);
    clearInterval(enemyTimer);
    clearInterval(enemyFireTimer);
    clearInterval(bgTimer);
    clearInterval(meteoriteTimer);
    movementTimer = null;
    enemyTimer = null;
    enemyFireTimer = null;
    bgTimer = null;
    meteoriteTimer=null;
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
  

     //清除陨石
     meteoriteArray.forEach(m => {
      clearInterval(m.timer);
      if(m.parentNode) m.parentNode.removeChild(m);
    });
    meteoriteArray = [];
   
    //初始化HP表达
    initializeHearts();
  }



  
  //购买属性
  hpPlus.onclick = function(){
    marketPage1.style.display = "none";
    gameEnter.style.display = "block"
    buyHp();

    if(currentRound<3){
      showGameEnter();
    }else{
      showGameEnter();
      startMeteoriteSpawn();
    }
    
  };
  speedPlus.onclick = function(){
    marketPage1.style.display = "none";
    gameEnter.style.display = "block"
    buySpeed();

    if(currentRound<3){
      showGameEnter();
    }else{
      showGameEnter();
      startMeteoriteSpawn();
    }
    
  };
  damagePlus.onclick = function(){
    marketPage1.style.display = "none";
    gameEnter.style.display = "block"
    buyDamage();
    if(currentRound<3){
      showGameEnter();
    }else{
      showGameEnter();
      startMeteoriteSpawn();
    }
  };

  