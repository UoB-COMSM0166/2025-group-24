// ui_and_flow_spec.js

/// <reference types="cypress" />

// This test file is primarily used to verify the interface display after page loading, button clicks, and the interface switching process after entering the player's name

describe('UI Initialization and Game Flow Management Tests', () => {

  // Before each test case, load the game homepage index.html
  beforeEach(() => {
      // Modify to the actual access path of local project
      cy.visit('/Feb21-src/index.html');
  });

  it('Initial page displays correctly: homepage is visible, leaderboard, mode selection, etc., are hidden', () => {
      // Check if the homepage div is visible
      cy.get('#homePage').should('be.visible');
      // Check that the leaderboard, mode selection, name input, and game interface are all hidden
      cy.get('#rankPanel').should('not.be.visible');
      cy.get('#selectMode').should('not.be.visible');
      cy.get('#enterName').should('not.be.visible');
      cy.get('#gameEnter').should('not.be.visible');
  });

  it('After clicking the start button, the homepage hides, and the mode selection interface appears', () => {
      // Simulate clicking the "Start" button
      cy.get('#startBtn').click();
      // Homepage hides
      cy.get('#homePage').should('not.be.visible');
      // Mode selection interface appears
      cy.get('#selectMode').should('be.visible');
  });

  it('Single-player mode flow: enter player name and enter the game', () => {
      // Click the start button and select single-player mode
      cy.get('#startBtn').click();
      cy.get('#selectMode').should('be.visible');
      cy.get('#singleBtn').click();

      // Check if the prompt text in single-player mode is displayed correctly (set by ui&event.js)
      cy.get('#nameHint').should('contain', 'Please enter your name');

      // Simulate entering a name in the player name input box and pressing Enter
      cy.get('#nameInput')
          .type('Alice{enter}');

      // Check that the input box hides, and the game entry interface appears
      cy.get('#enterName').should('not.be.visible');
      cy.get('#gameEnter').should('be.visible');
      // Check that the player information text displays the single-player mode prompt
      cy.get('#playerInfo').should('contain', 'Player(Alice)');
      // Check that the player's plane DOM is visible
      cy.get('#myPlane').should('be.visible');
  });

  it('Two-player mode flow: sequentially enter two player names and enter the game', () => {
      // Click the start button and select two-player mode
      cy.get('#startBtn').click();
      cy.get('#selectMode').should('be.visible');
      cy.get('#doubleBtn').click();

      // Check the prompt text in two-player mode (first player's name input prompt)
      cy.get('#nameHint').should('contain', "first player's name");

      // Simulate the first player entering a name and pressing Enter
      cy.get('#nameInput')
          .type('Alice{enter}');

      // After the first input box hides, the second input box should appear
      cy.get('#enterName').should('not.be.visible');
      cy.get('#enterName2').should('be.visible');

      // Simulate the second player entering a name and pressing Enter
      cy.get('#nameInput2')
          .type('Bob{enter}');

      // Both input boxes hide, and the game entry interface appears
      cy.get('#enterName2').should('not.be.visible');
      cy.get('#gameEnter').should('be.visible');
      // Check that the player information text displays the two-player mode prompt
      cy.get('#playerInfo').should('contain', 'P1(Alice) & P2(Bob)');
      // Check the display status of the two planes
      cy.get('#myPlane').should('be.visible');
      cy.get('#myPlane2').should('be.visible');
  });

  it('Round prompt popup appears and automatically hides', () => {
      // Before entering the game, simulate the single-player mode flow
      cy.get('#startBtn').click();
      cy.get('#selectMode').should('be.visible');
      cy.get('#singleBtn').click();
      cy.get('#nameInput').type('Alice{enter}');

      // Check that the round prompt popup (roundPopup) is initially visible
      cy.get('#roundPopup').should('be.visible')
          // Check the popup text, based on the current round (initially ROUND ONE)
          .should('contain', 'ROUND ONE');

      // Wait 2100ms to ensure the prompt popup automatically hides
      cy.wait(2100);
      cy.get('#roundPopup').should('not.be.visible');
  });

  it('Leaderboard button and back button tests', () => {
      // On the homepage, click the leaderboard button to enter the leaderboard interface
      cy.get('#rankBtn').click();
      cy.get('#rankPanel').should('be.visible');
      cy.get('#homePage').should('not.be.visible');

      // In the leaderboard interface, click the back button to return to the homepage
      cy.get('#backBtn').click();
      cy.get('#homePage').should('be.visible');
      cy.get('#rankPanel').should('not.be.visible');
  });
});
