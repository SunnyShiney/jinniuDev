<template>
  <div class="dialog-content">
    <el-table 
      :data="defaultList" 
      border 
      stripe 
      height="500px" 
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      
      <el-table-column prop="event_time" label="发生时间" width="180" align="center" sortable />
      
      <el-table-column prop="site_name" label="告警类型/站点" width="150" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.site_name === '点位告警' ? 'warning' : 'danger'">
            {{ scope.row.site_name }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="Accident_cause" label="事故详情说明" show-overflow-tooltip />

      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-button 
            type="primary" 
            link 
            size="small"
            @click="onProcessClick(scope.$index, scope.row)"
          >
            处理
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-if="warningTotalRecords > 0"
        background
        layout="total, prev, pager, next, jumper"
        :current-page="warningCurrentPage"
        :page-size="10" 
        :total="warningTotalRecords"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
// Props 定义
const props = defineProps({
  defaultList: { type: Array, default: () => [] },
  eventHistoryList: Array,
  changeValue: [String, Number],
  warningCurrentPage: { type: Number, default: 1 },
  warningTotalRecords: { type: Number, default: 0 },
  disabledDate: Function,
  shortcuts: Array
})

// Emits 定义
const emit = defineEmits(['warning-handle-click', 'change-date', 'current-change'])

// 翻页事件
const handlePageChange = (val) => {
  emit('current-change', val)
}

// 🔥 新增：点击“处理”按钮的事件
const onProcessClick = (index, row) => { // 1. 这里必须接收两个参数

  // 2. 防御性判断：检查 row 是否存在
  if (!row) {
    console.error('错误：当前行数据为空 (undefined)，无法处理！')
    return
  }

  // 3. 关键：同时把 index 和 row 发送给父组件
  // 必须保持顺序，因为父组件是按 (index, row) 接收的
  emit('warning-handle-click', index, { ...row }) 
}
</script>

<style scoped>
.dialog-content {
  padding: 10px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>