<template>
  <div class="text-week">
  <el-dialog v-model="localVisible" title="事故详情" @close="handleClose">
    <div style="text-align: center; font-size: x-large; font-weight: bold">
      未处理的事件
    </div>
    <el-table
        :data="warningList"
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
      />
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

    <div style="text-align: center; font-size: x-large; font-weight: bold">
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
        :data="historyList.slice((warningCurrentPage - 1) * 5, warningCurrentPage * 5)"
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

    <el-pagination
        background
        layout="->,total, prev, pager, next, jumper"
        :total="warningTotalRecords"
        :current-page="warningCurrentPage"
        :page-size="5"
        @current-change="getTransport"
    />
  </el-dialog>
  <!-- 事故处理表单部分 -->
  <el-dialog
      v-model="warningHandleEvent"
      title="事故处理"
      @close="handleClose"
  >
    <el-form
        ref="warningRuleFormRef"
        :model="warningRuleForm"
        status-icon
        :warningRules="warningRules"
        label-width="120px"
        class="demo-warningRuleForm"
    >
      <el-form-item label="处置人信息：" prop="info">
        <el-select
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
          />
        </el-select>
      </el-form-item>

      <el-form-item label="处置指令内容：" prop="content">
        <el-input
            v-model="warningRuleForm.content"
            type="textarea"
            autocomplete="off"
        />
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


<script setup>

import {ref, watch, computed, reactive} from 'vue'
import moment from "moment/moment";
import axios from "axios";
import {params} from "@/store/store";

// Props & Emits
const props = defineProps({
  visible: Boolean,
  warningList: {
    type: Array,
    default: () => [],
  },
  historyList: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:visible']);
// const localVisible = computed({
//   get: () => props.visible,
//   set: (val) => emit('update:visible', val),
// });
const localVisible = ref(props.visible)

// 双向同步 visible 与本地状态
watch(() => props.visible, (val) => {
  localVisible.value = val
})

watch(localVisible, (val) => {
  console.log('弹窗状态变化为：', val)
  emit('update:visible', val)
})
console.log("into event table")
const warningRuleFormRef = ref(null);
const defaultList = reactive([]);
const EventHistoryList = reactive([]);
const warningHandleEvent = ref(false);
const warningToken = ref("");
const event_uuid = ref("");
const rowIndex = ref("");

const warningTotalRecords = ref(1000);
let warningCurrentPage = ref(1);

const warningRuleForm = reactive({
  name: "",
  phone: "",
  place: "",
  content: "",
});

//四大板块的历史告警事件列表
const hjwsHistoryList = reactive([]);
const srzxHistoryList = reactive([]);
const csjgHistoryList = reactive([]);
const szcgHistoryList = reactive([]);
//每个子系统的历史告警事件列表
const hwzyHistoryList = reactive([]);
const ljqsmHistoryList = reactive([]);
const toiletWarningHistoryList = reactive([]);
const cyyyHistoryList = reactive([]);
const ddzhHistoryList = reactive([]);
const gxdcHistoryList = reactive([]);
const yczlHistoryList = reactive([]);
const jgzmHistoryList = reactive([]);
const zmgjHistoryList = reactive([]);
const ljdpHistoryList = reactive([]);
const tcwtHistoryList = reactive([]);
const cgaiHistoryList = reactive([]);
const wllzHistoryList = reactive([]);
const szhcsHistoryList = reactive([]);
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
      switch (data[key].systemName) {
        case "垃圾系统":
          hwzyHistoryList.push(default_site);
          break;
        case "垃圾分类系统":
          ljqsmHistoryList.push(default_site);
          break;
        case "厕所系统":
          toiletWarningHistoryList.push(default_site);
          break;
        case "餐饮油烟系统":
          cyyyHistoryList.push(default_site);
          break;
        case "调度指挥系统":
          ddzhHistoryList.push(default_site);
          break;
        case "共享单车系统":
          gxdcHistoryList.push(default_site);
          break;
        case "扬尘治理系统":
          yczlHistoryList.push(default_site);
          break;
        case "景观照明系统":
          jgzmHistoryList.push(default_site);
          break;
        case "照明管家系统":
          zmgjHistoryList.push(default_site);
          break;
        case "临街店铺系统":
          ljdpHistoryList.push(default_site);
          break;
        case "突出问题系统":
          tcwtHistoryList.push(default_site);
          break;
        case "城管ai系统":
          cgaiHistoryList.push(default_site);
          break;
        case "网络理政系统":
          wllzHistoryList.push(default_site);
          break;
        case "数字城管系统":
          szhcsHistoryList.push(default_site);
          break;
        default:
          //未匹配到的系统名处理
          break;
      }
    }
    hjwsHistoryList.push(...hwzyHistoryList, ...ljqsmHistoryList, ...toiletWarningHistoryList);
    srzxHistoryList.push(...cyyyHistoryList, ...ddzhHistoryList, ...gxdcHistoryList, ...yczlHistoryList);
    csjgHistoryList.push(...jgzmHistoryList, ...zmgjHistoryList, ...ljdpHistoryList);
    szcgHistoryList.push(...tcwtHistoryList, ...cgaiHistoryList, ...wllzHistoryList, ...szhcsHistoryList);
    EventHistoryList.sort((a, b) => new Date(b.event_time) - new Date(a.event_time));
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
    [
      hjwsList, srzxList, csjgList, szcgList,
      hwzyList, ljqsmList, toiletWarningList,
      cyyyList, ddzhList, gxdcList, yczlList,
      jgzmList,zmgjList,ljdpList,
      tcwtList, cgaiList, wllzList, szhcsList
    ].forEach(list => list.splice(0, list.length));
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

      switch (data[key].systemName) {
        case "垃圾系统":
          hwzyList.push(default_site);
          break;
        case "垃圾分类系统":
          ljqsmList.push(default_site);
          break;
        case "厕所系统":
          toiletWarningList.push(default_site);
          break;
        case "餐饮油烟系统":
          cyyyList.push(default_site);
          break;
        case "调度指挥系统":
          ddzhList.push(default_site);
          break;
        case "共享单车系统":
          gxdcList.push(default_site);
          break;
        case "扬尘治理系统":
          yczlList.push(default_site);
          break;
        case "景观照明系统":
          jgzmList.push(default_site);
          break;
        case "照明管家系统":
          zmgjList.push(default_site);
          break;
        case "临街店铺系统":
          ljdpList.push(default_site);
          break;
        case "突出问题系统":
          tcwtList.push(default_site);
          break;
        case "城管ai系统":
          cgaiList.push(default_site);
          break;
        case "网络理政系统":
          wllzList.push(default_site);
          break;
        case "数字城管系统":
          szhcsList.push(default_site);
          break;
        default:
          //未匹配到的系统名处理
          break;
      }

      hjwsList.push(...hwzyList, ...ljqsmList, ...toiletWarningList);
      srzxList.push(...cyyyList, ...ddzhList, ...gxdcList, ...yczlList);
      csjgList.push(...jgzmList, ...zmgjList, ...ljdpList);
      szcgList.push(...tcwtList, ...cgaiList, ...wllzList, ...szhcsList);
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

    // 四大板块指示灯
    document.getElementById("fourTopic-0").style.backgroundColor = hjwsList.length ? "#E12911" : "#11e1b0";
    document.getElementById("fourTopic-1").style.backgroundColor = srzxList.length ? "#E12911" : "#11e1b0";
    document.getElementById("fourTopic-2").style.backgroundColor = csjgList.length ? "#E12911" : "#11e1b0";
    document.getElementById("fourTopic-3").style.backgroundColor = szcgList.length ? "#E12911" : "#11e1b0";

// 每个子系统指示灯
    document.getElementById("warning-hwzy").style.backgroundColor = hwzyList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-ljqsm").style.backgroundColor = ljqsmList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-toilet").style.backgroundColor = toiletWarningList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-cyyy").style.backgroundColor = cyyyList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-ddzh").style.backgroundColor = ddzhList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-gxdc").style.backgroundColor = gxdcList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-yczl").style.backgroundColor = yczlList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-jgzm").style.backgroundColor = jgzmList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-zmgj").style.backgroundColor = zmgjList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-ljdp").style.backgroundColor = ljdpList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-tcwt").style.backgroundColor = tcwtList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-cgai").style.backgroundColor = cgaiList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-wllz").style.backgroundColor = wllzList.length ? "#E12911" : "#11e1b0";
    document.getElementById("warning-szhcs").style.backgroundColor = szhcsList.length ? "#E12911" : "#11e1b0";

  });
};
changeColor();
setInterval(changeColor, 60000);
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

