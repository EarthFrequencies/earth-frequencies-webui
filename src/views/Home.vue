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

<<<<<<< HEAD
    <frequency-selector class="frequency-selector"
      :lowerFrequency="1000" :upperFrequency="2000"
=======
    <FrequencySelector
      :fStart="1000" :fEnd="2000"
>>>>>>> 0328ae9 (feat(frequency): read mock frequency table)
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

    <AllocationsTableComponent :allocationsData="allocationsData" />

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
import AllocationsTableComponent from '@/components/AllocationsTableComponent.vue';
import { AllocationsTable } from '@/models/AllocationsTable';

const baseUrl = '.';
type AllocationsData = {
  allocationsTable: AllocationsTable
};

export default defineComponent({
  name: 'Home',
  components: {
    FrequencySelector,
    AllocationsTableComponent
  },
  data () {
    return {
      allocationsData: { allocationsTable: AllocationsTable.empty() } as AllocationsData
    };
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
      this.fetchRegions();
      this.allocationsData.allocationsTable = await this.fetchAllocations();
    },
    async fetchRegions () {
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
    },
    async fetchAllocations (): Promise<AllocationsTable> {
      // Test get US allocations for now
      try {
        const response = await axios.get(`${baseUrl}/api/allocations/us/index.json`);
        return response.data as AllocationsTable;
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.errorMessage = (error as any).message;
        return AllocationsTable.empty();
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
