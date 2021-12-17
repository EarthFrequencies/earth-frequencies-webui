<template>
  <div class="freq-alloc-chart-holder">
    <div class="freq-alloc-chart">
      <div
        v-for="allocationsBlock in allocationBlocks" :key="allocationsBlock.band.lower"
        class="freq-alloc-block" :style="allocationBlockStyle(allocationsBlock)"
        :title="`${humanHzUnits(allocationsBlock.band.lower)} - ${humanHzUnits(allocationsBlock.band.upper)}`"
      >
        <div
          v-for="(allocation, idx) in allocationsBlock.allocations" :key="idx"
          class="freq-allocation" :style="allocationStyle(allocation)"
          @click="$emit('allocation-click', allocation)"
        >
          {{ allocation.service }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FrequencyAllocation, FrequencyAllocationBlock } from '../models';

const serviceColours: Record<string, string> = {
  'NOT ALLOCATED': 'white',
  'AERONAUTICAL MOBILE': '#00AEE1',
  'AERONAUTICAL MOBILE SATELLITE': '#97C9EC',
  'AERONAUTICAL RADIONAVIGATION': '#C05018',
  'RADIONAVIGATION-SATELLITE': '#E8EA7C'
};

export default defineComponent({
  name: 'AllocationChart',
  props: {
    allocations: {
      type: Array as PropType<FrequencyAllocationBlock[]>,
      default: () => [],
      required: true
    }
  },
  methods: {
    allocationBlockStyle (allocationsBlock: FrequencyAllocationBlock) {
      const diff = allocationsBlock.band.upper - allocationsBlock.band.lower;
      return {
        width: `${diff / 30}px`
      };
    },
    allocationStyle (allocation: FrequencyAllocation) {
      let service = allocation.service;
      const idx = service.indexOf('(');
      if (idx > -1) {
        service = service.substring(0, idx).trim();
      }

      let colour = serviceColours[service];
      if (!colour) {
        colour = 'white';
      }

      return {
        background: colour
      };
    },
    humanHzUnits (value: number) {
      let baseUnit = 'Hz';
      let divider = 1;
      if (value > 1e12) {
        baseUnit = 'THz';
        divider = 1e9;
      } else if (value > 1e9) {
        baseUnit = 'GHz';
        divider = 1e9;
      } else if (value > 1e6) {
        baseUnit = 'MHz';
        divider = 1e6;
      } else if (value > 1e3) {
        baseUnit = 'KHz';
        divider = 1e3;
      }

      return `${value / divider} ${baseUnit}`;
    }
  },
  computed: {
    allocationBlocks () {
      return this.allocations;
    }
  }
});
</script>

<style lang='scss' scoped>
.freq-alloc-chart-holder {
  overflow-x: auto;
  display: block;
}

.freq-alloc-chart {
  height: 200px;
  display: flex;
  border: solid 1px rgb(153, 153, 153);

  .freq-alloc-block {
    display: flex;
    flex-direction: column;
    width: 200px;
    font-size: 80%;

    .freq-allocation {
      border: solid 1px rgb(77, 77, 78);
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
  }
}

</style>
