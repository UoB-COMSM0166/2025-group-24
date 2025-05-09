
window.planeScale       = 0.8;
window.bulletScale      = 0.5;
window.enemyScale       = 0.9;
window.enemyBulletScale = 0.7;


/** 
 * Here, attach all variables needed by "part2.js" to the global (window) object,
 * including game state, DOM elements, coordinates, timer references, etc.
 */
window.gameStatus = false;
window.isDouble   = false;
window.HaveEnteredGame   = false;

// Player positions & health
window.plane1X    = 275;  
window.plane1Y    = 400;
window.plane2X    = 275;  
window.plane2Y    = 400;

window.plane1Hp   = 5;    
window.plane2Hp   = 5;
// Added in globalVar.js
window.totalHp = 5; // Shared total health in two-player mode

// Player movement controls
window.p1Up=false;
window.p1Down=false;
window.p1Left=false;
window.p1Right=false;

window.p2Up=false;
window.p2Down=false;
window.p2Left=false;
window.p2Right=false;


// Player bullets / enemy array / enemy bullets / meteorite array
window.bullets      = [];
window.enemys       = [];
window.enemyBullets = [];
window.meteoriteArray = [];
window.treasures = [];
// Track current round
window.currentRound = 1;
window.maxRound     = 3;

// Track score
window.score = 0;

/** 
 * Plane movement speed (can be modified by Buffs)
 */
window.player1SpeedFactor=1.0;
window.player2SpeedFactor=1.0;

// Player bullet speed factor
window.bulletSpeedFactor = 1.0;

// Enemy damage factors: higher means more damage dealt to the player
window.enemyDamageFactor = 1.0;
window.enemyBulletFactor = 1.0;

//Enemy speed factor
window.enemySpeedFactor = 1.0;


//Meteorite speed factor
window.meteoriteSpeedFactor=1.0;

/** Timer references */
window.movementTimer   = null;
window.enemyTimer      = null;
window.enemyFireTimer  = null;
window.bgTimer         = null;
window.meteoriteTimer =null;


/** Player plane width and height (assigned in onload) */
window.myPlaneW=0;
window.myPlaneH=0;
window.myPlane2W=0;
window.myPlane2H=0;

/** Bullet dimensions */
window.bulletW=32;
window.bulletH=32;

/** DOM variables (assigned in onload), and shield status */
window.plane1ShieldActive=false;
window.plane2ShieldActive=false;
window.SHIELD_DURATION=5000; // Shield duration in milliseconds

// Enemy data
window.enemyObj = {
  enemy1: { width:80,  height:80,  score:250,  hp:100 },
  enemy2: { width:130, height:130, score:500,  hp:300 },
  enemy3: { width:180, height:180, score:1000, hp:500 }
};


// Meteorite data
window.meteoriteObj = {
  meteorite1: { score: 100, hp: 100, width:80, height: 80 },
  meteorite2: { score: 500, hp: 200, width: 130, height:130 },
  meteorite3: { score: 1000, hp: 300, width: 180, height:180 }
};


// Determine left/right hand mode
window.leftModel = false;
window.rightModel = false;