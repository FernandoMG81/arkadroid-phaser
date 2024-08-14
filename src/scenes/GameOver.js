import { Scene } from 'phaser'
import { Scoreboard } from '../components/scoreboard'

export class GameOver extends Scene {
  constructor () {
    super('GameOver')
  }

  init () {
    this.scoreboard = new Scoreboard(this)
  }

  create () {
    this.registry.set('score', 0)
    this.registry.set('lives', 3)
    this.cameras.main.setBackgroundColor(0x000000)

    this.add.image(512, 384, 'background_game_over')
    this.soundLevel = this.sound.add('endgame_music', { volume: 0.3 })
    // this.#soundLevel.play();

    this.add.text(512, 384, '$ game over $', {
      fontFamily: 'starjedi',
      fontSize: 64,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5)

    this.input.once('pointerdown', () => {
      this.scene.start('MainMenu')
    })
  }
}
