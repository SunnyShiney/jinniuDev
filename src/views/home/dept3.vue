<template>
  <el-container class="container">
    <Header style="height: 60px" :icon="null">
      <!-- 系统名字 -->
      <template #title>
        <span class="text-title">成都市金牛区综合行政执法局,欢迎您~</span>
      </template>
      <!-- 时间 -->

      <template #time>
        <div class="text-week">今天是: {{ date }} {{ week }}</div>
      </template>

      <!-- 用户信息 -->
      <template #userinfo>
        <div class="router">
          <el-button
            class="buttonToMap"
            plain
            link
            color="fff"
            @click="toMap"
            size="large"
            >前往地图主页</el-button
          >
        </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ params.username + "" + params.role + "" }}
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
    <el-container>
      <!-- 大类和子系统栏 -->
      <el-header class="navHeader">
        <!-- logo -->

        <el-image
          class="text-logo"
          :src="require('@/assets/home/logo-title.jpg')"
          fit="scale-down"
        ></el-image>
        <div class="classification" v-if="showDepts">
          <class-item
            v-for="dept in depts"
            :key="dept.deptId"
            @click="switchShowDepts(dept.deptId, dept.deptName)"
            :logo="dept.deptLogo"
            :name="dept.deptName"
            styleName="subsysName"
          ></class-item>
        </div>
        <!-- <div class="subsys" v-if="!showDepts">
          <div class="subdepts">{{choosedDeptName}}</div>
        </div> -->
        <div class="subsys" v-if="!showDepts">
          <div v-for="system in choosedSystems" :key="system.systemId">
            <class-item
             class="dept-item"
              @click="show(system, system.systemId, system.url)"
              :logo="system.systemLogo"
              :name="system.systemName"
              styleName="subsysName"
            >
            </class-item>
            <div id="fourTopic" title="运行正常"></div>
          </div>
        </div>
        <div class="subsys" v-if="!showDepts">
          <div style="padding-left: 15px; margin-top: 20px">
            <el-icon
              color="#000000"
              size="20px"
              @click="backtoHome()"
              style="cursor: pointer"
            >
              <svg
                t="1656145922576"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1267"
                width="32"
                height="32"
              >
                <path
                  d="M587.776 961.536q-60.416 0-117.248-25.6t-101.376-69.632-71.168-101.888-26.624-122.368l0-39.936q0-23.552-0.512-50.688t-0.512-53.76l0-48.128q0-29.696-6.144-47.104t-26.624-16.384q-15.36 0-35.328-0.512t-36.352-0.512q-26.624 0-34.304-14.336t10.752-37.888q18.432-24.576 43.52-56.32t51.712-65.536 52.224-66.56 46.08-58.368q18.432-23.552 34.816-24.064t34.816 20.992q18.432 22.528 43.52 52.736t51.712 62.976 52.224 64.512 46.08 56.32q22.528 26.624 17.408 44.544t-32.768 17.92q-8.192 0-19.968 0.512t-25.088 1.024-25.6 1.024-21.504 0.512q-19.456 0-24.064 11.776t-4.608 32.256q1.024 46.08 1.024 103.424l0 106.496q0 23.552 10.752 47.104t28.672 43.008 41.472 31.744 50.176 12.288l71.68 0q40.96 0 79.36-0.512t67.072-0.512l35.84 0q22.528 0 37.376 13.824t22.528 34.816 7.68 45.568-7.168 45.568-20.992 34.816-34.304 13.824l-27.648 0-48.128 0q-26.624 0-56.832 0.512t-57.856 0.512l-47.104 0-28.672 0z"
                  p-id="1268"
                ></path>
              </svg>
            </el-icon>
          </div>
        </div>
      </el-header>

      <div class="background" v-if="choosedDept === 3">
        <img
          src="@/assets/home/banner-szcg.png"
          width="10000"
          style="overflow-y: auto; overflow-x: auto"
        />
      </div>

      <!-- 页面显示区域 -->
      <el-main class="main">
        <div class="szcg" style="height: 15vh">
          <div
            @click="tcwt_click"
            class="tcwt"
            style="height: 10vh; margin-right: 5vw"
          >
            <img class="syd-icon" src="@/assets/images/szcg/syd.png" alt="" />
            <div class="syd-text" style="color: white; padding: 10px">
              突出问题管家
            </div>
            <div v-if="zero_selected == true" class="col-line-selected"></div>
          </div>
          <div
            @click="AI_click"
            class="AI"
            style="height: 10vh; margin-right: 5vw"
          >
            <img class="ai-icon" src="@/assets/images/szcg/ai.png" alt="" />

            <div class="AI-text" style="color: white; padding: 10px">
              城管AI识别管家
            </div>
            <div v-if="one_selected == true" class="col-line-selected"></div>
          </div>
          <div
            @click="syd_click"
            class="syd"
            style="height: 10vh; margin-right: 5vw"
          >
            <img class="syd-icon" src="@/assets/images/szcg/syd.png" alt="" />
            <div class="syd-text" style="color: white; padding: 10px">
              网络理政管家
            </div>
            <div v-if="two_selected == true" class="col-line-selected"></div>
          </div>
          <div @click="szcg_click" class="szcg_in" style="height: 10vh">
            <img class="szcg-icon" src="@/assets/images/szcg/szcg.png" alt="" />

            <div class="szcg-text" style="color: white; padding: 10px">
              数字化城市信息管家
            </div>
            <div v-if="three_selected == true" class="col-line-selected"></div>
          </div>
        </div>
        <div class="extra-col-line"></div>
        <div class="info">
          <el-image
            v-if="zero_selected == true"
            class="bg"
            :src="require('@/assets/images/szcg/3.png')"
            alt=""
          ></el-image>
          <el-image
            v-if="one_selected == true"
            class="bg"
            :src="require('@/assets/images/szcg/1.png')"
            alt=""
            fit="cover"
          ></el-image>
          <el-image
            v-if="two_selected == true"
            class="bg"
            :src="require('@/assets/images/szcg/2.png')"
            alt=""
          ></el-image>
          <el-image
            v-if="three_selected == true"
            class="bg"
            :src="require('@/assets/images/szcg/3.png')"
            alt=""
          ></el-image>
        </div>
        <div class="number">
          <el-image
            v-if="zero_selected == true"
            class="number"
            :src="require('@/assets/images/szcg/number1.png')"
            alt=""
            fit="cover"
          >
          </el-image>
          <div
            v-if="zero_selected == true"
            class="text"
            style="color: white; padding: 10px; z-index: 2"
          >
            突出问题管家
          </div>
          <div
            v-if="zero_selected == true"
            class="text"
            style="color: white; padding: 10px; z-index: 2; font-size: 14px"
          >
            Highlight Problem Management System
          </div>
          <el-image
            v-if="one_selected == true"
            class="number"
            style="margin-left: 400px"
            :src="require('@/assets/images/szcg/number2.png')"
            alt=""
            fit="cover"
          >
          </el-image>
          <div
            v-if="one_selected == true"
            class="text"
            style="color: white; padding: 10px; z-index: 2; margin-left: 400px"
          >
            城管AI识别管家
          </div>
          <div
            v-if="one_selected == true"
            class="text"
            style="
              color: white;
              padding: 10px;
              z-index: 2;
              font-size: 14px;
              margin-left: 400px;
            "
          >
            City Administration AI Identification System
          </div>

          <el-image
            v-if="three_selected == true"
            class="number"
            :src="require('@/assets/images/szcg/number4-1.png')"
            alt=""
            style="margin-left: 400px"
          ></el-image>
          <div
            v-if="three_selected == true"
            class="text"
            style="color: white; padding: 10px; z-index: 2; margin-left: 400px"
          >
            数字化城市信息管家
          </div>
          <div
            v-if="three_selected == true"
            class="text"
            style="
              color: white;
              padding: 10px;
              z-index: 2;
              font-size: 14px;
              margin-left: 400px;
            "
          >
            Digital City Management Information System
          </div>

          <el-image
            v-if="two_selected == true"
            class="number"
            :src="require('@/assets/images/szcg/number3.png')"
            style="margin-left: 400px"
            fit="cover"
            alt=""
          ></el-image>
          <div
            v-if="two_selected == true"
            class="text"
            style="color: white; margin-left: 400px; padding: 10px; z-index: 2"
          >
            网络理政管家
          </div>
          <div
            v-if="two_selected == true"
            class="text"
            style="
              color: white;
              padding: 10px;
              z-index: 2;
              font-size: 14px;
              margin-left: 400px;
            "
          >
            City Management Suggestion Platform
          </div>

          <div
            class="info-list"
            v-show="zero_selected == true"
            style="
              color: white;
              margin-left: 150px;
              width: 300px;
              padding: 14px;
              line-height: 30px;
            "
          >
            <div
              id="container"
              style="width: 800px; height: 400px; float: left"
            ></div>
          </div>

          <div
            class="info-list"
            v-if="one_selected == true"
            style="
              color: white;
              margin-right: 50px;
              width: 1350px;
              padding: 14px;
              line-height: 30px;
              display: flex;
            "
          >
            <div>
              <li>今日发现案件数:{{ ai_info.case_today }}；</li>
              <li>今日应处置案件数:{{ ai_info.case_today_need }}；</li>
              <li>今日已处置案件数:{{ ai_info.case_end }} ；</li>
              <li>未处置案件数:{{ ai_info.case_no }}；</li>
              <li>本月超期处置案件数:{{ ai_info.case_out }}</li>
            </div>
            <el-table
              :data="tcwtTableData"
              stripe
              style="width: 1050px; margin-left: 25px"
              max-height="300"
              :header-cell-style="{
                'font-size': '18px',
                background: '#303133 !important',
                color: '#ffffff',
                border: 'none !important',
              }"
              :cell-style="changeCellStyle"
            >
              <el-table-column prop="event_name" label="事件名称" width="150" />
              <el-table-column
                prop="modify_time"
                label="确认时间"
                width="220"
              />
              <el-table-column
                prop="description"
                label="问题描述"
                width="150"
              />
              <el-table-column
                prop="create_time"
                label="创建时间"
                width="220"
              />
              <el-table-column prop="creator" label="创建者" width="180" />
              <el-table-column prop="tags" label="标签" />
            </el-table>
          </div>
          <div
            class="info-list"
            v-show="three_selected == true"
            style="
              color: white;
              margin-left: 350px;
              width: 600px;
              padding: 14px;
              line-height: 26px;
            "
          >
            <div
              id="container2"
              style="width: 1000px; height: 400px; float: left"
            ></div>
            <!-- <template v-for="tableItem in szcg_statics">
              <el-table
                :data="tableItem.data"
                class="table"
                :fit="false"
                :row-style="{ height: '80px' }"
                :cell-style="cellstyle"
                max-height="200"
              >
                <el-table-column
                  v-for="i in tableItem.headerNames.length"
                  :label="tableItem.headerNames[i - 1]"
                  :prop="tableItem.dataNames[i - 1]"
                  width="150"
                />
              </el-table>
            </template> -->
          </div>

          <div
            v-show="two_selected == true"
            id="container_syd2"
            style="
              width: 500px;
              height: 300px;
              float: right;
              margin-left: 450px;
            "
          ></div>
        </div>
      </el-main>
      <el-image
        class="banner"
        :src="require('@/assets/home/banner.jpg')"
        style=""
      >
      </el-image>
    </el-container>
    <!-- 底部信息栏 -->
    <!-- <el-container>
      <el-footer class="footer">
        <div class="foot-info">
          
          <li>Copyright 2022 http://zhxzzfj.XXXX.gov.cn All Rights Reserved</li>
          <li>川公网安备 XXXXXXXXXXX号 ICP备案：蜀ICP备XXXXXXXX号 网站标识码：XXXXXXXXXX</li>
          <li>主办：成都市金牛区综合行政执法局 地址：金牛区某街道某门牌号　电话：XXXX-XXXXXX</li>
        </div>
      </el-footer>
    </el-container> -->
  </el-container>
