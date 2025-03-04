
/** 
 * 和ui设置事件监听 
 * 注意：核心逻辑函数(如 showGameEnter, createBulletForPlane)由 part2.js 提供
 */

window.onload = function(){
  initLeaderboard(); // 初始化排行榜
  setupLeaderboardPanels(); // 设置排行榜面板
  // ========== 首页按钮事件 ==========
  startBtn.onclick=function(){
    homePage.style.display="none";
    selectMode.style.display="block";
  };
 // 排行榜按钮点击事件
rankBtn.onclick = function () {
  // 隐藏其他界面
  homePage.style.display = "none";
  selectMode.style.display = "none";
  gameEnter.style.display = "none";

  // 默认展示单人模式排行榜
  displayLeaderboard(false);
};

// 单人/双人排行榜切换按钮
document.querySelectorAll("#rankSingle").forEach(button => {
  button.onclick = function () {
    // 隐藏双人模式排行榜
    document.getElementById("rankPanel2").style.display = "none";
    // 展示单人模式排行榜
    displayLeaderboard(false);
  };
});

document.querySelectorAll("#rankDouble").forEach(button => {
  button.onclick = function () {
    // 隐藏单人模式排行榜
    document.getElementById("rankPanel1").style.display = "none";
    // 展示双人模式排行榜
    displayLeaderboard(true);
  };
});

// 清空排行榜按钮
function addClearButton(panelId, isDouble) {
  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear Leaderboard";
  clearButton.style.marginTop = "20px";
  clearButton.style.padding = "10px 20px";
  clearButton.style.backgroundColor = "#ff4d4d";
  clearButton.style.color = "white";
  clearButton.style.border = "none";
  clearButton.style.borderRadius = "5px";
  clearButton.style.cursor = "pointer";
  clearButton.style.fontFamily = "MyCustomFont, sans-serif";
  clearButton.style.fontSize = "20px";

  clearButton.onclick = function () {
    clearLeaderboard(isDouble); // 清空对应模式的排行榜
  };

  // 将清空按钮添加到排行榜面板
  const rankPanel = document.getElementById(panelId);
  rankPanel.appendChild(clearButton);
}

// 在排行榜页面加载时添加清空按钮
function setupLeaderboardPanels() {
  addClearButton("rankPanel1", false); // 单人模式清空按钮
  addClearButton("rankPanel2", true);  // 双人模式清空按钮
}

// 设一个函数来处理返回按钮的点击事件
function handleBackButtonClick(isDouble) {
  if (isDouble) {
    // 处理双人模式的返回逻辑
    document.getElementById("rankPanel2").style.display = "none";
    document.getElementById("homePage").style.display = "block";
  } else {
    // 处理单人模式的返回逻辑
    document.getElementById("rankPanel1").style.display = "none";
    document.getElementById("homePage").style.display = "block";
  }
}

// 绑定事件监听器
document.getElementById("backBtn1").addEventListener("click", function() {
  handleBackButtonClick(false); // 单人模式
});

document.getElementById("backBtn2").addEventListener("click", function() {
  handleBackButtonClick(true); // 双人模式
});


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
    Intro2.style.display="block";
  };


  // ========== 单人左右手模式选择 ==========
  leftEnter.onclick = function(){
    singleIntro.style.display ="none";
    leftModel = true;
    rightModel = false; 
    console.log("Left Model Activated:", leftModel); //这是 JavaScript 的 日志输出方法，用于在浏览器开发者工具（F12）控制台打印信息
    Intro2.style.display = "block";
  };

  rightEnter.onclick = function(){
    singleIntro.style.display ="none";
    rightModel = true;
    leftModel = false;
    Intro2.style.display ="block";

  }

  // ========== 单人进入简介2选择 ==========
  nextBtn.onclick = function(){
    Intro2.style.display = "none";
    Intro3.style.display = "block";
  }

  // ========== 单人进入简介3选择 ==========
  finalStartBtn.onclick = function(){
    Intro3.style.display = "none";
    //这里同样调用 showGameEnter()—— 来自 part2.js
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
        clearInterval(bgTimer);
        clearInterval(enemyFireTimer);
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
   {
      heartsContainer.removeChild(heartsContainer.lastChild);
  } 
}
//重置红心
function resetHearts(){
  hp = 5;
  initializeHearts();
}

// ==========//音频 ==========
// 创建音频对象
const bgm = new Audio("audio/Red Doors.mp3");
bgm.loop = true; // 无限循环播放
bgm.volume = 0.5; // 音量

// 监听用户交互后播放音乐
document.getElementById("startBtn").addEventListener("click", () => {
  bgm.play();
});



