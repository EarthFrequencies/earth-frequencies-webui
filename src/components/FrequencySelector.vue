<template>
  <div class="frequency-selector">
    <div class="frequencies">
      <span>{{ lowerFrequency }}</span>
      <span>{{ upperFrequency }}</span>
    </div>
    <!-- <canvas id="canvas" ref="canvas"></canvas> -->
    <div :id="drawingZoneId" ref="drawingZone" class="drawing-zone"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import Raphael from 'raphael2';

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

  translateX (offset: number): Point {
    return new Point(this.x + offset, this.y);
  }

  translateY (offset: number): Point {
    return new Point(this.x, this.y + offset);
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
  canvas: HTMLCanvasElement,
  points: Array<Point>,
  scale = 0.95
): void {
  /* Draw a curve on the canvas.
   *
   * @param {HTMLCanvasElement} canvas The canvas to draw the curve on.
   * @param {Array<Point>} points The points to draw.
   * @param {number} scale The scale to fit to. A scale of 1
   *   means fit to the canvas (100%). Defaults to 0.95 (95%).
   *
   * Before we can plot the points on the canvas, we must
   *   transform them. The transformation equations
   *   for the coordinates are:
   *   x' = (x - xavg) * (canvas.width / xrange) + canvas.width / 2.
   *   y' = (y - yavg) * (canvas.height / yrange) + canvas.height / 2.
   *
   *   where xavg, yavg are the average in x and y, respectively
   *   and xrange and yrange and the full range spanned in x and y,
   *   respectively.
  */
  const context: CanvasRenderingContext2D = (
    canvas.getContext('2d') as CanvasRenderingContext2D);

  const transformedPoints: Array<Point> = rescaleToCanvas(canvas, points, scale);
  let nextPoint: Point = transformedPoints[0];
  context.moveTo(nextPoint.x, nextPoint.y);
  for (nextPoint of transformedPoints.slice(1)) {
    context.lineTo(nextPoint.x, nextPoint.y);
    context.moveTo(nextPoint.x, nextPoint.y);
  }
  context.stroke();
}

function rescaleToCanvas (
  canvas: HTMLCanvasElement,
  points: Array<Point>,
  scale: number
): Array<Point> {
  const yValues: Array<number> = points.map((point: Point): number => point.y);
  const xValues: Array<number> = points.map((point: Point): number => point.x);

  const maxY = Math.max(...yValues);
  const minY = Math.min(...yValues);
  const rangeY = (maxY - minY);

  const maxX = Math.max(...xValues);
  const minX = Math.min(...xValues);
  const rangeX = (maxX - minX);

  const YScale = canvas.height / rangeY * scale;
  const XScale = canvas.width / rangeX * scale;

  const pointAverage: Point = average(points);
  type PointTransformer = (point: Point) => Point;

  const transformer: PointTransformer = (point: Point) => {
    return point
      .translateY(-pointAverage.y)
      .scaleY(YScale)
      .translateY(canvas.height / 2.0)
      .translateX(-pointAverage.x)
      .scaleX(XScale)
      .translateX(canvas.width / 2.0);
  };

  return points.map(transformer);
}

function linspace (start: number, end: number, N: number): Array<number> {
  const values: Array<number> = [];
  const interval = (end - start) / (N - 1);
  for (let i = 1; i < N; i++) {
    values.push(start + interval * i);
  }
  return values;
}

function fitCanvasToParentContainer (
  canvas: HTMLCanvasElement,
  scaleX = 1.0,
  scaleY = 1.0
) {
  /*
  * Set a canvas width and height to match its parent tag.
  * https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
  *
  */
  // Make it visually fill the positioned parent
  const scaleXString = (scaleX * 100).toFixed(0).toString() + '%';
  const scaleYString = (scaleY * 100).toFixed(0).toString() + '%';
  canvas.style.width = scaleXString;
  canvas.style.height = scaleYString;
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function frequencyCurve (
  lowerFrequency: number,
  upperFrequency: number
): Array<Point> {
  const points: Array<Point> = [];
  let point: Point;
  const alpha = 10;
  const beta = 3;

  const N = 1000;
  const frequencies: Array<number> = linspace(
    lowerFrequency, upperFrequency, N);
  let x: number;
  let y: number;
  for (const frequency of frequencies) {
    x = frequency;
    y = Math.cos(alpha * Math.exp(
      beta *
      (frequency - lowerFrequency) /
      (upperFrequency - lowerFrequency)));
    point = new Point(x, y);
    points.push(point);
  }
  return points;
}

export default defineComponent({
  name: 'FrequencySelector',
  props: ['lowerFrequency', 'upperFrequency'],
  mounted () {
    const drawingZone = this.$refs.drawingZone as any;
    const paper = Raphael(drawingZone, 1024, 100);

    const centerY = 57;
    const scaleY = 42;
    const scaleX = 220;

    let maxY = centerY;
    let minY = centerY;

    let x = 10;
    let x2 = Math.log(x) * scaleX;
    const offset = x2;
    let path = `M${x2 - offset} ${centerY + (Math.cos(x / 4) * scaleY)}`;
    for (; x < 1000; x++) {
      const y = centerY + (Math.cos(x / 4) * scaleY);
      if (y > maxY) {
        maxY = y;
      }
      if (y < minY) {
        minY = y;
      }
      x2 = Math.log(x) * scaleX;
      path += `L${x2 - offset} ${y}`;
    }
    console.log(path);
    paper.path(path);

    path = `M0 ${maxY}L1024 ${maxY}`;
    paper.path(path).attr('stroke', '#f00');

    path = `M0 ${minY}L1024 ${minY}`;
    paper.path(path).attr('stroke', '#00f');
  },
  setup () {
    const canvas = ref<HTMLCanvasElement>();
    return {
      canvas,
      drawingZoneId: `drawingzone-${Date.now()}`
    };
  }
});
</script>

<style lang='scss' scoped>
.frequency-selector {
  position: relative;
  padding: 4px;
  box-sizing: border-box;
  overflow: hidden;
  .frequencies {
    display: flex;
    justify-content: space-between;
  }

  .drawing-zone {
    position: absolute;
    top: 0;
    height: 100%;
  }
}
</style>