</template>

<script setup>
import "element-plus/theme-chalk/display.css";
import { ArrowDown } from "@element-plus/icons-vue";
import {
  ref,
  reactive,
  computed,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import MainInfo from "@/views/home/components/MainInfo.vue";
import ClassItem from "@/views/home/components/ClassItem.vue";
import Header from "@/components/Header.vue";
import { get, getDeptList, getSystemList } from "@/api/home.js";
import { getMainSzcg, getCase, getStatics } from "@/api/szcg.js";
import { getToken, getMainSyd } from "@/api/syd";
import { params } from "@/store/store.js";
import { getMainTcwt, getAllEvents, getTrend } from "@/api/tcwt";
import { getRdfx } from "@/api/szcg.js";
import * as echarts from "echarts";
import { useStore } from "vuex";
const store = useStore();

import { getMainAI } from "@/api/ai";
import { getAiUrl } from "@/api/ai";
import axios from "axios";
import moment from "moment";
const syd = reactive({ url: "" });
const token = ref("");
const sydUrl = ref(
  "https://www.jncgsqbl.com/namespaces/1/categories/1?_user_login_token="
);
const aiUrl = ref("");
const imgVisible = ref(true);
const tcwtTableData = ref([]);
const syd_data = ref([]);
let myChart_syd2 = null;
let myChart2 = null;

const echartInit = () => {
  document.getElementById("container2").removeAttribute("_echarts_instance_");

  myChart2 = echarts.init(document.getElementById("container2"));

  getRdfx().then((data) => {
    var option2 = {
      title: {
        text: "热点分析",
        textStyle: {
          color: "white",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["立案", "结案"],
        textStyle: {
          color: "white",
        },
      },
      // toolbox: {
      //   show: true,
      //   feature: {
      //     dataView: { show: true, readOnly: false },
      //     magicType: { show: true, type: ["line", "bar"] },
      //     restore: { show: true },
      //     saveAsImage: { show: true },
      //   },
      // },
      calculable: true,
      xAxis: [
        {
          type: "category",

          axisLabel: {
            //x轴文字的配置
            show: true,
            interval: 0, //使x轴文字显示全
            rotate: 20,
            textStyle: {
              color: "white", //更改坐标轴文字颜色
              fontSize: 14, //更改坐标轴文字大小
            },
          },
          // prettier-ignore
          data: [data[0].sub_type_name, data[1].sub_type_name, data[2].sub_type_name, data[3].sub_type_name, data[4].sub_type_name, data[5].sub_type_name, data[6].sub_type_name, data[7].sub_type_name, data[8].sub_type_name,],
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            //x轴文字的配置
            show: true,
            textStyle: {
              color: "white", //更改坐标轴文字颜色
              fontSize: 14, //更改坐标轴文字大小
            },
          },
        },
      ],
      series: [
        {
          name: "立案",
          type: "bar",
          data: [
            data[0].inst_num,
            data[1].inst_num,
            data[2].inst_num,
            data[3].inst_num,
            data[4].inst_num,
            data[5].inst_num,
            data[6].inst_num,
            data[7].inst_num,
            data[8].inst_num,
          ],
        },
        {
          name: "结案",
          type: "bar",
          data: [
            data[0].archive_num,
            data[1].archive_num,
            data[2].archive_num,
            data[3].archive_num,
            data[4].archive_num,
            data[5].archive_num,
            data[6].archive_num,
            data[7].archive_num,
            data[8].archive_num,
          ],
        },
      ],
    };
    myChart2.setOption(option2);
  });
};
const echartInit_syd = () => {
  myChart_syd2 = echarts.init(document.getElementById("container_syd2"));
  var option_syd2 = {
    title: {
      text: "工单分析月统计",
      textStyle: {
        color: "#ccc",
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
      textStyle: {
        color: "white",
      },
    },
    series: [
      {
        name: "工单",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 35,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: syd_data.value[1].infoVal, name: "本月工单完成量" },
          {
            value: syd_data.value[3].infoVal - syd_data.value[1].infoVal,
            name: "本月工单待完成量",
          },
          // { value: 580, name: 'Email' },
          // { value: 484, name: 'Union Ads' },
          // { value: 300, name: 'Video Ads' }
        ],
      },
    ],
  };
  myChart_syd2.setOption(option_syd2);
};
let myChart = null;
function echartInit_tcwt() {
  myChart = echarts.init(document.getElementById("container"));
  getTrend().then((data) => {
    var option = {
      title: {
        text: "事件趋势分析",
        textStyle: {
          color: "white",
        },
      },
      grid: {
        left: "3%", // 调整左边距
        right: "4%", // 调整右边距
        bottom: "3%", // 调整底边距
        containLabel: true, // 自动计算标签大小
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: {
          color: "white",
        },
      },
      //这里的yAxis就是竖轴，xAxis就是横轴
      // yAxis and xAxis 交换可以改变横向或竖向
      yAxis: {
        axisLabel: {
          show: true,
          textStyle: {
            color: "white", //更改坐标轴文字颜色
            fontSize: 14, //更改坐标轴文字大小
          },
        },
        data: data.map((item) => item.type),
      },
      xAxis: {
        axisLabel: {
          show: true,
          textStyle: {
            color: "white", //更改坐标轴文字颜色
            fontSize: 14, //更改坐标轴文字大小
          },
        },
      },
      // 数据的来源
      series: [
        {
          name: "事件",
          // bar就是柱状图
          type: "bar",
          color: "#dd6b66",
          textStyle: {
            color: "white",
          },
          // 数据
          data: data.map((item) => item.lian_value),
        },
      ],
    };
    myChart.setOption(option);
  });
}
//用户信息
let zero_selected = ref(false);

