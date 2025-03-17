/// <reference types="cypress" />

/*
  主要验证：
  1. 首页及界面切换（点击开始、排行榜、返回首页）
  2. 单人模式和双人模式流程：玩家名称输入、界面显示及飞机显示
  3. 键盘事件：飞机移动、发射子弹、暂停与恢复
  4. 游戏过程中的各个视觉反馈效果：
     - roundPopup 显示后自动隐藏
     - 分数变化（例如：通过模拟子弹与敌机碰撞触发爆炸及分数增加）
     - 敌机、子弹、敌机子弹的生成和移除（通过 DOM 变化验证）
  5. 游戏结束后首页与游戏界面显示状态
*/
// 注意：'/index.html'是因为我已经预先配置了cypress.config.js,所以在这里 / 开始是拼接到端口8080的后缀
context('基于用户行为的游戏全流程测试', () => {
  beforeEach(() => {
    cy.visit('/index.html');
    cy.clock(); // 固定时钟，便于控制定时器
    // 确保首页加载完成
    cy.get('#homePage').should('be.visible');
  });

  describe('首页及界面切换', () => {
    it('点击开始按钮后首页隐藏，模式选择显示', () => {
      cy.get('#homePage').should('be.visible');
      cy.get('#startBtn').click();
      cy.get('#homePage').should('not.be.visible');
      cy.get('#selectMode').should('be.visible');
    });

    it('点击排行榜按钮后显示排行榜，再点击返回回到首页', () => {
      cy.get('#rankBtn').click();
      cy.get('#rankPanel').should('be.visible');
      cy.get('#backBtn').click();
      cy.get('#homePage').should('be.visible');
    });
  });

  describe('单人模式流程测试', () => {
    it('单人模式：输入有效名称后进入游戏，并验证 roundPopup 和飞机显示', () => {
      cy.get('#startBtn').click();
      cy.get('#singleBtn').click();
      cy.get('#enterName').should('be.visible')
        .within(() => {
          cy.get('#nameHint').should('contain', 'Please enter your name');
        });
      // 输入空格验证错误提示
      cy.get('#nameInput').type('   {enter}');
      cy.get('#errMsg1').should('contain', 'Player name cannot be empty!');
      // 输入有效名称后进入游戏
      cy.get('#nameInput').clear().type('玩家1{enter}');
      cy.get('#enterName').should('not.be.visible');
      cy.get('#gameEnter').should('be.visible')
        .within(() => {
          cy.get('#playerInfo').should('contain', 'Player(玩家1)');
        });
      cy.get('#myPlane').should('be.visible');
      // roundPopup 初始显示后 2 秒消失
      cy.tick(2000);
      cy.get('#roundPopup').should('not.be.visible');
    });
  });

  describe('双人模式流程测试', () => {
    it('双人模式：输入两位玩家名称后进入游戏，并验证两架飞机显示', () => {
      cy.get('#startBtn').click();
      cy.get('#doubleBtn').click();
      cy.get('#enterName').should('be.visible')
        .within(() => {
          cy.get('#nameHint').should('contain', "Please enter the first player's name");
        });
      // 输入第一位玩家名称
      cy.get('#nameInput').clear().type('玩家1{enter}');
      cy.get('#enterName').should('not.be.visible');
      cy.get('#enterName2').should('be.visible');
      // 测试空输入显示错误提示
      cy.get('#nameInput2').type('   {enter}');
      cy.get('#errMsg2').should('contain', 'Player name cannot be empty!');
      // 输入第二位玩家名称
      cy.get('#nameInput2').clear().type('玩家2{enter}');
      cy.get('#enterName2').should('not.be.visible');
      cy.get('#gameEnter').should('be.visible')
        .within(() => {
          cy.get('#playerInfo').should('contain', 'P1(玩家1) & P2(玩家2)');
        });
      cy.get('#myPlane').should('be.visible');
      cy.get('#myPlane2').should('be.visible');
      cy.tick(2000);
      cy.get('#roundPopup').should('not.be.visible');
    });
  });

  describe('游戏内操作测试', () => {
    beforeEach(() => {
      // 进入单人模式游戏
      cy.get('#startBtn').click();
      cy.get('#singleBtn').click();
      cy.get('#nameInput').clear().type('玩家1{enter}');
      cy.tick(2000);
    });

    it('模拟键盘事件，验证飞机移动', () => {
      cy.get('#myPlane').invoke('css', 'left').then(initialLeft => {
        const init = parseFloat(initialLeft);
        // 模拟按下 "d" 键向右移动
        cy.get('body').trigger('keydown', { key: 'd', code: 'KeyD', keyCode: 68 });
        cy.tick(60);
        cy.get('#myPlane').invoke('css', 'left').then(newLeft => {
          expect(parseFloat(newLeft)).to.be.greaterThan(init);
        });
        cy.get('body').trigger('keyup', { key: 'd', code: 'KeyD', keyCode: 68 });
      });
    });

    it('模拟发射子弹，验证子弹生成并移动后自动移除', () => {
      cy.get('body').trigger('keydown', { key: 'f', code: 'KeyF', keyCode: 70 });
      cy.get('#bullets .b').should('have.length.greaterThan', 0);
      cy.tick(1000);
      cy.get('#bullets .b').should('have.length', 0);
    });

    it('模拟空格键暂停与恢复，验证暂停期间元素不移动', () => {
      cy.get('body').trigger('keydown', { key: 'f', code: 'KeyF', keyCode: 70 });
      cy.tick(100);
      cy.get('#bullets .b').first().invoke('css', 'top').then(initialTop => {
        cy.get('body').trigger('keyup', { keyCode: 32 });
        cy.get('#pauseTip').should('be.visible');
        cy.tick(300);
        cy.get('#bullets .b').first().invoke('css', 'top').then(pausedTop => {
          expect(parseFloat(pausedTop)).to.equal(parseFloat(initialTop));
        });
        cy.get('body').trigger('keyup', { keyCode: 32 });
        cy.get('#pauseTip').should('not.be.visible');
      });
    });

    it('验证背景滚动效果', () => {
      cy.get('#game').invoke('css', 'backgroundPositionY').then(initialPos => {
        cy.tick(100);
        cy.get('#game').invoke('css', 'backgroundPositionY').then(newPos => {
          expect(newPos).to.not.equal(initialPos);
        });
      });
    });

    it('模拟玩家子弹击中敌机，验证敌机爆炸及分数增加', () => {
      // 等待敌机生成
      cy.tick(2000);
      cy.get('#enemys .e').should('have.length.greaterThan', 0).then($enemies => {
        // 将第一个敌机位置设置为易于碰撞的位置
        cy.wrap($enemies.first()).invoke('attr', 'style', 'left:110px; top:160px;');
        // 同时将玩家飞机设置到合适位置
        cy.get('#myPlane').invoke('attr', 'style', 'left:100px; top:150px;display:block;');
        // 模拟按下 "f" 键发射子弹
        cy.get('body').trigger('keydown', { key: 'f', code: 'KeyF', keyCode: 70 });
        // 模拟时间让子弹移动并触发碰撞检测
        cy.tick(500);
        // 此时敌机应被击中，图片切换为爆炸动画
        cy.get('#enemys .e').first().should('have.attr', 'src', 'image/bz.gif');
        // 分数应增加（非 0）
        cy.get('#scoreVal').invoke('text').then(txt => {
          expect(parseInt(txt)).to.be.greaterThan(0);
        });
      });
    });

    it('模拟玩家飞机被敌机子弹击中，触发游戏结束并返回首页', () => {
      // 重新进入游戏确保界面正常
      cy.get('#startBtn').click({ force: true });
      cy.get('#singleBtn').click({ force: true });
      cy.get('#nameInput').clear({ force: true }).type('玩家1{enter}');
      cy.tick(2000);
      cy.get('#gameEnter').should('be.visible');
      
      // 拦截 alert 以验证游戏结束
      cy.window().then(win => {
        cy.stub(win, 'alert').as('gameOverAlert');
      });
      
      // 模拟连续 5 次敌机子弹与玩家飞机碰撞：
      // 注意：我们手动创建敌机子弹时，要设置 width/height 与 CSS 保持一致
      for (let i = 0; i < 5; i++) {
        cy.window().then(win => {
          const bullet = win.document.createElement('div');
          bullet.className = 'enemy-bullet';
          bullet.style.position = 'absolute';
          bullet.style.width = '32px';
          bullet.style.height = '32px';
          // 设置位置与玩家飞机一致，确保碰撞（假设玩家飞机在 200,400）
          bullet.style.left = '200px';
          bullet.style.top = '400px';
          win.document.getElementById('enemyBullets').appendChild(bullet);
        });
        cy.tick(100);
      }
      
      // 经过 5 次碰撞，玩家 HP 应减为 0，触发 gameOver
      cy.get('@gameOverAlert').should('have.been.calledWithMatch', /Game Over! Final Score:/);
      
      // 模拟结束后界面切换：首页显示，游戏界面隐藏
      cy.tick(500);
      cy.get('#homePage').should('be.visible');
      cy.get('#gameEnter').should('not.be.visible');
    });
  });
      
  describe('敌机子弹功能测试', () => {
    beforeEach(() => {
      cy.get('#startBtn').click();
      cy.get('#singleBtn').click();
      cy.get('#nameInput').clear().type('玩家1{enter}');
      cy.tick(2000);
      cy.tick(1500); // 等待敌机生成
    });

    it('验证敌机子弹生成与移动', () => {
      cy.get('#enemyBullets .enemy-bullet').should('have.length.greaterThan', 0).then($bullets => {
        cy.wrap($bullets.first()).invoke('css', 'top').then(initialTop => {
          cy.tick(60);
          cy.wrap($bullets.first()).invoke('css', 'top').then(newTop => {
            expect(parseFloat(newTop)).to.be.greaterThan(parseFloat(initialTop));
          });
        });
      });
    });

    it('验证敌机子弹碰撞时触发玩家飞机抖动效果', () => {
      // 手动创建一个敌机子弹，使其位置与玩家飞机重合
      cy.window().then(win => {
        const bullet = win.document.createElement('div');
        bullet.className = 'enemy-bullet';
        bullet.style.position = 'absolute';
        bullet.style.width = '32px';
        bullet.style.height = '32px';
        bullet.style.left = '200px';
        bullet.style.top = '400px';
        win.document.getElementById('enemyBullets').appendChild(bullet);
      });
      // 模拟时间触发碰撞检测
      cy.tick(100);
      // 验证 body 的 transform 属性不为默认 "none"
      cy.get('body').invoke('css', 'transform').should('not.equal', 'none');
    });
  });
});
