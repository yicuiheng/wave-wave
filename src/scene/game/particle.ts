import * as Phaser from "phaser";

import * as Constants from "../../constants";
import * as Util from "../../util";
import { GameScene } from "../game";

export enum Type {
  Water,
  InnerWall,
  OuterWall,
  Shot,
}

export class Particle {
  static readonly RADIUS = 5;

  private ellipse: Phaser.GameObjects.Ellipse;

  type: Type;
  vel = new Phaser.Math.Vector2();
  pressure = 0;

  private scene: GameScene;

  constructor(scene: GameScene, x: number, y: number, type: Type) {
    const colorId =
      type === Type.OuterWall
        ? 2
        : type === Type.InnerWall
        ? 6
        : type === Type.Shot
        ? 8
        : 7;
    const color = Constants.COLORS[colorId].toNumber();
    this.ellipse = scene.add.ellipse(
      x,
      y,
      Particle.RADIUS * 2,
      Particle.RADIUS * 2,
      color
    );
    this.ellipse.setOrigin(0.5);
    this.type = type;
    this.scene = scene;
  }
  static shot(scene: GameScene, x: number, y: number): Particle {
    return new Particle(scene, x, y, Type.Shot);
  }
  x(): number {
    return this.ellipse.x;
  }
  y(): number {
    return this.ellipse.y;
  }
  weight(p: Particle): number {
    const diff = { x: this.x() - p.x(), y: this.y() - p.y() };
    const r = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
    const re = Constants.ENV.re;
    if (r == 0) return 0;
    if (r < re) return re / r - 1;
    return 0;
  }
  distance(p: Particle): number {
    return Math.sqrt(this.distanceSq(p));
  }
  distanceSq(p: Particle): number {
    return (
      (this.x() - p.x()) * (this.x() - p.x()) +
      (this.y() - p.y()) * (this.y() - p.y())
    );
  }

  private fixVelocity() {
    const env = Constants.ENV;
    const v = this.vel.length();
    if (v > env.lv) {
      this.vel.x *= env.lv / v;
      this.vel.y *= env.lv / v;
    }
  }
  updateLap(prevVels: Array<Phaser.Math.Vector2>): void {
    if (!this.scene.stage) return;
    if (this.type !== Type.Water) return;

    const env = Constants.ENV;
    const n0 = this.scene.stage.n0;
    const lambda = this.scene.stage.lambda;
    const nears = this.scene.stage.nearParticles(this);
    const k = (2 * env.nu * env.d) / lambda / n0;
    this.vel.x +=
      env.dt *
      k *
      Util.sum(
        nears.map((n) => (this.vel.x - prevVels[n.index].x) * this.weight(n.p))
      );
    this.vel.y +=
      env.dt *
      (k *
        Util.sum(
          nears.map(
            (n) => (this.vel.y - prevVels[n.index].y) * this.weight(n.p)
          )
        ) +
        env.g);
    this.fixVelocity();
    this.ellipse.x += env.dt * this.vel.x;
    this.ellipse.y += env.dt * this.vel.y;
  }

  updatePressure(prevPressures: Array<number>): void {
    if (!this.scene.stage) return;
    if (this.type === Type.OuterWall) return;
    const env = Constants.ENV;
    const n0 = this.scene.stage.n0;
    const lambda = this.scene.stage.lambda;

    const nears = this.scene.stage.nearParticles(this);
    const n = Util.sum(nears.map((n) => this.weight(n.p)));

    if (n >= env.beta * n0) {
      let a = 0;
      let b = 0;
      nears
        .filter((n) => n.p.type !== Type.OuterWall)
        .forEach((n) => {
          const w = this.weight(n.p);
          a += w;
          b += prevPressures[n.index] * w;
        });
      const c =
        (-env.alpha * env.rho0 * (n - n0) * lambda * n0) /
        (env.dt * env.dt * n0 * 2 * env.d);
      this.pressure = Math.min(5, (b - c) / a);
    } else {
      // surface
      this.pressure = 0;
    }
  }
  updateGrad(prevPos: Array<{ x: number; y: number }>): void {
    if (!this.scene.stage) return;
    if (this.type !== Type.Water) return;
    const env = Constants.ENV;
    const n0 = this.scene.stage.n0;
    const nears = this.scene.stage.nearParticles(this);
    const minP =
      nears.length > 0
        ? Util.min(nears.map((n) => n.p.pressure))
        : this.pressure;

    const gradientPressure = nears.reduce(
      (acc, n) => {
        const k =
          (((env.d / n0) * (n.p.pressure - minP)) / this.distanceSq(n.p)) *
          this.weight(n.p);
        acc.x += k * (n.p.x() - this.x());
        acc.y += k * (n.p.y() - this.y());
        return acc;
      },
      { x: 0, y: 0 }
    );
    const vx = this.vel.x;
    const vy = this.vel.y;
    const fixVelX = (-env.dt * gradientPressure.x) / env.rho0;
    const fixVelY = (-env.dt * gradientPressure.y) / env.rho0;
    this.vel.x += fixVelX;
    this.vel.y += fixVelY;
    this.fixVelocity();
    this.ellipse.x += env.dt * (this.vel.x - vx);
    this.ellipse.y += env.dt * (this.vel.y - vy);
  }
}
