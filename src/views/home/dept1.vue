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
              @click="show(system, system.to, system.url)"
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

      <div class="background" v-if="choosedDept === 1">
        <img
          src="@/assets/home/banner-srzx.png"
          width="10000"
          style="overflow-y: auto; overflow-x: auto"
        />
      </div>

      <!-- 页面显示区域 -->
      <el-main class="main">
        <!-- <div class="classification-title" v-if="choosedDept==-1|choosedDept==0">
          环境卫生
          <main-info v-for="(item, idx) in choosedSystems" :key="idx" :systemName="item.systemName" :url="item.url"
            :logo="item.systemLogo" :info-list="item.data" :image="item.image" :to="item.to" :deptId="item.deptId">
          </main-info>
        </div> -->
        <!-- <el-divider v-if="choosedDept==-1|choosedDept==0" /> -->

        <div class="city-scape">
          <div class="city-scape-left">
            <!-- <div class="city-scape-left-one" @click="one_clicked">
                            <div
                                :class="one_selected == true ? 'city-scape-left-number left-number-selected' : 'city-scape-left-number'">
                                <div
                                    :class="one_selected == true ? 'left-number left-number-text-selected' : 'left-number'">
                                    1</div>
                            </div>
                            <div
                                :class="one_selected == true ? 'city-scape-left-name left-name-selected' : 'city-scape-left-name'">
                                <p>综合行政管理</p>
                                <p>管理执法智慧服务管家</p>
                            </div>
                            <div :class="one_selected == true ? 'col-line col-line-selected' : 'col-line'"></div>
                        </div> -->

            <div class="city-scape-left-one" @click="one_clicked">
              <div
                :class="
                  one_selected == true
                    ? 'city-scape-left-number left-number-selected'
                    : 'city-scape-left-number'
                "
              >
                <div
                  :class="
                    one_selected == true
                      ? 'left-number left-number-text-selected'
                      : 'left-number'
                  "
                >
                  1
                </div>
              </div>
              <div
                :class="
                  one_selected == true
                    ? 'city-scape-left-name left-name-selected'
                    : 'city-scape-left-name'
                "
                style="top: 38px; left: 60px"
              >
                餐饮油烟管家
              </div>
              <div
                :class="
                  one_selected == true
                    ? 'col-line col-line-selected'
                    : 'col-line'
                "
              ></div>
            </div>

            <div class="city-scape-left-two" @click="two_clicked">
              <div
                :class="
                  two_selected == true
                    ? 'city-scape-left-number left-number-selected'
                    : 'city-scape-left-number'
                "
              >
                <div
                  :class="
                    two_selected == true
                      ? 'left-number left-number-text-selected'
                      : 'left-number'
                  "
                >
                  2
                </div>
              </div>
              <div
                :class="
                  two_selected == true
                    ? 'city-scape-left-name left-name-selected'
                    : 'city-scape-left-name'
                "
                style="top: 38px; left: 60px"
              >
                调度指挥管家
              </div>
              <div
                :class="
                  two_selected == true
                    ? 'col-line col-line-selected'
                    : 'col-line'
                "
              ></div>
            </div>

            <div class="city-scape-left-four" @click="four_clicked">
              <div
                :class="
                  four_selected == true
                    ? 'city-scape-left-number left-number-selected'
                    : 'city-scape-left-number'
                "
              >
                <div
                  :class="
                    four_selected == true
                      ? 'left-number left-number-text-selected'
                      : 'left-number'
                  "
                >
                  4
                </div>
              </div>
              <div
                :class="
                  four_selected == true
                    ? 'city-scape-left-name left-name-selected'
                    : 'city-scape-left-name'
                "
                style="top: 25px; left: 60px"
              >
                <p>扬尘治理</p>
                <p>大数据协同管家</p>
              </div>
              <div
                :class="
                  four_selected == true
                    ? 'col-line col-line-selected'
                    : 'col-line'
                "
              ></div>
            </div>

            <div class="city-scape-left-three" @click="three_clicked">
              <div
                :class="
                  three_selected == true
                    ? 'city-scape-left-number left-number-selected'
                    : 'city-scape-left-number'
                "
              >
                <div
                  :class="
                    three_selected == true
                      ? 'left-number left-number-text-selected'
                      : 'left-number'
                  "
                >
                  3
                </div>
              </div>
              <div
                :class="
                  three_selected == true
                    ? 'city-scape-left-name left-name-selected'
                    : 'city-scape-left-name'
                "
                style="top: 37px; left: 60px"
              >
                共享单车管家
              </div>
              <div
                :class="
                  three_selected == true
                    ? 'col-line col-line-selected'
                    : 'col-line'
                "
              ></div>
            </div>

            <!-- <div class="city-scape-left-" @click="six_clicked">
                            <div
                                :class="six_selected == true ? 'city-scape-left-number left-number-selected' : 'city-scape-left-number'">
                                <div
                                    :class="six_selected == true ? 'left-number left-number-text-selected' : 'left-number'">
                                    6</div>
                            </div>
                            <div :class="six_selected == true ? 'city-scape-left-name left-name-selected' : 'city-scape-left-name'"
                                style="top: 37px; left: 60px">
                                街面图像综合应用管家
                            </div>
                            <div :class="six_selected == true ? 'col-line col-line-selected' : 'col-line'"></div>
                        </div> -->
            <div class="extra-col-line"></div>
          </div>

          <div
            class="city-scape-right"
            v-for="system_info in systems"
            :key="system_info.id"
          >
            <img
              v-if="one_selected == true"
              class="right-number-img"
              src="@/assets/images/city/number1.png"
              alt=""
            />
            <img
              v-if="two_selected == true"
              class="right-number-img"
              src="@/assets/images/city/number2.png"
              alt=""
            />
            <img
              v-if="three_selected == true"
              class="right-number-img"
              src="@/assets/images/city/number3.png"
              alt=""
            />
            <img
              v-if="four_selected == true"
              class="right-number-img"
              src="@/assets/images/city/number4.png"
              alt=""
            />
            <img
              v-if="five_selected == true"
              class="right-number-img"
              src="@/assets/images/city/number5.png"
              alt=""
            />
            <img
              v-if="six_selected == true"
              class="right-number-img"
              src="@/assets/images/city/number6.png"
              alt=""
            />

            <div class="system-name">{{ system_info.name }}</div>
            <div class="system-name-en">{{ system_info.name_en }}</div>

            <!-- <img v-if="one_selected == true" class="right-bg" src="@/assets/images/city/bg1.png" alt=""> -->
            <!-- <img v-if="two_selected == true" class="right-bg" src="@/assets/images/city/bg2.png" alt=""> -->
            <div v-show="one_selected == true" class="right-bg-yyxt">
              <div
                id="container_yyxt1"
                style="width: 1000px; height: 350px"
              ></div>
              <div
                id="container_yyxt2"
                style="width: 600px; height: 350px; float: left"
              ></div>
              <div
                id="container_yyxt3"
                style="width: 500px; height: 350px; float: left"
              ></div>
            </div>
            <!-- <img v-if="three_selected == true" class="right-bg" src="@/assets/images/city/bg3.png" alt=""> -->
            <template v-if="two_selected == true">
              <div class="right-bg">
                <el-collapse
                  v-model="activeNames"
                  @change="handleChange"
                  accordion
                >
                  <el-collapse-item title="金泉中队 定位异常情况" name="1">
                    <el-table
                      :data="ddzh_jinquan"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table>
                  </el-collapse-item>
                  <el-collapse-item title="沙河源中队 定位异常情况" name="2">
                    <el-table
                      :data="ddzh_shaheyuan"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="茶店子中队 定位异常情况" name="3">
                    <el-table
                      :data="ddzh_chadianzi"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="西华中队 定位异常情况" name="4">
                    <el-table
                      :data="ddzh_xihua"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="营门口中队 定位异常情况" name="5">
                    <el-table
                      :data="ddzh_yingmenkou"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="九里堤中队 定位异常情况" name="6">
                    <el-table
                      :data="ddzh_jinquan"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="荷花池中队 定位异常情况" name="7">
                    <el-table
                      :data="ddzh_hehuachi"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="五块石中队 定位异常情况" name="8">
                    <el-table
                      :data="ddzh_wukuaishi"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="天回中队 定位异常情况" name="9">
                    <el-table
                      :data="ddzh_tianhui"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="驷马桥中队 定位异常情况" name="10">
                    <el-table
                      :data="ddzh_simaqiao"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="凤凰山中队 定位异常情况" name="11">
                    <el-table
                      :data="ddzh_fenghuanshan"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table> </el-collapse-item
                  ><el-collapse-item title="西安路中队 定位异常情况" name="12">
                    <el-table
                      :data="ddzh_xianlu"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table>
                  </el-collapse-item>
                  <el-collapse-item title="抚琴中队 定位异常情况" name="13">
                    <el-table
                      :data="ddzh_fuqin"
                      stripe
                      style="width: 100%"
                      max-height="500"
                    >
                      <el-table-column prop="name" label="姓名" width="180" />
                      <el-table-column
                        prop="telephone"
                        label="电话"
                        width="280"
                      />
                      <el-table-column prop="department" label="部门" />
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </template>
            <!-- <img v-if="four_selected == true" class="right-bg" src="@/assets/images/city/bg4.png" alt=""> -->
            <div v-show="three_selected == true" class="right-bg">
              <div
                id="container_gxdc1"
                style="width: 500px; height: 350px; float: left"
              ></div>
              <div
                id="container_gxdc2"
                style="width: 700px; height: 350px; float: left"
              ></div>
            </div>
            <div v-show="four_selected == true" class="right-bg">
              <div
                id="container_ycxt1"
                style="width: 1000px; height: 350px"
              ></div>
            </div>
            <div
              v-show="four_selected == true"
              class="right-bg"
              style="margin-top: 370px; width: 1000px; height: 350px"
            >
              <div
                id="container_ycxt2"
                style="width: 1000px; height: 350px"
              ></div>
            </div>

            <!-- <img v-if="five_selected == true" class="right-bg" src="@/assets/images/city/bg5.png" alt=""> -->

            <img
              v-if="six_selected == true"
              class="right-bg"
              src="@/assets/images/city/bg6.png"
              alt=""
            />

            <div class="system-content">
              <!-- <img v-if="one_selected == true" class="content-bg" src="@/assets/images/city/content1.png"
                                alt=""> -->
              <!-- <img v-if="two_selected == true" class="content-bg" src="@/assets/images/city/content2.png"
                                alt=""> -->
              <!-- <img v-if="three_selected == true" class="content-bg" src="@/assets/images/city/content3.png"
                                alt=""> -->
              <!-- <img v-if="four_selected == true" class="content-bg" src="@/assets/images/city/content4.png"
                                alt=""> -->
              <!-- <img v-if="five_selected == true" class="content-bg" src="@/assets/images/city/content5.png"
                                alt=""> -->
              <!-- <img v-if="six_selected == true" class="content-bg" src="@/assets/images/city/content6.png"
                                alt=""> -->

              <!-- <div class="system-content-test">
                                <p v-for=" item  in  system_info.items " :key="item.id">{{ item.desc }}：{{ item.value }}
                                </p>
                            </div> -->
              <!-- <img class="check-img" src="@/assets/images/city/check.png" alt=""> -->
            </div>
          </div>
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
import { useRouter, useRoute } from "vue-router";
import MainInfo from "@/views/home/components/MainInfo.vue";
import ClassItem from "@/views/home/components/ClassItem.vue";
import Header from "@/components/Header.vue";
import { get, getDeptList, getSystemList } from "@/api/home.js";
import { getMainInfoYyxt } from "@/api/yyxt.js";
import { getMainXzzf } from "@/api/xzzf.js";
import { getTokenGxdc, getMainGxdc } from "@/api/gxdc";
import { params } from "@/store/store.js";
import { getGroup } from "@/api/ddzh";
import axios from "axios";
import { useStore } from "vuex";
const store = useStore();

