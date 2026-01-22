<template>
  <el-container class="container">
    <!-- 导航栏 -->
    <Header @back="goback">
      <!-- logo -->
      <template #icon>
        <el-icon color="#ffffff" size="20px">
          <svg t="1656145922576" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="1267" width="32" height="32">
            <path
              d="M587.776 961.536q-60.416 0-117.248-25.6t-101.376-69.632-71.168-101.888-26.624-122.368l0-39.936q0-23.552-0.512-50.688t-0.512-53.76l0-48.128q0-29.696-6.144-47.104t-26.624-16.384q-15.36 0-35.328-0.512t-36.352-0.512q-26.624 0-34.304-14.336t10.752-37.888q18.432-24.576 43.52-56.32t51.712-65.536 52.224-66.56 46.08-58.368q18.432-23.552 34.816-24.064t34.816 20.992q18.432 22.528 43.52 52.736t51.712 62.976 52.224 64.512 46.08 56.32q22.528 26.624 17.408 44.544t-32.768 17.92q-8.192 0-19.968 0.512t-25.088 1.024-25.6 1.024-21.504 0.512q-19.456 0-24.064 11.776t-4.608 32.256q1.024 46.08 1.024 103.424l0 106.496q0 23.552 10.752 47.104t28.672 43.008 41.472 31.744 50.176 12.288l71.68 0q40.96 0 79.36-0.512t67.072-0.512l35.84 0q22.528 0 37.376 13.824t22.528 34.816 7.68 45.568-7.168 45.568-20.992 34.816-34.304 13.824l-27.648 0-48.128 0q-26.624 0-56.832 0.512t-57.856 0.512l-47.104 0-28.672 0z"
              p-id="1268"></path>
          </svg>
        </el-icon>
      </template>
      <template #title>
        <span class="logo-title">平台主页</span>
      </template>
      <!-- 子系统名字 -->
      <template #content>
        <span class="text-title" style="font-size:25px">垃圾数据归集管家</span>
      </template>
      <!-- 系统名字 -->

      <!-- 时间 -->



      <!-- 用户信息 -->
      <template #userinfo>
        <div class="router">
        </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ user.username + "（" + user.role + "）" }}
            <el-icon>
              <ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </Header>
    <el-container class="data-container">
      <el-aside>
        <el-menu class="menu">
          <!--有二级菜单，则以子菜单的形式展示;没有二级菜单，则以菜单项显示-->
          <template v-for="(item, idx) in menuList">
            <template v-if="item.submenu.length != 0">
              <el-sub-menu :index="idx + ''" :key="idx" collapse="true">
                <template #title>
                  <div class="menu-img-default menu-img" :style="getIcon(item.icon)"></div>
                  <span style="font-size:20px">{{ item.title }}</span>
                </template>
                <el-menu-item v-for="(subitem, subidx) in item.submenu" :index="idx + '-' + subidx" :key="subidx"
                  @click="displayContent(subitem.to)">
                  <div class="menu-img-default menu-img" :style="getIcon(item.icon)"></div>
                  <span style="font-size:20px">{{ subitem.title }}</span>
                </el-menu-item>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item :index="idx" :key="idx" @click="displayContent(item.to)">
                <div class="menu-img-default menu-img" :style="getIcon(item.icon)"></div>
                <span style="font-size:20px">{{ item.title }}</span>
              </el-menu-item>
            </template>
          </template>
          <el-menu-item>
            <el-icon>
              <component :is="Link"></component>
            </el-icon>
            <span style="font-size:20px"><a href="https://175.153.176.27:18803/#/home/map" target="_blank">跳转主页</a></span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
  
<script setup>
import { useRouter, useRoute } from "vue-router";
import { House, ArrowDown, Setting, Link } from "@element-plus/icons-vue";
import Header from "@/components/Header.vue";
import { ref, onMounted, reactive, onBeforeMount } from "vue";
import { useStore } from "vuex"
const store = useStore()

// 由于<script setup>使用动态组件时，:is属性的值是对象实例，而不是组件名
// 而menuList里的icon是组件名，因此这里做一个映射
const icons = {
  House, Setting
}
const user = reactive({
  username: '张三',
  role: '管理员'
})
//日期 周
let date = new Date().toLocaleDateString();
var a = new Array("日", "一", "二", "三", "四", "五", "六");
var str = new Date().getDay();
var week = "星期" + a[str];
function toSystem(item) {
  router.push({ name: item.to, params: item.systemName })
}
//部门列表, 从后端获取
// onMounted(() => router.push('/content/jinniu'))


// 系统列表
const systems = ref([])

//选中的部门
// -1表示全选，为默认值
const choosedDept = ref(-1)
const choosedDeptName = ref()
//选中部门对应的子系统


