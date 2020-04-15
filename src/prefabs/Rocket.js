//Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, playerNum, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this); //Add an object to the existing scene,displayList, updateList
        this.isFiring = false; //Track rocket's firing status

        this.sfxRocket = scene.sound.add('sfx_rocket'); //add rocket sfx

        this.playerNumber = playerNum;

    }

    update() {
        switch (this.playerNumber) {
            case 1:
                // Left/right movement
                if (!this.isFiring) {
                    if (keyLEFT.isDown && this.x >= 47) {
                        this.x -= 2;
                    } else if (keyRIGHT.isDown && this.x <= 578) {
                        this.x += 2;
                    }
                }
                //Fire button
                if (Phaser.Input.Keyboard.JustDown(keySPACE) && !this.isFiring) {
                    this.isFiring = true;
                    this.sfxRocket.play(); //play sfx
                }
                break;
            case 2:
                // Left/right movement
                if (!this.isFiring) {
                    if (keyA.isDown && this.x >= 47) {
                        this.x -= 2;
                    } else if (keyD.isDown && this.x <= 578) {
                        this.x += 2;
                    }
                }
                //Fire button
                if (Phaser.Input.Keyboard.JustDown(keyW) && !this.isFiring) {
                    this.isFiring = true;
                    console.log('Pressed p2 FIRE');
                    this.sfxRocket.play(); //play sfx
                }
                break;
        }

        //If fired, move up
        if (this.isFiring && this.y >= 108) {
            this.y -= 2;
        }

        //Reset on miss
        if (this.y <= 108) {
            this.reset();
        }
    }

    //reset the rocket to the "ground"
    reset() {
        this.isFiring = false;
        this.y = 431;
    }

}