
export function milleniumBallImpact(ball, millenium, scene) {
  let relativeImpact = ball.x - millenium.x;

  scene.bounceSound.play()
  if (relativeImpact < 0.1 && relativeImpact > -0.1) {
    ball.setVelocityX(Phaser.Math.Between(-10, 10))
  } else {
    ball.setVelocityX(relativeImpact * 10)
  }


}

// export function ballBrickCollision(ball, brick, scene) {
//   let health = brick.getData('health');
//   if (health > 0) {
//     health -= 1;
//     brick.setData('health', health);
//     scene.scoreboard.incrementScore(40);
//     scene.explosionSound.play();

//     let velocityY = ball.body.velocity.y;
//     if (Math.abs(velocityY) < 30) {  // Umbral para determinar si la velocidad en Y es muy baja
//       ball.setVelocityY(velocityY + Phaser.Math.Between(-10, 10));
//     }
//     return;
//   }
//   brick.disableBody(true, true);
//   scene.scoreboard.incrementScore(10);
//   scene.explosionSound.play();

//   // Ajustar la velocidad en el eje Y ligeramente para evitar rebotes paralelos

// }

export function ballBrickCollision(ball, brick, scene) {

  let health = brick.getData('health');
  if (health) {
    health -= 1;
    if (health > 0) {
      brick.setData('health', health);
      scene.scoreboard.incrementScore(40);
      scene.explosionSound.play();
      return
    }
  }

  brick.disableBody(true, true);
  scene.scoreboard.incrementScore(10);
  scene.explosionSound.play();
}


export function milleniumLaserCollision(millenium, laser, scene) {
  laser.destroy();

  scene.inputs.handleLifeLoss();
}

