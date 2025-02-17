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
      <template #warning>
        <div class="text-week">
          <div id="dotClass" title="" @click="fault_details">
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
                EventHistoryList.slice(
                  (warningCurrentPage - 1) * 5,
                  warningCurrentPage * 5
                )
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
                <el-button
                  type="primary"
                  @click="warningSubmitForm(warningRuleFormRef)"
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
            class="buttonToMap"
            plain
            link
            color="fff"
            @click="showClickLog"
            size="large"
            v-show="params.role == '管理员' "
            >点击日志</el-button
          >
          <el-button
            class="buttonToMap"
            plain
            link
            color="fff"
            @click="changePermissonDialog = true"
            size="large"
            v-show="params.role == '管理员'"
            >权限管理</el-button
          >
          <el-button
            class="buttonToMap"
            plain
            link
            color="fff"
            @click="resetPasswordDialog = true"
            size="large"
            v-show="params.role == '管理员'"
            >用户密码重置管理</el-button
          >
          <el-button
            class="buttonToMap"
            plain
            link
            color="fff"
            @click="changePasswordDialog = true"
            size="large"
            >修改个人密码</el-button
          >

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
          <div v-for="dept in depts" :key="dept.deptId">
            <class-item
              class="dept-item"
              @click="switchShowDepts(dept.deptId, dept.deptName)"
              :logo="dept.deptLogo"
              :name="dept.deptName"
              styleName="subsysName"
            >
            </class-item>
            <div :id="`fourTopic-${index}`" :class="`fourTopic-${index}`"></div>
          </div>
        </div>
        <!-- <div class="subsys" v-if="!showDepts">
          <div class="subdepts">{{choosedDeptName}}</div>
        </div> -->
        <div class="subsys" v-if="!showDepts">
          <class-item
            v-for="system in choosedSystems"
            :key="system.systemId"
            @click="show(system.to, system.url)"
            :logo="system.systemLogo"
            :name="system.systemName"
            styleName="subsysName"
          >
          </class-item>
        </div>
        <div class="subsys" v-if="!showDepts">
          <div style="padding-left: 15px; margin-top: 20px">
            <el-icon
              color="#000000"
              size="20px"
              @click="switchShowDepts(-1)"
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
      <!-- <div class="background" v-if="showDepts">
        <img
          id="obj"
          :src="require('@/assets/home/banner-new' + picture + '.jpg')"
          width="10000"
          style="overflow-y: auto; overflow-x: auto"
        />
      </div> -->
      <!-- <el-upload
    class="avatar-uploader"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload> -->
      <!-- <el-upload
    class="avatar-uploader"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload> -->

      <div class="upload">
        <template v-if="params.role == '管理员'">
          <div class="image-title-container">
            <el-upload
              accept="image/jpg,image/jpeg,image/gif,image/png"
              action="uploadUrl"
              class="avatar-uploader"
              :show-file-list="false"
              :default-file-list="defaultFileList"
              :before-upload="createBeforeUpload('banner')"
            >
              <el-tooltip
                content="点击鼠标左键即可更换图片"
                effect="dark"
                placement="top"
              >
                <img
                  v-if="latestImageUrl"
                  :src="latestImageUrl"
                  class="avatar"
                  @click="handleAvatarClick"
                />
                <el-icon
                  v-else
                  class="avatar-uploader-icon"
                  @click="handleAvatarClick"
                >
                  <Plus />
                </el-icon>
              </el-tooltip>
            </el-upload>
          </div>
        </template>
        <template v-else>
          <img
            :src="latestImageUrl"
            style="width: 100%; height: auto"
            class="avatar"
          />
        </template>
        <div class="title-container">
          <h2 class="centered-text">金牛 · 城市 · 管家</h2>
        </div>
        <div class="title-container2">
          <h2 class="centered-text2">
            全民参与&nbsp;&nbsp;精细管理&nbsp;&nbsp;干净有序
          </h2>
        </div>
      </div>
      <!-- <div class="background" v-if="choosedDept === 0">
        <img src="@/assets/home/banner-hjws.png" width="10000" style="overflow-y:auto;overflow-x: auto;">
      </div>
      <div class="background" v-if="choosedDept === 1">
        <img src="@/assets/home/banner-srzx.png" width="10000" style="overflow-y:auto;overflow-x: auto;">
      </div>
      <div class="background" v-if="choosedDept === 2">
        <img src="@/assets/home/banner-jgzm.png" width="10000" style="overflow-y:auto;overflow-x: auto;">
      </div>
      <div class="background" v-if="choosedDept === 3">
        <img src="@/assets/home/banner-szcg.png" width="10000" style="overflow-y:auto;overflow-x: auto;">
      </div>
      <div class="background" v-if="choosedDept === 4">
        <img src="@/assets/home/background-ggzp.jpg" width="10000" style="overflow-y:auto;overflow-x: auto;">
      </div> -->

      <!-- 页面显示区域 -->
      <el-main class="main">
        <div
          class="classification-title"
          v-if="(choosedDept == -1) | (choosedDept == 0)"
        >
          环境卫生
          <!-- <main-info v-for="(item, idx) in choosedSystems" :key="idx" :systemName="item.systemName" :url="item.url"
            :logo="item.systemLogo" :info-list="item.data" :image="item.image" :to="item.to" :deptId="item.deptId">
          </main-info> -->
        </div>
        <div class="description">
          负责市政道路清扫保洁，生活垃圾分类收集、运输及处置，环卫公厕管理，城市环境卫生设施的规划和建设等。
        </div>
        <el-divider v-if="(choosedDept == -1) | (choosedDept == 0)" />

        <template v-for="(item, idx) in choosedSystems">
          <!-- <main-info v-if="item.deptId == 0" :key="idx" :systemName="item.systemName" :url="item.url"
            :logo="item.systemLogo" :info-list="item.data" :image="item.image" :to="item.to" :deptId="item.deptId"
            :isLogin="item.isLogin">
          </main-info> -->
          <!--测试-->
          <el-card
            v-if="item.systemName == '环卫作业运行管家'"
            class="card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
            <!-- <el-image
              class="image"
              :src="require('@/assets/home/img-hwzy2.jpg')"
            >
            </el-image> -->
            <ul v-if="item.url">
              <div class="header">
                <el-button
                  class="el-button-hjws-title"
                  type="text"
                  @click="toSystemHjws(item)"
                  style="margin-top: 10px"
                  >{{ item.systemName }}
                  <div id="warning-hwzy" class="warning-hwzy"></div>
                </el-button>
              </div>
            </ul>
            <div class="header" style="font-size: 20px" v-else>
              <el-button
                class="el-button-null"
                type="text"
                disabled
                plain
                @click="toSystemHjws(item)"
                style="margin-top: 10px"
              >
                {{ item.systemName }}</el-button
              >
            </div>
            <template v-if="params.role == '管理员'">
              <el-upload
                accept="image/jpg,image/jpeg,image/gif,image/png"
                action="uploadUrl"
                class="avatar-uploader"
                :show-file-list="false"
                :default-file-list="defaultFileList"
                :before-upload="createBeforeUpload('hwzy')"
              >
                <el-tooltip
                  content="点击鼠标左键即可更换图片"
                  effect="dark"
                  placement="top"
                >
                  <img
                    v-if="hwzyImageUrl"
                    :src="hwzyImageUrl"
                    class="image"
                    @click="handleAvatarClick"
                  />
                  <el-icon
                    v-else
                    class="avatar-uploader-icon"
                    @click="handleAvatarClick"
                  >
                    <Plus />
                  </el-icon>
                </el-tooltip>
              </el-upload>
            </template>
            <template v-else>
              <img :src="hwzyImageUrl" class="image" />
            </template>

            <div
              class="infoContainer"
              style="background-color: #2775b6; color: white"
            >
              <!-- logo -->
              <!-- <div>
        <el-avatar class="logo-icon" :src="require('@/assets/home/'+logo)" size="large"></el-avatar>
        </div> -->
              <!-- 汇总数据列表 -->
              <div>
                <ul class="infoList">
                  <li v-for="item in item.data" style="font-size: 20px">
                    {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                  </li>
                </ul>

                <el-popover
                  :width="1000"
                  placement="right"
                  effect="dark"
                  trigger="click"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  style="text-align: center"
                >
                  <template #reference>
                    <el-button
                      class="el-button-hjws"
                      link
                      type="text"
                      style="margin-top: 10px; color: #e6e6e6"
                    >
                      查看详情 ></el-button
                    >
                  </template>
                  <template #default>
                    <div
                      class="demo-rich-conent"
                      style="display: flex; gap: 16px; flex-direction: column"
                    >
                      <div>
                        <p
                          class="demo-rich-content__name"
                          style="margin: 0; font-weight: 500; font-size: 25px"
                        >
                          {{ item.systemName }}
                        </p>

                        <div style="display: flex">
                          <dv-border-box6
                            style="
                              font-size: 20px;
                              padding: 10px;
                              margin-top: 0px;
                              width: 100%;
                            "
                          >
                            <div>{{ item.infoKey }}</div>
                            <div style="text-align: center">
                              {{ item.infoVal }}
                            </div>
                          </dv-border-box6>
                        </div>
                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @城市道路信息
                        </p>
                        <el-table
                          :data="cityRoad"
                          stripe
                          style="width: 100%"
                          max-height="500"
                          :header-cell-style="{
                            'font-size': '18px',
                            background: '#303133 !important',
                            color: '#ffffff',
                            border: 'none !important',
                          }"
                          :cell-style="changeCellStyle"
                        >
                          <el-table-column
                            prop="district_name"
                            label="所属区域"
                            width="180"
                          />
                          <el-table-column
                            prop="street_name"
                            label="街道名称"
                            width="280"
                          />
                          <el-table-column
                            prop="road_name"
                            label="道路名称"
                            width="180"
                          />
                          <el-table-column prop="road_type" label="道路类型" />
                        </el-table>
                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @环卫车辆列表
                        </p>
                        <el-table
                          :data="trucksData"
                          stripe
                          style="width: 100%"
                          max-height="500"
                          :header-cell-style="{
                            'font-size': '18px',
                            background: '#303133 !important',
                            color: '#ffffff',
                            border: 'none !important',
                          }"
                          :cell-style="changeCellStyle"
                        >
                          <el-table-column
                            prop="CAR_NAME"
                            label="车牌号"
                            width="180"
                          />
                          <el-table-column
                            prop="CMP_NAME"
                            label="车辆公司"
                            width="280"
                          />
                          <el-table-column
                            prop="TEAM_NAME"
                            label="所属街道"
                            width="180"
                          />
                          <el-table-column
                            prop="DES2"
                            label="车辆类型"
                            width="180"
                          />
                          <el-table-column
                            prop="UPDATE_TIME"
                            label="在线时间"
                          />
                        </el-table>

                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @环卫人员列表
                        </p>
                        <el-table
                          :data="workersData"
                          stripe
                          style="width: 100%"
                          max-height="500"
                          :header-cell-style="{
                            'font-size': '18px',
                            background: '#303133 !important',
                            color: '#ffffff',
                            border: 'none !important',
                          }"
                          :cell-style="changeCellStyle"
                        >
                          <el-table-column
                            prop="worker_name"
                            label="驾驶员姓名"
                            width="180"
                          />
                          <el-table-column
                            prop="worker_mobile"
                            label="手机号"
                            width="280"
                          />
                          <el-table-column
                            prop="worker_type"
                            label="环卫人员类型"
                            width="180"
                          />
                          <el-table-column prop="worker_org" label="所属公司" />
                        </el-table>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </el-card>
          <el-card
            v-if="item.systemName == '垃圾全生命周期管家'"
            class="card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
            <!-- <el-image
              class="image"
              :src="require('@/assets/home/img-cclj2.jpg')"
            >
            </el-image> -->
            <ul v-if="item.url">
              <div class="header">
                <el-button
                  class="el-button-hjws-title"
                  type="text"
                  @click="toSystemHjws(item)"
                  style="margin-top: 10px"
                  >{{ item.systemName }}
                  <div id="warning-ljqsm" class="warning-ljqsm"></div>
                </el-button>
              </div>
            </ul>
            <div class="header" style="font-size: 20px" v-else>
              <el-button
                class="el-button-null"
                type="text"
                disabled
                plain
                @click="toSystemHjws(item)"
                style="margin-top: 10px"
              >
                {{ item.systemName }}</el-button
              >
            </div>
            <template v-if="params.role == '管理员'">
              <el-upload
                accept="image/jpg,image/jpeg,image/gif,image/png"
                action="uploadUrl"
                class="avatar-uploader"
                :show-file-list="false"
                :default-file-list="defaultFileList"
                :before-upload="createBeforeUpload('cclj')"
              >
                <el-tooltip
                  content="点击鼠标左键即可更换图片"
                  effect="dark"
                  placement="top"
                >
                  <img
                    v-if="ccljImageUrl"
                    :src="ccljImageUrl"
                    class="image"
                    @click="handleAvatarClick"
                  />
                  <el-icon
                    v-else
                    class="avatar-uploader-icon"
                    @click="handleAvatarClick"
                  >
                    <Plus />
                  </el-icon>
                </el-tooltip>
              </el-upload>
            </template>
            <template v-else>
              <img :src="ccljImageUrl" class="image" />
            </template>

            <div
              class="infoContainer"
              style="background-color: #2775b6; color: white"
            >
              <!-- logo -->
              <!-- <div>
