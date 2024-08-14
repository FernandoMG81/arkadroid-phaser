import { Scene } from 'phaser'
import { Scoreboard } from '../../components/scoreboard'
import { Inputs } from '../../game/Inputs'
import { milleniumBallImpact, ballBrickCollision, milleniumLaserCollision } from '../../game/colliders'
import { createEnemyShot, removeEnemyShotEvent } from '../../game/actions'

export class Level1_3 extends Scene {
  constructor () {
    super('Level1_3')
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
      immovable: true // Asegura que todos los bricks sean inmóviles
    })

    this.tie_bricks_1 = this.physics.add.group({
      key: 'tie_interceptor',
      frameQuantity: 3,
      gridAlign: {
        width: 3,
        height: 1,
        cellWidth: 90,
        cellHeight: 80,
        x: 160,
        y: 120
      },
      immovable: true
    })

    this.bricks.addMultiple(this.tie_bricks_1.getChildren())

    this.star_destroyer_brick = this.physics.add.image(this.game.config.width / 2, 120, 'star_destroyer').setImmovable()
    this.star_destroyer_brick.body.setSize(160, 200)
    this.star_destroyer_brick.setData('health', 5)

    this.bricks.add(this.star_destroyer_brick)

    this.tie_bricks_2 = this.physics.add.group({
      key: 'tie_interceptor',
      frameQuantity: 3,
      gridAlign: {
        width: 3,
        height: 1,
        cellWidth: 90,
        cellHeight: 80,
        x: this.game.config.width - 410,
        y: 120
      },
      immovable: true
    })

    this.bricks.addMultiple(this.tie_bricks_2.getChildren())

    this.imperial_bricks = this.physics.add.group({
      key: 'imperial_tie_fighter',
      frameQuantity: 8,
      gridAlign: {
        width: 8,
        height: 1,
        cellWidth: 90,
        cellHeight: 80,
        x: 160,
        y: 230
      },
      immovable: true

    })

    this.bricks.addMultiple(this.imperial_bricks.getChildren())

    this.tie_bricks_1.getChildren().forEach(sprite => sprite.play('tie_interceptor_anim'))

    this.tie_bricks_2.getChildren().forEach(sprite => sprite.play('tie_interceptor_anim'))

    this.imperial_bricks.getChildren().forEach(sprite => sprite.play('imperial_tie_fighter_anim'))

    this.enemyLasers = this.physics.add.group({
      defaultKey: 'laser',
      maxSize: 50
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
    this.ball.setBounce(1)
    this.ball.setCircle(16)

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

  update () {
    if (this.updating) {
      this.inputs.update()
      this.scoreboard.update()

      if (this.bricks.countActive() === 0) {
        this.updating = false
        this.scoreboard.incrementScoreByTime(this, 30)
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
        this.scene.start('Level1_Boss')
      }, 3000)
    }
  }
}
