// bullet_and_enemy.spec.js
describe('子弹与敌机交互测试', () => {
// 在 beforeEach 中固定设置全局变量和 getStyle
  beforeEach(() => {
    cy.visit('/Feb28-src/index.html');
    cy.window().then(win => {
      win.gameStatus = true;
      win.gameW = 600;
      win.gameH = 600;
      // 重写 getStyle 方法：直接返回写在 style 中的数值（如果没有，则返回 0）
      win.getStyle = function(ele, attr) {
        return parseFloat(ele.style[attr]) || 0;
      };
      // 清空相关容器和数组
      if(win.bulletsP) { win.bulletsP.innerHTML = ''; }
      if(win.enemysP) { win.enemysP.innerHTML = ''; }
      if(win.enemyBulletsP) { win.enemyBulletsP.innerHTML = ''; }
      win.bullets = [];
      win.enemys = [];
      win.enemyBullets = [];
    });
  });


  // ***********************************************
  // 测试子弹发射及清除逻辑
  // ***********************************************
  context('子弹发射测试', () => {
    it('测试 createBulletForPlane() 正确创建子弹并添加到 bulletsP 容器中', () => {
      cy.window().then(win => {
        const fixedX = 100, fixedY = 400, fixedW = 50, fixedH = 50;
        win.bulletW = 32;
        win.bulletH = 32;
        const initialCount = win.bullets.length;
        win.createBulletForPlane(null, fixedX, fixedY, fixedW, fixedH);
        expect(win.bullets.length).to.eq(initialCount + 1);
        cy.get('.b').should('have.length', initialCount + 1);
      });
    });

    it('测试 moveBullet() 在子弹超出屏幕后正确清除 DOM 和数组中的子弹', () => {
      cy.window().then(win => {
        win.bulletW = 32;
        win.bulletH = 32;
        win.createBulletForPlane(null, 100, 400, 50, 50);
        const bullet = win.bullets[win.bullets.length - 1];
        // 将子弹 top 设置为超出屏幕（例如 -42px，当 bulletH 为 32 时，条件 -42 <= -32 成立）
        if (bullet) {
          bullet.style.top = (-win.bulletH - 10) + "px";
        }
        // 调用 moveBullet()，让定时器检测并清除子弹
        win.moveBullet(bullet);
        // 等待足够时间让 mySetInterval 运行
        cy.wait(50).then(() => {
          expect(win.bullets).to.not.include(bullet);
          cy.wrap(bullet).should('not.exist');
        });
      });
    });
  });

  // ***********************************************
  // 测试敌机生成和移动逻辑
  // ***********************************************
  context('敌机生成与移动测试', () => {
    it('测试 createEnemy() 能按照概率生成不同类型的敌机并添加到 enemysP', () => {
      cy.window().then(win => {
        const initialCount = win.enemys.length;
        win.createEnemy();
        expect(win.enemys.length).to.eq(initialCount + 1);
        cy.get('.e').should('have.length', initialCount + 1);
      });
    });

    it('测试 moveEnemy() 正确让敌机向下移动，并在超出屏幕后移除', () => {
      cy.window().then(win => {
        win.createEnemy();
        const enemy = win.enemys[win.enemys.length - 1];
        if (enemy) {
          enemy.style.top = (win.gameH + 10) + "px";
        }
        win.moveEnemy(enemy);
        cy.wait(50).then(() => {
          expect(win.enemys).to.not.include(enemy);
          cy.wrap(enemy).should('not.exist');
        });
      });
    });
  });

  // ***********************************************
  // 测试子弹与敌机之间的碰撞检测逻辑
  // ***********************************************
  context('子弹碰撞检测测试', () => {
    it('测试 checkCollisionWithBullets() 正确检测子弹命中敌机，减少敌机血量；当血量 ≤ 0 时调用 killEnemy() 移除敌机', () => {
      cy.window().then(win => {
        win.createEnemy();
        const enemy = win.enemys[win.enemys.length - 1];
        if (enemy) {
          enemy.style.left = "100px";
          enemy.style.top = "100px";
          enemy.style.width = "50px";
          enemy.style.height = "50px";
          enemy.hp = enemy.hp || 100;
        }
        win.bulletW = 32;
        win.bulletH = 32;
        win.createBulletForPlane(null, 100, 150, 50, 50);
        const bullet = win.bullets[win.bullets.length - 1];
        if (bullet) {
          bullet.style.left = "100px";
          bullet.style.top = "100px";
          bullet.style.width = "32px";
          bullet.style.height = "32px";
        }
        const initialHp = enemy.hp;
        win.checkCollisionWithBullets(enemy);
        // 等待 killEnemy 的 mySetTimeout 完成
        cy.wait(600).then(() => {
          if (initialHp > 100) {
            expect(enemy.hp).to.be.lessThan(initialHp);
          } else {
            expect(win.enemys).to.not.include(enemy);
            cy.wrap(enemy).should('not.exist');
          }
          expect(win.bullets).to.not.include(bullet);
          cy.wrap(bullet).should('not.exist');
        });
      });
    });

    it('测试 checkBulletHitPlayer() 正确检测敌机子弹命中玩家，减少 plane1Hp/plane2Hp，当生命值为0时触发 doGameOver()', () => {
      cy.window().then(win => {
        // 固定设置玩家1属性：初始生命值、位置和尺寸
        win.plane1Hp = 100;
        win.plane1X = 250;
        win.plane1Y = 400;
        const playerElem = win.myPlane;
        if (playerElem) {
          playerElem.style.left = "250px";
          playerElem.style.top = "400px";
          playerElem.style.width = "50px";
          playerElem.style.height = "50px";
        }
        
        // 初始化 heartsContainer，写死添加一个红心，确保 loseHeart() 调用时不会出错
        if (win.heartsContainer) {
          win.heartsContainer.innerHTML = ''; // 清空内容
          const heart = document.createElement('div');
          heart.className = 'heart';
          win.heartsContainer.appendChild(heart);
        }
        
        // 直接创建一个假的敌机子弹元素，而不是调用 createBulletForEnemy
        const enemyBullet = document.createElement("div");
        enemyBullet.className = "enemy-bullet";
        enemyBullet.style.left = "250px";
        enemyBullet.style.top = "400px";
        enemyBullet.style.width = "32px";
        enemyBullet.style.height = "32px";
        // 手动添加到全局 enemyBullets 数组和 DOM 容器中
        win.enemyBullets.push(enemyBullet);
        if (win.enemyBulletsP) {
          win.enemyBulletsP.appendChild(enemyBullet);
        }
        
        const initialHp = win.plane1Hp;
        // 调用检测函数，触发 loseHeart() 等操作
        win.checkBulletHitPlayer(enemyBullet);
        // 检查玩家生命值是否减少
        expect(win.plane1Hp).to.be.lessThan(initialHp);
        // 若生命值降为 0，则页面应出现游戏结束标识（例如 id 为 gameOver 的元素）
        if (win.plane1Hp <= 0) {
          cy.get('#gameOver').should('exist');
        }
        // 命中的敌机子弹应被移除
        expect(win.enemyBullets).to.not.include(enemyBullet);
        cy.wrap(enemyBullet).should('not.exist');
      });
    });    
  });
});
