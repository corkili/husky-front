<template>
  <div class="account-book-main">
    <div class="operation-form">
      <el-button-group>
        <el-button type="success" icon="el-icon-refresh" @click="refreshAccountData"
                   :disabled="onRefreshingAccount && onRefreshingAccountBook" round></el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleShowAccountEditor(-1)"
                   :disabled="onRefreshingAccount && onRefreshingAccountBook" round>新增账目</el-button>
      </el-button-group>
      <el-drawer
        :title="isCreatingAccount ? '新增账目' : '修改账目'"
        :visible.sync="editingAccount"
        direction="ltr"
        :show-close="false"
        @close="handleCloseAccountEditor"
        :wrapper-closable="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        ref="drawer">
        <AccountEditor :is-new="isCreatingAccount"
                       :is-show="editingAccount"
                       :account-data="editingAccountData"
                       :account-book-data="accountBookData"
                       @cancel="$refs.drawer.closeDrawer()"
                       @submit="handleSubmit"></AccountEditor>
      </el-drawer>
    </div>
    <el-table
      :data="accountTableData"
      v-loading="onRefreshingAccount"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="account-table-expand">
            <el-form-item label="账目时间">
              <span>{{ scope.row.datetime }}</span>
            </el-form-item>
            <el-form-item label="账目类型">
              <el-tag
                :type="getTagTypeOfAccountType(scope.row.type)"
                effect="dark"
                size="mini"
                disable-transitions>{{ getAccountTypeValue(scope.row.type) }}</el-tag>
            </el-form-item>
            <el-form-item label="账目金额">
              <span>{{ formatMoney(scope.row.money) }}</span>
            </el-form-item>
            <el-form-item label="所属账簿">
              <el-popover v-for="accountBook in scope.row.accountBooks"
                          :key="accountBook.id"
                          placement="right-start"
                          width="200"
                          trigger="hover"
                          :content="accountBook.description">
                <el-tag type="primary"
                        effect="plain"
                        slot="reference"
                        disable-transitions>{{ accountBook.name }}</el-tag>
              </el-popover>
            </el-form-item>
            <el-form-item label="账目描述">
              <span>{{ scope.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="账目时间">
        <template slot-scope="scope">
          <span>{{ scope.row.datetime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账目类型">
        <template slot-scope="scope">
          <el-tag
            :type="getTagTypeOfAccountType(scope.row.type)"
            effect="dark"
            disable-transitions>{{ getAccountTypeValue(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="账目金额">
        <template slot-scope="scope">
          <span>{{ formatMoney(scope.row.money) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属账簿">
        <template slot-scope="scope">
          <el-popover v-for="accountBook in scope.row.accountBooks"
                      :key="accountBook.id"
                      placement="right-start"
                      width="200"
                      trigger="hover"
                      :content="accountBook.description">
            <el-tag type="primary"
                    effect="plain"
                    slot="reference"
                    disable-transitions>{{ accountBook.name }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="账目简述">
        <template slot-scope="scope">
          <span>{{ simplifyDescription(scope.row.description) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right">
        <!--eslint-disable-next-line vue/no-unused-vars-->
        <template slot="header" slot-scope="scope">
          <el-input type="text" v-model="search" size="mini" prefix-icon="el-icon-search" placeholder="输入关键字搜索"/>
        </template>
        <!--eslint-disable-next-line vue/no-unused-vars-->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleShowAccountEditor(scope.row.id)" circle></el-button>
          <el-popconfirm
            confirmButtonText='确认'
            cancelButtonText='取消'
            icon="el-icon-info"
            iconColor="red"
            title="确定删除改账目吗？"
            @onConfirm="handleDelete([scope.row.id])">
            <el-button type="danger"
                       icon="el-icon-delete"
                       slot="reference"
                       style="margin-left: 10px"
                       circle></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import accountBookApi from "../api/account_book";

  import AccountEditor from "./AccountEditor";
  export default {
    components: {AccountEditor},
    data() {
      return {
        // accountData: [{
        //   id: 1,
        //   datetime: '2020/02/09 19:01:00',
        //   type: 'expense',
        //   money: 199.2,
        //   description: '猫罐头，猫粮',
        //   accountBooks: [{
        //     id: 1,
        //     name: '现金',
        //     description: '现金账簿'
        //   }]
        // }, {
        //   id: 2,
        //   datetime: '2020/02/05 18:00:00',
        //   type: 'income',
        //   money: 13575.145,
        //   description: '工资',
        //   accountBooks: [{
        //     id: 2,
        //     name: '数字',
        //     description: '非现金、数字化账簿，包含银行、微信账户等'
        //   }]
        // }],
        // accountBookData: [{
        //   id: 1,
        //   name: '现金',
        //   description: '现金账簿'
        // }, {
        //   id: 2,
        //   name: '数字',
        //   description: '非现金、数字化账簿，包含银行、微信账户等'
        // }],
        accountData: [],
        accountBookData: [],
        search: '',
        onRefreshingAccount: false,
        onRefreshingAccountBook: false,
        isCreatingAccount: true,
        editingAccount: false,
        editingAccountData: {}
      }
    },
    methods: {
      refreshAccountData() {
        this.onRefreshingAccount = true;
        let _this = this;
        accountBookApi.retrieveAccount({all: true})
          .then((response => {
            if (response.code === 0) {
              _this.accountData = response.data.accounts;
              console.log(response.data.accounts)
            } else {
              this.$message({
                type: 'warning',
                message: response.uiMsg
              });
            }
            _this.onRefreshingAccount = false;
            _this.refreshAccountBookData();
          }))
          .catch((error) => {
            this.$message({
              message: '网络异常，请重试',
              type: 'warning'
            });
            console.log(error);
            _this.onRefreshingAccount = false;
          });
      },
      refreshAccountBookData() {
        this.onRefreshingAccountBook = true;
        let _this = this;
        accountBookApi.retrieveAccountBook({all: true})
          .then((response => {
            if (response.code === 0) {
              _this.accountBookData = response.data.accountBooks;
            } else {
              this.$message({
                type: 'warning',
                message: response.uiMsg
              });
            }
            _this.onRefreshingAccountBook = false;
          }))
          .catch((error) => {
            this.$message({
              message: '网络异常，请重试',
              type: 'warning'
            });
            console.log(error);
            _this.onRefreshingAccountBook = false;
          });
      },
      getTagTypeOfAccountType(accountType) {
        if (accountType === '收入' || accountType.toLowerCase() === 'income') {
          return 'success'
        } else if (accountType === '支出' || accountType.toLowerCase() === 'expense') {
          return 'warning'
        } else {
          return 'info'
        }
      },
      getAccountTypeValue(accountType) {
        if (accountType === '收入' || accountType.toLowerCase() === 'income') {
          return '收入'
        } else if (accountType === '支出' || accountType.toLowerCase() === 'expense') {
          return '支出'
        } else {
          return '未知'
        }
      },
      formatMoney(money) {
        return '￥' + money.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
      },
      simplifyDescription(desc) {
        if (desc.length > 4) {
          return desc.substring(0, 4) + '...'
        } else {
          return desc
        }
      },
      handleSubmit(data) {
        this.removeAccountDataById(data.id);
        this.accountData.push(data);
        this.$refs.drawer.closeDrawer()
      },
      removeAccountDataById(id) {
        for(let i = 0; i < this.accountData.length; i++) {
          if(this.accountData[i].id === id) {
            this.accountData.splice(i, 1);
            break;
          }
        }
      },
      handleDelete(ids) {
        let _this = this;
        accountBookApi.deleteAccount({ids: ids})
          .then((response => {
            if (response.code === 0) {
              let successIds = response.data.successIds;
              if (successIds.length > 0) {
                for (let i in successIds) {
                  let id = successIds[i];
                  _this.removeAccountDataById(id);
                }
                this.$message({
                  type: 'success',
                  message: '删除账目成功'
                });
              } else {
                this.$message({
                  type: 'success',
                  message: '无法删除账目，请重试'
                });
              }
            } else {
              this.$message({
                type: 'warning',
                message: response.uiMsg
              });
            }
            _this.onRefreshingAccount = false;
            _this.refreshAccountBookData();
          }))
          .catch((error) => {
            this.$message({
              message: '网络异常，请重试',
              type: 'warning'
            });
            console.log(error);
            _this.onRefreshingAccount = false;
          });
      },
      handleShowAccountEditor(id) {
        if (id > 0) {
          this.isCreatingAccount = false;
          for (let index in this.accountData) {
            if (this.accountData[index].id === id) {
              this.editingAccountData = this.accountData[index];
              this.editingAccount = true;
              return
            }
          }
          this.$message({
            type: 'error',
            message: '无法编辑该账目，请刷新后重试'
          })
        } else {
          this.isCreatingAccount = true;
          this.editingAccount = true;
        }
      },
      handleCloseAccountEditor() {
        this.editingAccount = false;
      },
      getDataType(data) {
        let dataType = Object.prototype.toString.call(data);
        dataType = dataType.substring(dataType.indexOf(' ') + 1, dataType.indexOf(']'));
        return dataType
      },
      generateSearchString(data) {
        let dataType = this.getDataType(data);
        let str = '';
        if (dataType === 'Object') {
          for (let key in data) {
            str += ' ' + this.generateSearchString(data[key]);
          }
        } else if (dataType === 'Array') {
          for (let index in data) {
            str += ' ' + this.generateSearchString(data[index])
          }
        } else if (dataType === 'Number') {
          str += this.formatMoney(data).replace(/,/, '') + ' ' + data
        } else if (dataType === 'String' || dataType === 'Boolean') {
          str += data
        }
        return str
      }
    },
    computed: {
      accountTableData() {
        let _this = this;
        return this.accountData.filter(data => {
          if (this.search) {
            let dataStr = _this.generateSearchString(data).replace(/income/, 'income 收入')
              .replace(/expense/, 'expense 支出');
            let searchStr = this.search.toLowerCase();
            return dataStr.toLowerCase().includes(searchStr)
          } else {
            return true
          }
        })
      }
    },
    created() {
      this.refreshAccountData();
    }
  }
</script>

<style scoped>
  .account-book-main {
    text-align: left;
    margin-left: 10px;
    margin-right: 10px;
  }
  .operation-form {

  }
  .account-table-expand {
    font-size: 0;
  }
  .account-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .account-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>