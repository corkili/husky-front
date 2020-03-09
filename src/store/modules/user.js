import api from '../../api/api'

const state = {
  id : -1,
  name: "",
  phone: "",
};

const getters = {
  getName(state) {
    return state.name;
  },
  getPhone(state) {
    return state.phone;
  },
  isLogin(state) {
    return state.id > 0;
  }
};

const mutations = {
  onLogin(state, { id, username, phone }) {
    state.id = id;
    state.name = username;
    state.phone = phone;
  },
  onLogout(state) {
    state.id = -1;
    state.name = "";
    state.phone = "";
  }
};

const actions = {
  async login(context, params) {
    return api.postJson('/api/user/login', params)
  },
  async logout(context) {
    let params = {
      id: context.state.id
    };
    return api.postJson('/api/user/logout', params)
  },
  async register(context, params) {
    return api.postJson('/api/user/register', params)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}