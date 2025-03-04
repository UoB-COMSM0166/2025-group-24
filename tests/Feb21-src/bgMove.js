// 全局变量：记录背景当前的 Y 偏移量（向下滚动）

var bgPosY = 0;

//开始背景滚动
 // 若已在滚动，则不重复启动
function bgMove() {
  // 如果已有定时器在跑，则直接返回
  if(bgTimer) return;

  // 每 30 ms 更新一次背景位置
  bgTimer = mySetInterval(function(){
    // 若游戏状态为暂停 / 结束，则不更新背景
    if(!gameStatus) return;

    // 背景向下移动 2 像素
    bgPosY += 2;

    // 当移到画面底部时，重置偏移让背景循环滚动
    if(bgPosY >= gameH) bgPosY = 0;

    // 应用新的偏移到背景图
    game.style.backgroundPositionY = bgPosY + "px";
  }, 30);
}
// 导出背景滚动函数
window.bgMove = bgMove;