// 跳转到to指定的子系统汇总页面
function show(to, subsysName) {
  if (to === '') {
    ll
    ElMessage({
      showClose: true,
      message: '正在开发中...'
    })
  } else {
    router.push({ name: to, params: { subsysName } })
  }
}
function toMap() {
  router.push('/home')
}

// 设置子系统名字
const route = useRoute()
const subsysName = ref(route.params.subsysName)

// 导航栏的返回上一级按键
const router = useRouter()
function goback() {
  router.push('/home')
}
function logout() {
   store.dispatch("logout")
  //TODO 清除登录信息
  router.push('/login')
}
//   onMounted(()=>router.push('/xzzf/qdkq'))

// 这个应该从后台请求获得
const menuList = [
  // { icon: '02,01', title: '金牛区汇总统计分析', to: 'jinniu', submenu: [] },
  { icon: 'House', title: '各站点统计分析', to: 'jinniu', submenu: [{ icon: '', title: '大站汇总分析', to: 'jinniu' }, { icon: '', title: '红星', to: 'hongxing' }, { icon: '', title: '西华', to: 'xihua' }, { icon: '', title: '红花堰', to: 'honghuayan' },] },

  { icon: '03,16', title: '垃圾预测', to: 'qdkq', submenu: [] },


]
function displayContent(name) {
  router.push({ name })
}
function getIcon(idxStr) {
  const len = -30
  const x = parseInt(idxStr.split(',')[1] - 1) * len
  const y = parseInt(idxStr.split(',')[0] - 1) * len
  return {
    backgroundPositionX: x + 'px',
    backgroundPositionY: y + 'px'
  }
}
</script>
  
<style scoped src="@/assets/css/subsys.css">

</style>
<style scoped>
/* .logo-title{
    font-size: x-large;
  color: #fff;
  line-height: 20px;
}
.content{
    padding: 15px;
  font-size: 40px;
  margin-left: 10px;
  margin-bottom: 10px;
  white-space: nowrap;
  letter-spacing: 3px;
} */
.menu-img-default {
  /**原图每个图标都是45 * 45，这里将其变成30 * 30,所以background-size的长宽都乘了2/3 */
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background-image: url('@/assets/nav-icon.png');
  background-size: calc(1000px * 2 / 3) calc(1000px * 2 / 3);
}

.mapDiv {
  width: 100%;
  height: 100%;
}

.closeIcon {
  margin-left: 20px;
}

.text-week {
  margin-left: 20px;
  font-size: large;
  color: #fff;
  line-height: 60px;
  width: 100%;
}

.text-title {
  margin-left: 20px;
  font-size: 30px;
  color: #fff;
  line-height: 60px;
  width: 30%;
  padding: 5px;
}

.el-descriptions-item {
  font-size: 20px;
}

.el-card {
  width: auto;
  padding: 20px;
  margin-top: 20px;
  font-size: 25px;
}

.buttonToMap {
  font-size: large;
  color: #fff;
}

.el-dropdown-link {
  font-size: 20px;
}

.table {
  size: large;
  margin-bottom: 1em;
  font-size: 25px;
  line-height: 30px;
}

.item {
  padding: 10px;
}

.router {
  padding: 15px;
  font-size: 25px;
  margin-left: 10px;
  margin-top: -3px;
  white-space: nowrap;
  letter-spacing: 3px;
}

.content {
  padding: 25px;
  font-size: 40px;
  margin-left: 10px;
  margin-bottom: 10px;
  white-space: nowrap;
  letter-spacing: 3px;

}

.container {
  display: flex;
  flex-direction: column;
}

.navHeader {
  background-color: #fff;
  color: #004B8C;
  margin-left: -20px;
  margin-right: -20px;
  height: initial;
  display: flex;
}

.title {
  padding: 25px;
  font-size: 40px;
  margin-left: 10px;
  margin-bottom: 10px;
  white-space: nowrap;
  letter-spacing: 3px;

}

.subsys {
  /**保持子系统栏与标题栏背景色一致 */
  display: flex;
  flex-wrap: wrap;
  padding: 25px;
  text-align: center;


}

.classification {
  /**保持子系统栏与标题栏背景色一致 */
  display: flex;
  flex-wrap: wrap;
  padding: 25px;
  text-align: center;


}

.main {
  display: flex;
  flex-wrap: wrap;
  /*当屏幕尺寸变小时，各个子系统汇总模块自动换行*/
  justify-content: center;
}

.logo-title {
  font-size: x-large;
  color: #fff;
  line-height: 60px;
}

.background {
  display: flex;
  flex-wrap: wrap;
  width: 200;
}

.subdepts {
  padding: 0px;
  font-size: 25px;
  margin-left: -5px;
  margin-top: 40px;
  white-space: nowrap;
  float: left;
  text-decoration: underline;
}

:deep(.amap-logo) {
  display: none;
  opacity: 0 !important;
}

:deep(.amap-copyright) {
  opacity: 0;
}
</style>