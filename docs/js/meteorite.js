//Meteorite falling

function startMeteoriteSpawn() {
  if (meteoriteTimer) return;
  meteoriteTimer = setInterval(() => {
    createMeteorite()
  }, 2000);
}

function createMeteorite() {
  var percentData = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3];
  var meteoriteType = percentData[Math.floor(Math.random() * percentData.length)];
  var data = meteoriteObj["meteorite" + meteoriteType];

  var meteorite = document.createElement("img");
  meteorite.src = "image/meteorite" + meteoriteType + ".png";
  meteorite.t = meteoriteType;               
  meteorite.hp = data.hp;            
  meteorite.className = "m";
  meteorite.dead = false;

  meteorite.style.width = data.width + "px";
  meteorite.style.height = data.height + "px";

  var meteoriteL = Math.floor(Math.random() * (gameW - data.width + 1));
  var meteoriteT = -data.height;
  meteorite.style.left = meteoriteL + "px";
  meteorite.style.top  = meteoriteT + "px";

  meteorites.appendChild(meteorite);
  meteoriteArray.push(meteorite);
  moveMeteorite(meteorite);
}

function moveMeteorite(m) {
  var meteoriteBaseSpeed;
  if (m.t === 1) meteoriteBaseSpeed = 5;   
  else if (m.t === 2) meteoriteBaseSpeed = 3; 
  else meteoriteBaseSpeed = 1.5;              

  m.timer = setInterval(() => {
    if (!gameStatus) return;
    var topVal = getStyle(m, "top");
    if (topVal >= gameH) {
      clearInterval(m.timer);
      if (m.parentNode) m.parentNode.removeChild(m);
      var idx = meteoriteArray.indexOf(m);
      if (idx !== -1) meteoriteArray.splice(idx, 1);
    } else {
      var finalSpeed = meteoriteBaseSpeed * meteoriteSpeedFactor;
      m.style.top = (topVal + finalSpeed) + "px";
      checkCollisionWithMeteorite(m);
      bulletsCollisionWithMeteorites(m);
    }
  }, 30);
}

function bulletsCollisionWithMeteorites(m){
for (var i = bullets.length - 1; i >= 0; i--){
  var b = bullets[i];

  var bL = getStyle(b, "left"),
      bT = getStyle(b, "top"),
      bW = getStyle(b, "width"),
      bH = getStyle(b, "height");

  var eL = getStyle(m, "left"),
      eT = getStyle(m, "top"),
      eW = getStyle(m, "width"),
      eH = getStyle(m, "height");

  if(collide(bL, bT, bW, bH, eL, eT, eW, eH, bulletScale, enemyScale)){
    m.hp -= 100;
    if(m.hp <= 0){

      killMeteorite(m);
    }
    break;
  }
}
}

function killMeteorite(m) {
if (m.dead) return;
m.dead = true;

clearInterval(m.timer);
m.src = "image/bz2.gif?" + new Date().getTime();
m.style.position = "absolute";

m.onload = function() {
  setTimeout(() => {
    removeMeteoriteElement(m);
  }, 500);
};

m.onerror = function() {
  removeMeteoriteElement(m);
};
}

function removeMeteoriteElement(m) {
if (!m) return;

if (m.parentNode) {
  m.parentNode.removeChild(m);
}

const idx = meteoriteArray.indexOf(m);
if (idx !== -1) {
  meteoriteArray.splice(idx, 1);
}

m.onload = null;
m.onerror = null;
}

function checkCollisionWithMeteorite(m){
  var mL = getStyle(m,"left"),
      mT = getStyle(m,"top"),
      mW = getStyle(m,"width"),
      mH = getStyle(m,"height");

  // Player 1 shield check
  if(plane1ShieldActive){
    var shieldX= plane1X + myPlaneW/2 -50;
    var shieldY= plane1Y + myPlaneH/2 -50;
    var shieldW= 100, shieldH=100;

    if(collide(mL,mT,mW,mH, shieldX,shieldY,shieldW,shieldH, enemyScale,1)){
  
      killMeteorite(m)
      return;
    }
  }

  // Player 1 body collision
  if(collide(mL,mT,mW,mH, plane1X,plane1Y, myPlaneW,myPlaneH, enemyScale, planeScale)){
    shakeWindow(300,8);
    plane1Hp--;
    totalHp--;
    loseHeart();
    killMeteorite(m);
    
    // Modified game-over condition
    if ((isDouble && totalHp <= 0) || (!isDouble && plane1Hp <= 0)) {
      doGameOver();
      return;
    }
  }

  // Player 2 collision check (in two-player mode)
  if(isDouble){
    if(plane2ShieldActive){
      var shield2X= plane2X+ myPlane2W/2-50;
      var shield2Y= plane2Y+ myPlane2H/2-50;
      if(collide(mL,mT,mW,mH, shield2X,shield2Y,100,100, enemyScale,1)){
        killMeteorite(m)
        return;
      }
    }
    if(collide(mL,mT,mW,mH, plane2X,plane2Y, myPlane2W,myPlane2H, enemyScale, planeScale)){
      shakeWindow(300,8);
      totalHp--;
      loseHeart();
      killMeteorite(m);
      
      // Modified game-over condition
      if ((isDouble && totalHp <= 0) || (!isDouble && plane1Hp <= 0)) {
        doGameOver();
        return;
      }
    }
  }
}

function pauseAllmeteorites() {
  if (currentRound < 3) return;
  clearInterval(meteoriteTimer);
  meteoriteTimer = null;
  for (let i = 0; i < meteoriteArray.length; i++) {
    clearInterval(meteoriteArray[i].timer);
    meteoriteArray[i].timer = null;
  }
}

function resumeAllmeteorites() {
  if (currentRound < 3) return;
  if (!meteoriteTimer) startMeteoriteSpawn();
  for (let i = 0; i < meteoriteArray.length; i++) {
      if (!meteoriteArray[i].timer) {
          moveMeteorite(meteoriteArray[i]);
      }
  }
}