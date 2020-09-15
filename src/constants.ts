export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 600;

export const ENV = {
  dt: 1,
  nu: 0.3,
  rho0: 1,
  r: 20,
  re: 14,
  d: 2,
  alpha: 0.05,
  beta: 0.97,
  l: 10,
  g: 0.01,
  iter: 10,
  lv: 3.0,
};

export class Color {
  str: string;
  constructor(str: string) {
    this.str = str;
  }
  toString(): string {
    return "#" + this.str;
  }
  toNumber(): number {
    return parseInt(this.str, 16);
  }
}

export const COLORS = [
  "000020",
  "191940",
  "323260",
  "4b4b80",
  "6464a0",
  "7d7dc0",
  "9696e0",
  "afafff",
  "3cb371",
].map((str) => new Color(str));

export const WALL_COLOR_ID = 3;

export const ACTIVE_COLOR = COLORS[8];
export const INACTIVE_COLOR = COLORS[2];
export const GOAL_COLOR = new Color("00ced1");
export const TUTORIAL_COLOR = new Color("cd5c5c");
