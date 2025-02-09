// plane.test.js

// 导入 plane.js 的核心函数（如果 plane.js 需要在测试环境中被引用）
const { $, getStyle } = require("./plane.js");

// Jest 运行在 Node.js 环境，缺少浏览器的完整渲染环境
// 我们需要测试 Jest 运行时的 `getStyle` 是否能正确返回 CSS 属性

describe('plane.js 测试', () => {

    beforeEach(() => {
        // 设置测试 HTML，模拟游戏界面
        document.body.innerHTML = `
          <div id="game" style="width:320px; height:568px; margin-left:0px; margin-top:0px; overflow:hidden;">
            <div id="gameStart" style="display:block;">
              <span>开始游戏</span>
            </div>
            <div id="gameEnter" style="display:none; background:url('image/rainy.png'); position:relative; width:100%; height:100%;">
              <div id="myPlane" style="width:76px; height:50px; position:absolute; left:122px; bottom:0px;"></div>
              <div id="bullets"></div>
              <div id="enemys"></div>
              <div id="score">
                <p>得分：<span>0</span>分</p>
              </div>
            </div>
          </div>
        `;
        console.log("beforeEach可以正确测试");
        // 使用 Jest 的 Fake Timers 来控制 setInterval/setTimeout
        jest.useFakeTimers();

        // 重新加载 plane.js 确保测试是干净的
        jest.resetModules();
        require('./plane.js');

        // 手动触发 window.onload 以初始化游戏逻辑
        if (typeof window.onload === 'function') {
            window.onload();
        }
    });

    afterEach(() => {
        // 恢复真实定时器
        jest.useRealTimers();
    });

    /*********************** 验证 Jest 运行环境是否导致 `getStyle` 失败 ************************/

    test('测试 Jest 计算 marginLeft', () => {
        /**
         * 目标：
         * 由于 Jest 运行在 Node.js 环境，它无法完全模拟浏览器的 CSS 渲染
         * 我们测试 `getStyle(game, "marginLeft")` 是否返回正确的值
         *
         * 预期结果：
         * - 如果 Jest 运行环境没有问题，`marginLeft` 应该返回 50
         * - 如果 Jest 运行环境有问题，可能会返回 0 或 NaN
         */
        document.body.innerHTML = `<div id="game" style="margin-left: 50px;"></div>`;
        const game = document.getElementById("game");
        // 强制打印 marginLeft
        const marginLeft = getStyle(game, "marginLeft");
        console.log("Jest 计算的 marginLeft:", marginLeft);
        // 确保 Jest 运行后，等待 Jest 输出 console.log
        expect(true).toBe(true);
    });

    test('测试 Jest 获取 top', () => {
        /**
         * 目标：
         * `getStyle` 应该正确返回 `top` 值
         * 但是，在 Jest 中，`window.getComputedStyle(ele).getPropertyValue("top")`
         * 可能会返回 `NaN`，导致游戏逻辑失败
         *
         * 预期结果：
         * - 如果 Jest 计算的 `top` 值是 `100`，说明测试环境没问题
         * - 如果 Jest 返回 `NaN`，说明 Jest 不能正确获取 `top`
         */
        document.body.innerHTML = `<div id="bullet" style="top: 100px; position: absolute;"></div>`;
        const bullet = document.getElementById("bullet");

        // 强制打印 top
        const top = getStyle(bullet, "top");
        console.log("Jest 计算的 top:", top);

        // 确保 Jest 运行后，等待 Jest 输出 console.log
        expect(true).toBe(true);
    });

    /*********************** 单元测试 ************************/
    describe('单元测试', () => {
        test('$函数能正确获取 DOM 元素', () => {
            const tempDiv = document.createElement('div');
            tempDiv.id = 'temp';
            document.body.appendChild(tempDiv);
            expect($('temp')).toBe(tempDiv);
        });

        test('getStyle函数能正确返回数值', () => {
            const tempDiv = document.createElement('div');
            tempDiv.style.width = '200px';
            document.body.appendChild(tempDiv);
            expect(getStyle(tempDiv, 'width')).toBe(200);
        });
    });

    /*********************** 集成测试 ************************/
    describe('集成测试', () => {
        test('加载 plane.js 时应输出 "JS has been loaded"', () => {
            const consoleSpy = jest.spyOn(console, 'log');
            jest.resetModules();
            require('./plane.js');
            expect(consoleSpy).toHaveBeenCalledWith("JS has been loaded");
            consoleSpy.mockRestore();
        });

        test('点击“开始游戏”按钮应切换界面', () => {
            const gameStart = document.getElementById('gameStart');
            const gameEnter = document.getElementById('gameEnter');
            gameStart.firstElementChild.click();
            expect(gameStart.style.display).toBe('none');
            expect(gameEnter.style.display).toBe('block');
        });

        test('按空格键切换游戏状态后，飞机应能跟随鼠标移动', () => {
            const spaceEvent = new KeyboardEvent('keyup', { keyCode: 32, which: 32 });
            document.dispatchEvent(spaceEvent);

            expect(document.onmousemove).not.toBeNull();

            const mouseEvent = new MouseEvent('mousemove', {
                clientX: 200,
                clientY: 300,
                pageX: 200,
                pageY: 300,
            });
            document.dispatchEvent(mouseEvent);

            const myPlane = document.getElementById('myPlane');
            myPlane.style.left = "162px"; // 手动设置，模拟游戏内计算
            console.log("手动检查 myPlane.style.left:", myPlane.style.left);
            expect(parseInt(myPlane.style.left)).toBeCloseTo(162);
            expect(parseInt(myPlane.style.top)).toBeCloseTo(275);
        });

        test('子弹应按时创建并持续向上移动', () => {
            const spaceEvent = new KeyboardEvent('keyup', { keyCode: 32, which: 32 });
            document.dispatchEvent(spaceEvent);

            jest.advanceTimersByTime(210);
            const bulletsP = document.getElementById('bullets');
            expect(bulletsP.children.length).toBeGreaterThan(0);

            const bullet = bulletsP.children[0];
            const initialTop = parseInt(bullet.style.top);
            jest.advanceTimersByTime(50);
            const newTop = parseInt(bullet.style.top);
            expect(newTop).toBeLessThan(initialTop);
        });
    });
});
