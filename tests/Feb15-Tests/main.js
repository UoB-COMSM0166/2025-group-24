// 简写函数：获取 DOM
function $(idName) {
  return document.getElementById(idName);
}

// 获取元素“最终计算”后的样式数值（去除 px）
function getStyle(ele, attr) {
  var result;
  // 针对老式 IE（IE6~8）才需要 ele.currentStyle
  if (ele.currentStyle) {
    result = ele.currentStyle[attr];
  } else {
    // 现代浏览器走这里
    result = window.getComputedStyle(ele, null)[attr];
  }
  return parseFloat(result);
}

// ★★★★★ 碰撞盒缩放比例设置 ★★★★★
//
// 你可以根据需要调整下列四个缩放值：
// (1) planeScale     - 玩家飞机的碰撞盒大小（若1则不缩放；小于1变小盒）
// (2) bulletScale    - 玩家的子弹碰撞盒大小
// (3) enemyScale     - 敌机的碰撞盒大小
// (4) enemyBulletScale - 敌机子弹碰撞盒大小
//
// 默认示例：玩家飞机 80%，玩家子弹 50%，敌机 90%，敌机子弹 70%
// 可根据实际测试效果微调
const planeScale      = 0.8;
const bulletScale     = 0.5;
const enemyScale      = 0.9;
const enemyBulletScale= 0.7;

