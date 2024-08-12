import { Scene } from 'phaser';
import { Scoreboard } from '../../components/scoreboard';
import { Inputs } from '../../game/Inputs';
import { milleniumBallImpact, ballBrickCollision } from '../../game/colliders';

export class Level1_Boss extends Scene {
  #soundLevel = null
  constructor() {
    super('Level1_Boss');
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
    this.death_star = this.physics.add.sprite(this.game.config.width / 2, 160, 'deathstar_boss').setImmovable()
    this.death_star.body.setCircle(142)
    this.death_star.setData('health', 1)

    this.death_star.setBounce(1);
    this.death_star.body.setDrag(0);


    this.createTweensForBrick(this.death_star, this.death_star.x);

    this.physics.world.on('collide', (body1, body2) => {
      if (Math.abs(body1.velocity.x) < 50 && Math.abs(body1.velocity.y) < 50) {
        body1.setVelocityX(Phaser.Math.Between(-100, 100));
        body1.setVelocityY(Phaser.Math.Between(-100, 100));
      }
      if (Math.abs(body2.velocity.x) < 50 && Math.abs(body2.velocity.y) < 50) {
        body2.setVelocityX(Phaser.Math.Between(-100, 100));
        body2.setVelocityY(Phaser.Math.Between(-100, 100));
      }
    });


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
    this.physics.add.collider(this.ball, this.death_star, (ball, brick) => ballBrickCollision(ball, brick, this));


    /** Inputs */
    this.keys = this.input.keyboard.createCursorKeys();
    this.inputs = new Inputs(this);


  }

  createTweensForBrick(brick, initialX) {
    // Tween para mover a la derecha
    this.tweens.add({
      targets: brick,
      x: {
        value: initialX + 200, // Mover 200 píxeles a la derecha
        duration: 2000,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          // Actualizar manualmente la posición del cuerpo físico del brick
          brick.body.x = brick.x - brick.body.halfWidth;
          brick.body.y = brick.y - brick.body.halfHeight;
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
              brick.body.x = brick.x - brick.body.halfWidth;
              brick.body.y = brick.y - brick.body.halfHeight;
            }
          },
          onComplete: () => {
            // Repetir el ciclo
            this.createTweensForBrick(brick, initialX);
          }
        });
      }
    });
  }


  update() {
    if (this.updating) {
      this.inputs.update();
      this.scoreboard.update();

      if (this.death_star.x > this.previousX) {
        // Se está moviendo a la derecha
        this.death_star.play('move_right', true);
      } else if (this.death_star.x < this.previousX) {
        // Se está moviendo a la izquierda
        this.death_star.play('move_left', true);
      }

      // Actualizar la posición anterior
      this.previousX = this.death_star.x;

      if (!this.death_star.active) {
        this.updating = false;
        this.scoreboard.incrementScoreByTime(this, 50);
      }
    }
    else {
      // stop all animations
      this.ball.setVelocity(0, 0)
      this.ball.anims.stop()
      this.millenium.setVelocity(0, 0)

      setTimeout(() => {
        this.#soundLevel.stop()
        this.scene.start('InputPanel', { score: this.scoreboard.getScore() });
      }, 2000);
    }
  }
}