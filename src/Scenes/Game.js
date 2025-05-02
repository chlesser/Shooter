class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");

        this.player; // player sprite

        //Enemy List
        this.enemies = {}; // enemy array

        //Bullet List
        this.bullets = []; // bullet array

        //Keys
        this.leftKeys = {}; // left key
        this.rightKeys = {}; // right key
        this.fireKey; // fire key
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("hutSprite", "fixed-sprites/stable.png")

        this.load.image("bulletSprite", "fixed-sprites/element-diamond.png")
    }

    create() {
        //Background
        this.back = this.add.sprite(0, 0, "bg").setOrigin(0, 0).setScale(0.8); // setOrigin(0, 0) sets the origin to the top left corner of the image
        this.back.z = -1; // set the z index of the background sprite to 0
        
        //Player Sprite
        this.player = this.add.sprite(400, 450, "fire").setOrigin(0.5, 0.5).setScale(1); // setOrigin(0.5, 0.5) sets the origin to the center of the image
        
        //keyboard input
        this.leftKeys.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT); // left key
        this.rightKeys.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); // right key
        this.leftKeys.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // left key
        this.rightKeys.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // right key
        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // fire key

    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        // Movement Checks
        if ((this.leftKeys.key1.isDown || this.leftKeys.key2.isDown) && (this.player.x - (this.player.width / 2)) > 0) {
            this.player.x -= 5; // move the player left
        }
        if ((this.rightKeys.key1.isDown || this.rightKeys.key2.isDown) && (this.player.x + (this.player.width / 2)) < this.game.config.width) {
            this.player.x += 5; // move the player right
        }
        // Fire Check
        if (this.fireKey.isDown) {
            this.bullets = this.add.sprite(this.player.x, this.player.y, "bulletSprite").setOrigin(0.5, 0.5).setScale(0.5); // setOrigin(0.5, 0.5) sets the origin to the center of the image
            this.player.setScale(1.1); // scale the player sprite up
        } else {
            this.player.setScale(1); // scale the player sprite down
        }
    }

}