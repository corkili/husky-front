<template>
  <div class="account-editor-main">
    <el-form :model="form">
      <el-form-item label="所属账簿" :label-width="formLabelWidth">
        <el-select
          v-model="form.accountBooks"
          multiple
          filterable
          allow-create
          default-first-option
          @change="handleSelectAccountBooks"
          placeholder="请选择所属账簿">
          <el-option
            v-for="item in allAccountBooks"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账目时间" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.datetime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="账目类型" :label-width="formLabelWidth">
        <el-radio-group v-model="form.type">
          <el-radio-button label="expense" border size="medium">支出</el-radio-button>
          <el-radio-button label="income" border size="medium">收入</el-radio-button>
          <el-radio-button label="loan" border size="medium">贷款</el-radio-button>
          <el-radio-button label="repay_loan" border size="medium">还款</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账目金额" :label-width="formLabelWidth">
        <el-input-number v-model="form.money" :precision="2" :step="0.1" :min="0" :controls="false"></el-input-number>
      </el-form-item>
      <el-form-item label="账目描述" :label-width="formLabelWidth">
        <el-input v-model="form.description" type="textarea" autosize></el-input>
      </el-form-item>
    </el-form>
    <div class="account-editor-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
  import accountBookApi from "../api/account_book";

  export default {
    name: "AccountEditor",
    props: {
      isNew: {
        type: Boolean,
        default: true
      },
      accountData: {
        type: Object,
        default: function () {
          return {
            id: '',
            datetime: '',
            type: '',
            money: 0,
            description: '',
            accountBooks: []
          }
        }
      },
      accountBookData: {
        type: Array,
        required: true
      },
      isShow: {
        type: Boolean,
        required: true
      }
    },
    data: function () {
      return {
        form: {
          id: 0,
          datetime: '',
          type: 'expense',
          money: 0,
          description: '',
          accountBooks: [],
          lastSelectAccountBooks: []
        },
        allAccountBooks: [],
        formLabelWidth: '80px',
        onSubmit: false
      }
    },
    methods: {
      init() {
        if (this.isNew) {
          this.form = {
            id: 0,
            datetime: '',
            type: 'expense',
            money: 0,
            description: '',
            accountBooks: [],
            lastSelectAccountBooks: []
          };
          this.initAccountBookData();
        } else {
          this.form.id = this.accountData.id;
          this.form.datetime = this.accountData.datetime;
          this.form.type = this.accountData.type;
          this.form.money = this.accountData.money;
          this.form.description = this.accountData.description;
          let accountBooks = [];
          for (let i in this.accountData.accountBooks) {
            accountBooks.push(this.accountData.accountBooks[i].name)
          }
          this.form.accountBooks = accountBooks;
          this.form.lastSelectAccountBooks = accountBooks;
          this.initAccountBookData();
        }
      },
      initAccountBookData() {
        this.allAccountBooks = JSON.parse(JSON.stringify(this.accountBookData))
      },
      handleSubmit() {
        let params = {};
        params.id = this.form.id;
        if (this.form.datetime.trim() === '') {
          this.$message({
            type: 'error',
            message: '请选择账目时间'
          });
          return
        }
        params.datetime = this.form.datetime.trim();

        if (this.form.type === '') {
          this.$message({
            type: 'error',
            message: '请选择账目类型'
          });
          return;
        }
        params.type = this.form.type;

        if (this.form.money < 0) {
          this.$message({
            type: 'error',
            message: '账目金额必须大于或等于0'
          });
          return;
        }
        params.money = this.form.money;

        if (this.form.description.trim() === '') {
          this.$message({
            type: 'error',
            message: '请输入账目描述'
          });
          return;
        }
        params.description = this.form.description;

        if (this.form.accountBooks.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择或创建所属账簿'
          });
          return
        }
        params.accountBooks = [];
        for (let i in this.form.accountBooks) {
          let accountBook = this.getAccountBookByName(this.form.accountBooks[i]);
          if (accountBook != null) {
            params.accountBooks.push(accountBook)
          }
        }

        this.onSubmit = true;

        console.log(params);

        let promise;
        if (this.isNew) {
          promise = accountBookApi.createAccount(params);
        } else {
          promise = accountBookApi.updateAccount(params);
        }

        let _this = this;
        promise
          .then((response => {
            this.onSubmit = false;
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: _this.isNew ? '新增账目成功' : '修改账目成功'
              });
              this.$emit('submit', response.data)
              console.log(response.data);
            } else {
              this.$message({
                type: 'warning',
                message: response.uiMsg
              });
            }
          }))
          .catch((error) => {
            this.$message({
              message: '网络异常，请重试',
              type: 'warning'
            });
            console.log(error)
            this.onSubmit = false;
          })
      },
      handleCancel() {
        this.$emit('cancel')
      },
      checkIfAccountBookExist(accountBookName) {
        for (let index in this.allAccountBooks) {
          if (this.allAccountBooks[index].name === accountBookName) {
            return true;
          }
        }
        return false;
      },
      getAccountBookByName(accountBookName) {
        for (let index in this.allAccountBooks) {
          if (this.allAccountBooks[index].name === accountBookName) {
            return this.allAccountBooks[index];
          }
        }
        return null;
      },
      findDiffSelectedAccountBook(first, second) {
        let more = first;
        let less = second;
        if (first.length < second.length) {
          more = second;
          less = first;
        }
        for (let index in more) {
          if (less.indexOf(more[index]) === -1) {
            return more[index]
          }
        }
        return null
      },
      removeAccountBookFromSelector(arr, val) {
        for(let i = 0; i < arr.length; i++) {
          if(arr[i] === val) {
            arr.splice(i, 1);
            break;
          }
        }
      },
      handleSelectAccountBooks(value) {
        let lastSelectAccountBooks = this.form.lastSelectAccountBooks;
        let diff = this.findDiffSelectedAccountBook(lastSelectAccountBooks, value);
        if (lastSelectAccountBooks.length < value.length) {
          // 增加了选项
          let exist = this.checkIfAccountBookExist(diff);
          if (!exist) {
            let _this = this;
            this.$prompt('请输入账簿描述', '新建账簿-[' + diff + ']', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^.+$/,
              inputErrorMessage: '账簿描述不能为空'
            }).then(({ value }) => {
              _this.allAccountBooks.push({
                id: 0,
                name: diff,
                description: value
              });
              this.form.lastSelectAccountBooks = _this.form.accountBooks;
              this.$message({
                type: 'success',
                message: '新建账簿: ' + diff
              });
            }).catch(() => {
              _this.removeAccountBookFromSelector(_this.form.accountBooks, diff);
              this.form.lastSelectAccountBooks = _this.form.accountBooks;
              this.$message({
                type: 'info',
                message: '取消新建账簿'
              });
            });
          } else {
            this.form.lastSelectAccountBooks = this.form.accountBooks;
          }
        } else if (lastSelectAccountBooks.length > value.length) {
          // 减少了选项
          for (let i = 0; i < this.allAccountBooks.length; i++) {
            if (this.allAccountBooks[i].name === diff) {
              if (this.allAccountBooks[i].id <= 0) {
                this.allAccountBooks.splice(i, 1);
              }
              break;
            }
          }
          this.form.lastSelectAccountBooks = value;
        }
      }
    },
    watch: {
      isNew: {
        immediate: true,
        handler: function () {
          this.init()
        }
      },
      accountData: {
        immediate: true,
        handler: function () {
          this.init()
        }
      },
      accountBookData: {
        immediate: true,
        handler: function () {
          this.initAccountBookData();
        }
      },
      isShow: {
        immediate: true,
        handler: function () {
          console.log('isShow: ' + this.isShow);
          if (this.isShow) {
            this.init()
          }
        }
      }
    }
  }
</script>

<style scoped>
  .account-editor-main {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
  }
  .account-editor-main form {
    flex: 1;
  }
  .account-editor-footer {
    display: flex;
  }
  .account-editor-footer button {
    flex: 1;
  }
</style>