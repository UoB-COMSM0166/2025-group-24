/** 游戏结束（清理所有游戏元素） */
function doGameOver(){
    clearInterval(movementTimer); movementTimer=null;
    clearInterval(enemyTimer);    enemyTimer=null;
    clearInterval(enemyFireTimer);enemyFireTimer=null;
    clearInterval(bgTimer);       bgTimer=null;
    clearInterval(meteoriteTimer);meteoriteTimer=null;

    gameStatus = false;

    //使得左右手模式恢复
    leftEnter = false;
    rightEnter = false; 

    plane1Hp = 5;
    plane2Hp = 5;

    heartsContainer.innerHTML = '';
    
    enemysP.innerHTML       = "";
    bulletsP.innerHTML      = "";
    enemyBulletsP.innerHTML = "";
    meteorites.innerHTML = ""
  
    // 隐藏玩家飞机
    myPlane.style.display  = "none";
    myPlane2.style.display = "none";
  
    alert("Game Over! Final Score: " + score);

  // 添加玩家得分到排行榜
  if (isDouble) {
    addScore(`${playerName1} & ${playerName2}`, score, true); // 双人模式
  } else {
    addScore(playerName1, score, false); // 单人模式
  }

  
    homePage.style.display  = "block";
    gameEnter.style.display = "none";

    score = 0;
    currentRound = 1;
    treasureContainer.innerHTML = "";
    enemySpeedFactor *= 1;
    baseSpeed*=1;



  }
  