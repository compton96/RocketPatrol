/*
Points Breakdown:
    Simultaneous 2 Player - 50pts
    Parallax Scrolling - 15pts
    Display Remaining Time - 15pts
    Track high Score - 10pts
    Spaceship speed increase after 30 seconds - 10pts
*/

let config = 
{
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play],
};

let game = new Phaser.Game(config);

//define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
    singlePlayer: true,
}

let highScore = 0;

//Reserve some keyboard variables
let keySPACE, keyLEFT, keyRIGHT, keyDOWN, keyW, keyA, keyD;