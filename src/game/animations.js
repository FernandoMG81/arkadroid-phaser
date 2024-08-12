export const createAnimations = (scene) => {

  // // agregar animaciones al grupo de enemigos
  // scene.anims.create({
  //   key: 'imperial_tie_fighter',
  //   frames: scene.anims.generateFrameNumbers('imperial_tie_fighter', { frames: [0, 1, 2, 3, 4, 4, 3, 2, 1, 0] }), frameRate: 4, repeat: -1
  // });

  // Animación para el 'tie_interceptor'
  scene.anims.create({
    key: 'tie_interceptor_anim',
    frames: scene.anims.generateFrameNumbers('tie_interceptor', { frames: [0, 1, 2, 3, 4, 4, 3, 2, 1, 0] }),
    frameRate: 4,
    repeat: -1
  });

  // Animación para el 'imperial_tie_fighter'
  scene.anims.create({
    key: 'imperial_tie_fighter_anim',
    frames: scene.anims.generateFrameNumbers('imperial_tie_fighter', { frames: [0, 1, 2, 3, 4, 4, 3, 2, 1, 0] }),
    frameRate: 4,
    repeat: -1
  });

  //scene.ball.anims.create({ key: 'ball', frames: scene.anims.generateFrameNumbers('ball', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
  scene.anims.create({
    key: 'ball_anim',
    frames: scene.anims.generateFrameNumbers('ball', { start: 0, end: 7 }), frameRate: 8, repeat: -1
  });

  // En el método create
  scene.anims.create({
    key: 'move_right',
    frames: scene.anims.generateFrameNumbers('deathstar_boss', { start: 0, end: 8 }), // Frames para la derecha
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: 'move_left',
    frames: scene.anims.generateFrameNumbers('deathstar_boss', { start: 9, end: 16 }), // Frames para la izquierda
    frameRate: 10,
    repeat: -1
  });



}