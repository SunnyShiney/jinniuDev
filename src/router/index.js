import { createRouter, createWebHashHistory } from "vue-router";

//1.定义路由组件
import Login from '@/views/Login.vue'
import Home from '@/views/home/Home.vue'
import Gxdc from "@/views/gxdc/Gxdc.vue"
import Jgzm from "@/views/jgzm/Jgzm.vue"
import Syd from "@/views/syd/Syd.vue"
import Szcg from "@/views/szcg/Szcg.vue"
import Xzzf from "@/views/xzzf/Xzzf.vue"
import Ycxt from "@/views/ycxt/Ycxt.vue"
import Yyxt from "@/views/yyxt/Yyxt.vue"
import Cclj from "@/views/cclj/Cclj.vue"
import Shlj from "@/views/shlj/Shlj.vue"
import Map from "@/views/Map.vue"
import ForgetPassword from "@/views/ForgetPassword.vue";
import jkjm from "@/views/yyxt/components/Jkjm.vue"
import Ggzp from "@/views/ggzp/Ggzp.vue"
import Dept0 from "@/views/home/dept0.vue"
import Dept1 from "@/views/home/dept1.vue"
import Dept2 from "@/views/home/dept2.vue"
import Dept3 from "@/views/home/dept3.vue"
import Lzj from "@/views/lzj/Content.vue"
import Ddzh from "@/views/ddzh/Ddzh.vue"
import Changepsw from '@/views/Changepsw.vue'
import { params } from "@/store/store";