let one_selected = ref(true);
let two_selected = ref(false);
let three_selected = ref(false);
function changeCellStyle(row) {
  // 可自行输出row查看样式
  const styleObject = {
    background: "#303133 !important",
    color: "#ffffff",
    "font-size": "18px",
  };
  return styleObject;
}
function cellStyle(row) {
  // 可自行输出row查看样式
  const styleObject = {
    background: "#303133 !important",
    color: "#ffffff",
    "font-size": "18px",
  };
  return styleObject;
}
const user = reactive({
  username: "张三",
  role: "管理员",
});
//日期 周
let date = new Date().toLocaleDateString();
var a = new Array("日", "一", "二", "三", "四", "五", "六");
var str = new Date().getDay();
var week = "星期" + a[str];
function toSystem(item) {
  router.push({ name: item.to, params: item.systemName });
}
var time = new Date().getTime();
//setInterval(refreshSydToken, 1000 * 61)
// const today =
//     new Date().getFullYear() +
//     "-" +
//     (new Date().getMonth() + 1) +
//     "-" +
//     new Date().getDate();
// const tomorrow =
//     new Date(time + 1 * 24 * 60 * 60 * 1000).getFullYear() +
//     "-" +
//     (new Date(time + 1 * 24 * 60 * 60 * 1000).getMonth() + 1) +
//     "-" +
//     new Date(time + 1 * 24 * 60 * 60 * 1000).getDate();
const today = moment().format("YYYY-MM-DD");
const tomorrow = moment().add(+1, "d").format("YYYY-MM-DD");
// console.log(momentToday+" "+momentTomorrow)
const szcg_info = reactive({
  case: "",
  case_end: "",
  rate: "",
  question: "",
});
const tcwt_info = reactive({
  case: "",
  case_end: "",
  case_need: "",
  out_date: "",
  case_today: "",
});
const ai_info = reactive({
  case_today: "",
  case_today_need: "",
  case_end: "",
  case_out: "",
});

