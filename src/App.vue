<template>
  <div id="app">
    <el-container>
      <el-aside width="auto"><HuskyAside/></el-aside>
      <el-container>
        <el-header><HuskyHeader/></el-header>
        <el-main><router-view/></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import HuskyAside from "./views/HuskyAside";
import HuskyHeader from "./views/HuskyHeader";
export default {
  name: 'app',
  components: {HuskyHeader, HuskyAside},
  created() {
    let curPath = this.$router.currentRoute.path;
    if (this.$store.getters['user/isLogin']) {
      if (curPath === '/sign_in' || curPath === '/sign_up') {
        this.$router.replace('/home')
      }
    } else {
      if (curPath !== '/sign_in' && curPath !== '/sign_up') {
        this.$router.replace('/sign_in')
      }
    }
  },
  updated() {
    let curPath = this.$router.currentRoute.path;
    if (this.$store.getters['user/isLogin']) {
      if (curPath === '/sign_in' || curPath === '/sign_up') {
        this.$router.replace('/home')
      }
    } else {
      if (curPath !== '/sign_in' && curPath !== '/sign_up') {
        this.$router.replace('/sign_in')
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}

.el-header, .el-footer {
  background-color: #409EFF;
  color: #333;
  height: 10vh;
}

.el-aside {
  background-color: #409EFF;
  color: #333;
  text-align: center;
  height: 100vh;
  padding-left: 10px;
  padding-right: 10px;
}

.el-main {
  background-color: #FFFFFF;
  color: #333;
  height: 90vh;
  text-align: center;
}

</style>
