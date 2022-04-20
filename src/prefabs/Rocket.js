class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, texture_missile, frame, isPlayer) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;
        this.isPlayerOne = isPlayer;
        this.defaulttex = texture;
        this.textureMissile = texture_missile;
        this.speedAccel = game.settings.rocketAccel;
        this.sfxRocket = scene.sound.add('sfx_rocket')
        this.isPoweredUp = false;
        this.powerFlight = false;
    }

    powerUpRocket(){
        this.isPoweredUp = true;
        this.setTexture(this.textureMissile);
        this.setOrigin(0.5, 0.7);
    }

    isPowered(){
        return this.powerFlight;
    }

    update() {

        if(this.isPlayerOne){
            if(!this.isFiring) {
                
                //game.input.mousePointer.ab

                if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                    this.x -= this.moveSpeed;
                } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                    this.x += this.moveSpeed;
                }
            }
            
            if(Phaser.Input.Keyboard.JustDown(keyUP) && !this.isFiring) {
                if(!this.isPoweredUp){
                    this.isFiring = true;
                    this.sfxRocket.play();
                }
                else{
                    this.isFiring = true;
                    this.setTexture(this.textureMissile);
                    this.sfxRocket.play();
                    this.moveSpeed = 0.2;
                    this.speedAccel = 0.5;
                    this.isPoweredUp = false;
                    this.powerFlight = true;
                }
                
            }
            if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
                this.y -= this.moveSpeed;
                this.moveSpeed += this.speedAccel;
            }  
        }
        else{
            if(!this.isFiring) {
            
                if(keyA.isDown && this.x >= borderUISize + this.width) {
                    this.x -= this.moveSpeed;
                } else if (keyD.isDown && this.x <= game.config.width - borderUISize - this.width) {
                    this.x += this.moveSpeed;
                }
            }
            if(Phaser.Input.Keyboard.JustDown(keyW) && !this.isFiring) {
                if(!this.isPoweredUp){
                    this.isFiring = true;
                    this.sfxRocket.play();
                }
                else{
                    this.isFiring = true;
                    this.setTexture(this.textureMissile);
                    this.sfxRocket.play();
                    this.moveSpeed = 0.2;
                    this.speedAccel = 0.5;
                    this.isPoweredUp = false;
                    this.powerFlight = true;
                }
                
            }
            
            if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
                this.y -= this.moveSpeed;
                this.moveSpeed += this.speedAccel;
            }
        }
        
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    reset() {
        this.moveSpeed = 2;
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
        this.setTexture(this.defaulttex);
        this.setOrigin(0.5, 0);
        this.speedAccel = game.settings.rocketAccel;
        this.powerFlight = false;
    }
}
