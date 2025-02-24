/** 游戏结束（清理所有游戏元素） */
function doGameOver(){
    clearInterval(movementTimer); movementTimer=null;
    clearInterval(enemyTimer);    enemyTimer=null;
    clearInterval(enemyFireTimer);enemyFireTimer=null;
    clearInterval(bgTimer);       bgTimer=null;
    gameStatus = false;
  
    plane1Hp = 5;
    plane2Hp = 5;
    
    enemysP.innerHTML       = "";
    bulletsP.innerHTML      = "";
    enemyBulletsP.innerHTML = "";
  
    // 隐藏玩家飞机
    myPlane.style.display  = "none";
    myPlane2.style.display = "none";
  
    alert("Game Over! Final Score: " + score);
  
    homePage.style.display  = "block";
    gameEnter.style.display = "none";
  }
  