import {
  getOverStandard,
  getMonitor,
  getCompanyType,
  getTouSU,
} from "@/api/yyxt";
import * as echarts from "echarts";
import {
  getCompanyDust,
  getOverSpeed,
  getClassifiedGpsRate,
  getClassifiedSitesAmount,
} from "@/api/ycxt";

const tableDataYyxt = ref([]);
const tableDataXzzf = ref([]);
const tableDataGxdc = ref([]);
const gxdc = reactive({ url: "" });
const gxdcUrl = ref("");
let route = useRoute();
const imgVisible = ref(true);
const ddzh_jinquan = ref([]);
const ddzh_fuqin = ref([]);
const ddzh_xianlu = ref([]);
const ddzh_chadianzi = ref([]);
const ddzh_shaheyuan = ref([]);
const ddzh_xihua = ref([]);
const ddzh_yingmenkou = ref([]);
const ddzh_jiulidi = ref([]);
const ddzh_wukuaishi = ref([]);
const ddzh_hehuachi = ref([]);
const ddzh_tianhui = ref([]);
const ddzh_simaqiao = ref([]);
const ddzh_fenghuanshan = ref([]);

let myChart_gxdc = null;
let myChart_gxdc1 = null;
let myChart_yyxt1 = null;
let myChart_yyxt2 = null;
let myChart_yyxt3 = null;
let myChart_ycxt1 = null;
let myChart_ycxt2 = null;
function echartInit_gxdc() {
  if (
    document
      .getElementById("container_gxdc1")
      .hasAttribute("_echarts_instance_")
  )
    document
      .getElementById("container_gxdc1")
      .removeAttribute("_echarts_instance_");
  myChart_gxdc = echarts.init(document.getElementById("container_gxdc1"));

  if (
    document
      .getElementById("container_gxdc2")
      .hasAttribute("_echarts_instance_")
  )
    document
      .getElementById("container_gxdc2")
      .removeAttribute("_echarts_instance_");
  myChart_gxdc1 = echarts.init(document.getElementById("container_gxdc2"));
  var option_gxdc2 = {
    title: {
      text: "公司统计",
      textStyle: {
        color: "black",
      },
    },

    tooltip: {
      trigger: "axis",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
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
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: ["美团", "哈啰", "青桔"],
    },
    series: [
      {
        name: "正常停放",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        textStyle: {
          color: "#ccc",
        },
        emphasis: {
          focus: "series",
        },
        data: [18244, 14765, 19339],
      },
      {
        name: "异常停放",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        textStyle: {
          color: "#ccc",
        },
        data: [2231, 4902, 1872],
      },
      {
        name: "正常行驶",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        textStyle: {
          color: "#ccc",
        },
        data: [1537, 932, 1948],
      },
    ],
  };
  myChart_gxdc1.setOption(option_gxdc2);

  getMainGxdc().then((gxdcData) => {
    var option_gxdc1 = {
      title: {
        text: "单车统计",
        textStyle: {
          color: "black",
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: {
          color: "black",
        },
      },
      series: [
        {
          name: "单车",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
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
            { value: gxdcData[2].infoVal, name: "正常停放车辆" },
            { value: gxdcData[1].infoVal, name: "异常停放车辆" },
            { value: gxdcData[3].infoVal, name: "行驶中车辆" },
            // { value: 580, name: 'Email' },
            // { value: 484, name: 'Union Ads' },
            // { value: 300, name: 'Video Ads' }
          ],
        },
      ],
    };
    myChart_gxdc.setOption(option_gxdc1);
  });
}
function echartInit_yyxt() {
  if (
    document
      .getElementById("container_yyxt1")
      .hasAttribute("_echarts_instance_")
  )
    document
      .getElementById("container_yyxt1")
      .removeAttribute("_echarts_instance_");
  if (
    document
      .getElementById("container_yyxt2")
      .hasAttribute("_echarts_instance_")
  )
    document
      .getElementById("container_yyxt2")
      .removeAttribute("_echarts_instance_");
  if (
    document
      .getElementById("container_yyxt3")
      .hasAttribute("_echarts_instance_")
  )
    document
      .getElementById("container_yyxt3")
      .removeAttribute("_echarts_instance_");
  myChart_yyxt1 = echarts.init(document.getElementById("container_yyxt1"));
  myChart_yyxt2 = echarts.init(document.getElementById("container_yyxt2"));
  myChart_yyxt3 = echarts.init(document.getElementById("container_yyxt3"));
  getOverStandard().then((tableData) => {
    var option_yyxt1 = {
      title: {
        text: "超标企业街道分布",
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
        data: [
          tableData[0].areaname,
          tableData[1].areaname,
          tableData[2].areaname,
          tableData[3].areaname,
          tableData[4].areaname,
          tableData[5].areaname,
          tableData[6].areaname,
          tableData[7].areaname,
          tableData[8].areaname,
          tableData[9].areaname,
          tableData[10].areaname,
          tableData[11].areaname,
          tableData[12].areaname,
        ],
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: { interval: 0 },
      },

      yAxis: {
        type: "value",
      },
      axisTick: {
        alignWithLabel: true,
      },
      series: [
        {
          data: [
            tableData[0].value,
            tableData[1].value,
            tableData[2].value,
            tableData[3].value,
            tableData[4].value,
            tableData[5].value,
            tableData[6].value,
            tableData[7].value,
            tableData[8].value,
            tableData[9].value,
            tableData[10].value,
            tableData[11].value,
            tableData[12].value,
          ],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    myChart_yyxt1.setOption(option_yyxt1);
  });
  getMonitor().then((tableData) => {
    var option_yyxt3 = {
      title: {
        text: "餐饮企业监控级别",
        textStyle: {
          color: "black",
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: {
          color: "black",
        },
      },
      series: [
        {
          name: "企业",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
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
            { value: tableData[0].ct, name: "常态" },
            { value: tableData[0].yb, name: "一般" },
            { value: tableData[0].zd, name: "重点" },
            // { value: 484, name: 'Union Ads' },
            // { value: 300, name: 'Video Ads' }
          ],
        },
      ],
    };
    myChart_yyxt3.setOption(option_yyxt3);
  });
  getTouSU().then((data) => {
    if (data.tsLastNow.length < 12) {
      for (let i = 0; i < 20; i++) {
        var tmp = { count: 0 };
        data.tsLastNow.push(tmp);
      }
    }
    var option_yyxt2 = {
      title: {
        text: "油烟投诉趋势图",
        textStyle: {
          color: "black",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        textStyle: {
          color: "black",
        },
        data: ["2021", "2022", "2023"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
        ],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "2021",
          type: "line",

          data: [
            data.tsLastTow[0].count,
            data.tsLastTow[1].count,
            data.tsLastTow[2].count,
            data.tsLastTow[3].count,
            data.tsLastTow[4].count,
            data.tsLastTow[5].count,
            data.tsLastTow[6].count,
            data.tsLastTow[7].count,
            data.tsLastTow[8].count,
            data.tsLastTow[9].count,
            data.tsLastTow[10].count,
            data.tsLastTow[11].count,
          ],
        },
        {
          name: "2022",
          type: "line",

          data: [
            data.tsLast[0].count,
            data.tsLast[1].count,
            data.tsLast[2].count,
            data.tsLast[3].count,
            data.tsLast[4].count,
            data.tsLast[5].count,
            data.tsLast[6].count,
            data.tsLast[7].count,
            data.tsLast[8].count,
            data.tsLast[9].count,
            data.tsLast[10].count,
            data.tsLast[11].count,
          ],
        },
        {
          name: "2023",
          type: "line",

          data: [
            data.tsLastNow[0].count,
            data.tsLastNow[1].count,
            data.tsLastNow[2].count,
            data.tsLastNow[3].count,
            data.tsLastNow[4].count,
            data.tsLastNow[5].count,
            data.tsLastNow[6].count,
            data.tsLastNow[7].count,
            data.tsLastNow[8].count,
            data.tsLastNow[9].count,
            data.tsLastNow[10].count,
            data.tsLastNow[11].count,
          ],
        },
      ],
    };
    myChart_yyxt2.setOption(option_yyxt2);
  });
}
function echartInit_ycxt2() {
  if (
    document
      .getElementById("container_ycxt2")
      .hasAttribute("_echarts_instance_")
  )
    document
      .getElementById("container_ycxt2")
      .removeAttribute("_echarts_instance_");
  myChart_ycxt2 = echarts.init(document.getElementById("container_ycxt2"));
  axios({
    url: "/api/dust_sys/classified_gps_rate",
    headers: { Authorization: "Bearer" + params.token },
    method: "get",
  }).then((resp) => {
    var option_ycxt2 = {
      title: {
        text: "公司在线率",
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
        data: [
          "四川省丰戈运输有限责任公司",
          "成都三胜物流有限公司",
          "四川明杨运输有限责任公司",
          "四川唐龙运输有限责任公司",
          "成都垚石物流有限公司",
          "四川连运能汇物流有限公司",
          "四川祥骏达物流有限公司",
        ],
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          //x轴文字的配置
          show: true,
          interval: 0, //使x轴文字显示全
          rotate: 20,
        },
      },

      yAxis: {
        type: "value",
      },
      axisTick: {
        alignWithLabel: true,
      },
      series: [
        {
          data: [
            resp.data.四川省丰戈运输有限责任公司 * 100,
            resp.data.成都三胜物流有限公司 * 100,
            resp.data.四川明杨运输有限责任公司 * 100,
            resp.data.四川唐龙运输有限责任公司 * 100,
            resp.data.成都垚石物流有限公司 * 100,
            resp.data.四川连运能汇物流有限公司 * 100,
            resp.data.四川祥骏达物流有限公司 * 100,
          ],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    myChart_ycxt2.setOption(option_ycxt2);
  });
}
function echartInit_ycxt() {
  if (
    document
      .getElementById("container_ycxt1")
      .hasAttribute("_echarts_instance_")
  )
    document
      .getElementById("container_ycxt1")
      .removeAttribute("_echarts_instance_");

  myChart_ycxt1 = echarts.init(document.getElementById("container_ycxt1"));

  axios({
    url: "/api/dust_sys/classified_sites_amount",
    headers: { Authorization: "Bearer" + params.token },
    method: "get",
  }).then((resp) => {
    console.log(resp.data);
    var option_ycxt1 = {
      title: {
        text: "分类工地数量",
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
        data: [
          "准备开工",
          "土方开挖",
          "主体施工",
          "装饰装修",
          "总坪绿化",
          "完工",
        ],
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: { interval: 0 },
      },

      yAxis: {
        type: "value",
      },
      axisTick: {
        alignWithLabel: true,
      },
      series: [
        {
          data: [
            resp.data.准备开工,
            resp.data.土方开挖,
            resp.data.主体施工,
            resp.data.装饰装修,
            resp.data.总坪绿化,
            resp.data.完工,
          ],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    myChart_ycxt1.setOption(option_ycxt1);
  });

  // getOverStandard().then(tableData => {

  //     var option_yyxt1 = {
  //         title: {
  //             text: '超标企业街道分布',
  //             textStyle: {
  //                 color: 'black'
  //             }
  //         },
  //         tooltip: {
  //             trigger: 'axis',
  //             axisPointer: {
  //                 type: 'shadow'
  //             }
  //         },
  //         xAxis: {
  //             type: 'category',
  //             data: [tableData[0].areaname, tableData[1].areaname, tableData[2].areaname, tableData[3].areaname, tableData[4].areaname, tableData[5].areaname, tableData[6].areaname, tableData[7].areaname, tableData[8].areaname, tableData[9].areaname, tableData[10].areaname, tableData[11].areaname, tableData[12].areaname],
  //             axisTick: {
  //                 alignWithLabel: true
  //             },
  //             axisLabel: { interval: 0 },

  //         },

  //         yAxis: {
  //             type: 'value'
  //         },
  //         axisTick: {
  //             alignWithLabel: true
  //         },
  //         series: [
  //             {
  //                 data: [tableData[0].value, tableData[1].value, tableData[2].value, tableData[3].value, tableData[4].value, tableData[5].value, tableData[6].value, tableData[7].value, tableData[8].value, tableData[9].value, tableData[10].value, tableData[11].value, tableData[12].value],
  //                 type: 'bar',
  //                 showBackground: true,
  //                 backgroundStyle: {
  //                     color: 'rgba(180, 180, 180, 0.2)'
  //                 }
  //             }
  //         ]
  //     };
  //     myChart_yyxt1.setOption(option_yyxt1)

  // })
}

onBeforeUnmount(() => {
  if (myChart_gxdc) {
    window.removeEventListener("resize", myChart_gxdc);
    myChart_gxdc.dispose();
    myChart_gxdc = null;
  }
  if (myChart_gxdc1) {
    window.removeEventListener("resize", myChart_gxdc1);
    myChart_gxdc1.dispose();
    myChart_gxdc1 = null;
  }
  if (myChart_yyxt1) {
    window.removeEventListener("resize", myChart_yyxt1);
    myChart_yyxt1.dispose();
    myChart_yyxt1 = null;
  }
  if (myChart_yyxt2) {
    window.removeEventListener("resize", myChart_yyxt2);
    myChart_yyxt2.dispose();
    myChart_yyxt2 = null;
  }
  if (myChart_yyxt3) {
    window.removeEventListener("resize", myChart_yyxt3);
    myChart_yyxt3.dispose();
    myChart_yyxt3 = null;
  }
  if (myChart_ycxt1) {
    window.removeEventListener("resize", myChart_ycxt1);
    myChart_ycxt1.dispose();
    myChart_ycxt1 = null;
  }
  if (myChart_ycxt2) {
    window.removeEventListener("resize", myChart_ycxt2);
    myChart_ycxt2.dispose();
    myChart_ycxt2 = null;
  }
});
//用户信息
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
const ycxt_tableData1 = ref([]);
const ycxt_tableData2 = ref([]); //扬尘系统
//部门列表, 从后端获取
const depts = ref([]);
onBeforeMount(() => {
  one_clicked();

  if (route.params.num == "3") three_clicked();
  getCompanyDust().then((data) => {
    ycxt_tableData1.value = data;
  });
  getOverSpeed().then((data) => {
    if (data.length != 0) ycxt_tableData2.value = data;
  });
  getGroup().then((data) => {
    ddzh_jinquan.value = data.金泉中队;
    ddzh_shaheyuan.value = data.沙河源中队;
    ddzh_chadianzi.value = data.茶店子中队;
    ddzh_xihua.value = data.西华中队;
    ddzh_yingmenkou.value = data.营门口中队;
    ddzh_jiulidi.value = data.九里堤中队;
    ddzh_hehuachi.value = data.荷花池中队;
    ddzh_wukuaishi.value = data.五块石中队;
    ddzh_tianhui.value = data.天回中队;
    ddzh_simaqiao.value = data.驷马桥中队;
    ddzh_fenghuanshan.value = data.凤凰山中队;
    ddzh_xianlu.value = data.西安路中队;
    ddzh_fuqin.value = data.抚琴中队;
  });
  getDeptList().then((response) => {
    depts.value = response;
  });
  getMainInfoYyxt().then((data) => {
    tableDataYyxt.value = data;
    canyin_info[0].value = tableDataYyxt.value[0].infoVal;
    canyin_info[1].value = tableDataYyxt.value[1].infoVal;
    canyin_info[2].value = tableDataYyxt.value[2].infoVal;
    canyin_info[3].value = tableDataYyxt.value[3].infoVal;
    canyin_info[4].value = tableDataYyxt.value[4].infoVal;
  });
  // getMainXzzf().then(data => {
  //     tableDataXzzf.value = data
  //     zonghe_info[0].value = data[0].infoVal
  //     zonghe_info[1].value = data[1].infoVal
  //     zonghe_info[2].value = data[2].infoVal
  //     zonghe_info[3].value = data[3].infoVal
  //     zonghe_info[4].value = data[4].infoVal

  // })
  getTokenGxdc().then((data) => {
    gxdcUrl.value = data;
    gxdc.url = "https://119.4.191.13:5580/manage/?token=" + gxdcUrl.value;
  });
  getMainGxdc().then((data) => {
    tableDataGxdc.value = data;
    danche_info[0].value = data[0].infoVal;
    danche_info[1].value = data[1].infoVal;
    danche_info[2].value = data[2].infoVal;
    danche_info[3].value = data[3].infoVal;
    danche_info[4].value = data[4].infoVal;
  });
});

// 系统列表
const systemss = ref([]);
onMounted(() => {
  getSystemList().then((data) => {
    systemss.value = data;
    // 请求各个子系统要显示的数据
    systemss.value.forEach((system) => {
      if (system.api !== "") {
        // get(system.api).then(data => system.data = data)
      }
    });
  });
  echartInit_yyxt();
  echartInit_gxdc();
  echartInit_ycxt();
  echartInit_ycxt2();
});
//选中的部门
// -1表示全选，为默认值
const choosedDept = ref(1);
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

  return systemss.value.filter(filterFun);
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
  console.log(id);
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
      if (id != "gxdc" && id != "ddzh") window.open(url);

      if (id == "gxdc") window.open(gxdc.url);
      if (id == "ddzh") {
        var roles = [];
        roles = params.roleId.split(",");
        console.log(roles.indexOf("84"));
        // console.log(params.roleId)
        if (
          roles.indexOf("84") != -1 ||
          roles.indexOf("109") != -1 ||
          roles.indexOf("110") != -1 ||
          roles.indexOf("111") != -1 ||
          roles.indexOf("83") != -1
        ) {
          var ddzh_url =
            "https://119.4.191.13:8881/map/?username=18008060886&pwd=MTIzNDU2";
          window.open(ddzh_url);
        }
        if (roles.indexOf("93") != -1) {
          var ddzh_url =
            "https://119.4.191.13:8881/map/?username=18008061151&pwd=MTIzNDU2";
          window.open(ddzh_url);
        }

        if (roles.indexOf("120") != -1) {
          var ddzh_url =
            "https://119.4.191.13:8881/map/?username=18008061081&pwd=MTIzNDU2";
          window.open(ddzh_url);
        }
        if (
          roles.indexOf("96") != -1 ||
          roles.indexOf("99") != -1 ||
          roles.indexOf("102") != -1
        ) {
          var ddzh_url =
            "https://119.4.191.13:8881/map/?username=18008061109&pwd=MTIzNDU2";
          window.open(ddzh_url);
        } else {
          var ddzh_url =
            "https://119.4.191.13:8881/map/?username=" +
            params.username +
            "&pwd=MTIzNDU2";
          console.log(ddzh_url);
          window.open(url);
        }
      } //调度指挥
      uploadClickLog(system.systemName);
    }
  } else {
    ElMessage.error("对不起，你无权访问系统！");
  }

  // if (to === '') {
  //     ll
  //     ElMessage({
  //         showClose: true,
  //         message: '正在开发中...'
  //     })
  // } else {
  //     router.push({ name: to, params: { subsysName } })
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
let one_selected = ref(false);
let two_selected = ref(false);
let three_selected = ref(false);
let four_selected = ref(false);
let five_selected = ref(false);
let six_selected = ref(false);
let systems = reactive([]);
let system_zonghe = reactive({});
let system_canyin = reactive({});
let system_diaodu = reactive({});
let system_yangchen = reactive({});
let system_danche = reactive({});
let system_jiemiantuxiang = reactive({});
let zonghe_info = [
  { desc: "今日结案", value: "" },
  { desc: "今日上报案件", value: "" },
  { desc: "今日结案率", value: "" },
  { desc: "本周解决", value: "" },
  { desc: "本周上报案件", value: "" },
];
let canyin_info = [
  { desc: "已安装设备企业", value: "675" },
  { desc: "正常运行企业", value: "490" },
  { desc: "离线企业数", value: "182" },
  { desc: "超标企业数", value: "1" },
  { desc: "预警企业数", value: "2" },
];
let danche_info = [
  { desc: "全部停放车辆", value: "40684" },
  { desc: "异常停放车辆", value: "6927" },
  { desc: "正常停放车辆", value: "33757" },
  { desc: "行驶中车辆", value: "2767" },
  { desc: "分值", value: "0.829" },
];
// const one_clicked = () => {
//     systems.splice(0, systems.length);

//     system_zonghe.name = "成都市综合行政管理执法智慧服务平台";
//     system_zonghe.name_en = "Intelligent Service Platform For Comprehensive Administrative Management And Law Enforcement";

//     system_zonghe['items'] = zonghe_info;
//     systems.push(system_zonghe);
//     one_selected.value = true;
//     two_selected.value = false;
//     three_selected.value = false;
//     four_selected.value = false;
//     five_selected.value = false;
//     six_selected.value = false;
// }

// one_clicked();

const one_clicked = () => {
  systems.splice(0, systems.length);

  system_canyin.name = "餐饮油烟监测服务";
  system_canyin.name_en = "Catering Lampblack Monitoring Service";

  system_canyin["items"] = canyin_info;

  systems.push(system_canyin);
  one_selected.value = true;
  two_selected.value = false;
  three_selected.value = false;
  four_selected.value = false;
  five_selected.value = false;
  six_selected.value = false;
};

const two_clicked = () => {
  systems.splice(0, systems.length);

  system_diaodu.name = "调度指挥管家";
  system_diaodu.name_en =
    "Dust Control Big Data Collaborative Management Center";

  let diaodu_info = [
    { desc: "未受理案件", value: "33" },
    { desc: "未处理案件", value: "23" },
    { desc: "处理中案件", value: "10" },
    { desc: "已处理案件", value: "23" },
    { desc: "已退回案件", value: "23" },
  ];
  system_diaodu["items"] = diaodu_info;

  systems.push(system_diaodu);
  one_selected.value = false;
  two_selected.value = true;
  three_selected.value = false;
  four_selected.value = false;
  five_selected.value = false;
  six_selected.value = false;
};

const three_clicked = () => {
  systems.splice(0, systems.length);

  system_yangchen.name = "共享单车管理平台  ";
  system_yangchen.name_en = "Shared Bicycle Management Platform";

  let yangchen_info = [
    { desc: "未受理案件", value: "33" },
    { desc: "未处理案件", value: "23" },
    { desc: "处理中案件", value: "10" },
    { desc: "已处理案件", value: "23" },
    { desc: "已退回案件", value: "23" },
  ];
  system_yangchen["items"] = yangchen_info;

  systems.push(system_yangchen);
  one_selected.value = false;
  two_selected.value = false;
  three_selected.value = true;
  four_selected.value = false;
  five_selected.value = false;
  six_selected.value = false;
};

const four_clicked = () => {
  systems.splice(0, systems.length);

  system_danche.name = "扬尘治理大数据协同管理中心";
  system_danche.name_en = "Catering Lampblack Monitoring Service";

  system_danche["items"] = danche_info;

  systems.push(system_danche);
  one_selected.value = false;
  two_selected.value = false;
  three_selected.value = false;
  four_selected.value = true;
  five_selected.value = false;
  six_selected.value = false;
};

const six_clicked = () => {
  systems.splice(0, systems.length);

  system_jiemiantuxiang.name = "街面图像综合应用";
  system_jiemiantuxiang.name_en = "Comprehensive Application Of Street Image";

  let jiemiantuxiang_info = [
    { desc: "未受理案件", value: "33" },
    { desc: "未处理案件", value: "23" },
    { desc: "处理中案件", value: "10" },
    { desc: "已处理案件", value: "23" },
    { desc: "已退回案件", value: "23" },
  ];
  system_jiemiantuxiang["items"] = jiemiantuxiang_info;

  systems.push(system_jiemiantuxiang);
  one_selected.value = false;
  two_selected.value = false;
  three_selected.value = false;
  four_selected.value = false;
  five_selected.value = false;
  six_selected.value = true;
};
</script>

<style scoped>
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

.city-scape {
  position: relative;
  margin-top: 10vh;
  margin-right: 70vw;
  height: 1000px;
}

.city-scape-left-one {
  cursor: pointer;
  width: 320px;
}

.city-scape-left-number {
  width: 48px;
  height: 48px;
  position: absolute;
  top: 25px;
  border: 1px solid #333333;
}

.left-number {
  width: 15px;
  height: 33px;
  position: absolute;
  top: 7px;
  left: 16px;
  font-family: PingFangSC-Regular;
  font-size: 24px;
  color: #333333;
  text-align: center;
}

.city-scape-left-name {
  width: 180px;
  height: 50px;
  position: absolute;
  left: 60px;
  top: 23px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #333333;
}

.city-scape-left-two {
  width: 320px;
  position: absolute;
  top: 100px;
  cursor: pointer;
}

.city-scape-left-three {
  width: 320px;
  position: absolute;
  top: 200px;
  cursor: pointer;
}

.city-scape-left-four {
  width: 320px;
  position: absolute;
  top: 300px;
  cursor: pointer;
}

.city-scape-left-five {
  width: 320px;
  position: absolute;
  top: 400px;
  cursor: pointer;
}

.city-scape-left-six {
  width: 320px;
  position: absolute;
  top: 500px;
  cursor: pointer;
}

.col-line {
  width: 1px;
  height: 100px;
  background: #cccccc;
  position: absolute;
  left: 319px;
}

.extra-col-line {
  width: 1px;
  height: 260px;
  background: #cccccc;
  position: absolute;
  left: 319px;
  top: 600px;
}

.left-number-selected {
  background: #1677d9;
}

.left-number-text-selected {
  font-family: PingFangSC-Regular;
  font-size: 24px;
  color: #ffffff;
  text-align: center;
}

.left-name-selected {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #1677d9;
}

.col-line-selected {
  width: 4px;
  background: #1677d9;
}

.right-number-img {
  width: 120px;
  height: 32px;
  position: absolute;
  left: 363px;
  top: 13px;
}

.system-name {
  width: 408px;
  height: 33px;
  position: absolute;
  top: 48px;
  left: 360px;
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #1677d9;
}

.system-name-en {
  width: 672px;
  height: 20px;
  position: absolute;
  top: 83px;
  left: 360px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
}

.right-bg {
  width: 799px;
  height: 599px;
  position: absolute;
  top: 123px;
  left: 360px;
  z-index: 1;
}

.right-bg-yyxt {
  width: 1299px;
  height: 599px;
  position: absolute;
  top: 123px;
  left: 360px;
  z-index: 1;
}

.system-content {
  width: 599px;
  height: 290px;
  position: absolute;
  top: 560px;
  left: 602px;
}

.content-bg {
  width: 100%;
  height: 100%;
  position: absolute;
}

.system-content-test {
  width: 160px;
  height: 120px;
  position: absolute;
  top: 40px;
  left: 40px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  line-height: 24px;
}

.check-img {
  width: 48px;
  height: 48px;
  position: absolute;
  top: 202px;
  left: 40px;
  cursor: pointer;
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