const syd_case_today = ref(0);
const syd_case_month = ref(0);
const syd_case_end_today = ref(0);
const syd_case_end_month = ref(0);

function tcwt_click() {
  one_selected.value = false;
  two_selected.value = false;
  three_selected.value = false;
  zero_selected.value = true;
}
function AI_click() {
  zero_selected.value = false;
  one_selected.value = true;
  two_selected.value = false;
  three_selected.value = false;
}
function szcg_click() {
  zero_selected.value = false;
  one_selected.value = false;
  three_selected.value = true;
  two_selected.value = false;
}
function syd_click() {
  zero_selected.value = false;
  one_selected.value = false;
  two_selected.value = true;
  three_selected.value = false;
}
const szcg_statics = ref([]);
//部门列表, 从后端获取
const depts = ref([]);
onBeforeUnmount(() => {
  if (myChart) {
    window.removeEventListener("resize", myChart);
    myChart.dispose();
    myChart = null;
  }
  if (myChart_syd2) {
    window.removeEventListener("resize", myChart_syd2);
    myChart_syd2.dispose();
    myChart_syd2 = null;
  }

  if (myChart2) {
    window.removeEventListener("resize", myChart2);
    myChart2.dispose();
    myChart2 = null;
  }
});
onBeforeMount(() => {
  getDeptList().then((response) => {
    depts.value = response;
  });

  getMainSzcg().then((data) => {
    szcg_info.case = data[0].infoVal;
    szcg_info.case_end = data[1].infoVal;
    szcg_info.rate = data[2].infoVal;
    szcg_info.question = data[3].infoVal;
  });

  getMainTcwt().then((data) => {
    tcwt_info.case = data[0].infoVal;
    tcwt_info.case_end = data[1].infoVal;
    tcwt_info.case_need = data[2].infoVal;
    tcwt_info.out_date = data[3].infoVal;
    tcwt_info.case_today = data[3].infoVal;
  });
  getMainAI().then((data) => {
    ai_info.case_today = data[0].infoVal;
    ai_info.case_today_need = data[1].infoVal;
    ai_info.case_end = data[2].infoVal;
    ai_info.case_no = data[3].infoVal;
    ai_info.case_out = data[4].infoVal;
  });
  // getStatics().then((data) => {
  //   szcg_statics.value = data;
  // });
  getMainSyd().then((data) => {
    syd_data.value = data;
    console.log(data[0].infoVal);
    syd_case_today.value = data[0].infoVal;
    syd_case_month.value = data[1].infoVal;
    syd_case_end_today.value = data[2].infoVal;
    syd_case_end_month.value = data[3].infoVal;
    echartInit_syd();
  });

  getAllEvents(today, tomorrow).then((data) => {
    tcwtTableData.value = data;
  });
});

