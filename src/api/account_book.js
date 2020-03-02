import api from './api'

export default {
  createAccount(params) {
    return api.postJson('/api/account_book/create_account', params);
  },
  updateAccount(params) {
    return api.postJson('/api/account_book/update_account', params);
  },
  retrieveAccount(params) {
    return api.postJson('api/account_book/retrieve_account', params);
  },
  retrieveAccountBook(params) {
    return api.postJson('api/account_book/retrieve_account_book', params);
  },
  deleteAccount(params) {
    return api.postJson('api/account_book/delete_account', params);
  },
}