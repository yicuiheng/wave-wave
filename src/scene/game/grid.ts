import { Particle, Type } from "./particle";
import * as Constants from "../../constants";
import * as Util from "../../util";
import { Player } from "./player";

export class Grid {
  static readonly WIDTH = Math.ceil(Constants.SCREEN_WIDTH / Constants.ENV.re);
  static readonly HEIGHT = Math.ceil(
    Constants.SCREEN_HEIGHT / Constants.ENV.re
  );
  private grid: Array<Array<Array<{ index: integer; p: Particle }>>> = [];

  constructor() {
    for (let i = 0; i < Grid.HEIGHT; i++) {
      this.grid.push([]);
      for (let j = 0; j < Grid.WIDTH; j++) {
        this.grid[i].push([]);
      }
    }
  }

  clear(): void {
    for (let i = 0; i < Grid.HEIGHT; i++) {
      for (let j = 0; j < Grid.WIDTH; j++) {
        this.grid[i][j] = [];
      }
    }
  }

  register(i: integer, p: Particle): void {
    const re = Constants.ENV.re;
    const x = Util.clamp(0, Grid.WIDTH - 1, Math.floor(p.x() / re));
    const y = Util.clamp(0, Grid.HEIGHT - 1, Math.floor(p.y() / re));
    this.grid[y][x].push({ index: i, p: p });
  }

  blow(): void {
    const x = Math.floor(Math.random() * Grid.WIDTH);
    for (let y = Math.floor(Grid.HEIGHT / 2); y < Grid.HEIGHT; y++) {
      this.grid[y][x].forEach((n) => {
        n.p.vel.y -= 2.0;
      });
    }
  }

  isCollide(x_: number, y_: number): boolean {
    const re = Constants.ENV.re;
    const x = Util.clamp(0, Grid.WIDTH - 1, Math.floor(x_ / re));
    const y = Util.clamp(0, Grid.HEIGHT - 1, Math.floor(y_ / re));
    for (let i = -1; i <= 1; i++) {
      if (y + i < 0 || Grid.HEIGHT <= y + i) continue;
      for (let j = -1; j <= 1; j++) {
        if (x + j < 0 || Grid.WIDTH <= x + j) continue;
        if (
          this.grid[y + i][x + j].some((n) => {
            if (n.p.type === Type.Shot) return false;
            const dx = x_ - n.p.x();
            const dy = y_ - n.p.y();
            return dx * dx + dy * dy <= (Player.WIDTH * Player.WIDTH) / 4;
          })
        ) {
          return true;
        }
      }
    }
    return false;
  }

  nears(p: Particle): Array<{ index: integer; p: Particle }> {
    const re = Constants.ENV.re;
    const x = Util.clamp(0, Grid.WIDTH - 1, Math.floor(p.x() / re));
    const y = Util.clamp(0, Grid.HEIGHT - 1, Math.floor(p.y() / re));
    const nears = new Array<{ index: integer; p: Particle }>();
    for (let i = -1; i <= 1; i++) {
      if (y + i < 0 || Grid.HEIGHT <= y + i) continue;
      for (let j = -1; j <= 1; j++) {
        if (x + j < 0 || Grid.WIDTH <= x + j) continue;
        this.grid[y + i][x + j].forEach((n) => {
          if (p === n.p) return;
          if (p.distanceSq(n.p) > re * re) return;
          nears.push(n);
        });
      }
    }
    return nears;
  }
}
