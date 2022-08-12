export class Vector2 {
  constructor(public x: number, public y: number) {}

  get ratio(): number {
    return this.x / this.y;
  }

  get magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize() {
    const magnitude = this.magnitude;
    if (magnitude !== 0) {
      this.x = this.x / magnitude;
      this.y = this.y / magnitude;
    }
  }

  multiply(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  static from(a: Vector2, b: Vector2) {
    return new Vector2(a.x - b.x, a.y - b.y);
  }
}
