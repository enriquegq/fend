frontend-nanodegree-arcade-game
===============================

Students should use this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric) for self-checking their submission. Make sure the functions you write are **object-oriented** - either class functions (like Player and Enemy) or class prototype functions such as Enemy.prototype.checkCollisions, and that the keyword 'this' is used appropriately within your class and class prototype functions to refer to the object the function is called upon. Also be sure that the **readme.md** file is updated with your instructions on both how to 1. Run and 2. Play your arcade game.

For detailed instructions on how to get started, check out this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).

# Start the game
To start playing this fabulous arcade game, you must open the **index.html** file on your browser.
This game does not have sound effects, so you can keep listening to your favouritve music.

Once the **index.html** is loaded, you will see different elements on the page:

* The *canvas*: area where the game takes place. It has three sections:
1. Water
2. Stone blocks
3. Grass blocks

* The *bugs*: those are your enemies. They will run all over the stone blocks, always from left to right. Try to avoid the collisions with any of them if you do not want to go back to your initial position.

* The *player*: main character in this game, which you control. The *player* will start this game always in the same position, in the middle of the last row of grass blocks.

* *Scores* (victory/death): at the top of the page, you will see how many times you won and how many times you were cought by a bug. (Not fancy at all due to the time constraint to finish the nanodegree :) )

# How to play?
The main goal of the *player* is to get from the grass to the water without having a collision with the bugs. To do so, you will need to move it, using the arrow keys on your keyboard (up, down, left and right).
You can move the player around the canvas in any direction as long as it does not cross the limits.

If the *player* gets to the water safe, the *Victory* score will increase and it will reset the position of the *player* to the initial position.
However, if the *player* gets into the way of some bug, the *Death* score will increase and also will reset the position to the initial one.