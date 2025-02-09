/**
 * plane.test.js
 * 测试内容包括：
 *  1. 单元测试：测试辅助函数 $() 与 getStyle() 的功能
 *  2. 集成测试：模拟点击“开始游戏”、模式选择、输入玩家姓名、暂停/继续、飞机移动等操作，
 *     检查各个 DOM 元素的状态与样式是否正确。
 */
const { $, getStyle } = require('./plane.js');

test('should get element by ID', () => {
  document.body.innerHTML = '<div id="testDiv"></div>';
  expect($('testDiv')).not.toBeNull();
});


// 为保证每个测试都是在全新的 DOM 环境中运行，在 beforeEach 中重置 document.body
beforeEach(() => {
  // 将 HTML 结构注入 document.body，直接复制HTML 内容
  document.body.innerHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Plane Game - English Version</title>
  </head>
  <body>
    <!-- 游戏总容器 -->
    <div id="game" style="width: 600px; height: 600px; margin: 50px auto; background-color: #eee; position: relative;">
      
      <!-- 第1步：游戏开始界面 -->
      <div id="gameStart" style="width:100%; height:100%; position:absolute; top:0; left:0; background:#ccc;">
        <button style="display:block; margin: 250px auto; width:100px; height:50px;">
          Start Game
        </button>
      </div>
      
      <!-- 第2步：选择模式（单人 / 双人） -->
      <div id="selectMode" style="display:none; width:100%; height:100%; position:absolute; top:0; left:0; background:#aaa;">
        <div style="text-align:center; margin-top:250px;">
          <button id="singleBtn" style="width:100px; height:50px; margin-right:20px;">Single</button>
          <button id="doubleBtn" style="width:100px; height:50px;">Two Players</button>
        </div>
      </div>
  
      <!-- 第3步：输入玩家姓名（单人或双人模式下的第1位玩家） -->
      <div id="enterName" style="display:none; width:100%; height:100%; position:absolute; top:0; left:0; background:#bbb;">
        <div style="text-align:center; margin-top:250px;">
          <p id="nameHint" style="font-size:18px;">Please enter your name</p>
          <input type="text" id="nameInput" style="width:200px; height:30px;" />
          <p style="color:red;" id="errMsg1"></p>
        </div>
      </div>
  
      <!-- 第4步：输入第二位玩家姓名（仅双人模式才会出现） -->
      <div id="enterName2" style="display:none; width:100%; height:100%; position:absolute; top:0; left:0; background:#bbb;">
        <div style="text-align:center; margin-top:250px;">
          <p style="font-size:18px;">Please enter the second player's name</p>
          <input type="text" id="nameInput2" style="width:200px; height:30px;" />
          <p style="color:red;" id="errMsg2"></p>
        </div>
      </div>
  
      <!-- 第5步：正式进入游戏界面（gameEnter） -->
      <div id="gameEnter" style="width:100%; height:100%; position:absolute; top:0; left:0; display:none;">
        <!-- 第一架飞机(红色)，用鼠标移动 -->
        <div id="myPlane"
             style="width: 50px; height: 60px; background:red; position:absolute; left:275px; top:520px;">
        </div>
  
        <!-- 第二架飞机(蓝色)，用WASD移动（默认隐藏，只有双人模式才显示） -->
        <div id="myPlane2"
             style="width: 50px; height: 60px; background:blue; position:absolute; left:275px; top:400px; display:none;">
        </div>
  
        <!-- 暂停提示框（默认隐藏，暂停时显示在屏幕中央） -->
        <div id="pauseTip"
             style="position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);
                    background:rgba(0,0,0,0.6); color:#fff; padding:20px; text-align:center;
                    border-radius:8px; display:none;">
          Press SPACE to Resume
        </div>
  
        <!-- 子弹容器（如需后续扩展） -->
        <div id="bullets" style="position:absolute; top:0; left:0;"></div>
        <!-- 敌机容器（如需后续扩展） -->
        <div id="enemys" style="position:absolute; top:0; left:0;"></div>
  
        <!-- 玩家信息显示 -->
        <div id="playerInfo"
             style="position:absolute; top:5px; left:5px; color:blue; font-size:14px;">
        </div>
      </div>
  
    </div>
  
    <!-- 模拟引入脚本 -->
    <script src="plane.js"></script>
  </body>
  </html>
  `;

  // 由于 plane.js 依赖 window.onload，所以手动调用 window.onload 进行初始化
  if (typeof window.onload === 'function') {
    window.onload();
  }
});

afterEach(() => {
  // 清空 body，避免测试间干扰
  document.body.innerHTML = '';
});


/* ===== 单元测试部分 ===== */

/**
 * 测试辅助函数 $()
 * 该函数参数：
 *   - idName: 字符串，表示 DOM 元素的 id
 * 关键变量：
 *   - document.getElementById 返回的 DOM 元素
 * 功能：
 *   - 根据 id 获取对应的 DOM 元素
 */
describe('辅助函数 $()', () => {
  test('返回正确的 DOM 元素', () => {
    // 创建一个临时元素并设置 id
    const tempDiv = document.createElement('div');
    tempDiv.id = 'testDiv';
    document.body.appendChild(tempDiv);

    // 调用 $ 函数
    const res = $('testDiv');
    expect(res).toBe(tempDiv);

    // 清理
    document.body.removeChild(tempDiv);
  });
});


/**
 * 测试辅助函数 getStyle()
 * 参数说明：
 *   - ele: 传入的 DOM 元素
 *   - attr: 字符串，表示要获取的 CSS 属性名称
 * 关键变量：
 *   - window.getComputedStyle 或 ele.currentStyle（兼容 IE）
 * 功能：
 *   - 获取元素计算后的指定样式，并转换为数值返回（通过 parseFloat）
 */
describe('辅助函数 getStyle()', () => {
  test('能正确获取内联样式的数值', () => {
    // 创建一个临时元素，并设置内联样式
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '300px';
    document.body.appendChild(tempDiv);

    const width = getStyle(tempDiv, 'width');
    // 由于 getStyle 返回 parseFloat 后的数值
    expect(width).toBe(300);

    // 清理
    document.body.removeChild(tempDiv);
  });
});


/* ===== 集成测试部分 ===== */

/**
 * 集成测试：点击“开始游戏”按钮后，应隐藏开始界面，显示选择模式界面
 */
describe('游戏流程：点击开始游戏', () => {
  test('点击开始游戏按钮，隐藏 gameStart 显示 selectMode', () => {
    const gameStart = document.getElementById('gameStart');
    const selectMode = document.getElementById('selectMode');

    // 初始状态：gameStart 显示，selectMode 隐藏
    expect(gameStart.style.display).not.toBe('none');
    expect(selectMode.style.display).toBe('none');

    // 模拟点击开始游戏按钮
    gameStart.firstElementChild.click();

    // 点击后，gameStart 应隐藏，selectMode 显示
    expect(gameStart.style.display).toBe('none');
    expect(selectMode.style.display).toBe('block');
  });
});


/**
 * 集成测试：选择单人模式后，显示输入玩家姓名界面，并设置提示信息
 * 关键变量：
 *   - isDouble：false 表示单人模式
 *   - nameHint：提示信息 DOM
 */
describe('模式选择：单人模式', () => {
  test('点击单人模式按钮，显示 enterName 界面，并提示 "Please enter your name"', () => {
    // 先模拟点击“开始游戏”进入选择模式
    document.getElementById('gameStart').firstElementChild.click();

    const singleBtn = document.getElementById('singleBtn');
    const selectMode = document.getElementById('selectMode');
    const enterName = document.getElementById('enterName');
    const nameHint = document.getElementById('nameHint');

    // 模拟点击单人模式按钮
    singleBtn.click();

    // 检查：选择界面隐藏，输入姓名界面显示
    expect(selectMode.style.display).toBe('none');
    expect(enterName.style.display).toBe('block');

    // 检查提示文字是否为 "Please enter your name"
    expect(nameHint.innerText).toBe("Please enter your name");
  });
});


/**
 * 集成测试：选择双人模式后，显示输入第一位玩家姓名界面，并设置提示信息
 * 关键变量：
 *   - isDouble：true 表示双人模式
 *   - nameHint：提示信息 DOM
 */
describe('模式选择：双人模式', () => {
  test('点击双人模式按钮，显示 enterName 界面，并提示 "Please enter the first player\'s name"', () => {
    // 先模拟点击“开始游戏”进入选择模式
    document.getElementById('gameStart').firstElementChild.click();

    const doubleBtn = document.getElementById('doubleBtn');
    const selectMode = document.getElementById('selectMode');
    const enterName = document.getElementById('enterName');
    const nameHint = document.getElementById('nameHint');

    // 模拟点击双人模式按钮
    doubleBtn.click();

    // 检查：选择界面隐藏，输入姓名界面显示
    expect(selectMode.style.display).toBe('none');
    expect(enterName.style.display).toBe('block');

    // 检查提示文字是否为 "Please enter the first player's name"
    expect(nameHint.innerText).toBe("Please enter the first player's name");
  });
});


/**
 * 集成测试：输入玩家姓名（单人模式）——键盘 Enter 事件
 * 关键变量：
 *   - nameInput：输入框 DOM
 *   - errMsg1：错误提示 DOM
 *   - playerInfo：玩家信息显示 DOM
 * 功能：
 *   - 当按下 Enter 键，若输入为空，则显示错误提示；
 *     若非空，则进入游戏界面，并显示玩家信息。
 */
describe('输入玩家姓名（单人模式）', () => {
  test('空字符串输入，提示错误；非空输入则进入游戏', () => {
    // 模拟点击开始游戏、单人模式选择
    document.getElementById('gameStart').firstElementChild.click();
    document.getElementById('singleBtn').click();

    const nameInput = document.getElementById('nameInput');
    const errMsg1  = document.getElementById('errMsg1');
    const enterName = document.getElementById('enterName');
    const gameEnter = document.getElementById('gameEnter');
    const playerInfo = document.getElementById('playerInfo');

    // 1. 模拟空字符串输入，按下 Enter 键
    nameInput.value = "   "; // 空格
    const emptyEvent = new KeyboardEvent('keyup', { keyCode: 13 });
    nameInput.dispatchEvent(emptyEvent);

    // 应显示错误提示
    expect(errMsg1.innerText).toBe("Player name cannot be empty!");

    // 2. 模拟有效输入
    nameInput.value = "Alice";
    const validEvent = new KeyboardEvent('keyup', { keyCode: 13 });
    nameInput.dispatchEvent(validEvent);

    // 输入框清空，enterName 隐藏，gameEnter 显示
    expect(nameInput.value).toBe("");
    expect(enterName.style.display).toBe('none');
    expect(gameEnter.style.display).toBe('block');

    // 玩家信息应显示 "Single-player mode: Player(Alice)"
    expect(playerInfo.innerText).toBe("Single-player mode: Player(Alice)");
  });
});


/**
 * 集成测试：输入玩家姓名（双人模式）
 * 功能：
 *   - 第一位玩家输入有效后，切换到输入第二位玩家姓名界面；
 *   - 第二位玩家输入有效后，进入游戏界面，并显示双人模式的玩家信息。
 */
describe('输入玩家姓名（双人模式）', () => {
  test('双人模式：依次输入有效姓名，进入游戏', () => {
    // 模拟点击开始游戏、双人模式选择
    document.getElementById('gameStart').firstElementChild.click();
    document.getElementById('doubleBtn').click();

    const nameInput = document.getElementById('nameInput');
    const errMsg1  = document.getElementById('errMsg1');
    const enterName = document.getElementById('enterName');

    const nameInput2 = document.getElementById('nameInput2');
    const errMsg2  = document.getElementById('errMsg2');
    const enterName2 = document.getElementById('enterName2');

    const gameEnter = document.getElementById('gameEnter');
    const playerInfo = document.getElementById('playerInfo');
    const myPlane2 = document.getElementById('myPlane2');

    // 1. 第一位玩家输入空白，检查错误提示
    nameInput.value = "";
    nameInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
    expect(errMsg1.innerText).toBe("Player name cannot be empty!");

    // 2. 第一位玩家输入有效姓名
    nameInput.value = "Alice";
    nameInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));

    // 此时，enterName 隐藏，enterName2 显示
    expect(enterName.style.display).toBe('none');
    expect(enterName2.style.display).toBe('block');

    // 3. 第二位玩家输入空白，检查错误提示
    nameInput2.value = "   ";
    nameInput2.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
    expect(errMsg2.innerText).toBe("Player name cannot be empty!");

    // 4. 第二位玩家输入有效姓名
    nameInput2.value = "Bob";
    nameInput2.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));

    // 进入游戏界面：enterName2 隐藏，gameEnter 显示
    expect(enterName2.style.display).toBe('none');
    expect(gameEnter.style.display).toBe('block');

    // 蓝色飞机（myPlane2）显示，并在玩家信息中显示双人模式信息
    expect(myPlane2.style.display).toBe('block');
    expect(playerInfo.innerText).toBe("Two-player mode: Player1(Alice) & Player2(Bob)");
  });
});


/**
 * 集成测试：空格键切换游戏状态（暂停/继续）
 * 关键变量：
 *   - gameStatus：游戏状态标识（进行中/暂停），虽然为闭包变量，但效果可从事件响应上验证
 *   - pauseTip：暂停提示 DOM
 * 功能：
 *   - 按下空格键时，如果游戏进行中，则暂停（取消鼠标移动事件，显示提示）；
 *     如果游戏暂停，则恢复进行中（恢复鼠标移动事件，隐藏提示）。
 */
describe('空格键切换游戏状态', () => {
  test('模拟空格键切换状态', () => {
    // 为保证进入游戏状态，先走单人模式并输入有效姓名
    document.getElementById('gameStart').firstElementChild.click();
    document.getElementById('singleBtn').click();
    const nameInput = document.getElementById('nameInput');
    nameInput.value = "Alice";
    nameInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));

    const pauseTip = document.getElementById('pauseTip');

    // 初始状态下，游戏开始（gameStatus 为 true），鼠标移动事件已被绑定
    expect(pauseTip.style.display).toBe('none');

    // 模拟按下空格键 → 应暂停
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }));
    expect(pauseTip.style.display).toBe('block');

    // 模拟再次按下空格键 → 应恢复游戏
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }));
    expect(pauseTip.style.display).toBe('none');
  });
});


/**
 * 集成测试：第二架飞机（蓝色）使用 WASD 移动（仅在双人模式下有效）
 * 关键变量：
 *   - plane2X, plane2Y：蓝色飞机的位置坐标（初始分别为 275, 400）
 *   - step：移动步长（10px）
 * 功能：
 *   - 在双人模式且游戏进行中时，按下 WASD 键改变蓝色飞机的位置，
 *     同时需进行边界限制。
 */
describe('蓝色飞机 WASD 移动', () => {
  test('按下 WASD 键，蓝色飞机位置应更新', () => {
    // 先进入双人模式，并输入两个有效姓名
    document.getElementById('gameStart').firstElementChild.click();
    document.getElementById('doubleBtn').click();

    const nameInput = document.getElementById('nameInput');
    nameInput.value = "Alice";
    nameInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));

    const nameInput2 = document.getElementById('nameInput2');
    nameInput2.value = "Bob";
    nameInput2.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));

    const myPlane2 = document.getElementById('myPlane2');
    const game = document.getElementById('game');

    // 获取游戏区域宽度与飞机宽度（通过 getStyle）
    const gameW = getStyle(game, "width");
    const plane2W = getStyle(myPlane2, "width");

    // 初始位置：left=275, top=400（由 html 给定）
    expect(myPlane2.style.left).toBe("275px");
    expect(myPlane2.style.top).toBe("400px");

    // 模拟按下 'w' 键，移动上移 10px
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    // 期望 top 减少 10px
    expect(myPlane2.style.top).toBe("390px");

    // 模拟按下 'a' 键，移动左移 10px
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(myPlane2.style.left).toBe("265px");

    // 模拟按下 's' 键，移动下移 10px
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    expect(myPlane2.style.top).toBe("400px");

    // 模拟按下 'd' 键，移动右移 10px
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    expect(myPlane2.style.left).toBe("275px");

    // 测试边界限制：持续按 'a' 直到不能再左移
    for (let i = 0; i < 100; i++) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    }
    // 左边界应不小于 0
    expect(parseInt(myPlane2.style.left)).toBeGreaterThanOrEqual(0);

    // 同理测试右边界：持续按 'd'
    for (let i = 0; i < 200; i++) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    }
    expect(parseInt(myPlane2.style.left)).toBeLessThanOrEqual(gameW - plane2W);
  });
});

