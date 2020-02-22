import axiosConfig from '../../plugins/axiosConfig'

let axios = axiosConfig();

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
    return new Promise(function(resolve, reject) {
      axios.post('/api/user/login', params)
        .then((response) => {
          resolve(response)
        })
        .catch(function(error) {
          reject(error);
          console.log(error);
        });
    });
  },
  async logout(context) {
    return new Promise(function (resolve, reject) {
      let params = {
        id: context.state.id
      };
      axios.post('/api/user/logout', params)
        .then((response) => {
          resolve(response)
        })
        .catch(function (error) {
          reject(error);
          console.log(error);
        })
    })
  },
  async register(context, params) {
    return new Promise(function(resolve, reject) {
      axios.post('/api/user/register', params)
        .then((response) => {
          resolve(response)
        })
        .catch(function(error) {
          reject(error);
          console.log(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}