<template>
  <div class="history-alarm-container">
    <div style="display: block; text-align: center; font-size: x-large; font-weight: bold; margin-bottom: 10px;">
      {{ title }}
    </div>

    <div>
      <el-date-picker
        v-model="localDateRange"
        type="daterange"
        unlink-panels
        range-separator="到"
        start-placeholder="选择开始时间"
        end-placeholder="选择结束时间"
        :disabled-date="disabledDate"
        :shortcuts="shortcuts"
        @change="handleDateChange"
        size="large"
        style="margin: 0.5rem 0 0.5rem"
      />

      <el-table
        :data="paginatedData"
        style="width: 100%"
        size="large"
        class="data-table"
      >
        <el-table-column prop="event_id" label="事件编号" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="event_source" label="事件来源" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="event_cause" label="事件详情" min-width="450" align="center" show-overflow-tooltip />
        <el-table-column prop="event_disposed" label="事件是否已处理" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="event_time" label="发生时间" min-width="250" align="center" show-overflow-tooltip />
        <el-table-column prop="administrator" label="派发人" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="instruction_time" label="指令下达时间" min-width="250" align="center" show-overflow-tooltip />
        <el-table-column prop="administrator_phone" label="派发人电话" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="instruction_content" label="指令内容" min-width="450" align="center" show-overflow-tooltip />
        <el-table-column prop="event_handler" label="事件处理人" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="handler_phone" label="处理人电话" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="handler_work" label="处理人工作单位" min-width="150" align="center" show-overflow-tooltip />
      </el-table>

      <div class="float-warningEnd" style="margin-top: 10px;">
        <el-pagination
          background
          layout="->,total, prev, pager, next, jumper"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// 定义 Props (父组件传进来的数据)
const props = defineProps({
  title: {
    type: String,
    default: '历史告警事件'
  },
  // 完整的列表数据
  dataList: {
    type: Array,
    default: () => []
  },
  // 日期范围绑定值
  dateRange: {
    type: Array,
    default: () => []
  },
  // 分页相关
  currentPage: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 5
  },
  // 配置项
  disabledDate: Function,
  shortcuts: Array
});

// 定义 Emits (向父组件发送事件)
const emit = defineEmits(['update:dateRange', 'changeDate', 'pageChange']);

// 计算属性：处理 v-model 的双向绑定
const localDateRange = computed({
  get: () => props.dateRange,
  set: (val) => emit('update:dateRange', val)
});

// 计算属性：前端分页切片逻辑
// 如果后端没有分页，前端在这里切片；如果后端分页了，父组件直接传当前页数据即可
const paginatedData = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize;
  const end = props.currentPage * props.pageSize;
  // 这里做个判断：如果父组件传的是全量数据，我们切片；如果已经是当前页数据，直接返回
  if (props.dataList.length > props.pageSize) {
    return props.dataList.slice(start, end);
  }
  return props.dataList;
});

// 事件处理
const handleDateChange = (val) => {
  emit('changeDate', val);
};

const handlePageChange = (val) => {
  emit('pageChange', val);
};
</script>

<style scoped>
/* 可以在这里补充样式 */
</style>