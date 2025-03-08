
window.planeScale       = 0.8;
window.bulletScale      = 0.5;
window.enemyScale       = 0.9;
window.enemyBulletScale = 0.7;


/** 
 * 在这里，把“part2.js”需要用到的变量都“挂到全局 (window 上)”
 * 包括游戏状态、DOM 元素、坐标、定时器引用等
 */
window.gameStatus = false;
window.isDouble   = false;

// 玩家位置 & 血量
window.plane1X    = 275;  
window.plane1Y    = 400;
window.plane2X    = 275;  
window.plane2Y    = 400;
window.plane1Hp   = 5;    
window.plane2Hp   = 5;

// 玩家移动控制
window.p1Up=false;
window.p1Down=false;
window.p1Left=false;
window.p1Right=false;

window.p2Up=false;
window.p2Down=false;
window.p2Left=false;
window.p2Right=false;


// 玩家子弹数组 / 敌机数组 / 敌机子弹数组/陨石数组
window.bullets      = [];
window.enemys       = [];
window.enemyBullets = [];
window.meteoriteArray = [];

// 记录当前回合数
window.currentRound = 1;
window.maxRound     = 5;

// 记录分数
window.score = 0;

/** 
 * 飞机移动速度 (可能被 Buff 改变)
 */
window.player1SpeedFactor=1.0;
window.player2SpeedFactor=1.0;

//我方子弹射速因子
window.bulletSpeedFactor = 1.0;

//// 敌机伤害因子：越高则敌机对玩家造成更多伤害
window.enemyDamageFactor = 1.0;
window.enemyBulletFactor = 1.0;

//敌方速度因子
window.enemySpeedFactor = 1.0;


//陨石速度因子
window.meteoriteSpeedFactor=1.0;

/** 定时器引用 */
window.movementTimer   = null;
window.enemyTimer      = null;
window.enemyFireTimer  = null;
window.bgTimer         = null;
window.meteoriteTimer =null;


/** 玩家飞机宽高 (在 onload 中赋值) */
window.myPlaneW=0;
window.myPlaneH=0;
window.myPlane2W=0;
window.myPlane2H=0;

/** 子弹宽高 */
window.bulletW=32;
window.bulletH=32;

/** DOM 变量（在 onload 里赋值），以及护盾状态 */
window.plane1ShieldActive=false;
window.plane2ShieldActive=false;
window.SHIELD_DURATION=5000; // 护盾持续时间

// 敌机数据
window.enemyObj = {
  enemy1: { width:32,  height:32,  score:100,  hp:100 },
  enemy2: { width:60, height:60, score:500,  hp:300 },
  enemy3: { width:90, height:90, score:1000, hp:500 }
};

//陨石数据
window.meteoriteObj = {
  meteorite1: { score: 100, hp: 100, width: 35, height: 35 },
  meteorite2: { score: 500, hp: 200, width: 67, height: 75 },
  meteorite3: { score: 1000, hp: 300, width: 90, height: 90 }
};


//判断左右手模式
window.leftModel = false;
window.rightModel = false;