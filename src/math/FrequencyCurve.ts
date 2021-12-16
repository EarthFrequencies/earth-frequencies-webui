import { Point } from '@/models/Point';
import { Range } from '@/models/Range';
import { linspace } from '@/math/Math';

function frequencyCurve (frequencyRange: Range, N = 1000): Array<Point> {
  const points: Array<Point> = [];
  let point: Point;
  const alpha = 10;
  const beta = 3;

  const frequencies: Array<number> = linspace(
    frequencyRange.lower,
    frequencyRange.upper,
    N);
  let x: number;
  let y: number;
  for (const frequency of frequencies) {
    x = frequency;
    y = Math.cos(
      alpha *
      Math.exp(beta *
        (frequency - frequencyRange.lower) /
        (frequencyRange.upper - frequencyRange.lower)));
    point = new Point(x, y);
    points.push(point);
  }
  return points;
}

export { frequencyCurve };
