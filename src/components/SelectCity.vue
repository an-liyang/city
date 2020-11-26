<template>
  <div
    class="me-city-main"
    v-if="showCityDialog"
  >
    <div class="me-city-layer">旋覆层</div>
    <div class="me-city-content">
      <div class="me-city-title">
        <p class="me-city-title-name">选择投放城市</p>
        <span
          class="me-city-title-close"
          @click="closeSelectCity"
        >X</span>
      </div>
      <div class="me-city-list">
        <div class="me-city-list-title">
          <div class="me-city-list-title-letter">
            <span class="me-city-list-letter-name">省首字母</span>
            <span
              :class="{'me-city-list-letter-item':true,'indexActive':showCheckedIndex === index || isReverseShow}"
              v-for="(item,index) in alphabet"
              :key="index"
              @click="indexSearch(item,index)"
            >{{item}}</span>
          </div>
          <div>
            <!-- class="me-city-list-reverse" -->
            <div
              :class="{'me-city-list-reverse':true,'me-active':meReverseActive}"
              @click="reverseChecked"
            >反选</div>
            <div
              :class="{'me-city-list-all':true,'me-active': meAllActive}"
              @click="allChecked"
            >全选</div>
          </div>
        </div>
        <div class="me-city-list-content">
          <div
            class="me-city-list-province-item"
            v-for="(item,index) in PCAllData"
            :key="item.provinceId"
          >
            <!-- 处理省份的 -->
            <p
              class="me-city-list-province-title"
              @click="getProvinceItem('pItem'+item.provinceId)"
            >
              <span class="me-city-list-alphabet">{{ index === 0||(PCAllData[index-1].firstLetter!=item.firstLetter)? item.firstLetter:''}}</span>
              <!-- :src="item.pState === 'unchecked' ? isCheckImg.white:isCheckImg.checked" -->
              <img
                class="me-city-list-province-img"
                :src="item.icon"
                :ref=" 'pItem'+item.provinceId "
                :data-pstate="item.pState"
                alt=""
              >
              {{item.provinceName}}
            </p>
            <!-- 处理市的 -->
            <div class="me-city-list-city-wrap">
              <span
                class="me-city-list-city-item"
                v-for="(itemCity,indexCity) in item.cities"
                :key="itemCity.cityId"
                @click="getCityItem(indexCity,itemCity,item.provinceId,'cItem' + item.provinceId + itemCity.cityId)"
              >
                <img
                  class="me-city-list-city-img"
                  :src=" itemCity.cState === 'unchecked' ? isCheckImg.white:isCheckImg.checked"
                  alt=""
                  :ref="'cItem' + item.provinceId + itemCity.cityId"
                >
                {{itemCity.cityName}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="me-city-footer">
        <div
          class="me-city-footer-confirm"
          @click="confirm"
        >确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    getCityData: Array
  },
  // props: ['getCityData'],
  name: "SelectCity",
  data () {
    return {
      msg: '1234',
      alphabet: ["A", "B", "C", "F", "G", "H", "J", "L", "N", "Q", "S", "T", "X", "Y", "Z"],
      provinces: [],
      cities: [],
      PCAllData: [], // 省市数据总汇
      backupData: [],// 备份省市数据
      PCAllDataBackup: [], // 这套数据用了向后台发送的；上面用来渲染页面，都有用；这么分开写，是为了提高性能做的
      middleItem: '',
      isCheckImg: {
        // white: require('./image/cityWhite.png'),
        // check: require('./image/cityCheck.png'),
        // checked: require('./image/cityChecked.png'),
        white: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEX////b4Oe0Do2YAAAAEklEQVQI12P4/4GhQQAPAioAAK0/CX9c1NKKAAAAAElFTkSuQmCC",
        check: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAMUlEQVQoU2M0Tvv/n4EEwAjScHYWIyMxekBqKdOAy3kwF2DYMCI1EIoL8uOBkMnI8gDLbl8huJs2CQAAAABJRU5ErkJggg==",
        checked: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAALVBMVEUzZv85a//6+/9wlP/I1v/T3v/M2P/L2P+swP+Dov90lv9iif9hif9MeP9Kd/+a+gkUAAAAJklEQVQI12PABRh7gIQcg4g2kJpk6GQApMRVlcEySQvAKmRxaQUAm7UDn6tLXxUAAAAASUVORK5CYII=",

      }, // 三个小图标的base64的码
      showCheckedIndex: -1, // 表示被选中的字母
      currentCheckedLetter: '', // 当前被选中的字母
      isReverseShow: false, // 在反选时，显示，false是不显示，true是显示
      meReverseActive: false,// 反选选中时,按钮加背景色
      meAllActive: false,// 全选选中时,按钮加背景色
      showCityDialog: false, // 控制该组件的显示与否

    }
  },
  created () {
    console.log('app传来的城市数据:', this.getCityData);
    this.getAllData();
    this.showCityDialog = true;
  },
  methods: {
    // 根据字母查询
    indexSearch (item, index) {
      this.PCAllData = this.backupData
      let tempData = [];
      this.currentCheckedLetter = item;
      this.PCAllData.forEach((itemNew) => {
        if (itemNew.firstLetter == item) {
          this.showCheckedIndex = index
          tempData.push(itemNew)
        }
      });
      this.PCAllData = tempData;
    },
    // 反选
    reverseChecked () {

      let tempData = [];
      this.PCAllData = this.backupData
      this.PCAllData.forEach((item) => {
        if (item.firstLetter !== this.currentCheckedLetter) {
          tempData.push(item)
        }
      });
      for (let i = 0; i < tempData.length; i++) {
        // 给城市取反
        for (let j = 0; j < tempData[i].cities.length; j++) {
          if (tempData[i].cities[j].cState === 'unchecked') {
            tempData[i].cities[j].cState = 'checked'
          } else {
            tempData[i].cities[j].cState = 'unchecked'
          }
        }
        // 统计相关每个省份中的市的状态是否全是统一的unchecked 或checked;如果全是unchecked,那么省也是unchecked;如果全是checked,省也市checked
        let n = 0;
        let m = 0;
        for (let j = 0; j < tempData[i].cities.length; j++) {
          if (tempData[i].cities[j].cState === 'unchecked') {
            // 全部城市未选中状态
            n = n + 1;
          } else {
            // 全部城市选中状态
            m = m + 1;
          }
        }

        // 给普通省份取反:省份取反,由城市决定
        if (n === tempData[i].cities.length && tempData[i].cities.length > 0) {
          // 
          tempData[i].pState = 'unchecked';
          tempData[i].icon = this.isCheckImg.white;
        } else if (m === tempData[i].cities.length && tempData[i].cities.length > 0) {
          tempData[i].pState = 'checked';
          tempData[i].icon = this.isCheckImg.checked;
        } else {
          tempData[i].icon = this.isCheckImg.check;
        }

        // 给港澳台+ 4个直辖市取反
        if (tempData[i].cities.length < 1) {
          if (tempData[i].pState === 'unchecked') {
            tempData[i].pState = 'checked'
            tempData[i].icon = this.isCheckImg.checked;

            this.meReverseActive = true;

          } else {
            tempData[i].pState = 'unchecked'
            tempData[i].icon = this.isCheckImg.white;

            this.meReverseActive = false;
          }
        }
      }

      this.meAllActive = false;
      this.PCAllData = tempData;
    },
    // 全选
    allChecked () {
      this.showCheckedIndex = -1;
      this.meReverseActive = false;
      this.meAllActive = true;
      this.PCAllData = this.backupData
      for (let i = 0; i < this.PCAllData.length; i++) {
        this.PCAllData[i].pState = 'checked'

        for (let j = 0; j < this.PCAllData[i].cities.length; j++) {
          this.PCAllData[i].cities[j].cState = 'checked';
        }
        //--------------------------------
        let n = 0;
        let m = 0;
        for (let j = 0; j < this.PCAllData[i].cities.length; j++) {
          if (this.PCAllData[i].cities[j].cState === 'unchecked') {
            n = n + 1;
          } else {
            m = m + 1;
          }
        }
        if (n === this.PCAllData[i].cities.length && this.PCAllData[i].cities.length > 0) {
          this.PCAllData[i].pState = 'unchecked';
          this.PCAllData[i].icon = this.isCheckImg.white;
        } else if (m === this.PCAllData[i].cities.length && this.PCAllData[i].cities.length > 0) {
          this.PCAllData[i].pState = 'checked';
          this.PCAllData[i].icon = this.isCheckImg.checked;
        } else {
          // 备注:这种情况下的不用处理了.
        }

        // 针对只有港澳台地区;必须放这个位置;放到前面容易被重写
        if (this.PCAllData[i].cities.length < 1) {
          this.PCAllData[i].icon = this.isCheckImg.checked;
        }
      }

    },
    // 请求接口，获取数据
    async getAllData () {
      const res = await axios.get(`http://localhost:3000/Data`);





      let tempAllData = mergeSort(res.data);
      // 遇到直辖市,就不显示二级城市了
      for (let i = 0; i < tempAllData.length; i++) {
        if (tempAllData[i].cities.length === 1) {
          tempAllData[i].cities.splice(0, 1)
        }
      }
      console.log(tempAllData);
      this.PCAllData = tempAllData;
      this.backupData = tempAllData;


    },
    // 渲染所有的省市
    allDataRender (itemId) {
      for (let i = 0; i < this.PCAllData.length; i++) {
        // 筛选出对应的省份
        if (this.PCAllData[i].provinceId == parseInt(itemId.substr(5))) {
          // 将选中的省份，如果状态是未选中，那么改成选中状态
          if (this.PCAllData[i].pState == 'unchecked') {
            this.$refs[itemId][0].src = this.isCheckImg.checked;
            this.$refs[itemId][0].dataset.pstate = 'checked';
            this.PCAllData[i].pState = 'checked';
            this.PCAllData[i].icon = this.isCheckImg.checked;
            if (this.PCAllData[i].cities.length !== 0) {
              for (let j = 0; j < this.PCAllData[i].cities.length; j++) {
                this.PCAllData[i].cities[j].cState = 'checked'
                if (this.PCAllData[i].cities.length === 0) {
                  this.$refs[itemId][0].src = this.isCheckImg.checked;
                  this.$refs[itemId][0].dataset.pstate = 'checked';
                }
                if (itemId === ('pItem' + this.PCAllData[i].provinceId)) {
                  this.$refs[itemId][0].src = this.isCheckImg.checked;
                  this.$refs[itemId][0].dataset.pstate = 'checked';
                  this.$refs['cItem' + this.PCAllData[i].provinceId + this.PCAllData[i].cities[j].cityId][0].src = this.isCheckImg.checked
                }
              }
            }
          } else {// 点击的省份是原本是选中状态：
            // 点击后，改成未选中状态
            this.$refs[itemId][0].src = this.isCheckImg.white;
            this.$refs[itemId][0].dataset.pstate = 'unchecked';
            this.PCAllData[i].pState = 'unchecked';
            this.PCAllData[i].icon = this.isCheckImg.white;
            if (this.PCAllData[i].cities.length !== 0) {
              for (let j = 0; j < this.PCAllData[i].cities.length; j++) {
                this.PCAllData[i].cities[j].cState = 'unchecked'
                if (itemId === ('pItem' + this.PCAllData[i].provinceId)) {
                  this.$refs[itemId][0].src = this.isCheckImg.white;
                  this.$refs[itemId][0].dataset.pstate = 'unchecked';
                  this.$refs['cItem' + this.PCAllData[i].provinceId + this.PCAllData[i].cities[j].cityId][0].src = this.isCheckImg.white
                }
              }
            }

          }
        }
      }
    },
    // 选择省份
    getProvinceItem (itemId) {
      this.allDataRender(itemId);
    },
    // 选择城市
    getCityItem (index, item, provinceID, refItem) {
      // 如果城市是被选中状态，点击完取消
      if (this.$refs[refItem][0].src == this.isCheckImg.checked) {
        // 取消选中
        // 遍历所有的城市的cState改成checked
        for (let i = 0; i < this.PCAllData.length; i++) {
          // 将选中的城市的状态改成checked
          if (this.PCAllData[i].provinceId === provinceID) {
            for (let j = 0; j < this.PCAllData[i].cities.length; j++) {
              if (this.PCAllData[i].cities[j].cityId === item.cityId) {
                this.PCAllData[i].cities[j].cState = "unchecked";
                this.$refs[refItem][0].src = this.isCheckImg.white;
              }
            }
          }
          // 计数
          if (this.PCAllData[i].provinceId === provinceID) {
            let n = 0;
            for (let m = 0; m < this.PCAllData[i].cities.length; m++) {
              if (this.PCAllData[i].cities[m].cState == 'unchecked') {
                // n = n + 1
                ++n
              }
            }
            // 当选中的城市和该省所有城市数量相等时,让图标变全蓝
            if (n === this.PCAllData[i].cities.length) {
              this.$refs['pItem' + provinceID][0].src = this.isCheckImg.white;
              // 省份原本是选中状态，将城市全部取消选中后，省份改为未选中状态
              this.PCAllData[i].pState = 'unchecked';
            } else {
              this.$refs['pItem' + provinceID][0].src = this.isCheckImg.check;
            }
          }
        }
      } else {
        // 如果所选城市是未选中状态，点击完则选中
        // 当未选中时，点击选中
        for (let i = 0; i < this.PCAllData.length; i++) {
          // 将选中的城市的状态改成checked
          if (this.PCAllData[i].provinceId === provinceID) {
            for (let j = 0; j < this.PCAllData[i].cities.length; j++) {
              if (this.PCAllData[i].cities[j].cityId === item.cityId) {
                this.PCAllData[i].cities[j].cState = "checked";
                this.$refs[refItem][0].src = this.isCheckImg.checked;
              }
            }
          }
          // 计数
          if (this.PCAllData[i].provinceId === provinceID) {
            let n = 0;
            for (let m = 0; m < this.PCAllData[i].cities.length; m++) {
              if (this.PCAllData[i].cities[m].cState == 'checked') {
                n++
              }
            }
            if (n === this.PCAllData[i].cities.length) {
              this.$refs['pItem' + provinceID][0].src = this.isCheckImg.checked;
              // 省份原本是未选中的，全选中城市后，省份改为选中状态
              this.PCAllData[i].pState = 'checked';
            } else {
              this.$refs['pItem' + provinceID][0].src = this.isCheckImg.check;
            }
          }
        }
      }
    },


    // 确定按钮
    confirm () {
      this.PCAllData.forEach((item) => {
        let arr = [];// 暂存被筛选出来的城市
        item.cities.forEach((cItem) => {
          if (cItem.cState === "checked") {
            arr.push(cItem)
          }
        })
        // 将被选中的省市存到一个数组里面
        if (arr.length > 0 || item.pState === 'checked') {
          this.PCAllDataBackup.push({
            firstLetter: item.firstLetter,
            pState: item.pState,
            provinceId: item.provinceId,
            provinceLevel: item.provinceLevel,
            provinceName: item.provinceName,
            cities: arr
          })
        }
      })
      this.showCityDialog = false;
      console.log('确定:', this.PCAllDataBackup);
    },
    // 关闭按钮
    closeSelectCity () {
      this.showCityDialog = false;
    }

  }
}
// mergeSort和merge是自写排序算法
function mergeSort (arr) {  // 采用自上而下的递归方法
  var len = arr.length;
  if (len < 2) {
    return arr;
  }
  var middle = Math.floor(len / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle);
  return myMerge(mergeSort(left), mergeSort(right));
}