// 系统列表
const systems = ref([]);
onMounted(() => {
  getSystemList().then((data) => {
    systems.value = data;
    console.log(data);
    // 请求各个子系统要显示的数据
    systems.value.forEach((system) => {
      if (system.api !== "") {
        //get(system.api).then(data => system.data = data)
      }
    });
  });
  echartInit_tcwt();
  tcwt_click();
  echartInit();
});

//选中的部门
// -1表示全选，为默认值
const choosedDept = ref(3);
const choosedDeptName = ref();
//选中部门对应的子系统
const choosedSystems = computed(() => {
  //过滤函数
  let filterFun = (system) => {
    // 只显示选中部门的子系统
    return system.deptId === choosedDept.value;
  };
  //显示所有部门的子系统
  if (choosedDept.value === -1) {
    filterFun = () => true;
  }

  return systems.value.filter(filterFun);
  // .filter(system => {
  //   console.log(system)
  //   // 只显示有数据的子系统
  //   return system.data && system.data.length != 0
  // })
});

// 切换显示部门和子系统
const showDepts = ref(false);
function switchShowDepts(deptId, deptName) {
  router.push("dept" + deptId);
  // choosedDept.value = deptId
  // showDepts.value = !showDepts.value
  // choosedDeptName.value = deptName
  // if (deptId != 1) {
  //   imgVisible.value = false
  // }
  // if (deptId == -1) {
  //   imgVisible.value = true

  // }
}

