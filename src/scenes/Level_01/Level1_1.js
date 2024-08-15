import { Scene } from 'phaser'
import { Scoreboard } from '../../components/scoreboard'
import { Inputs } from '../../game/Inputs'
import { milleniumBallImpact, ballBrickCollision, milleniumLaserCollision } from '../../game/colliders'
import { createEnemyShot, removeEnemyShotEvent } from '../../game/actions'

export class Level1_1 extends Scene {
  // #soundLevel = null
  constructor () {
    super('Level1_1')
  }

  init () {
    this.scoreboard = new Scoreboard(this)
    this.updating = true
  }

  create () {
    this.physics.world.setBoundsCollision(true, true, true, false)

    /** Background Level */
    this.add.image(512, 384, 'background_death_star_level')
      .setDisplaySize(this.game.config.width, this.game.config.height)
      .setAlpha(0.5)

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
      key: 'imperial_tie_fighter',
      frameQuantity: 12,
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

    /** Group for Enemy Lasers */
    this.enemyLasers = this.physics.add.group({
      defaultKey: 'laser',
      maxSize: 50
    })

    this.bricks.playAnimation('imperial_tie_fighter_anim')

    /** Interface */
    this.scoreboard.create()

    /** Player */
    this.millenium = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'millenium_falcon').setImmovable()
    this.millenium.body.allowGravity = false
    this.millenium.setCollideWorldBounds(true)

    /** Ball */
    this.ball = this.physics.add.sprite(this.millenium.x, this.millenium.y - 36, 'ball')
    this.ball.setCircle(16)
    this.ball.setCollideWorldBounds(true)
    this.ball.setBounce(1)
    this.ball.setData('glue', true)

    /** Colliders */
    this.physics.add.collider(this.ball, this.millenium, (ball, millenium) => milleniumBallImpact(ball, millenium, this), null, this)
    this.physics.add.collider(this.ball, this.bricks, (ball, brick) => ballBrickCollision(ball, brick, this), null, this)
    this.physics.add.collider(this.enemyLasers, this.millenium, (laser, millenium) => milleniumLaserCollision(laser, millenium, this), null, this)

    /** Inputs */
    this.keys = this.input.keyboard.createCursorKeys()
    this.joystickCursors = this.joystick !== undefined ? this.joystick.createCursorKeys() : undefined
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
        this.scoreboard.incrementScoreByTime(this, 10)
      }

      if (this.scoreboard.getLives() === 0) {
        this.soundLevel.stop()
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
        this.scene.start('Level1_2')
      }, 3000)
    }
  }
}
