import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.add.image(512, 384, 'background_menu').setDisplaySize(this.game.config.width, this.game.config.height);
        this.menuSound = this.sound.add('menu_music', { loop: true, volume: 0.5 })
        this.menuSound.play()

        this.startButton = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'play_button').setInteractive();

        this.startButton.on('pointerover', () => {
            this.startButton.setFrame(1);
        });

        this.startButton.on('pointerout', () => {
            this.startButton.setFrame(0);
        });

        this.startButton.on('pointerdown', () => {
            this.startButton.setFrame(2);
        });

        this.startButton.on('pointerup', () => {
            this.menuSound.stop()
            this.scene.start('Game');
        });

        this.manualButton = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2 + 80, 'manual_button').setInteractive();

        this.manualButton.on('pointerover', () => {
            this.manualButton.setFrame(1);
        });

        this.manualButton.on('pointerout', () => {
            this.manualButton.setFrame(0);
        });

        this.manualButton.on('pointerdown', () => {
            this.manualButton.setFrame(2);
        });

        this.manualButton.on('pointerup', () => {
            this.menuSound.stop()
            this.scene.start('Manual');
        });

        this.rankingButton = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2 + 160, 'ranking_button').setInteractive();

        this.rankingButton.on('pointerover', () => {
            this.rankingButton.setFrame(1);
        });

        this.rankingButton.on('pointerout', () => {
            this.rankingButton.setFrame(0);
        });

        this.rankingButton.on('pointerdown', () => {
            this.rankingButton.setFrame(2);
        });

        this.rankingButton.on('pointerup', () => {
            this.menuSound.stop()
            this.scene.start('Ranking');
        });
    }
}
