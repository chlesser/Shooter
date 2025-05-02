class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");

        //globals
        this.objects = {}; // object array

        //Player
        this.objects.player; // player sprite
        this.playerSpeed = 5; // player speed
        this.playerHealth = 3; // player health

        //Enemy List
        this.objects.enemies = []; // enemy array
        this.objects. enemyBullets = {angle: [], sprites: []};

        //UI elements
        this.objects.scoreText;
        this.score = 0; // score
        this.health = 3; // health
        this.objects.compass;
        this.objects.shields = {};

        //Bullets
        this.objects.bullets = []; // bullet array
        this.bulletSpeed = 7; // bullet speed
        this.bulletTimer = 0; // bullet timer
        this.bulletDelay = 60; // bullet timer

        //Keys
        this.leftKeys = {}; // left key
        this.rightKeys = {}; // right key
        this.fireKey; // fire key
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("hutSprite", "fixed-sprites/stable.png")
        this.load.image("wellSprite", "fixed-sprites/well.png")

        this.load.image("bulletSprite", "fixed-sprites/elementDiamond.png")
        this.load.image("enemyBulletSprite", "fixed-sprites/elementCircle.png")
        this.load.image("shieldSprite", "fixed-sprites/elementShield.png")

        this.load.image("compassSprite", "fixed-sprites/compass.png")
    

    }

    create() {
        //Background
        this.back = this.add.sprite(0, 0, "bg").setOrigin(0, 0).setScale(0.8);
        this.back.z = -1; // set the z index of the background sprite to 0
        
        //Player Sprite
        this.objects.player = this.add.sprite(400, 475, "fire").setOrigin(0.5, 0.5).setScale(1);

        //Compasses
        this.objects.compass = this.add.sprite(50, 550, "compassSprite").setOrigin(0.5, 0.5).setScale(0.5);
        this.objects.scoreText = this.add.text(75, 550, "" + this.score, {
            fontFamily: "Arial",
            fontSize: "40px",
            color: "#000000",
            align: "left",
            padding: {
                x: 10,
                y: 10
            },
            fixedWidth: 0 // set the width to 0 to make it auto size
        }).setOrigin(0, 0.5);

        //shields
        this.fixShields();
        
        //keyboard input
        this.leftKeys.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT); // left key
        this.rightKeys.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); // right key
        this.leftKeys.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // left key
        this.rightKeys.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // right key
        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // fire key

        //Enemy Spawn
        this.addCluster();

    }

    update() {
        //player bullet firing
        if(this.bulletTimer > 0) {
            this.bulletTimer--; // decrease the bullet timer by the time since the last update
        }
        //bullet movements
        if(this.objects.bullets.length > 0) {
            for (let bullet of this.objects.bullets) {
                bullet.y -= this.bulletSpeed; // move the bullet up
                if(bullet.y < 0) {
                    bullet.destroy(); // destroy the bullet if it goes off screen
                    this.objects.bullets.splice(this.objects.bullets.indexOf(bullet), 1); // remove the bullet from the bullet array
                }
            }
        }

        // Movement Checks
        if ((this.leftKeys.key1.isDown || this.leftKeys.key2.isDown) && (this.objects.player.x - (this.objects.player.width / 2)) > 0) {
            this.objects.player.x -= 5; // move the player left
        }
        if ((this.rightKeys.key1.isDown || this.rightKeys.key2.isDown) && (this.objects.player.x + (this.objects.player.width / 2)) < this.game.config.width) {
            this.objects.player.x += 5; // move the player right
        }

        // Fire Check
        if (this.fireKey.isDown && this.bulletTimer == 0) {
            this.newBull = this.add.sprite(this.objects.player.x, this.objects.player.y - 25, "bulletSprite").setOrigin(0.5, 0.5).setScale(0.25);
            this.objects.bullets.push(this.newBull); // add the bullet to the bullet array
            this.bulletTimer = this.bulletDelay; // reset the bullet timer
            this.objects.player.setScale(1.1); // scale the player sprite up
        } else {
            this.objects.player.setScale(1); // scale the player sprite down
        }
        //Enemy Movement
        this.enemyMovement(); // move the enemies
    }
    fixShields() {
        for(let i = 0; i < this.health; i++) {
            if(this.objects.shields[i] == null) {
                this.objects.shields[i] = this.add.sprite(this.game.config.width - 40 - (i * 60), 550, "shieldSprite").setOrigin(0.5, 0.5).setScale(0.5);
            }
        }
    }
    addCluster(enemyCount = 5, leaderSprite = "wellSprite", followerSprite = "hutSprite") {
        let mainEnemy = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, leaderSprite).setOrigin(0.5, 0.5).setScale(0.5);
        let cluster = {}
        cluster.mainEnemy = mainEnemy; // set the main enemy to the enemy sprite
        cluster.enemies = []; // set the enemy array to an empty array
        let testEnemy = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, followerSprite).setOrigin(0.5, 0.5).setScale(0.5).setVisible(false);

        //assembling numbers for the calculation of the enemy positions
        const spriteWidth = testEnemy.width; // get the width of the enemy sprite
        const spriteLength = testEnemy.height; // get the length of the enemy sprite
        const centerX = mainEnemy.x; // get the x position of the main enemy
        const centerY = mainEnemy.y; // get the y position of the main enemy
        const radius = spriteLength * 3 / 4;

        
        for(let i = 0; i < enemyCount; i++) {
            //first, set the posisition of this enemy from the main enemy
            const angle = (i * (360 / enemyCount)) * (Math.PI / 180); // convert the angle to radians because javascript uses radians and I think in degrees... sorry Trig.

            const x = centerX + radius * Math.cos(angle); // calculate the x position of the enemy
            const y = centerY + radius * Math.sin(angle); // calculate the y position of the enemy

            let enemy = this.add.sprite(x, y, "hutSprite").setOrigin(0.5, 0.5).setScale(0.5); // create the enemy sprite

            //Now, we must set the rotation correctly
            enemy.angle = (i * (360 / enemyCount)) + 90; // set the angle of the enemy sprite
            cluster.enemies.push(enemy); // add the enemy to the enemy array
        }
        testEnemy.destroy(); // destroy the enemy sprite because we don't need it anymore
        this.objects.enemies.push(cluster); // add the enemy to the enemy array
    }
    enemyMovement() {
        for(let cluster of this.objects.enemies) {
            cluster.mainEnemy.x += Math.sin(this.time.now / 1000); // move the main enemy sprite left and right
            cluster.mainEnemy.y += Math.cos(this.time.now / 1000); // move the main enemy sprite up and down
        }
        this.clusterRevolution(); // rotate the enemy sprites
    }
    clusterRevolution() {
        for(let cluster of this.objects.enemies) {
            for(let enemy of cluster.enemies) {
                const radius = enemy.height * 3 / 4;
                const angle = (cluster.enemies.indexOf(enemy) * (360 / cluster.enemies.length)) * (Math.PI / 180); // convert the angle to radians because javascript uses radians and I think in degrees... sorry Trig.

                const x = cluster.mainEnemy.x + radius * Math.cos(angle + (this.time.now / 1000)); // calculate the x position of the enemy
                const y = cluster.mainEnemy.y + radius * Math.sin(angle + (this.time.now / 1000)); // calculate the y position of the enemy

                enemy.x = x; // set the x position of the enemy
                enemy.y = y; // set the y position of the enemy

                //Now, we must set the rotation correctly
                enemy.angle = (cluster.enemies.indexOf(enemy) * (360 / cluster.enemies.length)) + 90 + this.time.now / 17.5; // set the angle of the enemy sprite
            }
        }
    }
}