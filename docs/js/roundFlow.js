/** Check round progress */
function checkRound() {
  if (currentRound === 1 && score >= 1000) {
    currentRound = 2;
    marketPage();
    enemyRoundFlowUpgrade();
  }
  
  if (currentRound === 2 && score >=3000) {
    currentRound = 3;
    marketPage();
    enemyRoundFlowUpgrade();

  }
  if (currentRound === 3 && score >= 6000) {
    currentRound = 4;
    marketPage();
    enemyRoundFlowUpgrade();
    
   
  }
}

// Increase enemy difficulty after each round
function enemyRoundFlowUpgrade(){
  enemySpeedFactor *= 1.5;
  enemyBulletFactor*= 1.5;

}

/* Enter shop page, marketPlace() */
function marketPage(){
 gameEnter.style.display="none";// Hide game screen
 marketPage1.style.display = "block";
 HaveEnteredGame =false;
 resetGameForNextRound();
 //removeEnemyBullet(b);
}



/** Reset and call showGameEnter() again for the next round */
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

  // Clear player bullets
  bullets.forEach(b => {
    clearInterval(b.timer);
    if(b.parentNode) b.parentNode.removeChild(b);
  });
  bullets = [];

  // Clear enemies
  enemys.forEach(e => {
    clearInterval(e.timer);
    if(e.parentNode) e.parentNode.removeChild(e);
  });
  enemys = [];

  // Clear enemy bullets
  enemyBullets.forEach(b => {
    clearInterval(b.timer);
    if(b.parentNode) b.parentNode.removeChild(b);
  });
  enemyBullets = [];


   // Clear meteorites
   meteoriteArray.forEach(m => {
    clearInterval(m.timer);
    if(m.parentNode) m.parentNode.removeChild(m);
  });
  meteoriteArray = [];
 
  // Initialize heart display
  initializeHearts();
}




// Purchase HP
hpPlus.onclick = function(){
  p1Up = p1Down = p1Left = p1Right = false;
  p2Up = p2Down = p2Left = p2Right = false;
  marketPage1.style.display = "none";
  gameEnter.style.display = "block";
  
  HaveEnteredGame =true;
  buyHp();

  if(currentRound<2){
    showGameEnter();
  }else{
    showGameEnter();
    startMeteoriteSpawn();
  }
  
};

speedPlus.onclick = function(){
  p1Up = p1Down = p1Left = p1Right = false;
  p2Up = p2Down = p2Left = p2Right = false;
  marketPage1.style.display = "none";
  gameEnter.style.display = "block";
 
  HaveEnteredGame =true;
  buySpeed();

  if(currentRound<2){
    showGameEnter();
  }else{
    showGameEnter();
    startMeteoriteSpawn();
  }
  
};

damagePlus.onclick = function(){
  p1Up = p1Down = p1Left = p1Right = false;
  p2Up = p2Down = p2Left = p2Right = false;
  marketPage1.style.display = "none";
  gameEnter.style.display = "block";
 
  HaveEnteredGame =true;
  buyDamage();
  if(currentRound<2){
    showGameEnter();
  }else{
    showGameEnter();
    startMeteoriteSpawn();
  }
};

