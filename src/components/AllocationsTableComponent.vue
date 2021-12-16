<template>
    <table class="allocations-table">
      <thead>
        <tr>
          <th>Lower Frequency</th>
          <th>Upper Frequency</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(allocation, index) of allocationsData.allocationsTable.allocations" :key="index">
          <td>{{ allocation.band.lowerFrequency }} Hz</td>
          <td>{{ allocation.band.upperFrequency }} Hz</td>
          <td>{{ allocation.service.service }} </td>
        </tr>
      </tbody>
    </table>

</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['allocationsData']
}
);
</script>

<style lang="scss" scoped>
.allocations-table {
  margin-top: 20px;
  width: 800px;
  border: solid 1px grey;
  tr:nth-child(even) td {
    background: rgb(226, 242, 253);
  }
  th {
    background: rgb(117, 181, 255);
    color: white;;
  }
  th, td {
    // border: solid 1px grey;
    padding: 2px 4px;
  }
  td:nth-child(1) {
    width: 150px;
  }
  td:nth-child(2) {
    width: 150px;
  }
  th:nth-child(3), td:nth-child(3) {
    text-align: left;
  }
};

</style>
