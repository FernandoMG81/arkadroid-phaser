import { Scene } from 'phaser';
import { Scoreboard } from '../../components/scoreboard';
import { Inputs } from '../../game/Inputs';
import { milleniumBallImpact, ballBrickCollision } from '../../game/colliders';

export class Level1_3 extends Scene {
  #soundLevel = null
  constructor() {
    super('Level1_3');
  }

  init() {
    this.scoreboard = new Scoreboard(this);
    this.updating = true;
  }

  create() {

    this.physics.world.setBoundsCollision(true, true, true, false)


    /** Background Level */
    this.add.image(512, 384, 'background_space_level')
      .setDisplaySize(this.game.config.width, this.game.config.height);

    /** Sounds */
    this.#soundLevel = this.sound.add('level1_music', { loop: true, volume: 0.5 })
    this.#soundLevel.play()
    this.ballStartSound = this.sound.add('ball_start')
    this.explosionSound = this.sound.add('explosion_sound')
    this.bounceSound = this.sound.add('bounce_sound')
    this.lostLifeSound = this.sound.add('lost_life')
    this.laser1Sound = this.sound.add('laser1_sound')
    this.tieLaserSound = this.sound.add('tie_laser_sound')

    /** Bricks */
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
      immovable: true,
    })

    this.star_destroyer_brick = this.physics.add.image(this.game.config.width / 2, 120, 'star_destroyer').setImmovable()
    this.star_destroyer_brick.body.setSize(160, 200)
    this.star_destroyer_brick.setData('health', 5)

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
      immovable: true,
    })

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
      immovable: true,

    })
    this.tie_bricks_1.getChildren().forEach(sprite => sprite.play('tie_interceptor_anim'));

    this.tie_bricks_2.getChildren().forEach(sprite => sprite.play('tie_interceptor_anim'));

    this.imperial_bricks.getChildren().forEach(sprite => sprite.play('imperial_tie_fighter_anim'));

    /** Interface */
    this.scoreboard.create();


    /** Millenium Falcon */
    this.millenium = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'millenium_falcon').setImmovable()
    this.millenium.body.allowGravity = false;
    this.millenium.setCollideWorldBounds(true)

    /** Ball */
    this.ball = this.physics.add.sprite(this.millenium.x, this.millenium.y - 36, 'ball');
    this.ball.setData('glue', true)
    this.ball.setCollideWorldBounds(true)
    this.ball.setBounce(1)
    this.ball.setCircle(16)

    /** Colliders */
    this.physics.add.collider(this.ball, this.millenium, (ball, millenium) => milleniumBallImpact(ball, millenium, this));
    this.physics.add.collider(this.ball, this.tie_bricks_1, (ball, brick) => ballBrickCollision(ball, brick, this));
    this.physics.add.collider(this.ball, this.tie_bricks_2, (ball, brick) => ballBrickCollision(ball, brick, this));
    this.physics.add.collider(this.ball, this.imperial_bricks, (ball, brick) => ballBrickCollision(ball, brick, this));
    this.physics.add.collider(this.ball, this.star_destroyer_brick, (ball, brick) => ballBrickCollision(ball, brick, this));



    /** Inputs */
    this.keys = this.input.keyboard.createCursorKeys();
    this.inputs = new Inputs(this);
  }

  update() {
    if (this.updating) {
      this.inputs.update();
      this.scoreboard.update();

      if (this.tie_bricks_1.countActive() === 0 && this.tie_bricks_2.countActive() === 0 && this.imperial_bricks.countActive() === 0) {
        this.updating = false;
        this.scoreboard.incrementScoreByTime(this, 20);
      }
    } else {
      // stop all animations
      this.ball.setVelocity(0, 0)
      this.ball.anims.stop()
      this.millenium.setVelocity(0, 0)
      setTimeout(() => {
        this.#soundLevel.stop()
        this.scene.start('Level1_Boss');
      }, 2000);
    }
  }
}