<el-avatar class="logo-icon" :src="require('@/assets/home/'+logo)" size="large"></el-avatar>
</div> -->
              <!-- 汇总数据列表 -->
              <div>
                <ul class="infoList">
                  <li v-for="item in item.data" style="font-size: 20px">
                    {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                  </li>
                </ul>

                <el-popover
                  :width="1000"
                  placement="top"
                  effect="dark"
                  trigger="click"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  style="text-align: center"
                >
                  <template #reference>
                    <el-button
                      class="el-button-hjws"
                      link
                      type="text"
                      style="margin-top: 10px; color: #e6e6e6"
                    >
                      查看详情 ></el-button
                    >
                  </template>
                  <template #default>
                    <div
                      class="demo-rich-conent"
                      style="display: flex; gap: 16px; flex-direction: column"
                    >
                      <div>
                        <p
                          class="demo-rich-content__name"
                          style="margin: 0; font-weight: 500; font-size: 25px"
                        >
                          {{ item.systemName }}
                        </p>
                        <!-- <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @详情统计
                        </p>
                        <div
                          id="container_cclj"
                          style="width: 1000px; height: 400px"
                        ></div>
                        <div
                          id="container_cclj1"
                          style="width: 1000px; height: 400px"
                        ></div> -->

                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @其他垃圾收运点列表
                        </p>
                        <el-table
                          :data="TrashData"
                          stripe
                          style="width: 100%"
                          max-height="500"
                          :header-cell-style="{
                            'font-size': '18px',
                            background: '#303133 !important',
                            color: '#ffffff',
                            border: 'none !important',
                          }"
                          :cell-style="changeCellStyle"
                        >
                          <el-table-column
                            prop="district"
                            label="所属区域"
                            width="180"
                          />
                          <el-table-column
                            prop="street"
                            label="所属街道"
                            width="280"
                          />
                          <el-table-column
                            prop="house_address"
                            label="详细地址"
                          />
                        </el-table>

                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @果蔬垃圾收运点列表
                        </p>
                        <el-table
                          :data="guoShuData"
                          stripe
                          style="width: 100%"
                          max-height="500"
                          :header-cell-style="{
                            'font-size': '18px',
                            background: '#303133 !important',
                            color: '#ffffff',
                            border: 'none !important',
                          }"
                          :cell-style="changeCellStyle"
                        >
                          <el-table-column
                            prop="district"
                            label="所属区域"
                            width="180"
                          />
                          <el-table-column
                            prop="street"
                            label="所属街道"
                            width="280"
                          />
                          <el-table-column
                            prop="house_address"
                            label="详细地址"
                          />
                        </el-table>

                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @可回收垃圾收运点列表
                        </p>
                        <el-table
                          :data="hardWaresData"
                          stripe
                          style="width: 100%"
                          max-height="500"
                          :header-cell-style="{
                            'font-size': '18px',
                            background: '#303133 !important',
                            color: '#ffffff',
                            border: 'none !important',
                          }"
                          :cell-style="changeCellStyle"
                        >
                          <el-table-column
                            prop="STREET_NAME"
                            label="所属街道"
                            width="180"
                          />
                          <el-table-column
                            prop="COMMUNITY_NAME"
                            label="详细地址"
                          />
                        </el-table>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </el-card>
          <!-- <el-card
            v-if="item.systemName == '生活垃圾转运处理管家'"
            class="card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
                        <ul v-if="item.url">
              <div class="header">
                <el-button
                  class="el-button-hjws-title"
                  type="text"
                  @click="toSystemHjws(item)"
                  style="margin-top: 10px"
                  >{{ item.systemName }}
                </el-button>
              </div>
            </ul>
            <div class="header" style="font-size: 20px" v-else>
              <el-button
                class="el-button-null"
                type="text"
                disabled
                plain
                @click="toSystemHjws(item)"
                style="margin-top: 10px"
              >
                {{ item.systemName }}</el-button
              >
            </div>
            <template v-if="params.role == '管理员'">
              <el-upload
                accept="image/jpg,image/jpeg,image/gif,image/png"
                action="uploadUrl"
                class="avatar-uploader"
                :show-file-list="false"
                :default-file-list="defaultFileList"
                :before-upload="createBeforeUpload('shlj')"
              >
                <el-tooltip
                  content="点击鼠标左键即可更换图片"
                  effect="dark"
                  placement="top"
                >
                  <img
                    v-if="shljImageUrl"
                    :src="shljImageUrl"
                    class="image"
                    @click="handleAvatarClick"
                  />
                  <el-icon
                    v-else
                    class="avatar-uploader-icon"
                    @click="handleAvatarClick"
                  >
                    <Plus />
                  </el-icon>
                </el-tooltip>
              </el-upload>
            </template>
            <template v-else>
              <img :src="shljImageUrl" class="image" />
            </template>

            <div
              class="infoContainer"
              style="background-color: #2775b6; color: white"
            >
              <div>
                <ul class="infoList">
                  <li v-for="item in item.data" style="font-size: 20px">
                    {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                  </li>
                </ul>

                <el-popover
                  :width="1000"
                  placement="left"
                  effect="dark"
                  @after-enter="echartInit_ljz()"
                  trigger="click"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  style="text-align: center"
                >
                  <template #reference>
                    <el-button
                      class="el-button-hjws"
                      link
                      type="text"
                      style="margin-top: 10px; color: #e6e6e6"
                    >
                      查看详情 ></el-button
                    >
                  </template>
                  <template #default>
                    <div
                      class="demo-rich-conent"
                      style="display: flex; gap: 16px; flex-direction: column"
                    >
                      <div>
                        <p
                          class="demo-rich-content__name"
                          style="margin: 0; font-weight: 500; font-size: 25px"
                        >
                          {{ item.systemName }}
                        </p>
                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @详情统计
                        </p>
                        <div
                          id="container_ljz1"
                          style="width: 1000px; height: 400px"
                        ></div>
                        <div
                          id="container_ljz2"
                          style="width: 1000px; height: 400px"
                        ></div>


                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </el-card> -->
          <el-card
            v-if="item.systemName == '智慧公厕管家'"
            class="card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
            <!-- <el-image
              class="image"
              :src="require('@/assets/home/img-ljz2.jpg')"
            >
            </el-image> -->
            <ul v-if="item.url">
              <div class="header">
                <el-button
                  class="el-button-hjws-title"
                  type="text"
                  @click="toSystemHjws(item)"
                  style="margin-top: 10px"
                  >{{ item.systemName }}
                  <div
                    id="warning-toilet"
                    class="warning-toilet"
                    title=""
                  ></div>
                </el-button>
              </div>
            </ul>
            <div class="header" style="font-size: 20px" v-else>
              <el-button
                class="el-button-null"
                type="text"
                disabled
                plain
                @click="toSystemHjws(item)"
                style="margin-top: 10px"
              >
                {{ item.systemName }}</el-button
              >
            </div>
            <template v-if="params.role == '管理员'">
              <el-upload
                accept="image/jpg,image/jpeg,image/gif,image/png"
                action="uploadUrl"
                class="avatar-uploader"
                :show-file-list="false"
                :default-file-list="defaultFileList"
                :before-upload="createBeforeUpload('ljfl')"
              >
                <el-tooltip
                  content="点击鼠标左键即可更换图片"
                  effect="dark"
                  placement="top"
                >
                  <img
                    v-if="ljflImageUrl"
                    :src="ljflImageUrl"
                    class="image"
                    @click="handleAvatarClick"
                  />
                  <el-icon
                    v-else
                    class="avatar-uploader-icon"
                    @click="handleAvatarClick"
                  >
                    <Plus />
                  </el-icon>
                </el-tooltip>
              </el-upload>
            </template>
            <template v-else>
              <img :src="ljflImageUrl" class="image" />
            </template>

            <div
              class="infoContainer"
              style="background-color: #2775b6; color: white"
            >
              <div>
                <ul class="infoList">
                  <li v-for="item in item.data" style="font-size: 20px">
                    {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                  </li>
                </ul>

                <el-popover
                  :width="1100"
                  placement="left"
                  effect="dark"
                  @after-enter="showWeeklyChart()"
                  trigger="click"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  style="text-align: center"
                >
                  <template #reference>
                    <el-button
                      class="el-button-hjws"
                      link
                      type="text"
                      style="margin-top: 10px; color: #e6e6e6"
                    >
                      查看详情 ></el-button
                    >
                  </template>
                  <template #default>
                    <div
                      class="demo-rich-conent"
                      style="display: flex; gap: 16px; flex-direction: column"
                    >
                      <div>
                        <p
                          class="demo-rich-content__name"
                          style="margin: 0; font-weight: 500; font-size: 25px"
                        >
                          {{ item.systemName }}
                        </p>
                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @详情统计
                        </p>
                        <div style="display: flex">
                          <dv-border-box6
                            style="
                              font-size: 20px;
                              padding: 10px;
                              margin-top: 0px;
                              width: 100%;
                            "
                          >
                            <div>{{ item.infoKey }}</div>
                            <div style="text-align: center">
                              {{ item.infoVal }}
                            </div>
                          </dv-border-box6>
                        </div>
                        <div
                          id="weekly_chart"
                          style="width: 1000px; height: 400px"
                        ></div>

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

        <div
          class="classification-title"
          v-if="(choosedDept == -1) | (choosedDept == 1)"
        >
          市容秩序
        </div>
        <div class="description">
          利用智慧化、科技化信息手段，开展市容秩序、餐饮油烟、共享单车、扬尘污染的智能监管，执法人员精细管理和执法案件线上办理。
        </div>
        <el-divider v-if="(choosedDept == -1) | (choosedDept == 1)" />
        <!-- <div class="img-wrapper" v-if="imgVisible"> -->
        <!-- <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="item in 6" :key="item">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel> -->
        <template v-for="(item, idx) in choosedSystems">
          <!-- <div class="srzxInfo" v-if="item.deptId == 1 && item.systemName != '餐饮油烟管家'" :key="idx"
              :systemName="item.systemName" :url="item.url" :logo="item.systemLogo" :infoList="item.data"
              :image="item.image" :to="item.to" :deptId="item.deptId">
              <div style="margin-bottom:15%;margin-top: 10%;font-size: 25px;">

                <el-button v-if="item.url" class="el-button-succeed" type="text" @click="toSystem(item)"
                  style="margin-top:10px;color:#e6e6e6">{{ item.systemName }}</el-button>
                <el-button v-else="item.url" class="el-button-null" type="text" @click="toSystem(item)"
                  style="margin-top:10px">{{ item.systemName }}</el-button>

              </div>
              <li v-for="item in item.data" style="padding:10px;font-size: 25px;">{{ item.infoKey + ": " + item.infoVal
              }}</li>
            </div> -->
          <el-card
            v-if="item.systemName == '餐饮油烟管家'"
            class="card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
            <ul v-if="item.url">
              <div class="header">
                <el-button
                  class="el-button-hjws-title"
                  type="text"
                  @click="toSystem(item)"
                  style="margin-top: 10px"
                  >{{ item.systemName }}
                  <div id="warning-cyyy" class="warning-cyyy" title=""></div>
                </el-button>
              </div>
            </ul>
            <template v-if="params.role == '管理员'">
              <el-upload
                accept="image/jpg,image/jpeg,image/gif,image/png"
                action="uploadUrl"
                class="avatar-uploader"
                :show-file-list="false"
                :default-file-list="defaultFileList"
                :before-upload="createBeforeUpload('cyyy')"
              >
                <el-tooltip
                  content="点击鼠标左键即可更换图片"
                  effect="dark"
                  placement="top"
                >
                  <img
                    v-if="cyyyImageUrl"
                    :src="cyyyImageUrl"
                    class="image"
                    @click="handleAvatarClick"
                  />
                  <el-icon
                    v-else
                    class="avatar-uploader-icon"
                    @click="handleAvatarClick"
                  >
                    <Plus />
                  </el-icon>
                </el-tooltip>
              </el-upload>
            </template>
            <template v-else>
              <img :src="cyyyImageUrl" class="image" />
            </template>

            <div
              class="infoContainer"
              style="background-color: #2775b6; color: white"
            >
              <!-- logo -->
              <!-- <div>
<el-avatar class="logo-icon" :src="require('@/assets/home/'+logo)" size="large"></el-avatar>
</div> -->
              <!-- 汇总数据列表 -->
              <div>
                <!-- <el-avatar class="logo-icon" :src="require('@/assets/home/'+logo)" size="large" ></el-avatar> -->
                <ul class="infoList">
                  <li v-for="item in item.data" style="font-size: 20px">
                    {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                  </li>
                </ul>

                <el-popover
                  :width="1000"
                  effect="dark"
                  @after-enter="echartInit()"
                  trigger="click"
                  placement="right-end"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                >
                  <template #reference>
                    <el-button
                      size="medium"
                      style="padding: 10pxx; font-size: 25px"
                      type="primary"
                      link
                    >
                      查看详情 >
                    </el-button>
                  </template>
                  <template #default>
                    <div
                      class="demo-rich-conent"
                      style="display: flex; gap: 16px; flex-direction: column"
                    >
                      <div>
                        <p
                          class="demo-rich-content__name"
                          style="margin: 0; font-weight: 500; font-size: 25px"
                        >
                          {{ item.systemName }}
                        </p>
                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @详情统计
                        </p>
                        <div
                          id="container_yyxt1"
                          style="width: 1000px; height: 350px"
                        ></div>
                        <div
                          id="container_yyxt2"
                          style="width: 1000px; height: 350px"
                        ></div>
                        <div
                          id="container_yyxt3"
                          style="width: 500px; height: 350px; float: left"
                        ></div>
                        <div
                          id="container_yyxt4"
                          style="width: 500px; height: 350px; float: left"
                        ></div>

                        <div style="display: flex; clear: left">
                          <dv-border-box6
                            style="
                              font-size: 20px;
                              padding: 10px;
                              margin-top: 0px;
                              width: 100%;
                            "
                          >
                            <div>{{ item.infoKey }}</div>
                            <div style="text-align: center">
                              {{ item.infoVal }}
                            </div>
                          </dv-border-box6>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </el-card>

          <el-card
            v-if="item.systemName == '调度指挥管家'"
            class="card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
            <!-- <el-image
              class="image"
              :src="require('@/assets/home/img-ddzh2.jpg')"
            >
            </el-image> -->
            <ul v-if="item.url">
              <div class="header">
                <el-button
                  class="el-button-hjws-title"
                  type="text"
                  @click="toSystem(item)"
                  style="margin-top: 10px"
                  >{{ item.systemName }}
                  <div id="warning-ddzh" class="warning-ddzh" title=""></div>
                </el-button>
              </div>
            </ul>
            <template v-if="params.role == '管理员'">
              <el-upload
                accept="image/jpg,image/jpeg,image/gif,image/png"
                action="uploadUrl"
                class="avatar-uploader"
                :show-file-list="false"
                :default-file-list="defaultFileList"
                :before-upload="createBeforeUpload('ddzh')"
              >
                <el-tooltip
                  content="点击鼠标左键即可更换图片"
                  effect="dark"
                  placement="top"
                >
                  <img
                    v-if="ddzhImageUrl"
                    :src="ddzhImageUrl"
                    class="image"
                    @click="handleAvatarClick"
                  />
                  <el-icon
                    v-else
                    class="avatar-uploader-icon"
                    @click="handleAvatarClick"
                  >
                    <Plus />
                  </el-icon>
                </el-tooltip>
              </el-upload>
            </template>
            <template v-else>
              <img :src="ddzhImageUrl" class="image" />
            </template>

            <div
              class="infoContainer"
              style="background-color: #2775b6; color: white"
            >
              <!-- logo -->
              <!-- <div>
<el-avatar class="logo-icon" :src="require('@/assets/home/'+logo)" size="large"></el-avatar>
</div> -->
              <!-- 汇总数据列表 -->
              <div>
                <!-- <el-avatar class="logo-icon" :src="require('@/assets/home/'+logo)" size="large" ></el-avatar> -->
                <ul class="infoList">
                  <li v-for="item in item.data" style="font-size: 20px">
                    {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                  </li>
                </ul>

                <el-popover
                  :width="1400"
                  effect="dark"
                  @after-enter="echartInit_ddzh()"
                  trigger="click"
                  placement="top"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                >
                  <template #reference>
                    <el-button
                      size="medium"
                      style="padding: 10pxx; font-size: 25px"
                      type="primary"
                      link
                    >
                      查看详情 >
                    </el-button>
                  </template>
                  <template #default>
                    <div
                      class="demo-rich-conent"
                      style="display: flex; gap: 16px; flex-direction: column"
                    >
                      <div>
                        <p
                          class="demo-rich-content__name"
                          style="margin: 0; font-weight: 500; font-size: 25px"
                        >
                          {{ item.systemName }}
                        </p>
                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @详情统计
                        </p>

                        <div
                          id="container_ddzh1"
                          style="width: 1400px; height: 400px"
                        ></div>
                        <!-- <div id="container_ddzh2" style="width: 1200px; height: 400px ;float:left"></div> -->
                        <div
                          id="container_ddzh2"
                          style="width: 500px; height: 350px; float: left"
                          @click="toDdzh"
                        ></div>
                        <div
                          id="container_ddzh3"
                          style="width: 500px; height: 350px; float: left"
                          @click="toDdzh"
                        ></div>

                        <div style="display: flex; clear: left">
                          <dv-border-box6
                            style="
                              font-size: 20px;
                              padding: 10px;
                              margin-top: 0px;
                              width: 100%;
                            "
                          >
                            <div>{{ item.infoKey }}</div>
                            <div style="text-align: center">
                              {{ item.infoVal }}
                            </div>
                          </dv-border-box6>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </el-card>
          <el-card
            v-if="item.systemName == '共享单车管家'"
            class="card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
            <!-- <el-image
              class="image"
              :src="require('@/assets/home/' + item.image)"
            >
            </el-image> -->
            <ul v-if="item.url">
              <div class="header">
                <el-button
                  class="el-button-hjws-title"
                  type="text"
                  @click="toSystem(item)"
                  style="margin-top: 10px"
                  >{{ item.systemName }}
                  <div id="warning-gxdc" class="warning-gxdc" title=""></div>
                </el-button>
              </div>
            </ul>
            <template v-if="params.role == '管理员'">
              <el-upload
                accept="image/jpg,image/jpeg,image/gif,image/png"
                action="uploadUrl"
                class="avatar-uploader"
                :show-file-list="false"
                :default-file-list="defaultFileList"
                :before-upload="createBeforeUpload('gxdc')"
              >
                <el-tooltip
                  content="点击鼠标左键即可更换图片"
                  effect="dark"
                  placement="top"
                >
                  <img
                    v-if="gxdcImageUrl"
                    :src="gxdcImageUrl"
                    class="image"
                    @click="handleAvatarClick"
                  />
                  <el-icon
                    v-else
                    class="avatar-uploader-icon"
                    @click="handleAvatarClick"
                  >
                    <Plus />
                  </el-icon>
                </el-tooltip>
              </el-upload>
            </template>
            <template v-else>
              <img :src="gxdcImageUrl" class="image" />
            </template>

            <div
              class="infoContainer"
              style="background-color: #2775b6; color: white"
            >
              <!-- logo -->
              <!-- <div>
<el-avatar class="logo-icon" :src="require('@/assets/home/'+logo)" size="large"></el-avatar>
</div> -->
              <!-- 汇总数据列表 -->
              <div>
                <ul class="infoList">
                  <li v-for="item in item.data" style="font-size: 20px">
                    {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                  </li>
                </ul>

                <el-popover
                  :width="1200"
                  effect="dark"
                  @after-enter="echartInit_srzx()"
                  trigger="click"
                  placement="left"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                >
                  <template #reference>
                    <el-button
                      size="medium"
                      style="padding: 10pxx; font-size: 25px"
                      type="primary"
                      link
                    >
                      查看详情 >
                    </el-button>
                  </template>
                  <template #default>
                    <div
                      class="demo-rich-conent"
                      style="display: flex; gap: 16px; flex-direction: column"
                    >
                      <div>
                        <p
                          class="demo-rich-content__name"
                          style="margin: 0; font-weight: 500; font-size: 25px"
                        >
                          {{ item.systemName }}
                        </p>
                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @详情统计
                        </p>
                        <div
                          id="container_gxdc1"
                          style="width: 500px; height: 350px; float: left"
                        ></div>
                        <div
                          id="container_gxdc2"
                          style="width: 700px; height: 350px; float: left"
                        ></div>

                        <div style="display: flex; clear: left">
                          <dv-border-box6
                            v-for="item in item.data"
                            style="
                              font-size: 20px;
                              padding: 10px;
                              margin-top: 0px;
                              width: 100%;
                            "
                          >
                            <div>{{ item.infoKey }}</div>
                            <div style="text-align: center">
                              {{ item.infoVal }}
                            </div>
                          </dv-border-box6>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </el-card>
          <el-card
            v-if="item.systemName == '扬尘治理大数据协同管家'"
            class="card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
            <ul v-if="item.url">
              <div class="header">
                <el-button
                  class="el-button-hjws-title"
                  type="text"
                  @click="toSystem(item)"
                  style="margin-top: 10px"
                  >{{ item.systemName }}
                  <div id="warning-yczl" class="warning-yczl" title=""></div>
                </el-button>
              </div>
            </ul>
            <template v-if="params.role == '管理员'">
              <el-upload
                accept="image/jpg,image/jpeg,image/gif,image/png"
                action="uploadUrl"
                class="avatar-uploader"
                :show-file-list="false"
                :default-file-list="defaultFileList"
                :before-upload="createBeforeUpload('yczl')"
              >
                <el-tooltip
                  content="点击鼠标左键即可更换图片"
                  effect="dark"
                  placement="top"
                >
                  <img
                    v-if="yczlImageUrl"
                    :src="yczlImageUrl"
                    class="image"
                    @click="handleAvatarClick"
                  />
                  <el-icon
                    v-else
                    class="avatar-uploader-icon"
                    @click="handleAvatarClick"
                  >
                    <Plus />
                  </el-icon>
                </el-tooltip>
              </el-upload>
            </template>
            <template v-else>
              <img :src="yczlImageUrl" class="image" />
            </template>

            <div
              class="infoContainer"
              style="background-color: #2775b6; color: white"
            >
              <div>
                <ul class="infoList">
                  <li v-for="item in item.data" style="font-size: 20px">
                    {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                  </li>
                </ul>

                <el-popover
                  :width="1000"
                  effect="dark"
                  @after-enter="echartInit()"
                  trigger="click"
                  placement="top"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                >
                  <template #reference>
                    <el-button
                      size="medium"
                      style="padding: 10pxx; font-size: 25px"
                      type="primary"
                      link
                    >
                      查看详情 >
                    </el-button>
                  </template>
                  <template #default>
                    <div
                      class="demo-rich-conent"
                      style="display: flex; gap: 16px; flex-direction: column"
                    >
                      <div>
                        <p
                          class="demo-rich-content__name"
                          style="margin: 0; font-weight: 500; font-size: 25px"
                        >
                          {{ item.systemName }}
                        </p>
                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @工地运企信息
                        </p>
                        <el-table
                          :data="ycxt_tableData1"
                          stripe
                          style="width: 100%"
                          max-height="500"
                          :header-cell-style="{
                            'font-size': '18px',
                            background: '#303133 !important',
                            color: '#ffffff',
                            border: 'none !important',
                          }"
                          :cell-style="changeCellStyle"
                        >
                          <el-table-column
                            prop="name"
                            label="名称"
                            width="180"
                          />
                          <el-table-column
                            prop="update_time"
                            label="更新时间"
                            width="240"
                          />
                          <el-table-column
                            prop="contacts"
                            label="联系人"
                            width="180"
                          />
                          <el-table-column
                            prop="car_count"
                            label="车辆数"
                            width="180"
                          />
                          <el-table-column prop="tel" label="联系电话" />
                        </el-table>
                        <p
                          class="demo-rich-content__mention"
                          style="
                            margin: 0;
                            font-size: 18px;
                            color: var(--el-color-info);
                          "
                        >
                          @今日超速车辆列表
                        </p>
                        <el-table
                          :data="ycxt_tableData2"
                          stripe
                          style="width: 100%"
                          max-height="500"
                          :header-cell-style="{
                            'font-size': '18px',
                            background: '#303133 !important',
                            color: '#ffffff',
                            border: 'none !important',
                          }"
                          :cell-style="changeCellStyle"
                        >
                          <el-table-column
                            prop="overspeed_address"
                            label="超速位置"
                            width="180"
                          />
                          <el-table-column
                            prop="speed"
                            label="速度"
                            width="280"
                          />
                          <el-table-column
                            prop="plate_num"
                            label="车牌号"
                            width="180"
                          />
                          <el-table-column
                            prop="overspeed_time"
                            label="超速时间"
                          />
                        </el-table>
                        <!-- <div id="container_yyxt1" style="width: 1000px; height: 350px"></div>
                      <div id="container_yyxt2" style="width: 1000px; height: 350px"></div>
                      <div id="container_yyxt3" style="width: 500px; height: 350px;float:left"></div>
                      <div id="container_yyxt4" style="width: 500px; height: 350px;float:left"></div> -->

                        <div style="display: flex; clear: left">
                          <dv-border-box6
                            style="
                              font-size: 20px;
                              padding: 10px;
                              margin-top: 0px;
                              width: 100%;
                            "
                          >
                            <div>{{ item.infoKey }}</div>
                            <div style="text-align: center">
                              {{ item.infoVal }}
                            </div>
                          </dv-border-box6>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </el-card>
        </template>
        <!-- </div> -->

        <div
          class="classification-title"
          v-if="(choosedDept == -1) | (choosedDept == 2)"
        >
          城市景观
        </div>
        <div class="description">
          负责全区户外广告招牌和景观照明的监督管理，开展违规户外广告招牌专项整治，编制技术规范，并实施安全监管。
        </div>
        <el-divider v-if="(choosedDept == -1) | (choosedDept == 2)" />

        <template v-for="(item, idx) in choosedSystems">
          <div style="display: flex">
            <el-card
              v-if="item.systemName == '临街店铺管家'"
              class="card"
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <ul v-if="item.url">
                <div class="header">
                  <el-button
                    v-if="item.url"
                    class="el-button-hjws-title"
                    type="text"
                    @click="toSystem(item)"
                    >{{ item.systemName }}
                    <div id="warning-ljdp" class="warning-ljdp" title=""></div
                  ></el-button>
                </div>
              </ul>
              <template v-if="params.role == '管理员'">
                <el-upload
                  accept="image/jpg,image/jpeg,image/gif,image/png"
                  action="uploadUrl"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :default-file-list="defaultFileList"
                  :before-upload="createBeforeUpload('ljdp')"
                >
                  <el-tooltip
                    content="点击鼠标左键即可更换图片"
                    effect="dark"
                    placement="top"
                  >
                    <img
                      v-if="ljdpImageUrl"
                      :src="ljdpImageUrl"
                      class="image"
                      @click="handleAvatarClick"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                      @click="handleAvatarClick"
                    >
                      <Plus />
                    </el-icon>
                  </el-tooltip>
                </el-upload>
              </template>
              <template v-else>
                <img :src="ljdpImageUrl" class="image" />
              </template>

              <div
                class="infoContainer"
                style="background-color: #2775b6; color: white"
              >
                <div>
                  <!-- <div style="padding: 5px; margin-top: 5%; padding-left: 8%"> -->

                  <ul class="infoList">
                    <li
                      v-for="item in item.data"
                      style="font-size: 20px; padding: 5px"
                    >
                      {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                    </li>
                  </ul>
                  <el-popover
                    :width="500"
                    placement="right"
                    effect="dark"
                    @after-enter="echartInit()"
                    trigger="click"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  >
                    <template #reference>
                      <el-button
                        class="el-button-succeed"
                        link
                        type="primary"
                        style="margin-top: 10px; font-size: 25px"
                      >
                        查看详情 ></el-button
                      >
                    </template>
                    <template #default>
                      <div
                        class="demo-rich-conent"
                        style="display: flex; gap: 16px; flex-direction: column"
                      >
                        <div>
                          <p
                            class="demo-rich-content__name"
                            style="margin: 0; font-weight: 500; font-size: 25px"
                          >
                            {{ item.systemName }}
                          </p>
                          <p
                            class="demo-rich-content__mention"
                            style="
                              margin: 0;
                              font-size: 18px;
                              color: var(--el-color-info);
                            "
                          >
                            @详情统计
                          </p>

                          <div class="list_container">
                            <div class="list_title">@门牌地址数量</div>
                            <div class="list_body">暂无详细统计</div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@店铺数量</div>
                            <div class="list_body">暂无详细统计</div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@零售类店铺数量</div>
                            <div class="list_body">
                              <li v-for="(project, index) in retailCount">
                                {{ project }}
                              </li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@餐饮类店铺数量</div>
                            <div class="list_body">
                              <li v-for="(project, index) in cateringCount">
                                {{ project }}
                              </li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@服务类店铺数量</div>
                            <div class="list_body">
                              <li v-for="(project, index) in serviceCount">
                                {{ project }}
                              </li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@其他行业店铺数量</div>
                            <div class="list_body">
                              <li v-for="(project, index) in otherCount">
                                {{ project }}
                              </li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@店铺空置率</div>
                            <div class="list_body">
                              <li>暂无详细统计</li>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
            </el-card>
            <el-card
              v-if="item.systemName == '景观照明管家'"
              class="card"
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <ul v-if="item.url">
                <div class="header">
                  <el-button
                    v-if="item.url"
                    class="el-button-hjws-title"
                    type="text"
                    @click="toSystem(item)"
                    >{{ item.systemName }}
                    <div id="warning-ggzm" class="warning-ggzm" title=""></div
                  ></el-button>
                </div>
              </ul>
              <template v-if="params.role == '管理员'">
                <el-upload
                  accept="image/jpg,image/jpeg,image/gif,image/png"
                  action="uploadUrl"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :default-file-list="defaultFileList"
                  :before-upload="createBeforeUpload('jgzm')"
                >
                  <el-tooltip
                    content="点击鼠标左键即可更换图片"
                    effect="dark"
                    placement="top"
                  >
                    <img
                      v-if="jgzmImageUrl"
                      :src="jgzmImageUrl"
                      class="image"
                      @click="handleAvatarClick"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                      @click="handleAvatarClick"
                    >
                      <Plus />
                    </el-icon>
                  </el-tooltip>
                </el-upload>
              </template>
              <template v-else>
                <img :src="jgzmImageUrl" class="image" />
              </template>

              <div
                class="infoContainer"
                style="background-color: #2775b6; color: white"
              >
                <div>
                  <!-- <div style="padding: 5px; margin-top: 5%; padding-left: 8%"> -->

                  <ul class="infoList">
                    <li
                      v-for="item in item.data"
                      style="font-size: 20px; padding: 5px"
                    >
                      {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                    </li>
                  </ul>
                  <el-popover
                    :width="500"
                    placement="right"
                    effect="dark"
                    @after-enter="echartInit()"
                    trigger="click"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  >
                    <template #reference>
                      <el-button
                        class="el-button-succeed"
                        link
                        type="primary"
                        style="margin-top: 10px; font-size: 25px"
                      >
                        查看详情 ></el-button
                      >
                    </template>
                    <template #default>
                      <div
                        class="demo-rich-conent"
                        style="display: flex; gap: 16px; flex-direction: column"
                      >
                        <div>
                          <p
                            class="demo-rich-content__name"
                            style="margin: 0; font-weight: 500; font-size: 25px"
                          >
                            {{ item.systemName }}
                          </p>
                          <p
                            class="demo-rich-content__mention"
                            style="
                              margin: 0;
                              font-size: 18px;
                              color: var(--el-color-info);
                            "
                          >
                            @详情统计
                          </p>

                          <div class="list_container">
                            <div class="list_title">@报警照明设备数</div>
                            <div class="list_body">
                              <li
                                v-for="(project, index) in jgzm_alarm_projrect"
                              >
                                {{ project }}
                              </li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@昨日电量统计（KWh）</div>
                            <div class="list_body">
                              <li
                                v-for="(project, index) in jgzm_day_consumption"
                              >
                                {{ project }}
                              </li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@月电量统计（KWh）</div>
                            <div class="list_body">
                              <li
                                v-for="(
                                  project, index
                                ) in jgzm_month_consumption"
                              >
                                {{ project }}
                              </li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@年电量统计（KWh）</div>
                            <div class="list_body">
                              <li
                                v-for="(
                                  project, index
                                ) in jgzm_year_consumption"
                              >
                                {{ project }}
                              </li>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
            </el-card>

            <el-card
              v-if="item.systemName == '照明管家（新）'"
              class="card"
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <ul v-if="item.url">
                <div class="header">
                  <el-button
                    v-if="item.url"
                    class="el-button-hjws-title"
                    type="text"
                    @click="toSystem(item)"
                    >{{ item.systemName }}
                    <div id="warning-ggzm" class="warning-ggzm" title=""></div
                  ></el-button>
                </div>
              </ul>
              <template v-if="params.role == '管理员'">
                <el-upload
                  accept="image/jpg,image/jpeg,image/gif,image/png"
                  action="uploadUrl"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :default-file-list="defaultFileList"
                  :before-upload="createBeforeUpload('new_jgzm')"
                >
                  <el-tooltip
                    content="点击鼠标左键即可更换图片"
                    effect="dark"
                    placement="top"
                  >
                    <img
                      v-if="newJgzmImageUrl"
                      :src="newJgzmImageUrl"
                      class="image"
                      @click="handleAvatarClick"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                      @click="handleAvatarClick"
                    >
                      <Plus />
                    </el-icon>
                  </el-tooltip>
                </el-upload>
              </template>
              <template v-else>
                <img :src="newJgzmImageUrl" class="image" />
              </template>

              <div
                class="infoContainer"
                style="background-color: #2775b6; color: white"
              >
                <div>
                  <!-- <div style="padding: 5px; margin-top: 5%; padding-left: 8%"> -->

                  <ul class="infoList">
<!--                    <li-->
<!--                      v-for="item in item.data"-->
<!--                      style="font-size: 20px; padding: 5px"-->
<!--                    >-->
<!--                      {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>-->
<!--                    </li>-->
                    <!-- 显示固定的值 -->
                    <li style="font-size: 20px; padding: 5px">
                      集中控制设备：287台
                    </li>
                    <li style="font-size: 20px; padding: 5px">
                      视频监控设备：36台
                    </li>
                    <li style="font-size: 20px; padding: 5px">
                      亮灯楼宇：286栋
                    </li>
                    <li style="font-size: 20px; padding: 5px">
                      亮灯桥梁及绿地：11处
                    </li>
                  </ul>
                  <el-popover
                    :width="500"
                    placement="right"
                    effect="dark"
                    @after-enter="echartInit()"
                    trigger="click"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  >
                    <template #reference>
                      <el-button
                        class="el-button-succeed"
                        link
                        type="primary"
                        style="margin-top: 10px; font-size: 25px"
                      >
                        查看详情 ></el-button
                      >
                    </template>
                    <template #default>
                      <div
                        class="demo-rich-conent"
                        style="display: flex; gap: 16px; flex-direction: column"
                      >
                        <div>
                          <p
                            class="demo-rich-content__name"
                            style="margin: 0; font-weight: 500; font-size: 25px"
                          >
                            {{ item.systemName }}
                          </p>
                          <p
                            class="demo-rich-content__mention"
                            style="
                              margin: 0;
                              font-size: 18px;
                              color: var(--el-color-info);
                            "
                          >
                            @详情统计
                          </p>

                          <div class="list_container">
                            <div class="list_title">@报警照明设备数</div>
                            <div class="list_body">
                              <li
                                v-for="(project, index) in jgzm_alarm_projrect"
                              >
                                {{ project }}
                              </li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@昨日电量统计（KWh）</div>
                            <div class="list_body">
                              <li
                                v-for="(project, index) in jgzm_day_consumption"
                              >
                                {{ project }}
                              </li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@月电量统计（KWh）</div>
                            <div class="list_body">
<!--                              <li-->
<!--                                v-for="(-->
<!--                                  project, index-->
<!--                                ) in jgzm_month_consumption"-->
<!--                              >-->
<!--                                {{ project }}-->
<!--                              </li>-->
                              <li>一品天下：2949</li>
                              <li>城北体育中心：95</li>
                              <li>枣子巷：1073</li>
                              <li>一环路内透：675</li>
                            </div>
                          </div>
                          <div class="list_container">
                            <div class="list_title">@年电量统计（KWh）</div>
                            <div class="list_body">
<!--                              <li-->
<!--                                v-for="(-->
<!--                                  project, index-->
<!--                                ) in jgzm_year_consumption"-->
<!--                              >-->
<!--                                {{ project }}-->
<!--                              </li>-->
                              <li>一品天下：11493</li>
                              <li>城北体育中心：456</li>
                              <li>枣子巷：5315</li>
                              <li>一环路内透：2690</li>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
            </el-card>
          </div>
          <!-- <div
            class="jgzmInfo"
            v-if="item.deptId == 2"
            :key="idx"
            :systemName="item.systemName"
            :url="item.url"
            :logo="item.systemLogo"
            :infoList="item.data"
            :image="item.image"
            :to="item.to"
            :deptId="item.deptId"
          >
            <div v-if="item.systemName == '临街店铺管家'" style="display: flex">
    
              <template v-if="params.role == '管理员'">
                <el-upload
                  accept="image/jpg,image/jpeg,image/gif,image/png"
                  action="uploadUrl"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :default-file-list="defaultFileList"
                  :before-upload="createBeforeUpload('ljdp')"
                >
                  <el-tooltip
                    content="点击鼠标左键即可更换图片"
                    effect="dark"
                    placement="top"
                  >
                    <img
                      v-if="ljdpImageUrl"
                      :src="ljdpImageUrl"
                      style="width: 100%; height: 400px"
                      fit="scale-down"
                      @click="handleAvatarClick"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                      @click="handleAvatarClick"
                    >
                      <Plus />
                    </el-icon>
                  </el-tooltip>
                </el-upload>
              </template>
              <template v-else>
                <img
                  :src="ljdpImageUrl"
                  style="width: 100%; height: 400px"
                  fit="scale-down"
                />
              </template>
              <div
                style="
                  padding: 5px;
                  margin-top: 2%;
                  font-size: 25px;
                  margin-left: 30rem;
                "
              >
                <el-button
                  v-if="item.url"
                  class="el-button-succeed"
                  type="text"
                  @click="openSystem(item)"
                  style="margin-top: 10px; margin-left: 10%"
                  >{{ item.systemName }}<div id="littleSystem" title=""></div></el-button
                >
                

                <div style="">
    
                  <el-popover
                    v-for="(item, index) in item.data"
                    placement="right-end"
                    :width="600"
                    trigger="hover"
                    effect="dark"
                    popper-style="background-color: #1677D9;color: white;"
                  >
                    <template #reference>
                      <li style="font-size: 20px; padding: 5px; width: 100%">
                        {{ item.infoKey + ": " + item.infoVal }}
                      </li>
                    </template>
                    <div v-if="item.infoKey === '门牌地址数量'">
                      <li style="font-size: 20px; padding: 5px; width: 100%">
                        暂无详细统计
                      </li>
                    </div>
                    <div v-if="item.infoKey === '店铺数量'">
                      <li style="font-size: 20px; padding: 5px; width: 100%">
                        暂无详细统计
                      </li>
                    </div>
                    <div v-if="item.infoKey === '零售业'">
                      <li
                        v-for="(project, index) in retailCount"
                        style="font-size: 20px; padding: 5px; width: 100%"
                      >
                        {{ project }}
                      </li>
                    </div>
                    <div v-if="item.infoKey === '餐饮'">
                      <li
                        v-for="(project, index) in cateringCount"
                        style="font-size: 20px; padding: 5px; width: 100%"
                      >
                        {{ project }}
                      </li>
                    </div>
                    <div v-if="item.infoKey === '服务业'">
                      <li
                        v-for="(project, index) in serviceCount"
                        style="font-size: 20px; padding: 5px; width: 100%"
                      >
                        {{ project }}
                      </li>
                    </div>
                    <div v-if="item.infoKey === '其他行业'">
                      <li
                        v-for="(project, index) in otherCount"
                        style="font-size: 20px; padding: 5px; width: 100%"
                      >
                        {{ project }}
                      </li>
                    </div>
                    <div v-if="item.infoKey === '店铺空置率'">
                      <li style="font-size: 20px; padding: 5px; width: 100%">
                        暂无详细统计
                      </li>
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
            <div
              v-if="item.systemName == '景观照明管家'"
              style="display: flex; background-color: #e6e6e6"
            >
              <div
                style="
                  padding: 5px;
                  margin-top: 2%;
                  font-size: 20px;
                  margin-left: 5%;
                "
              >
                <el-button
                  v-if="item.url"
                  class="el-button-succeed"
                  type="text"
                  @click="openSystem(item)"
                  style="margin-top: 10px; margin-left: 10%"
                  >{{ item.systemName }}<div id="littleSystem" title=""></div></el-button
                >
                
                <div style="margin-top: 1%">
                  <el-popover
                    v-for="(item, index) in item.data"
                    placement="right-end"
                    :width="500"
                    trigger="hover"
                    popper-class="my-el-popover"
                    popper-style="background-color: #1677D9;color: white;"
                  >
                    <template #reference>
                      <li style="font-size: 20px; padding: 5px; width: 100%">
                        {{ item.infoKey + ": " + item.infoVal }}
                      </li>
                    </template>
                    <div v-if="item.infoKey === '报警照明设备数'">
                      <li
                        v-for="(project, index) in jgzm_alarm_projrect"
                        style="font-size: 20px; padding: 5px; width: 100%"
                      >
                        {{ project }}
                      </li>
                    </div>
                    <div v-if="item.infoKey === '昨日电量统计'">
                      <li
                        v-for="(project, index) in jgzm_day_consumption"
                        style="font-size: 20px; padding: 5px; width: 100%"
                      >
                        {{ project }}
                      </li>
                    </div>
                    <div v-if="item.infoKey === '月电量统计'">
                      <li
                        v-for="(project, index) in jgzm_month_consumption"
                        style="font-size: 20px; padding: 5px; width: 100%"
                      >
                        {{ project }}
                      </li>
                    </div>
                    <div v-if="item.infoKey === '年电量统计'">
                      <li
                        v-for="(project, index) in jgzm_year_consumption"
                        style="font-size: 20px; padding: 5px; width: 100%"
                      >
                        {{ project }}
                      </li>
                    </div>
                  </el-popover>
                </div>
              </div>

              <template v-if="params.role == '管理员'">
                <el-upload
                  accept="image/jpg,image/jpeg,image/gif,image/png"
                  action="uploadUrl"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :default-file-list="defaultFileList"
                  :before-upload="createBeforeUpload('jgzm')"
                >
                  <el-tooltip
                    content="点击鼠标左键即可更换图片"
                    effect="dark"
                    placement="top"
                  >
                    <img
                      v-if="jgzmImageUrl"
                      :src="jgzmImageUrl"
                      fit="scale-down"
                      style="width: 40%; float: right; margin-left: 50%"
                      @click="handleAvatarClick"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                      @click="handleAvatarClick"
                    >
                      <Plus />
                    </el-icon>
                  </el-tooltip>
                </el-upload>
              </template>
              <template v-else>
                <img
                  :src="jgzmImageUrl"
                  fit="scale-down"
                  style="width: 40%; float: right; margin-left: 50%"
                />
              </template>
            </div>
          </div> -->
        </template>

        <div
          class="classification-title"
          v-if="(choosedDept == -1) | (choosedDept == 3)"
        >
          数字城管
        </div>

        <div class="description">
          利用信息化移动通信技术、人工智能等手段实现对城市管理问题的采集、处理、分析，促进城市智慧化、精细化管理。
        </div>
        <el-divider v-if="(choosedDept == -1) | (choosedDept == 3)" />

        <template v-for="(item, idx) in choosedSystems">
          <div style="display: flex">
            <el-card
              v-if="item.systemName == '突出问题管家'"
              class="card"
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <ul v-if="item.url">
                <div class="header">
                  <el-button
                    v-if="item.url"
                    class="el-button-hjws-title"
                    type="text"
                    @click="toSystem(item)"
                    >{{ item.systemName }}
                    <div id="warning-tcwt" class="warning-tcwt" title=""></div
                  ></el-button>
                </div>
              </ul>
              <template v-if="params.role == '管理员'">
                <el-upload
                  accept="image/jpg,image/jpeg,image/gif,image/png"
                  action="uploadUrl"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :default-file-list="defaultFileList"
                  :before-upload="createBeforeUpload('tcwt')"
                >
                  <el-tooltip
                    content="点击鼠标左键即可更换图片"
                    effect="dark"
                    placement="top"
                  >
                    <img
                      v-if="tcwtImageUrl"
                      :src="tcwtImageUrl"
                      class="image"
                      @click="handleAvatarClick"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                      @click="handleAvatarClick"
                    >
                      <Plus />
                    </el-icon>
                  </el-tooltip>
                </el-upload>
              </template>
              <template v-else>
                <img :src="tcwtImageUrl" class="image" />
              </template>

              <div
                class="infoContainer"
                style="background-color: #2775b6; color: white"
              >
                <div>
                  <!-- <div style="padding: 5px; margin-top: 5%; padding-left: 8%"> -->

                  <ul class="infoList">
                    <li
                      v-for="item in item.data"
                      style="font-size: 20px; padding: 5px"
                    >
                      {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                    </li>
                  </ul>
                  <el-popover
                    :width="1200"
                    placement="right"
                    effect="dark"
                    @after-enter="echartInit()"
                    trigger="click"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  >
                    <template #reference>
                      <el-button
                        class="el-button-succeed"
                        link
                        type="primary"
                        style="margin-top: 10px; font-size: 25px"
                      >
                        查看详情 ></el-button
                      >
                    </template>
                    <template #default>
                      <div
                        class="demo-rich-conent"
                        style="display: flex; gap: 16px; flex-direction: column"
                      >
                        <div>
                          <p
                            class="demo-rich-content__name"
                            style="margin: 0; font-weight: 500; font-size: 25px"
                          >
                            {{ item.systemName }}
                          </p>
                          <p
                            class="demo-rich-content__mention"
                            style="
                              margin: 0;
                              font-size: 18px;
                              color: var(--el-color-info);
                            "
                          >
                            @详情统计
                          </p>
                          <div style="display: flex">
                            <dv-border-box8
                              v-for="item in item.data"
                              style="
                                font-size: 20px;
                                padding: 10px;
                                margin-top: 0px;
                                width: 100%;
                              "
                            >
                              <div>{{ item.infoKey }}</div>
                              <div style="text-align: center">
                                {{ item.infoVal }}
                              </div>
                            </dv-border-box8>
                          </div>

                          <div
                            id="container"
                            style="width: 600px; height: 400px; float: left"
                          ></div>
                          <div
                            id="container1"
                            style="width: 600px; height: 400px; float: left"
                          ></div>
                        </div>
                      </div>
                    </template>
                  </el-popover>
                  <!-- </div> -->
                </div>
              </div>
            </el-card>
            <el-card
              v-if="item.systemName == '城管AI识别管家'"
              class="card"
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <ul v-if="item.url">
                <div class="header">
                  <el-button
                    v-if="item.url"
                    class="el-button-hjws-title"
                    type="text"
                    @click="toSystem(item)"
                    >{{ item.systemName }}
                    <div id="warning-cgai" class="warning-cgai" title=""></div
                  ></el-button>
                </div>
              </ul>
              <template v-if="params.role == '管理员'">
                <el-upload
                  accept="image/jpg,image/jpeg,image/gif,image/png"
                  action="uploadUrl"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :default-file-list="defaultFileList"
                  :before-upload="createBeforeUpload('cgAI')"
                >
                  <el-tooltip
                    content="点击鼠标左键即可更换图片"
                    effect="dark"
                    placement="top"
                  >
                    <img
                      v-if="cgAIImageUrl"
                      :src="cgAIImageUrl"
                      class="image"
                      @click="handleAvatarClick"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                      @click="handleAvatarClick"
                    >
                      <Plus />
                    </el-icon>
                  </el-tooltip>
                </el-upload>
              </template>
              <template v-else>
                <img :src="cgAIImageUrl" class="image" />
              </template>

              <div
                class="infoContainer"
                style="background-color: #2775b6; color: white"
              >
                <div>
                  <ul class="infoList">
                    <li
                      v-for="item in item.data"
                      style="font-size: 20px; padding: 5px; margin-top: 0px"
                    >
                      {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                    </li>
                  </ul>
                  <el-popover
                    :width="1200"
                    effect="dark"
                    trigger="click"
                    placement="top"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  >
                    <template #reference>
                      <el-button
                        class="el-button-succeed"
                        link
                        type="primary"
                        style="margin-top: 10px; font-size: 25px"
                      >
                        查看详情 ></el-button
                      >
                    </template>
                    <template #default>
                      <div
                        class="demo-rich-conent"
                        style="display: flex; gap: 16px; flex-direction: column"
                      >
                        <div>
                          <p
                            class="demo-rich-content__name"
                            style="margin: 0; font-weight: 500; font-size: 25px"
                          >
                            {{ item.systemName }}
                          </p>
                          <p
                            class="demo-rich-content__mention"
                            style="
                              margin: 0;
                              font-size: 18px;
                              color: var(--el-color-info);
                            "
                          >
                            @详情统计
                          </p>
                          <div style="display: flex">
                            <dv-border-box6
                              v-for="item in item.data"
                              style="
                                font-size: 20px;
                                padding: 10px;
                                margin-top: 0px;
                                width: 100%;
                              "
                            >
                              <div>{{ item.infoKey }}</div>
                              <div style="text-align: center">
                                {{ item.infoVal }}
                              </div>
                            </dv-border-box6>
                          </div>
                          <p
                            class="demo-rich-content__mention"
                            style="
                              margin: 0;
                              font-size: 18px;
                              color: var(--el-color-info);
                            "
                          >
                            @事件列表
                          </p>
                          <el-table
                            :data="tcwtTableData"
                            stripe
                            style="width: 100%"
                            max-height="500"
                            :header-cell-style="{
                              'font-size': '18px',
                              background: '#303133 !important',
                              color: '#ffffff',
                              border: 'none !important',
                            }"
                            :cell-style="changeCellStyle"
                          >
                            <el-table-column
                              prop="event_name"
                              label="事件名称"
                              width="180"
                            />
                            <el-table-column
                              prop="modify_time"
                              label="确认时间"
                              width="280"
                            />
                            <el-table-column
                              prop="description"
                              label="问题描述"
                              width="180"
                            />
                            <el-table-column
                              prop="create_time"
                              label="创建时间"
                              width="280"
                            />
                            <el-table-column
                              prop="creator"
                              label="创建者"
                              width="180"
                            />
                            <el-table-column prop="tags" label="标签" />
                          </el-table>
                        </div>
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
            </el-card>

            <el-card
              v-if="item.systemName == '数字化城市信息管家'"
              class="card"
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <ul v-if="item.url">
                <div class="header">
                  <el-button
                    v-if="item.url"
                    class="el-button-hjws-title"
                    type="text"
                    @click="toSystem(item)"
                    >{{ item.systemName }}
                    <div
                      id="warning-szhcsgj"
                      class="warning-szhcsgj"
                      title=""
                    ></div
                  ></el-button>
                </div>
              </ul>
              <template v-if="params.role == '管理员'">
                <el-upload
                  accept="image/jpg,image/jpeg,image/gif,image/png"
                  action="uploadUrl"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :default-file-list="defaultFileList"
                  :before-upload="createBeforeUpload('szhcs')"
                >
                  <el-tooltip
                    content="点击鼠标左键即可更换图片"
                    effect="dark"
                    placement="top"
                  >
                    <img
                      v-if="szhcsImageUrl"
                      :src="szhcsImageUrl"
                      class="image"
                      @click="handleAvatarClick"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                      @click="handleAvatarClick"
                    >
                      <Plus />
                    </el-icon>
                  </el-tooltip>
                </el-upload>
              </template>
              <template v-else>
                <img :src="szhcsImageUrl" class="image" />
              </template>

              <div
                class="infoContainer"
                style="background-color: #2775b6; color: white"
              >
                <div>
                  <ul class="infoList">
                    <li
                      v-for="item in item.data"
                      style="font-size: 20px; padding: 5px; margin-top: 0px"
                    >
                      {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                    </li>
                  </ul>

                  <el-popover
                    :width="1200"
                    placement="top"
                    effect="dark"
                    @after-enter="echartInit()"
                    trigger="click"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  >
                    <template #reference>
                      <el-button
                        class="el-button-succeed"
                        link
                        type="primary"
                        style="margin-top: 10px; font-size: 25px"
                      >
                        查看详情 ></el-button
                      >
                    </template>
                    <template #default>
                      <div
                        class="demo-rich-conent"
                        style="display: flex; gap: 16px; flex-direction: column"
                      >
                        <div>
                          <p
                            class="demo-rich-content__name"
                            style="margin: 0; font-weight: 500; font-size: 25px"
                          >
                            {{ item.systemName }}
                          </p>
                          <p
                            class="demo-rich-content__mention"
                            style="
                              margin: 0;
                              font-size: 18px;
                              color: var(--el-color-info);
                            "
                          >
                            @详情统计
                          </p>
                          <div
                            id="container2"
                            style="width: 1200px; height: 350px"
                          ></div>
                          <div
                            id="container3"
                            style="width: 400px; height: 350px; float: left"
                          ></div>
                          <div
                            id="container4"
                            style="width: 800px; height: 350px; float: right"
                          ></div>
                          <div style="display: flex; clear: left">
                            <dv-border-box6
                              v-for="item in item.data"
                              style="
                                font-size: 20px;
                                padding: 10px;
                                margin-top: 0px;
                                width: 100%;
                              "
                            >
                              <div>{{ item.infoKey }}</div>
                              <div style="text-align: center">
                                {{ item.infoVal }}
                              </div>
                            </dv-border-box6>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-popover>
                  <!-- </div> -->
                </div>
              </div>
            </el-card>

            <el-card
              v-if="item.systemName == '网络理政管家'"
              class="card"
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <ul v-if="item.url">
                <div class="header">
                  <el-button
                    v-if="item.url"
                    class="el-button-hjws-title"
                    type="text"
                    @click="toSystem(item)"
                    >{{ item.systemName }}
                    <div id="warning-wllz" class="warning-wllz" title=""></div
                  ></el-button>
                </div>
              </ul>
              <template v-if="params.role == '管理员'">
                <el-upload
                  accept="image/jpg,image/jpeg,image/gif,image/png"
                  action="uploadUrl"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :default-file-list="defaultFileList"
                  :before-upload="createBeforeUpload('cgsyd')"
                >
                  <el-tooltip
                    content="点击鼠标左键即可更换图片"
                    effect="dark"
                    placement="top"
                  >
                    <img
                      v-if="cgsydImageUrl"
                      :src="cgsydImageUrl"
                      class="image"
                      @click="handleAvatarClick"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                      @click="handleAvatarClick"
                    >
                      <Plus />
                    </el-icon>
                  </el-tooltip>
                </el-upload>
              </template>
              <template v-else>
                <img :src="cgsydImageUrl" class="image" />
              </template>

              <div
                class="infoContainer"
                style="background-color: #2775b6; color: white"
              >
                <div>
                  <!-- <div style="padding: 5px; margin-top: 5%; margin-left: 8%"> -->

                  <ul class="infoList">
                    <li
                      v-for="item in item.data"
                      style="font-size: 20px; padding: 5px; margin-top: 0px"
                    >
                      {{ item.infoKey + ": " }}<span>{{ item.infoVal }}</span>
                    </li>
                  </ul>
                  <el-popover
                    :width="1000"
                    placement="top"
                    effect="dark"
                    trigger="click"
                    @after-enter="echartInit_syd()"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  >
                    <template #reference>
                      <el-button
                        class="el-button-succeed"
                        link
                        type="primary"
                        style="margin-top: 10px; font-size: 25px"
                      >
                        查看详情 ></el-button
                      >
                    </template>
                    <template #default>
                      <div
                        class="demo-rich-conent"
                        style="display: flex; gap: 16px; flex-direction: column"
                      >
                        <div>
                          <p
                            class="demo-rich-content__name"
                            style="margin: 0; font-weight: 500; font-size: 25px"
                          >
                            {{ item.systemName }}
                          </p>
                          <p
                            class="demo-rich-content__mention"
                            style="
                              margin: 0;
                              font-size: 18px;
                              color: var(--el-color-info);
                            "
                          >
                            @详情统计
                          </p>
                          <div
                            id="container_syd1"
                            style="width: 500px; height: 350px; float: left"
                          ></div>
                          <div
                            id="container_syd2"
                            style="width: 500px; height: 350px; float: right"
                          ></div>

                          <p
                            v-for="item in item.data"
                            style="
                              font-size: 20px;
                              padding: 5px;
                              margin-top: 0px;
                            "
                          >
                            {{ item.infoKey + ":" + item.infoVal }}
                          </p>
                          <!-- <p><dv-charts :option="config_szcg" style="width:200px;height: 200px;" />a</p> -->
                        </div>
                      </div>
                    </template>
                  </el-popover>
                  <!-- </div> -->
                </div>
              </div>
            </el-card>
            <!-- </div> -->
          </div>
        </template>
        <div style="margin-top: 20px">
          <template v-if="params.role == '管理员'">
            <el-upload
              accept="image/jpg,image/jpeg,image/gif,image/png"
              action="uploadUrl"
              class="avatar-uploader"
              :show-file-list="false"
              :default-file-list="defaultFileList"
              :before-upload="createBeforeUpload('bottom_banner')"
            >
              <el-tooltip
                content="点击鼠标左键即可更换图片"
                effect="dark"
                placement="top"
              >
                <img
                  v-if="bottomBannerImageUrl"
                  :src="bottomBannerImageUrl"
                  class="banner"
                  @click="handleAvatarClick"
                />
                <el-icon
                  v-else
                  class="avatar-uploader-icon"
                  @click="handleAvatarClick"
                >
                  <Plus />
                </el-icon>
              </el-tooltip>
            </el-upload>
          </template>
          <template v-else>
            <img :src="bottomBannerImageUrl" class="banner" />
          </template>
        </div>
      </el-main>

      <!-- //-----------------------------------------------------------------sunny 09/07 密码重设列表 -->
      <el-dialog
        v-model="resetPasswordDialog"
        title="用户密码重置管理"
        align-center="true"
        width="90%"
        @close="handleClose"
      >
        <div style="font-size: 2rem">用户列表</div>
        <el-table
          :data="
            resetPasswordList.slice(
              (current_Page_reset - 1) * 10,
              current_Page_reset * 10
            )
          "
          size="large"
          style="width: 100%"
          :header-cell-style="{
            'text-align': 'center',
            'font-size': '1.5rem',
            background: '#3B53A1 !important',
            color: '#ffffff',
            border: 'none !important',
          }"
          :cell-style="cellStyle"
        >
          <!-- 序号（应该可选才对-目前没有） -->

          \
          <el-table-column fixed="left" prop="realName" label="人员姓名" />
          <el-table-column fixed="left" prop="telephone" label="手机号" />
          <el-table-column fixed="right" prop="operate" label="操作">
            <template #default="scope">
              <el-button type="primary" @click="resetPassword(scope.row)"
                >重置密码</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="float-end" style="margin-bottom: 20px">
          <el-pagination
            background
            layout="->,total, prev, pager, next, jumper"
            :total="total_Records_reset"
            :current-page="current_Page_reset"
            :page-size="10"
            @current-change="getResetPasswordApplication"
          />
        </div>
      </el-dialog>

      <el-dialog
        v-model="clickLogDialog"
        title="用户点击日志"
        align-center="true"
        width="90%"
        @close="handleClose"
      >
        <div style="font-size: 2rem">日志列表</div>
        <el-date-picker
          v-model="changeValueLog"
          type="daterange"
          unlink-panels
          range-separator="到"
          start-placeholder="选择开始时间"
          end-placeholder="选择结束时间"
          :disabled-date="disabledDate"
          :shortcuts="shortcuts"
          @change="changeDateLog"
          size="large"
          style="margin: 0.5rem 0 0.5rem"
        />
        <el-select
          v-model="selectedSys"
          placeholder="请选择"
          @change="handleSelectSysChange"
          style="margin: 0.5rem 0 0.5rem"
        >
          <el-option
            v-for="item in sysOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-table
          :data="logListView"
          size="large"
          style="width: 100%"
          :header-cell-style="{
            'text-align': 'center',
            'font-size': '1.5rem',
            background: '#3B53A1 !important',
            color: '#ffffff',
            border: 'none !important',
          }"
          :cell-style="cellStyle"
        >
          <!-- 序号（应该可选才对-目前没有） -->

          \
          <el-table-column fixed="left" prop="realName" label="人员姓名" />
          <el-table-column fixed="left" prop="phone" label="手机号" />
          <el-table-column fixed="left" prop="subsystem" label="系统名称" />
          <el-table-column fixed="left" prop="clickTime" label="点击时间" />
          <el-table-column fixed="left" prop="operation" label="操作" />
        </el-table>
        <div class="float-end" style="margin-bottom: 20px">
          <el-pagination
            background
            layout="->,total, prev, pager, next, jumper"
            :total="total_Records_clickLog"
            :current-page="current_Page_clickLog"
            :page-size="10"
            @current-change="getClickLogApplication"
          />
        </div>
      </el-dialog>

      <!-- //-----------------------------------------------------------------sunny 09/07 密码重设列表 -->
      <el-dialog
        v-model="changePermissonDialog"
        title="权限管理"
        align-center="true"
        width="90%"
        @close="handleClose"
      >
        <div style="font-size: 2rem">权限申请列表</div>
        <el-table
          :data="
            permissonApplicationList.slice(
              (current_Page - 1) * 10,
              current_Page * 10
            )
          "
          v-loading="aplicationloading"
          size="large"
          style="width: 100%"
          :header-cell-style="{
            'text-align': 'center',
            'font-size': '1.5rem',
            background: '#3B53A1 !important',
            color: '#ffffff',
            border: 'none !important',
          }"
          :cell-style="cellStyle"
        >
          <!-- 序号（应该可选才对-目前没有） -->
          <el-table-column fixed="left" prop="indexid" label="申请编号" />

          \
          <el-table-column fixed="left" prop="username" label="人员姓名" />
          <el-table-column fixed="left" prop="telephone" label="手机号" />
          <el-table-column prop="roleName" label="人员角色" />
          <el-table-column prop="roleSystem" label="子系统名称" />
          <el-table-column prop="operateType" label="权限变更" />
          <el-table-column prop="operator" label="管理员" />
          <el-table-column fixed="right" prop="operate" label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                @click="approvedClick(refreshApproved, scope.row)"
                >同意</el-button
              >
              <el-button
                type="danger"
                @click="refusedClick(refreshRefused, scope.row)"
                >拒回</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="float-end" style="margin-bottom: 20px">
          <el-pagination
            background
            layout="->,total, prev, pager, next, jumper"
            :total="total_Records"
            :current-page="current_Page"
            :page-size="10"
            @current-change="getPermissionApplication"
          />
        </div>
        <el-alert
          id="permissonAlert"
          title="请先处理完以上权限申请事务！"
          type="error"
          center
          show-icon
          style="display: none"
          :closable="false"
        />

        <div style="font-size: 2rem; display: inline-block; float: left">
          人员权限列表
        </div>
        <el-button
          type="primary"
          @click="handleAdd()"
          plain
          style="display: inline-block; float: right"
          ><el-icon style="margin-right: 10px"><DocumentAdd /></el-icon
          >添加人员</el-button
        >
        <el-table
          :data="permissionList.slice((currentPage - 1) * 10, currentPage * 10)"
          v-loading="loading"
          border
          size="large"
          style="width: 100%"
          :header-cell-style="{
            'text-align': 'center',
            'font-size': '1.5rem',
            background: '#3B53A1 !important',
            color: '#ffffff',
            border: 'none !important',
          }"
          :cell-style="cellStyle"
        >
          <!-- 序号（应该可选才对-目前没有） -->
          <el-table-column fixed="left" prop="index" label="序号" width="90" />

          \
          <el-table-column
            fixed="left"
            prop="username"
            label="人员姓名"
            width="100"
          />
          <el-table-column
            fixed="left"
            prop="telephone"
            label="手机号"
            width="150"
          />
          <el-table-column prop="zhxz" label="突出问题管家" />
          <el-table-column prop="cyyy" label="餐饮油烟管家" />
          <el-table-column prop="ddzh" label="调度指挥管家" />
          <el-table-column prop="yczl" label="扬尘治理大数据协同管家" />
          <el-table-column prop="gxdc" label="共享单车管家" />
          <el-table-column prop="jgzm" label="景观照明集中控制管家" />
          <el-table-column prop="ggzp" label="临街店铺管家" />
          <el-table-column prop="shlj" label="智慧公厕管家" />
          <el-table-column prop="cclj" label="垃圾全生命周期管家" />
          <!-- <el-table-column prop="ljsj" label="垃圾数据归集管家" /> -->
          <el-table-column prop="cgAI" label="城管AI识别管家" />
          <el-table-column prop="szhcs" label="数字化城市信息管家" />

          <el-table-column prop="cgsyd" label="网络理政管家" />
          <el-table-column prop="hwzy" label="环卫作业运行管家" />
          <el-table-column
            fixed="right"
            prop="operate"
            label="操作"
            width="120"
          >
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="更改人员权限"
                placement="top"
              >
                <el-button
                  type="primary"
                  :icon="Edit"
                  circle
                  @click="handleClick(scope.row)"
                />
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="删除人员"
                placement="top"
              >
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  @click="handleDelete(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <div class="float-end">
          <el-pagination
            background
            layout="->,total, prev, pager, next, jumper"
            :total="totalRecords"
            :current-page="currentPage"
            :page-size="10"
            @current-change="getPermission"
          />
        </div>
      </el-dialog>

      <el-dialog
        v-model="peopleAdd"
        title="添加人员"
        width="45%"
        @close="handleClose"
      >
        <el-form
          ref="peopleFormAdd"
          :model="ruleAddForm"
          :rules="rulesAdd"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="ruleAddForm.realName" />
          </el-form-item>
          <el-form-item label="账号/手机号" prop="telephone">
            <el-input v-model="ruleAddForm.telephone" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleAddForm.password" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="peopleAdd = false">取消</el-button>
            <el-button type="primary" @click="submitAddForm(peopleFormAdd)">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog
        v-model="handleEvent"
        title="权限变更"
        width="55%"
        @close="handleClose"
      >
        <div
          style="text-align: center; font-size: x-large; font-weight: bold"
        ></div>
        <div
          style="
            font-size: 1.25rem;
            padding-left: 5rem;
            font-weight: bold;
            padding-bottom: 1rem;
          "
        >
          姓名：{{ permissonName }}&nbsp; &nbsp; &nbsp; 手机号：{{
            permissonTelephone
          }}
        </div>
        <el-form
          ref="permissionForm"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="320px"
          class="demo-ruleForm"
          v-loading="formLoading"
          id="selectForm"
        >
          <el-form-item
            label="共享单车管家"
            prop="gxdc"
            style="font-size: 2rem"
          >
            <el-checkbox-group
              v-model="radioGxdc"
              class="radioPermisson"
              @change="radioChangeGxdc"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            label="环卫作业运行管家"
            prop="hwzy"
            style="font-size: 2rem"
          >
            <el-checkbox-group
              v-model="radioHwzy"
              class="radioPermisson"
              @change="radioChangeHwzy"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 
          <el-form-item label="垃圾数据归集管家" prop="ljsj">
            <el-checkbox-group
              v-model="radioLjsj"
              class="radioPermisson"
              @change="radioChangeLjsj"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->

          <el-form-item label="城管AI识别管家" prop="cgAI">
            <el-checkbox-group
              v-model="radioCgAI"
              class="radioPermisson"
              @change="radioChangeCgAI"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="网络理政管家" prop="cgsyd">
            <el-checkbox-group
              v-model="radioCgsyd"
              class="radioPermisson"
              @change="radioChangeCgsyd"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="临街店铺管家" prop="ggzp">
            <el-checkbox-group
              v-model="radioGgzp"
              class="radioPermisson"
              @change="radioChangeGgzp"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="扬尘治理大数据协同管家" prop="yczl">
            <el-checkbox-group
              v-model="radioYczl"
              class="radioPermisson"
              @change="radioChangeYczl"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="数字化城市信息管家" prop="szhcs">
            <el-checkbox-group
              v-model="radioSzhcs"
              class="radioPermisson"
              @change="radioChangeSzhcs"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="景观照明管家" prop="jgzm">
            <el-checkbox-group
              v-model="radioJgzm"
              class="radioPermisson"
              @change="radioChangeJgzm"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="智慧公厕管家" prop="shlj">
            <el-checkbox-group
              v-model="radioShlj"
              class="radioPermisson"
              @change="radioChangeShlj"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="突出问题管家" prop="zhxz">
            <el-checkbox-group
              v-model="radioZhxz"
              class="radioPermisson"
              @change="radioChangeZhxz"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="调度指挥管家" prop="ddzh">
            <el-checkbox-group
              v-model="radioDdzh"
              class="radioPermisson"
              @change="radioChangeDdzh"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="垃圾全生命周期管家" prop="cclj">
            <el-checkbox-group
              v-model="radioCclj"
              class="radioPermisson"
              @change="radioChangeCclj"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="餐饮油烟管家" prop="cyyy">
            <el-checkbox-group
              v-model="radioCyyy"
              class="radioPermisson"
              @change="radioChangeCyyy"
            >
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleEvent = false">取消</el-button>
            <el-button type="primary" @click="submitPermisson(permissionForm)">
              提交
            </el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog
        v-model="changePasswordDialog"
        title="修改密码"
        align-center="true"
        width="30%"
      >
        <el-form :model="form" :rules="rules" ref="ruleFormRef">
          <el-form-item
            label="新密码"
            :label-width="formLabelWidth"
            prop="new_password"
          >
            <el-input
              v-model="form.new_password"
              autocomplete="off"
              type="password"
            />
          </el-form-item>
          <el-form-item
            label="再次确认密码"
            :label-width="formLabelWidth"
            prop="new_password_confirm"
          >
            <el-input
              v-model="form.new_password_confirm"
              autocomplete="off"
              type="password"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="changePasswordDialog = false">取消</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              确认修改密码
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-container>
    <!-- 底部信息栏 -->
    <el-container>
      <!-- <el-footer class="footer">
        <div class="foot-info">
          
          <li>Copyright 2022 http://zhxzzfj.XXXX.gov.cn All Rights Reserved</li>
          <li>川公网安备 XXXXXXXXXXX号 ICP备案：蜀ICP备XXXXXXXX号 网站标识码：XXXXXXXXXX</li>
          <li>主办：成都市金牛区综合行政执法局 地址：金牛区某街道某门牌号　电话：XXXX-XXXXXX</li>
        </div>
      </el-footer> -->
    </el-container>
  </el-container>
</template>

<script setup>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  DocumentAdd,
  Plus,
} from "@element-plus/icons-vue";
import { UploadProps } from "element-plus";
import { useStore } from "vuex";
const store = useStore();

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
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import MainInfo from "@/views/home/components/MainInfo.vue";
import ClassItem from "@/views/home/components/ClassItem.vue";
import Header from "@/components/Header.vue";
import {
  get,
  getDeptList,
  getSystemList,
  changePassword,
  uploadClickLog,
  getClickLog,
} from "@/api/home.js";
import { getToken, getMainSyd } from "@/api/syd";
import { getTokenGxdc, getMainGxdc, getCompany } from "@/api/gxdc";
import { params } from "@/store/store.js";
import * as echarts from "echarts";
import { getRdfx, getSjqsfx, getResourceSzcg } from "@/api/szcg.js";
import {
  getOverStandard,
  getMonitor,
  getCompanyType,
  getTouSU,
} from "@/api/yyxt";
import { getAiUrl } from "@/api/ai";
import { getMain, getCategory } from "@/api/ggzp";
import { getMainJgzm, getElectricity } from "@/api/jgzm";
import { getAllEvents, getResourceTcwt, getTrend } from "@/api/tcwt";
// import { getSitesData } from "@/api/cclj";
import { getMainLjz, getSum, getWarning } from "@/api/ljz";
// import { getCarLists, getAiAlarm } from "@/api/hwzy";
import { getCheckRate, getCntStatus } from "@/api/ddzh";
import { getCompanyDust, getOverSpeed } from "@/api/ycxt";
import moment from "moment";

