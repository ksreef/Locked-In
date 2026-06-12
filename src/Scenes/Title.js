class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    create() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.cameras.main.setBackgroundColor('black');

        this.add.text(cx, cy - 60, 'LOCKED IN', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: 'white',
            stroke: 'black',
            strokeThickness: 4,
        }).setOrigin(0.5);

        this.add.text(cx, cy + 20, 'Press any key to start', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: 'white',
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown', () => {
            this.scene.start('platformerScene');
        });
    }
}