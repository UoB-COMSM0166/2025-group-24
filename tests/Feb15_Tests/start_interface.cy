/// <reference types="cypress" />

context('Utilities', () => {
  // 在每个测试用例执行前，访问指定页面
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
});
