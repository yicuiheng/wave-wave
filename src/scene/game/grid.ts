import { Particle } from "./particle";
import * as Constants from "../../constants";
import * as Util from "../../util";

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