import axios from "axios";

const cityRoad = reactive([]);
const trucksData = reactive([]);
const workersData = reactive([]);
const TrashData = reactive([]);
const guoShuData = reactive([]);
const hardWaresData = reactive([]);

//==============================================================================2024.04.12 告警指示灯
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
console.log(4211, warningStart);
let warningEnd = moment().format("YYYY-MM-DD");
console.log(4212, warningEnd);
let logStart = moment().startOf("month").format("YYYY-MM-DD");
let logEnd = moment().add(1, "days").format("YYYY-MM-DD");
// const tomorrow = moment()
//   .add(+1, "d")
//   .format("YYYY-MM-DD");
// const today = moment().format("YYYY-MM-DD");
let changeValue = ref(["", ""]);
let changeValueLog = ref(["", ""]);
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
  // warningEnd =  new Date();
  queryAllWarning(warningStart, warningEnd, 1);
}
function changeDateLog() {
  logStart = moment(changeValueLog.value[0]).format("YYYY-MM-DD");
  logEnd = moment(changeValueLog.value[1]).add(1, "days").format("YYYY-MM-DD");
  // warningEnd =  new Date();
  getClickLogList(selectedSys.value, logStart, logEnd, 1);
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
    defaultVisible.value = true;
  }
  // 出现事故
  if (div.style.backgroundColor == "rgb(225, 41, 17)") {
    console.log(params.username);
    defaultVisible.value = true;
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
    console.log(222, "Bearer" + params.token);
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

//四大板块的告警事件列表，如果列表不为空，则指示灯闪烁
const hjwsList = reactive([]);
const srzxList = reactive([]);
const csjgList = reactive([]);
const szcgList = reactive([]);
//每个子系统的告警事件列表
const hwzyList = reactive([]);
const ljqsmList = reactive([]);
const toiletWarningList = reactive([]);
const cyyyList = reactive([]);
const ddzhList = reactive([]);
const gxdcList = reactive([]);
const yczlList = reactive([]);
const ggzmList = reactive([]);
const ljdpList = reactive([]);
const tcwtList = reactive([]);
const cgaiList = reactive([]);
const wllzList = reactive([]);
const szhcsList = reactive([]);
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
    hjwsList.splice(0, hjwsList.length);
    ljqsmList.splice(0, ljqsmList.length);
    toiletWarningList.splice(0, toiletWarningList.length);
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
      console.log(612, data[key].systemName);
      if (
        data[key].systemName == "垃圾系统" ||
        data[key].systemName == "厕所系统"
      ) {
        hjwsList.push(default_site);
      }
      if (data[key].systemName == "垃圾系统") {
        ljqsmList.push(default_site);
      }
      if (data[key].systemName == "厕所系统") {
        toiletWarningList.push(default_site);
      }
    }

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
    if (hjwsList.length != 0) {
      document.getElementById("fourTopic-0").style.backgroundColor = "#E12911";
    } else {
      document.getElementById("fourTopic-0").style.backgroundColor = "#11e1b0";
    }

    if (ljqsmList.length != 0) {
      document.getElementById("warning-ljqsm").style.backgroundColor =
        "#E12911";
    } else {
      document.getElementById("warning-ljqsm").style.backgroundColor =
        "#11e1b0";
    }

    if (toiletWarningList.length != 0) {
      document.getElementById("warning-toilet").style.backgroundColor =
        "#E12911";
    } else {
      document.getElementById("warning-toilet").style.backgroundColor =
        "#11e1b0";
    }
  });
};
changeColor();
setInterval(changeColor, 60000);

