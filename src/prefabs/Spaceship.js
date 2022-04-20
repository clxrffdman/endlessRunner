class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, isSpecial) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.isSpecial = isSpecial;
        if(this.isSpecial){
            this.moveSpeed = this.moveSpeed * 1.8;
        }
    }

    update() {
        if(!this.isSpecial){
            this.x -= this.moveSpeed;
            if(this.x <= 0 - this.width) {
                this.reset();
            }
        }
        else{
            this.x += this.moveSpeed;
            if(this.x >= game.config.width + this.width) {
                this.reset();
            }
        }
        
        
    }
    
    reset() {
        if(!this.isSpecial){
            this.x = game.config.width;
        }
        else{
            this.x = 0;
        }
        
    }

    upSpeed(){
        this.moveSpeed += 0.5;
    }

    
}