<template>
  <div class="frequency-selector">
    <img src="/spectrum.jpg" style="width: 100%"/>
    <div class="frequencies">
      <span>0.0001 nm</span>
      <span>100m</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FrequencySelector'
});
</script>

<style lang="scss" scoped>
.frequency-selector {
  padding: 4px;
  box-sizing: border-box;
  .frequencies {
    display: flex;
    justify-content: space-between;
  }
}
</style>
