import { Scene } from 'phaser'

export class Intro extends Scene {
  constructor () {
    super('Intro')
  }

  create () {
    const intro = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, 'intro')
    intro.play().setVolume(0.3)

    // Crear el texto intermitente
    const skipText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 50, 'click o barra espaciadora para saltar', {
      fontFamily: 'starjedi',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5)

    // Hacer que el texto parpadee
    this.tweens.add({
      targets: skipText,
      alpha: { from: 1, to: 0 },
      ease: 'Cubic.easeInOut',
      duration: 1000,
      repeat: -1,
      yoyo: true
    })

    // Función para saltar el video
    const skipVideo = () => {
      intro.stop()
      this.scene.start('Level1_1')
    }

    // Saltar el video al hacer clic en cualquier parte de la pantalla
    this.input.once('pointerdown', skipVideo)

    // Saltar el video al presionar la barra espaciadora
    this.input.keyboard.once('keydown-SPACE', skipVideo)

    // Cuando el video termine naturalmente, cambiar de escena
    intro.on('complete', skipVideo)
  }
}
