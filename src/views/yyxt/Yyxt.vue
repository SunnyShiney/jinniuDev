<template>
  <el-container class="container">
    <!-- 导航栏 -->
    <Header @back="goback">
      <!-- logo -->
      <template #icon>
        <el-icon color="#ffffff" size="20px">
          <svg t="1656145922576" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1267" width="32" height="32"><path d="M587.776 961.536q-60.416 0-117.248-25.6t-101.376-69.632-71.168-101.888-26.624-122.368l0-39.936q0-23.552-0.512-50.688t-0.512-53.76l0-48.128q0-29.696-6.144-47.104t-26.624-16.384q-15.36 0-35.328-0.512t-36.352-0.512q-26.624 0-34.304-14.336t10.752-37.888q18.432-24.576 43.52-56.32t51.712-65.536 52.224-66.56 46.08-58.368q18.432-23.552 34.816-24.064t34.816 20.992q18.432 22.528 43.52 52.736t51.712 62.976 52.224 64.512 46.08 56.32q22.528 26.624 17.408 44.544t-32.768 17.92q-8.192 0-19.968 0.512t-25.088 1.024-25.6 1.024-21.504 0.512q-19.456 0-24.064 11.776t-4.608 32.256q1.024 46.08 1.024 103.424l0 106.496q0 23.552 10.752 47.104t28.672 43.008 41.472 31.744 50.176 12.288l71.68 0q40.96 0 79.36-0.512t67.072-0.512l35.84 0q22.528 0 37.376 13.824t22.528 34.816 7.68 45.568-7.168 45.568-20.992 34.816-34.304 13.824l-27.648 0-48.128 0q-26.624 0-56.832 0.512t-57.856 0.512l-47.104 0-28.672 0z" p-id="1268"></path></svg>
        </el-icon>
      </template>
      <!-- 平台名字 -->
      <template #title>
        <span class="logo-title">平台主页</span>
      </template>
      <!-- 子系统名字 -->
      <template #content>
        <span class="content" style="font-size:25px">餐饮油烟管家</span>
      </template>
      <!-- 用户信息 -->
      <template #userinfo>
        <el-dropdown>
          <span class="el-dropdown-link">
            张三
            <el-icon>
              <ArrowDown/>
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
              <el-sub-menu :index="idx+''" :key="idx">
                <template #title>
                  <el-image :src="require('@/assets/yyxt/' + item.icon)" class="menu-img"/>
                  <span style="font-size:20px">{{item.title}}</span>
                </template>
                <el-menu-item
                    v-for="(subitem, subidx) in item.submenu"
                    :index="idx+'-'+subidx"
                    :key="subidx"
                    @click="displayContent(subitem.to)">
                  <el-image :src="require('@/assets/yyxt/' + item.icon)" class="menu-img"/>
                  <span style="font-size:20px">{{subitem.title}}</span>
                </el-menu-item>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item :index="idx" :key="idx" @click="displayContent(item.to)">
                <el-image :src="require('@/assets/yyxt/' + item.icon)" class="menu-img"/>
                <span style="font-size:20px">{{item.title}}</span>
              </el-menu-item>
            </template>
          </template>
          <el-menu-item :index="menuList.length">
            <el-icon><component :is="Link"></component></el-icon>
            <span style="font-size:20px"><a href="http://47.93.222.102/loginauto.html?uname=18981967017&pw=9876" target="_blank">跳转主页</a></span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import {House, ArrowDown, Setting, Link} from "@element-plus/icons-vue";
import Header from "@/components/Header.vue";
import { onMounted, ref } from "vue";
import { useStore } from "vuex"
const store = useStore()


// 由于<script setup>使用动态组件时，:is属性的值是对象实例，而不是组件名
// 而menuList里的icon是组件名，因此这里做一个映射
const icons = {
  House, Setting
}

// 设置子系统名字
const route = useRoute()
const subsysName = ref(route.params.subsysName)

// 导航栏的返回上一级按键
const router = useRouter()
function goback(){
  router.push('/home')
}
function logout() {
   store.dispatch("logout")
  //TODO 清除登录信息
  router.push('/login')
}
// 这个应该从后台请求获得
const menuList = [
  {icon: 'icon-jkjm.png', title:'监控界面', to:'jkjm', click:"getCompanyList", submenu:[]},
  {icon: 'icon-qygl.png', title:'企业管理', to:'qygl', click:'', submenu:[]},
  {icon: 'icon-tjfx.png', title:'统计分析', to:'tjfx', click:'', submenu:[]},
  {icon: 'icon-jkjm.png', title:'案件管理', to:'ajgl', click:'', submenu:[]},
  // {icon: 'icon-jkjm.png', title:'案件管理', to:'', click:'', submenu:[{icon:'icon-jkjm.png', title:'子模块1', to:'/subpath1', click:''},  {icon: 'icon-jkjm.png', title:'子模块2', to:'/subpath2', click:''}]},
]
onMounted(()=>router.push('/yyxt/jkjm'))
function displayContent(name){
  router.push({name})
}
</script>

<style scoped src="@/assets/css/subsys.css">
</style>