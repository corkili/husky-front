<template>
  <el-dropdown @command="handleCommand" trigger="click" class="user-item" v-if="isLogin">
    <span class="el-dropdown-link ">{{ username }}<i class="el-icon-s-custom el-icon--right"></i></span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="logout" icon="el-icon-switch-button">注销</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "HuskyHeader",
    methods: {
      handleCommand(command) {
        let _this = this;
        if (command === 'logout') {
          this.$store.dispatch('user/logout')
            .then((response => {
              console.log(response);
              if (response.code === 0) {
                this.$message({
                  message: '注销成功',
                  type: 'success'
                });
                _this.$store.commit('user/onLogout');
                _this.$router.replace('/sign_in');
              } else {
                this.$message({
                  message: response.uiMsg,
                  type: 'warning'
                });
              }
            }))
            .catch((error) => {
              console.log(error);
              this.$message({
                message: '注销成功',
                type: 'success'
              });
              _this.$store.commit('user/onLogout');
              _this.$router.replace('/sign_in');
            })
        }
      }
    },
    computed: {
      ...mapGetters('user', {
        username: 'getName',
        isLogin: 'isLogin'
      })
    }
  }
</script>

<style scoped>
  .user-item {
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
    float: right;
    line-height: 7vh;
  }

</style>