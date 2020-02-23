import axiosConfig from '../plugins/axiosConfig'
import store from '../store'
import router from '../router'

let axios = axiosConfig();

export default {
  postJson: function (url, params) {
    return new Promise(function(resolve, reject) {
      axios.post(url, params)
        .then((response) => {
          if (response.code === 2001001) {
            store.commit('user/onLogout');
            router.replace('/sign_in');
          }
          resolve(response)
        })
        .catch(function(error) {
          reject(error);
          console.log(error);
        });
    });
  }
}