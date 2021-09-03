<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <img class="logo" src="@/assets/images/logIn/logo_index.png"></img>
      </div>

      <!-- prop 要与 data 中的字段名一致 -->
      <el-form class="login-form" ref="login-form" :model="user" :rules="formRules">
      <el-form-item  prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>

      <el-form-item prop='agree'>
          <el-checkbox v-model="user.agree">我已阅读用户协议和隐私条款</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button class="login-btn" type="primary" @click="onLogin" :loading="loginLoading">登录</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

import { logInApi } from "@/api/user";

export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "",
        code: "",
        agree: false,
      },
      // checked: false,
      loginLoading: false,
      formRules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "change" },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的号码格式",
            trigger: "change",
          },
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
          {
            pattern: /^\d{6}$/,
            message: "请输入正确得到验证码格式",
            // trigger默认为change
          },
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) callback();
              else callback(new Error("请同意用户协议"));
            },
          },
        ],
      },
    };
  },
  methods: {
    onLogin() {
      // 表单验证
      this.$refs["login-form"].validate((valid) => {
        // 如果表单验证失败，停止请求提交
        // 验证通过，请求登录
        if (valid) this.log_in();
      });
    },

    log_in() {
      // 获取表单数据
      const user = this.user;

      // 开启登录loading
      this.loginLoading = true;

      logInApi(this.user)
        .then((res) => {
          console.log(res);
          this.$message({
            message: "登录成功",
            type: "success",
          });

          // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
          // 本地存储只能存储字符串
          // 如果需要存储对象、数组类型的数据，则把他们转为 JSON 格式字符串进行存储
          window.localStorage.setItem("user", JSON.stringify(res.data.data));

          this.loginLoading = false;
          // 跳转到首页
          // this.$router.push('/home')
          this.$router.push({
            name: "home",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "登录失败，手机号或验证码错误",
            type: "error",
          });
          this.loginLoading = false;
        });
    },
  },
};
</script>

<style lang='less' scoped>
.login-container {
  display: flex;
  // flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/logIn/login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 60%;
        margin-bottom: 20px;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>




