// enemy_collision_spec.cy.js

// This test covers Batch Three: Enemy generation, enemy bullet firing, and collision detection
describe('Batch Three: Enemy Generation, Enemy Bullet Firing, and Collision Detection', () => {
    beforeEach(() => {
      // Visit the game page
      cy.visit('/Feb21-src/index.html');
      
      // Override the global getStyle method to return fixed sizes for key elements
      cy.window().then(win => {
        win.getStyle = function(ele, attr) {
          if (attr === 'width' || attr === 'height') {
            if (ele.id === 'game') return 600; // Fix game area to 600px
            if (ele.id === 'myPlane' || ele.id === 'myPlane2') return 50; // Fix plane size to 50px
            if (ele.className && ele.className.indexOf('e') !== -1) {
              // Enemy size based on enemyObj configuration, e.g., enemy1.width
              return attr === 'width' ? 76 : 50;
            }
            // For other elements, try reading inline styles
          }
          const styleVal = ele.style[attr];
          return styleVal ? parseFloat(styleVal) : 0;
        };
        
        // Force set fixed width and height for key DOM elements
        const gameEl = win.document.getElementById('game');
        if (gameEl) {
          gameEl.style.width = '600px';
          gameEl.style.height = '600px';
        }
        const planeEl = win.document.getElementById('myPlane');
        if (planeEl) {
          planeEl.style.width = '50px';
          planeEl.style.height = '50px';
        }
        
        // Update global variables to match the fixed sizes
        win.gameW = 600;
        win.gameH = 600;
        win.myPlaneW = 50;
        win.myPlaneH = 50;
        
        // Clear enemy and enemy bullet arrays (ensure a clean test environment)
        win.enemys = [];
        win.enemyBullets = [];
      });
      
      // Simulate entering the game: Click start, select single-player, enter a name
      cy.get('#startBtn').click();
      cy.get('#singleBtn').click();
      cy.get('#nameInput').type('Test Player{enter}');
      cy.get('#gameEnter').should('be.visible');
      cy.get('#myPlane').should('be.visible');
      
      // Start enemy generation and enemy bullet firing
      cy.window().then(win => {
        if (typeof win.startEnemySpawn === 'function') {
          win.startEnemySpawn();
        }
        if (typeof win.startEnemyFire === 'function') {
          win.startEnemyFire();
        }
      });
    });
    
    it('Tests if enemies spawn at predefined intervals', () => {
      // Wait for 2.2 seconds, then check if enemies have been generated in the #enemys container
      cy.wait(2200);
      cy.get('#enemys').children().should('have.length.greaterThan', 0);
    });
    
    it('Tests enemy bullet generation and downward movement', () => {
      // Wait enough time for enemies to spawn and fire bullets (around 3 seconds)
      cy.wait(3000);
      // Check if there are enemy bullets in the #enemyBullets container
      cy.get('#enemyBullets').children().should('have.length.greaterThan', 0);
      
      // Get the first enemy bullet, record its initial top value, then wait and check if it moves down
      cy.get('#enemyBullets').children().first().then($bullet => {
        const initTop = parseFloat($bullet.css('top'));
        cy.wait(100).then(() => {
          const newTop = parseFloat($bullet.css('top'));
          expect(newTop).to.be.greaterThan(initTop);
        });
      });
    });
    
    it('Tests player bullet collision with enemy (health deduction, explosion, and score increase)', () => {
      // Objective: Manually create an enemy and a player bullet at the same position to trigger collision detection
      cy.window().then(win => {
        // Manually create an enemy (using enemy1 configuration)
        const enemy = document.createElement('img');
        enemy.src = "image/enemy1.png";
        enemy.t = 1;
        enemy.score = 100;
        enemy.hp = 100;
        enemy.className = "e";
        enemy.style.left = "100px";
        enemy.style.top = "100px";
        win.enemysP.appendChild(enemy);
        win.enemys.push(enemy);
        // Start enemy movement (moveEnemy continuously checks for collisions)
        win.moveEnemy(enemy);
        
        // Manually create a player bullet at the same position as the enemy
        const bullet = document.createElement('div');
        bullet.className = "b";
        bullet.style.left = "100px";
        bullet.style.top = "100px";
        win.bulletsP.appendChild(bullet);
        win.bullets.push(bullet);
        win.moveBullet(bullet);
      });
      
      // Wait 500ms to ensure collision detection is processed
      cy.wait(500);
      cy.window().then(win => {
        // After collision, the enemy should be replaced with an explosion animation, i.e., src changes to "image/bz.gif"
        const enemyExploded = win.enemys.some(e => e.src && e.src.indexOf("bz.gif") !== -1);
        expect(enemyExploded).to.be.true;
        // Also, the score should increase (score > 0)
        expect(win.score).to.be.greaterThan(0);
      });
    });
    
    it('Tests enemy collision with player plane, causing health deduction or game over', () => {
      // Objective: Manually create an enemy overlapping the player plane to trigger collision detection and verify health deduction or game over
      // Override window.alert to prevent test blocking
      cy.window().then(win => {
        cy.stub(win, 'alert').as('alertStub');
      });
      
      cy.window().then(win => {
        // Manually create an enemy and place it at the player's position
        const enemy = document.createElement('img');
        enemy.src = "image/enemy1.png";
        enemy.t = 1;
        enemy.score = 100;
        enemy.hp = 100;
        enemy.className = "e";
        // Use the player's current coordinates
        enemy.style.left = win.plane1X + "px";
        enemy.style.top = win.plane1Y + "px";
        win.enemysP.appendChild(enemy);
        win.enemys.push(enemy);
        // Start enemy movement and collision detection
        win.moveEnemy(enemy);
      });
      
      // Wait 500ms to ensure collision processing is completed
      cy.wait(500).then(() => {
        cy.window().then(win => {
          // If player health drops to 0, the game should end (alert should be called)
          if (win.plane1Hp <= 0) {
            cy.get('@alertStub').should('have.been.called');
          } else {
            // Otherwise, check if player health has decreased
            expect(win.plane1Hp).to.be.lessThan(5);
          }
        });
      });
    });
  });
