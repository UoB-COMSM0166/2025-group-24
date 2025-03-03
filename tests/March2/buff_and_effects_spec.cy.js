/// <reference types="cypress" />

/**
 * 最终测试代码：
 * 1. 使用 onBeforeLoad 写死全局变量与 getStyle（如上修改）。
 * 2. 在页面加载后，设置 window.__TEST_CLOCK__ 为 cy.clock 的返回值，
 *    确保后续所有 timer 调用（通过 timer.js 模块）都由 Cypress 时钟控制。
 */

beforeEach(() => {
  cy.visit('/Feb28-src/index.html', {
    onBeforeLoad(win) {
      // 写死全局变量
      win.gameW = 600;
      win.gameH = 600;
      win.gameStatus = true;
      // 使用改造后的 getStyle（测试环境下直接读取 inline style）
      win.getStyle = (ele, attr) => {
        if (ele && ele.style && ele.style[attr]) {
          return parseFloat(ele.style[attr]);
        }
        if (attr === 'left' || attr === 'top') return 0;
        if (attr === 'width' || attr === 'height') return 50;
        return 0;
      };
      // 固定玩家飞机位置与尺寸
      win.plane1X = 200;
      win.plane1Y = 200;
      win.myPlaneW = 50;
      win.myPlaneH = 50;
      // 清空盾、宝藏、迷雾容器
      let shield1 = win.document.getElementById('plane1Shield');
      if (shield1) shield1.style.display = 'none';
      let tc = win.document.getElementById('treasureContainer');
      if (tc) tc.innerHTML = '';
      let fc = win.document.getElementById('fogContainer');
      if (fc) fc.innerHTML = '';
      // 重置 Buff 状态
      win.plane1ShieldActive = false;
      win.player1SpeedFactor = 1.0;
      win.bulletSpeedFactor = 1.0;
      win.enemySpeedFactor = 1.0;
      win.enemyDamageFactor = 1.0;
      win.SHIELD_DURATION = 5000;
    }
  }).then(win => {
    // 设置测试用的时钟（要求源代码使用 timer.js 中的 mySetTimeout 等函数）
    win.__TEST_CLOCK__ = cy.clock(0, ['setTimeout','setInterval'], win);
  });
});

it('应根据回合概率掉落宝藏，并调用 moveTreasure()', () => {
  cy.window().then(win => {
    // 创建模拟 enemy，直接设置 inline style
    const enemy = win.document.createElement('div');
    enemy.style.left = '150px';
    enemy.style.top = '100px';
    win.currentRound = 3; // dropProb = 0.40
    cy.stub(win.Math, 'random').returns(0.1);
    win.dropTreasure(enemy);
    const tc = win.document.getElementById('treasureContainer');
    expect(tc.children.length).to.be.greaterThan(0);
    const treasure = tc.children[0];
    expect(parseFloat(treasure.style.left)).to.equal(150);
    expect(parseFloat(treasure.style.top)).to.equal(100);
  });
});

it('应让宝藏向下移动，并在出屏后移除', () => {
  cy.window().then(win => {
    // 创建宝藏，初始 top 为 590px
    const treasure = win.document.createElement('div');
    treasure.className = 'treasure';
    treasure.style.top = '590px';
    treasure.style.left = '200px';
    const tc = win.document.getElementById('treasureContainer');
    tc.appendChild(treasure);
    win.moveTreasure(treasure);
    // 快进足够时间
    cy.tick(5001);
    expect(tc.contains(treasure)).to.be.false;
  });
});

it('应检测到玩家拾取宝藏并调用 applyTreasureEffect()', () => {
  cy.window().then(win => {
    const spyApply = cy.spy(win, 'applyTreasureEffect').as('applySpy');
    const treasure = win.document.createElement('div');
    treasure.className = 'treasure';
    treasure.style.left = '200px';
    treasure.style.top = '200px';
    treasure.style.width = '50px';
    treasure.style.height = '50px';
    const tc = win.document.getElementById('treasureContainer');
    tc.appendChild(treasure);
    win.checkTreasureHitPlayer(treasure);
    expect(spyApply).to.have.been.calledWith(1);
    expect(tc.contains(treasure)).to.be.false;
  });
});

context('applyTreasureEffect 各种 Buff 效果', () => {
  it('护盾 Buff：激活后 5 秒内显示护盾，之后隐藏', () => {
    cy.window().then(win => {
      cy.stub(win.Math, 'random').returns(0.1);
      win.plane1ShieldActive = false;
      const shield = win.document.getElementById('plane1Shield');
      shield.style.display = 'none';
      win.applyTreasureEffect(1);
      expect(win.plane1ShieldActive).to.be.true;
      expect(shield.style.display).to.equal('block');
      cy.tick(5001);
      expect(win.plane1ShieldActive).to.be.false;
      expect(shield.style.display).to.equal('none');
    });
  });

  it('速度 Buff：提升玩家移动速度 5 秒后恢复', () => {
    cy.window().then(win => {
      cy.stub(win.Math, 'random').returns(0.3);
      win.player1SpeedFactor = 1.0;
      win.applyTreasureEffect(1);
      expect(win.player1SpeedFactor).to.equal(1.5);
      cy.tick(5001);
      expect(win.player1SpeedFactor).to.equal(1.0);
    });
  });

  it('子弹 Buff：提升子弹速度 5 秒后恢复', () => {
    cy.window().then(win => {
      cy.stub(win.Math, 'random').returns(0.55);
      win.bulletSpeedFactor = 1.0;
      win.applyTreasureEffect(1);
      expect(win.bulletSpeedFactor).to.equal(1.5);
      cy.tick(5001);
      expect(win.bulletSpeedFactor).to.equal(1.0);
    });
  });

  it('敌机加速 Buff：提升敌机速度 5 秒后恢复', () => {
    cy.window().then(win => {
      cy.stub(win.Math, 'random').returns(0.75);
      win.enemySpeedFactor = 1.0;
      win.applyTreasureEffect(1);
      expect(win.enemySpeedFactor).to.equal(1.5);
      cy.tick(5001);
      expect(win.enemySpeedFactor).to.equal(1.0);
    });
  });

  it('迷雾 Buff：生成迷雾 5 秒后消失', () => {
    cy.window().then(win => {
      cy.stub(win.Math, 'random').returns(0.85);
      const fc = win.document.getElementById('fogContainer');
      fc.innerHTML = '';
      win.applyTreasureEffect(1);
      expect(fc.children.length).to.be.greaterThan(0);
      cy.tick(5001);
      expect(fc.innerHTML).to.equal('');
    });
  });

  it('敌机伤害 Buff：提升敌机伤害 5 秒后恢复', () => {
    cy.window().then(win => {
      cy.stub(win.Math, 'random').returns(0.95);
      win.enemyDamageFactor = 1.0;
      win.applyTreasureEffect(1);
      expect(win.enemyDamageFactor).to.equal(1.5);
      cy.tick(5001);
      expect(win.enemyDamageFactor).to.equal(1.0);
    });
  });
});
