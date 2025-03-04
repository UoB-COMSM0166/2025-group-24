// 存储单人模式和双人模式的排行榜数据
let singlePlayerLeaderboard = []; // 单人模式排行榜
let dualPlayerLeaderboard = [];   // 双人模式排行榜

// 添加玩家得分
function addScore(name, score, isDouble) {
  const leaderboard = isDouble ? dualPlayerLeaderboard : singlePlayerLeaderboard;

  // 检查是否已存在该玩家
  const existingPlayer = leaderboard.find((player) => player.name === name);

  if (existingPlayer) {
    // 如果已存在，更新最高分
    if (score > existingPlayer.score) {
      existingPlayer.score = score;
    }
  } else {
    // 如果不存在，添加新玩家
    leaderboard.push({ name, score });
  }

  sortLeaderboard(leaderboard); // 排序
  saveLeaderboard(); // 保存到 localStorage
}

// 排序排行榜
function sortLeaderboard(leaderboard) {
  leaderboard.sort((a, b) => b.score - a.score); // 按分数从高到低排序
}

// 保存排行榜到 localStorage
function saveLeaderboard() {
  localStorage.setItem("singlePlayerLeaderboard", JSON.stringify(singlePlayerLeaderboard));
  localStorage.setItem("dualPlayerLeaderboard", JSON.stringify(dualPlayerLeaderboard));
}

// 从 localStorage 加载排行榜
function loadLeaderboard() {
  const singleData = localStorage.getItem("singlePlayerLeaderboard");
  const dualData = localStorage.getItem("dualPlayerLeaderboard");

  if (singleData) {
    singlePlayerLeaderboard = JSON.parse(singleData);
  }
  if (dualData) {
    dualPlayerLeaderboard = JSON.parse(dualData);
  }
}

// 获取单人模式排行榜数据
function getSinglePlayerLeaderboard() {
  return singlePlayerLeaderboard;
}

// 获取双人模式排行榜数据
function getDualPlayerLeaderboard() {
  return dualPlayerLeaderboard;
}

// 初始化排行榜
function initLeaderboard() {
  loadLeaderboard();
}

// 清空排行榜
function clearLeaderboard(isDouble) {
  if (isDouble) {
    dualPlayerLeaderboard = [];
  } else {
    singlePlayerLeaderboard = [];
  }
  saveLeaderboard();
  displayLeaderboard(isDouble); // 刷新排行榜显示
}

// 展示排行榜
function displayLeaderboard(isDouble) {
  // 获取排行榜面板
  const rankPanel = isDouble ? document.getElementById("rankPanel2") : document.getElementById("rankPanel1");
  const scoreList = rankPanel.querySelector("#scoreList");

  // 清空旧数据
  scoreList.innerHTML = "";

  // 获取对应模式的排行榜数据
  const leaderboard = isDouble ? getDualPlayerLeaderboard() : getSinglePlayerLeaderboard();
  const maxEntries = 5; // 只显示前 5 名

  // 填充排行榜数据
  leaderboard.slice(0, maxEntries).forEach((player, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${player.name}: ${player.score} points`;
    scoreList.appendChild(listItem);
  });

  // 显示排行榜面板
  rankPanel.style.display = "block";

  // 添加清空按钮
function addClearButton(panelId, isDouble) {
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.classList.add("clear-button"); // 使用 CSS 类名
  
    clearButton.onclick = function () {
      clearLeaderboard(isDouble); // 清空对应模式的排行榜
    };
  
    // 将清空按钮添加到排行榜面板
    const rankPanel = document.getElementById(panelId);
    rankPanel.appendChild(clearButton);
  }
}

// 初始化排行榜
initLeaderboard();




