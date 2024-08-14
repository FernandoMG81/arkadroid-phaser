export class Scoreboard {
  constructor (scene) {
    this.relatedScene = scene
    this.score = 0
    this.lives = 3

    // Puedes inicializar el puntaje desde el registro si es necesario
    if (this.relatedScene.registry.has('score')) {
      this.score = this.relatedScene.registry.get('score')
    } else {
      this.relatedScene.registry.set('score', this.score)
    }
    if (this.relatedScene.registry.has('lives')) {
      this.lives = this.relatedScene.registry.get('lives')
    } else {
      this.relatedScene.registry.set('lives', this.lives)
    }
  }

  create () {
    this.scoreText = this.relatedScene.add.text(70, 20, 'score: ' + this.score, {
      fontFamily: 'starjedi',
      fontSize: '32px',
      fill: '#fae41e',
      // backgroundColor: '#000',
      padding: { x: 5, y: 10 }

    })
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.livesImages = this.relatedScene.add.group({
      key: 'life',
      frameQuantity: this.lives,
      gridAlign: {
        width: this.lives,
        height: 1,
        cellWidth: 80,
        cellHeight: 47,
        x: this.relatedScene.game.config.width - 300,
        y: 20
      }
    })

    this.timer = this.relatedScene.time.addEvent({ delay: 1000, callback: this.relatedScene.onEvent, callbackScope: this.relatedScene, repeat: 100 })
    this.timer.paused = true
    this.textTimer = this.relatedScene.add.text(this.relatedScene.game.config.width / 2, 20, `time: ${this.timer.repeatCount}`, {
      fontFamily: 'starjedi',
      fontSize: '32px',
      fill: '#fae41e',
      padding: { x: 5, y: 10 }
    }).setOrigin(0.5, 0)
  }

  update () {
    this.textTimer.setText(`time: ${this.timer.repeatCount}`)
    if (this.relatedScene.keys.space.isDown) {
      this.timer.paused = false
    }
  }

  incrementScore (points) {
    this.score += points
    this.relatedScene.registry.set('score', this.score)
    this.scoreText.setText('score: ' + this.score)
  }

  getLives () {
    return this.lives
  }

  decrementLives () {
    this.timer.paused = true
    if (this.lives > 0) {
      this.lives--
      this.relatedScene.registry.set('lives', this.lives)
      const lifeSprite = this.livesImages.getLast(true)

      this.livesImages.remove(lifeSprite, true)
    }
  }

  getScore () {
    return this.score
  }

  incrementScoreByTime (relatedScene, points) {
    this.relatedScene = relatedScene
    let remainingTime = this.timer.repeatCount

    this.timer = this.relatedScene.time.addEvent({
      delay: 10,
      callback: () => {
        if (remainingTime > 0) {
          this.score += points
          remainingTime -= 1
          this.relatedScene.registry.set('score', this.score)
          this.scoreText.setText('score: ' + this.score)
          this.textTimer.setText('Time: ' + remainingTime)
        } else {
          this.timer.remove()
          this.relatedScene.scene.updating = true
        }
      },
      callbackScope: this,
      loop: true
    })
  }
}
