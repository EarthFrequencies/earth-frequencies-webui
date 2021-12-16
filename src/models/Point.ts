// TODO(jrmlhermitte): replace this and all other plotting
//   with a standard plotting library.
class Point {
  x: number
  y: number

  constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static average (points: Array<Point>): Point {
    let sumX = 0;
    let sumY = 0;
    const total: number = points.length;
    for (const point of points) {
      sumX += point.x;
      sumY += point.y;
    }
    return new Point(sumX / total, sumY / total);
  }

  invert (): Point {
    return new Point(-this.x, -this.y);
  }

  translateX (offset: number): Point {
    return new Point(this.x + offset, this.y);
  }

  translateY (offset: number): Point {
    return new Point(this.x, this.y + offset);
  }

  scale (scale: number): Point {
    return new Point(this.x * scale, this.y * scale);
  }

  scaleX (scale: number): Point {
    return new Point(this.x * scale, this.y);
  }

  scaleY (scale: number): Point {
    return new Point(this.x, this.y * scale);
  }
}

export { Point };
