<template>
  <div class="container">
    <div class="forget-password">
      <h2>忘记密码</h2>
      <el-form
        :model="formState"
        :rules="formRules"
        ref="forgotFormRef"
        label-width="auto"
        style="max-width: 600px"
        size="large"
      >
        <el-form-item label="电话号码" prop="phoneNumber">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="16">
              <el-input
                v-model.number="formState.phoneNumber"
                placeholder="请输入电话号码"
                :disabled="countdown > 0"
                @input="handlePhoneInput"
              ></el-input>
            </el-col>
            <el-col :span="8">
              <el-button
                :disabled="isCodeButtonDisabled"
                @click="sendVerificationCode"
                type="primary"
                style="width: 100%"
              >
                {{ countdown > 0 ? `${countdown}秒后重新发送` : "发送验证码" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="验证码" prop="verificationCode">
          <el-input
            v-model="formState.verificationCode"
            placeholder="请输入验证码"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="confirm" type="primary" style="width: 100px"
            >确认</el-button
          >
        </el-form-item>
      </el-form>

      <el-dialog
        v-model="changePasswordDialog"
        title="修改密码"
        align-center
        width="30%"
      >
        <el-form
          :model="formState.newPasswordForm"
          :rules="passwordRules"
          ref="passwordFormRef"
        >
          <el-form-item
            label="新密码"
            label-width="120px"
            prop="new_password"
          >
            <el-input
              v-model="formState.newPasswordForm.new_password"
              autocomplete="off"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="再次确认密码"
            label-width="120px"
            prop="new_password_confirm"
          >
            <el-input
              v-model="formState.newPasswordForm.new_password_confirm"
              autocomplete="off"
              type="password"
              show-password
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="changePasswordDialog = false">取消</el-button>
            <el-button
              type="primary"
              @click="submitForm(passwordFormRef)"
            >
              确认修改密码
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { sendSMS, validateSMS, resetPasswordSMS } from "@/api/home.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

// 统一管理主表单数据
const formState = reactive({
  phoneNumber: "",
  verificationCode: "",
  // 将新密码表单数据也纳入统一管理
  newPasswordForm: {
    new_password: "",
    new_password_confirm: "",
  },
});

const token = ref("");
const countdown = ref(0);
const countdownTimer = ref(null); // 用于存储定时器实例
const changePasswordDialog = ref(false);

// 表单引用
const forgotFormRef = ref(null);
const passwordFormRef = ref(null);

// --- 验证码按钮逻辑优化 ---

// 手机号验证正则 (一个简单的国内手机号正则)
const phoneRegExp = /^1[3-9]\d{9}$/;

// 手机号是否有效
const isPhoneValid = computed(() => phoneRegExp.test(formState.phoneNumber));

// 验证码按钮的禁用状态
const isCodeButtonDisabled = computed(() => {
  // 如果正在倒计时，且手机号没有改变 (优化点)
  const isCounting = countdown.value > 0;
  // 如果手机号无效
  const isPhoneInvalid = !isPhoneValid.value;

  // 禁用逻辑：倒计时中 **或** 手机号无效
  return isCounting || isPhoneInvalid;
});

// 处理手机号输入，确保输入过程中倒计时不会被打断，但如果手机号改变，用户可以重新发送
const handlePhoneInput = () => {
    // 可以在这里添加清除验证码的逻辑，提示用户手机号已改变，需要重新发送
};

// --- 表单验证规则 ---

// 密码确认验证
const validateNewPass = (rules, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码！"));
  } else if (value.length < 8) {
    callback(new Error("密码长度至少8位！"));
  } else {
    // 确保新密码改变时，确认密码的校验也会被触发
    if (formState.newPasswordForm.new_password_confirm !== "") {
      passwordFormRef.value.validateField("new_password_confirm", () => null);
    }
    callback();
  }
};
const validateNewPassConfirm = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码！"));
  } else if (value !== formState.newPasswordForm.new_password) {
    callback(new Error("两次密码不相同！"));
  } else {
    callback();
  }
};

// 主表单验证规则 (电话号码和验证码)
const formRules = reactive({
  phoneNumber: [
    { required: true, message: "请输入电话号码", trigger: "blur" },
    {
      pattern: phoneRegExp,
      message: "请输入正确的手机号码格式",
      trigger: "blur",
    },
  ],
  verificationCode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { len: 6, message: "验证码应为6位数字", trigger: "blur" }, // 假设验证码为6位
  ],
});

