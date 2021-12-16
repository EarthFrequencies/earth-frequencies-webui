<template>
  <div class="home">
    <img alt="Earth Frequencies" src="/banner.svg">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>

    <div id="nav" class="allocation-breadcrumbs">
      <a href="#" class="router-link-active router-link-exact-active">ITU 2</a> &gt; United States
    </div>

    <div class="filters">
      <label>Region: </label>
      <select>
        <option v-for="region in regions" :key="region.id" :value="region.id">{{ region.name }}</option>
      </select>
    </div>

    <frequency-selector class="frequency-selector"
      :lowerFrequency="1000" :upperFrequency="2000"
    />

    <allocation-chart :allocations="allocations" />

    <div class="filters">
      <label class="freq-label">Frequency Range: </label>
      <input type="number" name="lower-frequency" /> Hz
      -
      <input type="number" name="upper-frequency" /> Hz
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <table class="allocation-table">
      <thead>
        <tr>
          <th>Lower Frequency</th>
          <th>Upper Frequency</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(allocation, idx) in allocations" :key="idx">
          <td class="align-left">{{ allocation.band.lower }} Hz</td>
          <td class="align-left">{{ allocation.band.upper }} Hz</td>
          <td class="align-left">{{ allocation.service }}</td>
        </tr>
      </tbody>
    </table>

    <div class="logo-box">
      <a href="https://github.com/EarthFrequencies">
        <img src="/github.svg" alt="GitHub" class="github-logo"/>
        <div>Hosted on GitHub</div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

import FrequencySelector from '@/components/FrequencySelector.vue';
import AllocationChart from '@/components/AllocationChart.vue';

const baseUrl = '.';

// just until we have a proper data file, and have established
// the json schema we want to use
const frequencyAllocations = [{
  band: {
    lower: 0,
    upper: 9000.0
  },
  service: 'abc'
}, {
  band: {
    lower: 0,
    upper: 9000.0
  },
  service: 'def'
}, {
  band: {
    lower: 9000.1,
    upper: 10000
  },
  service: 'ghi'
}];

export default defineComponent({
  name: 'Home',
  components: {
    FrequencySelector, AllocationChart
  },
  setup () {
    return {
      regions: ref([]),
      errorMessage: ref(''),
      allocations: ref(frequencyAllocations)
    };
  },
  mounted () {
    this.fetchCharts();
  },
  methods: {
    async fetchCharts () {
      try {
        const response = await axios.get(`${baseUrl}/api/charts/index.json`);

        const data = response.data;
        if (data.entries) {
          this.regions = data.entries;
        }
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.errorMessage = (error as any).message;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  margin: 0 auto;

  .allocation-breadcrumbs {
    text-align: left;
    width: 800px;
    padding-left: 16px;
  }

  .frequency-selector {
    border: solid 1px grey;
    width: 800px;
    height: 120px;
    margin-top: 20px;
  }

  .filters {
    width: 800px;
    text-align: left;
    padding: 4px;
    box-sizing: border-box;
    margin-top: 20px;
  }

  .freq-label {
    // width: 160px;
    margin-right: 20px;
    display: inline-block;
    margin-top: 5px;
  }

  .error-message {
    margin-top: 20px;
    width: 800px;
    text-align: left;
    padding: 4px 10px;
    box-sizing: border-box;
    background: rgb(233, 182, 182);
  }

  .allocation-table {
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
      text-align: left;
    }
    td:nth-child(1) {
      width: 150px;
      text-align: left;
    }
    td:nth-child(2) {
      width: 150px;
      text-align: left;
    }
    // th:nth-child(3), td:nth-child(3) {
    //   text-align: left;
    // }
  };

  .logo-box {
    margin-top: 40px;
    font-size: 80%;
    a {
      text-decoration: none;
      color: rgb(58, 58, 58);
      &:hover {
        text-decoration: underline;
      }
    }
    .github-logo {
      width: 50px;
    }
  }
}
</style>
