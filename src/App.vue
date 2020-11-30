<template>
  <div id="app">
    <el-button type="primary" @click="showCity">选择城市</el-button>
    <SelectCity :city-data-child="firstAllCityData" v-show="isShowCityDialog" @send-city-all-data="getCityAllData"  />
    <!-- <OpTicket /> -->
    <el-input
      type="textarea"
      :rows="10"
      placeholder="请输入内容"
      v-model="cityData">
    </el-input>
  </div>
</template>

<script>
import axios from 'axios'
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
      firstAllCityData: [],
      isShowCityDialog:false,
      cityData:''
    }
  },
  created () {
    
  },
  mounted(){
    this.$nextTick(()=>{
      this.getInit();
    })
  },
  methods: {
    async getInit () {
      const res = await axios.get(`./js/data.json`)
      this.firstAllCityData = res.data.Data;
      console.log(this.firstAllCityData[0])
      // this.$loading.show({
      //   text: "拼命加载中"
      // });

    },
    //显示城市组件
    showCity(){
      this.isShowCityDialog = true
    },
    // 获取城市组件传过来的值
    getCityAllData(data) {
      let that = this;
      that.isShowCityDialog = data.done;
      if (!data.data) return;
      that.firstAllCityData = data.data;
      this.cityData = JSON.stringify(data.data)
    },
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
