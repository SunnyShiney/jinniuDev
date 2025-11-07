<template>
  <div class="content-l">
    <div class="container">
      <dv-border-box7 style="height: 46vh; width: 25vw">
        <!-- <div class="card text-white bg-primary mb-3 " style="max-width: 14rem;padding: 10px;height: 10vh;"> -->
        <h5
          class="card-title"
          style="font-size: 25px; padding: 5px; text-align: center"
        >
          环境卫生
        </h5>

        <div class="card-body" style="padding: 0px; height: 40vh; width: 100%">
          <!-- <el-tabs v-model="activeName" type="border-card" class="hwzy-tabs" @tab-click="handleClick" style="width:100%">
            <el-tab-pane label="环卫作业运行管家" name="first">
              <div class="hwzy-Charts" style="width: 25vw; height: 30vh;"> </div>
            </el-tab-pane>
            <el-tab-pane label="餐厨垃圾全生命周期管家管家" name="second">
              <div class="hwzy-Charts" style="width: 25vw; height: 30vh;"> </div>
            </el-tab-pane>
            <el-tab-pane label="生活垃圾转运处理管家" name="third">
              <div class="hwzy-Charts" style="width: 25vw; height: 30vh;"> </div>
            </el-tab-pane>
          </el-tabs> -->
          <!-- <el-menu :default-active="activeIndex_hjws" class="el-menu-demo" mode="horizontal" @select="handleSelect_hjws"
            style="width: 100%;" active-text-color="#ffd04b" background-color="#2a2a2a" text-color="#fff">
            <el-menu-item index="1">环卫作业运行管家</el-menu-item>
            <el-menu-item index="2">餐厨垃圾全生命周期管家管家</el-menu-item>
            <el-menu-item index="3">生活垃圾转运处理管家</el-menu-item>
          </el-menu> -->
          <!-- <div id="hwzy-Charts" v-if="echart_index_hjws != 1" style="width: 25vw; height: 30vh;"></div> -->
          <div class="no">
            <div
              style="
                color: rgb(153, 222, 243);
                margin-bottom: -0.5vw;
                text-align: center;
              "
            >
              垃圾全生命周期
            </div>
            <div
              class="no-header"
              style="
                height: 1px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                width: 85%;
                margin: 0 auto;
                margin-bottom: 10px;
              "
            ></div>
            <div class="no-hd">
              <ul>
                <li>{{ ccljTodayWeight}}</li>
                <li>{{ otherTodayWeight }}</li>
                <li>{{ aflTodayWeight }}</li>
              </ul>
              <ul>
                <li>餐厨垃圾今日重量</li>
                <li>其他垃圾今日重量</li>
                <li>爱分类今日重量</li>
              </ul>
            </div>
            <div
              class="no-header"
              style="
                height: 1px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                width: 85%;
                margin: 0 auto;
                margin-bottom: 10px;
              "
            ></div>
            <!-- <div class="no-md">
              <ul>
                <li>出勤车辆数：141</li>
                <li>总车辆数：148</li>
              </ul>

            </div> -->
            <div style="width: 100%">
              <div style="float: left; color: rgb(153, 222, 243)">环卫作业</div>
              <div
                style="
                  float: right;
                  margin-right: 1vw;
                  color: rgb(153, 222, 243);
                "
              >
                智慧厕所
              </div>
            </div>
          </div>
          <!-- <div style="display: flex">
            <div
              id="hwzy-Charts"
              v-show="echart_index_hjws === 1"
              style="width: 12vw; height: 20vh"
            ></div>
            <div
              id="cclj-Charts"
              v-show="echart_index_hjws === 1"
              style="width: 12vw; height: 20vh"
            ></div>
          </div> -->

          <div style="display: flex; margin-top: 10px">
            <div id="hwzy-Charts" v-show="echart_index_hjws === 1"></div>
            <div id="cclj-Charts" v-show="echart_index_hjws === 1"></div>
          </div>

          <div style="display: flex;width:80%;margin:0 auto;">
            <div
              id="cqcl-Charts"
              v-show="echart_index_hjws === 1"
              style="width: 10vw; height: 24vh"
            ></div>
            <div
              id="shlj-Charts"
              v-show="echart_index_hjws === 1"
              style="width: 10vw; height: 24vh"
            ></div>
          </div>
        </div>

        <!-- </div>  -->
      </dv-border-box7>
      <dv-border-box7 style="height: 46vh; margin-top: 2vh">
        <div dv-bg>
          <h5
            class="card-title"
            style="font-size: 25px; padding: 5px; text-align: center"
          >
            市容秩序
          </h5>
          <div
            class="card-body"
            style="padding: 0px; height: 40vh; width: 100%"
            active-text-color="#ffd04b"
            background-color="#2a2a2a"
            text-color="#fff"
          >
            <!-- <el-tabs v-model="activeName" type="border-card" class="hwzy-tabs" @tab-click="handleClick" style="width:100%">
            <el-tab-pane label="环卫作业运行管家" name="first">
              <div class="hwzy-Charts" style="width: 25vw; height: 30vh;"> </div>
            </el-tab-pane>
            <el-tab-pane label="餐厨垃圾全生命周期管家管家" name="second">
              <div class="hwzy-Charts" style="width: 25vw; height: 30vh;"> </div>
            </el-tab-pane>
            <el-tab-pane label="生活垃圾转运处理管家" name="third">
              <div class="hwzy-Charts" style="width: 25vw; height: 30vh;"> </div>
            </el-tab-pane>
          </el-tabs> -->
            <el-menu
              :default-active="activeIndex_srzx"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect_srzx"
              style="width: 80%; margin: 0 auto"
              active-text-color="#ffd04b"
              background-color="#05103C"
              text-color="#fff"
            >
              <el-menu-item index="1">餐饮油烟管家</el-menu-item>
              <el-menu-item index="2">调度指挥管家</el-menu-item>
              <el-menu-item index="4">共享单车管家</el-menu-item>
              <el-menu-item index="3">扬尘治理大数据协同管家</el-menu-item>
            </el-menu>
            <!-- <div id="hwzy-Charts" v-if="echart_index_hjws != 1" style="width: 25vw; height: 30vh;"></div> -->
            <div v-show="echart_index_srzx === 1">
              <div id="cyyy-Charts" style="width: 26vw; height: 30vh"></div>
              <div style="width: 50%; margin: 0 auto">
                <el-pagination
                  layout="prev, pager, next"
                  :total="4"
                  background
                  text-color="#fff"
                  :page-size="1"
                  @current-change="changeCyyyChart"
                  small
                  :current-page="currentPageCyyy"
                />
              </div>
            </div>

            <div
              id="ddzh-Charts"
              v-show="echart_index_srzx === 2"
              style="width: 25vw; height: 35vh"
            ></div>
            <div
              id="ycxt-Charts"
              v-show="echart_index_srzx === 3"
              style="width: 25vw; height: 30vh"
            >
              <p
                class="demo-rich-content__mention"
                style="margin: 0; font-size: 18px; color: var(--el-color-info)"
              >
                @工地运企信息
              </p>
              <el-table
                :data="ycxt_tableData1"
                stripe
                style="width: 100%"
                max-height="500"
              >
                <el-table-column prop="name" label="名称" width="160" />
                <el-table-column prop="contacts" label="联系人" width="180" />
                <el-table-column prop="car_count" label="车辆数" width="180" />
                <el-table-column prop="tel" label="联系电话" />
              </el-table>
            </div>
            <div
              id="gxdc-Charts"
              v-show="echart_index_srzx === 4"
              style="width: 25vw; height: 30vh"
            ></div>
            <div
              id="jmtx-Charts"
              v-show="echart_index_srzx === 5"
              style="width: 25vw; height: 30vh"
            >
              待接入
            </div>
          </div>
        </div>
      </dv-border-box7>
    </div>
  </div>
  <div class="content_middle_top">
    <dv-border-box7 style="height: 14vh">
      <div class="no-middle" style="padding-top: 3vh">
        <div class="no-middle-hd">
          <ul>
            <li @click="handleEdit(warningReported)">{{ reportedNum }}</li>
            <li @click="handleEdit(warningUnregistered)">
              {{ unregisteredNum }}
            </li>
            <li @click="handleEdit(warningRegistered)">{{ registeredNum }}</li>
            <li @click="handleEdit(warningDistributed)">
              {{ distributedNum }}
            </li>
            <li @click="handleEdit(warningUndisposed)">{{ undisposedNum }}</li>
            <li @click="handleEdit(warningDisposed)">{{ disposedNum }}</li>
            <li @click="handleEdit(warningVerified)">{{ verifiedNum }}</li>
          </ul>
          <ul>
            <li @click="handleEdit(warningReported)">已上报事件数</li>
            <li @click="handleEdit(warningUnregistered)">待立案事件数</li>
            <li @click="handleEdit(warningRegistered)">已立案事件数</li>
            <li @click="handleEdit(warningDistributed)">已派发事件数</li>
            <li @click="handleEdit(warningUndisposed)">待处置事件数</li>
            <li @click="handleEdit(warningDisposed)">已处置事件数</li>
            <li @click="handleEdit(warningVerified)">已核查事件数</li>
          </ul>
        </div>

        <el-dialog
          v-model="alarmEvent"
          title="普通事件统计分析"
          append-to-body="true"
        >
          <!-- <WarningThings style="width:100%" /> -->
          <div class="warning-header">{{ warningTitle }}事件数</div>
          <el-date-picker
            v-model="changeValue"
            type="daterange"
            unlink-panels
            range-separator="到"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            :disabled-date="disabledDate"
            :shortcuts="shortcuts"
            @change="changeDate"
            size="large"
            style="margin: 0.5rem 0 0.5rem"
          />
          <el-table
            :data="data_total.slice((currentPage - 1) * 10, currentPage * 10)"
            :size="large"
            width="100%"
            id="#vcfResult"
            :row-class-name="tableRowClassName"
          >
