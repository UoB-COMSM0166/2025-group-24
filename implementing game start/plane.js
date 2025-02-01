// 检查是否在浏览器环境中运行
if (typeof window !== 'undefined') {
  // 简写函数：获取ID对应的DOM
  function $(idName) {
    return document.getElementById(idName);
  }

  // 获取元素计算后样式（兼容写法）
  function getStyle(ele, attr) {
    var res = null;
    if (ele.currentStyle) {
      res = ele.currentStyle[attr];
    } else {
      res = window.getComputedStyle(ele, null)[attr];
    }
    return parseFloat(res);
  }

  // 页面加载后执行
  window.onload = function() {
    // 这里是原本的初始化代码
  };
}
// 简写函数：获取ID对应的DOM

function $(idName) {
  return document.getElementById(idName);
}

// 获取元素计算后样式（兼容写法）
function getStyle(ele, attr) {
  var res = null;
  if (ele.currentStyle) {
    // 兼容老式IE
    res = ele.currentStyle[attr];
  } else {
    // 标准浏览器
    res = window.getComputedStyle(ele, null)[attr];
  }
  return parseFloat(res);
}

// 页面加载后执行
window.onload = function() {

  // 1. 获取主要DOM元素
  var game        = $("game");
  var gameStart   = $("gameStart");
  var selectMode  = $("selectMode");
  var enterName   = $("enterName");
  var enterName2  = $("enterName2");
  var gameEnter   = $("gameEnter");

  var myPlane     = $("myPlane");    // 第一架飞机（红色，鼠标控制）
  var myPlane2    = $("myPlane2");   // 第二架飞机（蓝色，WASD控制）
  var bulletsP    = $("bullets");
  var enemysP     = $("enemys");
  var playerInfo  = $("playerInfo");
  var pauseTip    = $("pauseTip");   // 暂停提示框

  // 2. 获取尺寸、边距等（用于鼠标移动定位）
  var gameW    = getStyle(game, "width");
  var gameH    = getStyle(game, "height");
  var gameML   = getStyle(game, "marginLeft");
  var gameMT   = getStyle(game, "marginTop");
  var myPlaneW = getStyle(myPlane, "width");
  var myPlaneH = getStyle(myPlane, "height");

  // 第二架飞机的宽高
  var myPlane2W = getStyle(myPlane2, "width");
  var myPlane2H = getStyle(myPlane2, "height");

  // 3. 定义一些状态变量
  var gameStatus = false;  // true表示“进行中”，false表示“暂停/未开始”
  var isDouble   = false;  // 是否双人模式
  var playerName1 = "";    // 第一个玩家名
  var playerName2 = "";    // 第二个玩家名（双人模式时使用）

  // plane2 的当前位置（WASD按键控制）
  var plane2X = 275; // 初始与CSS对应
  var plane2Y = 400; // 初始与CSS对应

  // 4. 点击“开始游戏”按钮后 → 选择模式
  gameStart.firstElementChild.onclick = function() {
    gameStart.style.display = "none";
    selectMode.style.display = "block";
  };

  // 5. 选择模式：单人 / 双人
  var singleBtn = $("singleBtn");
  var doubleBtn = $("doubleBtn");

  singleBtn.onclick = function() {
    isDouble = false;            
    selectMode.style.display = "none";
    enterName.style.display = "block";
    // "Please enter your name"
    $("nameHint").innerText = "Please enter your name";
  };

  doubleBtn.onclick = function() {
    isDouble = true;            
    selectMode.style.display = "none";
    enterName.style.display = "block";
    // "Please enter the first player's name"
    $("nameHint").innerText = "Please enter the first player's name";
  };

  // 6. 输入第一位玩家姓名
  var nameInput = $("nameInput");
  var errMsg1   = $("errMsg1");
  nameInput.onkeyup = function(e) {
    if (e.keyCode === 13) { // Enter
      var val = nameInput.value.trim();
      if (!val) {
        // "玩家名不能为空！" => "Player name cannot be empty!"
        errMsg1.innerText = "Player name cannot be empty!";
      } else {
        errMsg1.innerText = "";
        playerName1 = val;
        nameInput.value = "";

        // 单人直接进入游戏；双人再输入第二个玩家名
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

  // 7. 输入第二位玩家姓名（仅双人模式）
  var nameInput2 = $("nameInput2");
  var errMsg2    = $("errMsg2");
  nameInput2.onkeyup = function(e) {
    if (e.keyCode === 13) {
      var val = nameInput2.value.trim();
      if (!val) {
        errMsg2.innerText = "Player name cannot be empty!";
      } else {
        errMsg2.innerText = "";
        playerName2 = val;
        nameInput2.value = "";
        enterName2.style.display = "none";
        showGameEnter();
      }
    }
  };

  // 8. 显示正式游戏界面 & 进入“进行中”状态
  function showGameEnter() {
    gameEnter.style.display = "block";

    // 显示玩家信息
    if (isDouble) {
      myPlane2.style.display = "block";
      // "双人模式：玩家1(x) & 玩家2(y)" => "Two-player mode: Player1(x) & Player2(y)"
      playerInfo.innerText = "Two-player mode: Player1(" + playerName1 + ") & Player2(" + playerName2 + ")";
    } else {
      myPlane2.style.display = "none";
      // "单人模式：玩家(x)" => "Single-player mode: Player(x)"
      playerInfo.innerText = "Single-player mode: Player(" + playerName1 + ")";
    }

    // ---- 关键：进入界面时立即开始游戏 ----
    gameStatus = true;              // 标记为“进行中”
    document.onmousemove = myPlaneMove; // 开启鼠标移动事件
    pauseTip.style.display = "none";    // 确保暂停提示隐藏
  }

  // 9. 按空格键，切换开始 / 暂停
  document.onkeyup = function(evt) {
    var e = evt || window.event;
    var keyVal = e.keyCode;
    
    // 空格键：keyCode === 32
    if (keyVal === 32) {
      // 如果当前是进行中，就暂停；若是暂停，就继续
      if (gameStatus) {
        // 游戏“进行中” → 切换为暂停
        gameStatus = false;
        document.onmousemove = null;   // 取消红色飞机鼠标移动
        pauseTip.style.display = "block";  // 显示“Press SPACE to Resume”
      } else {
        // 游戏“暂停” → 切换为进行中
        gameStatus = true;
        document.onmousemove = myPlaneMove; // 继续鼠标移动
        pauseTip.style.display = "none";    // 隐藏提示
      }
    }
  };

  // 10. 为第二架飞机(WASD)添加键盘监听（只有在双人模式且进行中时才移动）
  document.onkeydown = function(e) {
    if (!gameStatus || !isDouble) return; // 暂停或单人模式下，不移动

    var step = 10;  // 每次移动步长
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
        return; // 不是WASD，忽略
    }
    
    // 边界限制
    if (plane2X < 0) plane2X = 0;
    if (plane2X > gameW - myPlane2W) plane2X = gameW - myPlane2W;
    if (plane2Y < 0) plane2Y = 0;
    if (plane2Y > gameH - myPlane2H) plane2Y = gameH - myPlane2H;

    // 更新蓝色飞机位置
    myPlane2.style.left = plane2X + "px";
    myPlane2.style.top  = plane2Y + "px";
  };

  // 11. 第一架飞机移动函数（鼠标移动事件）
  function myPlaneMove(evt) {
    var e = evt || window.event;
    // 获取鼠标位置
    var mouse_x = e.x || e.pageX;
    var mouse_y = e.y || e.pageY;

    // 计算飞机应在的位置（让鼠标在飞机中心）
    var last_myPlane_left = mouse_x - gameML - myPlaneW / 2;
    var last_myPlane_top  = mouse_y - gameMT - myPlaneH / 2;

    // 边界限制
    if (last_myPlane_left < 0) {
      last_myPlane_left = 0;
    } else if (last_myPlane_left > gameW - myPlaneW) {
      last_myPlane_left = gameW - myPlaneW;
    }
    if (last_myPlane_top < 0) {
      last_myPlane_top = 0;
    } else if (last_myPlane_top > gameH - myPlaneH) {
      last_myPlane_top = gameH - myPlaneH;
    }

    // 更新DOM，让红色飞机移动
    myPlane.style.left = last_myPlane_left + "px";
    myPlane.style.top  = last_myPlane_top + "px";
  }
};
// 导出函数以供测试使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    $,
    getStyle,
  };
}
