class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, baseJump) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.minJump = baseJump;
        this.isGrounded = false;
        this.setScale(2);
        //this.setBounce(1, 1);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;

        
    }

    doJump(){
        this.setVelocity(0, -200);
        this.isGrounded = false;
    }


    update(){
        this.body.velocity.x = 0;

        // if(this.scene.isGround){
        //     this.isGrounded = true;
        // }
        if(this.body.onFloor()){
            this.isGrounded = true;
        }
        //console.log(this.isGrounded);
        if(keyUP.isDown && this.isGrounded){
            this.doJump();
        }


    }
}