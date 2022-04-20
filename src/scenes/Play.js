class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket_p1.png');
        this.load.image('rocket_p2', './assets/rocket_p2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('spaceship_super', './assets/spaceship_super.png');
        this.load.image('missile', './assets/missile_1.png');
        this.load.image('missile_2', './assets/missile_2.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //backdrop
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        //UI
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        //player
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket','missile', Phaser.AUTO, true).setOrigin(0.5, 0);
        if(game.settings.isCoop){
            this.p2Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket_p2', 'missile_2', Phaser.AUTO, false).setOrigin(0.5, 0);
        }
        

        //spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5 + borderPadding*2, 'spaceship', 0, 30, false).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*6 + borderPadding*4, 'spaceship', 0, 20, false).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*7 + borderPadding*5, 'spaceship', 0, 10, false).setOrigin(0,0);
        this.shipSpecial = new Spaceship(this, game.config.width, borderUISize*4, 'spaceship_super', 0, 100, true).setOrigin(0,0);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        //anim
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //score
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        

        //game condition
        this.gameOver = false;

        //clock
        scoreConfig.fixedWidth = 0;
        // this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            
        // }, null, this);

        this.currentTime = game.settings.gameTimer;
        this.timeRight = this.add.text(game.config.width - borderPadding*15, borderUISize + borderPadding*2, this.currentTime/1000, scoreConfig);

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: decreaseTime,
            callbackScope: this,
            loop: true
        });

        function decreaseTime(){
            this.currentTime -= 1000;
        }
        
    }

    

    update(time, delta) {

        this.frameTime += delta;

        if(this.frameTime > 16.5){
            this.frameTime = 0;
            g.gameTick++;
        }

        if(this.currentTime > 0 && this.gameOver == false){
            //this.currentTime -= 16.7;
            this.timeRight.text = Math.round(this.currentTime/1000);
        }
        else{

            let scoreConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 100
            }

            scoreConfig.fixedWidth = 0;

            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }



        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            game.settings.spaceshipSpeed = 4;
            this.scene.restart();    
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //scroll backdrop
        this.starfield.tilePositionX -= 4;

        if(!this.gameOver) {
            this.p1Rocket.update();
            if(game.settings.isCoop){
                this.p2Rocket.update();
            }
            
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.shipSpecial.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            game.settings.spaceshipSpeed++;
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            game.settings.spaceshipSpeed++;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            game.settings.spaceshipSpeed++;
            
        }

        if (this.checkCollision(this.p1Rocket, this.shipSpecial)) {
            this.p1Rocket.reset();
            this.p1Rocket.powerUpRocket();
            this.shipExplode(this.shipSpecial);
            game.settings.spaceshipSpeed++;
            
        }
        
        if(game.settings.isCoop){
            if(this.checkCollision(this.p2Rocket, this.ship03)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship03);
                game.settings.spaceshipSpeed++;
            }
            if (this.checkCollision(this.p2Rocket, this.ship02)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship02);
                game.settings.spaceshipSpeed++;
            }
            if (this.checkCollision(this.p2Rocket, this.ship01)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship01);
                game.settings.spaceshipSpeed++;
                
            }
            if (this.checkCollision(this.p2Rocket, this.shipSpecial)) {
                this.p2Rocket.reset();
                this.p2Rocket.powerUpRocket();
                
                this.shipExplode(this.shipSpecial);
                game.settings.spaceshipSpeed++;
                
            }
        }
        
    }

    checkExplosionCollision(rocket, ship, explosionRadius){
        if (rocket.x - explosionRadius < ship.x + ship.width && 
            rocket.x + rocket.width + explosionRadius > ship.x && 
            rocket.y - explosionRadius < ship.y + ship.height &&
            rocket.height + rocket.y + explosionRadius > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    checkCollision(rocket, ship) {

        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                if(rocket.isPowered()){
                    if(this.checkExplosionCollision(rocket, this.ship01, 500)){
                        this.shipExplode(this.ship01);
                        game.settings.spaceshipSpeed++;
                    }
                    if(this.checkExplosionCollision(rocket, this.ship02, 500)){
                        this.shipExplode(this.ship02);
                        game.settings.spaceshipSpeed++;
                    }
                    if(this.checkExplosionCollision(rocket, this.ship03, 500)){
                        this.shipExplode(this.ship03);
                        game.settings.spaceshipSpeed++;
                    }




                }
                return true;
        } else {
            return false;
        }
            
        
        
        
    }

    shipExplode(ship) {
        // hide ship
        ship.alpha = 0;                         
        // create explosion at ship position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();                         // reset position
            ship.alpha = 1;                       // make ship visible
            ship.upSpeed();
            boom.destroy();                       // remove explosion
        });
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        this.currentTime += 1000;
        
        this.sound.play('sfx_explosion');
      }
}