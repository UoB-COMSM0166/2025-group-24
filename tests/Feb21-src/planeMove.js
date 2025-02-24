/** 
 * 飞机移动定时器
 * 定时更新玩家飞机的位置以及护盾的位置，
 * 同时进行边界判断，防止飞机超出游戏区域。
 */
function startMovement() {
    // 如果已经有定时器在运行，则直接返回，避免重复启动
    if (movementTimer) return;
  
    // 每30毫秒更新一次飞机位置
    movementTimer = setInterval(function () {
      // 游戏暂停或结束时不更新飞机位置
      if (!gameStatus) return;
  
      // 根据玩家飞机速度因子计算本次移动的距离
      var step1 = 10 * player1SpeedFactor; // 玩家1的步长
      var step2 = 10 * player2SpeedFactor; // 玩家2的步长
  
      // --- 玩家1的移动控制 ---
      if (p1Up)    plane1Y -= step1; // 向上移动
      if (p1Down)  plane1Y += step1; // 向下移动
      if (p1Left)  plane1X -= step1; // 向左移动
      if (p1Right) plane1X += step1; // 向右移动
  
      // 玩家1边界检测，防止超出游戏区域
      if (plane1X < 0) plane1X = 0;
      if (plane1X > gameW - myPlaneW) plane1X = gameW - myPlaneW;
      if (plane1Y < 0) plane1Y = 0;
      if (plane1Y > gameH - myPlaneH) plane1Y = gameH - myPlaneH;
  
      // 更新玩家1飞机的 DOM 位置
      myPlane.style.left = plane1X + "px";
      myPlane.style.top  = plane1Y + "px";
  
      // 同步更新玩家1护盾的位置（使其保持在飞机中心附近）
      plane1Shield.style.left = (plane1X + myPlaneW / 2 - 50) + "px";
      plane1Shield.style.top  = (plane1Y + myPlaneH / 2 - 50) + "px";
  
      // --- 玩家2的移动控制（仅在双人模式下执行） ---
      if (isDouble) {
        if (p2Up)    plane2Y -= step2;
        if (p2Down)  plane2Y += step2;
        if (p2Left)  plane2X -= step2;
        if (p2Right) plane2X += step2;
  
        // 玩家2边界检测
        if (plane2X < 0) plane2X = 0;
        if (plane2X > gameW - myPlane2W) plane2X = gameW - myPlane2W;
        if (plane2Y < 0) plane2Y = 0;
        if (plane2Y > gameH - myPlane2H) plane2Y = gameH - myPlane2H;
  
        // 更新玩家2飞机的 DOM 位置
        myPlane2.style.left = plane2X + "px";
        myPlane2.style.top  = plane2Y + "px";
  
        // 更新玩家2护盾位置
        plane2Shield.style.left = (plane2X + myPlane2W / 2 - 50) + "px";
        plane2Shield.style.top  = (plane2Y + myPlane2H / 2 - 50) + "px";
      }
    }, 30);
  }
  // 导出飞机移动定时器启动函数，供测试调用
window.startMovement = startMovement;
