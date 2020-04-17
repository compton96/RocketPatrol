class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/tile sprite
        this.load.image("rocket", "./assets/rocket.png");
        this.load.image("rocket2", "./assets/rocket2.png");
        this.load.image("spaceship", "./assets/spaceship.png");
        this.load.image("starfield", "./assets/starfield.png");
        this.load.image("planets", "./assets/planets.png");
        this.load.spritesheet("explosion", "./assets/explosion.png",
            { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
    }

    create() {
        //Place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, "starfield").setOrigin(0, 0);
        this.planets = this.add.tileSprite(0, 0, 640, 480, "planets").setOrigin(0, 0);

        //white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);

        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        //Add rocket (Player 1)
        this.p1Rocket = new Rocket(this, game.config.width / 2, 431, "rocket", 1).setScale(0.5, 0.5).setOrigin(0, 0);
        //Add rocket (Player 2)
        this.singlePlayer = game.settings.singlePlayer;
        if (!this.singlePlayer) {
            this.p2Rocket = new Rocket(this, game.config.width / 2 + 20, 431, "rocket2", 2).setScale(0.5, 0.5).setOrigin(0, 0);
        }

        //Add spaceships
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, "spaceship", 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, "spaceship", 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 260, "spaceship", 0, 10).setOrigin(0, 0);

        //Define keyboard keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion",
                { start: 0, end: 9, first: 0 }), frameRate: 30
        });

        //score
        this.p1Score = 0;
        this.p2Score = 0;

        //score display
        let scoreConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(470, 54, this.p2Score, scoreConfig);

        scoreConfig.fixedWidth = 0;
        this.clockDisplay = this.add.text(300, 42, "Time: " + this.game.settings.gameTimer, scoreConfig);
        this.highScoreDisplay = this.add.text(320, 88, "High Score: " + highScore, scoreConfig).setOrigin(0.5);

        //game over flag
        this.gameOver = false;

        //60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, "Space to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

    }

    update() {

        //check key input for restart\
        this.topScore;
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            if (this.p1Score > this.p2Score) {
                this.topScore = this.p1Score;
            } else {
                this.topScore = this.p2Score;
            }
            console.log("Top Score: " + this.topScore);
            if (this.topScore > highScore) {
                highScore = this.topScore;
            }
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            if (this.p1Score > this.p2Score) {
                this.topScore = this.p1Score;
            } else {
                this.topScore = this.p2Score;
            }
            console.log("Top Score: " + this.topScore);
            if (this.topScore > highScore) {
                highScore = this.topScore;
            }
            this.scene.start("menuScene");
        }

        //Scroll starfield
        this.starfield.tilePositionX -= 0.5;
        this.planets.tilePositionX -= 2;

        if (!this.gameOver) {
            this.p1Rocket.update(); //Update P1 Rocket
            if (!this.singlePlayer) {
                this.p2Rocket.update(); //Update P2 Rocket
            }
            this.ship01.update(); //Update spaceships(x3)
            this.ship02.update();
            this.ship03.update();

            this.clockDisplay.setText((game.settings.gameTimer/1000) - Math.floor(this.clock.getElapsedSeconds()));
        }

        //Check P1 collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03, this.p1Rocket);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02, this.p1Rocket);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01, this.p1Rocket);
        }

        if (!this.singlePlayer) {
            //Check P2 collisions
            if (this.checkCollision(this.p2Rocket, this.ship03)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship03, this.p2Rocket);
            }
            if (this.checkCollision(this.p2Rocket, this.ship02)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship02, this.p2Rocket);
            }
            if (this.checkCollision(this.p2Rocket, this.ship01)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship01, this.p2Rocket);
            }
        }

    }

    checkCollision(rocket, ship) {
        //Simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship, rocket) {
        ship.alpha = 0;
        //create explosion spire at ship's position
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.anims.play("explode");
        boom.on("animationcomplete", () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        if (rocket.playerNumber == 1) {
            //score increment and repaint
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
        } else {
            //score increment and repaint
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
        }


        this.sound.play('sfx_explosion');
    }

}