window.onload = function(){
  // ========== 主要 DOM ==========

  //游戏界面的元素
  var game       = $("game");
  var homePage   = $("homePage");
  var rankPanel  = $("rankPanel");
  var startBtn   = $("startBtn");
  var rankBtn    = $("rankBtn");
  var backBtn    = $("backBtn");

  //进入游戏的按钮，选择模式
  var singleBtn  = $("singleBtn");
  var doubleBtn  = $("doubleBtn");
  var selectMode = $("selectMode");
  var enterName  = $("enterName");
  var enterName2 = $("enterName2");
  var gameEnter  = $("gameEnter");
  var roundPopup = $("roundPopup");

  //游戏内的元素
  var myPlane    = $("myPlane");
  var myPlane2   = $("myPlane2");
  var bulletsP   = $("bullets");
  var enemysP    = $("enemys");
  var enemyBulletsP = $("enemyBullets");
  var playerInfo = $("playerInfo");
  var pauseTip   = $("pauseTip");
  var scoreVal   = $("scoreVal");

  // 输入框与提示
  var nameInput  = $("nameInput");
  var nameInput2 = $("nameInput2");
  var errMsg1    = $("errMsg1");
  var errMsg2    = $("errMsg2");

  // 游戏区域宽高
  var gameW = getStyle(game, "width");
  var gameH = getStyle(game, "height");

  // 飞机宽高
  var myPlaneW = getStyle(myPlane, "width");
  var myPlaneH = getStyle(myPlane, "height");
  var myPlane2W= getStyle(myPlane2, "width");
  var myPlane2H= getStyle(myPlane2, "height");

  // 状态
  var gameStatus=false;
  var isDouble=false;
  var playerName1="", playerName2="";
  var plane1X=275, plane1Y=400;
  var plane2X=275, plane2Y=400;

var plane1Hp=5, plane2Hp=5;

  // 玩家子弹
  var bullets = [];
  var bulletW = 32, bulletH = 32;

  // 敌机
  var enemys = [];
  var enemyObj = {
    enemy1: {
        width:76
        ,  height:50
        ,  score:100
        ,  hp:100  
        },
    enemy2: { 
        width:151
        ,  height:100
        ,  score:500
        ,  hp:300  
        },
    enemy3: {
        width:151
        , height:100
        , score:1000
        , hp:500  
      }
  };

  // 敌机子弹
  var enemyBullets = [];

  // 分数
  var score = 0;

  // 飞机移动控制
  var p1Up=false
  , p1Down=false
  , p1Left=false
  , p1Right=false;

  var p2Up=false
  , p2Down=false
  , p2Left=false
  , p2Right=false;

  //记录当前回合数
  var currentRound = 1;
  // 定时器
  //1.移动计时器
  var movementTimer=null
  //2.敌人出现计时器
  , enemyTimer=null
  //3.敌人开火计时器
  , enemyFireTimer=null
  //4.背景滚动计时器
  , bgTimer=null;




  //第一步是来写首页开始界面
  // ========== 首页按钮 ==========

  //开始按钮，点开始隐藏，显示selectMOde按钮
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

  //第二步写选择模式界面
  //单人模式按钮
  // ========== 选择模式：单人 / 双人 ==========
  singleBtn.onclick=function(){
    isDouble=false;
    //强制清空输入框
    nameInput.value="";
    nameInput2.value="";
    //错误提示
    errMsg1.innerText="";
    errMsg2.innerText="";
//点了单人按钮，选择界面隐藏，进入输入名字界面
    selectMode.style.display="none";
    enterName.style.display="block";
    $("nameHint").innerText="Please enter your name";
  };

  //双人模式按钮
  doubleBtn.onclick=function(){
    isDouble = true;  // 需要明确标记为双人模式

    nameInput.value="";
    nameInput2.value="";
    //错误提示
    errMsg1.innerText="";
    errMsg2.innerText="";

    selectMode.style.display="none";
    enterName.style.display="block";
    $("nameHint").innerText="Please enter the first player's name";
  };

  // ========== 输入玩家名 ==========

  //第一个名字输入按钮
  nameInput.onkeyup=function(e){
    // 只有当“Enter键”被按下时（keyCode===13）才会执行下一步
    if(e.keyCode===13){
      var val = nameInput.value.trim();
      // 如果输入框是空（.trim() 后长度为0）
      if(!val){
        errMsg1.innerText="Player name cannot be empty!";
      } 
      // 否则（有输入的内容）
      else {
        // 清空错误提示
        errMsg1.innerText="";
  
        // 将输入框的值记录到 playerName1
        playerName1 = val;
  
        // 清空输入框
        nameInput.value="";
  
        // 如果是双人模式
        if(isDouble){
          // 隐藏当前输入界面（enterName）
          enterName.style.display="none";
          // 显示输入第二位玩家名字的界面
          enterName2.style.display="block";
        } else {
          // 如果是单人模式，就直接进入游戏
          enterName.style.display="none";
          showGameEnter(); 
        }
      }
    }
  };


  //第二个名字输入
  nameInput2.onkeyup=function(e){
    // 1. 检测是否按下“Enter”键（keyCode===13）
    if(e.keyCode===13){
      // 2. 从输入框 nameInput2 取出文本，并去掉前后空格
      var val = nameInput2.value.trim();
  
      // 3. 如果输入框是空的，显示错误提示
      if(!val){
        errMsg2.innerText="Player name cannot be empty!";
      } 
      else {
        // 4. 如果有输入内容：
        //    a) 清空错误提示
        //    b) 把输入值赋给 playerName2（用来保存第2位玩家的名字）
        //    c) 将输入框内容清空
        //    d) 隐藏第2个输入界面（enterName2）
        //    e) 调用 showGameEnter() 进入游戏
        errMsg2.innerText="";
        playerName2 = val;
        nameInput2.value="";
        enterName2.style.display="none";
        showGameEnter();
      }
    }
  };









  // 记录当前回合
var currentRound = 1;

// ========== 进入游戏函数（支持 Round Two） ==========
function showGameEnter(){
  gameEnter.style.display = "block"; // 显示游戏界面

  // 判断是否为双人模式
  if (isDouble) {
      myPlane2.style.display = "block"; // 显示玩家2的飞机
      playerInfo.innerText = "Two-player mode: P1(" + playerName1 + ") & P2(" + playerName2 + ")";
  } else {
      myPlane2.style.display = "none"; // 隐藏玩家2的飞机
      playerInfo.innerText = "Single-player mode: Player(" + playerName1 + ")";
  }

  // 设定玩家1的初始位置
  plane1X = 200; 
  plane1Y = 400;
  myPlane.style.left = plane1X + "px";
  myPlane.style.top  = plane1Y + "px";
  myPlane.style.display = "block"; // 确保飞机可见

  // 设定玩家2的初始位置（双人模式）
  plane2X = 400;
  plane2Y = 400;
  myPlane2.style.left = plane2X + "px";
  myPlane2.style.top  = plane2Y + "px";

  // 判断当前回合
  if (currentRound === 1) {
      roundPopup.innerText = "ROUND ONE";
  } else if (currentRound === 2) {
      roundPopup.innerText = "ROUND TWO";
  }

  // 显示回合信息，并在 2 秒后隐藏
  roundPopup.style.display = "block";
  mySetTimeout(function(){
      roundPopup.style.display = "none";
  }, 2000);

  // 游戏状态设为 "运行中"
  gameStatus = true;
  pauseTip.style.display = "none"; // 隐藏暂停提示

  // **重置分数**
  score = 0;
  scoreVal.innerHTML = score; // 更新分数显示

  // **提升 Round Two 难度**
  if (currentRound === 2) {
      enemyObj.enemy1.hp = 200; // 小型敌机血量翻倍
      enemyObj.enemy2.hp = 600; // 中型敌机血量提升
      enemyObj.enemy3.hp = 1000; // 大型敌机血量更高

      roundPopup.style.display = "block";
      mySetTimeout(function(){
      roundPopup.style.display = "none";
  }, 2000);
  }

  // 启动游戏逻辑
  startMovement();   
  startEnemySpawn(); 
  startEnemyFire();  
  bgMove();          
}

// ========== 监听分数，进入 Round Two ==========
function checkRoundTwo() {
  if (currentRound === 1 && score >= 100) { // 当 Round One 结束后
      alert("Round Two Begins!");
      currentRound = 2; // 进入 Round Two
      resetGameForNextRound(); // 重置游戏状态并进入 Round Two
  }
}

// ========== 每次得分后检查是否进入下一轮 ==========
function killEnemy(e){
  myClearInterval(e.timer);
  e.src = "image/bz.gif";
  mySetTimeout(function(){
    if(e.parentNode){
      enemysP.removeChild(e);
      var idx = enemys.indexOf(e);
      if(idx !== -1) enemys.splice(idx,1);
    }
  }, 500);
  
  score += e.score;
  scoreVal.innerHTML = score;

  // **检查是否进入 Round Two**
  checkRoundTwo();
}

// ========== 进入下一轮时重置游戏 ==========
function resetGameForNextRound(){
  myClearInterval(movementTimer);
  myClearInterval(enemyTimer); 
  myClearInterval(enemyFireTimer); 
  myClearInterval(bgTimer);
  
  movementTimer = null;
  enemyTimer = null;
  enemyFireTimer = null;
  bgTimer = null;
  
  gameStatus = false;

  // **清空屏幕上的所有敌机、子弹**
  bullets.forEach(b => {
      myClearInterval(b.timer);
      if (b.parentNode) b.parentNode.removeChild(b);
  });
  bullets = [];

  enemys.forEach(e => {
      myClearInterval(e.timer);
      if (e.parentNode) e.parentNode.removeChild(e);
  });
  enemys = [];

  enemyBullets.forEach(b => {
      myClearInterval(b.timer);
      if (b.parentNode) b.parentNode.removeChild(b);
  });
  enemyBullets = [];

  // **重新进入游戏**
  showGameEnter();
}



 // ========== 监听键盘按下事件 ==========  
document.onkeydown = function (e) {
  // 如果游戏未启动，则不执行任何操作
  if (!gameStatus) 
    return;

  // 获取按下的键，并转为小写（避免大小写问题）
  var key = e.key.toLowerCase();

  // 玩家 1 (WASD 控制移动, F 发射子弹)
  switch (key) {
      case 'w': p1Up = true; break;   // W - 向上
      case 's': p1Down = true; break; // S - 向下
      case 'a': p1Left = true; break; // A - 向左
      case 'd': p1Right = true; break;// D - 向右
      case 'f': 
          createBulletForPlane(myPlane, plane1X, plane1Y, myPlaneW, myPlaneH); 
          break; // F - 发射子弹
  }

  // **如果是单人模式，不执行后续代码**
  if (!isDouble) return;

  // 玩家 2 (方向键控制移动, L 发射子弹)
  switch (e.key) {
      case 'ArrowUp':    p2Up = true; break;    // ↑ - 向上
      case 'ArrowDown':  p2Down = true; break;  // ↓ - 向下
      case 'ArrowLeft':  p2Left = true; break;  // ← - 向左
      case 'ArrowRight': p2Right = true; break; // → - 向右
      case 'l':
      case 'L':
          createBulletForPlane(myPlane2, plane2X, plane2Y, myPlane2W, myPlane2H); 
          break; // L - 发射子弹
  }
};


//按空格暂停
//1.游戏进行中-》暂停
//  游戏状态转为false
//  暂停提示出现
//  暂停（子弹敌机敌机子弹元素）
//  暂停背景滚动，子弹生成
//  清空背景变量
document.onkeyup = function (e) {
  if (e.keyCode === 32) { // 监听空格键（keyCode 32）
      if (gameStatus) { 
          // 当前游戏正在运行 → 进入暂停
          gameStatus = false;
          pauseTip.style.display = "block"; // 显示 "暂停" 提示

          // 暂停所有元素（子弹、敌机、敌机子弹）
          pauseAllBullets();
          pauseAllEnemies();
  
          // 暂停背景滚动 
          // 敌机子弹生成
          myClearInterval(bgTimer); 
          myClearInterval(enemyFireTimer);

          //清空变量
          bgTimer = null;
          enemyFireTimer = null;
      } else { 
          // 当前游戏暂停 → 继续游戏
          gameStatus = true;
          pauseTip.style.display = "none"; // 隐藏 "暂停" 提示

          // 恢复所有元素（子弹、敌机、敌机子弹）
          resumeAllBullets();
          resumeAllEnemies();
          resumeAllEnemyBullets();

          // 重新开始背景滚动 & 敌机子弹生成
          bgMove();
          startEnemyFire();
      }
      return; // 直接返回，防止继续执行下面的代码
  }

  // ========== 松开键盘键，停止移动 ==========
  switch (e.key.toLowerCase()) {
      case 'w': p1Up = false; break;   // 停止上移
      case 's': p1Down = false; break; // 停止下移
      case 'a': p1Left = false; break; // 停止左移
      case 'd': p1Right = false; break;// 停止右移
  }

  // 如果是双人模式，监听第二个玩家的方向键
  if (isDouble) {
      switch (e.key) {
          case 'ArrowUp': p2Up = false; break;    // 停止P2上移
          case 'ArrowDown': p2Down = false; break;// 停止P2下移
          case 'ArrowLeft': p2Left = false; break;// 停止P2左移
          case 'ArrowRight': p2Right = false; break;// 停止P2右移
      }
  }
};

function startMovement() {
  if (movementTimer) 
  return; // 避免重复启动定时器

  //1.设置移动定时器
  movementTimer = mySetInterval(function () {
      if (!gameStatus) return; // 游戏暂停时，不执行移动逻辑
      var step = 10; // 每次移动的步长（速度）

      // ========== 玩家 1 (P1) 移动 ==========
      if (p1Up)    plane1Y -= step; // 上
      if (p1Down)  plane1Y += step; // 下
      if (p1Left)  plane1X -= step; // 左
      if (p1Right) plane1X += step; // 右

      // 限制飞机不能超出游戏边界
      if (plane1X < 0) {
        plane1X = 0;
      }
      if (plane1X > gameW - myPlaneW){
        plane1X = gameW - myPlaneW;
      }
      if (plane1Y < 0){
        plane1Y = 0;
      }
      if (plane1Y > gameH - myPlaneH){
       plane1Y = gameH - myPlaneH;
      }

      // 更新 P1 飞机位置
      myPlane.style.left = plane1X + "px";
      myPlane.style.top  = plane1Y + "px";

      // ========== 玩家 2 (P2) 移动 ==========
      if (isDouble) { // 双人模式才执行
          if (p2Up)    plane2Y -= step; // 上
          if (p2Down)  plane2Y += step; // 下
          if (p2Left)  plane2X -= step; // 左
          if (p2Right) plane2X += step; // 右

          // 限制 P2 飞机不能超出游戏边界
          if (plane2X < 0){
            plane2X = 0;
          }
          if (plane2X > gameW - myPlane2W){
            plane2X = gameW - myPlane2W;
          }
          if (plane2Y < 0){ 
            plane2Y = 0;
          }
          if (plane2Y > gameH - myPlane2H) {
            plane2Y = gameH - myPlane2H;
          }
          // 更新 P2 飞机位置
          myPlane2.style.left = plane2X + "px";
          myPlane2.style.top  = plane2Y + "px";
      }
  }, 30); // 每 30 毫秒更新一次
}



  // ========== 背景滚动 ==========
  //2.设置背景定时器
  var bgPosY = 0; // 背景 Y 轴偏移量（初始为 0）

function bgMove() {
    if (bgTimer) return; // 避免重复启动定时器
  //设置背景定时器
      bgTimer = mySetInterval(function () {
        if (!gameStatus) return; // 如果游戏暂停，则不执行滚动
        bgPosY += 2; // 背景向下移动 2 像素
        if (bgPosY >= gameH) bgPosY = 0; // 当背景滚动到底部时，重置位置

        game.style.backgroundPositionY = bgPosY + "px"; // 更新背景位置
    }, 30); // 每 30 毫秒更新一次
}

  // ========== 玩家子弹 ==========
  function createBulletForPlane(ele, x, y, w, h) {
    if (!gameStatus) return;
    var b = document.createElement("div");  // 创建一个新的 div 作为子弹
    b.className = "b";  // 给子弹设置 CSS 样式类

    var bulletL = x + w / 2 - bulletW / 2; // 计算子弹的 X 坐标（居中对齐飞机）
    var bulletT = y - bulletH; // 计算子弹的 Y 坐标（子弹从飞机顶部出现）

    b.style.left = bulletL + "px"; // 设置子弹的水平位置
    b.style.top = bulletT + "px";  // 设置子弹的垂直位置

    bulletsP.appendChild(b);  // 将子弹添加到 `bulletsP` 容器
    bullets.push(b);  // 将子弹对象存入 `bullets` 数组，方便后续操作，（每个子弹都有定时器）

    moveBullet(b);  // 调用 `moveBullet()` 让子弹移动
}

function moveBullet(b) {
  var speed = -15;  // 子弹的速度，每次向上移动 15 像素

  // 启动定时器，让子弹不断向上移动
  //3.设置子弹移动定时器
  b.timer = mySetInterval(function () {
      if (!gameStatus) 
        return;  // 如果游戏暂停，则不执行移动
      var topVal = getStyle(b, "top"); // 获取子弹当前的 top 值（子弹的 Y 坐标）

      if (topVal <= -bulletH) {  // 如果子弹超出屏幕
          myClearInterval(b.timer);  // 停止子弹的移动
          //检查子弹是否仍然存在于 bulletsP 容器中。
          if (b.parentNode) {
            //将子弹从 DOM 结构中删除，让它彻底消失。
          b.parentNode.removeChild(b); 
           } // 移除子弹 DOM
          var idx = bullets.indexOf(b);  // 在 bullets 数组中查找子弹的索引
          if (idx !== -1) {
            bullets.splice(idx, 1);
          }  // 从数组中删除第一个子弹，即数组中第一个子弹必定是先出界面的子弹
      } else {
          b.style.top = (topVal + speed) + "px";  // 让子弹向上移动 speed 像素
      }
  }, 30);
}

  /**
 * 暂停所有玩家子弹的移动
 * 通过清除 `mySetInterval` 使子弹停止移动
 */
function pauseAllBullets() {
  for (var i = 0; i < bullets.length; i++) {
      myClearInterval(bullets[i].timer); // 停止当前子弹的移动定时器
      bullets[i].timer = null; // 将 `timer` 设为 `null`，标记子弹已暂停
  }
}

/**
* 重新恢复所有玩家子弹的移动
* 重新调用 `moveBullet()` 让子弹恢复运动
*/
function resumeAllBullets() {
  for (var i = 0; i < bullets.length; i++) {
      if (!bullets[i].timer) { // 确保不会重复启动 `mySetInterval`
          moveBullet(bullets[i]); // 重新启动子弹的移动
      }
  }
}



  /**
 * 开始生成敌机
 * 使用 `mySetInterval` 每秒生成一个敌机
 */
function startEnemySpawn() {
  //敌人定时器
  if (enemyTimer) 
    return; // 防止重复启动定时器
  enemyTimer = mySetInterval(function () {
      createEnemy(); // 调用敌机创建函数
  }, 1800); // 每 1.8 秒创建一架敌机
}


//制造敌机的函数
function createEnemy(){
  //敌机出现概率的数据
  //一共有20个，每一个敌机出现的概率为5%，
  //所以5%乘以各自的数量就可以得出各自的概率
    var percentData = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3];
    var enemyType = percentData[Math.floor(Math.random()*percentData.length)];
  //percentData[索引]：含义是随机取出数组中一个数
  //Math.floor（）:是向下取整
  //Math.random() ：是随机生成0-1之间的小数
  //percentData.length:是数组长度
  //Math.random*percentData.length:则是生成0-20，之间的一个数，再通过Math.floor向下取整
    var enemyData = enemyObj["enemy"+enemyType];
    //这里的意思是字符串拼接，enemy1或enemy2


  //创建敌机所在的元素（这里的enemy是创建的元素，所以之后还得添加到html里面，父元素）
    var enemy = new Image(enemyData.width,enemyData.height) 
  //这里的意思是创建一个新的html图片元素，
  //等价于：
  // var enemy = document.createElement("img");这里“img”是指的是html里面的标签
  // enemy.width = enemyData.width;
  // enemy.height = enemyData.height;
  enemy.src = "image/enemy"+enemyType+".png";
  //这是写一个相对路径，告诉系统图片的来源是image/enemy1.png目录
  //只要目录和这个能对得上就能加载图片
  enemy.t = enemyType;
  //这里是把enemyData（咱们自己定的数据）赋值给enemy
  //首先是敌机的得分和血量
  enemy.score = enemyData.score;
  enemy.hp = enemyData.hp;
//现在css上创一个类名为e的，然后使用JS修改就可以
  enemy.className ="e";

  enemy.dead= false;//标记敌机存活

  //然后是敌机出现位置（随机）
  var enemyL = Math.floor(Math.random()*(gameW-enemyData.width+1))
  //这个gameW是游戏界面的宽度，然后敌机出现的像素范围是在游戏界面减去小飞机本身的宽度这个像素范围之间的
  //又因为又可能有0所以就加了个1
  , enemyT = -enemyData.height;
  //这个飞机一开始是在上面，负像素的位置下降的
  enemy.style.left = enemyL+"px";
  enemy.style.top = enemyT+"px";
  enemysP.appendChild(enemy);
  enemys.push(enemy); //  把创建的每一架子弹和每一架敌机都放入集合当中
  moveEnemy(enemy);
}
/**
* 让敌机沿着 y 轴向下移动
*/
function moveEnemy(e) {
  var speed; // 速度变量

  // 根据敌机类型设定速度（小型机快，大型机慢）
  if (e.t === 1) {
      speed = 5; // 小型机速度快
  } else if (e.t === 2) {
      speed = 3; // 中型机速度中等
  } else {
      speed = 1.5; // 大型机速度最慢
  }

  // 给当前敌机绑定定时器，使其不断向下移动
  //4.敌机移动定时器

  e.timer = mySetInterval(function () {
      if (!gameStatus) return; // 如果游戏暂停，停止移动

      var topVal = getStyle(e, "top"); // 获取敌机当前 y 轴坐标

      // 如果敌机超出游戏区域，移除它
      if (topVal >= gameH) {
          myClearInterval(e.timer); // 清除当前敌机的移动定时器
          if (e.parentNode) {
            e.parentNode.removeChild(e);
          } // 从 DOM 中移除
          var idx = enemys.indexOf(e); // 在数组中查找敌机
          if (idx !== -1) enemys.splice(idx, 1); // 从数组中移除
      } else {
          e.style.top = (topVal + speed) + "px"; // 让敌机向下移动 speed 个像素
          checkCollisionWithBullets(e); // 检测子弹与敌机的碰撞
          checkCollisionWithPlanes(e); // 检测玩家飞机与敌机的碰撞
      }
  }, 30); // 每 30ms 移动一次
}

