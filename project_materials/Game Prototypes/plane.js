
function $(idName) {
  return document.getElementById(idName);
}


function getStyle(ele, attr) {
  var res = null;
  if (ele.currentStyle) {

    res = ele.currentStyle[attr];
  } else {

    res = window.getComputedStyle(ele, null)[attr];
  }
  return parseFloat(res);
}


window.onload = function() {

  var game        = $("game");
  var gameStart   = $("gameStart");
  var selectMode  = $("selectMode");

  var enterName   = $("enterName");
  var enterName2  = $("enterName2");
  var gameEnter   = $("gameEnter");

  var myPlane     = $("myPlane");  
  var myPlane2    = $("myPlane2"); 
  var bulletsP    = $("bullets");   
  var playerInfo  = $("playerInfo");
  var pauseTip    = $("pauseTip");


  var gameW    = getStyle(game, "width");
  var gameH    = getStyle(game, "height");
  var gameML   = getStyle(game, "marginLeft");
  var gameMT   = getStyle(game, "marginTop");

  var myPlaneW = getStyle(myPlane, "width");
  var myPlaneH = getStyle(myPlane, "height");

  var myPlane2W = getStyle(myPlane2, "width");
  var myPlane2H = getStyle(myPlane2, "height");


  var gameStatus = false; 
  var isDouble   = false; 
  var playerName1 = "";
  var playerName2 = "";

 
  var plane2X = 275;
  var plane2Y = 400;


  var bulletTimer = null;


  gameStart.firstElementChild.onclick = function() {
    gameStart.style.display = "none";
    selectMode.style.display = "block";
  };


  var singleBtn = $("singleBtn");
  var doubleBtn = $("doubleBtn");

  singleBtn.onclick = function() {
    isDouble = false;
    selectMode.style.display = "none";
    enterName.style.display = "block";
    $("nameHint").innerText = "Please enter your name";
  };

  doubleBtn.onclick = function() {
    isDouble = true;
    selectMode.style.display = "none";
    enterName.style.display = "block";
    $("nameHint").innerText = "Please enter the first player's name";
  };


  var nameInput = $("nameInput");
  var errMsg1   = $("errMsg1");

  nameInput.onkeyup = function(e) {
    if (e.keyCode === 13) { // Enter
      var val = nameInput.value.trim();
      if (!val) {
        errMsg1.innerText = "Player name cannot be empty!";
      } else {
        errMsg1.innerText = "";
        playerName1 = val;
        nameInput.value = "";

        if (isDouble) {
          enterName.style.display = "none";
          enterName2.style.display = "block";
        } else {
          enterName.style.display = "none";

          showGameEnter();
        }
      }
    }
  };

  // 7. 输入第二位玩家名（双人模式）
  var nameInput2 = $("nameInput2");
  var errMsg2    = $("errMsg2");

  nameInput2.onkeyup = function(e) {
    if (e.keyCode === 13) {
      var val = nameInput2.value.trim();
      if (!val) {
        errMsg2.innerText = "Player name cannot be empty!！";
      } else {
        errMsg2.innerText = "";
        playerName2 = val;
        nameInput2.value = "";
        enterName2.style.display = "none";
        // 进入游戏
        showGameEnter();
      }
    }
  };

  // 8. 进入正式游戏界面
  function showGameEnter() {
    gameEnter.style.display = "block";

    if (isDouble) {
      // 双人模式，显示蓝色飞机
      myPlane2.style.display = "block";
      playerInfo.innerText = "Double：player1(" + playerName1 + ") & player2(" + playerName2 + ")";
    } else {
      myPlane2.style.display = "none";
      playerInfo.innerText = "Single：player(" + playerName1 + ")";
    }

    // 进入界面时立即开始
    gameStatus = true;
    document.onmousemove = myPlaneMove; // 第一架飞机鼠标移动
    pauseTip.style.display = "none";

    // 开始自动发射子弹
    startShooting();
  }

  // 9. 按空格键：开始 / 暂停 切换
  document.onkeyup = function(evt) {
    var e = evt || window.event;
    var keyVal = e.keyCode;
    if (keyVal === 32) { // 空格
      if (gameStatus) {
        // 进行中 → 暂停
        gameStatus = false;
        document.onmousemove = null;  // 停止红色飞机鼠标移动
        pauseTip.style.display = "block";
        // 停止子弹发射
        stopShooting();
      } else {
        // 暂停 → 继续
        gameStatus = true;
        document.onmousemove = myPlaneMove;
        pauseTip.style.display = "none";
        startShooting();
      }
    }
  };

  // 10. 第二架飞机用WASD移动
  document.onkeydown = function(e) {
    if (!gameStatus || !isDouble) return; // 只有双人模式&进行中才移动
    var step = 30;
    switch(e.key.toLowerCase()) {
      case 'w':
        plane2Y -= step;
        break;
      case 's':
        plane2Y += step;
        break;
      case 'a':
        plane2X -= step;
        break;
      case 'd':
        plane2X += step;
        break;
      default:
        return;
    }
    // 边界限制
    if (plane2X < 0) plane2X = 0;
    if (plane2X > gameW - myPlane2W) plane2X = gameW - myPlane2W;
    if (plane2Y < 0) plane2Y = 0;
    if (plane2Y > gameH - myPlane2H) plane2Y = gameH - myPlane2H;

    myPlane2.style.left = plane2X + "px";
    myPlane2.style.top  = plane2Y + "px";
  };

  // 11. 第一架飞机鼠标移动
  function myPlaneMove(evt) {
    var e = evt || window.event;
    var mouse_x = e.pageX || e.clientX;
    var mouse_y = e.pageY || e.clientY;

    var last_myPlane_left = mouse_x - gameML - myPlaneW/2;
    var last_myPlane_top  = mouse_y - gameMT - myPlaneH/2;

    // 边界限制
    if (last_myPlane_left < 0) last_myPlane_left = 0;
    if (last_myPlane_left > gameW - myPlaneW) last_myPlane_left = gameW - myPlaneW;
    if (last_myPlane_top < 0) last_myPlane_top = 0;
    if (last_myPlane_top > gameH - myPlaneH) last_myPlane_top = gameH - myPlaneH;

    myPlane.style.left = last_myPlane_left + "px";
    myPlane.style.top  = last_myPlane_top + "px";
  }

  // ========== 以下为子弹发射逻辑 ==========

  // 让两个飞机都可以发射子弹
function startShooting() {
  if (bulletTimer) return; // 避免重复开启

  bulletTimer = setInterval(function() {
    createBullet(myPlane);  // 让红色飞机发射子弹

    if (isDouble) {
      createBullet(myPlane2); // 如果是双人模式，蓝色飞机也发射子弹
    }
  }, 200); // 每 200 毫秒发射一颗子弹
}

  // 停止发射（关闭定时器）
  function stopShooting() {
    if (bulletTimer) {
      clearInterval(bulletTimer);
      bulletTimer = null;
    }
  }

  // 创建一颗子弹，并让它从传入的飞机发射
function createBullet(plane) {
  var bullet = document.createElement("div");
  bullet.className = "bullet"; // 让子弹应用 CSS 样式

  // 获取飞机坐标
  var planeX = parseInt(plane.style.left || 150);
  var planeY = parseInt(plane.style.top || 400);
  var bulletSize = 10; // 子弹大小

  // 让子弹从飞机中心发射
  bullet.style.left = (planeX + 20) + "px";
  bullet.style.top = (planeY - bulletSize) + "px";

  bulletsP.appendChild(bullet);

  // 让子弹向上移动
  function moveBullet() {
    if (!bullet.parentElement) return; // 防止子弹被删除后仍然移动
    var bulletY = parseInt(bullet.style.top);
    if (bulletY <= 0) {
      bullet.remove(); // 超出屏幕删除
    } else {
      bullet.style.top = (bulletY - 5) + "px"; // 子弹向上移动
      requestAnimationFrame(moveBullet);
    }
  }
  requestAnimationFrame(moveBullet);
}






  // 子弹移动：每隔10ms向上移动speed
  function moveBullet(ele, attr, bulletH) {
    var speed = -8; // 向上飞
    ele.timer = setInterval(function(){
      var val = getStyle(ele, attr);

      // 判断是否飞出屏幕顶部(小于 -bulletH 即彻底离开)
      if (val <= -bulletH) {
        clearInterval(ele.timer);
        ele.parentNode.removeChild(ele);
      } else {
        ele.style[attr] = (val + speed) + "px";
      }
    }, 10);
  }
};