const router = useRouter();
const systemPermisson = reactive([]);
const selfSystemPermisson = () => {
  axios({
    url: "/api/auth/self_role_list",
    method: "get",
    headers: {
      Authorization: "Bearer " + params.token,
    },
  }).then(function (resp) {
    var data = resp.data;
    for (var index in data) {
      // console.log("姓名：" + data[index].realName);
      var roleList = data[index].roleList;
      for (var key in roleList) {
        console.log("子系统" + roleList[key].system);
        if (roleList[key].system == "all") {
          // systemPermisson.value = ["共享单车管家", "垃圾数据归集管家", "城管AI识别管家", "网络理政管家", "广告招牌二维码管", "扬尘治理大数据协同管家", "数字化城市信息管家", "景观照明集中控制管家", "智慧公厕管家", "突出问题管家", "调度指挥管家", "垃圾全生命周期管家", "餐饮油烟管家"];
          systemPermisson.push("共享单车管家");
          systemPermisson.push("智慧公厕管家");
          systemPermisson.push("城管AI识别管家");
          systemPermisson.push("网络理政管家");
          systemPermisson.push("临街店铺管家");
          systemPermisson.push("扬尘治理大数据协同管家");
          systemPermisson.push("数字化城市信息管家");
          systemPermisson.push("景观照明管家");
          systemPermisson.push("生活垃圾转运处理管家");
          systemPermisson.push("调度指挥管家");
          systemPermisson.push("垃圾全生命周期管家");
          systemPermisson.push("餐饮油烟管家");
          systemPermisson.push("环卫作业运行管家");
          systemPermisson.push("突出问题管家");

          break;
        }
        if (roleList[key].system == "景观照明集中控制管家") {
          systemPermisson.push("景观照明管家");
        } else if (roleList[key].system == "垃圾全生命周期管家") {
          systemPermisson.push("垃圾全生命周期管家");
        } else if (roleList[key].system == "智慧公厕管家") {
          systemPermisson.push("智慧公厕管家");
        } else if (roleList[key].system == "垃圾数据归集管家") {
          systemPermisson.push("生活垃圾转运处理管家");
        } else if (roleList[key].system == "广告招牌二维码管家") {
          systemPermisson.push("临街店铺管家");
        } else if (roleList[key].system == "环卫作业管家") {
          systemPermisson.push("环卫作业运行管家");
        } else if (roleList[key].system == "突出问题管家") {
          systemPermisson.push("突出问题管家");
        } else {
          systemPermisson.push(roleList[key].system);
        }
      }
    }
    console.log("所有的" + systemPermisson.value);
  });
};
selfSystemPermisson();
// 跳转到to指定的子系统汇总页面
function show(system, id, url) {
  var permission = ref(false);
  for (var i in systemPermisson) {
    if (system.systemName == systemPermisson[i]) {
      permission.value = true;
      break;
    }
  }
  if (permission.value == true) {
    if (url === "") {
      ElMessage({
        showClose: true,
        message: "正在开发中...",
      });
    } else {
      // router.push({ name: to, params: { subsysName } })
      if (id != "16" && id != "17" && id != "4") window.open(url);
      else if (id == "16")
        getToken().then((data) => {
          token.value = data;
          var sydUrl = "https://119.4.191.13:9580/#/login?token=";
          sydUrl = sydUrl + token.value;
          syd.url = sydUrl;
          console.log(syd.url);
          window.open(syd.url);
        });
      else if (id == "17" || id == "4") {
        getAiUrl().then((data) => {
          aiUrl.value = data.message;
          console.log(data, aiUrl);
          window.open(aiUrl.value);
        });
      }
      uploadClickLog(system.systemName);
    }
  } else {
    ElMessage.error("对不起，你无权访问系统！");
  }
}
function toMap() {
  router.push("/map");
}
function logout() {
  store.dispatch("logout");
  //TODO 清除登录信息
  router.push("/login");
}
function backtoHome() {
  router.push("/home");
}
</script>

