<template>
  <div class="freq-alloc-chart-holder">
    <div class="freq-alloc-chart">
      <div
        v-for="allocationBand in allocations" :key="allocationBand.lf"
        class="freq-alloc-block" :style="allocationBandStyle(allocationBand)"
        :title="`${humanHzUnits(allocationBand.lf)} - ${humanHzUnits(allocationBand.uf)}`"
      >
        <template v-if="allocationBand.services && allocationBand.services.length > 0">
          <div
            v-for="(service, idx) in allocationBand.services" :key="idx"
            class="freq-allocation" :style="serviceStyle(service, allocationBand)"
            @click="$emit('allocation-click', service)"
          >
            <span class="desc">{{ service.desc }}</span>
          </div>
        </template>
        <div v-else class="freq-allocation">
          <span class="desc">Not allocated</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { humanHzUnits, getColourForService } from '@/utils/FrequencyUtils';
import { defineComponent, PropType } from 'vue';
import { FrequencyService, FrequencyAllocationBand } from '../models';

export default defineComponent({
  name: 'AllocationChart',
  props: {
    allocations: {
      type: Array as PropType<FrequencyAllocationBand[]>,
      default: () => [],
      required: true
    },
    serviceFilter: {
      type: Array as PropType<string[] | undefined>,
      required: false
    },
    bandFilter: {
      type: Object as PropType<Record<string, string>>,
      required: false
    }
  },
  watch: {
    allocations () {
      console.log('xx - allocations', this.allocations[0]);
    }
  },
  methods: {
    allocationBandStyle (allocationBand: FrequencyAllocationBand) {
      // TODO this is still wrong. We also need to work out the right CSS
      const logUpperFrequency = Math.log2(allocationBand.uf);
      const logLowerFrequency = Math.log2(allocationBand.lf);
      const diff = logUpperFrequency - logLowerFrequency;
      return {
        width: `${diff * 900}px`
      };
    },
    serviceStyle (service: FrequencyService, allocationBand: FrequencyAllocationBand) {
      let colour = getColourForService(service.desc);
      if (!colour) {
        colour = 'white';
      }

      const style: Record<string, string> = {
        background: colour
      };

      const disabledStyle = 'repeating-linear-gradient(45deg, #f5f5f5 0px, #f5f5f5 10px, #fff 10px, #fff 20px)';

      if (Array.isArray(this.serviceFilter) && this.serviceFilter.length > 0) {
        const serviceName = service.desc.toLowerCase();
        const match = this.serviceFilter.find(service => serviceName.startsWith(service));
        if (!match) {
          style.background = disabledStyle;
        }
      }

      if (this.bandFilter && !isNaN(parseFloat(this.bandFilter.lowerFrequency))) {
        const lowerFrequency = parseFloat(this.bandFilter.lowerFrequency as string);
        if (allocationBand.uf < lowerFrequency) {
          style.background = disabledStyle;;
        }
      }

      if (this.bandFilter && !isNaN(parseFloat(this.bandFilter.upperFrequency))) {
        const upperFrequency = parseFloat(this.bandFilter.upperFrequency as string);
        if (allocationBand.uf > upperFrequency) {
          style.background = disabledStyle;
        }
      }

      return style;
    },
    humanHzUnits: humanHzUnits
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

.desc {
  transform: rotateZ(270deg);
}
</style>
