class Win extends Phaser.Scene {
    constructor() {
        super("winScene");
    }

    create() {
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            "You Win!", 
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
    }
}