<template>
  <div class="frequency-selector">
    <div class="frequencies">
      <span>{{ humanHzUnits(lowerFrequency) }}</span>
      <span>{{ humanHzUnits(upperFrequency) }}</span>
    </div>
    <!-- <canvas id="canvas" ref="canvas"></canvas> -->
    <div :id="drawingZoneId" ref="drawingZone" class="drawing-zone"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import Raphael from 'raphael2';
import { humanHzUnits } from '@/utils/FrequencyUtils';

export default defineComponent({
  name: 'FrequencySelector',
  props: {
    lowerFrequency: {
      type: Number,
      default: 1
    },
    upperFrequency: {
      type: Number,
      default: Math.pow(10, 11) * 3
    }
  },
  mounted () {
    this.renderWave();
  },
  setup () {
    const canvas = ref<HTMLCanvasElement>();
    return {
      canvas,
      drawingZoneId: `drawingzone-${Date.now()}`
    };
  },
  methods: {
    renderWave () {
      const drawingZone = this.$refs.drawingZone as any;
      const paper = Raphael(drawingZone, 1024, 130);

      const centerY = 72;
      const scaleY = 40;
      const scaleX = 520;

      let maxY = centerY;
      let minY = centerY;

      let x = 10;
      let x2 = Math.log10(x) * scaleX;
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
        x2 = Math.log10(x) * scaleX;
        path += `L${x2 - offset} ${y}`;
      }
      paper.path(path);
    },
    humanHzUnits: humanHzUnits
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
