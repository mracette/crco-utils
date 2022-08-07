export class Vector2 {
  constructor(public x: number, public y: number) {}

  get ratio(): number {
    return this.x / this.y;
  }

  get magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  toUnitVector(): Vector2 {
    const magnitude = this.magnitude;
    return new Vector2(this.x / magnitude, this.y / magnitude);
  }

  static from(a: Vector2, b: Vector2) {
    return new Vector2(a.x - b.x, a.y - b.y);
  }
}