<style scoped>
.text {
  margin-top: -20px;
  margin-left: 150px;
  font-size: 24px;
}

.number {
  z-index: 2;
  margin-top: -45vh;
  margin-left: 180px;
  padding: 10px;
}

.col-line-selected {
  width: 140px;
  position: absolute;
  background: #1677d9;
  height: 4px;
  margin-top: 29px;
  padding: 2px;
}

.col-line {
  width: 1000px;
  height: 2px;
  background: #cccccc;
  position: absolute;
}

.extra-col-line {
  width: 80vw;
  height: 2px;
  background: #cccccc;
  position: absolute;
  margin-top: 130px;
}

.bg {
  width: 80vw;
  text-align: center;
  margin-left: 1vw;
  padding: 5px;
  z-index: 1;
}

.szcg {
  /* 
    height:760px;
    width: 100%;
    background-size: 100%;
     background-image: url('@/assets/images/szcg/background.png'); 
    opacity: 0.9;
     */
  height: 10vh;
  display: flex;
  text-align: center;
}

.jgzmInfo {
  height: 30vh;
  width: 100vh;
  height: auto;
  margin-left: 5%;
  display: flex;
  padding: 5px;
  color: black;
}

.szcgInfo {
  height: 600px;
  width: 400px;
  height: auto;
  margin-left: 5%;
  padding: 5px;
  color: white;
}

