

/**
 * 玩家输入完名字后，正式进入游戏
 * 设置玩家初始位置、回合提示，启动主要逻辑
 */
function showGameEnter() {
  gameEnter.style.display = "block";

  // 判断是否双人
  if (isDouble) {
    myPlane2.style.display = "block";
    playerInfo.innerText = "Two-player mode: P1(" + playerName1 + ") & P2(" + playerName2 + ")";
  } else {
    myPlane2.style.display = "none";
    playerInfo.innerText = "Single-player mode: Player(" + playerName1 + ")";
  }

  // 设置玩家1初始位置
  plane1X = 200;
  plane1Y = 400;
  myPlane.style.left = plane1X + "px";
  myPlane.style.top  = plane1Y + "px";
  myPlane.style.display = "block";

  // 设置玩家2初始位置（如双人模式）
  plane2X = 400;
  plane2Y = 400;
  myPlane2.style.left = plane2X + "px";
  myPlane2.style.top  = plane2Y + "px";

  // 显示回合提示
  if (currentRound === 1) {
    roundPopup.innerText = "ROUND ONE";
  } else if (currentRound === 2) {
    roundPopup.innerText = "ROUND TWO";
  } else if (currentRound === 3) {
    roundPopup.innerText = "ROUND THREE";
  } else if (currentRound === 4) {
    roundPopup.innerText = "ROUND FOUR";
  } else if (currentRound === 5) {
    roundPopup.innerText = "FINAL ROUND";
  }
  roundPopup.style.display = "block";
  mySetTimeout(() => {
    roundPopup.style.display = "none";
  }, 2000);

  // 根据回合提升敌机血量
  if (currentRound === 2) {
    enemyObj.enemy1.hp = 150;
    enemyObj.enemy2.hp = 350;
    enemyObj.enemy3.hp = 550;
  } else if (currentRound === 3) {
    enemyObj.enemy1.hp = 200;
    enemyObj.enemy2.hp = 400;
    enemyObj.enemy3.hp = 600;
  } else if (currentRound === 4) {
    enemyObj.enemy1.hp = 250;
    enemyObj.enemy2.hp = 450;
    enemyObj.enemy3.hp = 650;
  } else if (currentRound === 5) {
    enemyObj.enemy1.hp = 300;
    enemyObj.enemy2.hp = 500;
    enemyObj.enemy3.hp = 700;
  }

  // 开始游戏
  gameStatus = true;
  pauseTip.style.display = "none";
  score = 0;
  scoreVal.innerHTML = score;

  // 启动主要逻辑
  startMovement();
  startEnemySpawn();
  startEnemyFire();
  bgMove();
}

/**
 * 让页面在短时间内随机抖动（撞击、受伤等效果）
 * duration：抖动持续毫秒，intensity：抖动强度
 */
function shakeWindow(duration = 500, intensity = 10) {
  const body = document.body;
  const originalPosition = window.getComputedStyle(body).position;
  if (originalPosition === "static") {
    body.style.position = "relative";
  }
  const startTime = Date.now();

  function shake() {
    let elapsed = Date.now() - startTime;
    if (elapsed < duration) {
      let x = (Math.random() - 0.5) * 2 * intensity;
      let y = (Math.random() - 0.5) * 2 * intensity;
      body.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(shake);
    } else {
      body.style.transform = "translate(0,0)";
      if (originalPosition === "static") {
        body.style.position = originalPosition;
      }
    }
  }

  requestAnimationFrame(shake);
}

