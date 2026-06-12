class Win extends Phaser.Scene {
    constructor() {
        super("winScene");
    }

    create() {
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            "You've Escaped!", 
            { fontSize: "64px", fill: "white" }
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            "Made by:",
            {fontSize: "64px", fill: "white" }
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 175,
            "Caden Politiski and Keanu Schlank",
            {fontSize: "64px", fill: "white" }
        ).setOrigin(0.5);


        //restart
        const restartButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 200,
            "Restart Game",
            {
                fontSize: "48px",
                fill: "#ffff00",
                backgroundColor: "#333333",
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });

        restartButton.on("pointerdown", () => {
            this.scene.stop("winScene");
            this.scene.start("platformerScene");
        });

        restartButton.on("pointerover", () => {
            restartButton.setScale(1.1);
        });

        restartButton.on("pointerout", () => {
            restartButton.setScale(1);
        });
    }
}