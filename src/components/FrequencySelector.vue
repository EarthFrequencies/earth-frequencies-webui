<template>
  <div class="frequency-selector">
    <div class="frequencies">
      <span>{{ frequencyRange.lower }}</span>
      <span>{{ frequencyRange.upper }}</span>
    </div>
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { Point } from '@/models/Point';

import { drawOnCanvas, fitCanvasToParentContainer } from '@/plotting/Draw';
import { frequencyCurve } from '@/math/FrequencyCurve';

export default defineComponent({
  name: 'FrequencySelector',
  props: ['frequencyRange'],
  mounted () {
    if (this.canvas !== undefined) {
      fitCanvasToParentContainer(this.canvas, 0.9, 0.8);
      const points: Array<Point> = frequencyCurve(this.frequencyRange);
      drawOnCanvas(this.canvas, points);
    }
  },
  setup () {
    return {
      canvas: ref<HTMLCanvasElement>()
    };
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
  width: 100%;
  height: 100%;
}
</style>
