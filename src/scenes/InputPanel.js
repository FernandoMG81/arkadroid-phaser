import { saveRanking } from "../utils/localStorage";

export class InputPanel extends Phaser.Scene {
  constructor() {
    super({ key: 'InputPanel', active: false });

  }

  init() {
    this.playerScore = this.registry.get('score');
  }
  create() {

    this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, 'background_millenium_panel').play(true);

    const chars = [
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
      ['U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>']
    ];
    const cursor = { x: 0, y: 0 };
    let name = '';

    const input = this.add.bitmapText(280, 50, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-').setLetterSpacing(20);

    input.setInteractive();

    const rub = this.add.image(input.x + 430, input.y + 148, 'rub');
    const end = this.add.image(input.x + 482, input.y + 148, 'end');

    const block = this.add.image(input.x - 10, input.y - 2, 'block').setOrigin(0);


    const platerScore = this.add.bitmapText(280, 310, 'arcade', `score: ${this.playerScore}`).setTint(0xffff00);
    const playerText = this.add.bitmapText(710, 310, 'arcade', name).setTint(0xffff00);

    this.input.keyboard.on('keyup', event => {

      if (event.keyCode === 37) {
        //  left
        if (cursor.x > 0) {
          cursor.x--;
          block.x -= 52;
        }
      }
      else if (event.keyCode === 39) {
        //  right
        if (cursor.x < 9) {
          cursor.x++;
          block.x += 52;
        }
      }
      else if (event.keyCode === 38) {
        //  up
        if (cursor.y > 0) {
          cursor.y--;
          block.y -= 64;
        }
      }
      else if (event.keyCode === 40) {
        //  down
        if (cursor.y < 2) {
          cursor.y++;
          block.y += 64;
        }
      }
      else if (event.keyCode === 13 || event.keyCode === 32) {
        //  Enter or Space
        if (cursor.x === 9 && cursor.y === 2 && name.length > 0) {
          //  Submit
          saveRanking(name, this.playerScore);
        }
        else if (cursor.x === 8 && cursor.y === 2 && name.length > 0) {
          //  Rub
          //  Rub
          name = name.slice(0, -1);


          playerText.text = name;
        }
        else if (name.length < 3) {
          //  Add
          name = name.concat(chars[cursor.y][cursor.x]);

          playerText.text = name;
        }
      }

    });

    input.on('pointermove', (pointer, x, y) => {

      const cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
      const cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
      const char = chars[cy][cx];

      cursor.x = cx;
      cursor.y = cy;

      block.x = input.x - 10 + (cx * 52);
      block.y = input.y - 2 + (cy * 64);

    }, this);

    input.on('pointerup', (pointer, x, y) => {

      const cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
      const cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
      const char = chars[cy][cx];

      cursor.x = cx;
      cursor.y = cy;

      block.x = input.x - 10 + (cx * 52);
      block.y = input.y - 2 + (cy * 64);

      if (char === '<' && name.length > 0) {
        //  Rub
        name = name.slice(0, -1);


        playerText.text = name;
      }
      else if (char === '>' && name.length > 0) {
        //  Submit
        saveRanking({ name, score: this.playerScore });
        this.scene.start('GameOver');
      }
      else if (name.length < 3) {
        //  Add
        name = name.concat(char);

        playerText.text = name;
      }

    }, this);

  }
}