<!--            <el-table-column property="uuid" label="事件uuid" width="260">-->
<!--              <template #default="scope">-->
<!--                <el-tooltip-->
<!--                  class="item"-->
<!--                  effect="dark"-->
<!--                  content="点击查看事件详情"-->
<!--                  placement="top-start"-->
<!--                >-->
<!--                  <el-button-->
<!--                    size="medium"-->
<!--                    type="primary"-->
<!--                    link-->
<!--                    @click="warningDetail(scope.$index, scope.row)"-->
<!--                    >{{ scope.row.uuid }}-->
<!--                  </el-button>-->
<!--                </el-tooltip>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column property="event_no" label="事件编号" width="150" />-->
            <el-table-column property="event_no" label="事件编号" width="150">
              <template #default="scope">
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="点击查看事件详情"
                    placement="top-start"
                >
                  <el-button
                      size="medium"
                      type="primary"
                      link
                      @click="warningDetail(scope.$index, scope.row)"
                  >
                    {{ scope.row.event_no }}
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              property="event_name"
              label="事件名称"
              width="120"
            />
            <el-table-column
              property="event_time"
              label="事件发生时间"
              width="160"
            />
            <el-table-column
              property="map_info"
              label="事件发生地点"
              width="150"
            >
            </el-table-column>
            <el-table-column
              property="submit_time"
              label="事件登记时间"
              width="160"
            />
            <el-table-column
              property="handle_deadline"
              label="事件处理截至时间"
              width="160"
            />

            <el-table-column
              property="event_type_pid"
              label="事件类型编号"
              width="80"
            />
            <el-table-column property="tags" label="事件处理备注" width="150" />
          </el-table>
          <div class="float-end">
            <el-pagination
              background
              layout="->,total, prev, pager, next, jumper"
              :total="totalRecords"
              :current-page="currentPage"
              @current-change="getTransport"
            />
          </div>
          <div class="warning-header" style="padding-top: 30px">事件详情</div>
          <div
            class="warning-detail"
            style="padding-top: 20px; padding-left: 20px"
          >
            <ul style="display: inline-block">
<!--              <li>事件id：{{ id }}</li>-->
              <li>事件名称：{{ eventName }}</li>
              <li>事件来源：{{ eventSource }}</li>
              <li>事件类型：{{ eventType }}</li>
              <li>发生地点：{{ place }}</li>
              <li>地点纬度：{{ latitude }}</li>
              <li>地点经度：{{ longitude }}</li>
              <li>发生时间：{{ eventTime }}</li>
            </ul>
            <ul style="display: inline-block; padding-left: 40px">
              <li>所属街道：{{ street }}</li>
              <li>上报角色：{{ reportRole }}</li>
              <!-- <li>上报附件：{{uploadFiles}}</li> -->
              <li>事件描述：{{ eventDesc }}</li>
              <li>事件状态：{{ eventStatus }}</li>
              <li>更新时间：{{ updateTime }}</li>
              <li>事件等级：{{ eventLevel }}</li>
              <li>事件备注：{{ tags }}</li>
              <!-- <li>处置附件：{{handleFile}}</li> -->
              <li>事件编号：{{ eventNo }}</li>
            </ul>
          </div>
        </el-dialog>
      </div>
    </dv-border-box7>
  </div>
  <div class="content-r">
    <div class="container">
      <dv-border-box7 style="height: 46vh">
        <div dv-bg>
          <h5
            class="card-title"
            style="font-size: 25px; padding: 5px; text-align: center"
          >
            城市景观
          </h5>
          <div
            class="card-body"
            style="padding: 0px; height: 35vh; width: 100%"
          >
            <!-- <div id="hwzy-Charts" v-if="echart_index_hjws != 1" style="width: 25vw; height: 30vh;"></div> -->
            <!-- <div
              id="jgzm-Charts"
              v-show="echart_index_jgzm === 1"
              style="width: 25vw; height: 20vh"
            ></div> -->
            <div id="jgzm-Charts" v-show="echart_index_jgzm === 1"></div>
            <div class="no">
              <div
                class="no-header"
                style="
                  height: 1px;
                  border-top: 1px solid rgba(255, 255, 255, 0.2);
                  width: 85%;
                  margin: 0 auto;
                  margin-bottom: 10px;
                "
              ></div>
              <div class="no-hd">
                <ul>
<!--                  <li>{{ year_electricity }}</li>-->
<!--                  <li>{{ month_electricity }}</li>-->
<!--                  <li>{{ day_electricity }}</li>-->
                  <li>284台</li>
                  <li>36台</li>
                  <li>286栋</li>
                  <li>11处</li>
                </ul>
                <ul>
<!--                  <li>年电量统计</li>-->
<!--                  <li>月电量统计</li>-->
<!--                  <li>昨日电量统计</li>-->
                  <li>集中控制设备</li>
                  <li>视频监控设备</li>
                  <li>亮灯楼宇</li>
                  <li>亮灯桥梁及绿地</li>
                </ul>
              </div>
              <div
                class="no-header"
                style="
                  height: 1px;
                  border-top: 1px solid rgba(255, 255, 255, 0.2);
                  width: 85%;
                  margin: 0 auto;
                  margin-bottom: 10px;
                "
              ></div>
            </div>
            <div
              id="ggzp-Charts"
              v-show="echart_index_jgzm === 1"
              style="width: 25vw; height: 30vh"
            ></div>
          </div>
        </div>
      </dv-border-box7>
      <dv-border-box7 style="height: 46vh; margin-top: 2vh">
        <div dv-bg>
          <h5
            class="card-title"
            style="font-size: 25px; padding: 5px; text-align: center"
          >
            数字城管
          </h5>
          <div
            class="card-body"
            style="padding: 0px; height: 35vh; width: 100%"
          >
            <el-menu
              :default-active="activeIndex_jgzm"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect_szcg"
              style="width: 90%; margin: 0 auto"
              active-text-color="#ffd04b"
              background-color="#05103C"
              text-color="#fff"
            >
              <el-menu-item index="1">突出问题管家</el-menu-item>
              <el-menu-item index="2">城管AI识别管家</el-menu-item>
              <el-menu-item index="4">网络理政管家</el-menu-item>
              <el-menu-item index="3">数字化城市信息管家</el-menu-item>
            </el-menu>
            <!-- <div id="hwzy-Charts" v-if="echart_index_hjws != 1" style="width: 25vw; height: 30vh;"></div> -->
            <div
              id="tcwt-Charts"
              v-show="echart_index_szcg === 1"
              style="width: 24vw; height: 36vh; margin-left: 0px"
            ></div>
            <div
              id="ai-Charts"
              v-show="echart_index_szcg === 2"
              style="width: 25vw; height: 30vh"
            >
              <p
                class="demo-rich-content__mention"
                style="margin: 0; font-size: 18px; color: var(--el-color-info)"
              >
                @事件列表
              </p>
              <el-table
                :data="tcwtTableData"
                stripe
                style="width: 100%"
                max-height="500"
              >
                <el-table-column
                  prop="event_name"
                  label="事件名称"
                  width="80"
                />
                <el-table-column
                  prop="description"
                  label="问题描述"
                  width="80"
                />
                <el-table-column prop="creator" label="创建者" width="80" />
                <el-table-column
                  prop="modify_time"
                  label="确认时间"
                  width="120"
                />

                <el-table-column prop="tags" label="标签" />
              </el-table>
            </div>
            <div v-show="echart_index_szcg === 3">
              <div id="szcg-Charts" style="width: 25vw; height: 30vh"></div>
              <div style="width: 40%; margin: 0 auto">
                <el-pagination
                  layout="prev, pager, next"
                  :total="3"
                  background
                  text-color="#fff"
                  :page-size="1"
                  @current-change="changeSzcgChart"
                  small
                  :current-page="currentPageSzcg"
                />
              </div>
            </div>

            <div
              id="syd-Charts"
              v-show="echart_index_szcg === 4"
              style="width: 25vw; height: 30vh"
            ></div>
          </div>
        </div>
      </dv-border-box7>

      <!-- <div class="card text-white bg-success mb-3 ">
                <div class="card-header">市容严管街人员情况</div>
                <div class="card-body">

                    <ScrollBoard v-model:config="problemCount" style="width:25vw;height: 27vh;" />

                </div>

            </div> -->
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { ScrollBoard, DigitalFlop } from "@kjgl77/datav-vue3";
import { BorderBox6 as DvBorderBox6 } from "@kjgl77/datav-vue3";
import { BorderBox7 as DvBorderBox7 } from "@kjgl77/datav-vue3";
import { getQypjCg } from "@/api/szcg.js";
import { getMain } from "@/api/ggzp.js";
import { getMainXzzf } from "@/api/xzzf.js";
import { getMainJgzm } from "@/api/jgzm";

