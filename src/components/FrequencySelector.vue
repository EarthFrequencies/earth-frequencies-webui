<template>
  <div class="frequency-selector" width="1000px" height="500px">
    <div class="frequencies">
      <span>{{ fStart }}</span>
      <span>{{ fEnd }}</span>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

// TODO(jrmlhermitte): replace this and all other plotting
//   with a standard plotting library.
class Point {
  x: number
  y: number
  constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  invert (): Point {
    return new Point(-this.x, -this.y);
  }

  translate (offset: Point): Point {
    return new Point(this.x + offset.x, this.y + offset.y);
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

function average (points: Array<Point>): Point {
  let sumX = 0;
  let sumY = 0;
  const total: number = points.length;
  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }
  return new Point(sumX / total, sumY / total);
}

function drawOnCanvas (
  canvas: CanvasRenderingContext2D,
  points: Array<Point>
): void {
  // Should be automatically chosen by plotting library.
  const XOffset: Point = new Point(-points[0].x, 0);
  const YOffset: Point = new Point(0, 40);
  const YScale = 30;
  const XScale = 1;

  const pointAverage: Point = average(points);
  const pointYAverage: Point = new Point(0, pointAverage.y);
  const pointXAverage: Point = new Point(pointAverage.x, 0);

  let point: Point = points[0];
  // amplify curve around average
  let nextPoint: Point = point
    .translate(pointYAverage.invert())
    .scaleY(YScale)
    .translate(pointYAverage)
    .translate(pointXAverage.invert())
    .scaleX(XScale)
    .translate(pointXAverage)
    .translate(YOffset)
    .translate(XOffset)
    ;

  canvas.moveTo(nextPoint.x, nextPoint.y);
  for (point of points.slice(1)) {
    nextPoint = point
      .translate(pointYAverage.invert())
      .scaleY(YScale)
      .translate(pointYAverage)
      .translate(pointXAverage.invert())
      .scaleX(XScale)
      .translate(pointXAverage)
      .translate(YOffset)
      .translate(XOffset)
    ;
    canvas.lineTo(nextPoint.x, nextPoint.y);
    canvas.moveTo(nextPoint.x, nextPoint.y);
  }
  canvas.stroke();
}

function linspace (start: number, end: number, N: number): Array<number> {
  const values: Array<number> = [];
  const interval = (end - start) / (N - 1);
  for (let i = 1; i < N; i++) {
    values.push(start + interval * i);
  }
  return values;
}

function frequencyCurve (fStart: number, fEnd: number): Array<Point> {
  const points: Array<Point> = [];
  let point: Point;
  const alpha = 10;
  const beta = 3;

  const N = 1000;
  const frequencies: Array<number> = linspace(fStart, fEnd, N);
  let x: number;
  let y: number;
  for (const frequency of frequencies) {
    x = frequency;
    y = Math.cos(alpha * Math.exp(beta * (frequency - fStart) / (fEnd - fStart)));
    point = new Point(x, y);
    points.push(point);
  }
  return points;
}

export default defineComponent({
  name: 'FrequencySelector',
  props: ['fStart', 'fEnd'],
  data () {
    return {
      vueCanvas: null as unknown as CanvasRenderingContext2D
    };
  },
  mounted () {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.height = 400;
    canvas.width = 700;
    var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.vueCanvas = ctx;
    const points: Array<Point> = frequencyCurve(this.fStart, this.fEnd);
    drawOnCanvas(this.vueCanvas, points);
  }
});
</script>

<style lang='scss' scoped>
.frequency-selector {
  padding: 4px;
  box-sizing: border-box;
  .frequencies {
    display: flex;
    justify-content: space-between;
  }
}
</style>