//2.配置路由映射
const routes = [
  { path: "/", component: Login, name: Login },
  { path: "/login", component: Login, name: Login },
  {
    name: "changepsw",
    path: "/changepsw",
    component: Changepsw,
    name: Changepsw,
  },
  { name: "forgetpassword", path: "/forget-password", component: ForgetPassword },
  { name: "home", path: "/home", component: Home, meta: { requestAuth: true } },
  { name: "map", path: "/map", component: Map, meta: { requestAuth: true } },
  { name: "dept0", path: "/dept0", component: Dept0 },
  { name: "dept1", path: "/dept1", component: Dept1 },
  { name: "dept2", path: "/dept2", component: Dept2 },
  { name: "dept3", path: "/dept3", component: Dept3 },

  // { name: 'mapop', path: '/mapop', component: MapOp },
  {
    // 油烟系统
    name: "yyxt",
    path: "/yyxt",
    component: Yyxt,
    children: [
      {
        name: "jkjm",
        path: "jkjm", //子组件的path不以/开头
        component: () => import("@/views/yyxt/components/Jkjm.vue"),
      },
      {
        name: "qygl",
        path: "qygl",
        component: () => import("@/views/yyxt/components/Qygl.vue"),
      },
      {
        name: "tjfx",
        path: "tjfx",
        component: () => import("@/views/yyxt/components/Tjfx.vue"),
      },
      {
        name: "ajgl",
        path: "ajgl",
        component: () => import("@/views/yyxt/components/Ajgl.vue"),
      },
    ],
  },
  {
    //数字城管
    name: "szcg",
    path: "/szcg",
    component: Szcg,
    children: [
      {
        name: "ajcx",
        path: "ajcx",
        component: () => import("@/views/szcg/components/Ajcx.vue"),
      },
      {
        name: "wtlytj",
        path: "wtlytj",
        component: () => import("@/views/szcg/components/Wtlytj.vue"),
      },
      {
        name: "gfwtsj",
        path: "gfwtsj",
        component: () => import("@/views/szcg/components/Gfwtsj.vue"),
      },
      {
        name: "gfwtbj",
        path: "gfwtbj",
        component: () => import("@/views/szcg/components/Gfwtbj.vue"),
      },
      {
        name: "qypjjd",
        path: "qypjjd",
        component: () => import("@/views/szcg/components/Qypjjd.vue"),
      },
      {
        name: "qypjcq",
        path: "qypjcq",
        component: () => import("@/views/szcg/components/Qypjcq.vue"),
      },
      {
        name: "qypjcg",
        path: "qypjcg",
        component: () => import("@/views/szcg/components/Qypjcg.vue"),
      },
      {
        name: "qypj",
        path: "qypj",
        component: () => import("@/views/szcg/components/Qypj.vue"),
      },
      {
        name: "wtlbbj",
        path: "wtlbbj",
        component: () => import("@/views/szcg/components/Wtlbbj.vue"),
      },
      {
        name: "wtlbsj",
        path: "wtlbsj",
        component: () => import("@/views/szcg/components/Wtlbsj.vue"),
      },
      {
        name: "wtlbbj_xl",
        path: "wtlbbj_xl",
        component: () => import("@/views/szcg/components/Wtlbbj_xl.vue"),
      },
      {
        name: "wtlbsj_xl",
        path: "wtlbsj_xl",
        component: () => import("@/views/szcg/components/Wtlbsj_xl.vue"),
      },
      {
        name: "szcg_cgl",
        path: "szcg_cgl",
        component: () => import("@/views/szcg/components/Szcg_cgl.vue"),
      },
      {
        name: "szcg_cgl_district",
        path: "szcg_cgl_district",
        component: () =>
          import("@/views/szcg/components/Szcg_cgl_district.vue"),
      },
      {
        name: "szcg_cgl_city",
        path: "szcg_cgl_city",
        component: () => import("@/views/szcg/components/Szcg_cgl_city.vue"),
      },
      {
        name: "szcg_monitor",
        path: "szcg_monitor",
        component: () => import("@/views/szcg/components/Szcg_monitor.vue"),
      },
      {
        name: "szcg_workman",
        path: "szcg_workman",
        component: () => import("@/views/szcg/components/Szcg_workman.vue"),
      },
      {
        name: "szcg_period",
        path: "szcg_period",
        component: () => import("@/views/szcg/components/Szcg_period.vue"),
      },
      {
        name: "szcg_diy",
        path: "szcg_diy",
        component: () => import("@/views/szcg/components/Szcg_diy.vue"),
      },
      {
        name: "dlcz",
        path: "dlcz",
        component: () => import("@/views/szcg/components/Dlcz.vue"),
      },
      {
        name: "dlcz_type",
        path: "dlcz_type",
        component: () => import("@/views/szcg/components/Dlcz_type.vue"),
      },
      {
        name: "cgzxpj",
        path: "cgzxpj",
        component: () => import("@/views/szcg/components/Cgzxpj.vue"),
      },
      {
        name: "gwpj",
        path: "gwpj",
        component: () => import("@/views/szcg/components/Gwpj.vue"),
      },
    ],
  },
  { name: "ycxt", path: "/ycxt", component: Ycxt }, //扬尘系统
  { name: "gxdc", path: "/gxdc", component: Gxdc }, //共享单车
  {
    name: "jgzm",
    path: "/jgzm",
    component: Jgzm,
    children: [
      {
        name: "nhtj",
        path: "nhtj", //子组件的path不以/开头
        component: () => import("@/views/jgzm/components/Nhtj.vue"),
      },
      {
        name: "jbgl",
        path: "jbgl", //子组件的path不以/开头
        component: () => import("@/views/jgzm/components/Jbgl.vue"),
      },
    ],
  }, //景观照明
  { name: "syd", path: "/syd", component: Syd }, //诉易达
  {
    name: "xzzf",
    path: "/xzzf",
    component: Xzzf,
    children: [
      {
        name: "qdkq",
        path: "qdkq", //子组件的path不以/开头
        component: () => import("@/views/xzzf/components/Qdkq.vue"),
      },
    ],
  }, //行政执法
  { name: "cclj", path: "/cclj", component: Cclj },
  { name: "shlj", path: "/shlj", component: Shlj },
  { name: "ddzh", path: "/ddzh", component: Ddzh },

  {
    name: "ggzp",
    path: "/ggzp",
    component: Ggzp,
    children: [
      {
        name: "xjry",
        path: "xjry",
        component: () => import("@/views/ggzp/components/Xjry.vue"),
      },
      {
        name: "xcgl",
        path: "xcgl",
        component: () => import("@/views/ggzp/components/Xcgl.vue"),
      },
    ],
  },
  {
    name: "lzj",
    path: "/lzj",
    component: Lzj,
    meta: { requestAuth: false },
    children: [
      {
        name: "jinniu",
        path: "jinniu", //子组件的path不以/开头
        component: () => import("@/views/lzj/components/Jinniu.vue"),
      },
      {
        name: "hongxing",
        path: "hongxing", //子组件的path不以/开头
        component: () => import("@/views/lzj/components/Hongxing.vue"),
      },
      {
        name: "xihua",
        path: "xihua", //子组件的path不以/开头
        component: () => import("@/views/lzj/components/Xihua.vue"),
      },
      {
        name: "honghuayan",
        path: "honghuayan", //子组件的path不以/开头
        component: () => import("@/views/lzj/components/Honghuayan.vue"),
      },
    ],
  },
];

//3.创建路由实例
const router = createRouter({
    routes,
    history: createWebHashHistory()
})

//以下代码是旧版的，刷新浏览器会自动跳转回登录页面，这是不合理的，2023/11/16 wlp已做修改
// router.beforeEach((to, from, next) => {
//     if (!params.isLogin && to.meta.requestAuth) {
//         console.log(params.isLogin)
//         next({ name: Login });
//     } else {
//         next();
//     }
// })
export default router;