/**
* 暂停所有敌机
* 清除所有敌机的 `mySetInterval` 定时器，使其停止移动
*/
function pauseAllEnemies() {
  myClearInterval(enemyTimer); // 停止新的敌机生成
  enemyTimer = null; // 置空计时器

  // 遍历所有敌机，清除它们的移动定时器
  for (var i = 0; i < enemys.length; i++) {
      myClearInterval(enemys[i].timer);
      enemys[i].timer = null; // 标记敌机已暂停
  }
}

/**
* 继续让敌机移动
* 重新开启敌机生成，并恢复所有敌机的移动
*/
function resumeAllEnemies() {
  startEnemySpawn(); // 重新启动敌机生成

  // 遍历所有敌机，重新启动它们的移动
  for (var i = 0; i < enemys.length; i++) {
      moveEnemy(enemys[i]); // 重新调用移动函数
  }
}
function resumeAllEnemyBullets() {
  for (var i = 0; i < enemyBullets.length; i++) {
      if (!enemyBullets[i].timer) { // 确保不会重复启动定时器
          moveEnemyBullet(enemyBullets[i]); // 重新调用子弹移动函数
      }
  }
}




  // ========== ★ 碰撞检测函数（缩小碰撞盒） ==========

  /*
    collide(bL,bT,bW,bH, pL,pT,pW,pH, scaleB, scaleP)

    - (bL,bT,bW,bH): 子弹/物体1 的 left, top, width, height
    - (pL,pT,pW,pH): 飞机/物体2 的 left, top, width, height
    - scaleB, scaleP: 物体1和物体2的碰撞盒缩放比例(0~1 之间)
  */
  function collide(bL,bT,bW,bH, pL,pT,pW,pH, scaleB, scaleP){
    // 缩放后宽高
    var bW2 = bW * scaleB;
    var bH2 = bH * scaleB;
    var pW2 = pW * scaleP;
    var pH2 = pH * scaleP;

    // 假设均居中缩放 => 计算新 left, top
    var bLeft   = bL + (bW - bW2)/2;
    var bTop    = bT + (bH - bH2)/2;
    var bRight  = bLeft + bW2;
    var bBottom = bTop  + bH2;

    var pLeft   = pL + (pW - pW2)/2;
    var pTop    = pT + (pH - pH2)/2;
    var pRight  = pLeft + pW2;
    var pBottom = pTop  + pH2;

    return (
      bRight  >= pLeft  &&
      bLeft   <= pRight &&
      bBottom >= pTop   &&
      bTop    <= pBottom
    );
  }

  // ========== 子弹 vs 敌机 ==========

  // ========== 子弹 vs 敌机（玩家子弹击中敌机） ==========

