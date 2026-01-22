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
          :src="textLogo"
          fit="scale-down"
        ></el-image>
        <!-- <div class="classification" v-if="showDepts">
          <div v-for="dept in depts" :key="dept.deptId" >
          <class-item
          class="dept-item"
            @click="switchShowDepts(dept.deptId, dept.deptName)"
            :logo="dept.deptLogo"
            :name="dept.deptName"
            styleName="subsysName"
          ></class-item>
          <div id="fourTopic" title="运行正常">
            </div>
        </div>
        </div> -->
        <!-- <div class="subsys" v-if="!showDepts">
            <div class="subdepts">{{choosedDeptName}}</div>
          </div> -->
        <div class="subsys" v-if="!showDepts">
          <div v-for="system in choosedSystems" :key="system.systemId">
            <class-item
              class="dept-item"
              @click="show(system)"
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

      <div class="background" v-if="choosedDept === 0">
        <img
          src="@/assets/home/banner-hjws.png"
          width="10000"
          style="overflow-y: auto; overflow-x: auto"
        />
      </div>

      <!-- 页面显示区域 -->
      <el-main class="main">
        <!-- <div v-if="garbage_classify_detail == true" class="map-page-container">
          <el-amap :center="center" :zoom="zoom" @init="init" />
        </div> -->

        <!-- <div class="classification-title" v-if="choosedDept==-1|choosedDept==0">
            环境卫生
            <main-info v-for="(item, idx) in choosedSystems" :key="idx" :systemName="item.systemName" :url="item.url"
              :logo="item.systemLogo" :info-list="item.data" :image="item.image" :to="item.to" :deptId="item.deptId">
            </main-info>
          </div> -->
        <!-- <el-divider v-if="choosedDept==-1|choosedDept==0" /> -->

        <div class="environment-box">
          <div
            @click="showHwzy"
            :class="
              garbage_classify_detail == false
                ? 'garbage-classify'
                : 'garbage-classify garbage-classify-select'
            "
          >
            <img
              v-if="garbage_classify_detail == false"
              class="garbage-classify-icon"
              src="@/assets/images/environment/garbage-classify-default.png"
              alt=""
            />
            <img
              v-if="garbage_classify_detail == true || garbage_classify_detail"
              class="garbage-classify-icon"
              src="@/assets/images/environment/garbage-classify-selected.png"
              alt=""
            />
            <div
              :class="
                garbage_classify_detail == false
                  ? 'garbage-classify-text'
                  : 'garbage-classify-text garbage-classify-text-select'
              "
            >
              环卫作业运行管家
            </div>
          </div>
          <!-- <div
            @click="showCclj"
            :class="
              garbage_transport_detail == false
                ? 'garbage-transport'
                : 'garbage-transport garbage-transport-select'
            "
          >
            <img
              v-if="garbage_transport_detail == false"
              class="garbage-transport-icon"
              src="@/assets/images/environment/garbage-transport-default.png"
              alt=""
            />
            <img
              v-if="garbage_transport_detail == true"
              class="garbage-transport-icon"
              src="@/assets/images/environment/truck.png"
              alt=""
            />
            <div
              :class="
                garbage_transport_detail == false
                  ? 'garbage-transport-text'
                  : 'garbage-transport-text garbage-transport-text-select'
              "
            >
              餐厨垃圾全生命周期管家管家
            </div>
          </div> -->
          <div
            @click="showLjz"
            :class="
              garbage_compress_detail == false
                ? 'garbage-compress'
                : 'garbage-compress garbage-compress-select'
            "
          >
            <img
              v-if="garbage_compress_detail == false"
              class="garbage-compress-icon"
              src="@/assets/images/environment/garbage-compress-default.png"
              alt=""
            />
            <img
              v-if="garbage_compress_detail == true || garbage_compress_detail"
              class="garbage-compress-icon"
              src="@/assets/images/environment/garbage-compress-selected.png"
              alt=""
            />
            <div
              :class="
                garbage_compress_detail == false
                  ? 'garbage-compress-text'
                  : 'garbage-compress-text garbage-compress-text-select'
              "
            >
              垃圾全生命周期管家
            </div>
          </div>
          <div
            @click="showToilet"
            :class="
              garbage_collect_detail == false
                ? 'garbage-collect'
                : 'garbage-collect garbage-collect-select'
            "
          >
            <img
              v-if="garbage_collect_detail == false"
              class="garbage-collect-icon"
              src="@/assets/images/environment/garbage-collect-default.png"
              alt=""
            />
            <img
              v-if="
                garbage_collect_detail == true || garbage_collect_detail == true
              "
              class="garbage-collect-icon"
              src="@/assets/images/environment/garbage-collect-selected.png"
              alt=""
            />
            <div
              :class="
                garbage_collect_detail == false
                  ? 'garbage-collect-text'
                  : 'garbage-collect-text garbage-collect-text-select'
              "
            >
              智慧公厕管家
            </div>
          </div>

          <div
            :class="
              garbage_classify_selected == true
                ? 'environment-right classify-select'
                : garbage_transport_selected == true
                ? 'environment-right transport-select'
                : garbage_compress_selected == true
                ? 'environment-right compress-select'
                : garbage_collect_selected == true
                ? 'environment-right collect-select'
                : 'environment-right default'
            "
          >
            <div
              v-show="garbage_classify_detail == true"
              id="container_ljz2"
              style="width: 900px; height: 300px"
            ></div>
            <!-- <div v-if="garbage_classify_detail == true" class="classify_detail">
              <el-table
                :data="hwzy_tableData1"
                stripe
                style="width: 100%"
                max-height="300"
              >
                <el-table-column
                  prop="e_alarm_name"
                  label="报警名称"
                  width="180"
                />
                <el-table-column
                  prop="e_alarm_create_time"
                  label="报送时间"
                  width="280"
                />
                <el-table-column
                  prop="e_alarm_sanitation_task_truck"
                  label="处置车辆"
                  width="180"
                />
                <el-table-column prop="e_alarm_from" label="地点" />
              </el-table>
              <div
                v-if="garbage_classify_detail == true"
                class="map-page-container"
                style="height: 400px; width: 900px"
              >
                <el-amap
                  :center="center"
                  :zoom="zoom"
                  scrollWheel="false"
                  @init="init"
                >
                  <el-amap-marker
                    v-for="marker in markers"
                    :position="marker.position"
                    :visible="componentMarker.visible"
                    :content="componentMarker.content"
                    :title="marker.title"
                  >
                    <div
                      style="
                        padding: 5px 10px;
                        white-space: nowrap;
                        background: red;
                        color: #fff;
                      "
                    >
                      {{ marker.title }}
                    </div>
                  </el-amap-marker>
                </el-amap>
              </div>
            </div> -->

            <!-- <div
              v-show="garbage_transport_detail == true"
              class="transport_detail"
            >
              <div
                id="container_cclj"
                style="width: 900px; height: 300px"
              ></div>
              <div
                id="container_cclj1"
                style="width: 900px; height: 300px"
              ></div>
            </div> -->
            <div
              v-show="garbage_compress_detail == true"
              id="container_ljz1"
              style="width: 900px; height: 300px"
            ></div>
            <!-- <div
              v-show="garbage_compress_detail == true"
              id="container_ljz2"
              style="width: 900px; height: 300px"
            ></div> -->
            <div
              v-show="garbage_collect_detail == true"
              id="weekly_chart"
              style="width: 900px; height: 500px"
            ></div>
            <div
              v-if="
                garbage_classify_selected == true ||
                garbage_transport_selected == true ||
                garbage_compress_selected == true ||
                garbage_collect_selected == true
              "
              class="environment-right-content"
              v-for="environment_item in environments"
              :key="environment_item.id"
            >
              <img
                v-if="garbage_classify_selected == true"
                class="content-number-img"
                src="@/assets/images/environment/1.png"
                alt=""
              />
              <img
                v-else-if="garbage_transport_selected == true"
                class="content-number-img"
                src="@/assets/images/environment/2.png"
                alt=""
              />
              <img
                v-else-if="garbage_compress_detail == true"
                class="content-number-img"
                src="@/assets/images/environment/3.png"
                alt=""
              />
              <img
                v-else-if="garbage_collect_selected == true"
                class="content-number-img"
                src="@/assets/images/environment/4.png"
                alt=""
              />
              <!-- <div v-if="garbage_classify_selected == true" class="transport-content-title">{{ environment_item.title }}
              </div>
              <div v-if="garbage_classify_selected == true" class="content-title-en">{{ environment_item.title_en }}
              </div>

              <div v-if="garbage_transport_selected == true" class="transport-content-title">{{ environment_item.title
              }}
              </div>
              <div v-if="garbage_transport_selected == true" class="content-title-en">{{ environment_item.title_en }}
              </div>
              <div v-if="garbage_compress_selected == true" class="transport-content-title">{{ environment_item.title }}
              </div>
              <div v-if="garbage_compress_selected == true" class="content-title-en">{{ environment_item.title_en }}
              </div>
              <div v-if="garbage_collect_selected == true" class="transport-content-title">{{ environment_item.title }}
              </div>
              <div v-if="garbage_collect_selected == true" class="content-title-en">{{ environment_item.title_en }}
              </div> -->

              <div
                v-if="garbage_classify_selected == true"
                class="content-number"
              >
                ①车辆总数: {{ hwzy_car_all }}；②离线车辆:
                {{ hwzy_car_offline }}；②报警车辆:
                {{ hwzy_car_alarm }}；③移动中车辆:
                {{ hwzy_car_moving }};④停止中车辆:: {{ hwzy_car_stop }}
              </div>

              <div
                v-if="garbage_compress_selected == true"
                class="content-number"
              >
                ①金牛区今日垃圾总数:
                {{ environment_item.not_accept }}；②红星垃圾站垃圾总数:
                {{ environment_item.not_processed }}；②红星垃圾站垃圾总数:
                {{ environment_item.processing }}；
              </div>

              <div
                v-else-if="garbage_transport_selected == true"
                class="content-number"
              >
                ①年度收运量累积(吨): {{ ccljData_year }}；②当月收运量累积(吨):
                {{ ccljData_month }}；③当日收运量累积(吨):
                {{ ccljData_day }}；④总收运点位数（个）: {{ ccljData_sites }}
              </div>

              <div
                v-else-if="garbage_collect_selected == true"
                class="content-number"
              >
                ①查询记录总重: {{ shlj_data }}；②垃圾记录总数: {{ shlj_num }}；
              </div>

              <div class="check-details">
                <div v-if="garbage_classify_selected == true" @click="showHwzy">
                  查看详情
                </div>
                <div
                  v-if="garbage_transport_selected == true"
                  @click="showCclj"
                >
                  查看详情
                </div>
                <div v-if="garbage_compress_selected == true" @click="showLjz">
                  查看详情
                </div>
                <div
                  v-if="garbage_collect_selected == true"
                  @click="showToilet"
                >
                  查看详情
                </div>
              </div>
              <img
                class="detail-img"
                src="@/assets/images/environment/more-detail.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <el-image
          class="banner"
          :src="banner"
          style=""
        >
        </el-image>
      </el-main>
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
import { get, getDeptList, getSystemList, uploadClickLog } from "@/api/home.js";
import { getMainGarbage } from "@/api/garbage";
import { getMainCclj} from "@/api/cclj.js";
import { getMainHwzy } from "@/api/hwzy.js";
import { params } from "@/store/store.js";
// import { getCarLists, getAiAlarm } from "@/api/hwzy";
import * as echarts from "echarts";
import {
  getMainLjz,
  getSum,
  getWarning,
  getStations,
  getLifecycle,
} from "@/api/ljz";
import axios from "axios";
import { useStore } from "vuex";
import moment from "moment";

