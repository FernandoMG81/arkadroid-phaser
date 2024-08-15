import { Scene } from 'phaser'
import { Scoreboard } from '../../components/scoreboard'
import { Inputs } from '../../game/Inputs'
import { milleniumBallImpact, ballBrickCollision, milleniumLaserCollision } from '../../game/colliders'
import { createEnemyShot, removeEnemyShotEvent } from '../../game/actions'

export class Level1_2 extends Scene {
  constructor () {
    super('Level1_2')
  }

  init () {
    this.scoreboard = new Scoreboard(this)
    this.updating = true
  }

  create () {
    this.physics.world.setBoundsCollision(true, true, true, false)

    /** Background Level */
    this.add.image(512, 384, 'background_space_level')
      .setDisplaySize(this.game.config.width, this.game.config.height)

    /** Sounds */
    this.soundLevel = this.sound.add('level1_music', { loop: true, volume: 0.3 })
    this.soundLevel.play()
    this.ballStartSound = this.sound.add('ball_start', { volume: 0.3 })
    this.explosionSound = this.sound.add('explosion_sound', { volume: 0.3 })
    this.bounceSound = this.sound.add('bounce_sound', { volume: 0.3 })
    this.lostLifeSound = this.sound.add('lost_life', { volume: 0.3 })
    this.laser1Sound = this.sound.add('laser1_sound', { volume: 0.3 })
    this.tieLaserSound = this.sound.add('tie_laser_sound', { volume: 0.3 })

    /** Bricks */
    this.bricks = this.physics.add.group({
      key: ['tie_interceptor', 'imperial_tie_fighter'],
      frameQuantity: 6,
      gridAlign: {
        width: 6,
        height: 2,
        cellWidth: 90,
        cellHeight: 80,
        x: 250,
        y: 100
      },
      immovable: true
    })

    this.bricks.getChildren().forEach(sprite => {
      if (sprite.texture.key === 'tie_interceptor') {
        sprite.play('tie_interceptor_anim')
      } else if (sprite.texture.key === 'imperial_tie_fighter') {
        sprite.play('imperial_tie_fighter_anim')
      }
    })

    this.enemyLasers = this.physics.add.group({
      defaultKey: 'laser',
      maxSize: 50
    })

    // Aplicar tweens encadenados a los bricks
    this.bricks.getChildren().forEach((brick) => {
      // Guardar la posición inicial
      const initialX = brick.x

      // Crear los tweens encadenados
      this.createTweensForBrick(brick, initialX)
    })

    /** Interface */
    this.scoreboard.create()

    /** Millenium Falcon */
    this.millenium = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'millenium_falcon').setImmovable()
    this.millenium.body.allowGravity = false
    this.millenium.setCollideWorldBounds(true)

    /** Ball */
    this.ball = this.physics.add.sprite(this.millenium.x, this.millenium.y - 36, 'ball')
    this.ball.setData('glue', true)
    this.ball.setCollideWorldBounds(true)
    this.ball.setCircle(16)
    this.ball.setBounce(1)

    /** Colliders */
    this.physics.add.collider(this.ball, this.millenium, (ball, millenium) => milleniumBallImpact(ball, millenium, this))
    this.physics.add.collider(this.ball, this.bricks, (ball, brick) => ballBrickCollision(ball, brick, this))
    this.physics.add.collider(this.enemyLasers, this.millenium, (laser, millenium) => milleniumLaserCollision(laser, millenium, this), null, this)

    /** Inputs */
    this.keys = this.input.keyboard.createCursorKeys()
    this.inputs = new Inputs(this)

    /** Random Enemy Shooting */
    this.shootEvent = createEnemyShot(this, Phaser.Math.Between(3000, 5000))
    this.time.paused = true
  }

  createTweensForBrick (brick, initialX) {
    // Tween para mover a la derecha
    this.tweens.add({
      targets: brick,
      x: {
        value: initialX + 200, // Mover 200 píxeles a la derecha
        duration: 2000,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          // Actualizar manualmente la posición del cuerpo físico del brick
          brick.body.x = brick.x - brick.body.halfWidth
          brick.body.y = brick.y - brick.body.halfHeight
        }
      },
      onComplete: () => {
        // Tween para mover a la izquierda más allá de la posición inicial
        this.tweens.add({
          targets: brick,
          x: {
            value: initialX - 200, // Mover 400 píxeles a la izquierda desde el punto más a la derecha
            duration: 2000,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
              // Actualizar manualmente la posición del cuerpo físico del brick
              brick.body.x = brick.x - brick.body.halfWidth
              brick.body.y = brick.y - brick.body.halfHeight
            }
          },
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

      if (this.bricks.countActive() === 0) {
        this.updating = false
        this.scoreboard.incrementScoreByTime(this, 20)
      }
    } else {
      // stop all animations
      this.ball.setVelocity(0, 0)
      this.ball.anims.stop()
      this.millenium.setVelocity(0, 0)
      removeEnemyShotEvent(this)
      this.enemyLasers.setVelocity(0, 0)
      setTimeout(() => {
        this.soundLevel.stop()
        this.enemyLasers.clear()
        this.scene.start('Level1_3')
      }, 3000)
    }
  }
}