function checkCollisionWithBullets(e){
  // 遍历所有玩家子弹
  for(var i=0; i<bullets.length; i++){
    var b = bullets[i];

    // 获取子弹的左上角坐标和宽高
    var bL = getStyle(b, "left")
    , bT = getStyle(b, "top");
    var bW = getStyle(b, "width")
    , bH = getStyle(b, "height");

    // 获取敌机的左上角坐标和宽高
    var eL = getStyle(e, "left"), eT = getStyle(e, "top");
    var eW = getStyle(e, "width"), eH = getStyle(e, "height");

    // 使用碰撞检测函数 `collide` 判断是否相撞
    if(collide(bL, bT, bW, bH, eL, eT, eW, eH, bulletScale, enemyScale)){
      // ★ 如果子弹击中了敌机：

      // 1. 清除子弹的移动定时器，防止子弹继续运动
      myClearInterval(b.timer);
      
      // 2. 从 HTML 页面中移除子弹
      if(b.parentNode) b.parentNode.removeChild(b);
      
      // 3. 从数组 `bullets` 中删除该子弹
      bullets.splice(i,1);

      // 4. 敌机扣血（每次子弹击中扣100血）
      e.hp -= 100;
      
      // 5. 如果敌机血量降为 0，销毁该敌机
      if(e.hp <= 0){
        killEnemy(e);
      }

      // 6. 跳出循环（防止一个子弹重复检测多个敌机）
      break;
    }
  }
}