function myMerge (left, right) {
  var result = [];

  while (left.length && right.length) {
    // if (left[0] <= right[0]) {
    if (left[0].firstLetter <= right[0].firstLetter) {
      let item = left.shift();
      for (let i = 0; i < item.cities.length; i++) {
        item.cities[i].cState = 'unchecked'
      }
      let temporayVal = {
        cities: item.cities,
        firstLetter: item.firstLetter,
        provinceId: item.provinceId,
        provinceLevel: item.provinceLevel,
        provinceName: item.provinceName,
        pState: 'unchecked',
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEX////b4Oe0Do2YAAAAEklEQVQI12P4/4GhQQAPAioAAK0/CX9c1NKKAAAAAElFTkSuQmCC"
      }

      // result.push(left.shift());
      result.push(temporayVal);
    } else {
      let item = right.shift();
      for (let i = 0; i < item.cities.length; i++) {
        item.cities[i].cState = 'unchecked'
      }
      let temporayVal = {
        cities: item.cities,
        firstLetter: item.firstLetter,
        provinceId: item.provinceId,
        provinceLevel: item.provinceLevel,
        provinceName: item.provinceName,
        pState: 'unchecked',
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEX////b4Oe0Do2YAAAAEklEQVQI12P4/4GhQQAPAioAAK0/CX9c1NKKAAAAAElFTkSuQmCC"
      }
      // result.push(right.shift());
      result.push(temporayVal);
    }
  }

  while (left.length) {
    let item = left.shift();
    for (let i = 0; i < item.cities.length; i++) {
      item.cities[i].cState = 'unchecked'
    }
    let temporayVal = {
      cities: item.cities,
      firstLetter: item.firstLetter,
      provinceId: item.provinceId,
      provinceLevel: item.provinceLevel,
      provinceName: item.provinceName,
      pState: 'unchecked',
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEX////b4Oe0Do2YAAAAEklEQVQI12P4/4GhQQAPAioAAK0/CX9c1NKKAAAAAElFTkSuQmCC"
    }
    result.push(temporayVal);
  }


  while (right.length) {
    let item = right.shift();
    for (let i = 0; i < item.cities.length; i++) {
      item.cities[i].cState = 'unchecked'
    }
    let temporayVal = {
      cities: item.cities,
      firstLetter: item.firstLetter,
      provinceId: item.provinceId,
      provinceLevel: item.provinceLevel,
      provinceName: item.provinceName,
      pState: 'unchecked',
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEX////b4Oe0Do2YAAAAEklEQVQI12P4/4GhQQAPAioAAK0/CX9c1NKKAAAAAElFTkSuQmCC"
    }
    result.push(temporayVal);
  }

  // while (right.length)
  //   result.push(right.shift());
  return result;
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.me-city-main {
  margin: 0;
}
.me-city-layer {
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  /* z-index: 1; */
  background-color: rgba(0, 0, 0, 0.8);
  top: 0;
  left: 0;
  opacity: 0.5;
}
.me-city-content {
  width: 760px;
  height: 560px;
  background: #ffffff;
  display: block;
  position: fixed;
  z-index: 5;
  top: 50%;
  left: 50%;
  margin-top: -280px;
  margin-left: -380px;
}
.me-city-title {
  width: 760px;
  height: 60px;
  border-bottom: 1px solid #dbe0e7;
  /* line-height: 60px; */
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* background-color: pink; */
}
.me-city-title-name {
  display: inline-block;
  width: 144px;
  height: 20px;
  font-size: 16px;
  /* font-family: MicrosoftYaHei-Bold, MicrosoftYaHei; */
  font-family: "\5FAE\8F6F\96C5\9ED1";
  font-weight: bold;
  color: #3c5484;
  line-height: 21px;
  letter-spacing: 2px;
  position: relative;
  left: 40px;
}
.me-city-title-close {
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  color: #849cc0;
  cursor: pointer;
  /* float: right; */
  position: relative;
  right: 22px;
}
.me-city-list {
  margin: 20px 40px;
  /* padding: 18px 16px 0; */
}
.me-city-list-title {
  height: 32px;
  line-height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* background-color: skyblue; */
}
.me-city-list-title-letter {
  display: inline-block;
}
.me-city-list-reverse {
  display: inline-block;
  width: 76px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #3366ff;
  text-align: center;
  margin-right: 10px;
  font-size: 14px;
  font-family: "\5FAE\8F6F\96C5\9ED1";
  color: #3366ff;
  cursor: pointer;
}
.me-city-list-reverse:hover {
  background-color: #f2f5fa;
}
.me-city-list-all {
  display: inline-block;
  width: 76px;
  height: 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #3366ff;
  text-align: center;
  font-size: 14px;
  font-family: "\5FAE\8F6F\96C5\9ED1";
  color: #3366ff;
  cursor: pointer;
}
.me-city-list-all:hover {
  background-color: #f2f5fa;
}
.me-active {
  background-color: #3366FF !important;
  color: #fff !important;
}
.me-city-list-letter-name {
  width: 56px;
  font-size: 14px;
  font-family: "\5FAE\8F6F\96C5\9ED1";
  color: #3c5484;
  margin-right: 10px;
}

.me-city-list-letter-item {
  display: inline-block;
  width: 22px;
  height: 21px;
  font-size: 14px;
  font-family: "\5FAE\8F6F\96C5\9ED1";
  color: #3366ff;
  line-height: 21px;
  text-align: center;
  cursor: pointer;
}
.me-city-list-letter-item:hover {
  font-size: 18px;
  font-weight: 600;
}
.indexActive {
  font-size: 18px;
  font-weight: 600;
}
.me-city-list-content {
  background-color: rgb(130, 219, 185);

  margin-top: 12px;
  width: 680px;
  height: 344px;
  background: #ffffff;
  border: 1px solid #dbe0e7;
  box-sizing: border-box;
  overflow: auto;
  /* padding: 18px 16px 0; */
}
.me-city-list-content::-webkit-scrollbar {
  width: 4px;
}
.me-city-list-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); /**控制滚动条的的颜色 */
  /* background: rgba(0, 0, 0, 0.2); */

  background: #dbe0e7;
}
.me-city-list-content::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); 控制滚动条背景色的 */
  border-radius: 3px;
  /* background: rgba(0, 0, 0, 0.1); */
}
.me-city-list-content::-webkit-scrollbar-corner {
  border-radius: 2px;
}
.me-city-list-alphabet {
  display: inline-block;
  width: 12px;
  height: 12px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #849cc0;
  line-height: 12px;
  margin-right: 8px;
}
.me-city-list-province-title {
  cursor: pointer;
  text-align: center;
  display: inline-block;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #3c5484;
}
.me-city-list-province-item {
  margin-top: 10px;
  margin-left: 16px;
}
.me-city-list-province-img {
  margin-right: 4px;
  position: relative;
  top: 2px;
}
.me-city-list-city-wrap {
  margin-left: 40px;
}
.me-city-list-city-img {
  position: relative;
  top: 2px;
}
.me-city-list-city-item {
  cursor: pointer;
  display: inline-block;
  margin-right: 16px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #3c5484;
}
</style>
<style>
.me-city-footer {
  width: 760px;
  height: 72px;
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #dbe0e7;
}
.me-city-footer-confirm {
  width: 76px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #3366ff;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  right: 40px;
  cursor: pointer;

  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #ffffff;
}
</style>