.classification-title {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  /*当屏幕尺寸变小时，各个子系统汇总模块自动换行*/
  font-size: 30px;
  color: #1677d9;
}

.banner {
  width: 100%;
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
  font-size: large;
  color: #fff;
  line-height: 60px;
  width: 30%;
  padding: 5px;
}

.text-logo {
  margin-left: 20px;
  font-size: large;
  color: #fff;
  line-height: 60px;
  width: 30%;
  padding: 5px;
}

.buttonToMap {
  font-size: large;
  color: #fff;
}

.el-dropdown-link {
  font-size: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  color: #004b8c;
}

.navHeader {
  background-color: #fff;
  color: #004b8c;
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
  float: right;
  margin-left: 5%;
}

.main {
  display: flex;
  flex-wrap: wrap;
  /*当屏幕尺寸变小时，各个子系统汇总模块自动换行*/
  justify-content: center;
  background-image: url("@/assets/images/szcg/background.png");
  background-size: cover;
  height: 80vh;
}

.logo-title {
  margin-left: 40px;
  font-size: large;
  color: #fff;
  line-height: 60px;
  width: 25%;
  padding: 5px;
}

.background {
  display: flex;
  flex-wrap: wrap;
  width: 200;
}

.subdepts {
  padding: 0px;
  font-size: 25px;
  margin-left: -25px;
  margin-top: 50%;
  white-space: nowrap;
  float: left;
  text-decoration: underline;
}

.router {
  padding: 15px;
  font-size: 25px;
  margin-left: 10px;
  margin-top: -3px;
  white-space: nowrap;
  letter-spacing: 3px;
}

.logo-icon {
  margin-top: 25px;
  margin-left: 20px;
}

.footer {
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  line-height: 32px;
  background: #004b8c;
  height: 120px;
}

.foot-info {
  padding: 10px;
}

.el-button-succeed {
  width: 180px;
  flex-wrap: wrap;
  font-size: 20px;
  color: #1677d9;
}

.el-button-null {
  font-size: 20px;
  color: gray;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

#fourTopic {
  width: 25px;
  height: 25px;
  margin-top: -4vh;
  background-color: #11e1b0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  float: right;
}

.dept-item {
  margin-right: 1vw;
}
</style>
