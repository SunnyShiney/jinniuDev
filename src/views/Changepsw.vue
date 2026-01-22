<template>
  <div class="login-container">
    <div class="login-header">
      <div class="login-header-title">成都市金牛区综合行政执法局</div>
    </div>
    <div class="login-box">
      <img class="login-box-logo" alt="" src="@/assets/login/login-logo.png" />
      <div class="login-box-title">城市管家</div>
      <input
        v-model="params.username"
        class="username-input"
        type="text"
        placeholder="请输入用户名"
      />
      <input
        v-model="params.password"
        class="password-input"
        type="password"
        placeholder="请输入新密码"
      />
     <input
        v-model="confirmPassword"
        class="password-input1"
        type="password"
        placeholder="再次输入新密码"
      />
      <el-button class="login-btn" type="primary" color="#0B9ED9" @click="login"
        >确认重设密码</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ElButton } from "element-plus";
import router from "@/router";
import { ref, onMounted, reactive, h } from "vue";
import { ElMessage, ElDialog, tabBarProps } from "element-plus";
import { params } from "@/store/store.js";
import { getLogin } from "@/api/home.js";
import axios from "axios";
import { Base64 } from 'js-base64';

const confirmPassword = ref("");

onMounted(() => {
  params.password = "";
  if (localStorage.getItem("username"))
    params.username = localStorage.getItem("username");
});
const rememberUser = ref(false);
const changeRememberUser = () => {
  rememberUser.value = !rememberUser.value;
  console.log(rememberUser.value);
};
const login = () => {
  let passwordBase64 = Base64.encode(params.password);

  var user = {
    name: params.username,
    password: params.password,
    };
    if (params.password != confirmPassword.value) {
        params.password = "";
        confirmPassword.value = "";
        ElMessage({
          message: h("p", null, [
            h("span", null, "两次输入的密码不一致！"),
          ]),
          type: "error",
        });
    } else {
      getLogin(user).then((data) => {

      if (data.isValidPassword == "false") {
        ElMessage({
          message: h("p", null, [
            h("span", null, "密码的组成至少8位以上，要包含字母、数字、符号，例如：w-765223"),
          ]),
          type: "error",
        });
        // router.push("/changepsw");
      } else {
        axios({
            url: "/api/auth/change_password",
            method: "post",
            headers: {
              Authorization: "Bearer" + params.token,
              "Content-Type": " application/json",
            },
            data:  params.password,
          }).then((res) => {
            if (res.data) {
              ElMessage({
                type: "success",
                message: "修改密码成功！",
              });
              localStorage.setItem("password", "");
              router.push("/login");
            } else {
              ElMessage({
                type: "error",
                message: "密码的组成至少8位以上，要包含字母、数字、符号，例如：w-765223！",
              });
            }
          });
      }
   
  });
  }

  // if (params.username == '18380195019' || params.username == '13908173345') {
  //   if (params.username == '18380195019') {
  //   }
  //   else (params.username == '13908173345')
  //   {
  //   }
  //   if (passwordBase64 == Base64.encode('jinniu')) {
  //     router.push({ name: "home" }); localStorage.setItem("username", params.username)
  //     localStorage.setItem("password", params.password)
  //   }

  //   else {
  //     ElMessage({
  //       message: h('p', null, [
  //         h('span', null, '用户名或者密码错误！'),
  //       ]),
  //       type: 'error'
  //     })
  //   }
  // }

  // else {
  //   ElMessage({
  //     message: h('p', null, [
  //       h('span', null, '用户名或者密码错误！'),
  //     ]),
  //     type: 'error'
  //   })
  // }
};
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  /* background-image: url("@/assets/login/login-background.png"); */
  background-image: url("@/assets/login/bg.jpg");
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

.username-input {
  width: 18.7vw;
  height: 1.8vh;
  position: absolute;
  top: 20.4vh;
  left: 7.1vw;
  background: rgba(62, 181, 228, 0.25);
  border: 1px solid #22aee6;
  outline: none;
  color: #ffffff;
  font-size: 1rem;
  background-image: url("@/assets/login/username.png");
  background-repeat: no-repeat;
  background-position: left 0.8vw top 1.3vh;
  padding-left: 2.1vw;
  padding-top: 1.3vh;
  padding-bottom: 1.3vh;
}

.username-input::-webkit-input-placeholder {
  color: #ffffff;
  font-size: 1rem;
}

.password-input {
  width: 18.7vw;
  height: 1.8vh;
  position: absolute;
  top: 27vh;
  left: 7.1vw;
  background: rgba(62, 181, 228, 0.25);
  border: 1px solid #22aee6;
  outline: none;
  color: #ffffff;
  font-size: 1rem;

  background-image: url("@/assets/login/password.png");
  background-repeat: no-repeat;
  background-position: left 0.8vw top 1.3vh;
  padding-left: 2.1vw;
  padding-top: 1.3vh;
  padding-bottom: 1.3vh;
}

.password-input::-webkit-input-placeholder {
  color: #ffffff;
  font-size: 1rem;
}

.password-input1 {
  width: 18.7vw;
  height: 1.8vh;
  position: absolute;
  top: 33.5vh;
  left: 7.1vw;
  background: rgba(62, 181, 228, 0.25);
  border: 1px solid #22aee6;
  outline: none;
  color: #ffffff;
  font-size: 1rem;

  background-image: url("@/assets/login/password.png");
  background-repeat: no-repeat;
  background-position: left 0.8vw top 1.3vh;
  padding-left: 2.1vw;
  padding-top: 1.3vh;
  padding-bottom: 1.3vh;
}

.password-input1::-webkit-input-placeholder {
  color: #ffffff;
  font-size: 1rem;
}

input[type="checkbox"] {
  width: 0.7vw;
  height: 1.3vh;
  position: absolute;
  top: 32.9vh;
  left: 7.1vw;
  background: rgba(62, 181, 228, 0.25) !important;
  border: 1px solid #22aee6 !important;
}

input[type="checkbox"]::after {
  width: 0.7vw;
  height: 1.3vh;
  position: absolute;
  top: 32.9vh;
  left: 7.1vw;
  background: rgba(62, 181, 228, 0.25) !important;
  border: 1px solid #22aee6;
}



.login-btn {
  width: 20.8vw;
  height: 4.4vh;
  position: absolute;
  top: 40vh;
  left: 7.1vw;
  font-size: 0.875rem;
}
</style>
