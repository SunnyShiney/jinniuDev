<template>
  <div id="item">
    <el-image
      class="logo"
      :src="getHomeAsset(logo)"
      style="width: 35px"
    ></el-image>
    <el-tooltip
      v-if="name == '环境卫生'"
      placement="top-start"
      effect="light"
      content="环卫作业运行管家 垃圾全生命周期管家 智慧公厕管家"
      popper-class="tip-class"
    >
      <span :class="styleName">{{ name }}</span>
    </el-tooltip>
    <el-tooltip
      v-else-if="name == '市容秩序'"
      placement="top-start"
      effect="light"
      content="餐饮油烟管家 调度指挥管家 扬尘治理大数据协同管家 共享单车管家 街面图像综合应用管家"
      popper-class="tip-class"
    >
      <span :class="styleName">{{ name }}</span>
    </el-tooltip>
    <el-tooltip
      v-else-if="name == '城市景观'"
      placement="top-start"
      effect="light"
      content="景观照明管家 临街店铺管家"
      popper-class="tip-class"
    >
      <span :class="styleName">{{ name }}</span>
    </el-tooltip>
    <el-tooltip
      v-else-if="name == '数字城管'"
      placement="top-start"
      effect="light"
      content="综合行政管理执法智慧管家 城管AI识别管家 数字化城市信息管家 网络理政管家"
      popper-class="tip-class"
    >
      <span :class="styleName">{{ name }}</span>
    </el-tooltip>
    <el-tooltip
      v-else
      placement="top-start"
      effect="light"
      :content="name"
      popper-class="tip-class"
    >
      <span :class="styleName">{{ name }}</span>
    </el-tooltip>
  </div>
</template>
<script setup>
defineProps({
  logo: String,
  name: String,
  styleName: String,
  systemName: String,
});

const getHomeAsset = (imgName) => {
  // ⚠️ 注意：这里必须用相对路径，不能用 @
  // ../assets/home/ 对应你的文件结构：从 components 目录跳出来，进 assets/home
  return new URL(`../../../assets/home/${imgName}`, import.meta.url).href
}
</script>

<style>
div.tip-class {
  font-size: 20px;
  padding: 15px;
}

#item {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-left: 40px;
  padding-left: 10px;
  padding-right: 10px;
}

#item {
  position: relative;
  text-decoration: none;
  font-size: 25px;
  color: #333;
}

#item:before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  height: 3px;
  width: 100%;
  background: #4285f4;
  transform: scale(0);
  transition: all 0.3s;
}

#item:hover:before {
  transform: scale(1);
}

.logo {
  margin-right: 10px;
}

.className {
  font-size: 29px;
  display: inline-block;
  width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subsysName {
  font-size: 28px;
  padding: 5px;
  display: inline-block;
}
</style>
