import * as Phaser from "phaser";

import * as Constants from "./constants";
import { GameScene } from "./scene/game";
import { TitleScene } from "./scene/title";

class Main extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: Constants.SCREEN_WIDTH,
      height: Constants.SCREEN_HEIGHT,
      audio: {
        disableWebAudio: true,
      },
    };
    super(config);
    this.scene.add("title", TitleScene, false);
    this.scene.add("game", GameScene, false);
    this.scene.start("title");
  }
}

window.onload = () => {
  const GameApp = new Main();
};