//========================================================================================

onMounted(() => {
  init_ljqsm();
});

const init_ljqsm = async () => {
  axios({
    url: "/api/hwzy/getCityRoad?token=" + params.hwzyToken,
    method: "get",
  }).then((response) => {
    var res = response.data.data;
    console.log(res);

    for (var sensor in res) {
      var currentCar = {
        district_name: res[sensor].district_name,
        street_name: res[sensor].street_name,
        road_name: res[sensor].road_name,
        road_type: res[sensor].road_type,
      };
      cityRoad.push(currentCar);
    }
  });
  axios({
    url: "/api/hwzy/getTrucks?token=" + params.hwzyToken,
    method: "get",
  }).then((response) => {
    var res = response.data.data;
    console.log(res);

    for (var sensor in res) {
      var currentCar = {
        CAR_NAME: res[sensor].CAR_NAME,
        CMP_NAME: res[sensor].CMP_NAME,
        TEAM_NAME: res[sensor].TEAM_NAME,
        DES2: res[sensor].DES2,
        UPDATE_TIME: res[sensor].UPDATE_TIME,
      };
      trucksData.push(currentCar);
    }
  });

  axios({
    url: "/api/hwzy/getWorkers?token=" + params.hwzyToken,
    method: "get",
  }).then((response) => {
    var res = response.data.data;
    console.log(res);

    for (var sensor in res) {
      var currentCar = {
        worker_name: res[sensor].worker_name,
        worker_mobile: res[sensor].worker_mobile,
        worker_type: res[sensor].worker_type,
        worker_org: res[sensor].worker_org,
      };
      workersData.push(currentCar);
    }
  });

  axios({
    url: "/api/cclj/getTrash?token=" + params.hwzyToken,
    method: "get",
  }).then((response) => {
    var res = response.data.data;
    console.log(res);

    for (var sensor in res) {
      var currentCar = {
        district: res[sensor].district,
        street: res[sensor].street,
        house_address: res[sensor].house_address,
      };
      TrashData.push(currentCar);
    }
  });

  axios({
    url: "/api/cclj/getGuoshu?token=" + params.hwzyToken,
    method: "get",
  }).then((response) => {
    var res = response.data.data;
    console.log(res);

    for (var sensor in res) {
      var currentCar = {
        district: res[sensor].district,
        street: res[sensor].street,
        house_address: res[sensor].house_address,
      };
      guoShuData.push(currentCar);
    }
  });

  axios({
    url: "/api/cclj/getHardwares?token=" + params.hwzyToken,
    method: "get",
  }).then((response) => {
    var res = response.data.data;
    console.log(res);

    for (var sensor in res) {
      var currentCar = {
        STREET_NAME: res[sensor].STREET_NAME,
        COMMUNITY_NAME: res[sensor].COMMUNITY_NAME,
      };
      hardWaresData.push(currentCar);
    }
  });
};
init_ljqsm();

const aiUrl = ref("");
const ruleFormRef = ref(null);

