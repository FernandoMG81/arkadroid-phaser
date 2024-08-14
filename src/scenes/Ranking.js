import { Scene } from 'phaser'
import { loadRanking } from '../utils/localStorage'

export class Ranking extends Scene {
  constructor () {
    super('Ranking')
  }

  create () {
    this.video = this.add.video(512, 384, 'background_ranking').setAlpha(0.7).setScale(1.3)

    this.video.play(true)

    this.add.text(270, 160, 'rank', { fontFamily: 'starjedi', fontSize: '32px' }).setTint(0xff00ff)
    this.add.text(450, 160, 'score', { fontFamily: 'starjedi', fontSize: '32px' }).setTint(0xff00ff)
    this.add.text(650, 160, 'name', { fontFamily: 'starjedi', fontSize: '32px' }).setTint(0xff00ff)

    // Cargar los rankings
    const rankings = loadRanking()

    // Definir colores y otros detalles
    const colors = [0xff0000, 0xff8200, 0xffff00, 0x00ff00, 0x00bfff, 0xff00ff, 0xff0000, 0xff8200, 0xffff00, 0x00ff00]
    const startXRank = 270
    const startXScore = 450
    const startXName = 650
    const startY = 210
    const lineHeight = 50
    const maxNameLength = 3

    rankings.forEach((rank, index) => {
      let positionText
      const suffixes = ['st', 'nd', 'rd']
      const rankIndex = index + 1

      if (rankIndex <= 3) {
        positionText = `${rankIndex}${suffixes[rankIndex - 1]}`
      } else {
        positionText = `${rankIndex}th`
      }
      const scoreText = rank.score.toString().padStart(5, ' ')
      const nameText = rank.name.padEnd(maxNameLength, ' ')

      // Agregar el texto de la posición (rank)
      this.add.text(startXRank, startY + index * lineHeight, positionText, {
        fontFamily: 'starjedi',
        fontSize: '32px'
      }).setTint(colors[index])

      // Agregar el texto de la puntuación (score)
      this.add.text(startXScore, startY + index * lineHeight, scoreText, {
        fontFamily: 'starjedi',
        fontSize: '32px'
      }).setTint(colors[index])

      // Agregar el texto del nombre (name)
      this.add.text(startXName, startY + index * lineHeight, nameText, {
        fontFamily: 'starjedi',
        fontSize: '32px'
      }).setTint(colors[index])
    })

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
      this.scene.start('MainMenu')
    })

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MainMenu')
    })
  }
}
