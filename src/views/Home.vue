<template>
  <div class="home">
    <img alt="Earth Frequencies" src="/banner.svg">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>

    <div class="filters">
      <label>Region: </label>
      <select>
        <option v-for="region in regions" :key="region.id" :value="region.id">{{ region.name }}</option>
      </select>
    </div>

    <frequency-selector class="frequency-selector"
      :fStart="1000" :fEnd="2000"
    />

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
        <tr>
          <td>0 Hz</td>
          <td>100 Hz</td>
          <td>Something</td>
        </tr>
        <tr>
          <td>101 Hz</td>
          <td>200 Hz</td>
          <td>Something Else</td>
        </tr>
       <tr>
          <td>201 Hz</td>
          <td>300 Hz</td>
          <td>Something Else Again</td>
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

const baseUrl = '.';

export default defineComponent({
  name: 'Home',
  components: {
    FrequencySelector
  },
  setup () {
    return {
      regions: ref([]),
      errorMessage: ref('')
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
