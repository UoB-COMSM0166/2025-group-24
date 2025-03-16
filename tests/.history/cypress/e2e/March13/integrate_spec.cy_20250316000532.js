// cypress/integration/game_spec.js
// 此文件包含针对项目各模块（背景滚动、陨石下落、回合流程等）的单元测试和集成测试。
// 测试前请确保开发人员已将关键函数挂载到 window 对象上，方便 Cypress 调用。

describe('Plane Game 项目测试', () => {
    // 在每个测试用例执行前，加载 index.html 文件，并对全局环境做固定处理
    beforeEach(() => {
      // 固定视窗大小，确保元素尺寸一致
      cy.viewport(800, 800);
      // 访问本地 html 文件，注意路径必须与实际环境一致（F:\course\engineering\2025-group-24\tests\March2\index.html）
      cy.visit('F:/course/engineering/2025-group-24/tests/March2/index.html');
  
      // 固定部分 DOM 样式和全局变量，确保 getStyle() 返回固定值（如果 getStyle() 未做固定，可在此模拟）
      cy.window().then((win) => {
        // 假设 getStyle 是全局函数，这里覆盖它使之返回固定数值
        win.getStyle = (elem, attr) => {
          // 针对关键元素返回固定值，便于计算（实际数值依据 style.css 可调整）
          if (attr === 'width') {
            if(elem.id === 'game') return 600;
            if(elem.id === 'myPlane' || elem.id === 'myPlane2') return 50;
            return 100;
          }
          if (attr === 'height') {
            if(elem.id === 'game') return 600;
            if(elem.id === 'myPlane' || elem.id === 'myPlane2') return 50;
            return 100;
          }
          if (attr === 'top' || attr === 'left') {
            // 直接返回数值（假设页面初始化时均为0）
            return parseFloat(elem.style[attr]) || 0;
          }
          return 0;
        };
  
        // 固定游戏区域宽高变量（window.gameW, window.gameH）
        win.gameW = 600;
        win.gameH = 600;
  
        // 为便于单元测试，建议开发人员将以下函数挂载到 window 上
        // 例如在 bgMove.js 中添加：window.bgMove = bgMove;
        // 同理：window.startMeteoriteSpawn, window.createMeteorite, window.checkRound, window.enemyRoundFlowUpgrade, window.resetGameForNextRound 等
  
        // 初始化全局背景位置
        win.bgPosY = 0;
        // 清空定时器引用
        win.bgTimer = null;
        win.meteoriteTimer = null;
        win.movementTimer = null;
        win.enemyTimer = null;
        win.enemyFireTimer = null;
      });
    });
  
    /***************** 单元测试：背景滚动功能 (bgMove.js) *****************/
    describe('背景滚动功能 - bgMove', () => {
      it('调用 bgMove 后应启动定时器并更新背景位置', () => {
        cy.window().then((win) => {
          // 检查 bgTimer 为空，再调用 bgMove
          expect(win.bgTimer).to.be.null;
          // 调用 bgMove（确保开发人员已将 bgMove 挂载到 window 上）
          win.bgMove();
          // bgTimer 应不为空
          expect(win.bgTimer).to.not.be.null;
  
          // 等待 100ms 后，背景位置应有更新
          cy.wait(100).then(() => {
            const posYAfter = win.bgPosY;
            // 根据 bgMove 逻辑，每30ms加2像素，100ms至少更新3次 => posY 应大于等于6
            expect(posYAfter).to.be.at.least(6);
            // 检查 game DOM 元素的背景位置
            const bgPos = win.game.style.backgroundPositionY;
            expect(bgPos).to.equal(posYAfter + "px");
          });
        });
      });
    });
  
    /***************** 单元测试：陨石下落功能 (meteorite.js) *****************/
    describe('陨石下落功能', () => {
      it('调用 startMeteoriteSpawn 应启动陨石生成定时器', () => {
        cy.window().then((win) => {
          // 确保 meteoriteTimer 初始为空
          win.meteoriteTimer = null;
          win.meteoriteArray = [];
          // 调用启动函数（确保函数挂载到 window）
          win.startMeteoriteSpawn();
          expect(win.meteoriteTimer).to.not.be.null;
        });
      });
  
      it('createMeteorite 应创建并添加陨石元素到 meteorites 容器', () => {
        cy.window().then((win) => {
          // 调用 createMeteorite 函数（确保开发人员已挂载）
          const initialCount = win.meteoriteArray.length;
          win.createMeteorite();
          // 新创建的陨石应加入 meteoriteArray 数组
          expect(win.meteoriteArray.length).to.equal(initialCount + 1);
          // 检查 DOM 中 meteorites 容器中是否存在该陨石元素
          cy.get('#meteorites').children().should('have.length', initialCount + 1);
        });
      });
  
      it('killMeteorite 应能正确终止陨石并触发爆炸动画', () => {
        cy.window().then((win) => {
          // 创建一个陨石元素以测试 killMeteorite
          win.createMeteorite();
          const meteorite = win.meteoriteArray[win.meteoriteArray.length - 1];
          // 确保初始状态 dead 为 false
          expect(meteorite.dead).to.be.false;
          // 调用 killMeteorite
          win.killMeteorite(meteorite);
          // 应标记为 dead
          expect(meteorite.dead).to.be.true;
          // src 应修改为爆炸动画图片
          expect(meteorite.src).to.contain("bz.gif");
        });
      });
    });
  
    /***************** 单元测试：回合流程功能 (roundFlow.js) *****************/
    describe('回合流程及升级功能', () => {
      it('checkRound 应根据分数升级回合，并调用 marketPage 与 enemyRoundFlowUpgrade', () => {
        cy.window().then((win) => {
          // 设置初始回合和分数，模拟从第一回合升级到第二回合
          win.currentRound = 1;
          win.score = 1200;
          // 调用 checkRound
          win.checkRound();
          expect(win.currentRound).to.equal(2);
          // 此时应调用 marketPage，gameEnter 隐藏，marketPage1 显示
          expect(win.gameEnter.style.display).to.equal("none");
          expect(win.marketPage1.style.display).to.equal("block");
        });
      });
  
      it('enemyRoundFlowUpgrade 应将 enemySpeedFactor 与 enemyBulletFactor 按 1.15 倍升级', () => {
        cy.window().then((win) => {
          const oldSpeed = win.enemySpeedFactor;
          const oldBullet = win.enemyBulletFactor;
          win.enemyRoundFlowUpgrade();
          expect(win.enemySpeedFactor).to.be.closeTo(oldSpeed * 1.15, 0.001);
          expect(win.enemyBulletFactor).to.be.closeTo(oldBullet * 1.15, 0.001);
        });
      });
  
      it('resetGameForNextRound 应清空定时器和所有敌机、子弹、陨石', () => {
        cy.window().then((win) => {
          // 模拟已有定时器及存在的 DOM 元素
          win.bgTimer = 123;
          win.movementTimer = 456;
          win.bullets = [{ timer: 789, parentNode: { removeChild: () => {} } }];
          win.enemys = [{ timer: 111, parentNode: { removeChild: () => {} } }];
          win.enemyBullets = [{ timer: 222, parentNode: { removeChild: () => {} } }];
          win.meteoriteArray = [{ timer: 333, parentNode: { removeChild: () => {} } }];
  
          // 调用重置函数
          win.resetGameForNextRound();
  
          // 所有定时器应清空
          expect(win.bgTimer).to.be.null;
          expect(win.movementTimer).to.be.null;
          // 全部数组应为空
          expect(win.bullets.length).to.equal(0);
          expect(win.enemys.length).to.equal(0);
          expect(win.enemyBullets.length).to.equal(0);
          expect(win.meteoriteArray.length).to.equal(0);
        });
      });
    });
  
    /***************** 集成测试：页面交互与整体流程 *****************/
    describe('页面交互与整体流程', () => {
      it('点击 startBtn 后应切换到模式选择页面', () => {
        // 点击首页的开始按钮后，应隐藏首页并显示模式选择界面
        cy.get('#startBtn').click();
        // 可检查 selectMode 是否显示
        cy.get('#selectMode').should('be.visible');
      });
  
      it('点击 hpPlus 应关闭 marketPage 并启动游戏界面', () => {
        // 为确保测试数值固定，可先将 gameEnter 与 marketPage1 的 display 属性固定
        cy.get('#marketPage').invoke('show');
        cy.get('#gameEnter').invoke('hide');
        // 点击 hpPlus（升级健康属性按钮）
        cy.get('#hpPlus').click();
        // marketPage1 隐藏，gameEnter 显示
        cy.get('#marketPage').should('not.be.visible');
        cy.get('#gameEnter').should('be.visible');
      });
    });
  });
  