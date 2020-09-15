import * as Phaser from "phaser";

import * as Constants from "../constants";
import { mkFontStyle } from "../util";

export class TitleScene extends Phaser.Scene {
  private titleText?: Phaser.GameObjects.Text;
  private startText?: Phaser.GameObjects.Text;

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
      "Game Start",
      mkFontStyle(0, 24)
    );
    this.startText.style.setStroke(Constants.COLORS[7].toString(), 12);
    this.startText.setOrigin(0.5);
    this.startText
      .setInteractive()
      .on("pointerdown", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.scene.start("game");
      })
      .on("pointerover", (_pointer: any) => {
        if (this.startText === undefined) return;
        this.startText.text = "> Game Start";
        this.startText.x = Constants.SCREEN_WIDTH / 2 + 12;
      })
      .on("pointerout", (_pointer: any) => {
        if (this.startText === undefined) return;
        this.startText.text = "Game Start";
        this.startText.x = Constants.SCREEN_WIDTH / 2;
      });
  }
}
