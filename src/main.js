import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Manual } from './scenes/Manual';
import { Ranking } from './scenes/Ranking';
import { Level1_1 } from './scenes/Level_01/Level1_1';
import { Level1_2 } from './scenes/Level_01/Level1_2';
import { Level1_3 } from './scenes/Level_01/Level1_3';
import { Level1_Boss } from './scenes/Level_01/Level1_Boss';
import { InputPanel } from './scenes/InputPanel';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Manual,
        Ranking,
        Game,
        Level1_1,
        Level1_2,
        Level1_3,
        Level1_Boss,
        GameOver,

        InputPanel
    ]
};

export default new Phaser.Game(config);