// ========== 销毁敌机（爆炸动画） ==========

function killEnemy(e){
  // 1. 清除敌机的移动定时器
  myClearInterval(e.timer);

  // 2. 切换敌机的图片为爆炸动画
  e.src = "image/bz.gif";

  // 3. 500 毫秒后移除敌机
  mySetTimeout(function(){
    if(e.parentNode){
      enemysP.removeChild(e); // 从页面中移除敌机

      // 4. 从 `enemys` 数组中删除该敌机
      var idx = enemys.indexOf(e);
      if(idx !== -1) enemys.splice(idx,1);
    }
  }, 500); // 500ms 后执行

  // 5. 增加玩家分数
  score += e.score;
  scoreVal.innerHTML = score; // 更新分数显示
}

// ========== 敌机 vs 玩家飞机（碰撞检测） ==========

function checkCollisionWithPlanes(e){
  // 获取敌机的左上角坐标和宽高
  var eL = getStyle(e, "left"), eT = getStyle(e, "top");
  var eW = getStyle(e, "width"), eH = getStyle(e, "height");

  // P1（玩家1的飞机）
  if(collide(eL, eT, eW, eH, plane1X, plane1Y, myPlaneW, myPlaneH, enemyScale, planeScale)){
    shakeWindow(300,8);
    --plane1Hp;
    if(plane1Hp==0){doGameOver(); // 游戏结束
  }
}

  // P2（玩家2的飞机）
  if(isDouble){
    if(collide(eL, eT, eW, eH, plane2X, plane2Y, myPlane2W, myPlane2H, enemyScale, planeScale)){
      shakeWindow(300,8);
      --plane2Hp;
      if(plane2Hp==0){doGameOver(); // 游戏结束
      }
  }}
}
//=====窗口抖动函数======
function shakeWindow(duration = 500, intensity = 10) {
  const body = document.body;
  const originalPosition = window.getComputedStyle(body).position;

  // 确保 body 的定位方式允许偏移
  if (originalPosition === 'static') {
      body.style.position = 'relative';
  }

  const startTime = Date.now();

  function shake() {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
          // 随机生成偏移量
          const x = (Math.random() - 0.5) * 2 * intensity;
          const y = (Math.random() - 0.5) * 2 * intensity;

          // 应用偏移
          body.style.transform = `translate(${x}px, ${y}px)`;

          // 继续下一帧抖动
          requestAnimationFrame(shake);
      } else {
          // 抖动结束，恢复原状
          body.style.transform = 'translate(0, 0)';
          if (originalPosition === 'static') {
              body.style.position = originalPosition;
          }
      }
  }

  // 开始抖动
  requestAnimationFrame(shake);
}


