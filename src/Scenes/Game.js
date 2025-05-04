class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");

        //globals
        this.objects = {}; // object array
        this.wave = 0; // wave number
        this.waveTimer = 300; // wave timer
        this.waveDelay = 300; // wave timer
        this.waveEnd = true;

        //Player
        this.objects.player; // player sprite
        this.playerSpeed = 5; // player speed
        this.playerHealth = 3; // player health

        //Enemy List
        this.objects.enemies = []; // enemy array
        this.objects.enemyBullets = [];
        this.enemyBulletSpeed = 3; // enemy bullet speed
        this.enemyBulletTimer = 0; // enemy bullet timer
        this.enemyBulletDelay = 300; // enemy bullet timer

        //UI elements
        this.objects.scoreText;
        this.score = 0; // score
        this.health = 3; // health
        this.objects.compass;
        this.objects.shields = {};
        this.objects.waveText;

        //Bullets
        this.objects.bullets = []; // bullet array
        this.bulletSpeed = 7; // bullet speed
        this.bulletTimer = 0; // bullet timer
        this.bulletDelay = 10; // bullet timer

        //Keys
        this.leftKeys = {}; // left key
        this.rightKeys = {}; // right key
        this.fireKey; // fire key
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("hutSprite", "fixed-sprites/stable.png")
        this.load.image("wellSprite", "fixed-sprites/well.png")

        this.load.image("houseSprite", "fixed-sprites/church.png")
        this.load.image("bannerSprite", "fixed-sprites/banner.png")

        this.load.image("towerSprite", "fixed-sprites/towerTall.png")
        this.load.image("castleSprite", "fixed-sprites/castle.png")

        this.load.image("bulletSprite", "fixed-sprites/elementDiamond.png")
        this.load.image("enemyBulletSprite", "fixed-sprites/elementCircle.png")
        this.load.image("shieldSprite", "fixed-sprites/elementShield.png")

        this.load.image("compassSprite", "fixed-sprites/compass.png")
    

    }

    create() {
        this.setupValues();
    }
    setupValues() {
        this.objects = {}; // object array
        this.wave = 1; // wave number
        this.waveTimer = 300; // wave timer
        this.waveDelay = 300; // wave timer
        this.waveEnd = true;

        //Player
        this.objects.player; // player sprite
        this.playerSpeed = 5; // player speed
        this.playerHealth = 3; // player health

        //Enemy List
        this.objects.enemies = []; // enemy array
        this.objects.enemyBullets = [];
        this.enemyBulletSpeed = 3; // enemy bullet speed
        this.enemyBulletTimer = 0; // enemy bullet timer
        this.enemyBulletDelay = 300; // enemy bullet timer

        //UI elements
        this.objects.scoreText;
        this.score = 0; // score
        this.health = 3; // health
        this.objects.compass;
        this.objects.shields = {};
        this.objects.waveText;

        //Bullets
        this.objects.bullets = []; // bullet array
        this.bulletSpeed = 7; // bullet speed
        this.bulletTimer = 0; // bullet timer
        this.bulletDelay = 60; // bullet timer

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
                this.objects.waveText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, "Wave " + this.wave, {
                    fontFamily: "Arial",
                    fontSize: "100px",
                    color: "#000000",
                    align: "center",
                    padding: {
                        x: 10,
                        y: 10
                    },
                    fixedWidth: 0 // set the width to 0 to make it auto size
                }).setOrigin(0.5, 0.5);
                this.objects.waveText.alpha = 1; // set the alpha to 0
        
                //shields
                this.fixShields();
                
                //keyboard input
                this.leftKeys.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT); // left key
                this.rightKeys.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); // right key
                this.leftKeys.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // left key
                this.rightKeys.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // right key
                this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // fire key
    }
    update() {
        //update waves first
        if(this.waveEnd) {
            this.handleWaveSpawn(); // spawn the enemies
        }
        //Player Key Presses
        this.keyPresses(); // check for key presses

        this.bulletMovement(); // move the bullets

        //Enemy Movement
        this.enemyMovement(); // move the enemies
        this.enemyFire(); // fire the enemies

        //Collision Checks
        this.handleCollision(); // check for collisions
    }

    fixShields() {
        for(let i = 0; i < this.health; i++) {
            if(this.objects.shields[i] == null) {
                this.objects.shields[i] = this.add.sprite(this.game.config.width - 40 - (i * 60), 550, "shieldSprite").setOrigin(0.5, 0.5).setScale(0.5);
            }
        }
        for(let i = this.health; i < 3; i++) {
            if(this.objects.shields[i] != null) {
                this.objects.shields[i].destroy(); // destroy the shield sprite
                this.objects.shields[i] = null; // set the shield sprite to null
            }
        }
    }
    bulletMovement() {
        if(this.objects.bullets.length > 0) {
            for (let bullet of this.objects.bullets) {
                bullet.y -= this.bulletSpeed; // move the bullet up
                if(bullet.y < 0) {
                    bullet.destroy(); // destroy the bullet if it goes off screen
                    this.objects.bullets.splice(this.objects.bullets.indexOf(bullet), 1); // remove the bullet from the bullet array
                }
            }
        }
        if(this.objects.enemyBullets.length > 0) {
            for (let bullet of this.objects.enemyBullets) {
                bullet.y += this.enemyBulletSpeed; // move the bullet up
                if(bullet.y > this.game.config.height) {
                    bullet.destroy(); // destroy the bullet if it goes off screen
                    this.objects.enemyBullets.splice(this.objects.enemyBullets.indexOf(bullet), 1); // remove the bullet from the bullet array
                }
            }
        }
    }

    addCluster(enemyCount = 3, leaderSprite = "wellSprite", followerSprite = "hutSprite", setX = this.game.config.width / 2, setY = this.game.config.height / 2) {
        let mainEnemy = this.add.sprite(setX, setY - 100, leaderSprite).setOrigin(0.5, 0.5).setScale(0.5);
        let originalCount = enemyCount; // set the original count to the enemy count
        let cluster = {}
        cluster.mainEnemy = mainEnemy; // set the main enemy to the enemy sprite
        cluster.enemies = []; // set the enemy array to an empty array
        cluster.collisions = [];
        cluster.originalCount = originalCount; // set the original count to the enemy count
        cluster.arriving = true;
        let testEnemy = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, followerSprite).setOrigin(0.5, 0.5).setScale(0.5).setVisible(false);
        //handling movment of the cluster
        if(leaderSprite == "wellSprite") {
            cluster.movementArray = [{x: -50, y: -25}, {x: 0, y: 50}, {x: 50, y: 25}, {x: 0, y: 0}];
        } else if(leaderSprite == "bannerSprite") {
            cluster.movementArray = [{x: -50, y: 0}, {x: -50, y: 150}, {x: 50, y: 150}, {x: 50, y: 0}, {x: 0, y: 0}];
        } else {
            cluster.movementArray = [{x: -50, y: 30}, {x: 50, y: 60}, {x: -50, y: 90}, {x: 50, y: 120}, {x: 0, y: 150}, {x: -50, y: 120}, {x: 50, y: 90}, {x: -50, y: 60}, {x: 50, y: 30}, {x: 0, y: 0}];
        }
        cluster.movePosition = 0; // set the move position to 0
        cluster.originalPosition = {x: setX, y: setY}; // set the original position to the x and y position of the enemy sprite

        //assembling numbers for the calculation of the enemy positions
        const spriteLength = testEnemy.height; // get the length of the enemy sprite
        const centerX = mainEnemy.x; // get the x position of the main enemy
        const centerY = mainEnemy.y; // get the y position of the main enemy
        const radius = spriteLength * 2 / 4;

        
        for(let i = 0; i < enemyCount; i++) {
            //first, set the posisition of this enemy from the main enemy
            const angle = (i * (360 / enemyCount)) * (Math.PI / 180); // convert the angle to radians because javascript uses radians and I think in degrees... sorry Trig.

            const x = centerX + radius * Math.cos(angle); // calculate the x position of the enemy
            const y = centerY + radius * Math.sin(angle); // calculate the y position of the enemy

            let enemy = this.add.sprite(x, y, followerSprite).setOrigin(0.5, 0.5).setScale(0.5); // create the enemy sprite

            //Now, we must set the rotation correctly
            enemy.angle = (i * (360 / enemyCount)) + 90; // set the angle of the enemy sprite
            cluster.enemies.push(enemy); // add the enemy to the enemy array
            cluster.collisions.push(enemy); // add the enemy to the collision array
        }
        testEnemy.destroy(); // destroy the enemy sprite because we don't need it anymore
        this.objects.enemies.push(cluster); // add the enemy to the enemy array
    }

    keyPresses() {
        //player bullet firing
        if(this.bulletTimer > 0) {
            this.bulletTimer--; // decrease the bullet timer by the time since the last update
        }
        //bullet movement

        // Movement Checks
        if ((this.leftKeys.key1.isDown || this.leftKeys.key2.isDown) && (this.objects.player.x - (this.objects.player.width / 2)) > 0) {
            this.objects.player.x -= 5; // move the player left
        }
        if ((this.rightKeys.key1.isDown || this.rightKeys.key2.isDown) && (this.objects.player.x + (this.objects.player.width / 2)) < this.game.config.width) {
            this.objects.player.x += 5; // move the player right
        }

        // Fire Check
        if (this.fireKey.isDown && this.bulletTimer == 0) {
            let newBull = this.add.sprite(this.objects.player.x, this.objects.player.y - 25, "bulletSprite").setOrigin(0.5, 0.5).setScale(0.25);
            this.objects.bullets.push(newBull); // add the bullet to the bullet array
            this.bulletTimer = this.bulletDelay; // reset the bullet timer
            this.objects.player.setScale(1.1); // scale the player sprite up
        } else {
            this.objects.player.setScale(1); // scale the player sprite down
        }
    }

    enemyMovement() {
        for(let cluster of this.objects.enemies) {
            if(cluster.arriving) {
                cluster.mainEnemy.y += 0.5;
                if(cluster.mainEnemy.y >= cluster.originalPosition.y) {
                    cluster.mainEnemy.y = cluster.originalPosition.y; // set the y position of the main enemy to the original position
                    cluster.arriving = false; // set the arriving flag to false
                }
            } else {
            //Temp code for a circular movement while I decide what to do...
                let destinationX = cluster.movementArray[cluster.movePosition].x;
                let destinationY = cluster.movementArray[cluster.movePosition].y;
                
                let relativeX = cluster.mainEnemy.x - cluster.originalPosition.x;
                let relativeY = cluster.mainEnemy.y - cluster.originalPosition.y;
                //from here, we have the desired position with relation and the current position with relation to the starting position
                let deltaX = destinationX - relativeX;
                let deltaY = destinationY - relativeY;
                if(Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
                    cluster.movePosition++;
                    if(cluster.movePosition >= cluster.movementArray.length) {
                        cluster.movePosition = 0; // reset the move position to 0
                    }
                }
                //this is the total distance we need to move.
                cluster.mainEnemy.x +=  deltaX * this.getEnemySpeed(cluster.mainEnemy) / 100;
                cluster.mainEnemy.y +=  deltaY * this.getEnemySpeed(cluster.mainEnemy) / 100;
            }
        }
        this.clusterRevolution(); // rotate the enemy sprites
    }

    enemyFire() {
        if(this.enemyBulletTimer > 0) {
            this.enemyBulletTimer--; // decrease the enemy bullet timer by the time since the last update
        } else {
            for(let cluster of this.objects.enemies) {
                if(cluster.collisions.length == 0) {
                    continue; // skip this cluster if there are no enemies left
                }
                let possibleAttackers = Array.from(cluster.collisions);
                for(let i = 0; i < (cluster.collisions.length) / 2; i++) {
                    let enemy = possibleAttackers[Math.floor(Math.random() * possibleAttackers.length)]; // get a random enemy from the cluster
                    let bullet = this.add.sprite(enemy.x, enemy.y + 25, "enemyBulletSprite").setOrigin(0.5, 0.5).setScale(0.25); // create the bullet sprite
                    possibleAttackers.splice(possibleAttackers.indexOf(enemy), 1); // remove the enemy from the possible attackers array
                    this.objects.enemyBullets.push(bullet); // add the bullet to the bullet array
                }
            }
            this.enemyBulletTimer = this.enemyBulletDelay; // reset the enemy bullet timer
        }
        
    }

    clusterRevolution() {
        for(let cluster of this.objects.enemies) {
            for(let enemy of cluster.enemies) {
                const radius = enemy.height * 2 / 4;
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
    handleWaveSpawn() {
        this.objects.waveText.setText("Wave " + this.wave); // set the wave text to the current wave
        this.objects.waveText.alpha = 1 + ((this.waveTimer - 300))/300; // set the alpha to 1
        if(this.wave == 1) { //First Wave
            if(this.waveTimer <= 0) {
                this.addCluster(3, "wellSprite", "hutSprite", 200, 100);
                this.addCluster(3, "wellSprite", "hutSprite", 600, 100);
                this.waveTimer = this.waveDelay; // reset the wave timer
                this.waveEnd = false; // set the wave end flag to false
                this.wave++;
            } else {
                this.waveTimer--;
            }
        } else if(this.wave == 2) {
            if(this.waveTimer <= 0) {
                this.addCluster(3, "wellSprite", "hutSprite", 125, 100);
                this.addCluster(3, "wellSprite", "hutSprite", 400, 100);
                this.addCluster(3, "wellSprite", "hutSprite", 675, 100);
                this.waveTimer = this.waveDelay; // reset the wave timer
                this.waveEnd = false; // set the wave end flag to false
                this.wave++;
            } else {
                this.waveTimer--;
            }
        } else if(this.wave == 3) {
            if(this.waveTimer <= 0) {
                this.addCluster(3, "wellSprite", "hutSprite", 125, 100);
                this.addCluster(4, "bannerSprite", "houseSprite", 400, 100);
                this.addCluster(3, "wellSprite", "hutSprite", 675, 100);
                this.waveTimer = this.waveDelay; // reset the wave timer
                this.waveEnd = false; // set the wave end flag to false
                this.wave++;
            } else {
                this.waveTimer--;
            }
        } else if(this.wave == 4) {
            if(this.waveTimer <= 0) {
                this.addCluster(3, "wellSprite", "hutSprite", 75, 100);
                this.addCluster(4, "bannerSprite", "houseSprite", 225, 100);
                this.addCluster(3, "wellSprite", "hutSprite", 400, 100);
                this.addCluster(4, "bannerSprite", "houseSprite", 575, 100);
                this.addCluster(3, "wellSprite", "hutSprite", 725, 100);
                this.waveTimer = this.waveDelay; // reset the wave timer
                this.waveEnd = false; // set the wave end flag to false
                this.wave++;
            } else {
                this.waveTimer--;
            }
        } else if(this.wave == 5) {
            if(this.waveTimer <= 0) {
                this.addCluster(4, "bannerSprite", "houseSprite", 50, 100);
                this.addCluster(3, "wellSprite", "hutSprite", 250, 100);
                this.addCluster(5, "castleSprite", "towerSprite", 400, 100);
                this.addCluster(3, "wellSprite", "hutSprite", 550, 100);
                this.addCluster(4, "bannerSprite", "houseSprite", 700, 100);
                this.waveTimer = this.waveDelay; // reset the wave timer
                this.waveEnd = false; // set the wave end flag to false
                this.wave++;
            } else {
                this.waveTimer--;
            }
        } else {
            this.scene.start("winScene"); // go to the win scene
        }
    }
    handleCollision() {
        this.playerCollide(); // check for player collisions
        this.enemyCollide(); // check for enemy collisions
    }
    playerCollide() {
        for(let bullet of this.objects.enemyBullets) {
            if(this.collides(bullet, this.objects.player)) {
                bullet.destroy(); // destroy the bullet
                this.objects.enemyBullets.splice(this.objects.enemyBullets.indexOf(bullet), 1); // remove the bullet from the bullet array
                this.health--; // decrease the health by 1
                this.objects.shields[this.health].destroy(); // destroy the shield sprite
                this.fixShields();
                if(this.health <= 0) {
                    this.scene.start("overScene"); // go to the game over scene
                }
            }
        }
    }
    addScore(givenX, givenY, amount) {
        this.score += amount; // increase the score by the amount
        this.objects.scoreText.setText(this.score); // set the score text to the new score
        let scoreText = this.add.text(givenX, givenY, "+" + amount, {
            fontFamily: "Arial",
            fontSize: "40px",
            color: "#000000",
            align: "left",
            padding: {
                x: 10,
                y: 10
            },
            fixedWidth: 0 // set the width to 0 to make it auto size
        }).setOrigin(0.5, 0.5);
        this.tweens.add({
            targets: scoreText,
            alpha: 0,
            y: givenY - 50,
            duration: 1000,
            ease: 'Power1'
        });
    }
    getEnemyScore(enemy) {
        if(enemy.texture.key == "hutSprite") {
            return 1; // return the score for the well sprite
        }
        else if(enemy.texture.key == "wellSprite") {
            return 2; // return the score for the hut sprite
        }
        else if(enemy.texture.key == "houseSprite") {
            return 2; // return the score for the hut sprite
        }
        else if(enemy.texture.key == "bannerSprite") {
            return 3; // return the score for the hut sprite
        }
        else if(enemy.texture.key == "towerSprite") {
            return 3; // return the score for the hut sprite
        }
        else if(enemy.texture.key == "castleSprite") {
            return 4; // return the score for the hut sprite
        }
    }
    getEnemySpeed(enemy) {
        if(enemy.texture.key == "wellSprite") {
            return 0.5; // return the score for the hut sprite
        }
        if(enemy.texture.key == "bannerSprite") {
            return 1; // return the score for the hut sprite
        }
        if(enemy.texture.key == "castleSprite") {
            return 1.5; // return the score for the hut sprite
        }
    }
    enemyCollide() {
        for(let bullet of this.objects.bullets) {
            for(let cluster of this.objects.enemies) {
                for(let enemy of cluster.collisions) {
                    if(this.collides(bullet, enemy)) {
                        this.eliminateBullet(bullet);
                        enemy.destroy(); // destroy the enemy
                        cluster.collisions.splice(cluster.collisions.indexOf(enemy), 1); // remove the enemy from the enemy array
                        this.addScore(enemy.x, enemy.y, this.getEnemyScore(enemy)); // add the score
                        if(this.objects.enemies.length == 0) {
                            this.waveEnd = true; // set the wave end flag to true
                        }
                        break; // break out of the loop
                        }
                }
                if(this.collides(bullet, cluster.mainEnemy)) {
                    for(let enemy of cluster.collisions) {
                        this.addScore(enemy.x, enemy.y, this.getEnemyScore(enemy));
                        enemy.destroy(); // destroy the enemy
                    }
                    for(let enemy of cluster.enemies) {
                        enemy.destroy(); // destroy the enemy
                    }
                    this.addScore(cluster.mainEnemy.x, cluster.mainEnemy.y, this.getEnemyScore(cluster.mainEnemy)); // add the score
                    cluster.enemies = []; // remove the enemy from the enemy array
                    cluster.mainEnemy.destroy(); // destroy the main enemy
                    this.objects.enemies.splice(this.objects.enemies.indexOf(cluster), 1); // remove the cluster from the enemy array
                    
                    if(this.objects.enemies.length == 0) {
                        this.waveEnd = true; // set the wave end flag to true
                    }
                    break;
                }
            }
        }
    }
    eliminateBullet(bullet) {
        bullet.destroy(); // destroy the bullet
        this.objects.bullets.splice(this.objects.bullets.indexOf(bullet), 1); // remove the bullet from the bullet array
    }
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

}