// 新密码表单验证规则
const passwordRules = reactive({
  new_password: [{ validator: validateNewPass, trigger: "blur" }],
  new_password_confirm: [{ validator: validateNewPassConfirm, trigger: "blur" }],
});

// --- 方法实现 ---

/**
 * 启动倒计时
 */
const startCountdown = () => {
  if (countdownTimer.value) clearInterval(countdownTimer.value);

  countdown.value = 60;
  countdownTimer.value = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value);
      countdownTimer.value = null;
    }
  }, 1000);
};

/**
 * 发送短信验证码
 */
const sendVerificationCode = () => {
  // 在发送前再次进行手机号校验
  forgotFormRef.value.validateField("phoneNumber", (isValid) => {
    if (isValid) {
      startCountdown(); // 先启动倒计时，防止用户二次点击

      sendSMS(formState.phoneNumber)
        .then((data) => {
          if (data.status === true) {
            ElMessage.success("验证码发送成功！");
          } else {
            ElMessage.error(data.msg || "验证码发送失败，请重试！");
            // 发送失败则立即结束倒计时，以便用户重新点击
            if (countdownTimer.value) clearInterval(countdownTimer.value);
            countdown.value = 0;
          }
        })
        .catch((error) => {
          console.error("发送短信失败", error);
          ElMessage.error("网络请求失败，请检查手机号或稍后重试。");
          if (countdownTimer.value) clearInterval(countdownTimer.value);
          countdown.value = 0;
        });
    } else {
      ElMessage.warning("请先输入有效的手机号码！");
    }
  });
};

/**
 * 确认（验证码校验）
 */
const confirm = () => {
  // 统一校验主表单
  forgotFormRef.value.validate((valid) => {
    if (valid) {
      validateSMS(formState.phoneNumber, formState.verificationCode)
        .then((data) => {
          if (data.isValid === true) {
            ElMessage.success("验证成功，请设置新密码！");
            token.value = data.token; // 保存验证通过的 token
            formState.newPasswordForm.new_password = ""; // 清空上次设置的密码
            formState.newPasswordForm.new_password_confirm = "";
            changePasswordDialog.value = true;
          } else {
            ElMessage.error(data.msg || "验证码错误或已失效！");
          }
        })
        .catch((error) => {
          console.error("验证码校验失败", error);
          ElMessage.error("网络请求失败，请稍后重试。");
        });
    } else {
      ElMessage.warning("请完善表单信息！");
    }
  });
};

/**
 * 提交新密码表单
 */
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
          const params = {
            phone: formState.phoneNumber,
            token: token.value,
            password: formState.newPasswordForm.new_password,
          };
          resetPassword(params);
        })
        .catch(() => {
          ElMessage.info("已取消修改密码！");
        });
    }
  });
};

/**
 * 重置密码请求
 */
const resetPassword = (params) => {
  resetPasswordSMS(params)
    .then((data) => {
      if (data.isChanged === true) {
        ElMessage.success(data.msg || "密码修改成功！");
        changePasswordDialog.value = false;
        // 清理状态
        token.value = "";
        forgotFormRef.value.resetFields(); // 重置主表单
        // 跳转到登录页
        router.push("/login");
      } else {
        // 使用更友好的错误提示
        const errorMsg = data.msg || "密码修改失败！密码要求：至少8位，包含字母、数字、符号。";
        ElMessage.error(errorMsg);
      }
    })
    .catch((error) => {
      console.error("重置密码失败", error);
      ElMessage.error("网络请求失败，请稍后重试。");
    });
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* 优化：使用 min-height 确保页面内容不被挤压，并保留 margin */
  min-height: 400px;
  width: 100%;
  margin: 10vh auto; /* 调整上边距，使内容更居中 */
}

.forget-password {
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中标题和表单 */
  padding: 40px;
  border: 1px solid #dcdfe6; /* 使用 Element Plus 默认边框色 */
  border-radius: 8px; /* 添加圆角 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 添加阴影 */
  width: 480px; /* 保持宽度 */
  background-color: #ffffff;
}

h2 {
  margin-bottom: 30px;
  color: #303133;
}

/* 移除不必要的样式覆盖，使用 el-form-item 的默认行为 */
</style>