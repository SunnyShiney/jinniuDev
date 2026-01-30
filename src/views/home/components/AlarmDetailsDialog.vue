<template>
  <div class="dialog-content">
    <div class="dialog-header">
      {{ title }}
    </div>

    <el-table 
      :data="defaultList" 
      border 
      stripe 
      max-height="600px" 
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
    >
      <el-table-column type="index" label="序号" width="60" align="center" :resizable="false"/>
      <el-table-column prop="event_time" label="发生时间" width="200" align="center" sortable :resizable="false"/>
      <el-table-column prop="site_name" label="告警类型/站点" width="160" align="center" :resizable="false">
        <template #default="scope">
           <el-tag :type="getTagType(scope.row.site_name)" effect="light" round>
            {{ scope.row.site_name || '未知类型' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="Accident_cause" label="事故详情说明" min-width="240" align="center" show-overflow-tooltip :resizable="false"/>
      <el-table-column label="操作" width="100" align="center" fixed="right" :resizable="false">
        <template #default="scope">
          <el-button type="primary" link size="small" style="font-weight: bold" @click="onProcessClick(scope.$index, scope.row)">
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
  // ✅ 2. 定义 title 属性，默认值可设为空或你常用的值
  title: { type: String, default: '未处理的事件' },

  defaultList: { type: Array, default: () => [] },
  changeValue: [String, Number],
  warningCurrentPage: { type: Number, default: 1 },
  warningTotalRecords: { type: Number, default: 0 },
  disabledDate: Function,
  shortcuts: Array
})

// Emits 定义
const emit = defineEmits(['warning-handle-click', 'change-date', 'current-change'])

// Methods 保持不变
const handlePageChange = (val) => emit('current-change', val)
const getTagType = (name) => {
  if (!name) return 'info';
  if (name.includes('点位')) return 'warning';
  else if (name.includes('处置') || name.includes('车辆')) return 'danger';
  else if (name.includes('已处理')) return 'success';
  return '';
}
const onProcessClick = (index, row) => {
  if (!row) return;
  emit('warning-handle-click', index, { ...row }) 
}
</script>

<style scoped>
.dialog-content {
  padding: 10px;
}

/* ✅ 3. 将原先 <text> 的样式移到这里 */
.dialog-header {
  display: block; 
  text-align: center; 
  font-size: x-large; 
  font-weight: bold;
  margin-bottom: 15px; /* 增加下方间距，不让表格紧贴标题 */
  color: #303133;      /* 建议加个深灰色，比纯黑好看 */
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>