class Intro extends Phaser.Scene {
    constructor() {
        super("introScene");

        this.back = null; // background sprite
        this.player = null; // player sprite
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("bg", "kenney_cartography-pack/Textures/parchmentBasic.png");

        this.load.image("fire", "fixed-sprites/campfire.png");
    }

    create() {
        this.back = this.add.sprite(0, 0, "bg").setOrigin(0, 0).setScale(0.8); // setOrigin(0, 0) sets the origin to the top left corner of the image
        this.back.z = -1; // set the z index of the background sprite to 0
        this.player = this.add.sprite(400, 475, "fire").setOrigin(0.5, 0.5).setScale(1); // setOrigin(0.5, 0.5) sets the origin to the center of the image

        let TitleText = this.add.text(400, 200, "MAPPING MESS", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#000000",
            align: "center",
            padding: {
                x: 10,
                y: 10
            },
            fixedWidth: 0 // set the width to 0 to make it auto size
        }).setOrigin(0.5, 0.5); // setOrigin(0.5, 0.5) sets the origin to the center of the image
        
        let KeyText = this.add.text(400, 275, "Press Any Key to Start", {
            fontFamily: "Arial",
            fontSize: "26px",
            color: "#000000",
            align: "center",
            padding: {
                x: 10,
                y: 10
            },
            fixedWidth: 0 // set the width to 0 to make it auto size
        }).setOrigin(0.5, 0.5); // setOrigin(0.5, 0.5) sets the origin to the center of the image
        
        let switchKey = this.input.keyboard.on("keydown", (key) => {
            this.scene.start("gameScene")
            console.log("switching scenes")
        }); // start the game when any key is pressed
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability
    }

}