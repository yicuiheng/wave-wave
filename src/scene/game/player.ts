import * as Phaser from "phaser";
import { GameScene } from "../game";
import * as Constants from "../../constants";
import { Particle } from "./particle";

export class Player {
  static readonly WIDTH = 16;
  static readonly HEIGHT = 16;
  private rect: Phaser.GameObjects.Rectangle;
  private upKey: Phaser.Input.Keyboard.Key;
  private downKey: Phaser.Input.Keyboard.Key;
  private leftKey: Phaser.Input.Keyboard.Key;
  private rightKey: Phaser.Input.Keyboard.Key;
  private stopKey: Phaser.Input.Keyboard.Key;
  private scene: GameScene;

  private velocity = { x: 0, y: 0 };
  private invincible = 0;
  life = 3;

  constructor(scene: GameScene) {
    this.rect = scene.add.rectangle(
      Constants.SCREEN_WIDTH / 2,
      Constants.SCREEN_HEIGHT / 2,
      Player.WIDTH,
      Player.HEIGHT,
      Constants.ACTIVE_COLOR.toNumber()
    );
    this.rect.setOrigin(0.5);
    this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    this.leftKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.rightKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.stopKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X
    );
    this.scene = scene;
  }
  x(): number {
    return this.rect.x;
  }
  y(): number {
    return this.rect.y;
  }

  update(): void {
    if (this.upKey.isDown) this.velocity.y -= 0.1;
    if (this.downKey.isDown) this.velocity.y += 0.1;
    if (this.leftKey.isDown) this.velocity.x -= 0.1;
    if (this.rightKey.isDown) this.velocity.x += 0.1;
    if (this.stopKey.isDown) {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }

    if (this.velocity.x < -6) this.velocity.x = -6;
    if (this.velocity.x > 6) this.velocity.x = 6;
    if (this.velocity.y < -6) this.velocity.y = -6;
    if (this.velocity.y > 6) this.velocity.y = 6;

    this.rect.x += this.velocity.x;
    this.rect.y += this.velocity.y;
    const wallWidth = Particle.RADIUS * 6;
    if (this.rect.x < wallWidth + Player.WIDTH / 2) {
      this.rect.x = wallWidth + Player.WIDTH / 2;
      this.velocity.x = 0;
    } else if (
      this.rect.x >
      Constants.SCREEN_WIDTH - wallWidth - Player.WIDTH / 2
    ) {
      this.rect.x = Constants.SCREEN_WIDTH - wallWidth - Player.WIDTH / 2;
      this.velocity.x = 0;
    }
    if (this.rect.y < Player.HEIGHT / 2) {
      this.rect.y = Player.HEIGHT / 2;
      this.velocity.y = 0;
    } else if (
      this.rect.y >
      Constants.SCREEN_HEIGHT - wallWidth - Player.HEIGHT / 2
    ) {
      this.rect.y = Constants.SCREEN_HEIGHT - wallWidth - Player.HEIGHT / 2;
      this.velocity.y = 0;
    }
    if (
      this.invincible === 0 &&
      this.scene.stage?.grid.isCollide(this.x(), this.y())
    ) {
      this.invincible = 60;
      this.life--;
    }
    if (this.invincible > 0) {
      this.rect.visible = this.scene.score % 2 === 0;
      this.invincible--;
    } else {
      this.rect.visible = true;
    }
  }
}
