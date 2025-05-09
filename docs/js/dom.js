// ========== Get and set main DOM elements to global object ==========

// Main game container
window.game         = $("game");
// Various UI screens: homepage, ranking, mode selection, name input, game interface
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
window.enterName3   = $("enterName3");
window.gameEnter    = $("gameEnter");
window.roundPopup   = $("roundPopup");
window.marketPage1  = $("marketPage");

// Player aircraft, bullets, enemies and enemy bullets containers
window.myPlane      = $("myPlane");
window.myPlane2     = $("myPlane2");
window.bulletsP     = $("bullets");
window.enemysP      = $("enemys");
window.enemyBulletsP= $("enemyBullets");
// Meteorites container
window.meteorites =$("meteorites");

// UI text elements and notification areas
window.playerInfo   = $("playerInfo");
window.pauseTip     = $("pauseTip");
window.scoreVal     = $("scoreVal");

// Player shields
window.plane1Shield = $("plane1Shield");
window.plane2Shield = $("plane2Shield");

// Input fields and error messages
window.nameInput    = $("nameInput");
window.nameInput2   = $("nameInput2");
window.errMsg1      = $("errMsg1");
window.errMsg2      = $("errMsg2");
window.errMsg3      = $("errMsg3");

// Buff notifications and fog effect containers
window.buffContainer= $("buffContainer");
window.fogContainer = $("fogContainer");

// Calculate actual game area dimensions
window.gameW = getStyle(game, "width");
window.gameH = getStyle(game, "height");

// Get player aircraft dimensions (for collision detection, boundary checks etc.)
window.myPlaneW  = getStyle(myPlane,  "width");
window.myPlaneH  = getStyle(myPlane,  "height");
window.myPlane2W = getStyle(myPlane2, "width");
window.myPlane2H = getStyle(myPlane2, "height");

// Get single mode start elements for left/right hand
window.leftEnter  = $("leftEnter");
window.rightEnter  = $("rightEnter");

// Get shop interface buttons
window.hpPlus = $ ("hpPlus");
window.speedPlus = $ ("speedPlus");
window.damagePlus = $ ("damagePlus");

// Get treasure container
window.treasureContainer = $ ("treasureContainer");