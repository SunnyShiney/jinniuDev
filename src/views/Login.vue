<template>
  <div class="login-container">
    <div class="login-header">
      <div class="login-header-title">成都市金牛区综合行政执法局</div>
    </div>
    <div class="login-box">
      <img class="login-box-logo" alt="城市管家" src="@/assets/login/login-logo.png" />
      <div class="login-box-title">城市管家</div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @keyup.enter="login(loginFormRef)"
      >
        <el-form-item prop="username" class="form-item-username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名" 
            size="large"
            clearable
            class="username-input-el"
          />
        </el-form-item>
        
        <el-form-item prop="password" class="form-item-password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            size="large"
            show-password
            class="password-input-el"
          />
        </el-form-item>
        
        <el-form-item prop="captchaCode" class="form-item-captcha">
          <el-input 
            v-model="loginForm.captchaCode" 
            placeholder="请输入验证码" 
            class="captcha-input-el"
            size="large"
            @keyup.enter="login(loginFormRef)"
          />
          <CaptchaComponent ref="captchaRef" class="captcha-component"/>
        </el-form-item>

        <div class="form-bottom-actions">
          <div class="remember-password-group">
            <input
              class="remember-password-checkbox"
              type="checkbox"
              v-model="rememberUser"
            />
            <span class="remember-password-text-label">记住密码</span>
          </div>
          <el-button
            class="forget-password-btn"
            plain
            link
            color="#ffffff"
            @click="forgetPassword"
          >忘记密码？</el-button>
        </div>

        <el-form-item class="form-item-login-btn">
          <el-button 
            class="login-btn" 
            type="primary" 
            color="#0B9ED9" 
            @click="login(loginFormRef)"
            size="large"
          >
            登录
          </el-button>
        </el-form-item>
        
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElForm, ElInput } from "element-plus";
import router from "@/router";
import { ref, onMounted, reactive } from "vue";
import { params } from "@/store/store.js";
import { getLogin, uploadClickLog } from "@/api/home.js"; 
import { setToken, setHwzyToken } from "@/composables/auth";
import { useStore } from "vuex";
import { Base64 } from "js-base64";
// 导入前端验证码组件
import CaptchaComponent from './CaptchaComponent.vue'; 

const store = useStore();
const loginFormRef = ref(null); 
const captchaRef = ref(null); // 验证码组件实例 Ref
const rememberUser = ref(false); 

// 登录表单数据模型
const loginForm = reactive({
    username: params.username || "",
    password: params.password || "",
    captchaCode: "", // 验证码输入
});

// 表单验证规则
const rules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    captchaCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
});

// --- 初始化和记住密码逻辑 ---
onMounted(() => {
    // URL 参数提取逻辑
    const hash = window.location.hash;
    if (hash.includes("?")) {
        const paramsString = hash.split("?")[1];
        const urlParams = new URLSearchParams(paramsString);
        const username = urlParams.get("username");
        const password = urlParams.get("password");
        if (username && password) {
            loginForm.username = Base64.decode(username);
            loginForm.password = Base64.decode(password);
            login(loginFormRef.value); 
        }
    } else {
        // 记住密码逻辑
        if (localStorage.getItem("username")) {
            loginForm.username = localStorage.getItem("username");
            rememberUser.value = true;
        }
        if (localStorage.getItem("password")) {
            loginForm.password = localStorage.getItem("password");
        }
    }
});

// --- 核心登录逻辑 ---
const login = (formEl) => {
    if (!formEl) return;

    formEl.validate(async (valid) => {
        if (!valid) {
            ElMessage.warning("请完整填写登录信息！");
            return;
        }
        if (!captchaRef.value || !captchaRef.value.validate(loginForm.captchaCode)) {
             ElMessage.error("验证码输入错误或已过期，请点击图片刷新！");
             captchaRef.value.refreshCaptcha(); // 验证失败，刷新验证码
             loginForm.captchaCode = ""; // 清空输入
             return; 
        }
        var user = {
            name: loginForm.username,
            password: loginForm.password,
        };

        try {
            const data = await getLogin(user);
            if (data.error_message === "success") {
                if (rememberUser.value) {
                    localStorage.setItem("username", loginForm.username);
                    localStorage.setItem("password", loginForm.password);
                } else {
                    localStorage.removeItem("username");
                    localStorage.removeItem("password");
                }
                // 4. 初始密码强制重设/正常登录逻辑
                if (data.isValidPassword === "false") {
                    ElMessage.error({ message: "您的密码为初始密码，为保证登录安全请重设密码！" });
                    params.token = data.token;
                    setToken(data.token);
                    router.push("/changepsw");
                } else {
                    // 正常登录成功
                    params.isLogin = true;
                    params.token = data.token;
                    params.roleId = data.role_id;
                    params.hwzyToken = data.hwzyToken;
                    setToken(data.token);
                    setHwzyToken(data.hwzyToken);

                    params.role = data.role_id.includes("83") ? "管理员" : "";
                    
                    router.push({ name: "map" });
                }
                
                uploadClickLog("城市管家"); // 登录成功后记录日志
            } else {
                // 登录失败
                ElMessage.error(data.error_message || "登录失败，请检查您的凭证！");
                captchaRef.value.refreshCaptcha(); // 登录失败刷新验证码
            }
        } catch (error) {
            console.error("登录请求失败:", error);
            ElMessage.error("登录请求发生错误，请稍后重试。");
            captchaRef.value.refreshCaptcha(); // 失败后刷新验证码
        }
    });
};

