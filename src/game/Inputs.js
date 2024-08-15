export class Inputs {
  constructor (scene) {
    this.relatedScene = scene

    // Agregar los botones de izquierda y derecha solo si se está en un dispositivo móvil
    if (this.relatedScene.sys.game.device.input.touch) {
      // Botón para mover a la izquierda
      this.leftButton = this.relatedScene.add.circle(100, this.relatedScene.game.config.height - 200, 50, 0xDBE9F6)
        .setAlpha(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          this.isLeftButtonDown = true
        })
        .on('pointerup', () => {
          this.isLeftButtonDown = false
        })
      this.leftButton.setScrollFactor(0)

      // Botón para mover a la derecha
      this.rightButton = this.relatedScene.add.circle(this.relatedScene.game.config.width - 100, this.relatedScene.game.config.height - 200, 50, 0xDBE9F6)
        .setAlpha(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          this.isRightButtonDown = true
        })
        .on('pointerup', () => {
          this.isRightButtonDown = false
        })
      this.rightButton.setScrollFactor(0)

      // Botón de disparo
      this.fireButton = this.relatedScene.add.circle(this.relatedScene.game.config.width - 100, this.relatedScene.game.config.height - 400, 50, 0x3599F4)
        .setAlpha(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          this.isFireButtonDown = true
        })
        .on('pointerup', () => {
          this.isFireButtonDown = false
        })
      this.fireButton.setScrollFactor(0)
    }
  }

  update () {
    let speed = 10

    if (this.relatedScene.keys.up.isDown) {
      speed = 15 // Incrementa la velocidad cuando se presiona hacia arriba
    }

    if ((this.relatedScene.keys.left.isDown || this.isLeftButtonDown) &&
      this.relatedScene.millenium.x > this.relatedScene.millenium.width / 2) {
      this.relatedScene.millenium.setFrame(1)
      if (this.relatedScene.ball.getData('glue')) {
        this.relatedScene.ball.x -= speed
      }
      this.relatedScene.millenium.x -= speed
    } else if ((this.relatedScene.keys.right.isDown || this.isRightButtonDown) &&
      this.relatedScene.millenium.x < this.relatedScene.game.config.width - this.relatedScene.millenium.width / 2) {
      this.relatedScene.millenium.setFrame(1)
      if (this.relatedScene.ball.getData('glue')) {
        this.relatedScene.ball.x += speed
      }
      this.relatedScene.millenium.x += speed
    } else {
      this.relatedScene.millenium.setFrame(0)
    }

    if (this.relatedScene.keys.space.isDown || this.isFireButtonDown) {
      if (this.relatedScene.ball.getData('glue')) {
        this.releaseBall()
      }
    }

    if (this.relatedScene.ball.y > this.relatedScene.game.config.height) {
      this.handleLifeLoss()
    }

    if (this.relatedScene.scoreboard.getLives() === 0) {
      this.relatedScene.scene.pause()
      this.relatedScene.soundLevel.stop()
      setTimeout(() => {
        this.relatedScene.scene.start('GameOver')
      }, 3000)
    }
  }

  releaseBall () {
    this.relatedScene.time.paused = false
    this.relatedScene.ball.setData('glue', false)
    this.relatedScene.ball.anims.play('ball_anim', true)
    this.relatedScene.ball.setVelocity(-75, -300)
    this.relatedScene.ballStartSound.play()
  }

  handleLifeLoss () {
    this.relatedScene.lostLifeSound.play()
    this.relatedScene.time.paused = true
    this.relatedScene.enemyLasers.clear(true, true)

    if (this.relatedScene.scoreboard.getLives() > 0) {
      this.relatedScene.scoreboard.decrementLives()
      this.resetBallAndShip()
    }
  }

  resetBallAndShip () {
    this.relatedScene.scene.pause()
    setTimeout(() => {
      this.relatedScene.ball.setX(this.relatedScene.millenium.x)
      this.relatedScene.ball.setY(this.relatedScene.millenium.y - 36)
      this.relatedScene.ball.setData('glue', true)
      this.relatedScene.ball.setVelocity(0, 0)
      this.relatedScene.ball.anims.stop()
      this.relatedScene.scene.resume()
    }, 2000)
  }
}
