export class Vector2 {
  constructor(public x: number, public y: number) {}

  ratio(): number {
    return this.x / this.y;
  }
}
