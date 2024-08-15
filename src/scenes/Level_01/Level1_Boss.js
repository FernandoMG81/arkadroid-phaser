import { Scene } from 'phaser'
import { Scoreboard } from '../../components/scoreboard'
import { Inputs } from '../../game/Inputs'
import { milleniumBallImpact, ballBrickCollision, milleniumLaserCollision } from '../../game/colliders'
import { createEnemyShot, removeEnemyShotEvent } from '../../game/actions'

export class Level1_Boss extends Scene {
  constructor () {
    super('Level1_Boss')
  }

  init () {
    this.scoreboard = new Scoreboard(this)
    this.updating = false
    this.introActive = true
  }

  create () {
    this.physics.world.setBoundsCollision(true, true, true, false)

    /** Background Level */
    this.add.image(512, 384, 'background_space_level')
      .setDisplaySize(this.game.config.width, this.game.config.height)

    /** Mobile Joystick */
    const isMobile = !this.sys.game.device.os.desktop

    if (isMobile) {
      this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
        x: 150,
        y: this.game.config.height - 300,
        radius: 100,
        base: this.add.circle(0, 0, 50, 0x277CC9, 0.5),
        thumb: this.add.circle(0, 0, 25, 0xcccccc, 0.5)
      })
    }

    /** Sounds */
    this.bossIntroSound = this.sound.add('darkside_sound', { volume: 0.3 })
    this.bossIntroSound.play()
    this.soundLevel = this.sound.add('level1_Boss_music', { loop: true, volume: 0.3 })
    this.soundLevel.play()
    this.ballStartSound = this.sound.add('ball_start', { volume: 0.3 })
    this.explosionSound = this.sound.add('explosion_sound', { volume: 0.3 })
    this.bounceSound = this.sound.add('bounce_sound', { volume: 0.3 })
    this.lostLifeSound = this.sound.add('iamyourfather', { volume: 0.3 })
    this.laser1Sound = this.sound.add('laser1_sound', { volume: 0.3 })
    this.tieLaserSound = this.sound.add('tie_laser_sound', { volume: 0.3 })

    /** Bricks */

    /** Millenium Falcon */
    this.millenium = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'millenium_falcon').setImmovable()
    this.millenium.body.allowGravity = false
    this.millenium.setCollideWorldBounds(true)

    /** Ball */
    this.ball = this.physics.add.sprite(this.millenium.x, this.millenium.y - 36, 'ball')
    this.ball.setData('glue', true)
    this.ball.setCollideWorldBounds(true)
    this.ball.setBounce(1)
    this.ball.setCircle(16)

    // Esperar a que el sonido de introducción termine
    this.bossIntroSound.on('complete', () => {
      this.bricks = this.physics.add.group({
        immovable: true // Asegura que todos los bricks sean inmóviles
      })
      this.death_star = this.physics.add.sprite(this.game.config.width / 2, 160, 'deathstar_boss').setImmovable()
      this.death_star.body.setCircle(142)
      this.death_star.setData('health', 15)

      this.death_star.setBounce(1)
      this.death_star.body.setDrag(0)

      this.bricks.add(this.death_star)
      this.createTweensForBrick(this.death_star, this.death_star.x)

      this.enemyLasers = this.physics.add.group({
        defaultKey: 'laser',
        maxSize: 100
      })

      /** Interface */
      this.scoreboard.create()

      /** Colliders */
      this.physics.add.collider(this.ball, this.millenium, (ball, millenium) => milleniumBallImpact(ball, millenium, this))
      this.physics.add.collider(this.ball, this.bricks, (ball, brick) => ballBrickCollision(ball, brick, this))
      this.physics.add.collider(this.enemyLasers, this.millenium, (laser, millenium) => milleniumLaserCollision(laser, millenium, this), null, this)

      /** Inputs */
      this.keys = this.input.keyboard.createCursorKeys()
      this.joystickCursors = this.joystick !== undefined ? this.joystick.createCursorKeys() : undefined
      this.inputs = new Inputs(this)

      this.shootEvent = createEnemyShot(this, Phaser.Math.Between(1000, 2000))
      this.time.paused = true
      this.introActive = false
      this.updating = true
    })
  }

  createTweensForBrick (brick, initialX) {
    // Tween para mover a la derecha
    this.tweens.add({
      targets: brick,
      x: initialX + 200, // Mover 200 píxeles a la derecha
      duration: 4000,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Tween para mover a la izquierda más allá de la posición inicial
        this.tweens.add({
          targets: brick,
          x: initialX - 200, // Mover 400 píxeles a la izquierda desde el punto más a la derecha
          duration: 4000,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            // Repetir el ciclo
            this.createTweensForBrick(brick, initialX)
          }
        })
      }
    })
  }

  update () {
    if (this.updating) {
      this.inputs.update()
      this.scoreboard.update()

      if (this.death_star.x > this.previousX) {
        // Se está moviendo a la derecha
        this.death_star.play('move_right', true)
      } else if (this.death_star.x < this.previousX) {
        // Se está moviendo a la izquierda
        this.death_star.play('move_left', true)
      }

      // Actualizar la posición anterior
      this.previousX = this.death_star.x
      console.log(this.death_star.getData('health'))
      if (this.bricks.countActive() === 0) {
        this.updating = false
        this.scoreboard.incrementScoreByTime(this, 50)
      }
    } else if (!this.introActive) {
      // stop all animations
      this.ball.setVelocity(0, 0)
      this.ball.anims.stop()
      this.millenium.setVelocity(0, 0)
      removeEnemyShotEvent(this)
      this.enemyLasers.setVelocity(0, 0)

      setTimeout(() => {
        this.soundLevel.stop()
        this.enemyLasers.clear()
        this.scene.start('InputPanel', { score: this.scoreboard.getScore() })
      }, 3000)
    }
  }
}
