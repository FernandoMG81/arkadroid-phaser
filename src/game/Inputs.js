export class Inputs {
  constructor(scene) {
    this.relatedScene = scene;
  }

  update() {
    if (this.relatedScene.keys.left.isDown && this.relatedScene.millenium.x > this.relatedScene.millenium.width / 2) {
      this.relatedScene.millenium.setFrame(1);
      if (this.relatedScene.ball.getData('glue')) {
        this.relatedScene.ball.x -= 10;
      }
      this.relatedScene.millenium.x -= 10;
    } else if (this.relatedScene.keys.right.isDown && this.relatedScene.millenium.x < this.relatedScene.game.config.width - this.relatedScene.millenium.width / 2) {
      this.relatedScene.millenium.setFrame(1);
      if (this.relatedScene.ball.getData('glue')) {
        this.relatedScene.ball.x += 10;
      }
      this.relatedScene.millenium.x += 10;
    } else {
      this.relatedScene.millenium.setFrame(0);
    }

    if (this.relatedScene.keys.space.isDown) {
      if (this.relatedScene.ball.getData('glue')) {
        this.releaseBall();
      }
    }

    if (this.relatedScene.ball.y > this.relatedScene.game.config.height) {
      this.handleLifeLoss();
    }

    if (this.relatedScene.scoreboard.getLives() === 0) {
      this.relatedScene.scene.pause();
      setTimeout(() => {
        this.relatedScene.stopAllSounds();
        this.relatedScene.scene.start('GameOver');
      }, 3000);
    }
  }

  releaseBall() {
    this.relatedScene.ball.setData('glue', false);
    this.relatedScene.ball.anims.play('ball_anim', true);
    this.relatedScene.ball.setVelocity(-75, -300);
    this.relatedScene.ballStartSound.play();
  }

  handleLifeLoss() {
    this.relatedScene.lostLifeSound.play();

    if (this.relatedScene.scoreboard.getLives() > 0) {
      this.relatedScene.scoreboard.decrementLives();
      this.resetBallAndShip();
    }
  }

  resetBallAndShip() {
    this.relatedScene.scene.pause();
    setTimeout(() => {
      this.relatedScene.ball.setX(this.relatedScene.millenium.x);
      this.relatedScene.ball.setY(this.relatedScene.millenium.y - 36);
      this.relatedScene.ball.setData('glue', true);
      this.relatedScene.ball.setVelocity(0, 0);
      this.relatedScene.ball.anims.stop();
      this.relatedScene.scene.resume();
    }, 2000);
  }
}
