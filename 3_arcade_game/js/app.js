// Canvas variables

// Constants
const BOX_WIDTH = 101;
const BOX_HEIGHT = 83;
const NUM_ROWS = 6;
const NUM_COLS = 5;
const NUM_ENEMIES = 5;
const NUM_STONE_BLOCKS = 3;

// OFFSET to center the items on the boxes of the canvas
const OFFSET = (BOX_HEIGHT / 4);

/* The bug width is exactly the same than BOX_WIDTH but we substract 40positions on
 * the canvas to give the effect of killing the player when the bug enters the
 * same box where player is at. If we didn't enter this factor in the calculation
 * the bug would kill the player in the center of the box (which does not look
 * user friendly)
 */
const BUG_WIDTH = BOX_WIDTH-40;

// Victory and death scores
var victory = document.getElementById("victory");
var death = document.getElementById("death");

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// Place the player object in a variable called player
var player;

// Enemies our player must avoid
var Enemy = function(row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    this.y = (BOX_HEIGHT * row) - OFFSET;
    this.currentBox = [];
    this.speedFactor = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > BOX_WIDTH * NUM_COLS) {
        this.x = 0;
    }
    else {
        this.x += BOX_WIDTH * dt * this.speedFactor;
    }
    this.currentBox = [Math.floor((this.x + BUG_WIDTH) / BOX_WIDTH), Math.floor(this.y / BOX_HEIGHT)];
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/* Now write your own player class
 * This class requires an update(), render() and
 * a handleInput() method.
 */
var Player = function() {
    // Even though the position will be set up in "resetPosition", I added the
    // variables for clarity on the code.
    this.x = 0;
    this.y = 0;
    this.currentBox = [];
    this.sprite = 'images/char-boy.png';
    this.victory = 0;
    this.death = 0;
    this.resetPosition();
}

// Updates the current box varible related to the position of the player
Player.prototype.update = function() {
    this.currentBox = [Math.floor(this.x / BOX_WIDTH), Math.floor(this.y / BOX_HEIGHT)];
}

// Updates the position of the player based on a normal movement or a victory
Player.prototype.move = function (x, y) {
    if (y+OFFSET == 0) {
        this.win();
    }
    else {
        if (x >= 0 && x < BOX_WIDTH*NUM_COLS){
            this.x = x;
        }
        if (y+OFFSET >= 0 && y < (BOX_HEIGHT*NUM_ROWS)-OFFSET){
            this.y = y;
        }
    }
}

// Gets the player to the initial position
Player.prototype.resetPosition = function() {
    this.x = BOX_WIDTH * 2;
    this.y = (BOX_HEIGHT * (NUM_ROWS - 1)) - OFFSET;
}

// Handles the victory of the player
Player.prototype.win = function() {
    this.resetPosition();
    this.victory++;
    victory.innerHTML = this.victory;
}

// Handles the death of the player
Player.prototype.die = function() {
    this.resetPosition();
    this.death++;
    death.innerHTML = this.death;
}

// Renders the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handles the player movement executed by the user
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            this.move(this.x - BOX_WIDTH, this.y);
            break;
        case 'up':
            this.move(this.x, this.y - BOX_HEIGHT);
            break;
        case 'right':
            this.move(this.x + BOX_WIDTH, this.y);
            break;
        case 'down':
            this.move(this.x, this.y + BOX_HEIGHT);
            break;
        default:
    }
};

/* Initializes the array of enemies which will pass by the blocks of the canvas
 * They will have different speeds to make more difficult the player to reach the
 * water.
 * "i / NUM_STONE_BLOCKS" = to place the enemies inside the canvas blocks
 * "0.5 * i" = different speed
 */
function initEnemies() {
    var row;
    for (var i=1; i<=NUM_ENEMIES; i++) {
        row = Math.floor(i % NUM_STONE_BLOCKS)+1;
        allEnemies.push(new Enemy(row, 0.5 * i));
    }
}

/* Initializes all the common variables in the game: scores, enemies, player and
 * the handler for the user interaction (keys to move the player)
 */
function initGame() {
    victory = document.getElementById("victory");
    death = document.getElementById("death");
    initEnemies();
    player = new Player();
    //player.resetPosition();
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });
}
