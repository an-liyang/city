<template>
  <div id="app">
    <button @click="getInit">选择城市</button>
    <SelectCity :get-city-data="allData" />
    <!-- <OpTicket /> -->
  </div>
</template>

<script>
// import axios from 'axios'
import SelectCity from './components/SelectCity.vue'
// import OpTicket from './components/OpTicket.vue'
// import Vue from 'vue'
// import loading from "./components/toolTip";
// Vue.use(loading);

export default {
  name: 'App',
  components: {
    SelectCity,
    // OpTicket
  },
  data () {
    return {
      allData: [],
    }
  },
  created () {
    this.getInit();
  },
  methods: {
    async getInit () {
      // const res = await axios.get(`http://localhost:3000/Data`)
      // console.log('app:', res);
      // this.allData = res.data;
      // this.$loading.show({
      //   text: "拼命加载中"
      // });

    }
  }
}
</script>

<style>
#app {
  margin: 0;
}
button {
  background-color: #3366ff;
  cursor: pointer;
}
</style>
