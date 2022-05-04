class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, baseJump) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOffset(1,1);
        this.scene = scene;
        this.minJump = baseJump;
        this.isGrounded = false;
        this.setScale(2);
        //this.setBounce(1, 1);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setGravityY(1200);
        this.maxJumpTime = 20;
        this.currentJumpTime = 0;
        this.jumpHeld = false;
        this.isSlide = false;
        this.jumpAmount = 0;
        this.jumpVelocity = 425;
        this.setBodySize(600,300,false);
        
    }

    doJump(){

        if(this.isGrounded){
            this.setVelocity(0, -this.jumpVelocity);
            this.scene.sound.play('jump');
            
        }
        else{
            this.currentJumpTime++;
        }

        if(this.jumpHeld && (this.body.velocity.y < 0 || this.jumpAmount < 2) && this.currentJumpTime < this.maxJumpTime){
            this.setVelocity(0, -this.jumpVelocity);
            this.scene.sound.play('jump');
            //this.setVelocity(0, -300 + (50*((this.maxJumpTime - this.currentJumpTime)/this.maxJumpTime)));
        }

        
        this.isGrounded = false;
    }

    modifyJumpHeight(arg){
        this.jumpVelocity = arg;
    }


    update(){
        this.body.velocity.x = 0;
        this.body.x = game.config.width / 4;

        // if(this.scene.isGround){
        //     this.isGrounded = true;
        // }
        if(this.body.onWall()){
            //console.log("set speed to 0");
            this.scene.speed = 0;
        }
        if(this.body.onFloor()){
            this.isGrounded = true;
            this.currentJumpTime = 0;
            this.jumpAmount = 0;
        }
        //console.log(this.isGrounded);
        if(keyUP.isDown){
            if(this.body.onFloor()){
                this.jumpHeld = true;
            }

            if(this.jumpAmount < 1 && this.jumpHeld == false){
                this.jumpHeld = true;
                this.currentJumpTime = 0;
                this.jumpAmount++;
            }
            this.doJump();
            
        }
        else{
            this.jumpHeld = false;
            
        }

        if(keyDOWN.isDown && !this.isSlide){
            this.isSlide = true;
            this.body.setGravityY(3400);
            this.setBodySize(600,250,false);
        }
        if(this.isSlide && !keyDOWN.isDown){
            this.isSlide = false;
            this.body.setGravityY(1200);
            this.setBodySize(600,300,false);
            this.y -= 15;
        }


    }
}