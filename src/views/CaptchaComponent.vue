<template>
  <div class="captcha-container" @click="refreshCaptcha">
    <canvas ref="captchaCanvas" :width="options.width" :height="options.height"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue';

const captchaCanvas = ref(null);
const currentCode = ref(''); // 存储当前生成的验证码值
const options = {
  width: 120,
  height: 40,
  fontSize: 25,
  codeLength: 4, // 验证码长度
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
};

// 暴露给父组件的方法
defineExpose({
  validate, // 验证用户输入
  refreshCaptcha, // 刷新验证码
});

// 组件挂载后初始化验证码
onMounted(() => {
  drawCaptcha();
});

// --- 核心逻辑函数 ---

/**
 * @description: 获取 min 到 max 之间的随机数
 */
function getRandNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @description: 获取随机颜色 (rgb)
 */
function getRandColor(min, max) {
  const r = getRandNum(min, max);
  const g = getRandNum(min, max);
  const b = getRandNum(min, max);
  return `rgb(${r},${g},${b})`;
}

/**
 * @description: 生成随机字符串
 */
const getRandomCode = () => {
  let code = '';
  for (let i = 0; i < options.codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * options.chars.length);
    code += options.chars[randomIndex];
  }
  return code;
};

/**
 * @description: 绘制验证码图像
 */
function drawCaptcha() {
  const canvas = captchaCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // 1. 设置背景
  ctx.fillStyle = getRandColor(180, 240); // 随机背景色
  ctx.fillRect(0, 0, options.width, options.height);

  // 2. 绘制干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = getRandColor(40, 180);
    ctx.beginPath();
    ctx.moveTo(getRandNum(0, options.width), getRandNum(0, options.height));
    ctx.lineTo(getRandNum(0, options.width), getRandNum(0, options.height));
    ctx.stroke();
  }

  // 3. 绘制文字
  const code = getRandomCode();
  currentCode.value = code; // 更新存储的验证码值
  ctx.font = `${options.fontSize}px Arial`;
  
  for (let i = 0; i < code.length; i++) {
    ctx.fillStyle = getRandColor(0, 100);
    // 保存当前画布状态
    ctx.save(); 
    // 平移到文字位置
    ctx.translate(15 + i * 20, 25); 
    // 随机旋转角度
    ctx.rotate(getRandNum(-30, 30) * Math.PI / 180);
    ctx.fillText(code[i], 0, 0);
    // 恢复画布状态，清除旋转
    ctx.restore(); 
  }
  
  // 4. 绘制干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = getRandColor(0, 255);
    ctx.beginPath();
    ctx.arc(getRandNum(0, options.width), getRandNum(0, options.height), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * @description: 刷新验证码 (点击事件)
 */
function refreshCaptcha() {
  drawCaptcha();
}

/**
 * @description: 验证用户输入是否正确
 * @param {string} input - 用户输入的验证码
 * @returns {boolean}
 */
function validate(input) {
  // 转换为小写进行不区分大小写的验证
  return input.toLowerCase() === currentCode.value.toLowerCase();
}
</script>

<style scoped>
/* 使用绝对值确保宽度和高度稳定 */
.captcha-container {
  display: flex;
  align-items: center;
  justify-content: center; /* 默认居中 canvas */
  border: 1px solid #22aee6;
  background: rgba(62, 181, 228, 0.25);
  cursor: pointer;
  width: 100%; /* 继承父容器的宽度 */
  height: 4.4vh; /* 确保高度与 input 匹配 */
  overflow: hidden;
  position: relative;
}

canvas {
  /* 确保 canvas 居中且不被挤压 */
  width: 120px;
  height: 40px;
  display: block;
}
</style>