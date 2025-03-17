// plane_and_bullet_spec.cy.js
describe('Player Plane Movement and Bullet Functionality Test - Final Solution', () => {
    beforeEach(() => {
      // Visit the page
      cy.visit('/Feb21-src/index.html');
  
      // Override the global getStyle method to ensure key elements return expected fixed width and height
      cy.window().then(win => {
        win.getStyle = function(ele, attr) {
          // For width and height, return fixed values
          if (attr === 'width' || attr === 'height') {
            if (ele.id === 'game') return 600;         // Game area 600px
            if (ele.id === 'myPlane' || ele.id === 'myPlane2') return 50; // Plane 50px
          }
          // Otherwise, try to read inline styles
          const styleVal = ele.style[attr];
          return styleVal ? parseFloat(styleVal) : 0;
        };
  
        // Forcefully set the width and height of DOM elements
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
        // Update global variables to ensure subsequent calculations are correct
        win.gameW = 600;
        win.gameH = 600;
        win.myPlaneW = 50;
        win.myPlaneH = 50;
      });
  
      // Enter the game process
      cy.get('#startBtn').click();
      cy.get('#singleBtn').click();
      cy.get('#nameInput').type('Test Player{enter}');
      cy.get('#gameEnter').should('be.visible');
      cy.get('#myPlane').should('be.visible');
  
      // Start the plane movement timer (if not automatically started)
      cy.window().then(win => {
        if (typeof win.startMovement === 'function') {
          win.startMovement();
        }
      });
    });
  
    it('Test upper boundary: If the player plane exceeds the upper boundary, it should reset to 0', () => {
      cy.window().then(win => {
        // Directly set plane1Y to a negative value to simulate exceeding the upper boundary
        win.plane1Y = -10;
        // Wait for a period to let the movement timer take effect (movement timer cycle 30ms)
        return cy.wait(50).then(() => {
          // According to the code logic, if plane1Y < 0, it should be reset to 0
          expect(win.plane1Y).to.equal(0);
        });
      });
    });
  
    it('Test lower boundary: If the player plane exceeds the lower boundary, it should reset to gameH - myPlaneH', () => {
      cy.window().then(win => {
        // Set plane1Y to a value greater than the allowed maximum (e.g., 600)
        win.plane1Y = 600;
        return cy.wait(50).then(() => {
          expect(win.plane1Y).to.equal(win.gameH - win.myPlaneH);
        });
      });
    });
  
    it('Test player bullet generation and upward movement', () => {
      cy.window().then(win => {
        // Clear existing bullets (if any)
        win.bullets.length = 0;
        win.bulletsP.innerHTML = '';
  
        // Directly call the exported createBulletForPlane function to simulate firing a bullet
        win.createBulletForPlane(win.myPlane, win.plane1X, win.plane1Y, win.myPlaneW, win.myPlaneH);
  
        // Confirm that the bullet is generated in the #bullets container
        cy.get('#bullets').children().should('have.length.at.least', 1);
  
        // Take the first bullet and check its initial top value
        cy.get('#bullets').children().first().then($bullet => {
          const initTop = parseFloat($bullet.css('top'));
          // After waiting 100ms, the bullet should move upward (top value decreases)
          return cy.wait(100).then(() => {
            const newTop = parseFloat($bullet.css('top'));
            expect(newTop).to.be.lessThan(initTop);
          });
        });
  
        // Wait longer to ensure the bullet is removed from the DOM after flying off the screen
        cy.wait(1000).then(() => {
          cy.get('#bullets').children().should('have.length', 0);
        });
      });
    });
  });
  