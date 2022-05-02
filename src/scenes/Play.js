class Play extends Phaser.Scene {
    hunger = 0;
    constructor() {
        super("playScene");
    }



    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket_p1.png');
        this.load.image('spike', './assets/spike.png'); 
        this.load.image('turtle', './assets/turtle.png');
        this.load.image('starfield', './assets/starfield.png');
        // this.load.image('platform', './assets/floor.png');
        this.load.image('hungerBar', './assets/hungerbarempty.png');
        this.load.image('hungerFill', './assets/hungerPixel.png');
        this.load.image('platform', './assets/testPlatformTile.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
    }


    create() {
        //backdrop

        this.staticGroup = this.physics.add.staticGroup();
        this.playerGroup = this.physics.add.group();
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.floor = this.add.tileSprite(0, 600, 1280, 100, 'platform').setOrigin(0, 0);
        this.physics.add.existing(this.floor);
        this.staticGroup.add(this.floor);
        this.floor.body.allowGravity = false;
        this.floor.body.immovable = true;

        //UI
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xB8E1FF).setOrigin(0, 0.5).setDepth(1);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);



        //spaceships
        this.player = new Player(this, game.config.width / 4, game.config.height - borderPadding - borderUISize - 150, 'turtle', Phaser.AUTO, 5).setOrigin(0.5, 0.5);
        this.player.setScale(0.075);
        


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
        this.speedUpgrade = 0;
        this.eatUpgrade = 0;
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
        this.accel = 1.2;
        this.hungerDrain = 0.5;
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
            }

            





        },null,this);

        this.updatePlatformSpeeds();





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
        
        var d = Phaser.Math.Between(1, 8);
        if(d == 1){
            for(let i = 0; i < platformWidth - 25; i += 50){
                this.spike = this.physics.add.sprite((posX + i + 25), platform.y - 50, "spike").setOrigin(0.5,0.5);
    
                this.physics.add.overlap(this.player, this.spike);
                // platform.setImmovable(true);
                this.spikes.add(this.spike);
                
            }
        }
        else if(d < 8){
            for(let i = 0; i < platformWidth - 25; i += 50){
                this.coin = this.physics.add.sprite((posX + i + 25), platform.y - 50, "rocket").setOrigin(0.5,0.5);
    
                this.physics.add.overlap(this.player, this.coin);
                // platform.setImmovable(true);
                this.coins.add(this.coin);
                
            }
        }

        
        platform.displayHeight = 40;

        this.nextPlatformDistance = Phaser.Math.Between(game.settings.spawnRange[0], game.settings.spawnRange[1]);
    }

    updatePlatformSpeeds() {
        this.platformPool.getChildren().forEach(function (platform) {
            platform.setVelocityX(this.speed * -1);
        }, this);

        this.platformGroup.getChildren().forEach(function (platform) {
            platform.setVelocityX(this.speed * -1);

        }, this);

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


    }

    preventPlatformInches() {
        this.platformPool.getChildren().forEach(function (platform) {
            platform.x += 3;
        }, this);

        this.platformGroup.getChildren().forEach(function (platform) {
            platform.x += 3;

        }, this);

        this.floor.tilePositionX -= 1;
        this.player.x -= 1;
    }



    update(time, delta) {


        //console.log(this.hunger);


        if(!this.gameOver){
            this.hunger -= this.hungerDrain;
            if(this.invincibleframes > 0){
                this.invincibleframes--;
            }
            this.hungerFill.scaleX = 128 * ((this.hunger/game.settings.maxHunger));
            this.distanceTravelled += this.speed;
            this.distanceText.text = "Distance Travelled - " + Math.round(this.distanceTravelled/1000,0);
        }

        if(this.growth == 0 && this.distanceTravelled/1000 > 4000){
            this.growth = 1;
            this.accel = 2;
            this.hungerDrain = 0.65;
            this.player.setScale(0.09);
            this.player.x += 5;
            this.player.modifyJumpHeight(550)
        }

        if(this.growth == 1 && this.distanceTravelled/1000 > 7000){
            this.growth = 2;
            this.accel = 2.5;
            this.hungerDrain = 0.75;
            this.player.setScale(0.12);
            this.player.x += 5;
            this.player.modifyJumpHeight(575);
        }

        if(!this.gameOver && this.hunger <= 0){
            this.gameOver = true;
        }

        if(this.gameOver){

            this.speed = 0;
            this.player.setGravityY(0);
            this.player.setVelocityY(0);

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
            
            if(Phaser.Input.Keyboard.JustDown(keyR)){
                this.scene.restart();
            }
        }

        


        if (this.player.body.touching.right == true || this.player.body.embedded == true) {
            // this.speed = 0;
            // this.updatePlatformSpeeds();
            // this.isTouchingObstacle = true;
            // //this.preventPlatformInches();
        }
        else {

            if (this.speed < 1000 && !this.isTouchingObstacle) {
                this.speed += this.accel;

            }

            this.isTouchingObstacle = false;

            this.updatePlatformSpeeds();
            
            this.floor.tilePositionX += this.speed / 70;
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //scroll backdrop
        this.starfield.tilePositionX -= 4;


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
            console.log(nextPlatformWidth);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2);
        }
        // check collisions


    }

    checkExplosionCollision(rocket, ship, explosionRadius) {
        if (rocket.x - explosionRadius < ship.x + ship.width &&
            rocket.x + rocket.width + explosionRadius > ship.x &&
            rocket.y - explosionRadius < ship.y + ship.height &&
            rocket.height + rocket.y + explosionRadius > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    checkCollision(rocket, ship) {

        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            if (rocket.isPowered()) {
                if (this.checkExplosionCollision(rocket, this.ship01, 500)) {
                    this.shipExplode(this.ship01);
                    game.settings.spaceshipSpeed++;
                }
                if (this.checkExplosionCollision(rocket, this.ship02, 500)) {
                    this.shipExplode(this.ship02);
                    game.settings.spaceshipSpeed++;
                }
                if (this.checkExplosionCollision(rocket, this.ship03, 500)) {
                    this.shipExplode(this.ship03);
                    game.settings.spaceshipSpeed++;
                }




            }
            return true;
        } else {
            return false;
        }




    }

    collectcoin(player, coin) {
        //check if we have already hit coin 

    }

    //called after coin has animated
    killcoin(coin) {
        //Removes the coin from the screen
        coin.kill();
    }

}