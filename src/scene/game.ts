import * as Phaser from "phaser";

import * as Constants from "../constants";
import { Stage } from "./game/stage";
import { Player } from "./game/player";
import { mkFontStyle } from "../util";
import { Particle } from "./game/particle";

export class GameScene extends Phaser.Scene {
  stage?: Stage;
  player?: Player;
  private shotKey?: Phaser.Input.Keyboard.Key;
  private scoreText?: Phaser.GameObjects.Text;
  private lifeText?: Phaser.GameObjects.Text;
  private prevKeydown = false;
  private gameoverText?: Phaser.GameObjects.Text;
  score = 0;

  create(): void {
    this.cameras.main.setBackgroundColor(Constants.COLORS[1].toString());
    this.shotKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.stage = new Stage(this);
    this.player = new Player(this);
    this.scoreText = this.add.text(32, 16, "0", mkFontStyle(7, 32));
    this.lifeText = this.add.text(32, 36, "3", mkFontStyle(7, 32));
    this.gameoverText = this.add.text(
      Constants.SCREEN_WIDTH / 2,
      Constants.SCREEN_HEIGHT / 2,
      "Game Over",
      mkFontStyle(7, 64)
    );
    this.gameoverText.setOrigin(0.5);
    this.gameoverText.visible = false;
  }

  update(): void {
    if ((this.player?.life || 0) < 0) {
      if (this.gameoverText) {
        this.gameoverText.text = `Game Over\nScore: ${this.score / 5}`;
        this.gameoverText.visible = true;
      }
      if (!this.prevKeydown && this.shotKey?.isDown) {
        this.scene.start("title");
      }
      this.prevKeydown = this.shotKey?.isDown || false;
      return;
    }
    this.stage?.update();
    this.player?.update();
    if (this.shotKey?.isDown) {
      this.stage?.addShot(this.player?.x() || 0, this.player?.y() || 0);
    }
    if (this.score > 200 && this.score % 100 === 0) {
      const spawnRadius = 32;
      const min = spawnRadius + Particle.RADIUS * 6;
      const centerX = Math.random() * (Constants.SCREEN_WIDTH - 2 * min) + min;
      const centerY = Math.random() * (Constants.SCREEN_HEIGHT - min);
      for (let i = 0; i < this.score / 50; i++) {
        const dx = Math.random() * spawnRadius * 2 - spawnRadius;
        const dy = Math.random() * spawnRadius * 2 - spawnRadius;
        this.stage?.addParticle(centerX + dx, centerY + dy);
      }
    }
    if (this.score > 100 && this.score % 50 === 0) {
      this.stage?.grid.blow();
    }
    this.score++;
    if (this.scoreText) {
      this.scoreText.text = `Score: ${Math.ceil(this.score / 5).toString()}`;
    }
    if (this.lifeText) {
      this.lifeText.text = `Life: ${this.player?.life.toString() || 0}`;
    }
    this.prevKeydown = this.shotKey?.isDown || false;
  }
}
