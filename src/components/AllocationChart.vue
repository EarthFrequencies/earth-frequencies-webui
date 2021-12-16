<template>
  <div class="freq-chart">
    <div class="freq-range" v-for="allocationsBand in allocationsByBand" :key="allocationsBand.key">
      <div :class="`freq-allocation ${allocationClass(allocation)}`" v-for="(allocation, idx) in allocationsBand.allocations" :key="idx">
        {{ allocation.service }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AllocationChart',
  props: {
    allocations: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  methods: {
    allocationClass (allocation: any) {
      return 'alloc-type-a';
    }
  },
  computed: {
    allocationsByBand () {
      const allocationsByBand: Record<string, any> = {};

      this.allocations.forEach((allocation: any) => {
        const key = `${allocation.band.lower}-${allocation.band.lower}`;
        if (!allocationsByBand[key]) {
          allocationsByBand[key] = {
            key: key,
            band: allocation.band,
            allocations: []
          };
        }
        allocationsByBand[key].allocations.push(allocation);
      });

      return Object.values(allocationsByBand).sort(
        (entryA: any, entryB: any) => entryA.band.lower - entryB.band.lower
      );
    }
  }
});
</script>

<style lang='scss' scoped>
.freq-chart {
  border: solid 1px black;
  height: 200px;
  display: flex;

  .freq-range {
    /* border: solid 1px blue; */
    display: flex;
    flex-direction: column;
    width: 200px;

    .freq-allocation {
      border: solid 1px blue;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
    }
  }
}

.alloc-type-a {
  background: #efe;
}

.alloc-type-b {
  background: #fee;
}

.alloc-type-c {
  background: #eef;
}

.alloc-type-d {
  background: #eff;
}

.alloc-type-d {
  background: #ffe;
}
</style>
