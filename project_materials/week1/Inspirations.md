GROUP 24

## Game 1: Fruit Catcher

### 1. Game Description
"Fruit Catcher" is a single-player arcade game where players control a basket to catch falling fruits while avoiding bombs.

- Objective: Earn points by catching fruits within 60 seconds while avoiding bombs that reduce points or end the game.  
- Controls: Move the basket horizontally using arrow keys or 'A' and 'D'.  
- Gameplay Mechanics:  
  - Fruits fall randomly at varying speeds, adding unpredictability.  
  - Occasionally, bombs appear as obstacles.  
- User Interface:  
  - The score is displayed in the top-left corner, and a timer is shown on the top-right.  
  - Includes a start screen with instructions and a game-over screen showing the final score and a restart option.  

### 2. Innovations
1. Power-Ups: Special fruits grant bonuses like temporary basket enlargement, slower object speed, or extra points, enhancing gameplay variety.  
2. Dynamic Themes: Background visuals and fruit types change with levels or time of day, creating visual freshness.  
3. Local Leaderboard: High scores are stored locally, promoting competition and replayability.

### 3. Key Technical Challenges
1. Collision Detection: Accurately detect when falling objects (fruits or bombs) overlap with the basket, especially with multiple objects on-screen.  
2. Managing Multiple Falling Objects: Handle the real-time movement, interaction, and removal of numerous objects efficiently.

### 4. Preliminary Solutions
- Collision Detection: Use bounding box calculations or `dist()` function to detect overlaps.  
- Object Management: Use arrays to store object properties (position, speed, type) and update these dynamically within the `draw()` loop.

### 5. Development Workflow and Testing
- Phase 1: Prototyping: Create a simple setup with one basket and one falling fruit. Test movement and object interactions.  
- Phase 2: Feature Implementation: Add multiple fruits, bombs, scoring, and timers. Verify all interactions and scoring logic.  
- Phase 3: Adding Innovations: Implement power-ups, dynamic backgrounds, and leaderboard functionality.  
- Phase 4: Final Testing: Refine visuals, improve performance, and add sound effects. Conduct thorough playtesting to ensure smooth gameplay.

### 6. Feasibility Analysis
- Technical Feasibility: p5.js supports essential features like rendering, collision detection, and input handling.  
- Supporting Tools:  
  - `p5.sound` for sound effects and music.  
  - Local Storage API for leaderboard implementation.  
- Inspiration: Similar catch-and-avoid games implemented in p5.js demonstrate feasibility.

---

## Game 2: Plane Shooter: Battle for the Skies

### 1. Game Description
"Battle for the Skies" is a 2D side-scrolling shooting game that combines classic gameplay with Roguelike elements for enhanced replayability.

- Objective: Eliminate enemy planes and survive their attacks while progressing through increasingly difficult levels.  
- Controls:  
  - Single-Player Mode: Arrow keys for movement and spacebar to fire.  
  - Two-Player Mode:  
    - Player 1: Arrow keys for movement and spacebar to fire.  
    - Player 2: 'W', 'A', 'S', 'D' for movement and 'F' to fire.  
- Gameplay Mechanics: Players encounter diverse enemies with unique behaviors, collect power-ups, and upgrade weapons.

### 2. Innovations
1. Two-Player Modes: Includes cooperative and competitive gameplay, allowing players to collaborate or compete on the same screen.  
2. Customizable Aircraft: Players can unlock different plane models and weapon systems, adding depth and strategy.  
3. Dynamic Backgrounds: Backgrounds evolve as levels progress, enhancing immersion.

### 3. Key Technical Challenges
1. Dynamic Rendering: Maintaining smooth visuals for planes, bullets, explosions, and dynamic backgrounds without performance loss.  
2. Multi-Input Handling: Managing independent inputs for two players simultaneously.

### 4. Preliminary Solutions
- Dynamic Rendering:  
  - Use p5.js's `draw()` function to redraw only necessary elements each frame.  
  - Optimize calculations by updating object states only when needed.  
  - Use `frameRate()` to set a target of 60 FPS for consistent performance.  
- Multi-Input Handling:  
  - Assign unique keys to each player and use `keyPressed()` and `keyReleased()` for responsive controls.  
  - Test combinations of input methods (e.g., shared keyboard or separate devices).

### 5. Development Workflow and Testing
- Phase 1: Prototyping: Build a basic single-player setup with one plane, enemies, and shooting mechanics.  
- Phase 2: Feature Implementation: Add multiple enemies, levels, power-ups, and advanced shooting mechanics.  
- Phase 3: Multiplayer Integration: Implement cooperative and competitive two-player modes. Ensure input conflicts are resolved.  
- Phase 4: Final Testing: Refine rendering, add sound effects, and test for balance in multiplayer gameplay.

### 6. Feasibility Analysis
- Technical Feasibility:  
  - p5.js supports real-time rendering and input handling, ideal for a fast-paced shooting game.  
- Supporting Tools:  
  - `p5.sound` for sound effects.  
  - `frameRate()` and efficient `draw()` logic to maintain high frame rates.  
- Inspiration: Classic arcade shooters and Roguelike mechanics provide a solid foundation for implementation.

---

## Game 3: Synthetic Watermelon

### 1. Game Description
"Synthetic Watermelon" is a puzzle game where players merge identical fruits into larger fruits until a watermelon is created.

- Objective: Strategically combine fruits to maximize merges. The game ends when the screen is filled and no moves remain.  
- Controls: Drag and drop fruits using the mouse.  
- Gameplay Mechanics:  
  - Fruits appear randomly. Matching fruits merge into larger ones.  
  - Special tools like hammers and time machines allow players to manage the screen effectively.

### 2. Innovations
1. Special Fruits: Include unique effects like bomb fruits (clear areas) and transform fruits (change types).  
2. Strategic Tools: Add hammers for removing fruits and time machines for undoing moves.  
3. Enhanced Visuals: Introduce juicy collision effects and dynamic soundtracks for different themes.

### 3. Key Technical Challenges
1. Collision Physics: Ensuring smooth and realistic merging of fruits with accurate positioning.  
2. State Management: Efficiently saving and restoring game states for the undo feature.

### 4. Preliminary Solutions
- Collision Physics: Use p5.js physics tools to calculate merging behavior and resting positions.  
- State Management: Implement a stack-based system to store previous game states, minimizing memory usage while capturing necessary details.

### 5. Development Workflow and Testing
- Phase 1: Prototyping: Create basic drag-and-drop functionality and a simple merging mechanic.  
- Phase 2: Feature Implementation: Add special fruits, strategic tools, and scoring mechanics.  
- Phase 3: Effects and Undo System: Integrate collision effects and implement the time machine tool.  
- Phase 4: Final Testing: Balance gameplay difficulty, optimize rendering, and enhance visuals.

### 6. Feasibility Analysis
- Technical Feasibility:  
  - p5.js supports the necessary rendering, physics, and input handling.  
- Supporting Tools:  
  - Physics logic for collisions.  
  - Stack-based systems for state restoration.  
- Inspiration: Popular merge-and-grow puzzle games provide a framework for innovative customization.

---

During this process, every team member contributed innovative ideas, and we share interest in everyone's proposals. Considering feasibility, We ranked the plans: Fruit Catcher (manageable while prospective for future enhancements), Plane Shooter (more complex but exciting multiplayer), Synthetic Watermelon (most challenging, innovative). Everyone was enthusiastic, collaborative, and driven to contribute, reflecting shared passion for creative problem-solving.
