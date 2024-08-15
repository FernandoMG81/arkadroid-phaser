import { Scene } from 'phaser'
import { createAnimations } from '../game/animations'

export class Boot extends Scene {
  constructor () {
    super('Boot')
  }

  preload () {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    // Player
    this.load.spritesheet('millenium_falcon', 'assets/milleniumFalcon.png',
      { frameWidth: 134, frameHeight: 36 })

    // Backgrounds
    this.load.image('background_space_level', 'assets/backgrounds/spaceLevel.png')
    this.load.image('background_death_star_level', 'assets/backgrounds/deathStarLevel2.png')
    this.load.image('background_menu', 'assets/backgrounds/menu.png')
    this.load.image('manual', 'assets/instructions.png')
    this.load.video('background_manual', 'assets/backgrounds/manual.mp4', true)
    this.load.video('background_ranking', 'assets/backgrounds/ranking.mp4', true)
    this.load.video('background_millenium_panel', 'assets/backgrounds/millenium_panel.mp4')
    this.load.image('background_game_over', 'assets/backgrounds/gameover.png')

    // Enemies Bricks
    this.load.image('tie', 'assets/enemies/tie.png')
    this.load.spritesheet('deathstar_boss', 'assets/enemies/deathstar.png',
      { frameWidth: 300, frameHeight: 300 })

    this.load.spritesheet('imperial_tie_fighter', 'assets/enemies/imperial_tie_fighter_sprite.png', {
      frameWidth: 66,
      frameHeight: 79
    })
    this.load.spritesheet('tie_interceptor', 'assets/enemies/tie_interceptor_sprite.png', {
      frameWidth: 54,
      frameHeight: 58
    })
    this.load.image('star_destroyer', 'assets/enemies/star_destroyer.png')
    this.load.json('star_destroyer-shape', 'assets/enemies/star_destroyer-shape.json')

    this.load.image('laser', 'assets/enemies/laser.png')

    // Sounds
    this.load.audio('cantina_music', 'sounds/Cantina.aac')
    this.load.audio('darkside_sound', 'sounds/Darkside.aac')
    this.load.audio('level1_Boss_music', 'sounds/DeathStar.aac')
    this.load.audio('endgame_music', 'sounds/EndGame.aac')
    this.load.audio('level1_Boss_Fail', 'sounds/Iamyourfather.aac')
    this.load.audio('ball_start', 'sounds/InicioBola.aac')
    this.load.audio('intro_music', 'sounds/IntroJuego.aac')
    this.load.audio('level1_music', 'sounds/JuegoNVL1.aac')
    this.load.audio('laser1_sound', 'sounds/LaserEnemigo1.aac')
    this.load.audio('manual_music', 'sounds/Manual.aac')
    this.load.audio('menu_music', 'sounds/Menu.aac')
    this.load.audio('lost_life', 'sounds/PerderVida.aac')
    this.load.audio('ranking_music', 'sounds/RankingSong.aac')
    this.load.audio('bounce_sound', 'sounds/Rebote.aac')
    this.load.audio('tie_laser_sound', 'sounds/TIEFire.aac')
    this.load.audio('vader_breath', 'sounds/VaderBreath.aac')
    this.load.audio('winner_sound', 'sounds/WinnerSong.aac')
    this.load.audio('explosion_sound', 'sounds/XWingExplode.aac')
    this.load.audio('iamyourfather', 'sounds/Iamyourfather.aac')

    // Video
    this.load.video('intro', 'videos/Intro.mp4')

    // Others
    this.load.spritesheet('ball', 'assets/ball.png', { frameWidth: 32, frameHeight: 32 })
    this.load.image('wall', 'assets/interface/wall.png')
    this.load.image('life', 'assets/interface/life.png')
    this.load.image('block', 'assets/input/block.png')
    this.load.image('rub', 'assets/input/rub.png')
    this.load.image('end', 'assets/input/end.png')
    this.load.bitmapFont('arcade', 'assets/fonts/arcade.png', 'assets/fonts/arcade.xml')

    // Buttons Menu
    this.load.spritesheet('play_button', 'assets/menu/playButton.png', { frameWidth: 235, frameHeight: 59 })
    this.load.spritesheet('manual_button', 'assets/menu/manualButton.png', { frameWidth: 235, frameHeight: 59 })
    this.load.spritesheet('exit_button', 'assets/menu/exitButton.png', { frameWidth: 235, frameHeight: 59 })
    this.load.spritesheet('ranking_button', 'assets/menu/rankingButton.png', { frameWidth: 235, frameHeight: 59 })
  }

  create () {
    createAnimations(this)
    this.scene.start('Preloader')
  }
}
