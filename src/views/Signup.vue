<template>
  <div class="login_div">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>注册</span>
      </div>
      <el-input v-model="registerParam.username" class="text item" prefix-icon="el-icon-phone" placeholder="请输入用户名" maxlength="11"></el-input>
      <el-input v-model="registerParam.phone" class="text item" prefix-icon="el-icon-phone" placeholder="请输入手机号" maxlength="11"></el-input>
      <el-input v-model="registerParam.password" class="text item" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
      <el-button type="primary" class="text item" :icon="icon" @click="register" :disabled="onRegister">{{ registerButtonText }}</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: () => {
    return {
      registerParam: {
        username: "",
        phone: "",
        password: "",
      },
      registerButtonText: "注册",
      icon: "el-icon-edit",
      onRegister: false
    }
  },
  methods: {
    changeState(onRegister) {
      if (onRegister) {
        this.registerButtonText = "注册中";
        this.icon = "el-icon-loading";
        this.onRegister = true
      } else {
        this.registerButtonText = "注册";
        this.icon = "el-icon-edit";
        this.onRegister = false
      }
    },
    register: function() {
      if (this.registerParam.username === '') {
        this.$message({
          message: '用户名不能为空',
          type: 'warning'
        });
        return
      }
      if (this.registerParam.phone === '') {
        this.$message({
          message: '手机号不能为空',
          type: 'warning'
        });
        return
      }
      if (this.registerParam.phone.length !== 11) {
        this.$message({
          message: '手机号长度应为11',
          type: 'warning'
        });
        return
      }
      if (this.registerParam.phone.password === '') {
        this.$message({
          message: '密码不能为空',
          type: 'warning'
        });
        return
      }
      this.changeState(true);
      let _this = this;
      this.$store.dispatch('user/register', this.registerParam)
        .then((response) => {
          if (response.code === 0) {
            this.$message({
              message: response.uiMsg,
              type: 'success'
            });
            _this.$router.replace('/sign_in')
          } else {
            this.$message({
              message: response.uiMsg,
              type: 'warning'
            })
          }
          this.changeState(false);
        })
        .catch((error) => {
          this.$message({
            message: '网络异常，请重试',
            type: 'warning'
          });
          this.changeState(false);
          console.log(error)
        })
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