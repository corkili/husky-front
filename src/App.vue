<template>
  <div id="app">
    <el-container>
      <el-aside width="auto"><HuskyAside :current-route="currentRoute"/></el-aside>
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
  data: function() {
    return {
      currentRoute: ''
    }
  },
  created() {
    let curPath = this.$router.currentRoute.path;
    let urlPath = window.location.href;
    urlPath = urlPath.substring(0, urlPath.indexOf('?') > 0 ? urlPath.indexOf('?') : urlPath.length);
    urlPath = urlPath.substring(urlPath.indexOf('://') + 3);
    urlPath = urlPath.substring(urlPath.indexOf('/'));
    if (this.$store.getters['user/isLogin']) {
      if (curPath === '/sign_in' || curPath === '/sign_up' || curPath === '/') {
        if (urlPath === '/sign_in' || urlPath === '/sign_up' || urlPath === '/') {
          this.$router.replace('/home')
        } else {
          this.$router.replace(urlPath)
        }
      }
    } else {
      if (curPath !== '/sign_in' && curPath !== '/sign_up') {
        if (urlPath !== '/sign_in' && urlPath !== '/sign_up') {
          this.$router.replace('/sign_in')
        } else {
          this.$router.replace(urlPath)
        }
      }
    }
    this.currentRoute = this.$router.currentRoute.path.substring(1)
  },
  updated() {
    let curPath = this.$router.currentRoute.path;
    let urlPath = window.location.href;
    urlPath = urlPath.substring(0, urlPath.indexOf('?') > 0 ? urlPath.indexOf('?') : urlPath.length);
    urlPath = urlPath.substring(urlPath.indexOf('://') + 3);
    urlPath = urlPath.substring(urlPath.indexOf('/'));
    if (this.$store.getters['user/isLogin']) {
      if (curPath === '/sign_in' || curPath === '/sign_up' || curPath === '/') {
        if (urlPath === '/sign_in' || urlPath === '/sign_up' || urlPath === '/') {
          this.$router.replace('/home')
        } else {
          this.$router.replace(urlPath)
        }
      }
    } else {
      if (curPath !== '/sign_in' && curPath !== '/sign_up') {
        if (urlPath !== '/sign_in' && urlPath !== '/sign_up') {
          this.$router.replace('/sign_in')
        } else {
          this.$router.replace(urlPath)
        }
      }
    }
    this.currentRoute = this.$router.currentRoute.path.substring(1)
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
