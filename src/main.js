// Calex Raffield, craffiel, Rocket Patrol Mods, 04/15/22, 2 hrs
// POINT BREAKDOWN:
// Simultanious Two-Player mode (30)
// Display the time remaining (in seconds) on the screen (10)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
// Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
// Create and implement a new weapon (w/ new behavior and graphics) (Missile with unique flight speed, acceleration and AOE Damage) (20)
// Rocket acclerates throughout flight rather then staying at static speed (?)
// Ships speed up with each kill (?) 

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    fps: {
        forceSetTimeout: true,
        target: 60
    },
    scene: [ Menu, Play ],

    physics: {
        default: "arcade"
    }
    
}

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyF, keyR, keyLEFT, keyRIGHT, keyA, keyD, keyW, keyUP, keyDOWN;