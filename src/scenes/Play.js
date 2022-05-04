class Play extends Phaser.Scene {
    hunger = 0;
    constructor() {
        super("playScene");
    }



    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/lettuce.png');
        this.load.image('spike', './assets/coral.png'); 
        this.load.image('turtle', './assets/turtle.png');
        this.load.image('starfield', './assets/starfield.png');
        // this.load.image('platform', './assets/floor.png');
        this.load.image('hungerBar', './assets/hungerbarempty.png');
        this.load.image('hungerFill', './assets/hungerPixel.png');
        this.load.image('platform', './assets/testPlatformTile.png');
        this.load.image('sand', './assets/floor_1.png');
        this.load.image('ground', './assets/floor_2.png');
        this.load.image('backdrop', './assets/backdrop.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
        this.load.audio('backgroundtrack', './assets/testsong.wav');
        this.load.audio('death', './assets/death.wav');
        this.load.audio('jump', './assets/jump.wav');
        this.load.audio('hurt', './assets/hurt.mp3');
        this.load.audio('grow', './assets/grow.wav');
        this.load.audio('up', './assets/menuup.wav');
        this.load.audio('lettuce', './assets/lettuce.wav');
        this.load.atlas('haroldanims', './assets/haroldanims.png', './assets/haroldanims.json');
    }


    create() {
        //backdrop
        this.physics.world.setFPS(60);
        this.staticGroup = this.physics.add.staticGroup();
        this.playerGroup = this.physics.add.group();
        this.backdrop = this.add.tileSprite(0,110, 5120, 2880,'backdrop').setOrigin(0,0).setDepth(0).setScale(0.27);
        //this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.floor = this.add.tileSprite(0, 640, 1280, 100, 'sand').setOrigin(0, 0);
        this.groundVisual = this.add.tileSprite(0, 560, 2480, 500, 'ground').setOrigin(0, 0).setScale(0.5);
        this.physics.add.existing(this.floor);
        this.staticGroup.add(this.floor);
        this.floor.body.allowGravity = false;
        this.floor.body.immovable = true;
        this.backgroundMusic = this.sound.add('backgroundtrack');
        this.backgroundMusic.loop = true; // This is what you are looking for
        this.backgroundMusic.play();

        //UI
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xB8E1FF).setOrigin(0, 0.5).setDepth(1);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);



        //spaceships
        this.player = new Player(this, game.config.width / 4, game.config.height - borderPadding - borderUISize - 150, 'turtle', Phaser.AUTO, 5).setOrigin(0.5, 0.5);
        this.player.setScale(0.1);
        this.anims.create({ 
            key: 'walk', 
            frames: this.anims.generateFrameNames('haroldanims', {      
                prefix: 'turtle_walk_',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 0 
            }), 
            frameRate: 15,
            repeat: -1 
        });
        this.anims.create({
            key: 'death',
            defaultTextureKey: 'haroldanims',
            frames: [
                { frame: 'turtle_dead' }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'slide',
            defaultTextureKey: 'haroldanims',
            frames: [
                { frame: 'turtle_slide' }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'hurt',
            defaultTextureKey: 'haroldanims',
            frames: [
                { frame: 'turtle_hit' }
            ],
            repeat: -1
        });
        


        this.physics.add.collider(this.player, this.floor);




        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);




        this.gameOver = false;
        this.growth = 0;
        this.speedlimit = 1000;
        this.invincibleframes = 0;

        // group with all active platforms.
        this.platformGroup = this.add.group({

            // once a platform is removed, it's added to the pool
            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform)
            }
        });

        this.coins = this.add.group();
        this.coins.enableBody = true;

        this.spikes = this.add.group();
        this.spikes.enableBody = true;


        let scoreConfig = {
            fontFamily: 'Noto Sans',
            fontSize: '28px',
            // backgroundColor: '#F3B141',
            color: '#376E60',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        scoreConfig.fixedWidth = 0;

        this.hungerFill = this.add.image(game.config.width - borderPadding * 15, borderUISize + borderPadding * 2, "hungerFill").setOrigin(0,0.5).setDepth(2);
        this.hungerBar = this.add.image(game.config.width - borderPadding * 15, borderUISize + borderPadding * 2, "hungerBar").setOrigin(0,0.5).setDepth(2);
        this.hungerText = this.add.text((game.config.width - borderPadding * 15) - 60, borderUISize + borderPadding * 2, "Hunger:", scoreConfig).setOrigin(0.5,0.5).setDepth(2);
        
        // pool
        this.platformPool = this.add.group({

            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function (platform) {
                platform.scene.platformGroup.add(platform)
            }
        });




        // number of consecutive jumps made by the player
        this.playerJumps = 0;
        this.speed = 350;
        this.accel = 2.4;
        this.hungerDrain = 1;
        this.isTouchingObstacle = false;
        this.distanceTravelled = 0;
        this.hunger = 1000;


        this.distanceText = this.add.text((borderPadding * 15)-80, borderUISize + borderPadding * 2, this.currentTime / 1000, scoreConfig).setOrigin(0,0.5).setDepth(2);
        this.distanceText.text = 0;

        // adding a platform to the game, the arguments are platform width and x position
        this.addPlatform(game.config.width / 5, game.config.width / 1.5);
        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, this.platformGroup, function (_player, _platform) {
            if (_player.body.touching.right && _platform.body.touching.left) {

                this.speed = 0;
            this.updatePlatformSpeeds();
            this.isTouchingObstacle = true;
                //this.setSpeedZero();
                //this.updatePlatformSpeeds();

            }
        },null,this);

        this.physics.add.overlap(this.player, this.platformGroup, function (_player, _platform) {
            if (_player.body.touching.right && _platform.body.touching.left) {

                this.speed = 0;
            this.updatePlatformSpeeds();
            this.isTouchingObstacle = true;

                
                //this.setSpeedZero();
                //this.updatePlatformSpeeds();

            }
        },null,this);

        this.physics.add.overlap(this.player, this.coins, function (player, coin) {


            this.hunger += 50;
            this.sound.play('lettuce');
            if(this.hunger > game.settings.maxHunger){
                this.hunger = game.settings.maxHunger;
            }
            //console.log(this.hunger);
            
            coin.destroy();





        },null,this);

        this.physics.add.overlap(this.player, this.spikes, function (player, spike) {


            if(this.invincibleframes <= 0){
                this.hunger -= 80;
                this.invincibleframes = 120;
                this.setSpeedZero();
                this.speedUpgrade = 0;
                this.eatUpgrade = 0;
                this.sound.play('hurt');
                this.player.anims.play('hurt', true);
                this.clock = this.time.delayedCall(1500, () => {
                    this.player.anims.play('walk', true);
                }, null, this);
            }

            





        },null,this);

        this.updatePlatformSpeeds();


        // this.player.anims.play('death', true);
        // console.log('anims', this.anims.anims.entries);
        this.player.anims.play('walk', true);

    }


    setSpeedZero() {

        this.speed = 0;
        //console.log(this.speed + " current speed");
    }


    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX) {
        let platform;
        if (this.platformPool.getLength()) {
            platform = this.platformPool.getFirst();
            platform.x = posX;
            //spawn platform at random y point (fix later)
            // platform.y = Phaser.Math.Between(game.config.height - 150, 200);
            platform.y = Phaser.Math.RoundTo(Phaser.Math.Between(game.config.height - 150, 400),0,30);
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else {
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "platform").setOrigin(0,0.5);
            
            this.physics.add.collider(this.player, this.platform);
            // platform.setImmovable(true);
            this.platformGroup.add(platform);


        }
        platform.displayWidth = platformWidth;
        
        platform.setOrigin(0,0.5);
        
        var d = Phaser.Math.Between(1, 8);
        if(d == 1){
            for(let i = 0; i < platformWidth - 25; i += 50){
                this.spike = this.physics.add.sprite((posX + i + 25), platform.y - 35, "spike").setOrigin(0.5,0.5).setScale(0.5);
    
                this.physics.add.overlap(this.player, this.spike);
                // platform.setImmovable(true);
                this.spikes.add(this.spike);
                
            }
        }
        else if(d < 8){
            for(let i = 0; i < platformWidth - 25; i += 50){
                this.coin = this.physics.add.sprite((posX + i + 25), platform.y - 40, "rocket").setOrigin(0.5,0.5).setScale(0.6);
    
                this.physics.add.overlap(this.player, this.coin);
                // platform.setImmovable(true);
                this.coins.add(this.coin);
                
            }
        }

        
        platform.displayHeight = 30;

        this.nextPlatformDistance = Phaser.Math.Between(game.settings.spawnRange[0], game.settings.spawnRange[1]);
    }

    updatePlatformSpeeds() {
        this.coins.getChildren().forEach(function (coin) {
            coin.setVelocityX(this.speed * -1);
            if(coin.x <= 0 - coin.width){
                coin.destroy();
            }

        }, this);

        this.spikes.getChildren().forEach(function (spike) {
            spike.setVelocityX(this.speed * -1);
            if(spike.x <= 0 - spike.width){
                spike.destroy();
            }
        }, this);
        
        this.platformPool.getChildren().forEach(function (platform) {
            platform.setVelocityX(this.speed * -1);
        }, this);

        this.platformGroup.getChildren().forEach(function (platform) {
            platform.setVelocityX(this.speed * -1);

        }, this);

        


    }

    preventPlatformInches() {
        this.platformPool.getChildren().forEach(function (platform) {
            platform.x += 3;
        }, this);

        this.platformGroup.getChildren().forEach(function (platform) {
            platform.x += 3;

        }, this);

        this.floor.tilePositionX -= 1;
        this.groundVisual.tilePositionX -= 1;
        this.backdrop.tilePositionX -= 1;
        this.player.x -= 1;
    }



    update(time, delta) {


        //console.log(this.hunger);


        if(!this.gameOver){
            this.hunger -= this.hungerDrain;
            if(this.invincibleframes > 0){
                this.invincibleframes--;
            }
            else{
                if(keyDOWN.isDown){
                    this.player.anims.play('slide', true);
                }
                else{
                    this.player.anims.play('walk', true);
                }
            }
            this.hungerFill.scaleX = 128 * ((this.hunger/game.settings.maxHunger));
            this.distanceTravelled += this.speed;
            this.distanceText.text = "Distance Travelled - " + Math.round(this.distanceTravelled/1000,0);
            
        }

        if(this.growth == 0 && this.distanceTravelled/1000 > 2000){
            this.sound.play('grow');
            this.growth = 1;
            this.accel = 4;
            this.hungerDrain = 1.3;
            this.player.setScale(0.12);
            this.player.x += 5;
            this.player.modifyJumpHeight(550);
            this.speedlimit = 1050;
        }

        if(this.growth == 1 && this.distanceTravelled/1000 > 4000){
            this.sound.play('grow');
            this.growth = 2;
            this.accel = 5;
            this.hungerDrain = 1.5;
            this.player.setScale(0.14);
            this.player.x += 5;
            this.player.modifyJumpHeight(575);
            this.speedlimit = 1100;
        }

        if(this.growth == 2 && this.distanceTravelled/1000 > 6000){
            this.sound.play('grow');
            this.growth = 3;
            this.accel = 5.5;
            this.hungerDrain = 1.8;
            this.player.setScale(0.16);
            this.player.x += 6;
            this.player.modifyJumpHeight(585);
            this.speedlimit = 1150;
        }

        if(this.growth == 3 && this.distanceTravelled/1000 > 8000){
            this.sound.play('grow');
            this.growth = 4;
            this.accel = 5.75;
            this.hungerDrain = 1.85;
            this.player.setScale(0.18);
            this.player.x += 6;
            this.player.modifyJumpHeight(590);
            this.speedlimit = 1200;
        }

        if(this.growth == 4 && this.distanceTravelled/1000 > 10000){
            this.sound.play('grow');
            this.growth = 5;
            this.accel = 6;
            this.hungerDrain = 1.9;
            this.player.setScale(0.2);
            this.player.x += 6;
            this.player.modifyJumpHeight(595);
            this.speedlimit = 1250;
        }

        if(!this.gameOver && this.hunger <= 0){
            this.gameOver = true;
            this.sound.play('death');
        }

        if(this.gameOver){

            this.speed = 0;
            this.player.setGravityY(0);
            this.player.setVelocityY(0);
            this.player.anims.play('death', true);
            let scoreConfig = {
                fontFamily: 'Noto Sans',
            fontSize: '28px',
            // backgroundColor: '#F3B141',
            color: '#376E60',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
            }

            scoreConfig.fixedWidth = 0;

            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER - You let Harold starve! You MONSTER!', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            
            if(Phaser.Input.Keyboard.JustDown(keyR)){
                this.backgroundMusic.stop();
                this.scene.restart();
            }
        }

        


        if (this.player.body.touching.right == true || this.player.body.embedded == true) {
            // this.speed = 0;
            // this.updatePlatformSpeeds();
            // this.isTouchingObstacle = true;
            // //this.preventPlatformInches();
            this.updatePlatformSpeeds();
        }
        else {

            if (this.speed < this.speedlimit && !this.isTouchingObstacle) {
                this.speed += this.accel;

            }

            this.isTouchingObstacle = false;

            this.updatePlatformSpeeds();
            
            this.floor.tilePositionX += this.speed / 70;
            this.groundVisual.tilePositionX += this.speed /70;
            this.backdrop.tilePositionX += this.speed /240;
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.backgroundMusic.stop();
            this.scene.start("menuScene");
        }

        //scroll backdrop
        //this.starfield.tilePositionX -= 4;


        if (!this.gameOver) {
            this.player.update();
        }

        // recycling platforms
        let minDistance = game.config.width;
        this.platformGroup.getChildren().forEach(function (platform) {

            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            minDistance = Math.min(minDistance, platformDistance);
            platform.setVelocityY(0);
            platform.setPushable(false);
            if (platform.x < - platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // adding new platforms
        if (minDistance > this.nextPlatformDistance) {
            // var nextPlatformWidth = Phaser.Math.Between(game.settings.platformSizeRange[0], game.settings.platformSizeRange[1]);
            var nextPlatformWidth = Math.round((Phaser.Math.Between(game.settings.platformSizeRange[0], game.settings.platformSizeRange[1]))/50)*50;
            //console.log(nextPlatformWidth);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2);
        }
        // check collisions


    }

 

}