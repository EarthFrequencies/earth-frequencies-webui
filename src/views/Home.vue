<template>
  <div class="home">
    <img alt="Earth Frequencies" src="images/banner.svg">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>

    <div>Work in Progress. Still lots of issues.</div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="!allocationsValid" class="allocation-validation-issues">
      <b>Warning:</b> {{ warningMessage }}
    </div>

    <div class="filters">
      <label>Region: </label>
      <select @change="onRegionChange" v-model="activeRegion">
        <option v-for="region in regions" :key="region.path" :value="region.path">{{ region.region }}</option>
      </select>
    </div>

    <!-- <div id="nav" class="allocation-breadcrumbs">
      <a href="#" class="router-link-active router-link-exact-active">ITU 2</a> &gt; United States
    </div> -->

    <frequency-selector class="frequency-selector"
      :lowerFrequency="1000" :upperFrequency="2000"
    />

    <allocation-chart :allocations="allocationBands" :service-filter="servicesToDisplay" :band-filter="filterRange" class="allocation-chart"/>

    <div class="filters">
      <div class="filter-row">
        <label class="freq-label" for="filter-lower-frequency">Frequency Range: </label>
        <input type="number" v-model="filterRange.lowerFrequency" id="filter-lower-frequency" /> Hz
        -
        <input type="number" v-model="filterRange.upperFrequency"  /> Hz
      </div>
      <div class="filter-row">
        <label class="freq-label" for="service">Service: </label>
        <select name="service" id="filter-service" v-model="filterByService">
          <option value="all">All</option>
          <option v-for="(service, idx) in services" :key="idx" :value="service">{{ service }}</option>
        </select>
      </div>
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
        <tr v-for="(allocationBand, idx) in filteredAllocationBands" :key="idx">
          <td class="align-left">{{ humanHzUnits(allocationBand.lf) }}</td>
          <td class="align-left">{{ humanHzUnits(allocationBand.uf) }}</td>
          <td class="align-left">
            <ul>
              <li v-for="(service, idx2) in allocationBand.services" :key="idx2">
                <div class="bullet" :style="{ background: getColourForService(service.desc) }"></div><div>{{ service.desc }}</div>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="metadata" class="allocation-table-info">
      <div v-if="metadata.name_en">Region: {{ metadata.name_en }}</div>
      <div v-if="metadata.official">Official source: <a :href="metadata.official">{{ metadata.official }}</a></div>
      <div v-if="metadata.edition">Edition: {{ metadata.edition }}</div>
    </div>

    <div class="allocation-table-info">
      Disclaimer: This project is developped by volunteers and there is no guarantee as to the
      accuracy of the data. Please check official sources and local regulatory authorities for
      more accuracte data, especially if your project involves transmission.
    </div>

    <div v-if="metadata" class="allocation-table-info">
      Contributions are welcome.
    </div>

    <div class="logo-box">
      <a href="https://github.com/EarthFrequencies">
        <img src="images/github.svg" alt="GitHub" class="github-logo"/>
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
import { FrequencyAllocationBand } from '@/models';
import { humanHzUnits, getColourForService, getServices } from '@/utils/FrequencyUtils';

const baseUrl = 'https://www.earthfrequencies.org/api';

// just until we have a proper data file, and have established
// the json schema we want to use
// const frequencyAllocations: FrequencyAllocations = {
//   name: 'United States',
//   region: 'us',
//   allocationBlocks: [{
//     band: {
//       lower: 3000,
//       upper: 9000
//     },
//     allocations: [{
//       service: 'NOT ALLOCATED',
//       primary: true
//     }]
//   }, {
//     band: {
//       lower: 960000,
//       upper: 116400
//     },
//     allocations: [{
//       service: 'AERONAUTICAL MOBILE (R)',
//       primary: true,
//       footnotes: ['5.327A']
//     }, {
//       service: 'AERONAUTICAL RADIONAVIGATION',
//       primary: true,
//       footnotes: ['5.328']
//     }]
//   }, {
//     band: {
//       lower: 116400,
//       upper: 121500
//     },
//     allocations: [{
//       service: 'AERONAUTICAL RADIONAVIGATION',
//       primary: true,
//       footnotes: ['5.328']
//     }, {
//       service: 'RADIONAVIGATION-SATELLITE (space-to-Earth)',
//       primary: true,
//       footnotes: ['5.328B']
//     }, {
//       service: 'RADIONAVIGATION-SATELLITE (space-to-space)',
//       primary: true,
//       footnotes: ['5.328B']
//     }]
//   }]
// };

