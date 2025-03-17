
/** 
 * 和ui设置事件监听 
 * 注意：核心逻辑函数(如 showGameEnter, createBulletForPlane)由 part2.js 提供
 */
window.onload = function(){

  // ========== 首页按钮事件 ==========
  startBtn.onclick=function(){
    homePage.style.display="none";
    selectMode.style.display="block";
  };
  rankBtn.onclick=function(){
    homePage.style.display="none";
    rankPanel.style.display="block";
  };
  backBtn.onclick=function(){
    rankPanel.style.display="none";
    homePage.style.display="block";
  };

  // ========== 单人 / 双人按钮 ==========
  singleBtn.onclick=function(){
    isDouble=false;
    nameInput.value="";
    nameInput2.value="";
    errMsg1.innerText="";
    errMsg2.innerText="";
    selectMode.style.display="none";
    enterName.style.display="block";
    $("nameHint").innerText="Please enter your name";
  };

  doubleBtn.onclick=function(){
    isDouble=true;
    nameInput.value="";
    nameInput2.value="";
    errMsg1.innerText="";
    errMsg2.innerText="";
    selectMode.style.display="none";
    enterName.style.display="block";
    $("nameHint").innerText="Please enter the first player's name";
  };

  // ========== 输入玩家名 ==========
  nameInput.onkeyup=function(e){
    if(e.keyCode===13){
      var val = nameInput.value.trim();
      if(!val){
        errMsg1.innerText="Player name cannot be empty!";
      } else {
        errMsg1.innerText="";
        playerName1 = val;
        nameInput.value="";
        if(isDouble){
          enterName.style.display="none";
          enterName2.style.display="block";
        } else {
          enterName.style.display="none";
          // 这里调用 showGameEnter() —— 来自 part2.js
          showGameEnter();
        }
      }
    }
  };

  nameInput2.onkeyup=function(e){
    if(e.keyCode===13){
      var val = nameInput2.value.trim();
      if(!val){
        errMsg2.innerText="Player name cannot be empty!";
      } else {
        errMsg2.innerText="";
        playerName2= val;
        nameInput2.value="";
        enterName2.style.display="none";
        // 这里同样调用 showGameEnter()
        showGameEnter();
      }
    }
  };
 
  // ========== 键盘事件 ==========
  document.onkeydown=function(e){
    if(!gameStatus) return;
    var key=e.key.toLowerCase();
    // 玩家1 (WASD / F)
    switch(key){
      case 'w': p1Up=true;   break;
      case 's': p1Down=true; break;
      case 'a': p1Left=true; break;
      case 'd': p1Right=true;break;
      case 'f':
        // createBulletForPlane 来自 part2.js
        createBulletForPlane(myPlane, plane1X, plane1Y, myPlaneW, myPlaneH);
        break;
    }

    // 如果是单人模式，不执行后续
    if(!isDouble) return;

    // 玩家2 (方向键 / L)
    switch(e.key){
      case 'ArrowUp':   p2Up=true;   break;
      case 'ArrowDown': p2Down=true; break;
      case 'ArrowLeft': p2Left=true; break;
      case 'ArrowRight':p2Right=true;break;
      case 'l':
        // 同样调用 part2.js 提供的函数
        createBulletForPlane(myPlane2, plane2X, plane2Y, myPlane2W, myPlane2H);
        break;
    }
  };

  document.onkeyup=function(e){
    // 按下空格暂停/继续
    if(e.keyCode===32){
      if(gameStatus){
        gameStatus=false;
        pauseTip.style.display="block";
        // 调用 part2.js 的函数
        pauseAllBullets();
        pauseAllEnemies();
        myClearInterval(bgTimer);
        myClearInterval(enemyFireTimer);
        bgTimer=null;
        enemyFireTimer=null;
      } else {
        gameStatus=true;
        pauseTip.style.display="none";
        resumeAllBullets();
        resumeAllEnemies();
        resumeAllEnemyBullets();
        bgMove();
        startEnemyFire();
      }
      return;
    }

    var key=e.key.toLowerCase();
    // 玩家1
    switch(key){
      case 'w': p1Up=false;   break;
      case 's': p1Down=false; break;
      case 'a': p1Left=false; break;
      case 'd': p1Right=false;break;
    }
    // 玩家2
    if(isDouble){
      switch(e.key){
        case 'ArrowUp':   p2Up=false;   break;
        case 'ArrowDown': p2Down=false; break;
        case 'ArrowLeft': p2Left=false; break;
        case 'ArrowRight':p2Right=false;break;
      }
    }
  };

}; // end of onload

// 让 Cypress 测试可以模拟键盘事件
window.simulateKeyEvent = function (key, type = "keydown") {
  let event = new KeyboardEvent(type, { key });
  document.dispatchEvent(event);
};