import * as echarts from "echarts";
import { getRdfx, getSjqsfx } from "@/api/szcg.js";
import { getCompanyDust, getOverSpeed } from "@/api/ycxt";
import { getTokenGxdc, getMainGxdc } from "@/api/gxdc";
import { getMainShlj } from "@/api/shlj";
import { getMainToilet } from "@/api/toilet";
import { getMainCclj } from "@/api/cclj";
import { params } from "@/store/store.js";
import {
  getMainLjz,
  getSum,
  getWarning,
  getStations,
  getLifecycle,
} from "@/api/ljz";
import {
  getOverStandard,
  getMonitor,
  getCompanyType,
  getTouSU,
} from "@/api/yyxt";
import { getCheckRate, getCntStatus } from "@/api/ddzh";
import { getToken, getMainSyd } from "@/api/syd";
import { getAllEvents, getResourceTcwt, getTrend } from "@/api/tcwt";

//=====================================================================sunny 告警事件

import moment from "moment";
import axios from "axios";

const warningReported = ref("上报");
const warningUnregistered = ref("待立案");
const warningRegistered = ref("立案");
const warningDistributed = ref("派发");
const warningDisposed = ref("处置");
const warningUndisposed = ref("待处置");
const warningVerified = ref("核查");
const reportedNum = ref(0);
const unregisteredNum = ref(0);
const registeredNum = ref(0);
const distributedNum = ref(0);
const disposedNum = ref(0);
const undisposedNum = ref(0);
const verifiedNum = ref(0);
const tcwtTableData = ref([]);

const id = ref("");
const eventName = ref("");
const eventSource = ref("");
const eventType = ref("");
const place = ref("");
const latitude = ref("");
const longitude = ref("");
const eventTime = ref("");
const gridName = ref("");
const reportRole = ref("");
// const uploadFiles = ref("");
const eventDesc = ref("");
const eventStatus = ref("");
// const handleFile = ref("");
const dealTime = ref("");
const verifyStatus = ref("");
const verifyOrg = ref("");
const verifyTime = ref("");
const eventNo = ref("");
const eventLevel = ref("");
const street = ref("");
const tags = ref("");
const updateTime = ref("");
const ddzh_tableData1 = ref([]);
const ycxt_tableData1 = ref([]);
const syd_data = ref([]);

// axios({
//     url: "/ddzh2/auth/login",
//     method: "post",
//     data: JSON.stringify({
//       phone: "18380195019",
//       password: "",
//     }),
// }).then(function (resp) {
//     console.log("ddzh2",resp)
//     var ddzh_token = resp.data.token;
//     axios({
//       url: "/ddzh2/patrol-status/status/rate_period",
//       method: "post",
//       data: JSON.stringify({
//         startDate: "2023-12-01 00:00:00",
//         endDate:"2023-12-01 23:59:59",
//         param: "2",
//       }),
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: ddzh_token,
//       },
//     }).then(function (resp) {
//       ddzh_tableData1.value = resp.data;
//       console.log("打卡率",resp);
//       echartInit_ddzh();
//     });

//   });
const stations_table = ref([]); //道路告警
// onBeforeMount(() => {
//   getMainSyd().then((data) => {
//     syd_data.value = data;
//     echartInit_syd();
//   });
//   getCheckRate().then((data) => {
//     ddzh_tableData1.value = data;
//     console.log(ddzh_tableData1.value);
//     echartInit_ddzh();
//   });

//   getCompanyDust().then((data) => {
//     ycxt_tableData1.value = data;
//   });
//   getAllEvents(today, tomorrow).then((data) => {
//     tcwtTableData.value = data;
//   });

//    getStations().then((data) => {
//       stations_table.value = data;
//      echartInit_ljz();
//       console.log(4172, stations_table.value.monitor_roads)
//     console.log(4171,stations_table.value);
//    });
//       getMainCclj().then((tableData) => {
//     ccljTodayWeight.value = Number(tableData[4].infoVal);
   
//     console.log(421,tableData[3].infoVal);
//     if (tableData[3].infoVal == "今日无数据【注意检查】") {
//       aflTodayWeight.value="无数据"
//     }else{
//       aflTodayWeight.value = Number(tableData[3].infoVal);
//     }
    
//     var cclj_option = {
//       title: {
//         text: "餐厨垃圾全生命周期管家管家",
//         textStyle: {
//           color: "#ccc",
//         },
//       },
//       tooltip: {
//         trigger: "axis",
//         axisPointer: {
//           type: "shadow",
//         },
//       },
//       xAxis: {
//         type: "category",
//         data: [
//           "年度收运量累积（吨）",
//           "当月收运量累积（吨）",
//           "当日收运量累积（吨）",
//         ],
//       },
//       yAxis: {
//         type: "value",
//       },
//       series: [
//         {
//           data: [
//             tableData[0].infoVal,
//             tableData[1].infoVal,
//             tableData[2].infoVal,
//           ],
//           type: "bar",
//           showBackground: true,
//           backgroundStyle: {
//             color: "rgba(180, 180, 180, 0.2)",
//           },
//         },
//       ],
//     };
//     window.onresize = function () {
//       mychar_cclj.resize();
//     };
//     mychar_cclj.setOption(cclj_option);
//   });
// });
 
const alarmEvent = ref(false);

let myChart_ljz1 = null;

const echartInit_ljz = () => {
  document
    .getElementById("cqcl-Charts")
    .removeAttribute("_echarts_instance_");
  myChart_ljz1 = echarts.init(document.getElementById("cqcl-Charts"));

     var cqcl_option = {
      title: {
        text: "道路情况",
        left: "center",
        textStyle: {
          color: "#ccc",
          fontSize: "15",
        },
        subtextStyle: {
          color: "#ccc",
          fontSize: "20",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          // 在 tooltip 中添加多行文本，包括标题和数值
          return "道路数 <br>" + params.name + "   " + params.value + "条";
        },
      },
      legend: {
        bottom: "0%",
        left: "left",
        textStyle: {
          color: "#ccc",
          fontSize: "12",
        },
        itemWidth: 20, // 设置颜色条的宽度
  itemHeight: 10, // 设置颜色条的高度
      },
      series: [
        {
          name: "道路数",
          type: "pie",
          radius: "80%",
          data: [
            {
              value:
                stations_table.value.monitor_roads -
                stations_table.value.unwork_roads,
              name: "已作业",
            },
            {
              value: stations_table.value.unwork_roads,
              name: "未作业",
            },
            {
              value: stations_table.value.unmonitor_roads,
              name: "未监测",
            },
            // { value: 111, name: 222 },
            // { value: 111, name: 34 },
          ],
          label: {
            normal: {
              show: false,
            },
            labelLine: {
              normal: {
                position: "inner",
                show: false,
              },
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
            },
            textStyle: {
              color: "#ccc",
              fontSize: "16",
            },
          },
        },
      ],
    };
  
  myChart_ljz1.setOption(cqcl_option);

};

