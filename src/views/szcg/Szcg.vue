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
      <!-- 平台名字 -->
      <template #title>
        <span class="logo-title">平台主页</span>
      </template>
      <!-- 子系统名字 -->
      <template #content>
        <span class="content" style="font-size:25px">数字化城市信息管家</span>
      </template>
      <!-- 用户信息 -->
      <template #userinfo>
        <el-dropdown>
          <span class="el-dropdown-link">
            张三
            <el-icon>
              <ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>更改密码</el-dropdown-item>
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
              <el-sub-menu :index="idx + ''" :key="idx">
                <template #title>
                  <div v-if="item.icon.length !== 0" class="menu-img-default menu-img" :style="getIcon(item.icon)">
                  </div>
                  <span style="font-size:20px">{{ item.title }}</span>
                </template>
                <el-menu-item v-for="(subitem, subidx) in item.submenu" :index="idx + '-' + subidx" :key="subidx"
                  @click="displayContent(subitem.to)">
                  <div v-if="subitem.icon.length !== 0" class="menu-img-default menu-img" :style="getIcon(item.icon)">
                  </div>
                  <span style="font-size:20px">{{ subitem.title }}</span>
                </el-menu-item>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item :index="idx" :key="idx" @click="displayContent(item.to)">
                <div v-if="item.icon.length !== 0" class="menu-img-default menu-img" :style="getIcon(item.icon)"></div>
                <span style="font-size:20px">{{ item.title }}</span>
              </el-menu-item>
            </template>
          </template>
          <el-menu-item :index="menuList.length">
            <el-icon>
              <component :is="Link"></component>
            </el-icon>
            <span style="font-size:20px"><a href="http://101.37.246.72/denglu_zzcg.exe"
                target="_blank">跳转主页脚本</a></span>
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
import { ArrowDown, Link } from "@element-plus/icons-vue";
import Header from "@/components/Header.vue";
import { onMounted, ref } from "vue";
import { useStore } from "vuex"
const store = useStore()

// 设置子系统名字
const route = useRoute()
const subsysName = ref(route.params.subsysName)

// 导航栏的返回上一级按键
const router = useRouter()
function goback() {
  router.push('/home')
}
onMounted(() => router.push('/szcg/ajcx'))

// 此处的icon表明其在雪碧图中的坐标, 从1开始计数
const menuList = [
  { icon: '02,03', title: '案卷查询', to: 'ajcx', submenu: [] },
  { icon: '01,22', title: '统计分析', to: 'wtlytj', submenu: [] },
  { icon: '03,13', title: '高发问题分组', to: 'gfwtsj', submenu: [{ icon: '', title: '事件高发Top5', to: 'gfwtsj' }, { icon: '', title: '部件高发Top5', to: 'gfwtbj' }] },
  { icon: '03,12', title: '区域评价统计', to: 'qypjtj', submenu: [{ icon: '', title: '区域评价(街道)', to: 'qypjjd' }, { icon: '', title: '区域评价(城区)', to: 'qypjcq' }] },
  { icon: '03,14', title: '部门评价分组', to: 'qypjcg', submenu: [{ icon: '', title: '专业部门评价(城管类)', to: 'qypjcg' }, { icon: '', title: '专业部门评价', to: 'qypj' }] },
  { icon: '03,15', title: '问题类别分组', to: 'wtlbbj', submenu: [{ icon: '', title: '问题大类统计(部件)', to: 'wtlbbj' }, { icon: '', title: '问题大类统计(事件)', to: 'wtlbsj' }, { icon: '', title: '问题小类统计(部件)', to: 'wtlbbj_xl' }, { icon: '', title: '问题小类统计(事件)', to: 'wtlbsj_xl' }] },
  { icon: '01,14', title: '岗位评价分组', to: 'qypjcg', submenu: [{ icon: '', title: '专业部门评价(城管类)', to: 'qypjcg' }, { icon: '', title: '专业部门评价', to: 'qypj' }] },
  {
    icon: '03,16', title: '数字城管考评分组', to: 'szcg_cgl', submenu: [{ icon: '', title: '城管类问题处置情况', to: 'szcg_cgl' },
    { icon: '', title: '城管类问题处置情况细分(区级)', to: 'szcg_cgl_district' },
    { icon: '', title: '城管类问题处置情况细分(市级)', to: 'szcg_cgl_city' },
    { icon: '', title: '视频监控情况考评', to: 'szcg_monitor' },
    { icon: '', title: '监督员上岗情况', to: 'szcg_workman' },
    { icon: '', title: '时段均衡性考核', to: 'szcg_period' },
    { icon: '', title: '金牛区自行处置案件上报数', to: 'szcg_diy' },
    ]
  },
  { icon: '02,07', title: '道路评价统计', to: 'dlcz', submenu: [{ icon: '', title: '道路分区处置统计', to: 'dlcz' }, { icon: '', title: '道路类别处置统计', to: 'dlcz_type' }] },
  { icon: '02,09', title: '中心城区城管中心评价', to: 'cgzxpj', submenu: [] },
  { icon: '02,10', title: '岗位评价分组', to: 'gwpj', submenu: [] },


]

// 返回雪碧图中该图标左上角的位置
function getIcon(idxStr) {
  const len = -30
  const x = parseInt(idxStr.split(',')[1] - 1) * len
  const y = parseInt(idxStr.split(',')[0] - 1) * len
  return {
    backgroundPositionX: x + 'px',
    backgroundPositionY: y + 'px'
  }
}

function displayContent(name) {
  router.push({ name })
}
function logout() {
   store.dispatch("logout")
  //TODO 清除登录信息
  router.push('/login')
}
</script>

<style scoped src="@/assets/css/subsys.css">

</style>
<style scoped>
.menu-img-default {
  /**原图每个图标都是45 * 45，这里将其变成30 * 30,所以background-size的长宽都乘了2/3 */
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background-image: url('@/assets/szcg/nav-icon.png');
  background-size: calc(1000px * 2 / 3) calc(1000px * 2 / 3);
}
</style>