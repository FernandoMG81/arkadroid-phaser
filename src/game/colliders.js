export function milleniumBallImpact (ball, millenium, scene) {
  const relativeImpact = ball.x - millenium.x

  scene.bounceSound.play()
  if (relativeImpact < 0.1 && relativeImpact > -0.1) {
    ball.setVelocityX(Phaser.Math.Between(-10, 10))
  } else {
    ball.setVelocityX(relativeImpact * 10)
  }
}

export function ballBrickCollision (ball, brick, scene) {
  let health = brick.getData('health')
  if (health) {
    health -= 1
    if (health > 0) {
      brick.setData('health', health)
      scene.scoreboard.incrementScore(40)
      scene.explosionSound.play()
      ensureMinimumVelocity(ball)
      return
    }
  }

  brick.disableBody(true, true)
  scene.scoreboard.incrementScore(10)
  scene.explosionSound.play()
}

function ensureMinimumVelocity (ball) {
  const minVelocity = 200

  if (Math.abs(ball.body.velocity.x) < minVelocity) {
    ball.setVelocityX(ball.body.velocity.x < 0 ? -minVelocity : minVelocity)
  }

  if (Math.abs(ball.body.velocity.y) < minVelocity) {
    ball.setVelocityY(ball.body.velocity.y < 0 ? -minVelocity : minVelocity)
  }
}

export function milleniumLaserCollision (millenium, laser, scene) {
  laser.destroy()

  scene.inputs.handleLifeLoss()
}
