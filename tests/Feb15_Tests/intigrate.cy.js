/// <reference types="cypress" />

context('Utilities', () => {
  // 在每个测试用例执行前，访问指定的页面
  beforeEach(() => {
    cy.visit('/index.html'); // 这里因为我已经配置了cypress.config，所以直接使用相对路径
  });

  it('测试首页按钮及模式选择流程（单人模式）', () => {
    // 确认首页显示
    cy.get('#homePage').should('be.visible');
    // 点击开始按钮
    cy.get('#startBtn').click();
    // 确认首页隐藏，模式选择界面显示
    cy.get('#homePage').should('not.be.visible');
    cy.get('#selectMode').should('be.visible');
    // 选择单人模式
    cy.get('#singleBtn').click();
    // 确认进入输入姓名界面
    cy.get('#enterName').should('be.visible');
    cy.get('#nameHint').should('contain', 'Please enter your name');
    // 输入玩家姓名并按回车
    cy.get('#nameInput').type('测试玩家{enter}');
    // 确认输入姓名界面隐藏，游戏界面显示
    cy.get('#enterName').should('not.be.visible');
    cy.get('#gameEnter').should('be.visible');
    // 确认玩家信息显示正确
    cy.get('#playerInfo').should('contain', 'Player(测试玩家)');
  });

  it('测试键盘控制：移动、发射子弹、暂停/恢复', () => {
    // 点击开始按钮
    cy.get('#startBtn').click();
    // 选择单人模式
    cy.get('#singleBtn').click();
    // 输入玩家姓名并按回车
    cy.get('#nameInput').type('玩家1{enter}');
    // 确认游戏界面显示
    cy.get('#gameEnter').should('be.visible');
    // 确认玩家飞机显示
    cy.get('#myPlane').should('be.visible');
    // 模拟按下“d”键（向右移动）
    cy.get('body').trigger('keydown', { key: 'd', code: 'KeyD', keyCode: 68 });
    cy.wait(100); // 等待 100ms 让定时器更新
    cy.get('#myPlane').then(($el) => {
      // 获取飞机的 left 样式值，判断是否已经右移
      const leftBefore = parseFloat($el.css('left'));
      expect(leftBefore).to.be.greaterThan(0);
    });
    // 模拟按下 "f" 键发射子弹（玩家1）
    cy.get('body').trigger('keydown', { key: 'f', code: 'KeyF', keyCode: 70 });
    // 检查子弹容器中是否添加了子弹元素（子弹 class 为 "b"）
    cy.get('#bullets .b').should('have.length.greaterThan', 0);
    // 模拟按下空格键暂停游戏
    cy.get('body').trigger('keydown', { key: ' ', code: 'Space', keyCode: 32 });
    // 暂停后，暂停提示应显示
    cy.get('#pauseTip').should('be.visible');
    // 模拟再次按下空格键恢复游戏
    cy.get('body').trigger('keydown', { key: ' ', code: 'Space', keyCode: 32 });
    cy.get('#pauseTip').should('not.be.visible');
  });

  it('测试排行榜页面切换', () => {
    // 点击排行榜按钮
    cy.get('#rankBtn').click();
    // 确认排行榜界面显示
    cy.get('#rankPanel').should('be.visible');
    // 点击返回按钮
    cy.get('#backBtn').click();
    // 确认返回首页
    cy.get('#homePage').should('be.visible');
  });

});
