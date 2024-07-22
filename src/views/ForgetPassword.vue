<template>
  <div class="container">
    <div class="forget-password">
      <h2>忘记密码</h2>
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="电话号码">
          <el-row>
            <el-col :span="16">
              <el-input
                v-model.number="phoneNumber"
                placeholder="请输入电话号码"
              ></el-input>
            </el-col>
            <el-col :span="8">
              <!-- Update the button label based on countdown -->
              <el-button
                :disabled="countdown > 0 && !phoneNumberChanged"
                @click="sendVerificationCode"
                type="primary"
              >
                {{ countdown > 0 && !phoneNumberChanged? countdown + "秒后重新发送" : "发送验证码" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input
            v-model="verificationCode"
            placeholder="请输入验证码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="confirm" type="primary">确认</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        v-model="changePasswordDialog"
        title="修改密码"
        align-center=true
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
    </div>
  </div>
</template>

<script setup>
import { ref, h, reactive, watch } from "vue";
import { params } from "@/store/store.js";
import { sendSMS, validateSMS, resetPasswordSMS } from "@/api/home.js";
import { ElMessage, ElDialog, tabBarProps, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const phoneNumber = ref("");
const phoneNumberChanged = ref(false);
const token = ref("");
const verificationCode = ref("");
const countdown = ref(0); 
const changePasswordDialog = ref(false);
const form = reactive({
  new_password: "",
  new_password_confirm: "",
});

watch(phoneNumber, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    phoneNumberChanged.value = true;
  }
});

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
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码！"));
  } else if (value !== form.new_password) {
    callback(new Error("两次密码不相同！"));
  } else {
    callback();
  }
};
const rules = reactive({
  new_password: [{ validator: validatePass, trigger: "blur" }],
  new_password_confirm: [{ validator: validatePass2, trigger: "blur" }],
});
const ruleFormRef = ref(null);



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
          var params = {
            phone: phoneNumber.value,
            token: token.value,
            password: form.new_password
          };  
          resetPassword(params);
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

const sendVerificationCode = () => {
  if (countdown.value <= 0) {
    // Start the countdown at 60 seconds
    countdown.value = 60;
    const interval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    // Implement your logic to send verification code
    sendSMS(phoneNumber.value).then((data) => {
      console.log("sendVerificationCode: ", data);
      if (data.status == true) {
        console.log("发送成功");
        phoneNumberChanged.value = false;
      } else {
        console.log("发送失败");
        ElMessage({
          message: h("p", null, [h("span", null, data.msg)]),
          type: "error",
        });
        countdown.value = 1;
      }
    });
  }
};

const confirm = () => {
  // Implement your logic for confirmation
  validateSMS(phoneNumber.value, verificationCode.value).then((data) => {
    console.log("validateSMS", data);
    if (data.isValid == true) {
      console.log("验证成功");
      token.value = data.token;
      changePasswordDialog.value = true;
    } else {
      console.log("验证失败");
      ElMessage({
        message: h("p", null, [h("span", null, data.msg)]),
        type: "error",
      });
    }
  });
};

const resetPassword = (params) => {
  resetPasswordSMS(params).then((data) => {
    console.log("resetPasswordSMS", data);
    if (data.isChanged == true) {
      console.log("重置成功");
      ElMessage({
        message: h("p", null, [h("span", null, data.msg)]),
        type: "success",
      });
      token.value = "";
      router.push("/login");
    } else {
      console.log("重置失败");
      ElMessage({
        message: h("p", null, [h("span", null, "密码的组成至少8位以上，要包含字母、数字、符号，例如：w-765223！")]),
        type: "error",
      });
    }
  });
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh; /* Adjust the height to your desired value */
  width: 480px;
  border: 1px solid black;
  margin: 20vh auto;
}

.forget-password {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
}

.el-form-item__label {
  width: 100px;
}
</style>