// ========== 敌机子弹 vs 玩家飞机 ==========

function startEnemyFire(){
  if(enemyFireTimer) 
    return; // 避免重复启动
  enemyFireTimer = mySetInterval(function(){
    if(!gameStatus) return; // 如果游戏暂停，不执行子弹生成
    for(var i=0; i<enemys.length; i++){
      createEnemyBullet(enemys[i]); // 每个敌机发射一颗子弹
    }
  }, 1500); // 每 1.5 秒所有敌机发射一次子弹
}

// ========== 生成敌机子弹 ==========

function createEnemyBullet(enemy){
  // 1. 如果敌机已经被销毁，则不生成子弹
  if(!enemy || !enemy.parentNode) return;

  // 2. 获取敌机的左上角坐标和宽高
  var eL = getStyle(enemy, "left")
  , eT = getStyle(enemy, "top");
  var eW = getStyle(enemy, "width")
  , eH = getStyle(enemy, "height");

  // 3. 创建子弹 DOM 元素
  var bullet = document.createElement("div");
  bullet.className = "enemy-bullet"; // 绑定 CSS 样式

  // 4. 计算子弹初始位置（从敌机正中央发射）
  var bulletW = 16, bulletH = 16;
  var bulletL = eL + eW / 2 - bulletW / 2;
  var bulletT = eT + eH;

  // 5. 设置子弹的初始坐标
  bullet.style.left = bulletL + "px";
  bullet.style.top = bulletT + "px";

  // 6. 把子弹添加到 `enemyBulletsP` 容器中
  enemyBulletsP.appendChild(bullet);
  enemyBullets.push(bullet);

  // 7. 让子弹开始移动
  moveEnemyBullet(bullet);
}

