// buff_and_bg_spec.cy.js

describe('批次四：Buff 效果与背景滚动 测试 (最终方案)', () => {
  beforeEach(() => {
    // 使用 onBeforeLoad 仅用于设置全局变量，不调用任何 cy 命令
    cy.visit('/Feb21-src/finaltest.html', {
      onBeforeLoad(win) {
        // 确保定时器调用使用全局 window.setTimeout / setInterval
        win.setTimeout = win.window.setTimeout;
        win.setInterval = win.window.setInterval;
        // 设置 gameStatus 为 true，确保相关逻辑执行
        win.gameStatus = true;
      }
    }).then((win) => {
      // 访问完成后，安装 Cypress 时钟，让所有定时器都能受控
      cy.clock(win);
      // 覆盖 getStyle 方法，确保返回固定值
      win.getStyle = function (ele, attr) {
        if (attr === 'width' || attr === 'height') {
          if (ele.id === 'game') return 600;
          if (ele.id === 'myPlane' || ele.id === 'myPlane2') return 50;
          if (ele.id === 'fogContainer' || ele.id === 'buffContainer') return 600;
        }
        const styleVal = ele.style[attr];
        return styleVal ? parseFloat(styleVal) : 0;
      };
      // 更新全局变量与固定值一致
      win.gameW = 600;
      win.gameH = 600;
      win.myPlaneW = 50;
      win.myPlaneH = 50;
      // 确保护盾初始为隐藏
      const shield = win.document.getElementById('plane1Shield');
      if (shield) {
        shield.style.display = 'none';
      }
      win.plane1ShieldActive = false;
    });
  });

  context('测试 Buff 效果', () => {
    it('测试宝藏掉落和拾取逻辑（固定随机数使宝藏必定掉落）', () => {
      cy.window().then((win) => {
        // 设置当前回合为 2，使掉落概率为 0.30
        win.currentRound = 2;
        // 固定 Math.random 返回 0.1（小于 0.30），保证掉落宝藏
        const stubRandom = cy.stub(win.Math, 'random').returns(0.1);

        // 创建一个模拟 enemy 元素，设置固定位置和尺寸（内联样式）
        const enemy = win.document.createElement('div');
        enemy.style.left = '100px';
        enemy.style.top = '200px';
        enemy.style.width = '50px';
        enemy.style.height = '50px';

        // 调用掉落宝藏的函数
        win.dropTreasure(enemy);

        // 检查宝藏是否已经被添加到 treasureContainer 中
        const treasureContainer = win.document.getElementById('treasureContainer');
        expect(treasureContainer.childNodes.length).to.be.greaterThan(0);

        // 恢复 Math.random
        stubRandom.restore();
      });
    });

    it('测试 activateShield：护盾显示与定时隐藏', () => {
      cy.window().then((win) => {
        const shield = win.document.getElementById('plane1Shield');
        shield.style.display = 'none';
        win.plane1ShieldActive = false;

        // 调用 activateShield，传入玩家1的 id
        win.activateShield(1);

        // 激活后护盾应显示
        expect(shield.style.display).to.equal('block');
        expect(win.plane1ShieldActive).to.be.true;

        // 使用 cy.tick 模拟 SHIELD_DURATION 时间后（加一点余量）
        const duration = win.SHIELD_DURATION || 5000;
        cy.tick(duration + 50);
        // 检查护盾是否隐藏
        expect(shield.style.display).to.equal('none');
        expect(win.plane1ShieldActive).to.be.false;
      });
    });

    it('测试 boostPlayerSpeed 及其恢复效果', () => {
      cy.window().then((win) => {
        win.player1SpeedFactor = 1.0;
        win.boostPlayerSpeed(1);
        expect(win.player1SpeedFactor).to.equal(1.5);
        cy.tick(5000 + 50);
        expect(win.player1SpeedFactor).to.equal(1.0);
      });
    });

    it('测试 boostBulletSpeed、increaseEnemyDamage 和 boostEnemySpeed Buff', () => {
      cy.window().then((win) => {
        win.bulletSpeedFactor = 1.0;
        win.boostBulletSpeed();
        expect(win.bulletSpeedFactor).to.equal(1.5);
        cy.tick(5000 + 50);
        expect(win.bulletSpeedFactor).to.equal(1.0);

        win.enemyDamageFactor = 1.0;
        win.increaseEnemyDamage();
        expect(win.enemyDamageFactor).to.equal(1.5);
        cy.tick(5000 + 50);
        expect(win.enemyDamageFactor).to.equal(1.0);

        win.enemySpeedFactor = 1.0;
        win.boostEnemySpeed();
        expect(win.enemySpeedFactor).to.equal(1.5);
        cy.tick(5000 + 50);
        expect(win.enemySpeedFactor).to.equal(1.0);
      });
    });

    it('测试 showFog：生成雾块并在 5000ms 后清空', () => {
      cy.window().then((win) => {
        const fogContainer = win.document.getElementById('fogContainer');
        fogContainer.innerHTML = '';
        win.showFog();
        expect(fogContainer.childNodes.length).to.be.greaterThan(0);
        cy.tick(5000 + 50);
        expect(fogContainer.innerHTML).to.equal('');
      });
    });

    it('测试 showBuff：提示显示并在持续时间后自动消失', () => {
      cy.window().then((win) => {
        const buffContainer = win.document.getElementById('buffContainer');
        buffContainer.innerHTML = '';
        buffContainer.style.display = 'none';

        win.showBuff("测试Buff", 5000);
        expect(buffContainer.style.display).to.equal('block');
        expect(buffContainer.childNodes.length).to.be.greaterThan(0);
        cy.tick(5000 + 50);
        expect(buffContainer.childNodes.length).to.equal(0);
        expect(buffContainer.style.display).to.equal('none');
      });
    });
  });

  context('测试背景滚动效果', () => {
    it('测试 bgMove：背景位置不断更新并在超出后重置', () => {
      cy.window().then((win) => {
        const gameEl = win.document.getElementById('game');
        win.bgPosY = 0;
        gameEl.style.backgroundPositionY = '0px';

        win.bgMove();
        cy.tick(300);
        const pos1 = parseFloat(gameEl.style.backgroundPositionY);
        expect(pos1).to.be.greaterThan(0);

        // 模拟背景接近底部，手动设置 bgPosY 接近 gameH
        win.gameH = 600;
        win.bgPosY = 598;
        gameEl.style.backgroundPositionY = '598px';
        cy.tick(50);
        const pos2 = parseFloat(gameEl.style.backgroundPositionY);
        expect(pos2).to.equal(0);
      });
    });
  });
});
