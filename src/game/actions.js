export function createEnemyShot(scene, delay = 1000) {
  scene.time.addEvent({
    delay: delay,
    callback: () => {
      const activeBricks = scene.bricks.getChildren().filter(brick => brick.active);

      if (activeBricks.length > 0) {
        const randomBrick = Phaser.Utils.Array.GetRandom(activeBricks);

        const laser = scene.enemyLasers.get(randomBrick.x, randomBrick.y + 20);

        if (laser) {
          laser.setActive(true);
          laser.setVisible(true);
          laser.setVelocityY(300);
          scene.tieLaserSound.play();

          laser.setCollideWorldBounds(true);
          laser.body.onWorldBounds = true;
          laser.body.world.on('worldbounds', () => {
            laser.destroy();
          });
        }
      }
    },
    callbackScope: scene,
    loop: true
  });
}


export function removeEnemyShotEvent(scene) {
  scene.time.removeEvent(scene.shootEvent);
}