import textLogo from '@/assets/home/logo-title.jpg';
import banner from '@/assets/home/banner.jpg';  

const store = useStore();

const data = ref([]);

const today =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();
const tomorrow =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  (new Date().getDate() + 1);

const imgVisible = ref(true);
//用户信息
const user = reactive({
  username: "张三",
  role: "管理员",
});
//日期 周const zoom = ref(12);
const center = reactive([104.041309, 30.677844]);
let map = null;
const zoom = ref(12);
const init = (e) => {
  // const marker = new AMap.Marker({
  //   position: [104.05740358713781, 30.697356042874134],
  // },
  // );
  // e.add(marker);
  map = e;

  // console.log('map init: ', map)
};
const add = () => {
  const marker = new AMap.Marker({
    position: [121.59996, 31.177646],
  });
  map.add(marker);
};
const componentMarker = reactive({
  position: [121.5273285, 31.21315058],
  visible: true,
  draggable: false,
  content: "hello world",
});
const position1 = reactive([104.05740358713781, 30.747356042874134]);
let date = new Date().toLocaleDateString();
var a = new Array("日", "一", "二", "三", "四", "五", "六");
var str = new Date().getDay();
var week = "星期" + a[str];
const total_hongxing = ref(0);
const total_xihua = ref(0);
const total_jinniu = ref(0);
const ccljData_year = ref(0);
const ccljData_month = ref(0);
const ccljData_day = ref(0);
const ccljData_sites = ref(0);
const shlj_data = ref(0);
const shlj_num = ref(0);
const hwzy_car_all = ref(0);
const hwzy_car_offline = ref(0);
const hwzy_car_alarm = ref(0);
const hwzy_car_moving = ref(0);
const hwzy_car_stop = ref(0);
// const hwzy_tableData1 = ref([]);
const hwzy_tableData = ref([]);
const markers = reactive([]);

