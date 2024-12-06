<template>
  <el-container class="container">
    <Header style="height: 60px; background-color: #061866" :icon="null">
      <!-- 系统名字 -->
      <template #title>
        <span class="text-title">成都市金牛区综合行政执法局,欢迎您~</span>
      </template>
      <!-- 时间 -->

      <template #time>
        <div class="text-week">今天是: {{ date }} {{ week }}</div>
      </template>
      <template #warning>
        <div class="text-week">
          <div id="dotClass" title="运行正常" @click="fault_details">
            <div id="lamp" style="display: none"></div>
          </div>
          <el-dialog
            v-model="defaultVisible"
            title="事故详情"
            @close="handleClose"
          >
            <div
              style="text-align: center; font-size: x-large; font-weight: bold"
            >
              未处理的事件
            </div>
            <el-table
              :data="defaultList"
              style="width: 100%"
              size="large"
              class="data-table"
            >
              <el-table-column
                prop="event_id"
                label="事件编号"
                min-width="80"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="event_time"
                label="事件时间"
                min-width="150"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="site_name"
                label="事件来源"
                min-width="80"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="Accident_cause"
                label="事件详情"
                min-width="200"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              />
              <el-table-column>
                <template #default="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="warningHandleClick(scope.$index, scope.row)"
                    >处理</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <div
              style="text-align: center; font-size: x-large; font-weight: bold"
            >
              历史告警事件
            </div>
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
              :data="
                EventHistoryList.slice((warningCurrentPage - 1) * 5, warningCurrentPage * 5)
              "
              style="width: 100%"
              size="large"
              class="data-table"
            >
              <el-table-column
                prop="event_id"
                label="事件编号"
                min-width="150"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="event_source"
                label="事件来源"
                min-width="150"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="event_cause"
                label="事件详情"
                min-width="450"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="event_disposed"
                label="事件是否已处理"
                min-width="150"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="event_time"
                label="发生时间"
                min-width="250"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>

              <el-table-column
                prop="administrator"
                label="派发人"
                min-width="150"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="instruction_time"
                label="指令下达时间"
                min-width="250"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="administrator_phone"
                label="派发人电话"
                min-width="150"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="instruction_content"
                label="指令内容"
                min-width="450"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="event_handler"
                label="事件处理人"
                min-width="150"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="handler_phone"
                label="处理人电话"
                min-width="150"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="handler_work"
                label="处理人工作单位"
                min-width="150"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
            </el-table>
            <div class="float-warningEnd">
              <el-pagination
                background
                layout="->,total, prev, pager, next, jumper"
                :total="warningTotalRecords"
                :current-page="warningCurrentPage"
                :page-size="5"
                @current-change="getTransport"
              />
            </div>
          </el-dialog>

          <el-dialog
            v-model="warningHandleEvent"
            title="事故处理"
            @close="handleClose"
          >
            <div
              style="text-align: center; font-size: x-large; font-weight: bold"
            ></div>

            <el-form
              ref="warningRuleFormRef"
              :model="warningRuleForm"
              status-icon
              :warningRules="warningRules"
              label-width="120px"
              class="demo-warningRuleForm"
            >
              <el-form-item label="处置人信息：" prop="info"
                ><el-select
                  v-model="warningRuleForm.info"
                  filterable
                  placeholder="请输入处置人姓名/电话号/工作单位"
                  class="fuzzy_select"
                >
                  <el-option
                    v-for="item in warningPersonList"
                    :key="item.name"
                    :label="warningFormatResult(item)"
                    :value="JSON.stringify(item)"
                  /> </el-select
              ></el-form-item>

              <!-- <el-form-item label="处置人姓名：" prop="name">
                <el-input v-model="warningRuleForm.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="处置人电话号码：" prop="phone">
                <el-input
                  v-model="warningRuleForm.phone"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="工作单位：" prop="place">
                <el-input
                  v-model="warningRuleForm.place"
                  autocomplete="off"
                ></el-input>
              </el-form-item> -->
              <el-form-item label="处置指令内容：" prop="content">
                <el-input
                  v-model="warningRuleForm.content"
                  type="textarea"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="warningSubmitForm(warningRuleFormRef)"
                  >提交</el-button
                >
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </template>

      <!-- 用户信息 -->
      <template #userinfo>
        <div class="router">
          <el-button
            class="buttonToData"
            plain
            link
            color="fff"
            @click="changeArea()"
            size="large"
            >切换区域显示</el-button
          >
          <el-button
            class="buttonToData"
            plain
            link
            color="fff"
            @click="toHome"
            size="large"
            >前往数据主页</el-button
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
  </el-container>
  <!-- <el-header class="navHeader">
    <el-image class="text-title" :src="require('@/assets/home/logo-title.jpg')"></el-image>

  </el-header> -->
  <MapContent />

  <el-amap
    mapStyle="amap://styles/darkblue"
    :center="center"
    :zoom="zoom"
    scrollWheel="false"
    @init="init"
  >
    <!-- <el-amap-geojson
        :geo="geoJSON"
        :polygon-options="polygonOptions"
        visible="true"
        
        @click="click"
      /> -->
    <!-- <el-amap-polygon
        :visible="polygon.visible"
        
        :path="polygon.path"
        :fillOpacity="polygon.fillOpacity"
        @click="click"
      />  -->
    <el-amap-polygon
      :visible="jinniuVisible"
      :path="polygon.path"
      v-model:fillColor="polygonFuqin.fillColor"
      v-model:strokeColor="polygonFuqin.strokeColor"
      :strokeStyle="polygonFuqin.strokeStyle"
    />

    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonFuqin.path"
      v-model:fillColor="polygonFuqin.fillColor"
      v-model:strokeColor="polygonFuqin.strokeColor"
      :strokeStyle="polygonFuqin.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonYingmenkou.path"
      v-model:fillColor="polygonYingmenkou.fillColor"
      v-model:strokeColor="polygonYingmenkou.strokeColor"
      :strokeStyle="polygonYingmenkou.strokeStyle"
    />

    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonJiulidi.path"
      v-model:fillColor="polygonJiulidi.fillColor"
      v-model:strokeColor="polygonJiulidi.strokeColor"
      :strokeStyle="polygonJiulidi.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonChadianzi.path"
      v-model:fillColor="polygonChadianzi.fillColor"
      v-model:strokeColor="polygonChadianzi.strokeColor"
      :strokeStyle="polygonChadianzi.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonFenghuangshan.path"
      v-model:fillColor="polygonFenghuangshan.fillColor"
      v-model:strokeColor="polygonFenghuangshan.strokeColor"
      :strokeStyle="polygonFenghuangshan.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonHehuachi.path"
      v-model:fillColor="polygonHehuachi.fillColor"
      v-model:strokeColor="polygonHehuachi.strokeColor"
      :strokeStyle="polygonHehuachi.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonJinquan.path"
      v-model:fillColor="polygonJinquan.fillColor"
      v-model:strokeColor="polygonJinquan.strokeColor"
      :strokeStyle="polygonJinquan.strokeStyle"
    />
    <!-- @click="hoverJinquan()"@mouseout="hoverbackJinquan()" -->
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonShaheyuan.path"
      v-model:fillColor="polygonShaheyuan.fillColor"
      v-model:strokeColor="polygonShaheyuan.strokeColor"
      :strokeStyle="polygonShaheyuan.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonSimaqiao.path"
      v-model:fillColor="polygonSimaqiao.fillColor"
      v-model:strokeColor="polygonSimaqiao.strokeColor"
      :strokeStyle="polygonSimaqiao.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonWukuaishi.path"
      v-model:fillColor="polygonWukuaishi.fillColor"
      v-model:strokeColor="polygonWukuaishi.strokeColor"
      :strokeStyle="polygonWukuaishi.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonXihua.path"
      v-model:fillColor="polygonXihua.fillColor"
      v-model:strokeColor="polygonXihua.strokeColor"
      :strokeStyle="polygonXihua.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonXianlu.path"
      v-model:fillColor="polygonXianlu.fillColor"
      v-model:strokeColor="polygonXianlu.strokeColor"
      :strokeStyle="polygonXianlu.strokeStyle"
    />
    <el-amap-polygon
      :visible="polygonVisible"
      :path="polygonTianhuizhen.path"
      v-model:fillColor="polygonTianhuizhen.fillColor"
      v-model:strokeColor="polygonTianhuizhen.strokeColor"
      :strokeStyle="polygonTianhuizhen.strokeStyle"
    />

    <!--营门口-->
    <el-amap-info-window
      v-model:visible="infoYingmenkou.infoVisible"
      :position="polygonYingmenkou.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>营门口街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoYingmenkou.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业"
                >{{ infoYingmenkou.tableInfoYyxt.totalCount_all }}
              </el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoYingmenkou.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoYingmenkou.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleYingmenkou = true"
                  :icon="Pointer"
                >
                  {{ infoYingmenkou.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoYingmenkou.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoYingmenkou.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoYingmenkou.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoYingmenkou.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数"
                >{{ infoYingmenkou.tableInfoSzcg.TO_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoYingmenkou.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleYingmenkou = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>
    <!--营门口执法人员-- -->
    <!-- <el-amap-info-window
        v-model:visible="infoYingmenkou.tableVisble"
        :position="polygonYingmenkou.position"
        anchor ="bottom-right"
        direction="vertical"
      >
 
  <el-table :data="tableData_yingmenkou" border  height="500" style="width: 800px" table-layout="auto">
    <el-table-column prop="name" label="姓名"  />
    <el-table-column prop="male" label="性别"  />
    <el-table-column prop="year" label="出生年月" />
    <el-table-column prop="age" label="年龄"  />
    <el-table-column prop="bachlor" label="学历"  />
    <el-table-column prop="type" label="人员类别" />
    <el-table-column prop="mianmao" label="政治面貌" />
    <el-table-column prop="tel" label="手机号" />
    <el-table-column prop="ceti" label="职务" />
    <el-table-column prop="ceti" label="执法证编号" />

  </el-table>


</el-amap-info-window> -->
    <!-- 抚琴-->
    <el-amap-info-window
      v-model:visible="infoFuqin.infoVisible"
      :position="polygonFuqin.position"
      anchor="bottom-left"
      direction="vertical"
      bubble="true"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>抚琴街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoFuqin.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业">{{
                infoFuqin.tableInfoYyxt.totalCount_all
              }}</el-descriptions-item>
              <el-descriptions-item label="正常运行企业">{{
                infoFuqin.tableInfoYyxt.totalCount_normal
              }}</el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoFuqin.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleFuqin = true"
                  :icon="Pointer"
                >
                  {{ infoFuqin.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数">{{
                infoFuqin.tableInfoYyxt.totalCount_warning
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoFuqin.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数">{{
                infoFuqin.tableInfoSzcg.NEED_DISPOSE_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoFuqin.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数">{{
                infoFuqin.tableInfoSzcg.TO_DISPOSE_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoFuqin.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button size="large" plain type="primary" @click="showTableFuqin">
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!--西安路 -->
    <el-amap-info-window
      v-model:visible="infoXianlu.infoVisible"
      :position="polygonXianlu.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>西安路街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoXianlu.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业">{{
                infoXianlu.tableInfoYyxt.totalCount_all
              }}</el-descriptions-item>
              <el-descriptions-item label="正常运行企业">{{
                infoXianlu.tableInfoYyxt.totalCount_normal
              }}</el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoXianlu.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleXianlu = true"
                  :icon="Pointer"
                >
                  {{ infoXianlu.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数">{{
                infoXianlu.tableInfoYyxt.totalCount_warning
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoXianlu.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoXianlu.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoXianlu.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数">{{
                infoXianlu.tableInfoSzcg.TO_DISPOSE_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoXianlu.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleXianlu = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 西华 -->
    <el-amap-info-window
      v-model:visible="infoXihua.infoVisible"
      :position="polygonXihua.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>西华街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoXihua.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业">{{
                infoXihua.tableInfoYyxt.totalCount_all
              }}</el-descriptions-item>
              <el-descriptions-item label="正常运行企业">{{
                infoXihua.tableInfoYyxt.totalCount_normal
              }}</el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoXihua.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleXihua = true"
                  :icon="Pointer"
                >
                  {{ infoXihua.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数">{{
                infoXihua.tableInfoYyxt.totalCount_warning
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoXihua.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数">{{
                infoXihua.tableInfoSzcg.NEED_DISPOSE_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoXihua.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数">{{
                infoXihua.tableInfoSzcg.TO_DISPOSE_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoXihua.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleXihua = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 荷花池 -->
    <el-amap-info-window
      v-model:visible="infoHehuachi.infoVisible"
      :position="polygonHehuachi.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>荷花池街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoHehuachi.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业">{{
                infoHehuachi.tableInfoYyxt.totalCount_all
              }}</el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoHehuachi.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoHehuachi.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleHehuachi = true"
                  :icon="Pointer"
                >
                  {{ infoHehuachi.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoHehuachi.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoHehuachi.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoHehuachi.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoHehuachi.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数"
                >{{ infoHehuachi.tableInfoSzcg.TO_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoHehuachi.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleHehuachi = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 驷马桥 -->
    <el-amap-info-window
      v-model:visible="infoSimaqiao.infoVisible"
      :position="polygonSimaqiao.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>驷马桥街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoSimaqiao.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业">{{
                infoSimaqiao.tableInfoYyxt.totalCount_all
              }}</el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoSimaqiao.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoSimaqiao.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleSimaqiao = true"
                  :icon="Pointer"
                >
                  {{ infoSimaqiao.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoSimaqiao.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoSimaqiao.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoSimaqiao.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoSimaqiao.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数"
                >{{ infoSimaqiao.tableInfoSzcg.TO_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoSimaqiao.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleSimaqiao = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 茶店子 -->
    <el-amap-info-window
      v-model:visible="infoChadianzi.infoVisible"
      :position="polygonChadianzi.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>茶店子街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoChadianzi.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业"
                >{{ infoChadianzi.tableInfoYyxt.totalCount_all }}
              </el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoChadianzi.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoChadianzi.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleChadianzi = true"
                  :icon="Pointer"
                >
                  {{ infoChadianzi.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoChadianzi.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoChadianzi.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoChadianzi.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoChadianzi.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数"
                >{{ infoChadianzi.tableInfoSzcg.TO_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoChadianzi.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleChadianzi = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 九里堤 -->
    <el-amap-info-window
      v-model:visible="infoJiulidi.infoVisible"
      :position="polygonJiulidi.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>九里堤街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoJiulidi.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业">{{
                infoJiulidi.tableInfoYyxt.totalCount_all
              }}</el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoJiulidi.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoJiulidi.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleJiulidi = true"
                  :icon="Pointer"
                >
                  {{ infoJiulidi.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoJiulidi.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoJiulidi.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoJiulidi.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoJiulidi.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数">{{
                infoJiulidi.tableInfoSzcg.TO_DISPOSE_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoJiulidi.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleJiulidi = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 五块石 -->
    <el-amap-info-window
      v-model:visible="infoWukuaishi.infoVisible"
      :position="polygonWukuaishi.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>五块石街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoWukuaishi.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业"
                >{{ infoWukuaishi.tableInfoYyxt.totalCount_all }}
              </el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoWukuaishi.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoWukuaishi.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleWukuaishi = true"
                  :icon="Pointer"
                >
                  {{ infoWukuaishi.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoWukuaishi.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoWukuaishi.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoWukuaishi.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoWukuaishi.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数"
                >{{ infoWukuaishi.tableInfoSzcg.TO_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoWukuaishi.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleWukuaishi = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 金泉 -->
    <el-amap-info-window
      v-model:visible="infoJinquan.infoVisible"
      :position="polygonJinquan.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>金泉街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoJinquan.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业">{{
                infoJinquan.tableInfoYyxt.totalCount_all
              }}</el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoJinquan.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoJinquan.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleJinquan = true"
                  :icon="Pointer"
                >
                  {{ infoJinquan.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoJinquan.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoJinquan.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoJinquan.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoJinquan.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数">{{
                infoJinquan.tableInfoSzcg.TO_DISPOSE_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoJinquan.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleJinquan = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 沙河源 -->
    <el-amap-info-window
      v-model:visible="infoShaheyuan.infoVisible"
      :position="polygonShaheyuan.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>沙河源街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoShaheyuan.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业"
                >{{ infoShaheyuan.tableInfoYyxt.totalCount_all }}
              </el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoShaheyuan.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数">{{
                infoShaheyuan.tableInfoYyxt.totalCount_off
              }}</el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleShaHeyuan = true"
                  :icon="Pointer"
                >
                  {{ infoShaheyuan.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoShaheyuan.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoShaheyuan.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoShaheyuan.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoShaheyuan.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数"
                >{{ infoShaheyuan.tableInfoSzcg.TO_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoShaheyuan.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleShaHeyuan = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 天回镇 -->
    <el-amap-info-window
      v-model:visible="infoTianhuizhen.infoVisible"
      :position="polygonTianhuizhen.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>天回镇街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoTianhuizhen.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业"
                >{{ infoTianhuizhen.tableInfoYyxt.totalCount_all }}
              </el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoTianhuizhen.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数"
                >{{ infoTianhuizhen.tableInfoYyxt.totalCount_off }}
              </el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleTianhuizhen = true"
                  :icon="Pointer"
                >
                  {{ infoTianhuizhen.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoTianhuizhen.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数">{{
                infoTianhuizhen.tableInfoSzcg.REPORT_NUM
              }}</el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoTianhuizhen.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoTianhuizhen.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数"
                >{{ infoTianhuizhen.tableInfoSzcg.TO_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoTianhuizhen.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleTianhuizhen = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>

    <!-- 凤凰山 -->
    <el-amap-info-window
      v-model:visible="infoFenghuangshan.infoVisible"
      :position="polygonFenghuangshan.position"
      anchor="bottom-right"
      direction="vertical"
      isCustom="true"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>凤凰山街道</span>
            <el-button
              class="button"
              text
              style="font-size: 20px"
              @click="infoFenghuangshan.infoVisible = false"
            >
              <el-icon class="closeIcon" size="20px">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </template>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >油烟检测</el-button
              >
            </template>
            <el-descriptions title="油烟检测" border direction="vertical">
              <el-descriptions-item label="已安装设备企业"
                >{{ infoFenghuangshan.tableInfoYyxt.totalCount_all }}
              </el-descriptions-item>
              <el-descriptions-item label="正常运行企业"
                >{{ infoFenghuangshan.tableInfoYyxt.totalCount_normal }}
              </el-descriptions-item>
              <el-descriptions-item label="离线企业数"
                >{{ infoFenghuangshan.tableInfoYyxt.totalCount_off }}
              </el-descriptions-item>
              <el-descriptions-item label="超标企业数">
                <el-button
                  type="primary"
                  link
                  @click="companyVisibleFenghuangshan = true"
                  :icon="Pointer"
                >
                  {{ infoFenghuangshan.tableInfoYyxt.totalCount_over }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="预警企业数"
                >{{ infoFenghuangshan.tableInfoYyxt.totalCount_warning }}
              </el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px; font-size: 20px" type="text"
                >数字城管</el-button
              >
            </template>
            <el-descriptions
              title="数字城管"
              border
              direction="vertical"
              style="font-size: 25px"
            >
              <el-descriptions-item label="今日巡查上报数"
                >{{ infoFenghuangshan.tableInfoSzcg.REPORT_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日应处置案件数"
                >{{ infoFenghuangshan.tableInfoSzcg.NEED_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置案件数"
                >{{ infoFenghuangshan.tableInfoSzcg.INTIME_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日待处置案件数"
                >{{ infoFenghuangshan.tableInfoSzcg.TO_DISPOSE_NUM }}
              </el-descriptions-item>
              <el-descriptions-item label="今日处置率">{{
                infoFenghuangshan.tableInfoSzcg.DISPOSE_LV
              }}</el-descriptions-item>
            </el-descriptions>
          </el-popover>
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >共享单车</el-button
          >
        </div>
        <div class="text item">
          <el-button
            style="margin-right: 16px; font-size: 20px"
            type="text"
            disabled
            >行政执法</el-button
          >
        </div>

        <div class="text item">
          <el-button
            size="large"
            plain
            type="primary"
            @click="tableVisibleFenghuangshan = true"
          >
            查看本区城管执法人员</el-button
          >
        </div>
      </el-card>
    </el-amap-info-window>
  </el-amap>

  <!-- 执法人员名单 -->
  <el-dialog v-model="tableVisibleYingmenkou" title="营门口街道执法人员名单">
    <el-table
      :data="tableData_yingmenkou"
      border
      height="500"
      style="width: 1000px"
      table-layout="auto"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="male" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="type" label="人员类别" />
      <el-table-column prop="tel" label="手机号" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleFuin" title="抚琴街道执法人员名单">
    <el-table :data="tableData_fuqin" border height="500" style="width: 1000px">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="type" label="人员类别" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleXianlu" title="西安路街道执法人员名单">
    <el-table
      :data="tableData_xianlu"
      border
      height="500"
      style="width: 1000px"
      table-layout="auto"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="male" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="type" label="人员类别" />
      <el-table-column prop="tel" label="手机号" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleXihua" title="西华街道执法人员名单">
    <el-table :data="tableData_xihua" border height="500" style="width: 1000px">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="type" label="人员类别" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleChadianzi" title="茶店子街道执法人员名单">
    <el-table
      :data="tableData_chadianzi"
      border
      height="500"
      style="width: 1000px"
      table-layout="auto"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="male" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="type" label="人员类别" />
      <el-table-column prop="tel" label="手机号" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleJiulidi" title="九里堤街道执法人员名单">
    <el-table
      :data="tableData_jiulidi"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="type" label="人员类别" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleWukuaishi" title="五块石街道执法人员名单">
    <el-table
      :data="tableData_wukuaishi"
      border
      height="500"
      style="width: 1000px"
      table-layout="auto"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="male" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="type" label="人员类别" />
      <el-table-column prop="tel" label="手机号" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleTianhuizhen" title="天回镇街道执法人员名单">
    <el-table
      :data="tableData_tianhuizhen"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="type" label="人员类别" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleFenghuangshan" title="凤凰山街道执法人员名单">
    <el-table
      :data="tableData_fenghuangshan"
      border
      height="500"
      style="width: 1000px"
      table-layout="auto"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="male" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="type" label="人员类别" />
      <el-table-column prop="tel" label="手机号" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleJinquan" title="金泉街道执法人员名单">
    <el-table
      :data="tableData_jinquan"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="type" label="人员类别" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleHehuachi" title="荷花池街道执法人员名单">
    <el-table
      :data="tableData_hehuachi"
      border
      height="500"
      style="width: 1000px"
      table-layout="auto"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="male" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="type" label="人员类别" />
      <el-table-column prop="tel" label="手机号" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleSimaqiao" title="驷马桥街道执法人员名单">
    <el-table
      :data="tableData_simaqiao"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="type" label="人员类别" />
    </el-table>
  </el-dialog>
  <el-dialog v-model="tableVisibleShaHeyuan" title="沙河源街道执法人员名单">
    <el-table
      :data="tableData_shaheyuan"
      border
      height="500"
      style="width: 1000px"
      table-layout="auto"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="male" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="type" label="人员类别" />
      <el-table-column prop="tel" label="手机号" />
    </el-table>
  </el-dialog>

  <!-- 超标企业信息 -->
  <!-- 抚琴 -->
  <el-dialog v-model="companyVisibleFuqin" title="超标企业信息">
    <el-table
      :data="infoFuqin.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>

  <!-- 营门口 -->
  <el-dialog v-model="companyVisibleYingmenkou" title="超标企业信息">
    <el-table
      :data="infoYingmenkou.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>

  <!-- 西安路 -->
  <el-dialog v-model="companyVisibleXianlu" title="超标企业信息">
    <el-table
      :data="infoXianlu.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 西华 -->
  <el-dialog v-model="companyVisibleXihua" title="超标企业信息">
    <el-table
      :data="infoXihua.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 荷花池 -->
  <el-dialog v-model="companyVisibleHehuachi" title="超标企业信息">
    <el-table
      :data="infoHehuachi.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 金泉 -->
  <el-dialog v-model="companyVisibleJinquan" title="超标企业信息">
    <el-table
      :data="infoJinquan.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 九里堤 -->
  <el-dialog v-model="companyVisibleJiulidi" title="超标企业信息">
    <el-table
      :data="infoJiulidi.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 凤凰山 -->
  <el-dialog v-model="companyVisibleFenghuangshan" title="超标企业信息">
    <el-table
      :data="infoFenghuangshan.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 天回镇 -->
  <el-dialog v-model="companyVisibleTianhuizhen" title="超标企业信息">
    <el-table
      :data="infoTianhuizhen.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 沙河源 -->
  <el-dialog v-model="companyVisibleShaHeyuan" title="超标企业信息">
    <el-table
      :data="infoShaheyuan.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 五块石 -->
  <el-dialog v-model="companyVisibleWukuaishi" title="超标企业信息">
    <el-table
      :data="infoWukuaishi.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 茶店子 -->
  <el-dialog v-model="companyVisibleChadianzi" title="超标企业信息">
    <el-table
      :data="infoChadianzi.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
  <!-- 驷马桥 -->
  <el-dialog v-model="companyVisibleSimaqiao" title="超标企业信息">
    <el-table
      :data="infoSimaqiao.tableInfoYyxt.company_over"
      border
      height="500"
      style="width: 1000px"
    >
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="contacts" label="联系人" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </el-dialog>
</template>

<script setup>
import "element-plus/theme-chalk/display.css";
import { ArrowDown, Close, Pointer } from "@element-plus/icons-vue";
import { ref, reactive, computed, onBeforeMount, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { params } from "@/store/store.js";

import Header from "@/components/Header.vue";
import { getMapDataSzcg } from "@/api/szcg.js";
import { getMapDataYyxt } from "@/api/yyxt.js";

import MapContent from "@/components/Mapcontent.vue";
// import MapContent1 from "@/components/Mapcontent1.vue";
import axios from "axios";
import request from "@/utils/request.js";
import moment from "moment";

import geoDistrit from "@/assets/510106geo.json";
import { useStore } from "vuex"
const store = useStore()

const zoom = ref(12);
let date = new Date().toLocaleDateString();
var a = new Array("日", "一", "二", "三", "四", "五", "六");
var str = new Date().getDay();
var week = "星期" + a[str];
const center = ref([104.05740358713781, 30.747356042874134]);
const mapStyle = "amap://styles/darkblue";
let map = null;
const geoJSON = geoDistrit;
const tableInfoSzcg = ref([]);
const tableInfoYyxt = ref([]);
const tableInfoGgzp = ref([]);
const polygonVisible = ref(false);
const jinniuVisible = ref(true);
const tableVisibleFuin = ref(false);
const tableVisibleYingmenkou = ref(false);
const tableVisibleXianlu = ref(false);
const tableVisibleXihua = ref(false);
const tableVisibleChadianzi = ref(false);
const tableVisibleJiulidi = ref(false);
const tableVisibleWukuaishi = ref(false);
const tableVisibleTianhuizhen = ref(false);
const tableVisibleFenghuangshan = ref(false);
const tableVisibleJinquan = ref(false);
const tableVisibleHehuachi = ref(false);
const tableVisibleShaHeyuan = ref(false);
const tableVisibleSimaqiao = ref(false);

//todo <el-dialog v-model="companyVisibleChadianzi"> 问题所在
// 屎山,但是没办法了,尝试放进infoXXx中,elment-plus的提供的组件参数切换显隐 v-model:""始终获取不到对象内部的参数,待优化
const companyVisibleFuqin = ref(false);
const companyVisibleYingmenkou = ref(false);
const companyVisibleXianlu = ref(false);
const companyVisibleXihua = ref(false);
const companyVisibleChadianzi = ref(false);
const companyVisibleJiulidi = ref(false);
const companyVisibleWukuaishi = ref(false);
const companyVisibleTianhuizhen = ref(false);
const companyVisibleFenghuangshan = ref(false);
const companyVisibleJinquan = ref(false);
const companyVisibleHehuachi = ref(false);
const companyVisibleSimaqiao = ref(false);
const companyVisibleShaHeyuan = ref(false);
// const infoYingmenkou.tableVisble = ref(false)
// const infoFuqin.tableVisble = ref(false)
//todo
//const tableInfoSzcgFuqin =ref([])
////const tableInfoSzcgYingmenkou =ref([])



const infoYingmenkou = reactive({
  infoVisible: false,
  tableVisible: false,
  tableInfoYyxt: [],
  tableInfoSzcg: [],
  tableInfoGgzp: [],

  company_over: [],
});
const infoFuqin = reactive({
  infoVisible: false,
  tableVisible: false,
  tableInfoYyxt: [],
  tableInfoGgzp: [],

  tableInfoSzcg: [],
});
const infoXianlu = reactive({
  tableVisible: false,
  infoVisible: false,
  tableInfoGgzp: [],

  tableInfoYyxt: [],
  tableInfoSzcg: [],
});
const infoXihua = reactive({
  tableInfoYyxt: [],
  tableVisible: false,
  infoVisible: false,
  tableInfoGgzp: [],
  tableInfoSzcg: [],
});
const infoHehuachi = reactive({
  tableInfoYyxt: [],
  tableVisible: false,
  infoVisible: false,
  tableInfoGgzp: [],
  tableInfoSzcg: [],
});
const infoSimaqiao = reactive({
  tableVisible: false,
  infoVisible: false,
  tableInfoYyxt: [],
  tableInfoGgzp: [],
  tableInfoSzcg: [],
});
const infoJiulidi = reactive({
  tableVisible: false,
  infoVisible: false,
  tableInfoYyxt: [],
  tableInfoGgzp: [],
  tableInfoSzcg: [],
});
const infoWukuaishi = reactive({
  tableVisible: false,
  infoVisible: false,
  tableInfoYyxt: [],
  tableInfoSzcg: [],
});
const infoJinquan = reactive({
  tableVisible: false,
  infoVisible: false,
  tableInfoYyxt: [],
  tableInfoGgzp: [],
  tableInfoSzcg: [],
});
const infoShaheyuan = reactive({
  tableVisible: false,
  infoVisible: false,
  tableInfoYyxt: [],
  tableInfoSzcg: [],
});
const infoTianhuizhen = reactive({
  tableVisible: false,
  infoVisible: false,
  tableInfoYyxt: [],
  tableInfoGgzp: [],
  tableInfoSzcg: [],
});
const infoFenghuangshan = reactive({
  tableVisible: false,
  infoVisible: false,
  tableInfoYyxt: [],
  tableInfoGgzp: [],
  tableInfoSzcg: [],
});
const infoChadianzi = reactive({
  infoVisible: false,
  tableVisible: false,
  tableInfoYyxt: [],
  tableInfoGgzp: [],
  tableInfoSzcg: [],
});

const systemData = [
  {
    systemName: "数字城管",
  },
  {
    systemName: "油烟检测",
  },
  {
    systemName: "行政执法监测",
  },
  {
    systemName: "共享单车",
  },
];

// ===============================================告警事件
const query = ref("");
const value = ref("");
const warningPersonList = [
  { name: "周攀", phone: "18008061031", company: "办公室" },
  { name: "李自勇", phone: "18008060397", company: "办公室" },
  { name: "蒲远胜", phone: "18008060520", company: "办公室" },
  { name: "周思源", phone: "18008060503", company: "办公室" },
  { name: "虞诚磊", phone: "18008060536", company: "办公室" },
  { name: "尹叶峰", phone: "18008060657", company: "办公室" },
  { name: "周晓蓉", phone: "19381969851", company: "办公室" },
  { name: "叶建春", phone: "19381968202", company: "办公室" },
  { name: "彭姣", phone: "19381969852", company: "办公室" },
  { name: "谈方灿", phone: "18008061082", company: "城市环境综合治理科" },
  { name: "刘敏", phone: "18008060760", company: "城市环境综合治理科" },
  { name: "张蓉", phone: "18008060787", company: "城市环境综合治理科" },
  { name: "王胜男", phone: "18008060872", company: "城市环境综合治理科" },
  { name: "彭蕾", phone: "18008060898", company: "城市环境综合治理科" },
  { name: "杜强", phone: "18008061026", company: "基建设备管理科" },
  { name: "张红星", phone: "18008061015", company: "基建设备管理科" },
  { name: "邓雨檬", phone: "18008061016", company: "基建设备管理科" },
  { name: "胡浩", phone: "18008061036", company: "环境卫生监督管理科" },
  { name: "张宗贵", phone: "18008061087", company: "环境卫生监督管理科" },
  { name: "张静", phone: "18008061139", company: "环境卫生监督管理科" },
  { name: "胡玉莲", phone: "19381969853", company: "环境卫生监督管理科" },
  { name: "杨雨荷", phone: "19381969856", company: "环境卫生监督管理科" },
  { name: "周勇刚", phone: "18008060092", company: "环境卫生监督管理科" },
  { name: "肖轶", phone: "18008061056", company: "广告招牌和景观照明管理科" },
  { name: "聂宁", phone: "18008061159", company: "广告招牌和景观照明管理科" },
  { name: "刘文", phone: "19381969857", company: "广告招牌和景观照明管理科" },
  { name: "叶华", phone: "18008061175", company: "计划财务处" },
  { name: "罗争妍", phone: "18008061176", company: "计划财务处" },
  { name: "邱惠", phone: "18008061181", company: "计划财务处" },
  { name: "代然", phone: "18008061185", company: "计划财务处" },
  { name: "王英", phone: "18008061191", company: "计划财务处" },
  { name: "陈雪梅", phone: "18008061293", company: "计划财务处" },
  { name: "周建春", phone: "18008061295", company: "计划财务处" },
  { name: "钟杨", phone: "19381969858", company: "计划财务处" },
  { name: "蒋波", phone: "18008061301", company: "人事劳资科" },
  { name: "徐巧英", phone: "18008061303", company: "人事劳资科" },
  { name: "张宽", phone: "18008061380", company: "人事劳资科" },
  { name: "张成波", phone: "18008061369", company: "人事劳资科" },
  { name: "段国钢", phone: "15388115360", company: "数字化指挥监督中心" },
  { name: "高志昊", phone: "19381968262", company: "政策法规科" },
    { name: "李新成", phone: "18008061170", company: "大队勤务科" },
  { name: "邱志强", phone: "18008061023", company: "大队勤务科" },
  { name: "李贵明", phone: "18008061381", company: "大队勤务科" },
  { name: "冯娟", phone: "18008061037", company: "大队勤务科" },
  { name: "汪敏", phone: "18190992825", company: "大队勤务科" },
  { name: "赵杨", phone: "17723321969", company: "大队勤务科" },
  { name: "文宇恒", phone: "18008060691", company: "大队勤务科" },
  { name: "张宇杨", phone: "18008061257", company: "大队勤务科" },
];
// 自定义结果格式
// const selectedResult = ref(null);

const warningFormatResult = (result) => {
  return `${result.name} - ${result.phone} - ${result.company}`;
};
const getwarningPersonList = (pageNum) => {
  axios({
    // url: "/api/lzj/getWarning",
    url: "/api/auth/all_permission",
    method: "get",
    headers: {
      Authorization: "Bearer " + params.token,
    },
  }).then(async (resp) => {
    var data = resp.data;
    console.log("人员列表:" + data);

    for (var key in data) {
      if (data[key].telephone == "13880769883") {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "城运中心",
        };
      } else if (data[key].telephone == "13880717069") {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "指挥中心",
        };
      } else if (
        data[key].telephone == "13708199475" ||
        data[key].telephone == "13908173345" ||
        data[key].telephone == "13752148440" ||
        data[key].telephone == "18919564611" ||
        data[key].telephone == "17360557880"
      ) {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "测试中心",
        };
      } else if (data[key].realName == "代恭林") {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "基建设备管理科",
        };
      } else if (
        data[key].realName == "杨朕" ||
        data[key].realName == "陈朝胜" ||
        data[key].realName == "邓文华"
      ) {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "环境卫生监督管理科",
        };
      } else if (
        data[key].realName == "何其会" ||
        data[key].realName == "杨健" ||
        data[key].realName == "任兵兵" ||
        data[key].realName == "刘晓峰"
      ) {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "广告招牌和景观照明管理科",
        };
      } else if (
        data[key].realName == "李莉佳" ||
        data[key].realName == "刘亚奇"
      ) {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "政策法规科",
        };
      } else if (
        data[key].realName == "胡福乾" ||
        data[key].realName == "王松"
      ) {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "大队勤务科",
        };
      } else if (data[key].realName == "赖渊") {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "数字化指挥监督中心",
        };
      } else {
        var resetPassword = {
          name: data[key].realName,
          phone: data[key].telephone,
          company: "办公室",
        };
      }

      console.log("这里：" + resetPassword);
      warningPersonList.push(resetPassword);
    }
  });
};
setInterval(getwarningPersonList(1), 60000);

const warningTotalRecords = ref(1000);
let warningCurrentPage = ref(1);
let warningPageCount = 0;

let warningStart = moment("2023-03-01").format("YYYY-MM-DD");
console.log(4211,warningStart)
let warningEnd = moment().format("YYYY-MM-DD");
console.log(4212,warningEnd)
// const tomorrow = moment()
//   .add(+1, "d")
//   .format("YYYY-MM-DD");
// const today = moment().format("YYYY-MM-DD");
let changeValue = ref(["", ""]);
// 禁选今天以后的日期以及没有数据的
const disabledDate = (time) => {
  return (
    // time.getTime() < new Date("2022-8-31").getTime() ||
    time.getTime() > new Date().getTime()
  );
};
function changeDate() {
  warningStart = moment(changeValue.value[0]).format("YYYY-MM-DD");
  warningEnd = moment(changeValue.value[1]).format("YYYY-MM-DD");
  console.log(14211,warningStart)
  console.log(14212,warningEnd)
  // warningEnd =  new Date();
  queryAllWarning(warningStart, warningEnd, 1);
}

const warningRuleFormRef = ref(null);
const defaultList = reactive([]);
const EventHistoryList = reactive([]);
const defaultVisible = ref(false);
const warningHandleEvent = ref(false);
const warningToken = ref("");
const event_uuid = ref("");
const rowIndex = ref("");
// const instructTime = ref("");
const warningRuleForm = reactive({
  name: "",
  phone: "",
  place: "",
  content: "",
});

const warningRules = reactive({
  info: [{ required: "true", message: "处置人信息不能为空", trigger: "blur" }],
  // name: [{ required: "true", message: "姓名不能为空", trigger: "blur" }],
  // phone: [{ required: "true", message: "电话不能为空", trigger: "blur" }],
  // place: [{ required: "true", message: "工作单位不能为空", trigger: "blur" }],
  content: [{ required: "true", message: "指令内容不能为空", trigger: "blur" }],
});

const warningSubmitForm = async () => {
  const selectedValue = JSON.parse(warningRuleForm.info);

  if (!warningRuleFormRef) return;

  warningRuleFormRef.value.validate((valid) => {
    if (valid) {
      var telph = selectedValue.phone;
      var res = confirm("确认提交？");
      if (res) {
        var re = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
        if (re.test(telph) == false) {
          alert("电话号码输入有误！");
          return false;
        }
      }
      // instructTime.value = moment().format("YYYY-MM-DD HH:mm:ss");

      axios({
        url: "/ddzh/ws-message/single/web",
        headers: {
          "Content-Type": "application/json",
          Authorization: warningToken.value,
        },
        data: JSON.stringify({
          patrolTelephone: selectedValue.phone,
          message: warningRuleForm.content,
        }),
        method: "post",
      }).then(function (resp) {
        console.log(2, resp);
        console.log(
          "发送给了电话为：" +
            selectedValue.phone +
            "，指令内容为：" +
            warningRuleForm.content
        );
      });

      axios({
        url: "/api/event-query/updateHandleEvent",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + params.token,
        },
        method: "POST",
        data: JSON.parse(
          JSON.stringify({
            id: event_uuid.value,
            eventHandler: selectedValue.name,
            handlerPhone: selectedValue.phone,
            handlerWork: selectedValue.company,
            instructionContent: warningRuleForm.content,
          })
        ),
        method: "post",
      }).then(function (resp) {
        systemData.out.println("event_uuid:" + event_uuid);
      });
      console.log("submit!");
      alert("提交成功！");
      warningHandleEvent.value = false;
      // defaultList.pop(rowIndex);
      // for(let i = 0;i < defaultList.length; i++){
      // if(defaultList[i].event_id == event_uuid.value){
      //   defaultList.pop(defaultList[i-1])
      //     }
      //  }
      changeColor();
    } else {
      alert("提交失败！");
      return false;
    }
  });
};

const warningHandleClick = (index, row) => {
  event_uuid.value = row.event_id;
  rowIndex.value = index;
  console.log("event_uuid:" + event_uuid.value);
  warningHandleEvent.value = true;
  warningRuleForm.phone = "";
  warningRuleForm.name = "";
  warningRuleForm.place = "";
  warningRuleForm.content = "";
};
const fault_details = () => {
  var div = document.getElementById("dotClass");
  console.log("div.style.backgroundColor" + div.style.backgroundColor);
  if (div.style.backgroundColor == "rgb(17, 225, 176)") {
    console.log(params.username);
    //     if (params.username="13752148440") {
    //     document.getElementById('handleButton').style.display="block";

    // }
    defaultVisible.value = true;
    //   if (params.username="13752148440") {
    //   document.getElementById('handleButton').style.display="block";

    // }
  }
  // 出现事故
  if (div.style.backgroundColor == "rgb(225, 41, 17)") {
    console.log(params.username);

    defaultVisible.value = true;
    //   if (params.username="13752148440") {
    //   document.getElementById('handleButton').style.display="block";

    // }
    console.log(defaultVisible.value);
  }
};
const queryAllWarning = (warningStartTime, warningEndTime, pageNum) => {
  axios({
    url: "/api/event-query/getAllGarbageEvent",
    method: "get",
    headers: {
      Authorization: "Bearer " + params.token,
    },
    params: {
      startTime: warningStartTime,
      endTime: warningEndTime,
    },
  }).then(function (resp) {
    // console.log(222,"Bearer"+params.warningToken);
    var data = resp.data.data;
    EventHistoryList.splice(0, EventHistoryList.length);
    console.log(111, resp.data.data);
    for (var key in data) {
      var default_site = {
        event_source: data[key].eventSource,
        event_cause: data[key].eventCause,
        administrator: data[key].administrator,
        administrator_phone: data[key].administratorPhone,
        instruction_time: data[key].instructionTime,
        instruction_content: data[key].instructionContent,
        event_handler: data[key].eventHandler,
        handler_phone: data[key].handlerPhone,
        handler_work: data[key].handlerWork,
        event_id: data[key].id,
        event_time: data[key].eventTime,
        event_disposed: data[key].disposedSign,
      };
      EventHistoryList.push(default_site);
    }
    warningTotalRecords.value = EventHistoryList.length;
    // warningPageCount = parseInt(EventHistoryList.length) % 5;
    warningCurrentPage.value = pageNum;
  });
};
queryAllWarning(warningStart, warningEnd, 1);
const getTransport = (pageNum) => {
  // 当前页
  warningCurrentPage.value = pageNum;
};
const changeColor = () => {
  queryAllWarning(warningStart, warningEnd, 1);
  axios({
    // url: "/api/lzj/getWarning",
    url: "/api/event-query/getNeedHandleEvent",
    method: "get",
    headers: {
      Authorization: "Bearer " + params.token,
    },
  }).then(function (resp) {
    defaultList.splice(0, defaultList.length);
    console.log(resp);
    var data = resp.data.data;
    console.log("resp.code：" + data);
    for (var key in data) {
      var default_site = {
        event_time: data[key].eventTime,
        site_name: data[key].eventSource,
        Accident_cause: data[key].eventCause,
        event_id: data[key].id,
      };
      defaultList.push(default_site);
    }

    // var default_site = {
    //   site_name: "西华",
    //   Accident_cause: "数据服务器断开！",
    // };
    // defaultList.push(default_site);

    // console.log(3, defaultList.length);

    // if (defaultList.length == 5) {
    //   cause.value = "数据采集服务器断开！";
    // }
    console.log("data.length:" + defaultList.length);
    // 出现事故
    if (defaultList.length != 0) {
      document.getElementById("dotClass").title = "出现异常！请点击查看详情！";
      document.getElementById("dotClass").style.backgroundColor = "#E12911";
      document.getElementById("lamp").style.display = "block";
    } else {
      document.getElementById("dotClass").style.backgroundColor = "#11e1b0";
      document.getElementById("lamp").style.display = "none";
    }
  });
};
changeColor();
setInterval(changeColor, 60000);

// =========================================================
function changeArea() {
  polygonVisible.value = !polygonVisible.value;
  jinniuVisible.value = !jinniuVisible.value;
}
onBeforeMount(() => {
  // axios({
  //   url: "/ddzh/auth/login",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: JSON.stringify({
  //     phone: "18008061151",
  //     password: "123456",
  //   }),
  //   method: "post",
  // }).then(function (resp) {
  //   console.log(1, resp);
  //   var data = resp.data.data;
  //   token.value = data.tokenHead + data.token;
  //   console.log("得到的token:" + token.value);
  // });
  // getMapDataSzcg().then(data => {
  //   tableInfoSzcg.value = data
  //   // 请求各个子系统要显示的数据
  //   infoFuqin.tableInfoSzcg = tableInfoSzcg.value[0]
  //   infoYingmenkou.tableInfoSzcg = tableInfoSzcg.value[1]
  //   infoXianlu.tableInfoSzcg = tableInfoSzcg.value[2]
  //   infoXihua.tableInfoSzcg = tableInfoSzcg.value[3]
  //   infoHehuachi.tableInfoSzcg = tableInfoSzcg.value[4]
  //   infoSimaqiao.tableInfoSzcg = tableInfoSzcg.value[5]
  //   infoChadianzi.tableInfoSzcg = tableInfoSzcg.value[6]
  //   infoJiulidi.tableInfoSzcg = tableInfoSzcg.value[7]
  //   infoWukuaishi.tableInfoSzcg = tableInfoSzcg.value[8]
  //   infoJinquan.tableInfoSzcg = tableInfoSzcg.value[9]
  //   infoShaheyuan.tableInfoSzcg = tableInfoSzcg.value[10]
  //   infoTianhuizhen.tableInfoSzcg = tableInfoSzcg.value[11]
  //   infoFenghuangshan.tableInfoSzcg = tableInfoSzcg.value[12]
  // })
  // // getMapDataGgzp().then(data => {
  // //   tableInfoGgzp.value = data
  // //   console.log(tableInfoGgzp)
  // //   // 请求各个子系统要显示的数据
  // //   infoFuqin.tableInfoGgzp = tableInfoGgzp.value[0]
  // //   infoYingmenkou.tableInfoGgzp = tableInfoGgzp.value[1]
  // //   infoXianlu.tableInfoGgzp = tableInfoGgzp.value[2]
  // //   infoXihua.tableInfoGgzp = tableInfoGgzp.value[3]
  // //   infoHehuachi.tableInfoGgzp = tableInfoGgzp.value[4]
  // //   infoSimaqiao.tableInfoGgzp = tableInfoGgzp.value[5]
  // //   infoChadianzi.tableInfoGgzp = tableInfoGgzp.value[6]
  // //   infoJiulidi.tableInfoGgzp = tableInfoGgzp.value[7]
  // //   infoWukuaishi.tableInfoGgzp = tableInfoGgzp.value[8]
  // //   infoJinquan.tableInfoGgzp = tableInfoGgzp.value[9]
  // //   infoShaheyuan.tableInfoGgzp = tableInfoGgzp.value[10]
  // //   infoTianhuizhen.tableInfoGgzp = tableInfoGgzp.value[11]
  // //   infoFenghuangshan.tableInfoGgzp = tableInfoGgzp.value[12]
  // // })
  // getMapDataYyxt().then(data => {
  //   tableInfoYyxt.value = data
  //   // 请求各个子系统要显示的数据
  //   infoFuqin.tableInfoYyxt = tableInfoYyxt.value[0]
  //   infoYingmenkou.tableInfoYyxt = tableInfoYyxt.value[1]
  //   infoXianlu.tableInfoYyxt = tableInfoYyxt.value[2]
  //   infoXihua.tableInfoYyxt = tableInfoYyxt.value[3]
  //   infoHehuachi.tableInfoYyxt = tableInfoYyxt.value[4]
  //   infoSimaqiao.tableInfoYyxt = tableInfoYyxt.value[5]
  //   infoChadianzi.tableInfoYyxt = tableInfoYyxt.value[6]
  //   infoJiulidi.tableInfoYyxt = tableInfoYyxt.value[7]
  //   infoWukuaishi.tableInfoYyxt = tableInfoYyxt.value[8]
  //   infoJinquan.tableInfoYyxt = tableInfoYyxt.value[9]
  //   infoShaheyuan.tableInfoYyxt = tableInfoYyxt.value[10]
  //   infoTianhuizhen.tableInfoYyxt = tableInfoYyxt.value[11]
  //   infoFenghuangshan.tableInfoYyxt = tableInfoYyxt.value[12]
  // })
});
function showTableFuqin() {
  tableVisibleFuin.value = !tableVisibleFuin.value;
}

function showTableYingmenkou() {
  tableVisibleYingmenkou.value = !tableVisibleYingmenkou.value;
}

function hoverFuqin() {
  polygonFuqin.fillColor = "FF0000";
  infoFuqin.infoVisible = !infoFuqin.infoVisible;
}
function hoverbackFuqin() {
  polygonFuqin.fillColor = "6A5ACD";
}
function hoverYingmenkou() {
  polygonYingmenkou.fillColor = "FF0000";

  infoYingmenkou.infoVisible = !infoYingmenkou.infoVisible;
}
function hoverbackYingmenkou() {
  polygonYingmenkou.fillColor = "00FF00";
}
function hoverXianlu() {
  polygonXianlu.fillColor = "FF0000";
  infoXianlu.infoVisible = !infoXianlu.infoVisible;
}
function hoverbackXianlu() {
  polygonXianlu.fillColor = "00FF00";
}
function hoverXihua() {
  polygonXihua.fillColor = "FF0000";

  infoXihua.infoVisible = !infoXihua.infoVisible;
}
function hoverbackXihua() {
  polygonXihua.fillColor = "000080";
}
function hoverHehuachi() {
  polygonHehuachi.fillColor = "FF0000";
  infoHehuachi.infoVisible = !infoHehuachi.infoVisible;
}
function hoverbackHehuachi() {
  polygonHehuachi.fillColor = "FF8C00";
}
function hoverSimaqiao() {
  polygonSimaqiao.fillColor = "FF0000";

  infoSimaqiao.infoVisible = !infoSimaqiao.infoVisible;
}
function hoverbackSimaqiao() {
  polygonSimaqiao.fillColor = "FFC0CB";
}
function hoverChadianzi() {
  polygonChadianzi.fillColor = "FF0000";
  infoChadianzi.infoVisible = !infoChadianzi.infoVisible;
}
function hoverbackChadianzi() {
  polygonChadianzi.fillColor = "800080";
}
function hoverJinquan() {
  polygonJinquan.fillColor = "FF0000";

  infoJinquan.infoVisible = !infoJinquan.infoVisible;
}
function hoverbackJinquan() {
  polygonJinquan.fillColor = "FF8C00";
}
function hoverShaheyuan() {
  polygonShaheyuan.fillColor = "FF0000";
  infoShaheyuan.infoVisible = !infoShaheyuan.infoVisible;
}
function hoverbackShaheyuan() {
  polygonShaheyuan.fillColor = "00FFFF";
}
function hoverWukuaishi() {
  polygonWukuaishi.fillColor = "FF0000";

  infoWukuaishi.infoVisible = !infoWukuaishi.infoVisible;
}
function hoverbackWukuaishi() {
  polygonWukuaishi.fillColor = "006400";
}
function hoverJiulidi() {
  polygonJiulidi.fillColor = "FF0000";

  infoJiulidi.infoVisible = !infoJiulidi.infoVisible;
}
function hoverbackJiulidi() {
  polygonJiulidi.fillColor = "DC143C";
}
function hoverFenghuangshan() {
  polygonFenghuangshan.fillColor = "FF0000";

  infoFenghuangshan.infoVisible = !infoFenghuangshan.infoVisible;
}
function hoverbackFenghuangshan() {
  polygonFenghuangshan.fillColor = "800080";
}
function hoverTianhuizhen() {
  polygonTianhuizhen.fillColor = "FF0000";

  infoTianhuizhen.infoVisible = !infoTianhuizhen.infoVisible;
}
function hoverbackTianhuizhen() {
  polygonTianhuizhen.fillColor = "00FFFF";
}
const init = (e) => {
  // const marker = new AMap.Marker({
  //   position: [104.05740358713781, 30.697356042874134],
  // },
  // );
  // e.add(marker);
  map = e;
  map.setMapStyle("amap://styles/darkblue");
  // console.log('map init: ', map)
};
const router = useRouter();

//用户信息
const user = reactive({
  username: "张三",
  role: "管理员",
});

function toHome() {
  router.push("/home");
}
//西安路
const polygonXianlu = reactive({
  position: [104.040017, 30.67669],
  fillColor: "	#00FF00",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.03013246, 30.68172081],
      [104.02909597, 30.68086991],
      [104.02994403, 30.68001901],
      [104.0308392, 30.67961382],
      [104.03201704, 30.67965433],
      [104.03267664, 30.6793707],
      [104.03248819, 30.67847926],
      [104.03168726, 30.67807406],
      [104.03116903, 30.67689897],
      [104.03182864, 30.67552126],
      [104.03258248, 30.67349519],
      [104.03201714, 30.67142856],
      [104.03352479, 30.67017235],
      [104.03432573, 30.66924032],
      [104.03569202, 30.66879456],
      [104.03658718, 30.66887561],
      [104.03823617, 30.66745727],
      [104.03969669, 30.66676836],
      [104.04297444, 30.66478905],
      [104.04488327, 30.66359493],
      [104.04656073, 30.6628486],
      [104.04738798, 30.66417963],
      [104.04783231, 30.66515251],
      [104.04859979, 30.6656042],
      [104.04936728, 30.66626436],
      [104.05013477, 30.66706349],
      [104.05078108, 30.66789737],
      [104.05090226, 30.66873123],
      [104.05086186, 30.66942612],
      [104.05085789, 30.67065285],
      [104.05126279, 30.67169764],
      [104.05149417, 30.67269266],
      [104.05224613, 30.67383692],
      [104.05276672, 30.67483192],
      [104.05294025, 30.67537917],
      [104.05328731, 30.67577717],
      [104.05392359, 30.67592642],
      [104.0551383, 30.67642391],
      [104.05612164, 30.6770209],
      [104.05658439, 30.67756813],
      [104.05774126, 30.67831436],
      [104.05803048, 30.67851335],
      [104.05872461, 30.67841385],
      [104.0596501, 30.67821486],
      [104.06074913, 30.67806562],
      [104.06126972, 30.67811537],
      [104.06167463, 30.67861285],
      [104.06184816, 30.67920982],
      [104.06202169, 30.67985654],
      [104.06225307, 30.68055301],
      [104.06236876, 30.68110022],
      [104.06254229, 30.6814982],
      [104.06132758, 30.6813987],
      [104.0610962, 30.6822444],
      [104.06022855, 30.68383627],
      [104.05970796, 30.6846322],
      [104.05947659, 30.68532863],
      [104.05901384, 30.68567684],
      [104.05837756, 30.68572659],
      [104.0561795, 30.68527888],
      [104.05467556, 30.68503016],
      [104.05346084, 30.68468194],
      [104.05149415, 30.68423423],
      [104.04952747, 30.68393576],
      [104.04837059, 30.68373678],
      [104.04669313, 30.68338856],
      [104.04594116, 30.68294084],
      [104.04501567, 30.68229414],
      [104.04397449, 30.68070225],
      [104.04322253, 30.67906058],
      [104.04218135, 30.67761788],
      [104.04148724, 30.67632441],
      [104.04119803, 30.67532942],
      [104.03969409, 30.67652341],
      [104.03842153, 30.67721989],
      [104.03714896, 30.67796612],
      [104.03578307, 30.67864341],
      [104.03436128, 30.67955267],
      [104.0330124, 30.68039921],
      [104.03027819, 30.6818101],
      [104.03013246, 30.68172081],
    ],
  ],
});
//西华
const polygonXihua = reactive({
  position: [104.04591714, 30.68729304],
  fillColor: "#000080",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.03686931, 30.72849105],
      [104.03822271, 30.72861351],
      [104.0395405, 30.72884313],
      [104.04139253, 30.72933297],
      [104.04324456, 30.72977689],
      [104.04523906, 30.73037388],
      [104.04596919, 30.73060349],
      [104.0464678, 30.72953197],
      [104.04700202, 30.72821551],
      [104.0474472, 30.72712866],
      [104.04796817, 30.7258438],
      [104.04621203, 30.7249957],
      [104.04475188, 30.72401191],
      [104.04053446, 30.72070958],
      [104.0374189, 30.71813835],
      [104.03249633, 30.71422784],
      [104.02749068, 30.71044215],
      [104.02273429, 30.7080135],
      [104.02059496, 30.7068706],
      [104.01912109, 30.70975928],
      [104.01822798, 30.7112772],
      [104.01727255, 30.71256291],
      [104.01631712, 30.71367004],
      [104.01505013, 30.71517001],
      [104.01347157, 30.71709851],
      [104.01172689, 30.71922336],
      [104.01037681, 30.72095537],
      [104.00987831, 30.72175887],
      [104.00927598, 30.72347291],
      [104.00852824, 30.7254191],
      [104.00787809, 30.72621746],
      [104.0026125, 30.72954815],
      [103.99807546334462, 30.732244775580245],
      [103.99865579516742, 30.732944648154167],
      [103.99883628939958, 30.734503605512835],
      [103.99886178961499, 30.73463511778158],
      [103.99926979677379, 30.734591280374453],
      [103.99924429633106, 30.734591280374453],
      [103.99937179857014, 30.734569361664967],
      [103.99957729899444, 30.73463035970868],
      [103.99960092748708, 30.73487407569974],
      [103.99934101515912, 30.73500608838663],
      [103.99904566017904, 30.73499593356809],
      [103.99897477492298, 30.73505686247048],
      [103.99893933188328, 30.735463054611518],
      [103.99909291633531, 30.735889555345853],
      [104.00110583729051, 30.73660777818802],
      [104.00262134532022, 30.73722891282599],
      [104.00306642128797, 30.73742018823684],
      [104.0023333556398, 30.738297801936298],
      [104.00167883043376, 30.739096651303655],
      [104.00118201303265, 30.739412330528765],
      [104.00085406108717, 30.739562663461133],
      [104.00043865555786, 30.739487497017155],
      [104.000154431161, 30.739243205767618],
      [103.99982647941351, 30.739261997418843],
      [103.99952038901634, 30.74001366119294],
      [103.99923616279, 30.740370699930633],
      [103.99898220164381, 30.741009371533803],
      [103.99871143489541, 30.741516975424275],
      [103.99814298433749, 30.741366644800163],
      [103.99798994051753, 30.7412163139985],
      [103.99768385179179, 30.7411599399021],
      [103.99724658008284, 30.74146060146105],
      [103.99715912517635, 30.741610931974176],
      [103.99722471452668, 30.741817636139782],
      [103.99683116909864, 30.742155878595746],
      [103.99641576068717, 30.742362581876293],
      [103.99569426007079, 30.742888734166424],
      [103.99573798559187, 30.74309543625668],
      [103.99613152499963, 30.743734331503987],
      [103.99661252208561, 30.743959823178404],
      [103.99713724782004, 30.74397861413324],
      [103.99755265538982, 30.744053777924826],
      [103.99820857643793, 30.745030897588624],
      [103.9986677052588, 30.74600799944684],
      [103.99936733952991, 30.746365016275405],
      [103.99969529017348, 30.746665659122876],
      [103.99969528957278, 30.747022671581604],
      [103.99930174622926, 30.747774273483554],
      [103.99862352811094, 30.749427269756335],
      [103.99807578723092, 30.750305972039065],
      [103.99785669062545, 30.750808084553274],
      [103.99803927706127, 30.75124745652223],
      [103.99858701715965, 30.751718180436985],
      [103.99849920479942, 30.752314941630946],
      [103.99814304620982, 30.752804663940193],
      [103.99805400630956, 30.75321786577928],
      [103.99792083068132, 30.75341985355825],
      [103.9979293502317, 30.75383001436509],
      [103.99778688639601, 30.753983051084866],
      [103.9976088064967, 30.754181998565436],
      [103.99730607079097, 30.75430442764087],
      [103.99657594387534, 30.75430442764087],
      [103.99627320766095, 30.75450337465549],
      [103.9967005989122, 30.75459519625727],
      [103.9967540226982, 30.754656410624325],
      [103.99621849395399, 30.7550831468732],
      [103.99598673680941, 30.75573042404461],
      [103.99760903207192, 30.75573042404461],
      [103.99870987527198, 30.755630843198574],
      [103.9996948410219, 30.756975176726826],
      [104.0006217979931, 30.759166181238086],
      [104.00131706238928, 30.759614276260557],
      [104.00288141903516, 30.759215969667455],
      [104.00496722806753, 30.758518929527664],
      [104.00635776832662, 30.757772095719506],
      [104.00682128465387, 30.756975467190564],
      [104.00757449287327, 30.75662694032645],
      [104.0091967797936, 30.757373782203445],
      [104.0100658608952, 30.75817040773874],
      [104.01081906805707, 30.758070829874256],
      [104.01151433184346, 30.759215969667455],
      [104.01215166224051, 30.758817661577485],
      [104.01336838216834, 30.758469140770853],
      [104.01365415654892, 30.758023978186426],
      [104.01350111963022, 30.756971834652575],
      [104.01387280482476, 30.756276663613527],
      [104.01509716616606, 30.755543911648044],
      [104.01621220664158, 30.75509298526325],
      [104.01691184283362, 30.753740196516716],
      [104.01675879417088, 30.75317655959807],
      [104.01621220582783, 30.75280077488422],
      [104.01577493773848, 30.75208678086943],
      [104.01509717505124, 30.750771518246186],
      [104.01431008938671, 30.750527253690322],
      [104.01317318649271, 30.75043330565935],
      [104.01295455504093, 30.75000114382322],
      [104.01251729658567, 30.74874222923794],
      [104.01271407105345, 30.748404011256298],
      [104.0158624148124, 30.747163842842575],
      [104.01678068529843, 30.74684440853805],
      [104.01758963541361, 30.746806827978915],
      [104.01820181223276, 30.74701352091681],
      [104.01892330376637, 30.747765128769668],
      [104.01949175187963, 30.748497942151317],
      [104.02003833931624, 30.748817372304458],
      [104.02058492847146, 30.748798582317658],
      [104.02100033683834, 30.748591892279613],
      [104.021284564605, 30.748065770667612],
      [104.02135015634305, 30.74767117803086],
      [104.02121897778325, 30.74678803769519],
      [104.02095661967476, 30.745585453764694],
      [104.02100034870253, 30.744946576428806],
      [104.02132828785268, 30.743706424049293],
      [104.0212408347, 30.743274229816656],
      [104.02086915690899, 30.742353463296148],
      [104.02071611508742, 30.74147027282318],
      [104.02104406936719, 30.741000488159656],
      [104.0218092930382, 30.74062465918036],
      [104.02259120395514, 30.740638837716528],
      [104.02323093897294, 30.741005401833863],
      [104.02405193397018, 30.74151859042277],
      [104.02448908824482, 30.741628560120333],
      [104.02486225690097, 30.74162857882441],
      [104.0255339873899, 30.741225355933107],
      [104.02598180878161, 30.740620520008875],
      [104.02638697891425, 30.740162309707326],
      [104.02704804297058, 30.73975908373778],
      [104.02771976796784, 30.73931919989649],
      [104.02794367604777, 30.738961793533722],
      [104.02780506685042, 30.738512743571196],
      [104.02749586167809, 30.73827447173626],
      [104.02683480158984, 30.738384443389112],
      [104.02601380653599, 30.73862271508765],
      [104.02558731678059, 30.73850357927533],
      [104.02545937204262, 30.738155335707958],
      [104.02553399471773, 30.73785291484307],
      [104.02633047612532, 30.737084929854785],
      [104.02703952327518, 30.73635360094132],
      [104.02713068348767, 30.73598794822633],
      [104.0275865040593, 30.734681982933385],
      [104.0282347730808, 30.733793937475674],
      [104.02882226863431, 30.73348049934714],
      [104.03052397417378, 30.732688195250883],
      [104.03282395108238, 30.731701640753965],
      [104.0344201562693, 30.73056613943442],
      [104.03593838758196, 30.73003458840436],
      [104.03656678, 30.72957257],
      [104.0365675511272, 30.729565279405364],
      [104.03656678, 30.72957257],
      [104.03686931, 30.72849105],
    ],
  ],
});
//五块石
const polygonWukuaishi = reactive({
  position: [104.061502, 30.705081],
  fillColor: "#006400",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.04995523, 30.71827757],
      [104.05089906, 30.71831814],
      [104.05160693, 30.71912955],
      [104.05259796, 30.71990038],
      [104.05391933, 30.71965696],
      [104.05462721, 30.71957582],
      [104.05632613, 30.71892669],
      [104.05722277, 30.71908898],
      [104.05793026, 30.71916189],
      [104.05927651, 30.71889274],
      [104.0607793, 30.71870434],
      [104.06218816, 30.71865051],
      [104.0627517, 30.71840827],
      [104.06384748, 30.71851593],
      [104.06456757, 30.71843518],
      [104.06509981, 30.71821986],
      [104.06519373, 30.71770847],
      [104.0650372, 30.71703559],
      [104.06572598, 30.71652419],
      [104.06625822, 30.71560906],
      [104.06672784, 30.71472083],
      [104.06707223, 30.714667],
      [104.06754185, 30.71480158],
      [104.06848109, 30.71453245],
      [104.06869462, 30.71464819],
      [104.06914935, 30.71457711],
      [104.06990722, 30.7142691],
      [104.07040328, 30.71398478],
      [104.07084423, 30.71384262],
      [104.07065132, 30.71341614],
      [104.07155351, 30.71196237],
      [104.07160394, 30.70991407],
      [104.07158262, 30.70831899],
      [104.07144401, 30.70819982],
      [104.06957811, 30.70830983],
      [104.0695248, 30.70811732],
      [104.06970607, 30.70676973],
      [104.06994064, 30.70667806],
      [104.07127342, 30.70704475],
      [104.07144402, 30.70699891],
      [104.07157197, 30.70679723],
      [104.07156131, 30.70577049],
      [104.07172125, 30.70547713],
      [104.0717639, 30.70529378],
      [104.07157198, 30.70485375],
      [104.07161788, 30.70279096],
      [104.07149417, 30.70216256],
      [104.07136418, 30.70183171],
      [104.07122898, 30.70172441],
      [104.07051142, 30.70167522],
      [104.07041783, 30.70160369],
      [104.07056342, 30.70155004],
      [104.07074541, 30.70148745],
      [104.07080781, 30.70128178],
      [104.07087021, 30.70053961],
      [104.0709742, 30.70042336],
      [104.0711302, 30.70022664],
      [104.0711614, 30.69988237],
      [104.07117094, 30.69889617],
      [104.07111002, 30.69844681],
      [104.06985188, 30.69813509],
      [104.06831652, 30.69789672],
      [104.0666852, 30.69753],
      [104.06253238, 30.69715915],
      [104.06163237, 30.69733881],
      [104.06068413, 30.69808507],
      [104.05971981, 30.69957757],
      [104.05930195, 30.70064165],
      [104.05947872, 30.70178863],
      [104.05933407, 30.70274214],
      [104.05888406, 30.70335017],
      [104.0578876, 30.70404111],
      [104.05640899, 30.70507751],
      [104.05591078, 30.7055888],
      [104.05552505, 30.706791],
      [104.05530004, 30.70764773],
      [104.05541253, 30.70813137],
      [104.05576611, 30.70853209],
      [104.05648933, 30.70855973],
      [104.05746971, 30.70853209],
      [104.058209, 30.70875318],
      [104.05889571, 30.70910471],
      [104.0594904, 30.70970331],
      [104.05966445, 30.71050143],
      [104.05933084, 30.71114986],
      [104.05877966, 30.71189809],
      [104.0582865, 30.71225973],
      [104.0576628, 30.71234702],
      [104.05698107, 30.71229714],
      [104.05656044, 30.71207268],
      [104.05596575, 30.71163621],
      [104.0551825, 30.71106257],
      [104.05470385, 30.71075081],
      [104.05355798, 30.71063857],
      [104.05280375, 30.71026446],
      [104.05228159, 30.70969081],
      [104.05196248, 30.70936657],
      [104.05148383, 30.70937905],
      [104.05103418, 30.70962846],
      [104.05064255, 30.71013976],
      [104.05075858, 30.71093787],
      [104.05099067, 30.71168608],
      [104.05132426, 30.71252159],
      [104.05162886, 30.71334462],
      [104.05188994, 30.71374367],
      [104.05202048, 30.71404295],
      [104.05202047, 30.71429235],
      [104.05186092, 30.71495326],
      [104.05159984, 30.71551439],
      [104.0511792, 30.71626258],
      [104.05013484, 30.71789612],
      [104.04993177, 30.71825774],
      [104.04995523, 30.71827757],
    ],
  ],
});
//荷花池
const polygonHehuachi = reactive({
  position: [104.063201, 30.690469],
  fillColor: "#FF8C00",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.06253059, 30.68155135],
      [104.06179772, 30.68151196],
      [104.06155343, 30.68147256],
      [104.06144656, 30.68156448],
      [104.06115646, 30.68207658],
      [104.06060681, 30.68320581],
      [104.05981288, 30.68476837],
      [104.05918689, 30.68596324],
      [104.05903421, 30.68602889],
      [104.05871358, 30.68675105],
      [104.0577047, 30.687708],
      [104.05715352, 30.68839403],
      [104.05713901, 30.68986588],
      [104.05731307, 30.69459313],
      [104.05918418, 30.69461808],
      [104.06062014, 30.69463055],
      [104.06072168, 30.69655131],
      [104.06083772, 30.69768631],
      [104.06064916, 30.69826003],
      [104.06037357, 30.69870903],
      [104.0607507, 30.69860925],
      [104.06164999, 30.69819767],
      [104.06254927, 30.69757406],
      [104.06278135, 30.69723731],
      [104.06330351, 30.69711259],
      [104.06442037, 30.69722484],
      [104.06640751, 30.69732462],
      [104.06672660070117, 30.697461803322298],
      [104.06733579, 30.69778609],
      [104.07073121057532, 30.69824635147214],
      [104.07267559854544, 30.69886977801905],
      [104.07293924501904, 30.69875642798899],
      [104.07640184021766, 30.698324294862367],
      [104.07943973036092, 30.697552508049046],
      [104.08155704456581, 30.69741398170847],
      [104.08137292983838, 30.6945444731325],
      [104.08137291647799, 30.69296131301442],
      [104.08114277198709, 30.69028957232968],
      [104.08061344456495, 30.68910211377835],
      [104.0807055014218, 30.688508380292056],
      [104.08139593885063, 30.68777613202398],
      [104.08362832142522, 30.685816753797432],
      [104.08507821715433, 30.685163620929227],
      [104.08305295406039, 30.682353131657145],
      [104.08116578207539, 30.67950296045459],
      [104.07870324104391, 30.67562343863477],
      [104.07758840248395, 30.676089080871144],
      [104.0764824416067, 30.676379275828538],
      [104.07496408951883, 30.67774963247114],
      [104.07391436038647, 30.67807206730519],
      [104.07166493869907, 30.67821716272907],
      [104.0704465221141, 30.678668626631154],
      [104.06902190356053, 30.67986161019122],
      [104.06789719926893, 30.680441976756665],
      [104.06587272254363, 30.68103844869835],
      [104.06439185731371, 30.681892867593117],
      [104.06307969542638, 30.682344256522175],
      [104.06253059, 30.68155135],
    ],
  ],
});
//金泉
const polygonJinquan = reactive({
  position: [103.988429, 30.712804],

  fillColor: "#FF8C00",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [103.99802641, 30.73214067],
      [104.00244514, 30.72947002],
      [104.00573616, 30.72751151],
      [104.00723207, 30.72648278],
      [104.00783043, 30.72612668],
      [104.0082677, 30.72557274],
      [104.00845182, 30.72529574],
      [104.00902717, 30.7238713],
      [104.00964855, 30.72215008],
      [104.01015485, 30.72106194],
      [104.01112144, 30.7198155],
      [104.0128475, 30.71767872],
      [104.01402121, 30.71625418],
      [104.01576526, 30.71420363],
      [104.01689264, 30.71281897],
      [104.0179395, 30.71148046],
      [104.01866424, 30.71030348],
      [104.01944266, 30.70884954],
      [104.02024793, 30.7072109],
      [104.02054319, 30.70674932],
      [104.01573836, 30.70478759],
      [104.01133618, 30.70361053],
      [104.0093673, 30.70288174],
      [104.00702055, 30.70117704],
      [104.00398597, 30.6987417],
      [104.00309582, 30.69752401],
      [104.00278857, 30.69689027],
      [104.00250109, 30.69628367],
      [104.00206491, 30.69630153],
      [104.00162874, 30.69651585],
      [104.00154566, 30.69674803],
      [104.00148335, 30.69701593],
      [104.00125487, 30.69723025],
      [104.00096409, 30.69744456],
      [104.00065254, 30.69739098],
      [104.00032021, 30.69737312],
      [104.00010144291716, 30.69760744078497],
      [103.99973864, 30.69781962],
      [103.99965556, 30.69835541],
      [103.99957248, 30.6988019],
      [103.99938555, 30.69894478],
      [103.99890783, 30.69923053],
      [103.9989286, 30.69940913],
      [103.99913631, 30.69962344],
      [103.99938555, 30.69994492],
      [103.9992817, 30.70010565],
      [103.99890783, 30.70033782],
      [103.99830549, 30.70065929],
      [103.99830500190946, 30.701120224683073],
      [103.99886854357642, 30.70243929081997],
      [103.99874331142429, 30.702923841968246],
      [103.99905639072553, 30.70370450345846],
      [103.99833630672727, 30.704000615065944],
      [103.99767883867003, 30.704108291827097],
      [103.99724052736808, 30.703785261244416],
      [103.99752230013115, 30.70330071368709],
      [103.99733445259763, 30.703139197385777],
      [103.99670829257991, 30.70338147175357],
      [103.99589428734414, 30.702708486151707],
      [103.99558120775794, 30.702708486151707],
      [103.99542466669129, 30.703058439150958],
      [103.99523681775507, 30.703354552404313],
      [103.99432888247243, 30.70421596848849],
      [103.99417234247151, 30.70421596848849],
      [103.99382795596348, 30.70391985742963],
      [103.9931078719942, 30.70394677664797],
      [103.99273217430137, 30.704242887638248],
      [103.99245040178762, 30.704323645050135],
      [103.99210601481279, 30.70416213017026],
      [103.99176162553353, 30.704350564174955],
      [103.99132331406459, 30.704269806781774],
      [103.99038407510186, 30.7041352110018],
      [103.99022753378509, 30.704296725919075],
      [103.99007099084969, 30.70464667413654],
      [103.99007098747659, 30.705050459232066],
      [103.98985183131425, 30.705050459232066],
      [103.98935090512074, 30.7048081883431],
      [103.98844296579186, 30.7055080806445],
      [103.98841633632877, 30.703896096595454],
      [103.98873316420095, 30.70400528193291],
      [103.98892396167342, 30.704159683963482],
      [103.98917087735828, 30.704227234810997],
      [103.98946268933523, 30.703985981669952],
      [103.989675937669, 30.703619276287846],
      [103.98955248169264, 30.70334907185299],
      [103.98923822731479, 30.703098167378506],
      [103.98898008844736, 30.703078867020103],
      [103.98890152474142, 30.703040266297204],
      [103.98847503653217, 30.702808661789216],
      [103.98812711046178, 30.70278936140034],
      [103.98775673688976, 30.702827962176052],
      [103.98761082786407, 30.702731459892338],
      [103.9872741257095, 30.702422651115416],
      [103.9867751883312, 30.701632041165716],
      [103.98630834039221, 30.70099341920122],
      [103.98632248979655, 30.700786627102502],
      [103.9866195811875, 30.700512931508808],
      [103.987206682753, 30.70028788320146],
      [103.98779378953508, 30.70030004763709],
      [103.98871335414442, 30.70047034969588],
      [103.98913776900939, 30.70051900741329],
      [103.98944193300787, 30.700403445324525],
      [103.98973194939217, 30.700178403263777],
      [103.98985219929432, 30.699789141013788],
      [103.98984512446286, 30.699199164674326],
      [103.98985219404487, 30.698633508017203],
      [103.98974292627325, 30.69838499648419],
      [103.98939297134868, 30.698052069269636],
      [103.98913236726003, 30.697770361370537],
      [103.98909513863661, 30.6975398729149],
      [103.9891770438803, 30.69707889553233],
      [103.98931851225184, 30.696579488558882],
      [103.98959400953252, 30.696284971144078],
      [103.98999608528337, 30.69611850466574],
      [103.99030136469646, 30.696124907224117],
      [103.99084491132497, 30.6962913736993],
      [103.991112961693, 30.696284971144078],
      [103.99137356519957, 30.696028868835793],
      [103.9913810069859, 30.69547823892017],
      [103.99088040195943, 30.695396070034185],
      [103.99057503965331, 30.695264780271117],
      [103.99039182232755, 30.694975942382847],
      [103.99040519119775, 30.694778897422204],
      [103.99040518960628, 30.694380755313357],
      [103.99026272500949, 30.69421231022834],
      [103.99006683642321, 30.694013238498474],
      [103.98981065992366, 30.693891875476712],
      [103.98909896077102, 30.694072233140886],
      [103.98862438945231, 30.69386010620266],
      [103.98844630999963, 30.694227623426396],
      [103.98814357430697, 30.69453388702997],
      [103.98778741432008, 30.694549200192252],
      [103.9875024863473, 30.694503260700277],
      [103.98698605435231, 30.69453388702997],
      [103.98661208648178, 30.694472634363766],
      [103.98671893603782, 30.69355384110003],
      [103.98657647308694, 30.693125068811607],
      [103.98632716206593, 30.692941308850614],
      [103.9857929235483, 30.69289536882203],
      [103.9855067967725, 30.692740304480676],
      [103.98488062962561, 30.69291032576282],
      [103.98435333643319, 30.693335411794767],
      [103.98385900043037, 30.693392089813752],
      [103.98367377444907, 30.69329351522705],
      [103.98338884858401, 30.69306381551853],
      [103.98344227370652, 30.692880055475758],
      [103.98365596994128, 30.692757548644295],
      [103.98401212939966, 30.692680981819276],
      [103.9841367856489, 30.692573788192714],
      [103.98404774735444, 30.6923287738757],
      [103.98386966871902, 30.69220626655367],
      [103.98363816615742, 30.692114385990603],
      [103.9832998160813, 30.692022505366225],
      [103.98306831253952, 30.69208375912262],
      [103.98283680824466, 30.692236893394387],
      [103.98251626426479, 30.69237471409335],
      [103.98208887411785, 30.6923287738757],
      [103.98159025435115, 30.692068445686086],
      [103.98116286620932, 30.69185405739558],
      [103.9808779390732, 30.691884684314655],
      [103.98068014668871, 30.692318250626123],
      [103.98068014184199, 30.692878183827542],
      [103.97985139604943, 30.694048945583425],
      [103.97876613486157, 30.695117892911735],
      [103.97841095608688, 30.695609945125135],
      [103.97681266595373, 30.696373470794654],
      [103.97616154850716, 30.696746745230787],
      [103.97588530302949, 30.696899446928022],
      [103.97570771123962, 30.697544185482045],
      [103.97572744115604, 30.697730819739515],
      [103.97545119262402, 30.69813802084083],
      [103.97461657885127, 30.69852228132508],
      [103.97366097197899, 30.698859961358558],
      [103.9732813461631, 30.69906256904199],
      [103.9730195294017, 30.699670390577385],
      [103.97322896695562, 30.700548351005597],
      [103.97413220500837, 30.701673917449774],
      [103.97410602359322, 30.702619387542953],
      [103.97330749280873, 30.703508575402573],
      [103.97329439551196, 30.70402632811802],
      [103.9738310992641, 30.70464537811291],
      [103.97377873331548, 30.704960529931853],
      [103.97350384747918, 30.70525315274164],
      [103.97283623280921, 30.705365705091154],
      [103.9720638997852, 30.704983026784806],
      [103.97159264328471, 30.704994282041973],
      [103.97125228922714, 30.705163110805902],
      [103.97113445688363, 30.70651373460381],
      [103.97144861668215, 30.707459164583593],
      [103.971540239824, 30.708292038818122],
      [103.97104280657237, 30.709462535725258],
      [103.97092497853221, 30.710790590657023],
      [103.97033590120371, 30.711207012425486],
      [103.96966830575376, 30.711308296893307],
      [103.96624080555821, 30.71148030334203],
      [103.96453509897835, 30.711927757767352],
      [103.96389087741338, 30.71181236880707],
      [103.96287086229103, 30.711304656066833],
      [103.96177031678928, 30.711304656066833],
      [103.96163610252846, 30.711489279129406],
      [103.96171662388315, 30.71234315710784],
      [103.96203872538199, 30.713704733777284],
      [103.9610992178504, 30.715573991895035],
      [103.96048182990776, 30.716266302343595],
      [103.95954233662498, 30.716104763595403],
      [103.9590591669831, 30.716197071478092],
      [103.95769018029716, 30.716935531988852],
      [103.9572342287043, 30.71691328415384],
      [103.95652191425802, 30.716224350537598],
      [103.95616575729447, 30.715918156711222],
      [103.95561371096413, 30.715856917864123],
      [103.95481235141764, 30.715979395531047],
      [103.95411783558228, 30.716438685810346],
      [103.95370824734232, 30.716836736144717],
      [103.9537616600818, 30.717785928445405],
      [103.95413561890035, 30.719561760299985],
      [103.95504381819995, 30.720434379878792],
      [103.95636160511265, 30.721245758026086],
      [103.95780405235747, 30.721919351340155],
      [103.95896157448362, 30.72227145562242],
      [103.95944800567727, 30.722264718708548],
      [103.96049745518903, 30.721588097270374],
      [103.96100031358964, 30.721776048030343],
      [103.9611141235237, 30.721724314615784],
      [103.96115335826838, 30.72164448252748],
      [103.96096628824907, 30.72141814209649],
      [103.96097300894995, 30.72132571261682],
      [103.96105364798538, 30.721291051557174],
      [103.96120148579938, 30.72127372102638],
      [103.96133588322306, 30.721337266302797],
      [103.96143668091563, 30.721447026305103],
      [103.9614098006831, 30.721539455760485],
      [103.96144339925335, 30.72167809990891],
      [103.96147027768406, 30.721857181872334],
      [103.96134259848019, 30.72198427225588],
      [103.96128883891487, 30.722018933263506],
      [103.96139635582237, 30.72226733707537],
      [103.96148371419214, 30.722359766366598],
      [103.96121377750762, 30.72271108877539],
      [103.96064391960329, 30.723476518535538],
      [103.96075077802732, 30.723905155506905],
      [103.96100008847588, 30.724073547599733],
      [103.96169459745784, 30.724272556170718],
      [103.96203294831369, 30.724272556170718],
      [103.96233568325026, 30.724303172848366],
      [103.96233568311139, 30.724410331166432],
      [103.96228362835242, 30.724708816116667],
      [103.96200217389213, 30.725254777339355],
      [103.96205317470931, 30.725846640916153],
      [103.96299669760296, 30.726416626748474],
      [103.96355222277577, 30.726336194969235],
      [103.96403450535865, 30.726205898726683],
      [103.96455812616747, 30.726063757247783],
      [103.96485823790157, 30.72617549848167],
      [103.9652095845578, 30.72641223475796],
      [103.9657464365464, 30.7270583177809],
      [103.96612223399413, 30.727173689383854],
      [103.96652487442998, 30.727150615072127],
      [103.96698120041438, 30.726942946067215],
      [103.96711541414584, 30.726596830261737],
      [103.9671422571479, 30.726204564477378],
      [103.96719594292684, 30.725627700704347],
      [103.96733013924707, 30.725120116707085],
      [103.96770593977772, 30.724220192683248],
      [103.96800121077592, 30.7236894651009],
      [103.96797436854823, 30.72345871324732],
      [103.96746435745494, 30.723389487604898],
      [103.96692750337672, 30.723435638037607],
      [103.96660539164297, 30.723251036200427],
      [103.96620275232705, 30.72297413291317],
      [103.96628984111807, 30.722534676332806],
      [103.96646001844447, 30.72241088970255],
      [103.96689200606477, 30.722264596290575],
      [103.96712763615825, 30.721983262435508],
      [103.96750726146279, 30.721701928092937],
      [103.96793945815321, 30.721664792954964],
      [103.96819296338205, 30.721704416352463],
      [103.96833700046338, 30.72164993418058],
      [103.96852712932281, 30.721441910941326],
      [103.96867692723822, 30.721149688681816],
      [103.96878063259742, 30.721011007265023],
      [103.96895341767284, 30.720872460786993],
      [103.96993750965085, 30.720576648142185],
      [103.97022687894945, 30.72042265217033],
      [103.97073671929189, 30.719854050350424],
      [103.97113632316102, 30.719451289482144],
      [103.97132923532754, 30.719332830206618],
      [103.97145365691463, 30.719305166363352],
      [103.97184971005237, 30.71938614236566],
      [103.9718497102946, 30.719493276678655],
      [103.97171137747871, 30.719702070333835],
      [103.97169828728367, 30.7199946616951],
      [103.97165901608918, 30.72020847812569],
      [103.97167210678224, 30.720501068574457],
      [103.97163283621984, 30.721671425097203],
      [103.97165901736642, 30.721862732572788],
      [103.97168519844101, 30.72194150617369],
      [103.97193391825411, 30.722076546543438],
      [103.97222190955341, 30.722110306618315],
      [103.97226118108799, 30.722110306618315],
      [103.97265389675665, 30.722222840150597],
      [103.9730204311664, 30.722222840150597],
      [103.97317751693986, 30.722121559975072],
      [103.97333460254947, 30.72199777300806],
      [103.97349168750367, 30.72175019879092],
      [103.97357022900147, 30.721435103786764],
      [103.97357022759763, 30.721142515021096],
      [103.97345241180041, 30.72082741883764],
      [103.97320369130368, 30.720467308164974],
      [103.9730596951698, 30.72019722463637],
      [103.97309896586098, 30.720017168701048],
      [103.97294187799109, 30.71931945006593],
      [103.97291569581368, 30.718936828896467],
      [103.97413311581538, 30.718441647437633],
      [103.97436874341707, 30.71813779634724],
      [103.97461746068349, 30.71771015310876],
      [103.9747876355451, 30.71745131586472],
      [103.97514107792188, 30.717473823467532],
      [103.97529816368599, 30.717530092460926],
      [103.97565160831005, 30.717901467328346],
      [103.97576942686561, 30.718576692184207],
      [103.97633448405553, 30.719499824552592],
      [103.97743193401918, 30.72069236112627],
      [103.97787701146027, 30.720861163413776],
      [103.97828281781669, 30.721052472460798],
      [103.97849226757295, 30.721378822667862],
      [103.9789635268594, 30.721513863940963],
      [103.97917297624015, 30.721682665374413],
      [103.97913569047648, 30.721936278356655],
      [103.9784436147289, 30.722644540124424],
      [103.97813075136311, 30.723020322568324],
      [103.9766905885372, 30.72433908978924],
      [103.97503126645047, 30.725496362971718],
      [103.9739041775207, 30.726519059905137],
      [103.97327801686691, 30.726680537544883],
      [103.97277708789922, 30.726949666445456],
      [103.97271447121605, 30.727218794722223],
      [103.9731214751212, 30.72751483510617],
      [103.97349717061573, 30.72816073877835],
      [103.97390417496025, 30.728537514261102],
      [103.97449902835969, 30.728537514261102],
      [103.97490603344191, 30.728214563922176],
      [103.9756887352566, 30.728860463701686],
      [103.97590789204827, 30.72929106155843],
      [103.97637751412604, 30.730017691820198],
      [103.97690975274008, 30.730502109468098],
      [103.97850646712264, 30.730394377287208],
      [103.9792578585674, 30.72993687565395],
      [103.98000924963816, 30.729802316006953],
      [103.98063540924547, 30.73009834702451],
      [103.98119895360351, 30.730609671549594],
      [103.9815623535787, 30.73068065955039],
      [103.9824100203976, 30.730660638640902],
      [103.9826890787748, 30.730743353536855],
      [103.98293926847813, 30.73104112689916],
      [103.98311632036504, 30.731306468824886],
      [103.9832760630431, 30.731413343022975],
      [103.98379409057192, 30.731456816121543],
      [103.98398814537006, 30.73133062838439],
      [103.98410361297503, 30.73110730738332],
      [103.98439229566986, 30.730933605494048],
      [103.98459437344192, 30.73071854581795],
      [103.9846328644222, 30.730668916631423],
      [103.98464248718301, 30.73061928743346],
      [103.98467135545539, 30.730453856690986],
      [103.98465211002869, 30.730371141272084],
      [103.984594373733, 30.730238796535744],
      [103.98463236311372, 30.7301132779045],
      [103.98471878531001, 30.730048895621408],
      [103.9848060736979, 30.73004855083479],
      [103.9852152270539, 30.730009716023],
      [103.98537357046995, 30.729925466196015],
      [103.98548082341162, 30.729726895460345],
      [103.98561282712365, 30.729577967313116],
      [103.98586858459028, 30.729457406372067],
      [103.98609134010269, 30.72917373335806],
      [103.98718294465922, 30.72809275290809],
      [103.98805748402218, 30.727265819872493],
      [103.98879625425946, 30.726605507268175],
      [103.98887883845418, 30.726322376402003],
      [103.98892148760835, 30.726139067589493],
      [103.98892148769453, 30.726038247668118],
      [103.98898546128905, 30.725827442207134],
      [103.98910274589615, 30.72579078036426],
      [103.9892626794163, 30.725772449440182],
      [103.98934092201534, 30.726106989364503],
      [103.98952347620676, 30.72619484721118],
      [103.98992751956932, 30.726185199362295],
      [103.99021932748498, 30.726407099758163],
      [103.99044379505204, 30.72663864771071],
      [103.99060092317585, 30.72663864771071],
      [103.99066826399324, 30.726590408578062],
      [103.99076927546075, 30.72644569110391],
      [103.99097129827447, 30.72612731225827],
      [103.99111720400674, 30.725702806269872],
      [103.99127433205979, 30.725587031738655],
      [103.99147635311994, 30.72573174989126],
      [103.99191406595962, 30.725992242277787],
      [103.99222832167304, 30.72620449505956],
      [103.99241911990559, 30.72620449505956],
      [103.99276649931974, 30.72602886745333],
      [103.99320714307284, 30.725392383653666],
      [103.99342083726364, 30.72479536548319],
      [103.99358275317249, 30.724640255071897],
      [103.99384611013451, 30.724875351619747],
      [103.99406895088704, 30.724918887987588],
      [103.99426140426628, 30.724892766167994],
      [103.99441808081407, 30.72516276158733],
      [103.99526419172098, 30.726094366388548],
      [103.99500002667794, 30.726209125103345],
      [103.99466458736629, 30.72646355140837],
      [103.99428968522597, 30.72714201915669],
      [103.99385558657151, 30.727599982914555],
      [103.99381612345893, 30.727905291203363],
      [103.99411210086288, 30.72800706047596],
      [103.99490137648465, 30.7289569032348],
      [103.99567326009957, 30.729757624677],
      [103.99595648739928, 30.730209762459115],
      [103.99636109814858, 30.7305227798444],
      [103.99709162074377, 30.73053430556502],
      [103.99724947670033, 30.730669995207055],
      [103.99688709243674, 30.731114032496237],
      [103.99668478706114, 30.731913957539756],
      [103.99764953746907, 30.732369597199956],
      [103.99802641, 30.73214067],
    ],
  ],
});
//沙河源
const polygonShaheyuan = reactive({
  position: [104.049849, 30.736595],
  fillColor: "#00FFFF",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.0708764, 30.71383492],
      [104.07072244, 30.7145133],
      [104.07088602, 30.71497657],
      [104.07103999, 30.71539849],
      [104.07105923, 30.71589486],
      [104.07099188, 30.71626713],
      [104.07079942, 30.71654013],
      [104.0707898, 30.71684622],
      [104.07073207, 30.71745838],
      [104.0706166, 30.71814501],
      [104.07058773, 30.71831046],
      [104.07086679, 30.71839318],
      [104.07108811, 30.71831046],
      [104.07127094, 30.71835182],
      [104.07152113, 30.71856691],
      [104.0717617, 30.71862482],
      [104.07194453, 30.71855036],
      [104.07190604, 30.71836009],
      [104.07186755, 30.71815328],
      [104.0719734, 30.71797956],
      [104.07235831, 30.71791338],
      [104.07259888, 30.71788028],
      [104.07258925, 30.71759074],
      [104.07256038, 30.71738393],
      [104.07265661, 30.71725157],
      [104.07293567, 30.71716884],
      [104.07337831, 30.7170613],
      [104.07364774, 30.71697857],
      [104.07375359, 30.71689584],
      [104.07394605, 30.71690412],
      [104.07406153, 30.71758247],
      [104.07420587, 30.71838491],
      [104.07432136, 30.71910463],
      [104.07453307, 30.72055228],
      [104.07469667, 30.72123889],
      [104.07502387, 30.72362127],
      [104.07511049, 30.72547419],
      [104.07507201, 30.72616076],
      [104.07494692, 30.7263841],
      [104.07461975, 30.72661572],
      [104.0741771, 30.72715337],
      [104.07402314, 30.72729399],
      [104.07343616, 30.72742634],
      [104.07299351, 30.72744288],
      [104.0728203, 30.72736844],
      [104.07257973, 30.72744288],
      [104.07226219, 30.72798055],
      [104.07217559, 30.72846031],
      [104.07211785, 30.72871673],
      [104.0722237, 30.72885735],
      [104.07247389, 30.72907242],
      [104.07238729, 30.72918822],
      [104.07230068, 30.72923785],
      [104.07211785, 30.72912205],
      [104.07202162, 30.7289897],
      [104.07187728, 30.72896488],
      [104.07177143, 30.72903104],
      [104.07172332, 30.72927919],
      [104.07167521, 30.72938672],
      [104.0715886, 30.72942808],
      [104.07127105, 30.72939499],
      [104.07103048, 30.72951906],
      [104.07082841, 30.72984993],
      [104.07073218, 30.72993264],
      [104.07051086, 30.729974],
      [104.07042425, 30.73008153],
      [104.07055897, 30.73035448],
      [104.07050124, 30.73052818],
      [104.07026067, 30.73071015],
      [104.06978915, 30.73092521],
      [104.06949085, 30.7310162],
      [104.06939462, 30.73104101],
      [104.06886537, 30.73132224],
      [104.06863442, 30.73158693],
      [104.06859594, 30.73172753],
      [104.06839386, 30.73191777],
      [104.06816291, 30.73216591],
      [104.06799933, 30.73240578],
      [104.06801857, 30.73275318],
      [104.06837462, 30.73406002],
      [104.0686633, 30.73468036],
      [104.06865368, 30.73523452],
      [104.06869217, 30.7354992],
      [104.0689616, 30.73578041],
      [104.06932727, 30.73592929],
      [104.06974104, 30.73605336],
      [104.06992388, 30.73618569],
      [104.06985652, 30.73671504],
      [104.06984689, 30.73723611],
      [104.06970255, 30.73762485],
      [104.06947161, 30.73788125],
      [104.06893274, 30.73822034],
      [104.06841311, 30.73859253],
      [104.06777428, 30.73958501],
      [104.06727606, 30.74046908],
      [104.06693855, 30.74104924],
      [104.06663306, 30.74148876],
      [104.06581691, 30.74194073],
      [104.06489839, 30.74231128],
      [104.06437353, 30.74237573],
      [104.06375493, 30.74200517],
      [104.06339878, 30.74192462],
      [104.06272395, 30.74268184],
      [104.06193199, 30.74368704],
      [104.06108018, 30.74498546],
      [104.06003551, 30.7461043],
      [104.05989087, 30.74625624],
      [104.05924801, 30.74644959],
      [104.05876585, 30.74678109],
      [104.05863728, 30.74726453],
      [104.0585087, 30.7474441],
      [104.05821941, 30.74741647],
      [104.05791405, 30.74700209],
      [104.05770512, 30.74672584],
      [104.05736762, 30.74667059],
      [104.05696583, 30.74696066],
      [104.05672475, 30.74722309],
      [104.05617572, 30.74745686],
      [104.05583737, 30.74800782],
      [104.0561401, 30.74868122],
      [104.05587298, 30.74923218],
      [104.05549901, 30.74947706],
      [104.0548045, 30.74941584],
      [104.05464422, 30.7496301],
      [104.0546086, 30.75039532],
      [104.05455517, 30.75083914],
      [104.05425244, 30.75099218],
      [104.05321957, 30.75112992],
      [104.0526319, 30.75116053],
      [104.05234698, 30.75085445],
      [104.0519552, 30.75064019],
      [104.05101138, 30.75057897],
      [104.05031686, 30.75100749],
      [104.04961707, 30.75151575],
      [104.04922256, 30.75173567],
      [104.04892401, 30.75179065],
      [104.0484762, 30.75154324],
      [104.04778315, 30.75128667],
      [104.04722871, 30.75118588],
      [104.04610917, 30.75096596],
      [104.04540547, 30.75125918],
      [104.04497897, 30.75149743],
      [104.04484036, 30.75189144],
      [104.04450983, 30.75218466],
      [104.04431791, 30.75220299],
      [104.04412599, 30.75193726],
      [104.04395539, 30.75135998],
      [104.04383811, 30.75116755],
      [104.04360354, 30.75108508],
      [104.04325168, 30.75114923],
      [104.04302778, 30.75080103],
      [104.04270792, 30.75020542],
      [104.04143633, 30.74890974],
      [104.04132331, 30.74832695],
      [104.04075821, 30.7481084],
      [104.03996706, 30.74737989],
      [104.03909115, 30.74638426],
      [104.03875208, 30.74585002],
      [104.03875209, 30.74551005],
      [104.03923243, 30.7451215],
      [104.03917592, 30.74483009],
      [104.03818699, 30.74402872],
      [104.03779669, 30.74379708],
      [104.0376972, 30.7436902],
      [104.03672694, 30.74419041],
      [104.03615472, 30.74480092],
      [104.03577982, 30.7449705],
      [104.03542464, 30.74522488],
      [104.03497081, 30.74593714],
      [104.03457617, 30.74647981],
      [104.034221, 30.74663243],
      [104.03376717, 30.74658156],
      [104.03360931, 30.74641197],
      [104.03315548, 30.74629326],
      [104.0329187, 30.74631022],
      [104.03270165, 30.74597105],
      [104.03272138, 30.74553013],
      [104.03270165, 30.74519096],
      [104.03246487, 30.74502138],
      [104.03226755, 30.74512313],
      [104.03207023, 30.74510617],
      [104.03212943, 30.74491963],
      [104.03240567, 30.74480092],
      [104.03266219, 30.74471612],
      [104.03278058, 30.74439391],
      [104.03276085, 30.74417345],
      [104.03234648, 30.74435999],
      [104.0320505, 30.74463133],
      [104.03165586, 30.74512313],
      [104.03128096, 30.74559797],
      [104.03104417, 30.74571668],
      [104.03072846, 30.74561493],
      [104.030689, 30.74520792],
      [104.03102445, 30.74420736],
      [104.03141909, 30.74318984],
      [104.03197158, 30.74325767],
      [104.03228729, 30.74295242],
      [104.03252407, 30.74264716],
      [104.03250434, 30.74239277],
      [104.03242542, 30.74222318],
      [104.03268193, 30.7422571],
      [104.03297791, 30.74227406],
      [104.03331334, 30.74196881],
      [104.03358959, 30.74173138],
      [104.03356986, 30.7413074],
      [104.03343173, 30.7409343],
      [104.03364879, 30.74057815],
      [104.03412235, 30.73986586],
      [104.03447752, 30.73928923],
      [104.03501028, 30.73918748],
      [104.0355825, 30.7392214],
      [104.0360166, 30.73854301],
      [104.0365099, 30.73771199],
      [104.03703835, 30.73672815],
      [104.03669024, 30.73631673],
      [104.03736974, 30.73514755],
      [104.03736975, 30.73471027],
      [104.03683678, 30.73421052],
      [104.03625537, 30.73371076],
      [104.03567396, 30.73321101],
      [104.03470494, 30.73331512],
      [104.03402663, 30.73373159],
      [104.03363902, 30.73389817],
      [104.03293648, 30.73354418],
      [104.03208859, 30.73289866],
      [104.03368532, 30.73164009],
      [104.03577258, 30.7304388],
      [104.03662346, 30.72960612],
      [104.03689836, 30.7287847],
      [104.03695451, 30.72860042],
      [104.03885659, 30.72880352],
      [104.04130211, 30.72939253],
      [104.04453919, 30.73026589],
      [104.04606323, 30.73073303],
      [104.0468504, 30.72882641],
      [104.04807183, 30.72587337],
      [104.0456442, 30.72453464],
      [104.04285013, 30.72225086],
      [104.04445328, 30.72189648],
      [104.04704885, 30.72188335],
      [104.04808708, 30.72141084],
      [104.04877414, 30.72051832],
      [104.04947646, 30.71910074],
      [104.04999108, 30.71819273],
      [104.05075747, 30.71827514],
      [104.05138363, 30.71881343],
      [104.05204109, 30.71972853],
      [104.05313686, 30.71983619],
      [104.05445179, 30.71956704],
      [104.0561111, 30.71894801],
      [104.05698772, 30.718948],
      [104.05777042, 30.71916332],
      [104.05986805, 30.71886726],
      [104.06205961, 30.71862502],
      [104.06392825, 30.7185815],
      [104.06487305, 30.71841489],
      [104.0652122, 30.71791505],
      [104.06518797, 30.71695703],
      [104.0658905, 30.71641554],
      [104.06647191, 30.71527007],
      [104.06710176, 30.7148327],
      [104.06802233, 30.71479105],
      [104.06879754, 30.71464526],
      [104.06964542, 30.71441616],
      [104.07068711, 30.71391631],
      [104.0708764, 30.71383492],
    ],
  ],
});
//驷马桥
const polygonSimaqiao = reactive({
  position: [104.083594, 30.68692],
  fillColor: "#FFC0CB",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.08492764442998, 30.68480125658667],
      [104.08365351, 30.68295086],
      [104.08072097, 30.67860853],
      [104.07885946, 30.67566969],
      [104.08209799, 30.67371765],
      [104.08337302, 30.67305968],
      [104.08548955, 30.67295001],
      [104.08640756, 30.67242363],
      [104.08737657, 30.67130496],
      [104.08969711, 30.67003284],
      [104.0931397, 30.67437556],
      [104.09503929080208, 30.676760482514343],
      [104.09404708576766, 30.67709813178603],
      [104.09319526012625, 30.67755346424976],
      [104.0889016588199, 30.67973288126206],
      [104.08985310259258, 30.68114865339007],
      [104.0938978905621, 30.68731587980966],
      [104.09245489514863, 30.68739105990879],
      [104.0919520352031, 30.68761668238092],
      [104.0918208562049, 30.688086727916605],
      [104.0918864482493, 30.688387556150783],
      [104.09254236028306, 30.689384044611078],
      [104.09228000018922, 30.689929289719906],
      [104.09147104977237, 30.690530936791273],
      [104.09136174494047, 30.690662456906992],
      [104.09212697248623, 30.69177172328108],
      [104.0929359243766, 30.692016136609283],
      [104.09350438084842, 30.692316942063513],
      [104.09385420724126, 30.694121809071444],
      [104.09182090408228, 30.695193436775803],
      [104.09136177019272, 30.695381440708015],
      [104.09109940851961, 30.69573864741584],
      [104.09179904282321, 30.695851449326277],
      [104.09271731864521, 30.69718626435893],
      [104.08160700326367, 30.69738300807923],
      [104.08141413765587, 30.69424306967441],
      [104.0814098548041, 30.69276580457567],
      [104.08130353615583, 30.69150605378136],
      [104.08120577754372, 30.690324399215953],
      [104.0808427664515, 30.689480117960123],
      [104.08065301312334, 30.68907571576189],
      [104.08072726502077, 30.688522317039517],
      [104.08089227124948, 30.688359135434162],
      [104.08147804205797, 30.687741882389425],
      [104.08221231450686, 30.687117533057464],
      [104.0832518478065, 30.686195177378128],
      [104.08371386027875, 30.68581204757918],
      [104.0851906559503, 30.685166395415408],
      [104.08492764442998, 30.68480125658667],
    ],
  ],
});

//凤凰山
const polygonFenghuangshan = reactive({
  position: [104.108234, 30.764343],
  fillColor: "#800080",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.07404992, 30.71670512],
      [104.07362608, 30.71660795],
      [104.07303272, 30.71568488],
      [104.0724111, 30.71507759],
      [104.07207204, 30.7147618],
      [104.07221331, 30.71398446],
      [104.07260889, 30.71369296],
      [104.0736876, 30.71321109],
      [104.07417618, 30.71294856],
      [104.07464949, 30.71283043],
      [104.07472583, 30.71363114],
      [104.07518387, 30.71378866],
      [104.07654991512536, 30.715350804014513],
      [104.07696428068223, 30.716182026423454],
      [104.07790264364796, 30.716245367412025],
      [104.07942522170757, 30.71628899978538],
      [104.08098163364565, 30.71655079374128],
      [104.08167525134408, 30.716870763470066],
      [104.08203051994242, 30.716885307531353],
      [104.08223353171921, 30.71663805828496],
      [104.082165864385, 30.71601266119217],
      [104.08214981640538, 30.71575320762278],
      [104.08182983412252, 30.71532911723465],
      [104.0818298340205, 30.715252032127662],
      [104.08138151426027, 30.714558263721052],
      [104.08133668186488, 30.714057206025082],
      [104.08116179425222, 30.713594630659248],
      [104.08116179437012, 30.713400295608903],
      [104.08119004970969, 30.713303127964522],
      [104.08138783663642, 30.713400295608903],
      [104.08166438408207, 30.71357173467249],
      [104.08206178537347, 30.713144661446396],
      [104.08260821328315, 30.713187368845],
      [104.08290626482402, 30.713187368845],
      [104.0836513946559, 30.71352902742588],
      [104.08454555174669, 30.714212341345398],
      [104.08673126624461, 30.714639410349818],
      [104.08772477042935, 30.71429775528139],
      [104.08876795170907, 30.71434046222404],
      [104.08911568074531, 30.714682117157373],
      [104.08881733841716, 30.715522711901443],
      [104.08866375858834, 30.716325088672424],
      [104.08843929448255, 30.717432159456493],
      [104.08819967819215, 30.71996537487548],
      [104.09144800316142, 30.721168386142693],
      [104.0923421671858, 30.72236408952164],
      [104.09711100750604, 30.72321815525656],
      [104.09830321604348, 30.72321815525656],
      [104.09894898729532, 30.722449496399154],
      [104.10113470511638, 30.72270571662634],
      [104.10207853769788, 30.723175492016104],
      [104.10351914400096, 30.725481393350574],
      [104.10257532289812, 30.72667704828251],
      [104.10217796060135, 30.73103253639614],
      [104.10192957304436, 30.73385104505431],
      [104.10097215139103, 30.734476954733548],
      [104.09969444101539, 30.734843037217324],
      [104.09931112725148, 30.734843037217324],
      [104.09999258848163, 30.73758861704761],
      [104.10020554711714, 30.73872343671158],
      [104.09897042273349, 30.73890647104569],
      [104.09888524435453, 30.739492178869813],
      [104.09868570958928, 30.739673907921663],
      [104.09851954730726, 30.73981672483413],
      [104.09818722143154, 30.739763168510418],
      [104.09808336869558, 30.7394596822576],
      [104.09835338294545, 30.73938827362413],
      [104.09816644879177, 30.7390669342862],
      [104.09812490679585, 30.73865633286048],
      [104.09845723172029, 30.73858492378396],
      [104.09837414909772, 30.738210025486133],
      [104.09878955452749, 30.738013649754055],
      [104.09926727081304, 30.737852978479037],
      [104.09941266513036, 30.738299287084068],
      [104.09964113802636, 30.738192173159163],
      [104.09928803608938, 30.736799684071993],
      [104.09859025354893, 30.736895231423542],
      [104.0984250107478, 30.736614392785366],
      [104.0992161613933, 30.736347243465957],
      [104.09879232640904, 30.7350357744488],
      [104.09842500642081, 30.734962914634067],
      [104.09817070759924, 30.73474433492147],
      [104.09839610742897, 30.734510272932702],
      [104.09836396406031, 30.734137286647396],
      [104.09725478670418, 30.734056393213088],
      [104.09693798888634, 30.73425489780265],
      [104.09730763652924, 30.734848913703765],
      [104.09748442450815, 30.735442927154196],
      [104.09740406579277, 30.7356363263534],
      [104.09714691821159, 30.735815911091454],
      [104.09671299089122, 30.735926503157156],
      [104.09608619820186, 30.73580217697838],
      [104.095587978142, 30.735898875126704],
      [104.09513797203029, 30.736244225126292],
      [104.09492904015012, 30.73649287661305],
      [104.09472010894658, 30.73650669057194],
      [104.0943826052343, 30.736396178863664],
      [104.09410938742339, 30.736437620764217],
      [104.09332187734945, 30.73650669057194],
      [104.09247008108909, 30.73650669057194],
      [104.09205221968098, 30.736396178863664],
      [104.09161584835732, 30.735876061752325],
      [104.09175460965922, 30.735190260311096],
      [104.0918807822379, 30.734726155947207],
      [104.09196537015437, 30.734435328982304],
      [104.09183003008957, 30.734289915274108],
      [104.0915255147404, 30.73424629113232],
      [104.09103490616107, 30.734435328982304],
      [104.09045970909256, 30.734784321267952],
      [104.09029053258664, 30.73510423010167],
      [104.09020214185415, 30.735324783504208],
      [104.0896691822242, 30.735241492839933],
      [104.08906354453495, 30.73574123598268],
      [104.08870015880514, 30.736824005851503],
      [104.0883855980233, 30.73877608462834],
      [104.08820626816116, 30.740086212863883],
      [104.08784761009477, 30.741010999810666],
      [104.087085462537, 30.74185871430461],
      [104.08714960168388, 30.74372534098941],
      [104.08621049987715, 30.743912641320833],
      [104.0854232012798, 30.74441207138405],
      [104.08508578433698, 30.74521759983446],
      [104.08497331124539, 30.745604251776175],
      [104.08458013372126, 30.746014051983988],
      [104.08250829788675, 30.74581055258089],
      [104.08096922078803, 30.74570880276154],
      [104.08091002610236, 30.74586142746112],
      [104.08102842022892, 30.74679413011886],
      [104.08100869209004, 30.74774378422591],
      [104.08083110814611, 30.748388188473307],
      [104.08019969216677, 30.749269999706268],
      [104.07939068807158, 30.750338340026786],
      [104.07905526214013, 30.75057576686077],
      [104.07850277199584, 30.750219658924543],
      [104.07826599056155, 30.749931380366633],
      [104.07827745946636, 30.749659347668338],
      [104.07835379979674, 30.74939691687996],
      [104.07817058292487, 30.749252579747605],
      [104.07804843844254, 30.748990148236505],
      [104.07818585101121, 30.74863586495694],
      [104.07809295404707, 30.74847788196386],
      [104.07745891483121, 30.748139664673467],
      [104.07713096378913, 30.747914185980395],
      [104.07704351046337, 30.74766991694529],
      [104.07745891587555, 30.746918316972906],
      [104.07690258846596, 30.746424580263962],
      [104.07605100594739, 30.746263923168634],
      [104.07542788456654, 30.746281735898688],
      [104.07503324728017, 30.74629958685355],
      [104.0750540164123, 30.745621248837754],
      [104.07503324432301, 30.74467513987878],
      [104.07438936346249, 30.744371669502602],
      [104.07374548312882, 30.74413960344075],
      [104.07345469854346, 30.74421100842718],
      [104.07295621045175, 30.744443074360994],
      [104.07270696646053, 30.744425223150095],
      [104.0724784930111, 30.744282413374194],
      [104.07263136924331, 30.74355388756358],
      [104.07428420381673, 30.741043113772026],
      [104.07378451105802, 30.74091096622094],
      [104.07316950528784, 30.74031630030801],
      [104.07168126518171, 30.739049887903924],
      [104.07112600247639, 30.738176612479286],
      [104.07072432305387, 30.73785167167484],
      [104.07053529506057, 30.7382070756488],
      [104.07023993958614, 30.73852186142344],
      [104.0699327717614, 30.738491398308682],
      [104.06942476681655, 30.73801414215243],
      [104.06972012197085, 30.737780590793513],
      [104.06989733672943, 30.73736425933783],
      [104.069875638094, 30.736869898050575],
      [104.06999086975266, 30.736255832427148],
      [104.0699332541502, 30.736161744895647],
      [104.06972007938221, 30.736008226887783],
      [104.06935134465043, 30.735914135196165],
      [104.06902870236196, 30.735775473742926],
      [104.06894901190533, 30.735724109305533],
      [104.06872625589442, 30.735475910079863],
      [104.0687015065819, 30.735227710626756],
      [104.06870976017115, 30.734674579598796],
      [104.06861900514913, 30.734518569066648],
      [104.06838800140294, 30.733937063982548],
      [104.06832200130975, 30.733667585593466],
      [104.06806625001684, 30.732859148817916],
      [104.068082754072, 30.732447837953558],
      [104.0680827494725, 30.732376915087045],
      [104.06821475641132, 30.73214289051869],
      [104.06861902307713, 30.73178121578817],
      [104.0686685262648, 30.731603924077277],
      [104.06893253371958, 30.731341531842208],
      [104.06940280202362, 30.731086229511895],
      [104.06989781948884, 30.730937303041454],
      [104.07050834113126, 30.730618174614893],
      [104.07064034265994, 30.730440884908866],
      [104.07053309054751, 30.730242313804098],
      [104.07053309228287, 30.730043741659998],
      [104.07070634838317, 30.73001537435894],
      [104.0708713547621, 30.729908996953494],
      [104.07108586416463, 30.729582772649742],
      [104.07126737060939, 30.72949057875359],
      [104.07146098110756, 30.72954607401191],
      [104.07172053839999, 30.729467328666956],
      [104.0718345405253, 30.72920772595838],
      [104.07202337614771, 30.729132319421986],
      [104.07228293317883, 30.729355434067717],
      [104.072603565086, 30.729092946214273],
      [104.07234400811208, 30.728856706747802],
      [104.07226766869555, 30.728620466903912],
      [104.07240508460636, 30.7280036166434],
      [104.0726493760789, 30.72754425839492],
      [104.07284786108889, 30.727557382936105],
      [104.07335170779515, 30.727557382936105],
      [104.07417617837399, 30.727386778113942],
      [104.07466476149422, 30.726691169549053],
      [104.07507700139324, 30.72646804912765],
      [104.07519914876816, 30.725628063345745],
      [104.07509226880775, 30.723357427808168],
      [104.07477163993586, 30.7212442365338],
      [104.07443574, 30.71914414],
      [104.07425253, 30.71806783],
      [104.07404992, 30.71670512],
    ],
  ],
});
//茶店子
const polygonChadianzi = reactive({
  position: [104.023145, 30.689634],
  fillColor: "#800080",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.0020594702604, 30.6842937293654],
      [104.00226567194997, 30.68376174350608],
      [104.0025843439556, 30.683294239048745],
      [104.00337164141544, 30.683374843381152],
      [104.00389650579054, 30.68355217274287],
      [104.00436513410952, 30.683874589166763],
      [104.00479627160058, 30.684390453841623],
      [104.00488999572997, 30.684857954498664],
      [104.00466505036658, 30.685422177271132],
      [104.00442136086859, 30.685680106895102],
      [104.00447759523611, 30.685970277132334],
      [104.0047775190323, 30.686067000405973],
      [104.00496497176277, 30.686050879865178],
      [104.0056023114193, 30.68585743322538],
      [104.00612717887208, 30.685792950950447],
      [104.00616467112728, 30.68505140257232],
      [104.00616467207158, 30.684648385439036],
      [104.0062771441376, 30.684325970865185],
      [104.00655832284069, 30.68408415942892],
      [104.0068207560054, 30.683939072359035],
      [104.00710193399748, 30.684068038651098],
      [104.00719356238037, 30.684578178021496],
      [104.00731792121105, 30.685423058141676],
      [104.00744228050753, 30.68565834046038],
      [104.0078549386684, 30.685912541678125],
      [104.00800265384922, 30.68607945818074],
      [104.00815459157047, 30.686131723540193],
      [104.0084685965413, 30.686157856214894],
      [104.00895479814083, 30.685983638320195],
      [104.00943087010546, 30.68602719280786],
      [104.00991707137607, 30.686070747286188],
      [104.01026146212234, 30.685922653147458],
      [104.01058875913796, 30.685531125956505],
      [104.01050840178728, 30.684950627490647],
      [104.01103876742168, 30.68446687698606],
      [104.01116734118273, 30.683803445086884],
      [104.01150484570766, 30.68330586916191],
      [104.0118708377291, 30.68332144623578],
      [104.01227664284276, 30.68343402503312],
      [104.01268244923115, 30.68336647776406],
      [104.01315370902346, 30.68310754630624],
      [104.01346788299509, 30.682691003531374],
      [104.0139260525368, 30.68203804244148],
      [104.01435803883923, 30.68181288283753],
      [104.0146983911417, 30.681779108870067],
      [104.01498638135027, 30.681891688734353],
      [104.01509110481817, 30.682229427859916],
      [104.01513037606325, 30.682465844830794],
      [104.01519582841081, 30.682600940088534],
      [104.01536600350846, 30.682691000091427],
      [104.01560163235978, 30.682781063343523],
      [104.01617761063937, 30.682578418418803],
      [104.01633469649661, 30.68238703283004],
      [104.0162692436901, 30.68218438902018],
      [104.01602052367807, 30.68158771411477],
      [104.01599434223112, 30.68096852086234],
      [104.01622997026014, 30.68066455240364],
      [104.01655723178142, 30.680687068605245],
      [104.01694994585476, 30.680788391473865],
      [104.01723793667868, 30.6809797789425],
      [104.01735575121634, 30.681069843555747],
      [104.01774846673172, 30.681385069309663],
      [104.017866282528, 30.681700294453034],
      [104.01778774108702, 30.682026776993602],
      [104.01776156100419, 30.68222942099973],
      [104.01827645397363, 30.68284808818054],
      [104.01887568638038, 30.68326633730388],
      [104.0197875629138, 30.683572554967444],
      [104.0203954809319, 30.683692054441497],
      [104.02091655109786, 30.68349786776708],
      [104.02148972507523, 30.683064681564094],
      [104.02208895383009, 30.68284808818054],
      [104.02273148678401, 30.682926886434945],
      [104.02322892588705, 30.682983175931927],
      [104.02445943049676, 30.682679212416954],
      [104.02481287184764, 30.682442795957254],
      [104.02555901949023, 30.681395804650418],
      [104.02605645331555, 30.681069322112638],
      [104.02642298577035, 30.681069322112638],
      [104.02692042502608, 30.681260708507327],
      [104.02718223735377, 30.68151964268308],
      [104.02765987040928, 30.681562164116652],
      [104.02845499562311, 30.681373021712396],
      [104.02891392346818, 30.680879156353424],
      [104.02914542610363, 30.681124199275242],
      [104.02943035278216, 30.68130798118055],
      [104.02975089550822, 30.681476447711667],
      [104.03039198155312, 30.681997161141602],
      [104.03324126565899, 30.68437097683554],
      [104.03714121532796, 30.68780142320741],
      [104.03883698781556, 30.689250236075665],
      [104.03187583457884, 30.69570241617156],
      [104.0263330938187, 30.700693258936237],
      [104.02319568139946, 30.703256034040482],
      [104.02224404027311, 30.704092876541285],
      [104.02092581693132, 30.70621059128537],
      [104.02030139200372, 30.70641937793156],
      [104.01693643300118, 30.704838555236066],
      [104.01096971683047, 30.703108573192935],
      [104.00795167966447, 30.70158736038715],
      [104.00469083007896, 30.69896247486108],
      [104.00402814157555, 30.69850647514746],
      [104.00433575182517, 30.698445141048307],
      [104.00469685910734, 30.69839530715576],
      [104.00504904993682, 30.69834930664398],
      [104.00551269330644, 30.698207471759382],
      [104.00574451470925, 30.69816530463931],
      [104.0062215324327, 30.69834163989243],
      [104.00664059652819, 30.69864447666831],
      [104.00700591438947, 30.698920759381274],
      [104.00767499431892, 30.69953944779464],
      [104.00775144046717, 30.699594801520362],
      [104.00815378706717, 30.69964323603876],
      [104.00835898117388, 30.69943219998023],
      [104.00870499365851, 30.699093158755147],
      [104.0089262799679, 30.69888212294979],
      [104.0093085012286, 30.69837702020462],
      [104.0095373294149, 30.697831619590154],
      [104.0093340378361, 30.697645890983146],
      [104.0087963934288, 30.69749842809022],
      [104.00818306647248, 30.69736264656],
      [104.00813958466921, 30.697254415086782],
      [104.00819908668556, 30.6970969877765],
      [104.00836997946737, 30.69700651025872],
      [104.00839153793301, 30.696780816287884],
      [104.00826821690866, 30.696638249246202],
      [104.00825588484666, 30.696622932162157],
      [104.00821066772191, 30.696408493721428],
      [104.00820381523819, 30.696383749435025],
      [104.00825314356456, 30.696204656585518],
      [104.00828191826407, 30.696105684632453],
      [104.00830521132285, 30.695867679259212],
      [104.00832165335964, 30.695729823839265],
      [104.00847237743332, 30.695496531467597],
      [104.00867243044384, 30.695460005581744],
      [104.00886152134548, 30.69541876707456],
      [104.00907664852858, 30.69544233131463],
      [104.00923696491185, 30.695348071274527],
      [104.01011009340795, 30.69481355879427],
      [104.01044418343312, 30.694687850259015],
      [104.01066474213187, 30.69451836769268],
      [104.0111387089762, 30.694401344039196],
      [104.01126072011355, 30.69434888496947],
      [104.01195054894178, 30.693933248788092],
      [104.01211479691408, 30.693836399387138],
      [104.0120819461589, 30.69364673910399],
      [104.01182853747544, 30.69356199729148],
      [104.01178259775705, 30.693541932933627],
      [104.01174140368073, 30.693451408320378],
      [104.01186269464262, 30.69320541624558],
      [104.01180483954941, 30.692996968219077],
      [104.01172674568217, 30.693016323997995],
      [104.0117033994596, 30.693000886871406],
      [104.01169196964412, 30.69298450566114],
      [104.01167374798324, 30.69296867878326],
      [104.01166652108398, 30.692941748891865],
      [104.01164724921901, 30.69292310512623],
      [104.01164026356616, 30.69291196059471],
      [104.01164119400974, 30.69286035499388],
      [104.0115735974467, 30.692793285003322],
      [104.01169249152515, 30.692718467092032],
      [104.0108256353743, 30.691653536589506],
      [104.01084908013726, 30.691690298192682],
      [104.01025113300909, 30.690854733884667],
      [104.01021364302368, 30.69020994627331],
      [104.0113196034276, 30.689452309332843],
      [104.01116963822294, 30.68890423069445],
      [104.01094469251697, 30.688372269885253],
      [104.01053229767146, 30.688323909707627],
      [104.00869526849488, 30.688823630706768],
      [104.00736435801197, 30.68942006947462],
      [104.00708317944218, 30.689452309332843],
      [104.00665203933644, 30.688839750708155],
      [104.00650207756055, 30.688839750708155],
      [104.00601470173822, 30.688871990705163],
      [104.00573352339508, 30.688871990705163],
      [104.0054898357243, 30.68877527069102],
      [104.00532112932721, 30.68854959038821],
      [104.00515242322516, 30.688259429443782],
      [104.00487124492555, 30.688323909707627],
      [104.00462755675886, 30.68845287014279],
      [104.00406519984686, 30.688581830454595],
      [104.00374653158941, 30.68850123027417],
      [104.00365280869757, 30.687872547213143],
      [104.00344661465243, 30.68729222178568],
      [104.00359657939312, 30.686647412825653],
      [104.00299672007644, 30.685873553789293],
      [104.00226566179444, 30.68501916124598],
      [104.0020594702604, 30.6842937293654],
    ],
  ],
});
//九里堤
const polygonJiulidi = reactive({
  fillColor: "#DC143C",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  position: [104.043659, 30.704038],
  path: [
    [
      [104.04981313, 30.69452542],
      [104.05054392, 30.69458526],
      [104.05148352, 30.69464511],
      [104.05245791, 30.69470496],
      [104.0534323, 30.69473489],
      [104.0544067, 30.69470496],
      [104.05534629, 30.69467504],
      [104.05673828, 30.69473489],
      [104.05802587, 30.69470496],
      [104.05941787, 30.69467504],
      [104.06067066, 30.69464511],
      [104.06074026, 30.69554284],
      [104.06080986, 30.69626101],
      [104.06087947, 30.69685949],
      [104.06091427, 30.69733826],
      [104.06080987, 30.69793673],
      [104.06053147, 30.6985352],
      [104.06014868, 30.69907381],
      [104.05980068, 30.69958251],
      [104.05952228, 30.70009119],
      [104.05941788, 30.70059988],
      [104.05945269, 30.70146763],
      [104.05952229, 30.70218577],
      [104.05941789, 30.70275429],
      [104.05924389, 30.70323305],
      [104.05872189, 30.70362203],
      [104.05809549, 30.70404094],
      [104.05739949, 30.70445984],
      [104.05687749, 30.70487874],
      [104.05632069, 30.70529765],
      [104.05578483, 30.70606781],
      [104.05570365, 30.70673088],
      [104.05537891, 30.7074286],
      [104.05570362, 30.70819635],
      [104.05606892, 30.70854532],
      [104.05708364, 30.70840573],
      [104.05801718, 30.70868491],
      [104.05895072, 30.70917347],
      [104.05968133, 30.71008079],
      [104.05947838, 30.71084851],
      [104.05903191, 30.71168602],
      [104.05817954, 30.71231415],
      [104.05692129, 30.71234905],
      [104.05582539, 30.71154644],
      [104.05485125, 30.71077872],
      [104.05367418, 30.71070892],
      [104.05225357, 30.70973182],
      [104.0517665, 30.70931305],
      [104.0510359, 30.70980161],
      [104.05058943, 30.71029017],
      [104.05087354, 30.71137196],
      [104.05132002, 30.71262822],
      [104.05180708, 30.71367509],
      [104.05196944, 30.71419852],
      [104.05176649, 30.71521048],
      [104.05140119, 30.71601307],
      [104.05067058, 30.71716459],
      [104.04998057, 30.71810674],
      [104.04961526, 30.71859526],
      [104.04953408, 30.71897909],
      [104.04920937, 30.71985143],
      [104.04884406, 30.7205493],
      [104.04815404, 30.72152632],
      [104.04774815, 30.72184035],
      [104.04697696, 30.72194503],
      [104.04535339, 30.72197993],
      [104.04433866, 30.72194503],
      [104.04316157, 30.7220846],
      [104.04218743, 30.72222418],
      [104.0401174, 30.72037484],
      [104.0379662, 30.71887441],
      [104.03589618, 30.71716459],
      [104.03411028, 30.71562922],
      [104.03423206, 30.7151058],
      [104.03581505, 30.71301207],
      [104.03776335, 30.71046465],
      [104.0400372, 30.70754601],
      [104.04302719, 30.70366729],
      [104.04570245, 30.70005906],
      [104.0469197, 30.69874507],
      [104.04845823, 30.6964457],
      [104.04956291, 30.69483956],
      [104.04981748, 30.69451851],
      [104.04981313, 30.69452542],
    ],
  ],
});
//抚琴
const polygonFuqin = reactive({
  fillColor: "#6A5ACD",
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  position: [104.04591714, 30.68729304],
  path: [
    [
      [104.03020168, 30.68209897],
      [104.041126, 30.67595518],
      [104.04510446, 30.68221239],
      [104.04622547, 30.68317647],
      [104.04824768, 30.68364905],
      [104.05033583, 30.68404601],
      [104.05354499, 30.68468872],
      [104.05890826, 30.68591741],
      [104.05888628, 30.68648449],
      [104.05844668, 30.68695706],
      [104.05800707, 30.68739182],
      [104.05756746, 30.68780767],
      [104.05717181, 30.68822352],
      [104.05728177, 30.69470686],
      [104.05497379, 30.69465016],
      [104.04662113, 30.69419652],
      [104.04374166, 30.69332706],
      [104.04204915, 30.69204174],
      [104.03930158, 30.68975461],
      [104.03554291, 30.68661681],
      [104.03556489, 30.68659791],
      [104.03020168, 30.68209897],
    ],
  ],
});
//营门口
const polygonYingmenkou = reactive({
  fillColor: "#00FF00",
  position: [104.03214916, 30.70473032],
  strokeColor: "#FFFF00",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.03875877, 30.68941998],
      [104.03597362, 30.69240265],
      [104.03129193, 30.69646252],
      [104.02342003, 30.70326768],
      [104.02118012, 30.70605207],
      [104.02053244, 30.70693378],
      [104.02468833, 30.70892919],
      [104.02781874, 30.71053014],
      [104.03248738, 30.71414959],
      [104.03420195, 30.71555625],
      [104.0376706, 30.71049178],
      [104.04544511, 30.70061924],
      [104.04939213, 30.69498839],
      [104.04961643, 30.69453312],
      [104.04718617, 30.69432629],
      [104.04687928, 30.69431202],
      [104.04617425, 30.69415511],
      [104.04421677, 30.69357025],
      [104.04341222, 30.69324929],
      [104.04316011, 30.69297946],
      [104.04161154, 30.69177329],
      [104.04084116807688, 30.6911108222165],
      [104.03875877, 30.68941998],
    ],
  ],
});

//天回镇
const polygonTianhuizhen = reactive({
  fillColor: "#00FFFF",
  position: [104.03214916, 30.70473032],
  strokeColor: "#DC143C",
  visible: true,
  strokeStyle: "dashed",
  path: [
    [
      [104.10231859, 30.73201817],
      [104.10322652, 30.73231419],
      [104.10388398, 30.73204508],
      [104.10429099, 30.73196434],
      [104.10504238, 30.73239492],
      [104.10548069, 30.73217963],
      [104.10573115, 30.7316145],
      [104.1059503, 30.73080715],
      [104.10641992, 30.73056495],
      [104.10757831, 30.73037657],
      [104.1087367, 30.72997289],
      [104.10967593, 30.72970378],
      [104.11085508518809, 30.731476992887718],
      [104.11154939413902, 30.73136195921165],
      [104.11126529840092, 30.73175268013936],
      [104.1117766717143, 30.731948040120333],
      [104.11208917730552, 30.731801520164776],
      [104.11234486353932, 30.731630579987776],
      [104.11260054893067, 30.73109333782691],
      [104.11271418678497, 30.730849136039915],
      [104.11291305345055, 30.73065377424816],
      [104.11330765, 30.73064569],
      [104.11368336, 30.73193743],
      [104.11387898441276, 30.732192239643854],
      [104.1141346706203, 30.732070139944966],
      [104.11473127210789, 30.73192362014032],
      [104.11538469184117, 30.73160615994237],
      [104.11549833314461, 30.732192239643854],
      [104.11586765867783, 30.732265499402818],
      [104.11623698316994, 30.732143399779385],
      [104.11680517598086, 30.732192239643854],
      [104.1178279269086, 30.732802736252005],
      [104.11848135213214, 30.73324229186321],
      [104.11853817431246, 30.733608586960898],
      [104.11814044226217, 30.73404813958415],
      [104.1176574770538, 30.73395046136427],
      [104.11689041491326, 30.733462052711992],
      [104.11589607352684, 30.732582942739704],
      [104.11581084638766, 30.73297365908777],
      [104.11623699397461, 30.73363299000512],
      [104.11737338573919, 30.734634189200726],
      [104.1175154379436, 30.735269091626236],
      [104.1181688644338, 30.735806314099435],
      [104.11808247656008, 30.736489914385242],
      [104.11725408710087, 30.736917130207082],
      [104.11715001180471, 30.737114900667056],
      [104.11741976875565, 30.737372825330773],
      [104.11896437694243, 30.73790323508051],
      [104.11947419422557, 30.738455070977622],
      [104.1196851875999, 30.73884994797351],
      [104.11948313358235, 30.73906840607695],
      [104.11900373783422, 30.739186387753197],
      [104.11892299237778, 30.739444806757934],
      [104.11876004244421, 30.739672397526217],
      [104.1185563543033, 30.739821206735698],
      [104.11804713314253, 30.740145085223443],
      [104.11775178446509, 30.7403376613747],
      [104.11782307578999, 30.740477716641816],
      [104.11810824036206, 30.74041644247443],
      [104.11827119169915, 30.74046020973876],
      [104.11839340543045, 30.740565251134324],
      [104.11864802065494, 30.740547745431176],
      [104.11881096729311, 30.740355168288428],
      [104.11899428696718, 30.740258880244166],
      [104.11928963534648, 30.740145085223443],
      [104.11974794487254, 30.74011882536655],
      [104.12003310958508, 30.74010131840574],
      [104.12028772053434, 30.740188853194585],
      [104.12058306947706, 30.740258880998265],
      [104.1208478651982, 30.74031140183506],
      [104.12093952530763, 30.74031140183506],
      [104.12103118567782, 30.740153839283614],
      [104.12117376807609, 30.74010131840574],
      [104.1212246902114, 30.74020636014779],
      [104.12128579680694, 30.740337662248322],
      [104.12130616563395, 30.740433950400988],
      [104.12136727231565, 30.740538991969586],
      [104.1214181945504, 30.740670293853317],
      [104.12154039244955, 30.74082807100366],
      [104.12179501990157, 30.740889130136022],
      [104.12191151190196, 30.74079168773062],
      [104.12198278449365, 30.74035267462646],
      [104.12207781397208, 30.7401280628433],
      [104.12222035778433, 30.740056595397064],
      [104.12233914419738, 30.74010764357594],
      [104.12243417330751, 30.740270997647876],
      [104.12258859576613, 30.740567076513127],
      [104.12276677562558, 30.740536447688317],
      [104.12283863618579, 30.740396847797125],
      [104.122838636089, 30.740212125304232],
      [104.12306890773218, 30.74029129211526],
      [104.1231917194059, 30.740423236705773],
      [104.12328382829544, 30.740594764496816],
      [104.12340664033161, 30.74088504184214],
      [104.1234470892027, 30.74117805269987],
      [104.12335958605006, 30.741353537550026],
      [104.12296582128761, 30.74127832978198],
      [104.12270331137545, 30.741428745280746],
      [104.12282916875058, 30.74158962573333],
      [104.12333476899822, 30.74172191569862],
      [104.12353261359, 30.74191085294982],
      [104.1237964058229, 30.74245876938939],
      [104.12390631957486, 30.742591024727655],
      [104.12419209596834, 30.74268549274212],
      [104.12443390714931, 30.742553237502186],
      [104.12456580452672, 30.7421942582998],
      [104.12471968499032, 30.74149519062628],
      [104.12485158178676, 30.74140072172672],
      [104.12508051014503, 30.74112046207692],
      [104.12545825468098, 30.740849907151976],
      [104.12573089297479, 30.740966163884032],
      [104.12590675519424, 30.74123067753051],
      [104.12617054861623, 30.74141961551225],
      [104.12639037612433, 30.741079526942812],
      [104.12643434125975, 30.740644968001522],
      [104.12691632440973, 30.740569915828157],
      [104.12740347853823, 30.740437693227726],
      [104.12771115492733, 30.740459730337776],
      [104.12786499384693, 30.740878434669735],
      [104.12825986461515, 30.741607459350288],
      [104.12855726840472, 30.741848060215673],
      [104.12899314449133, 30.74204639176062],
      [104.12920423001188, 30.742229730666264],
      [104.12964493557962, 30.74279788851514],
      [104.1299235276436, 30.74324800154911],
      [104.13055717883138, 30.74422801739081],
      [104.13063973760738, 30.74467352352443],
      [104.13052665778828, 30.744835476048063],
      [104.12989043839652, 30.745079570710846],
      [104.12894170673798, 30.745119345682753],
      [104.12882600796561, 30.745218783057197],
      [104.12838635234533, 30.74557675695037],
      [104.12786915580301, 30.745645432091866],
      [104.12667400618433, 30.745676193961025],
      [104.12609551072357, 30.74575574351261],
      [104.12595667154841, 30.745994391863697],
      [104.12609551030125, 30.746193265141628],
      [104.12621120912024, 30.74659101074848],
      [104.12607236983976, 30.74682965750523],
      [104.12579469148938, 30.74696886790296],
      [104.1257683416137, 30.747471347841383],
      [104.12587524483176, 30.748328882950542],
      [104.1261009356206, 30.749033283632976],
      [104.12642165634092, 30.749768307395847],
      [104.12651233571007, 30.750007231697847],
      [104.12712639525118, 30.749812805823122],
      [104.12741726613203, 30.74956282931132],
      [104.12757886302307, 30.748937886126352],
      [104.12762734326667, 30.748451817322813],
      [104.12772430051344, 30.748229613892754],
      [104.12803132915404, 30.748146287517784],
      [104.12838683561523, 30.748146287517784],
      [104.1289362546916, 30.748146287517784],
      [104.12950183307208, 30.748229613892754],
      [104.12979907263659, 30.748181800559102],
      [104.13005125223006, 30.748104624312138],
      [104.13012623263164, 30.74801676680919],
      [104.13006222304294, 30.747918968997695],
      [104.13005511084862, 30.747857845352755],
      [104.13019024195938, 30.747784496965867],
      [104.13032537299328, 30.747711148564857],
      [104.13048184051001, 30.747674474359055],
      [104.13070942966712, 30.747662249622984],
      [104.13092990664104, 30.747650024886546],
      [104.13119305647324, 30.74761946304371],
      [104.13151310804352, 30.747411637824936],
      [104.13161267823313, 30.74725882673746],
      [104.13175005526762, 30.7470206771738],
      [104.13205014506705, 30.74648336687189],
      [104.13221269371792, 30.746268442268466],
      [104.13223338490056, 30.746022614802943],
      [104.13227713553285, 30.745771934486015],
      [104.13229989210494, 30.745599371964495],
      [104.13233859197685, 30.7453499116179],
      [104.13222248893945, 30.745266758104307],
      [104.13206768469588, 30.745075504900193],
      [104.1321063850329, 30.74492582836018],
      [104.13229988928416, 30.744917512993776],
      [104.13264819809913, 30.745133712415228],
      [104.1327281731954, 30.74504075237797],
      [104.13272817278524, 30.744965262313077],
      [104.13273492899974, 30.74490138609445],
      [104.13254574445983, 30.74472717817949],
      [104.1323227774513, 30.744558777131047],
      [104.13216737635156, 30.744431024569593],
      [104.1320322451243, 30.744332306656386],
      [104.13200521876792, 30.744262623410542],
      [104.1319511699885, 30.744007109324023],
      [104.13199846572437, 30.74378063555544],
      [104.13216062296495, 30.74351351250273],
      [104.13228224079401, 30.743362529837736],
      [104.1324038587653, 30.743304459568506],
      [104.13262006883546, 30.743321880650058],
      [104.1328362789649, 30.743345108757747],
      [104.13317955663328, 30.74332967485216],
      [104.13325237359919, 30.743287952308645],
      [104.13337004629744, 30.743176704949867],
      [104.13350535975185, 30.743173868814537],
      [104.13380286144019, 30.74331594732527],
      [104.1339281984181, 30.743546780106794],
      [104.13376705360231, 30.74396227813325],
      [104.13389239050765, 30.744146943518242],
      [104.13423258835402, 30.74405461085687],
      [104.1343758318979, 30.74451627354132],
      [104.13442955353013, 30.745162579707973],
      [104.13434002946431, 30.74554729358332],
      [104.13425050456878, 30.74576273288152],
      [104.13416097910455, 30.74585506390558],
      [104.13392284552097, 30.74589496203148],
      [104.13372278405859, 30.74593794745065],
      [104.13348521094385, 30.745948693803708],
      [104.13315632093587, 30.746011625732493],
      [104.1330436404873, 30.74619473502317],
      [104.13331674687757, 30.7466007214877],
      [104.13352092420341, 30.74708954388621],
      [104.13350634270287, 30.747465560042663],
      [104.13329765906894, 30.74782928244935],
      [104.13317262058712, 30.748226890433397],
      [104.13316011698028, 30.74880718147255],
      [104.13309759760183, 30.74909732623807],
      [104.13310195709171, 30.749447453362368],
      [104.13322263695684, 30.749634630031878],
      [104.13351022701099, 30.749591645791813],
      [104.13348521905047, 30.749484185143388],
      [104.13354421469215, 30.74909660998237],
      [104.13369730416858, 30.748804239827624],
      [104.13378235387972, 30.748614198899737],
      [104.13400348213443, 30.748497250508255],
      [104.13439470852205, 30.748526487615287],
      [104.13509211219575, 30.74848263195245],
      [104.13586470976328, 30.748491043795866],
      [104.13620396716964, 30.74785931751096],
      [104.1367316996602, 30.746984614665696],
      [104.13687644573925, 30.746439652123833],
      [104.13673320168351, 30.74611649559629],
      [104.13621218143366, 30.746048443210693],
      [104.1360260373074, 30.74599879421463],
      [104.13555053846878, 30.745851831048483],
      [104.1352727849181, 30.745698372741767],
      [104.13533230184409, 30.74534030266328],
      [104.13568941115638, 30.745067486711218],
      [104.135967162961, 30.74491402748956],
      [104.13604652055898, 30.74486287437589],
      [104.13616555502604, 30.7444365976552],
      [104.13622507234844, 30.744249035460516],
      [104.1363044275411, 30.743788654394443],
      [104.13638378390985, 30.743549937651867],
      [104.13656206862773, 30.743404712453607],
      [104.13791909060235, 30.743680102335155],
      [104.13874838248127, 30.74402027543316],
      [104.13942688952753, 30.74450624425261],
      [104.13959651720107, 30.744846420863663],
      [104.13980384217615, 30.745235194977806],
      [104.13989808462459, 30.746077559982304],
      [104.13991815911203, 30.746551138229446],
      [104.13988887544484, 30.746742991755436],
      [104.1396677490827, 30.747210796671094],
      [104.13935059354782, 30.747444170027368],
      [104.13900131970719, 30.747819390548003],
      [104.13892651718663, 30.74808360477396],
      [104.13898736247069, 30.74838029093628],
      [104.13908694102105, 30.74852228363341],
      [104.1391061050803, 30.74855482110798],
      [104.1391759605811, 30.748614856158643],
      [104.13933486813949, 30.74889829307337],
      [104.13924251370027, 30.749140459379248],
      [104.13920849407303, 30.74919893370394],
      [104.1390043758412, 30.74944744931159],
      [104.1388002578295, 30.74982753115263],
      [104.13844683962489, 30.750289057740254],
      [104.1385222291929, 30.75051582263161],
      [104.13880494100654, 30.750596809999887],
      [104.13889917822564, 30.750758784589703],
      [104.13868542525721, 30.750915355284587],
      [104.13848453384868, 30.750904561553245],
      [104.13822066902587, 30.751082733182393],
      [104.13822066859161, 30.751374286246698],
      [104.13839029556186, 30.751665838677095],
      [104.13846568531793, 30.75184400929472],
      [104.13844683756095, 30.7520707715566],
      [104.1383525998062, 30.7522651389044],
      [104.1380113168794, 30.75260778343797],
      [104.13803219149084, 30.752670069974105],
      [104.13820416362097, 30.752766894210435],
      [104.13839211720632, 30.752748947080736],
      [104.13929011749815, 30.75273099994852],
      [104.14020900166089, 30.753089942118688],
      [104.13995839686953, 30.753395042178937],
      [104.13972867567688, 30.753359148091608],
      [104.13938771770289, 30.753410578476593],
      [104.13884945290197, 30.753456203676436],
      [104.13803709192456, 30.75355656544841],
      [104.13808469055061, 30.753818725555135],
      [104.13826981031964, 30.754057353972065],
      [104.1385591846402, 30.7541667626432],
      [104.13907970760447, 30.75461415183969],
      [104.13970448548885, 30.75493232093599],
      [104.14028298487183, 30.755349916645617],
      [104.14086722550472, 30.75586158141938],
      [104.14120136603441, 30.756220507767882],
      [104.14126402045893, 30.75666916430046],
      [104.14109695435262, 30.757046034583055],
      [104.1406792831268, 30.75726138853636],
      [104.14042868160843, 30.75758441879284],
      [104.1402989427797, 30.758258432414603],
      [104.14035728002442, 30.7585216098515],
      [104.14044478605103, 30.758922641256714],
      [104.14051770828769, 30.759311139417598],
      [104.14054687820791, 30.759586847185115],
      [104.14051771209918, 30.759774829465982],
      [104.14021145449655, 30.76015079332759],
      [104.13987602725987, 30.760313710710996],
      [104.13962810276173, 30.76045156374465],
      [104.13924892415986, 30.76062703137955],
      [104.13903016756831, 30.760714755350474],
      [104.13857806990188, 30.76081501125499],
      [104.1385051516848, 30.760965394987277],
      [104.13849056865776, 30.76110324661065],
      [104.13844681867639, 30.76136641754308],
      [104.13830682089069, 30.76160928881245],
      [104.13793311404088, 30.7617415177078],
      [104.13784518422231, 30.762005975085202],
      [104.13793311717453, 30.762327101159816],
      [104.13797708301338, 30.762364880644594],
      [104.13810898129172, 30.7626104470215],
      [104.13817902913708, 30.763373446812363],
      [104.13817903602785, 30.764540754575844],
      [104.13817903770399, 30.764824692471116],
      [104.13828918781788, 30.765487211440426],
      [104.13832590985903, 30.766591401053876],
      [104.13788916523295, 30.766782819718625],
      [104.13642852536427, 30.76684887572549],
      [104.13512166557315, 30.766254347687745],
      [104.13262319695583, 30.765858008537005],
      [104.1315469393346, 30.766155263031944],
      [104.13016318279745, 30.76691490981304],
      [104.12785690396443, 30.766518573006753],
      [104.12624250589032, 30.765758923529535],
      [104.12432060970755, 30.765494696413136],
      [104.12339809019818, 30.763645089093743],
      [104.12239870110348, 30.76252209827637],
      [104.12109181598494, 30.762555127579233],
      [104.12016930872925, 30.762555127579233],
      [104.12005399657968, 30.7629514784516],
      [104.12124336354599, 30.76502546624395],
      [104.1210896219737, 30.765337333367857],
      [104.11993308149542, 30.765818193236402],
      [104.11934859238892, 30.766619623291632],
      [104.11905012893058, 30.767250078914458],
      [104.1191247446482, 30.767602705603732],
      [104.11902700454121, 30.768005588689597],
      [104.11908069081522, 30.768766708745314],
      [104.11951017289525, 30.76908960670403],
      [104.11929543292423, 30.769573952012504],
      [104.11958903032557, 30.770232873534226],
      [104.12195423274873, 30.77151027027879],
      [104.12329014993635, 30.771477552931604],
      [104.12410271818969, 30.771670383321425],
      [104.12492988852722, 30.773232777547978],
      [104.12506171601703, 30.774252127642836],
      [104.12542315797728, 30.774768081619207],
      [104.12616648710942, 30.7754345086071],
      [104.12713605001683, 30.776128700089906],
      [104.12783090540843, 30.776392491971443],
      [104.12838032637386, 30.77661463212653],
      [104.12847728291088, 30.77676735328335],
      [104.1283480070619, 30.776878423113313],
      [104.12777276282303, 30.77695857848753],
      [104.1268290250485, 30.777378233327788],
      [104.12639271860736, 30.77789192496979],
      [104.12678055550177, 30.778294549618145],
      [104.12723301777683, 30.778863766505385],
      [104.12744308984631, 30.77926638196236],
      [104.12734613336633, 30.779710645980877],
      [104.12716837969607, 30.77997442708994],
      [104.12687750999113, 30.780113259057497],
      [104.12652200276275, 30.780043843090557],
      [104.12600490134444, 30.780002193494223],
      [104.12556859687861, 30.780029959893128],
      [104.12516461073113, 30.780182674990815],
      [104.12493837999325, 30.780557535254538],
      [104.12493838073557, 30.78079354653339],
      [104.12513229404249, 30.78102955742337],
      [104.12527772924157, 30.781237802003336],
      [104.12529389029463, 30.78168205609533],
      [104.125003022118, 30.78198747998425],
      [104.1245343998317, 30.78219572317144],
      [104.12385570493626, 30.78252891164117],
      [104.12291845792167, 30.783250815596475],
      [104.12217513914473, 30.78373672516084],
      [104.12151260559342, 30.78418096775271],
      [104.12028449175644, 30.784764034063183],
      [104.11994514413595, 30.785124978684717],
      [104.11967043381102, 30.785624746658716],
      [104.11936340408187, 30.786166159995563],
      [104.11860390848906, 30.786790865148173],
      [104.11837771291025, 30.786818637094523],
      [104.11803836213825, 30.786457698247897],
      [104.11702031517001, 30.785902405938035],
      [104.11685871976509, 30.78565252369604],
      [104.11655169111374, 30.785666406054247],
      [104.11645473522675, 30.785791347217646],
      [104.11626082344193, 30.786068993857086],
      [104.11548517048081, 30.785735817825145],
      [104.11512966278015, 30.785402641017992],
      [104.11480647393067, 30.784861227052982],
      [104.11448328596983, 30.78459746053362],
      [104.11409546090185, 30.78454193067816],
      [104.11404698281777, 30.784680755276423],
      [104.11412777988554, 30.78506946343562],
      [104.1140793018003, 30.785305464303203],
      [104.11386922964616, 30.785319346695072],
      [104.11359167156054, 30.784702062470952],
      [104.11343890461734, 30.784570820891123],
      [104.11335742905861, 30.784702062470952],
      [104.11340523675949, 30.78494785136258],
      [104.11360941319447, 30.78532371712656],
      [104.11368233501561, 30.78567452432986],
      [104.1136969207255, 30.785925100405265],
      [104.11359483503112, 30.786113032189252],
      [104.11331774185201, 30.7861631472922],
      [104.11304064761823, 30.786050388287215],
      [104.1127635499062, 30.78529865943804],
      [104.11260312545788, 30.784897735856777],
      [104.1123989516974, 30.784885206977734],
      [104.11229686538566, 30.784997966851773],
      [104.11220936373259, 30.78529865943804],
      [104.11203435847746, 30.785511649658144],
      [104.11180101697975, 30.785549236136415],
      [104.11145100433602, 30.785499120829968],
      [104.11098432083867, 30.785398890167233],
      [104.11051763732819, 30.785160842076905],
      [104.11034263126628, 30.785210957495487],
      [104.1103134637271, 30.785361303651573],
      [104.11034263152898, 30.785461534339227],
      [104.11037179943875, 30.785649466699482],
      [104.11056139510674, 30.786288437048437],
      [104.11086765497255, 30.78668935210518],
      [104.1107947448904, 30.78731578644796],
      [104.11051765334706, 30.787553829824706],
      [104.10971554213081, 30.787804401395274],
      [104.10907385111693, 30.787704172816888],
      [104.1086946708552, 30.787804401395274],
      [104.10828632360807, 30.788167729434832],
      [104.10811131773214, 30.788405771469996],
      [104.10815507049999, 30.788744041085632],
      [104.10815507191559, 30.789182537608855],
      [104.10800923415023, 30.789646089693047],
      [104.10777589139424, 30.789671146521947],
      [104.1074112931996, 30.789658618108007],
      [104.10713419812444, 30.789295293652067],
      [104.10690085516035, 30.788944496796958],
      [104.10676959990768, 30.788794155038385],
      [104.10649250575787, 30.78880668352398],
      [104.10624457938235, 30.78886932593636],
      [104.1060112367093, 30.789107366866652],
      [104.10589456519546, 30.789320350539136],
      [104.10564663835599, 30.78948322020384],
      [104.10526745664411, 30.789370464300816],
      [104.10513492016484, 30.789163340615044],
      [104.10476559381885, 30.78913893496889],
      [104.10459513422528, 30.789749074611493],
      [104.10388489048543, 30.789704164337945],
      [104.10308226, 30.79076197],
      [104.10198446, 30.79270045],
      [104.10094766, 30.79463889],
      [104.09948393, 30.79573908],
      [104.09795921, 30.79579147],
      [104.09606856, 30.79526757],
      [104.09381199, 30.79380065],
      [104.09210431, 30.79343392],
      [104.0910675, 30.79380065],
      [104.0905186, 30.79490084],
      [104.09088453, 30.79600059],
      [104.09216529, 30.79678642],
      [104.09356802, 30.79767702],
      [104.09375098, 30.79862],
      [104.09350702, 30.80029639],
      [104.09308009, 30.80160605],
      [104.09186033, 30.80212956],
      [104.09064057, 30.80155331],
      [104.08935982, 30.79940548],
      [104.08868895, 30.79830535],
      [104.08712823, 30.79834011],
      [104.08650208, 30.79862319],
      [104.08620547, 30.79947243],
      [104.0866998, 30.80057643],
      [104.08824871, 30.80210502],
      [104.08900669, 30.8024164],
      [104.08986354, 30.80335053],
      [104.08946806, 30.80456771],
      [104.0885453, 30.8053886],
      [104.08726003, 30.80646411],
      [104.08597475, 30.80714344],
      [104.08511791, 30.80703022],
      [104.08419515, 30.80553001],
      [104.08379969, 30.80462422],
      [104.08294285, 30.80402979],
      [104.08215191, 30.80405809],
      [104.08050412, 30.80541679],
      [104.0802850998143, 30.805780408294506],
      [104.07990131248151, 30.805793593872558],
      [104.07947147092482, 30.805503510881884],
      [104.0790876847135, 30.804923343181105],
      [104.0790924566311, 30.804604572068882],
      [104.07944956902548, 30.804263757757475],
      [104.0797273229227, 30.804025187212567],
      [104.07980668018588, 30.803445799796975],
      [104.0798066795783, 30.803122023361805],
      [104.0795884439868, 30.80286640982216],
      [104.07907261549681, 30.80281528705444],
      [104.07863614531684, 30.80286640982216],
      [104.07825919382583, 30.80262783673573],
      [104.07718786022421, 30.801469047001092],
      [104.07687692492583, 30.801355607853992],
      [104.07609668300518, 30.80153721740702],
      [104.07589828782608, 30.801690587377315],
      [104.07559223339683, 30.801944133408373],
      [104.07496582933908, 30.80245743453906],
      [104.07478727323688, 30.80259376245406],
      [104.07418808823223, 30.80267519128311],
      [104.0736558702192, 30.802754694399923],
      [104.07310051228062, 30.802655315495993],
      [104.07290251505667, 30.802491516531095],
      [104.07242945513026, 30.802396929975092],
      [104.07210549671258, 30.80223792323454],
      [104.07185095835095, 30.801959660950665],
      [104.07176430887017, 30.80160140513856],
      [104.07195656547852, 30.801425723313734],
      [104.0722479318063, 30.801261524533558],
      [104.07264351168163, 30.801126541779176],
      [104.07300149717155, 30.800993572073203],
      [104.07313695153601, 30.800819049208002],
      [104.07315630300896, 30.800561419954864],
      [104.07303052552855, 30.80036196483495],
      [104.07298214998804, 30.80019575209219],
      [104.07324857001615, 30.79993077546063],
      [104.07334981037043, 30.799830083601066],
      [104.07371746989884, 30.79950596782219],
      [104.07404642775273, 30.799298201037583],
      [104.07415642681563, 30.79921105199108],
      [104.07411415448868, 30.79908212336639],
      [104.07394635524679, 30.798961205532947],
      [104.07333229286601, 30.798308799126264],
      [104.07268591506437, 30.797920142277214],
      [104.07189724701853, 30.797427873496275],
      [104.07108612864518, 30.797087308210735],
      [104.07082757695946, 30.796865215637055],
      [104.07085989526139, 30.796643122718713],
      [104.07102148830693, 30.796393281883],
      [104.07105380613271, 30.79615730628253],
      [104.07068213801557, 30.796004615980777],
      [104.07031047023358, 30.79589356838628],
      [104.06958329489419, 30.79583804455672],
      [104.0689853947603, 30.795338329121286],
      [104.06893691637094, 30.79525504304575],
      [104.06845213336749, 30.79501906556854],
      [104.06753104618743, 30.79497742244392],
      [104.0665383392407, 30.795293856166754],
      [104.06568807850158, 30.795562375673647],
      [104.0654004978595, 30.79578792925311],
      [104.06483782513511, 30.795830892316836],
      [104.06453773279927, 30.795959781441706],
      [104.06431266318432, 30.7961745964287],
      [104.06410009740502, 30.79631422602207],
      [104.06387502797087, 30.79634644821932],
      [104.06328734712446, 30.796292744553767],
      [104.06291223158462, 30.796292744553767],
      [104.06274968097853, 30.79638941113935],
      [104.06264964883957, 30.796614966288086],
      [104.06256211930975, 30.79703385361306],
      [104.06238706407791, 30.797194963842827],
      [104.06204945850227, 30.797323851914708],
      [104.06176186810137, 30.79747422120616],
      [104.06164933082535, 30.79776421874292],
      [104.06136173964111, 30.797957550154262],
      [104.06109915690757, 30.798054215775974],
      [104.06072407121604, 30.798161619928322],
      [104.06047399337446, 30.79821532282473],
      [104.06036145773355, 30.798408653108808],
      [104.06019890674663, 30.798516058725447],
      [104.0600363562268, 30.79849457760764],
      [104.05974876737686, 30.798354950274586],
      [104.05956122333264, 30.79817235827159],
      [104.05926113001225, 30.797925325116218],
      [104.05906106820548, 30.798000509158726],
      [104.05859933789333, 30.798327188371715],
      [104.05832158368194, 30.79829310482056],
      [104.05802398979598, 30.798020436092607],
      [104.05770655657304, 30.797850017849886],
      [104.05757148216863, 30.797690945844565],
      [104.05784137590777, 30.797204095333594],
      [104.05803030096669, 30.797018627951154],
      [104.05843514003044, 30.79667087583417],
      [104.05870503323223, 30.796091286726437],
      [104.05859955079741, 30.795543813006127],
      [104.05875901293197, 30.795372592333656],
      [104.05924431203282, 30.795398756842744],
      [104.05938247518814, 30.795240513592052],
      [104.05929036667119, 30.795029522325976],
      [104.0590293923079, 30.794924026579295],
      [104.05886052683711, 30.794699847866045],
      [104.05901404138888, 30.794515229845324],
      [104.05918290719663, 30.794396546709496],
      [104.05948992432393, 30.794449310018948],
      [104.05987371103046, 30.79434381321546],
      [104.06007327974247, 30.794000948080892],
      [104.06018541618258, 30.79375583705691],
      [104.0602634511647, 30.793553164356176],
      [104.0602588770136, 30.793500061274827],
      [104.06028732580704, 30.793451185252742],
      [104.06038689648031, 30.793322885664786],
      [104.06043385301315, 30.793241901448262],
      [104.06044988188162, 30.793189811231077],
      [104.06045884680788, 30.793139754554844],
      [104.060471602913, 30.793033318952258],
      [104.06049085949923, 30.792939583547003],
      [104.06052937256669, 30.792768654237793],
      [104.06053579169239, 30.792658377236133],
      [104.06059365499587, 30.792541582926532],
      [104.06061985087014, 30.79227155031217],
      [104.06066351038241, 30.792061524739704],
      [104.06073052507217, 30.791806684537523],
      [104.06086178117248, 30.791380728674536],
      [104.06097845292484, 30.791080053224906],
      [104.0610513732274, 30.790616510734793],
      [104.061270131781, 30.79029077732364],
      [104.0618243187172, 30.789902401954404],
      [104.0619035661457, 30.789701867103712],
      [104.06188265424773, 30.789526553872708],
      [104.06186057967517, 30.7894170438168],
      [104.06187942740132, 30.7892227499411],
      [104.06189827517485, 30.788947499801004],
      [104.06301531615684, 30.788314018735356],
      [104.06369570830748, 30.787744893990443],
      [104.06407874815716, 30.78730789816481],
      [104.06418059146793, 30.78716791125506],
      [104.06419077455145, 30.78700167667295],
      [104.06411948230945, 30.78685294035126],
      [104.06406855918729, 30.786730451533007],
      [104.06377321142092, 30.78682669275364],
      [104.06362044558207, 30.78692293392814],
      [104.06319270086695, 30.787202907991645],
      [104.06288716886051, 30.787474132493376],
      [104.06248997588642, 30.787631617519796],
      [104.06211315118512, 30.78767536333906],
      [104.06181781270584, 30.787824100237117],
      [104.06159375480921, 30.787824100237117],
      [104.06134931712216, 30.78778035325522],
      [104.06113545491371, 30.787859096794623],
      [104.06057531218059, 30.788104072526345],
      [104.06001516906608, 30.78840154265585],
      [104.05966889842885, 30.78860277219943],
      [104.05928695292683, 30.78883445752362],
      [104.05888097872001, 30.788951192782026],
      [104.05860515444213, 30.78896473680664],
      [104.05823477399764, 30.78898504209296],
      [104.0578861400297, 30.78900998789089],
      [104.05781709735308, 30.789059515370848],
      [104.0576831272377, 30.789201683159916],
      [104.0575885602711, 30.789221992838456],
      [104.05734427238468, 30.789262606295896],
      [104.05703061289788, 30.789315274208334],
      [104.05670156370357, 30.789326581097875],
      [104.05631986661159, 30.78934919487457],
      [104.05595133143561, 30.789383115533656],
      [104.0557386669252, 30.789384258575087],
      [104.05554331091247, 30.789156977671507],
      [104.0553684296787, 30.789125838556874],
      [104.05499819117948, 30.789463772319163],
      [104.05481307243613, 30.789404137015868],
      [104.05488249311466, 30.788986689094603],
      [104.0546830968011, 30.78878945563111],
      [104.05450845930623, 30.788691939874678],
      [104.0544386044876, 30.788601925295843],
      [104.05443860494834, 30.788444399703334],
      [104.05446480109518, 30.788264370330797],
      [104.0548975270449, 30.78793619369232],
      [104.05513934363557, 30.787704018039914],
      [104.05513934536182, 30.78745962246259],
      [104.05521046967998, 30.787105248595342],
      [104.05532426563094, 30.786940281337166],
      [104.05568698701771, 30.78686696253268],
      [104.05668269140281, 30.7869647209355],
      [104.05704541245377, 30.786940281337166],
      [104.05745080638891, 30.786860852631683],
      [104.05802689107803, 30.786506478204277],
      [104.05806955699616, 30.78637817368033],
      [104.05829714682788, 30.785706071513243],
      [104.0582758093454, 30.785235599286825],
      [104.05817623658477, 30.78500342000748],
      [104.05814778774749, 30.784636815905063],
      [104.05816912423941, 30.78413578972479],
      [104.05798420768413, 30.78401358811691],
      [104.05764984394348, 30.783956380403104],
      [104.05733387195849, 30.78401454868459],
      [104.05715331646303, 30.78405332752855],
      [104.05699533132274, 30.783946685687717],
      [104.05699533393337, 30.78355889664759],
      [104.05726362534915, 30.783438188734078],
      [104.05739199919681, 30.78354847640151],
      [104.0576149655664, 30.78360652251296],
      [104.05775009765617, 30.783478820863028],
      [104.05775009863869, 30.78339175140947],
      [104.05753389127588, 30.78314215221557],
      [104.05752547017084, 30.783041268021954],
      [104.05750011093531, 30.78293898997844],
      [104.05759676276047, 30.782901274981192],
      [104.05809580284618, 30.782621288606943],
      [104.0583911514063, 30.782612539026456],
      [104.05857447080037, 30.782656286925075],
      [104.05862539157701, 30.782831278424222],
      [104.05854391267974, 30.783251257400114],
      [104.05862538771073, 30.783321253810715],
      [104.05866612523782, 30.78335625200688],
      [104.05886981425405, 30.78335625200688],
      [104.05887999731874, 30.78354874197668],
      [104.05899202573258, 30.783636237356507],
      [104.05941977021364, 30.783609992201132],
      [104.06042803598427, 30.78333000572652],
      [104.06084559972433, 30.783268758633156],
      [104.06100855198312, 30.783163763572524],
      [104.06100855235454, 30.783032521354535],
      [104.06096781542179, 30.78291002675284],
      [104.0606928334391, 30.78271754038797],
      [104.06075394239627, 30.782507548420977],
      [104.06093726411817, 30.78238505300552],
      [104.06149740892207, 30.78243755213004],
      [104.0617418366845, 30.78238505405832],
      [104.06191497361809, 30.782227559760813],
      [104.0619047904175, 30.78199131808299],
      [104.06182331533412, 30.781877571990876],
      [104.0616705490895, 30.781763825834325],
      [104.06148722923028, 30.7817025778772],
      [104.06135483212965, 30.781580081906924],
      [104.06144649395114, 30.781317590290463],
      [104.06191497965945, 30.781098847014736],
      [104.06240383283544, 30.781090097278746],
      [104.0626380746332, 30.781186344353618],
      [104.06301489822961, 30.78151883389377],
      [104.06375836300423, 30.78214006287549],
      [104.06394168345514, 30.782183811322923],
      [104.06413518834574, 30.782113813802475],
      [104.0643897986212, 30.781807578553394],
      [104.06437961221773, 30.78150134863827],
      [104.06428795220458, 30.78121260508633],
      [104.06424721466979, 30.780967610231908],
      [104.06418610820246, 30.780740114742372],
      [104.06402315706093, 30.78053011867721],
      [104.06367688606981, 30.780215124167828],
      [104.06359541098183, 30.78004012700475],
      [104.06362596531315, 30.77976013122672],
      [104.06382965516853, 30.779462635284936],
      [104.06378891197446, 30.7793751376303],
      [104.06378891221586, 30.77920013899712],
      [104.06414498837444, 30.779070499650135],
      [104.06453621547408, 30.778924360338767],
      [104.06506352169141, 30.778573625368335],
      [104.06559082618475, 30.778822062729933],
      [104.06574391411695, 30.77923125271622],
      [104.0659480376961, 30.779362773231636],
      [104.0664073043195, 30.779275089771602],
      [104.06664544212174, 30.779406614941024],
      [104.0674449052428, 30.780108080421815],
      [104.06749593444128, 30.7806487909947],
      [104.06758099201274, 30.780853375435456],
      [104.06783613952818, 30.780955671136226],
      [104.06836344516938, 30.781028739448086],
      [104.06870455325011, 30.781061918403704],
      [104.06882025208557, 30.78116131864488],
      [104.06951705085847, 30.781002093594385],
      [104.07091710360366, 30.78041320829058],
      [104.07132545201642, 30.779899497961345],
      [104.07174836482191, 30.77922289791333],
      [104.07247756162123, 30.778809414865705],
      [104.07265256902508, 30.778345811316512],
      [104.07253589846805, 30.777781967246906],
      [104.07180669673886, 30.775827256474187],
      [104.07215671164754, 30.77542628892758],
      [104.07281298805401, 30.775025320318118],
      [104.07325050525665, 30.775062911170405],
      [104.07352759990214, 30.775463879680224],
      [104.07339634479291, 30.77566436353656],
      [104.07326768329563, 30.77593435268832],
      [104.07351829009785, 30.776095834073327],
      [104.07414480511295, 30.7764008436014],
      [104.07441629425595, 30.77620347294569],
      [104.07485485336183, 30.775862559283613],
      [104.07506865192185, 30.775615497604456],
      [104.07221739000981, 30.77346851354128],
      [104.07188407302324, 30.772829651097467],
      [104.07147383728797, 30.772190785290046],
      [104.0710636021167, 30.77155191611913],
      [104.07106360250928, 30.771133344838596],
      [104.07126872027179, 30.770979134002886],
      [104.07108924261689, 30.77069274193095],
      [104.07073028758175, 30.77016401633017],
      [104.07032005381616, 30.76952513648919],
      [104.07008929983257, 30.768027060224878],
      [104.07019792207018, 30.76743272674301],
      [104.07059183472441, 30.76775581041435],
      [104.07093203216506, 30.76783273498555],
      [104.07135215021785, 30.767514377508277],
      [104.07198286709429, 30.76648334996295],
      [104.07246960094345, 30.765745033380025],
      [104.07254410065305, 30.765629804815674],
      [104.0725943004015, 30.76543547671885],
      [104.07253348825112, 30.765156801781323],
      [104.07239835331765, 30.76480845786647],
      [104.07212133185016, 30.764558811375213],
      [104.07147945862941, 30.76449494829271],
      [104.07111460487413, 30.764529782702475],
      [104.07093217718835, 30.764634287754742],
      [104.07047273398085, 30.765150995867447],
      [104.07034435939418, 30.765168412984515],
      [104.07026328056828, 30.765133578749747],
      [104.07018571321333, 30.76510267655308],
      [104.06961947875703, 30.764810266541467],
      [104.0695270202194, 30.7646819282125],
      [104.0694843471668, 30.764516921725818],
      [104.0694487862576, 30.764455808194047],
      [104.06911451391294, 30.764156351746234],
      [104.06974389090797, 30.76384899142629],
      [104.0698457360341, 30.76370896936966],
      [104.06988647422068, 30.763577698603026],
      [104.06995776697278, 30.762825077887186],
      [104.070304038754, 30.762448766473124],
      [104.07085399849727, 30.762098708711687],
      [104.07151397900522, 30.7618008230423],
      [104.07188262029469, 30.761442349006295],
      [104.07218815394516, 30.76123231131976],
      [104.0725242409905, 30.761197305216964],
      [104.07303346426741, 30.761197305216964],
      [104.07340010615495, 30.7614423476096],
      [104.07363435122156, 30.7617136458959],
      [104.0737463800533, 30.761897427075358],
      [104.07375656456205, 30.762124965445842],
      [104.07379730244374, 30.762361255019666],
      [104.07423523594555, 30.763638964202496],
      [104.07453058667828, 30.76388400339211],
      [104.07485649081849, 30.763980268706344],
      [104.07541663782635, 30.763910257573286],
      [104.07553738616699, 30.763670572904665],
      [104.07547144063045, 30.76323611317914],
      [104.07540550540772, 30.7613282506921],
      [104.07575723104719, 30.761139351855842],
      [104.07648266257618, 30.76112046195676],
      [104.07698826778406, 30.760818223189],
      [104.07736188289854, 30.761094371977812],
      [104.07799145362263, 30.76172078808074],
      [104.07842221508521, 30.761806208193192],
      [104.07872043616358, 30.761606894498446],
      [104.07944942198759, 30.760866583455325],
      [104.07998150194243, 30.76068504840599],
      [104.08047853359162, 30.760770469105466],
      [104.08071047939075, 30.761254518533555],
      [104.08067543161918, 30.761863154899473],
      [104.0803109374089, 30.762546513168147],
      [104.08031093511235, 30.763030556143654],
      [104.0806184826017, 30.76347469128508],
      [104.08102246466031, 30.76391902592406],
      [104.08132949166311, 30.76419673437408],
      [104.08200818467176, 30.764543869180134],
      [104.08246064690735, 30.764891003145614],
      [104.08283231276002, 30.765140939080283],
      [104.08313934122138, 30.765474186315313],
      [104.08326861646132, 30.765626924372473],
      [104.08302622491554, 30.76591851475696],
      [104.08286463050001, 30.766043481883024],
      [104.08288505968746, 30.766183377599322],
      [104.08329131014021, 30.76629003977863],
      [104.08360728313623, 30.76687183238214],
      [104.08383419655226, 30.76748754242456],
      [104.08420586175988, 30.767709701369565],
      [104.08467502130526, 30.767587309794305],
      [104.08520148878233, 30.76744028310915],
      [104.08578329624224, 30.767239331136675],
      [104.08580694026749, 30.767236712656462],
      [104.08635974305629, 30.767134927333778],
      [104.0866229819942, 30.767225403179324],
      [104.08688622079323, 30.76741766418265],
      [104.08712313594184, 30.767564687148223],
      [104.0874701218217, 30.767689334368193],
      [104.08778123447082, 30.767700400535976],
      [104.08796550213758, 30.767598615505865],
      [104.08805763591842, 30.76733849791491],
      [104.08865586423914, 30.7672912819071],
      [104.08898675851533, 30.767196508096156],
      [104.08928088687661, 30.76707804077707],
      [104.08942795185348, 30.766943780698245],
      [104.08942795357949, 30.766849006366368],
      [104.08930847115714, 30.766256668690936],
      [104.08926251884903, 30.765901262808654],
      [104.08933605347119, 30.765640634888705],
      [104.08943716252342, 30.765458981865407],
      [104.08956584451826, 30.765372104281358],
      [104.08989673924326, 30.765261532762842],
      [104.09028278238857, 30.76516675713284],
      [104.09142252376485, 30.765308920563058],
      [104.0919280547002, 30.765348410389052],
      [104.09332515942805, 30.76532471649428],
      [104.09357332997195, 30.765261532343633],
      [104.09383988274806, 30.765237838454443],
      [104.09406047802717, 30.765261532343633],
      [104.09424430731774, 30.765364205835052],
      [104.09428107324356, 30.765348409916296],
      [104.09461443909417, 30.76540375906806],
      [104.09485135777747, 30.765460303986202],
      [104.09521989187994, 30.765776973787894],
      [104.09564107430474, 30.766104952570082],
      [104.09590431354837, 30.766218048547277],
      [104.09618071457321, 30.766093642968],
      [104.09664138088955, 30.765912700688933],
      [104.09686513096989, 30.76530200026286],
      [104.09694410200422, 30.76490615816413],
      [104.09685196761878, 30.764679962243104],
      [104.09654924178355, 30.7644650758244],
      [104.09536466491834, 30.76376386552001],
      [104.09468024496516, 30.763085272001323],
      [104.09460471932404, 30.76218818602489],
      [104.0946815183785, 30.76136628326295],
      [104.0951000727838, 30.761036589675786],
      [104.09639061464506, 30.760946673076802],
      [104.09722772203277, 30.7602573101191],
      [104.09851826195529, 30.75971780575477],
      [104.09762449877702, 30.758605641662673],
      [104.09681288725267, 30.757841777065444],
      [104.0960568748168, 30.756442990359485],
      [104.09550151846824, 30.756303793637098],
      [104.09503872088855, 30.7567412685282],
      [104.09485360117438, 30.757258282334053],
      [104.09457592255745, 30.75731793763556],
      [104.09434452466714, 30.756920235087687],
      [104.09422882678332, 30.756303793637098],
      [104.09420568830245, 30.75572711984977],
      [104.09411313015553, 30.755249870565056],
      [104.09339579680525, 30.754931703362725],
      [104.09223880907048, 30.754335137675092],
      [104.09110496263854, 30.75375845480354],
      [104.0906289732139, 30.753741856565377],
      [104.09007346695248, 30.753775955630463],
      [104.08951796224665, 30.753503162862227],
      [104.08935924701305, 30.75336676626591],
      [104.0890616558118, 30.75316217110615],
      [104.08852599042832, 30.753042823782632],
      [104.08793080449323, 30.753230369528108],
      [104.08765305056775, 30.75336676626591],
      [104.08735545577417, 30.753656608863988],
      [104.0870181843965, 30.753639559317076],
      [104.08674043277817, 30.75348611329543],
      [104.08636348463585, 30.753247419128062],
      [104.0858079794405, 30.75319627032155],
      [104.0856095887378, 30.752804128810634],
      [104.08502996279819, 30.752726057487394],
      [104.0839886709754, 30.752745943429026],
      [104.0835952941461, 30.75264651368921],
      [104.08290110055307, 30.752129477767088],
      [104.08227632683611, 30.751751642471447],
      [104.08183667103977, 30.751672098053135],
      [104.08158213244664, 30.751950503295728],
      [104.08135073306445, 30.75234822399516],
      [104.08111933491142, 30.752368109996908],
      [104.081003636976, 30.752089705684487],
      [104.08077224074432, 30.751672098053135],
      [104.08017060889512, 30.75113517190554],
      [104.07929130046392, 30.750638016008722],
      [104.07955378964738, 30.750212958788254],
      [104.07974681370894, 30.749960184563697],
      [104.08090495272708, 30.748348730704745],
      [104.0811163623566, 30.747716783508334],
      [104.08108879610768, 30.746689853539376],
      [104.08103365706732, 30.74590780195186],
      [104.08112557271325, 30.745820907165637],
      [104.08459994236176, 30.746065792387526],
      [104.08496760111277, 30.745718213284725],
      [104.0850503226452, 30.7455444291048],
      [104.08550071105877, 30.744422678415102],
      [104.08625441273615, 30.743956597282306],
      [104.08724708972872, 30.74375120461585],
      [104.08719193829742, 30.74360902034133],
      [104.08716339589682, 30.741861087038604],
      [104.08782131311659, 30.741145944728217],
      [104.08798426641002, 30.74092024209719],
      [104.08828708506837, 30.739896130561533],
      [104.08881986857925, 30.73649735654677],
      [104.08908028829421, 30.735754631626712],
      [104.08909606973208, 30.73572241162987],
      [104.08967806307793, 30.735261172700174],
      [104.09021664794847, 30.73533408891371],
      [104.0902166474922, 30.735318827152614],
      [104.09031134640024, 30.735084814910334],
      [104.09047311921627, 30.734779582354157],
      [104.09107089516307, 30.734433648797896],
      [104.09151873031145, 30.734253899839356],
      [104.09181860211979, 30.73429629341047],
      [104.09195670214582, 30.734438736040822],
      [104.091932874251, 30.734494975687902],
      [104.09182642013062, 30.73487929519568],
      [104.09173273968207, 30.735172110313968],
      [104.09160073820213, 30.735871205603438],
      [104.09202657745873, 30.73640558935222],
      [104.09244815428126, 30.736522714094253],
      [104.09251628930993, 30.73651905420652],
      [104.0933424034746, 30.73651905420652],
      [104.09364900542985, 30.7365007534768],
      [104.09439421406941, 30.736420231364157],
      [104.09473487949184, 30.73652637505621],
      [104.09496056976141, 30.73649709293731],
      [104.09513941844374, 30.73625918297025],
      [104.09559931610605, 30.735918787768462],
      [104.09609754056213, 30.73582362333267],
      [104.09674054970242, 30.73594440913302],
      [104.09714934818511, 30.735834604401138],
      [104.09723025507239, 30.735787021667445],
      [104.09744317105486, 30.735625973528233],
      [104.09750704474989, 30.73542100320229],
      [104.09734096408981, 30.734853673197453],
      [104.0969619699585, 30.73426437576951],
      [104.09725153542223, 30.73408868442662],
      [104.09835018386559, 30.73416554932509],
      [104.09837976552832, 30.734330648181427],
      [104.09839328402155, 30.734510287548026],
      [104.09838028710007, 30.73452190588711],
      [104.09823991937225, 30.73466445502204],
      [104.09816817634571, 30.734744890581737],
      [104.09834233825893, 30.73489548285399],
      [104.09842500126956, 30.734964299997355],
      [104.0987909998838, 30.735039372796233],
      [104.0988455065581, 30.73521230865255],
      [104.09890288671977, 30.735384455353362],
      [104.09892658147521, 30.735458257457086],
      [104.09896546530737, 30.735578137314068],
      [104.09901790932152, 30.735746049537937],
      [104.09906730051623, 30.73589505446604],
      [104.09912410030212, 30.736077595386675],
      [104.09914986105156, 30.73615352286463],
      [104.09916458491233, 30.73619901726043],
      [104.09917781772938, 30.73623746321151],
      [104.09919216874431, 30.73628023424318],
      [104.09920596049867, 30.736320602317097],
      [104.09921546552363, 30.73634655323674],
      [104.09918005485068, 30.736358567681975],
      [104.09911165692269, 30.73638147495115],
      [104.09904918448767, 30.736401994909272],
      [104.09891936742642, 30.73644545835565],
      [104.09878807206306, 30.736489684269234],
      [104.09865322836424, 30.736533909909166],
      [104.09848822231483, 30.736590589936597],
      [104.0984237012875, 30.736613718698862],
      [104.09844729328404, 30.736654555053697],
      [104.09849316585519, 30.73673369258861],
      [104.09853281288977, 30.73680072023643],
      [104.09857573625611, 30.736873943778786],
      [104.09859048121785, 30.73689703745499],
      [104.09875561968902, 30.736874225528098],
      [104.0990550977514, 30.73683423422677],
      [104.09926152199117, 30.736805507969223],
      [104.09928478560643, 30.736801565159713],
      [104.09928707930851, 30.736803254961927],
      [104.09929789274032, 30.736847470758324],
      [104.09931165485169, 30.73690238815395],
      [104.09933131494172, 30.736976738093574],
      [104.09934081711167, 30.7370167290104],
      [104.09939751544287, 30.73723082467737],
      [104.09946260311288, 30.737502816843175],
      [104.09952769092908, 30.73776130540317],
      [104.09959390086719, 30.73802461599546],
      [104.09963654484785, 30.73819051120081],
      [104.0995153527334, 30.738247417112785],
      [104.09941772550134, 30.738292749030805],
      [104.09927184071826, 30.73784811148563],
      [104.09881512559423, 30.73799857372766],
      [104.09876126235937, 30.738019792939127],
      [104.09852336661379, 30.73813456863909],
      [104.09837748650202, 30.738197261464016],
      [104.09836762098092, 30.738219979392277],
      [104.09842005658282, 30.73842642417253],
      [104.09845219440354, 30.738574715015734],
      [104.09842919626298, 30.73858197608542],
      [104.09836274284598, 30.738598040279218],
      [104.09811561892951, 30.738644447973638],
      [104.09814884661586, 30.739062118791608],
      [104.0983274425468, 30.739379832773523],
      [104.09806749012346, 30.73944311249937],
      [104.09813751832658, 30.739643761625583],
      [104.09818086146178, 30.739768670871722],
      [104.0985199613247, 30.739834412794945],
      [104.09853780807227, 30.73981907313022],
      [104.09889730629322, 30.73949693796948],
      [104.0989279026238, 30.73928437190965],
      [104.09898909634911, 30.738914024039104],
      [104.09903243983877, 30.738905258427746],
      [104.09943273042717, 30.73884828127665],
      [104.0998993104056, 30.738784730434837],
      [104.10020781375573, 30.738736519481723],
      [104.10021546162224, 30.738708030874335],
      [104.10014152212106, 30.738302617939194],
      [104.10004643474326, 30.737773498424655],
      [104.09983410465186, 30.736901560087265],
      [104.09958402702321, 30.735859279073708],
      [104.09938113617044, 30.73498326416161],
      [104.09934810762302, 30.734861595503414],
      [104.09938398718356, 30.73486395052919],
      [104.09971579860233, 30.734893972113365],
      [104.09995155913305, 30.73482642354384],
      [104.10046337668521, 30.734691186962696],
      [104.10104527055506, 30.734488739802725],
      [104.10145510400235, 30.734236275224685],
      [104.1018613528866, 30.73396468034735],
      [104.10198548402353, 30.73383858258806],
      [104.10205318777243, 30.733285691382385],
      [104.10213216964522, 30.731995605376724],
      [104.10221116230282, 30.73197620551744],
      [104.10231859, 30.73201817],
    ],
  ],
});
//金牛区总图，暂未使用
const polygon = reactive({
  strokeColor: "#DC143C",
  fillOpacity: 0.1,
  visible: true,
  edit: true,
  path: [
    [[[103.954281, 30.776256]]],
    [
      [
        [104.05802, 30.678438],
        [104.057178, 30.677989],
        [104.056894, 30.677838],
        [104.056357, 30.677441],
        [104.055853, 30.676998],
        [104.055123, 30.676398],
        [104.054909, 30.676297],
        [104.054007, 30.675891],
        [104.053557, 30.675826],
        [104.05316, 30.675697],
        [104.052922, 30.675311],
        [104.052818, 30.675174],
        [104.052799, 30.675148],
        [104.052545, 30.674812],
        [104.052466, 30.67469],
        [104.052451, 30.674627],
        [104.052447, 30.674532],
        [104.052439, 30.674484],
        [104.052439, 30.67444],
        [104.052451, 30.674396],
        [104.05252, 30.67427],
        [104.052527, 30.674229],
        [104.052515, 30.67419],
        [104.052373, 30.673925],
        [104.052065, 30.673395],
        [104.051784, 30.672913],
        [104.051628, 30.672626],
        [104.05157, 30.672497],
        [104.051516, 30.672363],
        [104.05146, 30.672188],
        [104.051359, 30.671783],
        [104.051318, 30.671659],
        [104.051291, 30.671596],
        [104.051259, 30.671542],
        [104.051174, 30.67145],
        [104.05113, 30.671374],
        [104.050951, 30.671066],
        [104.050859, 30.670906],
        [104.050827, 30.670838],
        [104.050815, 30.670772],
        [104.05082, 30.670709],
        [104.0509, 30.67044],
        [104.050913, 30.67037],
        [104.050923, 30.670278],
        [104.050923, 30.669773],
        [104.050909, 30.669701],
        [104.050904, 30.669554],
        [104.050907, 30.669392],
        [104.050904, 30.668857],
        [104.050902, 30.668363],
        [104.050851, 30.668156],
        [104.05079, 30.66797],
        [104.05071, 30.66781],
        [104.050587, 30.667682],
        [104.050524, 30.667616],
        [104.050314, 30.667407],
        [104.049869, 30.666901],
        [104.048871, 30.665793],
        [104.048858, 30.665779],
        [104.048793, 30.665707],
        [104.048598, 30.665556],
        [104.04833, 30.665385],
        [104.048062, 30.665208],
        [104.047878, 30.665058],
        [104.047753, 30.664903],
        [104.046766, 30.663086],
        [104.045055, 30.663981],
        [104.044212, 30.664414],
        [104.043098, 30.665033],
        [104.042976, 30.665101],
        [104.04199, 30.6656],
        [104.041928, 30.665655],
        [104.041293, 30.665982],
        [104.041183, 30.666006],
        [104.040849, 30.666162],
        [104.040762, 30.666206],
        [104.040608, 30.666279],
        [104.040589, 30.666288],
        [104.040463, 30.666347],
        [104.040427, 30.66636],
        [104.039802, 30.666654],
        [104.039856, 30.666744],
        [104.039856, 30.666835],
        [104.039802, 30.666944],
        [104.039665, 30.667052],
        [104.038886, 30.667337],
        [104.038483, 30.66747],
        [104.038249, 30.667596],
        [104.038054, 30.667736],
        [104.037864, 30.667925],
        [104.03728, 30.668536],
        [104.03691, 30.66888],
        [104.036656, 30.669049],
        [104.036418, 30.669131],
        [104.036184, 30.66915],
        [104.036013, 30.66912],
        [104.035814, 30.669042],
        [104.035497, 30.668934],
        [104.035249, 30.66889],
        [104.034944, 30.668887],
        [104.034686, 30.668955],
        [104.034462, 30.66907],
        [104.034267, 30.669245],
        [104.033931, 30.669744],
        [104.033692, 30.670254],
        [104.03349, 30.670528],
        [104.033154, 30.67092],
        [104.032855, 30.671243],
        [104.032718, 30.671388],
        [104.032644, 30.671467],
        [104.032421, 30.671716],
        [104.032292, 30.671956],
        [104.032271, 30.672325],
        [104.03226, 30.67251],
        [104.032346, 30.672786],
        [104.032442, 30.673174],
        [104.032516, 30.673516],
        [104.032784, 30.673537],
        [104.032898, 30.67363],
        [104.032929, 30.673805],
        [104.032867, 30.67401],
        [104.032681, 30.674225],
        [104.032331, 30.674461],
        [104.032077, 30.674899],
        [104.031952, 30.675128],
        [104.031755, 30.675489],
        [104.031278, 30.676468],
        [104.031334, 30.676667],
        [104.031351, 30.676775],
        [104.031359, 30.676966],
        [104.031444, 30.677472],
        [104.031481, 30.677691],
        [104.031568, 30.677982],
        [104.031644, 30.678111],
        [104.031766, 30.678204],
        [104.031965, 30.678326],
        [104.032565, 30.678619],
        [104.032677, 30.678731],
        [104.032725, 30.678891],
        [104.032735, 30.67911],
        [104.032686, 30.67929],
        [104.032555, 30.679469],
        [104.032389, 30.6796],
        [104.03218, 30.679667],
        [104.031995, 30.679686],
        [104.03082, 30.679664],
        [104.030587, 30.679683],
        [104.030411, 30.679721],
        [104.030221, 30.679822],
        [104.029868, 30.680096],
        [104.029167, 30.680728],
        [104.029149, 30.680739],
        [104.029137, 30.680756],
        [104.029103, 30.680787],
        [104.029069, 30.680818],
        [104.028955, 30.68092],
        [104.02866, 30.681186],
        [104.028396, 30.681379],
        [104.028099, 30.681495],
        [104.027792, 30.681567],
        [104.027485, 30.681591],
        [104.027225, 30.681519],
        [104.02702, 30.681407],
        [104.026786, 30.681222],
        [104.026596, 30.681129],
        [104.026411, 30.68109],
        [104.026182, 30.681108],
        [104.025924, 30.681195],
        [104.025724, 30.681297],
        [104.025573, 30.681423],
        [104.024852, 30.682402],
        [104.024834, 30.682417],
        [104.024827, 30.682424],
        [104.024688, 30.682545],
        [104.024513, 30.682641],
        [104.023572, 30.682916],
        [104.023231, 30.682968],
        [104.022934, 30.682967],
        [104.022656, 30.682933],
        [104.022303, 30.68289],
        [104.021996, 30.682909],
        [104.021767, 30.682947],
        [104.021622, 30.683006],
        [104.021589, 30.683019],
        [104.021441, 30.683112],
        [104.020912, 30.683476],
        [104.020709, 30.683579],
        [104.020535, 30.683643],
        [104.020349, 30.683665],
        [104.020186, 30.683653],
        [104.01989, 30.683589],
        [104.019361, 30.683431],
        [104.019007, 30.683296],
        [104.018664, 30.683104],
        [104.018373, 30.682921],
        [104.018141, 30.682698],
        [104.017786, 30.682285],
        [104.017742, 30.682284],
        [104.017756, 30.68225],
        [104.017704, 30.68223],
        [104.017634, 30.682226],
        [104.017582, 30.682232],
        [104.017495, 30.68226],
        [104.016455, 30.68238],
        [104.016321, 30.682419],
        [104.016257, 30.682437],
        [104.016184, 30.682459],
        [104.016169, 30.682463],
        [104.016136, 30.682473],
        [104.016367, 30.68292],
        [104.014205, 30.683908],
        [104.012408, 30.684729],
        [104.011764, 30.685024],
        [104.011527, 30.684617],
        [104.011412, 30.68442],
        [104.011165, 30.683995],
        [104.010727, 30.684793],
        [104.010648, 30.684953],
        [104.010613, 30.685104],
        [104.010599, 30.685445],
        [104.010586, 30.685568],
        [104.010508, 30.68568],
        [104.010176, 30.685933],
        [104.010011, 30.685978],
        [104.009802, 30.685995],
        [104.00923, 30.685932],
        [104.008989, 30.685939],
        [104.008415, 30.686084],
        [104.008251, 30.686101],
        [104.008108, 30.686053],
        [104.007469, 30.685734],
        [104.006424, 30.685726],
        [104.005018, 30.685707],
        [104.004263, 30.685995],
        [104.004047, 30.686081],
        [104.00371, 30.686216],
        [104.003598, 30.686445],
        [104.003603, 30.686798],
        [104.003657, 30.687173],
        [104.003659, 30.687195],
        [104.003698, 30.687561],
        [104.004463, 30.688168],
        [104.006663, 30.687193],
        [104.007341, 30.686892],
        [104.007717, 30.687418],
        [104.00708, 30.687679],
        [104.006183, 30.688046],
        [104.006494, 30.688712],
        [104.008456, 30.688733],
        [104.008533, 30.688741],
        [104.00861, 30.68875],
        [104.008682, 30.688735],
        [104.008798, 30.688766],
        [104.008833, 30.688775],
        [104.011, 30.687711],
        [104.011018, 30.687702],
        [104.011428, 30.688366],
        [104.01147, 30.688434],
        [104.01193, 30.689178],
        [104.011005, 30.689711],
        [104.01062, 30.689932],
        [104.010614, 30.689917],
        [104.009923, 30.690349],
        [104.008085, 30.691393],
        [104.006254, 30.692434],
        [104.007327, 30.694685],
        [104.009086, 30.693412],
        [104.009672, 30.693994],
        [104.008654, 30.694787],
        [104.008123, 30.695903],
        [104.008507, 30.696327],
        [104.008578, 30.69642],
        [104.008868, 30.696784],
        [104.009236, 30.697249],
        [104.009035, 30.69751],
        [104.008679, 30.697967],
        [104.008756, 30.698084],
        [104.00905, 30.698527],
        [104.009044, 30.69905],
        [104.008148, 30.699467],
        [104.008094, 30.699492],
        [104.007868, 30.699598],
        [104.007795, 30.699597],
        [104.007783, 30.699597],
        [104.007625, 30.699602],
        [104.007545, 30.699594],
        [104.007513, 30.699613],
        [104.007489, 30.699593],
        [104.007389, 30.699592],
        [104.007261, 30.699591],
        [104.00677, 30.699651],
        [104.006089, 30.699733],
        [104.005751, 30.699696],
        [104.005021, 30.699645],
        [104.004378, 30.699073],
        [104.003992, 30.698677],
        [104.00367, 30.698326],
        [104.003489, 30.698052],
        [104.002681, 30.697898],
        [104.001116, 30.69818],
        [104.000234, 30.699591],
        [103.999721, 30.701119],
        [103.99916, 30.702792],
        [103.999516, 30.703632],
        [103.999162, 30.703761],
        [103.998068, 30.704591],
        [103.997489, 30.704121],
        [103.996437, 30.703407],
        [103.996237, 30.703412],
        [103.995684, 30.703427],
        [103.994229, 30.703579],
        [103.989927, 30.70403],
        [103.98952, 30.704675],
        [103.988941, 30.705506],
        [103.988576, 30.705819],
        [103.9879, 30.705266],
        [103.988126, 30.704887],
        [103.988812, 30.70438],
        [103.989188, 30.704196],
        [103.989606, 30.703809],
        [103.989511, 30.703725],
        [103.989515, 30.703717],
        [103.989505, 30.703416],
        [103.989345, 30.703216],
        [103.98759, 30.701828],
        [103.986727, 30.701146],
        [103.986515, 30.700773],
        [103.986505, 30.700517],
        [103.986615, 30.700325],
        [103.986811, 30.700233],
        [103.9871, 30.700219],
        [103.98868, 30.700518],
        [103.988982, 30.700567],
        [103.989259, 30.700536],
        [103.98955, 30.700387],
        [103.989681, 30.700186],
        [103.989851, 30.698691],
        [103.989733, 30.698371],
        [103.989467, 30.698008],
        [103.989254, 30.697838],
        [103.989148, 30.697651],
        [103.989129, 30.697454],
        [103.989422, 30.696471],
        [103.989531, 30.696326],
        [103.989689, 30.696215],
        [103.989918, 30.696104],
        [103.990161, 30.696078],
        [103.990779, 30.696213],
        [103.991001, 30.69625],
        [103.99119, 30.696199],
        [103.991339, 30.696028],
        [103.99139, 30.695744],
        [103.991268, 30.694885],
        [103.989698, 30.695144],
        [103.987719, 30.693628],
        [103.984692, 30.692849],
        [103.980706, 30.692811],
        [103.98053, 30.693123],
        [103.980259, 30.69347],
        [103.978711, 30.695341],
        [103.978493, 30.69555],
        [103.978291, 30.695675],
        [103.976528, 30.696472],
        [103.97617, 30.696701],
        [103.975971, 30.696879],
        [103.975887, 30.697046],
        [103.975834, 30.697276],
        [103.975813, 30.69759],
        [103.97575, 30.697747],
        [103.975572, 30.697998],
        [103.975372, 30.698207],
        [103.975173, 30.698332],
        [103.974837, 30.698467],
        [103.973849, 30.698769],
        [103.97345, 30.698925],
        [103.973272, 30.699102],
        [103.973146, 30.699385],
        [103.973083, 30.699751],
        [103.973083, 30.700034],
        [103.973125, 30.700264],
        [103.973329, 30.700626],
        [103.97396, 30.701413],
        [103.974096, 30.701676],
        [103.974138, 30.701969],
        [103.974086, 30.702555],
        [103.97397, 30.702859],
        [103.973708, 30.703172],
        [103.973403, 30.703444],
        [103.973256, 30.703642],
        [103.973225, 30.70382],
        [103.973288, 30.703998],
        [103.973771, 30.704544],
        [103.973839, 30.704728],
        [103.973807, 30.704969],
        [103.973681, 30.705115],
        [103.973408, 30.70524],
        [103.973104, 30.705323],
        [103.972831, 30.705333],
        [103.972579, 30.705269],
        [103.972085, 30.705016],
        [103.971822, 30.704974],
        [103.971591, 30.704973],
        [103.971423, 30.705046],
        [103.971255, 30.705224],
        [103.971171, 30.705422],
        [103.97115, 30.705632],
        [103.971129, 30.706543],
        [103.97115, 30.706753],
        [103.971203, 30.706889],
        [103.971423, 30.707298],
        [103.971502, 30.707586],
        [103.971565, 30.707921],
        [103.971565, 30.708204],
        [103.971523, 30.708455],
        [103.971418, 30.708707],
        [103.971156, 30.709125],
        [103.971072, 30.709355],
        [103.971019, 30.709627],
        [103.970998, 30.710434],
        [103.970893, 30.710706],
        [103.970725, 30.710957],
        [103.970494, 30.711144],
        [103.970137, 30.71129],
        [103.969643, 30.711341],
        [103.969013, 30.71134],
        [103.967711, 30.711389],
        [103.966798, 30.711439],
        [103.966262, 30.7115],
        [103.965816, 30.711588],
        [103.964923, 30.711837],
        [103.964629, 30.711878],
        [103.964251, 30.711877],
        [103.963863, 30.711793],
        [103.962928, 30.711372],
        [103.962603, 30.711276],
        [103.96233, 30.711255],
        [103.961868, 30.711296],
        [103.9617, 30.711369],
        [103.961616, 30.711546],
        [103.961605, 30.711766],
        [103.961647, 30.712039],
        [103.962018, 30.713284],
        [103.961647, 30.714054],
        [103.961544, 30.714268],
        [103.961758, 30.714479],
        [103.961327, 30.715164],
        [103.960708, 30.716011],
        [103.960519, 30.716157],
        [103.960309, 30.716199],
        [103.960067, 30.716177],
        [103.959626, 30.716103],
        [103.959375, 30.716113],
        [103.959133, 30.716196],
        [103.957989, 30.716791],
        [103.957737, 30.716884],
        [103.957464, 30.716915],
        [103.957264, 30.716873],
        [103.957086, 30.716747],
        [103.956404, 30.716064],
        [103.956094, 30.715901],
        [103.955727, 30.715838],
        [103.95538, 30.715858],
        [103.955013, 30.715951],
        [103.954583, 30.716139],
        [103.954215, 30.716379],
        [103.953974, 30.716598],
        [103.953816, 30.716797],
        [103.953753, 30.716996],
        [103.953743, 30.717258],
        [103.954084, 30.719264],
        [103.954189, 30.719526],
        [103.954325, 30.719705],
        [103.95485, 30.720208],
        [103.955008, 30.720418],
        [103.95506, 30.720596],
        [103.954997, 30.720753],
        [103.95485, 30.720892],
        [103.955367, 30.720942],
        [103.956408, 30.721537],
        [103.956453, 30.721563],
        [103.956511, 30.721556],
        [103.956672, 30.721574],
        [103.956974, 30.72167],
        [103.958499, 30.722193],
        [103.960352, 30.721764],
        [103.960907, 30.721743],
        [103.961214, 30.721906],
        [103.961365, 30.722173],
        [103.961422, 30.722599],
        [103.961105, 30.723366],
        [103.961252, 30.724032],
        [103.961835, 30.724357],
        [103.962106, 30.724944],
        [103.962312, 30.72585],
        [103.962555, 30.726171],
        [103.964334, 30.726816],
        [103.964351, 30.726838],
        [103.964405, 30.726842],
        [103.965372, 30.727192],
        [103.965726, 30.726936],
        [103.966184, 30.726357],
        [103.966302, 30.725872],
        [103.966224, 30.725365],
        [103.966022, 30.724758],
        [103.965992, 30.724668],
        [103.966231, 30.72272],
        [103.966308, 30.722552],
        [103.96641, 30.722449],
        [103.966815, 30.722314],
        [103.966923, 30.722262],
        [103.967263, 30.721883],
        [103.9674, 30.721769],
        [103.967562, 30.721695],
        [103.96798, 30.721676],
        [103.968148, 30.721701],
        [103.96831, 30.721679],
        [103.968439, 30.721565],
        [103.968679, 30.721167],
        [103.968774, 30.721017],
        [103.968945, 30.720886],
        [103.968955, 30.720882],
        [103.969308, 30.721072],
        [103.969354, 30.721141],
        [103.969342, 30.721234],
        [103.969122, 30.721406],
        [103.969064, 30.721533],
        [103.969076, 30.722134],
        [103.969146, 30.722261],
        [103.969365, 30.722481],
        [103.969458, 30.722504],
        [103.969713, 30.722401],
        [103.969904, 30.722441],
        [103.970013, 30.72243],
        [103.970104, 30.722367],
        [103.970199, 30.721859],
        [103.970176, 30.721709],
        [103.970072, 30.721582],
        [103.970002, 30.721409],
        [103.969967, 30.721155],
        [103.969985, 30.720524],
        [103.970216, 30.720389],
        [103.97091, 30.719688],
        [103.971066, 30.719521],
        [103.971158, 30.719462],
        [103.971225, 30.719418],
        [103.971773, 30.719234],
        [103.973361, 30.718763],
        [103.97409, 30.718505],
        [103.974444, 30.718053],
        [103.974637, 30.717564],
        [103.974541, 30.717269],
        [103.974337, 30.717066],
        [103.974122, 30.717011],
        [103.973007, 30.716974],
        [103.972803, 30.716909],
        [103.972599, 30.716707],
        [103.972513, 30.716393],
        [103.972609, 30.716079],
        [103.972867, 30.715821],
        [103.973253, 30.715433],
        [103.973254, 30.715064],
        [103.976644, 30.715987],
        [103.980378, 30.716999],
        [103.980592, 30.717057],
        [103.984928, 30.718421],
        [103.979435, 30.724029],
        [103.975529, 30.72794],
        [103.975605, 30.727964],
        [103.976821, 30.728349],
        [103.977607, 30.728598],
        [103.979606, 30.729231],
        [103.980379, 30.729821],
        [103.980894, 30.730227],
        [103.98128, 30.730669],
        [103.979781, 30.732521],
        [103.980279, 30.732564],
        [103.981307, 30.732506],
        [103.982178, 30.732255],
        [103.983119, 30.731682],
        [103.983981, 30.731038],
        [103.986115, 30.728584],
        [103.986882, 30.728041],
        [103.988197, 30.727548],
        [103.989669, 30.727333],
        [103.990915, 30.727371],
        [103.991874, 30.727593],
        [103.992936, 30.727998],
        [103.993642, 30.728435],
        [103.994374, 30.729171],
        [103.996265, 30.732511],
        [103.996686, 30.733049],
        [103.99674, 30.733116],
        [103.996745, 30.733124],
        [103.997267, 30.733789],
        [103.99828, 30.734795],
        [103.998291, 30.734803],
        [103.9983, 30.734814],
        [103.998731, 30.735241],
        [104.000442, 30.736654],
        [104.000586, 30.736773],
        [104.001554, 30.737808],
        [104.001763, 30.738366],
        [104.001728, 30.738942],
        [104.001449, 30.739553],
        [104.000735, 30.74023],
        [103.998853, 30.741682],
        [103.99786, 30.742797],
        [103.997049, 30.744052],
        [103.996753, 30.745325],
        [103.996562, 30.746616],
        [103.996509, 30.749111],
        [103.996567, 30.749854],
        [103.99657, 30.74987],
        [103.99657, 30.749883],
        [103.996631, 30.750675],
        [103.996901, 30.751913],
        [103.997015, 30.752439],
        [103.997651, 30.754343],
        [103.998435, 30.755793],
        [103.99863, 30.756005],
        [103.999367, 30.75681],
        [104.000753, 30.757598],
        [104.002369, 30.75802],
        [104.003933, 30.758429],
        [104.008629, 30.758927],
        [104.010363, 30.758889],
        [104.011704, 30.758482],
        [104.012741, 30.757893],
        [104.013151, 30.757561],
        [104.013556, 30.757234],
        [104.013536, 30.757106],
        [104.013583, 30.756854],
        [104.013837, 30.756444],
        [104.014209, 30.756098],
        [104.014739, 30.755744],
        [104.015246, 30.755533],
        [104.01576, 30.755384],
        [104.016038, 30.755211],
        [104.01633, 30.754889],
        [104.016702, 30.754258],
        [104.016869, 30.753817],
        [104.016861, 30.753501],
        [104.016734, 30.753201],
        [104.016386, 30.752868],
        [104.016128, 30.75269],
        [104.015978, 30.752469],
        [104.015825, 30.752135],
        [104.015273, 30.750928],
        [104.015099, 30.75073],
        [104.014838, 30.750658],
        [104.013563, 30.750504],
        [104.013262, 30.750393],
        [104.013057, 30.750187],
        [104.012962, 30.74995],
        [104.012601, 30.748966],
        [104.012578, 30.748729],
        [104.012633, 30.748556],
        [104.012815, 30.748415],
        [104.016623, 30.746871],
        [104.016983, 30.746813],
        [104.017712, 30.74687],
        [104.018131, 30.746974],
        [104.018424, 30.74718],
        [104.019794, 30.748723],
        [104.020039, 30.748834],
        [104.02034, 30.748851],
        [104.020633, 30.748781],
        [104.020934, 30.748608],
        [104.021155, 30.748356],
        [104.021306, 30.747986],
        [104.021329, 30.747654],
        [104.021269, 30.747062],
        [104.021258, 30.746952],
        [104.021068, 30.746138],
        [104.021005, 30.745483],
        [104.02102, 30.745148],
        [104.021036, 30.744796],
        [104.021074, 30.744655],
        [104.021278, 30.743901],
        [104.021278, 30.743483],
        [104.021183, 30.743064],
        [104.020763, 30.741753],
        [104.020766, 30.741401],
        [104.020934, 30.741115],
        [104.021251, 30.74084],
        [104.021736, 30.740634],
        [104.022171, 30.740596],
        [104.022557, 30.740646],
        [104.022953, 30.740825],
        [104.023982, 30.741499],
        [104.024388, 30.741668],
        [104.024853, 30.741689],
        [104.025318, 30.741503],
        [104.025684, 30.741129],
        [104.025781, 30.740993],
        [104.026164, 30.740454],
        [104.02649, 30.740169],
        [104.027578, 30.739501],
        [104.027836, 30.739216],
        [104.027925, 30.738881],
        [104.027865, 30.738575],
        [104.027588, 30.738327],
        [104.027311, 30.738287],
        [104.026836, 30.738414],
        [104.026173, 30.73859],
        [104.025827, 30.738559],
        [104.02557, 30.738411],
        [104.025461, 30.738154],
        [104.02551, 30.737947],
        [104.025653, 30.737803],
        [104.026925, 30.73653],
        [104.027178, 30.736102],
        [104.027286, 30.735727],
        [104.027652, 30.734673],
        [104.027705, 30.734579],
        [104.02788, 30.734269],
        [104.028256, 30.733885],
        [104.028648, 30.733596],
        [104.029534, 30.733149],
        [104.031422, 30.732376],
        [104.032325, 30.732081],
        [104.032859, 30.731808],
        [104.032971, 30.731781],
        [104.033205, 30.731725],
        [104.033533, 30.731795],
        [104.033881, 30.73205],
        [104.034116, 30.732409],
        [104.034238, 30.732819],
        [104.034508, 30.73432],
        [104.034682, 30.734809],
        [104.035022, 30.735229],
        [104.035405, 30.735493],
        [104.036111, 30.73579],
        [104.036389, 30.736036],
        [104.036581, 30.736447],
        [104.036746, 30.737166],
        [104.036766, 30.737555],
        [104.036772, 30.737666],
        [104.036711, 30.738048],
        [104.036546, 30.73844],
        [104.036206, 30.738893],
        [104.035266, 30.739677],
        [104.034056, 30.740425],
        [104.033638, 30.74079],
        [104.032819, 30.741778],
        [104.031269, 30.744777],
        [104.031278, 30.744959],
        [104.031426, 30.745064],
        [104.035824, 30.745592],
        [104.036075, 30.745651],
        [104.03609, 30.745654],
        [104.036372, 30.74572],
        [104.036738, 30.74592],
        [104.038367, 30.747367],
        [104.038378, 30.747373],
        [104.038391, 30.747388],
        [104.039282, 30.748179],
        [104.039676, 30.748529],
        [104.039855, 30.748688],
        [104.04117, 30.749633],
        [104.041392, 30.749753],
        [104.041427, 30.749808],
        [104.041473, 30.749797],
        [104.041608, 30.74987],
        [104.041717, 30.749929],
        [104.042763, 30.750493],
        [104.043955, 30.750882],
        [104.044213, 30.750966],
        [104.04443, 30.751037],
        [104.044445, 30.751043],
        [104.04446, 30.751047],
        [104.044581, 30.751087],
        [104.044594, 30.751092],
        [104.044608, 30.751095],
        [104.04483, 30.751168],
        [104.044841, 30.751173],
        [104.044854, 30.751176],
        [104.044992, 30.751221],
        [104.04563, 30.751365],
        [104.045647, 30.751367],
        [104.045661, 30.751372],
        [104.046812, 30.751631],
        [104.04768, 30.751985],
        [104.047844, 30.752052],
        [104.048083, 30.752149],
        [104.048579, 30.75251],
        [104.050067, 30.751258],
        [104.050611, 30.751036],
        [104.050807, 30.750956],
        [104.051416, 30.750903],
        [104.051753, 30.750936],
        [104.05478, 30.749849],
        [104.056095, 30.748736],
        [104.056869, 30.748211],
        [104.058126, 30.747358],
        [104.058938, 30.746807],
        [104.060194, 30.745955],
        [104.061647, 30.744673],
        [104.06323, 30.743449],
        [104.064881, 30.742505],
        [104.066395, 30.741562],
        [104.066577, 30.741461],
        [104.066685, 30.741402],
        [104.067009, 30.740954],
        [104.067246, 30.740521],
        [104.069162, 30.740121],
        [104.069848, 30.73997],
        [104.071126, 30.739689],
        [104.0727, 30.739536],
        [104.074068, 30.740057],
        [104.075222, 30.741479],
        [104.075357, 30.74187],
        [104.075381, 30.741876],
        [104.075382, 30.74194],
        [104.075543, 30.742168],
        [104.075946, 30.742994],
        [104.07632, 30.744245],
        [104.077233, 30.749155],
        [104.07734, 30.749423],
        [104.077807, 30.750593],
        [104.078998, 30.752131],
        [104.080536, 30.753099],
        [104.081944, 30.753589],
        [104.083038, 30.753744],
        [104.083534, 30.753814],
        [104.086081, 30.753965],
        [104.086993, 30.754138],
        [104.088027, 30.754522],
        [104.0888, 30.754909],
        [104.090518, 30.755771],
        [104.09129, 30.756159],
        [104.093992, 30.757795],
        [104.095382, 30.758935],
        [104.096378, 30.760223],
        [104.096398, 30.760249],
        [104.096583, 30.76071],
        [104.096284, 30.760826],
        [104.096141, 30.760907],
        [104.096067, 30.760938],
        [104.095965, 30.760958],
        [104.09577, 30.760991],
        [104.094909, 30.761236],
        [104.094827, 30.761282],
        [104.094733, 30.761366],
        [104.094657, 30.761485],
        [104.094605, 30.761683],
        [104.094602, 30.761968],
        [104.09472, 30.763092],
        [104.094736, 30.763136],
        [104.094769, 30.763189],
        [104.095415, 30.76378],
        [104.095621, 30.763927],
        [104.095885, 30.764075],
        [104.096804, 30.764598],
        [104.096863, 30.764648],
        [104.09689, 30.764702],
        [104.096906, 30.764814],
        [104.096858, 30.76528],
        [104.096832, 30.765359],
        [104.096608, 30.765882],
        [104.096583, 30.765914],
        [104.096523, 30.765955],
        [104.095974, 30.766179],
        [104.095915, 30.766184],
        [104.095858, 30.766178],
        [104.095729, 30.766157],
        [104.095664, 30.76613],
        [104.095573, 30.76607],
        [104.094875, 30.76549],
        [104.094812, 30.765451],
        [104.094738, 30.765422],
        [104.094644, 30.765392],
        [104.094317, 30.765369],
        [104.094242, 30.76536],
        [104.094181, 30.765342],
        [104.094071, 30.765277],
        [104.09401, 30.765245],
        [104.09394, 30.76523],
        [104.093815, 30.765229],
        [104.093521, 30.765294],
        [104.093416, 30.765305],
        [104.091822, 30.765354],
        [104.091733, 30.76535],
        [104.091652, 30.765335],
        [104.090685, 30.7652],
        [104.090318, 30.765173],
        [104.089995, 30.765217],
        [104.089629, 30.765326],
        [104.089459, 30.765464],
        [104.08935, 30.765627],
        [104.089259, 30.765871],
        [104.089258, 30.766022],
        [104.089309, 30.76628],
        [104.089433, 30.766817],
        [104.089583, 30.767063],
        [104.089607, 30.767221],
        [104.089593, 30.767337],
        [104.089517, 30.767494],
        [104.089076, 30.768291],
        [104.088392, 30.768119],
        [104.087402, 30.767969],
        [104.085716, 30.767783],
        [104.084821, 30.767596],
        [104.084048, 30.767198],
        [104.083474, 30.766678],
        [104.083014, 30.765983],
        [104.082756, 30.7654],
        [104.08259, 30.765372],
        [104.081884, 30.765229],
        [104.081622, 30.765128],
        [104.0813, 30.764933],
        [104.081018, 30.764674],
        [104.080718, 30.764305],
        [104.080579, 30.764029],
        [104.080289, 30.76317],
        [104.080236, 30.762985],
        [104.080224, 30.762856],
        [104.080232, 30.762705],
        [104.080281, 30.762559],
        [104.080508, 30.762067],
        [104.080529, 30.761989],
        [104.080533, 30.76191],
        [104.080513, 30.761828],
        [104.08046, 30.761735],
        [104.080441, 30.761676],
        [104.080441, 30.761618],
        [104.080421, 30.761574],
        [104.080323, 30.761489],
        [104.079806, 30.761181],
        [104.079712, 30.761151],
        [104.079613, 30.761145],
        [104.079492, 30.761159],
        [104.079377, 30.761204],
        [104.078637, 30.761854],
        [104.078545, 30.761897],
        [104.07843, 30.761917],
        [104.078332, 30.761928],
        [104.078245, 30.761921],
        [104.078136, 30.761891],
        [104.078022, 30.761797],
        [104.077859, 30.761594],
        [104.077762, 30.761459],
        [104.077722, 30.761435],
        [104.077648, 30.761412],
        [104.077571, 30.76137],
        [104.077534, 30.761341],
        [104.077487, 30.761265],
        [104.077407, 30.761092],
        [104.077337, 30.761022],
        [104.077229, 30.760956],
        [104.077118, 30.760926],
        [104.076976, 30.760922],
        [104.076787, 30.760967],
        [104.076531, 30.761114],
        [104.076464, 30.761143],
        [104.076393, 30.761151],
        [104.076308, 30.76113],
        [104.076017, 30.761156],
        [104.075618, 30.761276],
        [104.075516, 30.761356],
        [104.07544, 30.761484],
        [104.075395, 30.76181],
        [104.075527, 30.763724],
        [104.075499, 30.7638],
        [104.075424, 30.763869],
        [104.075308, 30.763915],
        [104.074956, 30.763947],
        [104.074754, 30.763939],
        [104.074558, 30.76388],
        [104.074403, 30.763797],
        [104.074289, 30.763703],
        [104.074209, 30.763602],
        [104.074157, 30.763427],
        [104.074071, 30.763112],
        [104.073901, 30.762527],
        [104.073872, 30.762469],
        [104.073832, 30.762417],
        [104.073789, 30.762329],
        [104.073773, 30.762224],
        [104.073759, 30.761935],
        [104.073742, 30.761862],
        [104.073713, 30.76178],
        [104.07363, 30.76166],
        [104.073442, 30.761441],
        [104.073365, 30.761376],
        [104.07315, 30.761252],
        [104.073079, 30.761225],
        [104.072938, 30.761207],
        [104.072312, 30.76121],
        [104.072227, 30.761227],
        [104.072149, 30.761264],
        [104.071877, 30.761422],
        [104.071707, 30.761582],
        [104.0716, 30.761681],
        [104.071318, 30.761877],
        [104.071176, 30.761954],
        [104.070924, 30.762058],
        [104.070727, 30.762151],
        [104.070512, 30.762272],
        [104.070264, 30.762431],
        [104.070091, 30.762619],
        [104.069932, 30.762863],
        [104.06991, 30.763014],
        [104.069878, 30.763598],
        [104.069863, 30.763674],
        [104.069836, 30.763723],
        [104.069778, 30.763796],
        [104.06972, 30.763842],
        [104.069163, 30.764093],
        [104.069126, 30.764119],
        [104.069105, 30.764157],
        [104.069108, 30.764201],
        [104.069141, 30.764239],
        [104.069437, 30.764487],
        [104.069457, 30.764528],
        [104.069463, 30.764586],
        [104.069486, 30.764671],
        [104.069542, 30.764776],
        [104.069619, 30.764855],
        [104.070225, 30.765164],
        [104.070319, 30.765182],
        [104.07038, 30.765183],
        [104.070465, 30.765161],
        [104.07054, 30.7651],
        [104.070956, 30.764634],
        [104.071024, 30.764591],
        [104.071137, 30.764551],
        [104.071289, 30.764523],
        [104.071583, 30.764511],
        [104.072076, 30.76457],
        [104.072184, 30.764629],
        [104.072272, 30.764701],
        [104.072375, 30.764821],
        [104.072481, 30.765029],
        [104.072554, 30.765227],
        [104.072573, 30.765365],
        [104.072558, 30.765498],
        [104.072519, 30.765638],
        [104.071788, 30.766781],
        [104.071611, 30.767002],
        [104.071233, 30.767547],
        [104.071172, 30.767628],
        [104.071097, 30.76768],
        [104.070989, 30.767714],
        [104.070852, 30.767741],
        [104.070738, 30.76774],
        [104.070616, 30.767705],
        [104.070522, 30.767651],
        [104.070409, 30.767546],
        [104.07022, 30.767398],
        [104.070133, 30.767368],
        [104.070018, 30.767361],
        [104.069849, 30.767395],
        [104.069536, 30.767497],
        [104.06925, 30.767603],
        [104.069522, 30.76815],
        [104.071425, 30.771969],
        [104.072009, 30.773141],
        [104.072374, 30.774134],
        [104.072666, 30.775131],
        [104.072748, 30.775411],
        [104.073026, 30.777029],
        [104.073105, 30.778293],
        [104.072957, 30.779122],
        [104.072557, 30.780212],
        [104.071992, 30.78093],
        [104.071322, 30.781574],
        [104.069522, 30.782794],
        [104.068105, 30.783584],
        [104.067139, 30.783954],
        [104.066278, 30.784027],
        [104.065756, 30.783852],
        [104.065495, 30.783543],
        [104.065374, 30.783035],
        [104.065295, 30.781194],
        [104.065139, 30.780538],
        [104.064799, 30.780214],
        [104.064269, 30.780002],
        [104.063512, 30.780001],
        [104.062738, 30.780223],
        [104.062051, 30.780693],
        [104.060189, 30.782238],
        [104.059623, 30.782598],
        [104.058197, 30.78314],
        [104.057492, 30.783547],
        [104.057342, 30.783682],
        [104.056735, 30.784227],
        [104.056326, 30.784945],
        [104.056274, 30.785342],
        [104.056308, 30.785901],
        [104.056613, 30.786848],
        [104.057144, 30.787878],
        [104.057631, 30.788363],
        [104.058693, 30.788884],
        [104.059302, 30.789345],
        [104.059928, 30.790115],
        [104.060485, 30.791069],
        [104.061094, 30.792384],
        [104.061355, 30.793464],
        [104.061468, 30.794584],
        [104.061416, 30.795637],
        [104.061138, 30.797571],
        [104.061164, 30.798166],
        [104.061399, 30.798712],
        [104.061738, 30.799197],
        [104.062182, 30.799395],
        [104.062678, 30.799383],
        [104.063165, 30.79916],
        [104.063608, 30.798728],
        [104.065087, 30.797087],
        [104.065948, 30.796359],
        [104.066922, 30.7959],
        [104.067905, 30.795691],
        [104.068447, 30.795715],
        [104.068827, 30.795731],
        [104.069644, 30.795954],
        [104.070731, 30.796526],
        [104.071775, 30.79732],
        [104.072114, 30.797829],
        [104.072297, 30.798487],
        [104.072323, 30.799243],
        [104.072262, 30.799911],
        [104.072128, 30.800553],
        [104.072053, 30.800914],
        [104.072062, 30.801448],
        [104.07221, 30.801931],
        [104.072584, 30.802328],
        [104.073245, 30.80254],
        [104.073766, 30.802547],
        [104.075053, 30.802264],
        [104.075696, 30.802239],
        [104.076322, 30.8024],
        [104.076648, 30.802529],
        [104.077041, 30.802685],
        [104.077054, 30.802691],
        [104.077069, 30.802696],
        [104.077132, 30.802721],
        [104.077155, 30.802742],
        [104.077184, 30.802743],
        [104.080477, 30.804723],
        [104.08086, 30.804893],
        [104.08116, 30.804979],
        [104.081928, 30.804323],
        [104.082245, 30.804186],
        [104.082622, 30.80412],
        [104.083037, 30.804152],
        [104.083423, 30.804283],
        [104.083782, 30.804614],
        [104.084037, 30.805152],
        [104.084824, 30.806688],
        [104.085089, 30.807011],
        [104.085384, 30.807145],
        [104.085706, 30.807159],
        [104.086583, 30.806979],
        [104.087207, 30.806691],
        [104.087649, 30.806276],
        [104.088052, 30.805801],
        [104.08866, 30.805274],
        [104.089242, 30.804841],
        [104.08953, 30.804449],
        [104.089657, 30.804118],
        [104.089776, 30.803529],
        [104.089733, 30.803216],
        [104.089561, 30.802938],
        [104.089094, 30.802483],
        [104.088719, 30.802269],
        [104.088267, 30.802135],
        [104.088052, 30.802028],
        [104.087623, 30.801642],
        [104.087072, 30.801024],
        [104.08669, 30.800452],
        [104.086327, 30.79985],
        [104.086273, 30.799314],
        [104.086421, 30.798778],
        [104.086702, 30.798416],
        [104.087185, 30.798216],
        [104.08815, 30.798163],
        [104.088498, 30.79827],
        [104.088893, 30.798531],
        [104.089406, 30.799113],
        [104.089689, 30.799702],
        [104.090024, 30.800453],
        [104.090412, 30.800962],
        [104.09115, 30.80182],
        [104.091376, 30.802048],
        [104.091659, 30.802182],
        [104.092047, 30.802168],
        [104.09235, 30.802056],
        [104.092913, 30.801735],
        [104.093133, 30.801539],
        [104.093248, 30.801279],
        [104.093507, 30.8002],
        [104.093668, 30.799436],
        [104.093823, 30.798922],
        [104.093904, 30.798493],
        [104.093856, 30.79815],
        [104.093716, 30.797863],
        [104.093435, 30.797461],
        [104.093092, 30.797158],
        [104.09231, 30.79671],
        [104.091519, 30.796348],
        [104.091028, 30.796032],
        [104.090754, 30.795598],
        [104.090643, 30.795099],
        [104.09077, 30.794435],
        [104.091093, 30.793878],
        [104.091398, 30.793642],
        [104.091918, 30.79346],
        [104.092444, 30.793468],
        [104.093086, 30.793562],
        [104.093707, 30.79375],
        [104.094144, 30.794018],
        [104.094791, 30.794447],
        [104.095927, 30.79501],
        [104.096838, 30.795426],
        [104.097636, 30.795643],
        [104.098419, 30.79575],
        [104.099047, 30.795707],
        [104.099718, 30.795533],
        [104.100321, 30.795252],
        [104.100869, 30.794796],
        [104.10127, 30.79426],
        [104.101632, 30.793403],
        [104.102003, 30.792583],
        [104.102345, 30.791822],
        [104.10257, 30.791415],
        [104.102878, 30.790991],
        [104.103347, 30.790603],
        [104.103856, 30.790375],
        [104.104036, 30.790349],
        [104.104622, 30.79034],
        [104.106376, 30.788818],
        [104.107442, 30.788162],
        [104.108832, 30.787617],
        [104.110897, 30.787021],
        [104.113022, 30.786623],
        [104.11704, 30.786149],
        [104.119313, 30.785703],
        [104.120855, 30.785054],
        [104.121144, 30.784933],
        [104.122982, 30.783741],
        [104.124239, 30.782526],
        [104.125193, 30.780945],
        [104.125697, 30.779641],
        [104.125783, 30.778527],
        [104.12575, 30.778241],
        [104.125653, 30.777435],
        [104.125342, 30.776841],
        [104.124725, 30.776186],
        [104.123771, 30.775418],
        [104.117621, 30.771289],
        [104.117144, 30.770696],
        [104.116953, 30.770039],
        [104.116951, 30.769956],
        [104.116935, 30.76927],
        [104.117212, 30.768575],
        [104.117829, 30.767832],
        [104.118956, 30.767026],
        [104.120666, 30.766119],
        [104.122071, 30.765659],
        [104.122212, 30.765639],
        [104.123484, 30.765461],
        [104.125253, 30.765452],
        [104.130033, 30.765721],
        [104.131185, 30.76572],
        [104.132322, 30.765568],
        [104.13357, 30.765146],
        [104.134722, 30.764499],
        [104.135858, 30.763718],
        [104.136267, 30.763411],
        [104.137193, 30.762718],
        [104.137826, 30.761974],
        [104.138398, 30.760871],
        [104.138675, 30.759815],
        [104.138961, 30.758253],
        [104.139127, 30.756475],
        [104.139829, 30.74897],
        [104.139845, 30.748539],
        [104.13995, 30.745804],
        [104.139889, 30.745086],
        [104.139715, 30.744267],
        [104.139614, 30.743992],
        [104.139262, 30.744255],
        [104.137214, 30.743852],
        [104.136606, 30.744297],
        [104.136341, 30.745043],
        [104.136328, 30.746387],
        [104.135626, 30.747729],
        [104.134932, 30.748099],
        [104.133723, 30.748017],
        [104.132105, 30.747703],
        [104.130154, 30.747699],
        [104.128969, 30.748439],
        [104.127233, 30.749326],
        [104.126803, 30.749174],
        [104.126117, 30.748572],
        [104.126083, 30.748427],
        [104.125701, 30.746777],
        [104.125915, 30.745585],
        [104.126002, 30.745103],
        [104.126007, 30.744786],
        [104.125964, 30.744371],
        [104.125747, 30.743514],
        [104.125704, 30.743197],
        [104.125816, 30.742906],
        [104.126015, 30.742686],
        [104.128349, 30.741446],
        [104.128384, 30.741364],
        [104.128366, 30.741266],
        [104.128227, 30.741183],
        [104.127689, 30.741086],
        [104.127429, 30.741032],
        [104.127273, 30.740894],
        [104.126988, 30.739956],
        [104.126761, 30.739858],
        [104.124819, 30.740082],
        [104.12435, 30.740067],
        [104.123786, 30.739959],
        [104.122572, 30.739365],
        [104.122157, 30.739366],
        [104.120075, 30.740349],
        [104.119779, 30.740349],
        [104.119641, 30.740223],
        [104.119701, 30.74003],
        [104.120613, 30.73938],
        [104.120889, 30.739269],
        [104.121662, 30.739173],
        [104.121904, 30.739047],
        [104.122069, 30.738716],
        [104.122164, 30.737887],
        [104.12212, 30.737449],
        [104.122103, 30.737279],
        [104.121965, 30.736906],
        [104.121713, 30.736602],
        [104.121647, 30.736566],
        [104.121409, 30.736437],
        [104.121063, 30.736381],
        [104.120716, 30.736464],
        [104.120334, 30.736742],
        [104.120234, 30.736785],
        [104.120109, 30.736838],
        [104.119641, 30.736908],
        [104.118963, 30.736839],
        [104.118694, 30.736715],
        [104.11866, 30.736452],
        [104.118822, 30.736245],
        [104.119102, 30.735885],
        [104.119197, 30.73561],
        [104.119128, 30.735319],
        [104.118986, 30.735158],
        [104.118678, 30.734809],
        [104.118512, 30.734601],
        [104.118443, 30.734418],
        [104.11846, 30.734314],
        [104.118555, 30.734244],
        [104.119371, 30.734174],
        [104.11958, 30.734107],
        [104.119683, 30.733933],
        [104.1197, 30.733753],
        [104.119597, 30.73354],
        [104.117809, 30.732339],
        [104.116994, 30.731716],
        [104.116317, 30.731109],
        [104.115327, 30.73012],
        [104.113465, 30.730841],
        [104.113241, 30.729867],
        [104.112507, 30.730317],
        [104.111009, 30.729568],
        [104.109609, 30.729168],
        [104.109578, 30.729188],
        [104.109513, 30.72914],
        [104.109361, 30.728754],
        [104.107139, 30.728874],
        [104.10674, 30.729213],
        [104.106743, 30.729242],
        [104.106709, 30.72924],
        [104.105659, 30.730134],
        [104.104351, 30.731321],
        [104.103313, 30.731239],
        [104.102715, 30.730488],
        [104.102266, 30.729416],
        [104.102577, 30.727358],
        [104.102966, 30.725656],
        [104.102989, 30.724176],
        [104.101704, 30.722897],
        [104.100327, 30.72229],
        [104.096957, 30.722042],
        [104.09272, 30.721936],
        [104.092166, 30.721723],
        [104.091699, 30.721055],
        [104.091606, 30.721123],
        [104.09147, 30.721148],
        [104.090801, 30.721078],
        [104.090627, 30.721031],
        [104.090237, 30.720872],
        [104.090117, 30.720852],
        [104.089588, 30.720913],
        [104.089476, 30.720899],
        [104.089416, 30.720866],
        [104.088899, 30.72036],
        [104.088847, 30.720275],
        [104.088593, 30.719869],
        [104.088201, 30.718988],
        [104.087982, 30.716874],
        [104.088187, 30.716056],
        [104.088492, 30.715603],
        [104.088637, 30.715384],
        [104.088745, 30.714857],
        [104.088873, 30.714227],
        [104.088873, 30.714049],
        [104.088804, 30.713882],
        [104.088621, 30.713717],
        [104.088459, 30.713678],
        [104.088225, 30.713662],
        [104.086956, 30.713857],
        [104.086235, 30.713898],
        [104.085505, 30.713856],
        [104.084801, 30.713717],
        [104.082698, 30.713059],
        [104.082446, 30.713018],
        [104.082238, 30.713072],
        [104.082168, 30.713294],
        [104.082264, 30.71513],
        [104.082255, 30.715324],
        [104.082099, 30.715504],
        [104.081934, 30.715532],
        [104.080526, 30.71535],
        [104.08003, 30.715309],
        [104.079408, 30.715301],
        [104.077697, 30.715279],
        [104.077579, 30.715278],
        [104.076997, 30.715154],
        [104.076591, 30.714966],
        [104.076563, 30.714336],
        [104.076552, 30.714089],
        [104.076466, 30.713005],
        [104.076321, 30.713116],
        [104.075699, 30.713517],
        [104.075192, 30.713852],
        [104.075164, 30.71383],
        [104.075151, 30.71382],
        [104.075137, 30.713808],
        [104.074691, 30.713444],
        [104.074681, 30.713438],
        [104.074671, 30.713428],
        [104.074623, 30.713389],
        [104.074612, 30.713382],
        [104.074602, 30.713372],
        [104.074549, 30.713329],
        [104.074536, 30.71332],
        [104.074524, 30.713312],
        [104.074152, 30.713129],
        [104.073818, 30.713098],
        [104.07346, 30.713134],
        [104.072518, 30.713473],
        [104.072207, 30.713596],
        [104.072033, 30.714507],
        [104.072024, 30.71467],
        [104.07206, 30.714854],
        [104.072127, 30.714939],
        [104.073695, 30.716598],
        [104.073732, 30.716735],
        [104.073723, 30.716892],
        [104.073631, 30.717022],
        [104.073518, 30.717072],
        [104.072941, 30.717172],
        [104.072799, 30.717197],
        [104.072746, 30.717242],
        [104.07269, 30.717593],
        [104.072628, 30.717684],
        [104.07253, 30.717754],
        [104.071992, 30.717945],
        [104.071946, 30.718004],
        [104.071845, 30.718335],
        [104.071792, 30.718413],
        [104.071731, 30.718425],
        [104.071671, 30.718399],
        [104.071371, 30.718155],
        [104.071094, 30.717786],
        [104.070908, 30.717334],
        [104.070915, 30.717162],
        [104.070875, 30.71708],
        [104.070795, 30.716469],
        [104.070826, 30.716393],
        [104.070765, 30.716242],
        [104.070877, 30.713811],
        [104.070882, 30.713691],
        [104.071053, 30.712026],
        [104.071054, 30.712021],
        [104.071059, 30.711971],
        [104.071198, 30.710617],
        [104.071221, 30.710398],
        [104.071341, 30.709973],
        [104.071516, 30.709355],
        [104.070771, 30.709347],
        [104.070731, 30.708628],
        [104.070693, 30.707936],
        [104.072058, 30.707744],
        [104.072063, 30.70722],
        [104.072084, 30.70523],
        [104.072088, 30.704913],
        [104.072111, 30.702807],
        [104.072155, 30.702786],
        [104.072154, 30.702738],
        [104.072153, 30.702704],
        [104.072113, 30.702682],
        [104.072123, 30.701815],
        [104.072133, 30.700901],
        [104.07214, 30.700249],
        [104.072162, 30.698289],
        [104.072162, 30.697768],
        [104.072381, 30.697769],
        [104.076036, 30.697781],
        [104.076227, 30.697782],
        [104.07801, 30.697518],
        [104.079906, 30.697504],
        [104.081403, 30.697493],
        [104.081557, 30.697492],
        [104.087585, 30.697447],
        [104.089931, 30.697428],
        [104.090232, 30.697426],
        [104.092961, 30.697406],
        [104.092999, 30.697406],
        [104.09225, 30.696379],
        [104.091914, 30.696721],
        [104.091571, 30.696235],
        [104.091213, 30.695769],
        [104.091149, 30.695662],
        [104.091149, 30.695555],
        [104.091293, 30.695433],
        [104.093662, 30.694311],
        [104.09378, 30.694207],
        [104.093846, 30.694091],
        [104.093853, 30.693938],
        [104.093511, 30.692576],
        [104.093424, 30.692358],
        [104.093318, 30.692194],
        [104.093172, 30.692106],
        [104.092582, 30.691924],
        [104.092349, 30.691866],
        [104.092174, 30.691771],
        [104.092014, 30.691633],
        [104.09152, 30.690947],
        [104.091468, 30.690875],
        [104.091395, 30.690759],
        [104.091389, 30.690642],
        [104.091428, 30.690544],
        [104.092171, 30.690005],
        [104.092411, 30.689779],
        [104.092536, 30.689597],
        [104.092565, 30.689437],
        [104.092513, 30.689255],
        [104.092026, 30.6886],
        [104.091866, 30.688337],
        [104.091814, 30.688119],
        [104.091851, 30.687893],
        [104.091968, 30.687668],
        [104.092141, 30.687486],
        [104.092332, 30.687362],
        [104.092536, 30.687318],
        [104.092849, 30.687296],
        [104.093863, 30.687303],
        [104.092881, 30.685827],
        [104.091902, 30.684357],
        [104.088856, 30.67978],
        [104.088789, 30.679679],
        [104.088837, 30.679655],
        [104.09164, 30.678257],
        [104.091658, 30.678248],
        [104.093256, 30.677451],
        [104.093291, 30.677475],
        [104.09329, 30.677434],
        [104.094546, 30.676807],
        [104.094562, 30.676808],
        [104.094577, 30.676792],
        [104.094711, 30.676725],
        [104.094606, 30.676596],
        [104.094591, 30.676586],
        [104.094581, 30.676566],
        [104.094166, 30.676059],
        [104.09405, 30.675939],
        [104.093241, 30.674811],
        [104.091956, 30.673212],
        [104.091382, 30.672452],
        [104.090738, 30.671655],
        [104.090327, 30.671074],
        [104.090237, 30.670877],
        [104.090205, 30.670831],
        [104.090109, 30.670769],
        [104.089833, 30.670385],
        [104.089866, 30.670353],
        [104.089813, 30.670357],
        [104.089624, 30.670093],
        [104.088271, 30.670681],
        [104.087679, 30.671041],
        [104.087139, 30.671538],
        [104.086485, 30.672304],
        [104.08613, 30.672574],
        [104.08559, 30.672843],
        [104.085065, 30.672942],
        [104.084375, 30.67295],
        [104.084348, 30.67295],
        [104.083857, 30.672956],
        [104.083246, 30.67304],
        [104.08272, 30.673267],
        [104.081072, 30.674387],
        [104.078712, 30.675746],
        [104.078315, 30.675975],
        [104.077881, 30.67611],
        [104.077754, 30.676134],
        [104.077071, 30.676265],
        [104.076602, 30.676449],
        [104.076426, 30.676551],
        [104.076161, 30.676704],
        [104.075792, 30.677087],
        [104.075252, 30.677598],
        [104.07494, 30.677793],
        [104.074754, 30.67791],
        [104.074271, 30.678065],
        [104.073347, 30.678178],
        [104.071852, 30.678275],
        [104.071846, 30.678276],
        [104.071641, 30.678289],
        [104.071029, 30.678416],
        [104.070603, 30.678614],
        [104.070084, 30.678976],
        [104.069032, 30.679912],
        [104.068619, 30.680195],
        [104.068122, 30.68045],
        [104.067396, 30.680677],
        [104.066373, 30.68093],
        [104.065647, 30.681213],
        [104.065064, 30.68151],
        [104.064211, 30.682034],
        [104.063815, 30.68223],
        [104.063694, 30.68229],
        [104.063097, 30.682463],
        [104.062896, 30.68214],
        [104.062813, 30.681975],
        [104.062765, 30.681877],
        [104.062694, 30.681777],
        [104.062478, 30.681503],
        [104.062446, 30.681451],
        [104.062422, 30.68141],
        [104.062372, 30.681279],
        [104.062348, 30.681168],
        [104.062303, 30.680799],
        [104.062239, 30.680529],
        [104.062063, 30.680009],
        [104.06181, 30.679057],
        [104.061674, 30.678692],
        [104.061487, 30.678347],
        [104.061344, 30.67821],
        [104.061183, 30.678113],
        [104.060991, 30.678064],
        [104.060825, 30.678056],
        [104.060106, 30.678172],
        [104.059976, 30.67818],
        [104.059644, 30.678177],
        [104.059468, 30.678199],
        [104.058586, 30.678354],
        [104.058454, 30.678348],
        [104.05802, 30.678438],
      ],
      [
        [104.056195, 30.681016],
        [104.055568, 30.6809],
        [104.055589, 30.680697],
        [104.056389, 30.679401],
        [104.056887, 30.679581],
        [104.057804, 30.679927],
        [104.058974, 30.680466],
        [104.058893, 30.680614],
        [104.058788, 30.6808],
        [104.058507, 30.681297],
        [104.058378, 30.681813],
        [104.058219, 30.681778],
        [104.057231, 30.68156],
        [104.056592, 30.681343],
        [104.05625, 30.681062],
        [104.056195, 30.681016],
      ],
    ],
  ],
});
function logout() {
  store.dispatch("logout")
  //TODO 清除登录信息
  router.push("/login");
}
const tableData_fuqin = [
  { name: "刘志波", year: "男", age: "44", tel: "13551024402", type: "正编" },
  { name: "蔡军", year: "男", age: "53", tel: "13880118856", type: "正编" },
  { name: "吴欣", year: "男", age: "55", tel: "13541199350", type: "正编" },
  { name: "李军", year: "男", age: "56", tel: "13608225128", type: "正编" },
  { name: "刘金睿", year: "男", age: "24", tel: "19802835286", type: "正编" },
  { name: "张萍", year: "女", age: "54", tel: "13688193601", type: "正编" },
  {
    name: "邵富荣",
    year: "男",
    age: "59",
    tel: "13668224083",
    type: "自聘队员",
  },
  {
    name: "梁季蜀",
    year: "男",
    age: "59",
    tel: "13547929455",
    type: "自聘队员",
  },
  {
    name: "曾  伟",
    year: "男",
    age: "59",
    tel: "18030578371",
    type: "自聘队员",
  },
  {
    name: "王仲祥",
    year: "男",
    age: "59",
    tel: "15390055745",
    type: "自聘队员",
  },
  {
    name: "许光荣",
    year: "男",
    age: "59",
    tel: "13550010650",
    type: "自聘队员",
  },
  {
    name: "何文平",
    year: "男",
    age: "50",
    tel: "19141926073",
    type: "自聘队员",
  },
  {
    name: "付治华",
    year: "男",
    age: "36",
    tel: "15828517891",
    type: "自聘队员",
  },
  {
    name: "潘成光",
    year: "男",
    age: "54",
    tel: "13398196058",
    type: "自聘队员",
  },
  {
    name: "何新国",
    year: "男",
    age: "51",
    tel: "13208183409",
    type: "自聘队员",
  },
  {
    name: "黄  富",
    year: "男",
    age: "54",
    tel: "13438876928",
    type: "自聘队员",
  },
  {
    name: "姜龙虎",
    year: "男",
    age: "36",
    tel: "13568870884",
    type: "自聘队员",
  },
  {
    name: "曾玉林",
    year: "男",
    age: "55",
    tel: "18280252049",
    type: "自聘队员",
  },
  {
    name: "鄢志强",
    year: "男",
    age: "56",
    tel: "13541151764",
    type: "自聘队员",
  },
  {
    name: "唐世春",
    year: "男",
    age: "39",
    tel: "13308005273",
    type: "自聘队员",
  },
  {
    name: "李德春",
    year: "男",
    age: "41",
    tel: "13678115000",
    type: "自聘队员",
  },
  {
    name: "周飞跃",
    year: "男",
    age: "53",
    tel: "13881900470",
    type: "自聘队员",
  },
  {
    name: "唐  丽",
    year: "女",
    age: "43",
    tel: "15828605263",
    type: "自聘队员",
  },
  {
    name: "唐  静",
    year: "女",
    age: "40",
    tel: "13882270920",
    type: "自聘队员",
  },
  {
    name: "郭  鲁",
    year: "男",
    age: "49",
    tel: "18048560565",
    type: "自聘队员",
  },
  {
    name: "陈  波",
    year: "男",
    age: "44",
    tel: "13880530978",
    type: "自聘队员",
  },
  {
    name: "李燕红",
    year: "女",
    age: "36",
    tel: "18980899525",
    type: "自聘队员",
  },
  {
    name: "李庆锐",
    year: "男",
    age: "38",
    tel: "13540365610",
    type: "自聘队员",
  },
  {
    name: "吴晓清",
    year: "女",
    age: "50",
    tel: "13551288511",
    type: "自聘队员",
  },
  {
    name: "陈本前",
    year: "男",
    age: "44",
    tel: "18380451073",
    type: "服务外包队员",
  },
  {
    name: "龙友均",
    year: "男",
    age: "49",
    tel: "19802835281",
    type: "服务外包队员",
  },
  {
    name: "李  胜",
    year: "男",
    age: "54",
    tel: "15884448631",
    type: "服务外包队员",
  },
  {
    name: "陈理义",
    year: "男",
    age: "51",
    tel: "13541280415",
    type: "服务外包队员",
  },
  {
    name: "张杨伟",
    year: "男",
    age: "46",
    tel: "13730884866",
    type: "服务外包队员",
  },
  {
    name: "苏代国",
    year: "男",
    age: "56",
    tel: "13668178095",
    type: "服务外包队员",
  },
  {
    name: "李  恒",
    year: "男",
    age: "50",
    tel: "18781922977",
    type: "服务外包队员",
  },
  {
    name: "蒋明华",
    year: "男",
    age: "57",
    tel: "15884410447",
    type: "服务外包队员",
  },
  {
    name: "叶乃棋",
    year: "男",
    age: "52",
    tel: "13980853418",
    type: "服务外包队员",
  },
  {
    name: "黄  明",
    year: "男",
    age: "53",
    tel: "13668229733",
    type: "服务外包队员",
  },
  {
    name: "周  杰",
    year: "男",
    age: "29",
    tel: "15882471523",
    type: "服务外包队员",
  },
  {
    name: "林  飞",
    year: "男",
    age: "40",
    tel: "17716469640",
    type: "服务外包队员",
  },
  {
    name: "陈  勇",
    year: "男",
    age: "49",
    tel: "13880150372",
    type: "服务外包队员",
  },
  {
    name: "黄洪明",
    year: "男",
    age: "52",
    tel: "15008467034",
    type: "服务外包队员",
  },
  {
    name: "余  强",
    year: "男",
    age: "45",
    tel: "13881852813",
    type: "服务外包队员",
  },
  {
    name: "谭友前",
    year: "男",
    age: "57",
    tel: "15208398842",
    type: "服务外包队员",
  },
  {
    name: "潘富金",
    year: "男",
    age: "46",
    tel: "18383326788",
    type: "服务外包队员",
  },
  {
    name: "李明远",
    year: "男",
    age: "59",
    tel: "18280337577",
    type: "服务外包队员",
  },
  {
    name: "唐建兵",
    year: "男",
    age: "47",
    tel: "13980446421",
    type: "服务外包队员",
  },
  {
    name: "徐尚军",
    year: "男",
    age: "49",
    tel: "13008109542",
    type: "服务外包队员",
  },
  {
    name: "曾祥伯",
    year: "男",
    age: "54",
    tel: "15811856198",
    type: "服务外包队员",
  },
  {
    name: "张树根",
    year: "男",
    age: "53",
    tel: "18349309746",
    type: "服务外包队员",
  },
  {
    name: "刘福源",
    year: "男",
    age: "52",
    tel: "15982863562",
    type: "服务外包队员",
  },
  {
    name: "王世忠",
    year: "男",
    age: "57",
    tel: "15882265927",
    type: "服务外包队员",
  },
  {
    name: "况立均",
    year: "男",
    age: "56",
    tel: "15086912790",
    type: "服务外包队员",
  },
  {
    name: "代前荣",
    year: "男",
    age: "47",
    tel: "18780225958",
    type: "服务外包队员",
  },
  {
    name: "唐建良",
    year: "男",
    age: "42",
    tel: "15208421467",
    type: "服务外包队员",
  },
  {
    name: "康文强",
    year: "男",
    age: "34",
    tel: "15982008808",
    type: "服务外包队员",
  },
  {
    name: "代春林",
    year: "男",
    age: "33",
    tel: "13056679120",
    type: "服务外包队员",
  },
  {
    name: "王昭毅",
    year: "男",
    age: "29",
    tel: "13568897545",
    type: "服务外包队员",
  },
  {
    name: "肖  荣",
    year: "男",
    age: "58",
    tel: "13881707493",
    type: "服务外包队员",
  },
  {
    name: "周  建",
    year: "男",
    age: "36",
    tel: "19934530838",
    type: "服务外包队员",
  },
  {
    name: "杨茂良",
    year: "男",
    age: "39",
    tel: "15928078901",
    type: "服务外包队员",
  },
  {
    name: "钟盛友",
    year: "男",
    age: "55",
    tel: "18982173025",
    type: "服务外包队员",
  },
  {
    name: "周枭建",
    year: "男",
    age: "25",
    tel: "18512802259",
    type: "服务外包队员",
  },
  {
    name: "胡  磊",
    year: "男",
    age: "35",
    tel: "19102891603",
    type: "服务外包队员",
  },
  {
    name: "李  想",
    year: "男",
    age: "39",
    tel: "15520646333",
    type: "服务外包队员",
  },
  {
    name: "张  上",
    year: "男",
    age: "24",
    tel: "18187079755",
    type: "服务外包队员",
  },
];
const tableData_yingmenkou = [
  { name: "杨萌", male: "女", age: "33", tel: "13550302880", type: "正编" },
  { name: "邹砚宇", male: "男", age: "31", tel: "18180988625", type: "正编" },
  { name: "王权", male: "男", age: "59", tel: "13183868099", type: "正编" },
  { name: "刘俊涛", male: "男", age: "56", tel: "13981833938", type: "正编" },
  { name: "张正祥", male: "男", age: "55", tel: "13808072086", type: "正编" },
  { name: "黄列霞", male: "女", age: "49", tel: "13880619158", type: "正编" },
  { name: "袁力", male: "女", age: "37", tel: "19983160409", type: "正编" },
  { name: "魏军宁", male: "女", age: "45", tel: "13982008918", type: "正编" },
  {
    name: "刘  刚",
    male: "男",
    age: "41",
    tel: "15828153516",
    type: "自聘队员",
  },
  {
    name: "荣道中",
    male: "男",
    age: "57",
    tel: "13558789028",
    type: "自聘队员",
  },
  {
    name: "王张龙",
    male: "男",
    age: "34",
    tel: "13550179773",
    type: "自聘队员",
  },
  {
    name: "杨显峰",
    male: "男",
    age: "52",
    tel: "13018281089",
    type: "自聘队员",
  },
  {
    name: "胥文兵",
    male: "男",
    age: "53",
    tel: "13541285003",
    type: "自聘队员",
  },
  {
    name: "刘国银",
    male: "男",
    age: "53",
    tel: "13540334260",
    type: "自聘队员",
  },
  {
    name: "薛  刚",
    male: "男",
    age: "50",
    tel: "13550087548",
    type: "自聘队员",
  },
  {
    name: "叶开强",
    male: "男",
    age: "56",
    tel: "13308187122",
    type: "自聘队员",
  },
  {
    name: "刘昌旗",
    male: "男",
    age: "51",
    tel: "13666202573",
    type: "自聘队员",
  },
  {
    name: "廖宗云",
    male: "男",
    age: "56",
    tel: "13550328325",
    type: "自聘队员",
  },
  {
    name: "邓  建",
    male: "男",
    age: "55",
    tel: "13980796695",
    type: "自聘队员",
  },
  {
    name: "罗  兵",
    male: "男",
    age: "52",
    tel: "13060008786",
    type: "自聘队员",
  },
  {
    name: "邓  磊",
    male: "男",
    age: "35",
    tel: "13688008113",
    type: "自聘队员",
  },
  {
    name: "陈加中",
    male: "男",
    age: "49",
    tel: "18200590759",
    type: "自聘队员",
  },
  {
    name: "李  进",
    male: "男",
    age: "40",
    tel: "15281094499",
    type: "自聘队员",
  },
  {
    name: "胡禄友",
    male: "男",
    age: "57",
    tel: "15184329957",
    type: "自聘队员",
  },
  {
    name: "任冬玲",
    male: "男",
    age: "37",
    tel: "15982388329",
    type: "自聘队员",
  },
  {
    name: "马  平",
    male: "男",
    age: "55",
    tel: "18215574157",
    type: "自聘队员",
  },
  {
    name: "倪中付",
    male: "男",
    age: "53",
    tel: "13678197075",
    type: "自聘队员",
  },
  {
    name: "韩明宗",
    male: "男",
    age: "48",
    tel: "15102845077",
    type: "自聘队员",
  },
  {
    name: "李世洁",
    male: "男",
    age: "51",
    tel: "13880144672",
    type: "自聘队员",
  },
  {
    name: "刘敏贵",
    male: "男",
    age: "47",
    tel: "13458512915",
    type: "自聘队员",
  },
  {
    name: "王  勇",
    male: "男",
    age: "49",
    tel: "13880248012",
    type: "自聘队员",
  },
  {
    name: "李  强",
    male: "男",
    age: "48",
    tel: "13980633318",
    type: "自聘队员",
  },
  {
    name: "林  勇",
    male: "男",
    age: "45",
    tel: "13550256463",
    type: "自聘队员",
  },
  {
    name: "包世根",
    male: "男",
    age: "50",
    tel: "13558623856",
    type: "自聘队员",
  },
  {
    name: "黄华德",
    male: "男",
    age: "56",
    tel: "18328636283",
    type: "自聘队员",
  },
  {
    name: "尹  庆",
    male: "男",
    age: "41",
    tel: "13608187140",
    type: "自聘队员",
  },
  {
    name: "周小刚",
    male: "男",
    age: "50",
    tel: "15982277057",
    type: "自聘队员",
  },
  {
    name: "许国安",
    male: "男",
    age: "53",
    tel: "18980015395",
    type: "自聘队员",
  },
  {
    name: "范  冀",
    male: "男",
    age: "47",
    tel: "13550212587",
    type: "自聘队员",
  },
  {
    name: "祝元科",
    male: "男",
    age: "47",
    tel: "15198167947",
    type: "自聘队员",
  },
  {
    name: "倪世勃",
    male: "男",
    age: "51",
    tel: "13908209037",
    type: "自聘队员",
  },
  {
    name: "周植平",
    male: "男",
    age: "49",
    tel: "13551844722",
    type: "自聘队员",
  },
  {
    name: "杨  斌",
    male: "男",
    age: "52",
    tel: "13880259515",
    type: "自聘队员",
  },
  {
    name: "陈  翊",
    male: "男",
    age: "35",
    tel: "13880658386",
    type: "自聘队员",
  },
  {
    name: "袁  杰",
    male: "男",
    age: "55",
    tel: "13688315333",
    type: "自聘队员",
  },
  {
    name: "雷  浩",
    male: "男",
    age: "31",
    tel: "15882477636",
    type: "自聘队员",
  },
  {
    name: "唐志兴",
    male: "男",
    age: "51",
    tel: "13551877853",
    type: "自聘队员",
  },
  {
    name: "曾  川",
    male: "男",
    age: "31",
    tel: "13568885248",
    type: "自聘队员",
  },
  {
    name: "张植利",
    male: "男",
    age: "45",
    tel: "13183838110",
    type: "自聘队员",
  },
  {
    name: "雷鸣礼",
    male: "男",
    age: "40",
    tel: "13541193462",
    type: "自聘队员",
  },
  {
    name: "刘  兵",
    male: "男",
    age: "49",
    tel: "18908071926",
    type: "自聘队员",
  },
  {
    name: "吕玉彬",
    male: "男",
    age: "54",
    tel: "13551288201",
    type: "自聘队员",
  },
  {
    name: "廖挚文",
    male: "男",
    age: "35",
    tel: "15756358607",
    type: "自聘队员",
  },
  {
    name: "王丽春",
    male: "女",
    age: "39",
    tel: "13982254574",
    type: "自聘队员",
  },
  {
    name: "曹鸿欧",
    male: "男",
    age: "34",
    tel: "17828104854",
    type: "自聘队员",
  },
  {
    name: "周  俊",
    male: "男",
    age: "45",
    tel: "13548121146",
    type: "自聘队员",
  },
  {
    name: "谭仕鹏",
    male: "男",
    age: "25",
    tel: "14708105545",
    type: "自聘队员",
  },
  {
    name: "彭继军",
    male: "男",
    age: "47",
    tel: "17358578336",
    type: "自聘队员",
  },
  {
    name: "张代勇",
    male: "男",
    age: "41",
    tel: "17323069516",
    type: "自聘队员",
  },
  {
    name: "廖先发",
    male: "男",
    age: "48",
    tel: "13550086787",
    type: "自聘队员",
  },
  {
    name: "刘  健",
    male: "男",
    age: "58",
    tel: "13981798503",
    type: "自聘队员",
  },
  {
    name: "郑远程",
    male: "男",
    age: "29",
    tel: "18111647559",
    type: "自聘队员",
  },
  {
    name: "邓亚林",
    male: "女",
    age: "41",
    tel: "13881983292",
    type: "自聘队员",
  },
  { name: "张胜", male: "男", age: "45", tel: "13881983292", type: "自聘队员" },
  {
    name: "邹军涛",
    male: "男",
    age: "37",
    tel: "13308081149",
    type: "自聘队员",
  },
  {
    name: "陈俊丽",
    male: "女",
    age: "23",
    tel: "19982607518",
    type: "自聘队员",
  },
  {
    name: "鲜小东",
    male: "男",
    age: "45",
    tel: "18215615368",
    type: "自聘队员",
  },
];

const tableData_chadianzi = [
  { name: "陈强", male: "男", age: "37", tel: "15228999234", type: "正编" },
  { name: "徐路竹", male: "男", age: "40", tel: "13678113762", type: "正编" },
  { name: "怒波", male: "男", age: "56", tel: "15196667786", type: "正编" },
  { name: "高伟", male: "男", age: "54", tel: "13684099236", type: "正编" },
  { name: "李永祥", male: "男", age: "55", tel: "13678093917", type: "正编" },
  { name: "周红", male: "女", age: "52", tel: "18782011682", type: "正编" },
  { name: "李琳", male: "女", age: "53", tel: "13547992820", type: "正编" },
  { name: "王兵", male: "男", age: "54", tel: "13982099566", type: "正编" },
  { name: "卜远兵", male: "男", age: "55", tel: "18008061308", type: "正编" },
  { name: "谢  斌", male: "男", age: "54", tel: "13739496358", type: "聘用" },
  { name: "彭文勇", male: "男", age: "49", tel: "18180766896", type: "聘用" },
  { name: "王玉霞", male: "女", age: "46", tel: "13618053591", type: "聘用" },
  { name: "虞锡忠", male: "男", age: "54", tel: "18280128560", type: "聘用" },
  { name: "黄国军", male: "男", age: "45", tel: "13982143493", type: "聘用" },
  { name: "黄世华", male: "男", age: "49", tel: "13696179292", type: "聘用" },
  { name: "陈世雪", male: "男", age: "49", tel: "13708055321", type: "聘用" },
  { name: "吴玉国", male: "男", age: "51", tel: "18708130890", type: "聘用" },
  { name: "江珍建", male: "男", age: "55", tel: "13550173122", type: "聘用" },
  { name: "龙建坤", male: "男", age: "39", tel: "13438036570", type: "聘用" },
  { name: "彭启明", male: "男", age: "53", tel: "18980474491", type: "聘用" },
  { name: "叶尚洪", male: "男", age: "53", tel: "13688089802", type: "聘用" },
  { name: "李  健", male: "男", age: "47", tel: "13628038088", type: "聘用" },
  { name: "周德富", male: "男", age: "51", tel: "18684030025", type: "聘用" },
  { name: "涂  斌", male: "男", age: "54", tel: "13699089398", type: "聘用" },
  { name: "黄  虎", male: "男", age: "44", tel: "13980453334", type: "聘用" },
  { name: "赖晓春", male: "男", age: "47", tel: "13881852390", type: "聘用" },
  { name: "陈健红", male: "男", age: "46", tel: "18008061290", type: "聘用" },
  { name: "吴洪军", male: "男", age: "50", tel: "13408640231", type: "聘用" },
  { name: "郑建国", male: "男", age: "52", tel: "13880433847", type: "聘用" },
  { name: "吴桂清", male: "男", age: "58", tel: "13684044035", type: "聘用" },
  { name: "刘国勇", male: "男", age: "54", tel: "13678094505", type: "聘用" },
  { name: "钟  杨", male: "男", age: "53", tel: "13981777214", type: "聘用" },
  { name: "孙宜云", male: "男", age: "58", tel: "18244247923", type: "聘用" },
  { name: "涂山久", male: "男", age: "58", tel: "15114067120", type: "聘用" },
  { name: "张  健", male: "男", age: "57", tel: "18008061285", type: "聘用" },
  { name: "陈  健", male: "男", age: "52", tel: "15928555928", type: "聘用" },
  { name: "周新建", male: "男", age: "50", tel: "13666181598", type: "聘用" },
  { name: "张东雨", male: "男", age: "51", tel: "18200253827", type: "聘用" },
  { name: "杨  斌", male: "男", age: "51", tel: "13308083226", type: "聘用" },
  { name: "冯宪成", male: "男", age: "44", tel: "13458554348", type: "聘用" },
  { name: "范德培", male: "男", age: "54", tel: "13183894606", type: "聘用" },
  { name: "冯光勇", male: "男", age: "43", tel: "13551339729", type: "聘用" },
  { name: "谢直曦", male: "男", age: "60", tel: "13558861397", type: "聘用" },
  { name: "严继红", male: "男", age: "55", tel: "13668165911", type: "聘用" },
  { name: "康建财", male: "男", age: "50", tel: "13551216468", type: "聘用" },
  { name: "陈  红", male: "女", age: "46", tel: "15208252513", type: "聘用" },
  { name: "周成刚", male: "男", age: "49", tel: "13982258494", type: "聘用" },
  { name: "朱小明", male: "男", age: "54", tel: "15319873424", type: "聘用" },
  { name: "邓家秀", male: "女", age: "35", tel: "15328008233", type: "聘用" },
  { name: "魏平贵", male: "男", age: "45", tel: "13880940977", type: "聘用" },
  { name: "张国强", male: "男", age: "49", tel: "18980960835", type: "聘用" },
  { name: "陈  松", male: "男", age: "48", tel: "13880854135", type: "聘用" },
  { name: " 李向才", male: "男", age: "52", tel: "13350889360", type: "聘用" },
  { name: "许  猛", male: "男", age: "50", tel: "13980492467", type: "聘用" },
  { name: "徐  焰", male: "男", age: "54", tel: "15388137357", type: "聘用" },
  { name: "黄贵冲", male: "男", age: "49", tel: "15982056897", type: "聘用" },
  { name: "康敏忠", male: "男", age: "58", tel: "17708197673", type: "聘用" },
  { name: "刁昌义", male: "男", age: "60", tel: "13881803231", type: "聘用" },
  { name: "周纪刚", male: "男", age: "55", tel: "13981984204", type: "聘用" },
  { name: "曾  建", male: "男", age: "36", tel: "15884432531", type: "聘用" },
  { name: "薛敬阳", male: "男", age: "56", tel: "13981710870", type: "聘用" },
  { name: "李图兵", male: "男", age: "56", tel: "18008061295", type: "聘用" },
  { name: "周仕礼", male: "男", age: "59", tel: "13881997374", type: "聘用" },
  { name: "陶祖培", male: "男", age: "54", tel: "13882018199", type: "聘用" },
  { name: "方开君", male: "男", age: "52", tel: "17708197685", type: "聘用" },
  { name: "王  成", male: "男", age: "45", tel: "13980026320", type: "聘用" },
  { name: "曾道海", male: "男", age: "53", tel: "13678189331", type: "聘用" },
  { name: "方书恒", male: "男", age: "58", tel: "13208110341", type: "聘用" },
  { name: "唐  平", male: "男", age: "52", tel: "13689091703", type: "聘用" },
  { name: "杨  东", male: "男", age: "53", tel: "13708005116", type: "聘用" },
  { name: "邓  奇", male: "男", age: "51", tel: "15208272318", type: "聘用" },
  { name: "周应勋", male: "男", age: "59", tel: "13281188857", type: "聘用" },
  { name: "张  斌", male: "男", age: "47", tel: "13550085170", type: "聘用" },
  { name: "李春云", male: "男", age: "52", tel: "13683416618", type: "聘用" },
  { name: "熊志明", male: "男", age: "58", tel: "17708197675", type: "聘用" },
  { name: "彭忠贵", male: "男", age: "54", tel: "18781923058", type: "聘用" },
  { name: "赖盛吉", male: "男", age: "50", tel: "13088010336", type: "聘用" },
  { name: "杨小兵", male: "男", age: "55", tel: "18081060786", type: "聘用" },
  { name: "周  波", male: "男", age: "51", tel: "13558823045", type: "聘用" },
  { name: "吉方志", male: "男", age: "52", tel: "13550275970", type: "聘用" },
  { name: "王洪林", male: "男", age: "46", tel: "13982133585", type: "聘用" },
  { name: "邓道洪", male: "男", age: "54", tel: "13558636787", type: "聘用" },
  { name: "陈明清", male: "男", age: "57", tel: "15196666420", type: "聘用" },
  { name: "曾红梅", male: "女", age: "48", tel: "15884427411", type: "聘用" },
  { name: "窦  智", male: "男", age: "28", tel: "13348884698", type: "聘用" },
  { name: "蒋  勇", male: "男", age: "45", tel: "18160023227", type: "聘用" },
  { name: "陈为民", male: "男", age: "40", tel: "18190992910", type: "聘用" },
  { name: "刘  勇", male: "男", age: "51", tel: "18080133676", type: "聘用" },
  { name: "晋  伟", male: "男", age: "51", tel: "13880305079", type: "聘用" },
  { name: "谢婷婷", male: "女", age: "27", tel: "15882024529", type: "聘用" },
  { name: "黄林志", male: "男", age: "35", tel: "13540207064", type: "聘用" },
  { name: "唐龙琼", male: "女", age: "48", tel: "18190755230", type: "聘用" },
  { name: "陈 磊", male: "男", age: "37", tel: "13402808476", type: "聘用" },
  { name: "钟丽娟", male: "女", age: "38", tel: "13880169685", type: "聘用" },
  { name: "汪华英", male: "女", age: "40", tel: "13679039991", type: "聘用" },
  { name: "杨平", male: "男", age: "32", tel: "17306530636", type: "聘用" },
  { name: "陈伟", male: "男", age: "48", tel: "18123378878", type: "聘用" },
  { name: "尹鹏", male: "男", age: "33", tel: "15228905558", type: "聘用" },
  { name: "何东华", male: "女", age: "48", tel: "13438292736", type: "聘用" },
  { name: "米春红", male: "女", age: "45", tel: "13880932551", type: "聘用" },
  { name: "刘艳梅", male: "女", age: "36", tel: "18628032266", type: "聘用" },
  { name: "张国宁", male: "男", age: "46", tel: "13540673720", type: "聘用" },
  { name: "向松", male: "男", age: "39", tel: "18010525515", type: "聘用" },
  { name: "廖珂艺", male: "女", age: "32", tel: "13982198051", type: "聘用" },
  { name: "王昕", male: "女", age: "29", tel: "15002863221", type: "聘用" },
];
const tableData_fenghuangshan = [
  { name: "彭茂", male: "男", age: "43", tel: "13880374236", type: "正编" },
  { name: "赵樱惠", male: "女", age: "32", tel: "15378206243", type: "正编" },
  { name: "刘立", male: "男", age: "51", tel: "13980050320", type: "正编" },
  { name: "唐天泽", male: "男", age: "52", tel: "15884402977", type: "正编" },
  { name: "谢洁", male: "女", age: "41", tel: "13518186982", type: "聘用" },
];
const tableData_hehuachi = [
  { name: "李丹", male: "女", age: "37", tel: "15928086810", type: "正编" },
  { name: "王全西", male: "女", age: "53", tel: "13880023630", type: "正编" },
  { name: "薛卫兵", male: "男", age: "55", tel: "18280492872", type: "正编" },
  { name: "赖莉", male: "女", age: "48", tel: "18628127812", type: "正编" },
  { name: "张翚", male: "男", age: "43", tel: "18681271958", type: "正编" },
  { name: "黄立群", male: "女", age: "50", tel: "18980822103", type: "正编" },
  { name: "吕青川", male: "男", age: "54", tel: "13882057303", type: "正编" },
  { name: "陈治林", male: "男", age: "38", tel: "18328305276", type: "聘用" },
  { name: "邱爽", male: "男", age: "39", tel: "13183861780", type: "聘用" },
  { name: "余翔", male: "男", age: "21", tel: "19980743897", type: "聘用" },
  { name: "胡丹", male: "女", age: "29", tel: "13550275908", type: "聘用" },
  { name: "蒋思雨", male: "女", age: "30", tel: "13438248300", type: "聘用" },
  { name: "宋昱岑", male: "男", age: "29", tel: "18682759367", type: "聘用" },
  { name: "黄明龙", male: "男", age: "34", tel: "13551320419", type: "聘用" },
  { name: "王继彬", male: "男", age: "50", tel: "13881892612", type: "聘用" },
];
const tableData_jinquan = [
  { name: "陈江", male: "男", age: "36", tel: "13518151218", type: "正编" },
  { name: "伍军", male: "男", age: "51", tel: "13709073311", type: "正编" },
  { name: "宁湘蓉", male: "女", age: "54", tel: "18030759080", type: "正编" },
  { name: "汤勇", male: "男", age: "37", tel: "15202845745", type: "正编" },
  { name: "宋敏洁", male: "女", age: "36", tel: "15882034505", type: "正编" },
  { name: "叶新果", male: "男", age: "35", tel: "15884578234", type: "正编" },
  { name: "陈静", male: "女", age: "52", tel: "13980595855", type: "正编" },
  { name: "李英田", male: "男", age: "53", tel: "13882298618", type: "正编" },
  { name: "党斌", male: "男", age: "52", tel: "15108312690", type: "正编" },
  { name: "安韦各", male: "男", age: "55", tel: "13982222539", type: "正编" },
  { name: "周韵", male: "女", age: "38", tel: "18981716330", type: "正编" },
  { name: "陈  俊", male: "女", age: "47", tel: "13086678910", type: "聘用" },
  { name: "曾  超", male: "男", age: "45", tel: "13688332273", type: "聘用" },
  { name: "肖昌勇", male: "男", age: "56", tel: "13882112696", type: "聘用" },
  { name: "王晓红", male: "男", age: "54", tel: "13880975990", type: "聘用" },
  { name: "巫正刚", male: "男", age: "41", tel: "13981705538", type: "聘用" },
  { name: "胡  强", male: "男", age: "56", tel: "15198249322", type: "聘用" },
  { name: "胥文富", male: "男", age: "49", tel: "13541207215", type: "聘用" },
  { name: "谭文胜", male: "男", age: "52", tel: "13982079833", type: "聘用" },
  { name: "刘  晋", male: "男", age: "44", tel: "13458611887", type: "聘用" },
  { name: "胡德兴", male: "男", age: "50", tel: "15902837131", type: "聘用" },
  { name: "卫  刚", male: "男", age: "52", tel: "13518213396", type: "聘用" },
  { name: "陈智明", male: "男", age: "44", tel: "13882097820", type: "聘用" },
  { name: "冯晓建", male: "男", age: "40", tel: "13547809237", type: "聘用" },
  { name: "宋冬英", male: "女", age: "46", tel: "13666156756", type: "聘用" },
  { name: "谢育磊", male: "男", age: "36", tel: "13666235200", type: "聘用" },
  { name: "肖  静", male: "女", age: "39", tel: "15928921157", type: "聘用" },
  { name: "陈伦根", male: "男", age: "59", tel: "13699054035", type: "聘用" },
  { name: "赖胜宇", male: "男", age: "50", tel: "13882017318", type: "聘用" },
  { name: "王青周", male: "男", age: "47", tel: "13880180712", type: "聘用" },
  { name: "杨光军", male: "男", age: "46", tel: "13981700353", type: "聘用" },
  { name: "周先伟", male: "男", age: "51", tel: "13684006778", type: "聘用" },
  { name: "向  明", male: "男", age: "41", tel: "13568806850", type: "聘用" },
  { name: "王  进", male: "男", age: "46", tel: "13880856188", type: "聘用" },
  { name: "何文杰", male: "男", age: "27", tel: "18788962069", type: "聘用" },
  { name: "赖隆富", male: "男", age: "54", tel: "13666197898", type: "聘用" },
  { name: "廖代恒", male: "男", age: "47", tel: "15388300421", type: "聘用" },
  { name: "王旭东", male: "男", age: "51", tel: "13683436289", type: "聘用" },
  { name: "钟育林", male: "男", age: "46", tel: "18982278065", type: "聘用" },
  { name: "向宇", male: "女", age: "37", tel: "13881776144", type: "聘用" },
  { name: "陈海燕", male: "女", age: "42", tel: "13608027336", type: "聘用" },
  { name: "李萍", male: "女", age: "41", tel: "13880275067", type: "聘用" },
  { name: "张曦", male: "女", age: "26", tel: "13880814196", type: "聘用" },
  { name: "王光宽", male: "男", age: "40", tel: "13518204038", type: "聘用" },
  { name: "曾胜全", male: "男", age: "53", tel: "13281267569", type: "聘用" },
  { name: "马黎", male: "男", age: "29", tel: "18081047113", type: "聘用" },
  { name: "陈均", male: "男", age: "41", tel: "15608170808", type: "聘用" },
  { name: "杨科", male: "男", age: "40", tel: "13608086984", type: "聘用" },
  { name: "张永成", male: "男", age: "47", tel: "13183852032", type: "聘用" },
  { name: "李凡", male: "男", age: "32", tel: "15828223197", type: "聘用" },
  { name: "林斌", male: "男", age: "48", tel: "13348825131", type: "聘用" },
  { name: "田亮", male: "男", age: "37", tel: "13980856352", type: "聘用" },
  { name: "王敏", male: "女", age: "49", tel: "13551050402", type: "聘用" },
  { name: "徐小云", male: "男", age: "52", tel: "18980635040", type: "聘用" },
  { name: "刘建", male: "男", age: "46", tel: "13881882081", type: "聘用" },
  { name: "根基头", male: "男", age: "39", tel: "15884429799", type: "聘用" },
  { name: "赵海", male: "男", age: "37", tel: "17318696001", type: "聘用" },
  { name: "程建", male: "男", age: "53", tel: "13540376741", type: "聘用" },
  { name: "叶尚云", male: "男", age: "41", tel: "1362803701", type: "聘用" },
  { name: "宋向东", male: "男", age: "53", tel: "18081978036", type: "聘用" },
  { name: "戴德禹", male: "男", age: "41", tel: "13882060852", type: "聘用" },
  { name: "胡庆刚", male: "男", age: "47", tel: "15308055001", type: "聘用" },
  { name: "冯克葵", male: "男", age: "53", tel: "18982007999", type: "聘用" },
  { name: "罗建华", male: "男", age: "46", tel: "13688318930", type: "聘用" },
  { name: "刘兵", male: "男", age: "55", tel: "13388187440", type: "聘用" },
  { name: "吴昌祥", male: "男", age: "39", tel: "15882108974", type: "聘用" },
  { name: "李小波", male: "男", age: "41", tel: "13551204395", type: "聘用" },
  { name: "王  超", male: "男", age: "37", tel: "18180781860", type: "聘用" },
  { name: "曾秀强", male: "男", age: "44", tel: "13388182751", type: "聘用" },
  { name: "王  飞", male: "男", age: "44", tel: "13689094383", type: "聘用" },
  { name: "叶乃刚", male: "男", age: "35", tel: "18040314600", type: "聘用" },
  { name: "林  江", male: "男", age: "38", tel: "13540081143", type: "聘用" },
  { name: "张  龙", male: "男", age: "43", tel: "18981887439", type: "聘用" },
  { name: "王志忠", male: "男", age: "50", tel: "13518204038", type: "聘用" },
  { name: "叶春跃", male: "男", age: "43", tel: "13568968982", type: "聘用" },
  { name: "邵文", male: "男", age: "49", tel: "18728480568", type: "聘用" },
  { name: "李夏永", male: "男", age: "48", tel: "18240169106", type: "聘用" },
  { name: "龙飞", male: "男", age: "46", tel: "17761220763", type: "聘用" },
  { name: "陈飞", male: "男", age: "41", tel: "13882015741", type: "聘用" },
  { name: "徐登平", male: "男", age: "57", tel: "13072878810", type: "聘用" },
  { name: "马贵林", male: "男", age: "37", tel: "17716164570", type: "聘用" },
  { name: "郭龙", male: "男", age: "54", tel: "13882556325", type: "聘用" },
  { name: "周苹", male: "男", age: "51", tel: "15928094304", type: "聘用" },
  { name: "吴晓飞", male: "男", age: "46", tel: "13882110291", type: "聘用" },
  { name: "王礼均", male: "男", age: "52", tel: "13540495403", type: "聘用" },
  { name: "钟书林", male: "男", age: "52", tel: "15228838700", type: "聘用" },
  { name: "胡建", male: "男", age: "42", tel: "13348899810", type: "聘用" },
  { name: "陈富安", male: "男", age: "50", tel: "13547920581", type: "聘用" },
  { name: "吴波", male: "男", age: "41", tel: "15680803359", type: "聘用" },
  { name: "薛胜军", male: "男", age: "48", tel: "13982196490", type: "聘用" },
  { name: "左先荣", male: "男", age: "45", tel: "13668160868", type: "聘用" },
  { name: "李伟", male: "男", age: "37", tel: "15982116607", type: "聘用" },
  { name: "冯克明", male: "男", age: "52", tel: "13881916306", type: "聘用" },
  { name: "陈俊辉", male: "男", age: "40", tel: "13658062906", type: "聘用" },
  { name: "吕成昆", male: "男", age: "52", tel: "13678139128", type: "聘用" },
  { name: "王清波", male: "男", age: "38", tel: "16602826262", type: "聘用" },
  { name: "樊宇阳", male: "女", age: "34", tel: "18508288110", type: "聘用" },
  { name: "肖世友", male: "男", age: "57", tel: "18190694830", type: "聘用" },
  { name: "肖洪礼", male: "男", age: "37", tel: "15002828629", type: "聘用" },
  { name: "肖旭海", male: "男", age: "31", tel: "15882301282", type: "聘用" },
  { name: " 马贵松", male: "男", age: "37", tel: "13730630860", type: "聘用" },
  { name: "黄铃", male: "男", age: "49", tel: "13608218415", type: "聘用" },
  { name: "钟鑫", male: "男", age: "30", tel: "19983160316", type: "聘用" },
  { name: "陈启行", male: "男", age: "26", tel: "15680733959", type: "聘用" },
  { name: "刘松", male: "男", age: "31", tel: "17340037840", type: "聘用" },
  { name: "熊杰", male: "男", age: "45", tel: "15882392488", type: "聘用" },
  { name: "龙天艳", male: "女", age: "42", tel: "13881753639", type: "聘用" },
  { name: "周祥", male: "男", age: "43", tel: "19890478095", type: "聘用" },
  { name: "刘坤", male: "男", age: "39", tel: "18010581056", type: "聘用" },
  { name: "周茂文", male: "男", age: "34", tel: "15208337044", type: "聘用" },
  { name: "施沅池", male: "男", age: "28", tel: "15881068475", type: "聘用" },
  { name: "周甫", male: "男", age: "44", tel: "13608186193", type: "聘用" },
  { name: "邝乘超", male: "男", age: "35", tel: "13568910004", type: "聘用" },
  { name: "陈龙", male: "男", age: "28", tel: "15828327243", type: "聘用" },
  { name: "叶成云", male: "男", age: "46", tel: "13684073031", type: "聘用" },
  { name: "吴文军", male: "男", age: "44", tel: "13980543334", type: "聘用" },
  { name: "黄杰", male: "男", age: "47", tel: "18161224238", type: "聘用" },
  { name: "赵明", male: "男", age: "25", tel: "13689059424", type: "聘用" },
  { name: "黄凯文", male: "男", age: "28", tel: "18980042862", type: "聘用" },
  { name: "郑涛", male: "男", age: "37", tel: "15708411779", type: "聘用" },
  { name: "罗静波", male: "男", age: "48", tel: "18030516857", type: "聘用" },
  { name: "钟建国", male: "男", age: "54", tel: "13980765966", type: "聘用" },
  { name: "赵千秋", male: "女", age: "22", tel: "13008385368", type: "聘用" },
  { name: "甯玲", male: "女", age: "28", tel: "18781995631", type: "聘用" },
  { name: "陈兴", male: "男", age: "28", tel: "13666196498", type: "聘用" },
  { name: "叶尚春", male: "男", age: "47", tel: "18584096586", type: "聘用" },
  { name: "杨晶晶", male: "女", age: "23", tel: "17778477440", type: "聘用" },
  { name: "詹佳欣", male: "女", age: "21", tel: "13778596205", type: "聘用" },
  { name: "姚锋", male: "男", age: "42", tel: "13982107266", type: "聘用" },
  { name: "卜晓兵", male: "男", age: "37", tel: "13980779007", type: "聘用" },
  { name: "黄俊平", male: "男", age: "41", tel: "13308063660", type: "聘用" },
  { name: "王炳翰", male: "男", age: "24", tel: "13551313847", type: "聘用" },
  { name: "何海洋", male: "男", age: "29", tel: "19183953665", type: "聘用" },
  { name: "余鹏飞", male: "男", age: "23", tel: "19950283584", type: "聘用" },
  { name: "罗茹丹", male: "女", age: "22", tel: "18965842023", type: "聘用" },
  { name: "李印", male: "男", age: "42", tel: "13008127899", type: "聘用" },
];
const tableData_jiulidi = [
  { name: "杨飞", male: "男", age: "34", tel: "15928153897", type: "正编" },
  { name: "万岭", male: "女", age: "36", tel: "18010666525", type: "正编" },
  { name: "曹子建", male: "男", age: "39", tel: "13699471419", type: "正编" },
  { name: "姜佳", male: "女", age: "37", tel: "18683693778", type: "正编" },
  { name: "吴鹃", male: "女", age: "42", tel: "13880708537", type: "正编" },
  { name: "刘沧", male: "男", age: "51", tel: "18008061259", type: "正编" },
  { name: "罗航", male: "男", age: "52", tel: "13981906051", type: "正编" },
  { name: "谢小成", male: "男", age: "44", tel: "18200139712", type: "聘用" },
  { name: "马  峰", male: "男", age: "40", tel: "15198198434", type: "聘用" },
  { name: "邓冬木", male: "男", age: "35", tel: "13880635583", type: "聘用" },
  { name: "梁国兵", male: "男", age: "35", tel: "13618045307", type: "聘用" },
  { name: "王  军", male: "男", age: "46", tel: "15388155336", type: "聘用" },
  { name: "刘玉贵", male: "男", age: "49", tel: "13658019422", type: "聘用" },
  { name: "黄万松", male: "男", age: "51", tel: "13551174247", type: "聘用" },
  { name: "刘攀勇", male: "男", age: "51", tel: "13548103855", type: "聘用" },
  { name: "李永红", male: "男", age: "51", tel: "15196675255", type: "聘用" },
  { name: "陈  勇", male: "男", age: "51", tel: "13699089168", type: "聘用" },
  { name: "代文武", male: "男", age: "52", tel: "18081043380", type: "聘用" },
  { name: "许家成", male: "男", age: "54", tel: "18010551018", type: "聘用" },
  { name: "钟德胜", male: "男", age: "57", tel: "15388262227", type: "聘用" },
  { name: "程  政", male: "男", age: "58", tel: "15882027920", type: "聘用" },
  { name: "张星远", male: "男", age: "59", tel: "13980759500", type: "聘用" },
  { name: "潘仲康", male: "男", age: "48", tel: "15828431238", type: "聘用" },
  { name: "魏锦坤", male: "男", age: "51", tel: "15390037036", type: "聘用" },
  { name: "唐建新", male: "男", age: "56", tel: "13548105197", type: "聘用" },
  { name: "潘远文", male: "男", age: "46", tel: "13980837087", type: "聘用" },
  { name: "李道军", male: "男", age: "40", tel: "15108445225", type: "聘用" },
  { name: "李  淋", male: "男", age: "53", tel: "13551101308", type: "聘用" },
  { name: "张琳伟", male: "男", age: "51", tel: "18328642547", type: "聘用" },
  { name: "樊钧洪", male: "男", age: "53", tel: "13541228698", type: "聘用" },
  { name: "杨道根", male: "男", age: "54", tel: "13608208064", type: "聘用" },
  { name: "马宁", male: "男", age: "47", tel: "18011496228", type: "聘用" },
  { name: "汪国义", male: "男", age: "50", tel: "15828105969", type: "聘用" },
  { name: "余  龙", male: "男", age: "50", tel: "13882059877", type: "聘用" },
  { name: "肖洪斌", male: "男", age: "43", tel: "15008251227", type: "聘用" },
  { name: "姚世洪", male: "男", age: "51", tel: "13881768696", type: "聘用" },
  { name: "彭哲合", male: "男", age: "55", tel: "15828386938", type: "聘用" },
  { name: "彭剑波", male: "男", age: "50", tel: "15884499529", type: "聘用" },
  { name: "张强", male: "男", age: "36", tel: "15882080248", type: "聘用" },
  { name: "孙柯", male: "男", age: "37", tel: "13666289306", type: "聘用" },
  { name: "贺基元", male: "男", age: "50", tel: "13350884059", type: "聘用" },
  { name: "汪强", male: "男", age: "48", tel: "13880110610", type: "聘用" },
  { name: "管建峰", male: "男", age: "49", tel: "13408615288", type: "聘用" },
  { name: "李  浩", male: "男", age: "52", tel: "13980585577", type: "聘用" },
  { name: "黄建平", male: "男", age: "53", tel: "13608061182", type: "聘用" },
  { name: "付育梅", male: "女", age: "47", tel: "13981705228", type: "聘用" },
  { name: "李宗念", male: "女", age: "38", tel: "13541268691", type: "聘用" },
  { name: "邓会琴", male: "女", age: "39", tel: "18980658920", type: "聘用" },
  { name: "吴庭宇", male: "女", age: "25", tel: "19980780221", type: "聘用" },
  { name: "鄢开明", male: "男", age: "59", tel: "13881998691", type: "聘用" },
  { name: "张志荣", male: "男", age: "51", tel: "13540134434", type: "聘用" },
  { name: "曾文彬", male: "男", age: "59", tel: "13518165620", type: "聘用" },
  { name: "吴大元", male: "男", age: "59", tel: "13981723683", type: "聘用" },
  { name: "钟超红", male: "女", age: "49", tel: "13688353921", type: "聘用" },
];
const tableData_simaqiao = [
  { name: "陈虎", male: "男", age: "32", tel: "18328732219", type: "正编" },
  { name: "杨子江", male: "男", age: "53", tel: "18008061163", type: "正编" },
  { name: "蒋涛", male: "女", age: "51", tel: "18008061260", type: "正编" },
  { name: "高军", male: "男", age: "39", tel: "18081190150", type: "正编" },
  { name: "康娜", male: "女", age: "35", tel: "13668165431", type: "正编" },
  { name: "李红武", male: "男", age: "52", tel: "18081975884", type: "正编" },
  { name: "曾志军", male: "男", age: "51", tel: "13551059261", type: "聘用" },
  { name: "胡太友", male: "男", age: "54", tel: "13540115797", type: "聘用" },
  { name: "李玉萍", male: "女", age: "48", tel: "13540449505", type: "聘用" },
  { name: "雷克火", male: "男", age: "56", tel: "13281167291", type: "聘用" },
  { name: "彭  伟", male: "男", age: "50", tel: "18982231845", type: "聘用" },
  { name: "李建明", male: "男", age: "58", tel: "13550137648", type: "聘用" },
  { name: "刘志强", male: "男", age: "47", tel: "18008061175", type: "聘用" },
  { name: "廖凤明", male: "男", age: "57", tel: "13981985783", type: "聘用" },
  { name: "帅  羽", male: "男", age: "41", tel: "15828347423", type: "聘用" },
  { name: "谭凤玲", male: "女", age: "49", tel: "13678150516", type: "聘用" },
  { name: "熊家宁", male: "女", age: "49", tel: "13678158687", type: "聘用" },
  { name: "黄天玲", male: "男", age: "59", tel: "13558702009", type: "聘用" },
  { name: "王  勇", male: "男", age: "59", tel: "13551108326", type: "聘用" },
  { name: "刁保权", male: "男", age: "50", tel: "15882106235", type: "聘用" },
  { name: "寇孝明", male: "男", age: "59", tel: "13683472571", type: "聘用" },
  { name: "王万成", male: "男", age: "59", tel: "13541139512", type: "聘用" },
  { name: "李双全", male: "男", age: "59", tel: "13541361181", type: "聘用" },
  { name: "鲁  宽", male: "男", age: "40", tel: "13518182093", type: "聘用" },
  { name: "毛承党", male: "男", age: "49", tel: "15002899117", type: "聘用" },
  { name: "曾德凯", male: "男", age: "59", tel: "13666117519", type: "聘用" },
  { name: "邝平中", male: "男", age: "55", tel: "18008079861", type: "聘用" },
  { name: "宣然良", male: "男", age: "50", tel: "13540375755", type: "聘用" },
  { name: "张福全", male: "男", age: "47", tel: "13658010249", type: "聘用" },
  { name: "徐以辉", male: "男", age: "54", tel: "13668244694", type: "聘用" },
  { name: "吴明江", male: "男", age: "51", tel: "13880357349", type: "聘用" },
  { name: "刘剑旭", male: "男", age: "59", tel: "13281121400", type: "聘用" },
  { name: "谢礼明", male: "男", age: "57", tel: "13648073854", type: "聘用" },
  { name: "吴  涛", male: "男", age: "49", tel: "13408024591", type: "聘用" },
  { name: "李  斌", male: "男", age: "57", tel: "13688148749", type: "聘用" },
  { name: "孙  智", male: "男", age: "52", tel: "13281800291", type: "聘用" },
  { name: "张新强", male: "男", age: "57", tel: "15828197889", type: "聘用" },
  { name: "杨  兵", male: "男", age: "53", tel: '"13708042174', type: "" },
  { name: '"', male: "聘用", age: "", tel: "", type: "" },
  { name: "李代金", male: "男", age: "54", tel: "13882056514", type: "聘用" },
  { name: "聂  彬", male: "男", age: "58", tel: "13681982970", type: "聘用" },
  { name: "周帮俊", male: "男", age: "50", tel: "13880241560", type: "聘用" },
  { name: "魏学宾", male: "男", age: "55", tel: "13982190960", type: "聘用" },
  { name: "张小英", male: "女", age: "45", tel: "15882000878", type: "聘用" },
  { name: "朱  勇", male: "男", age: "53", tel: "15928911930", type: "聘用" },
  { name: "王琦玮", male: "女", age: "41", tel: "15196677909", type: "聘用" },
  { name: "凌生祥", male: "男", age: "43", tel: "18227656179", type: "聘用" },
  { name: "熊海臣", male: "男", age: "36", tel: "17882301969", type: "聘用" },
  { name: "彭丽佳", male: "女", age: "42", tel: "13688103939", type: "聘用" },
  { name: "郭丽娜", male: "女", age: "40", tel: "13880332983", type: "聘用" },
  { name: "雷秀前", male: "男", age: "51", tel: "17828011210", type: "聘用" },
  { name: "习大勇", male: "男", age: "52", tel: "13540439158", type: "聘用" },
  { name: "蒋泽忠", male: "男", age: "52", tel: "13688103221", type: "聘用" },
  { name: "刘  扬", male: "男", age: "50", tel: "13348882812", type: "聘用" },
  { name: "郭俊辉", male: "男", age: "51", tel: "18980957418", type: "聘用" },
  { name: "李健", male: "男", age: "51", tel: "17612899038", type: "聘用" },
  { name: "杨希", male: "男", age: "35", tel: "13982117932", type: "聘用" },
  { name: "钟云春", male: "男", age: "30", tel: "13882127183", type: "聘用" },
  { name: "吴正勇", male: "男", age: "52", tel: "13618074651", type: "聘用" },
  { name: "徐鸿章", male: "男", age: "46", tel: "13980649938", type: "聘用" },
  { name: "詹福周", male: "男", age: "55", tel: "18008034595", type: "聘用" },
  { name: "陶军臣", male: "男", age: "38", tel: "15928034808", type: "聘用" },
  { name: "樊继成", male: "男", age: "48", tel: "18280192873", type: "聘用" },
  { name: "文华", male: "男", age: "43", tel: "18780021372", type: "聘用" },
  { name: "袁润琪", male: "男", age: "25", tel: "15928176985", type: "聘用" },
  { name: "陈善兴", male: "男", age: "39", tel: "19908115298", type: "聘用" },
  { name: "吴朋刚", male: "男", age: "34", tel: "18217773741", type: "聘用" },
  { name: "陈刚", male: "男", age: "37", tel: "18982197121", type: "聘用" },
  { name: "刘卓悦", male: "女", age: "23", tel: "13438813808", type: "聘用" },
  { name: "潘恒棋", male: "男", age: "38", tel: "13540242009", type: "聘用" },
  { name: "刘建", male: "男", age: "51", tel: "18200466986", type: "聘用" },
  { name: "杜强", male: "男", age: "48", tel: "13096376019", type: "聘用" },
  { name: "王倩玲", male: "女", age: "30", tel: "15928809470", type: "聘用" },
  { name: "钟世栋", male: "男", age: "45", tel: "13618057169", type: "聘用" },
  { name: "张宇琪", male: "女", age: "38", tel: "18190691360", type: "聘用" },
];
const tableData_shaheyuan = [
  { name: "罗德利", male: "男", age: "32", tel: "15208211434", type: "正编" },
  { name: "张媛", male: "女", age: "30", tel: "18883870124", type: "正编" },
  { name: "曹友谊", male: "男", age: "41", tel: "13881920178", type: "正编" },
  { name: "陈俊华", male: "男", age: "38", tel: "13541236158", type: "正编" },
  { name: "吴金武", male: "男", age: "49", tel: "13708187887", type: "正编" },
  { name: "陈强", male: "男", age: "43", tel: "13628048566", type: "聘用" },
  { name: "冯艳", male: "女", age: "39", tel: "13348898520", type: "聘用" },
  { name: "张瑞", male: "女", age: "36", tel: "13558899525", type: "聘用" },
  { name: "雍悦", male: "女", age: "24", tel: "17738781757", type: "聘用" },
  { name: "徐燕群", male: "女", age: "21", tel: "15828023770", type: "聘用" },
  { name: "侯黎", male: "男", age: "31", tel: "15828523692", type: "聘用" },
  { name: "孙诗国", male: "男", age: "21", tel: "19160072519", type: "聘用" },
  { name: "谢小可", male: "男", age: "40", tel: "13551087927", type: "聘用" },
  { name: "丁方成", male: "男", age: "39", tel: "15982898662", type: "聘用" },
  { name: "姚世明", male: "男", age: "50", tel: "13880841622", type: "聘用" },
  { name: "邓寿根", male: "男", age: "47", tel: "15308060298", type: "聘用" },
  { name: "赵素根", male: "男", age: "52", tel: "13550288565", type: "聘用" },
  { name: "李恩涛", male: "男", age: "52", tel: "13881905305", type: "聘用" },
  { name: "何潮勇", male: "男", age: "53", tel: "18981717818", type: "聘用" },
  { name: "徐德厚", male: "男", age: "53", tel: "13540108041", type: "聘用" },
  { name: "鄢安华", male: "男", age: "58", tel: "13208186679", type: "聘用" },
  { name: "林勇", male: "男", age: "42", tel: "13880198959", type: "聘用" },
  { name: "邓昌旭", male: "男", age: "55", tel: "13541188079", type: "聘用" },
  { name: "郑伟", male: "男", age: "34", tel: "18980967286", type: "聘用" },
  { name: "魏洪春", male: "男", age: "41", tel: "15008238894", type: "聘用" },
  { name: "李恩剑", male: "男", age: "56", tel: "15828047718", type: "聘用" },
  { name: "何立军", male: "男", age: "52", tel: "15208130490", type: "聘用" },
  { name: "赵志和", male: "男", age: "50", tel: "13550390788", type: "聘用" },
  { name: "钟俊", male: "女", age: "47", tel: "13550002638", type: "聘用" },
  { name: "陈邦林", male: "男", age: "56", tel: "13980060745", type: "聘用" },
  { name: "幸兆祥", male: "男", age: "57", tel: "13551198060", type: "聘用" },
  { name: "李清林", male: "男", age: "36", tel: "13980507276", type: "聘用" },
  { name: "刘五斌", male: "男", age: "51", tel: "13982185540", type: "聘用" },
  { name: "金广银", male: "男", age: "50", tel: "13548131353", type: "聘用" },
  { name: "李  俊", male: "男", age: "45", tel: "13678138827", type: "聘用" },
  { name: "何万超", male: "男", age: "35", tel: "15521527406", type: "聘用" },
  { name: "李云东", male: "男", age: "48", tel: "15882258065", type: "聘用" },
  { name: "邹元林", male: "男", age: "40", tel: "15228862826", type: "聘用" },
  { name: "陈生明", male: "男", age: "47", tel: "13880349349", type: "聘用" },
  { name: "叶  青", male: "男", age: "33", tel: "17612872167", type: "聘用" },
  { name: "沈传登", male: "男", age: "57", tel: "13540269870", type: "聘用" },
  { name: "陈奇峰", male: "男", age: "40", tel: "13882261660", type: "聘用" },
  { name: "张育齐", male: "男", age: "23", tel: "15328955633", type: "聘用" },
  { name: "游承凯", male: "男", age: "38", tel: "19182244190", type: "聘用" },
  { name: "王  柯", male: "男", age: "34", tel: "13880300741", type: "聘用" },
  { name: "金广银", male: "男", age: "50", tel: "13548131353", type: "聘用" },
  { name: "向仲琦", male: "男", age: "50", tel: "15908173045", type: "聘用" },
  { name: "罗亮", male: "男", age: "27", tel: "18708492906", type: "聘用" },
  { name: "董良", male: "男", age: "33", tel: "18338699758", type: "聘用" },
  { name: "冯明筒", male: "男", age: "50", tel: "18980607227", type: "聘用" },
  { name: "李国平", male: "男", age: "21", tel: "18282737637", type: "聘用" },
  { name: "何世林", male: "男", age: "32", tel: "15882068757", type: "聘用" },
  { name: "杨晓辉", male: "男", age: "48", tel: "13666117835", type: "聘用" },
  { name: "刘  贵", male: "男", age: "45", tel: "18780151239", type: "聘用" },
  { name: "杨维海", male: "男", age: "47", tel: "15388111898", type: "聘用" },
  { name: "杨洪安", male: "男", age: "50", tel: "19938213669", type: "聘用" },
  { name: "吴 浪", male: "男", age: "30", tel: "15982208371", type: "聘用" },
  { name: "冯克成", male: "男", age: "50", tel: "13548023107", type: "聘用" },
  { name: "钟  伟", male: "男", age: "49", tel: "15928809263", type: "聘用" },
  { name: "兰小琼", male: "女", age: "46", tel: "15981079807", type: "聘用" },
  { name: "严俊英", male: "女", age: "46", tel: "15981079807", type: "聘用" },
  { name: "刘  勇", male: "男", age: "46", tel: "19949490819", type: "聘用" },
  { name: "李小洪", male: "男", age: "19", tel: "19136145709", type: "聘用" },
  { name: "熊  立", male: "男", age: "22", tel: "17628051408", type: "聘用" },
  { name: "赵俊龙", male: "男", age: "18", tel: "18190955868", type: "聘用" },
  { name: "李君杰", male: "男", age: "20", tel: "18280068826", type: "聘用" },
  { name: "林文杰", male: "男", age: "22", tel: "19940886671", type: "聘用" },
  { name: "唐焌程", male: "男", age: "22", tel: "17760428103", type: "聘用" },
  { name: "王书帆", male: "男", age: "20", tel: "18328437756", type: "聘用" },
  { name: "韩墨", male: "男", age: "20", tel: "15828945935", type: "聘用" },
  { name: "邱龙辉", male: "男", age: "49", tel: "13427854595", type: "聘用" },
  { name: "金健秋", male: "男", age: "23", tel: "13051510872", type: "聘用" },
  { name: "杨九平", male: "男", age: "23", tel: "13568243199", type: "聘用" },
  { name: "周鑫一", male: "男", age: "29", tel: "13540613241", type: "聘用" },
  { name: "叶乃杰", male: "男", age: "48", tel: "13548048188", type: "聘用" },
  { name: "陈贤锐", male: "男", age: "43", tel: "18215651932", type: "聘用" },
];

const tableData_tianhuizhen = [
  { name: "孙伟", male: "男", age: "57", tel: "13981919221", type: "正编" },
  { name: "李雅", male: "女", age: "50", tel: "13980712952", type: "正编" },
  { name: "左孝志", male: "男", age: "52", tel: "13060009067", type: "正编" },
  { name: "周明辉", male: "男", age: "39", tel: "18981823157", type: "正编" },
  { name: "申慧荣", male: "女", age: "33", tel: "18782477910", type: "正编" },
  { name: "王敏杰", male: "男", age: "32", tel: "18180534425", type: "正编" },
  { name: "雷荣华", male: "男", age: "59", tel: "13880239110", type: "聘用" },
  { name: "陈主章", male: "男", age: "44", tel: "13981908589", type: "聘用" },
  { name: "张治明", male: "男", age: "52", tel: "13547884786", type: "聘用" },
  { name: "范云建", male: "男", age: "47", tel: "13981740956", type: "聘用" },
  { name: "张强", male: "男", age: "41", tel: "13540655103", type: "聘用" },
  { name: "王舸", male: "男", age: "39", tel: "15828499957", type: "聘用" },
  { name: "张魁林", male: "男", age: "49", tel: "13540819748", type: "聘用" },
  { name: "李军", male: "男", age: "52", tel: "13540632494", type: "聘用" },
  { name: "吴勇", male: "男", age: "48", tel: "13408469853", type: "聘用" },
  { name: "范云红", male: "女", age: "49", tel: "13668205205", type: "聘用" },
  { name: "徐明", male: "男", age: "52", tel: "13568891496", type: "聘用" },
  { name: "钟高吉", male: "男", age: "54", tel: "18048583113", type: "聘用" },
  { name: "黄纯军", male: "男", age: "52", tel: "13980970716", type: "聘用" },
  { name: "王德军", male: "男", age: "53", tel: "13548016155", type: "聘用" },
  { name: "冯伟", male: "男", age: "48", tel: "13402877072", type: "聘用" },
  { name: "何伦才", male: "男", age: "49", tel: "13683494477", type: "聘用" },
  { name: "陈进昌", male: "男", age: "41", tel: "18080875400", type: "聘用" },
  { name: "高玉芹", male: "女", age: "43", tel: "13320984585", type: "聘用" },
  { name: "陈宗川", male: "男", age: "54", tel: "13438866775", type: "聘用" },
  { name: "肖凤英", male: "女", age: "49", tel: "13688164575", type: "聘用" },
  { name: "廖小云", male: "女", age: "48", tel: "13540649618", type: "聘用" },
  { name: "吴进辉", male: "男", age: "54", tel: "13688460119", type: "聘用" },
  { name: "陈文镇", male: "男", age: "51", tel: "13678105146", type: "聘用" },
  { name: "朱启军", male: "男", age: "54", tel: "15520443601", type: "聘用" },
  { name: "兰兴明", male: "男", age: "48", tel: "13880694278", type: "聘用" },
  { name: "张旭", male: "男", age: "51", tel: "13548099163", type: "聘用" },
  { name: "秦联合", male: "男", age: "54", tel: "18980475290", type: "聘用" },
  { name: "薛建勋", male: "男", age: "49", tel: "15928108051", type: "聘用" },
  { name: "王铎", male: "男", age: "51", tel: "13980654586", type: "聘用" },
  { name: "杨君", male: "男", age: "42", tel: "15184397364", type: "聘用" },
  { name: "廖亮", male: "男", age: "40", tel: "13438862348", type: "聘用" },
  { name: "彭连新", male: "男", age: "50", tel: "13551278125", type: "聘用" },
  { name: "刘远贵", male: "男", age: "51", tel: "13880185647", type: "聘用" },
  { name: "张强", male: "男", age: "35", tel: "15828368702", type: "聘用" },
  { name: "朱刚", male: "男", age: "50", tel: "13547893446", type: "聘用" },
  { name: "周道义", male: "男", age: "48", tel: "13540724999", type: "聘用" },
  { name: "缪家洪", male: "男", age: "51", tel: "15102811621", type: "聘用" },
  { name: "赖应辉", male: "男", age: "39", tel: "13558896245", type: "聘用" },
  { name: "陈小虎", male: "男", age: "36", tel: "17775577716", type: "聘用" },
  { name: "陈勇", male: "男", age: "50", tel: "13540641624", type: "聘用" },
  { name: "谭仁平", male: "男", age: "57", tel: "13398196586", type: "聘用" },
  { name: "林海", male: "男", age: "55", tel: "13668198153", type: "聘用" },
  { name: "曾庆桃", male: "男", age: "50", tel: "13699032004", type: "聘用" },
  { name: "刘文彬", male: "男", age: "40", tel: "13540380835", type: "聘用" },
  { name: "王青周", male: "男", age: "51", tel: "13551119907", type: "聘用" },
  { name: "谢直刚", male: "男", age: "51", tel: "18161265656", type: "聘用" },
  { name: "陈建", male: "男", age: "50", tel: "15982093018", type: "聘用" },
  { name: "谢会定", male: "男", age: "58", tel: "18180931033", type: "聘用" },
  { name: "邓剑", male: "男", age: "47", tel: "13547993090", type: "聘用" },
  { name: "罗德才", male: "男", age: "54", tel: "13551276571", type: "聘用" },
  { name: "陈贞洪", male: "男", age: "46", tel: "15184461284", type: "聘用" },
  { name: "谢德洪", male: "男", age: "54", tel: "13558741330", type: "聘用" },
  { name: "李宗建", male: "男", age: "51", tel: "13258317188", type: "聘用" },
  { name: "何强", male: "男", age: "32", tel: "18190892562", type: "聘用" },
  { name: "唐良雨", male: "男", age: "30", tel: "13458591483", type: "聘用" },
  { name: "李永华", male: "男", age: "56", tel: "13540666526", type: "聘用" },
  { name: "罗志葵", male: "男", age: "50", tel: "13666284322", type: "聘用" },
  { name: "冯建兵", male: "男", age: "51", tel: "13880304890", type: "聘用" },
  { name: "严勇", male: "男", age: "35", tel: "18728452827", type: "聘用" },
  { name: "刘伟", male: "男", age: "43", tel: "13488939836", type: "聘用" },
  { name: "叶枫", male: "男", age: "51", tel: "13980428922", type: "聘用" },
  { name: "钟坦", male: "男", age: "58", tel: "18382370727", type: "聘用" },
  { name: "林小龙", male: "男", age: "45", tel: "13540254220", type: "聘用" },
  { name: "郑成龙", male: "男", age: "34", tel: "13458515918", type: "聘用" },
  { name: "王继海", male: "男", age: "34", tel: "13540030650", type: "聘用" },
  { name: "魏永星", male: "男", age: "51", tel: "15982271600", type: "聘用" },
  { name: "杨城", male: "男", age: "50", tel: "13880196789", type: "聘用" },
  { name: "王健", male: "男", age: "49", tel: "18010638233", type: "聘用" },
  { name: "周新", male: "男", age: "49", tel: "13551888280", type: "聘用" },
  { name: "冯何玉", male: "女", age: "32", tel: "16602824656", type: "聘用" },
  { name: "陈建", male: "男", age: "49", tel: "13540769436", type: "聘用" },
  { name: "陈曦", male: "男", age: "33", tel: "13699499361", type: "聘用" },
  { name: "马利平", male: "女", age: "45", tel: "13084454414", type: "聘用" },
];
const tableData_wukuaishi = [
  { name: "刘翔虎", male: "男", age: "36", tel: "13541265170", type: "正编" },
  { name: "周长春", male: "女", age: "32", tel: "18008061192", type: "正编" },
  { name: "杨霞", male: "女", age: "50", tel: "13668287880", type: "正编" },
  { name: "赵学宁", male: "男", age: "52", tel: "13608004510", type: "正编" },
  { name: "薛峰", male: "男", age: "51", tel: "13882137866", type: "正编" },
  { name: "张  勇", male: "男", age: "40", tel: "13628058815", type: "临聘" },
  { name: "成  润", male: "男", age: "50", tel: "13558870591", type: "临聘" },
  { name: "曾本艮", male: "男", age: "50", tel: "15388212768", type: "临聘" },
  { name: "解柏成", male: "男", age: "59", tel: "13547810991", type: "临聘" },
  { name: "鄢志红", male: "男", age: "54", tel: "13408614115", type: "临聘" },
  { name: "王进建", male: "男", age: "56", tel: "18980833773", type: "临聘" },
  { name: "何家志", male: "男", age: "47", tel: "13882019165", type: "临聘" },
  { name: "黎宗良", male: "男", age: "58", tel: "15902886878", type: "临聘" },
  { name: "邓  牧", male: "男", age: "57", tel: "13730882528", type: "临聘" },
  { name: "余远富", male: "男", age: "41", tel: "18628030783", type: "临聘" },
  { name: "冯立国", male: "男", age: "43", tel: "15928792590", type: "临聘" },
  { name: "陈明和", male: "男", age: "51", tel: "13540730762", type: "临聘" },
  { name: "林明和", male: "男", age: "58", tel: "13408407694", type: "临聘" },
  { name: "黄  虎", male: "男", age: "48", tel: "13982026353", type: "临聘" },
  { name: "唐  军", male: "男", age: "46", tel: "13880093795", type: "临聘" },
  { name: "陈志强", male: "男", age: "50", tel: "13980903501", type: "临聘" },
  { name: "黄建富", male: "男", age: "47", tel: "18000545075", type: "临聘" },
  { name: "白富强", male: "男", age: "42", tel: "13808012105", type: "临聘" },
  { name: "张成志", male: "男", age: "56", tel: "18054793930", type: "临聘" },
  { name: "李  伟", male: "男", age: "52", tel: "15520715966", type: "临聘" },
  { name: "夏  浩", male: "男", age: "49", tel: "13739463005", type: "临聘" },
  { name: "严仁建", male: "男", age: "52", tel: "13551887946", type: "临聘" },
  { name: "张  星", male: "女", age: "23", tel: "15082722611", type: "临聘" },
  { name: "曹  毅", male: "男", age: "45", tel: "15390078850", type: "临聘" },
  { name: "黄知国", male: "男", age: "47", tel: "13881760538", type: "临聘" },
  { name: "杨珍祥", male: "男", age: "56", tel: "13684045825", type: "临聘" },
  { name: "杨人权", male: "男", age: "58", tel: "13541180502", type: "临聘" },
  { name: "刘玉章", male: "男", age: "59", tel: "13540152680", type: "临聘" },
  { name: "凌长明", male: "男", age: "51", tel: "15378195003", type: "临聘" },
  { name: "夏  军", male: "男", age: "47", tel: "13618053433", type: "临聘" },
  { name: "张从根", male: "男", age: "54", tel: "13608000553", type: "临聘" },
  { name: "向立安", male: "男", age: "56", tel: "13882167073", type: "临聘" },
  { name: "李容太", male: "男", age: "55", tel: "13458506928", type: "临聘" },
  { name: "赵  斌", male: "男", age: "45", tel: "15208465792", type: "临聘" },
  { name: "胡群珍", male: "女", age: "44", tel: "13708239840", type: "临聘" },
  { name: "雷雨", male: "女", age: "36", tel: "13880052034", type: "临聘" },
  { name: "滕勇", male: "男", age: "47", tel: "18030545509", type: "临聘" },
  { name: "程国书", male: "男", age: "41", tel: "13550368300", type: "临聘" },
  { name: "李雨相", male: "女", age: "23", tel: "18383580926", type: "临聘" },
];
const tableData_xianlu = [
  { name: "刘铮", male: "男", age: "50", tel: "13880808696", type: "正编" },
  { name: "张森源", male: "男", age: "38", tel: "15756358281", type: "正编" },
  { name: "马豪", male: "男", age: "53", tel: "13708094496", type: "正编" },
  { name: "乔立新", male: "女", age: "47", tel: "13666237128", type: "正编" },
  { name: "周召生", male: "男", age: "54", tel: "18113136872", type: "正编" },
  { name: "李永江", male: "男", age: "60 ", tel: "13094465706", type: "聘用" },
  { name: "杨云康", male: "男", age: "59 ", tel: "13438189347", type: "聘用" },
  { name: "黄晓北", male: "男", age: "59 ", tel: "13688348093", type: "聘用" },
  { name: "杨彬", male: "男", age: "58 ", tel: "15828612708", type: "聘用" },
  { name: "向小平", male: "男", age: "58 ", tel: "13608071022", type: "聘用" },
  { name: "郑端", male: "女", age: "47 ", tel: "15928426928", type: "聘用" },
  { name: "唐鹏", male: "女", age: "48 ", tel: "13548065992", type: "聘用" },
  { name: "饶清俊", male: "男", age: "56 ", tel: "18080045687", type: "聘用" },
  { name: "邬华刚", male: "男", age: "56 ", tel: "18280252049", type: "聘用" },
  { name: "马金根", male: "男", age: "54 ", tel: "18200296984", type: "聘用" },
  { name: "周光明", male: "男", age: "54 ", tel: "13980987085", type: "聘用" },
  { name: "管仲", male: "男", age: "53 ", tel: "13228190585", type: "聘用" },
  { name: "雷祖祥", male: "男", age: "51 ", tel: "13060096338", type: "聘用" },
  { name: "李胜强", male: "男", age: "51 ", tel: "13550314187", type: "聘用" },
  { name: "乔维林", male: "男", age: "50 ", tel: "15884474875", type: "聘用" },
  { name: "胡益胜", male: "男", age: "50 ", tel: "13551250618", type: "聘用" },
  { name: "屈涛", male: "男", age: "49 ", tel: "15828345161", type: "聘用" },
  { name: "刘勇", male: "男", age: "49 ", tel: "13541350713", type: "聘用" },
  { name: "宋志辉", male: "男", age: "49 ", tel: "15528221659", type: "聘用" },
  { name: "刘平", male: "男", age: "49 ", tel: "13060052256", type: "聘用" },
  { name: "谭景惠", male: "女", age: "39 ", tel: "17882050912", type: "聘用" },
  { name: "任永贵", male: "男", age: "48 ", tel: "15108230302", type: "聘用" },
  { name: "范世波", male: "男", age: "47 ", tel: "15882356686", type: "聘用" },
  { name: "乔维强", male: "男", age: "46 ", tel: "18980769802", type: "聘用" },
  { name: "黄佑斌", male: "男", age: "47 ", tel: "13881767659", type: "聘用" },
  { name: "唐波", male: "男", age: "46 ", tel: "18280118022", type: "聘用" },
  { name: "刘凯", male: "男", age: "46 ", tel: "18981731283", type: "聘用" },
  { name: "张大伟", male: "男", age: "44 ", tel: "18708187511", type: "聘用" },
  { name: "陈剑", male: "男", age: "42 ", tel: "13488977764", type: "聘用" },
  { name: "马端云", male: "男", age: "42 ", tel: "15008475082", type: "聘用" },
  { name: "陈章俊", male: "男", age: "41 ", tel: "15882432586", type: "聘用" },
  { name: "聂阳昆", male: "男", age: "41 ", tel: "18215612569", type: "聘用" },
  { name: "苏俊云", male: "男", age: "41 ", tel: "18349257533", type: "聘用" },
  { name: "刘金燕", male: "女", age: "28 ", tel: "17313002176", type: "聘用" },
  { name: "杨川", male: "男", age: "37 ", tel: "13438283018", type: "聘用" },
  { name: "罗李昆", male: "男", age: "37 ", tel: "18628055343", type: "聘用" },
  { name: "张毅", male: "男", age: "34 ", tel: "17308002789", type: "聘用" },
  { name: "何金辉", male: "男", age: "33 ", tel: "13880802335", type: "聘用" },
  { name: "车光坦", male: "男", age: "33 ", tel: "13880207985", type: "聘用" },
  { name: "戴军", male: "男", age: "30 ", tel: "15881198303", type: "聘用" },
  { name: "李杰", male: "男", age: "26 ", tel: "15756622779", type: "聘用" },
  { name: "蒋水平", male: "男", age: "51 ", tel: "13708091823", type: "聘用" },
  { name: "廖坤友", male: "男", age: "59 ", tel: "13730892967", type: "聘用" },
  { name: "李守勇", male: "男", age: "42 ", tel: "13808013851", type: "聘用" },
  { name: "姜加伟", male: "男", age: "54 ", tel: "15982281703", type: "聘用" },
  { name: "邓联科", male: "男", age: "59 ", tel: "13881831311", type: "聘用" },
  { name: "杨文", male: "男", age: "55 ", tel: "18981951109", type: "聘用" },
  { name: "罗斌", male: "男", age: "56 ", tel: "17311387397", type: "聘用" },
  { name: "谭胜", male: "男", age: "45 ", tel: "18982007418", type: "聘用" },
  { name: "任雪锋", male: "男", age: "39 ", tel: "15182817205", type: "聘用" },
  { name: "姬爱平", male: "男", age: "50 ", tel: "13880276798", type: "聘用" },
  { name: "陈乾勇", male: "男", age: "54 ", tel: "15828253270", type: "聘用" },
  { name: "杨伟", male: "男", age: "40 ", tel: "18328452588", type: "聘用" },
  { name: "王旭", male: "男", age: "51 ", tel: "13628036614", type: "聘用" },
  { name: "金勇", male: "男", age: "55 ", tel: "19983272381", type: "聘用" },
  { name: "陈勇", male: "男", age: "45 ", tel: "13808221951", type: "聘用" },
  { name: "王伟", male: "男", age: "48 ", tel: "13558806780", type: "聘用" },
  { name: "郑宏霞", male: "女", age: "30 ", tel: "15828493181", type: "聘用" },
  { name: "张和兰", male: "女", age: "35 ", tel: "13683433362", type: "聘用" },
  { name: "吴杰", male: "男", age: "33 ", tel: "13881963563", type: "聘用" },
  { name: "徐文波", male: "男", age: "53 ", tel: "13980408207", type: "聘用" },
];
const tableData_xihua = [
  { name: "陈珣然", male: "女", age: "36", tel: "13658034061", type: "正编" },
  { name: "任文钦", male: "男", age: "58", tel: "13668217557", type: "正编" },
  { name: "王锐刚", male: "男", age: "51", tel: "13882283352", type: "正编" },
  { name: "胡晓莉", male: "女", age: "49", tel: "13608008808", type: "正编" },
  { name: "钟建", male: "男", age: "51", tel: "13980995388", type: "正编" },
  { name: "何立辉", male: "男", age: "53", tel: "15828111569", type: "正编" },
  {
    name: "付榆",
    male: "男",
    age: "49",
    tel: "13808219368",
    type: "正编（茶客办）",
  },
  { name: "林安勇", male: "男", age: "49", tel: "13882274237", type: "聘用" },
  { name: "陈西友", male: "男", age: "49", tel: "13880821786", type: "聘用" },
  { name: "查泽贵", male: "男", age: "55", tel: "15108313055", type: "聘用" },
  { name: "梁建洪", male: "男", age: "41", tel: "13880509419", type: "聘用" },
  { name: "蒋忠贵", male: "男", age: "53", tel: "13981913513", type: "聘用" },
  { name: "曾  磊", male: "男", age: "35", tel: "13281174125", type: "聘用" },
  { name: "姚  飞", male: "男", age: "46", tel: "13881980418", type: "聘用" },
  { name: "王甸勇", male: "男", age: "52", tel: "13982073420", type: "聘用" },
  { name: "潘邦英", male: "男", age: "41", tel: "15388169883", type: "聘用" },
  { name: "成  平", male: "男", age: "37", tel: "13408492653", type: "聘用" },
  { name: "王  军", male: "男", age: "50", tel: "13980749068", type: "聘用" },
  { name: "潘安元", male: "男", age: "56", tel: "15928144545", type: "聘用" },
  { name: "陈  均", male: "男", age: "48", tel: "13540277587", type: "聘用" },
  { name: "郭  辉", male: "男", age: "58", tel: "15828377431", type: "聘用" },
  { name: "王成建", male: "男", age: "51", tel: "15982151691", type: "聘用" },
  { name: "吴章富", male: "男", age: "57", tel: "13550303424", type: "聘用" },
  { name: "邹安树", male: "男", age: "59", tel: "17781694785", type: "聘用" },
  { name: "王  波", male: "男", age: "45", tel: "18382374335", type: "聘用" },
  { name: "陈昌华", male: "男", age: "55", tel: "15982894979", type: "聘用" },
  { name: "赵  鑫", male: "男", age: "35", tel: "13880548418", type: "聘用" },
  { name: "胡仲全", male: "男", age: "49", tel: "13688102335", type: "聘用" },
  { name: "郑华兵", male: "男", age: "50", tel: "13540825106", type: "聘用" },
  { name: "叶登峰", male: "男", age: "36", tel: "18284569114", type: "聘用" },
  { name: "周自发", male: "男", age: "50", tel: "13688105034", type: "聘用" },
  { name: "张治兵", male: "男", age: "49", tel: "13408000722", type: "聘用" },
  { name: "钟小云", male: "男", age: "48", tel: "13550283728", type: "聘用" },
  { name: "查泽兴", male: "男", age: "52", tel: "13558791384", type: "聘用" },
  { name: "陈绍建", male: "男", age: "55", tel: "13880401837", type: "聘用" },
  { name: "钟革武", male: "男", age: "53", tel: "13518115662", type: "聘用" },
  { name: "严映志", male: "男", age: "53", tel: "13350849409", type: "聘用" },
  { name: "谢启国", male: "男", age: "53", tel: "18381032538", type: "聘用" },
  { name: "魏开伟", male: "男", age: "53", tel: "13438397628", type: "聘用" },
  { name: "孙成兴", male: "男", age: "52", tel: "13678164814", type: "聘用" },
  { name: "马豫彬", male: "男", age: "53", tel: "15908159092", type: "聘用" },
  { name: "钟华成", male: "男", age: "56", tel: "13551223493", type: "聘用" },
  { name: "钟育勇", male: "男", age: "40", tel: "15328007018", type: "聘用" },
  { name: "粟  陶", male: "男", age: "41", tel: "13550066064", type: "聘用" },
  { name: "尹建军", male: "男", age: "47", tel: "13551097080", type: "聘用" },
  { name: "邓  军", male: "男", age: "33", tel: "15828274455", type: "聘用" },
  { name: "高  彬", male: "男", age: "46", tel: "15108367156", type: "聘用" },
  { name: "何玉平", male: "男", age: "39", tel: "13982030430", type: "聘用" },
  { name: "贾  荣", male: "男", age: "35", tel: "15928957265", type: "聘用" },
  { name: "王  华", male: "男", age: "53", tel: "15882088837", type: "聘用" },
  { name: "王  柯", male: "男", age: "42", tel: "13982038515", type: "聘用" },
  { name: "徐朝东", male: "男", age: "50", tel: "13548003494", type: "聘用" },
  { name: "余  刚", male: "男", age: "45", tel: "13881782220", type: "聘用" },
  { name: "张  丹", male: "男", age: "48", tel: "13668114539", type: "聘用" },
  { name: "张  雷", male: "男", age: "51", tel: "13608002627", type: "聘用" },
  { name: "刘存洪", male: "男", age: "55", tel: "13808040992", type: "聘用" },
  { name: "朱明东", male: "男", age: "51", tel: "13608087465", type: "聘用" },
  { name: "邹  竞", male: "男", age: "53", tel: "13980539741", type: "聘用" },
  { name: "周克棋", male: "男", age: "51", tel: "13558786595", type: "聘用" },
  { name: "李子强", male: "男", age: "54", tel: "13540453915", type: "聘用" },
  { name: "黄文富", male: "男", age: "51", tel: "13882029708", type: "聘用" },
  { name: "范先志", male: "男", age: "51", tel: "13880187945", type: "聘用" },
  { name: "廖建国", male: "男", age: "58", tel: "13558850847", type: "聘用" },
  { name: "王善成", male: "男", age: "52", tel: "15928475827", type: "聘用" },
  { name: "吴道友", male: "男", age: "51", tel: "13547885565", type: "聘用" },
  { name: "李昌贵", male: "男", age: "55", tel: "13688153987", type: "聘用" },
  { name: "奉志强", male: "男", age: "50", tel: "13330943205", type: "聘用" },
  { name: "付方奎", male: "男", age: "39", tel: "15828252665", type: "聘用" },
  { name: "王  黎", male: "女", age: "37", tel: "15828625170", type: "聘用" },
  { name: "都  兵", male: "男", age: "35", tel: "15828271961", type: "聘用" },
  { name: "叶付微", male: "女", age: "36", tel: "15928123348", type: "聘用" },
  { name: "赖云龙", male: "男", age: "53", tel: "13683473692", type: "聘用" },
  { name: "王诗竹", male: "女", age: "32", tel: "15982184686", type: "聘用" },
  { name: "叶显勇", male: "男", age: "50", tel: "15928108058", type: "聘用" },
  { name: "廖  姣", male: "女", age: "28", tel: "13309029565", type: "聘用" },
  { name: "田弟学", male: "男", age: "45", tel: "13438808685", type: "聘用" },
  { name: "白晓冬", male: "男", age: "52", tel: "13880768032", type: "聘用" },
  { name: "吴文辉", male: "男", age: "46", tel: "19915645108", type: "聘用" },
  { name: "徐  聪", male: "男", age: "22", tel: "18782970789", type: "聘用" },
  { name: "马卫茂", male: "男", age: "39", tel: "18783739781", type: "聘用" },
  { name: "冯克骏", male: "男", age: "47", tel: "13688330752", type: "聘用" },
  { name: "张  峥", male: "男", age: "47", tel: "18190688098", type: "聘用" },
  { name: "叶显勇", male: "男", age: "51", tel: "13608183888", type: "聘用" },
  { name: "钟良富", male: "男", age: "44", tel: "15928756692", type: "聘用" },
];
</script>

<style scoped>
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
  font-size: large;
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

.buttonToData {
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
.text-warning {
  margin-left: 20px;
  font-size: large;
  color: #fff;
  line-height: 60px;
  width: 100%;
}

#dotClass {
  width: 25px;
  height: 25px;
  margin-top: 2.2vh;
  background-color: #11e1b0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
#lamp {
  width: 25px;
  height: 25px;
  animation-name: imageAnim;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease;
  animation-play-state: running;
  background-image: radial-gradient(yellow, red);
}

.query-container input[type="text"] {
  width: 100%;
  padding: 10px; 
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.query-container ul {
  list-style: none;
  padding: 0;
}

.query-container li {
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.query-container li:hover {
  background-color: #f0f0f0;
}
.fuzzy_select {
  width: 20vw;
}
</style>