// ========== 移动敌机子弹 ==========

function moveEnemyBullet(b){
  var speed = 10; // 敌机子弹的速度

  // 设置子弹的定时器
  b.timer = mySetInterval(function(){
    if(!gameStatus) return; // 如果游戏暂停，不移动子弹
    var topVal = getStyle(b, "top");

    // 如果子弹超出游戏区域，则移除
    if(topVal >= gameH){
      removeEnemyBullet(b);
    } else {
      b.style.top = (topVal + speed) + "px";
      checkBulletHitPlayer(b); // 检测是否击中玩家
    }
  }, 30);
}

// ========== 敌机子弹 vs 玩家飞机（碰撞检测） ==========
function checkBulletHitPlayer(b){
  // 获取子弹的左上角坐标和宽高
  var bL = getStyle(b, "left")
  , bT = getStyle(b, "top");
  var bW = getStyle(b, "width")
  , bH = getStyle(b, "height");

  // 检测 P1（玩家1）
  if(collide(bL, bT, bW, bH, plane1X, plane1Y, myPlaneW, myPlaneH, enemyBulletScale, planeScale)){
    shakeWindow(300,8);
    plane1Hp--;
    removeEnemyBullet(b);
    if(plane1Hp==0){
    doGameOver();
    removeEnemyBullet(b);
    return;
  }
}
// 检测 P1（玩家1）

  // 检测 P2（玩家2）
  if(isDouble){
    if(collide(bL, bT, bW, bH, plane2X, plane2Y, myPlane2W, myPlane2H, enemyBulletScale, planeScale)){
      shakeWindow(300,8);
      plane2Hp--;
      removeEnemyBullet(b);
      if(plane2Hp==0){
      doGameOver();
      removeEnemyBullet(b);
      return;
    }
    }
  }
}

// ========== 移除敌机子弹 ==========

function removeEnemyBullet(b){
  myClearInterval(b.timer);
  if(b.parentNode) {
    b.parentNode.removeChild(b);
  }
  var idx = enemyBullets.indexOf(b);
  if(idx !== -1) {
    enemyBullets.splice(idx, 1);
  }
}




// ========== 游戏结束（清理所有游戏元素） ==========

function doGameOver(){
  myClearInterval(movementTimer); movementTimer = null;
  myClearInterval(enemyTimer); enemyTimer = null;
  myClearInterval(enemyFireTimer); enemyFireTimer = null;
  myClearInterval(bgTimer); bgTimer = null;
  gameStatus = false;

  plane1Hp=5;plane2Hp=5;
  
  enemysP.innerHTML = "";
  bulletsP.innerHTML = "";
  enemyBulletsP.innerHTML = "";
// **让玩家飞机消失**
myPlane.style.display = "none";
myPlane2.style.display = "none";
//禁用键盘
//document.onkeydown = null;
//document.onkeyup = null;

  alert("Game Over! Final Score: " + score);

  homePage.style.display = "block";
  gameEnter.style.display = "none";
}
}
