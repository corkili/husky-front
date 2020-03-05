<template>
  <div class="account-book-main">
    <div class="operation-form">
      <div style="float: left">
        <el-tag effect="plain" type="primary">明账： {{ formatMoney(totalMoney) }}</el-tag>
        <el-tag effect="plain" type="info" style="margin-left: 10px">实账： {{ formatMoney(totalFutureMoney) }}</el-tag>
        <el-tag effect="plain" type="danger" style="margin-left: 10px">待还： {{ formatMoney(totalLoanMoney) }}</el-tag>
      </div>
      <el-button-group style="float: right">
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
      height="600"
      style="width: 100%" :default-sort="{prop:'datetime', order:'descending'}">
      <el-table-column type="expand" prop="datetime">
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
        label="账目时间" sortable :sort-method="sortByTime" :filters="dateFilters" :filter-method="dateFilterHandler">
        <template slot-scope="scope">
          <span>{{ scope.row.datetime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账目类型" :filters="typeFilters" :filter-method="typeFilterHandler">
        <template slot-scope="scope">
          <el-tag
            :type="getTagTypeOfAccountType(scope.row.type)"
            effect="dark"
            disable-transitions>{{ getAccountTypeValue(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="账目金额" sortable :sort-method="sortByMoney">
        <template slot-scope="scope">
          <span>{{ formatMoney(scope.row.money) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属账簿" :filters="accountBookFilters" :filter-method="accountBookFilterHandler">
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
      sortByTime(a, b) {
        if (a.datetime < b.datetime) {
          return -1;
        } else if (a.datetime > b.datetime) {
          return 1;
        } else {
          return 0;
        }
      },
      sortByMoney(a, b) {
        return a.money - b.money;
      },
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
        } else if (accountType === '贷款' || accountType.toLowerCase() === 'loan') {
          return 'danger'
        } else if (accountType === '还款' || accountType.toLowerCase() === 'repay_loan') {
          return 'primary'
        } else {
          return 'info'
        }
      },
      getAccountTypeValue(accountType) {
        if (accountType === '收入' || accountType.toLowerCase() === 'income') {
          return '收入'
        } else if (accountType === '支出' || accountType.toLowerCase() === 'expense') {
          return '支出'
        } else if (accountType === '贷款' || accountType.toLowerCase() === 'loan') {
          return '贷款'
        } else if (accountType === '还款' || accountType.toLowerCase() === 'repay_loan') {
          return '还款'
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
          str += this.formatMoney(data).replace(/,/g, '') + ' ' + data
        } else if (dataType === 'String' || dataType === 'Boolean') {
          str += data
        }
        return str
      },
      typeFilterHandler(value, row) {
        return value === row.type;
      },
      dateFilterHandler(value, row) {
        return row.datetime.startsWith(value);
      },
      accountBookFilterHandler(value, row) {
        let books = row.accountBooks;
        for (let i in books) {
          if (books[i].name === value) {
            return true;
          }
        }
        return false;
      }
    },
    computed: {
      accountBookFilters() {
        let arr = [];
        let accountData = this.accountData;
        for (let i in accountData) {
          let books = accountData[i].accountBooks;
            for (let j in books) {
            if (arr.indexOf(books[j].name) < 0) {
              arr.push(books[j].name)
            }
          }
        }
        let filters = [];
        for (let name of arr) {
          filters.push({
            text: name,
            value: name
          })
        }
        return filters;
      },
      dateFilters() {
        let dateArr = [];
        let accountData = this.accountData;
        for (let i in accountData) {
          let date = accountData[i].datetime.split(' ')[0];
          if (dateArr.indexOf(date) < 0) {
            dateArr.push(date)
          }
        }
        let filters = [];
        for (let date of dateArr) {
          filters.push({
            text: date,
            value: date
          })
        }
        return filters;
      },
      typeFilters() {
        return [{
          text: '收入',
          value: 'income'
        }, {
          text: '支出',
          value: 'expense'
        }, {
          text: '贷款',
          value: 'loan'
        }, {
          text: '还款',
          value: 'repay_loan'
        }]
      },
      accountTableData() {
        let _this = this;
        return this.accountData.filter(data => {
          if (this.search) {
            let dataStr = _this.generateSearchString(data).replace(/income/g, 'income 收入')
              .replace(/expense/g, 'expense 支出')
              .replace(/loan/g, 'loan 贷款')
              .replace(/repay_loan/g, 'repay_loan 还款')
            let searchStr = this.search.toLowerCase();
            return dataStr.toLowerCase().includes(searchStr)
          } else {
            return true
          }
        })
      },
      totalMoney() {
        let accountData = this.accountData;
        let total = 0;
        for (let i in accountData) {
          if (accountData[i].type === 'income') {
            total += accountData[i].money
          } else if (accountData[i].type === 'expense' || accountData[i].type === 'repay_loan') {
            total -= accountData[i].money
          }
        }
        return total;
      },
      totalFutureMoney() {
        let accountData = this.accountData;
        let total = 0;
        for (let i in accountData) {
          if (accountData[i].type === 'income') {
            total += accountData[i].money
          } else if (accountData[i].type === 'expense' || accountData[i].type === 'loan') {
            total -= accountData[i].money
          }
        }
        return total;
      },
      totalLoanMoney() {
        let accountData = this.accountData;
        let total = 0;
        for (let i in accountData) {
          if (accountData[i].type === 'repay_loan') {
            total -= accountData[i].money
          } else if (accountData[i].type === 'loan') {
            total += accountData[i].money
          }
        }
        return total;
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