let changeValue = ref(["", ""]);
let warningStart = moment("2023-03-01").format("YYYY-MM-DD");
let warningEnd = moment().format("YYYY-MM-DD");
function changeDate() {
  warningStart = moment(changeValue.value[0]).format("YYYY-MM-DD");
  warningEnd = moment(changeValue.value[1]).format("YYYY-MM-DD");
  // warningEnd =  new Date();
  props.queryAllWarning(warningStart, warningEnd, 1);
}
const disabledDate = (time) => {
  return (
      // time.getTime() < new Date("2022-8-31").getTime() ||
      time.getTime() > new Date().getTime()
  );
};

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
      //发送短信（新增部分）
      axios({
        url: "api/sms/sendMessage",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: warningToken.value,
        },
        data: {
          mobile: selectedValue.phone,
          message: warningRuleForm.content,
        },
      }).then(function (res) {
        console.log("短信发送成功：", res);
      })
          .catch(function (err) {
            console.error("短信发送失败：", err);
          });

      axios({
        url: "/api/event-query/updateHandleEvent",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + params.token,
        },
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
        //systemData.out.println("event_uuid:" + event_uuid);
        console.log("event_uuid:", event_uuid.value);
      });
      console.log("submit!");
      alert("提交成功！");
      warningHandleEvent.value = false;
      changeColor();
    } else {
      alert("提交失败！");
      return false;
    }
  });
};

const warningRules = reactive({
  info: [{ required: "true", message: "处置人信息不能为空", trigger: "blur" }],
  content: [{ required: "true", message: "指令内容不能为空", trigger: "blur" }],
});

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

const warningFormatResult = (result) => {
  return `${result.name} - ${result.phone} - ${result.company}`;
};
</script>


<style scoped>
.text-week {
  margin-left: -10vw;
  font-size: large;
  color: #fff;
  line-height: 60px;
  width: 100px;
  height: 100px;
}
</style>