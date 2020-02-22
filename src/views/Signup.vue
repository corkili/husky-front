<template>
  <div class="login_div">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>登录</span>
      </div>
      <el-input v-model="phone" class="text item" prefix-icon="el-icon-phone" placeholder="请输入手机号" maxlength="11"></el-input>
      <el-input v-model="password" class="text item" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
      <el-button type="primary" class="text item" :icon="icon" @click="login" :disabled="onLogin">{{ loginButtonText }}</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: () => {
    return {
      phone: "",
      password: "",
      loginButtonText: "登录",
      icon: "el-icon-position",
      onLogin: false
    }
  },
  methods: {
    login: function() {
      this.loginButtonText = "";
      this.icon = "el-icon-loading";
      this.onLogin = true
    }
  }
}
</script>

<style scoped>
  .login_div {
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 10px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    width: 400px;
  }
</style>