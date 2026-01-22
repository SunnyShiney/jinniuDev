<template>

  <el-card class="card" shadow="hover" :body-style="{ padding: '0px' }">
    
    <el-image v-if="image" class="image" :src="require('@/assets/home/' + image)"> </el-image>
    <el-image class="image" v-else :src="require('@/assets/home/img-jmhj.jpg')"></el-image>

    <ul v-if="url">
      <div class="header">
        <el-button class="el-button-succeed" type="text" @click="toSystem()" style="margin-top:10px">{{ systemName }}
        </el-button>
      </div>
    </ul>
    <div class="header" style="font-size:20px" v-else>
      <el-button class="el-button-null" type="text" disabled plain @click="toSystem()" style="margin-top:10px">
        {{ systemName }}</el-button>
    </div>



    <div class="infoContainer" style="background-color:#1677D9;color:white">

      <!-- 汇总数据列表 -->
      <div>
        <ul v-if="infoList.length != 0" class="infoList">
          <li v-for="item in infoList">{{ item.infoKey + ": " + item.infoVal }}</li>

        </ul>
        <div v-else>
          暂无数据
        </div>
        <el-popover v-if="systemName == '垃圾数据归集管家'" :width="800" placement="left" effect="dark"
          @after-enter=echartInit_jgzm() trigger="click"
          popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
          style="text-align: center;">
          <template #reference>
            <el-button class="el-button-succeed" type="text" style=" margin-top:10px;margin-left: 20%;">查看详情 >
            </el-button>

          </template>
          <template #default>
            <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column ">
              <div>
                <p class="demo-rich-content__name" style="margin: 0; font-weight: 500;font-size: 25px;">
                  {{ systemName }}
                </p>
                <p class="demo-rich-content__mention" style="margin: 0; font-size: 18px; color: var(--el-color-info)">
                  @详情统计
                </p>

                <div style="display:flex">

                  <dv-border-box6 v-for="item in infoList"
                    style="font-size: 20px;padding: 10px;margin-top: 0px;width:100%">
                    <div>{{ item.infoKey }}</div>
                    <div style="text-align:center">{{ item.infoVal }}</div>
                  </dv-border-box6>

                </div>

                <!-- <div id="container_jgzm1" style="width: 600px; height: 400px;float: left;"></div>
                <div id="container_jgzm2" style="width: 600px; height: 400px ;float:left"></div> -->

              </div>
            </div>
          </template>
        </el-popover>
        <el-popover v-if="systemName != '垃圾数据归集管家'" :width="800" placement="top" effect="dark"
          @after-enter=echartInit_jgzm() trigger="click"
          popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
          style="text-align: center;">
          <template #reference>
            <el-button class="el-button-succeed" type="text" style=" margin-top:10px;margin-left: 20%;">查看详情 >
            </el-button>

          </template>
          <template #default>
            <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column ">
              <div>
                <p class="demo-rich-content__name" style="margin: 0; font-weight: 500;font-size: 25px;">
                  {{ systemName }}
                </p>
                <p class="demo-rich-content__mention" style="margin: 0; font-size: 18px; color: var(--el-color-info)">
                  @详情统计
                </p>

                <div style="display:flex">

                  <dv-border-box6 v-for="item in infoList"
                    style="font-size: 20px;padding: 10px;margin-top: 0px;width:100%">
                    <div>{{ item.infoKey }}</div>
                    <div style="text-align:center">{{ item.infoVal }}</div>
                  </dv-border-box6>

                </div>

                <!-- <div id="container_jgzm1" style="width: 600px; height: 400px;float: left;"></div>
                <div id="container_jgzm2" style="width: 600px; height: 400px ;float:left"></div> -->

              </div>
            </div>
          </template>
        </el-popover>
      </div>
    </div>



  </el-card>
</template>

<script setup>
import router from '@/router';
import { ITEM_RENDER_EVT } from 'element-plus/es/components/virtual-list/src/defaults';
const prop = defineProps({
  logo: String,
  infoList: Array,
  systemName: String,
  url: String,
  image: String,
  to: String,
  deptId: String,
  isLogin: String

})
const subsysName = prop.systemName
// function toSystem() {
//   if(prop.isLogin == '0')
//   router.push({ name: prop.to, params: prop.systemName })
//   else if(prop.isLogin == '1')
//   window.open(prop.url)
// }
//方法重写，摒弃三级页面，后续如果需要用上面这个
function toSystem() {
  window.open(prop.url)


}
</script>

<style scoped>
.el-button-succeed {
  font-size: 20px;
  color: white;
}

.el-button-null {
  font-size: 20px;
  color: gray;
}

.card {
  border-radius: 3px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  margin-right: 45px;
  margin-top: 25px;
  width: 400px;
  background-color: #1677D9;
}

.header {
  text-align: center;

  /* width:130px;
  overflow: hidden;
  white-space: nowrap; */


}

.infoContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1677D9;
  padding: 20px;
  margin-top: -10px;
}

.logo-icon {
  margin-right: 10px;
  margin-left: 25%;
}

.image {
  float: left;
  height: 300px;
  width: 100%;
  border-radius: 5px;
  display: block;
}

.infoList {
  list-style-type: none;
}
</style>