onBeforeUnmount(() => {
  if (myChart_ljz1) {
    window.removeEventListener("resize", myChart_ljz1);
    myChart_ljz1.dispose();
    myChart_ljz1 = null;
  }
});
const echartInit_ddzh = () => {
  document.getElementById("ddzh-Charts").removeAttribute("_echarts_instance_");
  var myChart_ddzh1 = echarts.init(document.getElementById("ddzh-Charts"));

  var option1 = {
    title: {
      text: "打卡率统计",
      textStyle: {
        color: "#ccc",
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

        // 构建 tooltip 内容并换行显示
        return xAxisLabel + "<br>打卡率 " + dataValue + "%";
      },
    },
    yAxis: {
      type: "category",
      data: ddzh_tableData1.value.map(item => item.department),
      // data: [
      //   ddzh_tableData1.value[0].department,
      //   ddzh_tableData1.value[1].department,
      //   ddzh_tableData1.value[2].department,
      //   ddzh_tableData1.value[3].department,
      //   ddzh_tableData1.value[4].department,
      //   ddzh_tableData1.value[5].department,
      //   ddzh_tableData1.value[6].department,
      //   ddzh_tableData1.value[7].department,
      //   ddzh_tableData1.value[8].department,
      //   ddzh_tableData1.value[9].department,
      //   ddzh_tableData1.value[10].department,
      //   ddzh_tableData1.value[11].department,
      //   ddzh_tableData1.value[12].department,
      //   ddzh_tableData1.value[13].department,
      //   ddzh_tableData1.value[14].department,
      //   ddzh_tableData1.value[15].department,
      //   ddzh_tableData1.value[16].department,
      //   ddzh_tableData1.value[17].department,
      //   ddzh_tableData1.value[18].department,
      //   ddzh_tableData1.value[19].department,
      //   ddzh_tableData1.value[20].department,
      //   ddzh_tableData1.value[21].department,
      //   ddzh_tableData1.value[22].department,
      //   ddzh_tableData1.value[23].department,
      //   ddzh_tableData1.value[24].department,
      //   ddzh_tableData1.value[25].department,
      //   ddzh_tableData1.value[26].department,
      //   ddzh_tableData1.value[27].department,
      //   ddzh_tableData1.value[28].department,
      // ],
      axisLabel: {
        //x轴文字的配置
        show: true,
        interval: 0, //使x轴文字显示全
        rotate: 20,
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
      textStyle: {
        color: "white",
      },
    },
    xAxis: {
      type: "value",
    },
    series: [
      {
        barWidth: '10%',
        data: ddzh_tableData1.value.map(item => (item.checkRate * 100).toFixed(1)),
        // data: [
        //   (ddzh_tableData1.value[0].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[1].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[2].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[3].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[4].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[5].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[6].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[7].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[8].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[9].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[10].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[11].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[12].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[13].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[14].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[15].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[16].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[17].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[18].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[19].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[20].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[21].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[22].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[23].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[24].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[25].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[26].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[27].checkRate * 100).toFixed(1),
        //   (ddzh_tableData1.value[28].checkRate * 100).toFixed(1),
        // ],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
        emphasis: {
          focus: "series",
        },
        textStyle: {
          color: "white",
        },
        label: {
          show: true,
        },
      },
    ],
  };

  myChart_ddzh1.setOption(option1);
};
const echartInit_syd = () => {
  document.getElementById("syd-Charts").removeAttribute("_echarts_instance_");
  var myChart_syd2 = echarts.init(document.getElementById("syd-Charts"));

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
const data_total = reactive([]);
const queryCarNum = ref("");
let totalRecords = ref(1000);
let currentPage = ref(1);
let pageCount = 0;
let start = ref("");
let end = ref("");
const tomorrow = moment().add(+1, "d").format("YYYY-MM-DD");
const today = moment().format("YYYY-MM-DD");
let startTime = ref("2023-05-01");
let endTime = ref("2023-05-02");
let changeValue = ref([today, tomorrow]);
const warningTitle = ref("");

// 禁选今天以后的日期以及没有数据的
const disabledDate = (time) => {
  return (
    // time.getTime() < new Date("2022-8-31").getTime() ||
    time.getTime() > new Date().getTime()
  );
};

function changeDate() {
  console.log("changeDate:" + start + "sdf" + end);
  start =
    changeValue.value[0].getFullYear() +
    "-" +
    (changeValue.value[0].getMonth() + 1) +
    "-" +
    changeValue.value[0].getDate();
  end =
    changeValue.value[1].getFullYear() +
    "-" +
    (changeValue.value[1].getMonth() + 1) +
    "-" +
    changeValue.value[1].getDate();
  console.log("changeDate:" + start + "sdf" + end);
  getAllWarning(start, end, 1, warningTitle.value);
}

const getAllWarning = (startTime, endTime, pageNum, warningType) => {
  axios({
    url: "/api/event/getEventsByStatus",
    params: {
      status: warningType,
      startTime: startTime,
      endTime: endTime,
    },
    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      var data = resp.data.data;
      data_total.splice(0, data_total.length);
      for (var i in data) {
        console.log("modify_time:" + data[i].modify_time);
        var warningThings = {
          event_no: data[i].event_no,
          event_name: data[i].event_name,
          event_time: data[i].event_time,
          map_info: data[i].map_info,
          submit_time: data[i].submit_time,
          handle_deadline: data[i].handle_deadline,
          event_type_pid: data[i].event_type_pid,
          tags: data[i].tags,
          uuid: data[i].uuid,
        };
        data_total.push(warningThings);
      }
      console.log("数据长度：" + data.length);
      totalRecords.value = data_total.length;
      pageCount = parseInt(data_total.length) % 6;
      currentPage.value = pageNum;
    }
  });
};
getAllWarning(today, tomorrow, 1);

const getTransport = (pageNum) => {
  // 当前页
  currentPage.value = pageNum;
};

const handleEdit = (warningType) => {
  alarmEvent.value = true;
  warningTitle.value = warningType;
  changeValue.value[0] = today;
  changeValue.value[1] = tomorrow;
  getAllWarning(today, tomorrow, 1, warningType);
  latitude.value = "";
  eventSource.value = "";
  eventType.value = "";
  eventNo.value = "";
  // handleFile= data.handleFiles;
  eventDesc.value = "";
  eventLevel.value = "";
  eventStatus.value = "";
  reportRole.value = "";
  eventTime.value = "";
  eventName.value = "";
  id.value = "";
  place.value = "";
  longitude.value = "";
  // uploadFiles.value = "";
  // handleFile.value = "";
  tags.value = "";
  street.value = "";
  updateTime.value = "";
};

// 点击事件的uuid显示详细信息
const warningDetail = (index, row) => {
  var uuid = row.uuid;
  console.log("事件的uuid是：" + uuid);
  axios({
    url: "/api/event/getEventFromUuid",
    params: {
      uuid: uuid,
    },
    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      console.log(777, resp.data.data.data);
      var data = resp.data.data.data;

      // uploadFiles= data.uploadFiles;
      latitude.value = data.latitude;
      eventSource.value = data.eventSource;
      eventType.value = data.eventType1 + " " + data.eventType2;
      eventNo.value = data.eventNo;
      // handleFile= data.handleFiles;
      eventDesc.value = data.eventDesc;
      eventLevel.value = data.eventLevel;
      eventStatus.value = data.eventStatus;
      reportRole.value = data.reportRole;
      eventTime.value = data.eventTime;
      eventName.value = data.eventName;
      id.value = data.id;
      place.value = data.place;
      longitude.value = data.longitude;
      // uploadFiles.value = data.uploadFiles;
      // handleFile.value = data.handleFiles;
      tags.value = data.tags;
      street.value = data.street;
      updateTime.value = data.updateTime;

      console.log("数据长度：" + data.length);
      totalRecords.value = data_total.length;
      pageCount = parseInt(data_total.length) % 6;
      currentPage.value = pageNum;
    }
  });
};

//===================================================================================
const currentPageSzcg = ref(1);
const currentPageCyyy = ref(1);
const ccljTodayWeight = ref("");
const otherTodayWeight = ref(0);
const aflTodayWeight = ref("");
const year_electricity = ref(0);
const month_electricity = ref(0);
const day_electricity = ref(0);

var tableData_yyxt = [];
var tableData_szcg = [];
var tableData_ggzp = [];
var tableData_xzzf = [];
var tableData_jgzm = [];
var scroll_data_szcg_all = [];
const activeIndex_hjws = ref("1");
const activeIndex_srzx = ref("1");
const activeIndex_jgzm = ref("1");
const activeIndex_szcg = ref("1");

const echart_index_hjws = ref("1");
const echart_index_srzx = ref("1");
const echart_index_jgzm = ref("1");
const echart_index_szcg = ref("1");