const visible = ref(false);
const validatePass = (rules, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码！"));
  } else {
    if (form.new_password !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("new_password_confirm", () => null);
    }
    callback();
  }
};
//=================================================================================2023/08/16 子系统权限c
const peopleFormAdd = ref(null);
const ruleAddForm = reactive({
  realName: "",
  telephone: "",
  password: "1234567",
});
const rulesAdd = reactive({
  realName: [{ required: "true", message: "姓名不能为空", trigger: "blur" }],
  telephone: [
    { required: "true", message: "账号/手机号不能为空", trigger: "blur" },
  ],
  password: [{ required: "true", message: "密码不能为空", trigger: "blur" }],
});
const submitAddForm = async () => {
  if (!peopleFormAdd) return;

  peopleFormAdd.value.validate((valid) => {
    if (valid) {
      var telph = ruleAddForm.telephone;
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
        url: "/api/auth/register",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + params.token,
        },
        data: JSON.stringify({
          name: Number(ruleAddForm.telephone),
          password: Number(ruleAddForm.password),
          realName: ruleAddForm.realName,
          telephone: Number(ruleAddForm.telephone),
        }),
        method: "post",
      }).then(function (resp) {
        console.log(2, resp);
        if (resp.data) {
          alert("提交成功！");
          peopleAdd.value = false;
          loading.value = true;
          console.log("lastPage" + lastPage);

          getPermissionList(lastPage);
        } else {
          alert("提交失败！");
        }
      });

      console.log("submit!");
    } else {
      return false;
    }
  });
};
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
          systemPermisson.push("照明管家（新）");
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
          systemPermisson.push("照明管家（新）");
        } else if (roleList[key].system == "垃圾全生命周期管家") {
          systemPermisson.push("垃圾全生命周期管家");
        } else if (roleList[key].system == "智慧公厕管家") {
          systemPermisson.push("智慧公厕管家");
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

//=========================================================================2023/08/08 管理员管理人员访问子系统的权限
const checkAll = ref(false);
const isIndeterminate = ref(true);
//=================================================================多选框测试
// const checkedCities = ref([]);
const cities = ["浏览信息", "管理参数", "操作系统"];

//===============================================================================
const permissionList = reactive([]);
const showSuperAdmin = reactive([]);
const permissonApplicationList = reactive([]);
const resetPasswordList = reactive([]);
const clickLogList = reactive([]);
const logListView = reactive([]);

const loading = ref(true);
const aplicationloading = ref(true);
const formLoading = ref(true);
const totalRecords = ref(1000);
let currentPage = ref(1);
let pageCount = 0;
let lastPage = 0;
const total_Records = ref(1000);
let current_Page = ref(1);
let page_Count = 0;
const total_Records_reset = ref(1000);
let current_Page_reset = ref(1);
let page_Count_reset = 0;
const total_Records_clickLog = ref(1000);
let current_Page_clickLog = ref(1);
let page_Count_clickLog = 0;
const permissionForm = ref(null);
const handleEvent = ref(false);
const peopleAdd = ref(false);
const permissonName = ref("");
const applicationId = ref("");
const permissonTelephone = ref("");
let currentRowPage = ref(0);
const radioGxdc = ref([]);
const radioHwzy = ref([]);
const radioLjsj = ref([]);
const radioCgAI = ref([]);
const radioCgsyd = ref([]);
const radioGgzp = ref([]);
const radioYczl = ref([]);
const radioSzhcs = ref([]);
const radioJgzm = ref([]);
const radioShlj = ref([]);
const radioZhxz = ref([]);
const radioDdzh = ref([]);
const radioCclj = ref([]);
const radioCyyy = ref([]);
const permissonGxdc = ref("");
const oldRadioGxdc = ref([]);
const checkGxdc = ref(false);
const permissonHwzy = ref("");
const oldRadioHwzy = ref([]);
const checkHwzy = ref(false);
const permissonLjsj = ref("");
const oldRadioLjsj = ref([]);
const checkLjsj = ref(false);
const permissonCgAI = ref("");
const oldRadioCgAI = ref([]);
const checkCgAI = ref(false);
const permissonCgsyd = ref("");
const oldRadioCgsyd = ref([]);
const checkCgsyd = ref(false);
const permissonGgzp = ref("");
const oldRadioGgzp = ref([]);
const checkGgzp = ref(false);
const permissonYczl = ref("");
const oldRadioYczl = ref([]);
const checkYczl = ref(false);
const permissonSzhcs = ref("");
const oldRadioSzhcs = ref([]);
const checkSzhcs = ref(false);
const permissonJgzm = ref("");
const oldRadioJgzm = ref([]);
const checkJgzm = ref(false);
const permissonShlj = ref("");
const oldRadioShlj = ref([]);
const checkShlj = ref(false);
const permissonZhxz = ref("");
const oldRadioZhxz = ref([]);
const checkZhxz = ref(false);
const permissonDdzh = ref("");
const oldRadioDdzh = ref([]);
const checkDdzh = ref(false);
const permissonCclj = ref("");
const oldRadioCclj = ref([]);
const checkCclj = ref(false);
const permissonCyyy = ref("");
const oldRadioCyyy = ref([]);
const checkCyyy = ref(false);
//
const ruleForm = reactive({
  gxdc: false,
  ljsj: false,
  cgAI: false,
  cgsyd: false,
  ggzp: false,
  yczl: false,
  szhcs: false,
  jgzm: false,
  shlj: false,
  zhxz: false,
  ddzh: false,
  cclj: false,
  cyyy: false,
});
const permissonAlert = ref(false);

const clickLogDialog = ref(false);
const selectedSys = ref("城市管家");
const sysOptions = [
  { value: "共享单车管家", label: "共享单车管家" },
  { value: "智慧公厕管家", label: "智慧公厕管家" },
  { value: "城管AI识别管家", label: "城管AI识别管家" },
  { value: "网络理政管家", label: "网络理政管家" },
  { value: "临街店铺管家", label: "临街店铺管家" },
  { value: "扬尘治理大数据协同管家", label: "扬尘治理大数据协同管家" },
  { value: "数字化城市信息管家", label: "数字化城市信息管家" },
  { value: "景观照明管家", label: "景观照明管家" },
  { value: "照明管家（新）", label: "照明管家（新）" },
  { value: "生活垃圾转运处理管家", label: "生活垃圾转运处理管家" },
  { value: "调度指挥管家", label: "调度指挥管家" },
  { value: "垃圾全生命周期管家", label: "垃圾全生命周期管家" },
  { value: "餐饮油烟管家", label: "餐饮油烟管家" },
  { value: "环卫作业运行管家", label: "环卫作业运行管家" },
  { value: "突出问题管家", label: "突出问题管家" },
  { value: "城市管家", label: "城市管家" },
  { value: "餐厨收运管家", lable: "餐厨收运管家"},
];

const handleSelectSysChange= () => {
  getClickLogList(selectedSys.value, logStart, logEnd, 1);
};

const showClickLog = async () => {
  try {
    clickLogDialog.value = true;
    getClickLogList(selectedSys.value, logStart, logEnd, 1);
  } catch (error) {
    console.log("showClickLog:  " + error);
  }
};
const getClickLogList = (sys, start, end, pageNum) => {
  var realUrl = "";
  if (sys == "城市管家") {
    realUrl = "/api/click-log/get?start=" + start + "&end=" + end + "&page=" + pageNum + "&pageSize=10";
  } else if (sys == "餐饮油烟管家") {
    realUrl = "/youyan/external/GetAuditLog?token=jinniuqu&page=" + pageNum + "&limit=10&start=" + start + "&end=" + end;
  } else if (sys == "临街店铺管家") {
    realUrl = "/linjie/sign/GetAuditLog?token=jinniuqu&page=" + pageNum + "&limit=10&start=" + start + "&end=" + end;
  } else if (sys == "智慧公厕管家") {
    realUrl = "/toilet/api/log-view/getLogHistory?start=" + start + "&end=" + end + "&pageNum=" + pageNum + "&pageSize=10";
  } else if (sys == "共享单车管家") {
    realUrl = "/bicycle/admin/csgj/logs?page=" + pageNum + "&pageSize=10start=" + start + "&end=" + end + "&token=69883f88658aee26b22230df475e9a89";
  } else if (sys == "网络理政管家") {
    realUrl = "/syd/prod-api/sys/logs?start=" + start + "&end=" + end + "&page=" + pageNum + "&pageSize=10";
  } else if (sys == "照明管家（新）") {
    realUrl = "/jgzm/light/click-log/get/?start=" + start + "&end=" + end + "&page=" + pageNum + "&page_size=10";
  } else if (sys == "环卫作业运行管家") {
    realUrl = "/hw/api/logs/huanwei";
  } else if (sys == "垃圾全生命周期管家") {
    realUrl = "/qsm/api/logs/quansm";
  } else if (sys == "餐厨收运管家") {
    realUrl = "/cc/api/logs/cancu";
  }
  console.log("log realUrl:" + realUrl);
  var request;
  if (sys == "环卫作业运行管家" || sys == "垃圾全生命周期管家" || sys == "餐厨收运管家") {
    request = axios({
      // url: "/api/lzj/getWarning",
      url: realUrl,
      method: "post",
      data: JSON.parse(
        JSON.stringify({
          start: start,
          end: end,
          access_token: params.hwzyToken,
          page: pageNum,
          pageSize: 10,
        })
      ),
    });
  } else {
    let headers = {};
    if (sys == "城市管家") {
      headers.Authorization = "Bearer " + params.token;
    }
    request = axios({
      // url: "/api/lzj/getWarning",
      url: realUrl,
      method: "get",
      headers: headers,
    });
  }

  request.then((resp) => {
    if (sys != "城市管家") {
      console.log("clickLogList:" + JSON.stringify(resp, null, 2));
    }
    var data = resp.data.data;
    
    if (sys == "共享单车管家") {
      data = resp.data.result.data;
    } else if (sys == "环卫作业运行管家" || sys == "垃圾全生命周期管家" || sys == "餐厨收运管家") {
      data = resp.data.data.lists;
    } else if (sys == "网络理政管家") {
      data = resp.data.data.contentData;
    } else if (sys == "智慧公厕管家") {
      data = resp.data.data.records;
    } else if (sys == "城市管家") {
      data = resp.data.data.list;
    }
    clickLogList.splice(0, clickLogList.length);
    for (var key in data) {
      var operation = "点击";
      if (sys != "城市管家") {
        operation = data[key].operation;
      }
      var clickLog = {
        realName: data[key].realName,
        phone: data[key].phone,
        subsystem: data[key].subsystem,
        clickTime: data[key].clickTime,
        operation: operation,
      };
      clickLogList.push(clickLog);
    }
    //console.log("clickLogList:" + data);
    total_Records_clickLog.value = clickLogList.length;
    page_Count_clickLog = parseInt(clickLogList.length) % 10;
    if (sys == "共享单车管家") {
      total_Records_clickLog.value = resp.data.result.count;
      page_Count_clickLog = parseInt(resp.data.result.count) % 10;
    } else if (sys == "环卫作业运行管家" || sys == "垃圾全生命周期管家" || sys == "餐厨收运管家") {
      total_Records_clickLog.value = resp.data.data.total;
      page_Count_clickLog = parseInt(resp.data.data.total) % 10;
    }  else if (sys == "网络理政管家") {
      total_Records_clickLog.value = resp.data.data.totalSize;
      page_Count_clickLog = parseInt(resp.data.data.totalSize) % 10;
    } else if (sys == "照明管家（新）") {
      total_Records_clickLog.value = resp.data.total;
      page_Count_clickLog = parseInt(resp.data.total) % 10;
    } else if (sys == "智慧公厕管家") {
      total_Records_clickLog.value = resp.data.data.total;
      page_Count_clickLog = parseInt(resp.data.data.total) % 10;
    } else if (sys == "城市管家") {
      total_Records_clickLog.value = resp.data.data.total;
      page_Count_clickLog = parseInt(resp.data.data.total) % 10;
    } else if (sys == "临街店铺管家" || sys == "餐饮油烟管家") {
      total_Records_clickLog.value = resp.data.total;
      page_Count_clickLog = parseInt(resp.data.total) % 10;
    }
    if (clickLogList.length > (pageNum - 1) * 10) {
      logListView.splice(0, logListView.length, ...clickLogList.slice(
              (pageNum - 1) * 10,
              pageNum * 10
            ));
    } else {
      logListView.splice(0, logListView.length, ...clickLogList);
    }
    current_Page_clickLog.value = pageNum;
  });
};
const getClickLogApplication = (pageNum) => {
  // 当前页
  current_Page_clickLog.value = pageNum;
  if (selectedSys.value == "共享单车管家" || 
      selectedSys.value == "环卫作业运行管家" || 
      selectedSys.value == "垃圾全生命周期管家" || 
      selectedSys.value == "餐厨收运管家" ||
      selectedSys.value == "网络理政管家" || 
      selectedSys.value == "照明管家（新）" || 
      selectedSys.value == "智慧公厕管家" ||
      selectedSys.value == "城市管家" ||
      selectedSys.value == "临街店铺管家" ||
      selectedSys.value == "餐饮油烟管家") {
    getClickLogList(selectedSys.value, logStart, logEnd, pageNum);
  } else {
    logListView.splice(0, logListView.length, ...clickLogList.slice(
      (pageNum - 1) * 10,
      pageNum * 10
    ));
  }
};

//-----------------------------------------------------------------sunny 090/07 密码重设列表
const getResetPasswordList = (pageNum) => {
  axios({
    // url: "/api/lzj/getWarning",
    url: "/api/auth/all_permission",
    method: "get",
    headers: {
      Authorization: "Bearer " + params.token,
    },
  }).then(async (resp) => {
    var data = resp.data;
    resetPasswordList.splice(0, resetPasswordList.length);
    console.log("人员列表:" + data);

    for (var key in data) {
      var resetPassword = {
        realName: data[key].realName,
        telephone: data[key].telephone,
      };
      resetPasswordList.push(resetPassword);
    }
    total_Records_reset.value = resetPasswordList.length;
    page_Count_reset = parseInt(resetPasswordList.length) % 10;
    current_Page_reset.value = pageNum;
  });
};
// getPermissonApplicationListList(1);
setInterval(getResetPasswordList(1), 60000);
const getResetPasswordApplication = (pageNum) => {
  // 当前页
  current_Page_reset.value = pageNum;
};

const resetPassword = (row) => {
  console.log("人员姓名：" + row.realName + "电话：" + row.telephone);
  axios({
    // url: "/api/lzj/getWarning",
    url: "/api/auth/admin_change_password",
    method: "post",
    headers: {
      Authorization: "Bearer " + params.token,
    },
    data: JSON.parse(
      JSON.stringify({
        name: row.telephone,
        password: "1234567",
      })
    ),
  }).then(async (resp) => {
    if (resp.data == true) {
      ElMessage({
        type: "success",
        message: "密码重置成功！",
      });
    } else {
      ElMessage({
        type: "error",
        message: "密码重置失败！",
      });
    }
  });
};
//-----------------------------------------------------------------sunny 090/07 密码重设列表

const getPermissonApplicationListList = (pageNum) => {
  axios({
    url: "/api/auth/get_permission_applications",
    method: "get",
    headers: {
      Authorization: "Bearer " + params.token,
    },
  }).then(function (resp) {
    permissonApplicationList.splice(0, permissonApplicationList.length);
    var data = resp.data;
    console.log(111, data);

    console.log("resp.code：" + data);
    for (var key in data) {
      if (data[key].reviewed == false) {
        var permission_list = {
          indexid: data[key].id,
          username: data[key].realName,
          telephone: data[key].telephone,
          roleName: data[key].roleName,
          roleSystem: data[key].roleSystem,
          operator: data[key].operator,
          operateType: data[key].operateType,
        };
        if (data[key].operateType == "add") {
          permission_list.operateType = "添加";
        } else if (data[key].operateType == "delete") {
          permission_list.operateType = "删除";
        }
        if (data[key].roleName == "viewer") {
          permission_list.roleName = "浏览信息";
        } else if (data[key].roleName == "operator") {
          permission_list.roleName = "操作系统";
        } else if (data[key].roleName == "admin") {
          permission_list.roleName = "管理参数";
        }
        permissonApplicationList.push(permission_list);
      }
    }
    total_Records.value = permissonApplicationList.length;
    page_Count = parseInt(permissonApplicationList.length) % 10;
    current_Page.value = pageNum;
    aplicationloading.value = false;
    var div = document.getElementById("permissonAlert");
    if (permissonApplicationList.length == 0) {
      div.style.display = "none";
    }
  });
};
// getPermissonApplicationListList(1);
setInterval(getPermissonApplicationListList(1), 60000);
const getPermissionApplication = (pageNum) => {
  // 当前页
  current_Page.value = pageNum;
};

const approvedClick = (callback, row) => {
  applicationId.value = row.indexid;
  axios({
    url: "/api/auth/approve_application/" + applicationId.value,
    method: "get",
    headers: {
      Authorization: "Bearer " + params.token,
    },
  }).then(function (resp) {
    aplicationloading.value = true;
    loading.value = true;
    getPermissionList(1);
    getPermissonApplicationListList(1);
  });
  callback();
};
const refreshApproved = () => {
  if (aplicationloading.value == false) {
    ElMessage({
      message: "权限更改成功！",
      type: "success",
    });
  }
};
const refreshRefused = () => {
  if (aplicationloading.value == false) {
    ElMessage({
      message: "权限更改已拒回！",
      type: "success",
    });
  }
};
const refusedClick = (callback, row) => {
  applicationId.value = row.indexid;
  axios({
    url: "/api/auth/refuse_application/" + applicationId.value,
    method: "get",
    headers: {
      Authorization: "Bearer " + params.token,
    },
  }).then(function (resp) {
    aplicationloading.value = true;
    loading.value = true;
    getPermissionList(1);
    getPermissonApplicationListList(1);
  });
  callback();
};

const getPermissionList = (pageNum) => {
  axios({
    // url: "/api/lzj/getWarning",
    url: "/api/auth/non_super_admin_list",
    method: "get",
    headers: {
      Authorization: "Bearer " + params.token,
    },
  }).then(async (resp) => {
    permissionList.splice(0, permissionList.length);
    var data = resp.data;
    // console.log(111, data);

    // console.log("data.code：" + data);
    var realName = ref("");
    var telephone = ref("");

    for (var key in data) {
      realName.value = data[key].realName;
      telephone.value = data[key].telephone;

      var permission_list = {
        index: Number(key) + 1,
        username: data[key].realName,
        telephone: data[key].telephone,
        gxdc: "×",
        ljsj: "×",
        cgAI: "×",
        cgsyd: "×",
        ggzp: "×",
        yczl: "×",
        szhcs: "×",
        jgzm: "×",
        shlj: "×",
        zhxz: "×",
        ddzh: "×",
        cclj: "×",
        cyyy: "×",
        hwzy: "x",
      };
      var roleList = data[key].roleList;
      for (var index in roleList) {
        var finishied = false;
        if (roleList[index].system == "all") {
          permission_list.cyyy = "√";
          permission_list.gxdc = "√";
          permission_list.ljsj = "√";
          permission_list.cgAI = "√";
          permission_list.cgsyd = "√";
          permission_list.ggzp = "√";
          permission_list.yczl = "√";
          permission_list.szhcs = "√";
          permission_list.jgzm = "√";
          permission_list.shlj = "√";
          permission_list.zhxz = "√";
          permission_list.cclj = "√";
          permission_list.ddzh = "√";
          permission_list.hwzy = "√";
        }
        if (roleList[index].system == "共享单车管家") {
          permission_list.gxdc = "√";
        }
        if (roleList[index].system == "环卫作业管家") {
          permission_list.hwzy = "√";
        }
        // if (roleList[index].system == "垃圾数据归集管家") {
        //   permission_list.ljsj = "√";
        // }
        if (roleList[index].system == "城管AI识别管家") {
          permission_list.cgAI = "√";
        }
        if (roleList[index].system == "网络理政管家") {
          permission_list.cgsyd = "√";
        }
        if (roleList[index].system == "广告招牌二维码管家") {
          permission_list.ggzp = "√";
        }
        if (roleList[index].system == "扬尘治理大数据协同管家") {
          permission_list.yczl = "√";
        }
        if (roleList[index].system == "数字化城市信息管家") {
          permission_list.szhcs = "√";
        }
        if (roleList[index].system == "景观照明集中控制管家") {
          permission_list.jgzm = "√";
        }
        if (roleList[index].system == "智慧公厕管家") {
          permission_list.shlj = "√";
        }
        if (roleList[index].system == "突出问题管家") {
          permission_list.zhxz = "√";
        }
        if (roleList[index].system == "调度指挥管家") {
          permission_list.ddzh = "√";
        }
        if (roleList[index].system == "垃圾全生命周期管家") {
          permission_list.cclj = "√";
        }
        if (roleList[index].system == "餐饮油烟管家") {
          permission_list.cyyy = "√";
        }
      }
      await axios({
        // url: "/api/lzj/getWarning",
        url: "/api/auth/get_self_permission_applications",
        method: "get",
        headers: {
          Authorization: "Bearer " + params.token,
        },
      }).then((data) => {
        var resp = data.data;
        for (var i in resp) {
          if (realName.value == resp[i].realName) {
            if (resp[i].operateType == "delete") {
              if (resp[i].roleSystem == "共享单车管家") {
                permission_list.gxdc = "×(待定)";
              }
              if (resp[i].roleSystem == "环卫作业管家") {
                permission_list.hwzy = "×(待定)";
              }
              // if (resp[i].roleSystem == "垃圾数据归集管家") {
              //   permission_list.ljsj = "×(待定)";
              // }
              if (resp[i].roleSystem == "城管AI识别管家") {
                permission_list.cgAI = "×(待定)";
              }
              if (resp[i].roleSystem == "网络理政管家") {
                permission_list.cgsyd = "×(待定)";
              }
              if (resp[i].roleSystem == "广告招牌二维码管家") {
                permission_list.ggzp = "×(待定)";
              }
              if (resp[i].roleSystem == "扬尘治理大数据协同管家") {
                permission_list.yczl = "×(待定)";
              }
              if (resp[i].roleSystem == "数字化城市信息管家") {
                permission_list.szhcs = "×(待定)";
              }
              if (resp[i].roleSystem == "景观照明集中控制管家") {
                permission_list.jgzm = "×(待定)";
              }
              if (resp[i].roleSystem == "智慧公厕管家") {
                permission_list.shlj = "×(待定)";
              }
              if (resp[i].roleSystem == "突出问题管家") {
                permission_list.zhxz = "×(待定)";
              }
              if (resp[i].roleSystem == "调度指挥管家") {
                permission_list.ddzh = "×(待定)";
              }
              if (resp[i].roleSystem == "垃圾全生命周期管家") {
                permission_list.cclj = "×(待定)";
              }
              if (resp[i].roleSystem == "餐饮油烟管家") {
                permission_list.cyyy = "×(待定)";
              }
            } else if (resp[i].operateType == "add") {
              if (resp[i].roleSystem == "共享单车管家") {
                permission_list.gxdc = "√(待定)";
              }
              if (resp[i].roleSystem == "环卫作业管家") {
                permission_list.hwzy = "√(待定)";
              }
              // if (resp[i].roleSystem == "垃圾数据归集管家") {
              //   permission_list.ljsj = "√(待定)";
              // }
              if (resp[i].roleSystem == "城管AI识别管家") {
                permission_list.cgAI = "√(待定)";
              }
              if (resp[i].roleSystem == "网络理政管家") {
                permission_list.cgsyd = "√(待定)";
              }
              if (resp[i].roleSystem == "广告招牌二维码管家") {
                permission_list.ggzp = "√(待定)";
              }
              if (resp[i].roleSystem == "扬尘治理大数据协同管家") {
                permission_list.yczl = "√(待定)";
              }
              if (resp[i].roleSystem == "数字化城市信息管家") {
                permission_list.szhcs = "√(待定)";
              }
              if (resp[i].roleSystem == "景观照明集中控制管家") {
                permission_list.jgzm = "√(待定)";
              }
              if (resp[i].roleSystem == "智慧公厕管家") {
                permission_list.shlj = "√(待定)";
              }
              if (resp[i].roleSystem == "突出问题管家") {
                permission_list.zhxz = "√(待定)";
              }
              if (resp[i].roleSystem == "调度指挥管家") {
                permission_list.ddzh = "√(待定)";
              }
              if (resp[i].roleSystem == "垃圾全生命周期管家") {
                permission_list.cclj = "√(待定)";
              }
              if (resp[i].roleSystem == "餐饮油烟管家") {
                permission_list.cyyy = "√(待定)";
              }
            }
          }
        }
      });
      permissionList.push(permission_list);
    }
    totalRecords.value = permissionList.length;
    pageCount = parseInt(permissionList.length) % 10;
    // 计算最后一页的页码
    lastPage = Math.ceil(totalRecords.value / 10);
    console.log("lastPage:" + lastPage);
    currentPage.value = pageNum;
    loading.value = false;
  });
};
// getPermissionList(1);
setInterval(getPermissionList(1), 60000);

const getPermission = (pageNum) => {
  // 当前页
  currentPage.value = pageNum;
};

const handleDelete = (row) => {
  console.log("length:" + permissonApplicationList.length);
  currentRowPage = Math.ceil((row.index - 1) / 10);
  var div = document.getElementById("permissonAlert");
  if (permissonApplicationList.length != 0) {
    console.log("div.style.display" + div.style.display);
    div.style.display = "flex";
  } else {
    ElMessageBox.confirm("是否删除该人员?", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "提示",
    })
      .then(() => {
        console.log("row.username:" + row.telephone);
        axios({
          url: "/api/auth/delete_user/" + row.telephone,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + params.token,
          },
          method: "get",
        }).then(function (resp) {
          console.log(2, resp);
          loading.value = true;
          getPermissionList(currentRowPage);

          ElMessage({
            type: "success",
            message: "删除成功！",
          });
          console.log("我管理员" + params.username + "删除" + row.telephone);
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除！",
        });
      });
  }
};

