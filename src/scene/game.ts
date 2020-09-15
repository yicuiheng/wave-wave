import * as Phaser from "phaser";

import * as Constants from "../constants";
import { Stage } from "./game/stage";
import { Player } from "./game/player";

export class GameScene extends Phaser.Scene {
  stage?: Stage;
  player?: Player;
  private shotKey?: Phaser.Input.Keyboard.Key;

  create(): void {
    this.cameras.main.setBackgroundColor(Constants.COLORS[1].toString());
    this.shotKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.stage = new Stage(this);
    this.player = new Player(this);
  }

  update(): void {
    this.stage?.update();
    this.player?.update();
    if (this.shotKey?.isDown) {
      this.stage?.addShot(this.player?.x() || 0, this.player?.y() || 0);
    }
  }
}
