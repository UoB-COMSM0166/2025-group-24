# 2025-group-24
2025 COMSM0166 group 24

## Your Game

Link to your game [PLAY HERE](https://peteinfo.github.io/COMSM0166-project-template/)

Your game lives in the [/docs](/docs) folder, and is published using Github pages to the link above.

Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)

## Your Group

Add a group photo here!
![group_photo](https://github.com/user-attachments/assets/4cc80d67-6f17-4c88-a464-6f2fe2500443)

| Name         | Email                    | Username    | Role                  |
|-------------|--------------------------|------------|-----------------------|
| Xinjie Gao  | [id24861@bristol.ac.uk](mailto:id24861@bristol.ac.uk)  | Gracie-Gao | Software Test Engineer |
| Zibin Liu   | [ys24930@bristol.ac.uk](mailto:ys24930@bristol.ac.uk)  | ZibinLiu   | Project Manager       |
| Xiaobo Ma   | [oa24686@bristol.ac.uk](mailto:oa24686@bristol.ac.uk)  | XiaoboMa1  | Software Test Engineer |
| Kailin Fang | [jd24317@bristol.ac.uk](mailto:kfnora398@gmail.com)      | catlin518  | UI Designer           |
| Yanhao He   | [ei24967@bristol.ac.uk](mailto:ei24967@bristol.ac.uk)  | YanHe225   | Developer             |
| Gongyu Xue  | [in24247@bristol.ac.uk](mailto:in24247@bristol.ac.uk)  | xgy56      | Developer             |

## Project Report

### Introduction

- 5% ~250 words 
- Describe your game, what is based on, what makes it novel? 

### Requirements 

- 15% ~750 words
- Use case diagrams, user stories. Early stages design. Ideation process. How did you decide as a team what to develop?

### 1. List of Stakeholders

- **Players:**  
  Expect a smooth gaming experience with challenging level designs and diverse weapon upgrade systems, enhancing the game's fun and sense of achievement.
- **Development Team:**  
  Aim to maintain clean and structured code, making it easy to maintain and expand with new features such as additional levels and multiplayer modes.
- **Product Manager:**  
  Hope the game is easy to learn, suitable for players of different age groups, with engaging gameplay that keeps players active for a long time.
- **Testers:**  
  Ensure the game runs stably, with no critical bugs, and smoothly supports both single-player and multiplayer modes to optimize the user experience.


### 2. User Stories & Acceptance Criteria

| **User Story** | **Acceptance Criteria** |
|----------------|--------------------------|
| **Epic 1: Core Gameplay** | |
| As a player, I want to control the airplane’s movement so that I can dodge enemy bullets and attack flexibly. | Given the airplane is in motion, when the player presses directional keys, then the airplane should respond smoothly without lag. |
| As a player, I want my airplane to gain points after shooting down an enemy airplane so that I can track my progress. | Given my airplane is in the game, when I successfully shoot down an enemy airplane, then I should gain points reflected in the score counter. |
| As a player, I want the airplane to lose health when hit by enemy bullets or crashes into enemy planes so that the game’s challenge increases. | Given the airplane has health points, when it is hit by bullets or crashes, then its health should decrease accordingly. |
| As a player, I want to unlock the next level after defeating a wave of enemy planes so that I can experience higher difficulty challenges. | Given the current wave is cleared, when the completion condition is met, then the next level should automatically unlock. |
| As a player, I want to play with friends on the same device for co-op mode so that I can increase fun. | Given I am on the game’s main menu, when I select the co-op mode option, then the game should allow two players to join on the same device. |
| **Epic 2: Game Interface & UX Optimization** | |
| As a player, I want to pause the game anytime so that I can take breaks without losing my progress. | Given the game is running, when the player presses pause, then the game should freeze. |
| As a player, I want to view historical high scores after the game ends so that I can motivate myself to improve. | Given the game has ended, when the player accesses the scoreboard, then the historical high scores should be displayed. |
| As a player, I want to switch between different game backgrounds so that I can enhance visual experience and freshness. | Given the settings menu is open, when the player selects a background, then the game should update the background. |
| As a game designer, I want to adjust the difficulty curve of each level so that the game remains challenging yet fair for all players. | Given the game’s progression system, when a player advances through levels, then the difficulty should increase gradually. |

### 3. Reflection

In the process of developing the airplane battle mini game, our team learned a lot about requirements analysis from Epics and User Stories. Here are our key takeaways:

Firstly, we realize the importance of requirement decomposition. By refining the requirements into specific user stories, we have helped define the core gameplay and additional features more clearly, making the developers' design goals more specific.

Secondly, we recognize that the clarity of acceptance criteria is crucial. While writing user stories, we have defined acceptance criteria for each story to ensure that the developed features meet the expected results.

Thirdly, we realize that a multi-stakeholder perspective is crucial for product development. Through stakeholder analysis, we realized that we need to not only consider the gaming experience of players, but also pay attention to the technical implementation difficulty of the development team and the expectations of product managers for market positioning, to ensure that the game can meet the needs of different stakeholders.

### Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams.
## Class Diagram
![Class Diagram](images/class.png)

## Sequence Diagram
![Sequence Diagram](images/sequence.png)

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the three areas of challenge in developing your game. 

### Evaluation

- 15% ~750 words

- One qualitative evaluation (your choice) 

- One quantitative evaluation (of your choice) 

- Description of how code was tested. 

### Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools did you use. Did you have team roles? Reflection on how you worked together. 

### Conclusion

- 10% ~500 words

- Reflect on project as a whole. Lessons learned. Reflect on challenges. Future work. 

### Contribution Statement

- Provide a table of everyone's contribution, which may be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Let us know as soon as possible if there are any issues with teamwork as soon as they are apparent. 

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5%) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.

- **Documentation** of code (5%)

  - Is your repo clearly organised? 
  - Is code well commented throughout?