const handleAdd = () => {
  peopleAdd.value = true;
};
const handleClick = (row) => {
  console.log("所在行：" + row.index);
  currentRowPage = Math.ceil((row.index + 1) / 10);

  console.log("length:" + permissonApplicationList.length);
  var div = document.getElementById("permissonAlert");
  if (permissonApplicationList.length != 0) {
    console.log("div.style.display" + div.style.display);
    div.style.display = "flex";
  } else {
    div.style.display = "none";
    formLoading.value = true;
    permissonName.value = row.username;
    permissonTelephone.value = row.telephone;
    console.log("permissonTelephone:" + permissonTelephone.value);
    handleEvent.value = true;
    radioGxdc.value = [];
    radioHwzy.value = [];
    radioLjsj.value = [];
    radioCgAI.value = [];
    radioCgsyd.value = [];
    radioGgzp.value = [];
    radioYczl.value = [];
    radioSzhcs.value = [];
    radioJgzm.value = [];
    radioShlj.value = [];
    radioZhxz.value = [];
    radioDdzh.value = [];
    radioCclj.value = [];
    radioCyyy.value = [];

    axios({
      // url: "/api/lzj/getWarning",
      url: "/api/auth/non_super_admin_list",
      method: "get",
      headers: {
        Authorization: "Bearer " + params.token,
      },
    }).then(async (resp) => {
      var data = resp.data;

      for (var key in data) {
        if (data[key].telephone == permissonTelephone.value) {
          var roleList = data[key].roleList;
          for (var index in roleList) {
            if (roleList[index].system == "all") {
              radioGxdc.value = ["浏览信息"];
              radioHwzy.value = ["浏览信息"];
              radioLjsj.value = ["浏览信息"];
              radioCgAI.value = ["浏览信息"];
              radioCgsyd.value = ["浏览信息"];
              radioGgzp.value = ["浏览信息"];
              radioYczl.value = ["浏览信息"];
              radioSzhcs.value = ["浏览信息"];
              radioJgzm.value = ["浏览信息"];
              radioShlj.value = ["浏览信息"];
              radioZhxz.value = ["浏览信息"];
              radioDdzh.value = ["浏览信息"];
              radioCclj.value = ["浏览信息"];
              radioCyyy.value = ["浏览信息"];

              // ElMessage({
              //   message: "您不可更改该用户权限！",
              //   type: "warning",
              // });
            } else {
              if (roleList[index].system == "共享单车管家") {
                if (roleList[index].name == "viewer") {
                  radioGxdc.value = ["浏览信息"];
                  oldRadioGxdc.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioGxdc.value = ["浏览信息", "管理参数"];
                  oldRadioGxdc.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioGxdc.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioGxdc.value = "operator";
                }
                permissonGxdc.value = oldRadioGxdc.value;
              }
              if (roleList[index].system == "环卫作业管家") {
                if (roleList[index].name == "viewer") {
                  radioHwzy.value = ["浏览信息"];
                  oldRadioHwzy.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioHwzy.value = ["浏览信息", "管理参数"];
                  oldRadioHwzy.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioHwzy.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioHwzy.value = "operator";
                }
                permissonHwzy.value = oldRadioHwzy.value;
              }
              // if (roleList[index].system == "垃圾数据归集管家") {
              //   if (roleList[index].name == "viewer") {
              //     radioLjsj.value = ["浏览信息"];
              //     oldRadioLjsj.value = "viewer";
              //   }
              //   if (roleList[index].name == "admin") {
              //     radioLjsj.value = ["浏览信息", "管理参数"];
              //     oldRadioLjsj.value = "admin";
              //   }
              //   if (roleList[index].name == "operator") {
              //     radioLjsj.value = ["浏览信息", "管理参数", "操作系统"];
              //     oldRadioLjsj.value = "operator";
              //   }
              //   permissonLjsj.value = oldRadioLjsj.value;
              // }

              if (roleList[index].system == "城管AI识别管家") {
                if (roleList[index].name == "viewer") {
                  radioCgAI.value = ["浏览信息"];
                  oldRadioCgAI.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioCgAI.value = ["浏览信息", "管理参数"];
                  oldRadioCgAI.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioCgAI.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioCgAI.value = "operator";
                }
                permissonCgAI.value = oldRadioCgAI.value;
              }
              if (roleList[index].system == "网络理政管家") {
                if (roleList[index].name == "viewer") {
                  radioCgsyd.value = ["浏览信息"];
                  oldRadioCgsyd.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioCgsyd.value = ["浏览信息", "管理参数"];
                  oldRadioCgsyd.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioCgsyd.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioCgsyd.value = "operator";
                }
                permissonCgsyd.value = oldRadioCgsyd.value;
              }
              if (roleList[index].system == "广告招牌二维码管家") {
                if (roleList[index].name == "viewer") {
                  radioGgzp.value = ["浏览信息"];
                  oldRadioGgzp.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioGgzp.value = ["浏览信息", "管理参数"];
                  oldRadioGgzp.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioGgzp.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioGgzp.value = "operator";
                }
                permissonGgzp.value = oldRadioGgzp.value;
              }
              if (roleList[index].system == "扬尘治理大数据协同管家") {
                if (roleList[index].name == "viewer") {
                  radioYczl.value = ["浏览信息"];
                  oldRadioYczl.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioYczl.value = ["浏览信息", "管理参数"];
                  oldRadioYczl.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioYczl.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioYczl.value = "operator";
                }
                permissonYczl.value = oldRadioYczl.value;
              }
              if (roleList[index].system == "数字化城市信息管家") {
                if (roleList[index].name == "viewer") {
                  radioSzhcs.value = ["浏览信息"];
                  oldRadioSzhcs.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioSzhcs.value = ["浏览信息", "管理参数"];
                  oldRadioSzhcs.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioSzhcs.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioSzhcs.value = "operator";
                }
                permissonSzhcs.value = oldRadioSzhcs.value;
              }
              if (roleList[index].system == "景观照明集中控制管家") {
                if (roleList[index].name == "viewer") {
                  radioJgzm.value = ["浏览信息"];
                  oldRadioJgzm.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioJgzm.value = ["浏览信息", "管理参数"];
                  oldRadioJgzm.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioJgzm.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioJgzm.value = "operator";
                }
                permissonJgzm.value = oldRadioJgzm.value;
              }
              if (roleList[index].system == "智慧公厕管家") {
                if (roleList[index].name == "viewer") {
                  radioShlj.value = ["浏览信息"];
                  oldRadioShlj.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioShlj.value = ["浏览信息", "管理参数"];
                  oldRadioShlj.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioShlj.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioShlj.value = "operator";
                }
                permissonShlj.value = oldRadioShlj.value;
              }
              if (roleList[index].system == "突出问题管家") {
                if (roleList[index].name == "viewer") {
                  radioZhxz.value = ["浏览信息"];
                  oldRadioZhxz.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioZhxz.value = ["浏览信息", "管理参数"];
                  oldRadioZhxz.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioZhxz.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioZhxz.value = "operator";
                }
                permissonZhxz.value = oldRadioZhxz.value;
              }
              if (roleList[index].system == "调度指挥管家") {
                if (roleList[index].name == "viewer") {
                  radioDdzh.value = ["浏览信息"];
                  oldRadioDdzh.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioDdzh.value = ["浏览信息", "管理参数"];
                  oldRadioDdzh.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioDdzh.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioDdzh.value = "operator";
                }
                permissonDdzh.value = oldRadioDdzh.value;
              }
              if (roleList[index].system == "垃圾全生命周期管家") {
                if (roleList[index].name == "viewer") {
                  radioCclj.value = ["浏览信息"];
                  oldRadioCclj.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioCclj.value = ["浏览信息", "管理参数"];
                  oldRadioCclj.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioCclj.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioCclj.value = "operator";
                }
                permissonCclj.value = oldRadioCclj.value;
              }
              if (roleList[index].system == "餐饮油烟管家") {
                if (roleList[index].name == "viewer") {
                  radioCyyy.value = ["浏览信息"];
                  oldRadioCyyy.value = "viewer";
                }
                if (roleList[index].name == "admin") {
                  radioCyyy.value = ["浏览信息", "管理参数"];
                  oldRadioCyyy.value = "admin";
                }
                if (roleList[index].name == "operator") {
                  radioCyyy.value = ["浏览信息", "管理参数", "操作系统"];
                  oldRadioCyyy.value = "operator";
                }
                permissonCyyy.value = oldRadioCyyy.value;
              }
            }
          }
          await axios({
            // url: "/api/lzj/getWarning",
            url: "/api/auth/get_self_permission_applications",
            method: "get",
            headers: {
              Authorization: "Bearer " + params.token,
            },
          }).then((data) => {
            var roleList = data.data;
            for (var index in roleList) {
              if (permissonTelephone.value == roleList[index].telephone) {
                console.log(
                  "roleList[index].telephone:" + roleList[index].telephone
                );
                if (roleList[index].roleSystem == "共享单车管家") {
                  radioGxdc.value = [];
                  if (roleList[index].operateType == "add") {
                    if (roleList[index].roleName == "viewer") {
                      radioGxdc.value = ["浏览信息"];
                      oldRadioGxdc.value = "viewer";
                    }
                    if (roleList[index].roleName == "admin") {
                      radioGxdc.value = ["浏览信息", "管理参数"];
                      oldRadioGxdc.value = "admin";
                    }
                    if (roleList[index].roleName == "operator") {
                      radioGxdc.value = ["浏览信息", "管理参数", "操作系统"];
                      oldRadioGxdc.value = "operator";
                    }
                    permissonGxdc.value = oldRadioGxdc.value;
                  }
                }
                if (roleList[index].roleSystem == "环卫作业管家") {
                  radioHwzy.value = [];
                  if (roleList[index].operateType == "add") {
                    if (roleList[index].roleName == "viewer") {
                      radioHwzy.value = ["浏览信息"];
                      oldRadioHwzy.value = "viewer";
                    }
                    if (roleList[index].roleName == "admin") {
                      radioHwzy.value = ["浏览信息", "管理参数"];
                      oldRadioHwzy.value = "admin";
                    }
                    if (roleList[index].roleName == "operator") {
                      radioHwzy.value = ["浏览信息", "管理参数", "操作系统"];
                      oldRadioHwzy.value = "operator";
                    }
                    permissonHwzy.value = oldRadioHwzy.value;
                  }
                }
                // if (roleList[index].roleSystem == "垃圾数据归集管家") {
                //   radioLjsj.value = [];
                //   if (roleList[index].roleName == "viewer") {
                //     radioLjsj.value = ["浏览信息"];
                //     oldRadioLjsj.value = "viewer";
                //   }
                //   if (roleList[index].roleName == "admin") {
                //     radioLjsj.value = ["浏览信息", "管理参数"];
                //     oldRadioLjsj.value = "admin";
                //   }
                //   if (roleList[index].roleName == "operator") {
                //     radioLjsj.value = ["浏览信息", "管理参数", "操作系统"];
                //     oldRadioLjsj.value = "operator";
                //   }
                //   permissonLjsj.value = oldRadioLjsj.value;
                // }
                if (roleList[index].roleSystem == "城管AI识别管家") {
                  radioCgAI.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioCgAI.value = ["浏览信息"];
                    oldRadioCgAI.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioCgAI.value = ["浏览信息", "管理参数"];
                    oldRadioCgAI.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioCgAI.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioCgAI.value = "operator";
                  }
                  permissonCgAI.value = oldRadioCgAI.value;
                }
                if (roleList[index].roleSystem == "网络理政管家") {
                  radioCgsyd.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioCgsyd.value = ["浏览信息"];
                    oldRadioCgsyd.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioCgsyd.value = ["浏览信息", "管理参数"];
                    oldRadioCgsyd.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioCgsyd.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioCgsyd.value = "operator";
                  }
                  permissonCgsyd.value = oldRadioCgsyd.value;
                }
                if (roleList[index].roleSystem == "广告招牌二维码管家") {
                  radioGgzp.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioGgzp.value = ["浏览信息"];
                    oldRadioGgzp.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioGgzp.value = ["浏览信息", "管理参数"];
                    oldRadioGgzp.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioGgzp.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioGgzp.value = "operator";
                  }
                  permissonGgzp.value = oldRadioGgzp.value;
                }
                if (roleList[index].roleSystem == "扬尘治理大数据协同管家") {
                  radioYczl.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioYczl.value = ["浏览信息"];
                    oldRadioYczl.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioYczl.value = ["浏览信息", "管理参数"];
                    oldRadioYczl.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioYczl.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioYczl.value = "operator";
                  }
                  permissonYczl.value = oldRadioYczl.value;
                }
                if (roleList[index].roleSystem == "数字化城市信息管家") {
                  radioSzhcs.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioSzhcs.value = ["浏览信息"];
                    oldRadioSzhcs.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioSzhcs.value = ["浏览信息", "管理参数"];
                    oldRadioSzhcs.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioSzhcs.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioSzhcs.value = "operator";
                  }
                  permissonSzhcs.value = oldRadioSzhcs.value;
                }
                if (roleList[index].roleSystem == "景观照明集中控制管家") {
                  radioJgzm.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioJgzm.value = ["浏览信息"];
                    oldRadioJgzm.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioJgzm.value = ["浏览信息", "管理参数"];
                    oldRadioJgzm.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioJgzm.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioJgzm.value = "operator";
                  }
                  permissonJgzm.value = oldRadioJgzm.value;
                }
                if (roleList[index].roleSystem == "智慧公厕管家") {
                  radioShlj.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioShlj.value = ["浏览信息"];
                    oldRadioShlj.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioShlj.value = ["浏览信息", "管理参数"];
                    oldRadioShlj.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioShlj.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioShlj.value = "operator";
                  }
                  permissonShlj.value = oldRadioShlj.value;
                }
                if (roleList[index].roleSystem == "突出问题管家") {
                  radioZhxz.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioZhxz.value = ["浏览信息"];
                    oldRadioZhxz.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioZhxz.value = ["浏览信息", "管理参数"];
                    oldRadioZhxz.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioZhxz.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioZhxz.value = "operator";
                  }
                  permissonZhxz.value = oldRadioZhxz.value;
                }
                if (roleList[index].roleSystem == "调度指挥管家") {
                  radioDdzh.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioDdzh.value = ["浏览信息"];
                    oldRadioDdzh.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioDdzh.value = ["浏览信息", "管理参数"];
                    oldRadioDdzh.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioDdzh.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioDdzh.value = "operator";
                  }
                  permissonDdzh.value = oldRadioDdzh.value;
                }
                if (roleList[index].roleSystem == "垃圾全生命周期管家") {
                  radioCclj.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioCclj.value = ["浏览信息"];
                    oldRadioCclj.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioCclj.value = ["浏览信息", "管理参数"];
                    oldRadioCclj.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioCclj.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioCclj.value = "operator";
                  }
                  permissonCclj.value = oldRadioCclj.value;
                }
                if (roleList[index].roleSystem == "餐饮油烟管家") {
                  radioCyyy.value = [];
                  if (roleList[index].roleName == "viewer") {
                    radioCyyy.value = ["浏览信息"];
                    oldRadioCyyy.value = "viewer";
                  }
                  if (roleList[index].roleName == "admin") {
                    radioCyyy.value = ["浏览信息", "管理参数"];
                    oldRadioCyyy.value = "admin";
                  }
                  if (roleList[index].roleName == "operator") {
                    radioCyyy.value = ["浏览信息", "管理参数", "操作系统"];
                    oldRadioCyyy.value = "operator";
                  }
                  permissonCyyy.value = oldRadioCyyy.value;
                }
              }
            }
          });
          formLoading.value = false;
        }
      }
    });
  }
};

//申请：添加/删除权限操作
const selfPermisson = (systemName, operateType, roleName) => {
  axios({
    url: "/api/auth/apply_for_permission",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + params.token,
    },
    data: JSON.parse(
      JSON.stringify({
        operator: params.username,
        userName: permissonTelephone.value,
        operateType: operateType,
        roleSystem: systemName,
        roleName: roleName,
      })
    ),
    method: "post",
  }).then(function (resp) {
    console.log(2, resp);
    console.log(
      "我管理员" + params.username + "指定人员" + permissonTelephone.value
    );
  });
};

const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  const styleObject = {
    // background: "#303133 !important",
    // color: "#ffffff",
    "text-align": "center",
    "font-size": "1.2rem",
    background: "#DEE4F7 !important",
  };
  const newstyleObject = {
    "font-size": "1.2rem",
    "text-align": "center",
    background: "#DEE4F7 !important",
    "font-weight": "bold",

    color: "red",
  };
  if ((row.zhxz === "√(待定)" || row.zhxz === "×(待定)") && columnIndex === 3) {
    return newstyleObject;
  } else if (
    (row.cyyy === "√(待定)" || row.cyyy === "×(待定)") &&
    columnIndex === 4
  ) {
    return newstyleObject;
  } else if (
    (row.ddzh === "√(待定)" || row.ddzh === "×(待定)") &&
    columnIndex === 5
  ) {
    return newstyleObject;
  } else if (
    (row.hwzy === "√(待定)" || row.hwzy === "×(待定)") &&
    columnIndex === 16
  ) {
    return newstyleObject;
  } else if (
    (row.yczl === "√(待定)" || row.yczl === "×(待定)") &&
    columnIndex === 6
  ) {
    return newstyleObject;
  } else if (
    (row.gxdc === "√(待定)" || row.gxdc === "×(待定)") &&
    columnIndex === 7
  ) {
    return newstyleObject;
  } else if (
    (row.jgzm === "√(待定)" || row.jgzm === "×(待定)") &&
    columnIndex === 8
  ) {
    return newstyleObject;
  } else if (
    (row.ggzp === "√(待定)" || row.ggzp === "×(待定)") &&
    columnIndex === 9
  ) {
    return newstyleObject;
  } else if (
    (row.shlj === "√(待定)" || row.shlj === "×(待定)") &&
    columnIndex === 10
  ) {
    return newstyleObject;
  } else if (
    (row.cclj === "√(待定)" || row.cclj === "×(待定)") &&
    columnIndex === 11
  ) {
    return newstyleObject;
  } else if (
    (row.ljsj === "√(待定)" || row.ljsj === "×(待定)") &&
    columnIndex === 12
  ) {
    return newstyleObject;
  } else if (
    (row.cgAI === "√(待定)" || row.cgAI === "×(待定)") &&
    columnIndex === 13
  ) {
    return newstyleObject;
  } else if (
    (row.szhcs === "√(待定)" || row.szhcs === "×(待定)") &&
    columnIndex === 14
  ) {
    return newstyleObject;
  } else if (
    (row.cgsyd === "√(待定)" || row.cgsyd === "×(待定)") &&
    columnIndex === 15
  ) {
    return newstyleObject;
  } else {
    return styleObject;
  }
};

//提交权限修改表单
const submitPermisson = (permissionForm) => {
  // console.log(
  //   "更改之前：" + oldRadioGxdc.value + "更改之后：" + permissonGxdc.value
  // );
  if (
    oldRadioGxdc.value == permissonGxdc.value &&
    oldRadioLjsj.value == permissonLjsj.value &&
    oldRadioCgAI.value == permissonCgAI.value &&
    oldRadioCgsyd.value == permissonCgsyd.value &&
    oldRadioGgzp.value == permissonGgzp.value &&
    oldRadioYczl.value == permissonYczl.value &&
    oldRadioSzhcs.value == permissonSzhcs.value &&
    oldRadioJgzm.value == permissonJgzm.value &&
    oldRadioShlj.value == permissonShlj.value &&
    oldRadioZhxz.value == permissonZhxz.value &&
    oldRadioDdzh.value == permissonDdzh.value &&
    oldRadioCclj.value == permissonCclj.value &&
    oldRadioCyyy.value == permissonCyyy.value &&
    oldRadioHwzy.value == permissonHwzy.value
  ) {
    ElMessage({
      message: "您未作任何更改，请更改之后再提交！",
      type: "error",
    });
  } else {
    var res = confirm(`是否提交更改申请？`);
    if (res) {
      //子系统修改的为 1 -->才提交，子系统未修改的为0 不用提交
      if (checkGxdc.value == true) {
        if (permissonGxdc.value != "") {
          if (oldRadioGxdc.value != "") {
            selfPermisson("共享单车管家", "delete", oldRadioGxdc.value);
          }
          selfPermisson("共享单车管家", "add", permissonGxdc.value);
        } else {
          selfPermisson("共享单车管家", "delete", oldRadioGxdc.value);
        }
      }
      if (checkHwzy.value == true) {
        if (permissonHwzy.value != "") {
          if (oldRadioHwzy.value != "") {
            selfPermisson("环卫作业管家", "delete", oldRadioHwzy.value);
          }
          selfPermisson("环卫作业管家", "add", permissonHwzy.value);
        } else {
          selfPermisson("环卫作业管家", "delete", oldRadioHwzy.value);
        }
      }
      // if (checkLjsj.value == true) {
      //   if (permissonLjsj.value != "") {
      //     if (oldRadioLjsj.value != "") {
      //       selfPermisson("垃圾数据归集管家", "delete", oldRadioLjsj.value);
      //     }
      //     selfPermisson("垃圾数据归集管家", "add", permissonLjsj.value);
      //   } else {
      //     selfPermisson("垃圾数据归集管家", "delete", oldRadioLjsj.value);
      //   }
      // }
      if (checkCgAI.value == true) {
        if (permissonCgAI.value != "") {
          if (oldRadioCgAI.value != "") {
            selfPermisson("城管AI识别管家", "delete", oldRadioCgAI.value);
          }
          selfPermisson("城管AI识别管家", "add", permissonCgAI.value);
        } else {
          selfPermisson("城管AI识别管家", "delete", oldRadioCgAI.value);
        }
      }
      if (checkCgsyd.value == true) {
        if (permissonCgsyd.value != "") {
          if (oldRadioCgsyd.value != "") {
            selfPermisson("网络理政管家", "delete", oldRadioCgsyd.value);
          }
          selfPermisson("网络理政管家", "add", permissonCgsyd.value);
        } else {
          selfPermisson("网络理政管家", "delete", oldRadioCgsyd.value);
        }
      }
      if (checkGgzp.value == true) {
        if (permissonGgzp.value != "") {
          if (oldRadioGgzp.value != "") {
            selfPermisson("广告招牌二维码管家", "delete", oldRadioGgzp.value);
          }
          selfPermisson("广告招牌二维码管家", "add", permissonGgzp.value);
        } else {
          selfPermisson("广告招牌二维码管家", "delete", oldRadioGgzp.value);
        }
      }
      if (checkYczl.value == true) {
        if (permissonYczl.value != "") {
          if (oldRadioYczl.value != "") {
            selfPermisson(
              "扬尘治理大数据协同管家",
              "delete",
              oldRadioYczl.value
            );
          }
          selfPermisson("扬尘治理大数据协同管家", "add", permissonYczl.value);
        } else {
          selfPermisson("扬尘治理大数据协同管家", "delete", oldRadioYczl.value);
        }
      }
      if (checkSzhcs.value == true) {
        if (permissonSzhcs.value != "") {
          if (oldRadioSzhcs.value != "") {
            selfPermisson("数字化城市信息管家", "delete", oldRadioSzhcs.value);
          }
          selfPermisson("数字化城市信息管家", "add", permissonSzhcs.value);
        } else {
          selfPermisson("数字化城市信息管家", "delete", oldRadioSzhcs.value);
        }
      }
      if (checkJgzm.value == true) {
        if (permissonJgzm.value != "") {
          if (oldRadioJgzm.value != "") {
            selfPermisson("景观照明集中控制管家", "delete", oldRadioJgzm.value);
          }
          selfPermisson("景观照明集中控制管家", "add", permissonJgzm.value);
        } else {
          selfPermisson("景观照明集中控制管家", "delete", oldRadioJgzm.value);
        }
      }
      if (checkShlj.value == true) {
        if (permissonShlj.value != "") {
          if (oldRadioShlj.value != "") {
            selfPermisson("智慧公厕管家", "delete", oldRadioShlj.value);
          }
          selfPermisson("智慧公厕管家", "add", permissonShlj.value);
        } else {
          selfPermisson("智慧公厕管家", "delete", oldRadioShlj.value);
        }
      }
      if (checkZhxz.value == true) {
        if (permissonZhxz.value != "") {
          if (oldRadioZhxz.value != "") {
            selfPermisson("突出问题管家", "delete", oldRadioZhxz.value);
          }
          selfPermisson("突出问题管家", "add", permissonZhxz.value);
        } else {
          selfPermisson("突出问题管家", "delete", oldRadioZhxz.value);
        }
      }
      if (checkDdzh.value == true) {
        if (permissonDdzh.value != "") {
          if (oldRadioDdzh.value != "") {
            selfPermisson("调度指挥管家", "delete", oldRadioDdzh.value);
          }
          selfPermisson("调度指挥管家", "add", permissonDdzh.value);
        } else {
          selfPermisson("调度指挥管家", "delete", oldRadioDdzh.value);
        }
      }

      if (checkCclj.value == true) {
        if (permissonCclj.value != "") {
          if (oldRadioCclj.value != "") {
            selfPermisson("垃圾全生命周期管家", "delete", oldRadioCclj.value);
          }
          selfPermisson("垃圾全生命周期管家", "add", permissonCclj.value);
        } else {
          selfPermisson("垃圾全生命周期管家", "delete", oldRadioCclj.value);
        }
      }
      if (checkCyyy.value == true) {
        if (permissonCyyy.value != "") {
          if (oldRadioCyyy.value != "") {
            selfPermisson("餐饮油烟管家", "delete", oldRadioCyyy.value);
          }
          selfPermisson("餐饮油烟管家", "add", permissonCyyy.value);
        } else {
          selfPermisson("餐饮油烟管家", "delete", oldRadioCyyy.value);
        }
      }

      handleEvent.value = false;
      ElMessage({
        message: "权限更改申请成功！",
        type: "success",
      });
    }
    loading.value = true;
    console.log("currentRowPage:" + currentRowPage);
    getPermissionList(currentRowPage);
    getPermissonApplicationListList(1);
  }
};

//多选框--》角色分配
const radioChangeGxdc = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonGxdc.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonGxdc.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioGxdc.value = ["浏览信息", "管理参数"];
      permissonGxdc.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioGxdc.value = ["浏览信息", "管理参数", "操作系统"];
      permissonGxdc.value = "operator";
    }
  }
  checkGxdc.value = true;
};

const radioChangeHwzy = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonHwzy.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonHwzy.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioHwzy.value = ["浏览信息", "管理参数"];
      permissonHwzy.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioHwzy.value = ["浏览信息", "管理参数", "操作系统"];
      permissonHwzy.value = "operator";
    }
  }
  checkHwzy.value = true;
};

const radioChangeLjsj = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonLjsj.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonLjsj.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioLjsj.value = ["浏览信息", "管理参数"];
      permissonLjsj.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioLjsj.value = ["浏览信息", "管理参数", "操作系统"];
      permissonLjsj.value = "operator";
    }
  }
  checkLjsj.value = true;
};

const radioChangeCgAI = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonCgAI.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonCgAI.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioCgAI.value = ["浏览信息", "管理参数"];
      permissonCgAI.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioCgAI.value = ["浏览信息", "管理参数", "操作系统"];
      permissonCgAI.value = "operator";
    }
  }
  checkCgAI.value = true;
};

const radioChangeCgsyd = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonCgsyd.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonCgsyd.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioCgsyd.value = ["浏览信息", "管理参数"];
      permissonCgsyd.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioCgsyd.value = ["浏览信息", "管理参数", "操作系统"];
      permissonCgsyd.value = "operator";
    }
  }
  checkCgsyd.value = true;
};

