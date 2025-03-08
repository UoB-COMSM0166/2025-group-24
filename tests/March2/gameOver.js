/** 游戏结束（清理所有游戏元素） */
function doGameOver(){
    myClearInterval(movementTimer); movementTimer=null;
    myClearInterval(enemyTimer);    enemyTimer=null;
    myClearInterval(enemyFireTimer);enemyFireTimer=null;
    myClearInterval(bgTimer);       bgTimer=null;
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

  
    // 隐藏玩家飞机
    myPlane.style.display  = "none";
    myPlane2.style.display = "none";
  
    alert("Game Over! Final Score: " + score);
  
    homePage.style.display  = "block";
    gameEnter.style.display = "none";

    score = 0;
    currentRound = 1;
    treasureContainer.innerHTML = "";



  }
  