function toSystem(item) {
  router.push({ name: item.to, params: item.systemName });
}
//部门列表, 从后端获取
const depts = ref([]);
onBeforeMount(() => {
  getDeptList().then((response) => {
    depts.value = response;
  });
  getMainGarbage().then((data) => {
    total_hongxing.value = data[2].infoVal;
    total_xihua.value = data[1].infoVal;
    total_jinniu.value = data[0].infoVal;
  });
  // getMainShlj().then(data => {
  //   shlj_num.value = data[1].infoVal
  //   shlj_data.value = data[0].infoVal

  // })
  getMainLjz().then((data) => {
    ljz_table1.value = data;
  });
  getStations().then((data) => {
    stations_table.value = data;
    echartInit_ljz();
  });
  getLifecycle().then((data) => {
    lifecycle_table.value = data;
    echartInit_ljz();
  });
  getSum().then((data) => {
    ljz_table2.value = data;
  });
  getMainCclj().then((data) => {
    ccljData_year.value = data[0].infoVal;
    ccljData_month.value = data[1].infoVal;
    ccljData_day.value = data[2].infoVal;
    ccljData_sites.value = data[3].infoVal;
  });
  getMainHwzy().then((data) => {
    hwzy_car_all.value = data[0].infoVal;
    hwzy_car_offline.value = data[1].infoVal;
    hwzy_car_alarm.value = data[2].infoVal;
    hwzy_car_moving.value = data[3].infoVal;
    hwzy_car_stop.value = data[4].infoVal;
  });
  // getAiAlarm().then((data) => {
  //   hwzy_tableData1.value = data;
  //   console.log(hwzy_tableData1.value);
  //   for (let i = 0; i < hwzy_tableData1.value.length; i++) {
  //     const marker = reactive({
  //       position: [
  //         hwzy_tableData1.value[i].e_alarm_wgs84_lng * 1,
  //         hwzy_tableData1.value[i].e_alarm_wgs84_lat * 1,
  //       ],
  //       title:
  //         hwzy_tableData1.value[i].e_alarm_from +
  //         " " +
  //         hwzy_tableData1.value[i].e_alarm_name,
  //     });
  //     markers.push(marker);
  //   }
  // });
  // getCarLists().then((data) => {
  //   hwzy_tableData.value = data;
  // });
});
// 系统列表

