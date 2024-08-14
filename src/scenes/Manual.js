import { Scene } from 'phaser'

export class Manual extends Scene {
  constructor () {
    super('Manual')
  }

  create () {
    this.video = this.add.video(512, 384, 'background_manual').setAlpha(0.7)

    this.manualAudio = this.sound.add('manual_music', { loop: true, volume: 0.5 })
    this.manualAudio.play()

    this.add.image(512, 384, 'manual').setDisplaySize(this.game.config.width, this.game.config.height)

    this.video.play(true)

    this.exit = this.add.text(100, 60, '# volver', { fontFamily: 'starjedi', fontSize: '32px', fill: '#fae41e' }).setInteractive()

    // cambiar color al hacer hover
    this.exit.on('pointerover', () => {
      this.exit.setFill('#FFF')
    })

    this.exit.on('pointerout', () => {
      this.exit.setFill('#fae41e')
    })

    // si se apreta esc tambien vuelve al menu
    this.exit.on('pointerdown', () => {
      this.exit.setFill('#FFF')
      this.manualAudio.stop()
      this.scene.start('MainMenu')
    })

    this.input.keyboard.on('keydown-ESC', () => {
      this.manualAudio.stop()
      this.scene.start('MainMenu')
    })
  }
}
