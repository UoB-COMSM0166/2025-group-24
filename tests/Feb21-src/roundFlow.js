/** 检查回合 */
function checkRound() {
    if (currentRound === 1 && score >= 1000) {
      currentRound = 2;
      resetGameForNextRound();
    }
    if (currentRound === 2 && score >= 1500) {
      currentRound = 3;
      resetGameForNextRound();
    }
    if (currentRound === 3 && score >= 2000) {
      currentRound = 4;
      resetGameForNextRound();
    }
    if (currentRound === 4 && score >= 2000) {
      currentRound = 5;
      resetGameForNextRound();
    }
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
  }