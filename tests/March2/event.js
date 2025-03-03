
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
    $("nameHint").innerText="User name";
  };

  doubleBtn.onclick=function(){
    isDouble=true;
    nameInput.value="";
    nameInput2.value="";
    errMsg1.innerText="";
    errMsg2.innerText="";
    selectMode.style.display="none";
    enterName.style.display="block";
    $("nameHint").innerText="Player 1";
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
          singleIntro.style.display="block";
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
        nameInput2.value=""
        enterName2.style.display="none";
        doubleIntro.style.display="block";
      }
    }
  };


  //双人模式开始按钮

  doubleEnter.onclick=function(){
    doubleIntro.style.display="none";
    gameEnter.style.display="block";
    //这里同样调用 showGameEnter()—— 来自 part2.js
    showGameEnter();
  };


  // ========== 单人左右手模式选择 ==========
  leftEnter.onclick = function(){
    singleIntro.style.display ="none";
    leftModel = true;
    rightModel = false; 
    console.log("Left Model Activated:", leftModel); 
    showGameEnter();

  };

  rightEnter.onclick = function(){
    singleIntro.style.display ="none";
    rightModel = true;
    leftModel = false;
    showGameEnter();

  }

  
  // ========== 键盘控制移动 ==========
  document.onkeydown = function(e) {
    if(!gameStatus) return;
    let key=e.key.toLowerCase();
    //如果是双人模式
  // 玩家1 (WASD / F)
    if(isDouble){
    switch(e.key){
      case 'w': p1Up=true;   break;
      case 's': p1Down=true; break;
      case 'a': p1Left=true; break;
      case 'd': p1Right=true;break;
      case 'f':
        // createBulletForPlane 来自 part2.js
        createBulletForPlane(myPlane, plane1X, plane1Y, myPlaneW, myPlaneH);
        break;
    }

    // 玩家2 (方向键 / L)
    switch(e.key){
      case 'ArrowUp':   p2Up=true;   break;
      case 'ArrowDown': p2Down=true; break;
      case 'ArrowLeft': p2Left=true; break;
      case 'ArrowRight':p2Right=true;break;
      case 'Enter':
        // 同样调用 part2.js 提供的函数
        createBulletForPlane(myPlane2, plane2X, plane2Y, myPlane2W, myPlane2H);
        break;
    }
  }

  //如果是单人模式
  //单人模式里面左手模式
    if(leftModel){
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
    
    }

    if(rightModel){
        switch(e.key){
          case 'ArrowUp':   p1Up=true;   break;
          case 'ArrowDown': p1Down=true; break;
          case 'ArrowLeft': p1Left=true; break;
          case 'ArrowRight':p1Right=true;break;
          case 'Enter':
            // 同样调用 part2.js 提供的函数
            createBulletForPlane(myPlane, plane1X, plane1Y, myPlaneW, myPlaneH);
            break;
        }
      }

  };


   // ========== 暂停和继续 ==========
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
        //resumeAllEnemyBullets();
        bgMove();
        startEnemyFire();
        createEnemyBullet(e);
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

    switch (e.key) {
      case 'ArrowUp': p1Up = false; break;
      case 'ArrowDown': p1Down = false; break;
      case 'ArrowLeft': p1Left = false; break;
      case 'ArrowRight': p1Right = false; break;
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



// ==========//显示体力值初始化红心显示  ==========

const heartsContainer = document.getElementById('hearts-container');
function initializeHearts() {
  heartsContainer.innerHTML = '';
  let hp = plane1Hp > plane2Hp ? plane2Hp : plane1Hp ;
  for (let i = 0; i < hp; i++) {
      const heart = document.createElement('div');
      heart.classList.add('heart');
      heartsContainer.appendChild(heart);
  }
}

// 失去一点体力
function loseHeart() {
  if (heartsContainer && heartsContainer.lastChild) {
    heartsContainer.removeChild(heartsContainer.lastChild);
  }
}

//重置红心
function resetHearts(){
  hp = 5;
  initializeHearts();
}

// 将所有事件处理函数和变量挂载到 window 对象上，以便测试文件可以访问

// 首页按钮事件
window.startBtnClick = startBtn.onclick;
window.rankBtnClick = rankBtn.onclick;
window.backBtnClick = backBtn.onclick;

// 单人/双人模式按钮事件
window.singleBtnClick = singleBtn.onclick;
window.doubleBtnClick = doubleBtn.onclick;

// 玩家名输入事件
window.nameInputKeyup = nameInput.onkeyup;
window.nameInput2Keyup = nameInput2.onkeyup;

// 双人模式开始按钮
window.doubleEnterClick = doubleEnter.onclick;

// 单人左右手模式选择
window.leftEnterClick = leftEnter.onclick;
window.rightEnterClick = rightEnter.onclick;

// 键盘控制移动
window.onKeyDownEvent = document.onkeydown;
window.onKeyUpEvent = document.onkeyup;

// 体力值管理
window.initializeHearts = initializeHearts;
window.loseHeart = loseHeart;
window.resetHearts = resetHearts;


