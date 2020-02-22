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
  onLogin(state, { id, name, phone }) {
    state.id = id;
    state.name = name;
    state.phone = phone;
  },
  onLogout(state) {
    state.id = -1;
    state.name = "";
    state.phone = "";
  }
};

const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}