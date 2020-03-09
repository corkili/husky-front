<template>
  <div class="husky-aside">
    <div style="margin-bottom: 5px; margin-top: 5px;">
      <el-button type="primary" @click="isCollapse = true" v-if="!isCollapse" class="logo">助手小哈</el-button>
      <el-button type="primary" @click="isCollapse = false" v-if="isCollapse" class="el-icon-s-operation logo"></el-button>
    </div>
    <el-menu :default-active="currentRoute" class="husky-nav-menu"
             :collapse="isCollapse" router="router" v-if="isLogin">
      <el-menu-item index="home">
        <i class="el-icon-setting"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="finance">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span slot="title">财务</span>
        </template>
        <el-menu-item index="account_book">账簿</el-menu-item>
        <el-menu-item index="salary" disabled>薪酬</el-menu-item>
      </el-submenu>
      <el-menu-item index="setting" disabled>
        <i class="el-icon-setting"></i>
        <span slot="title">设置</span>
      </el-menu-item>
    </el-menu>
    <el-menu :default-active="currentRoute" class="husky-nav-menu"
             :collapse="isCollapse" router="router" v-if="!isLogin">
      <el-menu-item index="sign_in">
        <i class="el-icon-position"></i>
        <span slot="title">登录</span>
      </el-menu-item>
      <el-menu-item index="sign_up">
        <i class="el-icon-edit-outline"></i>
        <span slot="title">注册</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "Aside",
  props: ['currentRoute'],
  data: () => {
    return {
      isCollapse: false,
    }
  },
  computed: {
    ...mapGetters('user', {
      isLogin: 'isLogin'
    })
  }
}
</script>

<style scoped>
  .husky-nav-menu:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
  }
  .husky-nav-menu {
    margin-left: 10px;
    margin-right: 10px;
  }
  .logo {
    font-size: 25px;
    color: #FFFFFF;
    font-weight: 800;
  }
  .el-button+.el-button {
    margin-left: 0;
  }
</style>