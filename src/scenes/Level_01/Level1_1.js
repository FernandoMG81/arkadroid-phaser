import { Scene } from 'phaser';
import { Scoreboard } from '../../components/scoreboard';
import { Inputs } from '../../game/Inputs';
import { milleniumBallImpact, ballBrickCollision, milleniumLaserCollision } from '../../game/colliders';

export class Level1_1 extends Scene {
  #soundLevel = null
  constructor() {
    super('Level1_1');
  }

  init() {
    this.scoreboard = new Scoreboard(this);
    this.updating = true;
  }

  create() {

    this.physics.world.setBoundsCollision(true, true, true, false)

    /** Background Level */
    this.add.image(512, 384, 'background_death_star_level')
      .setDisplaySize(this.game.config.width, this.game.config.height)
      .setAlpha(0.5)

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
    });

    this.bricks.playAnimation('imperial_tie_fighter_anim');

    /** Interface */
    this.scoreboard.create();

    /** Player */
    this.millenium = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'millenium_falcon').setImmovable()
    this.millenium.body.allowGravity = false;
    this.millenium.setCollideWorldBounds(true)

    /** Ball */
    this.ball = this.physics.add.sprite(this.millenium.x, this.millenium.y - 36, 'ball');
    this.ball.setCircle(16)
    this.ball.setCollideWorldBounds(true)
    this.ball.setBounce(1)
    this.ball.setData('glue', true)

    /** Colliders */
    this.physics.add.collider(this.ball, this.millenium, (ball, millenium) => milleniumBallImpact(ball, millenium, this), null, this);
    this.physics.add.collider(this.ball, this.bricks, (ball, brick) => ballBrickCollision(ball, brick, this), null, this);
    this.physics.add.collider(this.enemyLasers, this.millenium, (laser, millenium) => milleniumLaserCollision(laser, millenium, this), null, this);

    /** Inputs */
    this.keys = this.input.keyboard.createCursorKeys();
    this.inputs = new Inputs(this);

    /** Random Enemy Shooting */
    this.time.addEvent({
      delay: 3000,
      callback: this.enemyShoot,
      callbackScope: this,
      loop: true
    });

  }

  update() {
    if (this.updating) {
      this.inputs.update();
      this.scoreboard.update();

      if (this.bricks.countActive() === 0) {
        this.updating = false;
        this.scoreboard.incrementScoreByTime(this, 10);
      }

      if (this.scoreboard.getLives() === 0) {
        this.#soundLevel.stop()
      }
    } else {
      // stop all animations
      this.ball.setVelocity(0, 0)
      this.ball.anims.stop()
      this.millenium.setVelocity(0, 0)
      this.enemyLasers.children.each(laser => laser.setVelocity(0, 0), this);
      setTimeout(() => {
        this.#soundLevel.stop()
        this.scene.start('Level1_2');
      }, 1500);
    }
  }


  enemyShoot() {
    const activeBricks = this.bricks.getChildren().filter(brick => brick.active);

    if (activeBricks.length > 0) {
      const randomBrick = Phaser.Utils.Array.GetRandom(activeBricks);

      const laser = this.enemyLasers.get(randomBrick.x, randomBrick.y + 20);

      if (laser) {
        laser.setActive(true);
        laser.setVisible(true);
        laser.setVelocityY(300);
        this.tieLaserSound.play();

        laser.setCollideWorldBounds(true);
        laser.body.onWorldBounds = true;
        laser.body.world.on('worldbounds', () => {
          laser.destroy();
        });
      }
    }
  }


}