const radioChangeGgzp = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonGgzp.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonGgzp.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioGgzp.value = ["浏览信息", "管理参数"];
      permissonGgzp.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioGgzp.value = ["浏览信息", "管理参数", "操作系统"];
      permissonGgzp.value = "operator";
    }
  }
  checkGgzp.value = true;
};

const radioChangeYczl = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonYczl.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonYczl.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioYczl.value = ["浏览信息", "管理参数"];
      permissonYczl.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioYczl.value = ["浏览信息", "管理参数", "操作系统"];
      permissonYczl.value = "operator";
    }
  }
  checkYczl.value = true;
};

const radioChangeSzhcs = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonSzhcs.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonSzhcs.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioSzhcs.value = ["浏览信息", "管理参数"];
      permissonSzhcs.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioSzhcs.value = ["浏览信息", "管理参数", "操作系统"];
      permissonSzhcs.value = "operator";
    }
  }
  checkSzhcs.value = true;
};

const radioChangeJgzm = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonJgzm.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonJgzm.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioJgzm.value = ["浏览信息", "管理参数"];
      permissonJgzm.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioJgzm.value = ["浏览信息", "管理参数", "操作系统"];
      permissonJgzm.value = "operator";
    }
  }
  checkJgzm.value = true;
};

const radioChangeShlj = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonShlj.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonShlj.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioShlj.value = ["浏览信息", "管理参数"];
      permissonShlj.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioShlj.value = ["浏览信息", "管理参数", "操作系统"];
      permissonShlj.value = "operator";
    }
  }
  checkShlj.value = true;
};

const radioChangeZhxz = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonZhxz.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonZhxz.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioZhxz.value = ["浏览信息", "管理参数"];
      permissonZhxz.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioZhxz.value = ["浏览信息", "管理参数", "操作系统"];
      permissonZhxz.value = "operator";
    }
  }
  checkZhxz.value = true;
};

const radioChangeDdzh = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonDdzh.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonDdzh.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioDdzh.value = ["浏览信息", "管理参数"];
      permissonDdzh.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioDdzh.value = ["浏览信息", "管理参数", "操作系统"];
      permissonDdzh.value = "operator";
    }
  }
  checkDdzh.value = true;
};

const radioChangeCclj = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonCclj.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonCclj.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioCclj.value = ["浏览信息", "管理参数"];
      permissonCclj.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioCclj.value = ["浏览信息", "管理参数", "操作系统"];
      permissonCclj.value = "operator";
    }
  }
  checkCclj.value = true;
};

const radioChangeCyyy = (value) => {
  console.log("value长度：" + value.length);
  if (value.length == 0) {
    permissonCyyy.value = "";
  }
  for (var index in value) {
    console.log("value:" + value[index]);
    if (value[index] == "浏览信息") {
      permissonCyyy.value = "viewer";
    }
    if (value[index] == "管理参数") {
      radioCyyy.value = ["浏览信息", "管理参数"];
      permissonCyyy.value = "admin";
    }
    if (value[index] == "操作系统") {
      radioCyyy.value = ["浏览信息", "管理参数", "操作系统"];
      permissonCyyy.value = "operator";
    }
  }
  checkCyyy.value = true;
};

//==============================================================================================================

//===================================================================大图片定时更换（一个月）
var curIndex = 0;
var picture = ref("1");
var timeInterval = 1000 * 60 * 60 * 24;

setInterval(changeImg, timeInterval);
function changeImg() {
  let nowDay = new Date().getDate();
  //每个月1号更换一次图片
  if (nowDay == "1") {
    if (picture.value == "1") {
      picture.value = "3";
    } else {
      picture.value = "1";
    }
  }
}

//================================================================================
// const cclj_sites = ref([]);
const gxdc_company = ref([]);
const electricity = ref[("一品天下", "城北体育中心", "枣子巷", "一环路内透")];
const jgzm_alarm_projrect = ref([]);
const jgzm_day_consumption = ref([]);
const jgzm_year_consumption = ref([]);
const jgzm_month_consumption = ref([]);
const retailCount = ref([]);
const cateringCount = ref([]);
const serviceCount = ref([]);
const otherCount = ref([]);
const ljz_table2 = ref([]); //垃圾站
// const hwzy_tableData = ref([]); //环卫作业
const ycxt_tableData1 = ref([]);
const ycxt_tableData2 = ref([]); //扬尘系统

const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码！"));
  } else if (value !== form.new_password) {
    callback(new Error("两次密码不相同！"));
  } else {
    callback();
  }
};

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm("确认修改密码？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          axios({
            url: "/api/auth/change_password",
            method: "post",
            headers: {
              Authorization: "Bearer" + params.token,
              "Content-Type": " application/json",
            },
            data: form.new_password,
          }).then((res) => {
            if (res.data) {
              ElMessage({
                type: "success",
                message: "修改密码成功！",
              });
            } else {
              ElMessage({
                type: "error",
                message:
                  "密码的组成至少8位以上，要包含字母、数字、符号，例如：w-765223！",
              });
            }
          });
          // changePassword(form).then(res => {
          //   console.log(res)
          //   ElMessage({
          //     type: 'success',
          //     message: '修改密码成功！',
          //   })
          // })
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消修改密码！",
          });
        });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const rules = reactive({
  new_password: [{ validator: validatePass, trigger: "blur" }],
  new_password_confirm: [{ validator: validatePass2, trigger: "blur" }],
});

const form = reactive({
  new_password: "",
  new_password_confirm: "",
});
const confirmChangePasswordVisible = ref(false);
const changePermissonDialog = ref(false);
const resetPasswordDialog = ref(false);

