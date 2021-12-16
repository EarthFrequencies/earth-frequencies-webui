import { Point } from '@/models/Point';

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

  const pointAverage: Point = Point.average(points);
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

function fitCanvasToParentContainer (
  canvas: HTMLCanvasElement,
  scaleX = 1.0,
  scaleY = 1.0
): void {
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

export { drawOnCanvas, fitCanvasToParentContainer, rescaleToCanvas };
