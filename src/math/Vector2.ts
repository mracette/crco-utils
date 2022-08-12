export class Vector2 {
  constructor(public x: number, public y: number) {}

  get ratio(): number {
    return this.x / this.y;
  }

  get magnitude(): number {
    return (this.x ** 2 + this.y ** 2) ** 0.5;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  multiply(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  normalize() {
    const magnitude = this.magnitude;
    if (magnitude !== 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    }
    return this;
  }

  set(vector: Vector2) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  static from(a: Vector2, b: Vector2) {
    return new Vector2(a.x - b.x, a.y - b.y);
  }
}