const changeCyyyChart = (page) => {
  currentPageCyyy.value = page;
  if (currentPageCyyy.value === 1) {
    document
      .getElementById("cyyy-Charts")
      .removeAttribute("_echarts_instance_");
    var myChart_cyyy = echarts.init(document.getElementById("cyyy-Charts"));
    getOverStandard().then((tableData) => {
      const xLabels = tableData.map(item => item.areaname); // X轴类目
      const yValues = tableData.map(item => item.total);    // 每个柱子的高度
      var option_yyxt1 = {
        title: {
          text: "超标企业街道分布",
          textStyle: {
            color: "#ccc",
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

            // 构建 tooltip 内容并换行显示
            return xAxisLabel + "<br>超标企业 " + dataValue + "个";
          },
        },
        xAxis: {
          type: "category",
          data: xLabels,
          // data: [
          //   tableData[0].areaname,
          //   tableData[1].areaname,
          //   tableData[2].areaname,
          //   tableData[3].areaname,
          //   tableData[4].areaname,
          //   tableData[5].areaname,
          //   tableData[6].areaname,
          //   tableData[7].areaname,
          //   tableData[8].areaname,
          //   tableData[9].areaname,
          //   tableData[10].areaname,
          //   tableData[11].areaname,
          //   tableData[12].areaname,
          // ],
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
            data: yValues,
            // data: [
            //   tableData[0].value,
            //   tableData[1].value,
            //   tableData[2].value,
            //   tableData[3].value,
            //   tableData[4].value,
            //   tableData[5].value,
            //   tableData[6].value,
            //   tableData[7].value,
            //   tableData[8].value,
            //   tableData[9].value,
            //   tableData[10].value,
            //   tableData[11].value,
            //   tableData[12].value,
            // ],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      };
      myChart_cyyy.setOption(option_yyxt1);
    });
  }
  if (currentPageCyyy.value === 2) {
    getTouSU().then((resp) => {
      document
        .getElementById("cyyy-Charts")
        .removeAttribute("_echarts_instance_");
      var myChart_cyyy = echarts.init(document.getElementById("cyyy-Charts"));
      const raw = resp.tsList;

      // 封装成函数提取每年的数据
      const extractMonthlyCounts = (arr) =>
          arr.map((item) => item.count);

      const extractMonths = (arr) =>
          arr.map((item) => item.create_date.slice(5)); // 提取 "MM"

      const months = extractMonths(raw.tsLastTow); // 默认用 tsLastTow 来做 x 轴（即完整的12个月）

      const option_yyxt2 = {
        title: {
          text: "油烟投诉趋势图",
          textStyle: { color: "#ccc" },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          textStyle: { color: "#ccc" },
          data: ["2023", "2024", "2025"],
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
          data: months, // ["01", "02", ..., "12"]
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "2023",
            type: "line",
            data: extractMonthlyCounts(raw.tsLastTow),
          },
          {
            name: "2024",
            type: "line",
            data: extractMonthlyCounts(raw.tsLast),
          },
          {
            name: "2025",
            type: "line",
            data: extractMonthlyCounts(raw.tsLastNow),
          },
        ],
      };
      myChart_cyyy.setOption(option_yyxt2);
    });
  }
  if (currentPageCyyy.value === 3) {
    document
      .getElementById("cyyy-Charts")
      .removeAttribute("_echarts_instance_");
    var myChart_cyyy = echarts.init(document.getElementById("cyyy-Charts"));
    getMonitor().then((tableData) => {
      var option_yyxt3 = {
        title: {
          text: "餐饮企业监控级别",
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
              { value: tableData.monitoring_level_c, name: "常态" },
              { value: tableData.monitoring_level_g, name: "一般" },
              { value: tableData.monitoring_level_p, name: "重点" },
              // { value: 484, name: 'Union Ads' },
              // { value: 300, name: 'Video Ads' }
            ],
          },
        ],
      };
      myChart_cyyy.setOption(option_yyxt3);
    });
  }
  if (currentPageCyyy.value === 4) {
    getCompanyType().then((data) => {
      document
        .getElementById("cyyy-Charts")
        .removeAttribute("_echarts_instance_");
      var myChart_cyyy = echarts.init(document.getElementById("cyyy-Charts"));
      var option_yyxt4 = {
        title: {
          text: "餐饮企业类型分布",
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
              { value: data[0].num, name: data[0].sub_text },
              { value: data[1].num, name: data[1].sub_text },
              { value: data[2].num, name: data[2].sub_text },
              { value: data[3].num, name: data[3].sub_text },
              { value: data[4].num, name: data[4].sub_text },
              { value: data[5].num, name: data[5].sub_text },
              { value: data[6].num, name: data[6].sub_text },

              // { value: 484, name: 'Union Ads' },
              // { value: 300, name: 'Video Ads' }
            ],
          },
        ],
      };
      myChart_cyyy.setOption(option_yyxt4);
    });
  }
};
const changeSzcgChart = (page) => {
  currentPageSzcg.value = page;
  if (currentPageSzcg.value === 1) {
    console.log(currentPageSzcg.value);
    document
      .getElementById("szcg-Charts")
      .removeAttribute("_echarts_instance_");
    var myChart_szcg = echarts.init(document.getElementById("szcg-Charts"));

    getRdfx().then((data) => {
      var option2 = {
        title: {
          text: "热点分析",
          textStyle: {
            color: "#ccc",
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["立案", "结案"],
          textStyle: {
            color: "#ccc",
          },
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            // prettier-ignore
            data: [data[0].sub_type_name, data[1].sub_type_name, data[2].sub_type_name, data[3].sub_type_name, data[4].sub_type_name, data[5].sub_type_name, data[6].sub_type_name, data[7].sub_type_name, data[8].sub_type_name,],
          },
        ],
        yAxis: [
          {
            type: "value",
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
      myChart_szcg.setOption(option2);
      // window.onresize = function () {
      //   myChart_szcg.resize();
      // };
    });
  }
  if (currentPageSzcg.value === 2) {
    console.log(currentPageSzcg.value);

    document
      .getElementById("szcg-Charts")
      .removeAttribute("_echarts_instance_");
    var myChart_szcg = echarts.init(document.getElementById("szcg-Charts"));

    getSjqsfx().then((dataTable) => {
      var option4 = {
        title: {
          textStyle: {
            color: "#ccc",
          },
          text: "事件趋势分析",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          textStyle: {
            color: "#ccc",
          },
          data: [
            dataTable[0].type,
            dataTable[1].type,
            dataTable[2].type,
            dataTable[3].type,
          ],
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
          axisLabel: { interval: 0 },
          type: "category",
          boundaryGap: false,
          data: [
            dataTable[0].rq,
            dataTable[4].rq,
            dataTable[8].rq,
            dataTable[12].rq,
            dataTable[16].rq,
            dataTable[20].rq,
            dataTable[24].rq,
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: dataTable[0].type,
            type: "line",
            stack: "Total",
            data: [
              dataTable[0].value,
              dataTable[4].value,
              dataTable[8].value,
              dataTable[12].value,
              dataTable[16].value,
              dataTable[20].value,
              dataTable[24].value,
            ],
          },
          {
            name: dataTable[1].type,
            type: "line",
            stack: "Total",
            data: [
              dataTable[1].value,
              dataTable[5].value,
              dataTable[9].value,
              dataTable[13].value,
              dataTable[17].value,
              dataTable[21].value,
              dataTable[25].value,
            ],
          },
          {
            name: dataTable[2].type,
            type: "line",
            stack: "Total",
            data: [
              dataTable[2].value,
              dataTable[6].value,
              dataTable[10].value,
              dataTable[14].value,
              dataTable[18].value,
              dataTable[22].value,
              dataTable[26].value,
            ],
          },
          {
            name: dataTable[3].type,
            type: "line",
            stack: "Total",
            data: [
              dataTable[3].value,
              dataTable[7].value,
              dataTable[11].value,
              dataTable[15].value,
              dataTable[19].value,
              dataTable[23].value,
              dataTable[27].value,
            ],
          },
        ],
      };
      myChart_szcg.setOption(option4);
      window.onresize = function () {
        myChart_szcg.resize();
      };
    });
  }
  if (currentPageSzcg.value === 3) {
    console.log(currentPageSzcg.value);

    document
      .getElementById("szcg-Charts")
      .removeAttribute("_echarts_instance_");
    var myChart_szcg = echarts.init(document.getElementById("szcg-Charts"));

    var option3 = {
      title: {
        text: "来源分析",
        textStyle: {
          color: "#ccc",
        },
        left: "5%",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        right: "5%",
        textStyle: {
          color: "white",
        },
      },
      series: [
        {
          name: "来源",
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
            { value: 54, name: "巡查上报" },
            { value: 12, name: "视频上报" },
            { value: 13, name: "自报自处" },
            // { value: 484, name: 'Union Ads' },
            // { value: 300, name: 'Video Ads' }
          ],
        },
      ],
    };
    myChart_szcg.setOption(option3);
    window.onresize = function () {
      myChart_szcg.resize();
    };
  }
};
const handleSelect_srzx = (key, keypath) => {
  if (key === "1") {
    echart_index_srzx.value = 1;
    document
      .getElementById("cyyy-Charts")
      .removeAttribute("_echarts_instance_");
    var myChart_cyyy = echarts.init(document.getElementById("cyyy-Charts"));
    getOverStandard().then((tableData) => {
      var option_yyxt1 = {
        title: {
          text: "超标企业街道分布",
          textStyle: {
            color: "#ccc",
          },
          left: "5%",
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
          axisLabel: {
            interval: 0,
            formatter: function (value) {
              return value.split("").join("\n");
            },
          },
        },

        yAxis: {
          type: "value",
        },
        axisTick: {
          alignWithLabel: true,
        },
        grid: { left: "2%", bottom: "10%", containLabel: true },
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
      myChart_cyyy.setOption(option_yyxt1);
    });
  }
  if (key == "2") {
    echart_index_srzx.value = 2;
  }
  if (key == "3") {
    echart_index_srzx.value = 3;
  }
  if (key == "4") {
    echart_index_srzx.value = 4;
    var myChart_gxdc = echarts.init(document.getElementById("gxdc-Charts"));
    getMainGxdc().then((gxdcData) => {
      var option_gxdc1 = {
        title: {
          text: "单车统计",
          textStyle: {
            color: "#ccc",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            // 在 tooltip 中添加多行文本，包括标题和数值
            return "单车<br>" + params.name + "   " + params.value + "辆";
          },
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
              // { value: gxdcData[2].infoVal, name: "正常停放车辆" },
              // { value: gxdcData[1].infoVal, name: "异常停放车辆" },
              // { value: gxdcData[3].infoVal, name: "行驶中车辆" },
              { value: gxdcData[0].infoVal, name: "P点总数" },
              { value: gxdcData[1].infoVal, name: "单车总数" },
              { value: gxdcData[2].infoVal, name: "骑行中数量" },
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
  if (key == "5") {
    echart_index_srzx.value = 5;
  }
};
const handleSelect_szcg = (key, keypath) => {
  if (key === "1") {
    console.log("来到这里：" + key);

    getTrend().then((data) => {
      var myChart_tcwt = echarts.init(document.getElementById("tcwt-Charts"));

      echart_index_szcg.value = 1;
      var option = {
        title: {
          text: "事件趋势分析",
          textStyle: {
            color: "#ccc",
          },
        },
        //这里的yAxis就是竖轴，xAxis就是横轴
        // yAxis and xAxis 交换可以改变横向或竖向
        xAxis: {
          data: data.map((item) => item.type),
        },
        yAxis: {},
        // 数据的来源
        series: [
          {
            name: "source",
            // bar就是柱状图
            type: "bar",
            color: "#dd6b66",
            // 数据
            data: data.map((item) => item.lian_value),
          },
        ],
      };
      myChart_tcwt.setOption(option);
      window.onresize = function () {
        myChart_cyyy.resize();
      };
    });
  }
  if (key === "2") {
    echart_index_szcg.value = 2;
  }
  if (key === "3") {
    echart_index_szcg.value = 3;

    var myChart_szcg = echarts.init(document.getElementById("szcg-Charts"));

    getRdfx().then((data) => {
      var option2 = {
        title: {
          text: "热点分析",
          textStyle: {
            color: "#ccc",
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["立案", "结案"],
          textStyle: {
            color: "#ccc",
          },
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            // prettier-ignore
            data: [data[0].sub_type_name, data[1].sub_type_name, data[2].sub_type_name, data[3].sub_type_name, data[4].sub_type_name, data[5].sub_type_name, data[6].sub_type_name, data[7].sub_type_name, data[8].sub_type_name,],
          },
        ],
        yAxis: [
          {
            type: "value",
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
      myChart_szcg.setOption(option2);
      window.onresize = function () {
        myChart_szcg.resize();
      };
    });
  }
  if (key === "4") {
    echart_index_szcg.value = 4;
  }
};
const handleSelect_jgzm = (key, keyPath) => {
  if (key === "1") {
    echart_index_jgzm.value = 1;
    //document.getElementById("hwzy-Charts").removeAttribute("_echarts_instance_");

    var myChart_jgzm1 = echarts.init(document.getElementById("jgzm-Charts"));

    getMainJgzm().then((data) => {
      console.log(data);
      var option_jgzm1 = {
        title: {
          text: "用电量统计",
          textStyle: {
            color: "#ccc",
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
          data: ["昨日电量统计", "月电量统计", "年电量统计"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [data[1].infoVal, data[2].infoVal, data[3].infoVal],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      };
      myChart_jgzm1.setOption(option_jgzm1);
      window.onresize = function () {
        myChart_jgzm1.resize();
      };
    });
  } else if (key === "2") {
    echart_index_jgzm.value = 2;
    var myChart_ljdp1 = echarts.init(document.getElementById("ggzp-Charts"));
    getMain().then((data) => {
      var option_ljdp1 = {
        title: {
          text: "巡检店铺数量",
          textStyle: {
            color: "#ccc",
          },
          left: "4%",
        },
        tooltip: {
          trigger: "item",
        },
        // color:["#83b86a","#4C65B3","#E1B44F"],
        legend: {
          top: "0%",
          right: "right",
          textStyle: {
            color: "white",
          },
        },
        series: [
          {
            name: "店铺",
            type: "pie",
            top: "0%",
            radius: ["40%", "60%"],
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
              { value: data[0].infoVal, name: "零售类店铺数量" },
              { value: data[3].infoVal, name: "餐饮类店铺数量" },
              { value: data[1].infoVal, name: "服务类店铺数量" },
              { value: data[2].infoVal, name: "其他行业店铺数量" },
              // { value: data[3].infoVal, name: "总店铺数量" },
              // { value: data[0].infoVal, name: "巡检店铺数量" },
              // { value: data[2].infoVal, name: "未办证数量" },
              // { value: 580, name: 'Email' },
              // { value: 484, name: 'Union Ads' },
              // { value: 300, name: 'Video Ads' }
            ],
          },
        ],
      };
      myChart_ljdp1.setOption(option_ljdp1);
      window.onresize = function () {
        myChart_ljdp1.resize();
      };
    });
  }
};
// const handleSelect_hjws = (key, keyPath) => {
//   console.log(key, keyPath);
//   if (key === "1") {
//     echart_index_hjws.value = 1;
//     //document.getElementById("hwzy-Charts").removeAttribute("_echarts_instance_");

//     var mychar_hjws = echarts.init(document.getElementById("hwzy-Charts"));
//     var hjws_option = {
//       title: {
//         text: "环卫作业运行管家",
//         textStyle: {
//           color: "#ccc",
//         },
//       },
//       tooltip: {
//         trigger: "axis",
//         axisPointer: {
//           type: "shadow",
//         },
//       },
//       xAxis: {
//         type: "category",
//         data: ["出勤车辆", "总车辆"],
//       },
//       yAxis: {
//         type: "value",
//       },
//       series: [
//         {
//           data: [141, 145],
//           type: "bar",
//           showBackground: true,
//           backgroundStyle: {
//             color: "rgba(180, 180, 180, 0.2)",
//           },
//         },
//       ],
//     };
//     window.onresize = function () {
//       mychar_hjws.resize();
//     };
//     mychar_hjws.setOption(hjws_option);
//   } else if (key === "2") {
//     echart_index_hjws.value = 2;
//     var mychar_cclj = echarts.init(document.getElementById("cclj-Charts"));
//     getMainCclj().then((tableData) => {
//       var cclj_option = {
//         title: {
//           text: "餐厨垃圾全生命周期管家管家",
//           textStyle: {
//             color: "#ccc",
//           },
//         },
//         tooltip: {
//           trigger: "axis",
//           axisPointer: {
//             type: "shadow",
//           },
//         },
//         xAxis: {
//           type: "category",
//           data: [
//             "年度收运量累积(吨)",
//             "当月收运量累积(吨)",
//             "当日收运量累积(吨)",
//           ],
//         },
//         yAxis: {
//           type: "value",
//         },
//         series: [
//           {
//             data: [
//               tableData[0].infoVal,
//               tableData[1].infoVal,
//               tableData[2].infoVal,
//             ],
//             type: "bar",
//             showBackground: true,
//             backgroundStyle: {
//               color: "rgba(180, 180, 180, 0.2)",
//             },
//           },
//         ],
//       };
//       window.onresize = function () {
//         mychar_cclj.resize();
//       };
//       mychar_cclj.setOption(cclj_option);
//     });
//   } else if (key === "3") {
//     echart_index_hjws.value = 3;
//     var mychar_shlj = echarts.init(document.getElementById("shlj-Charts"));
//     getMainShlj().then((tableData) => {
//       var data1 = tableData[1].infoVal;
//       data1 = data1.substr(0, data1.length - 1) * 1;
//       var data2 = tableData[2].infoVal;
//       data2 = data2.substr(0, data2.length - 1) * 1;
//       var shlj_option = {
//         title: {
//           text: "金牛区垃圾净重",
//           subtext: "大站分布",
//           left: "center",
//           textStyle: {
//             color: "#ccc",
//             fontSize: "26",
//           },
//           subtextStyle: {
//             color: "#ccc",
//             fontSize: "20",
//           },
//         },
//         tooltip: {
//           trigger: "item",
//         },
//         legend: {
//           orient: "vertical",
//           left: "left",
//           textStyle: {
//             color: "#ccc",
//             fontSize: "16",
//           },
//         },
//         series: [
//           {
//             name: "站点名",
//             type: "pie",
//             radius: "70%",
//             data: [
//               { value: data1, name: "西华垃圾站数据" },
//               { value: data2, name: "红星垃圾站数据" },
//             ],
//             emphasis: {
//               itemStyle: {
//                 shadowBlur: 10,
//                 shadowOffsetX: 0,
//               },
//               textStyle: {
//                 color: "#ccc",
//                 fontSize: "16",
//               },
//             },
//           },
//         ],
//       };
//       window.onresize = function () {
//         mychar_shlj.resize();
//       };
//       mychar_shlj.setOption(shlj_option);
//     });
//   }
// };
onMounted(() => {
  //===========================================sunny 告警事件
  console.log(111, today);
  console.log(222, tomorrow);
   getStations().then((data) => {
      stations_table.value = data;
     echartInit_ljz();
      console.log(4172, stations_table.value.monitor_roads)
    console.log(4171,stations_table.value);
    });
  axios({
    url: "/api/event/getEventsStatusNum",
    params: {
      startTime: today,
      endTime: tomorrow,
    },
    method: "get",
  }).then(function (resp) {
    console.log(555, resp);
    if (resp.status == 200) {
      var data = resp.data.data;

      (unregisteredNum.value = data.待立案),
        (registeredNum.value = data.已立案),
        (reportedNum.value = data.已上报),
        (distributedNum.value = data.已派发),
        (undisposedNum.value = data.待处置),
        (disposedNum.value = data.已处置),
        (verifiedNum.value = data.已核查),
        console.log("数据长度：" + data.length);
      totalRecords.value = data_total.length;
      pageCount = parseInt(data_total.length) % 10;
      // currentPage.value = pageNum;
    }
  });



  //=====================================================
  echart_index_hjws.value = 1;
  echart_index_jgzm.value = 1;
  echart_index_srzx.value = 1;
  //document.getElementById("hwzy-Charts").removeAttribute("_echarts_instance_");
  echart_index_szcg.value = 1;
  var mychar_cclj = echarts.init(document.getElementById("cclj-Charts"));
  var mychar_shlj = echarts.init(document.getElementById("shlj-Charts"));
  var mychar_cqcl = echarts.init(document.getElementById("cqcl-Charts"));
  getMain().then((data) => {
    var myChart_ljdp1 = echarts.init(document.getElementById("ggzp-Charts"));

    var option_ljdp1 = {
      title: {
        text: "巡检店铺数量",
        textStyle: {
          color: "#ccc",
        },
        left: "4%",
      },
      tooltip: {
        trigger: "item",
      },
      // color:["#83b86a","#4C65B3","#E1B44F"],
      legend: {
        top: "0%",
        right: "right",
        textStyle: {
          color: "white",
        },
      },
      series: [
        {
          name: "店铺",
          type: "pie",
          top: "0%",
          radius: ["40%", "60%"],
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
            { value: data[0].infoVal, name: "零售类店铺数量" },
            { value: data[3].infoVal, name: "餐饮类店铺数量" },
            { value: data[1].infoVal, name: "服务类店铺数量" },
            { value: data[2].infoVal, name: "其他行业店铺数量" },
            // { value: data[3].infoVal, name: "总店铺数量" },
            // { value: data[0].infoVal, name: "巡检店铺数量" },
            // { value: data[2].infoVal, name: "未办证数量" },
            // { value: 580, name: 'Email' },
            // { value: 484, name: 'Union Ads' },
            // { value: 300, name: 'Video Ads' }
          ],
        },
      ],
    };
    myChart_ljdp1.setOption(option_ljdp1);
    window.onresize = function () {
      myChart_ljdp1.resize();
    };
  });

  // const stations_table = ref([]); //道路告警
  // getStations().then((data) => {
  //   console.log(4172,data);
  //   var stations_table = data;
    
  //   console.log(666,params.hwzyToken)
  //   // echartInit_ljz();
  //   console.log(4171, stations_table);
  //   var cqcl_option = {
  //     title: {
  //       text: "车辆出勤情况",
  //       left: "center",
  //       textStyle: {
  //         color: "#ccc",
  //         fontSize: "15",
  //       },
  //       subtextStyle: {
  //         color: "#ccc",
  //         fontSize: "20",
  //       },
  //     },
  //     tooltip: {
  //       trigger: "item",
  //       formatter: function (params) {
  //         // 在 tooltip 中添加多行文本，包括标题和数值
  //         return "出勤车辆 <br>" + params.name + "   " + params.value + "辆";
  //       },
  //     },
  //     legend: {
  //       bottom: "0%",
  //       left: "left",
  //       textStyle: {
  //         color: "#ccc",
  //         fontSize: "3",
  //       },
  //     },
  //     series: [
  //       {
  //         name: "出勤车辆",
  //         type: "pie",
  //         radius: "80%",
  //         data: [
  //           {
  //             value:
  //               stations_table.monitor_roads -
  //               stations_table.unwork_roads,
  //             name: "今日已作业道路数",
  //           },
  //           {
  //             value: stations_table.unwork_roads,
  //             name: "今日未作业道路数",
  //           },
  //           {
  //             value: stations_table.unmonitor_roads,
  //             name: "未监测道路数",
  //           },
  //           // { value: 111, name: 222 },
  //           // { value: 111, name: 222 },
  //         ],
  //         label: {
  //           normal: {
  //             show: false,
  //           },
  //           labelLine: {
  //             normal: {
  //               position: "inner",
  //               show: false,
  //             },
  //           },
  //         },
  //         emphasis: {
  //           itemStyle: {
  //             shadowBlur: 10,
  //             shadowOffsetX: 0,
  //           },
  //           textStyle: {
  //             color: "#ccc",
  //             fontSize: "16",
  //           },
  //         },
  //       },
  //     ],
  //   };
  //   window.onresize = function () {
  //     mychar_cqcl.resize();
  //   };
  //   mychar_cqcl.setOption(cqcl_option);
  // });
  getMainToilet().then((tableData) => {
    var data1 = tableData[3].infoVal;
    var data2 = tableData[4].infoVal;
    var data3 = tableData[5].infoVal;
    var shlj_option = {
      title: {
        text: "厕所客流量情况",
        left: "center",
        textStyle: {
          color: "#ccc",
          fontSize: "15",
        },
        subtextStyle: {
          color: "#ccc",
          fontSize: "20",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          // 在 tooltip 中添加多行文本，包括标题和数值
          return "客流量 <br>" + params.name + "   " + params.value + "人";
        },
      },
      color: ["#E0847F", "#CD8BECA9", "yellow"],
      legend: {
        bottom: "0%",
        left: "left",
  
        textStyle: {
          color: "#ccc",
          fontSize: "12",
        },
        itemWidth: 20, // 设置颜色条的宽度
  itemHeight: 10, // 设置颜色条的高度
      },
      series: [
        {
          name: "站点名",
          type: "pie",
          radius: "80%",

          data: [
            { value: data1, name: "男卫生间" },
            { value: data2, name: "女卫生间" },
            { value: data3, name: "第三卫生间" },
          ],

          label: {
            normal: {
              show: false,
            },
            labelLine: {
              normal: {
                position: "inner",
                show: false,
              },
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
            },
            textStyle: {
              color: "#ccc",
              fontSize: "16",
            },
          },
        },
      ],
    };

    window.onresize = function () {
      mychar_shlj.resize();
      // mychar_cqcl.resize();
    };
    mychar_shlj.setOption(shlj_option);
    // mychar_cqcl.setOption(cqcl_option);
  });
  getMainLjz().then((tableData) => {
    console.log(4211,tableData[0])
   otherTodayWeight.value = tableData[0].infoVal;
})
  getMainCclj().then((tableData) => {
    ccljTodayWeight.value = tableData[4].infoVal;
   
    console.log(421,tableData[3].infoVal);
    if (tableData[3].infoVal == "今日无数据【注意检查】") {
      aflTodayWeight.value="无数据"
    }else{
      aflTodayWeight.value = tableData[3].infoVal;
    }
    
    var cclj_option = {
      title: {
        text: "餐厨垃圾全生命周期管家管家",
        textStyle: {
          color: "#ccc",
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
          "年度收运量累积（吨）",
          "当月收运量累积（吨）",
          "当日收运量累积（吨）",
        ],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [
            tableData[0].infoVal,
            tableData[1].infoVal,
            tableData[2].infoVal,
          ],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    window.onresize = function () {
      mychar_cclj.resize();
    };
    mychar_cclj.setOption(cclj_option);
  });

  getOverStandard().then((tableData) => {
    document
      .getElementById("cyyy-Charts")
      .removeAttribute("_echarts_instance_");
    var myChart_cyyy = echarts.init(document.getElementById("cyyy-Charts"));
    const xLabels = tableData.map(item => item.areaname); // X轴类目
    const yValues = tableData.map(item => item.total);    // 每个柱子的高度
    var option_yyxt1 = {
      title: {
        text: "超标企业街道分布",
        textStyle: {
          color: "#ccc",
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
        data: xLabels,
        // data: [
        //   tableData[0].areaname,
        //   tableData[1].areaname,
        //   tableData[2].areaname,
        //   tableData[3].areaname,
        //   tableData[4].areaname,
        //   tableData[5].areaname,
        //   tableData[6].areaname,
        //   tableData[7].areaname,
        //   tableData[8].areaname,
        //   tableData[9].areaname,
        //   tableData[10].areaname,
        //   tableData[11].areaname,
        //   tableData[12].areaname,
        // ],
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
          data: yValues,
          // data: [
          //   tableData[0].value,
          //   tableData[1].value,
          //   tableData[2].value,
          //   tableData[3].value,
          //   tableData[4].value,
          //   tableData[5].value,
          //   tableData[6].value,
          //   tableData[7].value,
          //   tableData[8].value,
          //   tableData[9].value,
          //   tableData[10].value,
          //   tableData[11].value,
          //   tableData[12].value,
          // ],
          type: "bar",
          barWidth: '10%',
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    myChart_cyyy.setOption(option_yyxt1);
  });
  var myChart_jgzm1 = echarts.init(document.getElementById("jgzm-Charts"));

  getMainJgzm().then((data) => {
    year_electricity.value = data[3].infoVal;
    month_electricity.value = data[2].infoVal;
    day_electricity.value = data[1].infoVal;
    console.log(data);
    var option_jgzm1 = {
      title: {
        text: "用电量统计",
        textStyle: {
          color: "#ccc",
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
        data: ["昨日电量统计", "月电量统计", "年电量统计"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [data[1].infoVal, data[2].infoVal, data[3].infoVal],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    myChart_jgzm1.setOption(option_jgzm1);
    window.onresize = function () {
      myChart_jgzm1.resize();
    };
  });
  // var mychar_hjws = echarts.init(document.getElementById("hwzy-Charts"));
  // var hjws_option = {
  //   title: {
  //     text: "环卫作业运行管家",
  //     textStyle: {
  //       color: "#ccc",
  //     },
  //   },
  //   xAxis: {
  //     type: "category",
  //     data: ["出勤车辆", "总车辆"],
  //   },
  //   yAxis: {
  //     type: "value",
  //   },
  //   series: [
  //     {
  //       data: [141, 145],
  //       type: "bar",
  //       showBackground: true,
  //       backgroundStyle: {
  //         color: "rgba(180, 180, 180, 0.2)",
  //       },
  //     },
  //   ],
  // };
  // window.onresize = function () {
  //   mychar_hjws.resize();
  // };
  // mychar_hjws.setOption(hjws_option);

  getTrend().then((data) => {
    var myChart_tcwt = echarts.init(document.getElementById("tcwt-Charts"));

    echart_index_szcg.value = 1;
    var option = {
      title: {
        text: "事件趋势分析",
        textStyle: {
          color: "#ccc",
        },
      },
      tooltip: {
        trigger: "item",
      },
      //这里的yAxis就是竖轴，xAxis就是横轴
      // yAxis and xAxis 交换可以改变横向或竖向
      xAxis: {
        axisLabel: {
          //x轴文字的配置
          show: true,
          interval: 0, //使x轴文字显示全
          rotate: 20,
        },
        data: data.map((item) => item.type),
      },
      yAxis: {},
      // 数据的来源
      series: [
        {
          name: "来源",
          // bar就是柱状图
          type: "bar",
          color: "#dd6b66",
          label: {
            show: true,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 35,
              fontWeight: "bold",
            },
          },
          // 数据
          data: data.map((item) => item.lian_value),
        },
      ],
    };
    myChart_tcwt.setOption(option);
    window.onresize = function () {
      myChart_cyyy.resize();
    };
  });
});

  onBeforeMount(() => {
  getMainSyd().then((data) => {
    syd_data.value = data;
    echartInit_syd();
  });
  getCheckRate().then((data) => {
    ddzh_tableData1.value = data;
    console.log(ddzh_tableData1.value);
    echartInit_ddzh();
  });

  getCompanyDust().then((data) => {
    ycxt_tableData1.value = data;
  });
  getAllEvents(today, tomorrow).then((data) => {
    tcwtTableData.value = data;
  });

   getStations().then((data) => {
      stations_table.value = data;
     echartInit_ljz();
      console.log(4172, stations_table.value.monitor_roads)
    console.log(4171,stations_table.value);
   });

});

// const config = reactive({
//   header: ['街道', '立案数', '处置数', '结案数', '结案率'],
//   headerHeight: 25,

//   align: ['center'],
//   rowNum: 4,
//   columnWidth: [200, 100, 100, 100, 100, 100],
//   headerBGC: '#006400',
//   oddRowBGC: '#3CB371',
//   evenRowBGC: '#8FBC8F',
//   data: [

//   ],

// })
// const config_ggzp = reactive({
//   data: [

//   ],
//   colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
//   unit: '店铺'
// })
// const config_yyxt = reactive({
//   data: [

//     {
//       name: '餐饮业',
//       value: 167
//     },
//     {
//       name: '零售业',
//       value: 123
//     },
//   ], showValue: true,

// })
// const config_xzzf = reactive({
//   data: [

//   ],
//   colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
//   unit: '案件'

// })
// const config_jgzm = reactive({
//   title: {
//     text: '耗电区域占比图'
//   },
//   series: [
//     {
//       type: 'pie',
//       data: [

//       ],
//       insideLabel: {
//         show: true
//       }
//     }
//   ]
// })
</script>

<style lang="scss" scoped>
/* .content {
    position: absolute;
    top: 7vh;

    display: flex;
    z-index: 20;
} */

.content-l {
  left: 0;

  width: 25vw;
  padding: 3vh;
  display: flex;
  flex-direction: column;
  height: 93vh;
  position: absolute;
  z-index: 10;
  user-select: none;
  color: white;
  /* background-color: #2a2a2a; */
  background-image: url("/public/images/bg.jpg");

  opacity: 0.9;
}

/* .content-l-top {
  height: 150px;
} */

.content_middle_top {
  left: 28vw;

  width: 40.7vw;
  height: 14vh;
  padding: 3vh;
  display: flex;
  flex-direction: column;

  position: absolute;
  z-index: 40;
  user-select: none;
  color: white;
  /* background-color: #2a2a2a; */
  background-image: url("/public/images/bg.jpg");

  opacity: 0.9;
}

/* .content-mid {

  left: 23vw;
  width: 44.4vw;
  height: 6vh;
  background-color: #2a2a2a;
  position: absolute;
  z-index: 20;
  display: flex;
  flex-flow: wrap;
  user-select: none;
  opacity: 0.7;
  color: white;

} */

.content-r {
  right: 0;
  width: 25vw;
  /* background-color: rgba(0, 11, 61, 0.5); */
  background-image: url("/public/images/bg.jpg");
  padding-left: 3vh;
  padding-top: 3vh;
  padding-bottom: 3vh;
  padding-right: 3vh;
  display: flex;
  flex-direction: column;
  height: 93vh;
  position: absolute;
  z-index: 10;
  user-select: none;
  opacity: 0.9;
  color: white;
}

.person-box {
  margin-right: 10px;
  width: 10vw;
  height: 15vh;
  --bs-bg-opacity: 0.2;
}

.person-title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin-right: 30px;
  text-align: center;
}

.person-number {
  font-size: 30px;
  text-align: center;
}

:deep(.DigitalFlop) {
  width: 25vw;
}

.no {
  width: 100%;
  padding: 10px;
}

.no-hd {
  padding: 5px;
  position: relative;
  /* border:1px solid rgb(25,186,139); */
}

.no-hd ul {
  display: flex;
}

li {
  list-style: none;
}

.no-hd li {
  position: relative;
  flex: 1;
  line-height: 2rem;
  font-size: 1.5rem;
  color: #fff;
  font-family: heiti;
  text-align: center;
}

.no-hd ul:nth-child(2) li {
  font-size: 0.6rem;
}

.no-hd ul:nth-child(1) li::after {
  position: absolute;
  top: 25%;
  right: 0;
  height: 50%;
  content: "";
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.no-hd ul:nth-child(1) li:nth-child(3)::after {
  content: "";
  position: absolute;
  top: 25%;
  right: 0;
  height: 50%;
  width: 0px;
  background: rgba(255, 255, 255, 0.2);
}

.no-md {
  padding: 0px;
  position: relative;
  /* border:1px solid rgb(25,186,139); */
}

.no-md ul {
  display: flex;
}

.no-md li {
  position: relative;
  flex: 1;
  line-height: 1rem;
  font-size: 1rem;
  color: #fff;
  font-family: heiti;
  text-align: center;
}

.no-md li:nth-child(1) {
  position: relative;
  flex: 1;
  line-height: 1rem;
  font-size: 1rem;
  color: rgb(232, 241, 152);
  font-family: heiti;
  text-align: center;
}

.no-middle {
  width: 100%;
  /* padding: 10px; */
}

.no-middle-hd {
  /* padding: 5px; */
  position: relative;
  /* border:1px solid rgb(25,186,139); */
}

.no-middle-hd ul {
  display: flex;
}

.no-middle-hd li {
  position: relative;
  flex: 1;
  line-height: 2rem;
  font-size: 2rem;
  color: #fff;
  font-family: heiti;
  text-align: center;
}

.no-middle-hd ul:nth-child(2) li {
  font-size: 0.9rem;
  padding-top: 8px;
}

.no-middle-hd ul:nth-child(1) li::after {
  position: absolute;
  top: 25%;
  right: 0;
  height: 50%;
  content: "";
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.no-middle-hd ul:nth-child(1) li:nth-child(5)::after {
  content: "";
  position: absolute;
  top: 25%;
  right: 0;
  height: 50%;
  width: 0px;
  background: rgba(255, 255, 255, 0.2);
}

.warning-header {
  font-size: 24px;
  font-weight: bold;
}

.warning-detail li {
  min-height: 30px;
  max-height: 100px;
  width: 350px;
  padding-top: 20px;
  font-size: 16px;
  // font-weight:bold;
}

/* dialog弹框代码可复制 */
/deep/ .el-dialog__body {
  user-select: none;
}
</style>
