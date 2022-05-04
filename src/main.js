// Calex Raffield, Michelle Huang, Isaiah Roberts
// Game Title: Hungry Harold
// Completed: 05/04/2022
// Creative Tilt: We took the traditional endless runner and kind of flipped it, with the player not being able to 
// move in the X-axis and only being allowed to control jumping. Part of the programming behind it was managing 
// the speed of the platforms, pickups, and modifying them based on the state of the player (is colliding, is in air, etc)
//
// In terms of trying something new, something we noticed with a lot of endless runner games that we had played in the past 
// were that they weren't very forgiving, often forcing a restart on the first mistake. We tried to alliviate that by making 
// the game very forgiving, using a hunger system instead of a traditional lives system. 

let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 },
            tileBias: 32,
            //debug: true
        }
    },
    fps: {
        forceSetTimeout: true,
        target: 60,
        max: 60,
        forceSetTimeOut: true
    },
    resolution: 3,
    
    scene: [ Menu, Play, Tutorial ]
    
}

let game = new Phaser.Game(config);


let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyF, keyR, keyLEFT, keyRIGHT, keyA, keyD, keyW, keyUP, keyDOWN;

