export class Phase {
  constructor(scene) {
    this.relatedScene = scene;
  }

  configureCollisions() {
    this.relatedScene.physics.add.collider(this.relatedScene.ball, this.bricks, this.relatedScene.brickImpact, null, this.relatedScene);
  }

  isPhaseFinished() {
    return (this.bricks.countActive() === 0);
  }
}