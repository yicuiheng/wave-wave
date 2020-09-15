import { Particle, Type } from "./particle";
import { GameScene } from "../game";
import * as Constants from "../../constants";
import * as Util from "../../util";
import { Grid } from "./grid";

export class Stage {
  private particles: Array<Particle> = [];
  private grid = new Grid();
  private scene: GameScene;
  n0: number;
  lambda: number;

  constructor(scene: GameScene) {
    const height = Constants.SCREEN_HEIGHT / (Particle.RADIUS * 2);
    for (let y = 0; y < height; y++) {
      const y_ = Particle.RADIUS + Particle.RADIUS * 2 * y;
      if (y === 0) {
        for (let i = 0; i < 3; i++) {
          const dx = Particle.RADIUS + Particle.RADIUS * 2 * i;
          this.particles.push(new Particle(scene, dx, y_, Type.InnerWall));
          this.particles.push(
            new Particle(scene, Constants.SCREEN_WIDTH - dx, y_, Type.InnerWall)
          );
        }
      } else if (y === height - 3) {
        this.particles.push(
          new Particle(scene, Particle.RADIUS, y_, Type.OuterWall)
        );
        this.particles.push(
          new Particle(scene, Particle.RADIUS * 3, y_, Type.OuterWall)
        );
        for (
          let x = Particle.RADIUS * 5;
          x < Constants.SCREEN_WIDTH - Particle.RADIUS * 3;
          x += Particle.RADIUS * 2
        ) {
          this.particles.push(new Particle(scene, x, y_, Type.InnerWall));
        }
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS * 3,
            y_,
            Type.OuterWall
          )
        );
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS,
            y_,
            Type.OuterWall
          )
        );
      } else if (y >= height - 2) {
        for (
          let x = Particle.RADIUS;
          x < Constants.SCREEN_WIDTH;
          x += Particle.RADIUS * 2
        ) {
          this.particles.push(new Particle(scene, x, y_, Type.OuterWall));
        }
      } else {
        this.particles.push(
          new Particle(scene, Particle.RADIUS, y_, Type.OuterWall)
        );
        this.particles.push(
          new Particle(scene, Particle.RADIUS * 3, y_, Type.OuterWall)
        );
        this.particles.push(
          new Particle(scene, Particle.RADIUS * 5, y_, Type.InnerWall)
        );
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS * 5,
            Particle.RADIUS + Particle.RADIUS * 2 * y,
            Type.InnerWall
          )
        );
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS * 3,
            Particle.RADIUS + Particle.RADIUS * 2 * y,
            Type.OuterWall
          )
        );
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS,
            Particle.RADIUS + Particle.RADIUS * 2 * y,
            Type.OuterWall
          )
        );
      }
    }
    for (
      let y = Particle.RADIUS;
      y < Constants.SCREEN_HEIGHT;
      y += Particle.RADIUS * 2
    ) {
      if (y == Particle.RADIUS) {
        for (let i = 0; i < 3; i++) {
          const dx = Particle.RADIUS + Particle.RADIUS * 2 * i;
          this.particles.push(new Particle(scene, dx, y, Type.InnerWall));
          this.particles.push(
            new Particle(scene, Constants.SCREEN_WIDTH - dx, y, Type.InnerWall)
          );
        }
      } else if (y === Constants.SCREEN_HEIGHT - Particle.RADIUS * 5) {
        this.particles.push(
          new Particle(scene, Particle.RADIUS, y, Type.OuterWall)
        );
        this.particles.push(
          new Particle(scene, Particle.RADIUS * 3, y, Type.OuterWall)
        );
        for (
          let x = Particle.RADIUS * 5;
          x < Constants.SCREEN_WIDTH - Particle.RADIUS * 3;
          x += Particle.RADIUS * 2
        ) {
          this.particles.push(new Particle(scene, x, y, Type.InnerWall));
        }
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS * 3,
            y,
            Type.OuterWall
          )
        );
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS,
            y,
            Type.OuterWall
          )
        );
      } else if (y >= Constants.SCREEN_HEIGHT - Particle.RADIUS * 3) {
        for (
          let x = Particle.RADIUS;
          x < Constants.SCREEN_WIDTH;
          x += Particle.RADIUS * 2
        ) {
          this.particles.push(new Particle(scene, x, y, Type.OuterWall));
        }
      } else {
        this.particles.push(
          new Particle(scene, Particle.RADIUS, y, Type.OuterWall)
        );
        this.particles.push(
          new Particle(scene, Particle.RADIUS * 3, y, Type.OuterWall)
        );
        this.particles.push(
          new Particle(scene, Particle.RADIUS * 5, y, Type.InnerWall)
        );
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS * 5,
            y,
            Type.InnerWall
          )
        );
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS * 3,
            y,
            Type.OuterWall
          )
        );
        this.particles.push(
          new Particle(
            scene,
            Constants.SCREEN_WIDTH - Particle.RADIUS,
            y,
            Type.OuterWall
          )
        );
      }
    }
    for (
      let y = Constants.SCREEN_HEIGHT - Particle.RADIUS * 7;
      y >= Constants.SCREEN_HEIGHT / 2;
      y -= Particle.RADIUS * 2
    ) {
      for (
        let x = Particle.RADIUS * 7;
        x < Constants.SCREEN_WIDTH / 4;
        x += Particle.RADIUS * 2
      ) {
        this.particles.push(new Particle(scene, x, y, Type.Water));
      }
    }

    this.scene = scene;
    this.n0 = Util.max(
      this.particles.map((p) =>
        Util.sum(
          this.particles.filter((p2) => p != p2).map((p2) => p.weight(p2))
        )
      )
    );
    this.lambda = Util.max(
      this.particles.map((p) => {
        const others = this.particles.filter((p2) => p != p2);
        const a = Util.sum(others.map((p2) => p.distanceSq(p2) * p.weight(p2)));
        const b = Util.sum(others.map((p2) => p.weight(p2)));
        return a / b;
      })
    );
  }

  updateLap(): void {
    const prevVels = this.particles.map((p) => p.vel);
    this.particles.forEach((p) => p.updateLap(prevVels));
  }
  updatePressure(): void {
    const prevPressures = this.particles.map((p) => p.pressure);
    this.particles.forEach((p) => p.updatePressure(prevPressures));
  }
  updateGrad(): void {
    const prevPos = this.particles.map((p) => {
      return { x: p.x(), y: p.y() };
    });
    this.particles.forEach((p) => p.updateGrad(prevPos));
  }

  update(): void {
    this.grid.clear();
    this.particles.forEach((p, i) => this.grid.register(i, p));
    this.updateLap();
    this.grid.clear();
    this.particles.forEach((p, i) => this.grid.register(i, p));
    this.updatePressure();
    this.updateGrad();
  }

  nearParticles(p1: Particle): Array<{ index: integer; p: Particle }> {
    return this.grid.nears(p1);
  }

  addShot(x: number, y: number): void {
    this.particles.push(Particle.shot(this.scene, x, y));
  }
}
