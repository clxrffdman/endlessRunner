class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    this.load.audio('sfx_select', './assets/blip_select12.wav');
    this.load.audio('sfx_explosion', './assets/explosion38.wav');
    this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
  }

  create() {
    let menuConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }

    this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding, 'ENDLESS RUNNER', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width / 2, game.config.height / 2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
    menuConfig.backgroundColor = '#00FF00';
    menuConfig.color = '#000';
    this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding, 'Press ← for Easy or → for Hard', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding + borderUISize, 'Press ↑ for Co-op', menuConfig).setOrigin(0.5);

    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      game.settings = {
        platformStartSpeed: 350,
        spawnRange: [100, 350],
        platformSizeRange: [50, 250],
        playerGravity: 900,
        jumpForce: 400,
        playerStartPosition: 200,
        maxHunger: 2000,
        jumps: 2,
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");
    }
    if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      game.settings = {
        platformStartSpeed: 350,
        spawnRange: [100, 350],
        platformSizeRange: [50, 250],
        playerGravity: 900,
        jumpForce: 400,
        playerStartPosition: 200,
        maxHunger: 2000,
        jumps: 2
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");
    }

    if (Phaser.Input.Keyboard.JustDown(keyUP)) {
      game.settings = {
        platformStartSpeed: 350,
        spawnRange: [100, 350],
        platformSizeRange: [50, 250],
        playerGravity: 900,
        jumpForce: 400,
        playerStartPosition: 200,
        maxHunger: 2000,
        jumps: 2
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");
    }

    if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
      game.settings = {
        platformStartSpeed: 350,
        spawnRange: [100, 350],
        platformSizeRange: [50, 250],
        playerGravity: 900,
        jumpForce: 400,
        playerStartPosition: 200,
        maxHunger: 2000,
        jumps: 2
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");
    }


  }
}