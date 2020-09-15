import * as Phaser from "phaser";

import * as Constants from "../constants";
import { mkFontStyle } from "../util";

export class TitleScene extends Phaser.Scene {
  private titleText?: Phaser.GameObjects.Text;
  private startText?: Phaser.GameObjects.Text;
  private descText?: Phaser.GameObjects.Text;

  private zKey?: Phaser.Input.Keyboard.Key;

  create(): void {
    this.cameras.main.setBackgroundColor(Constants.COLORS[7].toString());

    this.titleText = this.add.text(
      Constants.SCREEN_WIDTH / 2,
      (Constants.SCREEN_HEIGHT * 5) / 12,
      "- Wave Wave -",
      mkFontStyle(0, 48)
    );
    this.titleText.setOrigin(0.5);

    this.startText = this.add.text(
      Constants.SCREEN_WIDTH / 2,
      (Constants.SCREEN_HEIGHT * 5) / 8,
      "Z key -> Start Game",
      mkFontStyle(0, 24)
    );
    this.startText.setOrigin(0.5);
    this.startText.style.setStroke(Constants.COLORS[7].toString(), 12);

    this.descText = this.add.text(
      Constants.SCREEN_WIDTH / 2,
      (Constants.SCREEN_HEIGHT * 6) / 8,
      "ゲーム内容：なるべく長い時間, 波の粒々から逃げよう！\nカーソルキーで移動、Zキーで壁を作れるぞ！",
      mkFontStyle(0, 24)
    );
    this.descText.setOrigin(0.5);

    this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
  }

  update(): void {
    if (this.zKey?.isDown) {
      this.scene.start("game");
    }
  }
}