export default defineComponent({
  name: 'Home',
  components: {
    FrequencySelector, AllocationChart
  },
  setup () {
    const services = getServices();
    return {
      activeRegion: ref('itu1'),
      regions: ref([] as Record<string, string>[]),
      errorMessage: ref(''),
      warningMessage: ref(''),
      allocationBands: ref([] as FrequencyAllocationBand[]),
      metadata: ref(undefined as Record<string, string> | undefined),
      services,
      filterByService: ref('all'),
      filterRange: ref({
        lowerFrequency: '' as number | string,
        upperFrequency: '' as number | string
      }),
      allocationsValid: ref(true)
    };
  },
  async mounted () {
    await this.fetchCharts();
    await this.fetchAllocations();
  },
  methods: {
    async fetchCharts () {
      try {
        const response = await axios.get(`${baseUrl}/allocations/tables`, {
          headers: {
            accept: 'application/json'
          }
        });

        const data = response.data;
        if (data.entries) {
          this.regions = data.entries;
        }
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.errorMessage = (error as any).message;
      }
    },
    async fetchAllocations () {
      try {
        this.allocationBands = [];
        this.metadata = {};

        const response = await axios.get(`${baseUrl}/allocations/tables/${this.activeRegion}`);
        const data = response.data;
        if (Array.isArray(data.entries) && data.entries.length > 0) {
          let bands = data.entries[0].bands;
          if (bands[0].lf !== 0) {
            bands = [{ lf: 0, uf: bands[0].lf, services: [] }, ...bands];
          }
          this.allocationBands = data.entries[0].bands;
        }
        this.metadata = data.metadata;
        this.validateAllocations();
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.errorMessage = (error as any).message;
      }
    },
    validateAllocations () {
      let valid = true;
      this.warningMessage = '';
      for (let i = 1; i < this.allocationBands.length; i++) {
        if (this.allocationBands[i].lf < this.allocationBands[i - 1].uf) {
          this.warningMessage = 'band allocations data may have issues, due to band overlap';
          valid = false;
        }
        if (this.allocationBands[i].lf !== this.allocationBands[i - 1].uf) {
          this.warningMessage = `band allocations data may have issues, due to missing bands - ${humanHzUnits(this.allocationBands[i].lf)}`;
          valid = false;
        }
      }
      this.allocationsValid = valid;
    },
    async onRegionChange () {
      await this.fetchAllocations();
    },
    humanHzUnits: humanHzUnits,
    getColourForService: getColourForService
  },
  computed: {
    servicesToDisplay (): string[] | undefined {
      if (!this.filterByService || this.filterByService === 'all') {
        return undefined;
      } else {
        return [this.filterByService];
      }
    },
    filteredAllocationBands (): FrequencyAllocationBand[] {
      let allocationBands = this.allocationBands;

      // filter by service type
      if (this.filterByService !== 'all') {
        allocationBands = this.allocationBands.map(allocationBand => {
          const allocationBandClone = Object.assign({}, allocationBand);
          if (allocationBandClone.services) {
            allocationBandClone.services = allocationBandClone.services.filter(service => service.desc.toLowerCase().startsWith(this.filterByService));
          }
          return allocationBandClone;
        });
        allocationBands = allocationBands.filter(allocationBand => (allocationBand.services && allocationBand.services.length > 0));
      }

      // filter by lower frequency
      if (this.filterRange.lowerFrequency && !isNaN(parseFloat(this.filterRange.lowerFrequency as string))) {
        const lowerFrequency = parseFloat(this.filterRange.lowerFrequency as string);
        allocationBands = allocationBands.filter(allocationBand => allocationBand.uf >= lowerFrequency);
      }

      // // filter by upper requency
      if (this.filterRange.upperFrequency && !isNaN(parseFloat(this.filterRange.upperFrequency as string))) {
        const upperFrequency = parseFloat(this.filterRange.upperFrequency as string);
        allocationBands = allocationBands.filter(allocationBand => allocationBand.lf <= upperFrequency);
      }

      return allocationBands;
    }
  }
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1024px;
  max-width: 100%;
  margin: 0 auto;

  img {
    max-width: 90%;
  }
  .allocation-breadcrumbs {
    text-align: left;
    width: 1024px;
    max-width: 100%;
    padding-left: 16px;
  }

  .frequency-selector {
    border: solid 1px grey;
    width: 1024px;
    max-width: 100%;
    height: 120px;
    margin-top: 20px;
  }

  .filters {
    width: 1024px;
    max-width: 100%;
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
    width: 1024px;
    max-width: 100%;
    text-align: left;
    padding: 4px 10px;
    box-sizing: border-box;
    background: rgb(233, 182, 182);
  }

  .allocation-chart {
    margin-top: 20px;
    width: 1024px;
    max-width: 100%;
  }

  .allocation-table {
    margin-top: 20px;
    width: 1024px;
    max-width: 100%;
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

    ul {
      list-style: none; /* Remove default bullets */
      li {
        div {
          display: inline-block;
        }
      }
    }

   ul li div:nth-child(1) {
      align-self: center;
      width: 0.6em;
      height: 0.6em;
      border: solid 1px black;
      color: inherit;
      background: inherit;
      font-weight: bold;
      display: inline-block;
      margin-left: -1em;
      margin-right: 0.5em;
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

  .allocation-table-info {
    width: 1024px;
    max-width: 100%;
    margin-top: 30px;
    text-align: left;
  }
}

.allocation-validation-issues {
  margin-top: 20px;
  width: 1024px;
  max-width: 100%;
  text-align: left;
  padding: 4px 10px;
  box-sizing: border-box;
  background: #ffc107;
}
</style>
