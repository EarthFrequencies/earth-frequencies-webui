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
        <option>ITU 1</option>
        <option>ITU 2</option>
        <option>ITU 3</option>
        <option>Canada</option>
        <option>USA</option>
      </select>
    </div>

    <frequency-selector class="frequency-selector" />

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
import FrequencySelector from '@/components/FrequencySelector.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    FrequencySelector
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
