class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket_p1.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('floor', './assets/floor.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    

    create() {
        //backdrop
        
        this.staticGroup = this.physics.add.staticGroup();
        this.playerGroup = this.physics.add.group();
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.floor = this.add.tileSprite(0, 600, 1280, 100, 'floor').setOrigin(0,0);
         this.physics.add.existing(this.floor);
        this.staticGroup.add(this.floor);
        this.floor.body.allowGravity = false;
        this.floor.body.immovable = true;

        //UI
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        

        //spaceships
        this.player = new Player(this, game.config.width/4, game.config.height - borderPadding - borderUISize - 150, 'rocket', Phaser.AUTO, 5).setOrigin(0.5,0);
        

        this.physics.add.collider(this.player, this.floor, playerGround);

        function playerGround(){
            
            this.isGround = true;
        }


        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        

        
        this.gameOver = false;

        //clock
        
        
    }


    

    update(time, delta) {

        
        //console.log(this.isGround);

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            game.settings.spaceshipSpeed = 4;
            this.scene.restart();    
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //scroll backdrop
        this.starfield.tilePositionX -= 4;
        this.floor.tilePositionX += 7;

        if(!this.gameOver) {


            this.player.update();
            
        }

        // check collisions
        
        
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