const changePasswordDialog = ref(false);
const echartInit_srzx = () => {
  document
    .getElementById("container_gxdc1")
    .removeAttribute("_echarts_instance_");

  var myChart_gxdc = echarts.init(document.getElementById("container_gxdc1"));
  var myChart_gxdc1 = echarts.init(document.getElementById("container_gxdc2"));
  var option_gxdc2 = {
    title: {
      text: "公司统计",
      textStyle: {
        color: "#ccc",
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
        color: "white",
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
};

const echartInit_ddzh = () => {
  console.log(ddzh_tableData2);
  if (ddzh_tableData2.value.length == 3) {
    ddzh_tableData2.value.unshift({
      isNormal: false,
      identity: "办公室人员",
      num: 0,
    });
  }
  if (ddzh_tableData2.value.length == 4) {
    ddzh_tableData2.value.push({
      isNormal: false,
      identity: "执法人员",
      num: 0,
    });
  }
  document
    .getElementById("container_ddzh1")
    .removeAttribute("_echarts_instance_");
  var myChart_ddzh1 = echarts.init(document.getElementById("container_ddzh1"));
  document
    .getElementById("container_ddzh2")
    .removeAttribute("_echarts_instance_");
  var myChart_ddzh2 = echarts.init(document.getElementById("container_ddzh2"));
  document
    .getElementById("container_ddzh3")
    .removeAttribute("_echarts_instance_");
  var myChart_ddzh3 = echarts.init(document.getElementById("container_ddzh3"));
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
    xAxis: {
      type: "category",
      data: [
        ddzh_tableData1.value[0].department,
        ddzh_tableData1.value[1].department,
        ddzh_tableData1.value[2].department,
        ddzh_tableData1.value[3].department,
        ddzh_tableData1.value[4].department,
        ddzh_tableData1.value[5].department,
        ddzh_tableData1.value[6].department,
        ddzh_tableData1.value[7].department,
        ddzh_tableData1.value[8].department,
        ddzh_tableData1.value[9].department,
        ddzh_tableData1.value[10].department,
        ddzh_tableData1.value[11].department,
        ddzh_tableData1.value[12].department,
        ddzh_tableData1.value[13].department,
        ddzh_tableData1.value[14].department,
        ddzh_tableData1.value[15].department,
        ddzh_tableData1.value[16].department,
        ddzh_tableData1.value[17].department,
        ddzh_tableData1.value[18].department,
        ddzh_tableData1.value[19].department,
        ddzh_tableData1.value[20].department,
        ddzh_tableData1.value[21].department,
        ddzh_tableData1.value[22].department,
        ddzh_tableData1.value[23].department,
        ddzh_tableData1.value[24].department,
        ddzh_tableData1.value[25].department,
        ddzh_tableData1.value[26].department,
        ddzh_tableData1.value[27].department,
        ddzh_tableData1.value[28].department,
      ],
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
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [
          (ddzh_tableData1.value[0].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[1].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[2].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[3].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[4].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[5].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[6].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[7].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[8].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[9].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[10].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[11].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[12].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[13].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[14].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[15].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[16].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[17].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[18].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[19].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[20].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[21].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[22].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[23].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[24].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[25].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[26].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[27].checkRate * 100).toFixed(1),
          (ddzh_tableData1.value[28].checkRate * 100).toFixed(1),
        ],
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
  var option2 = {
    title: {
      text: "执法人员定位情况",
      left: "center",
      textStyle: {
        color: "white",
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#ccc",
      },
    },
    series: [
      {
        name: "执法人员",
        type: "pie",
        radius: "50%",
        data: [
          { value: ddzh_tableData2.value[0].num, name: "定位正常人员" },
          { value: ddzh_tableData2.value[3].num, name: "定位异常人员" },
          // { value: 111, name: 222 },
        ],
        label: {
          show: true,
          formatter(param) {
            // correct the percentage
            return param.name + +param.value + " (" + param.percent + "%)";
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
  var option3 = {
    title: {
      text: "协管人员定位情况",
      left: "center",
      textStyle: {
        color: "white",
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#ccc",
      },
    },
    series: [
      {
        name: "协管人员",
        type: "pie",
        radius: "50%",
        data: [
          { value: ddzh_tableData2.value[1].num, name: "定位正常人员" },
          { value: ddzh_tableData2.value[3].num, name: "定位异常人员" },
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
  myChart_ddzh1.setOption(option1);
  myChart_ddzh2.setOption(option2);
  myChart_ddzh3.setOption(option3);
};

//客流量趋势
var weeklyChart = null;
onMounted(() => {
  showWeeklyChart();
});

//让图表随着屏幕自适应
// window.addEventListener("resize", function () {
//   weeklyChart.resize();
// });

//页面跳转之前销毁图表
onBeforeUnmount(() => {
  if (weeklyChart) {
    //window.removeEventListener("resize", weeklyChart);
    weeklyChart.dispose();
    weeklyChart = null;
  }
});
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
          color: "white",
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
          color: "white",
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
            color: "white",
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
const echartInit_ljz = () => {
  document
    .getElementById("container_ljz1")
    .removeAttribute("_echarts_instance_");
  var myChart_ljz1 = echarts.init(document.getElementById("container_ljz1"));
  document
    .getElementById("container_ljz2")
    .removeAttribute("_echarts_instance_");
  var myChart_ljz2 = echarts.init(document.getElementById("container_ljz2"));
  var option1 = {
    title: {
      text: "垃圾分布统计",
      left: "center",
      textStyle: {
        color: "white",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        // 在 tooltip 中添加多行文本，包括标题和数值
        return "垃圾分布统计 <br>" + params.name + "   " + params.value + "吨";
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#ccc",
      },
    },
    series: [
      {
        name: "垃圾分布统计",
        type: "pie",
        radius: "50%",
        data: [
          {
            value: ljz_table1.value[2].infoVal.slice(0, -2),
            name: ljz_table1.value[2].infoKey.slice(0, -2),
          },
          {
            value: ljz_table1.value[1].infoVal.slice(0, -2),
            name: ljz_table1.value[1].infoKey.slice(0, -2),
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
  var option2 = {
    title: {
      text: "垃圾统计",
      textStyle: {
        color: "white",
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

        // 构建 tooltip 内容并换行显示
        return (
          xAxisLabel +
          "<br>西华站 " +
          dataValue1 +
          "吨" +
          "<br>红星站 " +
          dataValue +
          "吨"
        );
      },
    },
    legend: {
      textStyle: {
        color: "white",
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
    xAxis: [
      {
        type: "category",
        data: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
        ],
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: "{value} 吨",
        },
      },
    ],
    series: [
      {
        name: "红星站",
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
        data: [
          ljz_table2.value[3][0],
          ljz_table2.value[3][1],
          ljz_table2.value[3][2],
          ljz_table2.value[3][3],
          ljz_table2.value[3][4],
          ljz_table2.value[3][5],
          ljz_table2.value[3][6],
          ljz_table2.value[3][7],
          ljz_table2.value[3][8],
          ljz_table2.value[3][9],
          ljz_table2.value[3][10],
          ljz_table2.value[3][11],
        ],
      },
      {
        name: "西华站",
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
        data: [
          ljz_table2.value[4][0],
          ljz_table2.value[4][1],
          ljz_table2.value[4][2],
          ljz_table2.value[4][3],
          ljz_table2.value[4][4],
          ljz_table2.value[4][5],
          ljz_table2.value[4][6],
          ljz_table2.value[4][7],
          ljz_table2.value[4][8],
          ljz_table2.value[4][9],
          ljz_table2.value[4][10],
          ljz_table2.value[4][11],
        ],
      },
    ],
  };
  myChart_ljz1.setOption(option1);
  myChart_ljz2.setOption(option2);
};
const echartInit_syd = () => {
  document
    .getElementById("container_syd1")
    .removeAttribute("_echarts_instance_");
  var myChart_syd1 = echarts.init(document.getElementById("container_syd1"));
  document
    .getElementById("container_syd2")
    .removeAttribute("_echarts_instance_");
  var myChart_syd2 = echarts.init(document.getElementById("container_syd2"));
  var option_syd1 = {
    title: {
      text: "工单分析",
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
          { value: syd_data.value[0].infoVal, name: "办理中数量" },
          {
            value: syd_data.value[1].infoVal,
            name: "超期量",
          },
          // { value: 580, name: 'Email' },
          // { value: 484, name: 'Union Ads' },
          // { value: 300, name: 'Video Ads' }
        ],
      },
    ],
  };
  myChart_syd1.setOption(option_syd1);
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
          { value: syd_data.value[2].infoVal, name: "本月办结量" },
          {
            value: syd_data.value[4].infoVal,
            name: "本月受理量",
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
// const echartInit_cclj = () => {
//   document
//     .getElementById("container_cclj")
//     .removeAttribute("_echarts_instance_");
//   var myChart_cclj = echarts.init(document.getElementById("container_cclj"));
//   document
//     .getElementById("container_cclj1")
//     .removeAttribute("_echarts_instance_");
//   var myChart_cclj1 = echarts.init(document.getElementById("container_cclj1"));
//   var option = {
//     title: {
//       text: "收运点位统计",
//       textStyle: {
//         color: "#ccc",
//       },
//     },
//     tooltip: {
//       trigger: "axis",
//       axisPointer: {
//         type: "shadow",
//       },
//     },
//     xAxis: {
//       type: "category",
//       axisLabel: {
//         //x轴文字的配置
//         show: true,
//         interval: 0, //使x轴文字显示全
//         rotate: 20,
//       },
//       data: [
//         cclj_sites.value[0].street,
//         cclj_sites.value[1].street,
//         cclj_sites.value[2].street,
//         cclj_sites.value[3].street,
//         cclj_sites.value[4].street,
//         cclj_sites.value[5].street,
//         cclj_sites.value[6].street,
//         cclj_sites.value[7].street,
//         cclj_sites.value[8].street,
//         cclj_sites.value[9].street,
//         cclj_sites.value[10].street,
//         cclj_sites.value[11].street,
//         cclj_sites.value[12].street,
//       ],
//     },
//     yAxis: {
//       type: "value",
//     },
//     series: [
//       {
//         data: [
//           cclj_sites.value[0].street_site_num,
//           cclj_sites.value[1].street_site_num,
//           cclj_sites.value[2].street_site_num,
//           cclj_sites.value[3].street_site_num,
//           cclj_sites.value[4].street_site_num,
//           cclj_sites.value[5].street_site_num,
//           cclj_sites.value[6].street_site_num,
//           cclj_sites.value[7].street_site_num,
//           cclj_sites.value[8].street_site_num,
//           cclj_sites.value[9].street_site_num,
//           cclj_sites.value[10].street_site_num,
//           cclj_sites.value[11].street_site_num,
//           cclj_sites.value[12].street_site_num,
//         ],
//         type: "bar",
//         showBackground: true,
//         backgroundStyle: {
//           color: "rgba(180, 180, 180, 0.2)",
//         },
//       },
//     ],
//   };
//   var option1 = {
//     title: {
//       text: "收运点位统计",
//       left: "center",
//       textStyle: {
//         color: "white",
//       },
//     },
//     tooltip: {
//       trigger: "item",
//     },
//     legend: {
//       orient: "vertical",
//       left: "left",
//       textStyle: {
//         color: "#ccc",
//       },
//     },
//     series: [
//       {
//         name: "街道点位统计",
//         type: "pie",
//         radius: "50%",
//         data: [
//           {
//             value: cclj_sites.value[0].street_site_num,
//             name: cclj_sites.value[0].street,
//           },
//           {
//             value: cclj_sites.value[1].street_site_num,
//             name: cclj_sites.value[1].street,
//           },
//           {
//             value: cclj_sites.value[2].street_site_num,
//             name: cclj_sites.value[2].street,
//           },
//           {
//             value: cclj_sites.value[3].street_site_num,
//             name: cclj_sites.value[3].street,
//           },
//           {
//             value: cclj_sites.value[4].street_site_num,
//             name: cclj_sites.value[4].street,
//           },
//           {
//             value: cclj_sites.value[5].street_site_num,
//             name: cclj_sites.value[5].street,
//           },
//           {
//             value: cclj_sites.value[6].street_site_num,
//             name: cclj_sites.value[6].street,
//           },
//           {
//             value: cclj_sites.value[7].street_site_num,
//             name: cclj_sites.value[7].street,
//           },
//           {
//             value: cclj_sites.value[8].street_site_num,
//             name: cclj_sites.value[8].street,
//           },
//           {
//             value: cclj_sites.value[9].street_site_num,
//             name: cclj_sites.value[9].street,
//           },
//           {
//             value: cclj_sites.value[10].street_site_num,
//             name: cclj_sites.value[10].street,
//           },
//           {
//             value: cclj_sites.value[11].street_site_num,
//             name: cclj_sites.value[11].street,
//           },
//           {
//             value: cclj_sites.value[12].street_site_num,
//             name: cclj_sites.value[12].street,
//           },
//         ],
//         label: {
//           show: true,
//           formatter(param) {
//             // correct the percentage
//             return param.name + " (" + param.percent + "%)";
//           },
//         },
//         emphasis: {
//           itemStyle: {
//             shadowBlur: 10,
//             shadowOffsetX: 0,
//             shadowColor: "rgba(0, 0, 0, 0.5)",
//           },
//         },
//       },
//     ],
//   };
//   myChart_cclj.setOption(option);
//   myChart_cclj1.setOption(option1);
// };

const echartInit_jgzm = () => {
  document
    .getElementById("container_ljdp1")
    .removeAttribute("_echarts_instance_");
  document
    .getElementById("container_ljdp2")
    .removeAttribute("_echarts_instance_");
  //document.getElementById("container_jgzm").removeAttribute("_echarts_instance_");

  var myChart_ljdp1 = echarts.init(document.getElementById("container_ljdp1"));
  var myChart2 = echarts.init(document.getElementById("container_ljdp2"));
  //var myChart_jgzm1 = echarts.init(document.getElementById("container_jgzm"));
  // var myChart4 = echarts.init(document.getElementById("container_jgzm4"))
  // getMainJgzm().then(data => {
  //   var option_jgzm1 = {
  //     title: {
  //       text: '用电量统计',
  //       textStyle: {
  //         color: '#ccc'
  //       }
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'shadow'
  //       }
  //     },
  //     xAxis: {
  //       type: 'category',
  //       data: ['昨日电量统计', '月电量统计', '年电量统计']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [
  //       {
  //         data: [data[1].infoVal, data[2].infoVal, data[3].infoVal],
  //         type: 'bar',
  //         showBackground: true,
  //         backgroundStyle: {
  //           color: 'rgba(180, 180, 180, 0.2)'
  //         }
  //       }
  //     ]
  //   }
  //   myChart_jgzm1.setOption(option_jgzm1)
  // })

  getMain().then((data) => {
    var option_ljdp1 = {
      title: {
        text: "巡检店铺数量",
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
          name: "店铺",
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
            { value: data[3].infoVal, name: "总店铺数量" },
            { value: data[0].infoVal, name: "巡检店铺数量" },
            { value: data[2].infoVal, name: "未办证数量" },
            // { value: 580, name: 'Email' },
            // { value: 484, name: 'Union Ads' },
            // { value: 300, name: 'Video Ads' }
          ],
        },
      ],
    };
    myChart_ljdp1.setOption(option_ljdp1);
  });

  // getMainJgzm().then(data => {
  //   var option_jgzm1 = {
  //     xAxis: {
  //       type: 'category',
  //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [
  //       {
  //         data: [120, 200, 150, 80, 70, 110, 130],
  //         type: 'bar',
  //         showBackground: true,
  //         backgroundStyle: {
  //           color: 'rgba(180, 180, 180, 0.2)'
  //         }
  //       }
  //     ]
  //   }
  //   myChart_jgzm1.setOption(option_jgzm1)
  // })
};
function toSystemHjws(item) {
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
  // permission.value = false;
}
const echartInit = () => {
  document.getElementById("container").removeAttribute("_echarts_instance_");
  document.getElementById("container1").removeAttribute("_echarts_instance_");
  document.getElementById("container2").removeAttribute("_echarts_instance_");
  document.getElementById("container3").removeAttribute("_echarts_instance_");
  document.getElementById("container4").removeAttribute("_echarts_instance_");
  document
    .getElementById("container_yyxt1")
    .removeAttribute("_echarts_instance_");
  document
    .getElementById("container_yyxt2")
    .removeAttribute("_echarts_instance_");
  document
    .getElementById("container_yyxt3")
    .removeAttribute("_echarts_instance_");

  //获取DOM元素并初始化

  var myChart = echarts.init(document.getElementById("container"));
  var myChart1 = echarts.init(document.getElementById("container1"));
  var myChart2 = echarts.init(document.getElementById("container2"));
  var myChart3 = echarts.init(document.getElementById("container3"));
  var myChart4 = echarts.init(document.getElementById("container4"));

  var myChart_yyxt1 = echarts.init(document.getElementById("container_yyxt1"));
  var myChart_yyxt2 = echarts.init(document.getElementById("container_yyxt2"));
  var myChart_yyxt3 = echarts.init(document.getElementById("container_yyxt3"));
  var myChart_yyxt4 = echarts.init(document.getElementById("container_yyxt4"));

  // 指定图表的配置项和数据
  getTrend().then((data) => {
    console.log(data);
    var option = {
      title: {
        text: "事件趋势分析",
        textStyle: {
          color: "#ccc",
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
      //这里的yAxis就是竖轴，xAxis就是横轴
      // yAxis and xAxis 交换可以改变横向或竖向
      yAxis: {
        data: data.map((item) => item.type),
        interval: 20,
      },
      xAxis: {},
      // 数据的来源
      series: [
        {
          name: "事件数",
          // bar就是柱状图
          type: "bar",
          color: "#dd6b66",
          // 数据
          data: data.map((item) => item.lian_value),
        },
      ],
    };
    myChart.setOption(option);
  });
  getResourceTcwt().then((data) => {
    var option1 = {
      title: {
        text: "来源分析",
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
            { value: data[0].value, name: data[0].source },
            // { value: 735, name: 'Direct' },
            // { value: 580, name: 'Email' },
            // { value: 484, name: 'Union Ads' },
            // { value: 300, name: 'Video Ads' }
          ],
        },
      ],
    };
    myChart1.setOption(option1);
  });

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
          axisLabel: {
            //x轴文字的配置
            show: true,
            interval: 0, //使x轴文字显示全
            rotate: 20,
          },
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
    myChart2.setOption(option2);
  });
  getSjqsfx().then((dataTable) => {
    // 从 dataTable 中筛选出 type 为 "街面秩序" 的数据，并提取 rq 值
    const filteredData1 = dataTable.filter((item) => item.type === "公用设施");
    const rqValues = filteredData1.map((item) => item.rq);
    const Values1 = filteredData1.map((item) => item.value);
    const filteredData2 = dataTable.filter((item) => item.type === "宣传广告");

    const Values2 = filteredData2.map((item) => item.value);
    const filteredData3 = dataTable.filter((item) => item.type === "市容环境");

    const Values3 = filteredData3.map((item) => item.value);
    const filteredData4 = dataTable.filter((item) => item.type === "街面秩序");

    const Values4 = filteredData4.map((item) => item.value);
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
        data: [...new Set(dataTable.map((item) => item.type))],
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
        data: rqValues,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: dataTable[0].type,
          type: "line",
          stack: "Total",
          data: Values1,
        },
        {
          name: dataTable[1].type,
          type: "line",
          stack: "Total",
          data: Values2,
        },
        {
          name: dataTable[2].type,
          type: "line",
          stack: "Total",
          data: Values3,
        },
        {
          name: dataTable[3].type,
          type: "line",
          stack: "Total",
          data: Values4,
        },
      ],
    };
    myChart4.setOption(option4);
  });
  getResourceSzcg().then((data) => {
    console.log(data.length);
    if (data.length == 0) {
      var default_data = { value: 0, wtly: "城管平台" };
      data.push(default_data);
    }
    var option3 = {
      title: {
        text: "来源分析",
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
            { value: data[0].value, name: data[0].wtly },

            // { value: 484, name: 'Union Ads' },
            // { value: 300, name: 'Video Ads' }
          ],
        },
      ],
    };
    myChart3.setOption(option3);
  });

  getOverStandard().then((tableData) => {
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
          color: "#ccc",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        textStyle: {
          color: "#ccc",
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

  getCompanyType().then((data) => {
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
    myChart_yyxt4.setOption(option_yyxt4);
  });

  // 使用刚指定的配置项和数据显示图表。

  // myChart4.setOption(option4);
};

const config_szcg = {
  series: [
    {
      type: "gauge",
      startAngle: -Math.PI / 2,
      endAngle: Math.PI * 1.5,
      arcLineWidth: 25,
      data: [
        {
          name: "itemA",
          value: 65,
          gradient: ["#03c2fd", "#1ed3e5", "#2fded6"],
        },
      ],
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      pointer: {
        show: false,
      },
      dataItemStyle: {
        lineCap: "round",
      },
      details: {
        show: true,
        formatter: "{value}%",
        style: {
          fill: "#1ed3e5",
          fontSize: 35,
        },
      },
    },
  ],
};
function changeCellStyle(row) {
  // 可自行输出row查看样式
  const styleObject = {
    background: "#303133 !important",
    color: "#ffffff",
    "font-size": "18px",
  };
  return styleObject;
}

var time = new Date().getTime();
//setInterval(refreshSydToken, 1000 * 61)
const DateToday =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();
const today = moment().format("YYYY-MM-DD");
const DateTomorrow =
  new Date(time + 1 * 24 * 60 * 60 * 1000).getFullYear() +
  "-" +
  (new Date(time + 1 * 24 * 60 * 60 * 1000).getMonth() + 1) +
  "-" +
  new Date(time + 1 * 24 * 60 * 60 * 1000).getDate();
const tomorrow = moment().add(+1, "d").format("YYYY-MM-DD");
console.log("today:" + today + "  " + "tomorrow:" + tomorrow);
console.log("DateToday:" + DateToday + "  " + "DateTomorrow:" + DateTomorrow);
const token = ref("");
const gxdc = reactive({ url: "" });
const syd = reactive({ url: "" });
const gxdcUrl = ref("");
const tcwtTableData = ref([]);
// const hwzy_tableData1 = ref([]);
const ddzh_tableData1 = ref([]);
const ddzh_tableData2 = ref([
  { 超速位置: "无", 速度: "无", 车牌号: "无", 超速时间: "无" },
]);
const startDate = moment().format("YYYY-MM-DD") + " 00:00:00";
const endDate = moment().format("YYYY-MM-DD") + " 23:59:59";
// const startDate =
const syd_data = ref([]);
const sydUrl = ref(
  "https://www.jncgsqbl.com/namespaces/1/categories/1?_user_login_token="
);
const toDdzh = () => {
  router.push({ name: "dept1", params: { num: "3" } });
};
onBeforeMount(() => {
  getMainSyd().then((data) => {
    syd_data.value = data;
  });

  getCheckRate().then((data) => {
    ddzh_tableData1.value = data;
  });
  // axios({
  //     url: "/diao/auth/login",
  //     method: "post",
  //     data: JSON.stringify({
  //       phone: "18380195019",
  //       password: "123456",
  //     }),
  //     headers: {
  //         "Content-Type": "application/json",
  //       },
  // }).then(function (resp) {
  //     console.log("ddzh2",resp)
  //     var ddzh_token = resp.data.token;
  //     axios({
  //       url: "/diao/patrol-status/status/rate_period",
  //       method: "post",
  //       data: JSON.stringify({
  //         startDate:startDate,
  //         endDate:endDate,
  //         param: "1",
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: ddzh_token,
  //       },
  //     }).then(function (resp) {
  //       ddzh_tableData1.value = resp.data.data;
  //       console.log("打卡率",resp);
  //       echartInit_ddzh();
  //     });

  //   });
  getCntStatus().then((data) => {
    ddzh_tableData2.value = data;
  });
  getAllEvents(today, tomorrow).then((data) => {
    tcwtTableData.value = data;
  });
  config_szcg.series[0].data[0].value =
    90 %
    getTokenGxdc().then((data) => {
      gxdcUrl.value = data;
      gxdc.url = "https://119.4.191.13:5580/manage/?token=" + gxdcUrl.value;
    });
  // getAiAlarm().then((data) => {
  //   hwzy_tableData1.value = data;
  // });
  getCompanyDust().then((data) => {
    ycxt_tableData1.value = data;
  });
  getOverSpeed().then((data) => {
    if (data.length != 0) ycxt_tableData2.value = data;
  });
});
const imgVisible = ref(true);
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
function openSystem(item) {
  var permission = ref(false);
  for (var i in systemPermisson) {
    if (item.systemName == systemPermisson[i]) {
      permission.value = true;
      break;
    }
  }
  if (permission.value == true) {
    window.open(item.url);
  } else {
    ElMessage.error("对不起，你无权访问系统！");
  }
  permission.value = false;
}
// function toSystem(item) {
//   if(item.isLogin == '0')
//   router.push({ name: item.to, params: item.systemName })
//   else if(item.isLogin == '1' && item.systemId!='14')
//   window.open(item.url)

//   if(item.systemId=='14')
//   window.open(gxdc.url)
// }
//方法重写，摒弃三级页面，后续如果需要用上面这个
function toSystem(item) {
  var permission = ref(false);
  for (var i in systemPermisson) {
    if (item.systemName == systemPermisson[i]) {
      permission.value = true;
      break;
    }
  }
  //每个子系统登录方式不一样
  console.log(item.systemId);
  if (permission.value == true) {
    if (
      item.systemId != "13" &&
      item.systemId != "16" &&
      item.systemId != "17" &&
      item.systemId != "4" &&
      item.systemId != "12"
    ) {
      console.log(item.systemName);
      if (item.url === "") {
        ElMessage({
          showClose: true,
          message: "正在开发中...",
        });
      } else if (item.systemId == "19") {
        item.url = item.url + "?iphone=" + params.username;
        console.log("url:" + item.url);
        window.open(item.url);
      } else if (
        item.systemId == "18" ||
        item.systemId == "7" ||
        item.systemId == "5"
      ) {
        // 这三个系统目前url无登录参数
        item.url = item.url + "?phone=" + params.username;
        console.log("url:" + item.url);
        window.open(item.url);
      } else window.open(item.url + "&phone=" + params.username);
    }

    console.log(item.systemName);

    if (item.systemId == "13") {
      //共享单车
      gxdc.url += "&phone=" + params.username;
      window.open(gxdc.url);
    }
    if (item.systemId == "16") {
      //诉易达

      getToken().then((data) => {
        token.value = data;
        // var sydUrl =
        //   "https://www.jncgsqbl.com/namespaces/1/categories/1?_user_login_token=";
        var sydUrl = "https://119.4.191.13:9580/#/login?token=";
        sydUrl = sydUrl + token.value + "&phone=" + params.username;
        syd.url = sydUrl;
        console.log(syd.url);
        window.open(syd.url);
      });
    }
    if (item.systemId == "17" || item.systemId == "4") {
      getAiUrl().then((data) => {
        aiUrl.value = data.message + "&phone=" + params.username;
        console.log("22222", aiUrl.value);
        console.log("11111111", data, aiUrl);
        window.open(aiUrl.value);
      });
    }
    if (item.systemId == "12") {
      var roles = [];
      roles = params.roleId.split(",");
      console.log(roles.indexOf("84"));
      // console.log(params.roleId)
      if (
        roles.indexOf("84") != -1 ||
        roles.indexOf("111") != -1 ||
        roles.indexOf("109") != -1 ||
        roles.indexOf("110") != -1 ||
        roles.indexOf("83") != -1
      ) {
        var ddzh_url =
          // "https://175.153.176.27:18804/map/?username=18008060886&pwd=MTIzNDU2";
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
        window.open(item.url);
      }
    } //调度指挥
    uploadClickLog(item.systemName);
  } else {
    ElMessage.error("对不起，你无权访问系统！");
  }
  permission.value = false;
}
const ljz_table1 = ref([]);

//部门列表, 从后端获取
const depts = ref([]);
// const hwzyToken = ref([])
onBeforeMount(() => {
  // getHwzyToken().then((data) => {
  //   hwzyToken.value = data;
  //   console.log(418,hwzyToken.value)
  // });
  getDeptList().then((response) => {
    depts.value = response;
  });
  getCategory().then((data) => {
    console.log("ggzp", data);
    console.log("xxx", data[0]);
    retailCount.value = data[0];
    cateringCount.value = data[3];
    serviceCount.value = data[1];
    otherCount.value = data[2];
  });
  getElectricity().then((data) => {
    jgzm_alarm_projrect.value = data[0];
    jgzm_day_consumption.value = data[1];
    jgzm_month_consumption.value = data[2];
    jgzm_year_consumption.value = data[3];
  });
  // getSitesData().then((data) => {
  //   cclj_sites.value = data;
  // });
});
// 系统列表
const systems = ref([]);
onMounted(() => {
  getSystemList().then((data) => {
    systems.value = data;

    // 请求各个子系统要显示的数据
    systems.value.forEach((system) => {
      if (system.api !== "") {
        if (system.systemId == "5" || system.systemId == "7") {
          //环卫作业和垃圾全生命周期的接口要传递token，这个token在登录城市管家的时候就获取并缓存
          console.log(4182, params.hwzyToken);
          get(system.api + "?token=" + params.hwzyToken).then(
            (data) => (system.data = data)
          );
          // console.log(ljz_table1)
        } else {
          get(system.api).then((data) => (system.data = data));
        }
      }
    });
  });

  getMainLjz().then((data) => {
    ljz_table1.value = data;
  });
  getSum().then((data) => {
    ljz_table2.value = data;
  });

  // getCarLists().then((data) => {
  //   hwzy_tableData.value = data;
  // });
});
//选中的部门
// -1表示全选，为默认值
const choosedDept = ref(-1);
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
const showDepts = ref(true);
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
// 跳转到to指定的子系统汇总页面
function show(to, url) {
  wiondow.open(url);
  // if (to === '') {
  //   ll
  //   ElMessage({
  //     showClose: true,
  //     message: '正在开发中...'
  //   })
  // } else {
  //   router.push({ name: to, params: { subsysName } })
  //   window.open(url)
  // }
}

function toMap() {
  router.push("/map");
}
function logout() {
  store.dispatch("logout");
  //TODO 清除登录信息
  params.isLogin = false;
  router.push("/login");
}

// const state = reactive({
//   professionalQua: [],
// })

// // 图片上传前拦截方法（限制图片格式和大小）
// const beforeAvatarUpload = (file) => {
//   const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg']
//   const isJPG = type.includes(file.type)
//   const isLt20M = file.size / 1024 / 1024 < 20
//   if (!isJPG) {
//     ElMessage({
//       message: '图片格式错误',
//       type: 'error',
//     })
//   }
//   if (!isLt20M) {
//     ElMessage({
//       message: '上传图片不能超过20M',
//       type: 'error',
//     })
//   }
//   return isJPG && isLt20M
// }

// // 图片上传成功返回图片地址方法
// const handleAvatarSuccess = (res) => {
//   const name = file.name.split('.')[0] // 上传图片的名称
//   if (res.code == 200) {
//     const path = res.data && res.data.filePath // 图片地址
//     state.professionalQua.push({ // 将图片名称和地址一起存在一个数组中
//       urlPath: path,
//       contentName: name,
//     })
//   }
// }

const uploadUrl = "/api/avatar-other/update-avatar-other"; // 后端上传接口 URL
const latestImageUrl = ref(""); // 最新头像 URL
const hwzyImageUrl = ref(""); //
const bottomBannerImageUrl = ref("");
const ccljImageUrl = ref(""); //
const shljImageUrl = ref(""); //
const ljflImageUrl = ref(""); //
const cyyyImageUrl = ref(""); //
const ddzhImageUrl = ref(""); //
const gxdcImageUrl = ref(""); //
const yczlImageUrl = ref(""); //
const jgzmImageUrl = ref(""); //
const newJgzmImageUrl = ref(""); //
const ljdpImageUrl = ref(""); //
const tcwtImageUrl = ref(""); //
const cgAIImageUrl = ref(""); //
const cgsydImageUrl = ref(""); //
const szhcsImageUrl = ref(""); //

const hovered = ref(false);
const showText = () => {
  hovered.value = true;
  console.log(hovered.value);
};

const hideText = () => {
  hovered.value = false;
  console.log(hovered.value);
};
// const handleUploadSuccess = async (response, uploadFile) => {
//   latestImageUrl.value = URL.createObjectURL(uploadFile.raw); // 更新最新头像 URL
//   console.log("现在的图片" + latestImageUrl.value);
//   // latestImageUrl.value = response.data.url;
// };

const createBeforeUpload = (systemName) => (rawFile) =>
  beforeUpload(rawFile, systemName);

const beforeUpload = async (rawFile, systemName) => {
  const type = ["image/jpeg", "image/jpg", "image/png", "image/svg"];
  const isJPG = type.includes(rawFile.type);
  const isLt20M = rawFile.size / 1024 / 1024 < 20;
  if (!isJPG) {
    ElMessage.error("图片仅支持jpeg,jpg,png,svg格式！");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("图片不能超过5MB!");
    return false;
  } else {
    const formData = new FormData();
    formData.append("file", rawFile); // 添加文件
    formData.append("systemName", systemName);
    // 使用 Axios 发送自定义上传请求
    await axios
      .post(uploadUrl, formData, {
        headers: {
          Authorization: "Bearer " + params.token, // 添加 token
        },
      })
      .then((response) => {
        console.log("上传成功", response);
        // 在这里处理上传成功的逻辑，如更新页面等

        // 更新最新头像 URL
        if (systemName == "banner") {
          latestImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "hwzy") {
          hwzyImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "cclj") {
          ccljImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "shlj") {
          shljImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "ljfl") {
          ljflImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "cyyy") {
          cyyyImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "ddzh") {
          ddzhImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "gxdc") {
          gxdcImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "yczl") {
          yczlImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "jgzm") {
          jgzmImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "new_jgzm") {
          newJgzmImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "ljdp") {
          ljdpImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "bottom_banner") {
          bottomBannerImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "tcwt") {
          tcwtImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "cgAI") {
          cgAIImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "cgsyd") {
          cgsydImageUrl.value = "/homePicture/" + response.data.url;
        }
        if (systemName == "szhcs") {
          szhcsImageUrl.value = "/homePicture/" + response.data.url;
        }

        //  latestImageUrl.value = require("@/assets/home/" + response.data.url);
      })
      .catch((error) => {
        console.error("上传失败", error);
        // 在这里处理上传失败的逻辑
      });
    return false;
  }
};

// 获取最新头像的 URL
const getLatestAvatar = async (systemName, latestImageUrl) => {
  try {
    const response = await axios.get("/api/avatar-other/get-avatar-other", {
      params: {
        systemName: systemName,
      },
      headers: {
        Authorization: "Bearer " + params.token, // 添加 token
      },
    });
    // latestImageUrl.value = require("@/assets/home/" + response.data);
    latestImageUrl.value = "/homePicture/" + response.data;
    // console.log("之前的图片" + latestImageUrl.value);
  } catch (error) {
    console.error("Error fetching latest avatar:", error);
  }
};
// 在组件加载后获取最新头像的 URL

getLatestAvatar("banner", latestImageUrl);
getLatestAvatar("hwzy", hwzyImageUrl);
getLatestAvatar("bottom_banner", bottomBannerImageUrl);
getLatestAvatar("cclj", ccljImageUrl);
getLatestAvatar("shlj", shljImageUrl);
getLatestAvatar("ljfl", ljflImageUrl);
getLatestAvatar("cyyy", cyyyImageUrl);
getLatestAvatar("ddzh", ddzhImageUrl);
getLatestAvatar("gxdc", gxdcImageUrl);
getLatestAvatar("yczl", yczlImageUrl);
getLatestAvatar("jgzm", jgzmImageUrl);
getLatestAvatar("new_jgzm", newJgzmImageUrl);
getLatestAvatar("ljdp", ljdpImageUrl);
getLatestAvatar("tcwt", tcwtImageUrl);
getLatestAvatar("cgAI", cgAIImageUrl);
getLatestAvatar("cgsyd", cgsydImageUrl);
getLatestAvatar("szhcs", szhcsImageUrl);
// getLatestAvatar("tcwt", tcwtImageUrl);
// getLatestAvatar("cgAI", cgAIImageUrl);
// getLatestAvatar("cgsyd", cgsydImageUrl);
// getLatestAvatar("szhcs", szhcsImageUrl);
</script>

<style scoped>
.my-el-popover {
  background-color: #1677d9;
}

.AI {
  text-align: center;
  height: 292px;
  width: 360px;
  background-size: 100%;
  background-image: url("@/assets/szcg/ai.png");
  opacity: 0.9;
  display: flex;
}

.szcg {
  text-align: center;
  height: 292px;
  width: 360px;
  background-size: 100%;
  background-image: url("@/assets/szcg/szcg.jpg");
  opacity: 0.9;
  display: flex;
}

.syd {
  text-align: center;
  height: 292px;
  width: 360px;
  background-size: 100%;
  background-image: url("@/assets/szcg/syd.jpg");
  opacity: 0.9;
  display: flex;
  background-color: #1677d9;
}

.jgzmInfo {
  width: 100%;
  height: auto;
  margin-left: 5%;
  display: flex;
  padding: 5px;
  color: black;
  margin-right: 5%;
}

.szcgInfo {
  height: 600px;
  width: 350px;
  height: auto;
  margin-left: 5%;
  padding: 5px;
  color: white;
}

.srzxInfo {
  width: 16%;
  height: 480px;
  padding: 5px;
  text-align: center;
  color: white;
}

.img-wrapper {
  background-size: 100%;
  width: 100%;
  display: flex;
  height: 580px;
}

.description {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  /*当屏幕尺寸变小时，各个子系统汇总模块自动换行*/
  font-size: 20px;
  color: #1677d9;
  margin-left: 5%;
  margin-top: 15px;
  margin-right: 15%;
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
  margin-left: -10vw;
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
  background: url("/public/images/bg-box7.jpg") -30%;
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
  width: 250px;
  flex-wrap: wrap;
  font-size: 1.8rem;
  font-weight: bold;
  /* color: #1677d9; */
}

.el-button-null {
  /* font-size: 20px; */
  color: gray;
  font-size: 1.8rem;
  color: white;
  padding-top: 3vh;
  padding-bottom: 4vh;
  color: gold;
  font-weight: bold;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.header {
  text-align: center;

  /* width:130px;
  overflow: hidden;
  white-space: nowrap; */
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.card {
  border-radius: 3px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  margin-right: 25px;
  margin-top: 25px;
  padding: 0px;
  width: 350px;
  background-color: #2775b6;
}

.infoContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2775b6;
  padding: 20px;
  margin-top: -10px;
}

.infoList {
  color: #f0f0a8;

  list-style-type: none;
  /* font-style: italic; */
}

.infoList li:hover {
  color: #e9e45d;
  /* text-decoration: underline; */
}

.infoList li:nth-child(even) {
  color: #e9e287;
  font-family: "楷体";

  font-size: 1.1rem;
  line-height: 1.2;
}

.infoList li:nth-child(odd) {
  color: #97e6c2;
}

.infoList li span {
  font-family: "楷体";
  font-weight: bold;
  font-size: 1.1rem;
  color: #ea9ab5;
}

.image {
  float: left;
  height: 300px;
  width: 100%;
  border-radius: 5px;
  display: block;
}

.el-button-hjws {
  font-size: 1.2rem;
  color: white;
  margin-top: 10px;
}

.el-button-hjws-title {
  font-size: 1.8rem;
  color: #fff;
  padding-top: 3vh;
  padding-bottom: 4vh;
  color: gold;
  font-weight: 700;
}

.radioPermisson {
  padding-left: 5rem;
}
#selectForm >>> .el-form-item__label {
  font-size: 1.2rem;
  /* font-weight: bold; */
}
.el-checkbox {
  --el-checkbox-font-size: 1.2rem;
}

.avatar-uploader .avatar {
  width: 99vw;
  overflow: auto;
  height: 120vh;
  display: block !important;
}
::v-deep .el-upload {
  display: block !important;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  overflow: auto;
  height: 1330px;
  text-align: center;
}

::v-deep .el-popper__content {
  font-size: 30px !important; /* 修改字体大小为 16px */
}

.image-title-container {
  display: flex;
  align-items: center;
  position: relative; /* 添加相对定位，以便绝对定位的文本相对于此容器定位 */
}
.title-container {
  position: absolute; /* 使用绝对定位将文本放在图片上 */
  top: 60%; /* 上边距设为50%，将文本垂直居中 */
  left: 46%; /* 左边距设为50%，将文本水平居中 */
  /* 使用translate来微调文本的位置 */
  transform: translate(-46%, -50%);
}

.centered-text {
  text-align: center; /* 文本水平居中 */
  font-size: 7rem; /* 设置文本字体大小 */
  font-weight: bold; /* 设置文本加粗 */
  /* color:#FFC000; */
  color: rgb(255, 251, 0);
}

.title-container2 {
  position: absolute; /* 使用绝对定位将文本放在图片上 */
  top: 95%; /* 上边距设为50%，将文本垂直居中 */
  left: 47%; /* 左边距设为50%，将文本水平居中 */
  transform: translate(-48%, -50%); /* 使用translate来微调文本的位置 */
}

.centered-text2 {
  text-align: center; /* 文本水平居中 */
  font-size: 4rem; /* 设置文本字体大小 */
  font-weight: bold; /* 设置文本加粗 */
  /* color:#FFC000; */
  color: rgb(255, 251, 0);
  font-family: "HYXJ";
}

@font-face {
  font-family: "HYXJ";
  src: url("@/assets/font/homeFont.ttf") format("truetype");
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

#fourTopic-0,
#fourTopic-1,
#fourTopic-2,
#fourTopic-3 {
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

#warning-cgai,
#warning-cyyy,
#warning-ddzh,
#warning-gxdc,
#warning-ggzm,
#warning-ljdp,
#warning-wllz,
#warning-ljqsm,
#warning-hwzy,
#warning-szhcsgj,
#warning-tcwt,
#warning-yczl,
#warning-toilet {
  width: 25px;
  height: 25px;
  background-color: #11e1b0;
  border-radius: 50%;
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
.dept-item {
  margin-top: 2vh;
  margin-right: 1vw;
}

.list_container {
  display: flex;
}
.list_title {
  flex: 1;
  display: flex;
  flex-direction: column; /* 将列表项垂直排列 */
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  text-align: center;
  padding: 10px; /* 添加一些内边距来调整样式 */

  font-size: 1rem;
}
.list_body {
  flex: 1;
  display: flex;
  flex-direction: column; /* 将列表项垂直排列 */
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  text-align: center;
  padding: 10px; /* 添加一些内边距来调整样式 */
  font-size: 1rem;
}
.list_body li {
  list-style: none;
  margin: 5px 0; /* 调整列表项之间的垂直间距 */
}
</style>
