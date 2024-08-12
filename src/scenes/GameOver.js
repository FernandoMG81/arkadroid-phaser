import { Scene } from 'phaser';
import { loadRanking } from '../utils/localStorage';
import { Scoreboard } from '../components/scoreboard';

export class GameOver extends Scene {
    #soundLevel = null
    constructor() {
        super('GameOver');
    }

    init() {
        this.scoreboard = new Scoreboard(this);
    }

    create() {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background_game_over');
        this.#soundLevel = this.sound.add('endgame_music', { volume: 0.5 });
        // this.#soundLevel.play();

        const currentScore = this.registry.get('currentScore'); // Assuming you store the current score in the registry
        const rankings = loadRanking();
        const lowestRankingScore = rankings[rankings.length - 1]?.score || 0;

        if (currentScore > lowestRankingScore) {
            // If the score is high enough, redirect to the input panel
            this.input.once('pointerdown', () => {
                this.scene.start('InputPanel');
            });
        } else {
            // Otherwise, show Game Over and reset lives and score
            this.add.text(512, 384, '$ game over $', {
                fontFamily: 'starjedi', fontSize: 64, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            }).setOrigin(0.5);

            this.input.once('pointerdown', () => {
                this.scoreboard.reset();
                this.scene.start('MainMenu');
            });
        }
    }
}