const systems = ref([]);
onMounted(() => {
  showHwzy();

  getSystemList().then((data) => {
    systems.value = data;
    // 请求各个子系统要显示的数据
    systems.value.forEach((system) => {
      if (system.api !== "") {
        //get(system.api).then(data => system.data = data)
      }
    });
  });
});
//选中的部门
// -1表示全选，为默认值
const choosedDept = ref(0);
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
  choosedDept.value = deptId;
  showDepts.value = !showDepts.value;
  choosedDeptName.value = deptName;
  if (deptId != 1) {
    imgVisible.value = false;
  }
  if (deptId == -1) {
    imgVisible.value = true;
  }
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
          // systemPermisson.push("生活垃圾转运处理管家");
          systemPermisson.push("调度指挥管家");
          // systemPermisson.push("餐厨垃圾全生命周期管家管家");
          systemPermisson.push("餐饮油烟管家");
          systemPermisson.push("环卫作业运行管家");
          systemPermisson.push("突出问题管家");
          systemPermisson.push("垃圾全生命周期管家");

          break;
        }
        if (roleList[key].system == "景观照明集中控制管家") {
          systemPermisson.push("景观照明管家");
        } else if (roleList[key].system == "垃圾全生命周期管家") {
          systemPermisson.push("垃圾全生命周期管家");
        } else if (roleList[key].system == "智慧公厕管家") {
          systemPermisson.push("智慧公厕管家");
          // } else if (roleList[key].system == "垃圾数据归集管家") {
          //   systemPermisson.push("生活垃圾转运处理管家");
        } else if (roleList[key].system == "广告招牌二维码管家") {
          systemPermisson.push("临街店铺管家");
        } else if (roleList[key].system == "环卫作业管家") {
          systemPermisson.push("环卫作业运行管家");
        } else if (roleList[key].system == "突出问题管家") {
          systemPermisson.push("突出问题管家");
        } else if (roleList[key].system == "垃圾全生命周期管家") {
          systemPermisson.push("垃圾全生命周期管家");
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
function show(item) {
  var permission = ref(false);
  for (var i in systemPermisson) {
    if (item.systemName == systemPermisson[i]) {
      permission.value = true;
      break;
    }
  }
  if (permission.value == true) {
    var realURL = item.url + "?phone=" + params.username;
    console.log("realURL:  " + realURL);
    window.open(realURL);
    uploadClickLog(item.systemName);
  } else {
    ElMessage.error("对不起，你无权访问系统！");
  }

  // if (to === '') {
  //   ll
  //   ElMessage({
  //     showClose: true,
  //     message: '正在开发中...'
  //   })
  // } else {
  //   router.push({ name: to, params: { subsysName } })
  // }
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
let garbage_classify_selected = ref(true);
let garbage_transport_selected = ref(false);
let garbage_compress_selected = ref(false); //
let garbage_collect_selected = ref(false); //智慧公厕管家
let environments = reactive([]);
let garbage_classify = reactive({});
let garbage_transport = reactive({});
let garbage_compress = reactive({});
let garbage_collect = reactive({});
let garbage_classify_detail = ref(false);
let garbage_transport_detail = ref(false);
let garbage_compress_detail = ref(false); //
let garbage_collect_detail = ref(false);
const garbage_classify_click = () => {
  environments.splice(0, environments.length);

  garbage_classify["title"] = "环卫作业运行管家";
  garbage_classify["title_en"] = "Classification Of Domestic Waste";
  garbage_classify["not_accept"] = 23;
  garbage_classify["not_processed"] = 23;
  garbage_classify["processing"] = 23;
  garbage_classify["processed"] = 23;
  garbage_classify["returned"] = 23;

  environments.push(garbage_classify);
  garbage_classify_selected.value = true;
  garbage_transport_selected.value = false;
  garbage_compress_selected.value = false;
  garbage_collect_selected.value = false;
  garbage_classify_detail.value = false;
  garbage_transport_detail.value = false;
  garbage_compress_detail.value = false;
  garbage_collect_detail.value = false;
};

const showHwzy = () => {
  echartInit_ljz();
  garbage_classify_selected.value = false;
  garbage_classify_detail.value = true;
  garbage_transport_detail.value = false;
  garbage_compress_detail.value = false;
  garbage_collect_detail.value = false;
};
const showCclj = () => {
  echartInit_cclj();
  garbage_transport_selected.value = false;
  garbage_classify_detail.value = false;
  garbage_transport_detail.value = true;
  garbage_compress_detail.value = false;
  garbage_collect_detail.value = false;
};
const showLjz = () => {
  echartInit_ljz();

  garbage_compress_selected.value = false;
  garbage_classify_detail.value = false;
  garbage_transport_detail.value = false;
  garbage_compress_detail.value = true;
  garbage_collect_detail.value = false;
};
const showToilet = () => {
  showWeeklyChart();
  garbage_collect_selected.value = false;
  garbage_classify_detail.value = false;
  garbage_transport_detail.value = false;
  garbage_compress_detail.value = false;
  garbage_collect_detail.value = true;
};
const garbage_transport_click = () => {
  environments.splice(0, environments.length);

  garbage_transport["title"] = "餐厨垃圾全生命周期管家管家";
  garbage_transport["title_en"] =
    "Food Waste Collection And Transportation Management";
  garbage_transport["not_accept"] = 123;
  garbage_transport["not_processed"] = 23;
  garbage_transport["processing"] = 23;
  garbage_transport["processed"] = 23;
  garbage_transport["returned"] = 23;

  environments.push(garbage_transport);
  garbage_classify_selected.value = false;
  garbage_transport_selected.value = true;
  garbage_compress_selected.value = false;
  garbage_collect_selected.value = false;
  garbage_classify_detail.value = false;
  garbage_transport_detail.value = false;
  garbage_compress_detail.value = false;
  garbage_collect_detail.value = false;
};

const garbage_compress_click = () => {
  environments.splice(0, environments.length);

  garbage_compress["title"] = "生活垃圾转运处理管家";
  garbage_compress["title_en"] = "Garbage Collection Management";
  garbage_compress["not_accept"] = total_jinniu.value + "吨";
  garbage_compress["not_processed"] = total_hongxing.value + "吨";
  garbage_compress["processing"] = total_xihua.value + "吨";
  garbage_compress["processed"] = 23;
  garbage_compress["returned"] = 23;

  environments.push(garbage_compress);
  garbage_classify_selected.value = false;
  garbage_transport_selected.value = false;
  garbage_compress_selected.value = true;
  garbage_collect_selected.value = false;
  garbage_classify_detail.value = false;
  garbage_transport_detail.value = false;
  garbage_compress_detail.value = false;
  garbage_collect_detail.value = false;
};
const garbage_collect_click = () => {
  environments.splice(0, environments.length);

  garbage_compress["title"] = "智慧公厕管家";
  garbage_compress["title_en"] = "Garbage Collection Management";
  garbage_compress["not_accept"] = total_jinniu.value + "吨";
  garbage_compress["not_processed"] = total_hongxing.value + "吨";
  garbage_compress["processing"] = total_xihua.value + "吨";
  garbage_compress["processed"] = 23;
  garbage_compress["returned"] = 23;

  environments.push(garbage_compress);
  garbage_classify_selected.value = false;
  garbage_transport_selected.value = false;
  garbage_compress_selected.value = false;
  garbage_collect_selected.value = true;
  garbage_classify_detail.value = false;
  garbage_transport_detail.value = false;
  garbage_compress_detail.value = false;
  garbage_collect_detail.value = false;
};
const cclj_sites = ref([]);
let myChart_cclj = null;
let myChart_cclj1 = null;
const echartInit_cclj = () => {
  //document.getElementById("container_cclj").removeAttribute("_echarts_instance_");
  myChart_cclj = echarts.init(document.getElementById("container_cclj"));
  //document.getElementById("container_cclj1").removeAttribute("_echarts_instance_");
  myChart_cclj1 = echarts.init(document.getElementById("container_cclj1"));
  var option = {
    title: {
      text: "收运点位统计",
      textStyle: {
        color: "black",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      axisLabel: {
        //x轴文字的配置
        show: true,
        interval: 0, //使x轴文字显示全
        rotate: 20,
      },
      data: [
        cclj_sites.value[0].street,
        cclj_sites.value[1].street,
        cclj_sites.value[2].street,
        cclj_sites.value[3].street,
        cclj_sites.value[4].street,
        cclj_sites.value[5].street,
        cclj_sites.value[6].street,
        cclj_sites.value[7].street,
        cclj_sites.value[8].street,
        cclj_sites.value[9].street,
        cclj_sites.value[10].street,
        cclj_sites.value[11].street,
        cclj_sites.value[12].street,
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [
          cclj_sites.value[0].street_site_num,
          cclj_sites.value[1].street_site_num,
          cclj_sites.value[2].street_site_num,
          cclj_sites.value[3].street_site_num,
          cclj_sites.value[4].street_site_num,
          cclj_sites.value[5].street_site_num,
          cclj_sites.value[6].street_site_num,
          cclj_sites.value[7].street_site_num,
          cclj_sites.value[8].street_site_num,
          cclj_sites.value[9].street_site_num,
          cclj_sites.value[10].street_site_num,
          cclj_sites.value[11].street_site_num,
          cclj_sites.value[12].street_site_num,
        ],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };
  var option1 = {
    title: {
      text: "收运点位统计",
      left: "center",
      textStyle: {
        color: "black",
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "black",
      },
    },
    series: [
      {
        name: "街道点位统计",
        type: "pie",
        radius: "50%",
        data: [
          {
            value: cclj_sites.value[0].street_site_num,
            name: cclj_sites.value[0].street,
          },
          {
            value: cclj_sites.value[1].street_site_num,
            name: cclj_sites.value[1].street,
          },
          {
            value: cclj_sites.value[2].street_site_num,
            name: cclj_sites.value[2].street,
          },
          {
            value: cclj_sites.value[3].street_site_num,
            name: cclj_sites.value[3].street,
          },
          {
            value: cclj_sites.value[4].street_site_num,
            name: cclj_sites.value[4].street,
          },
          {
            value: cclj_sites.value[5].street_site_num,
            name: cclj_sites.value[5].street,
          },
          {
            value: cclj_sites.value[6].street_site_num,
            name: cclj_sites.value[6].street,
          },
          {
            value: cclj_sites.value[7].street_site_num,
            name: cclj_sites.value[7].street,
          },
          {
            value: cclj_sites.value[8].street_site_num,
            name: cclj_sites.value[8].street,
          },
          {
            value: cclj_sites.value[9].street_site_num,
            name: cclj_sites.value[9].street,
          },
          {
            value: cclj_sites.value[10].street_site_num,
            name: cclj_sites.value[10].street,
          },
          {
            value: cclj_sites.value[11].street_site_num,
            name: cclj_sites.value[11].street,
          },
          {
            value: cclj_sites.value[12].street_site_num,
            name: cclj_sites.value[12].street,
          },
        ],
        label: {
          show: true,
          formatter(param) {
            // correct the percentage
            return param.name + " (" + param.percent + "%)";
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  myChart_cclj.setOption(option);
  myChart_cclj1.setOption(option1);
};

const ljz_table1 = ref([]); //垃圾站
const ljz_table2 = ref([]); //垃圾站
const stations_table = ref([]); //道路告警
const lifecycle_table = ref([]); //车辆和重量告警
let myChart_ljz1 = null;
let myChart_ljz2 = null;
// let myChart_stations = null;
// let myChart_lifecycle = null;
//客流量趋势
var weeklyChart = null;
const echartInit_ljz = () => {
  document
    .getElementById("container_ljz1")
    .removeAttribute("_echarts_instance_");
  myChart_ljz1 = echarts.init(document.getElementById("container_ljz1"));
  document
    .getElementById("container_ljz2")
    .removeAttribute("_echarts_instance_");
  myChart_ljz2 = echarts.init(document.getElementById("container_ljz2"));

  var option1 = {
    title: {
      text: "车辆统计",
      left: "center",
      textStyle: {
        color: "black",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        // 在 tooltip 中添加多行文本，包括标题和数值
        return "车辆统计 <br>" + params.name + "   " + params.value + "辆";
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "black",
      },
    },
    series: [
      {
        name: "车辆统计",
        type: "pie",
        radius: "50%",
        data: [
          {
            value:
              lifecycle_table.value.total_lifecycle_truck -
              lifecycle_table.value.always_offline_lifecycle_truck -
              lifecycle_table.value.offwork_lifecycle_truck_today,
            name: "今日出勤车辆数",
          },
          {
            value: lifecycle_table.value.always_offline_lifecycle_truck,
            name: "长期不在线数",
          },
          {
            value: lifecycle_table.value.offwork_lifecycle_truck_today,
            name: "今日未出勤车辆数",
          },
          // { value: 111, name: 222 },
          // { value: 111, name: 222 },
        ],
        label: {
          show: true,
          formatter(param) {
            // correct the percentage
            return param.name + " (" + param.percent + "%)";
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  var option2 = {
    title: {
      text: "道路统计",
      left: "center",
      textStyle: {
        color: "black",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        // 在 tooltip 中添加多行文本，包括标题和数值
        return "道路统计 <br>" + params.name + "   " + params.value;
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "black",
      },
    },
    series: [
      {
        name: "道路统计",
        type: "pie",
        radius: "50%",
        data: [
          {
            value:
              stations_table.value.monitor_roads -
              stations_table.value.unwork_roads,
            name: "今日已作业道路数",
          },
          {
            value: stations_table.value.unwork_roads,
            name: "今日未作业道路数",
          },
          {
            value: stations_table.value.unmonitor_roads,
            name: "未监测道路数",
          },
          // { value: 111, name: 222 },
          // { value: 111, name: 222 },
        ],
        label: {
          show: true,
          formatter(param) {
            // correct the percentage
            return param.name + " (" + param.percent + "%)";
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  myChart_ljz1.setOption(option1);
  myChart_ljz2.setOption(option2);
  // var option1 = {
  //   title: {
  //     text: "道路统计",
  //     left: "center",
  //     textStyle: {
  //       color: "black",
  //     },
  //   },
  //   tooltip: {
  //     trigger: "item",
  //     formatter: function (params) {
  //       // 在 tooltip 中添加多行文本，包括标题和数值
  //       return "道路统计 <br>" + params.name + "   " + params.value + "吨";
  //     },
  //   },
  //   legend: {
  //     orient: "vertical",
  //     left: "left",
  //     textStyle: {
  //       color: "black",
  //     },
  //   },
  //   series: [
  //     {
  //       name: "道路统计",
  //       type: "pie",
  //       radius: "50%",
  //       data: [
  //         {
  //           value: stations_table.value.monitor_roads - stations_table.value.unwork_roads,
  //           name: "今日已作业道路数",
  //         },
  //         {
  //           value: stations_table.value.unwork_roads,
  //           name: "今日未作业道路数",
  //         },
  //         {
  //           value: stations_table.value.unmonitor_roads,
  //           name: "未监测道路数",
  //         },
  //         // { value: 111, name: 222 },
  //         // { value: 111, name: 222 },
  //       ],
  //       label: {
  //         show: true,
  //         formatter(param) {
  //           // correct the percentage
  //           return param.name + " (" + param.percent + "%)";
  //         },
  //       },
  //       emphasis: {
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowOffsetX: 0,
  //           shadowColor: "rgba(0, 0, 0, 0.5)",
  //         },
  //       },
  //     },
  //   ],
  // };

  // document
  //   .getElementById("container_ljz1")
  //   .removeAttribute("_echarts_instance_");
  // myChart_ljz1 = echarts.init(document.getElementById("container_ljz1"));
  // document
  //   .getElementById("container_ljz2")
  //   .removeAttribute("_echarts_instance_");
  // myChart_ljz2 = echarts.init(document.getElementById("container_ljz2"));
  // var option1 = {
  //   title: {
  //     text: "垃圾分布统计",
  //     left: "center",
  //     textStyle: {
  //       color: "black",
  //     },
  //   },
  //   tooltip: {
  //     trigger: "item",
  //     formatter: function (params) {
  //       // 在 tooltip 中添加多行文本，包括标题和数值
  //       return "垃圾分布统计 <br>" + params.name + "   " + params.value + "吨";
  //     },
  //   },
  //   legend: {
  //     orient: "vertical",
  //     left: "left",
  //     textStyle: {
  //       color: "black",
  //     },
  //   },
  //   series: [
  //     {
  //       name: "垃圾分布统计",
  //       type: "pie",
  //       radius: "50%",
  //       data: [
  //         {
  //           value: ljz_table1.value[1].infoVal.slice(0, -2),
  //           name: ljz_table1.value[1].infoKey.slice(0, -2),
  //         },
  //         {
  //           value: ljz_table1.value[2].infoVal.slice(0, -2),
  //           name: ljz_table1.value[2].infoKey.slice(0, -2),
  //         },
  //         // { value: 111, name: 222 },
  //         // { value: 111, name: 222 },
  //       ],
  //       label: {
  //         show: true,
  //         formatter(param) {
  //           // correct the percentage
  //           return param.name + " (" + param.percent + "%)";
  //         },
  //       },
  //       emphasis: {
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowOffsetX: 0,
  //           shadowColor: "rgba(0, 0, 0, 0.5)",
  //         },
  //       },
  //     },
  //   ],
  // };
  // var option2 = {
  //   title: {
  //     text: "垃圾统计",
  //     textStyle: {
  //       color: "black",
  //     },
  //   },
  //   tooltip: {
  //     trigger: "axis",
  //     axisPointer: {
  //       type: "shadow",
  //     },
  //     formatter: function (params) {
  //       // 获取横坐标的内容
  //       let xAxisLabel = params[0].axisValue;

  //       // 获取数据项的数值
  //       let dataValue = params[0].value;
  //       let dataValue1 = params[1].value;

  //       // 构建 tooltip 内容并换行显示
  //       return (
  //         xAxisLabel +
  //         "<br>西华站 " +
  //         dataValue1 +
  //         "吨" +
  //         "<br>红星站 " +
  //         dataValue +
  //         "吨"
  //       );
  //     },
  //   },
  //   legend: {
  //     textStyle: {
  //       color: "black",
  //     },
  //   },
  //   grid: {
  //     left: "3%",
  //     right: "4%",
  //     bottom: "3%",
  //     containLabel: true,
  //     textStyle: {
  //       color: "white",
  //     },
  //   },
  //   xAxis: [
  //     {
  //       type: "category",
  //       data: [
  //         "一月",
  //         "二月",
  //         "三月",
  //         "四月",
  //         "五月",
  //         "六月",
  //         "七月",
  //         "八月",
  //         "九月",
  //         "十月",
  //         "十一月",
  //         "十二月",
  //       ],
  //     },
  //   ],
  //   yAxis: [
  //     {
  //       type: "value",
  //       axisLabel: {
  //         formatter: "{value} 吨",
  //       },
  //     },
  //   ],
  //   series: [
  //     {
  //       name: "红星站",
  //       type: "bar",
  //       stack: "Ad",
  //       label: {
  //         show: true,
  //       },
  //       emphasis: {
  //         focus: "series",
  //       },
  //       textStyle: {
  //         color: "white",
  //       },
  //       data: [
  //         ljz_table2.value[3][0],
  //         ljz_table2.value[3][1],
  //         ljz_table2.value[3][2],
  //         ljz_table2.value[3][3],
  //         ljz_table2.value[3][4],
  //         ljz_table2.value[3][5],
  //         ljz_table2.value[3][6],
  //         ljz_table2.value[3][7],
  //         ljz_table2.value[3][8],
  //         ljz_table2.value[3][9],
  //         ljz_table2.value[3][10],
  //         ljz_table2.value[3][11],
  //       ],
  //     },
  //     {
  //       name: "西华站",
  //       type: "bar",
  //       stack: "Ad",
  //       label: {
  //         show: true,
  //       },
  //       emphasis: {
  //         focus: "series",
  //       },
  //       textStyle: {
  //         color: "white",
  //       },
  //       data: [
  //         ljz_table2.value[4][0],
  //         ljz_table2.value[4][1],
  //         ljz_table2.value[4][2],
  //         ljz_table2.value[4][3],
  //         ljz_table2.value[4][4],
  //         ljz_table2.value[4][5],
  //         ljz_table2.value[4][6],
  //         ljz_table2.value[4][7],
  //         ljz_table2.value[4][8],
  //         ljz_table2.value[4][9],
  //         ljz_table2.value[4][10],
  //         ljz_table2.value[4][11],
  //       ],
  //     },
  //   ],
  // };
  // myChart_ljz1.setOption(option1);
  // myChart_ljz2.setOption(option2);
};

const showWeeklyChart = () => {
  document.getElementById("weekly_chart").removeAttribute("_echarts_instance_");
  var chartDom = document.getElementById("weekly_chart");
  weeklyChart = echarts.init(chartDom);

  var showPersonStart = moment().add(-6, "d").format("YYYY-MM-DD");
  var showPersonEnd = moment().add(1, "d").format("YYYY-MM-DD");

  axios({
    url:
      "/api/toilet/getSumByDuration/枣子巷/" +
      showPersonStart +
      "/" +
      showPersonEnd +
      "/threeType",
    headers: {
      Authorization: "Bearer" + params.token,
      "Content-Type": " application/json",
    },
    method: "get",
  }).then((dataTable) => {
    console.log(222, dataTable.data.data);
    dataTable = dataTable.data.data;
    const filteredData1 = dataTable.filter(
      (item) => item.gender === "男卫生间"
    );
    const flowValues1 = filteredData1.map((item) => item.flowValue);
    const DateValues1 = filteredData1.map((item) => item.startDate);
    const filteredData2 = dataTable.filter(
      (item) => item.gender === "女卫生间"
    );
    const flowValues2 = filteredData2.map((item) => item.flowValue);

    const filteredData3 = dataTable.filter(
      (item) => item.gender === "第三卫生间"
    );
    const flowValues3 = filteredData3.map((item) => item.flowValue);

    // 处理成功响应
    var option;

    option = {
      title: {
        text: "最近一周每日客流量统计",
        textStyle: {
          color: "black",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          // 获取横坐标的内容
          let xAxisLabel = params[0].axisValue;

          // 获取数据项的数值
          let dataValue = params[0].value;
          let dataValue1 = params[1].value;
          let dataValue2 = params[2].value;

          // 构建 tooltip 内容并换行显示
          return (
            xAxisLabel +
            "<br>第三卫生间 " +
            dataValue2 +
            "人" +
            "<br>女卫生间 " +
            dataValue1 +
            "人" +
            "<br>男卫生间 " +
            dataValue +
            "人"
          );
        },
      },
      legend: {
        textStyle: {
          color: "black",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
        textStyle: {
          color: "black",
        },
      },
      xAxis: [
        {
          type: "category",
          data: DateValues1,
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            formatter: "{value} 人",
          },
        },
      ],
      series: [
        {
          name: "男卫生间",
          type: "bar",
          stack: "Ad",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          textStyle: {
            color: "black",
          },
          data: flowValues1,
        },
        {
          name: "女卫生间",
          type: "bar",
          stack: "Ad",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          textStyle: {
            color: "white",
          },
          data: flowValues2,
        },
        {
          name: "第三卫生间",
          type: "bar",
          stack: "Ad",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          textStyle: {
            color: "white",
          },
          data: flowValues3,
        },
      ],
    };

    option && weeklyChart.setOption(option);
  });
};

onBeforeUnmount(() => {
  if (myChart_cclj) {
    window.removeEventListener("resize", myChart_cclj);
    myChart_cclj.dispose();
    myChart_cclj = null;
  }
  if (myChart_cclj1) {
    window.removeEventListener("resize", myChart_cclj1);
    myChart_cclj1.dispose();
    myChart_cclj1 = null;
  }
  if (myChart_ljz1) {
    window.removeEventListener("resize", myChart_ljz1);
    myChart_ljz1.dispose();
    myChart_ljz1 = null;
  }
  if (myChart_ljz2) {
    window.removeEventListener("resize", myChart_ljz2);
    myChart_ljz2.dispose();
    myChart_ljz2 = null;
  }

  if (weeklyChart) {
    window.removeEventListener("resize", weeklyChart);
    weeklyChart.dispose();
    weeklyChart = null;
  }
});
</script>

<style scoped>
.map-page-container {
  height: 580px;
}

.img-wrapper {
  background-image: url("@/assets/srzx/total.png");
  background-size: 100%;
  width: 100%;
  display: flex;
  height: 580px;
}

.classification-title {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  /*当屏幕尺寸变小时，各个子系统汇总模块自动换行*/
  font-size: 40px;
  color: #1677d9;
  margin-left: 5%;
  margin-top: 15px;
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
  width: 100%;
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

.environment-box {
  margin-top: 10vh;
  margin-right: 70vw;
  height: 80vh;
  position: relative;
}

.garbage-classify {
  width: 256px;
  height: 156px;
  background: #f5f7f9;
  cursor: pointer;
  position: absolute;
}

.garbage-classify-select {
  background-image: url("@/assets/images/environment/rubbish-classify.png");
}

.garbage-transport {
  width: 256px;
  height: 156px;
  top: 176px;
  background: #f5f7f9;
  position: absolute;
  cursor: pointer;
}

.garbage-transport-select {
  background-image: url("@/assets/images/environment/rubbish-transport.png");
}

.garbage-compress {
  width: 256px;
  height: 156px;
  top: 156px;
  background: #f5f7f9;
  position: absolute;
  cursor: pointer;
}

.garbage-collect {
  width: 256px;
  height: 156px;
  top: 352px;
  background: #f5f7f9;
  position: absolute;
  cursor: pointer;
}

.garbage-collect-select {
  background-image: url("@/assets/images/environment/garbage-compression.png");
}

.garbage-compress-select {
  background-image: url("@/assets/images/environment/garbage-compression.png");
}

.garbage-classify-icon {
  width: 32px;
  height: 32px;
  top: 44px;
  left: 112px;
  position: absolute;
}

.garbage-classify-text {
  width: 108px;
  height: 25px;
  top: 88px;
  left: 74px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #333333;
  text-align: center;
  position: absolute;
}

.garbage-collect-text-select {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
}

.garbage-collect-text {
  width: 108px;
  height: 25px;
  top: 88px;
  left: 74px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #333333;
  text-align: center;
  position: absolute;
}

.garbage-classify-text-select {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
}

.garbage-transport-icon {
  width: 32px;
  height: 32px;
  top: 44px;
  left: 112px;
  position: absolute;
}

.garbage-collect-icon {
  width: 32px;
  height: 32px;
  top: 44px;
  left: 112px;
  position: absolute;
}

.garbage-transport-text {
  width: 144px;
  height: 25px;
  top: 88px;
  left: 56px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #333333;
  text-align: center;
  position: absolute;
}

.garbage-transport-text-select {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
}

.garbage-compress-icon {
  width: 32px;
  height: 32px;
  top: 44px;
  left: 112px;
  position: absolute;
}

.garbage-compress-text {
  width: 126px;
  height: 25px;
  top: 88px;
  left: 65px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #333333;
  text-align: center;
  position: absolute;
}

.garbage-compress-text-select {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
}

.environment-right {
  width: 904px;
  height: 508px;
  left: 296px;
  position: absolute;
}

.environment-right default {
  width: 904px;
  height: 508px;
  left: 296px;
  position: absolute;
}

.default {
  width: 904px;
  height: 508px;
  left: 296px;
  position: absolute;
}

.classify-select {
  background-image: url("@/assets/images/environment/classify.png");
}

.transport-select {
  background-image: url("@/assets/images/environment/transport.png");
}

.compress-select {
  background-image: url("@/assets/images/environment/compress.png");
}

.collect-select {
  background-image: url("@/assets/images/environment/collect.png");
}

.environment-right-content {
  width: 100%;
  height: 219px;
  background: rgba(22, 119, 217, 0.55);
  position: absolute;
  bottom: 0;
}

.content-number-img {
  width: 120px;
  height: 32px;
  position: absolute;
  top: 22px;
  left: 28px;
}

.classify-content-title {
  width: 144px;
  height: 33px;
  position: absolute;
  top: 57px;
  left: 24px;
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #ffffff;
}

.transport-content-title {
  width: 282px;
  height: 33px;
  position: absolute;
  top: 57px;
  left: 24px;
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #ffffff;
}

.compress-content-title {
  width: 168px;
  height: 33px;
  position: absolute;
  top: 57px;
  left: 24px;
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #ffffff;
}

.content-title-en {
  width: 397px;
  height: 20px;
  opacity: 0.8;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  position: absolute;
  top: 92px;
  left: 24px;
}

.content-number {
  width: 856px;
  height: 24px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  line-height: 24px;
  position: absolute;
  top: 136px;
  left: 24px;
}

.check-details {
  width: 56px;
  height: 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  position: absolute;
  left: 24px;
  bottom: 24px;
}

.detail-img {
  width: 12px;
  height: 12px;
  position: absolute;
  left: 84px;
  bottom: 28px;
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