const forgetPassword = () => {
    router.push("/forget-password");
};
</script>

<style scoped>
/* ========================================================================= */
/* 样式部分：适配 EL-FORM 和验证码组件 */
/* ========================================================================= */

.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/login/login-background.png");
  background-size: 100% 100%;
}

.login-header {
  width: 100vw;
  height: 8.1vh;
  margin: auto auto;
  background-image: url("@/assets/login/login-header.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 1.5vh;
}

.login-header-title {
  width: 32.1vw;
  height: 5.1vh;
  font-size: 1.8rem;
  color: #ffffff;
  font-family: Alibaba PuHuiTi;
  text-align: center;
  text-shadow: 0 1px 4px rgba(0, 85, 255, 0.75);
  margin-left: auto;
  margin-right: auto;
}

.login-box {
  width: 35vw;
  height: 53.7vh;
  background-image: url("@/assets/login/login-border.png");
  background-size: cover;
  margin-top: 14.5vh;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.login-box-title {
  width: 6.7vw;
  height: 4.2vh;
  font-family: PingFangSC-Medium;
  font-size: 1.2rem;
  color: #ffffff;
  position: absolute;
  top: 15vh;
  right: 13.1vw;
  left: 16.5vw;
}

.login-box-logo {
  width: 1.7vw;
  height: 3vh;
  position: absolute;
  top: 14.4vh;
  left: 14.5vw;
  right: 20.2vw;
  margin-right: 0.4vw;
}

/* 核心调整：EL-FORM 定位 */
.login-form {
    position: absolute; 
    top: 20.4vh; 
    left: 7.1vw;
    width: 20.8vw; 
}

.login-form :deep(.el-form-item) {
    margin-bottom: 0 !important; 
}

/* --- 1. 用户名输入框定位 --- */
.form-item-username {
    position: absolute; 
    top: 0; 
    width: 100%;
}
.username-input-el :deep(.el-input__wrapper) {
    background: rgba(62, 181, 228, 0.25) !important;
    border: 1px solid #22aee6;
    box-shadow: none; 
    height: 4.4vh; 
}
.username-input-el :deep(.el-input__inner) {
    color: #ffffff;
    font-size: 1rem;
    background-image: url("@/assets/login/username.png");
    background-repeat: no-repeat;
    background-position: left 0.8vw center;
    padding-left: 2.1vw;
}


/* --- 2. 密码输入框定位 --- */
.form-item-password {
    position: absolute; 
    top: 6.6vh; 
    width: 100%;
}
.password-input-el :deep(.el-input__wrapper) {
    background: rgba(62, 181, 228, 0.25) !important;
    border: 1px solid #22aee6;
    box-shadow: none;
    height: 4.4vh;
}
.password-input-el :deep(.el-input__inner) {
    color: #ffffff;
    font-size: 1rem;
    background-image: url("@/assets/login/password.png");
    background-repeat: no-repeat;
    background-position: left 0.8vw center;
    padding-left: 2.1vw;
}

/* --- 3. 验证码输入框定位 --- */
.form-item-captcha {
    position: absolute; 
    top: 13.2vh; 
    width: 100%;
    
    display: flex; 
    align-items: center;
    justify-content: space-between;
}

.captcha-input-el {
    width: 63% !important; 
}

.captcha-input-el :deep(.el-input__wrapper) {
    background: rgba(62, 181, 228, 0.25) !important;
    border: 1px solid #22aee6;
    box-shadow: none;
    height: 4.4vh;
}
.captcha-input-el :deep(.el-input__inner) {
    color: #ffffff; 
    font-size: 1rem;
    padding-left: 10px; 
}

.captcha-component {
    width: 35%; 
    height: 4.4vh; 
}

/* --- 4. 底部操作区域样式 --- */
.form-bottom-actions {
    position: absolute;
    top: 19vh; 
    width: 100%;
    
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.remember-password-group {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 0.875rem;
}

.remember-password-text-label {
    margin-left: 5px;
}

.remember-password-checkbox {
    width: 0.7vw;
    height: 1.3vh;
}

.forget-password-btn {
    font-size: 0.875rem;
}

/* --- 5. 登录按钮样式 --- */
.form-item-login-btn {
    position: absolute; 
    top: 23vh; 
    width: 100%;
}

.login-btn {
    width: 100%; 
    height: 4.4vh;
    font-size: 0.875rem;
}

/* 清除 Element Plus 校验图标的颜色 */
.login-form :deep(.el-input__suffix-inner) {
    color: #fff;
}
</style>