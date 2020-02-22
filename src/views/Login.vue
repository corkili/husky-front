<template>
  <div class="login_div">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>登录</span>
      </div>
      <el-input v-model="loginParam.phone" class="text item" prefix-icon="el-icon-phone" placeholder="请输入手机号" maxlength="11"></el-input>
      <el-input v-model="loginParam.password" class="text item" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
      <el-button type="primary" class="text item" :icon="icon" @click="login" :disabled="onLogin">{{ loginButtonText }}</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => {
    return {
      loginParam: {
        phone: '',
        password: ''
      },
      loginButtonText: '登录',
      icon: 'el-icon-position',
      onLogin: false
    }
  },
  methods: {
    changeState: function(onLogin) {
      if (onLogin) {
        this.loginButtonText = '登录中';
        this.icon = 'el-icon-loading';
        this.onLogin = true;
      } else {
        this.loginButtonText = '登录';
        this.icon = 'el-icon-position';
        this.onLogin = false;
      }
    },
    login: function() {
      if (this.loginParam.phone === '') {
        this.$message({
          message: '手机号不能为空',
          type: 'warning'
        });
        return
      }
      if (this.loginParam.phone.length !== 11) {
        this.$message({
          message: '手机号长度应为11',
          type: 'warning'
        });
        return
      }
      if (this.loginParam.phone.password === '') {
        this.$message({
          message: '密码不能为空',
          type: 'warning'
        });
        return
      }
      this.changeState(true);
      let _this = this;
      this.$store.dispatch('user/login', this.loginParam)
        .then((response) => {
          if (response.code === 0) {
            this.$message({
              message: response.uiMsg,
              type: 'success'
            });
            _this.$store.commit('user/onLogin', response.data);
            _this.$router.replace('/home')
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