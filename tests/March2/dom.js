// ========== 获取并设置主要 DOM 元素到全局对象 ==========

// 游戏主容器
window.game         = $("game");
// 首页、排行榜、模式选择、输入姓名、游戏界面等
window.homePage     = $("homePage");
window.rankPanel    = $("rankPanel");
window.startBtn     = $("startBtn");
window.rankBtn      = $("rankBtn");
window.backBtn      = $("backBtn");
window.singleBtn    = $("singleBtn");
window.doubleBtn    = $("doubleBtn");
window.selectMode   = $("selectMode");
window.enterName    = $("enterName");
window.enterName2   = $("enterName2");
window.gameEnter    = $("gameEnter");
window.roundPopup   = $("roundPopup");
window.marketPage1  = $("marketPage");

// 玩家飞机及子弹、敌机、敌机子弹等容器
window.myPlane      = $("myPlane");
window.myPlane2     = $("myPlane2");
window.bulletsP     = $("bullets");
window.enemysP      = $("enemys");
window.enemyBulletsP= $("enemyBullets");

// 界面上的一些文本和提示区
window.playerInfo   = $("playerInfo");
window.pauseTip     = $("pauseTip");
window.scoreVal     = $("scoreVal");

// 玩家护盾
window.plane1Shield = $("plane1Shield");
window.plane2Shield = $("plane2Shield");

// 输入框及错误提示
window.nameInput    = $("nameInput");
window.nameInput2   = $("nameInput2");
window.errMsg1      = $("errMsg1");
window.errMsg2      = $("errMsg2");

// Buff 提示与迷雾容器
window.buffContainer= $("buffContainer");
window.fogContainer = $("fogContainer");

// 计算游戏区域的实际宽高
window.gameW = getStyle(game, "width");
window.gameH = getStyle(game, "height");

// 获取玩家飞机的宽高（用于碰撞检测、边界判断等）
window.myPlaneW  = getStyle(myPlane,  "width");
window.myPlaneH  = getStyle(myPlane,  "height");
window.myPlane2W = getStyle(myPlane2, "width");
window.myPlane2H = getStyle(myPlane2, "height");

// 获取单人模式中左右手的start元素
window.leftEnter  = $("leftEnter");
window.rightEnter  = $("rightEnter");

//获取单人介绍页面
window.singleIntro = $("singleIntro");


//获取购买界面按钮
window.hpPlus = $ ("hpPlus");
window.speedPlus = $ ("speedPlus");
window.damagePlus = $ ("damagePlus");

//获取treasure
window.treasureContainer = $ ("treasureContainer");