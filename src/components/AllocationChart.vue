<template>
  <div class="freq-alloc-chart-holder">
    <div class="freq-alloc-chart">
      <div class="log10-bands" >
        <div v-for="(band, idx) in log10bands" :key="idx" class="log10-band" :style="allocationBandStyle(band as any)">
          <span class="lf">{{ humanHzUnits(band.lf) }}</span><span class="uf">{{ humanHzUnits(band.uf) }}</span>
        </div>
      </div>

      <div class="allocation-bands">
      <div
        v-for="allocationBand in filteredAllocationBands" :key="allocationBand.lf"
        class="freq-alloc-band" :style="allocationBandStyle(allocationBand)"
      >
        <template v-if="allocationBand.services && allocationBand.services.length > 0">
          <div
            v-for="(service, idx) in allocationBand.services" :key="idx"
            class="freq-allocation" :style="serviceStyle(service, allocationBand)"
            @click="$emit('allocation-click', service)"
          >
            <span class="desc">{{ service.desc }}</span>
            <div class="band">{{ humanHzUnits(allocationBand.lf) }} - {{ humanHzUnits(allocationBand.uf) }}</div>
          </div>
        </template>
        <div v-else class="freq-allocation">
          <span class="desc">Not allocated</span>
        </div>
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
  setup () {
    const log10bands: Record<string, any>[] = [];
    log10bands.push({
      lf: 3000,
      uf: 10000
    });
    for (let i = 4; i < 11; i++) {
      log10bands.push({
        lf: Math.pow(10, i),
        uf: Math.pow(10, i + 1)
      });
    }
    log10bands.push({
      lf: Math.pow(10, 11),
      uf: Math.pow(10, 11) * 3
    });

    return {
      log10bands
    };
  },
  methods: {
    allocationBandStyle (allocationBand: FrequencyAllocationBand) {
      // TODO this is still wrong. We also need to work out the right CSS
      const logUpperFrequency = Math.log10(allocationBand.uf);
      const logLowerFrequency = Math.log10(allocationBand.lf || 3000);

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
          style.background = disabledStyle;
        }
      }

      if (this.bandFilter && !isNaN(parseFloat(this.bandFilter.upperFrequency))) {
        const upperFrequency = parseFloat(this.bandFilter.upperFrequency as string);
        if (allocationBand.lf > upperFrequency) {
          style.background = disabledStyle;
        }
      }

      return style;
    },
    humanHzUnits: humanHzUnits
  },
  computed: {
    // allocationBlocks () {
    //   return this.allocations;
    // },
    filteredAllocationBands () {
      let allocations = [...this.allocations];

      const adjustedAllocations = [] as Record<string, any>[];

      if (allocations.length > 0) {
        allocations = allocations.filter((band, idx) => {
          return idx === 0 || (band.services && band.services.length > 0);
        });

        if (allocations[0].lf !== 0) {
          adjustedAllocations.push({
            lf: 0,
            uf: allocations[0].lf
          });
        }

        adjustedAllocations.push(allocations[0]);
        for (let i = 1; i < allocations.length; i++) {
          if (allocations[i - 1].uf !== allocations[i].lf) {
            adjustedAllocations.push({
              lf: allocations[i - 1].uf,
              uf: allocations[i].lf,
              services: [{ desc: 'unspecified' }]
            });
          }
          if (allocations[i].services && allocations[i].services.length > 0) {
            adjustedAllocations.push(allocations[i]);
          }
        }
        if (allocations[allocations.length - 1].uf !== (Math.pow(10, 11) * 3)) {
          adjustedAllocations.push({
            lf: allocations[allocations.length - 1].uf,
            uf: (Math.pow(10, 11) * 3)
          });
        }
      }
      allocations = adjustedAllocations as any;

      if (this.bandFilter && !isNaN(parseFloat(this.bandFilter.lowerFrequency))) {
        const lowerFrequency = parseFloat(this.bandFilter.lowerFrequency as string);
        allocations = allocations.filter(allocationBand => allocationBand.uf >= lowerFrequency);
      }

      if (this.bandFilter && !isNaN(parseFloat(this.bandFilter.upperFrequency))) {
        const upperFrequency = parseFloat(this.bandFilter.upperFrequency as string);
        allocations = allocations.filter(allocationBand => allocationBand.lf <= upperFrequency);
      }

      return allocations;
    }
  }
});
</script>

<style lang='scss' scoped>
.freq-alloc-chart-holder {
  overflow-x: auto;
  display: block;
}

// .freq-alloc-chart {
.allocation-bands {
  height: 200px;
  white-space: nowrap;

  border-left: solid 1px rgb(77, 77, 78);
  border-right: solid 1px rgb(77, 77, 78);

  .freq-alloc-band {
    display: inline-flex;
    vertical-align: top;
    flex-direction: column;
    width: 200px;
    font-size: 80%;
    height: 100%;

    &:hover {
      width: 300px;
      min-width: 300px;
    }

    .freq-allocation {
      border-right: solid 1px rgb(77, 77, 78);
      border-bottom: solid 1px rgb(77, 77, 78);
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .band {
      display: none;
    }

    &:hover .band {
      display: block;
    }
  }
}

.desc {
  // transform: rotateZ(270deg);
}

.log10-bands {
  white-space: nowrap;
  .log10-band {
    display: inline-flex;
    border: solid 1px black;
    justify-content: space-between;
    padding: 0 4px;
    box-sizing: border-box;
    background: black;
    color: white;
    border-right: solid 1px white;

    span:last-child {
      display: none;
    }

    &:last-child span:last-child {
      display: block;
    }
  }
}
</style>
