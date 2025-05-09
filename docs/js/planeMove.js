/** 
 * Plane movement timer
 * Periodically updates player plane positions and shield positions,
 * and performs boundary checks to prevent planes from going out of bounds.
 */


function startMovement() {
    // If the timer is already running, return immediately to avoid duplicate timers
    if (movementTimer) return;
  
     // Update plane positions every 30 milliseconds
    movementTimer = setInterval(function () {
      // Do not update if the game is paused or over
      if (!gameStatus) return;
  
       // Calculate movement distance based on player speed factors
      var step1 = 13 * player1SpeedFactor; // Step size for Player 1
      var step2 = 13 * player2SpeedFactor; // Step size for Player 2
  
      
    
        // --- Player 1 movement controls ---
        if (p1Up)    plane1Y -= step1; // Move up
        if (p1Down)  plane1Y += step1; // Move down
        if (p1Left)  plane1X -= step1; // Move left
        if (p1Right) plane1X += step1; // Move right
    

        // Boundary check for Player 1 to stay within game area
        if (plane1X < 0) plane1X = 0;
        if (plane1X > gameW - myPlaneW) plane1X = gameW - myPlaneW;
        if (plane1Y < 0) plane1Y = 0;
        if (plane1Y > gameH - myPlaneH) plane1Y = gameH - myPlaneH;
    

         // Update Player 1's plane DOM position
        myPlane.style.left = plane1X + "px";
        myPlane.style.top  = plane1Y + "px";
    
        // Synchronize shield position to stay near the center of Player 1's plane
        plane1Shield.style.left = (plane1X + myPlaneW / 2 - 50) + "px";
        plane1Shield.style.top  = (plane1Y + myPlaneH / 2 - 50) + "px";

  

       // --- Player 2 movement controls (only in two-player mode) ---
      if (isDouble) {

        if (p2Up)    plane2Y -= step2;
        if (p2Down)  plane2Y += step2;
        if (p2Left)  plane2X -= step2;
        if (p2Right) plane2X += step2;
  
        // Boundary check for Player 2
        if (plane2X < 0) plane2X = 0;
        if (plane2X > gameW - myPlane2W) plane2X = gameW - myPlane2W;
        if (plane2Y < 0) plane2Y = 0;
        if (plane2Y > gameH - myPlane2H) plane2Y = gameH - myPlane2H;
  
         // Update Player 2's plane DOM position
        myPlane2.style.left = plane2X + "px";
        myPlane2.style.top  = plane2Y + "px";
  
        // Update Player 2's shield position
        plane2Shield.style.left = (plane2X + myPlane2W / 2 - 50) + "px";
        plane2Shield.style.top  = (plane2Y + myPlane2H / 2 - 50) + "px";
      }
    }, 30);
  }